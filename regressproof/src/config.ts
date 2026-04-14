import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { RegressProofConfig } from "./types";

export async function loadConfig(
  configPath?: string,
): Promise<{ config: RegressProofConfig; resolvedPath: string }> {
  const resolvedPath = resolve(configPath ?? "regressproof.config.json");
  const raw = await readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(raw) as RegressProofConfig;

  validateConfig(parsed);

  return { config: parsed, resolvedPath };
}

function validateConfig(config: RegressProofConfig): void {
  if (!config.projectName.trim()) {
    throw new Error("Config field `projectName` must not be empty.");
  }

  if (!config.baselineRef.trim()) {
    throw new Error("Config field `baselineRef` must not be empty.");
  }

  if (!Array.isArray(config.checks.quick) || !Array.isArray(config.checks.full)) {
    throw new Error("Config field `checks` must contain `quick` and `full` arrays.");
  }

  if (config.reports.defaultFormat !== "text" && config.reports.defaultFormat !== "json") {
    throw new Error("Config field `reports.defaultFormat` must be `text` or `json`.");
  }
}
