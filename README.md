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

## Verification

From a checkout with Bun installed:

```sh
bun install --frozen-lockfile
bun run test
```

The tests build and exercise the Node CLI, concurrent board/CLI writes, workflow transitions, rejected mutations, and evaluation scoring.

Skill comparisons require an installed, authenticated `omp`:

```sh
bun run eval:skills --model openai-codex/gpt-5.6-luna
```

Use an available `provider/model`. `--case one-file-fix-no-map` selects one scenario; `--output <directory>` selects where to retain evidence. Each run creates a new directory and prints its path.

The evaluator runs isolated with-skill and no-skill sessions using the same model. It checks runtime results, allowed writes, loaded workflows, and fresh-context consumers of generated skills. Reports, transcripts, fixture workspaces, and the hashed skill snapshot are retained under `.scratch/skill-evals/` by default.

A failing skill scenario or runtime failure returns a nonzero exit. Baseline quality failures are reported separately; a tie does not establish that the skills improve outcomes. See [the cases](evals/skills/cases.ts) and [the existing evaluation method](skills/help/references/software-craft/references/author-agent-skill/SKILL.md).
