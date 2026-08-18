---
name: decompose-skill
description: Decompose an existing skill into independently useful workflow skills and a behavior-preserving orchestrator, including deliberate same-agent or fresh-context handoffs. Use when asked to split, extract, modularize, or identify reusable workflows or agent boundaries within a skill.
compatibility: Requires workflow-to-skill and workflow-callstack-simulation, plus agent or subagent delegation when an approved boundary requires fresh context.
---

# Decompose Skill

Decompose one skill into reusable workflow skills while keeping its public behavior intact and retaining source-private sequencing, incidental helpers, and source-only responsibilities in the orchestrator.

## Inputs

1. **Target skill:** A repository-relative skill directory or `SKILL.md` path in any unambiguous form.
2. **Decomposition controls:** Optional focus areas, proposed names, exclusions, configuration preferences, and agent or subagent boundary preferences.
3. **Repository context:** Relevant instructions, skill roots, sibling skills, consumers, tests, commands, and delegation mechanisms supplied by the user or discovered from the repository.
4. **Decomposition approval:** The user's explicit approval of the presented candidates, contracts, names, destinations, execution boundaries, handoffs, and source refactor; this may be supplied after analysis.

## Outputs

1. **Decomposition result:** A candidate ledger and exact report with one status: `complete` with approved children at `.agents/skills/<name>/SKILL.md` and a validated source orchestrator, `no change` with its reason, or `incomplete` with changed paths and unmet conditions.

## Procedure

### 1. Resolve the target and baseline.

**Inputs:**

    a. Target skill.
    b. Decomposition controls.
    c. Repository context.

**Constraints:**

    a. Read the complete target, applicable repository instructions, references, consumers, tests, skill roots, and delegation mechanisms.
    b. Record the public contract, entry point, file manifest or fingerprint, call edges, configured names, destinations, and pre-existing worktree changes.
    c. Confirm `workflow-to-skill` and `workflow-callstack-simulation` are available before editing.
    d. When the target or entry point is ambiguous, a dependency is unavailable, or a protected destination exists, set an incomplete result and continue to Step 12 before writing.
    e. Preserve unrelated and pre-existing changes.

**Outputs:**

    a. Protected analysis baseline.
    b. Blocking report when resolution fails.

### 2. Fix a source-grounded callstack as evidence.

**Inputs:**

    a. Protected analysis baseline.
    b. Complete target source.

**Constraints:**

    a. Reuse the target's `## Callstack Simulation` only when it is the sole final section, current, structurally valid, source-grounded, and complete across feasible branches.
    b. Otherwise invoke `workflow-callstack-simulation` on the current entry point with compact detail, symbolic missing values, and inline output.
    c. Do not edit the target merely to store the analysis trace.
    d. When simulation is blocked, set an incomplete result and continue to Step 12 without writing.
    e. Re-read the target and repeat this step when its fingerprint changed during analysis.

**Outputs:**

    a. Validated callstack marked `reused` or `generated`.
    b. Freshness evidence or blocking report.

### 3. Enumerate every cohesive candidate.

**Inputs:**

    a. Validated callstack.
    b. Complete target source.

**Constraints:**

    a. Map each distinct frame or cohesive subtree that could own a repeatable outcome.
    b. Record its source frames, transitions, dependencies, minimum receiver state, and proposed contract.
    c. Merge adjacent frames that are meaningful only as one result.
    d. Separate branches only when each has a stable contract.
    e. Include source-specific candidates for later testing without treating call depth as proof of reuse.
    f. Do not invent behavior absent from the target or repository.

**Outputs:**

    a. Complete non-overlapping candidate set.

### 4. Apply the independent-use gate.

**Inputs:**

    a. Complete candidate set.
    b. Repository context.

**Constraints:**

    a. Identify each candidate's trigger, observable outcome, inputs, outputs, completion evidence, authority boundary, and one credible caller or scenario outside the target.
    b. Provisionally select only cohesive candidates that work without target-private setup or control state and preserve source behavior through a clear handoff.
    c. Keep source-only policy, sequencing, incidental checks, formatting fragments, and candidates whose only consumer is the target.
    d. Resolve overlap by selecting the smallest complete independently useful boundaries.

**Outputs:**

    a. Provisional select-or-keep decision for every candidate.

### 5. Test configuration extraction for every kept candidate.

**Inputs:**

    a. Every provisionally kept candidate.
    b. Current source configuration.

**Constraints:**

    a. Attempt to separate a fixed workflow from declarative source-specific configuration.
    b. Define the configuration fields, ownership, validation, and a sensible default or required explicit value.
    c. Test the split against the current source and one materially different concrete caller or configuration.
    d. Promote only when the workflow and completion contract remain stable, configuration is bounded data or policy, and the second caller uses the outcome independently.
    e. Keep the candidate when configuration would encode most of the algorithm, expose private state, remove a stable boundary, or still provide no independent use.
    f. Record `not reusable through configuration` when no honest split works.

**Outputs:**

    a. Final select-or-keep decision for every candidate.
    b. Configuration result for every kept candidate.
    c. Configuration contract for every promoted candidate.

### 6. Choose each execution boundary and handoff.

**Inputs:**

    a. Every candidate and final decision.
    b. Minimum receiver state.
    c. Available delegation mechanisms.

**Constraints:**

    a. Compare same-agent execution with a receiving agent or subagent for every candidate transition.
    b. Choose fresh context only when isolation, independent verification, specialization, parallel work, or context relief materially helps.
    c. Require each fresh-context packet to contain the goal, inputs, authoritative sources, constraints, expected output, and return contract.
    d. Choose the same agent when work needs shared mutable state, tight iteration, atomic sequencing, or most sender context.
    e. Treat execution placement as independent from the decision to extract a skill.

