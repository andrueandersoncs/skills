import { spawnSync } from "node:child_process"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "node:fs"
import { basename, dirname, join, relative, resolve, sep } from "node:path"
import { Schema } from "effect"

export const RAW = "raw"
export const INDEX = "README.md"
export const SCHEMA = "AGENTS.md"

const LINK = /\[([^\]]*)\]\(([^)]+)\)/g

const AGENTS = `# Wiki

Human curates sources in \`raw/\`, sets direction, and asks questions.
LLM writes and maintains every wiki page.

- Treat \`raw/\` as immutable.
- Cite sources with relative Markdown links.
- Use relative Markdown links such as \`[Page](page.md)\`, not wikilinks.
- \`README.md\` is the index. Update it when pages change.
- Git history is the log. One commit per wiki-changing operation.
`

const README = `# Wiki

## Pages

None yet.
`

export const Source = Schema.Struct({
  path: Schema.String
})
export type Source = typeof Source.Type

export const Page = Schema.Struct({
  path: Schema.String
})
export type Page = typeof Page.Type

export const Citation = Schema.Struct({
  page: Schema.String,
  href: Schema.String,
  source: Schema.String
})
export type Citation = typeof Citation.Type

export const CrossLink = Schema.Struct({
  from: Schema.String,
  href: Schema.String,
  to: Schema.String
})
export type CrossLink = typeof CrossLink.Type

export const Wiki = Schema.Struct({
  root: Schema.String,
  sources: Schema.Array(Source),
  pages: Schema.Array(Page),
  citations: Schema.Array(Citation),
  links: Schema.Array(CrossLink)
})
export type Wiki = typeof Wiki.Type

export const Ingest = Schema.Struct({
  source: Source,
  action: Schema.Literals(["copied", "already-in-raw", "exists"])
})
export type Ingest = typeof Ingest.Type

export const LintReport = Schema.Struct({
  brokenCitations: Schema.Array(Citation),
  brokenLinks: Schema.Array(CrossLink),
  missing: Schema.Array(Schema.String),
  orphans: Schema.Array(Page)
})
export type LintReport = typeof LintReport.Type

export const CompactReport = Schema.Struct({
  rootPages: Schema.Array(Page),
  directories: Schema.Array(
    Schema.Struct({
      dir: Schema.String,
      hasIndex: Schema.Boolean
    })
  ),
  largest: Schema.Array(
    Schema.Struct({
      page: Page,
      lines: Schema.Number
    })
  )
})
export type CompactReport = typeof CompactReport.Type

const git = (root: string, args: string[]) =>
  spawnSync("git", ["-C", root, ...args], { encoding: "utf8" })

const rel = (root: string, path: string) => relative(root, path).split(sep).join("/")

const abs = (root: string, path: string) => resolve(root, path)

const isRaw = (root: string, path: string) => {
  const fromRoot = rel(root, path)
  return fromRoot === RAW || fromRoot.startsWith(`${RAW}/`)
}

const walkFiles = (dir: string) => {
  if (!existsSync(dir)) return []
  const files: string[] = []
  for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue
    files.push(join(entry.parentPath, entry.name))
  }
  return files
}

const hrefTarget = (file: string, href: string) => {
  if (/^(https?:|mailto:)/.test(href) || href.startsWith("#")) return undefined
  const path = href.split("#")[0]
  if (!path) return undefined
  return resolve(dirname(file), path)
}

export const loadWiki = (root: string): Wiki => {
  const sources = walkFiles(join(root, RAW))
    .map((file) => Source.make({ path: rel(root, file) }))
    .sort((a, b) => a.path.localeCompare(b.path))
  const pageFiles = walkFiles(root)
    .filter((file) => {
      const fromRoot = rel(root, file)
      return (
        file.endsWith(".md") &&
        !fromRoot.startsWith(".git/") &&
        fromRoot !== SCHEMA &&
        !isRaw(root, file)
      )
    })
    .sort()
  const pages = pageFiles.map((file) => Page.make({ path: rel(root, file) }))
  const citations: Citation[] = []
  const links: CrossLink[] = []
  for (const file of pageFiles) {
    const page = rel(root, file)
    for (const match of readFileSync(file, "utf8").matchAll(LINK)) {
      const href = match[2]!
      const target = hrefTarget(file, href)
      if (!target) continue
      if (isRaw(root, target)) {
        citations.push(Citation.make({ page, href, source: rel(root, target) }))
      } else {
        links.push(CrossLink.make({ from: page, href, to: rel(root, target) }))
      }
    }
  }
  return Wiki.make({ root, sources, pages, citations, links })
}

export const initWiki = (root: string): Wiki => {
  mkdirSync(join(root, RAW), { recursive: true })
  if (!existsSync(join(root, INDEX))) writeFileSync(join(root, INDEX), README)
  if (!existsSync(join(root, SCHEMA))) writeFileSync(join(root, SCHEMA), AGENTS)
  if (!existsSync(join(root, ".git"))) git(root, ["init"])
  git(root, ["add", INDEX, SCHEMA])
  git(root, [
    "commit",
    "-m",
    "wiki: initialize",
    "-m",
    "Create the wiki root, immutable raw sources, index, and schema."
  ])
  return loadWiki(root)
}

export const ingestSource = (root: string, source: string): Ingest => {
  const file = resolve(source)
  const rawDir = resolve(root, RAW)
  mkdirSync(rawDir, { recursive: true })
  if (file === rawDir || file.startsWith(rawDir + sep)) {
    return Ingest.make({
      source: Source.make({ path: rel(root, file) }),
      action: "already-in-raw"
    })
  }
  const dest = join(rawDir, basename(file))
  if (existsSync(dest)) {
    return Ingest.make({
      source: Source.make({ path: rel(root, dest) }),
      action: "exists"
    })
  }
  copyFileSync(file, dest)
  return Ingest.make({
    source: Source.make({ path: rel(root, dest) }),
    action: "copied"
  })
}

export const lintWiki = (wiki: Wiki): LintReport => {
  const exists = (path: string) => existsSync(abs(wiki.root, path))
  const indexed = new Set(
    wiki.links.filter((link) => basename(link.from) === INDEX).map((link) => link.to)
  )
  return LintReport.make({
    brokenCitations: wiki.citations.filter((citation) => !exists(citation.source)),
    brokenLinks: wiki.links.filter((link) => !exists(link.to)),
    missing: [...indexed].filter((path) => !exists(path)),
    orphans: wiki.pages.filter(
      (page) => basename(page.path) !== INDEX && !indexed.has(page.path)
    )
  })
}

export const compactWiki = (wiki: Wiki): CompactReport => {
  const rootPages = wiki.pages.filter(
    (page) => !page.path.includes("/") && basename(page.path) !== INDEX
  )
  const directories = [
    ...new Set(
      wiki.pages.map((page) => dirname(page.path)).filter((dir) => dir !== ".")
    )
  ].map((dir) => ({
    dir,
    hasIndex: existsSync(join(wiki.root, dir, INDEX))
  }))
  const largest = wiki.pages
    .map((page) => ({
      page,
      lines: readFileSync(abs(wiki.root, page.path), "utf8").split("\n").length
    }))
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 10)
  return CompactReport.make({ rootPages, directories, largest })
}
