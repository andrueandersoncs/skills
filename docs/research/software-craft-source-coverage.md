# Software Craft source coverage

**Snapshot date:** 2026-09-04  
**Scope:** Every actual `SKILL.md` in the seven inspected repositories. Grouped rows share the same result and retained rule. “Excluded” means the source was analyzed but did not produce a general software-craft component.

## addyosmani/agent-skills — 25

| Source skills | Result / disposition | Retained contribution |
| --- | --- | --- |
| `using-agent-skills` | `software-craft` | One router, intent-based selection, shared evidence rules |
| `interview-me`, `idea-refine`, `spec-driven-development` | `define-work`, `design-contract` | Outcome hypothesis, human decision gate, capability/contract definition |
| `constraint-driven-development` | `verify-change` | Durable measurable bars and anti-weakening evidence |
| `planning-and-task-breakdown` | `plan-change` | Dependency graph, vertical slices, exact verification |
| `incremental-implementation`, `test-driven-development`, `doubt-driven-development` | `implement-change`, `review-change` | Small complete slices, observed RED, fresh-context challenge |
| `context-engineering` | `map-codebase`, `transfer-knowledge` | Selective context and durable pointers |
| `source-driven-development` | `research-evidence` | Version detection, primary sources, deep citations |
| `frontend-ui-engineering` | `design-interface` | Production UI states, responsiveness, accessibility, browser proof |
| `api-and-interface-design` | `design-contract` | Contract-first seams, compatibility, idempotency |
| `browser-testing-with-devtools` | `verify-change`, `design-interface` | Actual browser interaction, console/network/accessibility evidence |
| `debugging-and-error-recovery` | `diagnose-problem` | Stop-the-line reproduction and root-cause repair |
| `code-review-and-quality`, `code-simplification` | `review-change` | Separate correctness/quality concerns and delete unnecessary structure |
| `security-and-hardening` | `secure-system` | Threat boundaries, dependency/privacy/AI controls |
| `performance-optimization` | `optimize-system` | Baseline, attribution, comparable remeasurement, revert neutral complexity |
| `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch` | `ship-change` | Safe integration, automated gates, expand–migrate–contract, durable rationale, telemetry, staged rollout |

## mattpocock/skills — 37

| Source skills | Result / disposition | Retained contribution or exclusion reason |
| --- | --- | --- |
| `ask-matt` | `software-craft` | One flow map from idea through delivery |
| `code-review` | `review-change` | Independent specification and standards verdicts |
| `codebase-design`, `improve-codebase-architecture` | `design-contract`, `map-codebase` | Deep modules, interface leverage, hotspot-led architecture discovery |
| `diagnosing-bugs` | `diagnose-problem` | No hypothesis before a tight red-capable loop |
| `domain-modeling` | `design-contract`, `transfer-knowledge` | Exact ubiquitous language and sparse ADRs |
| `grill-with-docs`, `grill-me`, `grilling` | `define-work` | Decision trees, currently unblocked frontier, fact/decision ownership |
| `implement`, `implement-spec` | `implement-change`, `coordinate-agents` | TDD implementation and isolated ready-frontier execution |
| `prototype` | `prototype-options` | Logic probes and divergent full-size UI variants |
| `research` | `research-evidence` | Primary-source research artifact |
| `resolving-merge-conflicts` | `ship-change` | Intent-preserving conflict resolution |
| `setup-matt-pocock-skills` | Excluded: repository-specific installer | Its tracker/domain protocol ideas are retained by `manage-work-queue` and `transfer-knowledge`; setup mechanics are not general |
| `tdd` | `implement-change` | Agree public seams and build tracer bullets |
| `to-spec`, `to-tickets` | `plan-change` | Synthesize existing decisions and publish vertical blocker graphs |
| `triage`, `wayfinder` | `manage-work-queue` | Verified issue state, decision tickets, fog of war, ready frontier |
| `wizard` | `transfer-knowledge`, `ship-change` | Executable human stages and value-flow handoff |
| `handoff`, `to-questionnaire`, `wait-what`, `teach` | `transfer-knowledge` | Receiver-shaped context, asynchronous knowledge capture, explanation repair, durable learning |
| `writing-for-agents` | `transfer-knowledge`, `author-agent-skill` | Context versus cognitive load, pointers, progressive disclosure |
| `claude-handoff` | `coordinate-agents`, `transfer-knowledge` | Fresh-agent handoff with a bounded packet |
| `loop-me` | `manage-work-queue` | Explicit workflow states, triggers, and decision-ready briefs |
| `retro` | Excluded: upstream marks it a stub | No unproven retrospective process was generalized |
| `setup-ts-deep-modules` | `design-contract`, `ship-change` | Enforced public package seams and automated boundary proof |
| `writing-beats`, `writing-fragments`, `writing-shape` | Excluded: editorial composition | Useful writing methods, but no stable software-artifact trigger in this set |
| `git-guardrails-claude-code` | `secure-system`, `ship-change` | Destructive-operation guard and deliberate cleanup authority |
| `migrate-to-shoehorn` | Excluded: package-specific migration | No stable second general caller |
| `scaffold-exercises` | Excluded: course-repository-specific scaffold | No stable second general caller |
| `setup-pre-commit` | `ship-change` | Economical local automated gates |

