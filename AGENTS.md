# AGENTS.md

This repository contains planning and future implementation work for `RegressProof`.

## Project Identity

- Product name: `RegressProof`
- Core promise: `Proof, not guesses, for agent-caused regressions.`
- Category: AI coding regression detection and credit accountability system

## Primary Goal

Agents working in this repository should preserve and extend the `RegressProof` concept as documented in the repo.

The project is centered on:

- detecting measurable agent-caused regressions
- comparing baseline vs post-change verification results
- connecting failures to diffs, commits, and PRs
- tracking token usage or estimated spend
- maintaining an internal credit ledger for confirmed faults

## Source Of Truth

When resuming work, read these files first:

1. `docs/REGRESSPROOF_INDEX.md`
2. `docs/REGRESSPROOF_PRODUCT_BRIEF.md`
3. `docs/REGRESSPROOF_SPEC.md`
4. `docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md`
5. `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md`
6. `docs/REGRESSPROOF_VALIDATION_PLAN.md`
7. `docs/REGRESSPROOF_DECISION_LOG.md`

These documents are the canonical memory for the project. Do not rely on transient chat context alone.

## Working Rules

- Do not reframe the product as a guaranteed universal token refund system.
- Keep the product positioned as a proof-based regression detection and accountability layer.
- Prefer conservative, evidence-based claims over ambitious but unverified claims.
- Treat baseline comparison, verification evidence, and confidence scoring as core design constraints.
- Preserve the distinction between:
  - `confirmed_agent_fault`
  - `possible_agent_fault`
  - `preexisting_failure`
  - `environment_failure`
  - `insufficient_evidence`

## Implementation Direction

Near-term implementation should prioritize:

- local CLI
- GitHub Action
- baseline engine
- verification engine
- diff mapping
- fault classifier
- internal cost and credit ledger

Do not prioritize dashboards or provider-specific native integrations before the MVP detection workflow is proven.

## Documentation Rule

When making meaningful project changes:

- update the relevant `docs/REGRESSPROOF_*.md` file
- add major architectural decisions to `docs/REGRESSPROOF_DECISION_LOG.md`
- keep `docs/REGRESSPROOF_INDEX.md` current if document structure changes

## Naming Rule

Use `RegressProof` consistently in docs, plans, and future code unless an explicit renaming decision is recorded in the decision log.
