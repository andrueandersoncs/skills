---
name: define-task
description: Turn a request, goal, or commitment into a clear, executable AI-agent task record with an observable outcome, definition of done, owner, readiness state, and next action. Use when asked to define, capture, write, formalize, or prepare a task for an AI agent or task-management workflow.
---

# Define Task

Define the work without executing it. Apply the task format in [`references/definition.md`](references/definition.md) and the AI-agent operating rules in [`references/ai-agent-processes.md`](references/ai-agent-processes.md).

## Inputs

1. **Source request:** The request, goal, event, or commitment to define.
2. **Source material:** Linked files, instructions, decisions, constraints, and environment details.

## Output

One complete task record for each coherent result, using the exact field order in the output template below.

## Procedure

### 1. Interpret the result

1. Read the source request and relevant source material.
2. Write **Task** as an action verb, a specific object, and the qualifier that distinguishes the work.
3. Keep one independently completable result per task. Create separate task records when the request contains independent results.
4. Write **Outcome** as the practical effect the completed work must create.
5. Write **Definition of done** as a finite checklist of observable pass-or-fail conditions. Include required artifacts, behavior, evidence, delivery, and approval.
6. Put governing instructions, constraints, decisions, source locations, and environment facts in **Context**. Reference authoritative text instead of restating it.
7. Ask only for information whose absence prevents a correct definition. Otherwise record the known facts without inventing requirements.

### 2. Prepare the task

1. Assign exactly one accountable **Owner**. A task cannot be **Ready** until that owner accepts it.
2. List every required **Input**, including files, data, repositories, services, credentials, tools, people, and approvals.
3. Perform the smallest useful access check for each required input, tool, permission, runtime, working directory, and output location. Do not begin execution.
4. List each **Dependency** as a condition that must be true before execution. Record external work by its required result, not only by a job or agent name.
5. Write **Next action** as one concrete operation that can start without more planning. Begin with a verb and name its target.
6. Ensure the record contains enough persistent context for another agent to perform the next action without the original conversation.

### 3. Add planning facts

1. Set **Due** only from a genuine deadline.
2. Set **Priority** relative to competing work and include the reason.
3. Estimate **Effort** in a practical capacity unit when planning requires it.
4. Set **Scheduled** only when work time has been reserved.
5. Add **Tags** only when they improve routing or retrieval.

### 4. Set the current status

- Set **Ready** only when the task, outcome, and definition of done are clear; one owner has accepted accountability; all inputs and dependencies are available; required tools, permissions, and environment are usable; the context is sufficient; and the next action can run now.
- Set **Blocked** when an unavailable condition prevents progress. Name it in **Dependencies** and state the exact time or observable event for rechecking it in **Review or follow-up**.
- Set **Not started** while definition or preparation is incomplete and execution has never begun.

Do not use **In progress**, **In review**, or **Done** for newly defined work. Dates, priority, intent, and agent activity do not determine status.

### 5. Check the definition

Before returning the task, confirm that an agent without the original conversation can identify:

1. The result to produce.
2. Why it matters.
3. The observable evidence that proves completion.
4. The governing instructions and source material.
5. The first executable action or the exact blocker and resume trigger.

Use blank optional fields when they were checked and do not apply. A blank field in a **Not started** task can mean it remains unassessed.

## Output Template

```text
TASK
[Verb + specific object + distinguishing qualifier]

OUTCOME
[Practical effect]

DEFINITION OF DONE
- [Observable pass-or-fail condition]

OWNER
[One accountable owner]

DUE
[True deadline or blank]

SCHEDULED
[Reserved execution time or blank]

PRIORITY
[Relative level — reason]

NEXT ACTION
[One concrete operation]

CONTEXT
[Instructions, constraints, decisions, sources, environment, and access evidence]

INPUTS
[Required available inputs or blank]

DEPENDENCIES
[Required preceding conditions or blank]

EFFORT
[Capacity estimate or blank]

STATUS
[Not started / Ready / Blocked]

REVIEW OR FOLLOW-UP
[Resume time or event; required when Blocked]

TAGS
[Routing labels or blank]
```
