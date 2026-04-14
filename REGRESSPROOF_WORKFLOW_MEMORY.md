# RegressProof Workflow Memory

This file exists to help future sessions quickly recover the intended workflow for this project.

## Fast Resume Checklist

When continuing work on `RegressProof`:

1. Read `AGENTS.md`
2. Read `docs/REGRESSPROOF_INDEX.md`
3. Read `docs/REGRESSPROOF_DECISION_LOG.md`
4. Decide whether the task is:
   - product clarification
   - architecture refinement
   - implementation planning
   - actual code implementation
   - validation or testing
5. If implementation starts, align the work to `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md`

## Core Product Boundaries

RegressProof should:

- prove regressions using measurable evidence
- avoid speculative blame
- work first through GitHub and repository workflows
- treat documentation as persistent project memory

RegressProof should not:

- promise provider-side token refunds by default
- auto-credit low-confidence failures
- present ambiguous failures as confirmed agent faults

## Best Next Moves

The best execution order for the project is:

1. maintain docs
2. prove detection on fixture repositories
3. implement local CLI
4. integrate with GitHub Action
5. add cost and credit accounting

## If A Future Agent Is Unsure

If a future agent is unsure what to do next, it should:

- consult `docs/REGRESSPROOF_INDEX.md`
- use `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md` as the execution plan
- record new major decisions in `docs/REGRESSPROOF_DECISION_LOG.md`
