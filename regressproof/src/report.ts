import type { ReportFormat, RunReport } from "./types";

export function renderReport(report: RunReport, format: ReportFormat): string {
  if (format === "json") {
    return JSON.stringify(report, null, 2);
  }

  const changedFiles =
    report.git.changedFiles.length > 0
      ? report.git.changedFiles.map((file) => `  - ${file}`).join("\n")
      : "  - none detected";

  const quickChecks = report.checks.quick.map((check) => `  - ${check}`).join("\n");
  const fullChecks = report.checks.full.map((check) => `  - ${check}`).join("\n");

  return [
    "RegressProof",
    `Project: ${report.projectName}`,
    `Timestamp: ${report.timestamp}`,
    `Status: ${report.status}`,
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
    `Next Step: ${report.nextStep}`,
  ].join("\n");
}
