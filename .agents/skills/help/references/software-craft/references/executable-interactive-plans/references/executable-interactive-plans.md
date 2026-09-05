# Executable plans as agreed Effect contracts

## Purpose

The plan is code. User stories become `@effect/vitest` Arbitrary tests. Proposed Code is the Schemas, Errors, Services, and Effectful function signatures those tests call.

The human agrees on those four contracts before implementation.

Green properties establish executable specification and fixture agreement, not a completed production implementation. Later verification must bind requirement-derived assertions to the real public boundary; use [verify-change](../../verify-change/SKILL.md) for that behavioral claim.

## The four contracts

### Schemas

Use the Effect v4 Schema Arbitrary API at <https://www.effect.website/docs/v4/schema/arbitrary>.

`it.effect.prop` takes the Schema itself. `@effect/vitest` derives the Arbitrary.

```ts
export const CreateTaskInput = Schema.Struct({ title: TaskTitle })
export type CreateTaskInput = Schema.Schema.Type<typeof CreateTaskInput>
```

### Errors

Use `Schema.Error` so the failure is tagged, yieldable, and schema-backed.

```ts
export class TaskNotFound extends Schema.Error<TaskNotFound>("TaskNotFound")({
  id: TaskId,
}) {}
```

A test that agrees on this Error generates inputs that fail and asserts the Error:

```ts
it.effect.prop("fails for every generated missing task id", [CompleteTaskInput], ([input]) =>
  Effect.gen(function* () {
    const layer = yield* makeTaskService([])
    const error = yield* completeTask(input).pipe(Effect.provide(layer), Effect.flip)
    assert.instanceOf(error, TaskNotFound)
    assert.strictEqual(error.id, input.id)
  }), { fastCheck: { numRuns: 25 } })
```

### Services

```ts
export interface TaskServiceShape {
  readonly create: (input: CreateTaskInput) => Effect.Effect<Task>
  readonly list: Effect.Effect<ReadonlyArray<Task>>
  readonly complete: (input: CompleteTaskInput) => Effect.Effect<Task, TaskNotFound>
}

export class TaskService extends Context.Service<TaskService, TaskServiceShape>()("TaskService") {}
```

Each generated case gets a fresh Layer. Layer factories are test fixtures, not Proposed Code. Inventory both the Service tag and its complete shape as editable Service items.

### Effectful function signatures

Write Success, Error, and Requirements:

```ts
export const createTask = (input: CreateTaskInput): Effect.Effect<Task, never, TaskService> =>
  Effect.flatMap(TaskService, (service) => service.create(input))

export const completeTask = (input: CompleteTaskInput): Effect.Effect<Task, TaskNotFound, TaskService> =>
  Effect.flatMap(TaskService, (service) => service.complete(input))
```

Each signature records `inputSchemaIds`, `successSchemaId`, `errorIds`, and `serviceIds` in its inventory `contract`. Empty inputs and a `never` Error channel use empty arrays. Formal approval covers these four contracts; [Hyrum's Law](../../../../software-laws/references/reference.md#hyrums-law) also covers consumer dependencies on other observable behavior. Use [design-contract](../../design-contract/SKILL.md) for compatibility decisions.

## Story Tests

Each story has a stable ID, a short title, an outcome, and at least one test ID.

Each test records stable IDs, its canonical file and story, and directly exercised `proposedCodeIds`. `assertedErrorIds` names only Errors whose outcomes that property asserts; a dependency on a signature's complete Error channel is not an assertion of every Error.

Keep one dependency relation in `plan-data.ts`: code items declare `dependencyIds`, and function contracts name their Schema, Error, and Service dependencies. Derive each test's transitive closure and both navigation directions from it, including nested Schemas and complete Service shapes.

The left rail selects a story. The item list selects one test. The editor loads the exact full test file.

Show:

- Test title and path
- Proposed-code dependency links
- **Run test**
- Last status and output
- **Save proposed code**

**Run test** executes only the selected canonical test file through Vitest.

**Save proposed code** on a test:

1. Saves the selected test atomically.
2. Marks that test `not run`.
3. Keeps unrelated results.
4. Requires the changed test to be run again.

## Proposed Code

Group declarations by **Schemas**, **Errors**, **Services**, and **Effectful functions**.

Each item includes a stable code ID, canonical file, declaration range, and affected test IDs.

Saving a declaration invalidates every test in its dependency closure. Hash the exact test, dependency declarations, and shared imports/fixture source; keep unrelated passing results. The server owns these records and discards results whose content no longer matches, including source changes during a run.

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

An unresolved failed save or current failed test blocks approval. Track failed saves per item; a successful save of another item does not resolve them. Reload source deliberately after a stale save, then retry the affected item. Unsaved edits also block approval.

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

The durable artifact contains the decision, ordered stories, exact test files, exact proposed-code files, server-owned current test results and evidence hashes, comments, and edit audit. Never accept client-supplied test results as evidence. A changed source snapshot clears the shell's decision and a stale snapshot cannot be exported.

Embed exact reviewed files. Durable and downloaded artifact bytes match.

## Focused acceptance check

Run one browser pass:

1. Open every story and every test item.
2. Run every test from the browser.
3. Confirm each test uses `it.effect.prop` with the proposed Schema.
4. Confirm Proposed Code groups Schemas, Errors, Services, and Effectful functions.
5. Follow test→code and code→test links.
6. Save one reversible test edit in an isolated copy and confirm only that test resets.
7. Save a reversible proposed-code edit; confirm direct and transitive dependents reset while unrelated results remain. Exercise a failed/stale save and confirm approval stays blocked until that item is resolved.
8. Export both decisions in an isolated copy and compare bytes.
9. Confirm the real draft has no synthetic edits or decision artifact.

Then pause for the human. Do not add autonomous review rounds beyond one repository-required clean-context check.
