---
name: transcript-purpose-analysis
description: Analyze a text transcript, divide it into coherent sections, and label each section by its communicative purpose. Use when the user asks to segment, categorize, label, map, or analyze parts of a transcript by what each passage is doing.
---

# Transcript Purpose Analysis

Segment and label a transcript by communicative purpose while preserving source meaning; do not extract requirements, judge speakers, or rewrite the source unless separately requested.

## Inputs

### A. Transcript

The complete transcript text, supplied inline or as a UTF-8 text-file path relative to the active repository root. Speaker labels and timestamps are optional but, when present, are source anchors and must remain unchanged. The transcript is read-only.

### B. Purpose taxonomy

An optional user-supplied set of labels and definitions. Use it exactly when supplied. Otherwise use: **Opening/rapport**, **Framing/context**, **Discovery/questioning**, **Explanation/evidence**, **Problem/need**, **Goal/requirement**, **Proposal/ideation**, **Evaluation/objection/risk**, **Decision/commitment**, **Coordination/action item**, **Administration/navigation**, **Closing**, and **Other/unclear**. Labels describe what a passage is doing, not merely its topic.

### C. Output destination

An optional path for the Markdown report. For a file-based transcript, default to `purpose-analysis.md` beside the source. For inline text with no destination, return the report in the response. Never modify or overwrite the transcript.

## Outputs

### A. Purpose analysis report

A Markdown report containing the source identifier, taxonomy used, and an ordered section table with the columns `Section`, `Source span`, `Primary purpose`, `Secondary purpose`, `Summary`, `Evidence`, and `Confidence`. `Source span` uses timestamps or speaker-turn ranges when available and otherwise short opening and closing text anchors. `Secondary purpose` is `—` unless a distinct supporting purpose is material. `Evidence` is a short verbatim quote. The report is complete when every transcript passage is represented once, in source order, and every label is traceable to source text.

### B. Ambiguity notes

A short list after the table covering only low-confidence boundaries, unclear language, or taxonomy mismatches; write `None` when there are none. The notes are complete when no uncertainty has been silently resolved.

## Procedure

1. **Establish the source.** Resolve a supplied path from the repository root or capture the complete inline text, then read the transcript end to end without editing it. If the path is missing, unreadable, or not a text file, stop and request a valid transcript; otherwise record the available timestamp and speaker anchors. This step is complete when the entire source and its usable anchors are known.
2. **Set the taxonomy.** Use the user's labels and definitions when supplied; otherwise use the default taxonomy from Input B. If a supplied taxonomy does not cover a passage, label it `Other/unclear` and note the mismatch rather than inventing a label. This step is complete when every allowed label has a fixed meaning for this analysis.
3. **Mark purpose transitions.** Divide the transcript into contiguous sections at changes in communicative purpose, even within a speaker turn; allow a section to span multiple turns when they jointly perform the same purpose. Do not segment by equal length or topic changes alone. Merge adjacent spans only when they have the same primary purpose and merging does not hide a meaningful transition. This step is complete when the ordered section boundaries cover the source once with no gaps or overlaps.
4. **Classify each section.** Assign one primary label for the section's dominant function and, only when materially useful, one secondary label. Base labels on explicit language and conversational role; do not infer hidden motives, sentiment, agreement, or authority. Use `Other/unclear` with low confidence when the purpose cannot be supported. This step is complete when every section has supported labels and a High, Medium, or Low confidence rating.
5. **Build the report.** For each section, add the narrowest reliable source span, a one-sentence neutral summary, and a short verbatim quote that demonstrates the label. Preserve transcript order and wording in all anchors and quotes. If the report destination already exists, revise it only when the user requested an update; otherwise stop and ask before overwriting. This step is complete when the report matches Output A and the source remains unchanged.
6. **Validate coverage and uncertainty.** Compare the table boundaries back to the complete transcript, correcting gaps, overlaps, unsupported labels, and topic-only labels. Add ambiguity notes for every remaining low-confidence boundary, unclear passage, or taxonomy mismatch, or `None` if there are none. This step is complete when each source passage appears exactly once and every classification is auditable.
7. **Report completion.** Write the report to the resolved destination or return it inline, then report the destination (or `inline`), section count, and any low-confidence section numbers. The workflow is complete only when the source is unchanged, all passages are categorized in order, and all uncertainty is explicit.