## MengTo/Skills — 132

### Codex workflows — 19

| Source skills | Result / disposition | Retained contribution or exclusion reason |
| --- | --- | --- |
| `article-prompts-to-skills`, `web-technique-to-skill` | `author-agent-skill` | Extraction ledger, proven mechanism, portable demo and failure rule |
| `audit-reference-originality` | `capture-design-reference`, `review-change` | Source registry, reusable grammar versus protected signature, evidence severity |
| `audit-verify-explain-grade-5` | `review-change`, `verify-change` | Fact/judgment/unknown separation and claim-matched proof |
| `browser-video-recording`, `daily-ui-inspiration-capture`, `html-to-interaction-prompts`, `stitched-full-page-capture`, `video-to-superprompt` | `capture-design-reference` | Live-state capture, motion frames, repaired full-page evidence, builder briefs |
| `build-daily-inspiration-sites` | `capture-design-reference`, `coordinate-agents` | Validated manifest and independent build packets |
| `elevenlabs-tts` | Excluded: service-specific media operation | Secret hygiene is retained by `secure-system`; no general software-craft workflow is added |
| `generate-reference-inspired-brand-worlds` | `capture-design-reference`, `prototype-options`, `design-interface` | Reusable visual DNA, protected signatures, controlled divergence |
| `implement-fog-of-war` | `build-web-game` | One authoritative perception state, wall-aware visibility, hidden-target and renderer derivation |
| `iterate-until-verified` | `implement-change`, `coordinate-agents`, `verify-change` | Acceptance matrix, maker/judge separation, evidence loop |
| `optimize-web-animations` | `animate-interface`, `optimize-system` | Offscreen/hidden work, resource cleanup, runtime remeasurement |
| `performance-profiling` | `write-swift`, `optimize-system` | Release/device profiling for CPU, hangs, memory, launch, and energy |
| `publish-project-to-github` | `ship-change`, `secure-system` | Scope/visibility authority, secret/license audit, external read-back |
| `write-like-meng-on-x`, `x-bookmark-quote-posts` | Excluded: person/account-specific publishing | No portable software-artifact outcome; evidence and secret rules remain global |

### Game development — 20

All map to `build-web-game`; `optimize-threejs-games` also informs `optimize-system`, and `ship-web-games` plus `build-game-changelog` inform `ship-change`.

