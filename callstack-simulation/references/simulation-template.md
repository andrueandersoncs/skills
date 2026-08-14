# Simulation Report Template

Use this compact structure by default. Replace placeholders, omit optional sections when empty, keep each frame to one line unless a material decision needs one short note or conditional block, and put exactly one spacer line between every callstack line, including notes. Fill each spacer with `│` guides wherever a call branch continues below.

```markdown
# Simulation: <target or entry point>

- **Scenario:** <concrete inputs or named symbolic scenario>
- **Status:** <complete | partial | blocked>
- **Execution:** Dry run only; no target operation or side effect was performed.

## Callstack

**entry-point**(arguments): <outcome>
│
├─ **first-callee**(arguments): <outcome>
│  │
│  ├─ if (`<first pattern>`): <first case> <uncertainty marker when needed>
│  │
│  ├─ else if (`<second pattern>`): <second case> <uncertainty marker when needed>
│  │
│  └─ else: <fallback case> <uncertainty marker when needed>
│
└─ **second-callee**(arguments): <return | throw | blocked | truncated>
   │
   └─ **nested-callee**(arguments): <outcome>

## Alternative paths

if (`<first pattern>`): <different continuation and outcome> <linked uncertainty>
else if (`<second pattern>`): <different continuation and outcome> <linked uncertainty>
else: <fallback continuation and outcome> <linked uncertainty>

## Assumptions and uncertainties

- `U1` · <kind> · <operation or call path>: <detail> → <effect>
```

Write `None` when the uncertainty ledger is empty. Omit **Alternative paths** when no unresolved condition materially changes the result. Conditional cases must use ordered `if (<pattern>): <case>`, `else if (<pattern>): <case>`, and `else: <case>` clauses on separate lines. Omit nonexistent clauses, and place a long or nested case on the next indented line. Never use a `branch:` label, arrows, or comma-separated pattern-to-case mappings. Add **Limits** to the header only when controls are nondefault or truncation occurs.

## Trace notation

- One line represents one frame; indentation represents caller/callee nesting, and siblings remain in execution order.
- Put exactly one spacer line between all callstack lines, including frame lines and indented note lines. On the spacer, render `│` at each indentation column whose branch continues below and spaces where a branch has ended.
- `:` gives that frame's outcome: return value, throw, blocked reason, or truncation limit.
- Identify frames by operation name and nesting; do not generate or display numeric frame IDs. Distinguish repeated calls by their arguments or call path when needed.
- Use one indented note or conditional block only for a material condition, state change, intended side effect, or uncertainty. A conditional block may contain multiple `if`/`else if`/`else` clause lines.
- Link unsupported behavior with `[assumption U<n>]` or `[unknown U<n>]`; source-defined behavior needs no marker in compact mode.
- Render spawned concurrent work as a separate operation-named root and show a join only when the target guarantees one.

For `expanded` detail, add concise `enter`, `step`, or `state` notes beneath the relevant frame. Do not duplicate routine information or add generated frame IDs, and do not change outcomes.
