# Memory Pressure Audit

Generated: 2026-04-29

Scope: repo config plus live Prism instance at `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1`.

## Summary

The pack is RAM hungry for several compounding reasons, but the highest-confidence causes are:

1. **Distant Horizons is configured extremely aggressively.**
2. **The client pack is huge: latest log reports 430 loaded mods.**
3. **Recipe/book/indexing mods are loading a very large data graph: 50,064 dumped recipes, 4,506 Patchouli book JSONs, EMI reload ~42.5s.**
4. **Development dump tooling is enabled broadly and writes/loads large data surfaces.**
5. **The test world initializes/saves 27 dimensions.**
6. **Shader stack is enabled while Distant Horizons is also active.**
7. **C2ME is using default memory-derived parallelism and produced 81 storage worker shutdown lines in the latest run.**

This is not one leak-shaped issue. It is mostly a high baseline working set plus a few settings that multiply memory/CPU pressure.

## Evidence

### Instance Memory Allocation

`instance.cfg`:

- `MaxMemAlloc=16000`
- `MinMemAlloc=2000`
- `JvmArgs=`
- `OverrideMemory=false`

The live instance is allowed to take up to 16 GiB. Because `OverrideMemory=false`, Prism may use global memory settings rather than this instance value, but the instance file itself advertises 16 GiB.

### Mod Count

Latest log:

- `Loading 430 mods`

Repo mod metadata:

- 337 enabled `.pw.toml` mod entries
- 16 custom jars
- 356 files in `mods/`

A 430-mod Forge client with shaders, Create, AE2, many dimensions, many magic mods, EMI/JEI bridges, and dynamic worldgen is expected to have a multi-GB idle baseline even when healthy.

### Distant Horizons Config

`config/DistantHorizons.toml` high-pressure values:

- `enableDistantGeneration = true`
- `distantGeneratorMode = "FEATURES"`
- `maxGenerationRequestDistance = 4096`
- `maxSyncOnLoadRequestDistance = 4096`
- `realTimeUpdateDistanceRadiusInChunks = 256`
- `lodChunkRenderDistanceRadius = 256`
- `maxHorizontalResolution = "BLOCK"`
- `verticalQuality = "MEDIUM"`
- `horizontalQuality = "MEDIUM"`
- `enableSsao = true`
- `enableNoiseTexture = true`
- `enableBeaconRendering = true`
- `enableGenericRendering = true`

`BLOCK` horizontal resolution is the maximum detail setting documented in the config comments as 256 LODs per chunk. Combined with a 256 chunk LOD render radius and distant generation, this is the strongest single config-level memory multiplier found.

Latest world evidence:

- `saves/New World/data/DistantHorizons.sqlite`: 17 MiB already
- 27 dimension-level DH databases were opened/saved at shutdown
- DH shutdown logged `1 incomplete tasks`

The database size is not itself huge yet, but the live object pools/render buffers generated from this setting are the likely memory issue.

### Recipe, Book, and UI Indexing Pressure

Latest log:

- `Patchouli ... preloaded 4506 jsons`
- `Create ... Created 1256 recipes which will be injected into the game`
- KubeJS recipe processing and audit dump ran
- EMI total reload: `42537 ms`
- Slowest EMI plugin: `jemi` at `6080 ms`

Generated KubeJS config dump in live instance:

- `kubejs/config`: 21.05 MiB, 61 files
- `full_recipe_index_*.json`: ~20 MiB total across 51 chunks
- `valuable_material_usage_recipes.json`: 1.62 MiB
- generated recipe count from suite: 50,064 recipes

The JSON size is not enormous on disk, but recipe viewers and KubeJS can keep parsed recipe/category/index structures in memory. EMI + JEI + JEMI + EMI Loot + EMI Ores + EMI Trades is a convenience stack, not a cheap runtime stack.

### Registry Dumper Pressure

`config/registry_dumper_3000.json` currently enables broad dumping:

- built-in registries on client start
- assets on client start trigger
- runtime registries
- expanded runtime tags
- raw recipes
- broad resources, including many worldgen folders

Live instance dump size:

- `dump`: 101.36 MiB, 128,604 files

This is excellent for development, but should not be enabled in a normal play profile. Even when the files are only written once per session, discovering and serializing these registries/resources increases startup memory churn and IO pressure.

### World / Dimension Fanout

Automated suite from latest log:

- `dimensionSaveCount`: 27
- `worldSaveDurationMs`: 542
- `spawnPrepTimeMs`: 23,874
- `serverTickBehindWarnings`: 3
- `maxTickBehindMs`: 8,212

Save duration is fine, but the dimension fanout is large. Many dimensions imply registries, biome sources, features, datapacks, DH level handles, and mod hooks all exist at runtime.

### C2ME / Threading

`config/c2me.toml` uses defaults for global executor parallelism, C2ME IO cache, no-tick view distance, and threaded worldgen. Latest shutdown logged many `C2ME Storage #N` threads stopping, reaching at least `#81`.

