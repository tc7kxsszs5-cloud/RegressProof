const { appendFile, mkdir } = require("node:fs/promises");
const path = require("node:path");

async function appendLedgerEntry(report, config, artifactDir) {
  const ledgerConfig = config.ledger || {};
  const enabled = ledgerConfig.enabled !== false;
  if (!enabled) {
    return null;
  }

  const ledgerDir = path.resolve(
    artifactDir,
    ledgerConfig.directory || ".regressproof-ledger",
  );
  const ledgerPath = path.join(ledgerDir, ledgerConfig.fileName || "runs.jsonl");

  await mkdir(ledgerDir, { recursive: true });

  const entry = {
    timestamp: report.timestamp,
    projectName: report.projectName,
    repoRoot: report.git.repoRoot,
    headCommit: report.git.headCommit,
    verdict: report.verdict.classification,
    confidence: report.verdict.confidence,
    estimatedCostUsd: report.usage.estimatedCostUsd,
    internalCreditUsd: report.creditLedger.internalCreditUsd,
    introducedFailures: report.failureSummary.introducedFailures.length,
    preexistingFailures: report.failureSummary.preexistingFailures.length,
  };

  await appendFile(ledgerPath, `${JSON.stringify(entry)}\n`);
  return ledgerPath;
}

module.exports = {
  appendLedgerEntry,
};
