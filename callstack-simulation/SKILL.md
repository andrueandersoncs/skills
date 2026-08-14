---
name: callstack-simulation
description: Generate a source-grounded, callstack-style dry-run simulation of a workflow, procedure, algorithm, or function for a supplied scenario, showing nested frames, branches, state changes, and outcomes. Use when asked to simulate, dry-run, walk through, or trace execution step by step without running it.
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

A Markdown report, inline or at the authorized destination, following [`references/simulation-template.md`](references/simulation-template.md). It identifies the target, scenario, and execution status, then shows a compact depth-first callstack. In compact mode, render each frame with the operation name bolded and followed by its arguments on a call line. Put only the frame's expected happy-path result on the next indented line beneath the call as `**outcome**: <expected successful result>`. Keep an undefined successful result symbolic. Do not include throws, errors, blockers, truncation, or other exception paths in the outcome annotation; show a material exception path only in a conditional note. Never append an outcome to the call line. Do not wrap caller strings in backticks or put angle brackets around caller names or arguments. Show a further indented note only for a conditional, state change, or side effect that materially affects the path or result. Render conditional cases as an ordered `if (<pattern>): <case>`, `else if (<pattern>): <case>`, `else: <case>` block; never label the block `branch:` or join cases with arrows or commas. A case may move to the next indented line when it contains nested detail. Place the outcome on the immediately following physical line with no spacer inside the call/outcome pair. Separate every other rendered callstack line, including indented notes, with one spacer line so the trace has clear vertical spacing. Populate each spacer with pipe (`│`) guides at the indentation columns of call branches that continue below, preserving the visual call hierarchy through the spacing. Identify frames by their operation names and call hierarchy; do not generate or display numeric frame IDs. Expanded mode may include entry values and ordered operations when requested. The report is complete when a reader can reconstruct the modeled call hierarchy and material decisions without mistaking an expected outcome for an observed result.

### B. Completion report

A response stating the result location, status, root frame, simulated frame count, and whether execution occurred. It is complete when it matches the validated simulation artifact and explicitly says `Execution performed: no`.

## Procedure

### 1. Resolve the simulation contract

Read the complete target, scenario, controls, and relevant supporting context. Resolve the entry point and destination, record source identifiers, and preserve all source files. If the target or required entry point is missing, unreadable, or too ambiguous to identify an initial operation, stop without creating a report and name the blocker. If an existing destination lacks explicit revision authority, stop and request it rather than overwrite. This step is complete when the root operation, initial values, authority order, limits, and unused or authorized destination are fixed.

### 2. Build the execution model

Map the target into ordered operations, call edges, branch conditions, loop and recursion boundaries, state reads and writes, side effects, return paths, and error paths. Link locally defined callees from the supporting context while preserving the target's terminology and order. Track whether each modeled transition is source-defined or scenario-derived, and keep missing values symbolic; do not supply missing business rules, runtime behavior, external responses, or timing. This step is complete when every described transition from the entry point is represented and every missing dependency remains symbolic or produces a defined blocker.

### 3. Initialize the root frame

Create the root frame from the entry point, bind concrete or symbolic inputs, capture relevant initial state, and add its enter event before any operation. Identify it by the entry-point operation rather than a generated frame label; distinguish repeated calls by their operation signatures and position in the rendered call hierarchy. This step is complete when the root frame and initial stack containing that operation are explicit and no action has been simulated before entry.

### 4. Simulate stack transitions

Walk the execution model in source order. For an expanded call, add a call event, push its child frame, simulate that frame to an exit, then pop it and bind its result before continuing the parent. Record only state changes relevant to later control flow, outputs, or side effects, showing `before → after` and their basis. Give every entered frame one expected happy-path outcome, keeping an undefined successful result symbolic. Track throws, blockers, and truncation as exceptional control-flow conditions, and propagate throws through parent frames exactly when the target defines that behavior, but never include those exceptions in the frame's outcome annotation.

