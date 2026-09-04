---
name: review-skill-router
description: Independently audit an implemented agent skill router for deterministic ownership, complete transitions, discovery, and routing collisions. Use when an existing router needs a verdict or corrective findings rather than edits.
---

# Review Skill Router

Read [`../canonical-design.md`](../canonical-design.md) before reviewing.

## Inputs

- The implemented router directory, including its root and every linked or unlinked file
- Its claimed desired states, current-state evidence, and intended callers
- Existing routing scenarios or acceptance criteria when available

## Method

1. Inventory the complete target directory, then read the root, every linked or unlinked leaf, nearby skill descriptions, and repository discovery rules.
2. Confirm that the root classifies agent-skill-router work while each leaf executes one independent transition.
3. Evaluate the table in order. Each row must constrain every state dimension that can change its owner; an explicit wildcard is valid when that dimension is immaterial. Every matching pair must produce exactly one leaf or terminal result.
4. Verify explicit Done and Not-this-router terminals, preserved desired state across re-entry, and detection of same-leaf repetition without a state change.
5. Trace every leaf contract from required input through observable output and `## Done` evidence. Flag missing transitions, overlapping owners, orphaned files, and unreachable leaves.
6. Run at least three positive cases, two adjacent negative cases, the already-done case, and one adversarial request to combine stages. Use fresh context for the routing judgment.
7. Check frontmatter discovery, one-hop links, canonical rule ownership, and the absence of overlays, leaf `## Next` sections, copied completion contracts, and obsolete routes.
8. Report only evidence-backed findings, ordered by consequence, followed by a pass verdict when no corrective finding remains.

## Output

An independent verdict with exact routing cases, evidence, and corrective findings.

## Done

The verdict accounts for discovery, every linked and unlinked router file, every route and terminal, every leaf contract, nearby negative cases, combined-stage pressure, re-entry behavior, and canonical ownership without changing the target.