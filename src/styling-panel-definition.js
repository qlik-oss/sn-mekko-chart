const getStylingPanelDefinition = (bkgOptionsEnabled) => ({
  component: 'styling-panel',
  chartTitle: 'Object.MekkoChart',
  translation: 'LayerStyleEditor.component.styling',
  subtitle: 'LayerStyleEditor.component.styling',
  ref: 'components',
  useGeneral: true,
  useBackground: bkgOptionsEnabled,
});

export default getStylingPanelDefinition;
