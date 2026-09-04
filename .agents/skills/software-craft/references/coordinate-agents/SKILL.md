---
name: coordinate-agents
description: Partition and integrate independent software work across fresh-context agents with explicit ownership and handoff contracts. Use when two or more work units can run concurrently, a review needs independent context, or a long task needs isolated workers.
---

# Coordinate Agents

## Inputs

The ready work graph, shared contracts, independent ownership boundaries, integration target, and required evidence.

## Independence gate

Parallelize only when tasks share neither evolving state, file ownership, nor a sequential dependency. Otherwise keep one implementation owner and use fresh agents only for research or review.

## Method

1. Map the work graph and name one integration owner.
2. Define cross-task contracts before dispatch: interfaces, schemas, file ownership, shared prerequisites, and result format.
3. Give each worker a self-contained packet:
   - goal and exact scope;
   - necessary sources and decisions;
   - constraints and non-goals;
   - owned files or read-only boundary;
   - observable acceptance evidence;
   - concise return contract.
4. Use isolated worktrees for concurrent mutation. Avoid duplicate context and repository-wide validation inside workers.
5. Dispatch every independent task in one wave. Keep dependent frontiers sequential.
6. Review each result against its contract. Resolve interface conflicts centrally rather than asking workers to negotiate after divergence.
7. Integrate once, then run cross-slice runtime verification and the relevant full checks.
8. Persist only pointers, decisions, and evidence needed for recovery. Redact secrets from handoffs and scratch artifacts.

## Output

One integrated software result with reviewed worker outputs, resolved interface boundaries, and cross-slice runtime evidence.

## Done

Every work unit has one owner, no concurrent edits compete for the same state, and integrated behavior—not worker reports—proves success.