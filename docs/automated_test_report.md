# Automated Pack Test Report

Generated: 2026-05-16T01:13:14.562Z

Repo: `/home/gerald/obelisks`

Instance: `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft`

## Result

| Class         | Count |
| ------------- | ----- |
| Passes        | 47    |
| Hard failures | 0     |
| Soft findings | 3     |
| Skipped       | 5     |

## Hard Failures

| Test | Detail |
| ---- | ------ |

## Soft Findings

| Rank   | Test                                                     | Detail                                                                                                                            |
| ------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| MUST   | generated recipe graph is older than repo recipe scripts | 136_machine_casing_ecosystem_expansion.js is newer than live recipe dump; reload the instance to refresh full_recipe_index_*.json |
| SHOULD | server tick-behind budget exceeded                       | 2 warnings, max 11285 ms                                                                                                          |
| SHOULD | recent crash report exists                               | crash-2026-05-16_10.57.51-fml.txt                                                                                                 |

## Passes

| Test                                                                    | Detail                           |
| ----------------------------------------------------------------------- | -------------------------------- |
| progression catalog parses                                              | 12 tiers                         |
| all repo JSON parses                                                    | 158 files                        |
| all KubeJS/tool JS parses with node --check                             | 92 files                         |
| performance budget: JSON and JS syntax validation                       | 4321.84 ms <= 8000 ms            |
| critical expert-pack surfaces exist                                     | 20 files                         |
| machine casing IDs are referenced                                       | 10 casings                       |
| Raw Impossible casing does not consume AE2 controller                   |                                  |
| TiCEX Reconstruction Core is hard-gated post-AE2                        |                                  |
| Protection Pixel is hard-gated as post-AE2 armor                        |                                  |
| Protection Pixel late armor is displaced into explicit post-AE2 recipes |                                  |
| Tome of Blood is hard-gated as post-AE2 hybrid magic                    |                                  |
| Tome of Blood is no longer gated as an Altar III side mod               |                                  |
| Hooks and Create SA drones are tier-gated                               |                                  |
| High-impact backpack upgrades are post-AE2                              |                                  |
| Quarantined machines/upgrades are removed and hidden                    |                                  |
| Fallout Wastelands portal is gated by Creating Space                    |                                  |
| Twilight Forest portal is advancement-locked by Creating Space          |                                  |
| Creating Space access advancement has a concrete space item trigger     |                                  |
| performance budget: critical progression surfaces                       | 4.39 ms <= 750 ms                |
| quest book is intentionally empty                                       | 0 chapters and no chapter groups |
| performance budget: quest book validation                               | 0.36 ms <= 250 ms                |
| Wares contracts do not use emerald currency                             | 17 tables                        |
| Wares contracts contain Create Deco coin currency                       | 17 tables                        |
| villager trade script covers broad profession set                       | 13 professions                   |
| villager trade script has no emerald currency                           |                                  |
| sell-trade helper pays copper coins instead of emeralds                 |                                  |
| performance budget: Wares and villager trade validation                 | 0.67 ms <= 250 ms                |
| repo loot table JSON parses                                             | 96 tables                        |
| repo loot tables inject many coin sources                               | 32 tables                        |
| repo loot tables contain no direct emerald loot                         |                                  |
| repo loot tables contain no obvious high-power outputs                  |                                  |
| performance budget: repo loot data validation                           | 1.65 ms <= 500 ms                |
| performance budget: generated recipe graph validation                   | 20.45 ms <= 5000 ms              |
| performance budget: generated loot dump validation                      | 0.15 ms <= 2500 ms               |
| latest engine log is recent                                             | 9.49 minutes old                 |
| engine reached integrated server startup                                |                                  |
| world became playable/servable                                          | ModernFix in-game marker         |
| spawn preparation budget                                                | 38495 ms <= 60000 ms             |
| world save budget                                                       | 684 ms <= 10000 ms               |
| dimension save fanout                                                   | 21 dimensions                    |
| Distant Horizons shutdown backlog                                       | 4 incomplete tasks               |
| EMI reload budget                                                       | 14164 ms <= 90000 ms             |
| performance budget: engine and world performance log analysis           | 27 ms <= 250 ms                  |
| dev dump script emits expected artifacts                                |                                  |
| dev food effect dump script emits expected artifacts                    |                                  |
| food effect graph analyzer emits expected artifacts                     |                                  |
| performance budget: dev dump health validation                          | 0.19 ms <= 50 ms                 |

## Skipped

| Test                                    | Detail                                                                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| quest dependency validation             | quest book removed                                                                                                            |
| quest reward validation                 | quest book removed                                                                                                            |
| quest progression anchor validation     | quest book removed                                                                                                            |
| food and TCon quest showcase validation | quest book removed                                                                                                            |
| generated loot dump tests               | missing /home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/dump/data_raw/loot_tables |

## Metrics

```json
{
  "questChapters": 0,
  "villagerProfessionsCovered": 13,
  "engineWorld": {
    "latestLog": "/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/logs/latest.log",
    "latestLogAgeMinutes": 9.49,
    "latestLogLines": 23415,
    "reachedIntegratedServer": true,
    "startedServingLan": false,
    "reachedInGame": true,
    "mainMenuToInGameMs": 60325,
    "totalLoadToWorldMs": 102726,
    "spawnPrepTimeMs": 38495,
    "serverTickBehindWarnings": 2,
    "maxTickBehindMs": 11285,
    "totalTickBehindMs": 17366,
    "maxTickBehindTicks": 225,
    "worldSaveDurationMs": 684,
    "worldSaveFromSavingWorldsMs": 683,
    "dimensionSaveCount": 21,
    "distantHorizonsIncompleteTasks": 4,
    "settlementRoadsRebuilds": 0,
    "settlementRoadsMaxDiscoveredStructures": 0,
    "settlementRoadsMaxConnections": 0,
    "emiTotalReloadMs": 14164,
    "emiSlowestPluginMs": 1854,
    "emiSlowestPlugin": "jemi",
    "newestCrashReport": "crash-2026-05-16_10.57.51-fml.txt",
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
        "durationMs": 4321.84,
        "budgetMs": 8000,
        "hardLimitMs": 24000
      },
      {
        "name": "critical progression surfaces",
        "durationMs": 4.39,
        "budgetMs": 750,
        "hardLimitMs": 3000
      },
      {
        "name": "quest book validation",
        "durationMs": 0.36,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "Wares and villager trade validation",
        "durationMs": 0.67,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "repo loot data validation",
        "durationMs": 1.65,
        "budgetMs": 500,
        "hardLimitMs": 3000
      },
      {
        "name": "generated recipe graph validation",
        "durationMs": 20.45,
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
        "durationMs": 27,
        "budgetMs": 250,
        "hardLimitMs": 1500
      },
      {
        "name": "dev dump health validation",
        "durationMs": 0.19,
        "budgetMs": 50,
        "hardLimitMs": 500
      }
    ]
  }
}
```
