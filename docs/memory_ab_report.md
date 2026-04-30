# Memory A/B Runtime Report

Generated: 2026-04-29T12:54:17.729Z

Instance: `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft`

Before log: `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/logs/latest.log`

After log: `/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft/logs/latest.log`

## Runtime Metrics

| Metric                         | Before | After  | Delta           |
| ------------------------------ | ------ | ------ | --------------- |
| reachedIntegratedServer        | true   | true   |                 |
| reachedInGame                  |        | true   |                 |
| spawnPrepTimeMs                | 23874  | 702    | -23172 (-97.1%) |
| mainMenuToInGameMs             |        | 27639  |                 |
| totalLoadToWorldMs             |        | 130083 |                 |
| serverTickBehindWarnings       | 3      | 0      | -3 (-100%)      |
| maxTickBehindMs                | 8212   | 0      | -8212 (-100%)   |
| totalTickBehindMs              | 18651  | 0      | -18651 (-100%)  |
| worldSaveDurationMs            | 542    | 521    | -21 (-3.9%)     |
| dimensionSaveCount             | 27     | 27     | +0 (0%)         |
| distantHorizonsIncompleteTasks | 1      | 0      | -1 (-100%)      |
| emiTotalReloadMs               | 42537  | 29350  | -13187 (-31%)   |
| emiSlowestPluginMs             | 6080   | 3848   | -2232 (-36.7%)  |
| patchouliPreloadedJsons        | 4506   | 4506   | +0 (0%)         |
| createInjectedRecipes          | 1256   | 1256   | +0 (0%)         |

## RSS Profile

| Metric              | Before | After | Delta |
| ------------------- | ------ | ----- | ----- |
| samples             |        | 251   |       |
| durationSeconds     |        | 511   |       |
| peakRssMiB          |        | 28158 |       |
| peakRssGiB          |        | 27.5  |       |
| peakAtSeconds       |        | 158   |       |
| finalLiveRssMiB     |        | 28005 |       |
| finalLiveRssGiB     |        | 27.35 |       |
| finalObservedRssMiB |        | 0     |       |

## Before Config

```json
{
  "dh": {
    "enableDistantGeneration": "true",
    "distantGeneratorMode": "FEATURES",
    "maxGenerationRequestDistance": "4096",
    "maxSyncOnLoadRequestDistance": "4096",
    "lodChunkRenderDistanceRadius": "256",
    "maxHorizontalResolution": "BLOCK"
  },
  "oculus": {
    "enableShaders": "true",
    "maxShadowRenderDistance": "32"
  }
}
```

## After Config

```json
{
  "dh": {
    "enableDistantGeneration": "false",
    "distantGeneratorMode": "PRE_EXISTING_ONLY",
    "maxGenerationRequestDistance": "512",
    "maxSyncOnLoadRequestDistance": "512",
    "lodChunkRenderDistanceRadius": "128",
    "maxHorizontalResolution": "FOUR_BLOCKS"
  },
  "oculus": {
    "enableShaders": "false",
    "maxShadowRenderDistance": "16"
  },
  "spark": {
    "backgroundProfiler": "false"
  }
}
```
