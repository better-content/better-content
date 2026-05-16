# Burnt Basic Fire Transform Audit

Date: 2026-05-14

## Source

- Runtime jar: `server-instance/mods/burnt-basic-1.9.4-forge-1.20.1.jar`
- Runtime config: `server-instance/config/burnt_basic_config.toml`
- Pack block inventory: blockstate IDs from current repo and generated server jars.

## Mechanism

`net.pixelbank.burnt.procedures.BurnBabyProcedure` is the main transform dispatcher. It does not use recipe JSONs for fire conversion. It checks block tags and then calls category procedures such as log, leaves, planks, stair, slab, crop, plant, grass, mushroom, button, pressure plate, and bamboo start procedures.

Important tags observed in the decompiled dispatcher:

- `burnt:fire_resistant`
- `burnt:plants_will_burn`
- `burnt:grass_blocks`
- `burnt:wooden_buttons`
- `burnt:wooden_pressure_plates`
- `burnt:bamboo_blocks`
- `burnt:fire_destroys`
- `forge:mushroom_blocks`
- `forge:wood`
- `forge:stripped_logs`
- `forge:stripped_wood`
- `minecraft:logs_that_burn`
- `minecraft:leaves`
- `minecraft:planks`
- `minecraft:wooden_stairs`
- `minecraft:wooden_slabs`
- `minecraft:wooden_fences`
- `minecraft:fence_gates`
- `minecraft:wooden_doors`
- `minecraft:wooden_trapdoors`
- `minecraft:crops`
- `minecraft:wool`
- `minecraft:wool_carpets`
- `minecraft:signs`
- `minecraft:banners`
- `minecraft:beds`

The config keeps Burnt active with vanilla fire integration enabled:

- `burntOn=true`
- `vanillaBurn=true`
- `craftedBlocksBurn=true`
- `burnBarrels=true`
- `woolBurn=true`

## Changes

Added KubeJS datapack block tags for modded pack blocks that should participate in Burnt fire transforms.

Generated counts:

- `burnt:plants_will_burn`: 413
- `burnt:wooden_buttons`: 49
- `burnt:wooden_pressure_plates`: 49
- `burnt:grass_blocks`: 13
- `burnt:fire_resistant`: 15
- `forge:mushroom_blocks`: 3
- `minecraft:crops`: 17
- `minecraft:leaves`: 8
- `minecraft:logs`: 32
- `minecraft:logs_that_burn`: 32
- `minecraft:planks`: 9
- `minecraft:wooden_stairs`: 14
- `minecraft:wooden_slabs`: 21
- `minecraft:wooden_fences`: 4
- `minecraft:fence_gates`: 7
- `minecraft:wooden_doors`: 2
- `minecraft:wooden_trapdoors`: 1
- `minecraft:wool_carpets`: 23

The generated evidence is in `docs/generated/burnt_basic_tag_audit.json`.

## Curation Notes

The audit intentionally filters obvious false positives from old coverage data:

- fluid blockstates such as soup/fluid-style blocks
- placeable food presentation blocks that matched crop naming but should not become crop fire transforms
- fireproof or already-charred wood families, which were placed in `burnt:fire_resistant` instead of burnable wood tags

Fire-resistant additions include crimson/warped dynamic branches, Quark hollow nether stems, Twilight Forest cinder wood, Ice and Fire dreadwood, Tinkers blazewood pieces, and Immersive Weathering charred wood pieces.
