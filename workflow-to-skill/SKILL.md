---
name: workflow-to-skill
description: "Create a repository workflow skill as concise, dependency-driven, subagent-ready tasks with completion checks for a repeatable workflow. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill and concurrent fresh-subagent delegation.
---

# Workflow to Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

Run each task in this skill and the resulting workflow skill once in a new, fresh subagent. A task is ready when every declared input is bound; launch all ready tasks concurrently and launch newly ready tasks immediately. Document order does not control execution. Bind every declared `Input` to its value, including required prior-task outputs, replace each `$variable-name` in the task text, and pass the entire rendered task—title, task text, resolved `Inputs`, `Constraints`, and expected `Outputs`—to the subagent. A blocking question, unavailable `skill-creator`, or unresolved failure stops all downstream work.

## Inputs

1. **Repeatable task:** The task the workflow skill will document.
2. **Intended skill name:** The repository skill name, when supplied or useful.
3. **Task-specific requirements:** Behavior or completion criteria the workflow must preserve.
4. **Repository context:** Relevant commands, paths, conventions, and existing records, discovered as needed.

## Outputs

1. **Workflow skill:** A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md` with a predictable contract, executable tasks, and explicit handoffs.

## Tasks

### Gather the workflow contract from the request and repository.

Read the repeatable task: $repeatable-task. Use the intended skill name when helpful: $intended-skill-name. Preserve these requirements: $task-specific-requirements. Treat this repository context as authoritative: $repository-context. Draft a workflow contract that explicitly defines the trigger, accepted inputs, exactly one output, state changes, branches, invariants, and completion evidence. Also return the repository facts and, when revising, the existing target skill.

**Inputs:**

- repeatable-task: The task the user provided.
- intended-skill-name: The requested skill name, when supplied.
- task-specific-requirements: Behavior and completion criteria the workflow must preserve.
- repository-context: Relevant commands, paths, conventions, and existing records.

**Constraints:**

    a. Treat repository commands, paths, and conventions as authoritative.

**Outputs:**

    a. Draft workflow contract.
    b. Repository facts.
    c. Existing target skill, when revising.

### Resolve only gaps that block concrete tasks.

Make this draft workflow contract executable: $draft-workflow-contract. Resolve gaps against the original request: $user-request. Use these repository facts: $repository-facts. Infer safe details whenever possible; if one gap truly blocks the work, return that single question instead of a completed contract.

**Inputs:**

- draft-workflow-contract: The contract drafted from the request and repository.
- user-request: The user’s original request.
- repository-facts: Authoritative facts discovered in the repository.

**Constraints:**

    a. Accept useful input in any workable form.
    b. Do not invoke a dependency with an unresolved contract.

**Outputs:**

    a. Actionable workflow contract when complete.
    b. One blocking question when incomplete.

### Confirm the runtime can invoke `skill-creator`.

Find `skill-creator` in this runtime registry: $runtime-skill-registry. Return whether the dependency is ready and its exact invocation form. If it is unavailable, report that and stop before editing.

**Inputs:**

- runtime-skill-registry: The skills and invocation forms available in the runtime.

**Constraints:**

    a. Editing requires both an actionable workflow contract and an available dependency.

**Outputs:**

    a. Dependency readiness decision, including the supported invocation form.

### Set the target skill's creation boundaries.

Turn this workflow contract into clear creation boundaries: $actionable-workflow-contract. When revising, use this existing skill as the behavior-preserving baseline: $existing-target-skill. Set `.agents/skills/<name>/SKILL.md` as the target and identify every file `skill-creator` may create or revise.

**Inputs:**

- actionable-workflow-contract: The resolved workflow contract.
- existing-target-skill: The current target skill when revising, otherwise empty.

**Constraints:**

    a. Preserve existing behavior when revising.
    b. Add helper files only for reusable templates or detailed references.

**Outputs:**

    a. Target skill boundaries.

### Define the target skill's shell.

Design the skill shell within these boundaries: $target-skill-boundaries. Implement this workflow contract: $actionable-workflow-contract. Apply this execution policy: $fresh-subagent-policy. Require a frontmatter name that matches the directory, a description that states the outcome and concrete request triggers, and `compatibility` that declares concurrent fresh-subagent delegation. Open with one scope-and-boundary sentence, state the execution policy exactly once before `## Inputs`, and order `## Inputs`, `## Outputs`, and final `## Tasks` exactly.

**Inputs:**

- target-skill-boundaries: The allowed target path and supporting files.
- actionable-workflow-contract: The resolved workflow contract.
- fresh-subagent-policy: The task execution policy stated above.

**Constraints:**

    a. Keep `SKILL.md` short.
    b. Keep contract declarations outside `## Tasks`.
    c. Keep task work and state changes inside `## Tasks`.

**Outputs:**

    a. Skill shell requirements.

### Define a liberal input contract and one predictable output.

