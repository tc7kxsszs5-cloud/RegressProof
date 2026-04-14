const fs = require("node:fs");

const source = fs.readFileSync("src/app.js", "utf8");

if (source.includes("TYPE_FAIL")) {
  console.error("typecheck failed in src/app.js: found TYPE_FAIL marker");
  process.exit(1);
}

console.log("typecheck passed");
