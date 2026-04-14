# RegressProof

Proof, not guesses, for agent-caused regressions.

This repository contains the current standalone `RegressProof` prototype:

- the CLI implementation in `regressproof/`
- validation fixtures in `regressproof/fixtures/`
- project design and planning documents in the repository root
- GitHub Actions workflow in `.github/workflows/regressproof.yml`

## Quick Start

```bash
cd regressproof
node src/cli.js run \
  --repo /absolute/path/to/target-repo \
  --config regressproof.config.json \
  --format json
```

## Key Documents

- `REGRESSPROOF_INDEX.md`
- `REGRESSPROOF_SPEC.md`
- `REGRESSPROOF_IMPLEMENTATION_PLAN.md`
- `REGRESSPROOF_VALIDATION_PLAN.md`

## Current Status

The prototype currently supports:

- baseline vs current quick-check comparison
- evidence-based fault classification
- preexisting vs introduced failure separation
- JSON and Markdown reporting
- persistent JSONL ledger entries
- PR comment artifact generation and GitHub Action integration

