module.exports = {
  glob: ['./src/**/*.js'], // globby patterns to source files
  package: './package.json', // path to package.json
  output: {
    file: 'spec.json',
  },
  parse: {
    types: {
      NxCalcCond: {},
      StringExpression: {},
    },
  },
};
