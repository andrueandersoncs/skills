---
name: design-interface
description: Design and implement distinctive production web interfaces with coherent art direction, accessible interaction, responsive behavior, and complete UI states. Use for pages, components, design systems, visual polish, library choice, or interface audits.
---

# Design Interface

## Method

1. Inspect the existing framework, routes, tokens, components, dependencies, content, and product personality.
2. Define the interface goal and one coherent art direction per production surface. During `prototype-options`, define one coherent direction per variant until the user selects the production direction.
3. Reuse project primitives and semantic tokens. Choose the least powerful state layer and an already-installed suitable library before adding a dependency.
4. Build focused components with clear data and presentation boundaries. Preserve realistic copy and data.
5. Complete every relevant state: loading, empty, error, success, disabled, optimistic, focus, hover, active, and responsive layouts.
6. Use semantic HTML, keyboard access, visible focus, correct labels, sufficient contrast, touch-sized targets, and sensible reading order.
7. Add visual techniques only when they reinforce the product idea. Treat style recipes as ingredients, not a template; combine a small compatible set and create an original identity.
8. Verify in the live browser at representative widths. Exercise interactions; inspect console, network, accessibility tree, overflow, and screenshots.

## Library decisions

Recommend one library for the actual task. Prefer the repository's current dependency. Verify current official documentation before relying on version-sensitive APIs. Use `capture-design-reference` for evidence, `animate-interface` for motion, and `build-immersive-web` for WebGL.

## Done

The interface communicates one clear hierarchy and character, works through real interaction states, and remains usable across keyboard, touch, viewport, and reduced-capability conditions.