# @andrue/cli

Install as a dev dependency. `andrue-cli` is then available in package scripts.

```sh
bun add -d @andrue/cli
```

```json
{
  "scripts": {
    "project": "andrue-cli manage-project show",
    "board": "andrue-cli manage-project serve",
    "wiki": "andrue-cli wiki --root ./wiki lint",
    "generate": "andrue-cli generate ./schema.js"
  }
}
```

`manage-project` writes a durable task record. `wiki` operates on a Git-backed Markdown wiki. `generate` prints samples from a module that default-exports an Effect Schema.

The CLI requires Node.js `^20.17.0 || >=22.9.0`.

Project actions from the CLI and board share one cross-process lock covering the complete read–modify–write operation. Atomic replacement preserves existing file permissions and keeps readers from seeing partial JSON. Use these action entry points for concurrent updates; direct edits to `project.json` do not participate in the lock.

From the package directory, `bun run test` builds the CLI and runs its workflow and concurrency regressions.
