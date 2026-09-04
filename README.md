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

## Included skill

- `help` — gathers the available task context and routes each request to one bundled specialist.

`help` contains:

- `skill-routers` — agent-skill router design, implementation, and review
- `software-craft` — executable software work
- `workflows` — nonexecuting callstack and state-machine projections
- `technical-documentation` — tutorials, how-to guides, reference, and explanation
- `product-management` — product records and AI opportunity assessments
- `grok-bot` — Grok Bot operation, organization, skills, routines, and templates
- `predictive-planning` — testable forecasts and response rules
- `manage-project` — durable multi-task project coordination
- `llm-wiki` — persistent Git-backed Markdown wikis
- `elicit-llm-creativity` — distinctive creative work
- `deslop` — prose editing that preserves meaning and voice
- `software-laws` — context-aware software-law decisions
- `distill-skill-to-model` — skill-specific LoRA training and sealed evaluation

`skills/help` is the repository's single installable skill. Its routed components operate on the active repository rather than this collection.
