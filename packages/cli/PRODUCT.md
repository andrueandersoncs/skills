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
- Inferred, unlabeled by the user: visual world is unset; the first board was rejected as ugly.

## Brand Commitments

None. The first board (warm-black paper, system sans, amber only on the next action) is rejected.

## Evidence on Hand

Live board at `packages/cli/src/manage-project/web`. Sample records created by the CLI. No photography, logo, or customer proof.

## Product Principles

- The board shows condition, not intention.
- One next action is visible; the rest recede.
- The file on disk is what you are looking at.
- Density over empty chrome.

## Accessibility & Inclusion

No product-specific requirement was established. Keyboard focus and contrast remain required for Operate use.
