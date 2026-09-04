---
name: review-change
description: Independently judge a software change against its intended behavior and long-term code health. Use for pull requests, branches, significant work in progress, architecture changes, security-sensitive changes, or before integration.
---

# Review Change

## Inputs

The reviewable software artifact, originating outcome or specification, repository rules, relevant tests, and requested review boundary.

## Method

1. Pin the review boundary and read the originating outcome, spec, repository rules, and tests.
2. Use fresh context for material review. Keep two verdicts distinct:
   - **Specification:** missing behavior, wrong behavior, scope creep, compatibility, and migration completeness.
   - **Quality:** correctness, clarity, simplicity, architecture, security, performance, operability, and test strength.
3. Read tests before implementation. Ask what observable break each test would catch.
4. Trace changed public seams and callers. Look for partial cutovers, duplicated ownership, unreachable cleanup, and new concepts that can be deleted.
5. Judge domain-specific security, performance, interface, and motion concerns as part of the requested review context.
6. Report only evidence-backed findings with severity, file location, consequence, and smallest corrective action. Keep praise and style preference out of the findings list.
7. When receiving review, verify each claim against code and contract. Clarify ambiguity and push back with evidence; do not implement feedback merely because a reviewer stated it.
8. Re-review corrected critical findings and the integrated change.

## Output

An independent specification and quality verdict with only evidence-backed findings, consequences, and smallest corrective actions.

## Done

Every blocking finding maps to an observable contract or concrete maintenance risk, and approval means both specification and quality pass.