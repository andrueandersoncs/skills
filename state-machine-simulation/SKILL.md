---
name: state-machine-simulation
description: Generate a source-grounded, self-contained graph-only web app that models a workflow, procedure, algorithm, or function as an event-driven state machine. Use when asked to visualize, simulate, explore, teach, or interactively emit events and watch states and transitions update in a browser.
compatibility: Produces a standalone HTML artifact that requires a modern web browser with JavaScript enabled.
---

# State Machine Simulation

Model supplied behavior as a graph-only, event-driven browser app for inspection and learning; users emit modeled events and watch the active state and transition update live, but the app never executes the target, performs its side effects, modifies its sources, or presents inferred behavior as observed runtime behavior.

## Inputs

### A. Target

A required inline or repository-relative workflow, procedure, algorithm, function, or skill in prose, pseudocode, source code, or Markdown. An entry point is also required when the source defines multiple operations. The target is read-only and authoritative for states, transitions, guards, actions, outputs, and errors.

### B. Scenario

Optional initial arguments, machine context, environment values, and expected external responses. Values the user does not supply remain symbolic; the app must expose source-feasible outcomes as events or finite event payloads the user can emit rather than silently inventing them.

### C. Supporting context

Optional available definitions for callees, procedures, data shapes, invariants, and external behavior. Relevant context accompanying a target path is required input, but it may explain rather than override the target; surface conflicts and preserve the target's behavior.

### D. Controls

Optional entry-point override, abstraction level, expanded or collapsed operations, focus area, initial scenario, event-name or payload overrides, and repository-relative `.html` destination. The default destination is `state-machine-simulation.html` at the active repository root. Revising an existing destination requires explicit user authority.

### E. Canonical app template

The required bundled [`assets/state-machine-app.html`](assets/state-machine-app.html), which is the authoritative implementation and visual reference for every generated artifact. Its document structure, styling, graph renderer, event emitter, controls, tooltips, accessibility behavior, and runtime logic are read-only template invariants; only the embedded machine data block between `// MACHINE_DATA_START` and `// MACHINE_DATA_END` is target-specific.

## Outputs

### A. Interactive state-machine artifact

One self-contained HTML file at the resolved destination, created from the canonical app template with only its machine data block replaced, that implements the modeled machine and conforms to [`references/interactive-artifact-spec.md`](references/interactive-artifact-spec.md). It is complete when it opens without a build step or network access as a full-viewport graph app, exposes the events accepted by the active state, lets a keyboard or pointer user emit those events in the app, and updates the active node, traversed edge, and relevant inline state data live until every modeled terminal state is reachable. The visible interface contains only the graph and minimal floating graph controls; it has no website masthead, sidebar, inspector, history, context, legend, disclosure, or content panel.

### B. Completion report

A concise response containing the artifact path, target and entry point, modeled terminal outcomes, symbolic or unresolved behavior, validation performed, and any bounded or omitted detail. It is complete when it distinguishes source-grounded behavior from scenario choices and does not claim that the target itself was executed.

## Procedure

### 1. Resolve the simulation contract

Read every input and determine the root operation, initial context, source identifiers, authority order, abstraction boundary, and output path. If supporting context conflicts with the target, retain the target's behavior and record the conflict for the artifact. If the target or entry point is missing, unreadable, or ambiguous, stop before creating an artifact and name the blocker. If the destination exists without revision authority, stop without changing it and request authority or another path. This step is complete when the simulation contract is fixed or a blocker has been reported.

### 2. Build the source-grounded machine

Map the target into a finite model of start, operation, decision, waiting, success, error, blocked, and truncated states; source-ordered transitions; the event that triggers each transition; guards and optional event payloads; material context reads and writes; intended side effects; returns; and errors. Assign every user-drivable transition an explicit event type; define each distinct type once, derive its name from source terminology such as `SOURCE_VALID`, and retain a readable event label. Represent a local call as a state or nested group at the chosen abstraction level, an undefined or external call as an opaque waiting state, a loop as a cycle, and recursion as a bounded summary rather than unbounded generated states. Never invent business rules, external responses, timing, or concurrency ordering. If missing information controls a transition, model each source-feasible outcome as an explicit event or payload choice and label its value symbolic. This step is complete when every reachable source transition has a modeled event and destination or an explicit blocked or truncated state.

### 3. Define event semantics

Set the initial active state and context, then determine the accepted event set for every state. Dispatching an accepted event evaluates only its allowlisted declarative guard, applies its declarative context updates, traverses the matching edge, and makes the destination active. When one event can produce multiple source-feasible outcomes, require a modeled payload choice or split it into distinct events rather than choosing silently. An unaccepted event leaves the machine unchanged and produces a brief in-graph rejection cue. **Reset** dispatches a reserved local reset event that restores the pristine state and context; do not provide generic **Next**, **Back**, or timeline controls that hide the event model. Intended external side effects remain labels on the traversed edge and never run. This step is complete when every modeled transition is reachable by emitting an explicit event, every dispatch is deterministic for its event and payload, and no event can enter an undefined state.

