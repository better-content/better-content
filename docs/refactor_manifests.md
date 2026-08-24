# Refactor implementation manifests

Reviewed against the packaged Build 68 runtime jars on 2026-08-20. These are human-maintained implementation records, not a validator or generated runtime input.

## Candidate script disposition

Every JavaScript file under an active KubeJS root executes recursively. The final action for each committed staging candidate is recorded below.

| Candidate | Classification | Final action |
|---|---|---|
| `kubejs/client_scripts/check/20_hide_vanilla_tools.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/client_scripts/check/45_hide_vanilla_style_boats.js` | move to owning mod | Delete after the validated Better Content Fixes jar is installed. |
| `kubejs/client_scripts/check/46_hide_hexerei_mahogany_tree_products.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/client_scripts/check/47_hide_ae2_facades_from_emi.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/client_scripts/check/48_hide_replaced_fishing_rods.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/client_scripts/remove/40_hide_quarantined_systems.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/client_scripts/remove/46_formal_glyph_provenance_tooltips.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/10_no_boats.js` | move to owning mod | Delete after the validated Better Content Fixes jar is installed. |
| `kubejs/server_scripts/check/10_overworld_block_drops.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/12_unearthed_regolith_identity.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/20_replaceable_deepslate.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/check/20_world_chest_coin_tiers.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/30_stone_cobble_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/40_dirt_grass_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/50_disable_createdeco_coin_recipes.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/50_player_kill_coin_drops.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/50_sand_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/55_chemistry_fluid_compat.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/check/56_standardize_starcatcher_fishing.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/60_vanilla_tools_to_tcon_heads.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/check/75_stone_cobble_tag_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/90_sand_tag_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/check/95_remove_native_chunkloaders.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/move/10_recipe_surface_helpers.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/100_high_value_mod_progression_gates.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/10_no_complex_grid_defaults.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/10_no_easy_compression.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/110_extreme_y_band_reward_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/115_material_economy_recipe_pass.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/123_more_red_primitive_circuitry.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/125_magic_power_spike_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/127_ars_manuscript_progression.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/130_manufactured_plate_recipe_pass.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/136_machine_casing_ecosystem_expansion.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/137_casing_aesthetic_component_routes.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/142_late_tier_material_economy_completion.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/143_circuit_pncr_assembly_authority.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/145_vanillish_recipe_expert_pass.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/146_hexerei_mahogany_to_natures_spirit.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/150_integrated_deferred_mod_gates.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/155_dimension_proof_graph_starts.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/156_vs_transport_progression.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/165_protection_pixel_post_ae2_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/166_tome_of_blood_post_ae2_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/168_hooks_drones_utility_gates.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/169_backpack_post_ae2_utility_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/170_space_dimension_access_gates.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/171_k_turrets_electrical_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/171_tacz_manufacturing_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/172_cross_mod_anchor_boundaries.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/30_global_loot_progression_scrub.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/30_remove_items.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/40_ingot_rewrites.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/50_badfurnace.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/57_grown_material_acid_ball_processing.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/63_fonts_hexerei_occultism_chalk.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/70_kettle_rune_swap.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/server_scripts/refactor/balance/80_magic_progression_blood_slate_gates.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/82_blood_magic_lifeforce_rework.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/balance/98_starting_progression_bypasses.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/balance/99_machine_casing_progression.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/chem/140_latent_chemlib_power_gates.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/chem/61_chemical_existing_item_alternatives.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/chem/63_chemlib_full_integration_routes.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/chem/65_chemlib_plate_manufacturing_routes.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/compatability/45_stone_surface_tool_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/compatability/85_dirt_grass_tag_compat.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/compatability/95_acid_and_nether_grout_unification.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/create/121_create_stack_integration_gates.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/create/122_pneumaticcraft_create_pressing_gates.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/create/20_no_andesite_alloy_nugget_crafting.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/create/50_create_deposit_preprocessing.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/create/60_create_chemical_transformations.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/cross_mod_progression/58_create_pncr_molecular_synthesis.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/cross_mod_progression/59_formulaic_synthesis_magic_routes.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/cross_mod_progression/59_reachable_acid_authoring.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/move_to_mod/49_realistic_ores_catalog.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/move_to_mod/52_realistic_ores_excavated_host_cycles.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/move_to_mod/55_realistic_ores_identity_outputs.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/move_to_mod/57_realistic_ores_smelting_matrix.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/move_to_mod/60_realistic_ores_excavated_variant_tags.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/server_scripts/refactor/move_to_mod/75_arcane_chunkloader_tags.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/move_to_mod/95_arcane_chunkloader_recipes.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/power/30_expensive_water_wheels_and_windmills.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/power/90_energy_ladder_gate.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/questionable/70_formal_magic_domains.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/tcon/10_create_tcon_bootstrap.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/tcon/20_expensive_grout.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/tcon/56_titanium_thorium_casting.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/server_scripts/refactor/villager_shopping/10_coin_villager_trades.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/refactor/villager_shopping/40_emerald_loot_coin_replacement.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/remove/10_ae2_skystone_tier.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/remove/10_campfire_recipe.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/remove/40_blood_orbs_from_still_beating_hearts.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/server_scripts/remove/56_alchemistry_dissolver_create_port.js` | reject obsolete | Universal dissolution conflicts with the curated deposit matrix. |
| `kubejs/server_scripts/remove/70_food_potion_reagents.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/startup_scripts/check/10_coin_tiers.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/startup_scripts/check/10_machine_casing_tiers.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/startup_scripts/check/12_unearthed_regolith_hand_mining.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/startup_scripts/check/30_hide_vanilla_tools_from_creative.js` | rewrite after inventory | Preserve behavior until its exact ownership and six-era interaction are confirmed. |
| `kubejs/startup_scripts/check/30_progression_items.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/startup_scripts/move_to_mod/20_realistic_ore_materials.js` | move to owning mod | Delete after the rebuilt Realistic Ores jar passes `verifyFull` and is installed. |
| `kubejs/startup_scripts/remove/10_ae2_skystone_hardness.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |
| `kubejs/startup_scripts/remove/35_create_tcon_bootstrap_items.js` | replace with bounded pack glue | Inventory useful behavior, then replace with exact six-era recipes; do not retain unchanged. |
| `kubejs/startup_scripts/remove/40_potion_brewing_registry.js` | retain out-of-scope behavior | Move unchanged to a behavior-named final directory; review only references that cross an in-scope identity. |

## progression_manifest

Recipe IDs below are native IDs discovered in the installed jars. Pack recipes replace only these exact roots or explicitly named historical pack IDs.

| Output/root | Era | Root? | Native recipe IDs | Authoritative final surface and prerequisites | Alternate acquisition/bypass action |
|---|---:|---:|---|---|---|
| Tinker Station | 1 | yes | `tconstruct:tables/tinker_station` | Native crafting after primitive gathering | retain native; quests prove construction |
| Part Builder | 1 | yes | `tconstruct:tables/part_builder` | Native crafting; produces native parts | retain native |
| Grout | 1 | yes | `tconstruct:smeltery/seared/grout`, `.../grout_multiple` | Exact pack shapeless Font recipes: netherrack, holystone, deepsoil, or cobbled sculk stone + sand + gravel | remove clay defaults |
| Melter | 1 | yes | `tconstruct:smeltery/seared/melter` | Native seared construction | retain native |
| Smeltery Controller | 1 | yes | `tconstruct:smeltery/casting/seared/smeltery_controller` | Native casting after Melter | retain native |
| Foundry Controller | 4 | yes | `tconstruct:smeltery/casting/scorched/foundry_controller` | Native after Create-mixed nether grout | remove hand `nether_grout` and `nether_grout_multiple` |
| Hand Crank | 1 | yes | `create:crafting/kinetics/hand_crank` | Exact pack workshop recipe after cast andesite alloy | all other positive SU roots remain gated |
| Shafts/cogs/belts | 1 | no | `create:crafting/kinetics/shaft`, `cogwheel`, `large_cogwheel`, `belt_connector` | Explicit hand-workshop recipes from cast alloy/wood/rubber | remove only native shortcuts that bypass alloying |
| Andesite alloy | 1 | yes | native shaped/shapeless and Create mixing routes | TCon alloy: molten stone + zinc or iron; cast to `create:andesite_alloy` | remove solid crafting and Create direct mixing |
| Andesite Machine Block | 2 | yes | pack-owned | crafting: seared-brick block + 4 andesite alloy + 4 iron plates | clean-break ID `kubejs:andesite_machine_block` |
| Millstone / Press | 2 | yes | `create:crafting/kinetics/millstone`, `mechanical_press` | each consumes Andesite Machine Block as direct root | remove all older casing recipes |
| Mixer | 2 | no | `create:crafting/kinetics/mechanical_mixer` | Press-made plates + whisk; no Machine Block | exact replacement |
| Copper Machine Block | 2 | yes | pack-owned | hand-cranked compacting from Andesite block, copper casing, plates, nether brick, alloy | nether brick prevents pre-Nether passive SU |
| Water wheels / Windmill / Pump | 2 | yes | `create:crafting/kinetics/water_wheel`, `large_water_wheel`, `windmill_bearing`, `mechanical_pump` | Copper Machine Block on first roots | remove old Andesite-casing substitutions |
| Brass | 3 | yes | Create mixing and any solid alternatives | TCon alloy only; cast native `create:brass_ingot` | remove Create mixing shortcuts |
| Brass Machine Block | 3 | yes | pack-owned | Copper block + brass casing + 4 brass plates + 2 electron tubes + rose quartz | no Deployer/Crafter prerequisite |
| Deployer / Mechanical Crafter | 3 | yes | `create:crafting/kinetics/deployer`, `mechanical_crafter` | direct Brass Machine Block roots | downstream precision uses native components |
| Train Station | 3 | branch root | `create:crafting/kinetics/track_station` | Brass Machine Block plus native railway components | retain harmless track/decor recipes |
| Initial compressed iron | 4 | yes | `pneumaticcraft:explosion_crafting/compressed_iron_ingot`; later `pressure_chamber/compressed_iron_ingot` | primitive PNCR explosion route retained until compressor exists | remove historical Create-only retirement |
| Pressure tubes | 4 | no | `pneumaticcraft:pressure_tube` | native compressed iron construction | retain |
| Airtight Machine Block | 4 | yes | pack-owned | Brass block + 4 compressed iron + 2 tubes + 2 pressure seals; Mechanical Crafter | no pressure-chamber circularity |
| Rotational Compressor | 4 | yes | pack recipe for installed PNCR/Create-compatible compressor | direct Airtight root | native `air_compressor` alternatives removed/replaced exactly |
| Pressure Chamber | 4 | yes | `pneumaticcraft:pressure_chamber_wall`, `pressure_chamber_interface`, `pressure_chamber_valve` | first controller/interface root consumes Airtight proof; native parts thereafter | no block-wide output removal |
| Sulfuric/HCl | 4 | yes | pack contained chemistry | PNCR temperature/pressure reactions, canonical ChemLib fluids | remove generic/incorrect acid tags from identity-sensitive recipes |
| Conductive casing | 5 | yes | `powergrid:item_application/conductive_casing` | first casing mechanically assembled without FE | explicit recipe replacement |
| Electrical Machine Block | 5 | yes | pack-owned | Airtight + conductive casing + copper plates + 2 MoreRed primitive components + tube | no generator/circuit circularity |
| First FE generator/storage/wire/motor | 5 | yes/no | `powergrid:crafting/generator_housing`, `sequenced_assembly/battery`, `cutting/copper_wire_cutting`, `mechanical_crafting/electric_motor` | first generator is direct Electrical root; subsequent parts are native | disable native generators that bypass root |
| Circuit design station | 5 | yes | installed MoreRed/PowerGrid station IDs traced by exact pack recipe | direct Electrical root | no `Item.exists` skip for mandatory output |
| Nitric/mixed acid | 5 | yes | pack contained chemistry | Electrical controlled PNCR synthesis | mixed acid restricted to Au/PGM routes |
| Space Machine Block | 6 | yes | pack-owned | Electrical + 2 rocket casing + 2 Inconel sheets + 2 Hastelloy + 2 titanium plates | no aerospace-root circularity |
| Rocket Engineer Table | 6 | yes | `creatingspace:rocket_engineer_table` | direct Space Machine Block root | replace exact native recipe |
| Mechanical Electrolyzer | 6 | yes | `creatingspace:mechanical_electrolyzer` | direct Space Machine Block root | replace exact native recipe |
| Air Liquefier | 6 | yes | `creatingspace:air_liquefier` | direct Space Machine Block root | replace exact native recipe |
| Heat Sync Boiler Heater | 4 | no | owning-mod recipe | heat pipe + steel plates + copper contact + seal + Create boiler casing | downstream Airtight-era machine; no second Machine Block |

The six clean-break public block IDs are `kubejs:andesite_machine_block`, `copper_machine_block`, `brass_machine_block`, `airtight_machine_block`, `electrical_machine_block`, and `space_machine_block`. All `*_machine_casing`, seared/scorched/circuited, Raw Impossible, and Impossible identities are outside this graph.

## realistic_ores_processing

All families use `realistic_ores:surface_sample_<family>`, `small_ore_chunk_<family>`, `ore_chunk_<family>`, and `crushed_<family>` after normalization. Native stone/deepslate hosts are static; Excavated Variants hosts are runtime-resolved and receive exact lossless separation/reassembly only. Small chunks have placement plus irreversible 9:1 conversion and no processing tags.

| Final family | Immediate primary | Assay depth | ADLODS mapping |
|---|---|---|---|
| `coal_measures` | coal | sulfur | coal.cfg |
| `ironstone` | iron | nickel | iron.cfg |
| `copper_bloom` | copper | sulfur, iron, gold | copper.cfg |
| `tin_quartz` | tin | quartz | tin.cfg |
| `brassroot` | zinc | lead, silver, cadmium | zinc.cfg |
| `redbed` | redstone | copper, iron, gold | redstone.cfg |
| `evaporite_beds` | rock salt | sodium chloride and saltpeter | phosphate.cfg |
| `gem_pipe` | rough gem chips | diamond, emerald, amethyst, lapis, quartz, aluminum variants | diamond.cfg |
| `hotstone` | dangerous heat | fissile, structural, and abyssal assay variants | uranium.cfg |
| `black_shale` | soul sand | sulfur and redstone | soulstone.cfg |

The route matrix uses batches of four crushed feed, 500 mB total water/acid media, and one declared grinding ball. Each recipe produces four units of primary concentrate plus curated coproduct chances, with no more than four Create result entries including a possible grinding-ball return. Grinding media are Andesite 80%, Iron 84%, Brass 87%, Steel 91%, Nickel 93%, Titanium 95%, Blood 97%, and Fluix 98%. Washed forms, assay items, universal solvents, generic tailings, and Alchemistry dissolution have no final owner and remain removed.

Canonical outputs prefer installed ChemLib manufactured forms, then the material-owning mod, then bare ChemLib element/compound. The retained catalogue is exactly 24 audited conventional constituents plus rock salt, sodium chloride, and saltpeter. The sibling mod owns all family chunks, crushed feeds, small chunks/samples, concentrates, chips, molten forms, recipes, and assets; deleted geological identities are not aliased.

## transport_surface

| Root/capability | Installed recipe IDs | Era/class | Machine Block root | Aether/bypass policy |
|---|---|---|---|---|
| Eureka helms | `vs_eureka:<wood>_ship_helm` | Powered Works primitive ship control | Copper on first helm family root | no Aether; remove alternate simple helm recipes |
| Eureka engine | `vs_eureka:engine` | Thermal practical propulsion | Airtight-derived pneumatic output, then native parts | functional flight does not require Aether |
| Eureka anchor/ballast/floater | `vs_eureka:anchor`, `ballast`, `floater` | Powered/thermal support | none after helm root | retain native downstream parts |
| Clockwork primitive bearings | `vs_clockwork:crafting/kinetics/andesite_flap_bearing`, `juryrigged_propeller_bearing`, `phys_bearing`, `spinoff_bearing` | Powered Works experiment | Copper on first powered control root | no Aether |
| Clockwork precision control | `vs_clockwork:crafting/kinetics/brass_propeller_bearing`, `smart_flap_bearing`, `blade_controller`, `command_seat` | Precision Factory | Brass on first precision root | native mechanisms afterward |
| Clockwork pneumatics | `vs_clockwork:crafting/pneumatics/air_compressor`, `extendon`, `gas_nozzle`, `pump_duct` | Thermal & Pressure | Airtight on compressor root | no Aether |
| Clockwork sensors/gyro | `vs_clockwork:crafting/logistics/{alt_meter,distance_sensor,gyroscopic_sensor,impact_sensor}`, `crafting/physics/gyro` | Electrical Control | Electrical on first sensor/controller root | native circuits afterward |
| Clockwork exotic propulsion | `vs_clockwork:mechanical_crafting/{gas_thruster,gravitron}` | Electrical/high-performance | Electrical outputs | Aether only for stable high-performance frames/control |
| Trackwork basic wheels/tracks | `trackwork:{simple_wheel,suspension_track,phys_track}` and size variants | Powered Works | Copper on first true powered track root | no Aether |
| Trackwork level controller/toolkit | `trackwork:track_level_controller`, `track_tool_kit` | Precision Factory | Brass on controller root | native parts afterward |
| Create trains | `create:crafting/kinetics/track_station` plus native track/train controls | Precision Factory | Brass on station/control root | optional branch, never factory prerequisite |

Installed-mod guards are explicit for optional transport namespaces. Decorative recipes stay native. Loot, assemblies, compatibility recipes, and alternate crafting that yield a gated root are removed by exact ID when discovered; no namespace scan is used.
