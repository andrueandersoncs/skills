---
name: animate-git-history
description: Turn a Git repository's commit history into a source-grounded animated narrative or visual replay.
---

# Animate Git History

## Inputs

The target repository, revision or path scope, intended audience, output location, requested medium, and delivery constraints. Default to the current repository, history reachable from `HEAD`, and a self-contained HTML artifact when the request leaves these open.

## Method

1. Establish the evidence boundary before interpreting the project. Confirm the repository root, selected refs and paths, repository age, commit count, whether the clone is shallow, and whether mailmap identities apply. Do not fetch, switch refs, rewrite history, or contact remotes unless the user requested it.
2. Inspect the selected history with read-only Git commands. Capture commit OIDs, parents, author display names, timestamps, subjects, decorations, topology, and per-file churn. Use the graph view to understand branches and merges, then inspect patches for only the commits considered as story beats. Treat commit messages as claims and diffs as change evidence; neither proves human intent.
3. Build one normalized event model before rendering. Keep the chosen revision and path scope with the data. Record merges, tags, renames, binary changes, roots, gaps, bursts, and missing history explicitly. Do not count binary changes as zero or collapse renamed files into unrelated deletion and creation when Git identifies the rename.
4. Find the story rather than replaying every commit. Select a few evidence-backed acts such as origin, expansion, inflection, release, and present form. Tie every scene and quantitative annotation to commit OIDs, dates, refs, or computed totals. Label interpretation as interpretation. For large histories, state and visualize the aggregation or sampling rule while preserving milestone commits.
5. Choose a visual metaphor from the repository's actual topology and vocabulary. Generate several materially different directions when the project does not suggest one, using [elicit-llm-creativity](../../../elicit-llm-creativity/SKILL.md) only for that bounded concept step. Select the direction that best explains the evidence, not the most elaborate one.
6. Choose the narrowest delivery format that meets the request. Read [rendering modes](references/rendering-modes.md) for format-specific decisions. Prefer self-contained HTML with inline SVG, CSS, and JavaScript; use standalone SVG for a lightweight embeddable result, image sequences for deterministic frames, and video only when the delivery context needs a video file.
7. Render the factual layer first: title, scope, time axis, legend, scene transcript, commit references, and provenance notes. Add motion as progressive enhancement. Provide play/pause, restart, scrubbing or scene navigation, speed control when duration warrants it, keyboard operation, a composed reduced-motion state, and a readable static fallback. Do not make motion the only carrier of meaning.
8. Keep the artifact private by default. Omit author emails and remote URLs unless requested. Before publishing or embedding external media, fonts, avatars, or logos, verify that the user authorized publication and that licenses permit it.
9. Verify source and surface independently. Recompute displayed counts and highlighted commit facts from Git. Open the actual artifact, exercise controls, resize it, test reduced motion, inspect the first, middle, and final states, and check for runtime errors. For frames or video, inspect representative frames and probe the delivered file's dimensions, duration, and codec.

## Output

A finished animated history artifact, its location, the exact revision and path scope represented, and concise notes for aggregation, shallow history, omitted private data, or other evidence limitations.

## Done

The artifact tells a coherent story that can be traced back to the selected Git history, remains understandable without animation, works in its delivery environment, and contains no unsupported claims about why changes happened.
