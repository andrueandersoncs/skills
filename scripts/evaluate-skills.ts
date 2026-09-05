import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { isDeepStrictEqual } from "node:util"
import { tmpdir } from "node:os"
import { join, relative, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { skillEvaluationCases, type SkillEvaluationCase } from "../evals/skills/cases.ts"

const root = resolve(import.meta.dir, "..")
const maxTimeSeconds = 120
const systemPrompt = "Work only in the isolated workspace using its provided files and tools. Complete the requested artifact without adding support files. The evaluator will run code acceptance checks and test generated skills in separate fresh contexts after your turn. Do not claim verification that you could not perform."

type Block = { type: string; id?: string; name?: string; arguments?: Record<string, unknown>; text?: string }
type Message = { role: string; content: Block[]; provider?: string; model?: string; usage?: unknown; stopReason?: string }
type Event = { type: string; message?: Message; toolCallId?: string; isError?: boolean; isTerminal?: boolean }
type Check = { pass: boolean; failures: string[] }
const check = (failures: string[]): Check => ({ pass: failures.length === 0, failures })
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex")

export function checkReads(reads: string[], required: string[], forbidden: string[] = []): Check {
  return check([
    ...required.filter(path => !reads.includes(path)).map(path => `Required file was not loaded: ${path}`),
    ...forbidden.filter(path => reads.includes(path)).map(path => `Unrelated workflow was loaded: ${path}`),
  ])
}

function argumentsForRun() {
  const options = new Map<string, string>()
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]
    const value = args[i + 1]
    if (!key || !["--model", "--case", "--output"].includes(key) || !value) throw new Error("Usage: bun run eval:skills --model <provider/model> [--case <id>] [--output <directory>]")
    options.set(key, value)
  }
  const model = options.get("--model")
  if (!model) throw new Error("--model <provider/model> is required")
  const cases = skillEvaluationCases.filter(item => !options.has("--case") || item.id === options.get("--case"))
  if (!cases.length) throw new Error(`Unknown case: ${options.get("--case")}`)
  return { model, cases, output: resolve(options.get("--output") ?? join(root, ".scratch/skill-evals")) }
}

async function snapshot(directory: string, prefix = ""): Promise<Record<string, string>> {
  const files: Record<string, string> = {}
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name)
    if (entry.isDirectory()) Object.assign(files, await snapshot(directory, path))
    else files[path] = hash(await readFile(join(directory, path)))
  }
  return files
}

function changes(before: Record<string, string>, after: Record<string, string>) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path])
}

async function command(args: string[], cwd: string, timeoutMs: number) {
  const child = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" })
  const stdout = new Response(child.stdout).text()
  const stderr = new Response(child.stderr).text()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; child.kill("SIGKILL") }, timeoutMs)
  try {
    return { code: await child.exited, stdout: await stdout, stderr: await stderr, timedOut }
  } finally {
    clearTimeout(timer)
  }
}

