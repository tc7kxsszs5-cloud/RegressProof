function renderReport(report, format) {
  if (format === "json") {
    return JSON.stringify(report, null, 2);
  }

  const changedFiles =
    report.git.changedFiles.length > 0
      ? report.git.changedFiles.map((file) => `  - ${file}`).join("\n")
      : "  - none detected";

  const quickChecks = report.checks.quick.map((check) => `  - ${check}`).join("\n");
  const fullChecks = report.checks.full.map((check) => `  - ${check}`).join("\n");
  const baselineResults = report.verification.baseline
    .map(
      (item) =>
        `  - [${item.status}] ${item.command} (${item.durationMs}ms, exit=${item.exitCode})`,
    )
    .join("\n");
  const currentResults = report.verification.current
    .map(
      (item) =>
        `  - [${item.status}] ${item.command} (${item.durationMs}ms, exit=${item.exitCode})`,
    )
    .join("\n");
  const preexistingFailures = formatFailureList(report.failureSummary.preexistingFailures);
  const introducedFailures = formatFailureList(report.failureSummary.introducedFailures);
  const unchangedFailures = formatFailureList(report.failureSummary.unchangedFailures);
  const fixedFailures = formatFailureList(report.failureSummary.fixedFailures);

  return [
    "RegressProof",
    `Project: ${report.projectName}`,
    `Timestamp: ${report.timestamp}`,
    `Status: ${report.status}`,
    `Verdict: ${report.verdict.classification} (${report.verdict.confidence})`,
    `Usage Mode: ${report.usage.mode}`,
    `Estimated Cost USD: ${report.usage.estimatedCostUsd}`,
    `Internal Credit USD: ${report.creditLedger.internalCreditUsd}`,
    `Evidence: ${report.verdict.summary}`,
    `Changed File Match: ${report.verdict.changedFileEvidence ? "yes" : "no"}`,
    "",
    "Git Context:",
    `  - repoRoot: ${report.git.repoRoot}`,
    `  - branch: ${report.git.currentBranch}`,
    `  - headCommit: ${report.git.headCommit}`,
    `  - baselineRef: ${report.git.baselineRef}`,
    "  - changedFiles:",
    changedFiles,
    "",
    "Quick Checks:",
    quickChecks,
    "",
    "Full Checks:",
    fullChecks,
    "",
    "Baseline Quick Results:",
    baselineResults,
    "",
    "Current Quick Results:",
    currentResults,
    "",
    "Preexisting Failures:",
    preexistingFailures,
    "",
    "Introduced Failures:",
    introducedFailures,
    "",
    "Unchanged Failures:",
    unchangedFailures,
    "",
    "Fixed Failures:",
    fixedFailures,
    "",
    `Next Step: ${report.nextStep}`,
  ].join("\n");
}

function formatFailureList(items) {
  if (!items || items.length === 0) {
    return "  - none";
  }

  return items
    .map((item) => {
      const fileSuffix = item.filePath ? ` file=${item.filePath}` : "";
      const typeSuffix = item.checkType ? ` type=${item.checkType}` : "";
      const changedSuffix = ` changedFileMatch=${item.changedFileMatchKind || "none"}`;
      const matchedFilesSuffix =
        item.matchedChangedFiles && item.matchedChangedFiles.length > 0
          ? ` matched=${item.matchedChangedFiles.join(",")}`
          : "";
      return `  - ${item.command} [${item.status}] exit=${item.exitCode}${typeSuffix}${fileSuffix}${changedSuffix}${matchedFilesSuffix}`;
    })
    .join("\n");
}

