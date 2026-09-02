import { readFile, writeFile } from "node:fs/promises"
import { Schema } from "effect"

export const Status = Schema.Literals([
  "Not started",
  "Ready",
  "In progress",
  "Blocked",
  "In review",
  "Done"
])
export type Status = typeof Status.Type

export const Task = Schema.Struct({
  id: Schema.String,
  task: Schema.String,
  outcome: Schema.String,
  definitionOfDone: Schema.String,
  owner: Schema.String,
  due: Schema.String,
  scheduled: Schema.String,
  priority: Schema.String,
  nextAction: Schema.String,
  context: Schema.String,
  inputs: Schema.Array(Schema.String),
  dependencies: Schema.Array(Schema.String),
  effort: Schema.String,
  status: Status,
  reviewOrFollowUp: Schema.String,
  tags: Schema.Array(Schema.String),
  evidence: Schema.String
})
export type Task = typeof Task.Type

export const Project = Schema.Struct({
  outcome: Schema.String,
  definitionOfDone: Schema.String,
  context: Schema.String,
  tasks: Schema.Array(Task),
  reviewVerdict: Schema.String,
  correctiveAction: Schema.String,
  evidence: Schema.String
})
export type Project = typeof Project.Type

export const ProjectJson = Schema.fromJsonString(Project, { space: 2 })

export type Action =
  | { op: "init"; outcome: string; done: string; context?: string }
  | {
    op: "add"
    id: string
    task: string
    outcome: string
    done: string
    owner?: string
    next?: string
    context?: string
    input?: string
    dependency?: string
    tag?: string
  }
  | {
    op: "prepare"
    id: string
    owner: string
    next: string
    context?: string
    input?: string
    dependency?: string
    blockedBy?: string
    followUp?: string
  }
  | {
    op: "route"
    id: string
    priority: string
    effort: string
    due?: string
    scheduled?: string
  }
  | { op: "start"; id: string }
  | { op: "pause"; id: string; next: string }
  | { op: "block"; id: string; dependency: string; followUp: string }
  | { op: "submit"; id: string; evidence: string }
  | { op: "review-task"; id: string; verdict: "Passed" | "Failed"; action?: string }
  | {
    op: "review"
    verdict: "Passed" | "Failed" | "Incomplete"
    action?: string
    evidence?: string
  }

export const filled = (value: string) => value.length > 0

export const readyGate = (task: Task) =>
  filled(task.task) &&
  filled(task.outcome) &&
  filled(task.definitionOfDone) &&
  filled(task.owner) &&
  filled(task.nextAction)

export const getTask = (project: Project, id: string) => {
  const task = project.tasks.find((item) => item.id === id)
  if (!task) {
    throw new Error(`unknown task ${id}`)
  }
  return task
}

export const putTask = (project: Project, task: Task): Project => ({
  ...project,
  tasks: project.tasks.map((item) => (item.id === task.id ? task : item))
})

export const encodeProject = (project: Project) => `${Schema.encodeUnknownSync(ProjectJson)(project)}\n`

export const decodeProject = (text: string) => Schema.decodeUnknownSync(ProjectJson)(text)

export const readProject = async (path: string) => decodeProject(await readFile(path, "utf8"))

export const writeProject = async (path: string, project: Project) => {
  await writeFile(path, encodeProject(project))
}

const requireProject = (project: Project | undefined): Project => {
  if (!project) {
    throw new Error("project record is missing")
  }
  return project
}

