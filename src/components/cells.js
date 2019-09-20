import REFS from '../refs';

export default function cells({
  context,
  contraster,
  colorFill,
}) {
  return [{
    type: 'box',
    key: 'cells',
    data: {
      collection: REFS.CELL_COLLECTION,
    },
    brush: context.permissions.indexOf('select') !== -1 && context.permissions.indexOf('interact') !== -1 ? {
      trigger: [{
        contexts: ['selection'],
      }],
      consume: [{
        context: 'selection',
        style: {
          inactive: { opacity: 0.4 },
        },
      }],
    } : {},
    settings: {
      major: {
        ref: REFS.SERIES,
        binStart: {
          scale: 'm',
          fn(d) {
            const sBand = d.resources.scale('b');
            return d.resources.scale('m')(sBand.datum(d.datum.series.value).start.value);
          },
        },
        binEnd: {
          fn(d) {
            const ss = d.resources.scale('b');
            return d.resources.scale('m')(ss.datum(d.datum.series.value).end.value);
          },
        },
      },
      minor: {
        scale: 'y',
        ref: 'end',
      },
      box: {
        fill: colorFill,
      },
    },
  }, {
    type: 'labels',
    key: 'cell-labels',
    dock: '@cells',
    displayOrder: 2,
    brush: {
      consume: [{
        context: 'selection',
        // data: [''],
        style: {
          inactive: { opacity: 0.6 },
        },
      }],
    },
    settings: {
      sources: [{
        component: 'cells',
        selector: 'rect',
        strategy: {
          type: 'rows',
          settings: {
            fill(d) {
              return contraster.getBestContrastColor(d.node.attrs.fill);
            },
            labels: [{
              linkData({ node }) {
                return node.data;
              },
              label: (d) => {
                if (!d.data) {
                  return '';
                }
                return `${d.data.label} (${((d.data.end.value - d.data.start.value) * 100).toFixed(2)}%)`;
              },
            }, {
              linkData({ node }) {
                return node.data;
              },
              label: ({ formatter, data }) => (data ? `${formatter('metric')(data.metric.value)}` : ''),
            }],
          },
        },
      }],
    },
  }];
}