`author-game-levels`, `build-game-audio-feedback`, `build-game-camera-controls`, `build-game-changelog`, `build-game-inventory`, `build-game-map-editor`, `build-game-monster-system`, `build-hybrid-game-assets`, `build-isometric-arpg`, `build-mobile-threejs-games`, `build-rigged-game-assets`, `build-threejs-enemy-systems`, `build-vesperfall-review-assets`, `create-game-vfx`, `design-action-combat`, `design-game-encounters`, `optimize-threejs-games`, `ship-web-games`, `test-playable-web-games`, `tune-enemy-ai`.

Retained contribution: explicit world/combat/enemy/perception/encounter/player/presentation/production boundaries; typed authority; deterministic fixtures; atomic state; input/accessibility; asset provenance; measured budgets; full player-journey proof.

### Media — 2

`aura-asset-images`, `unsplash-asset-images` → `capture-design-reference`: search/use decision, provenance, license status, and truthful asset role. Aura rights remain unknown; Unsplash media terms remain external.

### UI — 3

`audit-ai-design-slop`, `design-first-ui-prompting`, `no-ai-design-slop` → `design-interface`, `capture-design-reference`: structured art direction, reference evidence, originality, and removal of generic repeated visual defaults.

### Web design — 88

| Source skills | Result | Retained contribution |
| --- | --- | --- |
| `add-shader-cursor-trail`, `ambient-section-particles`, `atmosphere-background`, `background-grid-webgl`, `bright-green-tech-system-webgl`, `build-interactive-particle-trail`, `build-threejs-scroll-worlds`, `cobejs`, `dither-background`, `dither-laser-dark-mode`, `falling-leaves`, `globe-gl`, `globe-particles`, `gooey-blob-system`, `matterjs`, `shaders-cursor-ripples`, `thinking-orbs`, `threejs-landscape`, `threejs-towers`, `threejs-weather`, `threejs`, `unicorn-studio`, `vantajs`, `webgl-3d-object`, `webgl-landing-steering`, `webgl-laser` | `build-immersive-web` | Semantic fallback, narrow renderer/technique choice, budgets, input, lifecycle, cleanup, and original product fit |
| `add-mouse-driven-orbit`, `animation-on-scroll`, `animation-systems`, `beam-glow-states`, `build-wireframe-scan-reveal`, `cinematic-gsap-lenis-motion-system`, `cinematic-scroll-storytelling`, `gsap-scrolltrigger-storytelling`, `gsap`, `marquee-loop`, `masked-reveal`, `pointer-trail-emitter`, `progressive-blur`, `reveal-hover-effect`, `scroll-progress-timeline`, `scroll-scrubbed-visual-sequence`, `scroll-scrubbed-word-reveal`, `scroll-world-storytelling`, `staggered-word-reveal` | `animate-interface` | One conductor, explicit progress, reversibility, reduced motion, offscreen pause, teardown, and failure-aware mechanism selection |
| `agency-grid-layout-minimal`, `beautiful-shadows`, `blue-cloudy-clean-modern`, `blue-laser-clean-glass-layout`, `book-serif-index`, `build-awwwards-quality-sites`, `clean-minimal-beige-light-mode`, `company-logos`, `container-lines`, `corner-diagonals`, `corner-lasers`, `css-alpha-masking`, `css-border-gradient`, `dark-blue-contrasting-clean`, `dark-glass-clean-layout`, `documentary-brutalist-agency`, `editorial-portfolio-chapters`, `editorial-service-booking`, `editorial-tech`, `framed-grid-layout`, `framed-tech-dark-border-gradient`, `funky-purple-container-tech`, `glass-dark-mode-clock`, `glass-dark-ui`, `high-contrast-skeuomorphic-clean`, `image-first-grid-layout`, `landing-page`, `light-mode-paper-technical`, `liquid-metal-border`, `mesh-gradient-dark-blue-clean`, `nested-container-clean-agency`, `nested-container-frames`, `number-details`, `operational-enterprise-ai`, `orange-clean-paper-saas`, `pricing-page`, `product-proof-saas`, `skeuomorphic-ui`, `solar-duotone-bold`, `split-layout-technical`, `tailwindcss`, `tech-green-dark-mode-modern`, `technical-wireframe-info-layout` | `design-interface` | Treat layout, type, color, frame, material, icon, and component patterns as adjustable ingredients under one product-specific art direction |

