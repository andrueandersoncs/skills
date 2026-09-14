# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Node `http` + static HTML/CSS/JS in `packages/cli/src/manage-project/web`.

## Users

Andrue (inferred from the repo owner) managing AI-agent projects. The job is to see the project's real work condition and take the next legal action on a task without leaving the durable record.

## Product Purpose

A visual board over `project.json`. Success is: an operator can read every task's status at a glance and advance a task through the Ready gate, execution, and review, with the file remaining the database.

## Positioning

Status is the truth. Columns are the state machine, not a free-moving kanban. Illegal moves are not offered.

## Operating Context

Run with `andrue-cli manage-project --record <path> serve`. The CLI and the board share `updateProject`, which locks the read–modify–write operation and atomically replaces the record. Agents and the operator use these actions to update the same file.

## Capabilities and Constraints

- Six statuses: Not started, Ready, In progress, Blocked, In review, Done.
- Ready requires owner and next action. Done requires review.
- No drag-anywhere. Actions match the CLI.
- Visual world: an Assurance Case Docket—technical bond, graphite rules, review red, and blueprint blue.

## Brand Commitments

- Keep task state, evidence, and the next legal action more prominent than decoration.
- On phones, show the next required action before the complete state register.
- Use the review-dossier language across controls, forms, and status changes.

## Evidence on Hand

The live board is in `packages/cli/src/manage-project/web`. Desktop, mobile, and task-panel captures verified the replacement direction during implementation.

## Product Principles

- The board shows condition, not intention.
- One next action is visible; the rest recede.
- The file on disk is what you are looking at.
- Density over empty chrome.

## Accessibility & Inclusion

No product-specific requirement was established. Keyboard focus and contrast remain required for Operate use.
