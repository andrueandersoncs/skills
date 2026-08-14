---
name: transcript-filing
description: File a raw conversation transcript byte-for-byte into the dated transcript archive and hand it off for extraction. Use when asked to organize, file, archive, or prepare a raw transcript such as docs/transcripts/transcript.txt.
---

# Transcript Filing

Place one raw transcript in the repository's durable transcript layout, then hand it to transcript extraction; this filing workflow chooses the archive location but never interprets or rewrites the source text.

## Inputs

### A. Raw transcript

A required user-supplied UTF-8 text-file path relative to the active repository root, such as `docs/transcripts/transcript.txt`. It must identify one readable file. Its contents are source evidence and must remain byte-for-byte unchanged during filing.

### B. Transcript archive

Required repository context: the existing `docs/transcripts/` tree and the current local date. Existing date directories, sequence numbers, topic directories, and filed transcripts are authoritative and must not be renumbered, merged, or overwritten.

### C. Extraction workflow

The required sibling [`transcript-extraction`](../transcript-extraction/SKILL.md) skill, which receives the filed `transcript.txt`. It owns claim interpretation and `extract.md`; this workflow owns only filing and the handoff.

## Outputs

### A. Filed transcript

The unchanged source at `docs/transcripts/<MM-DD-YY>/<NN>-<topic>/transcript.txt`, where the date comes from `date +%m-%d-%y`, `<NN>` is the next available two-digit sequence for that date, and `<topic>` is a concise lowercase kebab-case summary of the conversation's central subject. It is complete when the destination exists with the source's exact bytes and the old path no longer exists, unless the supplied path was already that canonical destination.

### B. Extraction handoff

A completed invocation of `transcript-extraction` for the filed path, or an explicit extraction blocker after filing succeeds. Filing never creates or edits extraction records directly.

### C. Completion report

A response containing the final transcript path, selected topic, byte-preservation result, and extraction result. It is complete when it distinguishes a fully completed filing and extraction from a safely filed transcript whose extraction is blocked.

## Procedure

### 1. Validate and record the source

Resolve the supplied path from the repository root, require one readable text file, read it completely, and record its path, byte count, and content hash before changing anything. If the path is missing, unreadable, or not a file, stop without creating directories and report the invalid input. If it already matches `docs/transcripts/<MM-DD-YY>/<NN>-<topic>/transcript.txt`, treat it as an idempotent filed input, verify its path components, and skip to Step 6. This step is complete when a valid source and byte-preservation record exist, or the input blocker has been reported with no repository change.

### 2. Select the topic

Name the main subject the participants actually discuss using specific, durable words such as `invite-codes`; omit filler such as `meeting`, `conversation`, and `transcript`, then convert the result to a concise lowercase kebab-case slug. This step is complete when the slug is non-empty, topic-specific, and matches lowercase kebab-case.

### 3. Allocate the dated sequence

Get today's local date with `date +%m-%d-%y` and inspect `docs/transcripts/<MM-DD-YY>/`, treating an absent date directory as empty. Among existing direct child directories whose names begin with exactly two digits and a hyphen, find the largest numeric prefix and add one, starting at `01`; existing numbers remain permanent even when gaps exist. If the next value exceeds `99`, stop before creating or moving anything and ask the user how to continue. This step is complete when an unused two-digit sequence from `01` through `99` is reserved without changing the archive, or the overflow blocker is reported.

### 4. Reserve an unused destination

Set the destination to `docs/transcripts/<MM-DD-YY>/<NN>-<topic>/transcript.txt` and recheck that no direct child already uses the reserved `<NN>-` prefix. If one appeared after allocation, return to Step 3 and recompute from the archive; never overwrite, merge, or create duplicate sequence prefixes. Create the date and topic directories only after the complete destination is confirmed unused. This step is complete when exactly one new empty topic directory exists at the uniquely sequenced path and all prior archive entries are unchanged.

### 5. Move and verify the transcript

Move the source to the reserved destination, renaming it to `transcript.txt`, and make no content edits. Re-read the destination and compare its byte count and hash with the record from Step 1; also confirm the old path is absent. If the move fails, preserve whichever complete copy remains and report the exact state without overwriting another path. If verification fails, stop, preserve the available bytes for recovery, and do not invoke extraction. This step is complete when the old path is absent and the destination's bytes exactly match the recorded source.

### 6. Hand off extraction

Apply `transcript-extraction` to the filed `transcript.txt`; do not interpret claims or create `extract.md` within this filing procedure. If extraction cannot run or reports a blocker, keep the successfully filed transcript in place and record that result rather than rolling back or altering it. This step is complete when extraction reports its result for the final path, or a precise extraction blocker is recorded while the verified transcript remains filed.

### 7. Report the result

Report exactly `Filed: <path>`, `Topic: <topic>`, `Bytes preserved: yes`, and `Extraction: <extract.md path|blocker: reason>`. The workflow is fully complete when the transcript is verified at its canonical destination, absent from its old path unless it was already canonically filed, extraction completed at the reported path, and this exact report is returned. When extraction is blocked, report the same verified filing fields and blocker, and state that filing completed but the extraction handoff remains incomplete.

## Callstack Simulation

**Transcript Filing**(raw transcript, transcript archive, extraction workflow)
│
├─ **Validate And Record The Source**(repository-relative transcript path)
│  │
│  ├─ if (the path is missing, unreadable, or not a file): stop without repository changes and report the invalid input
│  │
│  ├─ else if (the path is already canonical): verify its path components and continue at the extraction handoff
│  │
│  └─ else: record the source path, byte count, and content hash
│
├─ **Select The Topic**(validated transcript contents)
│  │
│  └─ if (a concise topic-specific lowercase kebab-case slug cannot be formed): the topic-selection criterion remains unmet
│
├─ **Allocate The Dated Sequence**(local date, existing dated archive)
│  │
│  ├─ if (the next sequence exceeds 99): stop before changes and ask how to continue
│  │
│  └─ else: reserve one unused two-digit sequence without changing the archive
│
├─ **Reserve An Unused Destination**(date, sequence, topic)
│  │
│  ├─ if (the sequence prefix appeared after allocation): recompute the sequence from the archive
│  │
│  └─ else: create exactly one empty topic directory at the canonical destination
│
├─ **Move And Verify The Transcript**(source, reserved destination, recorded byte count and hash)
│  │
│  ├─ if (the move fails): preserve whichever complete copy remains and report the exact state
│  │
│  ├─ else if (byte or old-path verification fails): preserve recoverable bytes, stop, and do not invoke extraction
│  │
│  └─ else: retain the exact bytes at the destination with the old path absent
│
├─ **Hand Off Extraction**(filed transcript path)
│  │
│  └─ **Transcript Extraction**(filed transcript.txt)
│     │
│     ├─ if (extraction completes): retain its reported extract.md path
│     │
│     └─ else: keep the filed transcript in place and record the precise blocker
│
└─ **Report The Result**(final path, topic, preservation result, extraction result)
   │
   ├─ if (extraction completed): report the fully completed filing and extraction
   │
   └─ else: report that filing completed while the extraction handoff remains incomplete
