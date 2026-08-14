---
name: workflow-skill
description: "Create a repository workflow skill: a concise, ordered, completion-checked procedure for a repeatable agent task. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill.
---

# Workflow Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

## Input(s)

The user supplies a repeatable task, its intended skill name when known, and any task-specific requirements. Use the repository to fill in its relevant commands, paths, conventions, and existing records.

## Output(s)

Create or revise `.agents/skills/<name>/SKILL.md`. The result is a Markdown workflow skill with a valid frontmatter name matching `<name>`, an explicit routing description, and a procedure that another agent can execute without inventing policy.

## Procedure

### 1. Gather the contract

Identify the workflow's trigger, supplied inputs, output location and shape, required repository context, state-changing actions, branches, and completion evidence. Ask only for a missing decision that prevents a concrete procedure. Use the repository as the source of truth for commands, paths, and conventions.

### 2. Delegate creation

Call the `/skill-creator` skill with this input (use `/skill:skill-creator` if the runtime requires the colon form):

> Create a markdown skill named `<name>` in `.agents/skills/<name>/`. It is a workflow skill for `<task>`. Follow the workflow-skill contract below, using the user's requirements and the repository's existing conventions. Do not add helper files unless the main skill needs a reusable template or detailed reference.

Replace the placeholders with the contract gathered above, then supply these requirements to that skill:

- Keep `SKILL.md` short. Its YAML frontmatter name matches the directory, and its description states both the outcome and concrete request triggers.
- Start with one sentence that names the workflow's scope and its boundary.
- Use the exact second-level sections `## Input(s)`, `## Output(s)`, and `## Procedure`, in that order. Give exact path patterns, naming rules, and ownership boundaries when they matter.
- Under `## Procedure`, write the process as an ordered, numbered sequence. Each step performs one observable transition and ends with a checkable completion criterion.
- Put every decision branch beside the step that reaches it. State the condition, action, and result for each branch.
- Preserve important invariants explicitly: source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
- Finish with the exact result to report and the condition that makes the workflow complete.
- Prefer repository lookups over duplicating facts that package configuration, commands, or directory layout already provides. Put conditional or exhaustive material in a linked reference file.

### 3. Verify the result

Re-read the created `SKILL.md` and confirm that it contains `## Input(s)`, `## Output(s)`, and `## Procedure` in that order, with numbered steps under the procedure. Confirm that an agent can determine its trigger, inputs, output, every action, branch behavior, and completion state without inventing policy. Check the frontmatter name against the directory name and confirm the description is non-empty. Report the skill path and any assumptions made.
