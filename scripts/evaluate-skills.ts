import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { isDeepStrictEqual, parseArgs } from "node:util"
import { tmpdir } from "node:os"
import { join, relative, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { skillEvaluationCases, type SkillEvaluationCase } from "../evals/skills/cases.ts"
import { pairedChanges, summarize } from "./evaluation-metrics.ts"

const root = resolve(import.meta.dir, "..")
const maxTimeSeconds = 120
const systemPrompt = "Work only in the isolated workspace using its provided files and tools. Complete the requested artifact without adding support files. The evaluator will run code acceptance checks and test generated skills in separate fresh contexts after your turn. Do not claim verification that you could not perform."

type Block = { type: string; id?: string; name?: string; arguments?: Record<string, unknown>; text?: string }
type Message = { role: string; content: Block[]; provider?: string; model?: string; usage?: unknown; stopReason?: string }
type Event = { type: string; message?: Message; toolCallId?: string; isError?: boolean; isTerminal?: boolean; result?: { details?: { path?: string } } }
type Check = { pass: boolean; failures: string[] }
const check = (failures: string[]): Check => ({ pass: failures.length === 0, failures })
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex")

export function checkReads(reads: string[], required: string[], forbidden: string[] = []): Check {
  return check([
    ...required.filter(path => !reads.includes(path)).map(path => `Required file was not loaded: ${path}`),
    ...forbidden.filter(path => reads.includes(path)).map(path => `Unrelated workflow was loaded: ${path}`),
  ])
}

async function argumentsForRun() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      model: { type: "string" }, case: { type: "string" }, output: { type: "string" },
      baseline: { type: "string" }, repeats: { type: "string", default: "1" },
    },
  })
  const baseline = values.baseline ? resolve(values.baseline) : null
  const previous = baseline ? JSON.parse(await readFile(join(baseline, "report.json"), "utf8")) : null
  const suite: SkillEvaluationCase[] = baseline
    ? JSON.parse(await readFile(join(baseline, "cases.json"), "utf8")) : skillEvaluationCases
  if (previous && hash(JSON.stringify(suite)) !== previous.casesHash) throw new Error("Baseline cases changed since recording")
  const model = values.model ?? previous?.model
  if (!model) throw new Error("--model <provider/model> is required")
  if (previous && model !== previous.model) throw new Error("Use the baseline model to isolate the skill change")
  const repeats = Number(values.repeats)
  if (!Number.isSafeInteger(repeats) || repeats < 1) throw new Error("--repeats must be a positive integer")
  const cases = suite.filter(item => !values.case || item.id === values.case)
  if (!cases.length) throw new Error(`Unknown case: ${values.case}`)
  return { model: model as string, cases, repeats, baseline, previous, output: resolve(values.output ?? join(root, ".scratch/skill-evals")) }
}

