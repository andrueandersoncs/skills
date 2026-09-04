---
name: verify-change
description: Prove a software claim with fresh claim-specific evidence from commands, runtime behavior, or artifact inspection. Use before saying fixed, complete, passing, ready, deployed, or equivalent; before integration; and after delegated work.
---

# Verify Change

## Inputs

The exact software claim, candidate artifact or runtime surface, authoritative evidence source, and relevant integration constraints.

## Method

1. State the exact claim and the observation that would prove it.
2. Select the narrowest authoritative evidence source, then include surrounding checks needed to catch integration breakage.
3. Run the command or scenario fresh. Read the complete relevant output, exit status, failure count, and produced artifact.
4. Verify the changed surface itself:
   - web UI: run it, exercise the path, inspect console/network/accessibility, and compare the rendered result;
   - CLI/TUI: launch the program and exercise input/output/state;
   - service/API: call the real boundary and inspect response plus side effects;
   - migration/release: inspect the deployed or transformed state.
5. A regression claim requires evidence that the guard detects the broken behavior and passes with the fix.
6. Compare results with the claim. Report the actual state when evidence is incomplete or failing.
7. Preserve durable constraints or regression guards only when they defend a plausible future break.

## Output

A claim-specific pass or failure result tied to fresh command output, runtime observation, or artifact inspection.

## Done

The completion statement can cite fresh output or direct runtime observation that proves the same claim, not a nearby proxy.