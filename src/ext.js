export default {
  definition: {
    type: 'items',
    component: 'accordion',
    items: {
      data: {
        uses: 'data',
      },
      sorting: {
        uses: 'sorting',
      },
      settings: {
        uses: 'settings',
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
