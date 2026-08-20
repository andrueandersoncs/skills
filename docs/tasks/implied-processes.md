# Implied task-management processes

The fields in [How task fields are used](./field-usage.md) collectively imply six processes.

1. **Define the work** — Capture the task, intended outcome, completion criteria, and context. Check that the work is clear, coherent, and worthwhile.
2. **Prepare the work** — Assign one owner, confirm the inputs, clear dependencies, and identify the next action. The task is then **Ready**.
3. **Plan the work** — Set its priority, estimate its effort, account for its deadline, and reserve time to do it.
4. **Execute and control the work** — The owner starts with the next action, uses the context, updates the status, and reports blockers. Work resumes when its blockers clear.
5. **Review and close the work** — Compare the result with the definition of done and outcome. Mark it **Done** only when both are satisfied.
6. **Monitor and organize the work** — Resurface waiting work, monitor deadlines and dependencies, trigger reminders or escalation, and use titles and tags to populate views and reports.

## Status flow

```text
┌─────────────┐     ┌───────┐     ┌─────────────┐     ┌───────────┐     ┌──────┐
│ Not started │────▶│ Ready │────▶│ In progress │────▶│ In review │────▶│ Done │
└─────────────┘     └───┬───┘     └──────┬──────┘     └───────────┘     └──────┘
                        │                │
                        └───────┬────────┘
                                ▼
                          ┌─────────┐
                          │ Blocked │
                          └────┬────┘
                               │
                               └──────────────────────▶ Ready
```

A task becomes **Ready** when its inputs are available, its dependencies are cleared, and its next action is known. A blocked task returns to **Ready** when its blocking conditions clear. A task becomes **Done** only after its definition of done and outcome are satisfied.

## Assumed roles

The processes imply several roles without defining them:

- **Task creator** — captures and clarifies the work.
- **Owner** — performs the work, maintains its status, reports blockers, and closes it.
- **Planner or triage role** — prioritizes and schedules the work.
- **Reviewer** — accepts completed work or returns it.
- **Monitoring system or coordinator** — checks deadlines, dependencies, and follow-up conditions.

Someone must also keep **Status**, **Next action**, **Dependencies**, and **Scheduled** current as circumstances change.
