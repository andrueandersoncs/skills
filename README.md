# Skills

Reusable workflow skills following the [Agent Skills](https://agentskills.io/) format.

## Install

Copy and run this [skills.sh](https://skills.sh/andrueandersoncs/skills) command to install the skills:

```sh
npx skills@latest add andrueandersoncs/skills --yes
```

## CLI

```sh
bun add -d @andrue/cli
```

```json
{
  "scripts": {
    "project": "andrue-cli manage-project show",
    "board": "andrue-cli manage-project serve",
    "generate": "andrue-cli generate ./schema.js"
  }
}
```

## Included skill

- `help` — gathers the available task context and routes each request to one bundled specialist.

`help` contains:

- `unlazy` — completion recovery with acceptance gates, meaningful task decomposition, and fresh evidence
- `agent-browser` — website interaction, forms, rendered-data extraction, and page captures, also reused by verification and design research
- `skill-routers` — agent-skill router design, implementation, and review
- `agent-systems` — agent harnesses, context, memory, tools, interaction, coding loops, evaluation, skill compilation, training, evolution, and multi-agent architecture
- `software-craft` — executable software work, including focused `review-symmetry` code reviews
- `workflows` — nonexecuting callstack and state-machine projections
- `technical-documentation` — tutorials, how-to guides, reference, and explanation
- `product-management` — product records and AI opportunity assessments
- `marketing` — customer research, pricing decisions, marketing-page copy, SEO audits, and lifecycle email sequences
- `grok-bot` — Grok Bot operation, organization, skills, routines, and templates
- `predictive-planning` — testable forecasts and response rules
- `manage-project` — durable multi-task project coordination
- `llm-wiki` — persistent Git-backed Markdown wikis
- `elicit-llm-creativity` — distinctive creative work
- `deslop` — prose editing that preserves meaning and voice
- `software-laws` — context-aware software-law decisions
- `distill-skill-to-model` — skill-specific LoRA training and sealed evaluation

`skills/help` is the repository's single installable skill. Its routed components operate on the active repository rather than this collection.

`skills/` is canonical. `.agents/skills/` contains installed runtime copies and independently sourced skills; `.claude/skills/help` links to the installed `help` copy.

The [agent-browser workflow](skills/help/references/agent-browser/SKILL.md) adapts [Vercel Labs' agent-browser](https://github.com/vercel-labs/agent-browser) with isolated sessions, fresh snapshot refs, and installed-version guidance. Its [source record](skills/help/references/agent-browser/references/sources.md) identifies the revision and local changes; the upstream [Apache-2.0 license](skills/help/references/agent-browser/LICENSE) is retained.

The [marketing router](skills/help/references/marketing/SKILL.md) selects five source-attributed workflows adapted from Corey Haines's Marketing Skills at `5b2c0007766c6a1cf1d53fd8fc73e979e0821022`. They reuse existing product records, preserve evidence and publishing boundaries, and link to existing editing, planning, and engineering owners. Only focused pricing-research and technical-SEO references are bundled; upstream CLIs, channel playbooks, and unsupported performance benchmarks are excluded. The upstream [MIT notice](skills/help/references/marketing/LICENSE) is retained.

Marketing smoke verification used `openai-codex/gpt-5.6-luna` through `omp` 18.1.11: five workflow artifacts, seven routing/boundary cases, a repeated pricing-copy boundary, and isolated installed-skill discovery passed. Local fixtures, source snapshots, transcripts, baseline runs, and limitations are retained in `.scratch/skill-evals/marketing-WkpEZs/report.json`. These reused smoke cases do not establish general marketing effectiveness or reliable improvement over the no-skill baseline.

After editing `skills/help`, refresh this checkout's installed copy:

```sh
bun run skills:sync
bun run skills:check
```

`skills:sync` replaces only `.agents/skills/help` from the local canonical source, excludes directories named `evals`, and restores `.claude/skills/help` as a relative link to that copy. It removes obsolete installed files and leaves other skills untouched. Edit canonical files, not the generated runtime copy.

`skills:check` reports missing, changed, or extra installed files and an incorrect Claude link. It exits nonzero on drift and runs first in `bun run test`. Commit the refreshed runtime copy with the source change. Start a fresh agent session to load updated skill descriptions and instructions; sync does not update already-running sessions.

These commands refresh this checkout only. Reinstall `help` in other repositories to update their installed copies.

The [unlazy workflow](skills/help/references/unlazy/SKILL.md) adapts [Leonxlnx/unlazy](https://github.com/Leonxlnx/unlazy) into the existing `help` routing structure. It uses project-native checks and existing specialists. Its [source record](skills/help/references/unlazy/references/sources.md) pins the revision and explains the adaptation; the [MIT license](skills/help/references/unlazy/LICENSE) is retained. Upstream's checker and Stop hook are not bundled.

## Verification

From a checkout with Bun installed:

```sh
bun install --frozen-lockfile
bun run test
```

The tests build and exercise the Node CLI, concurrent board/CLI writes, workflow transitions, rejected mutations, and evaluation scoring.

Skill comparisons require an installed, authenticated `omp`. Use `openai-codex/gpt-5.6-luna` for repository evals, not GPT-6 Astra. Record the current skill package before editing it:

```sh
bun run eval:skills --model openai-codex/gpt-5.6-luna --repeats 3
```

Each run prints a unique evidence directory under `.scratch/skill-evals/`. After changing `skills/help`, compare against that saved run:

```sh
bun run eval:skills --baseline <saved-run-directory> --repeats 3
```

`--baseline` freezes the comparison to the saved cases and model, verifies the saved case/package hashes, and reruns the old package alongside the current package and a no-skill control. It does not subtract historical scores measured under another runtime. All arms use the current evaluator, tools, budgets, and model settings, with fresh fixtures and rotating launch order. Runtime versions and evaluator hashes are recorded. No sampling seed is exposed by this runner.

`--case one-file-fix-no-map` selects one saved or built-in scenario; `--output <directory>` changes the evidence parent. Repeats default to one. To add coverage, extend [the cases](evals/skills/cases.ts) and record a new baseline; a comparison intentionally ignores subsequent edits to the suite.

Read `summary.txt` for pass counts, cases passing every attempt, paired wins/losses, named regressions, tokens and reported dollars per successful task, p95 latency, and candidate-minus-baseline deltas. Negative cost/latency deltas are improvements. `report.json` retains per-case routing, runtime, artifact, and allowed-write checks, generated-skill consumer results, usage, transcripts, fixture workspaces, and package hashes. Costs include failed attempts and fresh-context consumers; cached tokens count toward token totals. Missing or zero prices are marked unpriced, and provider-reported dollars are not an invoice.

Every candidate attempt must pass. Any arm's runtime failure makes the run incomplete. Both conditions return a nonzero exit; baseline quality failures remain diagnostic. Old-vs-new comparisons include routing compliance. No-skill comparisons use observable outcomes on the same behavioral cases, excluding internal routing and routing-only cases.

The current eight cases cover narrow coding, skill-authoring, and routing contracts, not general usefulness across all workflows. Any-attempt and every-attempt counts describe the sampled repetitions. The conservative 95% Hoeffding bounds assume independent paired attempts on these fixed cases; small runs will usually be inconclusive. These public regression cases are not a sealed holdout. A tie does not establish that the skills improve outcomes. In keeping with [Goodhart's Law](skills/help/references/software-laws/SKILL.md), inspect artifacts and failures rather than optimizing the aggregate score alone.

Fixtures and packages must be trusted: sessions retain the user's filesystem permissions. Excluding `evals` directories from runtime skill copies keeps bundled answer checks out of ordinary context, but is not a security sandbox. The runner explicitly loads the frozen skill entry; it does not test installed-skill discovery or unrestricted production tools.

Recorded Luna baseline: `.scratch/skill-evals/run-vnEMu6/` passed all eight skill cases. The seven matched behavioral cases produced one skill win and six ties; the no-skill-generated router loaded unrelated leaves in one consumer probe. The repeated old-package comparison in `.scratch/skill-evals/run-1XKt8L/` produced two ties on `one-file-fix-no-map`. These are smoke measurements, not evidence of general improvement.

## Maintaining instructions

The [Astra guidance review](docs/research/astra-skill-guidance.md) records the scope and verification of the changes based on [OpenAI's skill and prompt guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). Edit canonical sources. Keep router descriptions focused on the requested result and use linked references for detailed examples. A direct workflow must still prescribe a runnable process: entry conditions, dependency-bearing steps and branches, evidence-driven repair, output, and completion. Reassess behavioral effects with the intended model when it is available.

## Skill compilation

[`compile-agent-skill`](skills/help/references/agent-systems/references/compile-agent-skill/SKILL.md) coordinates instruction deletion against a behavioral contract. The checkout-only runner reuses the authenticated `omp` evaluator. It never overwrites a source or installed skill.

Keep cases beside the source package in `evals/development.json` and `evals/acceptance.json`, following the [shared comparison method](skills/help/references/agent-systems/references/evaluate-agents/references/comparison-method.md). Expected checks remain verifier-side. Split by task family, not paraphrase.

Seal acceptance and its decision rule before candidate selection:

```sh
bun run compile:skill seal \
  --suite skills/help/references/deslop/evals/acceptance.json \
  --output .scratch/skill-compilation/deslop-seal.json \
  --repeats 2 --min-savings 0.05

bun run compile:skill compile \
  --source skills/help/references/deslop \
  --development skills/help/references/deslop/evals/development.json \
  --seal .scratch/skill-compilation/deslop-seal.json \
  --model openai-codex/gpt-5.6-luna \
  --drop '## Pattern reference' \
  --drop '## Verbatim references' --together
```

The seal command refuses to overwrite an existing seal. `compile` prints a unique evidence directory under `.scratch/skill-compilation/`. Set `RUN` to that printed directory, then evaluate its frozen candidate:

```sh
bun run compile:skill accept --run "$RUN" \
  --suite skills/help/references/deslop/evals/acceptance.json
```

`--drop` selects whole Markdown sections, including nested headings but ignoring headings inside fenced examples. Repeated flags normally try sequential deletions; each retained deletion becomes the starting point for the next trial. `--together` instead tests the named deletions as one candidate, useful when one section sends the agent to references that duplicate another. Without `--drop`, the runner considers each level-two section. Every trial evaluates the cumulative candidate. A rejected trial leaves the previous candidate unchanged.

`--source` must contain the complete runtime package; `--entry` selects its relative entry file (default `SKILL.md`). Use a wider source root when the skill references sibling resources. Directories named `evals` are excluded from every runtime copy. `--output` changes the artifact parent directory, which must remain outside the source package.

The decision rule requires every source and candidate case to pass and total tokens per successful task to improve by the sealed margin. Cost includes failed attempts and cached tokens across the entire trajectory. Reports also retain input/output/cache usage, tool calls, runtime failures, wall-clock latency, provider-reported prices, per-family results, transcripts, and fixture workspaces. Zero reported price is marked unpriced rather than free. Provider prices are not an invoice or a measurement of external tool costs.

`manifest.json` records source/candidate hashes, selected deletions, suite hashes, runner versions, and model/runtime settings. Acceptance rejects changed suites, runtime versions, or candidate packages and refuses a second acceptance run in the same directory. `report.json` records the three-way no-skill/source/compiled result. A failed gate returns nonzero and does not deploy anything.

These are sampled artifact checks, not a statistical non-inferiority claim or a complete prose-quality evaluation. The small `deslop` suites cover particular preservation and editing obligations. A no-skill tie does not establish that the source skill is useful.

Sealing enforces the local workflow, not an OS security boundary. Candidate selection loads only development cases; acceptance loads the holdout after selection. Evaluated sessions receive their current fixture and prompt, never the suite or expected checks. Local `omp` tools retain the user's filesystem permissions: use trusted fixtures and packages here, or an external sandbox for adversarial evaluation. After inspecting acceptance results, treat those cases as development evidence for future optimization.

### Recorded experiment

On 2026-09-05, `openai-codex/gpt-5.6-luna` selected the combined deletion of `deslop`'s Pattern catalog and Verbatim references sections. Five development cases and four independently authored holdout cases were each run twice per arm. The source skill was unchanged.

| Holdout arm | Passed | Total tokens per successful task | Mean task latency |
| --- | --- | --- | --- |
| No skill | 8/8 | 23,537.75 | 11.94 s |
| Source | 8/8 | 30,203.75 | 12.09 s |
| Compiled | 8/8 | 24,508.75 | 13.11 s |

The candidate cleared the predeclared 5% token-saving gate with an observed 18.9% reduction, while mean latency increased 8.4%. The no-skill baseline was cheaper and passed the same sampled checks; this experiment does not establish the skill's usefulness or broad equivalence.

Local evidence is retained in `.scratch/skill-compilation/run-NdshWZ/`, including `manifest.json`, `development.json`, and `report.json`. Earlier rejected/incomplete runs remain in sibling directories. Wording-pinned checks were removed from exposed cases before the final development run; the final holdout was newly authored and sealed before candidate selection.

The bundled acceptance cases are now public regression fixtures. Obtain a fresh holdout before using this result to guide another optimization.
