---
name: extract-to-tasks
description: Convert transcript-extraction `extract.md` reports into an approved, deduplicated set of local tracer-bullet tasks. Use when asked to triage transcript extracts, propose task slices from transcript findings, or create local task files from `extract.md` reports.
compatibility: Requires the active repository to provide a to-tasks skill plus task-tracker and triage-label documentation under docs/agents/.
---

# Extract to Tasks

Turn actionable extraction claims into approved local tasks; this workflow triages and publishes work but does not reinterpret transcripts, promote records, or implement changes.

## Inputs

### A. Extraction sources

A required selection of one or more repository-relative `docs/transcripts/<day>/<order>-<slug>/extract.md` paths or transcript directories. A directory denotes its direct `extract.md`; duplicate paths denote the same source.

### B. Effort slug

An optional lowercase kebab-case slug naming `.scratch/<effort-slug>/tasks/`. It is required only for publication and must identify an unused destination.

### C. Publication approval

The user's explicit approval of the exact proposed scope, grouping, granularity, blockers, and elected change requests. It is absent during triage and required before any directory or task is created.

### D. Repository context

Required repository context: the active repository's `to-tasks` skill, `docs/agents/task-tracker.md`, `docs/agents/triage-labels.md`, cited canonical records, relevant code, and existing work. These records govern task shape, labels, current behavior, and authority.

## Outputs

### A. Candidate breakdown

A conversational numbered proposal with **Title**, **Source** (extraction path and section), **Blocked by**, **What it delivers**, and **Evidence** for every candidate, followed by every excluded or deferred item and its reason. It is complete when every in-scope extraction item appears exactly once.

### B. Approved task set

After approval, one local task per approved tracer-bullet slice at `.scratch/<effort-slug>/tasks/<NN>-<slug>.md`, numbered from `01` in dependency order. Each file uses the active `to-tasks` template, carries required provenance, and has `Status: ready-for-agent` unless the user selected another canonical state. The set is complete when every approved slice appears exactly once, all blockers point backward in dependency order, and no unapproved or pre-existing file changed.

### C. Completion report

A final report containing **Created**, **Excluded/deferred**, **Boundary**, and **Stopped**. It accounts for every task or omission and states whether publication succeeded or which permitted stopping condition ended the workflow.

## Procedure

### 1. Resolve sources and governing context

Resolve paths from the repository root, deduplicate them, and read every extraction plus the repository context in Input D. Build a source map for each potentially actionable item containing its claim, certainty, reconciliation, transcript source, evidence quote, and relevant existing behavior or work.

- If a file is not `extract.md`, a directory lacks its direct `extract.md`, or required repository context is unavailable, record the missing valid input and skip to Step 6 without creating files; suggest [`transcript-extraction`](../transcript-extraction/SKILL.md) when extraction has not occurred.
- Completion evidence: every accepted source is mapped in full, or **Stopped** names the missing or invalid input and no files were created.

### 2. Classify every in-scope item

Inspect `.scratch/`, cited canonical records, relevant code, and existing work. Treat items from **Decisions and requirements**, **Change requests**, and **Bugs and observed behavior** as candidate-bearing; use all other sections only as context. Retain extraction path, section, certainty, reconciliation, transcript source, and a short evidence quote for each item.

- Exclude verified-current behavior, resolved, historical, implemented, duplicate, or unverifiable/underspecified items.
- Defer conflicts, required canonical-record promotion, and unresolved decisions as human authority gates, showing the current record, evidence, and required decision. If the user settles one, reclassify it without losing provenance.
- Create a candidate only for a new settled requirement with a clear governing record, a specific proposed change the user explicitly elects to pursue, or a current reported or verified bug. For a reported bug, preserve verification as an acceptance criterion or create a blocking investigation task; never assert an unverified cause.
- Merge items only when they deliver the same user-visible outcome.
- Completion evidence: a classification ledger represents every in-scope item exactly once as a candidate, exclusion, or deferral with its reason and provenance.

### 3. Slice and present the proposal

Apply the active `to-tasks` tracer-bullet vertical-slice and blocking-edge rules. Make each candidate independently demoable or verifiable, add only genuine blockers, and topologically order the numbered breakdown. Present Output A and ask for explicit approval.

- If no candidates remain, record `no candidates` and skip to Step 6 without creating files.
- If the user changes scope, grouping, granularity, blockers, or a proposed change, revise the ledger and re-present the exact breakdown; prior approval does not carry forward.
- If approval is withheld or unavailable, record `approval not granted` and skip to Step 6 without creating files.
- Completion evidence: the user explicitly approves the currently displayed breakdown, or **Stopped** records `no candidates` or `approval not granted`; no directory or task exists from this run.

