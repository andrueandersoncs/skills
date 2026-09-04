---
name: author-agent-skill
description: Create or improve reusable agent skills. Use for SKILL.md authoring, consolidation, or prompt-to-skill extraction.
---

# Author Agent Skill

Create a skill only when a recurring task needs guidance the model would not reliably infer.

## Method

1. Define the recurring outcome, intended callers, and evidence of completion.
2. Inspect existing skills and choose one owner for overlapping behavior. Consolidate instead of adding another competing trigger.
3. Write a short, discriminating description that says what the skill does and when it applies.
4. Keep `SKILL.md` to shared decisions and constraints. Link mode-specific procedures, examples, schemas, scripts, and assets only where they become relevant.
5. Describe outcomes and decision criteria. Use exact sequences or numerical rules only when deviation causes a concrete failure.
6. Preserve the user's scope, permissions, repository conventions, and portable source facts.
7. Validate frontmatter and links. Use fresh-context routing or behavior checks when uncertainty or risk justifies them, then tighten only wording linked to an observed failure.

## Artifact context

When the requested artifact is a project-local verification skill, apply [the verification skill context](references/verification-harness.md) within this authoring workflow.

## Output

A created, consolidated, or revised skill with only the resources its workflow needs.

## Done

The skill routes on its intended request, avoids adjacent work, has one canonical source for each rule, and changes a target decision the model would otherwise miss. Use a fresh no-skill comparison when that last claim is uncertain.
