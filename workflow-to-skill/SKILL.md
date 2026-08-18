---
name: workflow-to-skill
description: "Create a repository workflow skill: concise, ordered tasks with completion checks for a repeatable workflow. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill and fresh subagent delegation.
---

# Workflow to Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

Run every numbered task in this skill and the resulting workflow skill in a new, fresh subagent. Give each subagent only its task definition and declared inputs, including required prior-task outputs. Within each task, place the work under `Instructions` and its limits under `Constraints`.

## Inputs

1. **Repeatable task:** The task the workflow skill will document.
2. **Intended skill name:** The repository skill name, when supplied or useful.
3. **Task-specific requirements:** Behavior or completion criteria the workflow must preserve.
4. **Repository context:** Relevant commands, paths, conventions, and existing records, discovered as needed.

## Outputs

1. **Workflow skill:** A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md` with a predictable contract, executable tasks, and explicit handoffs.

## Tasks

### Task 1: Gather the workflow contract from the request and repository.

**Inputs:**

    a. Repeatable task.
    b. Intended skill name, when supplied.
    c. Task-specific requirements.
    d. Repository context.

**Instructions:**

    a. Inspect the request, relevant repository context, and existing target skill when revising.
    b. Draft a contract covering the trigger, accepted inputs, one output, state changes, branches, invariants, and completion evidence.

**Constraints:**

    a. Treat repository commands, paths, and conventions as authoritative.

**Outputs:**

    a. Draft workflow contract.
    b. Repository facts.
    c. Existing target skill, when revising.

### Task 2: Resolve only gaps that block concrete tasks.

**Inputs:**

    a. Draft workflow contract.
    b. User request.
    c. Repository facts.

**Instructions:**

    a. Infer missing details from the request and repository when possible.
    b. Ask one explicit blocking question only when inference cannot produce concrete tasks.

**Constraints:**

    a. Accept useful input in any workable form.
    b. Do not invoke a dependency with an unresolved contract.

**Outputs:**

    a. Actionable workflow contract when complete.
    b. One blocking question when incomplete.

### Task 3: Confirm the runtime can invoke `skill-creator`.

**Inputs:**

    a. Actionable workflow contract.
    b. Runtime skill registry.

**Instructions:**

    a. Check the runtime skill registry for `skill-creator`.
    b. When it is unavailable, stop before editing and report the missing dependency.

**Constraints:**

    a. Editing requires both an actionable workflow contract and an available dependency.

**Outputs:**

    a. Dependency readiness decision.

### Task 4: Set the target skill's creation boundaries.

**Inputs:**

    a. Actionable workflow contract.
    b. Existing target skill, when revising.

**Instructions:**

    a. Set `.agents/skills/<name>/SKILL.md` as the target for `<task>`.
    b. Define the files that `skill-creator` may create or revise.

**Constraints:**

    a. Preserve existing behavior when revising.
    b. Add helper files only for reusable templates or detailed references.

**Outputs:**

    a. Target skill boundaries.

### Task 5: Define the target skill's shell.

**Inputs:**

    a. Target skill boundaries.
    b. Actionable workflow contract.
    c. Fresh-subagent policy stated above.

**Instructions:**

    a. Define frontmatter with the matching name, a description that states the outcome and concrete request triggers, and `compatibility` that declares fresh-subagent delegation.
    b. Open the body with one sentence naming the workflow scope and boundary, then state the fresh-subagent policy once before `## Inputs`.
    c. Order `## Inputs`, `## Outputs`, and final `## Tasks` exactly.

**Constraints:**

    a. Keep `SKILL.md` short.
    b. Keep contract declarations outside `## Tasks`.
    c. Keep instructions and state changes inside `## Tasks`.

**Outputs:**

    a. Skill shell requirements.

### Task 6: Define a liberal input contract and one predictable output.

**Inputs:**

    a. Actionable workflow contract.

**Instructions:**

    a. Define each input as `1. **<Input name>:** <description>`.
    b. Define one output as `1. **<Output name>:** <description>` with its stable result, applicable location, and completion condition.

**Constraints:**

    a. Accept useful input variations and produce one precise result.
    b. Constrain input source, shape, naming, order, or completeness only when essential.

**Outputs:**

    a. Target input requirements.
    b. Target output requirements.

### Task 7: Define concise ordered tasks.

**Inputs:**

    a. Actionable workflow contract.

**Instructions:**

    a. Split the workflow into concise independent tasks in execution order.
    b. Give each task one observable transition and a checkable completion criterion.
    c. Declare all context needed by each task, including required prior-task outputs.

**Constraints:**

    a. Format each task as `### Task <n>: <task>` with contiguous indices.
    b. Give each task `Inputs`, `Instructions`, `Constraints`, and `Outputs` labels in that order.
    c. Place one empty line between each label and its list.
    d. Keep task work under `Instructions` and reserve `Constraints` for limits, invariants, and acceptance boundaries.
    e. Use concise, single-indented alphabetical items that restart at `a.` for every label.

**Outputs:**

    a. Target task requirements.

### Task 8: Define branches, invariants, and supporting detail where they apply.

**Inputs:**

    a. Actionable workflow contract.
    b. Target task requirements.
    c. Repository facts.

**Instructions:**

    a. Identify required branches, invariants, and supporting detail from the workflow contract.
    b. Keep each branch beside the task that reaches it and state the branch's condition, action, and result.
    c. Move conditional or exhaustive supporting detail into linked references.

