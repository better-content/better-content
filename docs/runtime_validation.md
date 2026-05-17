# Runtime Validation

## Policy

Raw validation output belongs in `/tmp`, disposable runtime roots, `server-instance/`, `server-template/`, or `generated/`, not in `docs/`. Commit only concise conclusions here. Do not add new per-run summary directories under `docs/`.

For any retained claim, prefer current source files over old reports. If a runtime result came from a stale instance or stale jar cache, rerun with the current sync/bootstrap path before treating it as evidence.

## Static Ladder

Use this order for routine content work:

```bash
node --check kubejs/server_scripts/path/to/touched.js
node --check kubejs/startup_scripts/path/to/touched.js
node tools/validate_kubejs_assets.mjs
node tools/validate_chemistry_identity.mjs
node tools/validate_synthesis_pipeline.mjs
```

For JSON or datapack edits:

```bash
python3 -m json.tool path/to/file.json >/dev/null
```

For tooling changes:

```bash
bash -n tools/*.sh
python3 -m py_compile tools/*.py
```

For Iron's Spells cross-magic coverage audits:

```bash
node tools/audit_cross_magic_spellcraft.mjs --mods-dir /tmp/btm-magic-audit-mods/mods
```

The audit writes compact generated summaries under `generated/validation/cross_magic_spellcraft/`; keep those generated files out of `docs/` unless a concise conclusion needs to be recorded here.

## Sync And Smoke

Current server sync and content smoke commands:

```bash
tools/sync_to_server.sh --dry-run
tools/sync_to_server.sh --apply --server-dir server-instance
tools/server_content_smoke.sh --server-dir /tmp/btm-content-smoke --port 25566 --reset-runtime
```

`tools/server_content_smoke.sh` bootstraps a fresh server, prunes stale runtime mods, boots the server, scans hard log failures, and runs `tools/pack_test_suite.mjs`. Prefer it for routine KubeJS recipe/config/content changes.

Use `BTM_INSTANCE=/path/to/runtime node tools/pack_test_suite.mjs` only when the runtime log is from a fresh or intentionally reused current runtime.

## Portable Harnesses

Portable scenario mechanics live in `tools/portable_minecraft_harness.py`. Scenario scripts should create fresh server/client runtimes under `/tmp`, capture raw evidence there, and write any machine summaries under the run root.

Current LC/DH/C2ME/TFTH scenario:

```bash
python3 tools/lc_tfth_c2me_dh_stability.py
python3 tools/lc_tfth_c2me_dh_stability.py --cycles 1 --idle-seconds 30 --tfth-seconds 30
```

Expected full validation is three clean boot/join/Lost Cities teleport/Distant Horizons generation/TFTH pressure cycles, required jars present on server and client, no crash reports, no ModernFix watchdog, no C2ME thread-guard failures, and DH activity observed.

## Current Runtime State

Current baseline assumptions from source:

- Minecraft `1.20.1`, Forge `47.4.13`.
- Local server port `25566`.
- C2ME is active through `mods/concurrent-chunk-management-engine-for-forge-the.pw.toml` and `config/c2me.toml`.
- Distant Horizons is active through `mods/distant-horizons.pw.toml` and `config/DistantHorizons.toml`.
- The Flesh That Hates is active through `mods/the-flesh-that-hates.pw.toml` plus `config/TFTH.toml` and `config/TFTH-Data.toml`.
- Lost Cities is active through `mods/the-lost-cities.pw.toml`.
- Server bootstrap prunes stale runtime mods with `tools/prune_runtime_mods.mjs`.

Known historical C2ME risk: earlier full/default C2ME produced login watchdog/deadlock signatures around `PlayerRespawnLogic` and async chunk access. Later source-state notes reported passing constrained/full-risk probes and fresh-world stress after custom jar repairs, but those old per-run docs were deleted as evidence dumps. Revalidate with the portable harness before claiming a new pass.

## Known Follow-Ups

- Confirm Creating Space travel UI and actual travel for the Earth orbit to Lost Cities route.
- Validate long settlement-roads and village-walls generation beyond boot/join.
- Confirm Unearthed/Hyle deepslate replacement in fresh terrain.
- Re-run LC/DH/C2ME/TFTH scenario after any mod, config, worldgen, or custom jar change affecting those systems.
