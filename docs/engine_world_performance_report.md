# Engine / World Performance Report

Generated: 2026-04-30

Instance:

`/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft`

## Current Valid World-Entry Profile

The current repo-active profile can generate and enter a fresh client-created world after syncing the live Prism instance to the repo-active mod set and removing Create Track Map.

| Metric | Value |
|---|---:|
| Loaded mods | 345 |
| Main menu to in-game | 108.5s |
| Total load/open-world time | 148.9s |
| Spawn preparation | 82.5s |
| In-world RSS sample peak | 12.33 GiB |
| In-world RSS sample final/live | 12.29 GiB |
| EMI reload | 10.0s |
| Patchouli JSONs | 911 |
| Create injected recipes | 832 |
| Server tick-behind warnings | 2 |
| Max tick-behind | 8,973ms / 179 ticks |
| SettlementRoads rebuilds logged | 33 |

Primary artifacts:

- `docs/current_world_entry_metrics.json`
- `docs/memory_variants/current_repo_world_entry_after_ctm_cut/metrics.json`
- `docs/memory_variants/current_repo_world_entry_after_ctm_cut/rss_profile.jsonl`

## Hard Crash Fixed

`Create Track Map` was removed from the active profile after integrated-server startup crashed with:

`java.lang.NoSuchMethodError: 'void kotlinx.coroutines.internal.LockFreeLinkedListHead.addLast(kotlinx.coroutines.internal.LockFreeLinkedListNode)'`

Crash report:

`/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/crash-reports/crash-2026-04-30_10.41.18-server.txt`

This points to an incompatible Ktor/coroutines dependency path inside `create-track-map-1.4+mc1.20.1-neoforge.jar`.

## Stale Instance Jar Issue Fixed

The live Prism instance contained jars no longer present in the repo-active Packwiz set. These caused misleading crashes, including a stale Thalassophobia client packet crash.

Manual disabled jar manifest:

`/tmp/btm_manual_disabled_stale_jars.txt`

Current disabled live jars: 89.

## Current Performance Risks

### SettlementRoads Rebuild Loop

The log contains repeated lines like:

`Rebuilt world network: 52 discovered structures, 31 active structures, 30 connections`

The metrics pass counted 33 rebuilds in the captured log. Rebuild cadence reached roughly every 2 seconds while the player was exploring/spawning.

Risk: repeated full graph rebuilds can produce server-thread pressure during chunk discovery and contribute to post-join tick backlog.

Recommended next implementation target:

- Debounce world-network rebuilds.
- Rebuild only after structure-discovery changes settle.
- Avoid rebuilding the complete graph every short interval when no relevant structure set changed.
- Add debug counters/timings inside the custom mod so future logs show rebuild duration and cause.

### Initial Tick Backlog

The log contains 2 server tick-behind warnings after join, peaking at `8,973ms / 179 ticks`.

Likely contributors:

- spawn-area generation and structure discovery
- EMI reload work near join
- SettlementRoads repeated rebuilds
- Distant Horizons client-side LOD/cache activity, although distant generation is disabled

### Distant Horizons Color Warnings

Warnings from `ClientBlockStateColorCache` appeared for some blocks/biomes. These were non-fatal in the successful run.

Current DH config snapshot:

- `enableDistantGeneration=false`
- `distantGeneratorMode=PRE_EXISTING_ONLY`
- `lodChunkRenderDistanceRadius=128`
- `maxHorizontalResolution=FOUR_BLOCKS`

## Interpretation

The current profile is now functionally validated for fresh world entry, but it is a ~12 GiB RSS profile, not an 8 GiB profile. Further RAM reduction must come from content/model/texture surface cuts or a separate lite profile, not from JVM flags alone.

## SettlementRoads Runtime Patch

Date: 2026-04-30

Observed issue in successful fresh-world log:

- `SettlementRoadsRuntime` rebuilt the world road network 33 times during initial world entry/exploration.
- Rebuild cadence was as low as roughly every 2 seconds because loaded-chunk observation changes marked the level dirty and the previous minimum rebuild spacing was only 40 ticks.

Patch applied in source:

`/home/gerald/mcmods/settlement-roads/src/main/kotlin/com/gerald/settlementroads/runtime/SettlementRoadsRuntime.kt`

`/home/gerald/mcmods/settlement-roads/src/main/kotlin/com/gerald/settlementroads/planner/PlannerConfig.kt`

Behavior change:

- `minTicksBetweenRebuilds` increased from `40L` to `200L`.
- Added `dirtyDebounceTicks = 100L`.
- Dirty events now record `lastDirtyGameTime`.
- Rebuilds now require both minimum spacing and a quiet/debounced dirty period.
- Level unload clears `lastDirtyGameTime` state.

Build result:

- `/home/gerald/mcmods/settlement-roads`: `./gradlew clean build` passed.
- Rebuilt jar copied to repo: `mods/settlementroads-0.1.0.jar`.

Validation note:

The currently-running client still has the old jar loaded. This patch requires a client restart and fresh world-entry log before measuring the new rebuild count.
