# Better Content Docs

This directory is intentionally limited to five living Markdown files. The repo is the source of truth for pack content; these docs summarize current intent and operating state only.

## Current Docs

- `README.md`: docs index, pack thesis, and living-doc policy.
- `progression.md`: progression spine, gates, chokepoints, pinnacle powers, and deadlock checks.
- `content_systems.md`: recipes, materials, chemistry, casings, loot, trades, quests, and content surfaces.
- `performance_and_mods.md`: memory findings, mod prune decisions, C2ME/DH/LC/TFTH notes, and active/inactive mod interpretation.
- `custom-mod-workspace.md`: canonical custom-mod repositories, identities, artifacts, validation, and deployment workflow.

## Pack Thesis

Better Content is a Forge 1.20.1 expert-pack content layer built around bounded matter, local logistics, and adventure pressure. Geological deposits, Y-band locality, processing ladders, machine casing tiers, Blood Magic-parented magic, coin/villager/wares economy, obelisk and dimension routes, body systems, and the death/respawn life-length loop are all progression surfaces.

The main source trees are `kubejs/`, `config/`, `defaultconfigs/`, `datapacks/`, `globalresources/`, `resourcepacks/`, `shaderpacks/`, active `mods/*.pw.toml`, and bundled custom jars in `mods/`. Root `dist.sh` and `smoke.sh` are the supported packaging and evaluation entrypoints; `package.sh` is their shared internal packager.

Runtime directories, raw logs, crash reports, screenshots, profiler dumps, generated quest/site/runtime dumps, and local launcher state are not documentation. Keep them under `~/.cache/bc`, `server-instance/`, `server-template/`, or `generated/` unless explicitly requested otherwise.

## Doc Policy

Do not add new one-off audits, pass reports, JSON summaries, raw logs, RAM dumps, or diagnostics under `docs/`. Fold durable conclusions into the closest living doc and leave raw evidence in the run root.

When progression behavior changes, update `progression.md` and/or `content_systems.md`. When custom-mod ownership, identity, validation, or deployment changes, update `custom-mod-workspace.md`. When mod composition, performance, or runtime compatibility changes, update `performance_and_mods.md`. The sole supported modpack evaluation is `./smoke.sh`, as defined in the root `AGENTS.md`.

Claims in these docs must be checked against current source files. If an ID, mod, recipe, or config cannot be confirmed, write `UNKNOWN` or frame it as a future candidate.

Do not add historical notes, generated Markdown reports, old schema notes, or retired tool matrices to the tracked tree. Fold durable conclusions into these five files and keep raw evidence outside the repository; do not recreate `quarantine/docs/`. Do not classify `.txt` files by extension alone: many launcher, Forge, FancyMenu, KubeJS, shaderpack, and mod files are live config or runtime inputs.
