# RegressProof MVP Task Breakdown

**Date:** 13 April 2026  
**Status:** Draft

## Milestone 1: Foundation

- Initialize project structure for `regressproof`.
- Set up TypeScript, package manager, linting, formatting, and test runner.
- Define shared JSON schemas for run records, verification results, classifications, and reports.
- Create `regressproof.config.json` draft schema.
- Add a simple CLI entrypoint.

Estimated time: `2 to 3 days`

## Milestone 2: Baseline Engine

- Implement repository state resolver.
- Implement base branch / base commit selection.
- Implement baseline check runner.
- Store baseline results locally.
- Mark and preserve pre-existing failures.

Estimated time: `3 to 4 days`

## Milestone 3: Verification Engine

- Implement quick check execution.
- Implement full check execution.
- Capture stdout, stderr, exit code, duration, and command metadata.
- Add timeout and partial failure handling.
- Normalize verification outputs into shared result format.

Estimated time: `3 to 5 days`

## Milestone 4: Parsers

- Implement generic parser fallback.
- Implement parser for lint results.
- Implement parser for typecheck results.
- Implement parser for test results.
- Implement parser for build failures.

Estimated time: `3 to 4 days`

## Milestone 5: Diff Mapping

- Parse git diff for changed files.
- Map changed hunks to files.
- Build file-level correlation model for failures.
- Add optional symbol-level enrichment later if needed.

Estimated time: `2 to 3 days`

## Milestone 6: Fault Classifier

- Define classification enum.
- Implement baseline vs post-run comparison.
- Detect newly introduced failures.
- Detect pre-existing failures.
- Detect likely environment failures.
- Compute confidence score.
- Output `successful_change`, `confirmed_agent_fault`, `possible_agent_fault`, `preexisting_failure`, `environment_failure`, or `insufficient_evidence`.

Estimated time: `4 to 6 days`

## Milestone 7: Cost and Credit Ledger

- Define pricing model interface.
- Implement exact usage ingestion where available.
- Implement estimated pricing fallback.
- Store run usage events.
- Store internal credit ledger entries.
- Restrict automatic crediting to high-confidence confirmed faults.

Estimated time: `3 to 5 days`

## Milestone 8: Reports

- Generate JSON report.
- Generate markdown summary.
- Include verdict, confidence, evidence, cost, and credit decision.
- Add machine-readable artifact support.

Estimated time: `2 to 3 days`

## Milestone 9: GitHub Integration

- Build GitHub Action wrapper.
- Detect PR context and base branch.
- Run RegressProof in CI.
- Upload JSON and markdown artifacts.
- Post PR summary comment or check-run output.

Estimated time: `4 to 6 days`

## Milestone 10: Validation Harness

- Create fixture repo scenarios for green baseline / broken patch.
- Create fixture repo scenarios for pre-existing failures.
- Create fixture repo scenarios for environment failure.
- Add integration tests around expected classifications.
- Tune confidence rules.

Estimated time: `5 to 8 days`

## Milestone 11: Proof-of-Function Review

- Run against a real repository.
- Verify detection of known bad patches.
- Verify no false blame for pre-existing failures.
- Review report trustworthiness.
- Decide whether to proceed to broader integration.

Estimated time: `2 to 3 days`

## MVP Exit Criteria

- baseline engine works
- verification engine works
- classifier detects known regressions
- reports are usable by humans and CI
- GitHub Action works on at least one real repository
- internal credit ledger records high-confidence agent-caused faults

## Deferred After MVP

- dashboard
- multi-provider adapters
- IDE plugin layer
- symbol-level semantic mapping
- claim-vs-code validation
- richer business-logic verification
