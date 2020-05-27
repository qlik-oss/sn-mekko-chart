export default ({ flags, translator }) => ({
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 2,
        max: 2,
        description: (properties, index) => {
          if (flags.isEnabled('REQ_LABELS')) {
            return index === 0
              ? translator.get('Visualizations.Descriptions.Column')
              : translator.get('Visualizations.Descriptions.Cells');
          }
          return '';
        },
      },
      measures: {
        min: 1,
        max: 1,
        description: () => {
          if (flags.isEnabled('REQ_LABELS')) {
            return translator.get('Visualizations.Descriptions.Size');
          }
          return '';
        },
      },
    },
  ],
});
