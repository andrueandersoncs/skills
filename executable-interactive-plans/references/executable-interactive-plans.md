# Executable plans as editable tests

## Purpose

The plan is code. User stories become executable property tests, and the proposed implementation remains exact editable code.

The human reviews two related questions:

1. **Do these tests express the behavior I want?**
2. **Does this proposed code implement that behavior?**

## Page structure

Use exactly two primary tabs and one persistent decision bar.

```text
┌ Story Tests ─ Proposed Code ──────────────────────────────┐
│ Story 1   Story 2   Story 3                               │
│ ┌ tests ────────┐ ┌ exact editable test ───────────────┐ │
│ │ property A ✓  │ │ Monaco                              │ │
│ │ property B –  │ │                                    │ │
│ └───────────────┘ └─────────────────────────────────────┘ │
│                    [Run test] [Save proposed code]         │
│                    Generated cases / failure seed          │
├───────────────────────────────────────────────────────────┤
│ Decision [choose…]                            Export review│
└───────────────────────────────────────────────────────────┘
```

## Story Tests

### Story contract

Each story has:

- Stable story ID
- Short title and outcome
- At least one test ID
- Proposed-code dependencies

Each test has:

- Stable test ID
- Property title
- Canonical test file
- Owning story ID
- Proposed-code IDs exercised

Use one canonical test↔code relation. Derive story-side links from its tests.

### Effect Arbitrary

Use the Effect v4 Schema Arbitrary API documented at <https://www.effect.website/docs/v4/schema/arbitrary>.

```ts
import { Effect, Schema } from "effect"
import { FastCheck } from "effect/testing"
import { expect, it } from "vitest"

const inputs = Schema.toArbitrary(InputSchema)(FastCheck)

it("preserves the story property", async () => {
  await FastCheck.assert(
    FastCheck.asyncProperty(inputs, async (input) => {
      const layer = await Effect.runPromise(makeFreshLayer())
      const result = await Effect.runPromise(
        Effect.provide(runStory(input), layer),
      )
      expect(result).toMatchObject(expectedResult(input))
    }),
    { numRuns: 25 },
  )
})
```

The test must generate from the exact proposed input Schema. Do not hand-build random values beside the Schema.

Each generated case gets fresh deterministic Services, Layers, repositories, clocks, and other mutable boundaries. A failed run reports the FastCheck seed and counterexample so the coding agent can replay it.

### Itemized code workspace

Story Tests uses the same Monaco interaction as Proposed Code.

The left rail selects a story. The item list selects one test. The editor loads the exact full test file.

Show:

- Test title and path
- Proposed-code dependency links
- Run count
- Last status
- Last failure seed or generated sample summary
- **Run test**
- **Save proposed code**

Use one test per file by default. This makes the entire test the allowed editable range.

### Run and save

**Run test** executes only the selected canonical test file through the repository test runner.

**Save proposed code**:

1. Saves the selected test atomically.
2. Marks that test and its story `not run`.
3. Keeps unrelated story results.
4. Requires the human or agent to run the changed test again.

## Proposed Code

Keep the existing exact-source workspace.

Group proposed declarations by:

- **Schemas**
- **Services**
- **Effectful functions**

Each item includes a stable code ID, canonical file, declaration range, source hash, and affected test IDs.

Saving a proposed declaration marks every dependent test `not run`. Approval remains disabled until those exact tests pass again.

## Shared editing boundary

Both workspaces use the local review server:

- Loopback and same-origin only
- Per-session token
- Opaque allowlisted file ID
- Repository containment
- Loaded-hash concurrency check
- Allowed item range
- Atomic write
- Targeted result invalidation
- Append-only audit

A failed save or test blocks approval.

## Template contract

The template lives at `assets/story-test-template/` and contains:

```text
assets/story-test-template/
├── README.md
├── package.json
├── review-server.ts
├── src/
│   ├── domain/
│   ├── story-tests/
│   ├── main.tsx
│   ├── plan-data.ts
│   ├── review-shell.tsx
│   ├── review-types.ts
│   └── styles.css
├── tests/
├── index.html
├── tsconfig.json
└── vite.config.ts
```

A generated plan changes `plan-data.ts`, `src/story-tests/*`, `src/domain/*`, and theme tokens. Shared editor, save, test-run, decision, and export behavior stays in the template.

## Source snapshot and export

`sourceSnapshotId` hashes ordered stories, test inventory, proposed-code inventory, and exact test/code file contents.

Test results, comments, and edits are mutable review records exported beside the snapshot.

The durable artifact contains:

```json
{
  "schemaVersion": "1.0.0",
  "planId": "string",
  "sourceSnapshotId": "sha256",
  "decision": "approved | changes-requested",
  "stories": [],
  "storyTests": [],
  "proposedCode": [],
  "files": [],
  "testResults": {},
  "comments": {},
  "edits": []
}
```

Embed exact reviewed files. Durable and downloaded artifact bytes match.

## Focused acceptance check

Run one browser pass:

1. Open every story and every test item.
2. Run every test from the browser.
3. Confirm generated values come from each proposed Schema.
4. Follow test→code and code→test links.
5. Save one reversible test edit in an isolated copy and confirm only its story resets.
6. Save one reversible proposed-code edit and confirm only dependent tests reset.
7. Export both decisions in an isolated copy and compare bytes.
8. Confirm the real draft has no synthetic edits or decision artifact.

Then pause for the human. Do not add autonomous review rounds beyond one repository-required clean-context check.
