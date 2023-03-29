/* eslint no-nested-ternary: 0 */
function safeValue(prop) {
  return (d) => (typeof d.datum[prop] === 'object' ? d.datum[prop].value : undefined);
}

function isNil(d) {
  return d.datum.value === -2;
}

function isOthers(d) {
  return d.datum.value === -3;
}

export default function fill({ coloring, scales, key }) {
  const { nil, others, primary } = coloring;
  let fn;

  const scaleKey = key;
  const safeDatum = safeValue(key);
  const safeOthers = safeValue(`${key}IsAnOther`);

  if (coloring.invalid) {
    fn = (d) => (isOthers(d) || safeOthers(d) ? others : nil);
  } else if (scales[scaleKey]) {
    fn = (d) => {
      if (isOthers(d)) {
        return others;
      }
      if (isNil(d) || (safeDatum(d) === -2 && coloring.fieldType === 'dimension') || safeDatum(d) === 'NaN') {
        return nil;
      }
      if (safeOthers(d)) {
        return others;
      }
      return d.resources.scale(scaleKey)(safeDatum(d)) || others;
    };
  } else if (coloring.mode === 'constant') {
    fn = (d) => (isOthers(d) || safeOthers(d) ? others : isNil(d) ? nil : primary);
  } else if (coloring.type === 'color') {
    fn = (d) => (isOthers(d) || safeOthers(d) ? others : isNil(d) ? nil : safeDatum(d) || others);
  }

  return fn;
}
