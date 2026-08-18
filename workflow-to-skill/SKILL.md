---
name: workflow-to-skill
description: "Create a repository workflow skill: a concise, ordered, completion-checked procedure for a repeatable agent task. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator and workflow-callstack-simulation skills.
---

# Workflow to Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

## Inputs

1. **Repeatable task:** The task the workflow skill will document.
2. **Intended skill name:** The repository skill name, when supplied or useful.
3. **Task-specific requirements:** Behavior or completion criteria the workflow must preserve.
4. **Repository context:** Relevant commands, paths, conventions, and existing records, discovered as needed.

## Outputs

1. **Workflow skill:** A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md` with a predictable contract, executable procedure, and one final source-grounded `## Callstack Simulation` section.

## Procedure

### 1. Gather the contract

Identify the workflow's trigger, available inputs, output, relevant repository context, state-changing actions, decision branches, invariants, and completion evidence. Follow Postel's Law: accept useful input in any workable form, infer safely from the user request and repository, and add an input constraint only when it is essential for correct execution. Define one precise, predictable output. Use the repository as the source of truth for commands, paths, and conventions. If a missing decision prevents a concrete procedure, ask one explicit blocking question and stop until the user answers; do not invoke a dependency with an unresolved contract. Confirm that the runtime can invoke both `skill-creator` and `workflow-callstack-simulation` before any edit; if either is unavailable, stop without editing and report that dependency as the blocker. This step is complete when the essential contract is known and both dependencies are available.

### 2. Delegate creation

Call the `/skill-creator` skill with this input (use `/skill:skill-creator` if the runtime requires the colon form):

> Create or revise the Markdown skill named `<name>` in `.agents/skills/<name>/`. It is a workflow skill for `<task>`. Follow the workflow-to-skill contract below, using the user's requirements and the repository's existing conventions. Preserve existing behavior when revising. Do not add helper files unless the main skill needs a reusable template or detailed reference.

Replace the placeholders with the contract gathered above, then supply these requirements to that skill:

- Keep `SKILL.md` short. Its YAML frontmatter name matches the directory, and its description states both the outcome and concrete request triggers.
- Start with one sentence that names the workflow's scope and its boundary.
- Use the exact second-level sections `## Inputs`, `## Outputs`, and `## Procedure`, in that order, for the workflow body. Treat inputs and outputs as the workflow's declarative contract; keep instructions and state-changing actions in the procedure. Do not generate or retain a `## Callstack Simulation` section; the caller regenerates and appends it.
- Follow Postel's Law: "Be conservative in what you produce as output, be liberal in what you accept as input." Accept useful variations in input and describe a constraint only when it is absolutely necessary for correct execution. Produce one precise, predictable result.
- Under `## Inputs`, use a simple numbered list formatted as `1. **<Input name>:** <description>`. Describe accepted information without requiring a source, shape, naming scheme, order, or completeness unless that constraint is essential.
- Under `## Outputs`, use a simple numbered list formatted as `1. **<Output name>:** <description>`. State the stable result, its location when applicable, and the condition that makes it complete. Include only essential constraints.
- Under `## Procedure`, format each item as `### 1. <Step title>`, `### 2. <Step title>`, and so on. Use contiguous numeric indices because procedure steps are ordered by execution. Each step performs one observable transition and ends with a checkable completion criterion.
- Put every decision branch beside the step that reaches it. State the condition, action, and result for each branch.
- Preserve only necessary invariants, such as source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
- Finish with the exact result to report and the condition that makes the workflow complete.
- Prefer repository lookups over duplicating facts that package configuration, commands, or directory layout already provides. Put conditional or exhaustive material in a linked reference file.

If `skill-creator` returns an unresolved error, stop and report it without claiming completion. Otherwise, this step is complete when it has created or revised the workflow body at `.agents/skills/<name>/SKILL.md` without a `## Callstack Simulation` section.

### 3. Generate and include the callstack simulation

Call the `/workflow-callstack-simulation` skill with this input (use `/skill:workflow-callstack-simulation` if the runtime requires the colon form):

