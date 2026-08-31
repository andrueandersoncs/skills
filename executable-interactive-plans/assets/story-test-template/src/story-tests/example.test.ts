import { Effect, Schema } from "effect"
import { FastCheck } from "effect/testing"
import { expect, it } from "vitest"
import { ExampleInput, runExample } from "../domain/example"

const inputs = Schema.toArbitrary(ExampleInput)(FastCheck)

it("greets every generated name", async () => {
  await FastCheck.assert(FastCheck.asyncProperty(inputs, async (input) => {
    const result = await Effect.runPromise(runExample(input))
    expect(result).toBe(`Hello, ${input.name}`)
  }), { numRuns: 25 })
})
