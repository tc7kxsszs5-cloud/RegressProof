#!/usr/bin/env node

import { loadConfig } from "./config";
import { collectGitContext } from "./git";
import { renderReport } from "./report";
import { createRunReport } from "./run";
import type { ReportFormat } from "./types";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] ?? "run";

  if (command !== "run") {
    throw new Error(`Unsupported command: ${command}`);
  }

  const configArgIndex = args.indexOf("--config");
  const formatArgIndex = args.indexOf("--format");

  const configPath = configArgIndex >= 0 ? args[configArgIndex + 1] : undefined;
  const format = (formatArgIndex >= 0
    ? args[formatArgIndex + 1]
    : undefined) as ReportFormat | undefined;

  const { config } = await loadConfig(configPath);
  const gitContext = await collectGitContext(config.baselineRef);
  const report = createRunReport(config, gitContext);
  const rendered = renderReport(report, format ?? config.reports.defaultFormat);

  process.stdout.write(`${rendered}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof error: ${message}\n`);
  process.exitCode = 1;
});
