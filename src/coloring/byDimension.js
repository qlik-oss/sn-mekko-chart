import { addRole } from "../roles/roles";

const RX = /\/(qDimensions|qMeasures)\/(\d+)/;
const RXA =
  /\/(qDimensions|qMeasures)\/(\d+)\/(qAttributeDimensions|qAttributeExpressions)\/(\d+)/;

/**
 * Configuration object for when mode is set to `byDimension`
 * @typedef {object}
 * @alias byDimensionConfig
 */
const byDimension = {
  /**
   * @type {'index'|'libraryId'|'expression'}
   */
  type: undefined,
  /**
   * @type {number|string}
   */
  typeValue: undefined,
  /**
   * @type {(string|StringExpression)=}
   */
  label: undefined,
  /**
   * @type {boolean=}
   */
  persistent: false,
  /**
   * @type {string=}
   */
  scheme: "",
};

/**
 * @private
 * @param {object} properties
 * @param {byDimensionConfig} byDimensionConfig
 * @param {'index'|'expression'|'libraryId'} byDimensionConfig.type
 * @param {string|integer} byDimensionConfig.typeValue
 * @param {boolean} byDimensionConfig.persistent
 * @param {string} byDimensionConfig.scheme
 * @param {string|QAE.StringExpression} byDimensionConfig.label
 */
export function setByDimension(properties, byDimensionConfig, update) {
  const dimensions = properties.qHyperCubeDef.qDimensions;
  const defaultTargetPath = `/qDimensions/${Math.max(
    0,
    dimensions.length - 1
  )}`;

  const config = byDimensionConfig || {
    type: "index",
    typeValue: Math.max(0, dimensions.length - 1),
  };

  if (config.type === "index" && config.typeValue > dimensions.length - 1) {
    // reset dimension index to one that exits in the cube
    config.typeValue = Math.max(0, dimensions.length - 1);
  }

  let targetPath;
  if (config.type === "index") {
    targetPath = `/qDimensions/${config.typeValue}`;
  } else {
    targetPath = `${defaultTargetPath}/qAttributeDimensions/0`;
  }

  if (update && dimensions.length) {
    const m = RXA.exec(targetPath);
    if (m) {
      const def =
        config.type === "libraryId"
          ? {
              qLibraryId: config.typeValue,
              libraryId: config.typeValue, // add custom property since qLibraryId is not returned in attr dimension/measure in layout
            }
          : {
              qDef: config.typeValue,
            };
      // add qAttributeX array since it's not always set
      if (!properties.qHyperCubeDef[m[1]][+m[2]][m[3]]) {
        properties.qHyperCubeDef[m[1]][+m[2]][m[3]] = [];
      }
      properties.qHyperCubeDef[m[1]][+m[2]][m[3]].splice(+m[4], 0, {
        ...def,
        qAttribute: true,
        qSortBy: { qSortByAscii: 1 },
        roles: [{ role: "color" }],
      });
    } else {
      // add role only
      const mx = RX.exec(targetPath);
      if (mx) {
        addRole(properties.qHyperCubeDef[mx[1]][+mx[2]], "color");
      }
    }
  }

  properties.cellColor.byDimension = {
    ...byDimension,
    ...(properties.cellColor.byDimension || {}),
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
      ...theme.getDataColorSpecials(),
    };
  }
  const pals = theme.getDataColorPalettes();
  const c = (layout.cellColor && layout.cellColor.byDimension) || {};
  return {
    mode: "field",
    field: fieldPath,
    fieldType: "dimension",
    persistent: c.persistent,

    type: "categorical",

    // references values in a theme
    palette: pals.filter((p) => p.key === c.scheme)[0] || pals[0],
    ...theme.getDataColorSpecials(),

    // for tooltips and legend
    label:
      c.type === "expression"
        ? c.label || definition.qFallbackTitle
        : definition.qFallbackTitle,

    locked: definition.qLocked || false,
  };
}
