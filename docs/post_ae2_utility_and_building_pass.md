# Post-AE2 Utility and Building Pass

## Returned Mods

Restored Packwiz metadata and refreshed the index for:

- Apotheosis
- Apotheotic Additions
- Apothic Attributes
- Little Logistics
- Framed Blocks

Added:

- Create Stuff 'N Additions

## Progression Changes

### Post-AE2 Construction Tools

Building Gadgets and high-tier Building Wands are now treated as post-AE2 construction accelerators. The trade shortcuts were removed, and recipes are gated through `kubejs:ae2_machine_casing` via `100_high_value_mod_progression_gates.js`.

### Hooks and Drones

Implemented in `168_hooks_drones_utility_gates.js`:

- `rehooked:blaze_hook`: post-electricity / Power Grid.
- `rehooked:ender_hook`: post-space.
- `rehooked:red_hook`: post-AE2.
- `create_sa:brass_drone`: post-AE2.

### Backpack Upgrades

Implemented in `169_backpack_post_ae2_utility_gates.js`:

- `sophisticatedbackpacks:feeding_upgrade`
- `sophisticatedbackpacks:advanced_feeding_upgrade`
- `sophisticatedbackpacks:alchemy_upgrade`
- `sophisticatedbackpacks:advanced_alchemy_upgrade`
- `sophisticatedbackpacks:tool_swapper_upgrade`
- `sophisticatedbackpacks:advanced_tool_swapper_upgrade`
- `sophisticatedstorage:alchemy_upgrade`
- `sophisticatedstorage:advanced_alchemy_upgrade`

Removed and hidden:

- `sophisticatedbackpacks:stack_upgrade_omega_tier`
- `sophisticatedstorage:stack_upgrade_omega_tier`

### Alchemistry and Occultism Quarantine

Alchemistry machines are removed and hidden. Alchemistry remains a compatibility/reference recipe surface only; Acid Vat/Create carry player-facing chemistry.

Occultism miners remain removed and are now also hidden from JEI/EMI.

### Machine Casing Coverage

Added missing casing gates for:

- `ae2:charger`
- `ae2:inscriber`
- `ae2:vibration_chamber`
- `ae2:condenser`
- `create:cart_assembler`
- `oc2r:charger`

## Quest Book

Added chapters:

- `starcatcher.snbt`
- `little_logistics.snbt`
- `apotheosis.snbt`
- `building_block_systems.snbt`
- `building_tools.snbt`

Added chapter group:

- `Building Blocks`

Updated post-AE2 overview with body logistics upgrades.

## Validation

`node tools/pack_test_suite.mjs` passes with one existing soft finding: shutdown save timing markers are missing from the latest live log.