> Generate a compact callstack simulation for `.agents/skills/<name>/SKILL.md`, using its `## Procedure` as the entry point. Keep task inputs and external responses symbolic unless the user supplied a scenario. Return the raw callstack inline without executing the target or writing a destination.

Replace `<name>` with the resolved skill name. Do not handwrite or reformat the returned callstack. Append it once at the bottom of `SKILL.md` as `## Callstack Simulation`, one blank line, then the raw callstack. If a section with that heading exists, remove it before invoking `workflow-callstack-simulation` and replace it rather than appending a duplicate. If the simulation is blocked, malformed, or returns an unresolved error, stop and report the failure without claiming completion. This step is complete when exactly one `## Callstack Simulation` section is the final second-level section and its content is the newly generated callstack.

### 4. Verify and report the result

Re-read the resulting `SKILL.md` and confirm that it contains `## Inputs`, `## Outputs`, and `## Procedure` in that order, followed by exactly one final `## Callstack Simulation` section. Confirm that inputs and outputs are simple numbered lists without item subheadings, and that procedure steps use contiguous numbered `###` subheadings. Confirm that inputs accept workable variations, every stated constraint is absolutely necessary, and outputs are precise and predictable. Confirm that inputs and outputs declaratively define the contract while instructions and state-changing actions appear in the procedure. Confirm that an agent can determine its trigger, inputs, output, every action, branch behavior, invariants, and completion state without inventing policy. Check the frontmatter name against the directory name and confirm the description is non-empty and routes concrete requests. Confirm that the final section contains the source-grounded raw callstack returned by `workflow-callstack-simulation`, with no simulation title, metadata, nested `## Callstack` heading, wrapper, or completion message.

Report exactly `Workflow skill: .agents/skills/<name>/SKILL.md` and `Change: <created|updated>`, followed by `Assumptions: <items|None>`; if verification failed, report `Verification failed: <checks>` instead and do not claim completion. The workflow is complete only when every check passes, the callstack simulation is present at the bottom, and the exact path and applicable change state are reported.

## Callstack Simulation

**Workflow to Skill**(repeatable task, intended skill name, task-specific requirements, repository context)
│
├─ **Gather The Contract**(workflow request, repository context, and runtime dependencies)
│  │
│  ├─ **Accept And Normalize Inputs**(usable variations from the request and repository)
│  │  │
│  │  └─ if (an input constraint is not essential): omit it
│  │
│  ├─ **Define The Output**(one precise, predictable result)
│  │
│  ├─ if (a missing decision prevents a concrete procedure): ask one blocking question and stop
│  │
│  ├─ else if (skill-creator or workflow-callstack-simulation is unavailable): stop without editing and report the blocker
│  │
│  └─ else: fix the essential contract and confirm both dependencies
│
├─ **Delegate Creation**(resolved name, task, and contract)
│  │
│  └─ **Skill Creator**(resolved workflow skill request without a callstack section)
│     │
│     └─ if (an unresolved error occurs): stop and report without claiming completion
│
├─ **Generate And Include The Callstack Simulation**(created or revised workflow body)
│  │
│  ├─ **Prepare The Callstack Section**(workflow body)
│  │  │
│  │  └─ if (a Callstack Simulation section exists): remove it before regeneration
│  │
│  ├─ **Callstack Simulation**(compact symbolic simulation of the Procedure)
│  │  │
│  │  └─ if (the result is blocked, malformed, or unresolved): stop and report the failure
│  │
│  └─ **Append The Callstack Simulation Section**(raw generated callstack)
│
└─ **Verify And Report The Result**(completed workflow skill)
   │
   ├─ **Check The Contract Format**(numbered input and output lists, numbered procedure subheadings)
   │
   ├─ **Check Postel's Law**(liberal inputs, essential constraints, predictable outputs)
   │
   ├─ if (any workflow or callstack check fails): report the failed checks without claiming completion
   │
   └─ else: report the workflow path, change state, and assumptions
