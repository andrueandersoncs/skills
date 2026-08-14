---
name: extract-skill-to-repository
description: Move one complete project skill from `.agents/skills/` into the sibling `../skills` Git repository. Use when asked to extract or relocate a repository skill into the shared skills repository.
compatibility: Requires the current project and ../skills to be Git repositories.
---

# Extract Skill to Repository

Move exactly one complete project skill into the sibling skills repository while preserving its files, making its dependencies portable, and leaving both repositories with scoped commits. Product code, dependency skills, and unrelated work are outside this workflow unless the user explicitly approves them.

## Input

The user supplies either a skill name or a path matching `.agents/skills/<name>/`. Resolve it from the current repository root.

## Output

Move the complete source directory to `../skills/<name>/`, update `../skills/README.md`, and commit the addition and removal in their respective repositories. The target repository uses one skill directory at its root; do not add a `skills/` or `.agents/skills/` wrapper.

## Process

1. **Establish safe repositories.** Resolve the current Git root and its sibling `../skills`, then read the repository instructions that govern both. Follow those instructions to select and update the working branches from their remotes. Require clean worktrees before changing either repository; if a repository is missing, dirty, or cannot update cleanly, stop and report the condition. The completion criterion is two identified, clean, up-to-date Git worktrees and a recorded starting commit for each.
2. **Resolve the skill and collision boundary.** Require one direct child of `.agents/skills/` containing `SKILL.md`. Parse its YAML frontmatter and require its `name` to match the directory. Set the destination to `../skills/<name>/`; if it or another target skill with the same frontmatter name exists, stop rather than overwrite, merge, or rename it. The completion criterion is a manifest of every source file and an unused destination.
3. **Audit the dependency seam.** Read the complete skill directory. Inspect every relative Markdown link and repository-relative path, search both repositories for references to the skill name or source path, and classify each dependency as internal to the directory, another skill, active-repository configuration, or a runtime capability.
   - Keep internal references relative to the skill directory.
   - Express active-repository files as paths resolved from the consumer repository root rather than source-relative Markdown links. Record these requirements in `compatibility` or the target README.
   - Keep a sibling-skill or runtime dependency only when it will be available to consumers, and declare it. Moving another skill or changing workflow behavior requires explicit user approval.
   - When a source-repository file points at the departing skill, obtain approval for a concrete rewrite or stop before copying.
   The completion criterion is a post-move resolution for every incoming and outgoing reference, with every scope-expanding change approved.
4. **Stage a verified copy.** Copy the whole skill directory to the unused destination, preserving paths and file modes. Before editing the copy, compare relative-path manifests, file hashes, and modes with the source. Apply only the portability changes approved in the dependency audit, then add or update the target README's included-skill and consumer-requirement entries. Keep the source intact. The completion criterion is a byte-verified initial copy plus a reviewable target-only portability diff.
5. **Validate and commit the destination.** Re-read `SKILL.md`; require valid YAML, a non-empty description, a frontmatter name matching the directory, and valid Agent Skills naming rules. Resolve every local Markdown link, run whitespace checks, and confirm only the new skill and intended README changes are staged. Commit them in the target repository with a scoped message. If validation or commit fails, leave the source untouched and report the failure. The completion criterion is a target commit containing the complete valid skill.
6. **Remove and commit the source.** Delete the complete source directory and apply only the approved incoming-reference updates. Search the source repository for dangling references, run whitespace checks, and stage only the deletion and approved updates. Commit them with a scoped extraction message. If the commit fails, preserve the committed target and report the incomplete source cleanup. The completion criterion is an absent source directory, a present target directory, no unapproved dangling references, and one extraction commit in each repository.
7. **Report the move.** Report the old and new paths, portability or dependency changes, both commit hashes, validation performed, and whether either commit remains unpushed. The workflow is complete when both worktrees are clean, the target commit contains every moved file, and the source commit removes exactly that skill and approved references. Push only when the user asks.
