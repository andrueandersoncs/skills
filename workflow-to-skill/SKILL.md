---
name: workflow-to-skill
description: "Create a repository workflow skill: a concise, ordered, completion-checked procedure for a repeatable agent task. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill.
---

# Workflow to Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

## Inputs

1. **Repeatable task:** The task the workflow skill will document.
2. **Intended skill name:** The repository skill name, when supplied or useful.
3. **Task-specific requirements:** Behavior or completion criteria the workflow must preserve.
4. **Repository context:** Relevant commands, paths, conventions, and existing records, discovered as needed.

## Outputs

1. **Workflow skill:** A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md` with a predictable contract and executable procedure.

## Procedure

### 1. Gather the contract

Identify the workflow's trigger, available inputs, output, relevant repository context, state-changing actions, decision branches, invariants, and completion evidence. Follow Postel's Law: accept useful input in any workable form, infer safely from the user request and repository, and add an input constraint only when it is essential for correct execution. Define one precise, predictable output. Use the repository as the source of truth for commands, paths, and conventions. If a missing decision prevents a concrete procedure, ask one explicit blocking question and stop until the user answers; do not invoke a dependency with an unresolved contract. Confirm that the runtime can invoke `skill-creator` before any edit; if it is unavailable, stop without editing and report that dependency as the blocker. This step is complete when the essential contract is known and the dependency is available.

### 2. Delegate creation

Call the `/skill-creator` skill with this input (use `/skill:skill-creator` if the runtime requires the colon form):

> Create or revise the Markdown skill named `<name>` in `.agents/skills/<name>/`. It is a workflow skill for `<task>`. Follow the workflow-to-skill contract below, using the user's requirements and the repository's existing conventions. Preserve existing behavior when revising. Do not add helper files unless the main skill needs a reusable template or detailed reference.

Replace the placeholders with the contract gathered above, then supply these requirements to that skill:

- Keep `SKILL.md` short. Its YAML frontmatter name matches the directory, and its description states both the outcome and concrete request triggers.
- Start with one sentence that names the workflow's scope and its boundary.
- Use the exact second-level sections `## Inputs`, `## Outputs`, and `## Procedure`, in that order. Treat inputs and outputs as the workflow's declarative contract; keep instructions and state-changing actions in the procedure. Make `## Procedure` the final section.
- Follow Postel's Law: "Be conservative in what you produce as output, be liberal in what you accept as input." Accept useful variations in input and describe a constraint only when it is absolutely necessary for correct execution. Produce one precise, predictable result.
- Under `## Inputs`, use a simple numbered list formatted as `1. **<Input name>:** <description>`. Describe accepted information without requiring a source, shape, naming scheme, order, or completeness unless that constraint is essential.
- Under `## Outputs`, use a simple numbered list formatted as `1. **<Output name>:** <description>`. State the stable result, its location when applicable, and the condition that makes it complete. Include only essential constraints.
- Under `## Procedure`, format each item as `### 1. <Step title>`, `### 2. <Step title>`, and so on. Use contiguous numeric indices because procedure steps are ordered by execution. Each step performs one observable transition and ends with a checkable completion criterion.
- Put every decision branch beside the step that reaches it. State the condition, action, and result for each branch.
- Preserve only necessary invariants, such as source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
- Finish with the exact result to report and the condition that makes the workflow complete.
- Prefer repository lookups over duplicating facts that package configuration, commands, or directory layout already provides. Put conditional or exhaustive material in a linked reference file.

If `skill-creator` returns an unresolved error, stop and report it without claiming completion. Otherwise, this step is complete when it has created or revised `.agents/skills/<name>/SKILL.md` with `## Procedure` as the final section.

### 3. Verify and report the result

Re-read the resulting `SKILL.md` and confirm that it contains `## Inputs`, `## Outputs`, and `## Procedure` in that order, with `## Procedure` as the final second-level section. Confirm that inputs and outputs are simple numbered lists without item subheadings, and that procedure steps use contiguous numbered `###` subheadings. Confirm that inputs accept workable variations, every stated constraint is absolutely necessary, and outputs are precise and predictable. Confirm that inputs and outputs declaratively define the contract while instructions and state-changing actions appear in the procedure. Confirm that an agent can determine its trigger, inputs, output, every action, branch behavior, invariant, and completion state without inventing policy. Check the frontmatter name against the directory name and confirm the description is non-empty and routes concrete requests.

Report exactly `Workflow skill: .agents/skills/<name>/SKILL.md` and `Change: <created|updated>`, followed by `Assumptions: <items|None>`; if verification failed, report `Verification failed: <checks>` instead and do not claim completion. The workflow is complete only when every check passes and the exact path and applicable change state are reported.
