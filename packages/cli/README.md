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
