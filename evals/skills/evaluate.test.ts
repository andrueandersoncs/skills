import { afterEach, expect, test } from "bun:test"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { checkReads, outcome } from "../../scripts/evaluate-skills"
import { skillEvaluationCases } from "./cases"

const directories: string[] = []
const workspace = async () => {
  const path = await mkdtemp(join(tmpdir(), "evaluation-check-"))
  directories.push(path)
  return path
}
const scenario = (id: string) => {
  const result = skillEvaluationCases.find(item => item.id === id)
  if (!result) throw new Error(`Missing scenario ${id}`)
  return result
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

test("routing requires the router and one correct destination, not every leaf", () => {
  const required = ["router/SKILL.md", "leaves/amber/SKILL.md"]
  const forbidden = ["leaves/birch/SKILL.md", "leaves/cobalt/SKILL.md"]
  expect(checkReads(required, required, forbidden).pass).toBe(true)
  expect(checkReads([...required, ...forbidden], required, forbidden).pass).toBe(false)
  expect(checkReads(["leaves/amber/SKILL.md"], required, forbidden).pass).toBe(false)
})

test("an empty generated router cannot pass skill discovery", async () => {
  const directory = await workspace()
  await mkdir(join(directory, "router"))
  await writeFile(join(directory, "router/SKILL.md"), "")
  expect((await outcome(directory, scenario("router-creation-owner"))).pass).toBe(false)
})

test("audit grading distinguishes the affected source from its missing reference target", async () => {
  const directory = await workspace()
  const evaluation = scenario("router-audit-no-mutation")
  const finding = {
    path: "router/SKILL.md",
    problem: "The referenced review leaf is missing.",
    target: evaluation.audit!.missingPath
  }
  await writeFile(join(directory, "audit.json"), JSON.stringify({ findings: [finding] }))
  expect((await outcome(directory, evaluation)).pass).toBe(true)
  await writeFile(join(directory, "audit.json"), JSON.stringify({ findings: [{ ...finding, target: "unrelated/SKILL.md" }] }))
  expect((await outcome(directory, evaluation)).pass).toBe(false)
})
