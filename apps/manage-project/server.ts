import { watch } from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import { applyAction, type Action, readProject, writeProject } from "./project.ts"

const mime: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
}

export const startServer = (options: {
  record: string
  port: number
  webRoot: string
}) => {
  const recordPath = resolve(options.record)
  const webRoot = resolve(options.webRoot)
  const clients = new Set<(payload: string) => void>()

  const notify = (kind: "project" | "reload") => {
    for (const send of clients) send(kind)
  }

  const load = async () => {
    if (!(await Bun.file(recordPath).exists())) return undefined
    return await readProject(recordPath)
  }

  watch(dirname(recordPath), (event, filename) => {
    if (filename === basename(recordPath)) notify("project")
  })
  watch(webRoot, { recursive: true }, () => notify("reload"))

  return Bun.serve({
    port: options.port,
    async fetch(request) {
      const url = new URL(request.url)

      if (url.pathname === "/api/project" && request.method === "GET") {
        const project = await load()
        if (!project) return Response.json({ error: "project record is missing" }, { status: 404 })
        return Response.json(project)
      }

      if (url.pathname === "/api/action" && request.method === "POST") {
        try {
          const action = (await request.json()) as Action
          const next = applyAction(await load(), action)
          await writeProject(recordPath, next)
          return Response.json(next)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          return Response.json({ error: message }, { status: 400 })
        }
      }

      if (url.pathname === "/events") {
        let send: (payload: string) => void
        const stream = new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder()
            send = (payload) => controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
            clients.add(send)
            send("project")
          },
          cancel() {
            clients.delete(send)
          }
        })
        return new Response(stream, {
          headers: {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            connection: "keep-alive"
          }
        })
      }

      const relative = url.pathname === "/" ? "/index.html" : url.pathname
      const filePath = join(webRoot, relative)
      if (!filePath.startsWith(webRoot)) return new Response("not found", { status: 404 })
      const file = Bun.file(filePath)
      if (!(await file.exists())) return new Response("not found", { status: 404 })
      const ext = relative.slice(relative.lastIndexOf("."))
      return new Response(file, { headers: { "content-type": mime[ext] ?? "application/octet-stream" } })
    }
  })
}
