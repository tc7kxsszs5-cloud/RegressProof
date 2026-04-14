const fs = require("node:fs");

const appSource = fs.readFileSync("src/app.js", "utf8");
const legacySource = fs.readFileSync("src/legacy.js", "utf8");
const failures = [];

if (legacySource.includes("LEGACY_FAIL")) {
  failures.push("typecheck failed in src/legacy.js: found LEGACY_FAIL marker");
}

if (appSource.includes("TYPE_FAIL")) {
  failures.push("typecheck failed in src/app.js: found TYPE_FAIL marker");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("typecheck passed");
