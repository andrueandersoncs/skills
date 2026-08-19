# How task fields are used

Each field in the [complete task format](./definition.md#the-most-complete-practical-task-format) supports a specific task-management operation. A field only needs a value when that operation applies to the task.

| Field | Process that checks or uses it | What the process does |
| --- | --- | --- |
| **Task** | Intake and task-quality check | Confirms the title starts with an action, names a specific object, and represents one coherent piece of work. It is then used as the task's primary label in lists and boards. |
| **Outcome** | Goal-alignment check | Confirms the result contributes to a worthwhile objective. It is used to resolve scope questions and judge whether the completed work produced the intended result. |
| **Definition of done** | Completion verification | Supplies the observable checklist used during review. The task moves to **Done** only when these conditions are true. |
| **Owner** | Assignment and accountability | Routes the task to one person and identifies who is responsible for moving it forward, reporting blockers, and closing it. |
| **Due** | Deadline monitoring | Places genuine deadlines on the deadline view and triggers reminders or escalation as the required completion time approaches. |
| **Scheduled** | Work planning | Reserves the intended work period on a calendar or plan. During daily planning, the owner uses it to decide what to work on now. |
| **Priority** | Triage | Ranks competing tasks by value and consequence. The reason attached to the level is used when two tasks compete for time. |
| **Next action** | Readiness check and execution | Confirms there is an immediately performable first step. Once work begins, it tells the owner exactly where to start. |
| **Context** | Handoff and execution | Gives the owner the decisions, constraints, instructions, and links needed to act without reopening the original conversation. |
| **Inputs** | Preflight readiness check | Confirms required documents, data, access, people, and approvals are available before the task is treated as **Ready**. |
| **Dependencies** | Sequencing and blocker management | Prevents dependent work from starting prematurely. Unmet dependencies move the task to **Blocked**; their completion makes it eligible for **Ready**. |
| **Effort** | Capacity planning | Estimates how much available time or capacity the task will consume so it can be scheduled realistically. |
| **Status** | Workflow control | Places the task in **Not started**, **Ready**, **In progress**, **Blocked**, **In review**, or **Done** and drives the allowed next workflow step. |
| **Review or follow-up** | Resurfacing and escalation | Creates the date or condition for reconsidering an unfinished, waiting, or blocked task so it does not disappear. |
| **Tags** | Routing, filtering, and reporting | Groups the task by project, area, client, location, skill, or work type so the right views and reports can retrieve it. |

## End-to-end workflow

| When this pattern appears | Match against | Result |
| --- | --- | --- |
| New work is captured | **Task**, **Outcome**, **Definition of done**, **Context** | The commitment and intended result are clear enough to evaluate. |
| Accountability is needed | **Owner** | One person is responsible for moving and closing the task. |
| Readiness is being determined | **Inputs**, **Dependencies**, **Next action** | The task is **Ready** when its requirements are available, blockers are cleared, and an immediate action is known. |
| Work is being planned | **Due**, **Priority**, **Effort**, **Scheduled** | The task receives a realistic work time based on its deadline, value, and size. |
| Work is active | **Next action**, **Context**, **Status** | The owner knows what to do and the workflow reflects current progress. |
| Work is waiting or blocked | **Dependencies**, **Review or follow-up**, **Status** | The task resurfaces when the blocking condition changes or its review point arrives. |
| Work is presented as complete | **Definition of done**, **Outcome**, **Status** | The task becomes **Done** only when its completion conditions and intended result are satisfied. |
| Work must be grouped or found | **Tags** | The task appears in the relevant lists, views, and reports. |
