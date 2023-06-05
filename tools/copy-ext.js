/* eslint-disable no-console */
const path = require("path");
const os = require("os");
const fs = require("fs-extra");

function copyExt() {
  const targetPath = [os.homedir(), "Qlik", "Sense", "Extensions", "sn-mekko-chart-ext"];
  if (os.platform() === "win32") {
    targetPath.splice(1, 0, "Documents");
  }

  const target = path.resolve(...targetPath);

  fs.copySync(path.resolve(process.cwd(), "sn-mekko-chart-ext"), target);
  console.log("Copied into Extensions folder!");
}

if (require.main === module) {
  // execute if running directly from CLI
  copyExt();
}

module.exports = copyExt;
