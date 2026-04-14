const { readFile } = require("node:fs/promises");
const { resolve } = require("node:path");

async function loadConfig(configPath, repoPath) {
  const resolvedPath = resolve(repoPath ?? process.cwd(), configPath ?? "regressproof.config.json");
  const raw = await readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(raw);

  validateConfig(parsed);

  return { config: parsed, resolvedPath };
}

function validateConfig(config) {
  if (!config.projectName || !config.projectName.trim()) {
    throw new Error("Config field `projectName` must not be empty.");
  }

  if (!config.baselineRef || !config.baselineRef.trim()) {
    throw new Error("Config field `baselineRef` must not be empty.");
  }

  if (config.baseline) {
    const validBaselineModes = ["full_snapshot", "path_snapshot", "skip"];
    if (config.baseline.mode && !validBaselineModes.includes(config.baseline.mode)) {
      throw new Error(
        "Config field `baseline.mode` must be `full_snapshot`, `path_snapshot`, or `skip`.",
      );
    }
  }

  if (config.targetPaths !== undefined && !Array.isArray(config.targetPaths)) {
    throw new Error("Config field `targetPaths` must be an array when provided.");
  }

  if (config.baseline?.supportPaths !== undefined && !Array.isArray(config.baseline.supportPaths)) {
    throw new Error("Config field `baseline.supportPaths` must be an array when provided.");
  }

  if (!config.checks || !Array.isArray(config.checks.quick) || !Array.isArray(config.checks.full)) {
    throw new Error("Config field `checks` must contain `quick` and `full` arrays.");
  }

  if (
    config.checks.commandTimeoutMs !== undefined &&
    (!Number.isFinite(config.checks.commandTimeoutMs) || config.checks.commandTimeoutMs <= 0)
  ) {
    throw new Error("Config field `checks.commandTimeoutMs` must be a positive number.");
  }

  if (!config.reports || !["text", "json"].includes(config.reports.defaultFormat)) {
    throw new Error("Config field `reports.defaultFormat` must be `text` or `json`.");
  }

  if (
    config.reports.ciFailOn !== undefined &&
    !Array.isArray(config.reports.ciFailOn)
  ) {
    throw new Error("Config field `reports.ciFailOn` must be an array when provided.");
  }

  if (config.usage) {
    const validModes = ["none", "estimated", "exact"];
    if (config.usage.mode && !validModes.includes(config.usage.mode)) {
      throw new Error("Config field `usage.mode` must be `none`, `estimated`, or `exact`.");
    }

    if (
      config.usage.estimatedCostUsd !== undefined &&
      (!Number.isFinite(config.usage.estimatedCostUsd) || config.usage.estimatedCostUsd < 0)
    ) {
      throw new Error("Config field `usage.estimatedCostUsd` must be a non-negative number.");
    }

    if (
      config.usage.exact?.source !== undefined &&
      !["env", "file"].includes(config.usage.exact.source)
    ) {
      throw new Error("Config field `usage.exact.source` must be `env` or `file`.");
    }
  }

  if (config.credits) {
    if (config.credits.enabled !== undefined && typeof config.credits.enabled !== "boolean") {
      throw new Error("Config field `credits.enabled` must be a boolean when provided.");
    }
  }

  if (config.ledger?.enabled !== undefined && typeof config.ledger.enabled !== "boolean") {
    throw new Error("Config field `ledger.enabled` must be a boolean when provided.");
  }
}

module.exports = {
  loadConfig,
};
