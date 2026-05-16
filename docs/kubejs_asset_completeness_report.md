# KubeJS Asset Completeness Report

Generated: 2026-05-16

## Scope

This audit covers pack-owned KubeJS assets in `kubejs/assets/kubejs`:

- registered progression items in `kubejs/startup_scripts/10_items_blocks/30_progression_items.js`
- registered machine casings from `global.BTM_MACHINE_CASING_TIERS`
- generated crate tier model families from `box_t01` through `box_t16`
- all KubeJS item and block model JSON files

## Result

`tools/validate_kubejs_assets.mjs` currently validates:

- 54 registered custom progression items have item models.
- 10 machine casings have blockstates, block models, item models, and five face textures.
- 16 crate tier models have block models, item models, and five face textures.
- 106 KubeJS model files parse as JSON.
- All `kubejs:item/...` and `kubejs:block/...` texture references inside KubeJS models resolve to local PNG assets.
- All `kubejs:block/...` and `kubejs:item/...` model parents inside KubeJS models resolve locally.
- Retired casing asset names (`ae2_machine_casing`, `oc2r_machine_casing`, `power_grid_machine_casing`) are absent from KubeJS asset filenames.

The validator is now part of `tools/pack_test_suite.mjs`, so future missing asset regressions fail the standard pack suite.

## Notes

Some custom item models intentionally reuse stable vanilla or mod textures instead of dedicated pack textures. The validator treats those as valid external references and only enforces local existence for `kubejs:` asset references.
