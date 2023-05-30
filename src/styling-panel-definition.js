import { labelStylingDefinition } from './styling-utils';

const getStylingItems = (flags, theme, fontResolver, chartId) => {
  const items = {};

  if (flags.isEnabled('CLIENT_IM_2022')) {
    items.axisLabelSection = {
      translation: 'properties.axis.label',
      component: 'panel-section',
      items: {
        labelSection: {
          component: 'items',
          ref: 'components',
          key: 'axis',
          items: labelStylingDefinition('axis.label.name', fontResolver, chartId, theme),
        },
      },
    };

    items.valueLabelSection = {
      translation: 'properties.value.label',
      component: 'panel-section',
      items: {
        labelSection: {
          component: 'items',
          ref: 'components',
          key: 'value',
          items: labelStylingDefinition('label.value', fontResolver, chartId, theme),
        },
      },
    };
  }

  if (flags.isEnabled('CLIENT_IM_3051')) {
    items.legendTitleSection = {
      translation: 'properties.legend.title',
      component: 'panel-section',
      items: {
        labelSection: {
          component: 'items',
          ref: 'components',
          key: 'legend',
          items: labelStylingDefinition('legend.title', fontResolver, chartId, theme),
        },
      },
    };

    items.legendLabelSection = {
      translation: 'properties.legend.label',
      component: 'panel-section',
      items: {
        labelSection: {
          component: 'items',
          ref: 'components',
          key: 'legend',
          items: labelStylingDefinition('legend.label', fontResolver, chartId, theme),
        },
      },
    };
  }

  // returning undefined if nothing is enabled so that the styling panel is invisible in such a case
  return Object.keys(items).length > 0 ? items : undefined;
};

const getStylingPanelDefinition = (bkgOptionsEnabled, flags, theme, fontResolver, chartId) => ({
  component: 'styling-panel',
  chartTitle: 'Object.MekkoChart',
  translation: 'LayerStyleEditor.component.styling',
  subtitle: 'LayerStyleEditor.component.styling',
  ref: 'components',
  useGeneral: true,
  useBackground: bkgOptionsEnabled,
  items: getStylingItems(flags, theme, fontResolver, chartId),
});

export default getStylingPanelDefinition;
