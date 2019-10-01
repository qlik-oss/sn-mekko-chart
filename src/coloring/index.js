import { removeRole, findFields } from '../roles/roles';

import { setByDimension, getByDimensionSettings } from './byDimension';

const DIMENSION_RX = /(qDimensions|qDimensionInfo)\/\d+(\/(qAttributeDimensions|qAttrDimInfo)\/\d+)?$/;
const MEASURE_RX = /(qMeasures|qMeasureInfo)\/\d+(\/(qAttributeExpressions|qAttrExprInfo)\/\d+)?$/;

/**
 * @typedef {object}
 */
export const legendConfig = {
  /** @type {boolean|'auto'} */
  show: 'auto',
  /** @type {boolean} */
  showTitle: true,
};

function getFieldType(path) {
  if (DIMENSION_RX.test(path)) {
    return 'dimension';
  }
  if (MEASURE_RX.test(path)) {
    return 'measure';
  }
  return undefined;
}

function setByAuto(properties) {
  properties.cellColor.mode = 'auto';
}

export default function coloring({ properties, layout, theme }) {
  return {
    update() {
      if (!properties || !properties.qHyperCubeDef) {
        return;
      }
      // verify that the current settings are valid
      const hc = properties.qHyperCubeDef;
      const colorByField = findFields(f => f.roles && f.roles.filter(r => r.role === 'color').length > 0, hc)[0];

      const { mode } = properties.cellColor;

      if (mode === 'auto' && colorByField) {
        this.colorBy({ mode: 'auto' }, false);
      } else if (mode === 'byDimension') {
        const config = properties.cellColor.byDimension || {};
        this.colorBy({ mode: 'byDimension', modeConfig: config }, true);
      }
    },
    colorBy({ mode, modeConfig }, update = false) {
      if (!properties || !properties.qHyperCubeDef) {
        return;
      }
      // reset
      if (update) {
        removeRole(properties.qHyperCubeDef, 'color');
      }

      if (!properties.cellColor) {
        properties.cellColor = {};
      }

      if (mode === 'auto') {
        setByAuto(properties);
        delete properties.cellColor.byDimension;
      } else if (mode === 'byDimension') {
        setByDimension(properties, modeConfig, update);
      }
    },
    getSettings() {
      const hc = layout ? layout.qHyperCube : properties.qHyperCubeDef;
      const colorProps = layout ? layout.cellColor : properties.cellColor;

      const colorByField = findFields(f => f.roles && f.roles.filter(r => r.role === 'color').length > 0, hc)[0];
      let fieldPath = colorByField ? colorByField.path.replace(/^\//, '') : 'qDimensionInfo/1';
      let definition = colorByField ? colorByField.definition : null;

      if (!colorByField || colorProps.mode === 'auto') {
        fieldPath = 'qDimensionInfo/1';
        definition = layout ? layout.qHyperCube.qDimensionInfo[1] : properties.qHyperCubeDef.qDimensions[0];
      }

      const fieldType = getFieldType(fieldPath);

      if (fieldType === 'dimension') {
        return getByDimensionSettings({
          layout,
          theme,
          definition,
          fieldPath,
        });
      }

      return {
        invalid: true,
      };
    },
    getLegendSettings() {
      return {
        ...legendConfig,
        ...layout.cellColor.legend,
        dock: 'right',
      };
    },
  };
}
