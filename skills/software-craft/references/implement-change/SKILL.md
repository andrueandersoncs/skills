---
name: implement-change
description: Implement an agreed software behavior in small testable vertical slices using repository-native conventions. Use when the outcome or contract is known and source code should change.
---

# Implement Change

## Method

1. Read the accepted outcome or plan, relevant source, callers, tests, commands, and repository rules. Resolve material contradictions before editing.
2. Use an isolated workspace when the harness or repository provides one and the change warrants isolation.
3. Choose the smallest complete slice. Prefer a public-seam tracer bullet over horizontal layers.
4. For behavior that can plausibly regress:
   - write one behavior-level test at the agreed seam;
   - run it and observe the expected failure;
   - write only enough code to pass;
   - run the focused check;
   - simplify while green.
5. For each slice, run the changed behavior itself. Keep the repository buildable and remove temporary instrumentation.
6. Follow existing patterns and dependencies. Introduce a new abstraction only when current repetition or contract pressure proves its value.
7. Re-read consequential decisions with fresh context before they spread. Resolve findings against the contract rather than accepting them by authority.
8. Complete every caller migration and remove obsolete paths, aliases, comments, and dead compatibility code when the cutover allows it.

## Done

The smallest complete behavior works through its real entry point, regression-prone behavior has a meaningful guard, and no old path or debug residue remains.

## Next

Use `review-change` for independent judgment and `verify-change` before any completion claim.