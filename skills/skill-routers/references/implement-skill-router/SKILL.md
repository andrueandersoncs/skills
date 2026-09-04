---
name: implement-skill-router
description: Implement a defined agent-skill route table as a thin root SKILL.md and independent reference leaves. Use when the route table and leaf contracts are explicit and repository files should be created or changed.
---

# Implement Skill Router

Read [`../canonical-design.md`](../canonical-design.md) before editing.

## Inputs

- The explicit ordered route table and re-entry rule
- The complete leaf contracts
- The target skill directory and applicable repository conventions
- Existing router files and required source material when present

## Method

1. Inspect the target, configured skill roots, related skills, and repository validation commands. Preserve unrelated work.
2. Create or update the top-level `SKILL.md` with matching frontmatter, a positive discovery description, the ordered route table, and one re-entry rule.
3. Create every selected component at `references/<leaf-name>/SKILL.md`. Give each leaf its own frontmatter, inputs, method, output, and `## Done` contract.
4. Keep classification and sequencing in the root. Keep execution and completion evidence in leaves. Remove leaf `## Next` sections and duplicate routing rules.
5. Link every leaf directly from the root. Keep required standards, examples, and verbatim source material in linked one-hop references.
6. Complete the cutover inside the target: migrate callers and remove obsolete routes, aliases, duplicated rules, and dead references.
7. Exercise at least three positive routes, two adjacent negative routes, the already-done terminal, and one adversarial combined-stage request in fresh context.
8. Validate frontmatter names, reference paths, exactly-one selection, terminal behavior, absence of state-free routing loops, and actual host discovery when available.

## Output

The implemented router, changed paths, routing-scenario results, and structural validation evidence.

## Done

The root and every leaf exist at their defined paths, all links resolve, each pressure case selects the specified single result, the host discovers the root for its intended cues without stealing adjacent work, and no obsolete routing path remains.