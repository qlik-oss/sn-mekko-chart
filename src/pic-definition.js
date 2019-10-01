import axis from './components/axis';
import cells from './components/cells';
import columns from './components/columns';
import tooltip from './components/tooltip';
import disclaimer from './components/disclaimer';

import scales from './scales';
import stack from './stack';

import REFS from './refs';

function tooltipInteraction() {
  return {
    key: 'tooltip',
    type: 'native',
    events: {
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
    },
  };
}

export default function ({
  layout,
  context,
  contraster,
  restricted,
  picassoColoring,
  env,
  formatPercentage,
}) {
  let picassoStyle;

  if (env.Theme) {
    try {
      const props = env.Theme.getCurrent().properties;
      picassoStyle = {
        '$font-family': props.fontFamily || "'QlikView Sans', sans-serif",
        '$font-color': props.color,
        '$font-size': props.fontSize,
        '$font-size--l': props.object.legend.title.fontSize,
        '$guide-color': props.object.axis.line.major.color,
      };
    } catch (e) { /* empty */ }
  }
  if (restricted && restricted.type === 'disrupt') {
    return {
      components: disclaimer(restricted, env),
      ...(picassoStyle ? { style: picassoStyle } : {}), // ugly way to avoid setting style: undefined
    };
  }

  const colorDatum = picassoColoring.datumProps();
  const colorFill = picassoColoring.color();

  const leg = picassoColoring.legend({
    key: 'color-legend',
    eventName: 'ev',
  });

  const allowTooltip = context.permissions.indexOf('passive') !== -1;
  return {
    strategy: {
      layoutModes: {
        MEDIUM: { width: 300, height: 200 },

        HEIGHT_MEDIUM: { width: 100, height: 400 },
        HEIGHT_SMALL: { width: 50, height: 200 },

        WIDTH_MEDIUM: { width: 400, height: 100 },
        WIDTH_SMALL: { width: 300, height: 100 },
      },
    },
    collections: [
      stack({
        key: REFS.SPAN_COLLECTION,
        field: 'qDimensionInfo/0',
        trackBy: (cell) => cell.qElemNumber,
        reduce: 'first',
        stackKey: () => -1,
      }),
      stack({
        key: REFS.CELL_COLLECTION,
        field: 'qDimensionInfo/1',
        props: {
          ...colorDatum,
        },
      }),
    ],
    scales: {
      ...scales(),
      ...picassoColoring.scales(),
    },
    formatters: {
      metric: {
        data: {
          field: 'qMeasureInfo/0',
        },
      },
    },
    palettes: picassoColoring.palettes(),
    components: [
      ...leg.components,
      ...axis(),
      ...cells({
        context, contraster, colorFill, hc: layout.qHyperCube, formatPercentage,
      }),
      ...columns({
        context,
        style: picassoStyle,
        hc: layout.qHyperCube,
        formatPercentage,
      }),
      ...(allowTooltip ? tooltip(picassoColoring.settings(), env, formatPercentage) : []),
      ...disclaimer(restricted, env),
    ],
    interactions: [...leg.interactions, allowTooltip ? tooltipInteraction() : false].filter(Boolean),
    style: picassoStyle,
  };
}
