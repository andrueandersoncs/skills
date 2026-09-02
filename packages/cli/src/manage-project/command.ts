import { existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Console, Effect } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"
import {
  applyAction,
  readProject,
  writeProject,
  type Action,
  type Project
} from "./project"
import { startServer } from "./server"

const recordFlag = Flag.string("record").pipe(
  Flag.withDescription("Durable project record path"),
  Flag.withDefault("project.json")
)

const manageProject = Command.make("manage-project").pipe(
  Command.withDescription("Manage an AI-agent project through a durable task record"),
  Command.withSharedFlags({ record: recordFlag })
)

const print = (value: unknown) => Console.log(JSON.stringify(value, null, 2))

const run = (action: Action, view: (project: Project) => unknown) =>
  Effect.gen(function*() {
    const { record } = yield* manageProject
    const path = resolve(record)
    const existing = existsSync(path) ? yield* Effect.promise(() => readProject(path)) : undefined
    const project = applyAction(existing, action)
    yield* Effect.promise(() => writeProject(path, project))
    yield* print({ record: path, ...view(project) as object })
  })

const init = Command.make(
  "init",
  {
    outcome: Flag.string("outcome").pipe(Flag.withDescription("Project outcome")),
    done: Flag.string("done").pipe(Flag.withDescription("Project definition of done")),
    context: Flag.string("context").pipe(Flag.withDefault(""))
  },
  ({ outcome, done, context }) =>
    run({ op: "init", outcome, done, context }, (project) => ({ project }))
).pipe(Command.withDescription("Create the project record"))

const add = Command.make(
  "add",
  {
    id: Argument.string("id"),
    task: Flag.string("task"),
    outcome: Flag.string("outcome"),
    done: Flag.string("done"),
    owner: Flag.string("owner").pipe(Flag.withDefault("")),
    next: Flag.string("next").pipe(Flag.withDefault("")),
    context: Flag.string("context").pipe(Flag.withDefault("")),
    input: Flag.string("input").pipe(Flag.withDefault("")),
    dependency: Flag.string("dependency").pipe(Flag.withDefault("")),
    tag: Flag.string("tag").pipe(Flag.withDefault(""))
  },
  (input) =>
    run({ op: "add", ...input, done: input.done }, (project) => ({
      task: project.tasks.find((task) => task.id === input.id)
    }))
).pipe(Command.withDescription("Add a Not started task"))

const prepare = Command.make(
  "prepare",
  {
    id: Argument.string("id"),
    owner: Flag.string("owner"),
    next: Flag.string("next"),
    context: Flag.string("context").pipe(Flag.withDefault("")),
    input: Flag.string("input").pipe(Flag.withDefault("")),
    dependency: Flag.string("dependency").pipe(Flag.withDefault("")),
    blockedBy: Flag.string("blocked-by").pipe(Flag.withDefault("")),
    followUp: Flag.string("follow-up").pipe(Flag.withDefault(""))
  },
  (input) =>
    run({ op: "prepare", ...input }, (project) => ({
      task: project.tasks.find((task) => task.id === input.id)
    }))
).pipe(Command.withDescription("Apply the Ready gate"))

const route = Command.make(
  "route",
  {
    id: Argument.string("id"),
    priority: Flag.string("priority"),
    effort: Flag.string("effort"),
    due: Flag.string("due").pipe(Flag.withDefault("")),
    scheduled: Flag.string("scheduled").pipe(Flag.withDefault(""))
  },
  (input) =>
    run({ op: "route", ...input }, (project) => ({
      task: project.tasks.find((task) => task.id === input.id)
    }))
).pipe(Command.withDescription("Record priority, effort, and schedule without changing status"))

const start = Command.make(
  "start",
  { id: Argument.string("id") },
  ({ id }) =>
    run({ op: "start", id }, (project) => ({
      task: project.tasks.find((task) => task.id === id)
    }))
).pipe(Command.withDescription("Start a Ready task"))

