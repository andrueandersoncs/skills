import { assert, it } from "@effect/vitest"
import { Effect } from "effect"
import { CompleteTaskInput, CreateTaskInput } from "../domain/task"
import { completeTask, listTasks, makeTaskService } from "../domain/task-service"

it.effect.prop("completes every generated incomplete task without removing it", [CreateTaskInput], ([{ title }]) =>
  Effect.gen(function* () {
    const fixture = [{ id: 1, title, completed: false }]
    const layer = yield* makeTaskService(fixture)
    const completed = yield* completeTask({ id: 1 } satisfies CompleteTaskInput).pipe(Effect.provide(layer))
    const tasks = yield* listTasks.pipe(Effect.provide(layer))

    assert.deepStrictEqual(completed, { id: 1, title, completed: true })
    assert.deepStrictEqual(tasks, [completed])
  }), { fastCheck: { numRuns: 25 } })
