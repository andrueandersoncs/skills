import { chmodSync, cpSync, readFileSync, writeFileSync } from "node:fs"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    cli: "src/cli.ts"
  },
  format: ["esm"],
  dts: false,
  splitting: false,
  clean: true,
  target: "esnext",
  async onSuccess() {
    const cli = "dist/cli.js"
    const text = readFileSync(cli, "utf8")
    if (!text.startsWith("#!")) writeFileSync(cli, `#!/usr/bin/env node\n${text}`)
    chmodSync(cli, 0o755)
    writeFileSync("dist/index.d.ts", "export declare const version: string\n")
    cpSync("src/manage-project/web", "dist/web", { recursive: true })
  }
})
