import type { IncomingMessage, ServerResponse } from "node:http"
import { createHash, randomBytes, randomUUID } from "node:crypto"
import { execFile } from "node:child_process"
import { readFile, rename, writeFile } from "node:fs/promises"
import { relative, resolve, sep } from "node:path"
import { promisify } from "node:util"
import type { Plugin } from "vite"
import * as ts from "typescript"
import { plan } from "./src/plan-data"
import { codeDependencies, type CodeFile, type HydratedCodeDefinition, type HydratedStoryTest, type SourcePosition, type SourceRange, type TestResult } from "./src/review-types"

const execFileAsync = promisify(execFile)
const root = resolve(import.meta.dirname)
const token = randomBytes(24).toString("hex")
const edits: Array<Record<string, unknown>> = []
const testResults = new Map<string, TestResult>()
const failedSaves = new Set<string>()

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex")
const canonicalJson = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
const send = (response: ServerResponse, status: number, value: unknown) => { response.statusCode = status; response.setHeader("content-type", "application/json"); response.end(canonicalJson(value)) }
const readBody = async (request: IncomingMessage) => { const chunks: Array<Buffer> = []; for await (const chunk of request) chunks.push(Buffer.from(chunk)); return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown> }
const positionAt = (source: string, offset: number): SourcePosition => { const prefix = source.slice(0, offset), lastLine = prefix.lastIndexOf("\n"); return { line: prefix.split("\n").length, column: offset - lastLine } }
const offsetAt = (source: string, position: SourcePosition) => source.split("\n").slice(0, position.line - 1).reduce((total, line) => total + line.length + 1, 0) + position.column - 1
const inside = (inner: SourceRange, outer: SourceRange, source: string) => offsetAt(source, inner.start) >= offsetAt(source, outer.start) && offsetAt(source, inner.end) <= offsetAt(source, outer.end)

const declarationRange = (source: string, symbol: string): SourceRange => {
  const parsed = ts.createSourceFile("contract.ts", source, ts.ScriptTarget.Latest, true)
  const declarations = parsed.statements.filter((statement) => {
    if (!ts.canHaveModifiers(statement) || !ts.getModifiers(statement)?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword)) return false
    if (ts.isVariableStatement(statement)) return statement.declarationList.declarations.some(({ name }) => ts.isIdentifier(name) && name.text === symbol)
    return (ts.isClassDeclaration(statement) || ts.isInterfaceDeclaration(statement) || ts.isFunctionDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) && statement.name?.text === symbol
  })
  if (!declarations.length) throw new Error(`Cannot find exported declaration ${symbol}`)
  return { start: positionAt(source, declarations[0].getStart(parsed)), end: positionAt(source, declarations.at(-1)!.end) }
}

const changedRange = (before: string, after: string): SourceRange => {
  let start = 0
  while (start < before.length && start < after.length && before[start] === after[start]) start += 1
  let oldEnd = before.length, newEnd = after.length
  while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd -= 1; newEnd -= 1 }
  return { start: positionAt(before, start), end: positionAt(before, oldEnd) }
}

const filePath = (relativePath: string) => {
  const path = resolve(root, relativePath)
  if (relative(root, path).startsWith(`..${sep}`) || path === root) throw new Error("File leaves the plan root")
  return path
}

interface BootstrapData {
  readonly files: ReadonlyArray<CodeFile>
  readonly storyTests: ReadonlyArray<HydratedStoryTest>
  readonly proposedCode: ReadonlyArray<HydratedCodeDefinition>
}

