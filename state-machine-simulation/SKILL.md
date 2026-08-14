---
name: state-machine-simulation
description: Generate a source-grounded event-driven state-machine simulation as a canonical graph-only web app plus a static Mermaid companion. Use when asked to visualize, simulate, explore, teach, emit events through a browser graph, or export a workflow, procedure, algorithm, or function as Mermaid.
compatibility: Produces a standalone HTML app for a modern JavaScript-enabled browser and a Mermaid stateDiagram-v2 source file.
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

Optional entry-point override, abstraction level, expanded or collapsed operations, focus area, initial scenario, event-name or payload overrides, repository-relative `.html` destination, and repository-relative `.mmd` destination. The default destinations are `state-machine-simulation.html` and a Mermaid companion with the same basename, `state-machine-simulation.mmd`, at the active repository root. Revising either existing destination requires explicit user authority.

### E. Canonical app template

The required bundled [`assets/app-template.html`](assets/app-template.html), which is the authoritative implementation and visual reference for every generated artifact. Its document structure, styling, graph renderer, event emitter, controls, tooltips, accessibility behavior, and runtime logic are read-only template invariants; only the embedded machine data block between `// MACHINE_DATA_START` and `// MACHINE_DATA_END` is target-specific.

## Outputs

### A. Interactive state-machine artifact

One self-contained HTML file at the resolved destination, created from the canonical app template with only its machine data block replaced, that implements the modeled machine and conforms to [`references/interactive-artifact-spec.md`](references/interactive-artifact-spec.md). It is complete when it opens without a build step or network access as a full-viewport graph app, exposes the events accepted by the active state, lets a keyboard or pointer user emit those events in the app, and updates the active node, traversed edge, and relevant inline state data live until every modeled terminal state is reachable. The visible interface contains only the graph and minimal floating graph controls; it has no website masthead, sidebar, inspector, history, context, legend, disclosure, or content panel.

### B. Mermaid state diagram

One Mermaid source file at the resolved `.mmd` destination, generated from the same machine model as the HTML artifact and conforming to [`references/mermaid-diagram-spec.md`](references/mermaid-diagram-spec.md); the bundled [`references/state-machine-simulation.mmd`](references/state-machine-simulation.mmd) is the generated self-simulation reference. It is complete when a Mermaid renderer can display every modeled state, event-labeled transition, cycle, initial state, and terminal outcome without introducing a path absent from the interactive app. It is a static companion and does not claim to emit events or update live.

### C. Completion report

A concise response containing both artifact paths, target and entry point, modeled terminal outcomes, symbolic or unresolved behavior, validation performed for the HTML and Mermaid outputs, and any bounded or omitted detail. It is complete when it distinguishes source-grounded behavior from scenario choices, identifies Mermaid as static, and does not claim that the target itself was executed.

## Procedure

### 1. Resolve the simulation contract

Read every input and determine the root operation, initial context, source identifiers, authority order, abstraction boundary, HTML path, and Mermaid path. If supporting context conflicts with the target, retain the target's behavior and record the conflict for the outputs. If the target or entry point is missing, unreadable, or ambiguous, stop before creating either output and name the blocker. If either destination exists without revision authority, stop without changing either destination and request authority or another path. This step is complete when one shared simulation contract and both output paths are fixed or a blocker has been reported.

### 2. Build the source-grounded machine

Map the target into a finite model of start, operation, decision, waiting, success, error, blocked, and truncated states; source-ordered transitions; the event that triggers each transition; guards and optional event payloads; material context reads and writes; intended side effects; returns; and errors. Assign every user-drivable transition an explicit event type; define each distinct type once, derive its name from source terminology such as `SOURCE_VALID`, and retain a readable event label. Represent a local call as a state or nested group at the chosen abstraction level, an undefined or external call as an opaque waiting state, a loop as a cycle, and recursion as a bounded summary rather than unbounded generated states. Never invent business rules, external responses, timing, or concurrency ordering. If missing information controls a transition, model each source-feasible outcome as an explicit event or payload choice and label its value symbolic. This step is complete when every reachable source transition has a modeled event and destination or an explicit blocked or truncated state.

### 3. Define event semantics

Set the initial active state and context, then determine the accepted event set for every state. Dispatching an accepted event evaluates only its allowlisted declarative guard, applies its declarative context updates, traverses the matching edge, and makes the destination active. When one event can produce multiple source-feasible outcomes, require a modeled payload choice or split it into distinct events rather than choosing silently. An unaccepted event leaves the machine unchanged and produces a brief in-graph rejection cue. **Reset** dispatches a reserved local reset event that restores the pristine state and context; do not provide generic **Next**, **Back**, or timeline controls that hide the event model. Intended external side effects remain labels on the traversed edge and never run. This step is complete when every modeled transition is reachable by emitting an explicit event, every dispatch is deterministic for its event and payload, and no event can enter an undefined state.

### 4. Create the graph app

