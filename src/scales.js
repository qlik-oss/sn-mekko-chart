import REFS from './refs';

export default function scales() {
  return {
    y: {
      data: {
        collections: { key: REFS.STACKED_COLLECTION },
      },
      invert: true,
    },
    b: {
      data: {
        collection: {
          key: REFS.SPAN_COLLECTION,
        },
      },
      type: 'band',
    },
    m: {
      data: {
        collection: {
          key: REFS.SPAN_COLLECTION,
        },
      },
      max: 1,
    },
    color: {
      data: {
        extract: {
          field: 'qDimensionInfo/1',
        },
      },
      type: 'color',
    },
  };
}