## emilkowalski/skills — 12

| Source skills | Result | Retained contribution |
| --- | --- | --- |
| `emil-design-eng`, `apple-design` | `design-interface`, `animate-interface` | Coherent interaction taste, direct manipulation, presentation-value continuity, materials and accessibility |
| `animate`, `animate-expo` | `animate-interface` | Frequency/purpose gate, cheapest mechanism, web/Expo thread placement, device proof |
| `animation-vocabulary` | `animate-interface` | Reverse lookup from visible behavior to precise motion terms |
| `find-animation-opportunities` | `animate-interface` | Justified opportunities plus deliberate rejected candidates |
| `improve-animations` | `animate-interface`, `optimize-system` | Whole-codebase motion inventory, prioritization, executable plan |
| `review-animations` | `animate-interface`, `review-change` | Exact focused motion verdict and blocking standards |
| `pick-ui-library`, `ask-sonner` | `design-interface`, `research-evidence` | One suitable existing dependency and version-aware product guidance |
| `prototype` | `prototype-options` | Full-size divergent UI variants, human selection, winner promotion |
| `write-swift` | `write-swift` | Value semantics, disciplined concurrency, clear APIs, Swift Testing and measured tuning |

## kingbootoshi/cartographer — 1

| Source skill | Result | Retained contribution |
| --- | --- | --- |
| `cartographer` | `map-codebase`, `coordinate-agents`, `transfer-knowledge` | Token-aware module partitioning, standard parallel-reader schema, durable synthesis, freshness and onboarding handoff |

The v2 Cartographer graph CLI informed freshness, bounded briefs, completeness audits, evidence notes, and graph diffs, but is not counted as an Agent Skill.

## obra/superpowers — 14

| Source skills | Result | Retained contribution |
| --- | --- | --- |
| `using-superpowers` | `software-craft` | Relevance routing and process-before-domain ordering |
| `brainstorming` | `define-work`, `prototype-options` | Probe/bounded/system classification and human decision gate |
| `writing-plans` | `plan-change` | Self-contained execution units with exact evidence |
| `executing-plans`, `subagent-driven-development` | `implement-change`, `coordinate-agents` | Isolated execution, bounded packets, task and integrated review |
| `dispatching-parallel-agents` | `coordinate-agents` | Strict independence gate and one-wave dispatch |
| `test-driven-development` | `implement-change` | Observed RED–GREEN behavior loop |
| `systematic-debugging` | `diagnose-problem` | Root-cause phases, single-variable hypothesis tests, architecture stop rule |
| `requesting-code-review`, `receiving-code-review` | `review-change` | Fresh reviewer and evidence-based feedback adjudication |
| `verification-before-completion` | `verify-change` | Claim-specific fresh-evidence speech gate |
| `using-git-worktrees`, `finishing-a-development-branch` | `coordinate-agents`, `ship-change` | Isolation provenance, safe integration choices, guarded destructive cleanup |
| `writing-skills` | `author-agent-skill` | RED/GREEN adversarial skill behavior tests and routing pressure |

## cursor/plugins pstack — 45