### 4. Validate the publication destination

After approval, obtain Input B and validate lowercase kebab-case plus an unused `.scratch/<effort-slug>/tasks/` destination. Derive every planned filename and confirm each blocker will have a lower number.

- If the slug is absent or invalid, ask for a valid slug before continuing.
- If the destination contains task files or any planned filename exists, record the collision and skip to Step 6 without writing; request a fresh slug in the final report and never overwrite, append to, renumber, or modify existing tasks.
- Completion evidence: an approved filename plan has no collisions and is dependency ordered, or **Stopped** records the slug or collision task with no writes.

### 5. Publish and verify the approved tasks

Create the validated directory and write exactly one task for each approved slice using Output B. Include a concise `## Source` section with extraction path, section, certainty, reconciliation, transcript source, and evidence quote. Re-read the files and compare them with the approved breakdown and governing template.

Preserve these invariants: do not alter extraction reports, transcript sources, canonical records, product code, or existing tasks; do not publish unapproved work; do not silently resolve authority gates; and do not overwrite any path.

- Completion evidence: every approved slice exists exactly once with all template fields, provenance, and genuine blockers; no unapproved file or protected source changed.

### 6. Report the exact result

Return **Created:** every created task path, or `none`; **Excluded/deferred:** every omitted item and reason, including human decisions and bug verification, or `none`; **Boundary:** confirmation that extraction reports, transcript sources, canonical records, product code, and existing tasks were not modified; and **Stopped:** `none` or the exact missing input, authority decision, approval, collision, or empty-candidate condition.

- Completion evidence: this report accompanies a verified approved task set with **Stopped: none**, or records a permitted stopping condition and confirms that no unauthorized write occurred.

## Callstack Simulation

**Extract To Tasks**(extraction sources, optional effort slug, publication approval, repository context)
│
├─ **Resolve Sources And Governing Context**(repository-relative sources, governing records, existing work)
│  │
│  ├─ if (a source is invalid or required context is unavailable): record the missing input and route to the exact result without creating files
│  │
│  └─ else: deduplicate the sources and build a complete provenance-bearing source map
│
├─ **Classify Every In Scope Item**(source map, canonical records, code, existing work)
│  │
│  └─ **Classify Each In Scope Item**(claim, certainty, reconciliation, transcript source, evidence)
│     │
│     ├─ if (the item is context-only, verified-current, resolved, historical, implemented, duplicate, unverifiable, or underspecified): exclude it with its reason and provenance
│     │
│     ├─ else if (the item has a conflict, required record promotion, or unresolved decision): defer it behind the human authority gate
│     │
│     └─ else if (the item is a settled requirement, elected specific change, or current reported or verified bug): retain one candidate with required bug-verification handling
│
├─ **Slice And Present The Proposal**(classification ledger, active to-tasks rules)
│  │
│  ├─ **Build The Candidate Breakdown**(independently verifiable slices, genuine blockers, dependency order)
│  │
│  └─ **Request Explicit Approval**(currently displayed numbered breakdown)
│     │
│     ├─ if (no candidates remain): record no candidates and route to the exact result without creating files
│     │
│     ├─ else if (scope, grouping, granularity, blockers, or a proposed change changes): revise and re-present the breakdown; prior approval does not carry forward
│     │
│     ├─ else if (approval is withheld or unavailable): record approval not granted and route to the exact result without creating files
│     │
│     └─ else: retain the explicitly approved breakdown for publication
│
├─ **Validate The Publication Destination**(approved breakdown, effort slug, planned filenames)
│  │
│  ├─ if (the slug is absent or invalid): request a valid lowercase kebab-case slug before continuing
│  │
│  ├─ else if (the destination or a planned filename collides): record the collision and route to the exact result without writing
│  │
│  └─ else: fix an unused dependency-ordered filename plan
│
├─ **Publish And Verify The Approved Tasks**(approved breakdown, validated destination, active template)
│  │
│  └─ create and re-read exactly the approved provenance-bearing tasks without altering protected sources or existing files
│
└─ **Report The Exact Result**(created tasks, exclusions and deferrals, protected boundary, stopping condition)
   │
   └─ if (publication succeeded): report the verified task set with Stopped none; else: report the permitted stopping condition and confirm no unauthorized write
