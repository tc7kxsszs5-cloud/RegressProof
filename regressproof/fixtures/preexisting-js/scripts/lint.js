const fs = require("node:fs");

const source = fs.readFileSync("src/app.js", "utf8");

if (source.includes("LINT_FAIL")) {
  console.error("lint failed in src/app.js: found LINT_FAIL marker");
  process.exit(1);
}

console.log("lint passed");
