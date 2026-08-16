# KubeJS Script Summaries

## Client scripts

- `client_scripts/20_hide_vanilla_tools.js` — Hides vanilla and vanilla-style tools from recipe viewers.
- `client_scripts/40_hide_quarantined_systems.js` — Hides quarantined chemistry, transport, test, legacy, and unsupported items from recipe viewers.
- `client_scripts/45_hide_vanilla_style_boats.js` — Hides vanilla-style boats, rafts, and chest variants from recipe viewers.
- `client_scripts/46_formal_glyph_provenance_tooltips.js` — Shows the tier and magical-origin requirements of retained Ars glyphs.
- `client_scripts/46_hide_hexerei_mahogany_tree_products.js` — Hides Hexerei’s superseded mahogany tree products from recipe viewers.
- `client_scripts/47_hide_ae2_facades_from_emi.js` — Hides AE2 cable facades from EMI while leaving JEI unchanged.
- `client_scripts/48_hide_replaced_fishing_rods.js` — Hides native fishing rods superseded by the pack’s Starcatcher fishing route.

## Shared recipe helpers

- `server_scripts/00_shared/10_recipe_surface_helpers.js` — Defines reusable Rhino-safe helpers for constructing and rewriting recipes.

## Compatibility and tags

- `server_scripts/10_compat/10_materials/75_stone_cobble_tag_compat.js` — Rewrites recipes to accept the pack’s unified stone and cobblestone tags.
- `server_scripts/10_compat/10_materials/85_dirt_grass_tag_compat.js` — Rewrites recipes to accept unified dirt and grass tags.
- `server_scripts/10_compat/10_materials/90_sand_tag_compat.js` — Rewrites recipes to accept the unified sand tag.
- `server_scripts/10_tags/10_ae2_skystone_tier.js` — Adjusts block tags so AE2 skystone occupies the intended mining tier.
- `server_scripts/10_tags/20_replaceable_deepslate.js` — Adds appropriate blocks to deepslate-replacement world-generation tags.
- `server_scripts/10_tags/30_stone_cobble_compat.js` — Unifies compatible stone and cobblestone items under shared tags.
- `server_scripts/10_tags/40_dirt_grass_compat.js` — Unifies compatible dirt and grass blocks under shared tags.
- `server_scripts/10_tags/45_stone_surface_tool_compat.js` — Assigns selected stone-surface blocks to pickaxe mining tags.
- `server_scripts/10_tags/50_sand_compat.js` — Unifies compatible sand blocks and items under shared tags.
- `server_scripts/10_tags/55_chemistry_fluid_compat.js` — Adds equivalent chemistry fluids from different mods to shared fluid tags.
- `server_scripts/10_tags/60_realistic_ores_excavated_variant_tags.js` — Adds runtime-generated Excavated Variants blocks to Realistic Ores-owned deposit tags.
- `server_scripts/10_tags/70_formal_magic_domains.js` — Generates formal-magic tier, domain, origin, and glyph-provenance tags.
- `server_scripts/10_tags/75_arcane_chunkloader_tags.js` — Defines interchangeable early magical proofs accepted by Arcane Chunk Loaders.

## Technology — primitive

- `server_scripts/20_tech/00_primitive/10_campfire_recipe.js` — Adds the pack’s custom campfire crafting route.
- `server_scripts/20_tech/00_primitive/60_vanilla_tools_to_tcon_heads.js` — Removes vanilla-style tool outputs and redirects relevant recipes toward TConstruct parts.

## Technology — metallurgy

- `server_scripts/20_tech/10_metallurgy/10_no_easy_compression.js` — Removes manual nugget, ingot, and storage-block compression and decompression.
- `server_scripts/20_tech/10_metallurgy/20_expensive_grout.js` — Reworks grout into a more costly early-metallurgy progression recipe.
- `server_scripts/20_tech/10_metallurgy/40_ingot_rewrites.js` — Rewrites selected ingot acquisition and conversion recipes to fit the pack’s metallurgy.
- `server_scripts/20_tech/10_metallurgy/49_realistic_ores_catalog.js` — Defines the central catalog of Realistic Ores deposits, materials, solvents, and processing identities.
- `server_scripts/20_tech/10_metallurgy/50_badfurnace.js` — Reworks furnace access to prevent an overly easy early smelting route.
- `server_scripts/20_tech/10_metallurgy/56_titanium_thorium_casting.js` — Adds chemically accurate TConstruct molten titanium and thorium casting routes.
- `server_scripts/20_tech/10_metallurgy/57_realistic_ores_smelting_matrix.js` — Generates furnace, Smeltery, and Foundry outputs for every Realistic Ores processing stage.
- `server_scripts/20_tech/10_metallurgy/98_starting_progression_bypasses.js` — Removes early Create and TConstruct shortcuts that bypass intended metallurgy and assembly.
- `server_scripts/20_tech/10_metallurgy/99_machine_casing_progression.js` — Defines the chained machine-casing tiers that connect the pack’s major technology stages.

