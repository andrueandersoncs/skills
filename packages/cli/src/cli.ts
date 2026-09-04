import { readFile, writeFile } from "node:fs/promises"
import {
  Effect,
  FileSystem,
  Layer,
  Path,
  Stdio,
  Terminal
} from "effect"
import { Command } from "effect/unstable/cli"
import { ChildProcessSpawner } from "effect/unstable/process"
import { command as wiki } from "./wiki/command"
import { command as generate } from "./effect-arbitrary/command"
import { command as manageProject } from "./manage-project/command"
import { version } from "./version"

const CliLayer = Layer.mergeAll(
  FileSystem.layerNoop({
    readFileString: (path) => Effect.promise(() => readFile(path, "utf8")),
    writeFileString: (path, data) =>
      Effect.promise(() => writeFile(path, data)).pipe(Effect.asVoid)
  }),
  Path.layer,
  Stdio.layerTest({}),
  Layer.succeed(
    Terminal.Terminal,
    Terminal.make({
      columns: Effect.succeed(80),
      rows: Effect.succeed(24),
      readInput: Effect.die("unused"),
      readLine: Effect.die("unused"),
      display: () => Effect.void
    })
  ),
  Layer.succeed(
    ChildProcessSpawner.ChildProcessSpawner,
    ChildProcessSpawner.make(() => Effect.die("unused"))
  )
)

const command = Command.make("andrue-cli").pipe(
  Command.withDescription("Manage projects, wikis, and generate Effect Schema samples"),
  Command.withSubcommands([manageProject, generate, wiki])
)

Effect.runPromise(
  Command.runWith(command, { version })(process.argv.slice(2)).pipe(
    Effect.provide(CliLayer)
  )
)
