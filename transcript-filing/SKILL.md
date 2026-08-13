---
name: transcript-filing
description: File a raw conversation transcript into the dated transcript archive with a topic-based name. Use when the user asks to organize, file, archive, or prepare a raw transcript such as docs/transcripts/transcript.txt.
---

# Transcript Filing

Place one raw transcript in the repository's durable transcript layout. This is a filing pass only: preserve the source text byte-for-byte and do not extract claims or create other records.

## Input and output

The user supplies a raw text-file path, relative to the repository root. For example: `docs/transcripts/transcript.txt`.

The destination is `docs/transcripts/<MM-DD-YY>/<NN>-<topic>/transcript.txt`, where:

- `<MM-DD-YY>` is today's local date, produced by `date +%m-%d-%y`.
- `<NN>` is the next two-digit sequence in that date directory. Existing sequence numbers are permanent: use one greater than the largest `NN` prefix on an existing topic directory, starting at `01`.
- `<topic>` is a short, lowercase, hyphenated summary of the conversation's central subject.

## Process

1. Resolve the supplied path from the repository root and confirm it is a file. Read the whole transcript before choosing its topic.
2. Name the topic for the main subject the participants actually discuss. Use specific, durable words (for example, `invite-codes`); omit filler such as `meeting`, `conversation`, or `transcript`. Convert it to a concise lowercase kebab-case slug.
3. Get today's date with `date +%m-%d-%y`. Create `docs/transcripts/<MM-DD-YY>/` when absent.
4. Inspect that date directory's existing topic directories. Find directories whose names start with exactly two digits and a hyphen, take the largest numeric prefix, and assign the next number zero-padded to two digits. If the next number would exceed `99`, stop and ask the user how to continue.
5. Create `docs/transcripts/<MM-DD-YY>/<NN>-<topic>/`. Choose a topic slug that makes this destination unused; never overwrite or merge an existing directory.
6. Move the source file to `<destination>/transcript.txt`, renaming it as part of the move when necessary. Do not alter its contents.
7. Report the final path and the selected topic. The filing is complete when the source no longer exists at its old path and the new `transcript.txt` exists in its topic directory.
8. Apply the [`transcript-extraction`](../transcript-extraction/SKILL.md) skill to the new `<destination>/transcript.txt`.
