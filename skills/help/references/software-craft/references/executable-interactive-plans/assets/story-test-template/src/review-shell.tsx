import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { codeCategories, codeDependencies, type Bootstrap, type CodeFile, type SourceRange, type TestResult } from "./review-types"

self.MonacoEnvironment = { getWorker(_: string, label: string) { return label === "typescript" || label === "javascript" ? new tsWorker() : new editorWorker() } }
const token = document.querySelector<HTMLMetaElement>('meta[name="review-session-token"]')?.content ?? ""

const request = async <T,>(path: string, body?: unknown): Promise<T> => {
  const response = await fetch(path, { method: body === undefined ? "GET" : "POST", headers: { "content-type": "application/json", "x-review-token": token }, body: body === undefined ? undefined : JSON.stringify(body) })
  const value = await response.json()
  if (!response.ok) throw new Error(value.error ?? `Request failed: ${response.status}`)
  return value
}

const Status = ({ result }: { readonly result?: Pick<TestResult, "status"> }) => <span className={`status-badge ${result?.status ?? "not-run"}`}>{result?.status === "passed" ? "Passed" : result?.status === "failed" ? "Failed" : "Not run"}</span>

interface ReviewActions {
  readonly onData: (data: Bootstrap) => void
  readonly onDirty: (dirty: boolean) => void
  readonly onBusy: (busy: boolean) => void
  readonly onError: (error: unknown) => void
}

interface EditorPaneProps extends ReviewActions {
  readonly item: { readonly id: string; readonly label: string; readonly range: SourceRange }
  readonly itemType: "test" | "code"
  readonly file: CodeFile
  readonly header: ReactNode
  readonly busy: boolean
  readonly retryRequired: boolean
}

const EditorPane = ({ item, itemType, file, header, busy, retryRequired, onData, onDirty, onBusy, onError }: EditorPaneProps) => {
  const host = useRef<HTMLDivElement>(null)
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [dirty, setDirty] = useState(false)
  const [failed, setFailed] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!host.current) return
    const model = monaco.editor.createModel(file.content, "typescript", monaco.Uri.parse(`file:///${file.relativePath}`))
    const instance = monaco.editor.create(host.current, { model, theme: "vs-dark", automaticLayout: true, autoIndent: "none", minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false })
    const selection = itemType === "test" ? new monaco.Range(1, 1, 1, 1) : new monaco.Range(item.range.start.line, item.range.start.column, item.range.end.line, item.range.end.column)
    instance.setSelection(selection)
    instance.revealLineInCenter(selection.startLineNumber)
    instance.focus()
    setDirty(false)
    onDirty(false)
    instance.onDidChangeModelContent(() => { const changed = instance.getValue() !== file.content; setDirty(changed); onDirty(changed) })
    editor.current = instance
    return () => { instance.dispose(); model.dispose(); editor.current = null; onDirty(false) }
  }, [file.content, file.relativePath, item.id, item.range.end.column, item.range.end.line, item.range.start.column, item.range.start.line, itemType, onDirty])

  useEffect(() => { editor.current?.updateOptions({ readOnly: busy }) }, [busy])

  const save = async () => {
    onBusy(true)
    setMessage("Saving…")
    try {
      const data = await request<Bootstrap>("/api/review/save", { itemType, itemId: item.id, fileId: file.fileId, loadedHash: file.contentHash, content: editor.current?.getValue() })
      setDirty(false); setFailed(false); onDirty(false)
      setMessage("Saved. Run affected tests again.")
      onData(data)
    } catch (error) { setFailed(true); setMessage(String(error)); onError(error) }
    finally { onBusy(false) }
  }
  const reload = async () => {
    onBusy(true)
    try { onData(await request<Bootstrap>("/api/review/bootstrap")); setMessage("Source reloaded. Retry this save to resolve it."); setFailed(true) }
    catch (error) { setMessage(String(error)); onError(error) }
    finally { onBusy(false) }
  }

  return <section className="code-pane"><header>{header}<button className="primary-action" disabled={busy || (!dirty && !failed && !retryRequired)} onClick={() => void save()}>Save proposed code</button>{dirty && <button disabled={busy} onClick={() => editor.current?.setValue(file.content)}>Discard edits</button>}{(failed || retryRequired) && <button  disabled={busy || dirty} onClick={() => void reload()}>Reload source</button>}</header><div className="editor" ref={host}/><p className="code-message" aria-live="polite">{message}</p></section>
}

