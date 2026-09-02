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
    "generate": "andrue-cli generate ./schema.js"
  }
}
```

`manage-project` writes a durable task record. `generate` prints samples from a module that default-exports an Effect Schema.