## Technology — kinetic

- `server_scripts/20_tech/20_kinetic/121_create_stack_integration_gates.js` — Aligns Create addons with the pack’s mechanical, logistics, railway, electrical, and computing milestones.
- `server_scripts/20_tech/20_kinetic/123_more_red_primitive_circuitry.js` — Recasts More Red as the early terrestrial circuitry stage feeding later electronics.
- `server_scripts/20_tech/20_kinetic/30_expensive_water_wheels_and_windmills.js` — Makes Create water wheels and windmills require stronger progression materials.
- `server_scripts/20_tech/20_kinetic/50_create_deposit_preprocessing.js` — Generates Create separation and washing recipes for catalogued Realistic Ores deposits.
- `server_scripts/20_tech/20_kinetic/52_realistic_ores_excavated_host_cycles.js` — Adds exact host-separation cycles for Excavated Variants’ generated Realistic Ores blocks.
- `server_scripts/20_tech/20_kinetic/55_realistic_ores_identity_outputs.js` — Adds grinding-media production and deposit-derived progression-component recipes.
- `server_scripts/20_tech/20_kinetic/65_chemlib_plate_manufacturing_routes.js` — Adds Create pressing and supported TConstruct casting routes for ChemLib plates.

## Technology — pressure and chemistry

- `server_scripts/20_tech/30_pressure/122_pneumaticcraft_create_pressing_gates.js` — Makes Create pressing the authoritative route for compressed iron and compressed stone.
- `server_scripts/20_tech/30_pressure/56_alchemistry_dissolver_create_port.js` — Ports Alchemistry dissolver recipes to Create mixing with explicit solvents and grinding media.
- `server_scripts/20_tech/30_pressure/57_grown_material_acid_ball_processing.js` — Processes farmed and animal materials with solvents and grinding media into chemical products.
- `server_scripts/20_tech/30_pressure/58_create_pncr_molecular_synthesis.js` — Defines molecular synthesis where Create handles open chemistry and PneumaticCraft handles gases.
- `server_scripts/20_tech/30_pressure/59_reachable_acid_authoring.js` — Adds bounded, progression-reachable production routes for required acids.
- `server_scripts/20_tech/30_pressure/60_create_chemical_transformations.js` — Adds reusable roasting, leaching, precipitation, and gas-scrubbing chemistry processes.
- `server_scripts/20_tech/30_pressure/61_chemical_existing_item_alternatives.js` — Adds chemistry-based alternative recipes for existing scarce or manually assembled items.
- `server_scripts/20_tech/30_pressure/63_chemlib_full_integration_routes.js` — Gives audited ChemLib elements and compounds roles in Create and PneumaticCraft processing.
- `server_scripts/20_tech/30_pressure/95_acid_and_nether_grout_unification.js` — Assigns specific ChemLib acids to appropriate processes and unifies Nether grout progression.

## Technology — electrical

- `server_scripts/20_tech/40_electrical/140_latent_chemlib_power_gates.js` — Gates Latent ChemLib’s containment, high-energy reaction, and neutron-economy systems.
- `server_scripts/20_tech/40_electrical/143_circuit_pncr_assembly_authority.js` — Makes PneumaticCraft assembly the authoritative final step for completed circuits.
- `server_scripts/20_tech/40_electrical/171_k_turrets_electrical_gates.js` — Reauthors K-Turrets as advanced electrical-era autonomous defenses.
- `server_scripts/20_tech/40_electrical/171_tacz_manufacturing_gates.js` — Gates TaCZ workbenches and weapon packs behind appropriate manufacturing milestones.

## Technology — AE2

- `server_scripts/20_tech/50_ae2/142_late_tier_material_economy_completion.js` — Moves late electronics, gas-containment, and AE2 precursors into casing-gated machine production.

## Technology — post-AE2

