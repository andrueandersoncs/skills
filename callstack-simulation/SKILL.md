---
name: callstack-simulation
description: Generate a source-grounded, callstack-style dry-run simulation of a workflow, procedure, algorithm, or function for a supplied scenario, showing nested frames, branches, and state changes. Use when asked to simulate, dry-run, walk through, or trace execution step by step without running it.
---

# Callstack Simulation

Produce a source-grounded dry-run trace of described behavior; this workflow models execution for inspection and does not claim actual execution, timing, or side effects.

## Inputs

### A. Simulation target

A required workflow, procedure, algorithm, or function supplied inline or by repository-relative path, plus an entry point when the source defines more than one. The target is read-only and authoritative for control flow, calls, state transitions, returns, and errors; prose, pseudocode, source code, and existing skill procedures are accepted.

### B. Scenario

Optional concrete arguments, initial state, environment values, and expected external responses supplied by the user. When omitted, use named symbolic values and preserve every dependent result symbolically rather than inventing a concrete value.

### C. Supporting context

Optional user- or repository-supplied definitions for called functions, referenced procedures, data shapes, invariants, and external behavior. Existing relevant context is required when it is available from a supplied target path. Context may explain the target but may not silently override it; surface conflicts explicitly.

### D. Simulation controls

Optional entry-point override, branch selection, expansion depth, loop or recursion limit, focus area, detail level, and Markdown output path. The detail level is `compact` or `expanded` and defaults to `compact`. By default, expand described local calls, simulate at most three loop iterations and ten recursive frames, and return the report inline. A supplied destination is repository-relative and may be revised only with the user's explicit authority.

## Outputs

### A. Simulation report

A Markdown report, inline or at the authorized destination, following [`references/simulation-template.md`](references/simulation-template.md). It identifies the target, scenario, and execution status, then shows a compact depth-first callstack. In compact mode, render each frame as one call line with the operation name bolded and followed by its arguments. Do not append an outcome or add a separate outcome annotation. Do not wrap caller strings in backticks or put angle brackets around caller names or arguments. Show one indented note only for a conditional, state change, side effect, blocker, truncation, or error that materially affects the path. Render conditional cases as an ordered `if (<pattern>): <case>`, `else if (<pattern>): <case>`, `else: <case>` block; never label the block `branch:` or join cases with arrows or commas. A case may move to the next indented line when it contains nested detail. Separate every rendered callstack line, including indented notes, with one spacer line so the trace has clear vertical spacing. Populate each spacer with pipe (`│`) guides at the indentation columns of call branches that continue below, preserving the visual call hierarchy through the spacing. Identify frames by their operation names and call hierarchy; do not generate or display numeric frame IDs. Expanded mode may include entry values and ordered operations when requested. The report is complete when a reader can reconstruct the modeled call hierarchy and material decisions without mistaking simulated behavior for observed execution.

## Procedure

### 1. Resolve the simulation contract

Read the complete target, scenario, controls, and relevant supporting context. Resolve the entry point and destination, record source identifiers, and preserve all source files. If the target or required entry point is missing, unreadable, or too ambiguous to identify an initial operation, stop without creating a report and name the blocker. If an existing destination lacks explicit revision authority, stop and request it rather than overwrite. This step is complete when the root operation, initial values, authority order, limits, and unused or authorized destination are fixed.

### 2. Build the execution model

Map the target into ordered operations, call edges, branch conditions, loop and recursion boundaries, state reads and writes, side effects, return paths, and error paths. Link locally defined callees from the supporting context while preserving the target's terminology and order. Track whether each modeled transition is source-defined or scenario-derived, and keep missing values symbolic; do not supply missing business rules, runtime behavior, external responses, or timing. This step is complete when every described transition from the entry point is represented and every missing dependency remains symbolic or produces a defined blocker.

### 3. Initialize the root frame

Create the root frame from the entry point, bind concrete or symbolic inputs, capture relevant initial state, and add its enter event before any operation. Identify it by the entry-point operation rather than a generated frame label; distinguish repeated calls by their operation signatures and position in the rendered call hierarchy. This step is complete when the root frame and initial stack containing that operation are explicit and no action has been simulated before entry.