Derive a liberal input contract and exactly one predictable output from this workflow contract: $actionable-workflow-contract. Format each input as `1. **<Input name>:** <description>` and the output as `1. **<Output name>:** <description>`, including its stable result, location, and completion condition.

**Inputs:**

- actionable-workflow-contract: The resolved workflow contract.

**Constraints:**

    a. Accept useful input variations and produce one precise result.
    b. Constrain input source, shape, naming, order, or completeness only when essential.

**Outputs:**

    a. Target input requirements.
    b. Target output requirements.

### Define concise dependency-driven tasks.

Turn this workflow contract into the smallest complete set of dependency-driven tasks: $actionable-workflow-contract. Give each task one observable transition, a completion check, and every input it needs, including explicit prior-task outputs. Make independent tasks runnable concurrently and return their requirements with dependencies expressed only through declared inputs.

**Inputs:**

- actionable-workflow-contract: The resolved workflow contract.

**Constraints:**

    a. Format each task as `### <task>` with a unique action title and no number.
    b. Place exactly one concise task paragraph immediately below each task header.
    c. Give each task `Inputs`, `Constraints`, and `Outputs` labels in that order after the task paragraph.
    d. Format `Inputs` as an unordered list of `- <variable-name>: <context>` items with meaningful, unique kebab-case names and concise context explaining each value or source.
    e. Inject every declared input into the task paragraph as `$<variable-name>` and use no undeclared variables.
    f. Place one empty line between the task header, task paragraph, each label, and its content.
    g. Format `Constraints` and `Outputs` as concise, single-indented alphabetical lists that restart at `a.`.
    h. Keep work in the task paragraph and reserve `Constraints` for limits, invariants, and acceptance boundaries.
    i. Declare only true data dependencies so every independent task can run concurrently.

**Outputs:**

    a. Target task requirements.

### Define branches, invariants, and supporting detail where they apply.

Use this workflow contract: $actionable-workflow-contract. Follow these task requirements: $target-task-requirements. Ground repository-specific details in these facts: $repository-facts. Define only necessary branches and invariants. Keep each branch beside the task that reaches it and state its condition, action, and result. Move conditional or exhaustive supporting detail into linked references.

**Inputs:**

- actionable-workflow-contract: The resolved workflow contract.
- target-task-requirements: The required task graph and task format.
- repository-facts: Authoritative facts discovered in the repository.

**Constraints:**

    a. Preserve only necessary invariants, such as source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
    b. Prefer repository lookups over duplicated facts.

**Outputs:**

    a. Branch requirements.
    b. Invariant requirements.
    c. Supporting-detail requirements.

### Define the target workflow's final result.

Use this output contract: $target-output-requirements. Use these task requirements: $target-task-requirements. Define exactly what the final task reports and the condition that makes the workflow complete.

**Inputs:**

- target-output-requirements: The target skill’s output contract.
- target-task-requirements: The required task graph and task format.

**Constraints:**

    a. Require the final task to report the result and completion state.

**Outputs:**

    a. Final result requirement.
    b. Workflow completion condition.

### Invoke `/skill-creator` with the contract and requirements.

Create the target skill for this workflow contract: $actionable-workflow-contract. Stay within these boundaries: $target-skill-boundaries. Apply the shell, input, output, and task requirements: $skill-shell-requirements; $target-input-requirements; $target-output-requirements; $target-task-requirements. Integrate the branches, invariants, and supporting-detail rules: $branch-requirements; $invariant-requirements; $supporting-detail-requirements. End with $final-result-requirement and complete only when $workflow-completion-condition. Preserve $task-specific-requirements and treat $repository-facts as authoritative. Invoke `skill-creator` using $dependency-readiness-decision and return its result.

**Inputs:**

- actionable-workflow-contract: The resolved workflow contract.
- target-skill-boundaries: The allowed target path and supporting files.
- skill-shell-requirements: The required frontmatter and section shell.
- target-input-requirements: The target skill’s input contract.
- target-output-requirements: The target skill’s output contract.
- target-task-requirements: The required task graph and task format.
- branch-requirements: The required conditional behavior.
- invariant-requirements: The behavior that must always hold.
- supporting-detail-requirements: The detail that belongs in linked references.
- final-result-requirement: The exact result the final task must report.
- workflow-completion-condition: The condition that makes the workflow complete.
- task-specific-requirements: Behavior and completion criteria supplied by the user.
- repository-facts: Authoritative facts discovered in the repository.
- dependency-readiness-decision: The confirmed `skill-creator` invocation form.

**Constraints:**

    a. The invocation form must match the dependency readiness decision.

**Outputs:**

    a. `skill-creator` result.

### Handle the `skill-creator` result.

Inspect this `skill-creator` result: $skill-creator-result. On success, return the resulting `SKILL.md`, its path, the change state, and any assumptions. On unresolved failure, return the error and stop without claiming completion.

**Inputs:**

- skill-creator-result: The result returned by `skill-creator`.

**Constraints:**

    a. Success requires the target skill to exist with `## Tasks` last.

