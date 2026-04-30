# Memory Target Findings

Generated during the 2026-04-30 RAM target investigation against the disposable Prism instance:

`/home/gerald/.local/share/PrismLauncher/instances/Bound to Matter-Playtest 3 - v1/minecraft`

All successful profiles reached world entry. RSS is process resident memory, not just Java heap. Measurements are from `tools/profile_prism_variant.sh` with `MALLOC_ARENA_MAX=2` and process-level THP disabled via `tools/disable_thp_exec.py` where noted.

## What It Took To Approach 10 GiB

A true `<10 GiB` peak RSS world-entry profile was not achieved for any useful pack shape.

The closest successful profile was:

| Profile | Xmx | Mods Loaded | Peak RSS | Post-GC Java RSS | Load-to-world | Result |
|---|---:|---:|---:|---:|---:|---|
| `jvm_xmx3g_extreme_cut_envelope` | 3G | 325 | 11.01 GiB | 9.93 GiB | 61.2s | successful world entry |

That profile removed all of these broad groups:

- Decorative/high-model block libraries already moved out of repo: Chipped, Macaw modules, Handcrafted, FramedBlocks, Quark/Supplementaries, etc.
- Adventure/dimension branches: Blue Skies, Twilight Forest, Undergarden, Lost Cities, Deeper Darker, Aether, Fallout Wasteland, Incendium, Nullscape.
- Heavy magic branches: Ars stack, Botania, Goety, MNA, Malum, Hexerei, Occultism, Theurgy, Iron's Spells, Nature's Aura, Forbidden & Arcanus, Hex Casting, Psi, etc.
- TCon add-ons, but not necessarily the whole Forge/library stack.
- Steam n Rails and Railways Navigator.
- Nature's Spirit and Dynamic Trees integrations.
- EMI core/addons.
- Distant Horizons, Oculus, sound/physics/client-effect mods.

A lower `Xmx=2G` extreme run had transient RSS around 8.3 GiB, but it did not reach world entry after more than 10 minutes and was terminated. It is not a valid playable result.

Conclusion: the 10 GiB target was only approached by removing most pack identity and dropping heap to 3G. It still missed strict peak RSS by about 1 GiB.

## What It Took To Reach 6 GiB

A `<6 GiB` target is achievable only as a deliberately smaller/lite profile, not as the full pack.

Successful profiles:

| Profile | Xmx | Mods Loaded | Peak RSS | Post-GC Java RSS | Load-to-world | Notes |
|---|---:|---:|---:|---:|---:|---|
| `jvm_xmx2g_ultra_cut_envelope2` | 2G | 196 | 3.37 GiB | 3.16 GiB | 26.2s | lower-bound proof; most content removed |
| `jvm_xmx2g_lite_core_tech2` | 2G | 231 | 3.67 GiB | 3.47 GiB | 36.1s | core tech envelope: Create/TCon/chemistry/power-style stack |
| `jvm_xmx2g_lite_core_tech_pack_systems` | 2G | 241 | 3.61 GiB | 3.53 GiB | 36.3s | adds pack systems: quests/coins/obelisks/rpgstats/realistic ores/class selector/KubeJS Create |
| `jvm_xmx2g_lite_tech_survival` | 2G | 262 | 4.71 GiB | 4.29 GiB | 43.0s | adds food/body/survival systems |
| `jvm_xmx2g_lite_tech_survival_blood2` | 2G | 265 | 4.86 GiB | 4.40 GiB | 44.3s | adds Blood Magic + Patchouli |
| `jvm_xmx2g_lite_tech_survival_blood_ae2` | 2G | 276 | 4.90 GiB | 4.50 GiB | 51.0s | adds AE2 stack, still under target |
| `jvm_xmx3g_lite_tech_survival_blood_ae2_oc` | 3G | 280 | 5.62 GiB | 5.54 GiB | 45.1s | adds OC2R/computerbridge/manual; needs 3G heap |

Borderline / over-target profiles:

| Profile | Xmx | Mods Loaded | Peak RSS | Result |
|---|---:|---:|---:|---|
| `jvm_xmx2g_lite_tech_survival_blood_ae2_oc` | 2G | 280 | 4.28 GiB before failure | OOM during spawn; heap too low |
| `jvm_xmx3g_lite_tech_survival_blood_ae2_oc_rails` | 3G | 282 | 6.00 GiB | boundary, not a safe pass |
| `jvm_xmx3g_lite_tech_survival_blood_ae2_oc_steam_only` | 3G | 281 | 6.05 GiB | over target even without Railways Navigator |

## 6 GiB Profile Interpretation

A practical 6 GiB-class profile can keep:

- core TCon
- core Create and selected tech/power/synthesis systems
- chemistry/fission/heat/coolant custom mods and their Alchemistry/ChemLib dependencies
- pack systems: quests, coins, obelisks, RPGStats, class selector, Realistic Ores, KubeJS Create
- food/body/survival systems
- Blood Magic + Patchouli
- AE2 and major AE2 add-ons
- OC2R/computerbridge/manual if heap is raised to 3G

