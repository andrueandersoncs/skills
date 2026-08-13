---
name: transcript-extraction
description: Extract decision-ready product, business, domain, constraint, change, and bug information from a recorded conversation. Use when the user asks to process a transcript or capture what a transcript says.
disable-model-invocation: true
---

# Transcript Extraction

Turn a transcript into a durable, evidence-linked **extraction**. This is a capture pass: retain every claim that could affect the product, business, or future work, while preserving its certainty. It is not a planning or implementation pass.

## Input and output

Transcript records live at `docs/transcripts/<day>/<order>-<slug>/`. A day can contain multiple transcript directories. `<order>` is a two-digit conversation sequence such as `01-invite-codes`; each transcript directory contains exactly one source file named `transcript.txt`.

The user supplies one or more transcript directories or `transcript.txt` paths. Resolve relative paths from the repository root. For each source, write or revise `extract.md` in that same transcript directory. Do not write extraction files in the day directory or in a shared extractions directory.

Use [`references/report-template.md`](references/report-template.md) as the output shape.

## Process

### 1. Establish the current record

Read the complete transcript. Before reconciling claims, read `CONTEXT.md`, or the relevant contexts named by `CONTEXT-MAP.md`, when present; read `docs/initial-idea.md` when present; and read every ADR that touches a claim. Search the repository for existing product behavior when the transcript reports a bug or refers to a feature as already built.

The completion criterion is a source map: each candidate claim has a transcript quote and the existing record that supports, refines, or conflicts with it.

### 2. Atomize the claims

Extract a claim only when it could change product behavior, user experience, domain language, process ownership, business strategy, market/customer understanding, risk, or a future decision. Keep claims atomic: one subject, one asserted fact or requested outcome.

Capture these categories:

- **Decisions and requirements** — settled product behavior, terminology, scope, or process rules.
- **Change requests** — requested changes that are not yet a settled design.
- **Bugs and observed behavior** — the reported symptom, reproduction context, and visible error; separate it from an unverified cause.
- **Business and domain knowledge** — customers, roles, market model, value proposition, operational reality, economics, and vocabulary.
- **Constraints and boundaries** — legal, security, process, adoption, integration, timing, or explicit non-goals.
- **Hypotheses and open questions** — ideas, alternatives, uncertainties, and decisions still to make.

Include both sides of a discussion only when each is materially relevant. Omit greetings, navigation commentary, speculative implementation detail, and repetition that introduces no new claim.

### 3. Preserve certainty and provenance

Classify each claim by what the speakers actually established:

- **Decided** — explicit commitment, agreement, or conclusion.
- **Observed** — a reported fact or visible product behavior; a bug is an observation until verified.
- **Proposed** — a candidate approach or desired change not yet accepted.
- **Open** — a question, ambiguity, or choice left unresolved.

For every claim, include a short, verbatim evidence quote and its transcript file. Do not turn a proposal into a decision, infer a speaker's intent from garbled transcription, or manufacture a cause, requirement, metric, or owner. Where the transcript is unclear, write the narrowest faithful claim and mark it **Open**.

The completion criterion is traceability: every extracted item can be checked against the source without rereading the entire transcript.

### 4. Reconcile without overwriting

Compare each claim to the current record:

- Mark it **New**, **Confirms**, **Refines**, or **Conflicts**.
- A transcript can propose a change to an accepted ADR or documented behavior; surface the conflict explicitly and retain both records.
- Treat repository documents and verified behavior as the current record. A transcript alone supplies evidence for a candidate, not authority to silently rewrite canonical documentation.

Write the extraction report. It is the durable handoff for later domain modeling, specification, triage, or implementation work. Do not create tickets, change application code, alter `CONTEXT.md`, amend an ADR, or modify product documentation during this skill unless the user separately asks for that follow-on work.

### 5. Close with an actionable summary

Report the output path and list only: decided items needing promotion, reported bugs needing verification, conflicts, and open questions. State when none exist.

The extraction is complete when every relevant claim is classified, evidence-linked, reconciled, and represented once in the report.
