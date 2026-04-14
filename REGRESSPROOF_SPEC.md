# RegressProof

**Status:** Discovery / Specification  
**Date:** 13 April 2026  
**Product name:** `RegressProof`  
**Category:** AI coding regression detection and credit accountability system  
**Tagline:** `Proof, not guesses, for agent-caused regressions.`

## 1. What This Is

This project is a validation and accounting layer for AI coding agents.

It does **not** directly control billing inside OpenAI, Anthropic, Codex, Claude Code, or other providers. Instead, it sits around agent runs and answers four practical questions:

1. What code did the agent change?
2. Did the change introduce a measurable regression?
3. How much token spend or estimated cost was associated with that run?
4. Should the run be marked as an agent-caused fault and receive an internal credit or penalty score?

The system is meant to be usable across multiple agent environments as long as they can provide, directly or indirectly:

- repository access
- model usage metadata or estimated usage
- a way to run verification commands
- a run identifier, commit, patch, or PR reference

## 2. Core Problem

When AI coding agents make mistakes, users often pay for:

- bad diffs
- repeated retries
- repair work
- broken builds
- flaky implementation loops

Today, most tools can show token usage, traces, and cost, but they usually do not provide a reliable system for:

- linking cost to a concrete code regression
- proving the regression is new
- classifying whether the agent is actually at fault
- issuing an internal credit or refund-like balance adjustment

This project addresses that gap.

## 3. Main Goals

- Detect **new regressions** introduced by an AI agent.
- Compare verification results **before and after** an agent change.
- Attribute failures to a patch, commit, or PR with a confidence score.
- Track token usage or estimated spend per run.
- Maintain an internal credit ledger when the evidence strongly suggests agent fault.
- Work in a provider-agnostic way where possible.
- Integrate cleanly with GitHub repositories and CI.

## 4. Non-Goals

- No direct refund of real tokens from OpenAI, Anthropic, GitHub Copilot, or any other provider unless the provider itself exposes such a mechanism.
- No claim of perfect fault attribution in ambiguous cases.
- No assumption that every failing test means the agent is at fault.
- No replacement for real test coverage or QA.

## 5. How It Actually Detects Errors

The system must never guess based on prompt quality or intuition. It only works from measurable signals.

### Required detection principle

An error is only considered confirmed when there is evidence from:

- `git diff` or patch content
- `lint`
- `typecheck`
- `unit tests`
- `integration tests`
- `build`
- optional `e2e`, contract tests, security scans, or snapshot tests

### Baseline method

Before judging an agent change, the system records a baseline:

- current commit or base branch
- current passing and failing checks
- existing known failures
- current build status

After the agent change:

- run the same checks again
- compare only newly introduced failures
- ignore pre-existing failures unless the agent made them worse

### Confirmed agent fault examples

High-confidence examples:

- build was green before, red after
- typecheck was green before, red after, and the error is in a changed file
- a previously passing test now fails, and the failing stack trace points to changed code
- an API contract test now fails after the agent modified the endpoint or schema

Medium-confidence examples:

- integration test fails in an area touched by the agent, but root cause is indirect
- e2e breaks after a UI flow change, but attribution is less precise

Low-confidence examples:

- flaky test failed once
- external service timed out
- CI runner crashed
- unrelated environment issue

Only high-confidence cases should trigger automatic credit decisions in the first version.

## 6. Proposed System Architecture

## 6.1 High-Level Components

1. `Runner Wrapper`
   Wraps agent execution. Captures run metadata, model info, patch info, and token usage where available.

2. `Verification Engine`
   Executes project-specific commands such as `lint`, `typecheck`, `test`, `build`, `e2e`.

3. `Baseline Store`
   Stores the reference state for a branch, commit, PR, or task.

4. `Fault Classifier`
   Compares baseline vs post-change results and assigns:
   - `confirmed_agent_fault`
   - `possible_agent_fault`
   - `preexisting_failure`
   - `environment_failure`
   - `insufficient_evidence`

