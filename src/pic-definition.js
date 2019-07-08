import axis from './components/axis';
import cells from './components/cells';
import spanLabels from './components/span-labels';

import scales from './scales';
import stack from './stack';

import REFS from './refs';

export default function ({
  layout, // eslint-disable-line no-unused-vars
  context, // eslint-disable-line no-unused-vars
}) {
  return {
    collections: [
      stack({
        key: REFS.SPAN_COLLECTION,
        field: 'qDimensionInfo/0',
        trackBy: cell => cell.qElemNumber,
        reduce: 'first',
        stackKey: () => -1,
      }),
      stack({ key: REFS.STACKED_COLLECTION, field: 'qDimensionInfo/1' }),
    ],
    scales: scales(),
    components: [
      ...axis(),
      ...cells({ context }),
      ...spanLabels({ context }),
    ],
  };
}