export const applyAction = (project: Project | undefined, action: Action): Project => {
  switch (action.op) {
    case "init":
      return {
        outcome: action.outcome,
        definitionOfDone: action.done,
        context: action.context ?? "",
        tasks: [],
        reviewVerdict: "",
        correctiveAction: "",
        evidence: ""
      }
    case "add": {
      const current = requireProject(project)
      if (current.tasks.some((item) => item.id === action.id)) {
        throw new Error(`task ${action.id} already exists`)
      }
      const created: Task = {
        id: action.id,
        task: action.task,
        outcome: action.outcome,
        definitionOfDone: action.done,
        owner: action.owner ?? "",
        due: "",
        scheduled: "",
        priority: "",
        nextAction: action.next ?? "",
        context: action.context ?? "",
        inputs: filled(action.input ?? "") ? [action.input!] : [],
        dependencies: filled(action.dependency ?? "") ? [action.dependency!] : [],
        effort: "",
        status: "Not started",
        reviewOrFollowUp: "",
        tags: filled(action.tag ?? "") ? [action.tag!] : [],
        evidence: ""
      }
      return { ...current, tasks: [...current.tasks, created] }
    }
    case "prepare": {
      const current = requireProject(project)
      let task = {
        ...getTask(current, action.id),
        owner: action.owner,
        nextAction: action.next
      }
      if (filled(action.context ?? "")) task = { ...task, context: action.context! }
      if (filled(action.input ?? "")) task = { ...task, inputs: [action.input!] }
      if (filled(action.dependency ?? "")) task = { ...task, dependencies: [action.dependency!] }
      if (filled(action.blockedBy ?? "")) {
        if (!filled(action.followUp ?? "")) {
          throw new Error("Blocked tasks need --follow-up")
        }
        task = {
          ...task,
          dependencies: [action.blockedBy!],
          reviewOrFollowUp: action.followUp!,
          status: "Blocked"
        }
      } else if (readyGate(task)) {
        task = { ...task, status: "Ready", reviewOrFollowUp: "" }
      } else {
        const missing = [
          !filled(task.task) ? "task" : "",
          !filled(task.outcome) ? "outcome" : "",
          !filled(task.definitionOfDone) ? "definition of done" : "",
          !filled(task.owner) ? "owner" : "",
          !filled(task.nextAction) ? "next action" : ""
        ].filter(filled)
        task = {
          ...task,
          status: "Blocked",
          dependencies: missing.map((field) => `${field} is unavailable`),
          reviewOrFollowUp: filled(action.followUp ?? "")
            ? action.followUp!
            : "re-prepare when missing fields are available"
        }
      }
      return putTask(current, task)
    }
    case "route": {
      const current = requireProject(project)
      return putTask(current, {
        ...getTask(current, action.id),
        priority: action.priority,
        effort: action.effort,
        due: action.due ?? "",
        scheduled: action.scheduled ?? ""
      })
    }
    case "start": {
      const current = requireProject(project)
      const existing = getTask(current, action.id)
      if (existing.status !== "Ready" || !readyGate(existing)) {
        throw new Error(`task ${action.id} is not Ready`)
      }
      return putTask(current, { ...existing, status: "In progress" })
    }
    case "pause": {
      const current = requireProject(project)
      const existing = getTask(current, action.id)
      if (existing.status !== "In progress") {
        throw new Error(`task ${action.id} is not In progress`)
      }
      return putTask(current, { ...existing, status: "Ready", nextAction: action.next })
    }
    case "block": {
      const current = requireProject(project)
      const existing = getTask(current, action.id)
      if (existing.status !== "Ready" && existing.status !== "In progress") {
        throw new Error(`task ${action.id} cannot be blocked from ${existing.status}`)
      }
      return putTask(current, {
        ...existing,
        status: "Blocked",
        dependencies: [action.dependency],
        reviewOrFollowUp: action.followUp
      })
    }
    case "submit": {
      const current = requireProject(project)
      const existing = getTask(current, action.id)
      if (existing.status !== "In progress") {
        throw new Error(`task ${action.id} is not In progress`)
      }
      return putTask(current, { ...existing, status: "In review", evidence: action.evidence })
    }
    case "review-task": {
      const current = requireProject(project)
      const existing = getTask(current, action.id)
      if (existing.status !== "In review") {
        throw new Error(`task ${action.id} is not In review`)
      }
      if (action.verdict === "Failed" && !filled(action.action ?? "")) {
        throw new Error("Failed review needs --action")
      }
      return putTask(
        current,
        action.verdict === "Passed"
          ? {
            ...existing,
            status: "Done",
            context: filled(existing.context) ? `${existing.context}\nReview: Passed` : "Review: Passed"
          }
          : { ...existing, status: "Ready", nextAction: action.action ?? "" }
      )
    }
    case "review": {
      const current = requireProject(project)
      const tasksDone = current.tasks.length > 0 && current.tasks.every((task) => task.status === "Done")
      if (action.verdict === "Passed" && !tasksDone) {
        throw new Error("Passed review needs every task Done")
      }
      if (action.verdict === "Failed" && (action.action ?? "None") === "None") {
        throw new Error("Failed review needs --action")
      }
      return {
        ...current,
        reviewVerdict: action.verdict,
        correctiveAction: action.verdict === "Failed" ? (action.action ?? "None") : "None",
        evidence: action.evidence ?? ""
      }
    }
  }
}
