# Automated Pack Test Report

Generated: 2026-04-30T05:30:20.815Z

Repo: `/home/gerald/obelisks`

Instance: `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft`

## Result

| Class         | Count |
| ------------- | ----- |
| Passes        | 61    |
| Hard failures | 0     |
| Soft findings | 5     |
| Skipped       | 1     |

## Hard Failures

| Test | Detail |
| ---- | ------ |

## Soft Findings

| Rank   | Test                                                        | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHOULD | Alchemistry has player-facing crafting recipes              | alchemistry:patchouli_book -> patchouli:guide_book                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| MUST   | generated recipe graph has undertiered machine-like outputs | createdieselgenerators:crafting/large_diesel_engine -> createdieselgenerators:large_diesel_engine needs create_brass, inferred survival
createdieselgenerators:crafting/pumpjack_bearing -> createdieselgenerators:pumpjack_bearing needs create_brass, inferred survival
acid_vat:centrifuge_bearing -> acid_vat:centrifuge_bearing needs create_brass, inferred survival
expatternprovider:ei_part -> expatternprovider:ex_interface_part needs ae2, inferred survival
create_new_age:shapeless/reactor_heat_vent -> create_new_age:reactor_heat_vent needs power_grid, inferred survival
create:crafting/kinetics/vertical_gearbox_from_conversion -> create:vertical_gearbox needs create_andesite, inferred survival
create_connected:crafting/kinetics/six_way_gearbox_from_conversion -> create_connected:six_way_gearbox needs create_brass, inferred survival
createdieselgenerators:crafting/engine_turbocharger -> createdieselgenerators:engine_turbocharger needs create_brass, inferred survival
create:crafting/kinetics/vertical_gearbox -> create:vertical_gearbox needs create_andesite, inferred survival
acid_vat:mechanical_slurry_pump -> acid_vat:mechanical_slurry_pump needs create_brass, inferred survival
create:crafting/kinetics/gearbox -> create:gearbox needs create_andesite, inferred survival
createdieselgenerators:crafting/diesel_engine -> createdieselgenerators:diesel_engine needs create_brass, inferred survival
create:crafting/kinetics/crafter_slot_cover -> create:crafter_slot_cover needs create_andesite, inferred survival
create_connected:crafting/kinetics/brass_gearbox -> create_connected:brass_gearbox needs create_brass, inferred survival
create_connected:crafting/kinetics/parallel_gearbox_from_conversion -> create_connected:parallel_gearbox needs create_brass, inferred survival
create_connected:crafting/kinetics/six_way_gearbox_from_parallel -> create_connected:six_way_gearbox needs create_brass, inferred survival
create:crafting/appliances/linked_controller -> create:linked_controller needs create_andesite, inferred survival
create:crafting/kinetics/smart_fluid_pipe -> create:smart_fluid_pipe needs create_andesite, inferred survival
tconstruct:smeltery/casting/seared/smeltery_controller -> tconstruct:smeltery_controller needs tcon_seared, inferred survival
create_connected:crafting/kinetics/vertical_brass_gearbox_from_conversion -> create_connected:vertical_brass_gearbox needs create_brass, inferred survival
create_connected:crafting/kinetics/vertical_parallel_gearbox_from_conversion -> create_connected:vertical_parallel_gearbox needs create_brass, inferred survival
create_connected:crafting/kinetics/parallel_gearbox -> create_connected:parallel_gearbox needs create_brass, inferred survival
create_connected:crafting/kinetics/six_way_gearbox_from_gearbox -> create_connected:six_way_gearbox needs create_brass, inferred survival
createdieselgenerators:crafting/huge_diesel_engine -> createdieselgenerators:huge_diesel_engine needs create_brass, inferred survival
create_connected:crafting/kinetics/vertical_six_way_gearbox_from_conversion -> create_connected:vertical_six_way_gearbox needs create_brass, inferred survival
tconstruct:tools/parts/fake_storage_block_casting -> tconstruct:fake_storage_block needs tcon_seared, inferred survival
createdieselgenerators:crafting/engine_silencer -> createdieselgenerators:engine_silencer needs create_brass, inferred survival
create:crafting/kinetics/encased_chain_drive -> create:encased_chain_drive needs create_andesite, inferred survival
acid_vat:centrifuge_chamber -> acid_vat:centrifuge_chamber needs create_brass, inferred survival
create_new_age:sequenced_assembly/reactor_casing -> create_new_age:reactor_casing needs power_grid, inferred survival
create:crafting/materials/transmitter -> create:transmitter needs create_andesite, inferred survival
create_new_age:shaped/reactor_glass -> create_new_age:reactor_glass needs power_grid, inferred survival
tconstruct:tools/building/excavator -> tconstruct:excavator needs tcon_seared, inferred survival
expatternprovider:ei_alt -> expatternprovider:ex_interface needs ae2, inferred survival
create:crafting/kinetics/encased_chain_drive_from_zinc -> create:encased_chain_drive needs create_andesite, inferred survival
tconstruct:smeltery/casting/scorched/foundry_controller -> tconstruct:foundry_controller needs tcon_seared, inferred survival
create_connected:crafting/kinetics/brass_gearbox_from_conversion -> create_connected:brass_gearbox needs create_brass, inferred survival
create:crafting/kinetics/controller_rail -> create:controller_rail needs create_andesite, inferred survival
create:crafting/kinetics/steam_engine -> create:steam_engine needs create_andesite, inferred survival
create:crafting/kinetics/gearbox_from_conversion -> create:gearbox needs create_andesite, inferred survival
expatternprovider:oversize_interface_part -> expatternprovider:oversize_interface_part needs ae2, inferred survival
create_new_age:shaped/stirling_engine -> create_new_age:stirling_engine needs power_grid, inferred survival
create_new_age:mechanical_crafting/advanced_motor_extension -> create_new_age:advanced_motor_extension needs power_grid, inferred survival
tconstruct:tools/parts/fake_ingot_to_block -> tconstruct:fake_storage_block needs tcon_seared, inferred survival
createdieselgenerators:crafting/engine_piston -> createdieselgenerators:engine_piston needs create_brass, inferred survival
create_connected:crafting/kinetics/six_way_gearbox -> create_connected:six_way_gearbox needs create_brass, inferred survival
create:crafting/kinetics/cart_assembler -> create:cart_assembler needs create_andesite, inferred survival
tconstruct:tools/parts/fake_storage_block_composite -> tconstruct:fake_storage_block needs tcon_seared, inferred survival
createdieselgenerators:mechanical_crafting/pumpjack_crank -> createdieselgenerators:pumpjack_crank needs create_brass, inferred survival
railways:crafting/portable_fuel_interface -> railways:portable_fuel_interface needs create_brass, inferred survival |
| SHOULD | machine recipes still use raw vanilla valuables directly    | framedblocks:framing_saw/framed_fancy_activator_rail -> framedblocks:framed_fancy_activator_rail: minecraft:redstone
ae2:inscriber/calculation_processor -> ae2:calculation_processor: minecraft:redstone
sophisticatedstorageinmotion:chest_minecart_to_storage_minecart -> sophisticatedstorageinmotion:storage_minecart: minecraft:redstone
ae2:inscriber/logic_processor -> ae2:logic_processor: minecraft:redstone
framedblocks:framed_fancy_activator_rail -> framedblocks:framed_fancy_activator_rail: minecraft:redstone
littlelogistics:receiver_component -> littlelogistics:receiver_component: minecraft:redstone
expatternprovider:epa_upgrade -> expatternprovider:pattern_terminal_upgrade: minecraft:redstone
oc2r:redstone_interface_card -> oc2r:redstone_interface_card: minecraft:redstone
ae2things:cells/disk_drive_256k -> ae2things:disk_drive_256k: minecraft:amethyst_shard
ae2things:cells/disk_drive_4k -> ae2things:disk_drive_4k: minecraft:amethyst_shard
ae2things:cells/disk_drive_1k -> ae2things:disk_drive_1k: minecraft:amethyst_shard
ae2things:cells/disk_drive_64k -> ae2things:disk_drive_64k: minecraft:amethyst_shard
weather2:wind_turbine -> weather2:wind_turbine: minecraft:redstone
ae2things:cells/disk_housing -> ae2things:disk_housing: minecraft:amethyst_shard
ae2things:cells/disk_drive_16k -> ae2things:disk_drive_16k: minecraft:amethyst_shard
sophisticatedstorage:storage_tool -> sophisticatedstorage:storage_tool: minecraft:redstone
ae2:inscriber/engineering_processor -> ae2:engineering_processor: minecraft:redstone
minecraft:activator_rail -> minecraft:activator_rail: minecraft:redstone                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| MUST   | critical outputs absent from generated recipe dump          | create:andesite_casing, kubejs:ae2_machine_casing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| SHOULD | world save duration is measurable                           | missing shutdown save markers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Passes

