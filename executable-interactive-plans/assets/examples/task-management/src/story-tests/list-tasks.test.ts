import { assert, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Task } from "../domain/task"
import { listTasks, makeTaskService } from "../domain/task-service"

const fixtures = Schema.Array(Task).check(Schema.isMinLength(1), Schema.isMaxLength(5))

it.effect.prop("lists every generated fixture in its stored order", [fixtures], ([fixture]) =>
  Effect.gen(function* () {
    const layer = yield* makeTaskService(fixture)
    const tasks = yield* listTasks.pipe(Effect.provide(layer))

    assert.deepStrictEqual(tasks, fixture)
  }), { fastCheck: { numRuns: 25 } })
