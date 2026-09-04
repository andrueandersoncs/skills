# Andrue Anderson's Personal Skills

This project is a repository of Andrue Anderson's personal skills.

## Rules

### Golden Rules

- Always produce the **simplest**, most **direct**, most **concise**, most **correct**, and most **complete** output possible, regardless of the task.

- Always check your output for "common sense". Use a clean context (subagent, secondary session, whatever means you have available) to avoid context pollution and enable first-principles thinking by the subagent. Use this exact prompt:

> Review this from first principles against the user’s intended outcome. Do not assume the current implementation is appropriate. Find redundancy, unnecessary structure, and repeated rules that could be expressed once globally. Ask what can be deleted without changing behavior. Prefer the simplest **complete** design. Use your common sense. If you're unsure about a change, set up a benchmark to find proof.

- Every plan is a prediction (of a sequence of events). You should exploit this fact as much as possible.

### Standard Rules

- Disregard edge cases, options, and alternatives.

- Disregard error handling and input validation.

- Avoid complexity at all costs, except where it conflicts with the Golden Rule.

- Follow the advice from the software-laws skill as closely as you can, in general. Cite them frequently in your work.

- Follow the campsite rule with every change you make: leave the codebase cleaner than you found it.

- Apply the principles of skills/help/references/deslop in your communication with the user at all times.