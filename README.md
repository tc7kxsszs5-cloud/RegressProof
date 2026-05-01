# RegressProof

Proof, not guesses, for agent-caused regressions.

## Legacy Notice

This repository is no longer the active canonical home of RegressProof.

The active repository is:

- [tc7kxsszs5-cloud/RegressProof-cli](https://github.com/tc7kxsszs5-cloud/RegressProof-cli)

Use `RegressProof-cli` for:

- current CLI runtime
- current validation corpus
- current project documentation
- current releases and active hardening work

This repository is kept only as historical prototype context.

## Historical Context

This repository contains an earlier standalone `RegressProof` prototype:

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

This repository should be treated as legacy prototype material.

The historical prototype here supports:

- baseline vs current quick-check comparison
- evidence-based fault classification
- preexisting vs introduced failure separation
- JSON and Markdown reporting
- persistent JSONL ledger entries
- PR comment artifact generation and GitHub Action integration