Read the canonical app template completely, copy it to the resolved destination, and replace only the JavaScript value between `// MACHINE_DATA_START` and `// MACHINE_DATA_END` with the complete JSON-compatible machine model. Preserve every other template byte and do not redesign, restyle, restructure, simplify, or extend its HTML, CSS, graph renderer, event dock, controls, tooltips, accessibility behavior, or runtime logic. Supply source-grounded node coordinates in the machine data so the canonical renderer produces a clear left-to-right graph; the template derives bounds and browser metadata from that data. Encode target-derived strings safely for an embedded script and never add external packages, remote assets, network requests, executable target code, or target side effects. This step is complete when the destination is a canonical-template copy with exactly one replaced machine data block, every accepted event can be emitted from its overlay, and no other file or surrounding page is required to use it.

### 5. Create the Mermaid companion

Render the same in-memory machine model—not the generated HTML—according to the Mermaid diagram specification. Declare every state once with a deterministic Mermaid-safe alias, connect the initial pseudostate to the modeled initial state, render every transition once with its event type as the edge label, and connect each modeled terminal to a final pseudostate while retaining its terminal kind in the state label. Preserve branches, cycles, event names, and source order; do not add runtime context, controls, HTML-only interaction, or inferred transitions. Write the raw `stateDiagram-v2` source directly to the resolved `.mmd` path without a Markdown fence or prose wrapper. This step is complete when the Mermaid file is a static projection of exactly the same states and transitions as the HTML machine data.

### 6. Validate the model and event loop

Compare the shared machine model with the target and scenario, correcting omissions, impossible paths, fabricated values, and hidden truncation before validating either projection. For the HTML artifact, use browser automation when available to emit every accepted event, including every branch outcome and cycle, and verify graph updates, declarative context changes, reset, rejected-event feedback, keyboard operation, focus, pan, zoom, fit, full-viewport behavior, and reduced motion; otherwise perform static checks and disclose that live interaction was not run. At desktop and narrow widths, reject website chrome or persistent panels, and compare the HTML with the canonical template after normalizing only the machine data block. For Mermaid, parse or render the `.mmd` file with an available Mermaid CLI or library; otherwise perform static syntax and set comparisons and disclose that rendering was not run. Confirm one-to-one equality between the model and Mermaid state IDs, event-labeled transitions, initial state, cycles, and terminal outcomes, with no HTML-only runtime behavior represented as a Mermaid transition. If any route, event, graph update, template-invariance, Mermaid syntax, render, or projection-parity check fails, correct the applicable output and repeat validation. This step is complete when both outputs pass or the exact unresolved validation failure is reported without claiming completion.

### 7. Publish the simulation

Leave the validated HTML app and Mermaid companion at their resolved destinations and report the output contract. If validation is unresolved, report the failure and both output statuses instead of presenting the simulation as complete. Otherwise report both paths, entry point, terminal outcomes, symbolic events or payloads, HTML validation method, Mermaid validation method, and bounded or omitted detail; identify Mermaid as the static projection and do not claim that the target ran. The workflow is complete only when both outputs are source-grounded and mutually consistent, the HTML app is browser-usable and non-destructive, the Mermaid source is renderable or its unrendered status is disclosed, and the completion report states their evidentiary limits.

## Callstack Simulation

**State Machine Simulation**(target, scenario, supporting context, controls)
│
├─ **Resolve The Simulation Contract**(inputs, entry point, authority order, abstraction boundary, HTML path, Mermaid path)
│  │
│  ├─ if (the target or entry point is missing, unreadable, or ambiguous): stop and report the blocker
│  │
│  ├─ else if (either destination exists without revision authority): stop and request authority or another path
│  │
│  └─ else: fix one shared contract and retain target behavior over conflicting context
│
├─ **Build The Source Grounded Machine**(fixed contract)
│  │
│  ├─ **Map Reachable States**(operations, decisions, waits, terminals, source references, coordinates)
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
│  ├─ **Copy The Canonical Template**(HTML destination)
│  │
│  ├─ **Replace The Machine Data Block**(source-grounded machine model)
│  │
│  └─ **Preserve Template Invariants**(document, styles, renderer, event emitter, controls, tooltips, accessibility, runtime)
│
├─ **Create The Mermaid Companion**(same machine model, Mermaid destination)
│  │
│  ├─ **Declare Mermaid States**(stable aliases, labels, terminal kinds)
│  │
│  ├─ **Render Event Labeled Transitions**(branches, cycles, initial and final pseudostates)
│  │
│  └─ **Write Raw Mermaid Source**(stateDiagram-v2 without a wrapper)
│
├─ **Validate The Model And Event Loop**(HTML app, Mermaid source, target, scenario)
│  │
│  ├─ **Validate The Canonical App**(events, routes, graph updates, controls, accessibility, template invariance)
│  │
│  ├─ **Validate The Mermaid Projection**(syntax, renderability, states, transitions, initial state, terminals)
│  │
│  └─ if (either projection fails or they differ from the shared model): correct the applicable output and repeat validation
│
└─ **Publish The Simulation**(validated HTML app and Mermaid companion)
   │
   ├─ if (validation remains unresolved): report the failure and both output statuses without claiming completion
   │
   └─ else: report both paths, entry point, outcomes, symbolic events, validation methods, and limits
