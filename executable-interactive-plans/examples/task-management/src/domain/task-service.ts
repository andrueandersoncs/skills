import { Context, Effect, Layer, Ref } from "effect"
import type { CompleteTaskInput, CreateTaskInput, Task } from "./task"

export interface TaskServiceShape {
  readonly create: (input: CreateTaskInput) => Effect.Effect<Task>
  readonly list: Effect.Effect<ReadonlyArray<Task>>
  readonly complete: (input: CompleteTaskInput) => Effect.Effect<Task>
}

export class TaskService extends Context.Service<TaskService, TaskServiceShape>()("TaskService") {}

export const makeTaskService = (fixture: ReadonlyArray<Task>) =>
  Effect.gen(function* () {
    const tasks = yield* Ref.make(fixture)
    const service: TaskServiceShape = {
      create: ({ title }) => Ref.modify(tasks, (current) => {
        const id = current.reduce((largest, task) => Math.max(largest, task.id), 0) + 1
        const task = { id, title, completed: false }
        return [task, [...current, task]]
      }),
      list: Ref.get(tasks),
      complete: ({ id }) => Effect.flatMap(Ref.get(tasks), (current) => {
        const task = current.find((item) => item.id === id)!
        const completed = { ...task, completed: true }
        return Effect.as(Ref.set(tasks, current.map((item) => item.id === id ? completed : item)), completed)
      }),
    }
    return Layer.succeed(TaskService, service)
  })

export const createTask = (input: CreateTaskInput) => Effect.flatMap(TaskService, (service) => service.create(input))

export const listTasks = Effect.flatMap(TaskService, (service) => service.list)

export const completeTask = (input: CompleteTaskInput) => Effect.flatMap(TaskService, (service) => service.complete(input))
