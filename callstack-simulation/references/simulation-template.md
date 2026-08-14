# Simulation Report Template

Use this compact structure by default. Replace placeholders and omit optional sections when empty. Render each frame as one call line without an appended or separate outcome annotation. Put exactly one spacer line between every callstack line, including notes, and fill each spacer with `│` guides wherever a call branch continues below.

```markdown
# Simulation: <target or entry point>

- **Scenario:** <concrete inputs or named symbolic scenario>
- **Status:** <complete | partial | blocked>
- **Execution:** Dry run only; no target operation or side effect was performed.

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

Write each finite alternative directly in the relevant conditional block. Do not add a separate assumptions, ambiguities, or uncertainties section, and do not add reference markers for symbolic values or unsupported behavior. Conditional cases must use ordered `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>` clauses on separate lines. Omit nonexistent clauses, and place a long or nested case on the next indented line. Never use a `branch:` label, arrows, or comma-separated pattern-to-case mappings. Add **Limits** to the header only when controls are nondefault or truncation occurs.

## Trace notation

- A bold operation line represents one frame; indentation represents caller/callee nesting, and siblings remain in execution order.
- Render no `outcome:` line and do not append an outcome to an operation line.
- Put exactly one spacer line between every callstack line, including frame-to-note and note-to-note transitions. On the spacer, render `│` at each indentation column whose call branch continues below and spaces where a branch has ended.
- Identify frames by their operation names and nesting; do not generate or display numeric frame IDs. Distinguish repeated calls by their arguments or call path when needed.
- Use one indented note or conditional block only for a material condition, state change, intended side effect, blocker, truncation, or error. A conditional block may contain multiple `if`/`else if`/`else` clause lines.
- Render spawned concurrent work as a separate operation-named root and show a join only when the target guarantees one.

For `expanded` detail, add concise `enter`, `step`, or `state` notes beneath the relevant frame. Do not duplicate routine information, add outcome annotations, or add generated frame IDs.