function toolPaths(workspace: string, block: Block) {
  const args = block.arguments ?? {}
  const paths = typeof args.path === "string" ? args.path.split(/;\s*/) : []
  if (block.name === "edit" && typeof args.input === "string") {
    paths.push(...Array.from(args.input.matchAll(/^\[([^#\n]+)#[A-F0-9]{4}\]/gm), match => match[1]!))
    paths.push(...Array.from(args.input.matchAll(/^MV (.+)$/gm), match => match[1]!))
  }
  return paths.map(path => relative(workspace, resolve(workspace, path.replace(/(\.(?:md|ts|json))[:?#].*$/, "$1"))).replaceAll("\\", "/"))
}

async function runAgent(workspace: string, prompt: string, model: string, evidence: string) {
  await mkdir(evidence, { recursive: true })
  const start = performance.now()
  const result = await command([
    "omp", "-p", prompt, "--mode", "json", "--model", model, "--thinking", "minimal",
    "--no-session", "--no-skills", "--no-rules", "--no-extensions", "--no-title", "--no-lsp", "--no-pty",
    "--tools", "read,write,edit,grep,glob", "--system-prompt", systemPrompt, "--max-time", String(maxTimeSeconds),
  ], workspace, (maxTimeSeconds + 20) * 1_000)
  await writeFile(join(evidence, "transcript.jsonl"), result.stdout)
  await writeFile(join(evidence, "stderr.txt"), result.stderr)
  const failures: string[] = []
  let events: Event[] = []
  try { events = result.stdout.trim().split(/\r?\n/).map(line => JSON.parse(line)) }
  catch { failures.push("Invalid or missing omp JSONL") }
  const messages = events.filter(event => event.type === "message_end" && event.message?.role === "assistant").map(event => event.message!)
  const successes = new Set(events.filter(event => event.type === "tool_execution_end" && !event.isError).map(event => event.toolCallId))
  const calls = messages.flatMap(message => message.content.filter(block => block.type === "toolCall"))
  const reads = calls.filter(call => call.name === "read" && successes.has(call.id)).flatMap(call => toolPaths(workspace, call))
  const mutations = calls.filter(call => call.name === "write" || call.name === "edit").flatMap(call => toolPaths(workspace, call))
  const models = [...new Set(messages.map(message => `${message.provider}/${message.model}`))]
  if (result.timedOut || result.code !== 0) failures.push(`omp ${result.timedOut ? "timed out" : `exited ${result.code}`}`)
  if (!events.some(event => event.type === "agent_end" && event.isTerminal)) failures.push("No terminal agent result")
  if (messages.at(-1)?.stopReason !== "stop") failures.push("No completed assistant turn")
  if (models.length !== 1 || models[0] !== model) failures.push(`Requested ${model}; observed ${models.join(", ") || "no model"}`)
  return {
    runtime: check(failures), models, reads, mutations,
    usage: messages.flatMap(message => message.usage ? [message.usage] : []),
    durationMs: Math.round(performance.now() - start), exitCode: result.code,
    transcript: relative(root, join(evidence, "transcript.jsonl")),
    stderr: relative(root, join(evidence, "stderr.txt")),
  }
}

export async function outcome(workspace: string, evaluation: SkillEvaluationCase): Promise<Check> {
  const failures: string[] = []
  if (evaluation.runtime) {
    const { module, exportName, calls } = evaluation.runtime
    const runner = join(workspace, ".evaluate.ts")
    await writeFile(runner, `import { isDeepStrictEqual } from "node:util"\nconst candidate = await import(${JSON.stringify(pathToFileURL(join(workspace, module)).href)})\nfor (const call of ${JSON.stringify(calls)}) {\n const actual = candidate[${JSON.stringify(exportName)}](...call.args)\n if (!isDeepStrictEqual(actual, call.expected)) throw new Error(JSON.stringify({call, actual}))\n}\n`)
    try {
      const result = await command([process.execPath, runner], workspace, 3_000)
      if (result.code !== 0 || result.timedOut) failures.push(`Runtime acceptance failed: ${result.stderr || "timeout"}`)
    } finally { await rm(runner) }
  }
  for (const path of evaluation.requiredChanges.filter(path => path.endsWith("/SKILL.md"))) {
    try {
      const text = await readFile(join(workspace, path), "utf8")
      const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
      const metadata = header === undefined ? null : Bun.YAML.parse(header)
      if (!metadata || typeof metadata !== "object" ||
        !("name" in metadata) || typeof metadata.name !== "string" || !metadata.name.trim() ||
        !("description" in metadata) || typeof metadata.description !== "string" || !metadata.description.trim()) {
        failures.push(`${path} lacks the name/description required for skill discovery`)
      }
    } catch { failures.push(`Missing or invalid skill manifest: ${path}`) }
  }
  if (evaluation.audit) {
    try {
      const audit = JSON.parse(await readFile(join(workspace, evaluation.audit.path), "utf8"))
      if (!Array.isArray(audit.findings) || !audit.findings.every((finding: { path?: unknown; problem?: unknown }) => typeof finding.path === "string" && typeof finding.problem === "string" && finding.problem.trim())) {
        failures.push("Audit must contain structured, actionable findings")
      } else if (evaluation.audit.missingPath && !audit.findings.some((finding: { target?: string }) => finding.target === evaluation.audit!.missingPath)) {
        failures.push(`Audit missed broken reference ${evaluation.audit.missingPath}`)
      }
    } catch { failures.push(`Missing or invalid ${evaluation.audit.path}`) }
  }
  return check(failures)
}

async function runArm(evaluation: SkillEvaluationCase, arm: "with-skill" | "no-skill", model: string, evidence: string, frozenSkill: string) {
  const workspace = await mkdtemp(join(tmpdir(), "skill-eval-"))
  try {
    for (const [path, content] of Object.entries(evaluation.files)) {
      const destination = join(workspace, path)
      await mkdir(resolve(destination, ".."), { recursive: true })
      await writeFile(destination, content)
    }
    if (arm === "with-skill") await cp(frozenSkill, join(workspace, "skills/help"), { recursive: true })
    const before = await snapshot(workspace)
    const prompt = arm === "with-skill" ? `Start by reading skills/help/SKILL.md and use its selected skill.\n\n${evaluation.prompt}` : evaluation.prompt
    const primary = await runAgent(workspace, prompt, model, evidence)
    const result = await outcome(workspace, evaluation)
    const after = await snapshot(workspace)
    const changed = changes(before, after)
    const sideEffects = check([
      ...new Set([...changed, ...primary.mutations].filter(path => !evaluation.allowedChanges.includes(path)).map(path => `Disallowed change or write attempt: ${path}`)),
      ...evaluation.requiredChanges.filter(path => !changed.includes(path)).map(path => `Required change missing: ${path}`),
    ])
    const routing = arm === "no-skill" ? check([]) : checkReads(primary.reads, ["skills/help/SKILL.md", ...evaluation.routes], evaluation.forbiddenRoutes)
    const probes = []
    for (const [index, probe] of (evaluation.probes ?? []).entries()) {
      const probeSpace = await mkdtemp(join(tmpdir(), "skill-probe-"))
      const probeEvidence = join(evidence, `probe-${index + 1}`)
      try {
        for (const entry of await readdir(workspace)) {
          if (entry !== "skills") await cp(join(workspace, entry), join(probeSpace, entry), { recursive: true })
        }
        const initial = await snapshot(probeSpace)
        const run = await runAgent(probeSpace, probe.prompt, model, probeEvidence)
        const failures = [...run.runtime.failures, ...checkReads(run.reads, probe.reads ?? [], probe.forbiddenReads).failures]
        if (probe.json) {
          try {
            const actual = JSON.parse(await readFile(join(probeSpace, probe.json.path), "utf8"))
            if (!isDeepStrictEqual(actual, probe.json.value)) failures.push("Generated skill produced the wrong JSON result")
          } catch { failures.push(`Missing or invalid consumer output ${probe.json.path}`) }
        }
        const allowed = probe.json ? [probe.json.path] : []
        for (const path of new Set([...changes(initial, await snapshot(probeSpace)), ...run.mutations])) {
          if (!allowed.includes(path)) failures.push(`Consumer changed ${path}`)
        }
        await cp(probeSpace, join(probeEvidence, "workspace"), { recursive: true })
        probes.push({ ...run, acceptance: check(failures) })
      } finally { await rm(probeSpace, { recursive: true, force: true }) }
    }
    await cp(workspace, join(evidence, "workspace"), { recursive: true })
    return {
      caseId: evaluation.id, arm, primary, probes,
      checks: { outcome: result, sideEffects, routing },
      pass: primary.runtime.pass && result.pass && sideEffects.pass && routing.pass && probes.every(probe => probe.acceptance.pass),
    }
  } finally { await rm(workspace, { recursive: true, force: true }) }
}

async function main() {
  const { model, cases, output } = argumentsForRun()
  await mkdir(output, { recursive: true })
  const directory = await mkdtemp(join(output, "run-"))
  const frozenSkill = join(directory, "skill-snapshot")
  await cp(join(root, "skills/help"), frozenSkill, { recursive: true })
  const sourceHashes = await snapshot(frozenSkill)
  const skillContentHash = hash(JSON.stringify(Object.entries(sourceHashes).sort()))
  const runtime = await command(["omp", "--version"], root, 10_000)
  if (runtime.code !== 0) throw new Error(runtime.stderr)
  await writeFile(join(directory, "cases.json"), `${JSON.stringify(cases, null, 2)}\n`)
  const report = {
    model, thinking: "minimal", maxTimeSeconds, skillContentHash, casesHash: hash(JSON.stringify(cases)),
    runtime: { omp: runtime.stdout.trim(), bun: Bun.version, executable: Bun.which("omp") },
    reports: [] as Awaited<ReturnType<typeof runArm>>[],
  }
  console.log(`Evidence: ${directory}`)
  for (const evaluation of cases) {
    const arms = await Promise.all((["with-skill", "no-skill"] as const).map(arm => runArm(evaluation, arm, model, join(directory, evaluation.id, arm), frozenSkill)))
    report.reports.push(...arms)
    await writeFile(join(directory, "report.json"), `${JSON.stringify(report, null, 2)}\n`)
    console.log(`${evaluation.id}: ${arms.map(arm => `${arm.arm}=${arm.pass ? "PASS" : "FAIL"}`).join(" ")}`)
  }
  const totals = {
    cases: cases.length,
    withSkillPassed: report.reports.filter(arm => arm.arm === "with-skill" && arm.pass).length,
    noSkillPassed: report.reports.filter(arm => arm.arm === "no-skill" && arm.pass).length,
    runtimeFailures: report.reports.filter(arm => !arm.primary.runtime.pass || arm.probes.some(probe => !probe.runtime.pass)).map(arm => `${arm.caseId}/${arm.arm}`),
  }
  await writeFile(join(directory, "report.json"), `${JSON.stringify({ ...report, totals }, null, 2)}\n`)
  console.log(JSON.stringify(totals))
  if (totals.withSkillPassed !== cases.length || totals.runtimeFailures.length) process.exitCode = 1
}

if (import.meta.main) await main().catch(error => { console.error(error); process.exitCode = 1 })
