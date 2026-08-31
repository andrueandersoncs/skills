---
name: executable-interactive-plans
description: "Turn user stories into editable executable Effect Arbitrary tests plus exact Proposed Code. Use when a human wants to review, run, edit, and save story tests and proposed Effect code before implementation."
compatibility: Requires a browser, a local JavaScript runtime, Effect v4, and Vitest.
---

# Executable Interactive Plans

Represent the intended product as code: editable user-story tests and exact proposed implementation code.

Read [references/executable-interactive-plans.md](references/executable-interactive-plans.md). Start from [assets/story-test-template](assets/story-test-template).

## Required result

The review app has two primary tabs:

1. **Story Tests** — every user story owns one or more executable Effect Arbitrary tests.
2. **Proposed Code** — exact new or changed Effect Schemas, Services, Layers, and Effectful functions.

Both tabs use the same itemized Monaco workspace. Both support **Save proposed code**. A saved test or implementation item invalidates only the stories that use it.

## Workflow

### 1. Define stories as properties

Keep authored story order. For each story, state:

- The caller-visible outcome
- One or more properties that must always hold
- The input Schema for each property
- The proposed-code IDs exercised

A story is complete only when at least one test expresses its outcome.

### 2. Create the artifact from the template

```sh
node scripts/create-plan.mjs <artifact-destination>
```

Replace the template plan, story-test files, proposed domain code, and theme tokens. Keep the shared code workspace and review server unless the repository already owns equivalents.

### 3. Write Effect Arbitrary tests

Use Effect v4:

```ts
import { Schema } from "effect"
import { FastCheck } from "effect/testing"

const inputs = Schema.toArbitrary(InputSchema)(FastCheck)
```

Use `FastCheck.property` or `FastCheck.asyncProperty` and `FastCheck.assert`. Each generated run starts with fresh deterministic Services and Layers.

Tests must:

- Generate values from the exact proposed Schema.
- Execute the exact proposed Effectful function or Service seam.
- Assert the caller-visible story outcome.
- Use a fixed run count and record the replay seed on failure.

Keep each item small. Use one test file per item so Monaco can edit and save the complete test without unrelated ranges.

### 4. Itemize Story Tests

For each test item show:

- Story and property title
- Canonical test file
- Proposed-code dependencies
- Monaco with the exact full test
- Current `passed`, `failed`, or `not run` status
- **Run test**
- **Save proposed code**

Saving a test resets its story status. Saving proposed implementation code resets every linked story. Approval stays disabled until every current story test passes.

### 5. Itemize Proposed Code

Group exact proposed declarations by:

- **Schemas**
- **Services** — Service contracts and Layers
- **Effectful functions**

Open the canonical file and focus the selected declaration. Link each declaration to its story tests.

### 6. Save through the local review server

A save uses:

- Loopback and same-origin requests
- A per-session token
- Opaque allowlisted file IDs
- Repository containment
- Loaded-hash concurrency checks
- Exact item-range enforcement
- Atomic writes
- Targeted test invalidation
- An append-only edit audit

### 7. Run one focused validation pass

Check:

- Every story has at least one test.
- Every test uses `Schema.toArbitrary` and `effect/testing` FastCheck.
- Every test runs from the browser and reports its current result.
- Test and implementation saves invalidate the correct stories.
- Story↔test↔proposed-code links work in both directions.
- Explicit `approved` / `changes-requested` export works.
- The browser reports no errors.

Run one clean-context first-principles check when repository instructions require it. Fix concrete findings once and rerun affected checks. Do not create repeated review chains.

### 8. Pause for the human

Keep one decision control and one **Export review** action. Never infer approval.

Export the decision, ordered stories, exact test files, exact proposed-code files, current test results, comments, and edit audit.

## Completion

Return:

- The browser URL
- The artifact path
- The current source-snapshot ID
- The story-test result summary
- The one next human action