const evidenceHash = (test: HydratedStoryTest, bootstrap: BootstrapData) => {
  const testFile = bootstrap.files.find(({ fileId }) => fileId === test.fileId)!
  const dependencyFileIds = new Set<string>()
  const dependencies = test.proposedCodeIds.map((id) => {
    const definition = bootstrap.proposedCode.find((item) => item.id === id)!
    const file = bootstrap.files.find(({ fileId }) => fileId === definition.fileId)!
    dependencyFileIds.add(file.fileId)
    return { id, content: file.content.slice(offsetAt(file.content, definition.range.start), offsetAt(file.content, definition.range.end)) }
  })
  const sharedSources = [...dependencyFileIds].map((fileId) => {
    const file = bootstrap.files.find((item) => item.fileId === fileId)!
    const ranges = bootstrap.proposedCode.filter((item) => item.fileId === fileId)
      .map(({ range }) => [offsetAt(file.content, range.start), offsetAt(file.content, range.end)] as const)
      .sort(([a], [b]) => a - b)
    let cursor = 0
    const chunks: string[] = []
    for (const [start, end] of ranges) { chunks.push(file.content.slice(cursor, start)); cursor = end }
    chunks.push(file.content.slice(cursor))
    return { fileId, content: chunks.join("") }
  })
  return sha256(JSON.stringify({ test, content: testFile.content, dependencies, sharedSources }))
}

const currentResults = (bootstrap: BootstrapData) => {
  for (const test of bootstrap.storyTests) {
    const result = testResults.get(test.id)
    if (result?.evidenceHash !== evidenceHash(test, bootstrap)) testResults.delete(test.id)
  }
  return Object.fromEntries(testResults)
}

const loadBootstrap = async () => {
  const codeById = new Map(plan.proposedCode.map((item) => [item.id, item]))
  const dependencyClosure = (ids: ReadonlyArray<string>) => {
    const seen = new Set<string>()
    const visit = (id: string) => {
      if (seen.has(id)) return
      const item = codeById.get(id)
      if (!item) throw new Error(`Unknown proposed-code dependency ${id}`)
      seen.add(id)
      codeDependencies(item).forEach(visit)
    }
    ids.forEach(visit)
    return [...seen]
  }
  const definitions = [...plan.storyTests, ...plan.proposedCode]
  const fileDefinitions = new Map<string, Array<(typeof definitions)[number]>>()
  for (const item of definitions) fileDefinitions.set(item.fileId, [...(fileDefinitions.get(item.fileId) ?? []), item])
  const files: Array<CodeFile> = []
  const storyTests: Array<HydratedStoryTest> = []
  const proposedCode: Array<HydratedCodeDefinition> = []
  for (const [fileId, items] of fileDefinitions) {
    const relativePath = items[0].relativePath
    const content = await readFile(filePath(relativePath), "utf8")
    files.push({ fileId, relativePath, content, contentHash: sha256(content) })
    for (const item of items) {
      if ("storyId" in item) storyTests.push({ ...item, proposedCodeIds: dependencyClosure(item.proposedCodeIds), range: { start: { line: 1, column: 1 }, end: positionAt(content, content.length) } })
      else proposedCode.push({ ...item, range: declarationRange(content, item.symbol) })
    }
  }
  const sourceSnapshotId = sha256(JSON.stringify({ stories: plan.stories, storyTests, proposedCode, files }))
  const bootstrap = { plan, sourceSnapshotId, files, storyTests, proposedCode }
  return { ...bootstrap, testResults: currentResults(bootstrap), failedSaveItemIds: [...failedSaves] }
}

const isAuthorized = (request: IncomingMessage) => {
  const remote = request.socket.remoteAddress
  const loopback = remote === "127.0.0.1" || remote === "::1" || remote === "::ffff:127.0.0.1"
  const origin = request.headers.origin
  return loopback && (origin === undefined || origin === `http://${request.headers.host}`) && request.headers["x-review-token"] === token
}

