# RegressProof Prototype Walkthrough

**Date:** 14 April 2026  
**Status:** Prototype-ready overview

## What Exists Today

The current `RegressProof` prototype can:

- read a repo-specific config
- resolve a baseline ref
- create a baseline snapshot from git history
- run quick checks on baseline and current code
- compare failure states
- classify:
  - `confirmed_agent_fault`
  - `preexisting_failure`
  - `environment_failure`
  - `successful_change`
  - `insufficient_evidence`
- write JSON and Markdown artifacts
- expose GitHub-compatible outputs
- generate a PR-oriented compact markdown summary
- track estimated or exact usage cost in reports
- run lightweight smoke validation on a real repository
- generate a PR comment body artifact
- compute a first internal credit recommendation
- append persistent JSONL ledger entries
- publish or update a marker-based PR comment in GitHub Actions

## Demonstrated Scenarios

The prototype includes three validated fixture repositories:

- `regressproof/fixtures/simple-js`
  - demonstrates a newly introduced failure
- `regressproof/fixtures/preexisting-js`
  - demonstrates a failure that already existed before the current change
- `regressproof/fixtures/timeout-js`
  - demonstrates an environment-style timeout case

## Why This Matters

This proves the product is no longer a concept only.

It can already:

- distinguish some new failures from old ones
- avoid blaming every red check on the current change
- produce machine-readable outputs for CI
- generate human-readable summaries for review workflows
- support CI failure policy based on verdict class
- run in a practical lightweight mode on a large repository
- expose a first credit-accountability model in reports

## Current Limits

The prototype does not yet:

- parse every framework-specific failure format
- map failures at symbol-level depth
- ingest provider token usage from native platform adapters
- compute internal credits beyond the current policy-driven model
- handle large monorepos with an optimized lightweight baseline strategy
- perform path-scoped baseline snapshots for real-repo deep validation

## What The Next Stage Should Deliver

- richer diff-to-failure attribution
- CI outputs integrated into workflow decisions
- PR-oriented summary usage
- provider adapters for exact usage ingestion
- real repository validation beyond fixtures

## Quick Demo Command

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```
