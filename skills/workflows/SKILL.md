---
name: workflows
description: Produce source-grounded, nonexecuting projections of a workflow as a callstack trace, a state-machine model, or both. Use when asked to dry-run, trace, simulate, visualize, or diagram a workflow, procedure, algorithm, function, or skill without executing it.
---

# Workflows

Route from the projections already available to the observable projection the user wants.

- **Current state:** Which requested projections are present, current, and complete.
- **Desired state:** A callstack trace, a state-machine projection, or both.

Choose the first matching row. Row order is the only precedence rule.

| Current state | Desired state | Result |
| --- | --- | --- |
| Any | A result outside a source-grounded, nonexecuting workflow projection | Not this router |
| Every requested projection is current and complete | That same satisfied state | Done |
| The requested callstack trace is absent or stale | A callstack trace, or both projections | [`simulate-callstack`](references/simulate-callstack/SKILL.md) |
| The requested state/event projection is absent or stale | A state-machine projection, or both projections | [`simulate-state-machine`](references/simulate-state-machine/SKILL.md) |

Load exactly one selected leaf and treat it as the active skill.

After the leaf completes:

1. Update current state from its completion evidence.
2. Stop when current state satisfies desired state.
3. Otherwise route again with the same desired state.
4. If the same leaf is selected without a state change, report an incomplete leaf result or defective route.
