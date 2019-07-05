function stack({
  key,
  field,
  trackBy,
  reduce,
  stackKey = d => d.series.value,
}) {
  return {
    key,
    data: {
      extract: {
        field,
        props: {
          series: { field: 'qDimensionInfo/0' },
          metric: { field: 'qMeasureInfo/0', reduce: 'sum' },
          end: { field: 'qMeasureInfo/0', reduce: 'sum' },
        },
        // optional
        trackBy,
        reduce,
      },
      stack: {
        stackKey,
        value: d => d.end.value,
        offset: 'expand',
      },
    },
  };
}

export default function ({
  layout, // eslint-disable-line no-unused-vars
  context, // eslint-disable-line no-unused-vars
}) {
  return {
    collections: [
      stack({
        key: 'span',
        field: 'qDimensionInfo/0',
        trackBy: cell => cell.qElemNumber,
        reduce: 'first',
        stackKey: () => -1,
      }),
      stack({ key: 'stacked', field: 'qDimensionInfo/1' }),
    ],
    scales: {
      y: {
        data: {
          collections: { key: 'stacked' },
        },
        invert: true,
      },
      b: {
        data: {
          collection: {
            key: 'span',
          },
        },
        type: 'band',
      },
      m: {
        data: {
          collection: {
            key: 'span',
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
    },
    components: [{
      key: 'y-axis',
      type: 'axis',
      dock: 'left',
      scale: 'y',
      formatter: {
        type: 'd3-number',
        format: '.0%',
      },
    }, {
      key: 'x-axis',
      type: 'axis',
      dock: 'bottom',
      scale: 'm',
      formatter: {
        type: 'd3-number',
        format: '.0%',
      },
    }, {
      key: 'cells',
      type: 'box',
      data: {
        collection: 'stacked',
      },
      settings: {
        major: {
          ref: 'series',
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
          fill: { scale: 'color' },
        },
      },
    }, {
      key: 'cell-labels',
      type: 'labels',
      dock: '@cells',
      displayOrder: 2,
      settings: {
        sources: [{
          component: 'cells',
          selector: 'rect',
          strategy: {
            type: 'rows',
            settings: {
              labels: [{
                label: d => (d.data ? d.data.label : ''),
              }],
            },
          },
        }],
      },
    }],
  };
}
