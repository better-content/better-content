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

For a fresh smoked distribution, run `./dist.sh` exactly once and then run `./smoke.sh`.
`smoke.sh` deploys the exact client and server ZIPs already present under `dist/`, records their
SHA-256 hashes before launch, and requires the same hashes afterward. Never rebuild between smoke
and publication: the ZIPs that pass are the ZIPs to publish.

`dist.sh` delegates release assembly to `package.sh`. `smoke.sh` extracts the packaged production
server, changing only `eula=true` and `online-mode=false`, and imports the packaged CurseForge
client manifest into a disposable client runtime. After initial server readiness it requires and
promotes a complete live runtime-data snapshot to the ignored `generated/runtime-dumps/` directory.
It then checks complete CLI lifecycle transactions, a bounded settled dedicated-server connection,
a fresh single-player world join, process shutdown, every run-local log, fatal signatures, and unchanged candidate hashes. Resolved client artifacts
persist under
`~/.cache/bc/packwiz-downloads`; set `BC_PACKAGE_ARTIFACT_CACHE` to use another disposable
cache root. The smoke run root and settle duration may be set with `BC_SMOKE_RUN_ROOT` and
`BC_SMOKE_SETTLE_SECONDS`.

`./smoke.sh` is the sole supported runtime evaluation, but it is not the default check for
every edit. Do not run it for simple, localized config-only changes that can be verified by
focused inspection or the owning format/tool; for example, use `packwiz refresh`, hash
verification, and `git diff --check` for a single packaged config default. Run the smoke
evaluation when the user explicitly requests it, when preparing a fresh smoked distribution,
when a repository workflow specifically requires it, or when a change plausibly affects game
startup, client joining, or cross-system runtime integration.

Do not add other runtime evaluations: static validation suites, contracts, audits, unit tests,
GameTests, performance budgets, persistence scenarios, doctor checks, or scenario matrices.
Questbook visual authoring is the sole exception: use the Minecraft-free sibling harness at
`/home/dev/ftb-quests-layout-harness/standalone` to render and inspect live FTB Quests chapter
layouts and to run its icon audit against an available reference-client atlas. These are static
authoring checks, not runtime evaluations; they complement `./smoke.sh` without replacing or
broadening it.

## Tools and quarantine
The entire former `tools/` tree is quarantined. Do not recreate an active `tools/` directory.
`quarantine/` is unsupported and removable. Active runtime content, `dist.sh`, and `smoke.sh`
must not depend on or include it. Do not restore or invoke quarantined code unless the user
explicitly reverses this decision. This quarantine applies to the pack-local former `tools/`
tree, not to `/home/dev/ftb-quests-layout-harness`, which is the supported questbook layout
renderer. Custom mod sources live in independent repositories under
`/home/dev/mod_source/` and must not be recreated here or at the workspace top level.

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
and presentation according to `docs/questbook_standards.md`; use only the sibling standalone
layout harness's documented render and icon-audit commands for static visual authoring.
`./smoke.sh` remains the sole supported runtime evaluation.
