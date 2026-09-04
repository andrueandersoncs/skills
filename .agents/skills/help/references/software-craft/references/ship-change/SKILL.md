---
name: ship-change
description: Move completed software safely through migration, integration, automation, documentation, observability, deployment, and staged rollout. Use for branch completion, releases, production migrations, deprecations, CI/CD, launch, rollback, or merge conflicts.
---

# Ship Change

## Inputs

The verified software candidate, requested delivery state, current repository or deployment state, authority, environment, and rollback boundary.

## Select mode

- **Conflict:** reconcile an active merge or rebase.
- **Integration:** merge, publish for review, keep isolated, or discard completed branch work.
- **Migration:** move consumers, data, schemas, APIs, or deprecated behavior safely.
- **Release:** automate, document, observe, deploy, stage, monitor, and roll back production work.

Modes may compose. Run only the selected mode's steps and completion gate.

## Common entry

Require fresh verification evidence for the candidate. Confirm the relevant base, revision, environment, authority, and rollback boundary.

## Conflict

Inspect merge state and history, trace each side to its source intent, preserve both contracts where possible, resolve every hunk, run affected checks, and complete the merge or rebase.

## Integration

Present the applicable choice: merge, publish/open review, keep isolated, or explicitly discard. Reverify a merged result. Protect uncommitted work and require deliberate confirmation for destructive cleanup.

## Migration

Use **expand → migrate bounded consumer batches → switch and bake → contract**. Verify mixed-version behavior, backfill progress, rollback, and zero old-path use before removal. Publish the consumer guide and removal schedule.

## Release

For an npm-distributed TypeScript package, apply [the npm publishing recipe](references/npm-publish-tool.md) within this release mode.

1. Encode economical automated gates in dependency order: static checks, focused tests, build, integration/runtime checks, security/dependency checks, and release budgets.
2. Update public API docs, rationale, migration guide, changelog, and any warranted ADR.
3. Derive structured logs, bounded metrics, trace context, actionable alerts, and a runbook from 2–4 concrete on-call questions.
4. Predeclare rollout stages, health thresholds, rollback triggers, steps, and recovery time. Use a disabled flag, internal exposure, canary, then measured expansion when risk warrants it.
5. Monitor the first meaningful production window, compare with thresholds, and remove temporary flags or compatibility paths on schedule.

## Output

The requested conflict resolution, integration, migration, release, or deployment result with its mode-specific evidence.

## Done

- **Conflict:** repository conflict state is cleared and affected behavior passes.
- **Integration:** the chosen branch/worktree outcome is complete and its integrated result is verified.
- **Migration:** intended consumers use the new path, rollback remains valid through the bake window, and removal follows verified zero use.
- **Release:** the deployed revision is observable, reversible, documented for consumers, and verified against rollout thresholds.