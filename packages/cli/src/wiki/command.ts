import { resolve } from "node:path"
import { Console, Effect } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"
import {
  compactWiki,
  ingestSource,
  initWiki,
  lintWiki,
  loadWiki
} from "./wiki"

const print = (value: unknown) => Console.log(JSON.stringify(value, null, 2))

const wiki = Command.make("wiki").pipe(
  Command.withDescription("Manage an LLM wiki"),
  Command.withSharedFlags({
    root: Flag.string("root").pipe(
      Flag.withDescription("Wiki root directory"),
      Flag.withDefault(".")
    )
  })
)

const init = Command.make("init", {}, () =>
  Effect.gen(function*() {
    const { root } = yield* wiki
    yield* print(initWiki(resolve(root)))
  })
).pipe(Command.withDescription("Create raw/, README.md, AGENTS.md, and the initial commit"))

const ingest = Command.make(
  "ingest",
  { source: Argument.string("source").pipe(Argument.withDescription("Source file to place in raw/")) },
  ({ source }) =>
    Effect.gen(function*() {
      const { root } = yield* wiki
      yield* print(ingestSource(resolve(root), source))
    })
).pipe(Command.withDescription("Copy a source into raw/ without overwriting"))

const lint = Command.make("lint", {}, () =>
  Effect.gen(function*() {
    const { root } = yield* wiki
    yield* print(lintWiki(loadWiki(resolve(root))))
  })
).pipe(Command.withDescription("Report missing pages, orphans, and broken relative links"))

const compact = Command.make("compact", {}, () =>
  Effect.gen(function*() {
    const { root } = yield* wiki
    yield* print(compactWiki(loadWiki(resolve(root))))
  })
).pipe(Command.withDescription("Report root sprawl and large pages"))

export const command = wiki.pipe(
  Command.withSubcommands([init, ingest, lint, compact])
)
