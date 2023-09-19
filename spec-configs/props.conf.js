const path = require("path");

const pkg = require(path.resolve(__dirname, "../package.json")); // eslint-disable-line

module.exports = {
  fromJsdoc: {
    glob: ["./src/object-properties.js", "./src/coloring/index.js", "./src/coloring/byDimension.js"],
    package: path.resolve(__dirname, "../package.json"),
    api: {
      stability: "stable",
      properties: {
        "x-qlik-visibility": "public",
      },
      visibility: "public",
      name: `${pkg.name}:properties`,
      version: pkg.version,
      description: "Mekko chart generic object definition",
    },
    output: {
      file: path.resolve(__dirname, "../api-specifications/properties.json"),
    },
    parse: {
      types: {
        "EngineAPI.StringExpression": {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FStringExpression",
        },
        "EngineAPI.HyperCubeDef": {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FListObjectDef",
        },
      },
    },
  },
};