export async function snapshot(directory: string, prefix = ""): Promise<Record<string, string>> {
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

export async function command(args: string[], cwd: string, timeoutMs: number) {
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

function toolPaths(workspace: string, block: Block, resolvedPath?: string) {
  const args = block.arguments ?? {}
  const paths = resolvedPath ? [resolvedPath] : typeof args.path === "string" ? args.path.split(/;\s*/) : []
  if (block.name === "edit" && typeof args.input === "string") {
    if (!resolvedPath) paths.push(...Array.from(args.input.matchAll(/^\[([^[\]#\n]+)#[A-F0-9]{4}\]/gm), match => match[1]!))
    paths.push(...Array.from(args.input.matchAll(/^MV (.+)$/gm), match => match[1]!))
  }
  return paths.map(path => relative(workspace, resolve(workspace, path.replace(/(\.(?:md|ts|json))[:?#].*$/, "$1"))).replaceAll("\\", "/"))
}

export async function runAgent(
  workspace: string, prompt: string, model: string, evidence: string, instructions = systemPrompt,
  options: { tools?: string; thinking?: string; maxTimeSeconds?: number } = {},
) {
  const limit = options.maxTimeSeconds ?? maxTimeSeconds
  await mkdir(evidence, { recursive: true })
  const start = performance.now()
  const result = await command([
    "omp", "-p", prompt, "--mode", "json", "--model", model, "--thinking", options.thinking ?? "minimal",
    "--no-session", "--no-skills", "--no-rules", "--no-extensions", "--no-title", "--no-lsp", "--no-pty",
    "--tools", options.tools ?? "read,write,edit,grep,glob", "--system-prompt", instructions, "--max-time", String(limit),
  ], workspace, (limit + 20) * 1_000)
  await writeFile(join(evidence, "transcript.jsonl"), result.stdout)
  await writeFile(join(evidence, "stderr.txt"), result.stderr)
  const failures: string[] = []
  let events: Event[] = []
  try { events = result.stdout.trim().split(/\r?\n/).map(line => JSON.parse(line)) }
  catch { failures.push("Invalid or missing omp JSONL") }
  const messages = events.filter(event => event.type === "message_end" && event.message?.role === "assistant").map(event => event.message!)
  const successes = new Set(events.filter(event => event.type === "tool_execution_end" && !event.isError).map(event => event.toolCallId))
  // Successful edits can normalize their headers. Their returned path is authoritative.
  const resolvedPaths = new Map(events.filter(event => event.type === "tool_execution_end" && !event.isError && typeof event.result?.details?.path === "string").map(event => [event.toolCallId, event.result!.details!.path!]))
  const calls = messages.flatMap(message => message.content.filter(block => block.type === "toolCall"))
  const reads = calls.filter(call => call.name === "read" && successes.has(call.id)).flatMap(call => toolPaths(workspace, call))
  const mutations = calls.filter(call => call.name === "write" || call.name === "edit").flatMap(call => toolPaths(workspace, call, resolvedPaths.get(call.id)))
  const models = [...new Set(messages.map(message => `${message.provider}/${message.model}`))]
  if (result.timedOut || result.code !== 0) failures.push(`omp ${result.timedOut ? "timed out" : `exited ${result.code}`}`)
  if (!events.some(event => event.type === "agent_end" && event.isTerminal)) failures.push("No terminal agent result")
  if (messages.at(-1)?.stopReason !== "stop") failures.push("No completed assistant turn")
  if (models.length !== 1 || models[0] !== model) failures.push(`Requested ${model}; observed ${models.join(", ") || "no model"}`)
  return {
    runtime: check(failures), models, reads, mutations,
    toolCalls: calls.length,
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

async function runArm(evaluation: SkillEvaluationCase, arm: string, model: string, evidence: string, frozenSkill: string | null, repeat: number) {
  const workspace = await mkdtemp(join(tmpdir(), "skill-eval-"))
  try {
    for (const [path, content] of Object.entries(evaluation.files)) {
      const destination = join(workspace, path)
      await mkdir(resolve(destination, ".."), { recursive: true })
      await writeFile(destination, content)
    }
    if (frozenSkill) await cp(frozenSkill, join(workspace, "skills/help"), { recursive: true })
    const before = await snapshot(workspace)
    const prompt = frozenSkill ? `Start by reading skills/help/SKILL.md and use its selected skill.\n\n${evaluation.prompt}` : evaluation.prompt
    const primary = await runAgent(workspace, prompt, model, evidence)
    const result = await outcome(workspace, evaluation)
    const after = await snapshot(workspace)
    const changed = changes(before, after)
    const sideEffects = check([
      ...new Set([...changed, ...primary.mutations].filter(path => !evaluation.allowedChanges.includes(path)).map(path => `Disallowed change or write attempt: ${path}`)),
      ...evaluation.requiredChanges.filter(path => !changed.includes(path)).map(path => `Required change missing: ${path}`),
    ])
    const routing = frozenSkill ? checkReads(primary.reads, ["skills/help/SKILL.md", ...evaluation.routes], evaluation.forbiddenRoutes) : check([])
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
    const taskPass = primary.runtime.pass && result.pass && sideEffects.pass && probes.every(probe => probe.acceptance.pass)
    return {
      caseId: evaluation.id, arm, repeat, primary, probes,
      checks: { outcome: result, sideEffects, routing },
      taskPass, pass: taskPass && routing.pass,
    }
  } finally { await rm(workspace, { recursive: true, force: true }) }
}

function behaviorCase(evaluation: SkillEvaluationCase) {
  return Boolean(evaluation.runtime || evaluation.audit || evaluation.probes?.length || evaluation.requiredChanges.length)
}

type ArmResult = Awaited<ReturnType<typeof runArm>>

function metrics(runs: ArmResult[], taskOnly = false) {
  const summary = summarize(runs.map(run => {
    const executions = [run.primary, ...run.probes]
    return {
      caseId: run.caseId, family: run.caseId, pass: taskOnly ? run.taskPass : run.pass,
      execution: {
        usage: executions.every(execution => execution.usage.length) ? executions.flatMap(execution => execution.usage) : [],
        durationMs: executions.reduce((sum, execution) => sum + execution.durationMs, 0),
        toolCalls: executions.reduce((sum, execution) => sum + execution.toolCalls, 0),
      },
    }
  }))
  const groups = Object.values(summary.families)
  return {
    ...summary, successRate: summary.runs ? summary.passed / summary.runs : null,
    casesPassingAnyAttempt: groups.filter(group => group.passed > 0).length,
    casesPassingEveryAttempt: groups.filter(group => group.passed === group.runs).length,
  }
}

function comparison(reports: ArmResult[], baselineArm: string, cases: SkillEvaluationCase[]) {
  const taskOnly = baselineArm === "no-skill"
  const eligible = new Set(cases.filter(item => !taskOnly || behaviorCase(item)).map(item => item.id))
  const baseline = reports.filter(run => run.arm === baselineArm && eligible.has(run.caseId))
  const candidate = reports.filter(run => run.arm === "with-skill" && eligible.has(run.caseId))
  const pairs = baseline.flatMap(before => {
    const after = candidate.find(run => run.caseId === before.caseId && run.repeat === before.repeat)
    return after ? [{
      caseId: before.caseId,
      baseline: taskOnly ? before.taskPass : before.pass,
      candidate: taskOnly ? after.taskPass : after.pass,
    }] : []
  })
  const before = metrics(baseline, taskOnly)
  const after = metrics(candidate, taskOnly)
  const difference = (a: number | null | undefined, b: number | null | undefined) => a == null || b == null ? null : b - a
  return {
    ...pairedChanges(pairs),
    baseline: before, candidate: after,
    deltas: {
      tokensPerSuccess: difference(before.tokensPerSuccess, after.tokensPerSuccess),
      dollarsPerSuccess: difference(before.dollarsPerSuccess, after.dollarsPerSuccess),
      p95Ms: difference(before.p95Ms, after.p95Ms),
    },
  }
}

async function main() {
  const { model, cases, output, repeats, baseline, previous } = await argumentsForRun()
  const contentHash = async (path: string) => hash(JSON.stringify(Object.entries(await snapshot(path)).sort()))
  if (baseline && await contentHash(join(baseline, "skill-snapshot")) !== previous.skillContentHash) {
    throw new Error("Baseline skill snapshot changed since recording")
  }
  await mkdir(output, { recursive: true })
  const directory = await mkdtemp(join(output, "run-"))
  const frozenSkill = join(directory, "skill-snapshot")
  const copyOptions = { recursive: true, filter: (source: string) => !source.split(/[\\/]/).includes("evals") }
  await cp(join(root, "skills/help"), frozenSkill, copyOptions)
  const arms: Record<string, string | null> = { "with-skill": frozenSkill, "no-skill": null }
  if (baseline) {
    arms.baseline = join(directory, "baseline-snapshot")
    await cp(join(baseline, "skill-snapshot"), arms.baseline, copyOptions)
  }
  const runtime = await command(["omp", "--version"], root, 10_000)
  if (runtime.code !== 0) throw new Error(runtime.stderr)
  await writeFile(join(directory, "cases.json"), `${JSON.stringify(cases, null, 2)}\n`)
  const report = {
    model, thinking: "minimal", maxTimeSeconds, repeats,
    skillContentHash: await contentHash(frozenSkill), casesHash: hash(JSON.stringify(cases)),
    baseline: baseline ? { directory: baseline, skillContentHash: await contentHash(arms.baseline!) } : null,
    runtime: { omp: runtime.stdout.trim(), bun: Bun.version, executable: Bun.which("omp") },
    evaluatorHashes: await Promise.all(["scripts/evaluate-skills.ts", "scripts/evaluation-metrics.ts"].map(async path => [path, hash(await readFile(join(root, path)))])),
    rule: "Every candidate attempt must pass; any runtime failure in any arm makes the result incomplete. Baseline quality failures are diagnostic, not a gate.",
    status: "running",
    reports: [] as ArmResult[],
  }
  const save = () => writeFile(join(directory, "report.json"), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Evidence: ${directory}`)
  await save()
  for (let repeat = 0; repeat < repeats; repeat++) {
    for (const evaluation of cases) {
      const names = Object.keys(arms).filter(arm => arm !== "no-skill" || behaviorCase(evaluation))
      const order = [...names.slice(repeat % names.length), ...names.slice(0, repeat % names.length)]
      const paired = await Promise.all(order.map(arm => runArm(evaluation, arm, model, join(directory, `${evaluation.id}-${repeat + 1}`, arm), arms[arm]!, repeat)))
      report.reports.push(...paired)
      await save()
      console.log(`${evaluation.id}/${repeat + 1}: ${paired.map(arm => `${arm.arm}=${arm.pass ? "PASS" : "FAIL"}`).join(" ")}`)
    }
  }
  const summaries = Object.fromEntries(Object.keys(arms).map(arm => [arm, metrics(report.reports.filter(run => run.arm === arm))]))
  const comparisons = Object.fromEntries(Object.keys(arms).filter(arm => arm !== "with-skill").map(arm => [arm, comparison(report.reports, arm, cases)]))
  const runtimeFailures = report.reports.filter(arm => !arm.primary.runtime.pass || arm.probes.some(probe => !probe.runtime.pass)).map(arm => `${arm.caseId}/${arm.repeat + 1}/${arm.arm}`)
  const passed = summaries["with-skill"]!.passed === cases.length * repeats
  report.status = runtimeFailures.length ? "incomplete" : passed ? "pass" : "fail"
  await writeFile(join(directory, "report.json"), `${JSON.stringify({ ...report, summaries, comparisons, runtimeFailures }, null, 2)}\n`)
  const format = (value: number | null | undefined) => value == null ? "unavailable" : value.toFixed(1)
  const lines = [
    `Result: ${report.status}`,
    ...Object.entries(summaries).map(([arm, summary]) => `${arm}: ${summary.passed}/${summary.runs} passed; tokens/success ${format(summary.tokensPerSuccess)}; reported $/success ${summary.reportedDollars === null ? "unpriced" : summary.dollarsPerSuccess ?? "unavailable"}; p95 ${format(summary.p95Ms)} ms; all attempts passed in ${summary.casesPassingEveryAttempt}/${Object.keys(summary.families).length} cases`),
    ...Object.entries(comparisons).flatMap(([arm, result]) => [
      `Candidate vs ${arm}: ${result.wins} wins, ${result.losses} losses, ${result.ties} ties; success delta ${format(result.successRateDelta === null ? null : result.successRateDelta * 100)} pp; 95% bound ${result.confidence95?.map(value => (value * 100).toFixed(1)).join(" to ") ?? "unavailable"} pp`,
      `  delta tokens/success ${format(result.deltas.tokensPerSuccess)}; delta reported $/success ${result.deltas.dollarsPerSuccess ?? "unavailable"}; delta p95 ${format(result.deltas.p95Ms)} ms`,
      `  regressions: ${result.regressions.join(", ") || "none"}`,
    ]),
    "Routing-only cases exclude no-skill. No-skill comparisons score outcomes, not internal routing.",
    "95% bounds assume independent paired attempts on these fixed cases; they do not establish general skill quality.",
  ]
  await writeFile(join(directory, "summary.txt"), `${lines.join("\n")}\n`)
  console.log(lines.join("\n"))
  if (report.status !== "pass") process.exitCode = 1
}

if (import.meta.main) await main().catch(error => { console.error(error); process.exitCode = 1 })
