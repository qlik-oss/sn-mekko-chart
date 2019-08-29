import axis from './components/axis';
import cells from './components/cells';
import spanLabels from './components/span-labels';
import tooltip from './components/tooltip';
import disclaimer from './components/disclaimer';

import scales from './scales';
import stack from './stack';

import REFS from './refs';

export default function ({
  // layout
  context,
  color,
  restricted,
}) {
  if (restricted && restricted.type === 'disrupt') {
    return {
      components: disclaimer(restricted),
    };
  }

  const allowTooltip = context.permissions.indexOf('passive') !== -1;
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
      ...cells({ context, color }),
      ...spanLabels({ context }),
      ...(allowTooltip ? tooltip() : []),
      ...disclaimer(restricted),
    ],
    interactions: [{
      type: 'native',
      events: context.permissions.indexOf('passive') !== -1 ? {
        mousemove(e) {
          const bounds = this.chart.element.getBoundingClientRect();
          const p = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
          };

          let shapes = [];

          shapes = this.chart.shapesAt(p, {
            components: [
              { key: 'cells' },
              { key: 'column-boxes' },
            ],
            propagation: 'stop',
          });

          this.chart.component('tool').emit('show', e, { nodes: shapes });
        },
        mouseleave() {
          this.chart.component('tool').emit('hide');
        },
      } : {},
    }],
  };
}
