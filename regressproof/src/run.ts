import type { RegressProofConfig, RunReport } from "./types";
import type { GitContext } from "./types";

export function createRunReport(
  config: RegressProofConfig,
  git: GitContext,
): RunReport {
  return {
    product: "RegressProof",
    version: "0.1.0",
    projectName: config.projectName,
    timestamp: new Date().toISOString(),
    git,
    checks: {
      quick: config.checks.quick,
      full: config.checks.full,
    },
    status: "scaffold_ready",
    nextStep:
      "Implement baseline execution and quick-check verification on top of this scaffold.",
  };
}
