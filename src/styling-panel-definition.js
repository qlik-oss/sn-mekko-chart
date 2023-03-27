const getStylingPanelDefinition = (bkgOptionsEnabled, chartStylingEnabled, theme, fontResolver, chartId) => ({
  component: 'styling-panel',
  chartTitle: 'Object.MekkoChart',
  translation: 'LayerStyleEditor.component.styling',
  subtitle: 'LayerStyleEditor.component.styling',
  ref: 'components',
  useGeneral: true,
  useBackground: bkgOptionsEnabled,
  items: chartStylingEnabled
    ? {
        axisLabelSection: {
          translation: 'properties.axis.label',
          component: 'panel-section',
          items: {
            labelSection: {
              component: 'items',
              ref: 'components',
              key: 'axis',
              items: {
                fontFamily: {
                  ref: 'axis.label.name.fontFamily',
                  component: 'dropdown',
                  options: () => fontResolver.getOptions('axis.label.name.fontFamily'),
                  defaultValue: () => fontResolver.getDefaultValue('axis.label.name.fontFamily'),
                },
                fontWrapper: {
                  component: 'inline-wrapper',
                  items: {
                    fontSize: {
                      ref: 'axis.label.name.fontSize',
                      component: 'dropdown',
                      width: true,
                      options: () => fontResolver.getOptions('axis.label.name.fontSize'),
                      defaultValue: () => fontResolver.getDefaultValue('axis.label.name.fontSize'),
                    },
                    fontColor: {
                      ref: 'axis.label.name.fontColor',
                      component: 'color-picker',
                      width: false,
                      defaultValue: () => {
                        const color = theme.getStyle(chartId, 'axis.label.name.color', 'color');
                        const palette = theme.getDataColorPickerPalettes()[0].colors;
                        const index = palette.indexOf(color);
                        return { color, index };
                      },
                    },
                  },
                },
              },
            },
          },
        },
        valueLabelSection: {
          translation: 'properties.value.label',
          component: 'panel-section',
          items: {
            labelSection: {
              component: 'items',
              ref: 'components',
              key: 'value',
              items: {
                fontFamily: {
                  ref: 'label.value.fontFamily',
                  component: 'dropdown',
                  options: () => fontResolver.getOptions('label.value.fontFamily'),
                  defaultValue: () => fontResolver.getDefaultValue('label.value.fontFamily'),
                },
                fontWrapper: {
                  component: 'inline-wrapper',
                  items: {
                    fontSize: {
                      ref: 'label.value.fontSize',
                      component: 'dropdown',
                      width: true,
                      options: () => fontResolver.getOptions('label.value.fontSize'),
                      defaultValue: () => fontResolver.getDefaultValue('label.value.fontSize'),
                    },
                    fontColor: {
                      ref: 'label.value.fontColor',
                      component: 'color-picker',
                      width: false,
                      defaultValue: () => {
                        const color = theme.getStyle(chartId, 'label.value.color', 'color');
                        const palette = theme.getDataColorPickerPalettes()[0].colors;
                        const index = palette.indexOf(color);
                        return { color, index };
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    : undefined,
});

export default getStylingPanelDefinition;
