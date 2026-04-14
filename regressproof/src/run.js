const { enrichFailureRecords, parseFailureRecords } = require("./parser");
const { summarizeUsage } = require("./usage");

async function createRunReport(config, git, verification, repoPath) {
  const failureSummary = summarizeFailures(verification, git);
  const verdict = classifyVerification(verification, git, failureSummary);
  const usage = await summarizeUsage(config, verification, repoPath);
  const creditLedger = summarizeCredits(config, verdict, usage);

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
    usage,
    creditLedger,
    verification,
    failureSummary,
    verdict,
    status: verification.completed ? "verification_complete" : "verification_pending",
    nextStep:
      verification.completed
        ? "Expand fixture coverage and provider-specific usage adapters."
        : "Implement baseline execution and quick-check verification on top of this scaffold.",
  };
}

function summarizeCredits(config, verdict, usage) {
  const enabled = config.credits?.enabled ?? false;
  const policy = config.credits?.policy || "none";

  if (!enabled) {
    return {
      enabled: false,
      policy,
      internalCreditUsd: 0,
      triggered: false,
    };
  }

  const shouldCredit =
    policy === "refund_estimated_cost_on_confirmed_agent_fault" &&
    verdict.classification === "confirmed_agent_fault";

  return {
    enabled: true,
    policy,
    internalCreditUsd: shouldCredit ? usage.estimatedCostUsd : 0,
    triggered: shouldCredit,
  };
}

function summarizeFailures(verification, git) {
  const baselineRecords = enrichFailureRecords(
    verification.baseline.filter((item) => item.exitCode !== 0).flatMap(parseFailureRecords),
    git.changedFiles,
  );
  const currentRecords = enrichFailureRecords(
    verification.current.filter((item) => item.exitCode !== 0).flatMap(parseFailureRecords),
    git.changedFiles,
  );

  const baselineFingerprints = new Set(baselineRecords.map((item) => item.fingerprint));
  const currentFingerprints = new Set(currentRecords.map((item) => item.fingerprint));

  const preexistingFailures = baselineRecords.filter((item) =>
    currentFingerprints.has(item.fingerprint),
  );
  const introducedFailures = currentRecords.filter((item) =>
    !baselineFingerprints.has(item.fingerprint),
  );
  const unchangedFailures = currentRecords.filter((item) =>
    baselineFingerprints.has(item.fingerprint),
  );
  const fixedFailures = baselineRecords.filter((item) =>
    !currentFingerprints.has(item.fingerprint),
  );

  const changedFileMatchedIntroductions = introducedFailures.filter(
    (item) => item.touchesChangedFile,
  );

  return {
    preexistingFailures,
    introducedFailures,
    unchangedFailures,
    fixedFailures,
    metrics: {
      preexistingCount: preexistingFailures.length,
      introducedCount: introducedFailures.length,
      unchangedCount: unchangedFailures.length,
      fixedCount: fixedFailures.length,
      changedFileMatchedIntroducedCount: changedFileMatchedIntroductions.length,
    },
  };
}

function classifyVerification(verification, git, failureSummary) {
  if (!verification.completed) {
    return {
      classification: "verification_pending",
      confidence: "low",
      summary: "Verification has not finished yet.",
      changedFileEvidence: false,
    };
  }

  const baselineFailedItems = verification.baseline.filter((item) => item.exitCode !== 0);
  const currentFailedItems = verification.current.filter((item) => item.exitCode !== 0);
  const baselineWasSkipped = verification.baselineMode === "skip";
  const baselineFailed = baselineFailedItems.length > 0;
  const currentFailed = currentFailedItems.length > 0;
  const anyTimeouts = [...verification.baseline, ...verification.current].some(
    (item) => item.status === "timed_out",
  );
  const introducedFailures = failureSummary.introducedFailures;
  const changedFileMatchedIntroductions = introducedFailures.filter((item) => item.touchesChangedFile);
  const diffMatchedFailure = changedFileMatchedIntroductions.length > 0;

  if (baselineWasSkipped) {
    return {
      classification: currentFailed ? "insufficient_evidence" : "successful_change",
      confidence: currentFailed ? "low" : "medium",
      summary: currentFailed
        ? "Baseline was skipped, so current failures cannot yet be attributed with confidence."
        : "Baseline was skipped and current quick checks passed.",
      changedFileEvidence: false,
    };
  }

  if (anyTimeouts) {
    return {
      classification: "environment_failure",
      confidence: "low",
      summary:
        "At least one quick check timed out, so the result should be retried before fault attribution.",
      changedFileEvidence: false,
    };
  }

  if (!baselineFailed && !currentFailed) {
    return {
      classification: "successful_change",
      confidence: "high",
      summary: "Baseline and current quick checks both passed.",
      changedFileEvidence: false,
    };
  }

  if (!baselineFailed && currentFailed) {
    return {
      classification: "confirmed_agent_fault",
      confidence: diffMatchedFailure ? "high" : "medium",
      summary: diffMatchedFailure
        ? "Baseline quick checks passed, current quick checks introduced a failure, and the failure evidence matches changed files."
        : "Baseline quick checks passed, but current quick checks introduced at least one failure.",
      changedFileEvidence: diffMatchedFailure,
    };
  }

  if (baselineFailed && introducedFailures.length > 0) {
    return {
      classification: "confirmed_agent_fault",
      confidence: diffMatchedFailure ? "high" : "medium",
      summary: diffMatchedFailure
        ? "Baseline already had failures, but the current change introduced additional failures that match changed files."
        : "Baseline already had failures, and the current change introduced additional failures.",
      changedFileEvidence: diffMatchedFailure,
    };
  }

  if (baselineFailed && currentFailed) {
    return {
      classification: "preexisting_failure",
      confidence: diffMatchedFailure ? "medium" : "low",
      summary: diffMatchedFailure
        ? "Baseline already had failures, and no new failure fingerprints were introduced by the current change."
        : "Baseline already had failing quick checks, and current failures do not show new failure fingerprints.",
      changedFileEvidence: diffMatchedFailure,
    };
  }

  if (baselineFailed && !currentFailed) {
    return {
      classification: "successful_change",
      confidence: "high",
      summary: "Current quick checks passed and resolved failures that existed in the baseline snapshot.",
      changedFileEvidence: false,
    };
  }

  return {
    classification: "insufficient_evidence",
    confidence: "low",
    summary:
      "Current quick checks improved or changed compared with baseline, but there is not enough evidence yet for fault attribution.",
    changedFileEvidence: false,
  };
}

module.exports = {
  createRunReport,
};
