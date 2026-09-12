# Astra skill guidance review

Applied on 2026-09-12 using OpenAI's [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), published 2026-09-11.

## Changes

- Shortened 65 workflow descriptions from 14,124 to 6,283 characters, a 55.5% reduction. Descriptions identify the requested result; names, paths, and internal metadata remain stable.
- Narrowed automatic planning, mapping, verification, review, and coordination triggers. Parallel agent execution now routes to coordination when requested.
- Moved deslop's detailed pattern catalog and router-authoring examples into references. The deslop entry shrank from 1,718 to 634 words; the shared routing guide shrank from 597 to 330.
- Replaced broad repository rules with canonical-source locations, contextual references, local verification authority, and completion expectations.
- Carried existing authorization and completion criteria through handoffs. Removed blanket approval for architectural choices and repeated integration choices when the outcome is already authorized.
- Made regression checks proportional to the change and retained exact procedures where they serve a concrete contract. Updated the authoring workflow to reassess model-specific workarounds.

These counts compare the working tree before and after this edit, including its pre-existing `unlazy` workflow. Character and word counts measure instruction size, not actual token use or effectiveness. Existing uncommitted work and verbatim upstream snapshots were preserved. Installed runtime copies were not refreshed.

## Verification

All 97 canonical skill manifests parse. Changed Markdown links resolve, including the extracted references. The original working-tree run of `bun test ./evals/skills` passed 13 tests, including unrelated comparison-tool tests; the opt-in live delegation test was skipped. On the isolated PR branch based on `main` at `f0ad5e7`, the same command passed all six tests present there. The comparison tooling is outside this change.

The installed `omp` 17.2.1 catalog did not contain `openai-codex/gpt-6-astra`; neither Astra evaluation arm started. Smoke checks used the available `openai-codex/gpt-5.6-luna` instead.

| Case | With skill | No skill |
| --- | --- | --- |
| Isolated function fix | Correct result; intended route; no mapping read | Correct result; scorer flagged a whitespace-prefixed edit path |
| Router audit without mutation | Passed; loaded the extracted routing checks | Passed |
| Prose audit without source mutation | Passed; loaded the pattern catalog | Passed |
| Edit preserving code, quotation, and claim | Passed; did not load the pattern catalog | Passed |

The first two cases used the existing evaluator. The prose checks used the first two public deslop development fixtures and the existing artifact checker. The temporary prose runner initially treated the checker's failure array as a pass object; correcting that summary and inspecting the retained results confirmed zero artifact failures in all four prose runs without repeating model calls.

These are single-run smoke checks with public fixtures. They do not establish broad equivalence, superiority over a baseline, or performance on Astra. The function baseline's path-scoring discrepancy prevents using its reported failure as evidence of a skill advantage. Automated cases preload the entry file, so they do not prove automatic host selection from the shortened descriptions.

Local evidence is under `.scratch/astra-guidance/`: `before.json`, `static-checks.json`, evaluation runs `run-b2PJ1X`, `run-npjgOI`, and `run-59oCjM` under `evals/`, and `deslop-xMWYdr/report.json` with transcripts and fixture workspaces. Run fresh cases on the intended model before making a behavioral or cost claim about these changes.
