import coloring from './coloring';
import theme from './theme';

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
            colorsAndLegend: {
              type: 'items',
              translation: 'properties.colorsAndLegend',
              items: {
                coloring: {
                  type: 'items',
                  items: {
                    auto: {
                      ref: 'color.mode',
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
                      change(data, handler, properties) {
                        // TODO - store old value
                        const c = coloring({
                          properties,
                        });
                        c.colorBy({
                          mode: data.color.mode === 'auto' ? 'auto' : 'byDimension',
                        });
                      },
                    },
                    dimensionDropdown: {
                      component: 'color-by-dropdown',
                      libraryItemType: 'dimension',
                      ref: 'color.byDimension',
                      defaultValue: {},
                      show(data) {
                        return data.color.mode === 'byDimension';
                      },
                      change() {}, // needed to avoid error thrown in 'color-by-dropdown'
                      convertFunctions: {
                        get(getter, def, args) {
                          const c = args.properties.color.byDimension || {};
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
                      ref: 'color.byDimension.label',
                      schemaIgnore: true,
                      translation: 'Common.Label',
                      expression: 'optional',
                      show(data) {
                        return data.color.mode === 'byDimension' && data.color.byDimension && data.color.byDimension.type === 'expression';
                      },
                    },
                    persistentColors: {
                      ref: 'color.byDimension.persistent',
                      translation: 'properties.colorPersistence',
                      type: 'boolean',
                      schemaIgnore: true,
                      show(data) {
                        return data.color.mode === 'byDimension';
                      },
                    },
                    colorSchemeDimension: {
                      ref: 'color.byDimension.scheme',
                      type: 'string',
                      translation: 'properties.colorScheme',
                      component: 'item-selection-list',
                      schemaIgnore: true,
                      show(data) {
                        return data.color.mode === 'byDimension';
                      },
                      defaultValue() {
                        const t = theme(env.Theme ? env.Theme.getCurrent().properties : {}).dataPalettes()[0];
                        return t ? t.key : '';
                      },
                      items() {
                        const t = theme(env.Theme ? env.Theme.getCurrent().properties : {});
                        return t.dataPalettes().map(p => ({
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
                legend: {
                  show: true,
                  type: 'items',
                  items: {
                    show: {
                      ref: 'color.legend.show',
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
                      ref: 'color.legend.showTitle',
                      translation: 'properties.legend.showTitle',
                      type: 'boolean',
                      schemaIgnore: true,
                      show(data) {
                        return data.color.legend.show !== false;
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
      exortData: true,
      snapshot: true,
      viewData: true,
    },
  };
}
