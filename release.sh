#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/packages/cli"
bun run build
tgz=$(bun pm pack --quiet)
bun publish --access public "$PWD/$tgz"
