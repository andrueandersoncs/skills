---
name: design-skill-router
description: Explain or design an agent skill router as an ordered map from current and desired state to one leaf. Use when a router contract, route table, leaf boundary, or routing explanation is needed before implementation.
---

# Design Skill Router

Read [`../canonical-design.md`](../canonical-design.md) before designing.

## Inputs

- The recurring router outcome and intended callers
- The desired router result
- Existing router, skill, and repository evidence when present

## Method

1. If the desired state is an explanation, explain the canonical state model, selection rule, terminals, and re-entry rule at the requested depth, then stop when the question is answered.
2. Otherwise define the router positively: name the agent-skill components or leaves it selects and the recurring outcome it owns.
3. Inventory existing skills and routes. Give overlapping behavior one canonical owner.
4. List only observable desired states that can change the selected owner.
5. List only material current-state facts that distinguish the next necessary transition.
6. Give each transition one independent leaf with explicit inputs, output, and completion evidence.
7. Build one ordered `(current state, desired state) → result` table. Put out-of-scope and already-done terminals first, then specific outcomes and missing prerequisites.
8. Define one re-entry rule: update current state from leaf evidence and preserve desired state until it is satisfied.
9. Establish routing pressure with at least three positive cases, two nearby negative cases, and one case that asks for conflicting or simultaneous owners.
10. Remove duplicated completion rules, leaf-to-leaf sequencing, overlays, and any row whose distinction cannot change the selected owner.

## Output

The requested explanation or a router design containing its positive scope, ordered route table, leaf contracts, re-entry rule, directory layout, and pressure cases.

## Done

An explanation is complete when it answers the requested router question using the canonical model. A design is complete when its explicit route table and complete leaf contracts establish the implementation inputs, every in-scope state pair selects exactly one owner or terminal result, adjacent work remains outside the router, and no unresolved overlap or routing loop remains.