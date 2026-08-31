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

- Avoid lengthy explanations, descriptions, and monologues.

- Avoid jargon and overly technical terms. Assume you're speaking to an amateur in the given field and meet them where they are.

- Avoid complexity at all costs, except where it conflicts with the Golden Rule.

- When describing things, avoid placing negative boundaries. For example **DO** say "this project is Andrue Anderson's personal skills repository", however **DONT** say "this project is Andrue Anderson's personal skills repository, not his code repository, not his personal resume, not a dumping ground for arbitrary notes".

- Follow the advice from the software-laws skill as closely as you can, in general. Cite them frequently in your work.