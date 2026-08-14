# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Install

Copy and run this [skills.sh](https://skills.sh/andrueandersoncs/skills) command to install the skills:

```sh
npx skills add andrueandersoncs/skills
```

## Included skills

- `callstack-simulation` — dry-runs workflows, procedures, algorithms, and functions as source-grounded callstack traces.
- `state-machine-simulation` — turns workflows, procedures, algorithms, and functions into event-driven, graph-only browser apps.
- `extract-skill-to-repository` — moves project skills into this shared repository with dependency and Git safety checks.
- `extract-to-tickets` — turns transcript extraction reports into approved local tickets.
- `transcript-extraction` — captures evidence-linked claims from transcripts.
- `transcript-filing` — files raw transcripts into a dated archive, then extracts them.
- `transcript-purpose-analysis` — segments transcripts and labels each section by its communicative purpose.
- `workflow-skill` — creates completion-checked workflow skills.

Each top-level skill directory can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.

## Consumer requirements

- `extract-skill-to-repository` expects the active project and its sibling `../skills` directory to be Git repositories.
- `extract-to-tickets` expects the active repository to provide a `to-tickets` skill, `docs/agents/issue-tracker.md`, and `docs/agents/triage-labels.md`.
- `workflow-skill` expects the runtime to provide `skill-creator` and `callstack-simulation`.
