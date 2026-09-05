import { afterEach, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { checkArtifacts, decision, deleteSection, summarize } from "../../scripts/compile-skill.ts"
import { snapshot } from "../../scripts/evaluate-skills.ts"

const directories: string[] = []
afterEach(async () => { await Promise.all(directories.splice(0).map(path => rm(path, { recursive: true, force: true }))) })

test("section deletion preserves fenced examples and removes nested instructions together", () => {
  const prefix = "---\nname: example\n---\n\n# Example\n\n## Keep\n```md\n## Remove\n```\n\n"
  const suffix = "## Finish\nReturn the artifact.\n"
  const source = `${prefix}## Remove\nExtra guidance.\n### Nested\nMore guidance.\n\n${suffix}`
  expect(deleteSection(source, "## Remove")).toBe(prefix + suffix)
})

test("artifact verification catches changed protected content and unauthorized writes", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "compile-check-"))
  directories.push(workspace)
  await writeFile(join(workspace, "input.txt"), "May reduce latency by 12 ms.\n")
  const before = await snapshot(workspace)
  const item = {
    id: "preservation", family: "uncertainty", prompt: "Edit the copy", files: {}, allowedChanges: ["output.txt"],
    checks: [{ path: "output.txt", contains: ["May", "12 ms"], absent: ["definitely"] }],
  }
  await writeFile(join(workspace, "output.txt"), "May reduce latency by 12 ms.\n")
  expect(await checkArtifacts(workspace, item, before)).toEqual([])
  await writeFile(join(workspace, "output.txt"), "Will reduce latency by 12 ms.\n")
  expect((await checkArtifacts(workspace, item, before)).length === 0).toBe(false)
  await writeFile(join(workspace, "output.txt"), "May definitely reduce latency by 12 ms.\n")
  expect((await checkArtifacts(workspace, item, before)).length === 0).toBe(false)
  await writeFile(join(workspace, "output.txt"), "May reduce latency by 12 ms.\n")
  await writeFile(join(workspace, "input.txt"), "Changed source")
  expect((await checkArtifacts(workspace, item, before)).length === 0).toBe(false)
})

function run(pass: boolean, totalTokens: number): Parameters<typeof summarize>[0][number] {
  return {
    caseId: "fixture", family: "contract", repeat: 0, arm: "compiled", pass, failures: [],
    execution: {
      runtime: { pass: true, failures: [] }, models: ["test/model"], reads: [], mutations: [], toolCalls: 1,
      usage: [{ totalTokens }], durationMs: 10, exitCode: 0, transcript: "unused", stderr: "unused",
    },
  }
}

test("cheaper failing candidates cannot pass and failed attempts still count toward cost", () => {
  const source = summarize([run(true, 100), run(true, 100)])
  const candidate = summarize([run(true, 10), run(false, 20)])
  expect(candidate.tokensPerSuccess).toBe(30)
  expect(decision(source, candidate, 0.05).accepted).toBe(false)
  expect(decision(source, summarize([run(true, 10), run(true, 20)]), 0.05).accepted).toBe(true)
  const unmetered = run(true, 0)
  unmetered.execution.usage = []
  expect(decision(source, summarize([unmetered, unmetered]), 0.05).accepted).toBe(false)
})
