import type { PlanDefinition } from "./review-types"

export const plan: PlanDefinition = {
  id: "replace-me",
  version: "1.0.0",
  title: "Executable story tests",
  description: "Review and run the story properties, then inspect the proposed Effect code.",
  stories: [
    { id: "story.example", label: "Run the example", outcome: "Every valid generated name produces a greeting." },
  ],
  storyTests: [
    { id: "test.example", label: "greets every generated name", storyId: "story.example", fileId: "file.test.example", relativePath: "src/story-tests/example.test.ts", proposedCodeIds: ["code.input", "code.run-example"] },
  ],
  proposedCode: [
    { id: "code.input", category: "Schema", label: "ExampleInput", fileId: "file.example", relativePath: "src/domain/example.ts", symbol: "ExampleInput" },
    { id: "code.run-example", category: "EffectfulFunction", label: "runExample", fileId: "file.example", relativePath: "src/domain/example.ts", symbol: "runExample" },
  ],
}
