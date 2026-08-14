# Simulation Report Template

Use this compact structure by default. Replace placeholders, omit optional sections when empty, and put every frame's expected happy-path outcome on the immediately following indented line beneath its call. An outcome contains only the expected successful result; keep exceptions, blockers, and truncation in conditional notes. Do not insert a spacer inside a call/outcome pair. Put exactly one spacer line between every other callstack line, including notes, and fill each spacer with `│` guides wherever a call branch continues below.

```markdown
# Simulation: <target or entry point>

- **Scenario:** <concrete inputs or named symbolic scenario>
- **Status:** <complete | partial | blocked>
- **Execution:** Dry run only; no target operation or side effect was performed.

## Callstack

**entry-point**(arguments)
├─ **outcome**: <expected successful result>
│
├─ **first-callee**(arguments)
│  ├─ **outcome**: <expected successful result>
│  │
│  ├─ if (first pattern): <first case>
│  │
│  ├─ else if (second pattern): <second case>
│  │
│  └─ else: <fallback case>
│
└─ **second-callee**(arguments)
   ├─ **outcome**: <expected successful result>
   │
   └─ **nested-callee**(arguments)
      ├─ **outcome**: <expected successful result>
      │
      └─ if (failure condition): throws <error>
```

Write each finite alternative directly in the relevant conditional block. Do not add a separate assumptions, ambiguities, or uncertainties section, and do not add reference markers for symbolic values or unsupported behavior. Conditional cases must use ordered `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>` clauses on separate lines. Omit nonexistent clauses, and place a long or nested case on the next indented line. Never use a `branch:` label, arrows, or comma-separated pattern-to-case mappings. Add **Limits** to the header only when controls are nondefault or truncation occurs.

## Trace notation

- A bold operation line represents one frame; indentation represents caller/callee nesting, and siblings remain in execution order.
- The line immediately beneath each operation is its outcome annotation, formatted as `**outcome**: <expected successful result>`. It describes only the frame's expected happy-path result rather than representing an executable statement or claiming that the result was reached.
- Never put a throw, error, blocker, truncation, or alternative failure result in the outcome annotation; show a material exceptional path in a conditional note.
- Never append an outcome to an operation line with a colon.
- Do not put a spacer between an operation line and its outcome line. Put exactly one spacer line between every other callstack line, including outcome-to-note and note-to-note transitions. On the spacer, render `│` at each indentation column whose call branch continues below and spaces where a branch has ended.
- Identify frames by their operation names and nesting; do not generate or display numeric frame IDs. Distinguish repeated calls by their arguments or call path when needed.
- Use one indented note or conditional block only for a material condition, state change, or intended side effect. A conditional block may contain multiple `if`/`else if`/`else` clause lines.
- Render spawned concurrent work as a separate operation-named root and show a join only when the target guarantees one.

For `expanded` detail, add concise `enter`, `step`, or `state` notes beneath the relevant frame. Do not duplicate routine information or add generated frame IDs, and do not change outcomes.
