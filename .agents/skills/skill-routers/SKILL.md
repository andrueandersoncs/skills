---
name: skill-routers
description: Design, implement, or audit a router that selects one agent-skill workflow.
---

# Skill Routers

An agent skill router is a `SKILL.md` whose behavior selects one agent-skill component or leaf. The complete model and example are preserved in [`references/canonical-design.md`](references/canonical-design.md).

## Routing state

- **Current state:** Facts established by available evidence about the router, route table, leaves, implementation, and review.
- **Desired state:** The observable router result requested by the user.

## Route

Select the first matching row. Row order is the only precedence rule.

| Current state | Desired state | Result |
| --- | --- | --- |
| Any | A result outside explaining, designing, implementing, or independently auditing an agent skill router | Not this router |
| Current evidence already satisfies the requested result | That same satisfied state | Done |
| Any in-scope state | An explanation, design, redesign, or explicit route table | [`design-skill-router`](references/design-skill-router/SKILL.md) |
| An explicit route table or complete leaf contract is missing | An implemented or independently audited router | [`design-skill-router`](references/design-skill-router/SKILL.md) |
| An explicit route table and complete leaf contracts exist, but the implementation has not been proven current against them | An implemented or independently audited router | [`implement-skill-router`](references/implement-skill-router/SKILL.md) |
| The implementation is proven current against the explicit route table and complete leaf contracts | An independent audit or verdict | [`review-skill-router`](references/review-skill-router/SKILL.md) |

Load exactly one selected reference and treat it as the active skill. A request to combine stages does not change their dependency order; select only the earliest missing owner.

After the leaf completes, update current state from its evidence. Stop when current state satisfies desired state; otherwise route again with the same desired state. Selecting the same leaf again without a state change means its result is incomplete or the route is defective.
