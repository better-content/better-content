# AGENTS.md

## Scope
This repository is the Better Content Forge 1.20.1 modpack content layer.

## Active scripts
- `./dist.sh [OUTPUT_DIR]` creates timestamped CurseForge/client and server-content ZIPs.
- `./smoke.sh` is the sole supported evaluation.

`dist.sh` performs packaging only. Command availability, input copying, packwiz export, and
ZIP creation may fail operationally; it must not add validation, integrity, provenance,
content, schema, archive-membership, cleanliness, or correctness verdicts.

`smoke.sh` checks server readiness, client join, one bounded settled connection, process
shutdown, and fatal-log signatures. It requires `BC_SMOKE_CLIENT_COMMAND`; server command,
work directory, and settle duration may be set with `BC_SMOKE_SERVER_COMMAND`,
`BC_SMOKE_WORK_DIR`, and `BC_SMOKE_SETTLE_SECONDS`.

Do not add other evaluations: static validation, contracts, audits, unit tests, GameTests,
captures, performance budgets, persistence scenarios, visual review, graph evaluation,
doctor checks, or scenario matrices.

## Tools and quarantine
The entire former `tools/` tree is quarantined. Do not recreate an active `tools/` directory.
`quarantine/` is unsupported and removable. Active runtime content, `dist.sh`, and `smoke.sh`
must not depend on or include it. Do not restore or invoke quarantined code unless the user
explicitly reverses this decision. `generated/custom-mod-sources/` is excluded from the purge.

## Runtime safety
Treat pre-existing changes as user-owned. Do not delete player worlds, saves, logs, crash
reports, screenshots, profiler data, or launcher state unless explicitly asked. The tracked
root `options.txt` remains the client-default source.