### 4. Simulate stack transitions

Walk the execution model in source order. For an expanded call, add a call event, push its child frame, simulate that frame to an exit, then pop it and bind its result before continuing the parent. Keep undefined results symbolic for internal propagation, but do not render routine return values or outcome annotations. Record only state changes relevant to later control flow, outputs, or side effects, showing `before → after` and their basis. Track throws, blockers, and truncation as exceptional control-flow conditions, and propagate throws through parent frames exactly when the target defines that behavior.

- When scenario data decides a condition, follow only that case and record it as `if (<pattern>): <case>`, using `else if` or `else` when the selected case comes from a later clause. Do not use `branch:` labels or arrow-separated mappings.
- When scenario data does not decide a condition, do not choose silently. Fork finite feasible alternatives as one ordered conditional block with one clause per line: `if (<pattern>): <case>`, then any `else if (<pattern>): <case>` clauses, then `else: <case>` when a fallback exists. A case may appear on the next indented line when needed. Otherwise mark the dependent frame blocked. Keep shared pre-condition state unchanged across alternatives.
- Treat an undefined or external callee as an opaque leaf. Use a scenario-supplied response when present; otherwise keep its result symbolic and continue only where later behavior does not depend on a concrete result.
- For loops and recursion, honor the supplied or default limits, then record the truncation condition or an iteration summary in a note; never imply that an unmodeled remainder ran.
- For concurrent or asynchronous work, show spawn and join relationships separately from the active stack. Show only ordering guaranteed by the target and do not imply an order for other work.

This step is complete when every modeled path has balanced stack transitions or an explicit blocked or truncated boundary and no actual target operation or side effect has been executed.

### 5. Render the callstack report

Materialize the trace with the bundled template. In compact mode, render each frame as one nested call line with the operation name bolded and followed by `(arguments)`. Do not append an outcome to the call line or render a separate outcome annotation. Do not wrap the caller string in backticks or use angle brackets around the caller name or arguments. Omit routine enter, exit, return, step, resume, unchanged-state, and source-marker text. Put exactly one spacer line between every rendered callstack line, including frame-to-note and note-to-note transitions. On each spacer, render `│` at every indentation column whose call branch continues below and spaces where a branch has ended; never leave a spacer fully blank when a connector crosses it. Add at most one short note or conditional block beneath a frame for a material condition, state change, side effect, blocker, truncation, or error. Format every conditional block with one ordered clause per line as `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>`; omit clauses that do not exist, and place a long or nested case on the next indented line. Never render `branch:`, `(pattern → case)` mappings, arrow-separated cases, or comma-separated pattern-to-case mappings. Refer to frames in notes by operation name or call path, never by generated frame IDs. Show alternative continuations inline only when scenario data does not decide a condition and the alternatives materially change the result. In expanded mode, add entry values and ordered operations without adding outcome annotations or frame IDs. This step is complete when the simulation report is present and the visual nesting, including spacer guides, agrees with the recorded push/pop order.

### 6. Validate fidelity and stack integrity

Compare the report against the complete target, scenario, context, and execution model. Correct reordered or omitted operations, unbalanced frames, invalid call hierarchy, fabricated values, impossible branch combinations, unsupported state changes, hidden truncation, and claims of observed execution. Set `complete` only when the selected scenario reaches a defined terminal state without a result-affecting symbolic value or truncation; set `partial` when useful paths are traced but symbolic branching or limits affect them; set `blocked` when no meaningful path reaches beyond the blocker. This step is complete when every frame is source-traceable and the report status matches the modeled trace.

### 7. Publish the simulation report

Write the validated report only to an unused or explicitly authorized destination, or return it inline. Do not append a separate completion or metadata block after the report. The workflow is complete when the validated simulation report is published, the target and context remain unchanged, and no described side effect was performed; otherwise report the Step 1 blocker without claiming completion.