This does not prove a leak. It does indicate high concurrency and many IO workers in the current runtime, which can inflate native stacks, caches, and transient allocation pressure.

### Shaders / Rendering Stack

`config/oculus.properties`:

- `enableShaders=true`
- `shaderPack=ComplementaryReimagined_r5.7.1.zip`
- `maxShadowRenderDistance=32`

This is GPU/VRAM-first, but shader + Oculus + Embeddium + DH can also increase CPU-side render object retention and startup/runtime pressure. For debugging RAM baseline, shaders should be disabled during measurement.

## Ranked Fixes

### MUST DO

#### 1. Split dev dumping from normal play

Proposal:

- Keep registry/KubeJS dump tooling for a dedicated dev profile only.
- In the default/playtest pack config, disable registry dumper startup dumps and KubeJS audit dumps.

Suggested config for normal play:

- `config/registry_dumper_3000.json`
  - `triggers.dumpBuiltInRegistriesOnClientStart = false`
  - `triggers.dumpAssetsOnClientStart = false`
  - `registry.builtInRegistriesEnabled = false`
  - `registry.runtimeRegistriesEnabled = false`
  - `tags.expandedRuntimeTagsEnabled = false`
  - `recipes.rawRecipeJsonsEnabled = false`
  - `resources.enabled = false`
  - `assets.enabled = false`
- `kubejs/config/audit_dumps.json`
  - `enabled = false`

Evidence:

- Live `dump`: 101.36 MiB / 128,604 files.
- Live KubeJS generated config: 21.05 MiB.

Why it fits:

- You still get full recipe graph in dev when explicitly enabled.
- Normal players do not pay startup memory/IO churn for audit artifacts.

Risk:

- Less automatic data available after casual test launches.

Implementation surface:

- Create `config-dev/registry_dumper_3000.json` or a script to toggle dev dumps.
- Add a `tools/enable_dev_dumps.mjs` / `tools/disable_dev_dumps.mjs` pair.

Confidence: High.

#### 2. Tame Distant Horizons defaults

Proposal:

Use conservative pack defaults:

```toml
enableDistantGeneration = false
maxGenerationRequestDistance = 512
maxSyncOnLoadRequestDistance = 512
realTimeUpdateDistanceRadiusInChunks = 64
lodChunkRenderDistanceRadius = 128
maxHorizontalResolution = "FOUR_BLOCKS"
verticalQuality = "LOW"
horizontalQuality = "LOW"
enableSsao = false
enableNoiseTexture = false
enableBeaconRendering = false
enableGenericRendering = false
```

Alternative if you still want DH on by default:

```toml
enableDistantGeneration = true
distantGeneratorMode = "PRE_EXISTING_ONLY"
lodChunkRenderDistanceRadius = 128
maxHorizontalResolution = "FOUR_BLOCKS"
```

Evidence:

- Current config uses `BLOCK`, `256` chunk radius, and `4096` chunk request/sync distances.
- Latest run opened DH databases for 27 dimensions.

Why it fits:

- Distance matters in this pack, but DH should not precompute/render extreme detail for every visited dimension by default.
- Players who want big vistas can opt in.

Risk:

- Less dramatic horizon visuals by default.

Implementation surface:

- `config/DistantHorizons.toml`

Confidence: Very high.

#### 3. Disable shaders during baseline performance testing

Proposal:

Set default playtest/baseline config:

```properties
enableShaders=false
maxShadowRenderDistance=16
```

Evidence:

- `config/oculus.properties` currently enables Complementary Reimagined with 32 shadow render distance.
- Shaders confound RAM/VRAM/CPU diagnosis.

Why it fits:

- Baseline tests should isolate pack simulation/data cost before render extras.

Risk:

- Visual downgrade unless users re-enable shaders.

Implementation surface:

- `config/oculus.properties`

Confidence: Medium/high.

### SHOULD DO

#### 4. Cap C2ME concurrency for this pack

Proposal:

Use explicit lower parallelism instead of memory-derived default:

```toml
globalExecutorParallelism = 4

[noTickViewDistance]
maxConcurrentChunkLoads = 3

[ioSystem]
chunkDataCacheSoftLimit = 2048
chunkDataCacheLimit = 8192
```

Evidence:

- Latest shutdown logged many C2ME storage worker threads, reaching at least `C2ME Storage #81`.
- Current config uses default parallelism and default IO cache values.

Why it fits:

- This pack has heavy modded worldgen and many dimensions. More async workers can mean more simultaneous in-flight chunk/state objects, not lower memory.

Risk:

- Slower chunkgen on high-end systems.
- C2ME settings can have compatibility sensitivity; test worldgen after changes.

Implementation surface:

- `config/c2me.toml`

Confidence: Medium.

