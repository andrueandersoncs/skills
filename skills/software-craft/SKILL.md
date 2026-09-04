---
name: software-craft
description: Route software changes and decisions to the smallest complete evidence-driven workflow and relevant technical specialist. Use when work changes or evaluates a software artifact, or when a software decision requires current repository or external evidence.
---

# Software Craft

Route by the **current evidence deficit**. Select exactly one process owner for the next action, then add only matching domain or execution overlays. Do not stack other top-level routers.

Use no component for a stable factual explanation that needs neither repository work nor a current software decision.

## Select one process owner

| Current state | Process owner | Done evidence |
| --- | --- | --- |
| Repository knowledge is insufficient to decide or act, or a durable map is requested | [`map-codebase`](references/map-codebase/SKILL.md) | The relevant contracts, callers, tests, and runtime path are locatable |
| A consequential outcome, user, success test, or human decision is unclear | [`define-work`](references/define-work/SKILL.md) | One agreed testable outcome and an owner for every unknown |
| A decision depends on current external facts or documentation | [`research-evidence`](references/research-evidence/SKILL.md) | Material claims are versioned, cited, and separated from judgment |
| A runnable experiment can answer the central decision cheaply | [`prototype-options`](references/prototype-options/SKILL.md) | Runtime evidence confirms or changes a named decision |
| A domain model, public seam, API, schema, or architecture must be chosen | [`design-contract`](references/design-contract/SKILL.md) | Observable behavior, compatibility, invariants, and test seam are explicit |
| Accepted work needs dependency order and verifiable slices | [`plan-change`](references/plan-change/SKILL.md) | An acyclic graph of self-contained evidence-producing tasks exists |
| Issues, decisions, or a large uncertain program need a ready frontier | [`manage-work-queue`](references/manage-work-queue/SKILL.md) | Every visible item has one justified state and blockers |
| An agreed contract requires an ordinary source change | [`implement-change`](references/implement-change/SKILL.md) | The smallest complete behavior works and the cutover is clean |
| Behavior is broken, failing, slow, or unexplained | [`diagnose-problem`](references/diagnose-problem/SKILL.md) | The verified root cause is fixed and the original scenario passes |
| A measured performance budget is missed and the owning cost is known | [`optimize-system`](references/optimize-system/SKILL.md) | Remeasurement proves a material attributed improvement |
| A change needs an independent specification and quality judgment | [`review-change`](references/review-change/SKILL.md) | Blocking findings are resolved or explicitly remain |
| A claim such as fixed, complete, passing, or ready needs proof | [`verify-change`](references/verify-change/SKILL.md) | Fresh evidence proves that exact claim |
| Completed work must migrate, integrate, deploy, or roll out | [`ship-change`](references/ship-change/SKILL.md) | The selected shipping mode reaches its own completion state |
| Knowledge must move to another person, agent, or future session | [`transfer-knowledge`](references/transfer-knowledge/SKILL.md) | The receiver can take the next action without the original conversation |
| Visual or interaction evidence must be captured and interpreted | [`capture-design-reference`](references/capture-design-reference/SKILL.md) | A source-traceable, originality-safe builder brief exists |
| A reusable agent skill is being created or changed | [`author-agent-skill`](references/author-agent-skill/SKILL.md) | Routing, behavior, structure, and host discovery pass |

When several rows describe the request, choose the prerequisite whose Done evidence is still missing:

1. `author-agent-skill` owns its complete authoring and verification loop.
2. An active failure interrupts ordinary implementation; `diagnose-problem` owns reproduction through the fix and original-scenario proof.
3. Unexplained slowness starts in `diagnose-problem`. Move to `optimize-system` only after measurement identifies the missed budget and owning cost.
4. Otherwise gather required repository and external facts before asking for decisions; settle intent before contract; contract before plan; plan before implementation; implementation before review; review before proof; proof before shipping.
5. After the owner's Done evidence exists, route again from the new state.

## Add matching overlays

| When... | Add... |
| --- | --- |
| Two or more work units have independent state, files, and dependencies | [`coordinate-agents`](references/coordinate-agents/SKILL.md) |
| The work changes a user-facing web page or component | [`design-interface`](references/design-interface/SKILL.md) |
| Motion must be named, found, built, audited, or reviewed | [`animate-interface`](references/animate-interface/SKILL.md) |
| The experience depends on Three.js, WebGL, shaders, or cinematic scroll | [`build-immersive-web`](references/build-immersive-web/SKILL.md) |
| The product is a playable web game | [`build-web-game`](references/build-web-game/SKILL.md) |
| Swift code is being written, reviewed, debugged, or migrated | [`write-swift`](references/write-swift/SKILL.md) |
| The change crosses a trust, authorization, privacy, dependency, secret, or AI-tool boundary | [`secure-system`](references/secure-system/SKILL.md) |

The process owner controls sequence and completion. Overlays contribute domain constraints and checks without starting a second process.

## Operating theory

1. **Work is an evidence state machine, not a mandatory ceremony.** Start at the first missing fact. Move when the component's completion evidence exists. Loop backward when new evidence invalidates an assumption.
2. **Use the minimum complete path.** A mechanical edit can be `implement-change → verify-change`. A risky new system may need `define-work → research-evidence → design-contract → plan-change → implement-change → review-change → verify-change → ship-change`.
3. **Resolve facts before asking for decisions.** Research repository facts and external facts; ask the user only for preferences, priorities, authority, and unknowable intent.
4. **Make uncertainty executable.** Prefer a map, source citation, prototype, failing reproduction, benchmark, or runtime observation to additional prose.
5. **Scale gates with consequence.** Subjective, costly, security-sensitive, and irreversible choices require explicit human judgment. Reversible implementation details use repository conventions.
6. **Separate creation from judgment.** Use fresh context for material review. Parallelize only work with independent state and ownership.
7. **Evidence closes the loop.** No completion claim outruns the freshest command, runtime observation, or artifact inspection that proves it.

See [`references/catalog.md`](references/catalog.md) for origins, purpose, relationships, and source-repository coverage.