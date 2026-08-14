---
name: workflow-skill
description: "Create a repository workflow skill: a concise, ordered, completion-checked procedure for a repeatable agent task. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill.
---

# Workflow Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

## Inputs

### A. Repeatable task

A description of the repeatable task the workflow skill will document, supplied by the user. It establishes the workflow's scope without asking the skill to perform the task itself.

### B. Intended skill name

The repository skill name supplied by the user when known. This input is optional when a concrete name can be derived from the task and repository conventions.

### C. Task-specific requirements

User-supplied constraints, branches, invariants, or completion conditions that the workflow must preserve.

### D. Repository context

The commands, paths, conventions, and existing records that define how the workflow fits the repository. This context is discovered from the repository and serves as the source of truth for local behavior.

## Outputs

### A. Workflow skill

A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md`. Its frontmatter name matches `<name>`, its description explicitly routes relevant requests, and its procedure can be executed by another agent without inventing policy.

## Procedure

### 1. Gather the contract

Identify the workflow's trigger, supplied inputs, output location and shape, required repository context, state-changing actions, branches, and completion evidence. Ask only for a missing decision that prevents a concrete procedure. Use the repository as the source of truth for commands, paths, and conventions.

### 2. Delegate creation

Call the `/skill-creator` skill with this input (use `/skill:skill-creator` if the runtime requires the colon form):

> Create a markdown skill named `<name>` in `.agents/skills/<name>/`. It is a workflow skill for `<task>`. Follow the workflow-skill contract below, using the user's requirements and the repository's existing conventions. Do not add helper files unless the main skill needs a reusable template or detailed reference.

Replace the placeholders with the contract gathered above, then supply these requirements to that skill:

- Keep `SKILL.md` short. Its YAML frontmatter name matches the directory, and its description states both the outcome and concrete request triggers.
- Start with one sentence that names the workflow's scope and its boundary.
- Use the exact second-level sections `## Inputs`, `## Outputs`, and `## Procedure`, in that order. Treat inputs and outputs as the workflow's declarative contract; keep instructions and state-changing actions in the procedure.
- Under `## Inputs`, give each input a third-level subheading with an uppercase alphabetical index (`### A.`, `### B.`, `### C.`, and so on) because inputs are not ordered. Describe what it is, where it comes from, its expected shape, and whether it is optional. Include exact path patterns, naming rules, and ownership boundaries when they matter.
- Under `## Outputs`, give each output a third-level subheading with an uppercase alphabetical index because outputs are not ordered. Describe what it is, where it belongs, its expected shape, and the state that makes it complete.
- Under `## Procedure`, write the process as an ordered, numbered sequence. Each step performs one observable transition and ends with a checkable completion criterion.
- Put every decision branch beside the step that reaches it. State the condition, action, and result for each branch.
- Preserve important invariants explicitly: source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
- Finish with the exact result to report and the condition that makes the workflow complete.
- Prefer repository lookups over duplicating facts that package configuration, commands, or directory layout already provides. Put conditional or exhaustive material in a linked reference file.

### 3. Verify the result

Re-read the created `SKILL.md` and confirm that it contains `## Inputs`, `## Outputs`, and `## Procedure` in that order, with uppercase alphabetically indexed `###` input and output subheadings and numbered procedure steps. Confirm that inputs and outputs declaratively define the contract while instructions and state-changing actions appear in the procedure. Confirm that an agent can determine its trigger, inputs, output, every action, branch behavior, and completion state without inventing policy. Check the frontmatter name against the directory name and confirm the description is non-empty. Report the skill path and any assumptions made.