- When scenario data decides a condition, follow only that case and record it as `if (<pattern>): <case>`, using `else if` or `else` when the selected case comes from a later clause. Do not use `branch:` labels or arrow-separated mappings.
- When scenario data does not decide a condition, do not choose silently. Fork finite feasible alternatives as one ordered conditional block with one clause per line: `if (<pattern>): <case>`, then any `else if (<pattern>): <case>` clauses, then `else: <case>` when a fallback exists. A case may appear on the next indented line when needed. Otherwise mark the dependent frame blocked. Keep shared pre-condition state unchanged across alternatives.
- Treat an undefined or external callee as an opaque leaf. Use a scenario-supplied response when present; otherwise keep its result symbolic and continue only where later behavior does not depend on a concrete result.
- For loops and recursion, honor the supplied or default limits, then record the truncation condition or an iteration summary separately from the expected happy-path outcome; never imply that an unmodeled remainder ran.
- For concurrent or asynchronous work, show spawn and join relationships separately from the active stack. Show only ordering guaranteed by the target and do not imply an order for other work.

This step is complete when every modeled path has balanced stack transitions or an explicit blocked or truncated boundary, every frame states only its expected happy-path outcome, and no actual target operation or side effect has been executed.

### 5. Render the callstack report

Materialize the trace with the bundled template. In compact mode, render each frame as a nested call line with the operation name bolded and followed by `(arguments)`. Immediately beneath it, render a separate indented annotation as `**outcome**: <expected successful result>`; never append the outcome to the call line. The annotation contains only the expected happy-path result, not a throw, error, blocker, truncation, or alternative failure result. Show any material exceptional path in the frame's conditional note instead. Do not wrap the caller string in backticks or use angle brackets around the caller name or arguments. Omit routine enter, step, resume, unchanged-state, and source-marker text. Do not insert a spacer inside a call/outcome pair. Put exactly one spacer line between every other rendered callstack line, including between an outcome and a short note. On each spacer, render `│` at every indentation column whose call branch continues below and spaces where a branch has ended; never leave a spacer fully blank when a connector crosses it. Add at most one short note or conditional block beneath a frame for a material condition, state change, side effect, or exceptional path. Format every conditional block with one ordered clause per line as `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>`; omit clauses that do not exist, and place a long or nested case on the next indented line. Never render `branch:`, `(pattern → case)` mappings, arrow-separated cases, or comma-separated pattern-to-case mappings. Refer to frames in notes by operation name or call path, never by generated frame IDs. Show alternative continuations inline only when scenario data does not decide a condition and the alternatives materially change the result. In expanded mode, add entry values and ordered operations without changing outcomes or adding frame IDs. This step is complete when Output A and Output B are present, every outcome is limited to the expected happy path, and the visual nesting, including spacer guides, agrees with the recorded push/pop order.

### 6. Validate fidelity and stack integrity

Compare the report against the complete target, scenario, context, and execution model. Correct reordered or omitted operations, unbalanced frames, invalid call hierarchy, fabricated values, impossible branch combinations, unsupported state changes, hidden truncation, and claims of observed execution. Set `complete` only when the selected scenario reaches a defined terminal outcome without a result-affecting symbolic value or truncation; set `partial` when useful paths are traced but symbolic branching or limits affect them; set `blocked` when no meaningful path reaches beyond the blocker. This step is complete when every frame is source-traceable and all outputs agree on status and counts.

### 7. Publish and report completion

Write the validated report only to an unused or explicitly authorized destination, or return it inline. Report exactly `Simulation: <path|inline>`, `Status: <complete|partial|blocked>`, `Root frame: <entry-point>`, `Frames: <count>`, and `Execution performed: no`. The workflow is complete only when this response accompanies a validated simulation report, the target and context remain unchanged, and no described side effect was performed; otherwise report the Step 1 blocker without claiming completion.
