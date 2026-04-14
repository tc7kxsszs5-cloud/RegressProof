export type ReportFormat = "text" | "json";

export interface RegressProofConfig {
  projectName: string;
  baselineRef: string;
  checks: {
    quick: string[];
    full: string[];
  };
  reports: {
    defaultFormat: ReportFormat;
  };
}

export interface GitContext {
  repoRoot: string;
  currentBranch: string;
  headCommit: string;
  baselineRef: string;
  changedFiles: string[];
}

export interface RunReport {
  product: "RegressProof";
  version: string;
  projectName: string;
  timestamp: string;
  git: GitContext;
  checks: {
    quick: string[];
    full: string[];
  };
  status:
    | "scaffold_ready"
    | "baseline_pending"
    | "verification_pending";
  nextStep: string;
}