#### 5. Create a “dev recipe graph” mode instead of always emitting full graph chunks

Proposal:

Keep `full_recipe_index_*.json` generation, but require an explicit marker file or env-var-like config and auto-disable after one successful dump.

Evidence:

- Full recipe index is ~20 MiB on disk, 50,064 recipes.
- It is useful but not needed during normal gameplay.

Why it fits:

- Preserves your requirement that recipe graph can be made available consistently for dev.
- Removes accidental runtime cost from normal play.

Risk:

- Agent/dev workflow needs one explicit command before audit work.

Implementation surface:

- `kubejs/server_scripts/90_dev_debug/10_recipe_audit_dumps.js`
- `kubejs/config/audit_dumps.json`
- optional `tools/enable_dev_recipe_dumps.mjs`

Confidence: High.

#### 6. Reduce recipe viewer duplication

Proposal:

For normal play, consider one primary recipe UI stack. Current pack includes JEI, EMI, JEMI bridge, EMI Loot, EMI Ores, EMI Trades, TConJEI, and FTB Quests using JEI helper.

Options:

- Keep EMI + JEI only where required, remove extra plugins from normal profile if nonessential.
- Keep EMI plugins in dev profile only if they are mainly debugging conveniences.

Evidence:

- EMI reload total: 42,537 ms.
- JEMI plugin alone: 6,080 ms.
- Recipe graph: 50,064 recipes.

Why it fits:

- Expert packs need recipe visibility, but every extra recipe integration indexes a massive graph.

Risk:

- Less visibility for loot/ore/trade recipes if removed from normal profile.

Implementation surface:

- `mods/emi-*.pw.toml`
- `mods/jei.pw.toml`
- `mods/tconjei.pw.toml`
- FTB Quests integration expectations

Confidence: Medium.

#### 7. Audit/remove purely decorative high-cardinality mods from the core profile

Proposal:

Move some decorative/block-variant mods to optional/default-off profile after quest/trade coverage exists.

Evidence:

- KubeJS logs show many invalid/fallback recipes from `excessive_building` and similar decorative surfaces.
- Decorative blocks are explicitly allowed to be sideloaded by villager trades, so they do not all need to be in the core progression path.

Why it fits:

- Decorative content is useful, but high-cardinality block families inflate registries, models, loot/recipe tables, recipe viewers, and tags.

Risk:

- Removes building variety unless optional profile is easy to enable.

Implementation surface:

- Packwiz optional mods/profile split.

Confidence: Medium.

### MAYBE

#### 8. Default simulation distance lower than render distance

Proposal:

Set:

```txt
renderDistance:10
simulationDistance:6
mipmapLevels:2
```

Evidence:

- Current `options.txt`: render distance 12, simulation distance 12, mipmaps 4.

Why it fits:

- This pack values distance, but simulation distance is not the same as visual distance. Keeping simulation distance lower reduces active entity/tile/chunk pressure.

Risk:

- Farms/machines stop simulating sooner.

Implementation surface:

- `options.txt`

Confidence: Medium.

#### 9. Measure with Spark heap summary before and after config changes

Proposal:

Use Spark in-game or server commands after loading into world:

```text
/spark heap summary
/spark profiler --timeout 60
```

If available, capture heap dump only when necessary.

Evidence:

- Spark is installed.
- Current logs do not contain an object-level heap breakdown, so config evidence is strong but not object-attribution precise.

Why it fits:

- This is the only way to distinguish “DH buffers” from “recipe viewer cache” from “model bake” with confidence.

Risk:

- Heap dumps are huge and can pause/freeze the client.

Implementation surface:

- Manual test plan or automated command harness if we add one later.

Confidence: High as diagnostic, not as direct fix.

## Suggested First Patch Set

If you want me to apply fixes instead of just documenting them, start with this low-risk set:

1. Conservative `DistantHorizons.toml` defaults.
2. Disable Oculus shaders in repo default config.
3. Add `tools/enable_dev_dumps.mjs` and `tools/disable_dev_dumps.mjs`.
4. Set repo default `registry_dumper_3000.json` to normal-play off.
5. Keep KubeJS recipe audit dumps off unless explicitly toggled.
6. Add suite checks that fail/soft-warn when normal-play configs have DH or dumper settings back at extreme values.

Expected impact:

- Lower live heap/native/render memory pressure.
- Lower startup IO churn.
- Cleaner baseline performance tests.
- No progression/content loss.

## Current Best Explanation

The pack is not RAM hungry because of a single obvious Java leak in the available evidence. It is RAM hungry because the default runtime is simultaneously acting as:

- a 430-mod expert client,
- a shader client,
- a Distant Horizons high-detail renderer/generator,
- a full recipe/loot/trade dev indexer,
- a registry/resource dumper,
- and a many-dimension integrated server.

The fastest win is to separate **normal play** from **dev audit mode**, then make Distant Horizons opt-in or conservative by default.
