---
name: extract-skill-to-repository
description: Moves exactly one complete project skill from `.agents/skills/` into the sibling `../skills` Git repository and records scoped commits in both repositories. Use when asked to extract, move, relocate, or publish a repository skill into the shared skills repository.
compatibility: Requires the current project and ../skills to be Git repositories.
---

# Extract Skill to Repository

Move exactly one complete project skill into the sibling skills repository. Preserve the source until the destination is committed; never overwrite a target skill or expand scope without user approval.

## Inputs

### A. Source skill selector

A required user-supplied skill name or `.agents/skills/<name>/` path, resolved from the active repository root. It must identify exactly one direct child containing `SKILL.md`.

### B. Repository context

Required repository context: the active Git repository, its sibling `../skills` Git repository, and the repository instructions, remotes, branch conventions, and validation commands that govern each. The target layout is `../skills/<name>/`, without a `skills/` or `.agents/skills/` wrapper.

### C. Scope authorizations

Optional user approval for changes beyond moving the selected directory, such as rewriting incoming references, moving a dependency skill, changing workflow behavior, or pushing commits. Without explicit approval, those changes are outside scope.

## Outputs

### A. Extracted target skill

The complete skill at `../skills/<name>/`, with preserved relative paths and file modes, approved portability changes, valid local references, and an accurate entry in `../skills/README.md`.

### B. Target repository commit

A scoped commit containing only the new skill and intended target README changes.

### C. Source repository commit

A scoped commit removing exactly the source skill and applying only approved incoming-reference updates, with no unapproved dangling references.

### D. Completion report

A report of old and new paths, dependency or portability changes, both commit hashes, validations run, and push status. It is complete only when both worktrees are clean, the target commit contains every moved file, the source commit removes the selected skill and approved references, and any explicitly requested pushes succeeded.

## Procedure

### 1. Establish safe repository baselines

Resolve both Git roots, read their governing instructions, select and update branches according to repository policy, and record each starting commit. If either repository is missing, dirty, or cannot update cleanly, stop without changing files and report the condition. **Evidence:** two identified, clean, up-to-date worktrees with recorded starting commits.

### 2. Resolve the skill and reserve the destination

Resolve exactly one direct child of `.agents/skills/`, parse its YAML frontmatter, require `name` to match the directory, and record a manifest of every source file, mode, and hash. Set the destination to `../skills/<name>/`. If that path or any target skill with the same frontmatter name exists, stop; do not overwrite, merge, or rename it. **Evidence:** a complete source manifest and an unused, uniquely named destination.

### 3. Produce an approved dependency plan

Read the complete skill directory, inspect every relative Markdown link and repository-relative path, and search both repositories for the skill name and source path. Classify each dependency as internal, sibling-skill, active-repository configuration, or runtime capability, and assign a post-move resolution:

- Keep internal links relative to the skill directory.
- Express active-repository paths from the consumer repository root and declare the requirement in `compatibility` or the target README.
- Keep sibling-skill or runtime dependencies only when consumers will have them, and declare them.
- If a source file points to the departing skill, obtain approval for a concrete rewrite or stop.
- If resolution would move another skill, change behavior, or otherwise expand scope, obtain explicit approval or stop.

**Evidence:** every incoming and outgoing reference has a recorded resolution, and every scope-expanding change has explicit approval.

### 4. Create and review the target copy

Copy the entire source directory to the unused destination while preserving paths and modes; keep the source intact. Before modifying the copy, compare its relative-path manifest, hashes, and modes with the source. Apply only approved portability changes, then update the target README's included-skill and consumer-requirement entries. If the initial copy differs, remove the incomplete target and stop without touching the source. **Evidence:** a byte-verified initial copy and a target-only diff limited to approved portability and README changes.

### 5. Validate and commit the destination

Re-read the copied `SKILL.md`; require valid YAML, a non-empty description, Agent Skills-compliant naming, and a frontmatter name matching the directory. Resolve every local Markdown link, run repository validation and whitespace checks, and verify that only the new skill and intended README changes are staged. Commit with a scoped message. If validation or commit fails, leave the source untouched and report the failure. **Evidence:** a target commit containing the complete, valid skill and only intended target changes.

### 6. Remove and commit the source

