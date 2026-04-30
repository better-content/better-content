# Pillager Pressure Pass

## Finding

Base Raid was configured for frequent custom patrols, but live logs show it disables vanilla patrols with `doPatrolSpawning = false`. Inspection found the custom patrol spawner class but no clear event registration path, and live logs showed no custom patrol spawn messages.

## Implemented Fix

Added `kubejs/server_scripts/70_spawn/20_pillager_patrol_pressure.js` as a pack-owned patrol controller.

Current behavior:

- Runs every 1200 ticks.
- 95% spawn chance per overworld player.
- Spawns on a surface ring 32-64 blocks from the player.
- Spawns one patrol leader plus 4-7 pillagers.
- 75% chance to add 2 special illagers from vanilla, It Takes a Pillage, and Savage & Ravage.
- Tags spawned mobs with `btm_pillager_patrol`.
- Skips spectators.

## Tuning Surface

Edit constants at the top of `20_pillager_patrol_pressure.js`:

- `BTM_PATROL_INTERVAL_TICKS`
- `BTM_PATROL_CHANCE`
- `BTM_PATROL_MIN_RADIUS`
- `BTM_PATROL_MAX_RADIUS`
- `BTM_PATROL_MIN_PILLAGERS`
- `BTM_PATROL_MAX_PILLAGERS`
- `BTM_PATROL_SPECIAL_CHANCE`
- `BTM_PATROL_SPECIAL_COUNT`

## Validation Notes

The script uses commands for actual entity spawning and Java heightmap lookup for surface placement. If heightmap lookup fails in KubeJS, it falls back to the player's current Y coordinate rather than crashing.
