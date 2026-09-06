# Ripwire

Use the local Ripwire CLI when ranked symbols, callers, or change impact would help answer a structural code question. The calling skill retains its workflow and completion requirements. Keep `rg` for direct text searches and read known files directly.

## Availability and scope

Check `command -v ripwire`, then `ripwire --version` and `ripwire --help` before using these recipes with an unfamiliar installation. Confirm that the installed version supports the selected command and the target language. If Ripwire is unavailable or cannot index the relevant code, continue with repository-native tools and source reads.

This reference assumes an existing CLI installation. Installing Ripwire, activating its bundled skills, or configuring its optional MCP server is separate setup work. Keep this collection's existing skill routing.

## Choose one question

Run from the target repository root. Replace the example task, symbol, trace path, or Git reference with the current task's evidence. Select the smallest useful query; do not run the whole table as a checklist.

| Question | Command |
| --- | --- |
| Where is this behavior implemented? | `ripwire . --for="task or behavior"` |
| What does this symbol do? | `ripwire . --expand=SYM` |
| What context does this task need? | `ripwire . --pack-task="task" --token-budget=4000` |
| What code could a symbol change affect? | `ripwire . --impact=SYM` and, when non-call references matter, `ripwire . --uses=SYM` |
| Where do these stack frames lead? | `ripwire . --from-trace=trace.txt` |
| What surrounds the change being reviewed? | `ripwire . --pr-context=REF` |
| Which tests might cover the current working-tree change? | `ripwire . --situ` |

The task bundle's 4,000-token budget is a starting example. Adjust it to the question and inspect reported truncation before deciding whether more context is needed. Expand only unresolved symbols rather than repeating information already in a bundle.

For review, use the workflow's pinned base reference. `--situ` concerns the current working-tree change; it does not substitute for a branch-wide review. Preserve the source revision and dirty state with retained evidence, and refresh results after relevant source changes.

## Interpret the evidence

- Read consequential source and tests before editing or making a finding. Rankings identify candidates; a stack-trace match does not establish a root cause.
- Preserve confidence, ambiguous relationships, skipped or unindexed files, parse problems, and truncation notices. Missing graph edges do not establish that code is unused or safe to remove. Check runtime registration, persisted formats, flags, and downstream consumers when the task depends on them.
- Treat suggested tests as candidates. An empty result does not establish that no tests are needed. Run the repository's required checks and the claim-specific scenario chosen by [verify-change](verify-change/SKILL.md).
- Treat quality metrics as investigation clues. They do not establish behavioral correctness or replace a skill's completion requirements.

## Evaluate adoption

Start with representative mapping and review tasks. Compare the same task, repository revision, model, and available tools in fresh sessions with and without this reference. Record relevant files found, missed dependencies, context consumed, elapsed time, and correctness of the completed result.

Prediction: the reference reduces context and investigation time while preserving complete findings. Broaden routine use only when the comparison supports that prediction. This applies [Gall's Law](../../software-laws/references/reference.md#galls-law) to rollout and [Goodhart's Law](../../software-laws/references/reference.md#goodharts-law) to keeping correctness alongside token cost. Upstream benchmark results do not establish savings on our tasks.

## Sources

Recipes reviewed against upstream revision `93c8edaafdb5499e89939cc2cebd0429e278e86f` on 2026-09-06. These are documented commands; this integration does not claim a local runtime benchmark.

- [Workflow and command selection](https://github.com/redhat-et/ripwire/blob/93c8edaafdb5499e89939cc2cebd0429e278e86f/skills/ripwire-router/SKILL.md)
- [Task bundles and budgets](https://github.com/redhat-et/ripwire/blob/93c8edaafdb5499e89939cc2cebd0429e278e86f/skills/ripwire-efficient/SKILL.md)
- [Change context and test selection](https://github.com/redhat-et/ripwire/blob/93c8edaafdb5499e89939cc2cebd0429e278e86f/skills/ripwire-change-check/SKILL.md)
- [Symbol relationships and uncertainty](https://github.com/redhat-et/ripwire/blob/93c8edaafdb5499e89939cc2cebd0429e278e86f/skills/ripwire-navigate/SKILL.md)