Snapshot: [`93b00b8`](https://github.com/cursor/plugins/tree/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills), pstack `0.14.8`, MIT.

| Source skills | Result / disposition | Retained contribution or exclusion reason |
| --- | --- | --- |
| `create-verification-skill`, `maintain-verification-skill` | `author-agent-skill` context | Project-local launch, doctor, drive, evidence, cleanup, feature-map, and maintenance contract |
| `typescript-best-practices`, `principle-type-system-discipline` | Shared `write-typescript` context | Constructive domain types, boundary parsing, honest narrowing, authoritative derivation, exhaustiveness, and proportional precision |
| `blast-radius` | `review-change` | Central safety fact and coupling paths that symbol references miss |
| `architect` | `map-codebase`, `design-contract`, `prototype-options`, `implement-change` | Ground consumers, compare materially different contracts, and implement against the selected shape |
| `arena` | `prototype-options`, `design-contract`, `coordinate-agents` | Competing candidates are an optional decision tactic rather than another workflow owner |
| `automate-me`, `reflect` | Excluded: Cursor transcript and mode automation | Reusable skill authoring and evidence-based consolidation remain in `author-agent-skill` |
| `figure-it-out`, `poteto-mode`, `setup-pstack` | Excluded: competing meta-router and provider model configuration | Current-plus-desired-state routing and project coordination already have canonical owners |
| `how`, `teach`, `recall` | `transfer-knowledge`; provider-specific recall excluded | Receiver-shaped explanation and resumable context use durable evidence rather than Cursor transcript paths |
| `interrogate`, `no-comments` | `review-change`, `absurd-code-review` | Independent evidence-backed judgment survives; bundled model panels and custom agents do not |
| `show-me-your-work` | Excluded: durable project records already own the result | `manage-project` and `predictive-planning` preserve decisions, evidence, and revisions without a second log format |
| `swarm` | `coordinate-agents` | One-wave delegation only for independent ownership and state |
| `tdd` | `implement-change`, `diagnose-problem`, `verify-change` | Observed RED where a plausible regression justifies a durable behavior guard |
| `technical-writing`, `bro`, `unslop` | Excluded: editorial behavior has separate owners | `technical-documentation` and `deslop` own document structure and prose; `unslop` is already preserved verbatim under `deslop` |
| `make-bot-ui` | Excluded: Cursor Grok webhook deployment | Provider-specific secrets, webhook, and Tailscale procedure has no portable second caller |
| `why` | Excluded: evidence and explanation already have owners | `research-evidence` owns sourced decisions; `technical-documentation` owns historical and design-rationale explanations |
| `principle-laziness-protocol`, `principle-foundational-thinking`, `principle-redesign-from-first-principles`, `principle-subtract-before-you-add`, `principle-minimize-reader-load`, `principle-outcome-oriented-execution`, `principle-model-the-domain`, `principle-boundary-discipline`, `principle-make-operations-idempotent`, `principle-migrate-callers-then-delete-legacy-apis` | `design-contract`, `implement-change`, `review-change`, `secure-system` | Small contracts, domain-shaped types, boundary checks, complete cutovers, idempotency, and deletion of unnecessary structure already have canonical owners |
| `principle-exhaust-the-design-space`, `principle-experience-first` | `prototype-options`, `design-contract`, `design-interface` | Compare consequential alternatives and prefer the coherent user result |
| `principle-prove-it-works`, `principle-fix-root-causes`, `principle-sequence-verifiable-units` | `diagnose-problem`, `plan-change`, `verify-change` | Reproduce failures, fix the earliest verified cause, and close each unit with direct evidence |
| `principle-guard-the-context-window`, `principle-never-block-on-the-human`, `principle-separate-before-serializing-shared-state` | `map-codebase`, `coordinate-agents`, `manage-work-queue` | Selective context, autonomous reversible work, and independent ownership before concurrency |
| `principle-build-the-lever`, `principle-encode-lessons-in-structure` | `prototype-options`, `author-agent-skill`, `ship-change` | Prefer rerunnable evidence and structural enforcement over repeated prose |

## Accounting

- Addy: 25
- Matt: 37
- Meng: 132
- Emil: 12
- Cartographer: 1
- Superpowers: 14
- Pstack: 45
- **Total: 266**

The source synthesis produced 24 components. The current router retains 22 as routed leaves and keeps Swift and TypeScript as shared technical context; verification-skill guidance is nested under `author-agent-skill`. Three consolidated local workflows add distinct adversarial-review and Effect-contract results. Exclusion is deliberate: it removes source-bound operation without pretending the source was absent.