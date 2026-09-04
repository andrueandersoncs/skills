A perfect skill router is an **ordered state-transition table plus one re-entry rule**.

```text
route(current state, desired state) → one leaf skill
leaf completes → update current state → route again
```

## Core rules

1. **Route on observable states, not keywords.**
   - Current: what is already known, accepted, implemented, broken, reviewed, or verified.
   - Desired: the observable result the user wants.

2. **Select exactly one leaf.**
   - The router owns selection.
   - The leaf owns execution and proof.
   - Multiple matches indicate overlapping skill boundaries.

3. **Use first-match ordering as the only precedence system.**

4. **Preserve the desired state across transitions.**
   - If implementation requires a contract first, route to contract design.
   - Afterward, reroute toward the original desired result.

5. **Allow two terminal results.**
   - `done`: current state already satisfies desired state.
   - `not this router`: desired state is outside the router’s domain.

6. **Keep completion rules in leaves.**
   - The router should not duplicate each leaf’s `## Done` contract.
   - Leaves should not contain `## Next`; routing remains centralized.

7. **Avoid overlays and simultaneous owners.**
   - Pass domain concerns as context to the selected leaf.
   - If coordination is necessary, route to one coordinator leaf.

## Ideal structure

```text
software-craft/
├── SKILL.md
└── references/
    ├── define-work/SKILL.md
    ├── design-contract/SKILL.md
    ├── implement-change/SKILL.md
    ├── diagnose-problem/SKILL.md
    ├── review-change/SKILL.md
    └── verify-change/SKILL.md
```

## Ideal router

```markdown
---
name: software-craft
description: Route software work to the single workflow that owns the next necessary state change. Use when creating, changing, diagnosing, reviewing, verifying, or shipping software.
---

# Software Craft

Choose the first matching route.

`Current state` means facts supported by available evidence.
`Desired state` means the observable result requested by the user.

## Terminal routes

| Desired state | Current state | Result |
| --- | --- | --- |
| Outside software work | Any | Not this router |
| Any in-scope result | Current evidence already satisfies it | Done |

## Routes

| Desired state | Current state | Skill |
| --- | --- | --- |
| Completed reusable agent skill | Any | [`author-agent-skill`](references/author-agent-skill/SKILL.md) |
| Durable repository map | Map is absent or stale | [`map-codebase`](references/map-codebase/SKILL.md) |
| Evidence-backed external answer | Required current facts are missing | [`research-evidence`](references/research-evidence/SKILL.md) |
| Accepted testable outcome | Consequential intent or success criteria are unclear | [`define-work`](references/define-work/SKILL.md) |
| Empirical decision | A cheap runnable experiment can resolve it | [`prototype-options`](references/prototype-options/SKILL.md) |
| Stable contract or downstream result | Required public behavior or invariants are undefined | [`design-contract`](references/design-contract/SKILL.md) |
| Executable implementation plan | Outcome is accepted but dependency order is absent | [`plan-change`](references/plan-change/SKILL.md) |
| Working, reviewed, verified, or shipped behavior | An unexplained failure currently blocks it | [`diagnose-problem`](references/diagnose-problem/SKILL.md) |
| Performance budget met | The miss and owning cost are measured | [`optimize-system`](references/optimize-system/SKILL.md) |
| Working, reviewed, verified, or shipped behavior | Required behavior is not implemented | [`implement-change`](references/implement-change/SKILL.md) |
| Independent judgment | A reviewable artifact exists | [`review-change`](references/review-change/SKILL.md) |
| Freshly proven claim | The claim exists but sufficient proof does not | [`verify-change`](references/verify-change/SKILL.md) |
| Integrated or deployed result | Verified work exists but delivery is incomplete | [`ship-change`](references/ship-change/SKILL.md) |

Load exactly one selected reference and treat it as the active skill.

After it completes:

1. Update the current state using its completion evidence.
2. Stop if the desired state is satisfied.
3. Otherwise route again with the same desired state.
4. If the same skill is selected without any state change, report an incomplete leaf result or defective route.
```

## Ideal leaf contract

```markdown
---
name: implement-change
description: Implement an accepted software behavior using repository-native conventions.
---

# Implement Change

## Inputs

The accepted behavior, relevant repository evidence, and applicable constraints.

## Method

1. ...
2. ...
3. ...

## Output

Working behavior and the evidence produced while implementing it.

## Done

The behavior works through its real entry point and obsolete paths are removed.
```

Every leaf needs:

- Minimum input state
- One cohesive procedure
- Observable output
- Exact completion evidence
- No knowledge of sibling routing
- No duplicated global rules

## Pressure tests

| Request | Route |
| --- | --- |
| “Fix the checkout crash.” | `diagnose-problem` |
| “Review the PR that fixes the checkout crash.” | `review-change` |
| “Search is 900 ms against a 200 ms budget; profiling found N+1 queries.” | `optimize-system` |
| “Turn these recurring prompts into a reusable router.” | `author-agent-skill` |
| “Explain idempotency.” | Not this router |

The current `skills/software-craft/SKILL.md` is close: its single-owner and rerouting rules are strong. The main simplification would be adding **desired state** directly to the table, making row order authoritative, and removing the separate precedence/overlay systems. This follows the `software-laws` guidance: use the smallest complete system and keep abstractions understandable.