const saveItem = async (body: Record<string, unknown>) => {
  const key = String(body.itemId)
  try {
    const bootstrap = await loadBootstrap()
    const inventory = body.itemType === "test" ? bootstrap.storyTests : bootstrap.proposedCode
    const item = inventory.find(({ id, fileId }) => id === body.itemId && fileId === body.fileId)
    const file = bootstrap.files.find(({ fileId }) => fileId === body.fileId)
    if (!item || !file || typeof body.content !== "string") throw new Error("Unknown editable item")
    if (body.loadedHash !== file.contentHash) throw new Error("The file changed after Monaco loaded it")
    if (body.content !== file.content) {
      if (!inside(changedRange(file.content, body.content), item.range, file.content)) throw new Error("Changes must stay inside the selected item")
      if (body.itemType === "code") for (const definition of plan.proposedCode.filter(({ fileId }) => fileId === file.fileId)) declarationRange(body.content, definition.symbol)
      const path = filePath(file.relativePath), temporary = `${path}.${process.pid}.tmp`
      await writeFile(temporary, body.content)
      await rename(temporary, path)
      edits.push({ id: randomUUID(), itemId: item.id, fileId: file.fileId, beforeHash: file.contentHash, afterHash: sha256(body.content), createdAt: new Date().toISOString() })
    }
    failedSaves.delete(key)
    return loadBootstrap()
  } catch (error) {
    failedSaves.add(key)
    throw error
  }
}

const runTest = async (body: Record<string, unknown>) => {
  const bootstrap = await loadBootstrap()
  const test = bootstrap.storyTests.find(({ id }) => id === body.testId)
  if (!test) throw new Error("Unknown story test")
  const currentEvidenceHash = evidenceHash(test, bootstrap)
  testResults.delete(test.id)
  let result: TestResult
  try {
    const { stdout, stderr } = await execFileAsync(resolve(root, "node_modules/.bin/vitest"), ["run", test.relativePath], { cwd: root, timeout: 30_000, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" } })
    result = { status: "passed", output: `${stdout}${stderr}`.trim(), evidenceHash: currentEvidenceHash }
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; message?: string }
    result = { status: "failed", output: `${failure.stdout ?? ""}${failure.stderr ?? ""}${failure.message ?? ""}`.trim(), evidenceHash: currentEvidenceHash }
  }
  testResults.set(test.id, result)
  return loadBootstrap()
}

const exportReview = async (body: Record<string, unknown>) => {
  const bootstrap = await loadBootstrap()
  if (body.sourceSnapshotId !== bootstrap.sourceSnapshotId) throw new Error("Source snapshot changed before export")
  if (body.decision !== "approved" && body.decision !== "changes-requested") throw new Error("Choose a review decision")
  if (body.decision === "approved" && failedSaves.size > 0) throw new Error("Resolve failed saves before approval")
  const results = currentResults(bootstrap)
  if (body.decision === "approved" && !bootstrap.storyTests.every(({ id }) => results[id]?.status === "passed")) throw new Error("Run every current story test before approval")
  const artifact = { schemaVersion: "1.0.0", planId: plan.id, sourceSnapshotId: bootstrap.sourceSnapshotId, decision: body.decision, exportedAt: new Date().toISOString(), stories: plan.stories, storyTests: bootstrap.storyTests, proposedCode: bootstrap.proposedCode, files: bootstrap.files, testResults: results, comments: body.comments ?? {}, edits }
  const bytes = canonicalJson(artifact), artifactPath = "review-artifact.json"
  await writeFile(resolve(root, artifactPath), bytes)
  return { artifactPath, bytes }
}

export const reviewServer = (): Plugin => ({
  name: "story-test-review-server",
  transformIndexHtml(html) { return html.replace("</head>", `<meta name="review-session-token" content="${token}"/></head>`) },
  configureServer(server) {
    let pending = Promise.resolve()
    server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith("/api/review/")) return next()
      if (!isAuthorized(request)) return send(response, 403, { error: "Review request denied" })
      const operation = pending.then(async () => {
        try {
          if (request.method === "GET" && request.url === "/api/review/bootstrap") return send(response, 200, await loadBootstrap())
          if (request.method === "POST" && request.url === "/api/review/save") return send(response, 200, await saveItem(await readBody(request)))
          if (request.method === "POST" && request.url === "/api/review/run-test") return send(response, 200, await runTest(await readBody(request)))
          if (request.method === "POST" && request.url === "/api/review/export") return send(response, 200, await exportReview(await readBody(request)))
          return send(response, 404, { error: "Unknown review route" })
        } catch (error) {
          return send(response, 422, { error: error instanceof Error ? error.message : String(error) })
        }
      })
      pending = operation.catch(() => {})
      return operation
    })
  },
})