A practical 6 GiB-class profile cannot also keep, without more cuts elsewhere:

- Steam n Rails, even without Railways Navigator, if OC2R + AE2 + survival + Blood Magic are already present
- adventure dimension branches
- broad magic branches beyond Blood Magic
- heavy mob/combat ecosystem
- decorative block libraries
- EMI core/addons
- Distant Horizons / Oculus / client effects
- TCon expansion/add-on suite

## Current Recommendation

For the full expert pack, keep the existing full-pack target around 16 GiB RSS after deco removals.

For a real 6 GiB target, define a separate lite profile. The best tested candidate is:

`jvm_xmx3g_lite_tech_survival_blood_ae2_oc`

It keeps a coherent expert-pack skeleton and lands at 5.62 GiB peak RSS. It excludes trains and most adventure/magic breadth. Trains can be reintroduced only if another meaningful group is removed or the target is relaxed above 6 GiB.

## Combined Worthy-Cut A/B - 2026-04-30

Tested a combined cut of the high-value content groups from the RAM triage against the disposable Prism instance:

- decorative libraries still present in the instance
- non-core TCon add-ons
- Nature's Spirit and Dynamic Trees integrations
- adventure dimensions
- broad side-magic outside Blood Magic
- Steam n Rails / Little Logistics / Nifty Ships
- EMI core and add-ons
- heavy mob/combat ecosystem
- Distant Horizons / Oculus / client visual/audio/physics effects

Results:

| Variant | Xmx | Disabled Jars | Loaded Mods | Result | Peak RSS |
|---|---:|---:|---:|---|---:|
| `jvm_xmx6g_all_worthy_content_cuts` | 6G | 147 | n/a | invalid, mod dependency crash | 2.42 GiB |
| `jvm_xmx6g_all_worthy_content_cuts_v2` | 6G | 150 | 282 | invalid world load, existing `New World` incompatible: `Overworld settings missing` | 7.73 GiB |
| `jvm_xmx6g_all_worthy_content_cuts_v3_freshworld` | 6G | 150 | 282 | reached loaded client/menu; Prism `--world` did not create absent fresh save | 9.37 GiB |

Dependency fixes added between v1 and v2:

- `rbp` must be cut with `realisticphysics`.
- `create_magics` must be cut with `mna`.
- `create_vampirism` must be cut with `vampirism`.

Interpretation:

- The combined cut is enough to get menu-load under 10 GiB RSS with a 6G heap, at 282 loaded mods.
- This is not yet a valid world-entry result because the only existing save was generated with removed dimension/worldgen content, and Prism's `--world` option opens existing saves but did not create a missing test save.
- A true world-entry measurement needs either a pre-created compatible stripped-profile save or a profiler path that automates first-world creation from the UI.

## Reduced Menu Diagnostic Dominance Dump - 2026-04-30

Ran a dedicated menu diagnostics pass for the combined worthy-cut profile after the earlier world-entry limitation.

Result:

- Variant directory: `docs/memory_variants/jvm_xmx6g_all_worthy_content_cuts_menu_diag/`
- Xmx: 6G
- Temporarily disabled jars: 146
- Loaded client/menu peak RSS: 7.56 GiB
- Post-GC RSS: 7.62 GiB from `smaps_rollup`
- JVM heap after forced GC: 1.48 GiB used, 3.04 GiB committed
- NMT committed: 3.67 GiB
- Anonymous RSS: ~7.40 GiB
- Transparent huge pages: 0 KiB

Dominant remaining memory signature:

- The loaded client created a `32768x16384x4` block atlas. Raw RGBA size is roughly 2 GiB before driver/cache overhead.
- Top heap classes after GC are model/resource dominated:
  - `[B`: 504 MiB
  - `[I`: 164 MiB
  - `BakedQuad`: 1,743,318 instances / 79.8 MiB
  - `NativeImage`: 597,020 instances / 27.3 MiB object shell, excluding native/image payload implications
  - `SpriteContents` and `TextureAtlasSprite`: 118,390 each
  - `ModelResourceLocation`: 416,129 instances
- The remaining gap is mostly anonymous memory outside cleanly attributed HotSpot categories, consistent with client resource/model/texture/native/render caches rather than one obvious Java heap collection.

Interpretation:

- The combined cut can get menu-load below 8 GiB RSS.
- Further room for adding essential cut content must come primarily from reducing model/texture/block/item surface, not from minor JVM flags.
- The next likely cuts to test are remaining model-heavy systems: AE2 add-on breadth, Create add-on breadth, food block/item breadth, Sophisticated Storage/Backpacks breadth, remaining worldgen/terrain stack, and Dynamic Trees core if acceptable.

## Requested Re-Enable Profile - 2026-04-30

