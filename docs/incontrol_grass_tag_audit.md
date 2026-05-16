# InControl Grass Tag Audit

Date: 2026-05-14

## Summary

`config/incontrol/spawn.json` had 61 separate hostile-spawn deny rules for grass-like blocks. These are now represented by one `blocktest` rule using the block tag `kubejs:grass_like`.

The tag is defined in `kubejs/data/kubejs/tags/blocks/grass_like.json` so InControl can read it directly as a datapack block tag.

## Validation

Audit source:

- current `config/incontrol/spawn.json`
- blockstate IDs from current repo/server jars
- explicit vanilla grass IDs, because vanilla blockstate JSONs are not in mod jars

Results:

- old exact grass rules: 61
- old exact grass blocks missing from current inventory: 0
- new `kubejs:grass_like` block tag values: 95
- new values beyond old InControl rules: 34

The generated evidence is in `docs/generated/incontrol_grass_like_audit.json`.

## New Coverage

The audit added missing grass-like blocks from Aether, Blue Skies, Fallout Wastelands, Immersive Weathering, vanilla Minecraft, Tinkers slime tall grass, The Finley Dimension Remastered, and The Flesh That Hates.

Excluded candidates were limited to non-ground or transform-output forms such as Burnt outputs, carpets, block item/fluid forms, seeds, stairs, slabs, walls, doors, fences, signs, and boats.
