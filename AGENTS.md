# Andrue Anderson's Personal Skills

Prefer the simplest complete change. Avoid speculative features, abstractions, validation, and unrelated cleanup. Treat plans as predictions with observable success conditions.

- `skills/` is canonical. `.agents/skills/` contains installed copies and other packages; source edits do not refresh those copies or active sessions.
- Use [author-agent-skill](skills/help/references/software-craft/references/author-agent-skill/SKILL.md) for skill changes and [the routing guide](skills/help/references/skill-routers/references/canonical-design.md) for selection changes. Keep descriptions specific and load references as needed.
- Apply [deslop](skills/help/references/deslop/SKILL.md) to prose. Use [software laws](skills/help/references/software-laws/SKILL.md) when they explain a concrete tradeoff.
- [Verification](README.md#verification) documents the commands. Default local tests use temporary fixtures and local processes. Run affected checks and fix failures caused by the change without asking between steps. Live model evaluations require a separate authenticated runtime.
- Complete the requested result through relevant verification and repairs. Carry forward existing authorization; ask only for a missing decision or authority that prevents the next action.
