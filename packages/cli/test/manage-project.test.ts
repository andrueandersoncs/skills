import { afterEach, expect, test } from "bun:test"
import { spawn, type ChildProcess } from "node:child_process"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { once } from "node:events"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"
import { updateProject } from "../src/manage-project/project"

const cliPath = resolve(import.meta.dir, "..", "dist", "cli.js")
const children = new Set<ChildProcess>()


type CommandResult = {
  code: number
  stdout: string
  stderr: string
}

type Project = {
  tasks: Array<{ id: string; status: string; nextAction: string }>
  reviewVerdict: string
}

const runCli = (record: string, args: string[]) =>
  new Promise<CommandResult>((resolve, reject) => {
    const child = spawn("node", [cliPath, "manage-project", "--record", record, ...args], {
      stdio: ["ignore", "pipe", "pipe"]
    })
    children.add(child)
    child.once("close", () => {
      children.delete(child)
    })
    let stdout = ""
    let stderr = ""
    child.stdout.on("data", (chunk) => {
      stdout += chunk
    })
    child.stderr.on("data", (chunk) => {
      stderr += chunk
    })
    child.once("error", reject)
    child.once("close", (code) => resolve({ code: code ?? -1, stdout, stderr }))
  })

const cli = async (record: string, args: string[]) => {
  const result = await runCli(record, args)
  expect(result.code).toBe(0)
  return JSON.parse(result.stdout) as Record<string, unknown>
}

const readProject = async (record: string) => JSON.parse(await readFile(record, "utf8")) as Project


const waitForExit = (child: ChildProcess) => {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve()
  return once(child, "close").then(() => undefined)
}

const stop = async (child: ChildProcess) => {
  const exited = waitForExit(child)
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGTERM")
  const stopped = await new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => resolve(false), 3_000)
    void exited.then(() => {
      clearTimeout(timeout)
      resolve(true)
    })
  })
  if (stopped) return
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL")
  await exited
}

const startBoard = async (record: string) => {
  const child = spawn("node", [cliPath, "manage-project", "--record", record, "serve", "--port", "0"], {
    stdio: ["ignore", "pipe", "pipe"]
  })
  children.add(child)
  child.once("close", () => {
    children.delete(child)
  })
  let output = ""
  const started = new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`board did not start:\n${output}`)), 5_000)
    const observe = (chunk: Buffer) => {
      output += chunk.toString()
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0]
      if (address) {
        clearTimeout(timeout)
        resolve(address)
      }
    }
    child.stdout.on("data", observe)
    child.stderr.on("data", observe)
    child.once("error", (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once("exit", (code) => {
      clearTimeout(timeout)
      reject(new Error(`board exited with ${code}:\n${output}`))
    })
  })
  try {
    const url = await started
    const response = await fetch(`${url}/api/project`)
    if (response.status !== 200) throw new Error(`board readiness request returned ${response.status}`)
    await response.json()
    return { child, url }
  } catch (error) {
    await stop(child)
    throw error
  }
}

const sandboxes: string[] = []

const sandbox = async () => {
  const directory = await mkdtemp(join(tmpdir(), "manage-project-"))
  sandboxes.push(directory)
  return { directory, record: join(directory, "project.json") }
}

afterEach(async () => {
  await Promise.all([...children].map(stop))
  await Promise.all(sandboxes.splice(0).map((directory) => rm(directory, { force: true, recursive: true })))
})

test("preserves every concurrent CLI and board task addition while serving complete projects", async () => {
  const { record } = await sandbox()
  let board: Awaited<ReturnType<typeof startBoard>> | undefined
  try {
    await cli(record, ["init", "--outcome", "ship", "--done", "all tasks complete"])
    const startedBoard = await startBoard(record)
    board = startedBoard
    const boardUrl = startedBoard.url

    const cliWrites = Array.from({ length: 8 }, (_, index) =>
      cli(record, [
        "add",
        `cli-${index}`,
        "--task",
        `CLI task ${index}`,
        "--outcome",
        "stored",
        "--done",
        "persisted"
      ])
    )
    const boardWrites = Array.from({ length: 8 }, (_, index) =>
      fetch(`${boardUrl}/api/action`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          op: "add",
          id: `board-${index}`,
          task: `Board task ${index}`,
          outcome: "stored",
          done: "persisted"
        })
      }).then(async (response) => {
        expect(response.status).toBe(200)
        return await response.json() as Project
      })
    )
    let writing = true
    const reads = Array.from({ length: 1 }, async () => {
      while (writing) {
        const response = await fetch(`${boardUrl}/api/project`)
        expect(response.status).toBe(200)
        const project = await response.json() as Project
        expect(Array.isArray(project.tasks)).toBe(true)
        await Bun.sleep(5)
      }
    })
    const writeResults = await Promise.allSettled([...cliWrites, ...boardWrites])
    writing = false
    await Promise.all(reads)
    expect(writeResults.every((result) => result.status === "fulfilled")).toBe(true)
    const cliResults = writeResults.slice(0, 8).map((result) => {
      if (result.status !== "fulfilled") throw result.reason
      return result.value as Record<string, unknown>
    })
    const boardResults = writeResults.slice(8).map((result) => {
      if (result.status !== "fulfilled") throw result.reason
      return result.value as Project
    })

    for (let index = 0; index < 8; index++) {
      const cliResult = cliResults[index]
      const boardResult = boardResults[index]
      if (!cliResult || !boardResult) throw new Error(`missing concurrent result ${index}`)
      expect((cliResult.task as { id: string }).id).toBe(`cli-${index}`)
      expect(boardResult.tasks.some((task) => task.id === `board-${index}`)).toBe(true)
    }
    const project = await readProject(record)
    expect(project.tasks.map((task) => task.id).sort()).toEqual([
      ...Array.from({ length: 8 }, (_, index) => `board-${index}`),
      ...Array.from({ length: 8 }, (_, index) => `cli-${index}`)
    ])
  } finally {
    if (board) await stop(board.child)
  }
}, 30_000)

