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

- `skill-routers` — designs, implements, and independently reviews deterministic agent skill routers from current and desired state.
- `software-craft` — routes software work to exactly one state-changing workflow, with Effect, TypeScript, Swift, npm publishing, and tool guidance supplied as context.
- `workflows` — produces source-grounded callstack and state-machine projections without executing the target.
- `technical-documentation` — creates and improves tutorials, how-to guides, reference, and explanation around distinct user needs.
- `product-management` — builds evidence-backed product records and AI opportunity assessments connecting needs, behavior, delivery, and results.
- `grok-bot` — manages Grok Bots through safe autonomy, feedback loops, coaching, delegation, and learning.
- `predictive-planning` — creates and improves plans as testable forecasts with explicit evidence and response rules.
- `manage-project` — manages AI-agent projects through durable task records and independent review.
- `llm-wiki` — builds and maintains a persistent Markdown wiki from immutable source documents.
- `elicit-llm-creativity` — produces distinctive creative work through broad ideation, external randomness, taste, and independent critique.
- `deslop` — removes AI-writing patterns without changing meaning or flattening the writer's voice.
- `software-laws` — applies and evaluates named software laws as context-aware evidence prompts.

Each directory under `skills/` can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.
