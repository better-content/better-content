# Custom Mod Workspace

Custom mod sources are independent sibling repositories under a common workspace root. Worklane uses `/home/dev`, so the modpack is checked out at `/home/dev/better-content-modpack` and each custom mod is checked out at `/home/dev/<repository>`. Other environments may use a different root, but must preserve the sibling relationship. Never recreate custom-mod source trees inside the modpack.

Every canonical repository is hosted at `https://github.com/better-content/<repository>.git`. Runtime IDs are a clean break from earlier development identifiers; no legacy world or config migration is supported.

## Build And Deploy

Run the listed validation and staging command from the custom-mod repository. `stageRuntimeJar` writes the deployable reobfuscated JAR to the canonical `build/libs/` path shown below.

Copy that JAR into `../better-content-modpack/mods/`, removing any superseded version of the same custom mod. Do not deploy development-mapped or sources JARs.

From `../better-content-modpack`, run:

```sh
packwiz refresh
./smoke.sh
```

`packwiz refresh` updates the tracked pack index after a JAR replacement. `./smoke.sh` is the modpack's sole supported evaluation and must pass before the modpack change is pushed.

## Canonical Inventory

| Repository | Mod ID | Runtime artifact | Local validation and staging |
|---|---|---|---|
| [arcane-chunk-loaders](https://github.com/better-content/arcane-chunk-loaders) | `arcane_chunk_loaders` | `arcane-chunk-loaders-0.1.0.jar` | `./gradlew verifyFast stageRuntimeJar` |
| [better-content-fixes](https://github.com/better-content/better-content-fixes) | `better_content_fixes` | `better-content-fixes-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [class-selector](https://github.com/better-content/class-selector) | `class_selector` | `class-selector-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [create-train-fuel-scaling](https://github.com/better-content/create-train-fuel-scaling) | `create_train_fuel_scaling` | `create-train-fuel-scaling-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [create-transmission-loss](https://github.com/better-content/create-transmission-loss) | `create_transmission_loss` | `create-transmission-loss-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [dimension-drink](https://github.com/better-content/dimension-drink) | `dimension_drink` | `dimension-drink-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [dynamic-trees-dimension-compat](https://github.com/better-content/dynamic-trees-dimension-compat) | `dynamic_trees_dimension_compat` | `dynamic-trees-dimension-compat-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [dynamic-trees-hexerei](https://github.com/better-content/dynamic-trees-hexerei) | `dynamic_trees_hexerei` | `dynamic-trees-hexerei-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [dynamic-trees-malum](https://github.com/better-content/dynamic-trees-malum) | `dynamic_trees_malum` | `dynamic-trees-malum-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [heat-sync](https://github.com/better-content/heat-sync) | `heat_sync` | `heat-sync-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [latent-chemlib](https://github.com/better-content/latent-chemlib) | `latent_chemlib` | `latent-chemlib-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [oc2r-create-bridge](https://github.com/better-content/oc2r-create-bridge) | `oc2r_create_bridge` | `oc2r-create-bridge-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [oc2r-wireless-pubsub](https://github.com/better-content/oc2r-wireless-pubsub) | `oc2r_wireless_pubsub` | `oc2r-wireless-pubsub-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [pillager-campaigns](https://github.com/better-content/pillager-campaigns) | `pillager_campaigns` | `pillager-campaigns-0.2.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [world-lifecycle-manager](https://github.com/better-content/world-lifecycle-manager) | `world_lifecycle_manager` | `world-lifecycle-manager-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [procedural-bouquets](https://github.com/better-content/procedural-bouquets) | `procedural_bouquets` | `procedural-bouquets-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [realistic-ores](https://github.com/better-content/realistic-ores) | `realistic_ores` | `realistic-ores-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [runtime-data-dumper](https://github.com/better-content/runtime-data-dumper) | `runtime_data_dumper` | `runtime-data-dumper-0.1.0.jar` | `./gradlew build stageRuntimeJar` |
| [downed-player-revival](https://github.com/better-content/downed-player-revival) | `downed_player_revival` | `downed-player-revival-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [rpg-stats](https://github.com/better-content/rpg-stats) | `rpg_stats` | `rpg-stats-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [settlement-roads](https://github.com/better-content/settlement-roads) | `settlement_roads` | `settlement-roads-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [tinkers-construct-affixes](https://github.com/better-content/tinkers-construct-affixes) | `tinkers_construct_affixes` | `tinkers-construct-affixes-1.0.0.jar` | `./gradlew build stageRuntimeJar` |
| [player-traces](https://github.com/better-content/player-traces) | `player_traces` | `player-traces-0.1.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
| [village-walls](https://github.com/better-content/village-walls) | `village_walls` | `village-walls-1.0.0.jar` | `./gradlew verifyFull stageRuntimeJar` |