### 4. Create the graph app

Read the canonical app template completely, copy it to the resolved destination, and replace only the JavaScript value between `// MACHINE_DATA_START` and `// MACHINE_DATA_END` with the complete JSON-compatible machine model. Preserve every other template byte and do not redesign, restyle, restructure, simplify, or extend its HTML, CSS, graph renderer, event dock, controls, tooltips, accessibility behavior, or runtime logic. Supply source-grounded node coordinates in the machine data so the canonical renderer produces a clear left-to-right graph; the template derives bounds and browser metadata from that data. Encode target-derived strings safely for an embedded script and never add external packages, remote assets, network requests, executable target code, or target side effects. This step is complete when the destination is a canonical-template copy with exactly one replaced machine data block, every accepted event can be emitted from its overlay, and no other file or surrounding page is required to use it.

### 5. Validate the model and event loop

Compare the artifact's states, events, transitions, guards, actions, errors, and terminal outcomes with the target and scenario, correcting omissions, impossible paths, fabricated values, and hidden truncation. Open the artifact in a browser when browser automation is available; otherwise perform static HTML, script, and model consistency checks and disclose that live interaction was not run. Emit every accepted event from the in-app emitter, including every branch outcome and cycle; verify each dispatch highlights the traversed edge, activates the correct destination, applies the declared context updates in the graph, and never performs an intended target side effect. Verify reset, rejected-event feedback, keyboard operation, visible focus, pan, zoom, fit, full-viewport behavior, and reduced motion. At desktop and narrow widths, reject any layout that introduces website chrome or persistent panels around the graph. Compare the destination with the canonical template after normalizing only the machine data block; any other difference is a template-invariance failure and must be reverted. If any required route, event, graph update, or template-invariance check fails, correct it and repeat validation. This step is complete when all checks pass or the exact unresolved validation failure is reported without claiming completion.

### 6. Publish the simulation

Leave the validated artifact at the resolved destination and report the output contract. If validation is unresolved, report the failure and artifact status instead of presenting the simulation as complete. Otherwise report the path, entry point, terminal outcomes, symbolic events or payloads, validation method, and bounded or omitted detail; do not claim that the target ran. The workflow is complete only when the artifact is browser-usable, source-grounded, non-destructive, and the completion report states its evidentiary limits.

## Callstack Simulation

**State Machine Simulation**(target, scenario, supporting context, controls)
│
├─ **Resolve The Simulation Contract**(inputs, entry point, authority order, abstraction boundary, output path)
│  │
│  ├─ if (the target or entry point is missing, unreadable, or ambiguous): stop and report the blocker
│  │
│  ├─ else if (the destination exists without revision authority): stop and request authority or another path
│  │
│  └─ else: fix the contract and retain target behavior over conflicting context
│
├─ **Build The Source Grounded Machine**(fixed contract)
│  │
│  ├─ **Map Reachable States**(operations, decisions, waits, terminals, source references)
│  │
│  └─ **Map Event Driven Transitions**(event types, payloads, guards, context changes, effects, outcomes)
│     │
│     └─ if (a controlling value is missing): expose each source-feasible outcome as an explicit symbolic event or payload
│
├─ **Define Event Semantics**(machine model, initial state and context)
│  │
│  ├─ **Resolve Accepted Events**(active state and context)
│  │
│  ├─ **Dispatch An Event**(event type and optional payload)
│  │  │
│  │  ├─ if (the event is accepted): traverse its edge, apply declarative updates, and activate its destination
│  │  │
│  │  └─ else: retain the machine and show a brief in-graph rejection cue
│  │
│  └─ **Dispatch The Reset Event**(pristine state and context)
│
├─ **Create The Graph App**(model, event semantics, canonical app template)
│  │
│  ├─ **Copy The Canonical Template**(resolved destination)
│  │
│  ├─ **Replace The Machine Data Block**(source-grounded states, events, transitions, context, coordinates)
│  │
│  └─ **Preserve Template Invariants**(document, styles, renderer, event emitter, controls, tooltips, accessibility, runtime)
│
├─ **Validate The Model And Event Loop**(artifact, target, scenario)
│  │
│  ├─ if (browser automation is available): emit every event and exercise every route, cycle, terminal, and graph control
│  │
│  ├─ else: perform static consistency checks and disclose that live interaction was not run
│  │
│  └─ if (an event, graph update, graph-only layout, or template-invariance check fails): correct the artifact and repeat validation
│
└─ **Publish The Simulation**(validated graph app)
   │
   ├─ if (validation remains unresolved): report the failure without claiming completion
   │
   └─ else: report the path, entry point, outcomes, symbolic events, validation, and limits
