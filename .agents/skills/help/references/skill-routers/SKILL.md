---
name: skill-routers
description: Gather context about agent-skill-router work and match the situation to design, implementation, or independent review. Use when asked to explain, design, implement, or audit an agent skill router.
metadata:
  internal: true
---

# Skill Routers

An agent skill router does pattern matching for contextual situations: gather context, identify the closest matching situation, and pass the request and relevant context to that skill.

Read [`references/canonical-design.md`](references/canonical-design.md) and use its gather → match → handoff procedure with these patterns.

| Situation pattern | Skill |
| --- | --- |
| The user needs a router explained, or its situation patterns and skill responsibilities need defining or rethinking. | [`design-skill-router`](references/design-skill-router/SKILL.md) |
| The intended situation patterns and destination skills are understood, and router files need creating or updating. | [`implement-skill-router`](references/implement-skill-router/SKILL.md) |
| An existing router needs an independent assessment, findings, or a verdict rather than edits. | [`review-skill-router`](references/review-skill-router/SKILL.md) |