# Agent Skills and skills.sh compatibility

**Research date:** 2026-08-17  
**Scope:** Agent Skills official specification/reference repository, skills.sh official documentation and CLI source, and Claude Code's first-party skill documentation where it explains the existing custom field. Agent Skills source was inspected at commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379`; skills CLI source at `c6f69c631292444cc541ac6d91e2226b0ff247da` (`skills` 1.5.22).

## Conclusion

Keep this repository's current flat layout:

```text
skills/
├── README.md
├── AGENTS.md
├── callstack-simulation/SKILL.md
├── create-workflow-skill/SKILL.md
├── ...one directory per skill...
└── docs/research/...
```

Top-level skill directories are valid. The Agent Skills specification deliberately does not prescribe where skill directories live; it specifies each skill's contents. The skills CLI explicitly scans immediate children of a repository root, so this project's layout is directly installable. Moving the folders under a new `skills/` container is unnecessary. Do **not** add a repository-root `SKILL.md`: the current skills CLI treats that as a single directly targeted skill and normally returns before scanning child skills. [Agent Skills client guide](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/client-implementation/adding-skills-support.mdx#L36-L62); [skills CLI discovery source](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/skills.ts#L229-L263).

## Agent Skills requirements

The following are **requirements**, not repository recommendations:

- A skill is a directory containing a file named exactly `SKILL.md`. Other files and directories are allowed. [`specification.mdx` lines 6–17](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L6-L17)
- `SKILL.md` must contain YAML frontmatter followed by Markdown. The Markdown body has no format restrictions. [`specification.mdx` lines 19–56](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L19-L56); [`specification.mdx` lines 176–185](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L176-L185)
- Required `name`: 1–64 characters; lowercase letters, digits, and hyphens only; no leading, trailing, or consecutive hyphens; it must exactly match the parent directory name. [`specification.mdx` lines 58–89](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L58-L89)
- Required `description`: a non-empty string of 1–1024 characters. It should say both what the skill does and when to use it. [`specification.mdx` lines 91–109](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L91-L109)
- Optional standard fields are `license`, `compatibility`, `metadata`, and experimental `allowed-tools`. If present, `compatibility` is a string no longer than 500 characters; `metadata` is a string-to-string map; `allowed-tools` is a space-separated string. [`specification.mdx` lines 111–174](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L111-L174)
- Additional client-specific data belongs in `metadata`, not in an unknown top-level field. The official reference validator rejects top-level keys outside the six fields above. [Reference validator](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/skills-ref/src/skills_ref/validator.py#L15-L22); [unknown-field check](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/skills-ref/src/skills_ref/validator.py#L104-L114)
- References to bundled files should use paths relative to the skill root. [`specification.mdx` lines 226–237](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L226-L237)

The following are **recommendations/conventions**, not validity requirements:

- Use `scripts/`, `references/`, and `assets/` for executable code, on-demand documentation, and static resources. Any other files or directories remain permitted. [`specification.mdx` lines 187–214](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L187-L214)
- Keep `SKILL.md` below about 5,000 tokens/500 lines, load resources only when needed, and avoid deep reference chains. [`specification.mdx` lines 216–237](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L216-L237)
- `.agents/skills/` is a cross-client **installation/discovery convention**, not a required source-repository layout. [Agent Skills client guide](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/client-implementation/adding-skills-support.mdx#L45-L72)

## skills.sh discovery and installation

- `npx skills add` accepts GitHub `owner/repo`, full GitHub URLs, direct repository tree paths, GitLab or other Git URLs, and local paths. `--list` lists discovered skills; `--skill` selects by frontmatter name. [Official CLI README](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/README.md#L28-L48); [options and examples](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/README.md#L72-L112)
- A candidate is installable when `SKILL.md` parses and has string `name` and `description` values. The CLI does not enforce the complete Agent Skills naming rules or reject other top-level frontmatter keys, so passing skills.sh discovery alone is weaker than standards validation. [skills CLI parser](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/skills.ts#L77-L129)
- Discovery checks an immediate child skill at repository root, then known containers including `skills/` and agent-specific skill directories. Known containers are traversed up to three levels; the repository root stays depth one. If nothing is found, the CLI falls back to a recursive search capped at depth five. [skills CLI discovery](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/skills.ts#L132-L154); [priority and traversal](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/skills.ts#L247-L317); [depth constant](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/constants.ts#L1-L6)
- By default, installation copies the selected skill directory to the canonical project or global `.agents/skills/<name>` location and symlinks agent-specific directories to it; `--copy` instead copies directly. [canonical path source](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/installer.ts#L98-L101); [install implementation](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/installer.ts#L265-L300); [copy/symlink behavior](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/installer.ts#L336-L412)
- A repository appears on the skills.sh leaderboard after installs are reported through the CLI's anonymous telemetry; no separate publishing layout is required. [Official skills.sh FAQ](https://skills.sh/docs/faq)

## Findings for this repository

The repository currently has 11 top-level skill directories. All 11 have exact `SKILL.md` filenames, matching directory/frontmatter names, descriptions within the limit, and fewer than 500 lines. Their existing `references/` and `assets/` folders use the standard conventions.

Using the official `skills-ref` validator at the pinned Agent Skills commit:

- **9 skills pass.**
- **2 fail only because of the unknown top-level field `disable-model-invocation`:** `extract-to-tasks` and `transcript-extraction`.

Using the pinned skills CLI against the local repository with `add <path> --list`, all 11 are discovered. This difference is expected because skills.sh requires string `name` and `description` but tolerates extra fields.

`disable-model-invocation` is a documented Claude Code extension that prevents automatic model activation, but it is not an Agent Skills standard field. [Claude Code skills documentation](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill)

## Recommended actions

1. **Keep the flat top-level skill directories.** They are valid and verified with skills.sh; do not move them under `skills/`.
2. **Keep repository-only files at the root** (`README.md`, `AGENTS.md`, and `docs/`). Do not create a root `SKILL.md`.
3. **Group the catalog without moving skills.** Add a root `skills.sh.json` to organize the skills.sh page, and mirror those sections in `README.md`. This file affects presentation only—not CLI discovery, installation, or `SKILL.md` contents. [Official customization documentation](https://skills.sh/docs/customize)

```json
{
  "$schema": "https://skills.sh/schemas/skills.sh.schema.json",
  "notGrouped": "bottom",
  "groupings": [
    {
      "title": "Skill authoring",
      "skills": ["create-workflow-skill", "decompose-skill", "extract-skill-to-repository"]
    },
    {
      "title": "Planning and delivery",
      "skills": ["plan-happy-path", "implement-happy-path"]
    },
    {
      "title": "Simulation",
      "skills": ["callstack-simulation", "state-machine-simulation"]
    },
    {
      "title": "Transcripts",
      "skills": ["transcript-filing", "transcript-extraction", "transcript-purpose-analysis", "extract-to-tasks"]
    }
  ]
}
```

4. **For strict Agent Skills compliance, remove the two top-level `disable-model-invocation` keys or move their information into a namespaced string entry under `metadata`.** Moving it under `metadata` preserves descriptive metadata but not Claude Code's documented manual-only behavior, which expects the field at top level. If that behavior is essential, generate a Claude-specific installed variant rather than making the canonical skill non-standard.
5. **Optionally add CI validation** for every top-level skill and a skills.sh discovery smoke test. Pinning revisions makes changes explicit:

```bash
set -euo pipefail
while IFS= read -r -d '' file; do
  uvx --from 'git+https://github.com/agentskills/agentskills.git@69ef37e9424c0a7ea9dd2293b559e43ec8176379#subdirectory=skills-ref' \
    skills-ref validate "$(dirname "$file")"
done < <(find . -mindepth 2 -maxdepth 2 -name SKILL.md -print0)

npx --yes skills@1.5.22 add . --list
```

The validator command is the official validation interface. [`specification.mdx` lines 239–247](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx#L239-L247); [`skills-ref` README](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/skills-ref/README.md#L34-L52)
