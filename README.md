# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Install

Copy and run this [skills.sh](https://skills.sh/andrueandersoncs/skills) command to install the skills:

```sh
npx skills@latest add andrueandersoncs/skills --yes
```

## Included skills

- `define-task` — turns requests, goals, and commitments into executable AI-agent task records.
- `workflows` — creates and decomposes workflow skills, dry-runs callstack traces, and models state machines.
- `implement-happy-path` — implements an approved plan exactly as written and validates its normal end-to-end path.
- `plan-happy-path` — plans the smallest complete happy-path implementation and independently verifies its scope.
- `predictive-planning` — creates and improves plans as testable forecasts with explicit evidence and response rules.
- `manage-project` — manages AI-agent projects through durable task records and independent review.
- `llm-wiki` — builds and maintains a persistent Markdown wiki from immutable source documents.
- `npm-publish-tool` — standardizes and publishes TypeScript npm packages and package monorepos with Bun.

Each top-level skill directory can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.
