# AGENTS.md

## Scope
This repository is the Better Content Forge 1.20.1 modpack content layer.

## Active scripts
- `./dist.sh` creates versioned CurseForge/client and server-content ZIPs under the
  canonical ignored `dist/` directory. It accepts no output-directory override.
- `./smoke.sh` is the sole supported evaluation.
- `./package.sh` is their shared internal packager; do not invoke alternate assemblers.

`dist.sh` performs packaging only. Command availability, input copying, packwiz export, and
ZIP creation may fail operationally; it must not add validation, integrity, provenance,
content, schema, archive-membership, cleanliness, or correctness verdicts.

`dist.sh` and `smoke.sh` both delegate content and artifact assembly to `package.sh`.
`smoke.sh` creates disposable server and client runtimes, resolves packwiz artifacts,
installs Forge, then checks server readiness, client join, one bounded settled connection,
process shutdown, and fatal-log signatures. Its cache root and settle duration may be set
with `BC_SMOKE_RUN_ROOT` and `BC_SMOKE_SETTLE_SECONDS`.

Do not add other evaluations: static validation, contracts, audits, unit tests, GameTests,
captures, performance budgets, persistence scenarios, visual review, graph evaluation,
doctor checks, or scenario matrices.

## Tools and quarantine
The entire former `tools/` tree is quarantined. Do not recreate an active `tools/` directory.
`quarantine/` is unsupported and removable. Active runtime content, `dist.sh`, and `smoke.sh`
must not depend on or include it. Do not restore or invoke quarantined code unless the user
explicitly reverses this decision. Custom mod sources live in sibling repositories under `/home/dev` and must not be recreated here.

## Runtime safety
Treat pre-existing changes as user-owned. Do not delete player worlds, saves, logs, crash
reports, screenshots, profiler data, or launcher state unless explicitly asked. The tracked
root `options.txt` remains the client-default source.

## FTB Quests authoring protocol

Treat `config/ftbquests/quests/` as hand-authored runtime content. `quests/graph.yml`,
`generated/ftbquests/`, and `quest-storage/` are reference or inactive surfaces and must not
silently replace live SNBT. Read `docs/questbook_standards.md` before changing the questbook.

Before editing, state the intended player action, the task that proves it, and every literal
prerequisite. Inspect the entire affected chapter plus any linked source quests, reveal rules,
or KubeJS/custom-mod criteria. Do not infer mechanics from quest prose alone; trace the recipe,
event, tag, criterion, or integration that implements them.

Preserve chapter, quest, task, and reward IDs when their meanings remain the same. For new IDs,
use unique uppercase 16-digit hexadecimal values and search all live and stored quest content
before assigning them. A native quest link points to its authoritative quest; never duplicate
its task, reward, or completion state. Do not reorder unrelated SNBT or rewrite whole chapters
for a local change.

Coordinate overlapping quest edits at chapter granularity through the lane claim files. A claim
must name every chapter and cross-cutting integration file in scope. Before handoff, report:

- the player-visible behavior changed;
- IDs added, removed, or repurposed;
- dependencies, links, visibility, criteria, and rewards affected;
- supporting runtime files changed outside `config/ftbquests/`;
- the result of `./smoke.sh`, or the exact reason it was not run or did not pass.

Do not invent a second quest compiler, schema, linter, audit, or validation command. Review SNBT
and in-game presentation according to `docs/questbook_standards.md`; `./smoke.sh` remains the sole
supported repository evaluation.
