#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const globby = require('globby');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const vars = require('./merge-all-locale')();

const ids = {};
Object.keys(vars).forEach((key) => {
  ids[vars[key].id] = key;
});

const used = [];
const warnings = {};
let errors = 0;

const warn = (s) => console.warn(`\x1b[43m\x1b[30m WARN \x1b[0m \x1b[1m\x1b[33m ${s}\x1b[0m`);
const err = (s) => console.error(`\x1b[41m\x1b[30m ERR  \x1b[0m \x1b[1m\x1b[31m ${s}\x1b[0m`);

function useString(id) {
  if (used.indexOf(id) !== -1) {
    return;
  }

  used.push(id);

  if (typeof ids[id] === 'undefined') {
    err(`String '${id}' does not exist in locale registry`);
    errors++;
  }
}

const validateFile = (file) => {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
  });
  traverse(ast, {
    CallExpression(nodePath) {
      if (!nodePath.get('callee').isMemberExpression()) {
        return;
      }
      if (
        nodePath.node.callee.object &&
        nodePath.node.callee.object.name === 'translator' &&
        nodePath.node.callee.property &&
        nodePath.node.callee.property.name === 'get'
      ) {
        const { type, value } = nodePath.node.arguments[0];
        if (type === 'StringLiteral') {
          useString(value, nodePath);
        } else {
          const s = `${file}:${nodePath.node.loc.start.line}:${nodePath.node.loc.start.column}`;
          if (!warnings[s]) {
            warnings[s] = true;
            warn(`Could not verify used string at ${s}`);
          }
        }
      }
    },
  });
};

const validate = () => {
  const SRC_FOLDER = path.resolve(__dirname, '../src');
  const sourceFiles = globby.sync([`${SRC_FOLDER}/**/*.js`, `!${SRC_FOLDER}/**/*.spec.js`]);

  sourceFiles.forEach((file) => validateFile(file));

  if (errors > 0) {
    process.exitCode = 1;
  }
};

validate();