| Test                                                                | Detail                   |
| ------------------------------------------------------------------- | ------------------------ |
| progression catalog parses                                          | 10 tiers                 |
| all repo JSON parses                                                | 92 files                 |
| all KubeJS/tool JS parses with node --check                         | 82 files                 |
| performance budget: JSON and JS syntax validation                   | 3883.74 ms <= 8000 ms    |
| critical expert-pack surfaces exist                                 | 19 files                 |
| machine casing IDs are referenced                                   | 8 casings                |
| AE2 machine casing does not consume AE2 controller                  |                          |
| TiCEX Reconstruction Core is hard-gated post-AE2                    |                          |
| Protection Pixel is hard-gated as post-AE2 armor                    |                          |
| Advanced AE quantum armor is displaced by Protection Pixel          |                          |
| Tome of Blood is hard-gated as post-AE2 hybrid magic                |                          |
| Tome of Blood is no longer gated as an Altar III side mod           |                          |
| Hooks and Create SA drones are tier-gated                           |                          |
| High-impact backpack upgrades are post-AE2                          |                          |
| Quarantined machines/upgrades are removed and hidden                |                          |
| Fallout Wastelands portal is gated by Creating Space                |                          |
| Twilight Forest portal is advancement-locked by Creating Space      |                          |
| Creating Space access advancement has a concrete space item trigger |                          |
| performance budget: critical progression surfaces                   | 3.47 ms <= 750 ms        |
| all chapters are assigned to existing chapter groups                | 48 chapters              |
| chapter titles do not duplicate chapter group labels                |                          |
| quest dependencies resolve                                          | 586 refs                 |
| quest nodes expose stable recipe hooks                              |                          |
| Starting Out rewards exactly 4 copper per quest                     | 20 quests                |
| non-Starting quest coin rewards use 4-count tier packets            |                          |
| quest book covers major progression nodes                           | 30 anchors               |
| Food chapter exposes food showcase coverage                         | 9 representative foods   |
| TCon chapter exposes weapon and tool showcase coverage              | 6 representative tools   |
| TCon showcase tasks ignore NBT                                      |                          |
| performance budget: quest book validation                           | 9.13 ms <= 250 ms        |
| Wares contracts do not use emerald currency                         | 17 tables                |
| Wares contracts contain dotcoin currency                            | 17 tables                |
| villager trade script covers broad profession set                   | 13 professions           |
| villager trade script has no emerald currency                       |                          |
| sell-trade helper pays copper coins instead of emeralds             |                          |
| performance budget: Wares and villager trade validation             | 0.61 ms <= 250 ms        |
| repo loot table JSON parses                                         | 88 tables                |
| repo loot tables inject many coin sources                           | 32 tables                |
| repo loot tables contain no direct emerald loot                     |                          |
| repo loot tables contain no obvious high-power outputs              |                          |
| performance budget: repo loot data validation                       | 2.34 ms <= 500 ms        |
| generated recipe chunks match manifest                              | 29130 recipes            |
| generated recipes have unique IDs                                   |                          |
| generated recipe JSON parses                                        |                          |
| no forbidden creative/debug outputs are craftable                   |                          |
| performance budget: generated recipe graph validation               | 173.72 ms <= 5000 ms     |
| performance budget: generated loot dump validation                  | 0.15 ms <= 2500 ms       |
| latest engine log is recent                                         | 0.05 minutes old         |
| engine reached integrated server startup                            |                          |
| world became playable/servable                                      | ModernFix in-game marker |
| spawn preparation budget                                            | 701 ms <= 60000 ms       |
| server tick-behind budget                                           | 2 warnings, max 7429 ms  |
| dimension save fanout                                               | 0 dimensions             |
| Distant Horizons shutdown backlog                                   | 0 incomplete tasks       |
| EMI reload budget                                                   | 10998 ms <= 90000 ms     |
| no newer crash report than latest engine log                        |                          |
| performance budget: engine and world performance log analysis       | 25.31 ms <= 250 ms       |
| dev dump script emits expected artifacts                            |                          |
| dev food effect dump script emits expected artifacts                |                          |
| food effect graph analyzer emits expected artifacts                 |                          |
| performance budget: dev dump health validation                      | 0.33 ms <= 50 ms         |

