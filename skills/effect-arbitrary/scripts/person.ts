import { Schema } from "effect"

export default Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Int.check(Schema.isBetween({ minimum: 18, maximum: 80 }))
})
