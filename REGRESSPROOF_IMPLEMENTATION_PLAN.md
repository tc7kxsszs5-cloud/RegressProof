# RegressProof Implementation Plan

**Date:** 13 April 2026  
**Status:** Draft  
**Product name:** `RegressProof`

## 1. Objective

Build the first credible version of RegressProof as a working system that can:

- observe AI-generated code changes
- run verification checks against those changes
- compare results to a known baseline
- classify likely agent-caused regressions
- record usage cost or estimated cost
- emit trustworthy reports for local use and GitHub workflows

This plan is intentionally practical. It prioritizes proof of function over platform breadth.

## 2. Recommended MVP Scope

The first implementation should be:

- GitHub-first
- repository-centric
- language-agnostic at the orchestration layer
- command-driven for verification
- conservative in fault attribution

### MVP capabilities

- local CLI
- GitHub Action
- baseline capture and reuse
- quick and full verification stages
- diff-aware fault classification
- cost ledger with exact or estimated usage
- markdown and JSON output

### MVP exclusions

- no dashboard in the first sprint
- no provider-specific UI integrations in the first sprint
- no automatic merge blocking beyond optional CI failure
- no low-confidence auto-credit decisions

## 3. Recommended Tech Stack

The orchestration layer should be implemented in `TypeScript`.

Why:

- strong fit for GitHub integration
- easy JSON and CLI tooling
- good ecosystem for CI and developer tools
- simple packaging as CLI and Action

### Suggested stack

- `TypeScript`
- `Node.js`
- `pnpm` or `npm`
- `SQLite` for local and early hosted state
- optional `PostgreSQL` later
- GitHub Actions for CI integration
- JSON schemas for event and report contracts

## 4. System Modules

## 4.1 CLI Runner

Purpose:

- start a RegressProof run locally
- point to repo, baseline ref, patch, or current branch
- execute configured checks
- write machine-readable and human-readable output

Responsibilities:

- load config
- resolve repository state
- create run record
- trigger baseline and verification execution
- collect outputs

Possible commands:

- `regressproof run`
- `regressproof baseline`
- `regressproof verify`
- `regressproof report`
- `regressproof classify`

## 4.2 Config Loader

Purpose:

- define how each project should be verified

Configuration should support:

- baseline reference
- quick checks
- full checks
- parser definitions
- file globs for ownership and mapping
- pricing model selection

Suggested config file:

- `regressproof.config.json`

Example sections:

- `baseline`
- `checks.quick`
- `checks.full`
- `providers`
- `pricing`
- `classification`

## 4.3 Baseline Engine

Purpose:

- record the known reference state before judging an agent change

Responsibilities:

- resolve target branch or commit
- execute baseline checks
- cache baseline results
- identify pre-existing failures

Rules:

- baseline may come from `main`, a PR base commit, or an explicit ref
- pre-existing failures must not be blamed on the agent

## 4.4 Verification Engine

Purpose:

- run project-defined checks consistently

Two phases:

- `quick`
- `full`

Quick checks:

- lint
- typecheck
- unit tests
- fast build

Full checks:

- integration tests
- e2e
- contract tests
- extended build matrix

Requirements:

- capture stdout and stderr
- record exit code
- normalize command results
- support timeouts
- support partial failures

## 4.5 Result Parsers

Purpose:

- transform command output into structured failure records

Parsers needed for:

- lint output
- typecheck output
- test runners
- build tools
- generic fallback parser

Structured output should extract:

- file path
- test name
- error type
- message
- stack trace if available
- check source

## 4.6 Diff Mapper

Purpose:

- connect changed files and changed symbols to observed failures

Responsibilities:

- parse git diff
- list changed files
- optionally list changed hunks
- correlate failures to touched files and nearby modules

This module is central to confidence scoring.

## 4.7 Fault Classifier

Purpose:

- decide whether the evidence supports agent fault

Suggested outputs:

- `confirmed_agent_fault`
- `possible_agent_fault`
- `preexisting_failure`
- `environment_failure`
- `insufficient_evidence`
- `successful_change`

Inputs:

- baseline results
- post-change results
- diff mapping
- command metadata
- flaky or infrastructure signals

Confidence scoring inputs:

- new vs old failure
- failure in changed file
- test stack trace relevance
- reproducibility
- infrastructure health

## 4.8 Cost and Credit Ledger

Purpose:

- store token usage and estimated spend
- assign internal credits when fault is confirmed

Modes:

- `exact`
- `estimated`

Exact mode:

- provider supplies prompt and completion token usage

Estimated mode:

- cost derived from heuristics or external metadata

