# No-Bypass Report

Generated: 2026-04-29T10:43:49.721Z

This is an audit report, not a proof. The current KubeJS recipe dump is pre-addition for KubeJS-added recipes, so this report is best used to identify likely misses and non-recipe bypass surfaces.

## Current Risk Counts

| Class                                            | Count |
| ------------------------------------------------ | ----- |
| Recipe outputs below inferred tier or Blood gate | 198   |
| Loot tables containing emerald                   | 220   |
| Loot high-risk table/item pairs                  | 144   |
| Villager script emerald mentions                 | 0     |
| Items with multiple source systems               | 17139 |

## MUST DO

- Convert the top risky recipe outputs into explicit tiered recipes or remove them if they violate bounded matter/distance.
- Replace or justify remaining emerald loot tables, especially where they interact with village/trade economy.
- Extend loot coin tiering into modded structures deliberately, not by broad random injection.
- Replace the KubeJS recipe-event dump with a final recipe-manager dump when possible.

## Top Recipe Risks

| Output                                            | Recipe                                             | Intended        | Actual   |
| ------------------------------------------------- | -------------------------------------------------- | --------------- | -------- |
| ars_elemental:ritual_detection                    | ars_elemental:tablet_ritual_detection              | survival        | survival |
| goety:prisma_beam_focus                           | goety:focus/prisma_beam_focus                      | survival        | survival |
| ars_instrumentum:runic_storage_stone              | ars_instrumentum:runic_storage_stone_alternate     | survival        | survival |
| goety:dark_altar_ominous_stone                    | goety:dark_altar_ominous_stone                     | survival        | survival |
| goety:wind_blast_focus                            | goety:focus/wind_blast_focus                       | survival        | survival |
| goety:swarm_focus                                 | goety:focus/swarm_focus                            | survival        | survival |
| goety:ignite_focus                                | goety:focus/ignite_focus                           | survival        | survival |
| ars_caelum:ritual_conjure_island_vexing           | ars_caelum:ritual_conjure_island_vexing            | survival        | survival |
| ars_nouveau:ritual_scrying                        | ars_nouveau:ritual_scrying                         | survival        | survival |
| goety:empty_focus                                 | goety:empty_focus_craft                            | survival        | survival |
| arseng:portable_source_cell_64k                   | arseng:portable_source_cell_64k                    | survival        | ae2      |
| ars_nouveau:ritual_overgrowth                     | ars_nouveau:ritual_overgrowth                      | survival        | survival |
| goety:frost_breath_focus                          | goety:focus/frost_breath_focus                     | survival        | survival |
| ars_elemental:ritual_tesla_coil                   | ars_elemental:tablet_ritual_tesla_coil             | survival        | survival |
| botania:pump                                      | botania:pump                                       | survival        | survival |
| goety:fireball_focus                              | goety:focus/fireball_focus                         | survival        | survival |
| goety:chilling_focus                              | goety:focus/chilling_focus                         | survival        | survival |
| mna:lesser_eldrin_conduit_air                     | mna:lesser_conduit_air                             | survival        | survival |
| reliquary:alkahestry_altar                        | reliquary:alkahestry_altar                         | survival        | survival |
| goety:dark_altar_end_stone                        | goety:dark_altar_end_stone                         | survival        | survival |
| ars_additions:ritual_locate_structure             | ars_additions:ritual/ritual_locate_structure       | survival        | survival |
| goety:poison_dart_focus                           | goety:focus/poison_dart_focus                      | survival        | survival |
| goety:earth_punch_focus                           | goety:focus/earth_punch_focus                      | survival        | survival |
| botania:cell_block                                | botania:cell_block                                 | survival        | survival |
| goety:sensing_focus                               | goety:focus/sensing_focus                          | survival        | survival |
| goety:focus_pack                                  | goety:focus_pack                                   | survival        | survival |
| goety:biting_focus                                | goety:focus/biting_focus                           | survival        | survival |
| naturesaura:slime_split_generator                 | naturesaura:slime_split_generator                  | survival        | survival |
| goety:dark_altar_stone                            | goety:dark_altar_stone                             | survival        | survival |
| psi:cad_assembler                                 | psi:assembler                                      | survival        | survival |
| psi:programmer                                    | psi:programmer                                     | survival        | survival |
| botania:avatar                                    | botania:avatar                                     | survival        | survival |
| botania:fel_pumpkin                               | botania:fel_pumpkin                                | survival        | survival |
| goety:water_whip_focus                            | goety:focus/water_whip_focus                       | survival        | survival |
| goety:dark_altar                                  | goety:dark_altar                                   | survival        | survival |
| ars_nouveau:ritual_disintegration                 | ars_nouveau:ritual_disintegration                  | survival        | survival |
| goety:thunderbolt_focus                           | goety:focus/thunderbolt_focus                      | survival        | survival |
| malum:spirit_altar                                | malum:spirit_altar                                 | survival        | survival |
| botania:runic_altar                               | botania:runic_altar_alt                            | survival        | survival |
| ars_caelum:ritual_conjure_island_village          | ars_caelum:ritual_conjure_island_village           | survival        | survival |
| ars_nouveau:ritual_sunrise                        | ars_nouveau:ritual_sunrise                         | survival        | survival |
| goety:updraft_focus                               | goety:focus/updraft_focus                          | survival        | survival |
| goety:dark_altar_deepslate                        | goety:dark_altar_deepslate                         | survival        | survival |
| hexalia:hex_focus                                 | hexalia:hex_focus                                  | survival        | survival |
| goety:dark_altar_highrock                         | goety:dark_altar_highrock                          | survival        | survival |
| ars_nouveau:imbuement_chamber                     | ars_nouveau:imbuement_chamber                      | survival        | survival |
| mna:lesser_eldrin_conduit_ender                   | mna:lesser_conduit_ender                           | survival        | survival |
| goety:pulverize_focus                             | goety:focus/pulverize_focus                        | survival        | survival |
| tconstruct:tinkers_gadgetry                       | tconstruct:common/tinkers_gadgetry                 | tcon_seared     | survival |
| theurgy:incubator_sulfur_vessel                   | theurgy:crafting/shaped/incubator_sulfur_vessel    | power_grid      | survival |
| goety:cushion_focus                               | goety:focus/cushion_focus                          | survival        | survival |
| goety:dark_altar_blackstone                       | goety:dark_altar_blackstone                        | survival        | survival |
| goety:command_focus                               | goety:focus/command_focus                          | survival        | survival |
| goety:steaming_focus                              | goety:focus/steaming_focus                         | survival        | survival |
| goety:glow_light_focus                            | goety:focus/glow_light_focus                       | survival        | survival |
| ars_nouveau:ritual_harvest                        | ars_nouveau:ritual_harvest                         | survival        | survival |
| ars_caelum:ritual_conjure_island_flourishing      | ars_caelum:ritual_conjure_island_flourishing       | survival        | survival |
| goety:water_jet_focus                             | goety:focus/water_jet_focus                        | survival        | survival |
| irons_spellbooks:pumpkin_helmet                   | irons_spellbooks:pumpkin_helmet                    | survival        | survival |
| mna:lesser_eldrin_conduit_water                   | mna:lesser_conduit_water                           | survival        | survival |
| goety:mauling_focus                               | goety:focus/mauling_focus                          | survival        | survival |
| ars_nouveau:ritual_restoration                    | ars_nouveau:ritual_restoration                     | survival        | survival |
| ars_nouveau:ritual_conjure_island_desert          | ars_nouveau:ritual_conjure_island_desert           | survival        | survival |
| theurgy:incubator_mercury_vessel                  | theurgy:crafting/shaped/incubator_mercury_vessel   | power_grid      | survival |
| naturesaura:animal_generator                      | naturesaura:animal_generator                       | survival        | survival |
| psi:cad_battery_extended                          | psi:cad_battery_extended                           | survival        | survival |
| ars_nouveau:ritual_conjure_island_plains          | ars_nouveau:ritual_conjure_island_plains           | survival        | survival |
| goety:focus_bag                                   | goety:focus_bag                                    | survival        | survival |
| goety:hunting_focus                               | goety:focus/hunting_focus                          | survival        | survival |
| expatternprovider:oversize_interface_part         | expatternprovider:oversize_interface_part          | ae2             | survival |
| mna:ritual_focus_minor                            | mna:ritual_focus_minor                             | survival        | survival |
| naturesaura:auto_crafter                          | naturesaura:auto_crafter                           | survival        | survival |
| mna:constructs/construct_storage_torso_wickerwood | mna:wickerwood_constructs/wickerwood_torso_storage | survival        | survival |
| naturesaura:flower_generator                      | naturesaura:flower_generator                       | survival        | survival |
| hexerei:book_of_shadows_altar                     | hexerei:book_of_shadows_altar                      | survival        | survival |
| theurgy:incubator                                 | theurgy:crafting/shaped/incubator                  | power_grid      | survival |
| ars_caelum:ritual_conjure_island_end_portal       | ars_caelum:ritual_conjure_island_end_portal        | survival        | survival |
| goety:fire_breath_focus                           | goety:focus/fire_breath_focus                      | survival        | survival |
| mna:lesser_eldrin_conduit_earth                   | mna:lesser_conduit_earth                           | survival        | survival |
| create:cart_assembler                             | create:crafting/kinetics/cart_assembler            | create_andesite | survival |

