# Software Craft: synthesis of six agent-skill libraries

**Research date:** 2026-09-04  
**Result:** [`skills/software-craft`](../../skills/software-craft/SKILL.md) with 23 progressively loaded component skills, a complete [origin/relationship table](../../skills/software-craft/references/catalog.md), and [source coverage manifest](software-craft-source-coverage.md).

## Conclusion

The six repositories contain **221 actual `SKILL.md` skills**, but they do not contain 221 independent ideas. They combine four different things:

1. lifecycle routers and process gates;
2. reusable reasoning and delivery methods;
3. domain specialists;
4. narrow recipes, personal automations, and package guides.

Copying them side by side would produce routing collisions, repeated rules, and excessive context. The cohesive design is one router that selects the smallest evidence-producing process and then applies only the matching domain specialist.

The collective method is:

> Observe the current state, identify the evidence that is missing, run the cheapest action that can produce it, preserve the decision at the right boundary, and make no claim stronger than the newest proof.

This is a control loop, not a fixed checklist. Failure can return implementation to diagnosis. A prototype can return definition to design. Production evidence can return shipping to optimization or rollback.

## Evidence boundary

Counts come from recursive trees at pinned revisions. A skill is counted only when the repository publishes a `SKILL.md`; support Markdown, prompts, agents, demos, scripts, commands, and CLI features are not counted.