Credit rules for MVP:

- only high-confidence `confirmed_agent_fault`
- credit stored internally
- no claim of provider refund

## 4.9 GitHub Integration

Purpose:

- make RegressProof usable in normal PR workflows

First release integration:

- GitHub Action
- PR markdown summary
- artifact upload
- optional check-run annotation

Action responsibilities:

- detect PR context
- resolve base commit
- run RegressProof
- upload reports
- post summary comment or check output

## 5. Report Outputs

The first version should emit two formats.

### JSON report

Used by:

- CI systems
- dashboards
- future APIs

Contains:

- run metadata
- changed files
- baseline summary
- post-run summary
- classification
- confidence
- cost
- credit decision

### Markdown report

Used by:

- humans in PRs
- local review
- debugging tool behavior

Contains:

- overall verdict
- confidence
- newly introduced failures
- affected files
- cost summary
- credit summary
- evidence summary

## 6. Suggested Repository Structure

```text
regressproof/
  src/
    cli/
    config/
    baseline/
    verification/
    parsers/
    diff/
    classify/
    ledger/
    github/
    reports/
    shared/
  fixtures/
    ts-web-pass/
    ts-web-fail-build/
    python-service-fail-test/
    swift-package-fail-build/
  test/
    unit/
    integration/
    e2e/
  .github/
    workflows/
  docs/
```

## 7. Development Phases

## Phase 1: Core Local Runner

Goal:

- prove baseline, verification, and classification work locally

Deliverables:

- CLI scaffolding
- config loader
- baseline engine
- verification engine
- generic result model

Estimated time:

- `5 to 7 working days`

## Phase 2: Classification and Reports

Goal:

- produce trustworthy verdicts

Deliverables:

- diff mapper
- fault classifier
- confidence scoring
- JSON report
- markdown report

Estimated time:

- `4 to 6 working days`

## Phase 3: Ledger and Pricing

Goal:

- connect regressions to spend

Deliverables:

- usage ingestion
- estimated pricing support
- internal credit ledger
- run history persistence

Estimated time:

- `3 to 5 working days`

## Phase 4: GitHub Workflow

Goal:

- make the tool useful in PR review

Deliverables:

- GitHub Action
- PR summary template
- artifacts
- base branch detection

Estimated time:

- `4 to 6 working days`

## Phase 5: Validation Harness

Goal:

- prove the detector is not inventing results

Deliverables:

- fixture repositories
- known good and bad patches
- integration tests for classification
- confidence threshold tuning

Estimated time:

- `5 to 8 working days`

## Total MVP timeline

Realistic end-to-end MVP:

- `4 to 7 weeks`

## 8. Testing Plan For RegressProof Itself

The project must validate itself before claiming usefulness.

### Unit test targets

- config parsing
- baseline comparison
- classification rules
- pricing calculation
- markdown rendering

### Integration test targets

- green baseline to red build
- green baseline to red typecheck
- one failing baseline plus one introduced failure
- environment timeout misclassified avoidance

### End-to-end targets

- run full RegressProof flow on fixture repos
- emit expected verdict and confidence
- verify credit rules trigger only in high-confidence cases

## 9. Confidence Rules For MVP

MVP should remain conservative.

Automatic `confirmed_agent_fault` only when:

- failure is new
- failure is reproducible
- failure maps to changed file or changed interface
- environment status is clean
- no evidence it is pre-existing

Anything weaker should become:

- `possible_agent_fault`
- or `insufficient_evidence`

This is important for trust.

## 10. Feasibility Gate Before Full Build

Before building all modules, run a short proof-of-function exercise:

1. choose a small TypeScript repo
2. define baseline commands
3. inject known bad patch
4. verify tool catches failure
5. inject known good patch
6. verify no false positive

If this works consistently, continue to full MVP.

## 11. Success Metrics

The MVP should be judged by:

- regression detection rate on fixture repos
- false positive rate
- false negative rate
- report readability
- PR usefulness
- reproducibility of verdicts

Suggested early targets:

- high-confidence regression detection above `85%` on fixture repos
- false positive rate below `10%` on controlled test repos

## 12. Open Decisions

These decisions should be made before implementation starts:

- exact name and package naming convention
- TypeScript plus SQLite confirmed or not
- which providers to support first for usage ingestion
- which languages to support in fixture repos first
- whether GitHub comments should be automatic in MVP

## 13. Recommended Next Step

After this plan, the next document should be:

- `REGRESSPROOF_MVP_TASK_BREAKDOWN.md`

That document should translate this plan into concrete engineering tasks, grouped by module and milestone.