## Top Loot Risks

| Loot Table                                                        | Item                                                       |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| absentbydesign/blocks/slab_netherite                              | absentbydesign:slab_netherite                              |
| absentbydesign/blocks/stairs_netherite                            | absentbydesign:stairs_netherite                            |
| absentbydesign/blocks/wall_netherite                              | absentbydesign:wall_netherite                              |
| ae2/blocks/creative_energy_cell                                   | ae2:creative_energy_cell                                   |
| ars_nouveau/blocks/creative_source_jar                            | ars_nouveau:creative_source_jar                            |
| art_update/chests/artist_castle4                                  | minecraft:netherite_upgrade_smithing_template              |
| art_update/chests/artist_castle4                                  | minecraft:netherite_scrap                                  |
| art_update/chests/artist_castle_5_boss                            | minecraft:netherite_scrap                                  |
| art_update/entities/artist                                        | minecraft:netherite_ingot                                  |
| block_factorys_bosses/chests/underworld_arena_vault               | minecraft:netherite_scrap                                  |
| block_factorys_bosses/chests/underworld_arena_vault               | minecraft:netherite_ingot                                  |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_scrap                                  |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_pickaxe                                |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_shovel                                 |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_axe                                    |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_sword                                  |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_hoe                                    |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_helmet                                 |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_chestplate                             |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_leggings                               |
| bloodmagic/chests/mines/decent_loot                               | minecraft:netherite_boots                                  |
| bloodmagic/chests/mines/food_loot                                 | bloodmagic:fragment_netherite_scrap                        |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_scrap                                  |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_pickaxe                                |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_shovel                                 |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_axe                                    |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_sword                                  |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_hoe                                    |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_helmet                                 |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_chestplate                             |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_leggings                               |
| bloodmagic/chests/mines/mine_key_loot                             | minecraft:netherite_boots                                  |
| bloodmagic/chests/mines/ore_loot                                  | bloodmagic:fragment_netherite_scrap                        |
| bloodmagic/chests/mines/ore_loot                                  | minecraft:netherite_pickaxe                                |
| bloodmagic/chests/mines/ore_loot                                  | minecraft:netherite_shovel                                 |
| bloodmagic/chests/mines/ore_loot                                  | minecraft:netherite_axe                                    |
| bloodmagic/chests/mines/smithy_loot                               | bloodmagic:fragment_netherite_scrap                        |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_pickaxe                                |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_shovel                                 |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_axe                                    |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_sword                                  |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_hoe                                    |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_helmet                                 |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_chestplate                             |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_leggings                               |
| bloodmagic/chests/mines/smithy_loot                               | minecraft:netherite_boots                                  |
| bloodmagic/chests/simple_dungeon/farm_tools                       | minecraft:netherite_hoe                                    |
| bloodmagic/chests/standard_dungeon/decent_loot                    | bloodmagic:sand_netherite                                  |
| bloodmagic/chests/standard_dungeon/decent_smithy                  | bloodmagic:sand_netherite                                  |
| bloodmagic/chests/standard_dungeon/great_loot                     | bloodmagic:sand_netherite                                  |
| bloodmagic/chests/standard_dungeon/great_loot                     | bloodmagic:sand_netherite                                  |
| bloodmagic/chests/standard_dungeon/mines_key                      | bloodmagic:sand_netherite                                  |
| botania/blocks/creative_pool                                      | botania:creative_pool                                      |
| botania/equipment/loonium/armorset/snout_netherite                | minecraft:netherite_helmet                                 |
| botania/equipment/loonium/armorset/snout_netherite                | minecraft:netherite_chestplate                             |
| botania/equipment/loonium/armorset/snout_netherite                | minecraft:netherite_leggings                               |
| botania/equipment/loonium/armorset/snout_netherite                | minecraft:netherite_boots                                  |
| create/blocks/creative_crate                                      | create:creative_crate                                      |
| create/blocks/creative_fluid_tank                                 | create:creative_fluid_tank                                 |
| create/blocks/creative_motor                                      | create:creative_motor                                      |
| create/blocks/netherite_backtank                                  | create:netherite_backtank                                  |
| create_connected/blocks/creative_fluid_vessel                     | create_connected:creative_fluid_vessel                     |
| create_new_age/blocks/netherite_magnet                            | create_new_age:netherite_magnet                            |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createdeco/blocks/netherite_coinstack                             | createdeco:netherite_coinstack                             |
| createmoredrillheads/blocks/amethyst_dusts_tipped_netherite_drill | createmoredrillheads:amethyst_dusts_tipped_netherite_drill |
| createmoredrillheads/blocks/emerald_dusts_tipped_netherite_drill  | createmoredrillheads:emerald_dusts_tipped_netherite_drill  |
| createmoredrillheads/blocks/netherite_drill                       | createmoredrillheads:netherite_drill                       |
| createmoredrillheads/blocks/quartz_dusts_tipped_netherite_drill   | createmoredrillheads:quartz_dusts_tipped_netherite_drill   |
| createmoredrillheads/blocks/redstone_dusts_tipped_netherite_drill | createmoredrillheads:redstone_dusts_tipped_netherite_drill |
| creatingspace/blocks/netherite_oxygen_backtank                    | creatingspace:netherite_oxygen_backtank                    |
| excessive_building/blocks/netherite_brick_slab                    | excessive_building:netherite_brick_slab                    |
| excessive_building/blocks/netherite_brick_stairs                  | excessive_building:netherite_brick_stairs                  |
| excessive_building/blocks/netherite_brick_vertical_stairs         | excessive_building:netherite_brick_vertical_stairs         |

