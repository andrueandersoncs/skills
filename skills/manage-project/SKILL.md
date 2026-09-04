---
name: manage-project
description: Manage a multi-task agent project when coordination must resume across owners, blockers, or asynchronous events.
---

# Manage Project

Use `andrue-cli manage-project` when a project spans independently completable tasks and needs durable coordination across owners, blockers, or asynchronous events. Keep one project owner accountable for the record and final result. The workflow requires the `andrue-cli` command from `@andrue/cli` and a record accessible to participating agents.

## Record

Run commands against the same record:

```sh
andrue-cli manage-project --record <path> <command>
```

Use `project.json` when no path is supplied. Start the optional operator board with `serve`; it reads and writes this record.

Read [the task-management reference](references/ai-agent-processes.md) when exact field meanings, readiness gates, status transitions, or role responsibilities are needed.

## Workflow

1. Initialize the project with its observable outcome and finite completion criteria. Add the smallest set of independently completable tasks.
2. Give each task one owner, a concrete next action, and an accurate status: `Not started`, `Ready`, `In progress`, `Blocked`, `In review`, or `Done`.
3. Start ready work. Delegate or parallelize only independent tasks whose ownership and integration point are clear.
4. Persist meaningful transitions, evidence, decisions, blockers, resume triggers, asynchronous handles, and next actions as they occur.
5. Submit task evidence and review it against that task's definition of done. Review the combined result against the project outcome.
6. Continue corrective work while safe, authorized actions remain. If work cannot continue, leave the record resumable with the unmet condition and next review event.

Useful commands include `init`, `add`, `prepare`, `route`, `start`, `pause`, `block`, `submit`, `review-task`, `review`, and `report`.

## Done

The project is complete when its outcome and every completion criterion pass review. Otherwise, report the current result and record path with each unfinished task's status, blocker or pending event, resume trigger, and next action.
