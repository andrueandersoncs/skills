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

- `technical-documentation` — creates and improves tutorials, how-to guides, reference, and explanation around distinct user needs.
- `product-management` — builds evidence-backed product catalogs and specifications that connect needs, behavior, delivery, and results.
- `ai-opportunity-assessment` — turns business discovery material into a prioritized, evidence-aware AI implementation roadmap.
- `define-task` — turns requests, goals, and commitments into executable AI-agent task records.
- `workflows` — creates and decomposes workflow skills, dry-runs callstack traces, and models state machines.
- `software-craft` — routes executable software, libraries, services, infrastructure, and single-workflow agent skills by their current evidence gap.
- `skill-routers` — designs, implements, and independently reviews deterministic agent skill routers that select one leaf from current and desired state.
- `happy-path` — plans the smallest complete happy-path change or implements an approved happy-path plan.
- `grok-bot` — manages Grok Bots through safe autonomy, feedback loops, coaching, delegation, and learning.
- `predictive-planning` — creates and improves plans as testable forecasts with explicit evidence and response rules.
- `manage-project` — manages AI-agent projects through durable task records and independent review.
- `llm-wiki` — builds and maintains a persistent Markdown wiki from immutable source documents.
- `elicit-llm-creativity` — produces distinctive creative work through broad ideation, external randomness, taste, and independent critique.
- `deslop` — removes AI-writing patterns without changing meaning or flattening the writer's voice.
- `effect-arbitrary` — generates valid sample data from Effect Schemas.
- `effect-schema-brainstorming` — explores domain models through Effect Schemas, generated examples, and executable invariants.
- `npm-publish-tool` — standardizes and publishes TypeScript npm packages and package monorepos with Bun.
- `setup-better-typescript` — sets up Better TypeScript in npm or Bun repositories and monorepos.

Each directory under `skills/` can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.