5. `Cost Ledger`
   Stores token usage, estimated money spent, and internal credits.

6. `GitHub Integration`
   Reads PRs, commits, checks, annotations, and can post comments or status summaries.

7. `Dashboard / Reports`
   Shows waste, confidence, regression types, and reliability over time by agent or model.

## 6.2 Suggested Data Model

Core entities:

- `agent_runs`
  - `id`
  - `provider`
  - `agent_name`
  - `model`
  - `repo`
  - `branch`
  - `base_commit`
  - `head_commit`
  - `pr_number`
  - `started_at`
  - `completed_at`
  - `status`

- `usage_events`
  - `id`
  - `run_id`
  - `prompt_tokens`
  - `completion_tokens`
  - `cached_tokens`
  - `estimated_cost_usd`
  - `source`

- `verification_runs`
  - `id`
  - `run_id`
  - `stage` (`baseline`, `quick`, `full`)
  - `command`
  - `exit_code`
  - `started_at`
  - `completed_at`

- `verification_results`
  - `id`
  - `verification_run_id`
  - `check_type`
  - `check_name`
  - `status`
  - `file_path`
  - `test_name`
  - `message`

- `fault_assessments`
  - `id`
  - `run_id`
  - `classification`
  - `confidence`
  - `reason_summary`
  - `introduced_failures`
  - `affected_files`

- `credit_ledger`
  - `id`
  - `run_id`
  - `credit_type`
  - `amount`
  - `currency_or_units`
  - `reason`

## 7. Integration Strategy Across Agents

The system cannot assume every agent exposes the same metadata. So integration must be layered.

### Level 1: Git-only mode

Works anywhere the agent modifies a repository.

Signals available:

- git diff
- commits
- changed files
- branch / PR
- CI results

This mode can still provide regression detection and fault classification, even if token accounting is estimated rather than exact.

### Level 2: API-aware mode

Works when the agent platform or wrapper exposes:

- token counts
- model name
- request IDs
- usage metadata

This mode provides accurate cost tracking.

### Level 3: Native platform integration

Works when a specific environment supports hooks, plugins, or wrappers.

Examples:

- CLI wrapper around agent commands
- GitHub Action for PR-based validation
- provider-specific middleware
- IDE extension or local daemon

The project should target Level 1 first, then add Level 2 and Level 3 integrations.

## 8. Testing Strategy

The system itself must be tested using realistic fixtures, not theory.

## 8.1 What Must Be Proven

The project should prove:

- it correctly ignores pre-existing failures
- it detects new regressions
- it distinguishes environment failures from code regressions
- it assigns confidence consistently
- it records spend or estimated spend correctly
- it can post reliable summaries for GitHub PRs

## 8.2 Test Layers

### Layer A: Unit tests

Test:

- diff parsers
- log parsers
- fault classification rules
- confidence scoring
- cost ledger calculations

### Layer B: Integration tests

Use sample repositories or fixtures where:

- baseline is green, patch breaks compile
- baseline has one failing test, patch adds another
- patch introduces lint failure only
- CI fails due to network timeout, not code

Expected outcome:

- correct classification
- correct confidence
- correct credit decision

### Layer C: End-to-end test repositories

Create small controlled repos for:

- TypeScript web app
- Python service
- Swift package or iOS/macOS sample app

For each fixture repo:

- run baseline
- apply known bad patch
- verify system catches it
- apply known good patch
- verify no false positive

### Layer D: GitHub PR simulation

Test:

- PR comments
- check summaries
- changed-file mapping
- branch baseline comparison

## 9. Minimum Viable Product

The first version should stay narrow and prove the concept.

### MVP scope

- GitHub-first
- CLI tool plus GitHub Action
- baseline and post-change verification
- support for `lint`, `typecheck`, `unit tests`, `build`
- high-confidence fault classification only
- internal credit ledger
- markdown report output

### Recommended initial stack

- `TypeScript` or `Python` for orchestration
- `PostgreSQL` or `SQLite` for early ledger storage
- GitHub Actions for CI
- JSON reports for machine output
- Markdown summaries for human review

