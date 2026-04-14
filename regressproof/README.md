# RegressProof

First implementation scaffold for the `RegressProof` CLI.

Current scope:

- read project config
- collect git context
- resolve baseline reference
- calculate changed files
- run baseline quick checks from a snapshot
- run current quick checks in the target repo
- emit a structured run report with a first verdict
- write JSON and Markdown artifacts for CI usage
- append persistent ledger entries for later cost and fault analysis
- emit PR comment artifacts and support direct PR comment publishing in GitHub Actions

This is the proof-of-function shell for the MVP. It now performs baseline and current quick-check execution, splits multi-line failures into structured records, and returns an evidence-based first verdict.

Implementation note:

- the runtime is currently plain Node.js for reliability
- TypeScript source scaffolding is present for the next iteration
- the next milestone is broader fixture coverage plus deeper real-repo baseline support

## Commands

Build:

```bash
cd regressproof
npm run build
```

Run:

```bash
cd regressproof
node dist/cli.js run
```

Run with JSON output:

```bash
cd regressproof
node dist/cli.js run --format json
```

Run against fixtures:

```bash
cd regressproof
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/preexisting-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/mixed-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/timeout-js --format json
```

Write artifacts explicitly:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

Run in CI mode:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts \
  --ci
```

In CI mode, RegressProof exits non-zero only for configured verdicts such as `confirmed_agent_fault`.

Run against the current repository in lightweight mode:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku \
  --config regressproof/regressproof.real-repo.config.json \
  --format json
```

Lightweight mode uses a skipped baseline for large repositories and is intended for smoke validation before richer real-repo support is added.

Exact usage modes:

- `usage.mode = "estimated"` uses config or heuristic estimation
- `usage.mode = "exact"` supports:
  - env ingestion via `REGRESSPROOF_PROMPT_TOKENS`, `REGRESSPROOF_COMPLETION_TOKENS`, `REGRESSPROOF_CACHED_TOKENS`, `REGRESSPROOF_COST_USD`
  - file ingestion via `usage.exact.filePath`

Persistent ledger:

- by default, a JSONL ledger is written under the artifact directory in `.regressproof-ledger/runs.jsonl`
- each run records verdict, confidence, spend estimate, internal credit, and failure counts

Current report artifacts include:

- `regressproof-report.json`
- `regressproof-summary.md`
- `regressproof-pr-summary.md`
- `regressproof-pr-comment.md`
- `.regressproof-ledger/runs.jsonl`
