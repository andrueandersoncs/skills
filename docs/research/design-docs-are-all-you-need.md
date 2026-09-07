# Investigating "Design Docs Are All You Need"

Reviewed September 7, 2026. Primary source: Kushnir et al., [arXiv:2609.05364v1](https://arxiv.org/abs/2609.05364v1), submitted September 4, 2026. I read the complete five-page paper, including its figure and references.

This is a useful engineering proposal. I would test its approach on a bounded module before treating regeneration as a better default for software maintenance.

## What the authors report

SMART regenerates a symbolic ML performance library from 50 design documents, about 9,000 lines. Agents infer document dependencies, implement in dependency order, and record ambiguities and bugs for document revision. Worked traces and exact reference outputs constrain generation. A recursive operation representation supports analytical cost evaluation and detailed scheduling. Some utility code remains. [Sections 2 through 4](https://arxiv.org/html/2609.05364v1#S2)

Reported rebuilds take 1.5 to 3 hours and approximately $100 through Claude Code, or about 20% of a Claude Max weekly allowance. The abstract claims agreement with hand-audited models, including DeepSeek-V3 on TPUs, to rounding precision. [Section 2](https://arxiv.org/html/2609.05364v1#S2), [abstract](https://arxiv.org/html/2609.05364v1#abstract)

The paper supplies no named model versions, trial counts, success distribution, controlled patching baseline, ablation, hardware-error table, or reproducible run artifact. Its debt equation defines debt through deviation from regeneration. [Sections 1 through 4](https://arxiv.org/html/2609.05364v1#S1)

I found no official SMART repository link in the paper or arXiv record, and targeted title, identifier, and author searches did not locate one. This does not establish that no public repository exists.

## My assessment

The useful hypothesis is that a specification becomes clearer when a fresh implementer repeatedly has to reconstruct behavior from it. A missing decision then creates observable work: an implementation disagreement, a failed check, or a question that someone must resolve. Preserving those resolutions could improve future builds. That mechanism is worth testing independently of whether an entire repository should be regenerated.

The evidence needs two distinct tests. Agreement with another implementation can establish faithful translation of a model. Predicting measured hardware behavior requires separate observations. Two implementations can agree perfectly while sharing the same simplifying assumption. Similarly, tests and code derived from the same prose can agree on the same misinterpretation. I would keep an independently authored acceptance suite outside the generator's edit permissions.

The debt argument does not establish a maintenance advantage. A distance from a fresh implementation needs a specified metric before it can measure anything. Even then, proximity to that implementation would not imply lower defect rates, lower operating cost, or easier future changes. An incremental implementation might preserve a valuable behavior absent from its specification. A fresh implementation might introduce a new defect. For a stochastic generator, two fresh builds can also differ, so a measured comparison needs repeated runs and a stable behavioral target. This is my critique of [Equation 1](https://arxiv.org/html/2609.05364v1#S1.E1), not a result reported by the authors.

Economics should count accepted changes. The relevant cost includes specification writing, failed attempts, integration, review, and repairs. A price for one successful build cannot by itself predict the cost of making and shipping a sequence of changes. Subscription capacity is also a different accounting unit from API expenditure. I would record both resource usage and human time rather than convert between them without billing evidence.

## A test that could change this assessment

Use one small library with independently checked behavior and a short sequence of realistic changes. Freeze each change request before implementation. Give the same current specification to two workflows: modify the previous implementation, or rebuild from an empty implementation directory. Pin the model, tool versions, dependencies, and resource limits; repeat both workflows with independent runs.

Before running, predict which workflow will require fewer human correction minutes per accepted change. Choose that as the primary measure. Record acceptance rate, elapsed time, expenditure, regressions, and specification editing time as supporting evidence. Run acceptance checks on inputs that are absent from the worked examples. Do not let implementation agents revise those checks.

Then isolate the document-writing hypothesis in a separate experiment. Hold the task and workflow constant while comparing specifications with and without worked traces. Judge both with the same acceptance suite. This would distinguish a benefit of examples from a benefit of rebuilding. A positive result on one library would justify another trial on a different kind of system before broad adoption.

## Application to this repository

Inspected `main` at `04bc74ba4ecf06356fe4175da035c7c3b3b465e4`. These are recommendations, not implemented skill changes.

| Existing workflow | What is already covered | Small useful addition |
| --- | --- | --- |
| [design-contract](../../skills/help/references/software-craft/references/design-contract/SKILL.md) | Observable behavior, invariants, compatibility, and test seams. | For ambiguous semantics, include a worked input, intermediate states, and exact expected output. |
| [plan-change](../../skills/help/references/software-craft/references/plan-change/SKILL.md) | Self-contained tasks, dependencies, and evidence. | Have implementers report missing specification decisions and preserve resolved decisions in the owning contract. |
| [executable-interactive-plans](../../skills/help/references/software-craft/references/executable-interactive-plans/SKILL.md) | Reviewed declarations and executable story properties. | Use traces to explain a property while keeping fixture agreement distinct from production behavior. |
| [evaluate-agents](../../skills/help/references/agent-systems/references/evaluate-agents/SKILL.md) | Held-out acceptance, repeated reliability, and cost per success. | Reuse its comparison method for the bounded experiment above. |

[simulate-callstack](../../skills/help/references/workflows/references/simulate-callstack/SKILL.md) already provides a way to draft source-grounded execution traces. Its output is a model of behavior; [verify-change](../../skills/help/references/software-craft/references/verify-change/SKILL.md) still requires observed execution for runtime claims.

My recommendation is to test worked traces and specification feedback within these existing workflows. A separate regeneration skill would need evidence of recurring demand and better outcomes first. This follows [Gall's Law](../../skills/help/references/software-laws/references/reference.md#galls-law): start with one working module. [Goodhart's Law](../../skills/help/references/software-laws/references/reference.md#goodharts-law) predicts misleading progress if example agreement becomes the target, so retain unseen acceptance cases. [Hyrum's Law](../../skills/help/references/software-laws/references/reference.md#hyrums-law) predicts compatibility losses when regeneration discards undocumented behavior, so include actual consumer scenarios.
