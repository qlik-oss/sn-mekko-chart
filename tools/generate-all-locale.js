#! /usr/bin/env node

const fs = require("fs");
const path = require("path");

const merged = require("./merge-all-locale")();

const LOCALE_PKG_DIR = path.resolve(__dirname, "../locales");
const ALL = path.resolve(`${LOCALE_PKG_DIR}`, "all.js");

fs.writeFileSync(
  ALL,
  `
const x = ${JSON.stringify(merged, " ", 2)};

export {
  x as default
};
`
);
