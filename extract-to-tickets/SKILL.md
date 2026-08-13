---
name: extract-to-tickets
description: Turn transcript-extraction `extract.md` reports into approved, deduplicated local tickets. Use when asked to triage transcript extracts or create local ticket files from `extract.md` reports.
compatibility: Requires the active repository to provide a to-tickets skill plus issue-tracker and triage-label documentation under docs/agents/.
disable-model-invocation: true
---

# Extract to Tickets

Turn actionable claims in transcript-extraction reports into approved local tickets; this is a triage and publication pass, not transcript interpretation, promotion, or implementation.

## Inputs and output

The user supplies one or more `docs/transcripts/<day>/<order>-<slug>/extract.md` paths or transcript directories, resolved from the repository root; a directory supplies its direct `extract.md`. They may also supply an effort slug. Publishing additionally requires explicit approval of the proposed breakdown.

Before approval, output a numbered candidate breakdown and excluded/deferred items in the conversation. After approval, create only `.scratch/<effort-slug>/issues/<NN>-<slug>.md`, one ticket per approved tracer-bullet vertical slice, numbered from `01` in dependency order.

## Process

1. **Resolve the sources.** Every supplied file must be an `extract.md`; every directory must contain one. If a source is missing or invalid, stop and ask for a valid extraction or for [`transcript-extraction`](../transcript-extraction/SKILL.md) to run first. Read each distinct extraction in full, plus the active repository's `to-tickets` skill, `docs/agents/issue-tracker.md`, and `docs/agents/triage-labels.md`. The completion criterion is a source map for every in-scope item: claim, certainty, reconciliation, transcript source, evidence quote, and existing work or behavior bearing on it.
2. **Classify candidates faithfully.** Inspect `.scratch/`, cited canonical records, relevant code, and existing work. Consider ticket candidates only from **Decisions and requirements**, **Change requests**, and **Bugs and observed behavior**; use every other extraction section only as context. Retain every item’s extraction path, section, certainty, reconciliation, transcript source, and short evidence quote.
   - Exclude an item that confirms verified behavior, is resolved, historical, implemented, duplicate, or too unspecified for a verifiable outcome.
   - A conflict, required canonical-record promotion, or unresolved decision is a human authority gate, not implementation work. Present its current record, evidence, and needed decision; if the user settles it, reclassify it while retaining provenance, otherwise defer it.
   - Otherwise, make a candidate only when it is a new settled requirement with a clear governing record, a specific proposed change the user explicitly elects to pursue, or a current reported or verified bug. A reported bug retains verification as an acceptance criterion or gets a blocking investigation ticket; never state an unverified cause as fact.
   Merge items only when they deliver the same user-visible outcome. The completion criterion is that every in-scope item is represented exactly once as a candidate or with an exclusion/defer reason.
3. **Slice, order, and approve the work.** Follow `to-tickets`’ tracer-bullet vertical-slice and blocking-edge rules. Each candidate must be demoable or verifiable on its own; add only genuine blockers, in a topological order. Present a numbered breakdown with **Title**, **Source** (path and section), **Blocked by**, **What it delivers**, and **Evidence**, then separately list excluded/deferred items and their reason. Ask the user to approve the scope, grouping, granularity, blockers, and proposed changes. If there are no candidates, report that result and stop. The completion criterion is explicit approval of the exact breakdown; before it, create no directories or ticket files.
4. **Publish the approved breakdown.** If no effort slug was supplied, ask for one; it must be lowercase kebab-case. Require an unused `.scratch/<effort-slug>/issues/` destination. If it contains ticket files or a planned filename exists, stop and ask for a fresh slug rather than overwrite, renumber, append to, or modify existing tickets. Create the directory and write one ticket per approved slice as `.scratch/<effort-slug>/issues/<NN>-<slug>.md`, numbered from `01` so each blocker has a lower number. Use the `to-tickets` local template, `Status: ready-for-agent` unless the user chose another canonical state, and a concise `## Source` section with the extraction path, section, certainty, reconciliation, transcript source, and evidence quote. The completion criterion is that every approved slice exists exactly once with its template fields, provenance, and genuine blockers, while no source, canonical record, code, or existing ticket changed.

## Completion report

Report **Created:** every ticket path; **Excluded/deferred:** every omitted item and its reason, including required human decisions or bug verification; and **Boundary:** that extraction reports, transcript sources, canonical records, product code, and existing tickets were not modified. The workflow is complete when that report accompanies the approved ticket files, or when a missing input, authority decision, approval, collision, or empty candidate set has been explicitly reported as the stopping condition.