## Skipped

| Test                      | Detail                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| generated loot dump tests | missing /home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/dump/data_raw/loot_tables |

## Metrics

```json
{
  "questChapters": 48,
  "villagerProfessionsCovered": 13,
  "generatedRecipes": 29130,
  "engineWorld": {
    "latestLog": "/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/logs/latest.log",
    "latestLogAgeMinutes": 0.05,
    "latestLogLines": 27073,
    "reachedIntegratedServer": true,
    "startedServingLan": false,
    "reachedInGame": true,
    "mainMenuToInGameMs": 15850,
    "totalLoadToWorldMs": 56807,
    "spawnPrepTimeMs": 701,
    "serverTickBehindWarnings": 2,
    "maxTickBehindMs": 7429,
    "totalTickBehindMs": 10327,
    "maxTickBehindTicks": 148,
    "worldSaveDurationMs": null,
    "worldSaveFromSavingWorldsMs": null,
    "dimensionSaveCount": 0,
    "distantHorizonsIncompleteTasks": 0,
    "settlementRoadsRebuilds": 340,
    "settlementRoadsMaxDiscoveredStructures": 3,
    "settlementRoadsMaxConnections": 0,
    "emiTotalReloadMs": 10998,
    "emiSlowestPluginMs": 1600,
    "emiSlowestPlugin": "jemi",
    "newestCrashReport": null,
    "newestCrashReportAfterLatestLog": false
  },
  "performance": {
    "budgetsMs": {
      "JSON and JS syntax validation": 8000,
      "critical progression surfaces": 750,
      "quest book validation": 250,
      "Wares and villager trade validation": 250,
      "repo loot data validation": 500,
      "generated recipe graph validation": 5000,
      "generated loot dump validation": 2500,
      "engine and world performance log analysis": 250,
      "dev dump health validation": 50
    },
    "hardLimitsMs": {
      "JSON and JS syntax validation": 24000,
      "critical progression surfaces": 3000,
      "quest book validation": 1500,
      "Wares and villager trade validation": 1500,
      "repo loot data validation": 3000,
      "generated recipe graph validation": 20000,
      "generated loot dump validation": 10000,
      "engine and world performance log analysis": 1500,
      "dev dump health validation": 500
    },
    "results": [
      {
        "name": "JSON and JS syntax validation",
        "durationMs": 3883.74,
        "budgetMs": 8000,
        "hardLimitMs": 24000
      },
      {
        "name": "critical progression surfaces",
        "durationMs": 3.47,
        "budgetMs": 750,
        "hardLimitMs": 3000
      },
      {
        "name": "quest book validation",
        "durationMs": 9.13,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "Wares and villager trade validation",
        "durationMs": 0.61,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "repo loot data validation",
        "durationMs": 2.34,
        "budgetMs": 500,
        "hardLimitMs": 3000
      },
      {
        "name": "generated recipe graph validation",
        "durationMs": 173.72,
        "budgetMs": 5000,
        "hardLimitMs": 20000
      },
      {
        "name": "generated loot dump validation",
        "durationMs": 0.15,
        "budgetMs": 2500,
        "hardLimitMs": 10000
      },
      {
        "name": "engine and world performance log analysis",
        "durationMs": 25.31,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "dev dump health validation",
        "durationMs": 0.33,
        "budgetMs": 50,
        "hardLimitMs": 500
      }
    ]
  }
}
```
