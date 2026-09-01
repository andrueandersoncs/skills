# Task story-test pseudocode

## Create task

- Generate valid `CreateTaskInput` values from its exact Schema.
- Create a fresh task-service Layer for every generated value.
- Run `createTask` and then `listTasks`.
- Assert the task is incomplete and remains visible.

## List tasks

- Generate non-empty task fixtures from the exact `Task` Schema.
- Create a fresh task-service Layer for every fixture.
- Run `listTasks`.
- Assert every task remains in stored order.

## Complete task

- Generate valid titles from `CreateTaskInput`.
- Create one incomplete task in a fresh Layer.
- Run `completeTask` and then `listTasks`.
- Assert the task remains visible with completed state.
