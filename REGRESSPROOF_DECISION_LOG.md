# RegressProof Decision Log

**Date created:** 13 April 2026  
**Purpose:** Preserve major project decisions across future sessions

## Decision 1

**Decision:** The project name is `RegressProof`.

**Reason:** The name reflects the core product promise: proving regressions with evidence rather than guessing.

## Decision 2

**Decision:** The product is positioned as a regression detection and accountability layer, not a guaranteed provider token refund mechanism.

**Reason:** Provider-side refunds cannot be promised universally. Internal credits and cost accountability are technically feasible and honest.

## Decision 3

**Decision:** The first implementation should be GitHub-first.

**Reason:** GitHub gives the most practical shared layer for diffs, PRs, CI, and repository-based verification across many agent workflows.

## Decision 4

**Decision:** Fault attribution must rely on measurable evidence only.

**Reason:** The system must not invent conclusions. It must use baseline comparison, checks, and diff-aware classification.

## Decision 5

**Decision:** The MVP should only auto-credit high-confidence confirmed agent faults.

**Reason:** Conservative decisions protect trust and reduce false positives.

## Decision 6

**Decision:** The initial implementation should prioritize local CLI plus GitHub Action.

**Reason:** This gives the fastest proof-of-function and the broadest early applicability.

## Decision 7

**Decision:** Documentation is the canonical project memory between sessions.

**Reason:** Assistant memory alone is not reliable enough for long-term project continuity. Markdown docs in the repo are the source of truth.

## Decision 8

**Decision:** The first executable RegressProof scaffold is implemented as a plain Node.js CLI runtime inside `regressproof/`, while TypeScript scaffolding remains available for later hardening.

**Reason:** This gives a reliable, runnable MVP foundation immediately and avoids blocking on toolchain issues before baseline and verification logic exist.

## Decision 9

**Decision:** Baseline comparison uses `git archive` snapshots instead of `git worktree` for the first implementation.

**Reason:** Snapshot-based baseline execution is more robust in the current environment and avoids repository write constraints around worktree management.

## Decision 10

**Decision:** The MVP report must explicitly separate `preexistingFailures`, `introducedFailures`, `unchangedFailures`, and `fixedFailures`.

**Reason:** This is necessary to justify future fault attribution and to prove whether a problem existed before the current agent change.

## Decision 11

**Decision:** Failure records in MVP must be structured, not just stored as raw stderr/stdout.

**Reason:** GitHub summaries, CI artifacts, and later fault attribution need normalized fields such as `checkType`, `filePath`, `evidence`, and `touchesChangedFile`.

## Decision 12

**Decision:** CI should fail only on explicitly configured verdict classes, with `confirmed_agent_fault` as the default fail condition.

**Reason:** Preexisting failures and environment issues should be visible in reports without automatically blocking pipelines in the MVP.

## Decision 13

**Decision:** Usage and cost tracking start in MVP as a scaffold with `estimated` mode first, while `exact` mode remains reserved for future provider integrations.

**Reason:** Cost accountability is part of the product promise, but provider-native usage ingestion should not block early regression proof-of-function.

## Decision 14

**Decision:** Large repositories will need a lighter baseline strategy than full snapshot validation for routine runs.

**Reason:** Full baseline snapshots are acceptable for fixtures and small repositories, but heavy repos need path-scoped or lighter validation to stay fast and practical.

## Decision 15

**Decision:** The first real-repository validation path uses `baseline.mode = skip` plus targeted paths for smoke checks.

**Reason:** This gives a practical bridge from fixture-based validation to large repositories without blocking on full path-scoped baseline implementation.

## Decision 16

**Decision:** `path_snapshot` should degrade gracefully to `skip` when requested target paths are not available in the baseline commit.

**Reason:** This is common when RegressProof is added to an existing repository and its files do not yet exist in earlier commits.

## Decision 17

**Decision:** Internal credits are represented in MVP as an explicit report ledger field, triggered by policy rather than external billing integration.

**Reason:** This preserves the accountability model now without blocking on provider-specific refund mechanisms.

## Decision 18

**Decision:** MVP exact usage ingestion should support environment-based activation and env/file sourcing before provider-specific adapters exist.

**Reason:** This gives CI and external agent runners a practical way to inject real usage metadata now without hard-coding provider logic into the core verifier.

## Decision 19

**Decision:** MVP ledger persistence uses append-only JSONL under the artifact directory rather than a database.

**Reason:** JSONL keeps the first storage layer transparent, cheap, portable, and easy to inspect in local runs and CI artifacts.

## Decision 20

**Decision:** GitHub PR integration should update or create one marker-based issue comment instead of posting a new comment on every run.

**Reason:** A single rolling RegressProof comment keeps PR threads readable and makes repeated CI updates practical.
