const { readFile } = require("node:fs/promises");
const path = require("node:path");

async function summarizeUsage(config, verification, repoPath) {
  const mode = resolveUsageMode(config);

  if (mode === "none") {
    return {
      mode,
      estimatedCostUsd: 0,
      exactUsageAvailable: false,
      promptTokens: 0,
      completionTokens: 0,
      cachedTokens: 0,
    };
  }

  if (mode === "exact") {
    const exact = await loadExactUsage(config, repoPath);
    return {
      mode,
      estimatedCostUsd: exact.costUsd,
      exactUsageAvailable: true,
      promptTokens: exact.promptTokens,
      completionTokens: exact.completionTokens,
      cachedTokens: exact.cachedTokens,
    };
  }

  return {
    mode: "estimated",
    estimatedCostUsd: config.usage?.estimatedCostUsd ?? estimateCost(verification),
    exactUsageAvailable: false,
    promptTokens: 0,
    completionTokens: 0,
    cachedTokens: 0,
  };
}

async function loadExactUsage(config, repoPath) {
  const source = resolveExactUsageSource(config);

  if (source === "env") {
    const promptTokens = toNumber(process.env.REGRESSPROOF_PROMPT_TOKENS);
    const completionTokens = toNumber(process.env.REGRESSPROOF_COMPLETION_TOKENS);
    const cachedTokens = toNumber(process.env.REGRESSPROOF_CACHED_TOKENS);
    const costUsd = toNumber(process.env.REGRESSPROOF_COST_USD);

    return { promptTokens, completionTokens, cachedTokens, costUsd };
  }

  if (source === "file" && config.usage?.exact?.filePath) {
    const resolvedPath = path.resolve(repoPath, config.usage.exact.filePath);
    const raw = await readFile(resolvedPath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      promptTokens: toNumber(parsed.promptTokens),
      completionTokens: toNumber(parsed.completionTokens),
      cachedTokens: toNumber(parsed.cachedTokens),
      costUsd: toNumber(parsed.costUsd),
    };
  }

  throw new Error(
    "Exact usage mode requires `usage.exact.source` of `env` or `file` with valid inputs.",
  );
}

function resolveUsageMode(config) {
  const envMode = process.env.REGRESSPROOF_USAGE_MODE;
  if (["none", "estimated", "exact"].includes(envMode)) {
    return envMode;
  }

  return config.usage?.mode || "estimated";
}

function resolveExactUsageSource(config) {
  const envSource = process.env.REGRESSPROOF_EXACT_USAGE_SOURCE;
  if (["env", "file"].includes(envSource)) {
    return envSource;
  }

  return config.usage?.exact?.source || "env";
}

function estimateCost(verification) {
  const totalChecks = verification.baseline.length + verification.current.length;
  return Number((totalChecks * 0.0025).toFixed(4));
}

function toNumber(value) {
  const normalized = Number(value || 0);
  if (!Number.isFinite(normalized) || normalized < 0) {
    return 0;
  }

  return normalized;
}

module.exports = {
  summarizeUsage,
};