test("gates failed-review corrections and completes only after project review", async () => {
  const { record } = await sandbox()
  await cli(record, ["init", "--outcome", "ship", "--done", "all tasks complete"])
  await cli(record, ["add", "release", "--task", "release", "--outcome", "shipped", "--done", "available"])

  const beforeReady = await runCli(record, ["start", "release"])
  expect(beforeReady.code).not.toBe(0)
  const [task] = (await readProject(record)).tasks
  if (!task) throw new Error("expected release task")
  expect(task.status).toBe("Not started")

  const ready = await cli(record, ["prepare", "release", "--owner", "agent", "--next", "implement"])
  expect((ready.task as { status: string }).status).toBe("Ready")
  await cli(record, ["start", "release"])
  await cli(record, ["submit", "release", "--evidence", "candidate one"])
  const failed = await cli(record, ["review-task", "release", "--verdict", "Failed", "--action", "fix review finding"])
  expect((failed.task as { status: string; nextAction: string }).status).toBe("Ready")
  expect((failed.task as { status: string; nextAction: string }).nextAction).toBe("fix review finding")

  await cli(record, ["start", "release"])
  await cli(record, ["submit", "release", "--evidence", "candidate two"])
  const blocked = await cli(record, ["review-task", "release", "--verdict", "Failed", "--action", "repair with source access", "--blocked-by", "source permission unavailable", "--follow-up", "permission granted"])
  expect(blocked.task).toMatchObject({
    status: "Blocked",
    nextAction: "repair with source access",
    dependencies: ["source permission unavailable"],
    reviewOrFollowUp: "permission granted"
  })
  expect((await runCli(record, ["start", "release"])).code).not.toBe(0)
  await cli(record, ["prepare", "release", "--owner", "agent", "--next", "repair with source access"])
  await cli(record, ["start", "release"])
  await cli(record, ["submit", "release", "--evidence", "corrected candidate"])
  const passed = await cli(record, ["review-task", "release", "--verdict", "Passed"])
  expect((passed.task as { status: string }).status).toBe("Done")
  expect((await runCli(record, ["prepare", "release", "--owner", "agent", "--next", "reopen"])).code).not.toBe(0)
  expect((await readProject(record)).tasks[0]?.status).toBe("Done")

  const beforeOverallReview = await cli(record, ["report"])
  expect(beforeOverallReview.result).toBe("incomplete")
  await cli(record, ["review", "--verdict", "Passed", "--evidence", "independent approval"])
  const completed = await cli(record, ["report"])
  expect(completed.result).toBe("completed")
}, 30_000)

test("keeps the durable record unchanged after a rejected mutation and releases its lock", async () => {
  const { record } = await sandbox()
  await cli(record, ["init", "--outcome", "ship", "--done", "all tasks complete"])
  await cli(record, ["add", "existing", "--task", "existing", "--outcome", "stored", "--done", "persisted"])
  const before = await readProject(record)

  await expect(
    updateProject(record, {
      op: "add",
      id: "existing",
      task: "duplicate",
      outcome: "stored",
      done: "persisted"
    })
  ).rejects.toThrow()
  expect(await readProject(record)).toEqual(before)

  await updateProject(record, {
    op: "add",
    id: "after-rejection",
    task: "after",
    outcome: "stored",
    done: "persisted"
  })
  expect((await readProject(record)).tasks.map((item) => item.id)).toEqual(["existing", "after-rejection"])
}, 30_000)

test("keeps the board alive after rejecting a conflicting addition", async () => {
  const { record } = await sandbox()
  await cli(record, ["init", "--outcome", "ship", "--done", "all tasks complete"])
  const board = await startBoard(record)
  const add = (id: string) => fetch(`${board.url}/api/action`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ op: "add", id, task: id, outcome: "stored", done: "persisted" })
  })
  expect((await add("existing")).ok).toBe(true)
  const before = await readProject(record)
  expect((await add("existing")).ok).toBe(false)
  expect(await readProject(record)).toEqual(before)
  expect((await add("after-rejection")).ok).toBe(true)
  const response = await fetch(`${board.url}/api/project`)
  expect(response.ok).toBe(true)
  const project = await response.json() as Project
  expect(project.tasks.map(task => task.id)).toEqual(["existing", "after-rejection"])
}, 30_000)
