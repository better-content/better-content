# Requested Re-Enable Memory Profile

Profile date: 2026-04-30

This profile starts from the repo after the 8 GiB cut, then re-enables the user-requested mod set and the minimum additional dependencies needed for that set to load.

## Result

- Variant: `jvm_xmx6g_requested_reenable_profile_menu`
- State reached: loaded client/menu
- Xmx/Xms: `-Xmx6000m`, `-Xms2000m`
- Runtime knobs: `MALLOC_ARENA_MAX=2`, process-level THP disabled
- Loaded mods reported by Puzzles Lib: `348`
- Block atlas: `32768x16384x4 minecraft:textures/atlas/blocks.png-atlas`
- Corrected peak RSS: `12.58 GiB`
- Target status: over the `<8 GiB` target by about `4.6 GiB`

The first run undercounted because sampling stopped immediately after the menu marker. The corrected run sampled through the post-menu settle window.

## Summary Line

```text
variant=jvm_xmx6g_requested_reenable_profile_menu marker=menu java_pid=347452 peakMiB=12878 peakGiB=12.58 staleDisabled=86
[30Apr2026 08:21:09.670] [main/INFO] [Puzzles Lib/]: Loading 348 mods:
[30Apr2026 08:21:38.010] [Render thread/INFO] [net.minecraft.client.renderer.texture.TextureAtlas/]: Created: 32768x16384x4 minecraft:textures/atlas/blocks.png-atlas
```

## Requested Mods Re-Enabled

- The Aether
- aleki's Nifty Ships
- AmbientSounds 6
- Ars Nouveau
- Artifacts
- Base Raid
- Better Combat
- Blue Skies
- Botania
- Controllable
- Deeper and Darker
- Distant Horizons
- Dynamic Trees addons: Ars Nouveau, Nature's Spirit, Plus, Quark, Malum addon jar
- Base EMI
- Fallout Wastelands
- Farsighted Mobs
- Golem Overhaul
- Guard Villagers
- Ice and Fire: Dragons
- It Takes a Pillage
- Malum
- Occultism
- Oculus
- Particular Reforged
- Presence Footsteps
- Realistic Block Physics + Realistic Physics
- Relics
- Reliquary Reincarnations
- Savage & Ravage
- Sound Physics Remastered
- The Finley Dimension Remastered
- The Lost Cities
- The Twilight Forest
- The Undergarden
- Theurgy
- TiCEX
- Tinker and Better Combat
- Tinkers' Battle Spades
- Tinkers' Advanced Tools
- Tinkers' Construct: Additional Weaponry
- Tinkers' Weaponry
- Tome of Blood: Rebirth
- Undergarden Delight
- BetterGrassify
- Quark
- Amendments
- Everything Copper
- Immersive Weathering
- Supplementaries
- Plonk

## Additional Required Dependencies Re-Enabled

These were not explicitly listed, but the requested set would not load without them:

- Zeta: required by Quark
- Tinkers' Advanced Core: required by Tinkers' Advanced Tools
- Modonomicon: required by Occultism and Theurgy
- Lodestone: required by Malum
- Nature's Spirit: required by Dynamic Trees for Nature's Spirit

## Instance Hygiene

The disposable Prism instance was stale, so the profile temporarily disabled every instance jar not present in the current repo-active Packwiz set.

- Repo-active jars after re-enable and dependency fixes: `267`
- Stale instance jars disabled during profile: `86`
- Missing repo-active jars in instance before profiling: `3`, downloaded from Modrinth using Packwiz metadata

## Interpretation

This requested re-enable set is too large for the 8 GiB target. The biggest qualitative causes are the return of major client asset/model systems at the same time: dimensions, broad magic, TCon add-ons, visual/audio effects, Distant Horizons/Oculus, and several terrain/deco-adjacent systems. The atlas remains at `32768x16384x4`, so the dominant pressure is still client model/texture/resource surface.
