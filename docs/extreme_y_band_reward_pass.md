# Extreme Y-Band Reward Pass

This pass makes extreme terrain bands matter by moving specific ADLODS deposits into hard altitude ranges and tying powerful utility recipes to the materials from those bands.

## Worldgen Band Changes

### Mountain Heights

Configured as `Y=112..256`, exposed, strict altitude bounds:

- `config/adlods/Deposits/emerald.cfg`
- `config/adlods/Deposits/ruby.cfg`
- `config/adlods/Deposits/sapphire.cfg`
- `config/adlods/Deposits/topaz.cfg`

Purpose: regular extreme terrain. These reward travel to actual mountains without being as deadly as deepslate or lava-depth mining.

### Deepslate Depths

Configured as `Y=-64..-16`, not exposed, strict altitude bounds:

- `config/adlods/Deposits/diamond.cfg`
- `config/adlods/Deposits/platinum.cfg`
- `config/adlods/Deposits/palladium.cfg`
- `config/adlods/Deposits/rhodium.cfg`
- `config/adlods/Deposits/ruthenium.cfg`

Purpose: serious underground commitment. These materials now support high-value local workshop, building, backpack, and AE site utility.

### Lava Depths

Configured as `Y=-64..-48`, not exposed, strict altitude bounds:

- `config/adlods/Deposits/uranium.cfg`
- `config/adlods/Deposits/thorium.cfg`
- `config/adlods/Deposits/osmium.cfg`
- `config/adlods/Deposits/iridium.cfg`

Nether equivalent:

- `config/adlods/Deposits/ancient_debris.cfg`: `Y=8..22`, not exposed, strict altitude bounds

Purpose: most extreme routine extraction band. These materials now gate survival/combat/quantum utility, not bulk production.

## Bypass Closures

The vanilla ADLODS singleton generators for `diamond_ore`, `emerald_ore`, and `ancient_debris` are set to `S:generation=none` so those materials route through the authored deposits instead of vanilla ore scatter. Ice and Fire sapphire biome generation is disabled in `config/iceandfire/sapphire_gen_biomes.json` so `iceandfire:sapphire_gem` is supplied by the mountain-height sapphire deposit path.

## Recipe Rewards Added

Implemented in `kubejs/server_scripts/30_recipe_replace/110_extreme_y_band_reward_gates.js`.

### Mountain Height Rewards

- `artifacts:cloud_in_a_bottle`: emerald + ruby + sapphire + Power Grid casing
- `artifacts:digging_claws`: emerald + ruby + sapphire + Brass casing
- `artifacts:pocket_piston`: emerald + ruby + sapphire + Power Grid casing

### Deepslate Depth Rewards

- `sophisticatedbackpacks:advanced_magnet_upgrade`: palladium/rhodium + OC2R casing
- `sophisticatedbackpacks:advanced_tool_swapper_upgrade`: platinum/ruthenium + OC2R casing
- `sophisticatedbackpacks:stack_upgrade_omega_tier`: platinum/rhodium + AE2 casing
- `buildinggadgets2:gadget_destruction`: platinum/palladium/rhodium/ruthenium + Space casing
- `ae2:spatial_anchor`: platinum/ruthenium + AE2 casing

### Lava Depth Rewards

- `artifacts:obsidian_skull`: uranium/osmium/thorium/netherite scrap + Space casing
- `artifacts:fire_gauntlet`: uranium/osmium/iridium/thorium + Space casing + Demonic Slate
- `artifacts:universal_attractor`: osmium/iridium/palladium + AE2 casing
- `advanced_ae:lava_immunity_card`: uranium/thorium/osmium + Quantum Upgrade Base
- `advanced_ae:regeneration_card`: iridium/thorium/osmium + Ethereal Slate + Quantum Upgrade Base
- `advanced_ae:strength_card`: osmium/iridium/uranium + Quantum Upgrade Base
- `advanced_ae:reach_card`: iridium/ruthenium/uranium + Quantum Upgrade Base
- `advanced_ae:magnet_card`: osmium/iridium/palladium + Quantum Upgrade Base
- `advanced_ae:quantum_helmet`: iridium/uranium + AE2 casing + Ethereal Slate
- `advanced_ae:quantum_chestplate`: iridium/osmium/uranium/thorium + AE2 casing
- `advanced_ae:quantum_leggings`: iridium/osmium/uranium + AE2 casing
- `advanced_ae:quantum_boots`: iridium/osmium + AE2 casing
- `sophisticatedstorage:netherite_chest`: iridium/osmium/netherite scrap
- `sophisticatedstorage:netherite_barrel`: iridium/osmium/netherite scrap

## Deposit Tag Fixes

`kubejs/server_scripts/10_tags/60_realistic_ores_deposit_tags.js` now includes the extended Realistic Ores deposits already referenced by the TCon worldgen recipe script:

- `nickel_sulfide`
- `tin_tungsten_greisen`
- `titanium_iron_oxide`
- `kimberlite_pipe`
- `emerald_schist_beryl`
- `corundum_beryl_vein`
- `uranium_ore`
- `thorium_ore`

## Design Notes

- No creative flight was added or re-enabled.
- No teleportation or global logistics reward was added.
- The rewards are utility spikes, not infinite material loops.
- Recipes consume existing extreme-band materials directly so JEI/EMI exposes the terrain requirement clearly.