- `server_scripts/20_tech/60_post_ae2/165_protection_pixel_post_ae2_gates.js` — Makes Protection Pixel armor a post-AE2 branch requiring advanced manufacturing and chemistry.
- `server_scripts/20_tech/60_post_ae2/169_backpack_post_ae2_utility_gates.js` — Gates backpack automation and body-logistics upgrades behind AE2-era components.

## Technology — cross-era

- `server_scripts/20_tech/90_cross_era/115_material_economy_recipe_pass.js` — Replaces plain valuables in high-impact recipes with manufactured components and progression materials.
- `server_scripts/20_tech/90_cross_era/130_manufactured_plate_recipe_pass.js` — Replaces raw ingots with pressed or cast plates in machines, vehicles, electronics, and logistics.
- `server_scripts/20_tech/90_cross_era/136_machine_casing_ecosystem_expansion.js` — Makes machine casings recurring factory materials across additional infrastructure recipes.
- `server_scripts/20_tech/90_cross_era/137_casing_aesthetic_component_routes.js` — Moves small or wearable casing-gated components onto suitable machine-processing surfaces.

## Magic

- `server_scripts/30_magic/00_entry/70_food_potion_reagents.js` — Turns foods into processed potion reagents before final brewing.
- `server_scripts/30_magic/10_blood/125_magic_power_spike_gates.js` — Adds Blood Magic slate requirements to especially powerful rituals, focuses, generators, and magic networks.
- `server_scripts/30_magic/10_blood/40_blood_orbs_from_still_beating_hearts.js` — Uses a Still-Beating Heart to gate the Weak Blood Orb while preserving native later-orb recipes.
- `server_scripts/30_magic/10_blood/70_kettle_rune_swap.js` — Replaces kettle recipe bucket requirements with Blood Magic altar-capacity runes.
- `server_scripts/30_magic/10_blood/80_magic_progression_blood_slate_gates.js` — Gates native magic systems and Ars depth crossings behind Blood Magic slates and other magical proofs.
- `server_scripts/30_magic/10_blood/82_blood_magic_lifeforce_rework.js` — Makes Still-Beating Hearts the early LP route and pushes stronger Blood Magic throughput deeper.
- `server_scripts/30_magic/20_formal/127_ars_manuscript_progression.js` — Reauthors Ars glyph inscription around magical depth proofs and origin-specific catalysts.
- `server_scripts/30_magic/30_cross_tradition/146_hexerei_mahogany_to_natures_spirit.js` — Replaces Hexerei mahogany outputs with the pack’s Nature’s Spirit mahogany equivalents.
- `server_scripts/30_magic/30_cross_tradition/59_formulaic_synthesis_magic_routes.js` — Adds Blood Magic and Ars alternatives for synthesis processes suited to magical handling.
- `server_scripts/30_magic/30_cross_tradition/63_fonts_hexerei_occultism_chalk.js` — Connects Hexerei chalk preparation to dimension materials while preserving Occultism’s ritual hierarchy.
- `server_scripts/30_magic/30_cross_tradition/95_arcane_chunkloader_recipes.js` — Adds power-specialized Arcane Chunk Loader recipes accepting proof from any supported magical discipline.
- `server_scripts/30_magic/60_post_ae2/166_tome_of_blood_post_ae2_gates.js` — Makes Tome of Blood a post-AE2 hybrid combat-magic progression branch.

## Exploration

- `server_scripts/40_exploration/00_overworld/110_extreme_y_band_reward_gates.js` — Uses high-altitude and deep-underground materials to gate powerful terrain-reward utilities.
- `server_scripts/40_exploration/10_dimensions/155_dimension_proof_graph_starts.js` — Uses dimension-native materials as proofs for the opening recipes of dimension-related reward branches.
- `server_scripts/40_exploration/20_transport/156_vs_transport_progression.js` — Places Eureka, Trackwork, and Clockwork transport at progressively later workshop, railway, and flight milestones.
- `server_scripts/40_exploration/20_transport/168_hooks_drones_utility_gates.js` — Moves grappling hooks and autonomous drones from hand crafting into tiered mechanical assembly.
- `server_scripts/40_exploration/30_space/170_space_dimension_access_gates.js` — Removes direct portal routes so space and dimension travel use the intended rocket or Font graphs.

## Economy

