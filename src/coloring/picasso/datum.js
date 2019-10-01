/* eslint no-nested-ternary: 0 */
/* eslint no-bitwise: 0 */
const rgba = (uint) => `rgba(${[
  (0xFF0000 & uint) >> 16,
  (0x00FF00 & uint) >> 8,
  0x0000FF & uint,
  ((0xFF000000 & uint) >>> 24) / 255].join(',')
})`;

export default function ({
  hc,
  coloring,
  scales,
  key,
}, measureIdx = 0) {
  let fillField;
  let fillData;
  const datumPropKey = key;
  const { nil } = coloring;
  if (scales[key] && coloring.mode === 'field') {
    fillField = scales[key].data.field || coloring.field;
  } else if (coloring.mode === 'field' && coloring.field) {
    fillField = coloring.field;
  }

  if (fillField) {
    fillData = {
      field: fillField,
      reduce: 'first',
    };
    if (coloring.type === 'color') {
      fillData.value = (v) => {
        if (v.qNum !== 'NaN') {
          return rgba(v.qNum);
        }
        return v.qText && v.qText ? v.qText : nil;
      };
    }
  } else if (coloring.mode === 'dimension') {
    fillData = typeof coloring.field !== 'undefined' ? coloring.field : hc.qDimensionInfo.length - 1;
  } else if (coloring.mode === 'measure') {
    fillData = measureIdx;
  }

  const datumProps = { [datumPropKey]: fillData };

  if (hc.qDimensionInfo.length > 1) {
    datumProps[`${datumPropKey}IsAnOther`] = {
      fields: hc.qDimensionInfo.map((d, i) => ({ field: `qDimensionInfo/${i}` })),
      value(values) {
        return values.indexOf(-3) !== -1;
      },
    };
  }

  return datumProps;
}
