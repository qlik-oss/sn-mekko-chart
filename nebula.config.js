module.exports = {
  serve: {
    renderConfigs: [
      {
        id: 'x',
        render: {
          options: {
            renderer: 'svg',
          },
          fields: ['Region', 'Fiscal Year', '=1'],
        },
      },
    ],
  },
};
