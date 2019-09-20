import REFS from '../refs';

export default function columns({
  context,
  style,
  hc,
}) {
  const isLocked = hc.qDimensionInfo[0].qLocked;
  return [{
    type: 'box',
    key: 'column-boxes',
    dock: 'top',
    preferredSize: () => {
      const fontSize = style && style['$font-size'] ? parseInt(style['$font-size'], 10) : 12;
      return fontSize * 4;
    },
    data: {
      collection: REFS.SPAN_COLLECTION,
    },
    brush: context.permissions.indexOf('select') !== -1 && context.permissions.indexOf('interact') !== -1 ? {
      trigger: isLocked ? [] : [{
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
        strokeWidth: 0,
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
            labels: [{
              linkData({ node }) {
                return node.data;
              },
              label: (d) => {
                if (!d.data) {
                  return '';
                }
                return `${d.data.series.label} (${((d.data.end.value - d.data.start.value) * 100).toFixed(2)}%)`;
              },
            }, {
              linkData({ node }) {
                return node.data;
              },
              label: d => (d.data ? `${d.data.metric.label}` : ''),
            }],
          },
        },
      }],
    },
  }];
}
