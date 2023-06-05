export default ({ translator }) => ({
  targets: [
    {
      path: "/qHyperCubeDef",
      dimensions: {
        min: 2,
        max: 2,
        description: (properties, index) => (index === 0 ? translator.get("Column") : translator.get("Cells")),
      },
      measures: {
        min: 1,
        max: 1,
        description: () => translator.get("Size"),
      },
    },
  ],
});
