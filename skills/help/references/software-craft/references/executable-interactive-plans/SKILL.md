---
name: executable-interactive-plans
description: Produce a human-approved Effect contract artifact containing executable story properties and exact Schemas, Errors, Services, and function signatures. Use when those complete contracts must be reviewed and agreed before implementation.
compatibility: Requires a browser, a local JavaScript runtime, Effect v4, and @effect/vitest.
---

# Executable Interactive Plans

The plan is agreement on four Effect contracts, proven by executable story tests.

## Inputs

- The user stories and caller-visible outcomes to express
- The owning Effect workspace and relevant repository conventions
- The artifact destination

The human reviews two questions:

1. **Do these tests express the behavior I want?**
2. **Do these Schemas, Errors, Services, and Effectful function signatures match that behavior?**

Read the shared [Effect context](../effect.md) and [the detailed method](references/executable-interactive-plans.md). Start from [the story-test template](assets/story-test-template).

Apply [Gall's Law](../../../software-laws/references/reference.md#galls-law) to keep the four-contract artifact complete and small. Under [Hyrum's Law](../../../software-laws/references/reference.md#hyrums-law), compatibility can also depend on observable behavior outside those formally approved contracts; inspect actual consumers before changing it.

## Contract and story requirements

Group Proposed Code as **Schemas**, **Errors**, **Services**, and **Effectful functions**, with exact editable source, complete Service shapes, and each signature's input/success Schema, Error, and Service IDs. Keep these details in [the four-contract method](references/executable-interactive-plans.md#the-four-contracts).

Each story owns an `@effect/vitest` property generated from the proposed Schemas, using a fresh fixture Layer and calling the proposed function. Derive navigation and invalidation from the inventory's transitive dependency relation. Error-channel dependencies do not imply an Error assertion; identify the specific asserted Error separately. A legitimate `never` channel needs no invented Error.

Keep one test file per property so the whole file is the editable range.

## Workflow

### 1. Name the stories

Keep authored story order. For each story, state the caller-visible outcome and the Schema, Error, Service, and function IDs it exercises.

### 2. Create the artifact

Run from the loaded skill's base directory:

```sh
node scripts/create-plan.mjs <artifact-destination>
```

Replace plan data, story tests, proposed domain code, and theme tokens. Keep the shared review shell and review server.

### 3. Fill the four contracts, then the tests

Write Schemas, Errors, Services, and signatures first. Then write `it.effect.prop` tests that generate from those Schemas and call those functions.

### 4. Review in the browser

Run and edit properties in Story Tests; edit contracts in Proposed Code. The server binds results to current test and dependency content, invalidates only affected tests, and blocks approval for unresolved save failures. Source changes clear the decision; approval requires every current property to pass.

Use [Goodhart's Law](../../../software-laws/references/reference.md#goodharts-law) to distinguish green fixture-agreement evidence from the required human decision.

### 5. Pause for the human

Keep one decision control and one **Export review** action. Never infer approval.

## Output

Return:

- The browser URL
- The artifact path
- The current source-snapshot ID
- The story-test result summary
- The one next human action

## Done

Every current story property passes against the exact proposed contracts, the human has explicitly approved the current source snapshot, and the returned artifact path, browser URL, snapshot ID, and result summary identify that approved state.