interface StoryTestsViewProps extends ReviewActions {
  readonly data: Bootstrap
  readonly storyId: string
  readonly testId: string
  readonly busy: boolean
  readonly dirty: boolean
  readonly onStory: (id: string) => void
  readonly onTest: (id: string) => void
  readonly onCode: (id: string) => void
}

const StoryTestsView = ({ data, storyId, testId, busy, dirty, onStory, onTest, onCode, ...actions }: StoryTestsViewProps) => {
  const story = data.plan.stories.find(({ id }) => id === storyId) ?? data.plan.stories[0]
  const tests = data.storyTests.filter((test) => test.storyId === story.id)
  const test = tests.find(({ id }) => id === testId) ?? tests[0]
  const file = data.files.find(({ fileId }) => fileId === test.fileId)!
  const results = data.testResults
  const run = async () => {
    actions.onBusy(true)
    try { actions.onData(await request<Bootstrap>("/api/review/run-test", { testId: test.id })) }
    catch (error) { actions.onError(error) }
    finally { actions.onBusy(false) }
  }
  const header = <div><p className="section-label">Story test</p><h2>{test.label}</h2><p>{file.relativePath}</p><div className="dependency-links">Exercises {test.proposedCodeIds.map((id) => <button key={id} disabled={busy || dirty} onClick={() => onCode(id)}>{data.proposedCode.find((item) => item.id === id)?.label}{test.assertedErrorIds?.includes(id) ? " (asserted Error)" : ""}</button>)}</div><div className="test-actions"><button disabled={busy || dirty} onClick={() => void run()}>{busy ? "Running…" : "Run test"}</button><Status result={results[test.id]} /></div></div>

  return <div className="test-workspace">
    <nav className="story-rail" aria-label="User stories">{data.plan.stories.map((item) => { const storyTests = data.storyTests.filter((test) => test.storyId === item.id), passed = storyTests.length > 0 && storyTests.every((test) => results[test.id]?.status === "passed"); return <button key={item.id} disabled={busy || dirty} aria-current={item.id === story.id ? "page" : undefined} onClick={() => onStory(item.id)}><span>{item.label}</span><Status result={passed ? { status: "passed" } : undefined}/></button> })}</nav>
    <aside className="test-list"><p className="section-label">{story.label}</p><h2>{story.outcome}</h2>{tests.map((item) => <button key={item.id} disabled={busy || dirty} aria-current={item.id === test.id ? "page" : undefined} onClick={() => onTest(item.id)}><span>{item.label}</span><Status result={results[item.id]} /></button>)}</aside>
    <div className="test-editor"><EditorPane item={test} itemType="test" file={file} header={header} busy={busy} retryRequired={data.failedSaveItemIds.includes(test.id)} {...actions}/><section className={`test-output ${results[test.id]?.status ?? "not-run"}`}><h3>Test result</h3><pre>{results[test.id]?.output || "Run this test to generate inputs and check the story property."}</pre></section></div>
  </div>
}

interface ProposedCodeViewProps extends ReviewActions {
  readonly data: Bootstrap
  readonly codeId: string
  readonly busy: boolean
  readonly dirty: boolean
  readonly onCode: (id: string) => void
  readonly onTest: (id: string) => void
}

const ProposedCodeView = ({ data, codeId, busy, dirty, onCode, onTest, ...actions }: ProposedCodeViewProps) => {
  const item = data.proposedCode.find(({ id }) => id === codeId) ?? data.proposedCode[0]
  const file = data.files.find(({ fileId }) => fileId === item.fileId)!
  const affected = data.storyTests.filter(({ proposedCodeIds }) => proposedCodeIds.includes(item.id))
  const groups = useMemo(() => codeCategories.map((category) => ({ category, items: data.proposedCode.filter((entry) => entry.category === category) })).filter((group) => group.items.length > 0), [data.proposedCode])
  const header = <div><p className="section-label">{item.category}</p><h2>{item.label}</h2><p>{file.relativePath} · lines {item.range.start.line}–{item.range.end.line}</p><div className="dependency-links">Depends on {codeDependencies(item).map((id) => <button key={id} disabled={busy || dirty} onClick={() => onCode(id)}>{data.proposedCode.find((entry) => entry.id === id)?.label}</button>)}</div><div className="dependency-links">Tested by {affected.map((test) => <button key={test.id} disabled={busy || dirty} onClick={() => onTest(test.id)}>{test.label} · {data.testResults[test.id]?.status ?? "not run"}</button>)}</div></div>
  return <div className="code-view"><aside className="code-list"><h2>Proposed Code</h2>{groups.map((group) => <section key={group.category}><h3>{group.category === "EffectfulFunction" ? "Effectful functions" : `${group.category}s`}</h3>{group.items.map((entry) => <button key={entry.id} disabled={busy || dirty} aria-current={entry.id === item.id ? "page" : undefined} onClick={() => onCode(entry.id)}><span>{entry.label}</span><small>{entry.relativePath}</small></button>)}</section>)}</aside><EditorPane item={item} itemType="code" file={file} header={header} busy={busy} retryRequired={data.failedSaveItemIds.includes(item.id)} {...actions}/></div>
}

