# RegressProof Validation Plan

**Date:** 13 April 2026  
**Status:** Draft

## Goal

Prove that RegressProof detects real regressions using evidence and does not invent conclusions.

## Validation Principles

- test against controlled fixture repositories
- compare baseline and post-change states
- measure false positives and false negatives
- separate code regressions from environment failures
- require reproducible evidence for confirmed faults

## Validation Targets

The system should prove that it can:

- detect new build failures
- detect new typecheck failures
- detect new lint failures
- detect new test regressions
- ignore pre-existing failures
- avoid false blame during environment issues

## Fixture Repository Set

### Fixture 1: TypeScript Web App

Use for:

- lint failures
- typecheck failures
- unit test regressions
- build regressions

### Fixture 2: Python Service

Use for:

- test regressions
- API contract failures
- environment handling

### Fixture 3: Swift Package or Small iOS/macOS Sample

Use for:

- compile failures
- test failures
- build-system parsing

## Controlled Scenarios

### Scenario A: Green baseline to broken build

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario B: Green baseline to broken typecheck

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario C: Green baseline to failing unit test in changed file

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario D: One pre-existing failing test plus one new failure

Expected:

- pre-existing failure preserved
- new failure attributed separately

### Scenario E: CI timeout or external service failure

Expected:

- `environment_failure` or `insufficient_evidence`

### Scenario F: Good patch

Expected:

- `successful_change`
- no false credit event

## Metrics

- regression detection rate
- false positive rate
- false negative rate
- classification reproducibility
- percentage of runs with sufficient evidence

## Initial Quality Targets

- high-confidence regression detection: `85%+` on controlled fixtures
- false positive rate: `<10%` on controlled fixtures
- classification reproducibility: `95%+` on repeated controlled runs

## Human Review Layer

Before trusting the first release broadly:

- review at least 20 classified runs manually
- compare system verdict to human engineering judgment
- tune confidence thresholds only after review

## Validation Exit Rule

RegressProof is validated for MVP when:

- it passes controlled fixture scenarios
- it avoids blaming the agent for pre-existing failures
- it avoids misclassifying environment failures as agent faults
- its reports are judged trustworthy by human reviewers
