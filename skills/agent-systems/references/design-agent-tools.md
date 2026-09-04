# Design Agent Tools

Design the interface around the agent's goal, not the underlying API. A tool should expose one legible capability with faithful parameters, useful feedback, and enforceable boundaries.

## Method

1. Classify the need as perception, execution, or agent collaboration control.
2. Write the agent goal and the evidence that confirms success.
3. Prefer a general executor or skill when composition is enough. Create a dedicated tool for high-frequency actions, complex parameter sets, platform adaptation, permissions, security, or audit requirements.
4. Define the contract:
   - When to use it.
   - Boundaries, required inputs, their exact meaning, and concrete parameter examples.
   - Side effects, cost, and authorization.
   - Structured result, pagination, and explicit truncation.
   - Observable evidence of completion.
5. Preserve parameter fidelity. Do not silently rewrite, infer, or inject values.
6. Use a small stable catalog plus hierarchical discovery. Load schemas once and expose specialized tools on demand.
   - Use MCP to standardize callable tools and resources across clients.
   - Use a skill to teach when and how to combine tools through a procedure.
7. Wrap execution in validate, authorize, execute, observe, and independently verify.
8. Make mutations idempotent when possible. Query state before retrying side effects.
9. Sandbox dynamic code and third-party tools; pin versions, review their instructions, and apply least privilege.

## Tool feedback

- Return enough raw evidence for the model to correct itself.
- Store large outputs outside context and return a reference plus summary.
- Re-observe the environment after actions.
- Verify through another modality when practical: state after a click, rendered output after code, query after a write.

Tool abstractions leak. State latency, consistency, authorization, and failure semantics instead of hiding them behind a uniform name.

Source: *Building AI Agents*, Chapter 4, “Agent Tools.”
