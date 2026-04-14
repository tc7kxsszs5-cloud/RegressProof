# RegressProof Demo Release

**Date:** 14 April 2026  
**Status:** Prototype package

## What This Demo Includes

- local CLI runner
- baseline vs current quick-check comparison
- fixture repositories for:
  - introduced failure
  - preexisting failure
  - timeout / environment failure
- JSON report artifact
- full markdown summary
- compact PR summary
- PR comment body artifact
- GitHub Action skeleton
- estimated usage and internal credit scaffold

## Core Demo Commands

### Introduced failure

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

### Preexisting failure

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/preexisting-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

### Real repository smoke validation

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku \
  --config regressproof/regressproof.real-repo.config.json \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

## Expected Demo Artifacts

- `regressproof-report.json`
- `regressproof-summary.md`
- `regressproof-pr-summary.md`
- `regressproof-pr-comment.md`

## Current Product Story

RegressProof can already prove:

- whether a failure is newly introduced
- whether a failure already existed before the current change
- whether a timeout should be treated as environment evidence
- whether CI should fail based on a verdict policy

It also prepares the next product layer:

- PR review integration
- cost accountability
- internal credits for confirmed agent-caused regressions
