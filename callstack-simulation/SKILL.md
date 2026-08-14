---
name: callstack-simulation
description: Generate a source-grounded, callstack-style dry-run simulation of a workflow, procedure, algorithm, or function for a supplied scenario, showing nested frames, branches, state changes, returns, and unresolved behavior. Use when asked to simulate, dry-run, walk through, or trace execution step by step without running it.
---

# Callstack Simulation

Produce a source-grounded dry-run trace of described behavior; this workflow models execution for inspection and does not claim actual execution, timing, or side effects.

## Inputs

### A. Simulation target

A required workflow, procedure, algorithm, or function supplied inline or by repository-relative path, plus an entry point when the source defines more than one. The target is read-only and authoritative for control flow, calls, state transitions, returns, and errors; prose, pseudocode, source code, and existing skill procedures are accepted.

### B. Scenario

Optional concrete arguments, initial state, environment values, and expected external responses supplied by the user. When omitted, use named symbolic values and mark every result that depends on them as unresolved rather than inventing a concrete value.

### C. Supporting context

Optional user- or repository-supplied definitions for called functions, referenced procedures, data shapes, invariants, and external behavior. Existing relevant context is required when it is available from a supplied target path. Context may explain the target but may not silently override it; surface conflicts explicitly.

### D. Simulation controls

Optional entry-point override, branch selection, expansion depth, loop or recursion limit, focus area, detail level, and Markdown output path. The detail level is `compact` or `expanded` and defaults to `compact`. By default, expand described local calls, simulate at most three loop iterations and ten recursive frames, and return the report inline. A supplied destination is repository-relative and may be revised only with the user's explicit authority.

## Outputs

### A. Simulation report

A Markdown report, inline or at the authorized destination, following [`references/simulation-template.md`](references/simulation-template.md). It identifies the target, scenario, and execution status, then shows a compact depth-first callstack. In compact mode, each frame is normally one line containing the operation and its return, throw, blocked, or truncated outcome; show an extra indented note only for a branch, state change, side effect, or uncertainty that materially affects the path or result. Separate every rendered callstack line, including indented notes, with one blank line so the trace has clear vertical spacing. Keep stable hierarchical frame IDs internally, but display one only when repeated calls need disambiguation or a ledger item needs an exact link. Expanded mode may include IDs, entry values, and ordered operations when requested. The report is complete when a reader can reconstruct the modeled call hierarchy and material decisions without mistaking inferred behavior for observed execution.

### B. Assumption and uncertainty ledger

A report section listing each assumption, unresolved value, missing callee, source conflict, truncated path, and nondeterministic ordering point, together with the frames it affects; `None` when empty. It is complete when no unsupported choice is presented as fact and the simulation status is `complete`, `partial`, or `blocked` consistently with the ledger.

### C. Completion report

A response stating the result location, status, root frame, simulated frame count, and whether execution occurred. It is complete when it matches the validated simulation artifact and explicitly says `Execution performed: no`.

## Procedure

### 1. Resolve the simulation contract

Read the complete target, scenario, controls, and relevant supporting context. Resolve the entry point and destination, record source identifiers, and preserve all source files. If the target or required entry point is missing, unreadable, or too ambiguous to identify an initial operation, stop without creating a report and name the blocker. If an existing destination lacks explicit revision authority, stop and request it rather than overwrite. This step is complete when the root operation, initial values, authority order, limits, and unused or authorized destination are fixed.

### 2. Build the execution model

Map the target into ordered operations, call edges, branch conditions, loop and recursion boundaries, state reads and writes, side effects, return paths, and error paths. Link locally defined callees from the supporting context while preserving the target's terminology and order. Mark each modeled transition as source-defined, scenario-derived, explicitly assumed, or unresolved; do not supply missing business rules, runtime behavior, external responses, or timing. This step is complete when every described transition from the entry point is represented and every missing dependency is labeled.

### 3. Initialize the root frame

Create frame `F0` from the entry point, bind concrete or symbolic inputs, capture relevant initial state, and add its enter event before any operation. Use hierarchical child IDs in call order (`F0.1`, `F0.2`, and so on); IDs identify frame instances, not function definitions. This step is complete when the root frame and initial stack `[F0]` are explicit and no action has been simulated before entry.

### 4. Simulate stack transitions

Walk the execution model in source order. For an expanded call, add a call event, push its child frame, simulate that frame to an exit, then pop it and bind its result before continuing the parent. Record only state changes relevant to later control flow, outputs, or side effects, showing `before → after` and their basis. End every entered frame with one return, throw, blocked, or truncated event; propagate throws through parent frames exactly when the target defines that behavior.

- When scenario data decides a condition, follow only that branch and record the condition, resolved value, and selected path.
- When a condition is unresolved, do not choose silently. Fork finite feasible alternatives with branch-qualified labels when each path can be modeled; otherwise mark the dependent frame blocked. Keep shared pre-branch state unchanged across alternatives.
- Treat an undefined or external callee as an opaque leaf. Use a scenario-supplied response when present; otherwise exit it as unresolved and continue only where later behavior does not depend on its result.
- For loops and recursion, honor the supplied or default limits, then emit a truncated exit or iteration summary; never imply that an unmodeled remainder ran.
- For concurrent or asynchronous work, show spawn and join relationships separately from the active stack. Preserve only ordering guaranteed by the target and label all other ordering as nondeterministic.

This step is complete when every modeled path has balanced stack transitions or an explicit blocked or truncated boundary, and no actual target operation or side effect has been executed.

### 5. Render the callstack report

Materialize the trace with the bundled template. In compact mode, render each frame as a single nested `operation → outcome` line and omit routine enter, step, resume, unchanged-state, source-marker, and frame-ID text. Put exactly one blank line between every rendered callstack line, including between a frame and its short note. Add at most one short note beneath a frame for a material branch, state change, side effect, or linked uncertainty; display an internal frame ID only when needed to disambiguate or link that note. Use the ledger for supporting detail and show alternative continuations only when an unresolved branch materially changes the result. In expanded mode, add frame IDs, entry values, and ordered operations without changing outcomes. This step is complete when Output A and Output B are present and the visual nesting agrees with the recorded push/pop order.

### 6. Validate fidelity and stack integrity

Compare the report against the complete target, scenario, context, and execution model. Correct reordered or omitted operations, unbalanced frames, invalid parent IDs, unstated assumptions, fabricated values, impossible branch combinations, unsupported state changes, hidden truncation, and claims of observed execution. Set `complete` only when the selected scenario reaches a defined terminal outcome with no result-affecting unknown or truncation; set `partial` when useful paths are traced but uncertainty or limits affect them; set `blocked` when no meaningful path reaches beyond the blocker. This step is complete when every frame and ledger item is source-traceable and all outputs agree on status and counts.

### 7. Publish and report completion

Write the validated report only to an unused or explicitly authorized destination, or return it inline. Report exactly `Simulation: <path|inline>`, `Status: <complete|partial|blocked>`, `Root frame: F0 <entry-point>`, `Frames: <count>`, and `Execution performed: no`. The workflow is complete only when this response accompanies a validated simulation report, the target and context remain unchanged, and no described side effect was performed; otherwise report the Step 1 blocker without claiming completion.