| Repository | Revision | Count | Evidence |
| --- | --- | ---: | --- |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/1c760d643497e9da289300e5eb2f5aca861503f7) | `1c760d643497e9da289300e5eb2f5aca861503f7` | 25 | 24 lifecycle skills plus `using-agent-skills` |
| [mattpocock/skills](https://github.com/mattpocock/skills/tree/3cca18b368ae95cdbdebbff572ccafa662551015) | `3cca18b368ae95cdbdebbff572ccafa662551015` | 37 | 25 promoted, 8 in-progress, 4 misc |
| [MengTo/Skills](https://github.com/MengTo/Skills/tree/321c769739b823de5eb94eb3a52aa1974fe783a2) | `321c769739b823de5eb94eb3a52aa1974fe783a2` | 132 | 19 Codex, 20 game, 2 media, 3 UI, 88 web |
| [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7) | `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7` | 12 | Flat UI/motion/Swift catalog |
| [kingbootoshi/cartographer](https://github.com/kingbootoshi/cartographer/tree/a62d16981b6aa1f5f6ef56701c49b81a16a8e30a/plugins/cartographer/skills/cartographer) | `a62d16981b6aa1f5f6ef56701c49b81a16a8e30a` | 1 | One current Agent Skill; the v2 graph CLI is a separate product |
| [obra/superpowers](https://github.com/obra/superpowers/tree/b36e0829c6d0140e93cfef2ca599b1b07d4a7797) | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` | 14 | One global router plus 13 process skills |
| **Total** | | **221** | |

Material documentation drift was resolved against the trees:

- Addy's “All 24 Skills” heading counts lifecycle skills; the tree contains 25 including the meta-router.
- Matt's plugin ships 25 promoted skills, while the tree contains 37 actual skills.
- Meng's README says 123; the tree contains 132. It undercounts UI and web design and omits named Codex/game manifests.
- Cartographer exposes one legacy/current plugin skill. Its graph indexing, `brief`, `audit`, and `notes` CLI are adjacent v2 capabilities, not extra Agent Skills.

## Repository analysis

### Addy Osmani: complete lifecycle and production breadth

The central contribution is a consistent Define → Plan → Build → Verify → Review → Ship lifecycle with a single `using-agent-skills` router. The strongest unique leaves are constraint-driven development, source-driven development, doubt-driven development, security, CI/CD, deprecation/migration, observability, and staged launch. Each skill tends to include triggers, exclusions, an ordered workflow, rationalization resistance, and completion evidence.

Strengths:

- full coverage after coding, including operations and rollback;
- explicit evidence and security boundaries for browser/source content;
- one canonical owner for repeated processes;
- structural, routing, collision, and behavioral skill evals.

Costs:

- a full lifecycle can become ceremony for a clear local edit;
- some shared root references reduce standalone portability;
- UI guidance is broad but less specialized than Meng or Emil.

Preserved in the result: lifecycle coverage, security/operations leaves, evidence gates, contract design, source grounding, and in-flight independent doubt. Reduced: repeated routing and per-skill restatements of the same verification rules.

### Matt Pocock: decisions, language, context, and human agency

Matt's catalog separates distribution maturity from invocation authority. Twenty-two skills are human-only and fifteen are model-reachable at the snapshot. `ask-matt` is the router; small primitives such as `grilling`, `domain-modeling`, `tdd`, and `research` are composed into larger flows.

Strongest unique ideas:

- decision trees whose currently unblocked frontier is asked together;
- facts are the agent's job, preferences and authority are the user's;
- deep modules measured by caller leverage and narrow public seams;
- tracer-bullet tickets and expand–migrate–contract refactors;
- `wayfinder` as a persistent decision graph with honest fog of war;
- verified tracker state, portable handoffs, questionnaires, explanation repair, and human-operation guides;
- context load and human cognitive load as separate budgets.

Costs:

- many human-invoked wrappers increase recall burden;
- stable and beta workflow depth is uneven;
- several personal/package/repository-specific utilities do not generalize.

Preserved: decision-frontier questioning, exact domain language, deep-module design, ready-frontier planning, verified tracker state, and receiver-shaped context transfer. Reduced: wrappers that differ only by invocation surface and personal automations lacking a second general caller.

### Meng To: concrete visual mechanisms and playable systems

Meng's 132-skill library contributes the deepest implementation recipe deck. It spans reference capture, design prompting, visual systems, CSS and motion mechanisms, GSAP/Lenis, Three.js/WebGL, production browser games, performance, originality, verification, and publication.

Strongest unique ideas:

- references and prompts are versioned production assets;
- visual taste becomes explicit anatomy, tokens, mechanisms, budgets, and failure explanations;
- semantic fallbacks, reduced motion, offscreen pausing, cleanup, and live-browser proof ship with visual effects;
- game boundaries distinguish world, combat, enemies, encounters, player systems, presentation, and production;
- asset and release claims remain tied to provenance and deployed truth.

Costs:

- dozens of style skills repackage common frames, borders, glow, type, and motion;
- several workflows assume private Content/Sites/X/Vesperfall paths or absent tools;
- visual recipes and package APIs can become stale;
- a recipe name can route by aesthetic resemblance rather than product purpose.

Preserved: mechanisms, system boundaries, runtime lifecycle, reference capture, originality, game invariants, and measured budgets. Reduced: branded style identities become ingredients in `design-interface`; overlapping effects become one motion or immersive mechanism; private automations remain source examples rather than general skills.

### Emil Kowalski: restraint-first motion and interaction taste

Emil's 12 skills form a coherent motion lifecycle: name an effect, find justified opportunities, build for web or Expo, review a focused change, and audit a codebase. Adjacent leaves cover Apple design, Sonner, UI library choice, visual prototyping, and modern Swift.

Strongest unique ideas:

- decide whether motion should exist before choosing technique;
- frequency and purpose control motion intensity;
- direct manipulation starts from the presentation value, remains interruptible, and carries velocity;
- real-device, release-build, slow-motion, and frame-by-frame perception remain evidence sources;
- UI prototypes compare three to five full-size divergent directions before promotion;
- Expo UI-thread discipline and a modern value-oriented Swift method.

Cost: the broad `emil-design-eng`, animation standards, audit rubric, and builders repeat much of one motion canon.

Preserved: the motion lifecycle and specialist platform rules. Reduced: the common canon exists once inside `animate-interface`; find/build/review/audit become routes rather than duplicated skills.

### Cartographer: persistent orientation

Cartographer's one skill scans a repository, measures token counts, partitions modules, dispatches parallel readers, synthesizes `docs/CODEBASE_MAP.md`, and refreshes changed regions. Its v2 CLI adds graph indexing, bounded briefs, removal/completeness audits, notes, and graph diff/export.

Strongest unique ideas:

- repository understanding is a durable artifact rather than repeated exploration;
- partitioning follows measured module size;
- readers use a standard schema and the orchestrator owns synthesis;
- refresh can be incremental.

Costs:

- legacy freshness based mainly on mapped revision/path can miss same-path or uncommitted changes;
- exhaustive maps are wasteful for a local change;
- generated maps can expose sensitive structure or become stale authority.

Preserved: selective-versus-durable depth, standard reader schema, freshness markers, and dependency-aware refresh. Strengthened: source and lines remain authority; working-tree/content changes count; secrets and irrelevant generated/vendor code are excluded.

### Superpowers: strict inner-loop discipline

Superpowers is a mandatory process stack: brainstorming, worktree isolation, detailed plans, task execution, TDD, debugging, review, verification, and branch finishing. Its skill authoring process applies RED/GREEN pressure tests to the skill itself.

Strongest unique ideas:

- no completion claim without fresh evidence;
- no bug fix before root-cause evidence;
- no production behavior before an observed failing test when TDD applies;
- isolated workers, separate specification/quality review, and guarded branch cleanup;
- skills are behavior-changing programs that require adversarial tests.

Costs:

- mandatory invocation and approval gates can dominate small reversible work;
- detailed subagent ledgers and repeated review can cost more than the change;
- multiple implementations of planning, review, and verification overlap Addy and Matt.

Preserved: strict claim gate, red-capable debugging, behavior-first tests, clean-context review, safe isolation, and adversarial skill evals. Scaled: the heavy path applies when consequence or independence warrants it.

## Overlap and resolution

| Shared capability | Source tension | Cohesive resolution |
| --- | --- | --- |
| Global routing | Addy/Superpowers require always-on routers; Matt uses a human-invoked router; Meng/Emil prefer narrow direct matches. | One installable router. It routes automatically by evidence deficit and keeps subjective or destructive authority with the user. |
| Requirements | Addy often asks one question at a time; Matt asks the whole unblocked frontier; Superpowers requires approval for all creative paths. | Research facts first, then ask the smallest currently unblocked decision frontier. Require approval only for subjective, costly, security-sensitive, or irreversible choices. |
| Mapping/context | Cartographer favors durable exhaustive maps; Addy/Matt favor selective context. | Map only the affected surface by default. Create a durable map for onboarding or repeated cross-module work, with explicit freshness. |
| Prototyping | Matt and Emil embrace disposable UI/logic variants; strict TDD methods can reject code without tests. | Prototypes answer a decision and stay isolated; production behavior uses test-first guards where regression is plausible. |
| Planning | Addy/Superpowers specify detailed tasks; Matt keeps distant uncertainty as fog/decision tickets. | Plan the visible dependency frontier exactly. Represent unresolved decisions honestly instead of forecasting invented implementation detail. |
| TDD | Superpowers is absolute; Matt agrees public seams first; Addy adapts to stack; prototypes are deliberate exceptions. | Test behavior at the highest stable seam, observe RED, then implement. Use a runtime probe for throwaway experiments and static/config work where a permanent test has no plausible bug to catch. |
| Review | Addy uses five axes; Matt separates standards/spec; Superpowers separates request/reception; Emil has exact motion standards. | Keep specification and quality verdicts separate. Add domain standards only when the domain matches. Verify feedback before implementation. |
| Verification | Superpowers makes it a speech-act gate; Addy/Meng include browser/runtime proof. | Every claim names and runs its proof; every changed surface is exercised in its actual runtime. |
| Parallel agents | Superpowers requires true independence; Matt's beta executor uses worktree frontiers; Cartographer parallelizes readers. | Declare interfaces and file ownership first, parallelize only an independent frontier, integrate once, then verify the whole. |
| UI recipes | Meng offers many visual identities; Emil emphasizes restraint/coherence; Addy supplies baseline production quality. | Start with product intent and existing system, choose a few compatible mechanisms, create an original identity, then prove accessibility/performance in the browser. |
| Performance | Addy requires baseline/remeasure; Meng and Emil add GPU, lifecycle, Apple, and motion specifics. | One general measurement loop plus domain-specific budgets and teardown checks. |
| Skill authoring | Superpowers pressure-tests behavior; Addy tests routing/collisions; Matt optimizes context pointers; Meng extracts working mechanisms/demos. | RED baseline → canonical owner → minimal routed skill → progressive references → fresh-context routing/behavior eval → host validation. |

## Collective theory

### Skills are evidence policies

A useful skill answers four questions:

1. **Trigger:** What observable state makes this method appropriate?
2. **Action:** What is the cheapest sequence likely to change that state?
3. **Evidence:** What observation proves the transition occurred?
4. **Handoff:** Which skill owns the next missing fact?

A skill that supplies only advice is a reference. A skill that cannot say when it is done is a prompt fragment. A router should select; it should not duplicate each leaf's process.

### Three selection dimensions

Choose a workflow in this order:

1. **Process state — what is missing now?** Intent, repository knowledge, external facts, a decision, a contract, a plan, working behavior, a cause, an independent verdict, proof, or production readiness.
2. **Domain overlay — what constraints specialize the work?** Interface, motion, immersive web, game, Swift, security, or performance.
3. **Execution topology — who can act independently?** One owner, independent readers, independent implementers in isolated worktrees, a fresh reviewer, or a human authority boundary.

This order prevents a domain recipe from bypassing definition or evidence and prevents parallelism from becoming the goal.

### Rigor follows consequence

Use the smallest complete route. Add gates when failure cost, uncertainty, blast radius, irreversibility, or subjective authority increases. This reconciles Matt's composability and Superpowers' strictness without weakening either:

- the local typo gets implementation plus direct verification;
- a regression gets diagnosis, a failing guard, implementation, and verification;
- a public API gets contract design, caller migration, independent review, and verification;
- an auth migration adds security and staged shipping;
- a new art direction adds references, divergent prototypes, human selection, and live-browser proof.

### Durable artifacts are boundary objects

Maps, specs, tickets, prototypes, tests, reviews, handoffs, telemetry, and release notes are useful only when they cross a real time, person, tool, or authority boundary. Keep the artifact at that boundary and point to it. Extra copies increase drift and context load.

## Situational matches

| When... | Then... | Because... |
| --- | --- | --- |
| “Build a dashboard” lacks user and success criteria | Run `define-work` | Code cannot resolve product intent. |
| The request is clear and changes one local constant | Run `implement-change → verify-change` | More planning would create no useful evidence. |
| A framework API may have changed | Run `research-evidence` before implementation | Version-correct primary sources beat model memory. |
| A large repository is unfamiliar but the change is local | Run selective `map-codebase` | The affected call path matters; an exhaustive map does not. |
| The team will repeatedly work across the whole repository | Run durable `map-codebase` | Persistent orientation now pays back its maintenance cost. |
| Two plausible state models remain | Run a logic `prototype-options` probe | Executable edge scenarios settle the model faster than prose. |
| Visual direction is disputed | Run `capture-design-reference` with the `design-interface` overlay, then `prototype-options` with the same overlay | Evidence and side-by-side variants turn taste into a human decision. |
| A public endpoint or module seam changes | Run `design-contract → plan-change` | Consumers need an intentional compatibility and migration contract. |
| The project is large and the next work is partly fog | Run `manage-work-queue` | Decision tickets and a ready frontier preserve honest uncertainty. |
| The plan contains independent slices with separate files | Add the `coordinate-agents` overlay to the active planning or implementation owner | Isolation and up-front interfaces make parallelism safe. |
| Workers would edit the same core file | Keep one `implement-change` owner | Coordination cost and merge conflict erase parallel benefit. |
| A bug report arrives during feature work | Interrupt with `diagnose-problem` | Root-cause evidence controls the next change. |
| The fourth speculative fix is tempting | Revisit reproduction, architecture, and contract | Repeated failed fixes disprove the current model. |
| A pull request is ready | Run `review-change`, then `verify-change` | Independent judgment and direct proof answer different questions. |
| Review feedback conflicts with repository behavior | Verify and push back with evidence | Review authority does not override the contract. |
| User input, auth, secrets, personal data, or model tools appear | Add the `secure-system` overlay to the current process owner | Trust boundaries need their own abuse model and proof. |
| A user says the animation is janky | Run `diagnose-problem` with the `animate-interface` overlay; move to `optimize-system` after measurement identifies the missed budget and owning cost | Perceptual evidence plus profiles identifies the owning cost before optimization. |
| A landing page asks for WebGL | After required context and intent are settled, run `implement-change` with `design-interface` and `build-immersive-web` overlays | Product hierarchy and semantic fallback control the effect. |
| A browser game needs inventory and combat | Run `design-contract` with the `build-web-game` overlay, then `implement-change` with the same overlay | Typed authority and state conservation matter across systems. |
| A Swift concurrency error appears | Run `diagnose-problem` with the `write-swift` overlay | Isolation and ownership rules constrain the root cause. |
| A release changes data shape | Run `ship-change` with expand–migrate–contract | Compatibility and rollback must survive mixed versions. |
| Work moves to a new agent or person | Run `transfer-knowledge` | A receiver-shaped pointer packet preserves action without transcript load. |
| A new skill seems useful | Run `author-agent-skill` | Routing and behavior must outperform the no-skill baseline. |

## Resulting architecture

```text
software-craft                        one installable router
├── process owner                     define, map, research, prototype, design,
│                                     plan, queue, implement, diagnose, optimize,
│                                     review, verify, ship, transfer, capture,
│                                     author-agent-skill
├── execution overlay                 coordinate-agents
└── domain overlay                    interface, motion, immersive web,
                                      web game, Swift, security
```

Nested components follow this repository's established `workflows/references/<component>/SKILL.md` convention. They ship with the root skill but do not compete as top-level installable skills. The complete name/origin/purpose/relationship table is in [`catalog.md`](../../skills/software-craft/references/catalog.md); every source skill is accounted for in the [coverage manifest](software-craft-source-coverage.md).

## Licensing and provenance

Addy, Matt, Meng, Emil, Superpowers, and Cartographer's actual plugin subtree publish MIT licenses at the inspected revisions. Cartographer's root metadata is inconsistent: `package.json` says Apache-2.0, the README says MIT, the root `LICENSE` is absent, and `plugins/cartographer/LICENSE` is MIT. This synthesis relies on the plugin skill and cites it directly.

The result is an original reorganization rather than copied skill text or bundled assets. Source concepts and names are attributed in the catalog. External package, service, font, media, brand, and asset terms remain separate. Addy's `code-simplification` also credits an Apache-2.0 Anthropic source; this set preserves only the general evidence-first simplification principle rather than its source wording.

## Primary sources

- [Addy Osmani agent-skills README](https://github.com/addyosmani/agent-skills/blob/1c760d643497e9da289300e5eb2f5aca861503f7/README.md)
- [Matt Pocock skills README](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/README.md)
- [Meng To Skills README](https://github.com/MengTo/Skills/blob/321c769739b823de5eb94eb3a52aa1974fe783a2/README.md)
- [Emil Kowalski skills README](https://github.com/emilkowalski/skills/blob/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7/README.md)
- [Cartographer Agent Skill](https://github.com/kingbootoshi/cartographer/blob/a62d16981b6aa1f5f6ef56701c49b81a16a8e30a/plugins/cartographer/skills/cartographer/SKILL.md)
- [Superpowers README](https://github.com/obra/superpowers/blob/b36e0829c6d0140e93cfef2ca599b1b07d4a7797/README.md)
