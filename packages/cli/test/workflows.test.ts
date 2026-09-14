import { afterEach, expect, test } from "bun:test"
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"
import { pathToFileURL } from "node:url"

const cliPath = resolve(import.meta.dir, "..", "dist", "cli.js")
const nodePath = Bun.which("node")!
const sandboxes: string[] = []

type CommandResult = {
  code: number
  stdout: string
  stderr: string
}

const runCli = (args: string[], env = process.env) =>
  new Promise<CommandResult>((resolve, reject) => {
    const child = spawn(nodePath, [cliPath, ...args], {
      env,
      stdio: ["ignore", "pipe", "pipe"]
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

const sandbox = async () => {
  const directory = await mkdtemp(join(tmpdir(), "andrue-cli-workflows-"))
  sandboxes.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(sandboxes.splice(0).map((directory) =>
    rm(directory, { force: true, recursive: true })
  ))
})

test("initializes, ingests, and lints a wiki through the CLI", async () => {
  const directory = await sandbox()
  const root = join(directory, "wiki")
  const source = join(directory, "source.txt")
  await writeFile(source, "source evidence\n")

  const initialized = await runCli(["wiki", "--root", root, "init"])
  expect(initialized.code).toBe(0)
  expect(existsSync(join(root, ".git"))).toBe(true)
  const commit = Bun.spawnSync(["git", "-C", root, "log", "-1", "--format=%s"])
  expect(commit.exitCode).toBe(0)
  expect(commit.stdout.toString().trim()).toBe("wiki: initialize")
  expect((await runCli(["wiki", "--root", root, "init"])).code).toBe(0)

  const ingested = await runCli(["wiki", "--root", root, "ingest", source])
  expect(ingested.code).toBe(0)
  expect(JSON.parse(ingested.stdout)).toMatchObject({
    source: { path: "raw/source.txt" },
    action: "copied"
  })
  expect(await readFile(join(root, "raw", "source.txt"), "utf8")).toBe("source evidence\n")

  const linted = await runCli(["wiki", "--root", root, "lint"])
  expect(linted.code).toBe(0)
  expect(JSON.parse(linted.stdout)).toEqual({
    brokenCitations: [],
    brokenLinks: [],
    missing: [],
    orphans: []
  })

  const missing = join(root, "raw", "missing.txt")
  expect((await runCli(["wiki", "--root", root, "ingest", missing])).code).not.toBe(0)
}, 30_000)

test("fails wiki initialization when Git is unavailable", async () => {
  const directory = await sandbox()
  const result = await runCli(
    ["wiki", "--root", join(directory, "wiki"), "init"],
    { ...process.env, PATH: "" }
  )
  expect(result.code).not.toBe(0)
}, 30_000)

test("generates the requested number of schema samples through the CLI", async () => {
  const directory = await sandbox()
  const effect = pathToFileURL(resolve(import.meta.dir, "../node_modules/effect/dist/index.js"))
  const module = join(directory, "schema.mjs")
  await writeFile(
    module,
    `import { Schema } from ${JSON.stringify(effect.href)}\nexport default Schema.Struct({ enabled: Schema.Boolean })\n`
  )

  const generated = await runCli(["generate", module, "--count", "4"])
  expect(generated.code).toBe(0)
  const samples = JSON.parse(generated.stdout) as Array<{ enabled: unknown }>
  expect(samples).toHaveLength(4)
  expect(samples.every((sample) => typeof sample.enabled === "boolean")).toBe(true)
}, 30_000)
