# RegressProof Project Index

> Legacy repository notice: the active canonical repository is [RegressProof-cli](https://github.com/tc7kxsszs5-cloud/RegressProof-cli). Treat this repository as historical prototype context only.

**Project:** `RegressProof`  
**Purpose:** Persistent project memory and navigation entry point  
**Last updated:** 14 April 2026

## Vision

RegressProof is a validation and accountability layer for AI coding agents.

It is designed to:

- detect measurable agent-caused regressions
- compare baseline vs post-change verification results
- connect failures to patches, commits, and PRs
- track token usage or estimated cost
- maintain an internal credit ledger for confirmed agent-caused faults

Core principle:

`proof, not guesses`

## Current Document Set

- [Product Brief](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_PRODUCT_BRIEF.md)
- [Specification](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_SPEC.md)
- [Implementation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md)
- [MVP Task Breakdown](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md)
- [Validation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_VALIDATION_PLAN.md)
- [Decision Log](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_DECISION_LOG.md)

## Current Implementation Status

Implementation has started.

Current code scaffold lives in:

- [regressproof/README.md](/Users/mac/Desktop/rork-kiku/regressproof/README.md)
- [regressproof/package.json](/Users/mac/Desktop/rork-kiku/regressproof/package.json)
- [regressproof/regressproof.config.json](/Users/mac/Desktop/rork-kiku/regressproof/regressproof.config.json)
- [regressproof/src/cli.js](/Users/mac/Desktop/rork-kiku/regressproof/src/cli.js)

What already works:

- local CLI entrypoint
- config loading
- git context collection
- structured report generation
- build script that prepares `dist/`
- baseline snapshot execution
- current quick-check execution
- first conservative verdicts
- fixture repos for introduced and preexisting failures
- explicit `preexistingFailures`, `introducedFailures`, `unchangedFailures`, and `fixedFailures`
- fingerprint-based failure comparison, so one failing command can still be split into preexisting and newly introduced failures
- timeout-aware environment classification
- structured failure parsing with:
  - `checkType`
  - `filePath`
  - `evidence`
  - `touchesChangedFile`
  - `changedFileMatchKind`
  - `matchedChangedFiles`
- JSON and Markdown artifact generation for CI workflows
- initial GitHub Action skeleton at `.github/workflows/regressproof.yml`
- CI exit policy based on configurable verdict classes
- GitHub Step Summary support for Actions
- GitHub output variables:
  - `verdict`
  - `confidence`
  - `changed_file_match`
  - `ci_should_fail`
  - artifact paths
- usage/cost scaffold with `estimated` and `exact` modes
- exact usage mode now supports environment-driven activation without config edits
- lightweight real-repo validation config:
  - [regressproof.real-repo.config.json](/Users/mac/Desktop/rork-kiku/regressproof/regressproof.real-repo.config.json)
- lightweight large-repo mode with:
  - `baseline.mode = skip`
  - `targetPaths`
- `path_snapshot` mode with graceful fallback to `skip` when target paths are not yet present in baseline history
- internal credit ledger scaffold
- persistent JSONL ledger storage under the artifact directory
- PR comment body artifact generation
- direct PR comment publishing via GitHub Actions
- four validated fixture scenarios:
  - introduced failure
  - preexisting failure
  - preexisting failure plus a newly introduced failure
  - timeout / environment failure
- real repository smoke validation now runs successfully in lightweight mode

What is next:

- fixture coverage expansion
- path-scoped baseline snapshots for targeted real-repo validation
- provider-native usage adapters beyond env/file ingestion
- richer PR presentation and review thread behavior

## Current Product Positioning

RegressProof is **not** framed as a universal provider token refund tool.

RegressProof **is** framed as:

- agent regression detection
- fault attribution with evidence
- cost accountability
- internal credit and reliability tracking

## MVP Scope

The first version should include:

- local CLI
- GitHub Action
- baseline engine
- verification engine
- diff mapping
- fault classifier
- internal cost and credit ledger
- markdown and JSON reports
- PR comment publishing

The first version should exclude:

- full provider-native integrations
- dashboards as a hard requirement
- low-confidence auto-credit decisions
- claims of universal provider refunds

## Canonical Success Criteria

The first release is successful if it can:

- run on a real repository
- detect a known bad patch
- avoid blaming the agent for pre-existing failures
- assign a confidence-scored verdict
- record cost or estimated cost
- produce a report that a human reviewer trusts
- append persistent ledger evidence for repeated runs

## Recommended Working Order

1. Finalize scope and assumptions in the documents already created.
2. Build proof-of-function on a small fixture repository.
3. Implement local CLI MVP.
4. Add GitHub Action integration.
5. Add internal credit ledger.
6. Validate against controlled bad and good patches.

## Working Principles

- Do not rely on intuition-only classification.
- Trust only measurable signals.
- Keep confidence scoring conservative.
- Separate `confirmed` from `possible`.
- Ignore pre-existing failures unless worsened.
- Avoid product claims the system cannot prove.

## Immediate Next Steps

- expand fixture coverage again for build- and test-specific failure formats
- deepen path-scoped baseline support for larger real repositories
- add provider-native usage adapters beyond env/file inputs
- improve PR comment presentation for longer review threads

## Memory Rule

If future work resumes in a new session, start by reading these files in order:

1. [Product Brief](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_PRODUCT_BRIEF.md)
2. [Specification](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_SPEC.md)
3. [Implementation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md)
4. [MVP Task Breakdown](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md)
5. [Decision Log](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_DECISION_LOG.md)

This file should remain the top-level project memory entry point.
