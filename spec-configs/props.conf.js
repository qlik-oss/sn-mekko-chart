const fs = require('fs');
const path = require('path');

const f = fs.readFileSync(path.resolve(__dirname, '../src/object-properties.js'), { encoding: 'utf-8' });
const V_RX = /version: '(.+)',/;
const v = V_RX.exec(f);

if (!v) {
  throw new Error('Could not find a version in properties');
}

const pkg = require(path.resolve(__dirname, '../package.json')); // eslint-disable-line

module.exports = {
  glob: ['./src/**/*.js'], // globby patterns to source files
  package: path.resolve(__dirname, '../package.json'),
  api: {
    stability: 'experimental',
    properties: {
      'x-qlik-visibility': 'public',
    },
    visibility: 'public',
    name: `${pkg.name}:properties`,
    version: v[1],
    description: 'Mekko chart generic object definition',
  },
  output: {
    file: path.resolve(__dirname, '../api-specifications/properties.json'),
  },
  parse: {
    types: {
      NxCalcCond: {},
      StringExpression: {},
    },
  },
};
