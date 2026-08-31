import { Effect, Schema } from "effect"

export const ExampleInput = Schema.Struct({ name: Schema.NonEmptyString })
export type ExampleInput = Schema.Schema.Type<typeof ExampleInput>

export const runExample = ({ name }: ExampleInput) => Effect.succeed(`Hello, ${name}`)
