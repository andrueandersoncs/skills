import { afterEach, expect, test } from "bun:test"
import { cp, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const directories: string[] = []
const script = resolve(import.meta.dir, "../../scripts/sync-skills.ts")

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "skill-sync-"))
  directories.push(root)
  await mkdir(join(root, "scripts"))
  await cp(script, join(root, "scripts/sync-skills.ts"))
  await put(root, "skills/help/SKILL.md", "# Current help")
  await put(root, "skills/help/references/browser/SKILL.md", "# Browser")
  await put(root, "skills/help/references/browser/evals/acceptance.json", "private checks")
  await put(root, ".agents/skills/impeccable/SKILL.md", "unrelated skill")
  return root
}

async function put(root: string, path: string, text: string) {
  const target = join(root, path)
  await mkdir(resolve(target, ".."), { recursive: true })
  await writeFile(target, text)
}

async function run(root: string, mode: string) {
  const child = Bun.spawn([process.execPath, join(root, "scripts/sync-skills.ts"), mode], {
    cwd: tmpdir(), stdout: "pipe", stderr: "pipe",
  })
  const [code, stdout, stderr] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ])
  return { code, output: stdout + stderr }
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

test("check reports drift without changing files; sync repairs only help and is repeatable", async () => {
  const root = await fixture()
  await put(root, ".agents/skills/help/SKILL.md", "# Old help")
  await put(root, ".agents/skills/help/obsolete.md", "old workflow")
  await put(root, ".agents/skills/help/evals/check.json", "exposed checks")
  const stale = await run(root, "check")
  expect(stale.code).toBe(1)
  expect(stale.output).toContain("changed SKILL.md")
  expect(stale.output).toContain("missing references/browser/SKILL.md")
  expect(stale.output).toContain("extra obsolete.md")
  expect(stale.output).toContain("extra evals/check.json")
  expect(stale.output).toContain(".claude/skills/help")
  expect(await readFile(join(root, ".agents/skills/help/SKILL.md"), "utf8")).toBe("# Old help")

  expect((await run(root, "sync")).code).toBe(0)
  expect((await run(root, "check")).code).toBe(0)
  expect(await readFile(join(root, ".agents/skills/help/references/browser/SKILL.md"), "utf8")).toBe("# Browser")
  expect(await Bun.file(join(root, ".agents/skills/help/references/browser/evals/acceptance.json")).exists()).toBe(false)
  expect(await Bun.file(join(root, ".agents/skills/help/obsolete.md")).exists()).toBe(false)
  expect(await realpath(join(root, ".claude/skills/help"))).toBe(await realpath(join(root, ".agents/skills/help")))
  expect(await readFile(join(root, ".agents/skills/impeccable/SKILL.md"), "utf8")).toBe("unrelated skill")
  expect((await run(root, "sync")).code).toBe(0)
  expect((await run(root, "check")).code).toBe(0)
})

test("sync installs missing help and check catches later source and link changes", async () => {
  const root = await fixture()
  expect((await run(root, "check")).code).toBe(1)
  expect((await run(root, "sync")).code).toBe(0)
  await put(root, "skills/help/SKILL.md", "# Newer help")
  expect((await run(root, "check")).output).toContain("changed SKILL.md")
  expect((await run(root, "sync")).code).toBe(0)
  await rm(join(root, ".claude/skills/help"))
  await symlink("../../skills/help", join(root, ".claude/skills/help"))
  const wrongLink = await run(root, "check")
  expect(wrongLink.code).toBe(1)
  expect(wrongLink.output).toContain(".claude/skills/help")
  expect((await run(root, "sync")).code).toBe(0)
  expect((await run(root, "check")).code).toBe(0)
})
