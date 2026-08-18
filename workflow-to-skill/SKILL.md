---
name: workflow-to-skill
description: "Create a repository workflow skill: a concise, ordered, completion-checked procedure for a repeatable agent task. Use when the user asks to create, design, document, or improve a workflow skill."
compatibility: Requires a runtime that provides the skill-creator skill and fresh subagent delegation.
---

# Workflow to Skill

Create a **workflow skill** for the user's repeatable task; this skill governs documenting that task, not carrying it out.

Run every numbered procedure step in this skill and the resulting workflow skill in a new, fresh subagent. Give each subagent only its step definition and declared inputs, including required prior-step outputs.

## Inputs

1. **Repeatable task:** The task the workflow skill will document.
2. **Intended skill name:** The repository skill name, when supplied or useful.
3. **Task-specific requirements:** Behavior or completion criteria the workflow must preserve.
4. **Repository context:** Relevant commands, paths, conventions, and existing records, discovered as needed.

## Outputs

1. **Workflow skill:** A created or revised Markdown workflow skill at `.agents/skills/<name>/SKILL.md` with a predictable contract, executable procedure, and explicit handoffs.

## Procedure

### 1. Gather the workflow contract from the request and repository.

**Inputs:**

    a. Repeatable task.
    b. Intended skill name, when supplied.
    c. Task-specific requirements.
    d. Repository context.

**Constraints:**

    a. Cover the trigger, accepted inputs, one output, state changes, branches, invariants, and completion evidence.
    b. Treat repository commands, paths, and conventions as authoritative.

**Outputs:**

    a. Draft workflow contract.
    b. Repository facts.
    c. Existing target skill, when revising.

### 2. Resolve only gaps that block a concrete procedure.

**Inputs:**

    a. Draft workflow contract.
    b. User request.
    c. Repository facts.

**Constraints:**

    a. Accept useful input in any workable form.
    b. Infer safely from the request and repository when possible.
    c. Ask one explicit blocking question only when required.
    d. Do not invoke a dependency with an unresolved contract.

**Outputs:**

    a. Actionable workflow contract when complete.
    b. One blocking question when incomplete.

### 3. Confirm the runtime can invoke `skill-creator`.

**Inputs:**

    a. Actionable workflow contract.
    b. Runtime skill registry.

**Constraints:**

    a. Stop before editing and report the missing dependency when unavailable.
    b. Continue only when the contract and dependency are ready.

**Outputs:**

    a. Dependency readiness decision.

### 4. Set the target skill's creation boundaries.

**Inputs:**

    a. Actionable workflow contract.
    b. Existing target skill, when revising.

**Constraints:**

    a. Target `.agents/skills/<name>/SKILL.md` for `<task>`.
    b. Preserve existing behavior when revising.
    c. Add helper files only for reusable templates or detailed references.

**Outputs:**

    a. Target skill boundaries.

### 5. Define the target skill's shell.

**Inputs:**

    a. Target skill boundaries.
    b. Actionable workflow contract.
    c. Fresh-subagent policy stated above.

**Constraints:**

    a. Keep `SKILL.md` short.
    b. Match the frontmatter name to the directory.
    c. State the outcome and concrete request triggers in the description.
    d. Open with one sentence naming the workflow's scope and boundary.
    e. Declare fresh subagent delegation in `compatibility`.
    f. State the fresh-subagent policy once before `## Inputs`.
    g. Order `## Inputs`, `## Outputs`, and final `## Procedure` exactly.
    h. Keep contract declarations outside the procedure.
    i. Keep instructions and state changes inside the procedure.

**Outputs:**

    a. Skill shell requirements.

### 6. Define a liberal input contract and one predictable output.

**Inputs:**

    a. Actionable workflow contract.

**Constraints:**

    a. Apply Postel's Law by accepting useful input variations and producing one precise result.
    b. Format each input as `1. **<Input name>:** <description>`.
    c. Constrain input source, shape, naming, order, or completeness only when essential.
    d. Format each output as `1. **<Output name>:** <description>`.
    e. State the output's stable result, applicable location, and completion condition.

**Outputs:**

    a. Target input requirements.
    b. Target output requirements.

### 7. Define the procedure as concise ordered actions.

**Inputs:**

    a. Actionable workflow contract.

**Constraints:**

    a. Format every independent action or sub-step as a numbered `###` header.
    b. Keep header indices contiguous and ordered by execution.
    c. Give each step one observable transition and a checkable completion criterion.
    d. Declare all context needed by a step under its `Inputs` label, including required prior-step outputs.
    e. Give each step `Inputs`, `Constraints`, and `Outputs` labels in that order.
    f. Place one empty line between each label and its list.
    g. Index each category's items as `a.`, `b.`, `c.`, and so on.
    h. Indent each alphabetical item one level beneath its label.
    i. Restart alphabetical indices at `a.` for every category.
    j. Keep each item concise.

**Outputs:**

    a. Target procedure requirements.

