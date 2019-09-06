import {
  removeRole,
  addRole,
} from '../roles/roles';

const RX = /\/(qDimensions|qMeasures)\/(\d+)/;
const RXA = /\/(qDimensions|qMeasures)\/(\d+)\/(qAttributeDimensions|qAttributeExpressions)\/(\d+)/;

/**
 * @param {object} properties
 * @param {object} byDimensionConfig
 * @param {'index'|'expression'|'libraryId'} byDimensionConfig.type
 * @param {string|integer} byDimensionConfig.typeValue
 * @param {boolean} byDimensionConfig.persistent
 * @param {string} byDimensionConfig.scheme
 * @param {string|QAE.StringExpression} byDimensionConfig.label
 */
export function setByDimension(properties, byDimensionConfig) {
  // remove existing
  removeRole(properties.qHyperCubeDef, 'color');

  const dimensions = properties.qHyperCubeDef.qDimensions;

  const defaultTargetPath = `/qDimensions/${dimensions.length - 1}`;

  const config = byDimensionConfig || {
    type: 'index',
    typeValue: dimensions.length - 1,
  };

  let targetPath;
  if (config.type === 'index') {
    targetPath = `/qDimensions/${config.typeValue}`;
  } else {
    targetPath = `${defaultTargetPath}/qAttributeDimensions/0`;
  }

  const m = RXA.exec(targetPath);
  if (m) {
    const def = config.type === 'libraryId' ? {
      qLibraryId: config.typeValue,
      libraryId: config.typeValue, // add custom property since qLibraryId is not returned in attr dimension/measure in layout
    } : {
      qDef: config.typeValue,
    };
    properties.qHyperCubeDef[m[1]][+m[2]][m[3]].splice(+m[4], 0, {
      ...def,
      qAttribute: true,
      qSortBy: { qSortByAscii: 1 },
      roles: [{ role: 'color' }],
    });
  } else {
    // add role only
    const mx = RX.exec(targetPath);
    if (mx) {
      addRole(properties.qHyperCubeDef[mx[1]][+mx[2]], 'color');
    } else {
      console.error('hmm?');
    }
  }

  properties.color.byDimension = {
    persistent: false,
    scheme: '',
    ...(properties.color.byDimension || {}),
    ...(config || {}),
  };
}

export function getByDimensionSettings({
  layout,
  theme,
  definition,
  fieldPath,
}) {
  if (definition.qError || (definition.qSize && definition.qSize.qcy === 0)) {
    return {
      invalid: true,
      ...theme.dataColors(),
    };
  }
  const pals = theme.palettes('qualitative');
  const c = (layout.color && layout.color.byDimension) || {};
  return {
    mode: 'field',
    field: fieldPath,
    fieldType: 'dimension',
    persistent: c.persistent,

    type: 'categorical',

    // references values in a theme
    palette: pals.filter(p => p.key === c.scheme)[0] || pals[0],
    ...theme.dataColors(),

    // for tooltips and legend
    label: c.type === 'expression' ? c.label || definition.qFallbackTitle : definition.qFallbackTitle,
  };
}
