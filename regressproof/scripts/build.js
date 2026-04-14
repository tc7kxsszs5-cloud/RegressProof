const { cp, mkdir, rm } = require("node:fs/promises");
const { resolve } = require("node:path");

async function main() {
  const root = process.cwd();
  const srcDir = resolve(root, "src");
  const distDir = resolve(root, "dist");

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  await cp(srcDir, distDir, { recursive: true });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Build failed: ${message}\n`);
  process.exitCode = 1;
});
