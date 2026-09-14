---
name: "Project State Register"
description: "An Assurance Case Docket for moving project claims through legal review gates."
colors:
  bond: "#f2efe6"
  sheet: "#fbfaf5"
  ink: "#18201f"
  muted: "#5d6663"
  rule: "#b8b6aa"
  rule-dark: "#7c827d"
  review: "#b93828"
  blueprint: "#376778"
  blueprint-dark: "#1f4148"
  blueprint-pale: "#dce7e6"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(44px, 6vw, 88px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Barlow, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  control: "3px"
  strip: "0"
spacing:
  control-y: "9px"
  control-x: "13px"
  field-y: "10px"
  field-x: "11px"
  strip-y: "13px"
  strip-x: "14px"
  panel: "26px"
components:
  button-standard:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.control-y} {spacing.control-x}"
  button-primary:
    backgroundColor: "{colors.review}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.control}"
    padding: "{spacing.control-y} {spacing.control-x}"
  field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.field-y} {spacing.field-x}"
  task-strip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.strip}"
    padding: "{spacing.strip-y} {spacing.strip-x}"
  task-dossier:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    padding: "{spacing.panel}"
    width: "min(440px, calc(100% - 24px))"
---

# Design System: Project State Register

## Overview

**Creative North Star: "The Assurance Case Docket"**

A technical bond record for a project claim moving toward independent approval. Dense registers, graphite rules, evidence rows, and decisive stamps make status legible before presentation; the board is an operational document, never decorative dashboard chrome.

The screen reads from the project claim to one required move, then to the complete state register. Review red marks intervention and failed or incomplete clearance; blueprint blue carries the active directive, resolved status, and selected record. The interface stays flat and paper-like until a task dossier must come forward.

**Key Characteristics:**
- Docket structure over card chrome.
- One current action dominates; all other state remains inspectable.
- Uppercase mono labels and condensed display type separate record metadata from claims.
- Technical bond, graphite rules, review red, and blueprint blue carry the system.

## Colors

A warm paper ground and graphite record marks keep the board sober; blue and red have precise operational meanings rather than decorative roles.

### Primary
- **Review Red:** records primary commitment and identifies failed, incomplete, blocked, and in-review conditions.
- **Blueprint Blue:** identifies the active directive and field focus.
- **Blueprint Dark:** carries the directive panel, resolved verdict, and task codes.
- **Blueprint Pale:** selects an active task strip without changing its text hierarchy.

### Neutral
- **Technical Bond:** the register and page field.
- **Sheet:** the dossier, masthead, controls, and readable hover surface.
- **Graphite Ink:** the dominant type and structural rule.
- **Muted Graphite:** secondary copy and metadata.
- **Rule / Dark Rule:** the fine register grid and form/control stroke, respectively.

### Named Rules
**The Evidence-Color Rule.** Reserve review red for a consequential action or adverse review state; use blueprint blue for active work, selection, and passed clearance.

## Typography

**Display Font:** Barlow Condensed with Arial Narrow fallback.
**Body Font:** Barlow with Helvetica Neue fallback.
**Label/Mono Font:** ui-monospace with SF Mono and Menlo fallbacks.

**Character:** Condensed uppercase claims read as docket headings, while plain Barlow carries the task record. Compact mono text gives labels, identifiers, counts, and state names the authority of filed evidence.

### Hierarchy
- **Display:** large, bold, tight leading uppercase for the project outcome, directive action, dossier title, counts, and verdict stamps.
- **Body:** 15px regular reading text for definitions and supporting record content.
- **Label:** 11px bold, spaced uppercase mono for labels, statuses, timestamps, identifiers, and form fields; compact task metadata uses 10px.

### Named Rules
**The Claim-and-Evidence Rule.** Use display type only for the claim, required move, verdict, or count; record labels stay compact mono and explanatory content stays in the body face.

## Layout

The desktop masthead is a two-column claim and independent-review sheet. Beneath it, the workspace pairs a constrained current-action dossier with a wider three-column-by-two-row state register. Lanes are continuous ruled cells, not detached cards; each task is a full-width evidence strip.

At 1040px the directive becomes a full-width section above the register. At 760px the masthead stacks, the directive is explicitly first, and the six lanes become a single ordered register so the next required action is encountered before the complete state list. At 480px, masthead controls split evenly, register metadata stacks, the dossier becomes edge-to-edge, and row actions stack with the primary action above Close.

**The Next-Action-First Rule.** On phones, retain the directive before the register; do not bury the one legal next move below the full state inventory.

## Elevation & Depth

The board is flat by default: borders, tonal fields, and density establish hierarchy. Only the fixed task dossier lifts above the register with one graphite-tinted shadow; its entrance combines a short horizontal slide with an opacity reveal. Board updates use the same rapid decelerating 320ms view transition when the browser supports it. Reduced-motion preferences reduce all transition and animation duration to near-zero.

### Shadow Vocabulary
- **Task dossier:** `12px 18px 42px rgba(24, 32, 31, 0.22)` for the open fixed panel only.

## Shapes

Rules are square, continuous, and structural. Controls and fields use a restrained 3px corner; task strips remain square. Verdicts and updated marks are the only deliberately imperfect geometry, with a slight negative rotation that reads as a docket stamp rather than decoration.

## Components

### Buttons
**Character:** terse docket controls, never pill-like calls to action.
- **Shape:** gently softened controls (3px radius) with a 1px graphite outline; text is bold, compact, spaced, and uppercase.
- **Default:** transparent against the current paper field; hover inverts to graphite with sheet text.
- **Primary:** review red with sheet text; its hover deepens the red. Within the blueprint directive, the primary reverses to sheet with blueprint-dark text.
- **Focus / disabled:** keyboard focus uses a 3px review-red outline with 3px offset; disabled controls reduce to 45% opacity.

### Inputs / Fields
**Character:** filed evidence, not floating app chrome.
- **Style:** full-width sheet fill, dark-rule stroke, and 3px radius; fields use compact internal padding and a review-red caret.
- **Focus:** the field border turns blueprint blue while the global keyboard outline remains review red.
- **Error:** error copy is review red between matching top and bottom rules.

### Navigation
**Character:** no conventional navigation bar; the dossier is the contextual route into a task.
- **Task strips:** square ruled rows with task code at left, claim, owner, and next action; hover reveals a sheet field and selection uses blueprint pale.
- **State treatment:** lane headings color adverse review states in review red and Done in blueprint dark. An updated task receives a small angled review-red stamp.
- **Dossier:** a fixed right-side sheet with a sequence line, large condensed title, ruled two-column evidence segments, and legal action forms. It makes the board inert, takes focus on open, and closes with Escape or Close.

### Task Directive
**Character:** the current legal move is the operational focal point.
- **Style:** blueprint-dark field with sheet claim type, a ruled header, mono state seal, one large required-action line, supporting task evidence, and a reversed primary action.
- **Mobile:** remains before the state register and may occupy most of the first viewport.

## Do's and Don'ts

### Do:
- **Do** make the project claim, one next required action, and task evidence readable before adding visual treatment.
- **Do** use continuous rules and dense register cells to show state as a system of record.
- **Do** use review-dossier language for controls, forms, and status changes.
- **Do** preserve the directive-before-register sequence on narrow screens.
- **Do** honor reduced-motion preferences by removing transition and animation duration.

### Don't:
- **Don't** turn the state register into free-moving kanban or detached decorative cards.
- **Don't** spend review red or blueprint blue as ambient decoration.
- **Don't** replace the next-action dossier with a generic dashboard summary.
- **Don't** add shadows outside the open task dossier, rounded cards, gradients, or ornamental imagery to the record surface.
