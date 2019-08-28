import REFS from '../refs';

export default function spanLabels({
  context,
}) {
  return [{
    type: 'box',
    key: 'column-boxes',
    dock: 'top',
    preferredSize: () => 32,
    data: {
      collection: REFS.SPAN_COLLECTION,
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
        binStart: {
          scale: 'm',
          fn(d) {
            const ss = d.resources.scale('b');
            return d.resources.scale('m')(ss.datum(d.datum.value).start.value);
          },
        },
        binEnd: {
          fn(d) {
            const ss = d.resources.scale('b');
            return d.resources.scale('m')(ss.datum(d.datum.value).end.value);
          },
        },
      },
      minor: { start: 0, end: 1 },
      box: {
        fill: 'rgba(100, 0, 0, 0.0)',
      },
    },
  }, {
    type: 'labels',
    key: 'column-labels',
    dock: '@column-boxes',
    displayOrder: 2,
    brush: {
      consume: [{
        context: 'selection',
        style: {
          inactive: { opacity: 0.6 },
        },
      }],
    },
    settings: {
      sources: [{
        component: 'column-boxes',
        selector: 'rect',
        strategy: {
          type: 'rows',
          settings: {
            fill: '#111',
            labels: [{
              linkData({ node }) {
                return node.data;
              },
              label: d => (d.data ? d.data.series.label : ''),
            }],
          },
        },
      }],
    },
  }];
}