## 10. Operational Flow

1. Agent run starts.
2. Wrapper records metadata and optional token usage.
3. Baseline is resolved from target branch or commit.
4. Baseline verification results are loaded or computed.
5. Agent patch or PR is applied.
6. Quick verification runs.
7. If quick verification passes, optional full suite runs.
8. Result deltas are analyzed.
9. Fault classifier assigns class and confidence.
10. Cost ledger stores spend and optional internal credit.
11. Report is emitted to CLI, CI, and optionally GitHub PR.

## 11. Feasibility Assessment

### What is clearly feasible

- baseline vs post-change comparison
- regression detection for build, type, lint, and tests
- GitHub integration
- cost tracking where usage metadata exists
- estimated cost tracking where exact usage does not exist
- internal credit or penalty ledger

### What is feasible with caution

- multi-agent compatibility
- confidence-based fault attribution
- automated PR comments and dashboards

### What is not realistically guaranteed

- perfect attribution in ambiguous failures
- full support for every coding agent on day one
- real provider-side token refunds

## 12. Risks

- poor test coverage in target repositories
- flaky CI
- missing token metadata from some providers
- false positives if attribution rules are too aggressive
- false negatives if rules are too conservative
- operational cost of running verification suites

## 13. Time Estimate

These are realistic estimates for one experienced engineer with focused scope.

### Discovery and specification

- refine product scope
- define classifications
- define confidence rules
- finalize architecture

Estimated time: `2 to 4 days`

### MVP implementation

- CLI wrapper
- baseline engine
- verification runner
- fault classifier
- ledger storage
- markdown and JSON reports

Estimated time: `2 to 4 weeks`

### GitHub integration

- GitHub Action
- PR annotations
- status summaries
- run linking

Estimated time: `4 to 7 days`

### Test harness and fixture repos

- build controlled bad/good patches
- add integration tests
- add e2e verification for the tool itself

Estimated time: `1 to 2 weeks`

### Hardening for multi-agent use

- wrappers for multiple environments
- more provider adapters
- usage ingestion normalization
- dashboard polish

Estimated time: `3 to 6 weeks`

### Total realistic range

For a credible MVP that actually proves detection:

- `4 to 7 weeks` for a serious first version

For a stronger multi-agent version:

- `2 to 3 months`

## 14. Suggested Execution Plan

### Phase 1: Proof of detection

Deliver:

- baseline comparator
- quick checks
- fault classifier
- local CLI report

Success criteria:

- correctly detects known regressions in fixture repos

### Phase 2: GitHub workflow

Deliver:

- GitHub Action
- PR summary comments
- artifact upload

Success criteria:

- works reliably on PRs in at least one real repository

### Phase 3: Cost and credit ledger

Deliver:

- spend ingestion
- estimated pricing model
- internal credit accounting

Success criteria:

- every run has a cost and a classification

### Phase 4: Multi-agent adapters

Deliver:

- provider wrappers
- shared event schema
- dashboard

Success criteria:

- at least two different agent environments integrated

## 15. Open Questions

- Which providers expose reliable token metadata in the target workflow?
- Should credit values be stored in USD-equivalent units, internal credits, or both?
- Should the system only annotate GitHub, or also block merges?
- Should low-confidence cases require human review?
- Which languages and frameworks should be supported first?

## 16. Recommendation

The idea is technically viable if positioned correctly.

The strongest framing is not:

`refund real provider tokens`

The strongest framing is:

`detect agent-caused regressions, measure their cost, and provide an internal credit and accountability system`

That version is:

- buildable
- testable
- demonstrable
- useful even before any provider-side refund support exists

## 17. Definition of Success for the First Release

The first release is successful if it can:

- run against a real GitHub repository
- detect a known bad agent patch
- avoid blaming the agent for pre-existing failures
- produce a confidence-scored classification
- record cost or estimated cost
- generate a report a human reviewer trusts
