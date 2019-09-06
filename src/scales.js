import REFS from './refs';

export default function scales() {
  return {
    y: {
      data: {
        collections: { key: REFS.CELL_COLLECTION },
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
  };
}
