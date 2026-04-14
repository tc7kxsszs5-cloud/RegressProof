#!/usr/bin/env node

const { appendFile, mkdir, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { loadConfig } = require("./config");
const { collectGitContext } = require("./git");
const { appendLedgerEntry } = require("./ledger");
const {
  renderMarkdownSummary,
  renderPullRequestComment,
  renderPullRequestSummary,
  renderReport,
} = require("./report");
const { createRunReport } = require("./run");
const { executeVerificationFlow } = require("./verify");

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ?? "run";

  if (command !== "run") {
    throw new Error(`Unsupported command: ${command}`);
  }

  const configArgIndex = args.indexOf("--config");
  const formatArgIndex = args.indexOf("--format");
  const repoArgIndex = args.indexOf("--repo");
  const artifactDirArgIndex = args.indexOf("--artifact-dir");
  const ciMode = args.includes("--ci");

  const configPath = configArgIndex >= 0 ? args[configArgIndex + 1] : undefined;
  const format = formatArgIndex >= 0 ? args[formatArgIndex + 1] : undefined;
  const repoPath = repoArgIndex >= 0 ? args[repoArgIndex + 1] : process.cwd();
  const artifactDir =
    artifactDirArgIndex >= 0
      ? args[artifactDirArgIndex + 1]
      : path.join(process.cwd(), "artifacts");

  const { config } = await loadConfig(configPath, repoPath);
  const gitContext = await collectGitContext(config.baselineRef, repoPath, config);
  const verification = await executeVerificationFlow(config, gitContext);
  const report = await createRunReport(config, gitContext, verification, repoPath);
  const artifactPaths = await writeArtifacts(report, artifactDir);
  const ledgerPath = await appendLedgerEntry(report, config, artifactDir);
  if (ledgerPath) {
    artifactPaths.ledgerPath = ledgerPath;
  }
  const rendered = renderReport(report, format ?? config.reports.defaultFormat);
  await writeGithubStepSummary(report);
  await writeGithubOutputs(report, artifactPaths, config);

  process.stdout.write(`${rendered}\n`);

  if (ciMode && shouldFailCi(report, config)) {
    process.exitCode = 2;
  }
}

async function writeArtifacts(report, artifactDir) {
  await mkdir(artifactDir, { recursive: true });

  const jsonPath = path.join(artifactDir, "regressproof-report.json");
  const markdownPath = path.join(artifactDir, "regressproof-summary.md");
  const prMarkdownPath = path.join(artifactDir, "regressproof-pr-summary.md");
  const prCommentPath = path.join(artifactDir, "regressproof-pr-comment.md");

  await writeFile(jsonPath, JSON.stringify(report, null, 2));
  await writeFile(markdownPath, renderMarkdownSummary(report));
  await writeFile(prMarkdownPath, renderPullRequestSummary(report));
  await writeFile(prCommentPath, renderPullRequestComment(report));

  return {
    jsonPath,
    markdownPath,
    prMarkdownPath,
    prCommentPath,
  };
}

async function writeGithubStepSummary(report) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }

  await appendFile(summaryPath, `${renderMarkdownSummary(report)}\n`);
}

function shouldFailCi(report, config) {
  const ciFailOn = config.reports.ciFailOn || ["confirmed_agent_fault"];
  return ciFailOn.includes(report.verdict.classification);
}

async function writeGithubOutputs(report, artifactPaths, config) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    return;
  }

  const ciShouldFail = shouldFailCi(report, config) ? "true" : "false";
  const lines = [
    `verdict=${report.verdict.classification}`,
    `confidence=${report.verdict.confidence}`,
    `changed_file_match=${report.verdict.changedFileEvidence ? "true" : "false"}`,
    `ci_should_fail=${ciShouldFail}`,
    `usage_mode=${report.usage.mode}`,
    `exact_usage_available=${report.usage.exactUsageAvailable ? "true" : "false"}`,
    `estimated_cost_usd=${report.usage.estimatedCostUsd}`,
    `internal_credit_usd=${report.creditLedger.internalCreditUsd}`,
    `report_json=${artifactPaths.jsonPath}`,
    `report_markdown=${artifactPaths.markdownPath}`,
    `report_pr_markdown=${artifactPaths.prMarkdownPath}`,
    `report_pr_comment=${artifactPaths.prCommentPath}`,
  ];

  if (artifactPaths.ledgerPath) {
    lines.push(`ledger_path=${artifactPaths.ledgerPath}`);
  }

  await appendFile(outputPath, `${lines.join("\n")}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof error: ${message}\n`);
  process.exitCode = 1;
});
