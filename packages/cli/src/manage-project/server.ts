import { createReadStream, existsSync, watch } from "node:fs"
import { createServer } from "node:http"
import type { AddressInfo } from "node:net"
import { basename, dirname, extname, join, resolve } from "node:path"
import { type Action, readProject, updateProject } from "./project"

const mime: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
}

const readBody = (req: NodeJS.ReadableStream) =>
  new Promise<string>((ok) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => chunks.push(chunk as Buffer))
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")))
  })

export const startServer = async (options: {
  record: string
  port: number
  webRoot: string
}) => {
  const recordPath = resolve(options.record)
  const webRoot = resolve(options.webRoot)
  const clients = new Set<(payload: string) => void>()

  const notify = () => {
    for (const send of clients) send("project")
  }

  const load = async () => {
    if (!existsSync(recordPath)) return undefined
    return await readProject(recordPath)
  }

  watch(dirname(recordPath), (_event, filename) => {
    if (filename === basename(recordPath)) notify()
  })

  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://127.0.0.1")

      if (url.pathname === "/api/project" && req.method === "GET") {
        const project = await load()
        if (!project) {
          res.writeHead(404, { "content-type": "application/json; charset=utf-8" })
          res.end(JSON.stringify({ error: "project record is missing" }))
          return
        }
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" })
        res.end(JSON.stringify(project))
        return
      }

      if (url.pathname === "/api/action" && req.method === "POST") {
        const action = JSON.parse(await readBody(req)) as Action
        const next = await updateProject(recordPath, action)
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" })
        res.end(JSON.stringify(next))
        return
      }

      if (url.pathname === "/events") {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-cache",
          connection: "keep-alive"
        })
        const send = (payload: string) => {
          res.write(`data: ${payload}\n\n`)
        }
        clients.add(send)
        send("project")
        req.on("close", () => {
          clients.delete(send)
        })
        return
      }

      const relative = url.pathname === "/" ? "/index.html" : url.pathname
      const filePath = join(webRoot, relative)
      if (!filePath.startsWith(webRoot) || !existsSync(filePath)) {
        res.writeHead(404)
        res.end("not found")
        return
      }
      res.writeHead(200, {
        "content-type": mime[extname(filePath)] ?? "application/octet-stream"
      })
      createReadStream(filePath).pipe(res)
    })().catch((error: unknown) => {
      if (res.headersSent) {
        res.destroy()
        return
      }
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" })
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
    })
  })

  await new Promise<void>((ready) => server.listen(options.port, "127.0.0.1", ready))
  return { port: (server.address() as AddressInfo).port }
}