**Outputs:**

    a. Supported `same agent` or `fresh-context agent/subagent` decision for every candidate.
    b. Self-contained handoff packet for every fresh-context decision.

### 7. Present the complete plan and obtain approval.

**Inputs:**

    a. Candidate decisions.
    b. Configuration results.
    c. Execution boundaries and handoffs.
    d. Protected analysis baseline.

**Constraints:**

    a. Cover every candidate exactly once in a ledger with its evidence, contract and name, dependencies, second caller, select-or-keep reason, configuration result, execution boundary, handoff, destination, and planned source change.
    b. Check proposed names across every configured skill root and reject collisions before requesting approval.
    c. Present the exact child contracts, source-to-child handoffs, source refactor, and validation plan.
    d. Make no file changes before explicit approval of the whole current plan.
    e. Re-present the plan when the user changes any approved detail.
    f. When no candidate is independently useful or approval is withheld, set a no-change result and continue to Step 12 without writing.

**Outputs:**

    a. Exact approved decomposition plan when approval is granted.
    b. No-change decision when selection or approval does not permit writing.

### 8. Create every approved child through `workflow-to-skill`.

**Inputs:**

    a. Exact approved decomposition plan.
    b. Repository context.

**Constraints:**

    a. Invoke `workflow-to-skill` for each approved candidate with its name, repeatable task, complete contract, configuration, repository conventions, independent trigger, and bounded fresh-context input when applicable.
    b. Create each child only at `.agents/skills/<name>/SKILL.md` and never hand-author substitutes or overwrite existing skills.
    c. Verify each child's frontmatter, trigger, inputs, one predictable output, completion criteria, dependency boundary, configuration, handoff contract, and final `## Procedure` against the approved ledger.
    d. When creation or verification fails, leave the source unchanged, record any created children and the unmet condition, and continue to Step 12.

**Outputs:**

    a. All and only approved, verified child skills.
    b. Incomplete result when child creation or verification fails.

### 9. Refactor the source into the orchestrator.

**Inputs:**

    a. Verified child skills.
    b. Exact approved decomposition plan.
    c. Protected analysis baseline.

**Constraints:**

    a. Preserve the source's public trigger, outcome, ordering, authority, error behavior, and kept responsibilities.
    b. Replace each extracted implementation with one explicit child invocation and bind its declared result before resuming.
    c. For a fresh-context boundary, make the orchestrator create the receiver, send only the approved packet, and integrate the returned result.
    d. Pass source-specific configuration explicitly and keep ownership where the approved plan places it.
    e. Prevent children from calling target-private behavior and remove duplicate extracted instructions.
    f. Do not alter unrelated source files or pre-existing changes.
    g. When the refactor cannot satisfy these constraints, record the unmet condition and continue to Step 12.

**Outputs:**

    a. Behavior-preserving source orchestrator on success.
    b. Incomplete result when refactoring fails.

### 10. Validate the revised call graph.

**Inputs:**

    a. Behavior-preserving source orchestrator.
    b. Verified child skills.
    c. Validated baseline callstack.
    d. Exact approved decomposition plan.

**Constraints:**

    a. Invoke `workflow-callstack-simulation` on the revised source entry point with compact detail, symbolic inputs, and inline output.
    b. Keep the generated trace as verification evidence without appending it to the source or children.
    c. Compare it with the baseline and approved plan to confirm that extracted frames route through their children and kept behavior remains reachable.
    d. When simulation fails or the revised graph diverges, record the unmet condition and continue to Step 12 without claiming success.

**Outputs:**

    a. Validated revised call graph.
    b. Incomplete result when simulation or comparison fails.

### 11. Verify the approved decomposition.

**Inputs:**

    a. Revised source.
    b. Verified child skills.
    c. Validated revised call graph.
    d. Exact approved decomposition plan.
    e. Protected analysis baseline.

**Constraints:**

    a. Run applicable repository checks, link checks, and whitespace checks.
    b. Confirm every extracted frame routes through exactly one child at its approved execution boundary.
    c. Confirm every kept frame remains, every fresh receiver gets the bounded packet, and configuration ownership is explicit.
    d. Confirm no child needs target-private state, no behavior is lost or duplicated, and no unrelated file changed.
    e. When any check fails, record the unmet condition and continue to Step 12 without claiming success.

**Outputs:**

    a. Validation evidence.
    b. Complete or incomplete status.

### 12. Report the exact result.

**Inputs:**

    a. Available candidate ledger.
    b. Changed paths or none.
    c. Available validation evidence.
    d. Complete, no-change, or incomplete status.

**Constraints:**

    a. Report `Target: <path>@<fingerprint>` or `Target: unresolved (<reason>)`.
    b. Report `Callstack: <reused|generated> (<freshness evidence>)` or `Callstack: none (<reason>)`.
    c. Report `Created: <paths|none>`.
    d. Report `Execution boundaries: <candidate — placement — handoff summary|none>`.
    e. Report `Source changes: <summary|none>`.
    f. Report `Kept: <candidate — reason — configuration result|none>`.
    g. Report `Validation: <checks>`.
    h. Report `Status: <complete|no change: reason|incomplete: unmet condition>`.
    i. Use `complete` only when every approved child and source change satisfy the approved plan.

**Outputs:**

    a. Decomposition result.