After the 8 GiB cut, re-enabled the requested subset plus required dependencies: Zeta, Tinkers' Advanced Core, Modonomicon, Lodestone, and Nature's Spirit.

- Variant: `jvm_xmx6g_requested_reenable_profile_menu`
- State: loaded client/menu
- Loaded mods: 348
- Peak RSS after corrected settle sampling: 12.58 GiB
- Result: not viable for `<8 GiB`; over target by about 4.6 GiB
- Detailed report: `docs/requested_reenable_memory_profile.md`

## Empirical Repo Cut: Abyss II + Thalassophobia

Date: 2026-04-30

After empirical A/B testing, `The Abyss II` and `Thalassophobia` were moved out of the active repo mod set and Packwiz was refreshed.

Result:

- Variant: `empirical_repo_cut_abyss_thalassophobia`
- Peak RSS: `9.84 GiB` / `10080 MiB`
- Loaded mods: `346`
- Block atlas: `16384x16384x4`
- Stored disabled metadata: `/home/gerald/obelisks-disabled-empirical-cuts/20260430-093059/mods/`

Interpretation: this gets the current requested-content profile back under the practical `<10 GiB` target at loaded menu, but not under `<8 GiB`. The largest confirmed win was removing `The Abyss II`, which consistently reduced the block atlas from `32768x16384x4` to `16384x16384x4`.

## Fresh World Profiling Attempt After Abyss/Thalassophobia Cut

Date: 2026-04-30

Attempted to produce a valid world-entry profile after removing `The Abyss II` and `Thalassophobia`.

Results:

- Menu/current-repo profile remains valid at `9.84 GiB` peak RSS.
- GUI automation for creating a client world was blocked: X11 synthetic input moved the pointer but Minecraft did not accept click/key events in this session.
- A temporary Forge dedicated server was installed at `/tmp/btm_forge_server` and successfully generated a save after excluding server-incompatible client/dev mods from the temporary server sandbox.
- The repo-active client rejected that server-generated save with `Overworld settings missing`, so it is not a valid client world-entry profile source.
- A repo-active client attempt against that save loaded `346` mods and peaked at `10.21 GiB`, but exited before world entry. Treat this as failed pre-world data, not a playable world measurement.

Conclusion: current evidence supports `<10 GiB` menu/load pressure, but world-entry RSS is still unproven. A valid world-entry profile still needs a client-created fresh save or a fixed server-generated save compatible with the full client datapack/dimension set.

## Valid Client-Created World Entry After Repo/Instance Sync

Date: 2026-04-30

This supersedes the previous "world-entry unproven" note for the current repo-active profile.

Fixes required before world entry succeeded:

- Disabled 88 stale live-instance jars that were no longer present in the repo-active Packwiz set.
- Removed/disabled `Create Track Map` after it crashed integrated-server startup with a Ktor/coroutines ABI mismatch.
- Refreshed Packwiz after moving `mods/create-track-map.pw.toml` out of the active mod set.
- Disabled the stale `create-track-map-1.4+mc1.20.1-neoforge.jar` in the live Prism instance, bringing total manually-disabled stale/live jars to 89.

Results:

| Measurement | Value |
|---|---:|
| Loaded mods | 345 |
| Fresh client-created world entry | yes |
| Main menu to in-game | 108.5s |
| Total launch/open-world time | 148.9s |
| Spawn preparation time | 82.5s |
| Short in-world RSS sample peak | 12.33 GiB |
| Short in-world RSS sample final/live | 12.29 GiB |
| EMI recipes baked | 96,644 |
| EMI reload time | 10.0s |
| Patchouli JSONs preloaded | 911 |
| Create injected recipes | 832 |
| Tick-behind warnings after join | 2 |
| Max tick-behind warning | 8,973ms / 179 ticks |
| SettlementRoads network rebuild log count | 33 |

Artifacts:

- Metrics JSON: `docs/memory_variants/current_repo_world_entry_after_ctm_cut/metrics.json`
- RSS profile: `docs/memory_variants/current_repo_world_entry_after_ctm_cut/rss_profile.jsonl`
- Latest one-shot metrics: `docs/current_world_entry_metrics.json`
- Create Track Map disabled metadata: `/home/gerald/obelisks-disabled-empirical-cuts/20260430-104118-create-track-map/mods/`
- Stale live-instance disabled jar manifest: `/tmp/btm_manual_disabled_stale_jars.txt`

Interpretation:

- The current repo-active profile can now generate and enter a fresh client world.
- The practical current-world target is not `<8 GiB`; observed live RSS is about `12.3 GiB` in a fresh world.
- The largest remaining obvious runtime issue in this log is repeated `SettlementRoads` world-network rebuilding during initial play. This is a custom-mod performance target, not a generic JVM-flag problem.
- Distant Horizons block-color warnings were observed, but the current config has distant generation disabled and the warnings were non-fatal.