### 8. Define branches, invariants, and supporting detail where they apply.

**Inputs:**

    a. Actionable workflow contract.
    b. Target procedure requirements.
    c. Repository facts.

**Constraints:**

    a. Keep each branch beside the step that reaches it.
    b. State each branch's condition, action, and result.
    c. Preserve only necessary invariants.
    d. Necessary invariants may include source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
    e. Prefer repository lookups over duplicated facts.
    f. Move conditional or exhaustive material into linked references.

**Outputs:**

    a. Branch requirements.
    b. Invariant requirements.
    c. Supporting-detail requirements.

### 9. Define the target workflow's final result.

**Inputs:**

    a. Target output requirements.
    b. Target procedure requirements.

**Constraints:**

    a. End with the exact result to report.
    b. End with the condition that makes the workflow complete.

**Outputs:**

    a. Final result requirement.
    b. Workflow completion condition.

### 10. Invoke `/skill-creator` with the contract and requirements.

**Inputs:**

    a. Actionable workflow contract.
    b. Target skill boundaries.
    c. Skill shell requirements.
    d. Target input requirements.
    e. Target output requirements.
    f. Target procedure requirements.
    g. Branch requirements.
    h. Invariant requirements.
    i. Supporting-detail requirements.
    j. Final result requirement.
    k. Workflow completion condition.
    l. Task-specific requirements.
    m. Repository facts.

**Constraints:**

    a. Use `/skill:skill-creator` when the runtime requires the colon form.
    b. Include the resolved name and task.

**Outputs:**

    a. `skill-creator` result.

### 11. Handle the `skill-creator` result.

**Inputs:**

    a. `skill-creator` result.

**Constraints:**

    a. Stop and report unresolved errors without claiming completion.
    b. Continue only when the target skill exists with `## Procedure` last.

**Outputs:**

    a. Resulting `SKILL.md` on success.
    b. Target skill path on success.
    c. Change state on success.
    d. Assumptions on success.
    e. Error report on unresolved failure.

### 12. Verify the frontmatter and section structure.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Target skill path.
    c. Skill shell requirements.
    d. Fresh-subagent policy stated above.

**Constraints:**

    a. Match the frontmatter name to the directory.
    b. Require a non-empty description that states the outcome and routes concrete requests.
    c. Require `compatibility` to declare fresh subagent delegation.
    d. State the fresh-subagent policy once before `## Inputs`.
    e. Keep `## Inputs`, `## Outputs`, and `## Procedure` in order with `## Procedure` last.

**Outputs:**

    a. Frontmatter verification result.
    b. Section structure verification result.

### 13. Verify the contract and list formats.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Target input requirements.
    c. Target output requirements.
    d. Fresh-subagent policy stated above.

**Constraints:**

    a. Keep inputs and outputs as simple numbered lists without item subheadings.
    b. Accept workable inputs and require only essential constraints.
    c. Produce one precise, predictable output.
    d. Format every procedure action or sub-step as a contiguous numbered `###` header.
    e. Apply the global fresh-subagent policy without repeating per-step execution-context declarations.
    f. Declare every needed handoff under the receiving step's `Inputs` label.
    g. Give every step `Inputs`, `Constraints`, and `Outputs` labels in order.
    h. Require one empty line between each label and its list.
    i. Use contiguous alphabetical list indices starting at `a.` for every category.
    j. Indent each alphabetical item one level beneath its label.
    k. Keep every listed input, constraint, and output concise.

**Outputs:**

    a. Contract verification result.
    b. List format verification result.

### 14. Verify the procedure is executable without invented policy.

**Inputs:**

    a. Resulting `SKILL.md`.
    b. Actionable workflow contract.
    c. Branch requirements.
    d. Invariant requirements.
    e. Final result requirement.
    f. Workflow completion condition.
    g. Fresh-subagent policy stated above.

**Constraints:**

    a. Keep inputs and outputs declarative.
    b. Place instructions and state changes in the procedure.
    c. Make the trigger, inputs, output, actions, branch behavior, invariants, and completion state explicit.
    d. Confirm every step declares all context it needs, including required prior-step outputs.
    e. Confirm no step relies on inherited context, prior reasoning, or undeclared state.

**Outputs:**

    a. Procedure executability result.

### 15. Report the verified result.

**Inputs:**

    a. Frontmatter verification result.
    b. Section structure verification result.
    c. Contract verification result.
    d. List format verification result.
    e. Procedure executability result.
    f. Target skill path.
    g. Change state.
    h. Assumptions.

**Constraints:**

    a. Report `Workflow skill: .agents/skills/<name>/SKILL.md` after success.
    b. Report `Change: <created|updated>` after success.
    c. Report `Assumptions: <items|None>` after success.
    d. Report `Verification failed: <checks>` instead after failure.
    e. Claim completion only when every check passes and the exact path and change state are reported.

**Outputs:**

    a. Completion report when verification passes.
    b. Verification failure report when verification fails.