function renderMarkdownSummary(report) {
  const changedFiles =
    report.git.changedFiles.length > 0
      ? report.git.changedFiles.map((file) => `- \`${file}\``).join("\n")
      : "- none";

  const introducedFailures = formatFailureList(report.failureSummary.introducedFailures)
    .replace(/^  - /gm, "- ");
  const preexistingFailures = formatFailureList(report.failureSummary.preexistingFailures)
    .replace(/^  - /gm, "- ");
  const unchangedFailures = formatFailureList(report.failureSummary.unchangedFailures)
    .replace(/^  - /gm, "- ");
  const fixedFailures = formatFailureList(report.failureSummary.fixedFailures)
    .replace(/^  - /gm, "- ");

  return [
    "# RegressProof Summary",
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Project | \`${report.projectName}\` |`,
    `| Status | \`${report.status}\` |`,
    `| Verdict | \`${report.verdict.classification}\` |`,
    `| Confidence | \`${report.verdict.confidence}\` |`,
    `| Usage mode | \`${report.usage.mode}\` |`,
    `| Estimated cost USD | \`${report.usage.estimatedCostUsd}\` |`,
    `| Credit triggered | \`${report.creditLedger.triggered ? "yes" : "no"}\` |`,
    `| Internal credit USD | \`${report.creditLedger.internalCreditUsd}\` |`,
    `| Changed file match | \`${report.verdict.changedFileEvidence ? "yes" : "no"}\` |`,
    `| Introduced failures | \`${report.failureSummary.metrics.introducedCount}\` |`,
    `| Changed-file matched introductions | \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\` |`,
    "",
    "## Evidence",
    "",
    report.verdict.summary,
    "",
    "## Changed Files",
    "",
    changedFiles,
    "",
    "## Introduced Failures",
    "",
    introducedFailures,
    "",
    "## Preexisting Failures",
    "",
    preexistingFailures,
    "",
    "## Unchanged Failures",
    "",
    unchangedFailures,
    "",
    "## Fixed Failures",
    "",
    fixedFailures,
    "",
    "## Next Step",
    "",
    report.nextStep,
    "",
  ].join("\n");
}

function renderPullRequestSummary(report) {
  const introducedFailuresCount = report.failureSummary.introducedFailures.length;
  const preexistingFailuresCount = report.failureSummary.preexistingFailures.length;
  const unchangedFailuresCount = report.failureSummary.unchangedFailures.length;
  const fixedFailuresCount = report.failureSummary.fixedFailures.length;

  return [
    "## RegressProof Verdict",
    "",
    `- Verdict: \`${report.verdict.classification}\``,
    `- Confidence: \`${report.verdict.confidence}\``,
    `- Changed file match: \`${report.verdict.changedFileEvidence ? "yes" : "no"}\``,
    `- Estimated cost USD: \`${report.usage.estimatedCostUsd}\``,
    `- Internal credit USD: \`${report.creditLedger.internalCreditUsd}\``,
    `- Introduced failures: \`${introducedFailuresCount}\``,
    `- Changed-file matched introductions: \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\``,
    `- Preexisting failures: \`${preexistingFailuresCount}\``,
    `- Unchanged failures: \`${unchangedFailuresCount}\``,
    `- Fixed failures: \`${fixedFailuresCount}\``,
    "",
    report.verdict.summary,
    "",
  ].join("\n");
}

function renderPullRequestComment(report) {
  return [
    "<!-- regressproof-comment -->",
    "## RegressProof Review",
    "",
    `**Verdict:** \`${report.verdict.classification}\``,
    `**Confidence:** \`${report.verdict.confidence}\``,
    `**Estimated cost:** \`$${report.usage.estimatedCostUsd}\``,
    `**Internal credit:** \`$${report.creditLedger.internalCreditUsd}\``,
    `**Introduced failures:** \`${report.failureSummary.metrics.introducedCount}\``,
    `**Changed-file matched introductions:** \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\``,
    "",
    report.verdict.summary,
    "",
    "### Introduced Failures",
    "",
    formatFailureList(report.failureSummary.introducedFailures).replace(/^  - /gm, "- "),
    "",
    "### Preexisting Failures",
    "",
    formatFailureList(report.failureSummary.preexistingFailures).replace(/^  - /gm, "- "),
    "",
  ].join("\n");
}

module.exports = {
  renderReport,
  renderMarkdownSummary,
  renderPullRequestComment,
  renderPullRequestSummary,
};
