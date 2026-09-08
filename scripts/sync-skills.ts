import { cp, lstat, mkdir, readdir, readFile, readlink, rm, symlink } from "node:fs/promises"
import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { basename, join, relative, resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const source = join(root, "skills/help")
const installed = join(root, ".agents/skills/help")
const claude = join(root, ".claude/skills/help")

async function snapshot(directory: string, excludeEvals = false, prefix = ""): Promise<Map<string, string>> {
  const files = new Map<string, string>()
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name)
    if (entry.isDirectory()) {
      if (excludeEvals && entry.name === "evals") continue
      for (const [name, hash] of await snapshot(directory, excludeEvals, path)) files.set(name, hash)
    } else {
      files.set(path, createHash("sha256").update(await readFile(join(directory, path))).digest("hex"))
    }
  }
  return files
}

async function check() {
  const expected = await snapshot(source, true)
  const actual = existsSync(installed) ? await snapshot(installed) : new Map<string, string>()
  const differences: string[] = []
  for (const [path, hash] of expected) {
    if (!actual.has(path)) differences.push(`missing ${path}`)
    else if (actual.get(path) !== hash) differences.push(`changed ${path}`)
  }
  for (const path of actual.keys()) {
    if (!expected.has(path)) differences.push(`extra ${path}`)
  }
  const link = await lstat(claude).catch(() => null)
  if (!link?.isSymbolicLink() || resolve(claude, "..", await readlink(claude)) !== installed) {
    differences.push("incorrect link .claude/skills/help (expected ../../.agents/skills/help)")
  }
  if (differences.length) {
    console.error(`Installed help is stale:
${differences.sort().join("\n")}
Run bun run skills:sync.`)
    process.exitCode = 1
  } else {
    console.log("Installed help is current; Claude links to the installed copy.")
  }
}

switch (process.argv[2]) {
  case "sync":
    // Read the source before replacing the generated runtime copy.
    await snapshot(source, true)
    await rm(installed, { recursive: true, force: true })
    await cp(source, installed, { recursive: true, filter: path => basename(path) !== "evals" })
    await mkdir(resolve(claude, ".."), { recursive: true })
    await rm(claude, { recursive: true, force: true })
    await symlink(relative(resolve(claude, ".."), installed), claude)
    await check()
    break
  case "check":
    await check()
    break
  default:
    console.error("Usage: bun scripts/sync-skills.ts <sync|check>")
    process.exitCode = 1
}