const pause = Command.make(
  "pause",
  {
    id: Argument.string("id"),
    next: Flag.string("next")
  },
  ({ id, next }) =>
    run({ op: "pause", id, next }, (project) => ({
      task: project.tasks.find((task) => task.id === id)
    }))
).pipe(Command.withDescription("Pause actionable work back to Ready"))

const block = Command.make(
  "block",
  {
    id: Argument.string("id"),
    dependency: Flag.string("dependency"),
    followUp: Flag.string("follow-up")
  },
  ({ id, dependency, followUp }) =>
    run({ op: "block", id, dependency, followUp }, (project) => ({
      task: project.tasks.find((task) => task.id === id)
    }))
).pipe(Command.withDescription("Record a blocker and follow-up"))

const submit = Command.make(
  "submit",
  {
    id: Argument.string("id"),
    evidence: Flag.string("evidence")
  },
  ({ id, evidence }) =>
    run({ op: "submit", id, evidence }, (project) => ({
      task: project.tasks.find((task) => task.id === id)
    }))
).pipe(Command.withDescription("Submit a candidate result for review"))

const reviewTask = Command.make(
  "review-task",
  {
    id: Argument.string("id"),
    verdict: Flag.choice("verdict", ["Passed", "Failed"]),
    action: Flag.string("action").pipe(Flag.withDefault(""))
  },
  ({ id, verdict, action }) =>
    run({ op: "review-task", id, verdict, action }, (project) => ({
      task: project.tasks.find((task) => task.id === id)
    }))
).pipe(Command.withDescription("Accept or return a task in review"))

const review = Command.make(
  "review",
  {
    verdict: Flag.choice("verdict", ["Passed", "Failed", "Incomplete"]),
    action: Flag.string("action").pipe(Flag.withDefault("None")),
    evidence: Flag.string("evidence").pipe(Flag.withDefault(""))
  },
  (input) => run({ op: "review", ...input }, (project) => ({ project }))
).pipe(Command.withDescription("Record the independent project review"))

const show = Command.make("show", {}, () =>
  Effect.gen(function*() {
    const { record } = yield* manageProject
    const path = resolve(record)
    yield* print({ record: path, project: yield* Effect.promise(() => readProject(path)) })
  })).pipe(Command.withDescription("Print the project record"))

const report = Command.make("report", {}, () =>
  Effect.gen(function*() {
    const { record } = yield* manageProject
    const path = resolve(record)
    const project = yield* Effect.promise(() => readProject(path))
    const tasksDone = project.tasks.length > 0 && project.tasks.every((task) => task.status === "Done")
    const complete = project.reviewVerdict === "Passed" && tasksDone
    yield* print({
      result: complete ? "completed" : "incomplete",
      record: path,
      outcome: project.outcome,
      definitionOfDone: project.definitionOfDone,
      reviewVerdict: complete ? "Passed" : (project.reviewVerdict || "Incomplete"),
      correctiveAction: complete ? "None" : project.correctiveAction,
      evidence: project.evidence,
      tasks: project.tasks.map((task) => ({
        id: task.id,
        status: task.status,
        nextAction: task.nextAction,
        reviewOrFollowUp: task.reviewOrFollowUp,
        evidence: task.evidence
      }))
    })
  })).pipe(Command.withDescription("Report completion or resumable state"))

const serve = Command.make(
  "serve",
  {
    port: Flag.integer("port").pipe(
      Flag.withDescription("HTTP port"),
      Flag.withDefault(4373)
    )
  },
  ({ port }) =>
    Effect.gen(function*() {
      const { record } = yield* manageProject
      const server = startServer({
        record,
        port,
        webRoot: join(dirname(fileURLToPath(import.meta.url)), "web")
      })
      yield* Console.log(`http://127.0.0.1:${server.port}`)
      yield* Effect.never
    })
).pipe(Command.withDescription("Start the project board"))

export const command = manageProject.pipe(
  Command.withSubcommands([
    init,
    add,
    prepare,
    route,
    start,
    pause,
    block,
    submit,
    reviewTask,
    review,
    show,
    report,
    serve
  ])
)