Only after the target commit exists, delete the complete source directory and apply only approved incoming-reference updates. Search for dangling references, run repository validation and whitespace checks, and stage only the deletion and approved updates before committing with a scoped extraction message. If validation or commit fails, preserve the committed target and report incomplete source cleanup. **Evidence:** the source path is absent, the target path is present, no unapproved dangling references remain, and each repository has its scoped commit.

### 7. Report the result

Confirm both worktrees are clean and verify each commit against the source manifest and approved change plan. If the user explicitly requested pushing, push only after both commits exist and record each result; otherwise do not push. Report exactly `Moved: <old path> -> <new path>`, `Portability: <approved changes|None>`, `Target commit: <hash>`, `Source commit: <hash>`, `Validation: <checks>`, `Push: <not requested|results>`, and `Status: <complete|incomplete: unmet condition>`. **Completion condition:** both worktrees are clean, the target commit contains every moved file, the source commit removes exactly the selected skill and approved references, and any requested pushes succeeded; otherwise use the same report schema to name the unmet condition and mark the workflow incomplete.

## Callstack Simulation

**Extract Skill To Repository**(source skill selector, repository context, scope authorizations)
│
├─ **Establish Safe Repository Baselines**(active repository, sibling skills repository)
│  │
│  ├─ if (either repository is missing, dirty, or cannot update cleanly): stop without changing files and report the condition
│  │
│  └─ else: record two clean, up-to-date worktrees and their starting commits
│
├─ **Resolve The Skill And Reserve The Destination**(source selector, source repository, target repository)
│  │
│  ├─ if (the source does not resolve to one valid direct child): stop without reserving a destination
│  │
│  ├─ else if (the destination path or frontmatter name already exists): stop without overwriting, merging, or renaming
│  │
│  └─ else: record the source manifest and reserve `../skills/<name>/`
│
├─ **Produce An Approved Dependency Plan**(complete skill directory, both repositories, scope authorizations)
│  │
│  ├─ **Classify And Resolve Dependencies**(relative links, repository paths, sibling skills, runtime capabilities)
│  │  │
│  │  ├─ if (a dependency is internal): keep its link relative to the skill directory
│  │  │
│  │  ├─ else if (it belongs to active-repository configuration): express it from the consumer root and declare the requirement
│  │  │
│  │  └─ else: retain the sibling-skill or runtime dependency only when consumers will have it, and declare it
│  │
│  ├─ **Resolve Incoming References**(source references to the departing skill)
│  │  │
│  │  └─ if (a source file points to the departing skill): obtain approval for a concrete rewrite or stop
│  │
│  └─ **Enforce Scope Boundaries**(proposed resolutions, scope authorizations)
│     │
│     └─ if (a resolution moves another skill, changes behavior, or expands scope): obtain explicit approval or stop
│
├─ **Create And Review The Target Copy**(source manifest, unused destination, approved plan)
│  │
│  ├─ if (the initial copied manifest, hashes, or modes differ): remove the incomplete target and stop without touching the source
│  │
│  └─ else: apply only approved portability changes and update the target README
│
├─ **Validate And Commit The Destination**(target copy, target README changes)
│  │
│  ├─ if (validation, staging scope, or commit fails): leave the source untouched and report the failure
│  │
│  └─ else: create a scoped target commit containing the complete skill and intended README changes
│
├─ **Remove And Commit The Source**(target commit, approved incoming-reference updates)
│  │
│  ├─ if (validation, staging scope, or commit fails): preserve the committed target and report incomplete source cleanup
│  │
│  └─ else: create a scoped source commit removing the skill and only approved references
│
└─ **Report The Result**(source manifest, approved plan, target commit, source commit)
   │
   ├─ **Handle Pushes**(push authorization, both commits)
   │  │
   │  ├─ if (pushing was explicitly requested): push only after both commits exist and record each result
   │  │
   │  └─ else: do not push
   │
   └─ **Render The Completion Report**(paths, portability changes, commits, validations, push status)
      │
      ├─ if (both worktrees are clean, both commits match the manifest and plan, and requested pushes succeeded): report `Status: complete`
      │
      └─ else: name the unmet condition and report `Status: incomplete: unmet condition`