- `server_scripts/50_economy/10_currency/50_disable_createdeco_coin_recipes.js` — Removes Create Deco coin recipes so they cannot interfere with the pack’s currency.
- `server_scripts/50_economy/20_trades/10_coin_villager_trades.js` — Replaces normal village commerce with tiered, non-convertible Create Deco coin purchases.

## Loot

- `server_scripts/50_loot/10_overworld_block_drops.js` — Modifies selected Overworld block drops, including randomized gravel resources.
- `server_scripts/50_loot/12_unearthed_regolith_identity.js` — Gives Unearthed regolith variants drops matching their underlying stone identity.
- `server_scripts/50_loot/20_world_chest_coin_tiers.js` — Injects tiered Create Deco coins into world chests based on location and risk.
- `server_scripts/50_loot/30_global_loot_progression_scrub.js` — Removes high-power, creative, flight, and progression-bypassing items from generic loot.
- `server_scripts/50_loot/40_emerald_loot_coin_replacement.js` — Replaces emerald currency in non-ore loot tables with appropriate Create Deco coins.
- `server_scripts/50_loot/50_player_kill_coin_drops.js` — Awards baseline coin income for direct and projectile-assisted player kills.

## Final policy

- `server_scripts/90_policy/00_removals/10_no_boats.js` — Removes crafting recipes for vanilla-style boats, rafts, and their chest variants.
- `server_scripts/90_policy/00_removals/20_no_andesite_alloy_nugget_crafting.js` — Removes crafting-table andesite-alloy nugget recipes while preserving machine processing.
- `server_scripts/90_policy/00_removals/30_remove_items.js` — Removes recipes for quarantined items and disallowed ChemLib forms.
- `server_scripts/90_policy/00_removals/56_standardize_starcatcher_fishing.js` — Removes competing fishing-rod routes so Starcatcher owns meaningful fishing progression.
- `server_scripts/90_policy/00_removals/95_remove_native_chunkloaders.js` — Removes native chunk-loader recipes in favor of the pack’s magic-gated anchors.
- `server_scripts/90_policy/10_grid/10_no_complex_grid_defaults.js` — Removes complex technology and magic defaults from hand crafting unless they are ordinary decorative blocks.
- `server_scripts/90_policy/10_grid/145_vanillish_recipe_expert_pass.js` — Moves easy machine-like and magical recipes off furnaces and crafting grids onto appropriate systems.
- `server_scripts/90_policy/20_progression/100_high_value_mod_progression_gates.js` — Gates powerful logistics, automation, combat, storage, and distance-bypassing systems.
- `server_scripts/90_policy/20_progression/150_integrated_deferred_mod_gates.js` — Adds progression recipes for custom mods promoted from deferred integration.
- `server_scripts/90_policy/20_progression/172_cross_mod_anchor_boundaries.js` — Establishes machine- or ritual-based handoffs between major mod progression graphs.
- `server_scripts/90_policy/90_final/10_create_tcon_bootstrap.js` — Enforces the final hand-cranked Create workshop and TConstruct metallurgy boundary.
- `server_scripts/90_policy/90_final/90_energy_ladder_gate.js` — Enforces the final progression from manual power through PneumaticCraft to first FE and restricted AE energy.

## Startup scripts

- `startup_scripts/00_globals/10_economy/10_coin_tiers.js` — Defines the shared Create Deco coin rarity catalogue.
- `startup_scripts/00_globals/20_tech/10_machine_casing_tiers.js` — Defines the shared cross-era machine-casing catalogue.
- `startup_scripts/00_globals/20_tech/20_realistic_ore_materials.js` — Defines shared Realistic Ores materials, grinding media, and starter deposits.
- `startup_scripts/10_items_blocks/30_progression_items.js` — Registers pack-owned machine casings, fluids, and manufactured progression components.
- `startup_scripts/10_items_blocks/35_create_tcon_bootstrap_items.js` — Registers the transitional Deployer-earned Andesite Machine Casing item.
- `startup_scripts/20_blocks/10_ae2_skystone_hardness.js` — Adjusts AE2 skystone block hardness and mining behavior.
- `startup_scripts/20_blocks/12_unearthed_regolith_hand_mining.js` — Adjusts Unearthed regolith blocks for the intended manual mining behavior.
- `startup_scripts/30_hide_vanilla_tools_from_creative.js` — Removes vanilla tool families from the tools and combat creative tabs.
- `startup_scripts/40_potion_brewing_registry.js` — Replaces vanilla reagent discovery with brewing recipes based on food-derived extracts.