**Constraints:**

    a. Preserve only necessary invariants, such as source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
    b. Prefer repository lookups over duplicated facts.

**Outputs:**

    a. Branch requirements.
    b. Invariant requirements.
    c. Supporting-detail requirements.

### Task 9: Define the target workflow's final result.

**Inputs:**

    a. Target output requirements.
    b. Target task requirements.

**Instructions:**

    a. Define the exact result the final task reports.
    b. Define the condition that makes the workflow complete.

**Constraints:**

    a. Require the final task to report the result and completion state.

**Outputs:**

    a. Final result requirement.
    b. Workflow completion condition.

### Task 10: Invoke `/skill-creator` with the contract and requirements.

**Inputs:**

    a. Actionable workflow contract.
    b. Target skill boundaries.
    c. Skill shell requirements.
    d. Target input requirements.
    e. Target output requirements.
    f. Target task requirements.
    g. Branch requirements.
    h. Invariant requirements.
    i. Supporting-detail requirements.
    j. Final result requirement.
    k. Workflow completion condition.
    l. Task-specific requirements.
    m. Repository facts.

**Instructions:**

    a. Invoke `/skill-creator` with the complete contract and requirements.
    b. Include the resolved skill name and repeatable task.

**Constraints:**

    a. Use `/skill:skill-creator` when the runtime requires the colon form.

**Outputs:**

    a. `skill-creator` result.

### Task 11: Handle the `skill-creator` result.

**Inputs:**

    a. `skill-creator` result.

**Instructions:**

    a. Inspect the `skill-creator` result and classify it as success or unresolved failure.
    b. On success, collect the resulting skill, path, change state, and assumptions.
    c. On unresolved failure, stop and collect the error report without claiming completion.

**Constraints:**

    a. Success requires the target skill to exist with `## Tasks` last.

**Outputs:**

    a. Resulting `SKILL.md` on success.
    b. Target skill path on success.
    c. Change state on success.
    d. Assumptions on success.
    e. Error report on unresolved failure.

### Task 12: Verify the frontmatter and section structure.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Target skill path.
    c. Skill shell requirements.
    d. Fresh-subagent policy stated above.

**Instructions:**

    a. Check that the frontmatter name matches the directory and the non-empty description states the outcome and routes concrete requests.
    b. Check that `compatibility` declares fresh-subagent delegation and the policy appears once before `## Inputs`.
    c. Check that `## Inputs`, `## Outputs`, and `## Tasks` appear in that order with `## Tasks` last.

**Constraints:**

    a. Pass only when every check matches the skill shell requirements.

**Outputs:**

    a. Frontmatter verification result.
    b. Section structure verification result.

### Task 13: Verify the contract and list formats.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Target input requirements.
    c. Target output requirements.
    d. Fresh-subagent policy stated above.

**Instructions:**

    a. Compare the declared inputs and output with their requirements.
    b. Inspect every task header, handoff, label, and list.
    c. Reject task work placed under `Constraints` or limits placed under `Instructions`.

**Constraints:**

    a. Keep inputs and outputs as simple numbered lists without item subheadings.
    b. Accept workable inputs, require only essential constraints, and produce one precise output.
    c. Format every task as a contiguous `### Task <n>: <task>` header.
    d. Apply the global fresh-subagent policy without per-task execution-context declarations.
    e. Declare every needed handoff under the receiving task's `Inputs` label.
    f. Give every task `Inputs`, `Instructions`, `Constraints`, and `Outputs` labels in order.
    g. Place one empty line between each label and its list.
    h. Use concise, single-indented alphabetical items that restart at `a.` for every label.

**Outputs:**

    a. Contract verification result.
    b. List format verification result.

### Task 14: Verify the tasks are executable without invented policy.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Actionable workflow contract.
    c. Branch requirements.
    d. Invariant requirements.
    e. Final result requirement.
    f. Workflow completion condition.
    g. Fresh-subagent policy stated above.

**Instructions:**

    a. Trace each task from its declared inputs through its instructions to its outputs.
    b. Confirm that each `Instructions` section states the work and each `Constraints` section contains only limits, invariants, or acceptance boundaries.
    c. Confirm that every task declares all required context, including prior-task outputs.
    d. Confirm that the trigger, inputs, output, tasks, branches, invariants, and completion state are explicit.

**Constraints:**

    a. Keep inputs and outputs declarative.
    b. Keep instructions and state changes inside `## Tasks`.
    c. Do not rely on inherited context, prior reasoning, or undeclared state.

**Outputs:**

    a. Task executability result.

### Task 15: Report the verified result.

**Inputs:**

    a. Frontmatter verification result.
    b. Section structure verification result.
    c. Contract verification result.
    d. List format verification result.
    e. Task executability result.
    f. Target skill path.
    g. Change state.
    h. Assumptions.

**Instructions:**

    a. Report `Workflow skill: .agents/skills/<name>/SKILL.md`, `Change: <created|updated>`, and `Assumptions: <items|None>` after success.
    b. Report `Verification failed: <checks>` after failure.

**Constraints:**

    a. Claim completion only when every check passes and the exact path and change state are reported.

**Outputs:**

    a. Completion report when verification passes.
    b. Verification failure report when verification fails.
