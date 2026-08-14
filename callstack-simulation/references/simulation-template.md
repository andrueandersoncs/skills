# Simulation Report Template

Use the following structure and replace its placeholders:

```markdown
# Simulation: <target or entry point>

- **Scenario:** <concrete inputs or named symbolic scenario>
- **Status:** <complete | partial | blocked>
- **Execution:** Dry run only; no target operation or side effect was performed.
- **Limits:** <nondefault controls or truncation>

## Callstack

**entry-point**(arguments)
│
├─ **first-callee**(arguments)
│  │
│  ├─ if (first pattern): <first case>
│  │
│  ├─ else if (second pattern): <second case>
│  │
│  └─ else: <fallback case>
│
└─ **second-callee**(arguments)
   │
   └─ **nested-callee**(arguments)
      │
      └─ if (failure condition): throws <error>
```

## Rendering rules

- In compact detail, represent a frame as `**operation**(arguments)`. Indentation shows caller/callee nesting; sibling order shows execution order. Distinguish repeated calls by arguments or call path. Do not add numeric frame IDs, routine return values, outcome annotations, or routine enter, exit, step, resume, unchanged-state, and source-marker text.
- Do not enclose the complete caller string in backticks or retain placeholder angle brackets around operation names or arguments.
- Put exactly one spacer line between all rendered callstack lines, including notes and conditional clauses. On that spacer, place `│` at each indentation column whose call branch continues below and spaces where it has ended.
- Beneath a frame, include at most one short note or conditional block, limited to a material condition, state change, intended side effect, blocker, truncation, or error.
- Write conditional clauses in source order on separate lines as `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>`, omitting nonexistent clauses. Move a long or nested case to the next indented line. Never use a `branch:` label or arrow- or comma-separated pattern mappings.
- Show alternative continuations inline only when unresolved conditions materially change the result.
- Represent spawned concurrent work as a separate operation-named root; include a join only when the target guarantees one.
- Expanded detail may additionally include concise entry values and ordered `enter`, `step`, or `state` notes; all other rules still apply.
- Do not add assumptions, ambiguities, uncertainties, reference markers for symbolic values or unsupported behavior, or post-report completion metadata. Include **Limits** only for nondefault controls or truncation.
