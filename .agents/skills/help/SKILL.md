---
name: help
description: Gather the available task context and route a request to exactly one specialist skill. Use as the single entry point for writing, creativity, planning, product, project, wiki, workflow, Grok Bot, agent-skill, software-law, and software work.
---

# Help

Gather the available context, identify the observable result the user wants, and select one owner.

- **Current state:** Facts established by the request, supplied artifacts, referenced paths, repository or runtime evidence, and prior results.
- **Desired state:** The observable result requested by the user.
- **Request context:** Domain, artifact, audience, technology, and constraints passed to the selected skill without becoming additional owners.

Read available evidence before asking the user. If the evidence cannot distinguish two routes, ask one short question whose answer changes the selected result, then route again.

Choose the first matching row. Row order is the only precedence rule.

| Current state | Desired state | Result |
| --- | --- | --- |
| Any | A result not owned by a skill below | Not this router |
| Current evidence already satisfies the requested result | That same satisfied state | Done |
| Any | An agent-skill-router explanation, design, implementation, or independent audit | [`skill-routers`](references/skill-routers/SKILL.md) |
| Any | A small skill-specific LoRA and sealed comparison with its source skill | [`distill-skill-to-model`](references/distill-skill-to-model/SKILL.md) |
| Any | A Grok Bot, bot skill, routine, roster, autonomy policy, handoff, or template result | [`grok-bot`](references/grok-bot/SKILL.md) |
| Any | A persistent Git-backed LLM wiki setup, ingest, query, lint, or compaction result | [`llm-wiki`](references/llm-wiki/SKILL.md) |
| Multiple owned tasks need durable state across blockers, asynchronous events, review, or resumption | A managed project result and durable project record | [`manage-project`](references/manage-project/SKILL.md) |
| Any | A testable forecast-policy, estimate, plan, proposal, roadmap, or strategy with probabilities and response rules | [`predictive-planning`](references/predictive-planning/SKILL.md) |
| Any | A durable product record, capability, feature, journey, requirement, release, product roadmap, discovery record, or AI opportunity assessment | [`product-management`](references/product-management/SKILL.md) |
| Any | A source-grounded nonexecuting callstack trace, state-machine projection, or both | [`workflows`](references/workflows/SKILL.md) |
| Any | Technical documentation created, restructured, reviewed, or audited for one reader need | [`technical-documentation`](references/technical-documentation/SKILL.md) |
| Existing prose is available | Prose edited or audited for AI-writing patterns while preserving meaning and voice | [`deslop`](references/deslop/SKILL.md) |
| Any | An explanation or case assessment grounded in established software laws | [`software-laws`](references/software-laws/SKILL.md) |
| Any | A distinctive creative concept, prompt, design direction, name, narrative, or other artifact judged by novelty and taste | [`elicit-llm-creativity`](references/elicit-llm-creativity/SKILL.md) |
| Any | Working, diagnosed, reviewed, verified, shipped, or evidence-backed executable software, infrastructure, library, service, or single-workflow agent skill | [`software-craft`](references/software-craft/SKILL.md) |

Load exactly one selected skill and treat it as active. It owns execution and completion evidence.

After it completes, update current state from its evidence. Stop when current state satisfies desired state; otherwise route again with the same desired state. If the same skill is selected without a state change, report an incomplete skill result or defective route.
