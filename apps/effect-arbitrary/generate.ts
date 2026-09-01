#!/usr/bin/env bun
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  Console,
  Effect,
  FileSystem,
  Layer,
  Path,
  Schema,
  Stdio,
  Terminal
} from "effect"
import { FastCheck } from "effect/testing"
import { Argument, Command, Flag } from "effect/unstable/cli"
import { ChildProcessSpawner } from "effect/unstable/process"

const CliLayer = Layer.mergeAll(
  FileSystem.layerNoop({}),
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

const command = Command.make(
  "generate",
  {
    module: Argument.string("module").pipe(
      Argument.withDescription("Module that default-exports an Effect Schema")
    ),
    count: Flag.integer("count").pipe(
      Flag.withDescription("Number of values to generate"),
      Flag.withDefault(10)
    )
  },
  ({ module, count }) =>
    Effect.gen(function* () {
      const loaded = yield* Effect.promise(() =>
        import(pathToFileURL(resolve(module)).href)
      )
      const samples = FastCheck.sample(Schema.toArbitrary(loaded.default)(FastCheck), count)
      yield* Console.log(JSON.stringify(samples, null, 2))
    })
).pipe(Command.withDescription("Generate arbitrary values from an Effect Schema"))

Effect.runPromise(
  Command.runWith(command, { version: "0.1.0" })(process.argv.slice(2)).pipe(
    Effect.provide(CliLayer)
  )
)
