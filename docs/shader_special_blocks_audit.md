# Shader Special Blocks Audit

## Shader Mechanism

Shaderpack: `shaderpacks/ComplementaryReimagined_r5.7.1.zip`

Complementary Reimagined defines block-specific effects through `shaders/block.properties`. The relevant extension points are documented at the top of that file:

| Property | Shader Role |
|---|---|
| `block.10005` | Waving foliage such as grass, saplings, crops, small plants, vines, and bushes |
| `block.10009` | Waving leaves |
| `block.10024` | Modded ores; used by the shader's glowing-ore detection |
| `block.10028` | Modded light sources and emissive blocks |
| `block.20000` | Blocks excluded from parallax occlusion mapping |

The zip also contains `shaders/program/block.properties`; it is identical to `shaders/block.properties` and was updated in lockstep.

## Audit Method

Block IDs were collected from current mod jar blockstate inventories in:

- `server-instance/mods/*.jar`
- `mods/*.jar`
- `kubejs/assets/kubejs/blockstates/*.json`

The generated candidate inventory is recorded in `docs/generated/shader_special_block_candidates.json`.

## Applied Coverage

| Category | Applied Count | Notes |
|---|---:|---|
| Foliage | 351 | Mod saplings, grasses, crops, vines, small plants, mushrooms, lilies, and bushes |
| Leaves | 152 | Dynamic Trees, Nature's Spirit, Ars, Blue Skies, Twilight Forest, Tinkers, Undergarden, Burnt leaves |
| Ores | 263 | Realistic Ores, Unearthed stone-variant ores, dimension ores, Create zinc, TCon cobalt, etc. |
| Emissive | 348 | Lamps, lanterns, torches, fire states, portals, reactors, sculk glow blocks, energy cells, magical light blocks |
| No POM | 11 | Pack-owned KubeJS machine casings that are not already assigned to emissive handling |

## Notable Fixes

- The extracted shader override had an empty `block.10024`, while the zip already had Realistic Ores entries. The extracted file is now synced.
- The zip's `shaders/block.properties` and `shaders/program/block.properties` now both include the same additions.
- Pack-owned machine casings are listed in `block.20000` to avoid bad parallax behavior on generated/tinted casing assets.
- `kubejs:raw_impossible_casing` and `kubejs:impossible_machine_casing` are assigned to emissive handling, not `block.20000`, because shader block classes should stay unambiguous and their visual identity is AE2/fluix/Blood Magic capstone styling.

## Remaining Manual Review Targets

The applied set is intentionally heuristic and conservative around geometry. It avoids broad categories like all signs, beds, crates, logs, planks, framed blocks, and glass panes unless the block name clearly indicates light/emissive behavior. Future visual review should focus on:

- Whether Dynamic Trees rooty soil blocks should receive foliage movement. They are currently excluded.
- Whether framed/copycat blocks need `block.20000`. They are currently excluded because their texture identity depends on copied block state.
- Whether some magical blocks classified as emissive should be moved to regular terrain if their textures look too bright in-game.
