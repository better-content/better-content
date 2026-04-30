# 8 GiB RAM Cut Manifest

This documents the content cut set used to get the disposable Prism client below 8 GiB RSS at loaded menu.

## Measurement

- Profile: `jvm_xmx6g_all_worthy_content_cuts_menu_diag`
- Result: `java_pid=326814 peakMiB=7743 peakGiB=7.56 disabled=146`
- State reached: loaded client/menu, not validated world-entry yet
- Heap: `-Xmx6000m`, `-Xms2000m`
- Runtime knobs: `MALLOC_ARENA_MAX=2`, process-level THP disabled
- Important caveat: previous world-entry attempts with this cut set need a compatible fresh save; the old `New World` save references removed worldgen/dimension content.

## Repo Action

- Moved active repo mod files: `114`
- External storage: `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616`
- Packwiz index was refreshed after moving these files.

## Removed From Active Repo

| Mod | Repo file | Jar filename | Disabled storage |
|---|---|---|---|
| The Aether | `mods/aether.pw.toml` | `aether-1.20.1-1.5.2-neoforge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/aether.pw.toml` |
| aleki's Nifty Ships | `mods/alekiships.pw.toml` | `alekiNiftyShips-FORGE-1.20.1-1.0.14.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/alekiships.pw.toml` |
| Alex's Mobs | `mods/alexs-mobs.pw.toml` | `alexsmobs-1.22.9.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/alexs-mobs.pw.toml` |
| AmbientSounds 6 | `mods/ambientsounds.pw.toml` | `AmbientSounds_FORGE_v6.3.4_mc1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ambientsounds.pw.toml` |
| Apotheosis | `mods/apotheosis.pw.toml` | `Apotheosis-1.20.1-7.4.8.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/apotheosis.pw.toml` |
| Apotheotic Additions | `mods/apotheotic-additions.pw.toml` | `ApotheoticAdditionsV2.2.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/apotheotic-additions.pw.toml` |
| Apothic Attributes | `mods/apothic-attributes.pw.toml` | `ApothicAttributes-1.20.1-1.3.7.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/apothic-attributes.pw.toml` |
| Ars Additions | `mods/ars-additions.pw.toml` | `ars_additions-1.20.1-1.6.7.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-additions.pw.toml` |
| Ars Caelum | `mods/ars-caelum.pw.toml` | `ars_caelum-1.20.1-2.0.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-caelum.pw.toml` |
| Ars Creo | `mods/ars-creo.pw.toml` | `ars_creo-1.20.1-4.3.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-creo.pw.toml` |
| Ars Elemental | `mods/ars-elemental.pw.toml` | `ars_elemental-1.20.1-0.6.7.9.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-elemental.pw.toml` |
| Ars Énergistique | `mods/ars-energistique.pw.toml` | `arseng-1.2.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-energistique.pw.toml` |
| Ars Instrumentum | `mods/ars-instrumentum.pw.toml` | `ars_instrumentum-1.20.1-4.1.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-instrumentum.pw.toml` |
| Ars Nouveau | `mods/ars-nouveau.pw.toml` | `ars_nouveau-1.20.1-4.12.7-all.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-nouveau.pw.toml` |
| Ars Scalaes | `mods/ars-scalaes.pw.toml` | `ars_scalaes-1.20.1-1.10.7c.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-scalaes.pw.toml` |
| Ars Technica | `mods/ars-technica.pw.toml` | `ars_technica-1.20.1-1.4.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ars-technica.pw.toml` |
| Art Update | `mods/art-update.pw.toml` | `art_update-1.0.0-forge-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/art-update.pw.toml` |
| Artifacts | `mods/artifacts.pw.toml` | `artifacts-forge-9.5.19.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/artifacts.pw.toml` |
| Base Raid (Ominous Bottle Backport and Custom Pillager Patrols) | `mods/base-raid.pw.toml` | `base_raid-0.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/base-raid.pw.toml` |
| Better Combat [Fabric & Forge] | `mods/better-combat-by-daedelus.pw.toml` | `bettercombat-forge-1.9.0+1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/better-combat-by-daedelus.pw.toml` |
| Blue Skies | `mods/blue-skies.pw.toml` | `blue_skies-1.20.1-1.3.31.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/blue-skies.pw.toml` |
| Born in Chaos | `mods/born-in-chaos.pw.toml` | `born_in_chaos_[Forge]1.20.1_1.7.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/born-in-chaos.pw.toml` |
| Bosses of Mass Destruction [Forge \| NeoForge] | `mods/bosses-of-mass-destruction-forge.pw.toml` | `BOMD-Forge-1.20.1-1.1.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/bosses-of-mass-destruction-forge.pw.toml` |
| Bosses'Rise (Forge/NeoForge) | `mods/bossesrise.pw.toml` | `block_factorys_bosses-2.0.12-forge-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/bossesrise.pw.toml` |
| Botania | `mods/botania.pw.toml` | `Botania-1.20.1-451-FORGE.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/botania.pw.toml` |
| Controllable | `mods/controllable.pw.toml` | `controllable-forge-1.20.1-0.21.9.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/controllable.pw.toml` |
| Create: Magics | `mods/create-magics.pw.toml` | `create_magics-2.0.0-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/create-magics.pw.toml` |
| Create: Occult Engineering | `mods/create-occult-engineering.pw.toml` | `occultengineering-1.20.1-0.11.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/create-occult-engineering.pw.toml` |
| Create Railways Navigator | `mods/create-railways-navigator.pw.toml` | `createrailwaysnavigator-forge-1.20.1-alpha-0.9.0-C6+2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/create-railways-navigator.pw.toml` |
| Create: Steam 'n' Rails | `mods/create-steam-n-rails.pw.toml` | `Steam_Rails-1.7.2+forge-mc1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/create-steam-n-rails.pw.toml` |
| Create Vampirism | `mods/create-vampirism.pw.toml` | `create_vampirism-1.20.1_0.5.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/create-vampirism.pw.toml` |
| Deeper and Darker | `mods/deeperdarker.pw.toml` | `deeperdarker-forge-1.20.1-1.3.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/deeperdarker.pw.toml` |
| Distant Horizons: A Level of Detail mod | `mods/distant-horizons.pw.toml` | `DistantHorizons-2.4.5-b-1.20.1-fabric-forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/distant-horizons.pw.toml` |
| dtmalum-1.0.0 | `mods/dtmalum-1.0.0.jar` | `dtmalum-1.0.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/dtmalum-1.0.0.jar` |
| Dynamic Trees - Ars Nouveau | `mods/dynamic-trees-ars-nouveau.pw.toml` | `DynamicTreesArsNouveau-1.20.1-1.2.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/dynamic-trees-ars-nouveau.pw.toml` |
| Dynamic Trees for Nature's Spirit | `mods/dynamic-trees-for-natures-spirit.pw.toml` | `dtnatures_spirit-1.20.1-forge-1.3-all.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/dynamic-trees-for-natures-spirit.pw.toml` |
| Sodium/Embeddium Dynamic Lights | `mods/dynamiclights-reforged.pw.toml` | `sodiumdynamiclights-forge-1.0.10-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/dynamiclights-reforged.pw.toml` |
| Dynamic Trees Plus | `mods/dynamictreesplus.pw.toml` | `DynamicTreesPlus-1.20.1-1.2.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/dynamictreesplus.pw.toml` |
| Eidolon : Repraised | `mods/eidolon-repraised.pw.toml` | `eidolon_repraised-1.20.1-0.3.12.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/eidolon-repraised.pw.toml` |
| EMI Enchanting | `mods/emi-enchanting.pw.toml` | `emi_enchanting-0.1.2+1.20.1+forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/emi-enchanting.pw.toml` |
| EMI Loot | `mods/emi-loot.pw.toml` | `emi_loot-0.7.9+1.20.1+forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/emi-loot.pw.toml` |
| EMI Ores | `mods/emi-ores.pw.toml` | `emi_ores-1.2+1.20.1+forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/emi-ores.pw.toml` |
| EMI Trades (Villager Trading EMI Plugin) | `mods/emi-trades-villager-trading-emi-plugin.pw.toml` | `emitrades-forge-1.2.1+mc1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/emi-trades-villager-trading-emi-plugin.pw.toml` |
| EMI | `mods/emi.pw.toml` | `emi-1.1.22+1.20.1+forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/emi.pw.toml` |
| Enhanced AI | `mods/enhanced-ai.pw.toml` | `enhancedai-3.3.6.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/enhanced-ai.pw.toml` |
| Enigmatic Legacy | `mods/enigmatic-legacy.pw.toml` | `EnigmaticLegacy-2.30.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/enigmatic-legacy.pw.toml` |
| Fallout Wastelands | `mods/fallout-wastelands.pw.toml` | `Fallout Wasteland 1.20.1 Beta 3.8.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/fallout-wastelands.pw.toml` |
| Farsighted Mobs (Forge & NeoForge) | `mods/farsighted-mobs-forge.pw.toml` | `farsighted-mobs-forge-1.1-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/farsighted-mobs-forge.pw.toml` |
| Forbidden and Arcanus | `mods/forbidden-arcanus.pw.toml` | `forbidden_arcanus-1.20.1-2.2.6.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/forbidden-arcanus.pw.toml` |
| Goety - The Dark Arts | `mods/goety.pw.toml` | `goety-2.5.52.4.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/goety.pw.toml` |
| Golem Overhaul | `mods/golem-overhaul.pw.toml` | `golemoverhaul-forge-1.20.1-1.1.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/golem-overhaul.pw.toml` |
| Guard Villagers | `mods/guard-villagers.pw.toml` | `guardvillagers-1.20.1-1.6.17.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/guard-villagers.pw.toml` |
| Hexalia | `mods/hexalia.pw.toml` | `hexalia-1.3.1-1.20.1+forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/hexalia.pw.toml` |
| Hex Casting | `mods/hexcasting.pw.toml` | `hexcasting-forge-1.20.1-0.11.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/hexcasting.pw.toml` |
| Hexerei | `mods/hexerei.pw.toml` | `hexerei-0.4.2.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/hexerei.pw.toml` |
| Ice and Fire: Dragons | `mods/ice-and-fire-dragons.pw.toml` | `iceandfire-2.1.13-1.20.1-beta-5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ice-and-fire-dragons.pw.toml` |
| Incendium | `mods/incendium.pw.toml` | `Incendium_1.20.x_v5.3.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/incendium.pw.toml` |
| Iron's Lib | `mods/irons-lib.pw.toml` | `irons_lib-1.20.1-1.0.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/irons-lib.pw.toml` |
| Iron's Spells 'n Spellbooks | `mods/irons-spells-n-spellbooks.pw.toml` | `irons_spellbooks-1.20.1-3.15.6.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/irons-spells-n-spellbooks.pw.toml` |
| It Takes a Pillage | `mods/it-takes-a-pillage.pw.toml` | `takesapillage-1.0.3-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/it-takes-a-pillage.pw.toml` |
| Lava Clear View | `mods/lava-clear-view.pw.toml` | `LavaClearView-1.20.1-forge-7.0.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/lava-clear-view.pw.toml` |
| Little Logistics | `mods/little-logistics.pw.toml` | `littlelogistics-mc1.20.1-v1.20.1.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/little-logistics.pw.toml` |
| Lodestone | `mods/lodestone.pw.toml` | `lodestone-1.20.1-1.6.4.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/lodestone.pw.toml` |
| Malum | `mods/malum.pw.toml` | `malum-1.20.1-1.6.7.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/malum.pw.toml` |
| Mana and Artifice | `mods/mana-and-artifice.pw.toml` | `mna-forge-1.20.1-3.1.11-all.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/mana-and-artifice.pw.toml` |
| Mob AI Tweaks | `mods/mob-ai-tweaks.pw.toml` | `mob-ai-tweaks-1.11.1-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/mob-ai-tweaks.pw.toml` |
| Modonomicon | `mods/modonomicon.pw.toml` | `modonomicon-1.20.1-forge-1.79.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/modonomicon.pw.toml` |
| Nature's Aura | `mods/natures-aura.pw.toml` | `NaturesAura-39.4.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/natures-aura.pw.toml` |
| Nature's Spirit | `mods/natures-spirit.pw.toml` | `natures_spirit-2.2.5-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/natures-spirit.pw.toml` |
| Nullscape | `mods/nullscape.pw.toml` | `Nullscape_1.20.x_v1.2.8.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/nullscape.pw.toml` |
| Occultism | `mods/occultism.pw.toml` | `occultism-1.20.1-1.157.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/occultism.pw.toml` |
| Oculus | `mods/oculus.pw.toml` | `oculus-mc1.20.1-1.8.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/oculus.pw.toml` |
| Particular ✨ Reforged | `mods/particular-reforged.pw.toml` | `particular-1.20.1-Forge-1.2.7.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/particular-reforged.pw.toml` |
| PAUCAL | `mods/paucal.pw.toml` | `paucal-0.6.0+1.20.1-forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/paucal.pw.toml` |
| Presence Footsteps (Forge) | `mods/presence-footsteps-forge.pw.toml` | `PresenceFootsteps-1.20.1-1.9.1-beta.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/presence-footsteps-forge.pw.toml` |
| Psi | `mods/psi.pw.toml` | `Psi-1.20.1-102.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/psi.pw.toml` |
| Realistic Block Physics | `mods/realistic-block-physics.pw.toml` | `rbp-1.20.1-1.0.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/realistic-block-physics.pw.toml` |
| Realistic Physics | `mods/realistic-physics.pw.toml` | `realisticphysics-1.20.1-1.0.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/realistic-physics.pw.toml` |
| Relics | `mods/relics-mod.pw.toml` | `relics-1.20.1-0.8.0.13.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/relics-mod.pw.toml` |
| Reliquary Reincarnations | `mods/reliquary-reincarnations.pw.toml` | `reliquary-1.20.1-2.0.56.1418.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/reliquary-reincarnations.pw.toml` |
| Ribbits | `mods/ribbits.pw.toml` | `Ribbits-1.20.1-Forge-3.0.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ribbits.pw.toml` |
| Roots Classic | `mods/roots-classic.pw.toml` | `RootsClassic-1.20.1-1.4.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/roots-classic.pw.toml` |
| Savage & Ravage | `mods/savage-and-ravage.pw.toml` | `savage_and_ravage-1.20.1-6.0.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/savage-and-ravage.pw.toml` |
| Shoulder Surfing Reloaded | `mods/shoulder-surfing-reloaded.pw.toml` | `ShoulderSurfing-Forge-1.20.1-4.22.7.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/shoulder-surfing-reloaded.pw.toml` |
| Sound Physics Remastered | `mods/sound-physics-remastered.pw.toml` | `sound-physics-remastered-forge-1.20.1-1.5.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/sound-physics-remastered.pw.toml` |
| Tinkers Integrations and Tweaks | `mods/tcintegrations.pw.toml` | `TCIntegrations-1.20.1-2.0.25.19.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tcintegrations.pw.toml` |
| TCompat [Tinker's Construct Addon] | `mods/tcompat-tinkers-construct-addon.pw.toml` | `TCompat-1.20.1-1.2.4.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tcompat-tinkers-construct-addon.pw.toml` |
| The Bumblezone (NeoForge/Forge) | `mods/the-bumblezone-forge.pw.toml` | `the_bumblezone-7.11.2+1.20.1-forge.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/the-bumblezone-forge.pw.toml` |
| The Finley Dimension Remastered | `mods/the-finley-mod-remastered.pw.toml` | `the_finley_dimension_remastered-1.6.3-forge-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/the-finley-mod-remastered.pw.toml` |
| The Lost Cities | `mods/the-lost-cities.pw.toml` | `lostcities-1.20-7.4.11.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/the-lost-cities.pw.toml` |
| The Twilight Forest | `mods/the-twilight-forest.pw.toml` | `twilightforest-1.20.1-4.3.2508-universal.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/the-twilight-forest.pw.toml` |
| The Undergarden | `mods/the-undergarden.pw.toml` | `The_Undergarden-1.20.1-0.8.14.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/the-undergarden.pw.toml` |
| Theurgy | `mods/theurgy.pw.toml` | `theurgy-1.20.1-1.28.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/theurgy.pw.toml` |
| TiCEX - Tinkers Construct EX | `mods/ticex-tinkers-construct-ex.pw.toml` | `ticex-mc1.20.1-0.5.1-all.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/ticex-tinkers-construct-ex.pw.toml` |
| Tinker and Better Combat | `mods/tinker-and-better-combat.pw.toml` | `TinkerBetterCombat 0.14.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinker-and-better-combat.pw.toml` |
| Tinkers' Advanced-Core | `mods/tinkers-advanced-core.pw.toml` | `tinkers_advanced_core-3.0.0-beta.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-advanced-core.pw.toml` |
| Tinkers' Advanced-Materials | `mods/tinkers-advanced-materials.pw.toml` | `tinkers_advanced_materials-3.0.0-beta.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-advanced-materials.pw.toml` |
| Tinkers' Advanced-Tools | `mods/tinkers-advanced-tools.pw.toml` | `tinkers_advanced_tools-3.0.0-beta.4.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-advanced-tools.pw.toml` |
| Tinkers' Battle Spades | `mods/tinkers-battle-spades.pw.toml` | `TinkersBattleSpades-1.20.1-1.2.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-battle-spades.pw.toml` |
| Tinkers' Construct: Additional Weaponry | `mods/tinkers-construct-additional-weaponry.pw.toml` | `Additional-Weaponry-1.20.1-1.1.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-construct-additional-weaponry.pw.toml` |
| Tinkers' Innovation | `mods/tinkers-innovation.pw.toml` | `tinkersinnovation-1.20.1-3.0.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-innovation.pw.toml` |
| Tinkers' Jewelry | `mods/tinkers-jewelry.pw.toml` | `tinkersjewelry-1.2.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-jewelry.pw.toml` |
| Tinkers' Katanas | `mods/tinkers-katanas.pw.toml` | `TinkersKatanas-1.20.1-1.4.4.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-katanas.pw.toml` |
| Tinker's Khopesh | `mods/tinkers-khopesh.pw.toml` | `tinkers_khopesh-1.0.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-khopesh.pw.toml` |
| Tinkers' Levelling Addon | `mods/tinkers-levelling-addon.pw.toml` | `TinkersLevellingAddon-1.20.1-1.4.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-levelling-addon.pw.toml` |
| Tinkers' JSON Things | `mods/tinkers-things-json.pw.toml` | `Tinker-Things-1.20.1-1.3.3.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-things-json.pw.toml` |
| Tinkers' Thinking | `mods/tinkers-thinking.pw.toml` | `Tinkers-Thinking-0.1.6.6.2.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-thinking.pw.toml` |
| Tinkers Tool Leveling 2 | `mods/tinkers-tool-leveling-2.pw.toml` | `tleveling-1.0.3-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-tool-leveling-2.pw.toml` |
| Tinkers' Wands | `mods/tinkers-wands.pw.toml` | `TinkersWands-1.20.1-1.1.0.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-wands.pw.toml` |
| Tinkers' Weaponry | `mods/tinkers-weaponry.pw.toml` | `tinkersweaponry-1.20.1-0.0.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tinkers-weaponry.pw.toml` |
| Tome of Blood: Rebirth | `mods/tome-of-blood-rebirth.pw.toml` | `tomeofblood-1.20.1-0.4.5.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/tome-of-blood-rebirth.pw.toml` |
| Undergarden Delight (A Farmer's Delight Add-on) | `mods/undergarden-delight.pw.toml` | `undergardendelight-1.1.2-forge-1.20.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/undergarden-delight.pw.toml` |
| Vampirism - Become a vampire! | `mods/vampirism-become-a-vampire.pw.toml` | `Vampirism-1.20.1-1.10.15.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/vampirism-become-a-vampire.pw.toml` |
| Zombie Awareness | `mods/zombie-awareness.pw.toml` | `zombieawareness-1.20.1-1.13.1.jar` | `/home/gerald/obelisks-disabled-8gb-profile/20260430-074616/mods/zombie-awareness.pw.toml` |

## Instance-Only Or Already Removed

These jars were part of the successful Prism A/B cut, but no matching active `mods/*.pw.toml` or bundled repo jar existed at cut time. They were stale in the disposable instance or had already been removed from the repo in earlier cleanup.

- `BetterGrassify-1.4.4+forge.1.20.1.jar`
- `DynamicTreesQuark-1.20.1-2.5.3.jar`
- `Excessive Building 1.20.1-1.20.1-3.0.1.jar`
- `FramedBlocks-9.4.3.jar`
- `Quark-4.0-462.jar`
- `Twigs-1.20.1-3.1.0.jar`
- `Zeta-1.0-31.jar`
- `absentbydesign-1.20.1-1.9.0.jar`
- `amendments-1.20-2.2.5.jar`
- `another_furniture-forge-1.20.1-3.0.4.jar`
- `beautify-2.0.2.jar`
- `buildersaddition-1.20.1-20230928a.jar`
- `bushierflowers-0.0.3-1.20.1.jar`
- `chipped-forge-1.20.1-3.0.7.jar`
- `createdeco-2.0.3-1.20.1-forge.jar`
- `everythingcopper-1.20.1-2.3.4.jar`
- `handcrafted-forge-1.20.1-3.0.6.jar`
- `immersive_weathering-1.20.1-2.0.5-forge.jar`
- `mcw-bridges-3.1.2-mc1.20.1forge.jar`
- `mcw-doors-1.1.5-mc1.20.1forge.jar`
- `mcw-furniture-3.4.1-mc1.20.1forge.jar`
- `mcw-holidays-1.1.2-mc1.20.1forge.jar`
- `mcw-lights-1.1.5-mc1.20.1forge.jar`
- `mcw-mcwfences-1.2.1-mc1.20.1forge.jar`
- `mcw-mcwpaths-1.1.1-mc1.20.1forge.jar`
- `mcw-mcwstairs-1.0.2-mc1.20.1forge.jar`
- `mcw-mcwwindows-2.4.2-mc1.20.1forge.jar`
- `mcw-paintings-1.1.0-mc1.20.1forge.jar`
- `mcw-roofs-2.3.2-mc1.20.1forge.jar`
- `mcw-trapdoors-1.1.5-mc1.20.1forge.jar`
- `plonk-1.20.1-10.0.5-forge.jar`
- `supplementaries-1.20-3.1.42-forge.jar`

## Full Measured Disabled Jar Set

- `create_vampirism-1.20.1_0.5.0.jar`
- `rbp-1.20.1-1.0.0.jar`
- `create_magics-2.0.0-1.20.1.jar`
- `art_update-1.0.0-forge-1.20.1.jar`
- `LavaClearView-1.20.1-forge-7.0.0.jar`
- `takesapillage-1.0.3-1.20.1.jar`
- `zombieawareness-1.20.1-1.13.1.jar`
- `paucal-0.6.0+1.20.1-forge.jar`
- `lodestone-1.20.1-1.6.4.1.jar`
- `the_finley_dimension_remastered-1.6.3-forge-1.20.1.jar`
- `particular-1.20.1-Forge-1.2.7.jar`
- `controllable-forge-1.20.1-0.21.9.jar`
- `the_bumblezone-7.11.2+1.20.1-forge.jar`
- `DynamicTreesPlus-1.20.1-1.2.2.jar`
- `TCompat-1.20.1-1.2.4.jar`
- `Tinker-Things-1.20.1-1.3.3.jar`
- `TCIntegrations-1.20.1-2.0.25.19.jar`
- `TinkerBetterCombat 0.14.jar`
- `Steam_Rails-1.7.2+forge-mc1.20.1.jar`
- `createrailwaysnavigator-forge-1.20.1-alpha-0.9.0-C6+2.jar`
- `tleveling-1.0.3-1.20.1.jar`
- `Additional-Weaponry-1.20.1-1.1.3.jar`
- `farsighted-mobs-forge-1.1-1.20.1.jar`
- `littlelogistics-mc1.20.1-v1.20.1.2.jar`
- `BOMD-Forge-1.20.1-1.1.2.jar`
- `iceandfire-2.1.13-1.20.1-beta-5.jar`
- `ApothicAttributes-1.20.1-1.3.7.jar`
- `EnigmaticLegacy-2.30.1.jar`
- `alexsmobs-1.22.9.jar`
- `alekiNiftyShips-FORGE-1.20.1-1.0.14.jar`
- `ApotheoticAdditionsV2.2.2.jar`
- `Apotheosis-1.20.1-7.4.8.jar`
- `base_raid-0.5.jar`
- `savage_and_ravage-1.20.1-6.0.1.jar`
- `bettercombat-forge-1.9.0+1.20.1.jar`
- `Ribbits-1.20.1-Forge-3.0.5.jar`
- `golemoverhaul-forge-1.20.1-1.1.0.jar`
- `guardvillagers-1.20.1-1.6.17.jar`
- `enhancedai-3.3.6.3.jar`
- `relics-1.20.1-0.8.0.13.jar`
- `block_factorys_bosses-2.0.12-forge-1.20.1.jar`
- `mob-ai-tweaks-1.11.1-1.20.1.jar`
- `artifacts-forge-9.5.19.jar`
- `born_in_chaos_[Forge]1.20.1_1.7.5.jar`
- `Vampirism-1.20.1-1.10.15.jar`
- `ShoulderSurfing-Forge-1.20.1-4.22.7.jar`
- `modonomicon-1.20.1-forge-1.79.3.jar`
- `PresenceFootsteps-1.20.1-1.9.1-beta.1.jar`
- `oculus-mc1.20.1-1.8.0.jar`
- `realisticphysics-1.20.1-1.0.1.jar`
- `sodiumdynamiclights-forge-1.0.10-1.20.1.jar`
- `sound-physics-remastered-forge-1.20.1-1.5.1.jar`
- `AmbientSounds_FORGE_v6.3.4_mc1.20.1.jar`
- `natures_spirit-2.2.5-1.20.1.jar`
- `DistantHorizons-2.4.5-b-1.20.1-fabric-forge.jar`
- `emi-1.1.22+1.20.1+forge.jar`
- `emitrades-forge-1.2.1+mc1.20.1.jar`
- `emi_enchanting-0.1.2+1.20.1+forge.jar`
- `emi_ores-1.2+1.20.1+forge.jar`
- `emi_loot-0.7.9+1.20.1+forge.jar`
- `dtnatures_spirit-1.20.1-forge-1.3-all.jar`
- `blue_skies-1.20.1-1.3.31.jar`
- `The_Undergarden-1.20.1-0.8.14.jar`
- `Incendium_1.20.x_v5.3.5.jar`
- `twilightforest-1.20.1-4.3.2508-universal.jar`
- `Nullscape_1.20.x_v1.2.8.jar`
- `deeperdarker-forge-1.20.1-1.3.3.jar`
- `undergardendelight-1.1.2-forge-1.20.1.jar`
- `aether-1.20.1-1.5.2-neoforge.jar`
- `Fallout Wasteland 1.20.1 Beta 3.8.1.jar`
- `lostcities-1.20-7.4.11.jar`
- `NaturesAura-39.4.jar`
- `forbidden_arcanus-1.20.1-2.2.6.jar`
- `Psi-1.20.1-102.jar`
- `ars_nouveau-1.20.1-4.12.7-all.jar`
- `hexcasting-forge-1.20.1-0.11.3.jar`
- `hexalia-1.3.1-1.20.1+forge.jar`
- `hexerei-0.4.2.3.jar`
- `ars_instrumentum-1.20.1-4.1.0.jar`
- `ars_caelum-1.20.1-2.0.1.jar`
- `arseng-1.2.0.jar`
- `ars_additions-1.20.1-1.6.7.jar`
- `ars_scalaes-1.20.1-1.10.7c.jar`
- `RootsClassic-1.20.1-1.4.2.jar`
- `ars_creo-1.20.1-4.3.0.jar`
- `ars_technica-1.20.1-1.4.2.jar`
- `malum-1.20.1-1.6.7.jar`
- `mna-forge-1.20.1-3.1.11-all.jar`
- `occultengineering-1.20.1-0.11.3.jar`
- `occultism-1.20.1-1.157.0.jar`
- `tomeofblood-1.20.1-0.4.5.jar`
- `Botania-1.20.1-451-FORGE.jar`
- `eidolon_repraised-1.20.1-0.3.12.jar`
- `ars_elemental-1.20.1-0.6.7.9.jar`
- `theurgy-1.20.1-1.28.0.jar`
- `irons_lib-1.20.1-1.0.2.jar`
- `irons_spellbooks-1.20.1-3.15.6.jar`
- `reliquary-1.20.1-2.0.56.1418.jar`
- `goety-2.5.52.4.jar`
- `DynamicTreesArsNouveau-1.20.1-1.2.0.jar`
- `dtmalum-1.0.0.jar`
- `tinkers_khopesh-1.0.0.jar`
- `tinkersjewelry-1.2.0.jar`
- `TinkersLevellingAddon-1.20.1-1.4.3.jar`
- `tinkersinnovation-1.20.1-3.0.0.jar`
- `tinkers_advanced_core-3.0.0-beta.5.jar`
- `tinkers_advanced_materials-3.0.0-beta.3.jar`
- `TinkersWands-1.20.1-1.1.0.jar`
- `tinkers_advanced_tools-3.0.0-beta.4.jar`
- `TinkersBattleSpades-1.20.1-1.2.1.jar`
- `Tinkers-Thinking-0.1.6.6.2.jar`
- `tinkersweaponry-1.20.1-0.0.5.jar`
- `TinkersKatanas-1.20.1-1.4.4.jar`
- `ticex-mc1.20.1-0.5.1-all.jar`
- `bushierflowers-0.0.3-1.20.1.jar`
- `everythingcopper-1.20.1-2.3.4.jar`
- `plonk-1.20.1-10.0.5-forge.jar`
- `DynamicTreesQuark-1.20.1-2.5.3.jar`
- `immersive_weathering-1.20.1-2.0.5-forge.jar`
- `BetterGrassify-1.4.4+forge.1.20.1.jar`
- `createdeco-2.0.3-1.20.1-forge.jar`
- `Quark-4.0-462.jar`
- `Zeta-1.0-31.jar`
- `supplementaries-1.20-3.1.42-forge.jar`
- `beautify-2.0.2.jar`
- `buildersaddition-1.20.1-20230928a.jar`
- `Twigs-1.20.1-3.1.0.jar`
- `handcrafted-forge-1.20.1-3.0.6.jar`
- `Excessive Building 1.20.1-1.20.1-3.0.1.jar`
- `absentbydesign-1.20.1-1.9.0.jar`
- `mcw-roofs-2.3.2-mc1.20.1forge.jar`
- `mcw-mcwpaths-1.1.1-mc1.20.1forge.jar`
- `another_furniture-forge-1.20.1-3.0.4.jar`
- `mcw-furniture-3.4.1-mc1.20.1forge.jar`
- `mcw-trapdoors-1.1.5-mc1.20.1forge.jar`
- `mcw-lights-1.1.5-mc1.20.1forge.jar`
- `mcw-mcwfences-1.2.1-mc1.20.1forge.jar`
- `mcw-mcwwindows-2.4.2-mc1.20.1forge.jar`
- `mcw-holidays-1.1.2-mc1.20.1forge.jar`
- `FramedBlocks-9.4.3.jar`
- `mcw-mcwstairs-1.0.2-mc1.20.1forge.jar`
- `amendments-1.20-2.2.5.jar`
- `mcw-bridges-3.1.2-mc1.20.1forge.jar`
- `mcw-doors-1.1.5-mc1.20.1forge.jar`
- `mcw-paintings-1.1.0-mc1.20.1forge.jar`
- `chipped-forge-1.20.1-3.0.7.jar`

## Dominant Remaining Memory Signature

- Remaining memory is dominated by client model/texture/resource surface.
- The successful diagnostic run created a `32768x16384x4` block atlas, about 2 GiB raw RGBA before driver/cache overhead.
- Top heap classes after GC were `[B`, `[I`, `BakedQuad`, `NativeImage`, `TextureAtlasSprite`, `SpriteContents`, and `ModelResourceLocation`.

