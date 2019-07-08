import REFS from '../refs';

export default function spanLabels() {
  return [{
    key: 'span-boxes',
    type: 'box',
    dock: 'top',
    preferredSize: () => 32,
    data: {
      collection: REFS.SPAN_COLLECTION,
    },
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
    dock: '@span-boxes',
    displayOrder: 2,
    settings: {
      sources: [{
        component: 'span-boxes',
        selector: 'rect',
        strategy: {
          type: 'rows',
          settings: {
            fill: '#111',
            labels: [{
              label: d => (d.data ? d.data.series.label : ''),
            }],
          },
        },
      }],
    },
  }];
}
