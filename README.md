# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Install

Copy and run this [skills.sh](https://skills.sh/andrueandersoncs/skills) command to install the skills:

```sh
npx skills add andrueandersoncs/skills
```

## Included skills

- `workflow-callstack-simulation` — dry-runs workflows, procedures, algorithms, and functions as source-grounded callstack traces.
- `decompose-skill` — splits skills into reusable workflow skills and identifies useful agent or subagent boundaries.
- `workflow-state-machine-simulation` — turns workflows, procedures, algorithms, and functions into static Mermaid state diagrams by default, with optional interactive HTML graph apps.
- `implement-happy-path` — implements an approved plan exactly as written and validates its normal end-to-end path.
- `plan-happy-path` — plans the smallest complete happy-path implementation and independently verifies its scope.
- `workflow-to-skill` — creates completion-checked workflow skills.

Each top-level skill directory can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.

## Consumer requirements

- `workflow-to-skill` expects the runtime to provide `skill-creator` and `workflow-callstack-simulation`.
