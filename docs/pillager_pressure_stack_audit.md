# Pillager Pressure Stack Audit

## Current Finding

The pack has multiple systems affecting pillager pressure. Base Raid does not currently provide reliable patrol pressure because `base_raid-0.5.jar` registers `HomeRaidSpawnLogic` and `VanillaPatrolHandler`, but does not register/call `CustomPatrolSpawner`.

The KubeJS patrol script was loaded successfully in the live instance, but no patrol logs appeared. A likely blocker was In Control's surface-hostile deny rules. `config/incontrol/spawn.json` denies hostile overworld spawns on many grass/rooty surface blocks; command-spawned mobs can still be routed through spawn checks. A narrow overworld allow rule for the intended illager patrol pool has been inserted before the surface deny rules.

## Active Pillager/Raid/Spawn Stack

- Base Raid: Bad Omen bottle, fake-villager base raid trigger, disables vanilla patrol gamerule when custom patrols enabled.
- KubeJS: pack-owned `btmpatrol` scheduler and commands.
- In Control: broad surface spawn denial, now with first-rule allow for patrol illagers.
- It Takes a Pillage: extra illagers and pillage siege config.
- Savage & Ravage: extra illagers.
- Guard Villagers: village defense pressure and villager combat behavior.
- Golem Overhaul: village defense changes.
- Enhanced AI: pillager shooting range/accuracy and general mob behavior.
- Farsighted Mobs: hostile follow range floor of 64 via default server config.
- Mob AI Tweaks: general AI behavior changes.
- No Mob Farms: anti-farming behavior; should be watched if patrol drops behave oddly.
- Raider Detector: raid detection/tooling.
- Village Walls / Village Spawn Point: village/base context but not patrol source.

## New Debug Surface

KubeJS command added:

- `/btmpatrol now`: force an immediate patrol attempt around every overworld player.
- `/btmpatrol status`: log and print scheduler status.

Expected log lines:

- `[btm_patrols] attempt force=true players=... spawned_groups=...`
- `[btm_patrols] spawned near ... command_success=...`

## Next Escalation

If `/btmpatrol now` still returns `command_success=0` or no entities appear, the clean fix is a tiny custom mod that owns:

- patrol scheduling
- surface placement
- spawn-finalization bypass for pack-authored patrols
- captain bottle/Bad Omen bridge
- config-driven tuning
- optional raid escalation state

That would be cleaner than continuing to route a core threat system through KubeJS commands and multiple spawn-control mods.
