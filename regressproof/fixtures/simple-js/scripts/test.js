const fs = require("node:fs");

const source = fs.readFileSync("src/app.js", "utf8");

if (source.includes("TEST_FAIL")) {
  console.error("test failed in src/app.js: found TEST_FAIL marker");
  process.exit(1);
}

console.log("test passed");
