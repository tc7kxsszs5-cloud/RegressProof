# RegressProof Product Brief

**Date:** 13 April 2026  
**Status:** Draft  
**Product name:** `RegressProof`  
**Tagline:** `Proof, not guesses, for agent-caused regressions.`

## Summary

RegressProof is a validation and accountability layer for AI coding agents.

It checks whether an agent-introduced code change caused a measurable regression, links that regression to real verification evidence, and records the associated spend or estimated spend. It does not rely on intuition or vague judgment. It relies on baseline comparison, test results, build results, and confidence-scored classification.

## The Problem

AI coding agents can:

- introduce regressions
- claim tasks are complete when they are not
- trigger repeated repair loops
- consume extra tokens and engineering time

Existing tools often measure usage and cost, but they do not reliably answer:

- did the agent cause a new regression?
- can we prove it with testable evidence?
- how much did that failure cost?
- should the run be credited, penalized, or flagged for review?

## The Product

RegressProof observes AI-generated code changes and verifies them using measurable signals:

- git diff
- lint
- typecheck
- unit tests
- integration tests
- build
- optional e2e and contract tests

It compares baseline results against post-change results and determines whether the agent likely introduced a new regression.

## What Makes It Different

RegressProof is built around proof, not speculation.

It is not:

- a generic observability dashboard
- a vague “AI quality” score
- a promise of provider-side token refunds

It is:

- a regression proof system
- a fault attribution layer
- a cost accountability mechanism
- an internal credit and reliability ledger for agent runs

## Target Users

- teams using AI coding agents in GitHub workflows
- founders experimenting with agent-based development
- engineering teams that want to reduce wasted spend from bad AI patches
- platform builders creating multi-agent coding environments

## First Release Scope

The first release should focus on:

- GitHub-first workflows
- CLI wrapper plus GitHub Action
- baseline vs post-change verification
- high-confidence fault detection only
- internal credit ledger
- markdown and JSON reports

## What It Will Prove

The first version should prove that it can:

- detect known bad patches
- avoid blaming the agent for pre-existing failures
- classify failures with confidence
- track spend or estimated spend per run
- produce reports a human reviewer can trust

## What It Will Not Promise

The first version will not promise:

- universal support for every agent environment
- perfect attribution in all ambiguous cases
- refunds of real provider tokens
- detection of every business-logic mistake without supporting tests

## Why The Idea Matters

As AI coding systems improve, reliability and accountability become more important than raw generation speed.

RegressProof helps answer:

- which agents are reliable?
- which patches are risky?
- which failures are real regressions?
- how much cost comes from low-quality agent output?

This makes RegressProof useful both as an engineering tool and as a foundation for broader AI code governance.

## Success Criteria

RegressProof is successful if a team can run it against a real repository and trust it to:

- find measurable new regressions
- distinguish them from old failures
- connect them to specific patches or PRs
- quantify the cost of those failures
- give a fair, evidence-backed assessment of agent-caused faults

## Recommended Next Documents

- `REGRESSPROOF_SPEC.md`
- implementation plan
- MVP task breakdown
- validation and fixture-repo test plan
