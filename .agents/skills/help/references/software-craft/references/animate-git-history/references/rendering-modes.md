# Rendering modes

Choose the format from the delivery context, then use the simplest visual system that preserves topology, chronology, and provenance.

## Self-contained HTML

Default when the user wants an artifact they can open, explore, or share locally.

- Keep narrative text and the scene list in semantic HTML. Enhance them with inline SVG or Canvas rather than replacing them with a script-only surface.
- Inline required CSS, JavaScript, data, and small vector assets. Avoid CDN dependencies and network requests unless the target repository already owns that delivery stack or the user requests them.
- Use one animation clock and derive every scene from it. Scrubbing, pausing, restarting, and resizing must not desynchronize labels from visuals.
- Prefer SVG for modest node counts and crisp annotated geometry. Use Canvas only when measured element counts make SVG too expensive; retain an HTML transcript and accessible controls.
- Honor `prefers-reduced-motion` at initial load and when it changes. The reduced state should show the complete composition or allow discrete scene navigation without autoplay.

## Standalone SVG

Use for documentation embeds, compact diagrams, or environments that reject JavaScript.

- Put the complete static story in the base SVG. CSS or SMIL animation may reveal or emphasize it, but unsupported animation must not erase content.
- Include a title, description, view box, stable text layout, and sufficient contrast. Avoid relying on hover.
- Test the actual intended host because SVG animation and font behavior differ across browsers, image viewers, and Markdown renderers.

## Image sequence

Use when deterministic frames, social exports, or downstream editing matter more than interaction.

- Fix viewport, font inputs, color profile, frame rate, and filenames before capture.
- Emit a manifest that maps frames or time ranges to scenes and commit evidence.
- Inspect at least the first, a transition, the densest frame, and the final frame. A sequence of screenshots is not complete if labels flicker, wrap inconsistently, or move outside the crop.

## Video

Use only when a playable file is the requested delivery or the target cannot run an interactive artifact.

- Render from a deterministic HTML timeline or image sequence; do not manually recreate a second version of the story.
- Keep text readable at the final encoded resolution. Add captions or a transcript when narration carries facts.
- Use locally available encoders. Prefer broadly compatible output unless the user names a container or codec; verify the encoded file with a media probe and visual playback.
- Do not add music, voice, stock imagery, or licensed fonts without explicit need and usable rights.

## Visual grammar

- Branches and merges: lanes, braided paths, transit maps, or growing trees.
- Churn and file movement: strata, pulses, bars, or area fields tied to the same time axis.
- Releases and tags: anchored stations or chapter boundaries, never free-floating decorations.
- Contributors: introduce only when collaboration is part of the story; avoid ranking people by raw commit count as a proxy for impact.
- Large histories: aggregate quiet intervals and expand selected milestones. Preserve the scale of time and state the rule.

Prefer one primary metaphor. Decorative particles, camera motion, 3D, and sound earn their cost only when they explain repository structure or chronology. For unusually immersive delivery, apply [build-immersive-web](../../build-immersive-web/SKILL.md) to the renderer while this skill retains ownership of history evidence and narrative truth.
