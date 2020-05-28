export default ({ translator }) => ({
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 2,
        max: 2,
        description: (properties, index) => {
          return index === 0
            ? translator.get('Visualizations.Descriptions.Column')
            : translator.get('Visualizations.Descriptions.Cells');
        },
      },
      measures: {
        min: 1,
        max: 1,
        description: () => {
            return translator.get('Visualizations.Descriptions.Size');
        },
      },
    },
  ],
});
