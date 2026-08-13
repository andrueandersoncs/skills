# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Included skills

- `extract-to-tickets` — turns transcript extraction reports into approved local tickets.
- `transcript-extraction` — captures evidence-linked claims from transcripts.
- `transcript-filing` — files raw transcripts into a dated archive, then extracts them.
- `workflow-skill` — creates completion-checked workflow skills.

Each top-level skill directory can be added to an agent runtime's configured skill path independently. The workflows operate on the active repository rather than this collection.

## Consumer requirements

- `extract-to-tickets` expects the active repository to provide a `to-tickets` skill, `docs/agents/issue-tracker.md`, and `docs/agents/triage-labels.md`.
- `workflow-skill` expects the runtime to provide `skill-creator`.
