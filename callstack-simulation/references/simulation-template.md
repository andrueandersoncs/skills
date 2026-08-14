# Simulation Report Template

Use this compact structure by default. Replace placeholders, omit optional sections when empty, and keep each frame to one line unless a material decision needs one short note.

```markdown
# Simulation: <target or entry point>

- **Scenario:** <concrete inputs or named symbolic scenario>
- **Status:** <complete | partial | blocked>
- **Execution:** Dry run only; no target operation or side effect was performed.

## Callstack

`<entry-point>(<arguments>)` → <outcome>
├─ `<first-callee>(<arguments>)` → <outcome>
│  └─ branch: `<condition>` → `<selected path>` <uncertainty marker when needed>
└─ `<second-callee>(<arguments>)` → <return | throw | blocked | truncated>
   └─ `<nested-callee>(<arguments>)` → <outcome>

## Alternative paths

- `<branch>` → <different continuation and outcome> <linked uncertainty>

## Assumptions and uncertainties

- `U1` · <kind> · <operation or frame ID>: <detail> → <effect>
```

Write `None` when the uncertainty ledger is empty. Omit **Alternative paths** when no unresolved branch materially changes the result. Add **Limits** to the header only when controls are nondefault or truncation occurs.

## Trace notation

- One line represents one frame; indentation represents caller/callee nesting, and siblings remain in execution order.
- `→` gives that frame's outcome: return value, throw, blocked reason, or truncation limit.
- Keep hierarchical frame IDs internally; display one only when repeated calls need disambiguation or an uncertainty needs an exact ledger link.
- Use one indented note only for a material branch, state change, intended side effect, or uncertainty.
- Link unsupported behavior with `[assumption U<n>]` or `[unknown U<n>]`; source-defined behavior needs no marker in compact mode.
- Render spawned concurrent work as a separate `S<n>` root and show a join only when the target guarantees one.

For `expanded` detail, add concise `enter`, `step`, or `state` notes beneath the relevant frame. Do not duplicate routine information, and do not change frame IDs or outcomes.
