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

1. Gather the workflow contract from the request and repository.

    **Inputs:**
    - Repeatable task.
    - Intended skill name, when supplied.
    - Task-specific requirements.
    - Repository context.

    **Constraints:**
    - Cover the trigger, accepted inputs, one output, state changes, branches, invariants, and completion evidence.
    - Treat repository commands, paths, and conventions as authoritative.

    **Outputs:**
    - Draft workflow contract.

2. Resolve only gaps that block a concrete procedure.

    **Inputs:**
    - Draft workflow contract.
    - User request.
    - Repository facts.

    **Constraints:**
    - Accept useful input in any workable form.
    - Infer safely from the request and repository when possible.
    - Ask one explicit blocking question only when required.
    - Do not invoke a dependency with an unresolved contract.

    **Outputs:**
    - Actionable workflow contract when complete.
    - One blocking question when incomplete.

3. Confirm the runtime can invoke `skill-creator`.

    **Inputs:**
    - Actionable workflow contract.
    - Runtime skill registry.

    **Constraints:**
    - Stop before editing and report the missing dependency when unavailable.
    - Continue only when the contract and dependency are ready.

    **Outputs:**
    - Dependency readiness decision.

4. Set the target skill's creation boundaries.

    **Inputs:**
    - Actionable workflow contract.
    - Existing target skill, when revising.

    **Constraints:**
    - Target `.agents/skills/<name>/SKILL.md` for `<task>`.
    - Preserve existing behavior when revising.
    - Add helper files only for reusable templates or detailed references.

    **Outputs:**
    - Target skill boundaries.

5. Define the target skill's shell.

    **Inputs:**
    - Target skill boundaries.
    - Actionable workflow contract.

    **Constraints:**
    - Keep `SKILL.md` short.
    - Match the frontmatter name to the directory.
    - State the outcome and concrete request triggers in the description.
    - Open with one sentence naming the workflow's scope and boundary.
    - Order `## Inputs`, `## Outputs`, and final `## Procedure` exactly.
    - Keep contract declarations outside the procedure.
    - Keep instructions and state changes inside the procedure.

    **Outputs:**
    - Skill shell requirements.

6. Define a liberal input contract and one predictable output.

    **Inputs:**
    - Actionable workflow contract.

    **Constraints:**
    - Apply Postel's Law by accepting useful input variations and producing one precise result.
    - Format each input as `1. **<Input name>:** <description>`.
    - Constrain input source, shape, naming, order, or completeness only when essential.
    - Format each output as `1. **<Output name>:** <description>`.
    - State the output's stable result, applicable location, and completion condition.

    **Outputs:**
    - Target input requirements.
    - Target output requirements.

7. Define the procedure as concise ordered actions.

    **Inputs:**
    - Actionable workflow contract.

    **Constraints:**
    - Number every independent action or sub-step with contiguous indices in execution order.
    - Give each step one observable transition and a checkable completion criterion.
    - Give each step single-indented `Inputs`, `Constraints`, and `Outputs` labels in that order.
    - Keep every input, constraint, and output as one concise unordered list item.
    - Keep category labels and their list items at the same single indentation level.

    **Outputs:**
    - Target procedure requirements.

8. Define branches, invariants, and supporting detail where they apply.

    **Inputs:**
    - Actionable workflow contract.
    - Target procedure requirements.
    - Repository context.

    **Constraints:**
    - Keep each branch beside the step that reaches it.
    - State each branch's condition, action, and result.
    - Preserve only necessary invariants.
    - Necessary invariants may include source preservation, idempotency, non-overwrite rules, authority boundaries, or required handoffs.
    - Prefer repository lookups over duplicated facts.
    - Move conditional or exhaustive material into linked references.

    **Outputs:**
    - Branch requirements.
    - Invariant requirements.
    - Supporting-detail requirements.

9. Define the target workflow's final result.

    **Inputs:**
    - Target output requirements.
    - Target procedure requirements.

    **Constraints:**
    - End with the exact result to report.
    - End with the condition that makes the workflow complete.

    **Outputs:**
    - Final result requirement.
    - Workflow completion condition.

10. Invoke `/skill-creator` with the contract and requirements.

    **Inputs:**
    - Actionable workflow contract.
    - Target skill requirements.
    - User requirements.
    - Repository conventions.

    **Constraints:**
    - Use `/skill:skill-creator` when the runtime requires the colon form.
    - Include the resolved name and task.

    **Outputs:**
    - `skill-creator` result.

11. Handle the `skill-creator` result.

    **Inputs:**
    - `skill-creator` result.

    **Constraints:**
    - Stop and report unresolved errors without claiming completion.
    - Continue only when the target skill exists with `## Procedure` last.

    **Outputs:**
    - Created or revised target skill on success.
    - Error report on unresolved failure.

12. Verify the frontmatter and section structure.

    **Inputs:**
    - Resulting `SKILL.md`.

    **Constraints:**
    - Match the frontmatter name to the directory.
    - Require a non-empty description that states the outcome and routes concrete requests.
    - Keep `## Inputs`, `## Outputs`, and `## Procedure` in order with `## Procedure` last.

    **Outputs:**
    - Frontmatter verification result.
    - Section structure verification result.

13. Verify the contract and list formats.

    **Inputs:**
    - Resulting `SKILL.md`.

    **Constraints:**
    - Keep inputs and outputs as simple numbered lists without item subheadings.
    - Accept workable inputs and require only essential constraints.
    - Produce one precise, predictable output.
    - Number every procedure action or sub-step contiguously.
    - Give every step single-indented `Inputs`, `Constraints`, and `Outputs` labels in order.
    - Keep every listed input, constraint, and output concise.

    **Outputs:**
    - Contract verification result.
    - List format verification result.

14. Verify the procedure is executable without invented policy.

    **Inputs:**
    - Resulting `SKILL.md`.

    **Constraints:**
    - Keep inputs and outputs declarative.
    - Place instructions and state changes in the procedure.
    - Make the trigger, inputs, output, actions, branch behavior, invariants, and completion state explicit.

    **Outputs:**
    - Procedure executability result.

15. Report the verified result.

    **Inputs:**
    - Verification results.
    - Target skill path.
    - Change state.
    - Assumptions.

    **Constraints:**
    - Report `Workflow skill: .agents/skills/<name>/SKILL.md` after success.
    - Report `Change: <created|updated>` after success.
    - Report `Assumptions: <items|None>` after success.
    - Report `Verification failed: <checks>` instead after failure.
    - Claim completion only when every check passes and the exact path and change state are reported.

    **Outputs:**
    - Completion report when verification passes.
    - Verification failure report when verification fails.
