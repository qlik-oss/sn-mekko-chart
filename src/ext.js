import { fontResolver as createFontResolver } from 'qlik-chart-modules';
import coloring from './coloring';
import getStylingPanelDefinition from './styling-panel-definition';

const addons = {
  type: 'items',
  component: 'expandable-items',
  translation: 'properties.addons',
  items: {
    dataHandling: {
      uses: 'dataHandling',
      items: {
        suppressZero: null,
        calcCond: {
          uses: 'calcCond',
        },
      },
    },
  },
};

export default function ext(env) {
  const { translator, flags } = env;
  const label = (data) => {
    if (data.cellColor.mode === 'auto') {
      return translator.get('Simple.Color.Auto', translator.get('properties.colorMode.byDimension'));
    }
    return translator.get('Common.Custom');
  };
  const onAutoChange = (data, handler, properties) => {
    // TODO - store old value
    const c = coloring({
      properties,
    });
    c.colorBy({
      mode: data.cellColor.mode === 'auto' ? 'auto' : 'byDimension',
    });
  };
  const simpleAuto = {
    ref: 'cellColor.mode',
    type: 'string',
    component: 'switch',
    schemaIgnore: true,
    convertFunctions: {
      get(getter, def, args) {
        return args.properties.cellColor.mode === 'auto';
      },
      set(value, setter, def, args) {
        args.properties.cellColor.mode = value ? 'auto' : 'byDimension';
      },
    },
    label,
    change: onAutoChange,
  };

  const getLabel = (data, args) => {
    if (data.cellColor.byDimension.type === 'libraryId') {
      const libId = data.cellColor.byDimension.typeValue;
      const { qDimensionInfo } = args.layout.qHyperCube;
      for (let i = 0; i < qDimensionInfo.length; i++) {
        const { qAttrDimInfo } = qDimensionInfo[i];
        if (qAttrDimInfo) {
          for (let j = 0; j < qAttrDimInfo.length; j++) {
            if (qAttrDimInfo[j].libraryId === libId) return qAttrDimInfo[j].qFallbackTitle;
          }
        }
      }
      return '';
    }
    const s = data.cellColor.byDimension.typeValue;
    if (s && s.charAt(0) === '=') return s.substring(1);
    return s;
  };

  const byDimensionOptions = (data, handler, args) => {
    if (
      data.cellColor.mode === 'byDimension' &&
      data.qHyperCubeDef &&
      data.qHyperCubeDef.qDimensions &&
      data.qHyperCubeDef.qDimensions.length
    ) {
      const options = data.qHyperCubeDef.qDimensions.map((d, index) => ({
        value: index,
        label: translator.get('properties.colorBy.currentDimension', index + 1),
      }));
      if (data.cellColor.byDimension.type !== 'index') {
        options.push({
          value: data.cellColor.byDimension.typeValue,
          label: getLabel(data, args),
        });
      }
      return options;
    }
    return [];
  };
  const stylingPanelEnabled = flags.isEnabled('SENSECLIENT_IM_2022_STYLINGPANEL_MEKKOCHART');
  const bkgOptionsEnabled = flags.isEnabled('SENSECLIENT_IM_2022_MEKKO_BG');
  const chartStylingEnabled = flags.isEnabled('CLIENT_IM_2022');
  const chartId = 'object.mekkochart';
  const fontResolver = createFontResolver({
    theme: env.sense.theme,
    translator,
    flags,
    config: {
      id: chartId,
      paths: ['axis.label.name', 'label.value'],
    },
  });
  const colorByDimension = {
    ref: 'cellColor.byDimension.typeValue',
    schemaIgnore: true,
    type: 'number',
    component: 'dropdown',
    options: byDimensionOptions,
    defaultValue: -1,
    translation: 'properties.colorBy.selectDimension',
    libraryItemType: 'dimension',
    show(data) {
      return data.cellColor.mode === 'byDimension';
    },
    change(data) {
      data.cellColor.byDimension.type = 'index';
    },
  };
  return {
    definition: {
      type: 'items',
      component: 'accordion',
      items: {
        data: {
          uses: 'data',
          items: {
            dimensions: {
              disabledRef: '', // to disable alternative
            },
            measures: {
              disabledRef: '',
            },
          },
        },
        sorting: {
          uses: 'sorting',
        },
        addons,
        settings: {
          uses: 'settings',
          items: {
            presentation: stylingPanelEnabled && {
              type: 'items',
              translation: 'properties.presentation',
              grouped: true,
              items: {
                styleEditor: getStylingPanelDefinition(
                  bkgOptionsEnabled,
                  chartStylingEnabled,
                  env.sense.theme,
                  fontResolver,
                  chartId
                ),
              },
            },
            colorsAndLegend: {
              type: 'items',
              translation: 'properties.colorsAndLegend',
              items: {
                coloring: {
                  type: 'items',
                  items: {
                    auto: {
                      ref: 'cellColor.mode',
                      type: 'string',
                      translation: 'properties.colors',
                      component: 'switch',
                      schemaIgnore: true,
                      trueOption: {
                        translation: 'Common.Auto',
                        value: 'auto',
                      },
                      falseOption: {
                        translation: 'Common.Custom',
                        value: 'byDimension',
                      },
                      change: onAutoChange,
                    },
                    dimensionDropdown: {
                      component: 'color-by-dropdown',
                      libraryItemType: 'dimension',
                      ref: 'cellColor.byDimension',
                      defaultValue: {},
                      show(data) {
                        return data.cellColor.mode === 'byDimension';
                      },
                      change() {}, // needed to avoid error thrown in 'color-by-dropdown'
                      convertFunctions: {
                        get(getter, def, args) {
                          const c = args.properties.cellColor.byDimension || {};
                          if (c.type === 'index') {
                            return {
                              activeDimensionIndex: c.typeValue,
                            };
                          }
                          if (c.type === 'libraryId') {
                            return {
                              type: 'libraryItem',
                              key: c.typeValue,
                            };
                          }
                          return {
                            type: 'expression',
                            key: c.typeValue,
                          };
                        },
                        set(value, setter, def, args) {
                          const c = coloring({
                            properties: args.properties,
                          });

                          if (value.activeDimensionIndex >= 0) {
                            c.colorBy({
                              mode: 'byDimension',
                              modeConfig: {
                                type: 'index',
                                typeValue: value.activeDimensionIndex,
                              },
                            });
                          } else if (value.type === 'libraryItem') {
                            c.colorBy({
                              mode: 'byDimension',
                              modeConfig: {
                                type: 'libraryId',
                                typeValue: value.key,
                              },
                            });
                          } else {
                            c.colorBy({
                              mode: 'byDimension',
                              modeConfig: {
                                type: 'expression',
                                typeValue: value.key,
                              },
                            });
                          }
                        },
                      },
                    },
                    colorByDimensionLabel: {
                      type: 'string',
                      ref: 'cellColor.byDimension.label',
                      schemaIgnore: true,
                      translation: 'Common.Label',
                      expression: 'optional',
                      show(data) {
                        return (
                          data.cellColor.mode === 'byDimension' &&
                          data.cellColor.byDimension &&
                          data.cellColor.byDimension.type === 'expression'
                        );
                      },
                    },
                    persistentColors: {
                      ref: 'cellColor.byDimension.persistent',
                      translation: 'properties.colorPersistence',
                      type: 'boolean',
                      schemaIgnore: true,
                      show(data) {
                        return data.cellColor.mode === 'byDimension';
                      },
                    },
                    colorSchemeDimension: {
                      ref: 'cellColor.byDimension.scheme',
                      type: 'string',
                      translation: 'properties.colorScheme',
                      component: 'item-selection-list',
                      schemaIgnore: true,
                      show(data) {
                        return data.cellColor.mode === 'byDimension';
                      },
                      defaultValue() {
                        const t = env.sense.theme.getDataColorPalettes()[0];
                        return t ? t.key : '';
                      },
                      items() {
                        return env.sense.theme.getDataColorPalettes().map((p) => ({
                          component: 'color-scale',
                          type: 'classes',
                          translation: p.translation,
                          value: p.key,
                          colors: p.type === 'pyramid' ? p.colors[p.colors.length - 1] : p.colors,
                        }));
                      },
                    },
                  },
                },
                simpleColors: {
                  classification: {
                    section: 'color',
                    tags: ['simple'],
                    exclusive: true,
                  },
                  type: 'items',
                  items: {
                    simpleAuto,
                    colorByDimension,
                  },
                },
                legend: {
                  show: true,
                  type: 'items',
                  items: {
                    show: {
                      ref: 'cellColor.legend.show',
                      type: '_mixed_', // to avoid 'auto' being converted to boolean
                      translation: 'properties.legend.show',
                      component: 'switch',
                      schemaIgnore: true,
                      trueOption: {
                        value: 'auto',
                        translation: 'Common.Auto',
                      },
                      falseOption: {
                        value: false,
                        translation: 'properties.off',
                      },
                    },
                    showTitle: {
                      ref: 'cellColor.legend.showTitle',
                      translation: 'properties.legend.showTitle',
                      type: 'boolean',
                      schemaIgnore: true,
                      show(data) {
                        return data.cellColor.legend.show !== false;
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    support: {
      export: true,
      exportData: true,
      snapshot: true,
      viewData: true,
    },
  };
}
