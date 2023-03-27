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
          components: [{ key: 'cells' }, { key: 'column-boxes' }],
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
  constraints,
  theme,
  contraster,
  restricted,
  picassoColoring,
  translator,
  formatPercentage,
  flags,
}) {
  let picassoStyle;

  if (theme) {
    try {
      picassoStyle = {
        '$font-family': theme.getStyle('', '', 'fontFamily') || "'QlikView Sans', sans-serif",
        '$font-color': theme.getStyle('', '', 'color'),
        '$font-size': theme.getStyle('', '', 'fontSize'),
        '$font-size--l': theme.getStyle('object', 'legend.title', 'fontSize'), // props.object.legend.title.fontSize,
        '$guide-color': theme.getStyle('object', 'axis.line.major', 'color'), // props.object.axis.line.major.color,
      };
    } catch (e) {
      /* empty */
    }
  }
  if (restricted && restricted.type === 'disrupt') {
    return {
      components: disclaimer(restricted, translator),
      ...(picassoStyle ? { style: picassoStyle } : {}), // ugly way to avoid setting style: undefined
    };
  }

  const colorDatum = picassoColoring.datumProps();
  const colorFill = picassoColoring.color();

  const leg = picassoColoring.legend({
    key: 'color-legend',
    eventName: 'ev',
  });

  const allowTooltip = !constraints.passive;
  const valueLabel = flags.isEnabled('CLIENT_IM_2022') ? (layout.components || []).find((c) => c.key === 'value') : {};
  const valueLabelStyle =
    valueLabel && valueLabel.label && valueLabel.label.value
      ? {
          fontFamily: valueLabel.label.value.fontFamily,
          fontSize: parseFloat(valueLabel.label.value.fontSize),
          fill: valueLabel.label.value.fontColor.color,
        }
      : {};
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
      ...axis(layout, flags),
      ...cells({
        constraints,
        contraster,
        colorFill,
        hc: layout.qHyperCube,
        formatPercentage,
        valueLabelStyle,
      }),
      ...columns({
        constraints,
        style: picassoStyle,
        hc: layout.qHyperCube,
        formatPercentage,
        valueLabelStyle,
      }),
      ...(allowTooltip ? tooltip(picassoColoring.settings(), translator, formatPercentage) : []),
      ...disclaimer(restricted, translator),
    ],
    interactions: [...leg.interactions, allowTooltip ? tooltipInteraction() : false].filter(Boolean),
    style: picassoStyle,
  };
}
