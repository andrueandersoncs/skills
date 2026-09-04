## Recommendation

Build a **behavioral-distillation pipeline that produces one LoRA adapter per skill**.

Do not train a model from scratch or fine-tune directly on `SKILL.md`. The Markdown describes a policy; training data must show that policy successfully operating.

```text
Skill package
  → behavior contract + sealed evals
  → teacher executes skill with real tools
  → verified trajectories
  → remove SKILL.md from student context
  → QLoRA adapter
  → paired evaluation against original skill
```

The result remains a system:

- **Weights:** stable decisions and workflow.
- **Runtime:** tools, scripts, references, assets, parsers, and sandbox.
- **Router:** skill `name` and `description` select the adapter.

This follows the repository’s software-laws guidance: choose the smallest mechanism, treat metrics as signals, and verify generated output.

## Existing evidence

The closest direct research is the June 2026 [Skill-to-LoRA](https://arxiv.org/abs/2606.16769) preprint. It:

- Generated demonstrations with the complete skill.
- Removed the skill text from student inputs.
- Trained one QLoRA adapter per skill.
- Dynamically loaded that adapter during inference.

On its selected 210-task SWE-Skills-Bench subset:

| Configuration | Solved |
|---|---:|
| No skill | 59/210 |
| Full `SKILL.md` | 54/210 |
| Skill-specific LoRA | 65/210 |

It reports a 5.2 percentage-point improvement over full-skill prompting and 6.6% lower per-step token cost.

Important limitation: this was same-model adaptation on a 27B model, with ten tasks per skill and no reported confidence intervals. It supports the adapter pattern, but does not prove that strong-teacher-to-4B distillation will work.

## Pipeline

### 1. Compile the complete skill package

Agent Skills defines a skill as more than its Markdown: optional scripts, references, and assets are part of the package ([specification](https://agentskills.io/specification)).

Resolve and hash:

- `SKILL.md`
- referenced instructions
- scripts and assets
- tool definitions and implementations
- runtime dependencies

Extract a behavior contract:

- when the skill applies;
- decisions it changes;
- required actions and tools;
- observable outputs;
- proof of completion.

Keep deterministic scripts, large references, mutable knowledge, and tool implementations external. Only the stable decision policy belongs in weights.

### 2. Pin one runtime manifest

Generation, evaluation, and deployment must use the same versioned manifest:

- tool schemas and implementations;
- tool-call parser;
- sandbox image and dependencies;
- mounted resources;
- tokenizer and chat template;
- context/output budgets;
- fixture policy.

A matching schema with a different implementation is not the same runtime.

### 3. Build evals before training

Create two sealed suites.

**Trigger suite**

- Prompts that should select the skill.
- Nearby prompts that should not.
- Measure routing precision and recall.

**Behavior suite**

- Realistic tasks requiring meaningful skill decisions.
- Fresh, isolated fixtures.
- Executable expected states or artifacts.
- A small general-capability retention set.

Split by task family, repository, template, or fixture generator—not by random paraphrase. The final holdout must be inaccessible to task synthesis and training.

Start with roughly 20–50 clear tasks, as recommended in [Anthropic’s agent-eval guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), then size the final suite using power analysis.

### 4. Establish the comparison matrix

Run every arm on cloned cases with identical tools, budgets, fixtures, and decoding settings:

| Arm | Configuration | Question answered |
|---|---|---|
| T0 | Capable teacher, no skill | Teacher baseline |
| T1 | Same teacher + complete skill | Original skill behavior |
| S0 | Small base model, no skill | Small-model baseline |
| S1 | Small base + complete skill | Is prompting already sufficient? |
| S2 | Trained adapter, no skill body | Target system |
| C2 | Control adapter trained from labels generated without the skill | Did skill conditioning add value? |

`T1 - T0` is diagnostic, not a gate. Skill-to-LoRA found `T1 < T0` in aggregate while its adapter improved results; training can remove prompt interference.

### 5. Generate verified trajectories

Use the strongest available teacher with the full skill package inside the pinned runtime.

For each training-only task:

1. Execute the actual workflow.
2. Capture assistant messages, tool calls, tool results, artifacts, and final state.
3. Validate tool-call syntax.
4. Execute tools rather than accepting claimed execution.
5. Check semantic and final-state correctness.
6. Retain only successful trajectories.
7. Deduplicate and reject train/eval near-matches.
8. Human-audit a random sample.

This layered verification is supported by [APIGen](https://arxiv.org/abs/2406.18518) and large-scale [Skill-Use Training](https://arxiv.org/abs/2608.02287).

Do not use hidden or free-form chain-of-thought as correctness evidence.

### 6. Produce skill-free training records

For every assistant decision, create one record containing the complete observable prefix:

```text
system
user
assistant tool call
tool result
assistant tool call
tool result
...
next assistant action ← sole training completion
```

Rules:

- Remove the teacher-only `SKILL.md` payload.
- Retain exact tool definitions.
- Preserve causal ordering: tool call before tool result.
- Train on assistant tokens only.
- Render every record through the pinned model chat template.
- Reject records without exactly one non-empty assistant loss span.

### 7. Train

Start with:

- **Base:** [`Qwen/Qwen3-4B-Instruct-2507`](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507)
- **Method:** QLoRA
- **Runtime:** [MLX-LM](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md)
- **Artifact:** one independent adapter per skill
- **Selection:** behavioral dev score, not training loss

The model is 4B, Apache-2.0, non-thinking, tool-capable, and MLX-supported. Apple reports 3.35GB q4 inference memory on a 64GB M4 Max for a narrow 2,048-prompt/128-generation benchmark ([benchmark](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/BENCHMARKS.md)); that is not a training-memory guarantee.

Train nested verified-data subsets and graph behavior score. Do not assume a universal example count.

If the student reaches states missing from teacher data:

1. Run the student.
2. Capture those states.
3. Ask teacher+skill for corrected continuations.
4. Verify them.
5. Remove the skill payload.
6. Continue ordinary SFT.

This is simpler and more compatible than introducing an on-policy distillation system.

## Scoring

Prefer objective outcomes:

- filesystem or database state;
- parsers and schemas;
- executable tests;
- required structured fields;
- tool execution success.

This matches state-oriented agent evaluation in [τ-bench](https://arxiv.org/abs/2406.12045) and [ToolSandbox](https://arxiv.org/abs/2408.04682).

Use LLM judges only for subjective quality. Blind model identity, swap answer order, and calibrate against human labels because judges exhibit position, verbosity, and self-preference biases ([MT-Bench study](https://arxiv.org/abs/2306.05685)).

Report:

- task success by behavior category;
- trigger precision/recall;
- invalid tool-call rate;
- repeated-run reliability;
- p50/p95 latency;
- input/output tokens;
- peak memory;
- general retention.

Analyze paired task differences with 95% family-clustered confidence intervals. Pairing and clustering avoid false precision ([Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640)).

## Release gates

Release only when:

1. **Adaptation worked:** lower confidence bound of `S2 - S0` is above zero.
2. **Skill mattered:** development control shows `S2 - C2` above zero.
3. **Weights beat prompting:** `S2` beats `S1`, or is quality-non-inferior while clearing a predeclared token or latency improvement.
4. **Model replaces the original skill:** `S2` is non-inferior to `T1` within a predeclared margin and improves deployment cost.
5. **Quality truly improved, if required:** lower confidence bound of `S2 - T1` is above zero.
6. **No hidden regression:** every core behavior category and retention suite remains within its declared margin.

Do not combine quality, latency, and cost into one weighted score. Report the trade-off directly.

**Bottom line:** the credible first implementation is a Qwen3-4B skill-specific QLoRA adapter trained from verified, skill-conditioned executions, while retaining the skill’s executable dependencies externally. The sealed `T1` versus `S2` comparison determines whether the custom model genuinely improves on the original `SKILL.md` system.
