# Ore Deposit Catalogue

This pass keeps `kubejs/server_scripts/60_worldgen/10_r_ores_melted.js` as the active TCon recipe generator and uses `global.BTM_STARTER_DEPOSITS` in `kubejs/startup_scripts/00_globals/20_progression_catalogues.js` as the pack-facing starter catalogue.

Confirmed source block tags are registered in `kubejs/server_scripts/10_tags/60_realistic_ores_deposit_tags.js`.

## Six Y Bands

- `surface_or_shallow_underground`: tutorial and survival deposits; low danger.
- `shallow_underground`: first real mine planning and TNT use; medium danger.
- `hills`: regional movement incentive; medium danger.
- `mountains`: terrain-gated high value; medium/high danger.
- `deepslate_underground`: late-mid dense extraction; high danger.
- `lava_depths`: specialist heat/lava extraction; very high danger.

## Starter Subset

| Deposit | Tag | Band | Primary | Secondary | Tertiary | First useful tier | Notes |
|---|---|---|---|---|---|---|---|
| Coal Measures | `kubejs:deposit_blocks/coal_measures` | surface/shallow | coal | iron | none | furnace/Create preprocess | TCon fallback maps to molten iron where needed; Create solvent routes extract carbon/iron identity. |
| Ironstone | `kubejs:deposit_blocks/ironstone` | shallow | iron | nickel | chromium | melter | Chromium is the confirmed molten trace substitute. |
| Copper Sulfide | `kubejs:deposit_blocks/copper_sulfide` | shallow/hills | copper | iron | gold | melter | Starter copper sulfide route with sulfuric/chloride/nitric chemistry identity. |
| Tin Vein | `kubejs:deposit_blocks/tin` | hills/shallow | tin | quartz | tungsten | melter | Bronze support without steel-axis progression. |
| Zinc Vein | `kubejs:deposit_blocks/zinc` | hills | zinc | lead | cadmium | melter | Create brass support. |
| Lead-Zinc Vein | `kubejs:deposit_blocks/lead_zinc_vein` | underground | lead | zinc | silver | melter | Power/OC2R trace route. |
| Quartz Vein | `kubejs:deposit_blocks/quartz_vein` | hills/mountains | quartz | gold | copper | Create preprocess | Supports silicon/AE2 routing through Create washing and acid+ball chemistry. |
| Bauxite Laterite | `kubejs:deposit_blocks/bauxite_laterite` | surface/hills | aluminum | iron | nickel | melter | Space alloy support. |

## Active Recipe Surface

- Poor furnace fallback recipes are generated in `kubejs/server_scripts/40_recipe_add/45_deposit_furnace_fallbacks.js`.
- TCon melter and ore_melting recipes for deposit blocks are generated in `kubejs/server_scripts/60_worldgen/10_r_ores_melted.js`.
- Foundry-style byproducts use TCon `ore_melting` byproducts where molten outputs exist.
- Create preprocessing is generated in `kubejs/server_scripts/40_recipe_add/50_create_deposit_preprocessing.js`.
- Acid+ball chemistry is generated in `kubejs/server_scripts/40_recipe_add/55_realistic_ores_identity_outputs.js`.
- Alchemistry is retained for reference/compat data, not as the authored chemistry progression route.
