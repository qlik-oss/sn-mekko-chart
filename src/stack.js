import REFS from './refs';

export default function stack({ key, field, trackBy, reduce, stackKey = (d) => d.series.value, props = {} }) {
  return {
    key,
    data: {
      extract: {
        field,
        props: {
          [REFS.SERIES]: { field: 'qDimensionInfo/0' },
          metric: { field: 'qMeasureInfo/0', reduce: 'sum' },
          end: { field: 'qMeasureInfo/0', reduce: 'sum' },
          ...props,
        },
        // optional
        trackBy,
        reduce,
      },
      stack: {
        stackKey,
        value: (d) => d.end.value,
        offset: 'expand',
      },
    },
  };
}
