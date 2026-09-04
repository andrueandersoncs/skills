---
name: software-craft
description: Route executable software, libraries, services, infrastructure, and single-workflow agent skills to exactly one evidence-driven workflow. Use when changing, diagnosing, reviewing, verifying, shipping, or making a current evidence-dependent decision about those artifacts.
---

# Software Craft

Route from evidence about the current state toward the observable result the user wants.

- **Current state:** Facts established by repository, runtime, and source evidence.
- **Desired state:** The observable software result requested by the user.
- **Request context:** Domain, technology, and scope constraints supplied to the selected leaf without becoming additional owners. An explicit normal-valid-path constraint limits scope but does not change routing.

Choose the first matching row. Row order is the only precedence rule.

| Current state | Desired state | Result |
| --- | --- | --- |
| Any | An agent-skill router explanation, design, implementation, or audit | Not this router; use the separate `skill-routers` skill |
| Any | A durable resumable multi-task project record or project board result | Not this router; use `manage-project` |
| Any | A probabilistic forecast with response rules and calibration | Not this router; use `predictive-planning` |
| Any | A durable product record or AI opportunity assessment | Not this router; use `product-management` |
| Any | A source-grounded nonexecuting callstack or state-machine projection | Not this router; use `workflows` |
| Any | A tutorial, how-to guide, reference, explanation, or technical-documentation audit | Not this router; use `technical-documentation` |
| Any | A named software-law explanation or case assessment | Not this router; use `software-laws` |
| Any | A result outside executable software, libraries, services, infrastructure, or a single-workflow agent skill | Not this router |
| Current evidence already satisfies the requested result | That same satisfied state | Done |
| Any | A completed reusable agent skill with one direct workflow | [`author-agent-skill`](references/author-agent-skill/SKILL.md) |
| Reviewable code exists | An evidence-adjudicated report that steelmans removal and retention before choosing one winner per part | [`absurd-code-review`](references/absurd-code-review/SKILL.md) |
| The complete Effect contract artifact is not approved | Human-approved Effect Schemas, Errors, Services, function signatures, and executable story properties | [`executable-interactive-plans`](references/executable-interactive-plans/SKILL.md) |
| The production Effect domain model is not agreed | An agreed production Effect Schema with generated examples and behavior-linked properties | [`effect-schema-brainstorming`](references/effect-schema-brainstorming/SKILL.md) |
| Visual or interaction evidence is absent or stale | A source-traceable, originality-safe builder brief | [`capture-design-reference`](references/capture-design-reference/SKILL.md) |
| At least two independent ready work units require isolated execution and integration | One integrated software result | [`coordinate-agents`](references/coordinate-agents/SKILL.md) |
| A new or expanded browser game is requested | A verified playable web-game system | [`build-web-game`](references/build-web-game/SKILL.md) |
| A new Three.js, WebGL, shader, particle, or cinematic-scroll experience is requested | A purposeful immersive web experience with a semantic fallback and measured budget | [`build-immersive-web`](references/build-immersive-web/SKILL.md) |
| New or substantially revised interface motion is requested | Purposeful, accessible, measured interface motion | [`animate-interface`](references/animate-interface/SKILL.md) |
| A new or substantially revised web page, component, or design system is requested | A verified production web interface | [`design-interface`](references/design-interface/SKILL.md) |
| A material trust, authorization, privacy, dependency, secret, or AI-tool boundary lacks demonstrated controls | A demonstrated security control set | [`secure-system`](references/secure-system/SKILL.md) |
| Repository knowledge is insufficient to decide or act, or a durable map is absent or stale | Any in-scope result that requires repository knowledge | [`map-codebase`](references/map-codebase/SKILL.md) |
| A decision depends on missing current external facts or documentation | Any in-scope evidence-dependent decision or downstream result | [`research-evidence`](references/research-evidence/SKILL.md) |
| A consequential outcome, user, success test, or human decision is unclear | An accepted testable outcome or downstream result | [`define-work`](references/define-work/SKILL.md) |
| A cheap runnable experiment can resolve the central decision | An empirical decision or downstream result | [`prototype-options`](references/prototype-options/SKILL.md) |
| Required domain behavior, public seams, compatibility, or invariants are undefined | A stable contract or downstream result | [`design-contract`](references/design-contract/SKILL.md) |
| The outcome is accepted but dependency order and verifiable slices are absent | An executable implementation plan or downstream result requiring multiple slices | [`plan-change`](references/plan-change/SKILL.md) |
| Issues, decisions, or a large uncertain program lack justified states and a ready frontier | A claimable software work queue | [`manage-work-queue`](references/manage-work-queue/SKILL.md) |
| An unexplained failure blocks required behavior | Working, reviewed, verified, or shipped behavior | [`diagnose-problem`](references/diagnose-problem/SKILL.md) |
| A measured performance budget is missed and the owning cost is known | Behavior that meets the performance budget | [`optimize-system`](references/optimize-system/SKILL.md) |
| Required behavior is not implemented | Working, reviewed, verified, or shipped behavior | [`implement-change`](references/implement-change/SKILL.md) |
| A reviewable artifact exists without the requested independent verdict | Independent judgment, or a reviewed downstream result | [`review-change`](references/review-change/SKILL.md) |
| A material claim lacks sufficient fresh proof | A freshly proven claim, or a verified downstream result | [`verify-change`](references/verify-change/SKILL.md) |
| Verified work has not reached its requested integration, migration, release, or deployment state | An integrated, migrated, released, or deployed result | [`ship-change`](references/ship-change/SKILL.md) |
| The receiver lacks the context needed for the next action | An actionable knowledge transfer | [`transfer-knowledge`](references/transfer-knowledge/SKILL.md) |

Load exactly one selected leaf and treat it as the active skill. Supply relevant technology guidance as context rather than selecting a second owner:

- [Effect](references/effect.md), including [Effect DSLs](references/effect-dsl/guide.md)
- [TypeScript](references/write-typescript.md)
- [Swift](references/write-swift.md)
- [Interface design](references/design-interface/SKILL.md), [motion](references/animate-interface/SKILL.md), [immersive web](references/build-immersive-web/SKILL.md), and [web games](references/build-web-game/SKILL.md)
- [Security](references/secure-system/SKILL.md)

After the leaf completes:

1. Update current state from its completion evidence.
2. Stop when current state satisfies desired state.
3. Otherwise route again with the same desired state.
4. If the same leaf is selected without a state change, report an incomplete leaf result or defective route.

See [`references/catalog.md`](references/catalog.md) for component origins and boundaries.