**Outputs:**

    a. Resulting `SKILL.md` on success.
    b. Target skill path on success.
    c. Change state on success.
    d. Assumptions on success.
    e. Error report on unresolved failure.

### Verify the frontmatter and section structure.

Verify this skill: $resulting-skill. Its target path is: $target-skill-path. Check it against these shell requirements: $skill-shell-requirements. Apply this fresh-subagent policy: $fresh-subagent-policy. Verify the frontmatter, routing description, compatibility, maximal-parallelism policy, policy placement, and top-level section order, then return the frontmatter and structure results.

**Inputs:**

- resulting-skill: The generated or revised `SKILL.md`.
- target-skill-path: The resolved path to the target skill.
- skill-shell-requirements: The required frontmatter and section shell.
- fresh-subagent-policy: The task execution policy stated above.

**Constraints:**

    a. Pass only when every check matches the skill shell requirements.

**Outputs:**

    a. Frontmatter verification result.
    b. Section structure verification result.

### Verify the contract and list formats.

Verify this skill: $resulting-skill. Check its inputs against: $target-input-requirements. Check its output against: $target-output-requirements. Apply this fresh-subagent policy: $fresh-subagent-policy. Inspect every task header, handoff, task paragraph, label, constraint, and list. Confirm that each task paragraph contains the work and each constraint is only a limit, invariant, or acceptance boundary, then return the contract and format results.

**Inputs:**

- resulting-skill: The generated or revised `SKILL.md`.
- target-input-requirements: The target skill’s input contract.
- target-output-requirements: The target skill’s output contract.
- fresh-subagent-policy: The task execution policy stated above.

**Constraints:**

    a. Keep the target skill’s top-level inputs and output as simple numbered lists without item subheadings.
    b. Accept workable inputs, require only essential constraints, and produce one precise output.
    c. Format every task as an unnumbered `### <task>` header with a unique action title.
    d. Apply the global concurrent fresh-subagent policy without per-task execution-context declarations.
    e. Declare every needed handoff under the receiving task's `Inputs` label and no dependency used only to impose order.
    f. Require exactly one concise task paragraph immediately below each task header.
    g. Give every task `Inputs`, `Constraints`, and `Outputs` labels in order after the task paragraph.
    h. Require each task input to use `- <variable-name>: <context>` with a meaningful, unique kebab-case name and concise context explaining its value or source.
    i. Require each task paragraph to inject every declared input as `$<variable-name>` and contain no undeclared variables.
    j. Require one empty line between every task element and its content.
    k. Use concise, single-indented alphabetical lists starting at `a.` under `Constraints` and `Outputs`.

**Outputs:**

    a. Contract verification result.
    b. List format verification result.

### Verify the tasks are executable without invented policy.

Trace every task in this skill: $resulting-skill. Compare it with this workflow contract: $actionable-workflow-contract. Verify these branch requirements: $branch-requirements. Preserve these invariants: $invariant-requirements. Require this final result: $final-result-requirement. Use this completion condition: $workflow-completion-condition. Apply this fresh-subagent policy: $fresh-subagent-policy. Return whether the tasks are executable, self-contained, maximally parallel, and free of invented policy.

**Inputs:**

- resulting-skill: The generated or revised `SKILL.md`.
- actionable-workflow-contract: The resolved workflow contract.
- branch-requirements: The required conditional behavior.
- invariant-requirements: The behavior that must always hold.
- final-result-requirement: The exact result the final task must report.
- workflow-completion-condition: The condition that makes the workflow complete.
- fresh-subagent-policy: The task execution policy stated above.

**Constraints:**

    a. Keep inputs and outputs declarative.
    b. Keep task work and state changes inside `## Tasks`.
    c. Do not rely on inherited context, prior reasoning, or undeclared state.
    d. Pass only when each dependency carries required data and every ready task can start immediately.

**Outputs:**

    a. Task executability result.

### Report the verified result.

Check the frontmatter result: $frontmatter-verification-result. Check the section-structure result: $section-structure-verification-result. Check the contract result: $contract-verification-result. Check the list-format result: $list-format-verification-result. Check the task-executability result: $task-executability-result. If any check failed, report `Verification failed: <checks>`. Otherwise report three lines: `Workflow skill: $target-skill-path`, `Change: $change-state`, and `Assumptions: $assumptions`.

**Inputs:**

- frontmatter-verification-result: The frontmatter verification check.
- section-structure-verification-result: The section-order verification check.
- contract-verification-result: The contract verification check.
- list-format-verification-result: The list-format verification check.
- task-executability-result: The executability verification check.
- target-skill-path: The resolved path to the target skill.
- change-state: Whether the target skill was created or updated.
- assumptions: Any assumptions made, otherwise `None`.

**Constraints:**

    a. Claim completion only when every check passes and the exact path and change state are reported.

**Outputs:**

    a. Completion report when verification passes.
    b. Verification failure report when verification fails.
