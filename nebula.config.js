const path = require("path");

const { version } = require(path.resolve(__dirname, "./package.json")); // eslint-disable-line

module.exports = {
  serve: {
    renderConfigs: [
      {
        id: "x",
        render: {
          options: {
            renderer: "svg",
          },
          fields: ["Region", "Fiscal Year", "=1"],
        },
      },
    ],
  },
  build: {
    replacementStrings: {
      "process.env.PACKAGE_VERSION": JSON.stringify(version),
    },
  },
};
