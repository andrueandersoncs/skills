import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { Console, Effect, Schema } from "effect"
import { FastCheck } from "effect/testing"
import { Argument, Command, Flag } from "effect/unstable/cli"

export const command = Command.make(
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
    Effect.gen(function*() {
      const loaded = yield* Effect.promise(() =>
        import(pathToFileURL(resolve(module)).href)
      )
      const samples = FastCheck.sample(Schema.toArbitrary(loaded.default)(FastCheck), count)
      yield* Console.log(JSON.stringify(samples, null, 2))
    })
).pipe(Command.withDescription("Generate arbitrary values from an Effect Schema"))