export const ReviewShell = () => {
  const [data, setData] = useState<Bootstrap | null>(null)
  const [tab, setTab] = useState<"tests" | "code">("tests")
  const [storyId, setStoryId] = useState("")
  const [testId, setTestId] = useState("")
  const [codeId, setCodeId] = useState("")
  const [decision, setDecision] = useState("")
  const [message, setMessage] = useState("")
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const acceptData = useCallback((next: Bootstrap) => { setData(next); setDecision(""); setUnavailable(false) }, [])
  const onDirty = useCallback((value: boolean) => { setDirty(value); if (value) setDecision("") }, [])
  const onError = useCallback((error: unknown) => { setMessage(String(error)); setUnavailable(true); setDecision("") }, [])

  useEffect(() => { void request<Bootstrap>("/api/review/bootstrap").then((next) => { acceptData(next); setStoryId(next.plan.stories[0].id); setTestId(next.storyTests[0].id); setCodeId(next.proposedCode[0].id) }).catch(onError) }, [acceptData, onError])
  if (!data) return <div className="loading">{message || "Loading executable plan…"}</div>

  const chooseStory = (id: string) => { setStoryId(id); setTestId(data.storyTests.find((test) => test.storyId === id)!.id) }
  const chooseTest = (id: string) => { const test = data.storyTests.find((item) => item.id === id)!; setStoryId(test.storyId); setTestId(id); setTab("tests") }
  const chooseCode = (id: string) => { setCodeId(id); setTab("code") }
  const allPassed = data.storyTests.length > 0 && data.storyTests.every(({ id }) => data.testResults[id]?.status === "passed")
  const canApprove = allPassed && !data.failedSaveItemIds.length && !dirty && !busy && !unavailable
  const actions = { onData: acceptData, onDirty, onBusy: setBusy, onError }

  const exportReview = async () => {
    setBusy(true)
    try {
      const result = await request<{ artifactPath: string; bytes: string }>("/api/review/export", { decision, sourceSnapshotId: data.sourceSnapshotId, comments: {} })
      const url = URL.createObjectURL(new Blob([result.bytes], { type: "application/json" })), anchor = document.createElement("a")
      anchor.href = url; anchor.download = result.artifactPath; anchor.click(); URL.revokeObjectURL(url)
      setMessage(`Saved and downloaded ${result.artifactPath}`)
    } catch (error) { onError(error) }
    finally { setBusy(false) }
  }

  return <div className="review-app"><header className="app-header"><div><p className="section-label">Executable plan · {data.plan.version}</p><h1>{data.plan.title}</h1><p>{data.plan.description}</p></div><code>{data.sourceSnapshotId.slice(0, 12)}</code></header><nav className="tabs" aria-label="Review sections"><button  disabled={busy || dirty} aria-current={tab === "tests" ? "page" : undefined} onClick={() => setTab("tests")}>Story Tests</button><button  disabled={busy || dirty} aria-current={tab === "code" ? "page" : undefined} onClick={() => setTab("code")}>Proposed Code</button></nav><main>{tab === "tests" ? <StoryTestsView data={data} storyId={storyId} testId={testId} busy={busy} dirty={dirty} onStory={chooseStory} onTest={setTestId} onCode={chooseCode} {...actions}/> : <ProposedCodeView data={data} codeId={codeId} busy={busy} onCode={setCodeId} onTest={chooseTest} {...actions} dirty={dirty}/>}</main><footer className="decision-bar"><div><strong>{dirty ? "Save or reload the edited source" : data.failedSaveItemIds.length ? `Resolve failed saves: ${data.failedSaveItemIds.join(", ")}` : allPassed ? "All story tests pass" : "Run every story test before approval"}</strong><span aria-live="polite">{message}</span></div><div><select aria-label="Review decision" value={decision} disabled={busy || dirty} onChange={(event) => setDecision(event.target.value)}><option value="">Choose decision…</option><option value="changes-requested">Changes requested</option><option value="approved" disabled={!canApprove}>Approved</option></select><button className="primary-action" disabled={!decision || busy || dirty || (decision === "approved" && !canApprove)} onClick={() => void exportReview()}>Export review</button></div></footer></div>
}
