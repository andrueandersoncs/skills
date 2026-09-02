# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Install

Copy and run this [skills.sh](https://skills.sh/andrueandersoncs/skills) command to install the skills:

```sh
npx skills@latest add andrueandersoncs/skills --yes
```

## CLI

```sh
bun add -d @andrue/cli
```

```json
{
  "scripts": {
    "project": "andrue-cli manage-project show",
    "board": "andrue-cli manage-project serve",
    "generate": "andrue-cli generate ./schema.js"
  }
}
```

## Included skills

- `define-task` — turns requests, goals, and commitments into executable AI-agent task records.
- `workflows` — creates and decomposes workflow skills, dry-runs callstack traces, and models state machines.
- `happy-path` — plans the smallest complete happy-path change or implements an approved happy-path plan.
- `predictive-planning` — creates and improves plans as testable forecasts with explicit evidence and response rules.
- `manage-project` — manages AI-agent projects through durable task records and independent review.
- `llm-wiki` — builds and maintains a persistent Markdown wiki from immutable source documents.
- `elicit-llm-creativity` — produces distinctive creative work through broad ideation, external randomness, taste, and independent critique.
- `npm-publish-tool` — standardizes and publishes TypeScript npm packages and package monorepos with Bun.
- `setup-better-typescript` — sets up Better TypeScript in npm or Bun repositories and monorepos.

Each directory under `skills/` can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.
