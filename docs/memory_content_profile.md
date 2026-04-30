# Memory Content Profile

Generated during the RAM pressure investigation on 2026-04-30.

## Current State

The active repo has had the pure decorative/high-model block libraries moved out of the Packwiz mod list. They were not deleted; they are held at:

`/home/gerald/obelisks-disabled-deco-mods/20260430-000803/`

`packwiz refresh` has been run after the removals.

## What RSS Said

RSS is the process-resident RAM, not just Java heap. The JVM heap can be under 8 GiB while the process still occupies ~20 GiB because model/resource/native allocations and transparent huge pages stay resident.

Best measured stable pre-removal runtime variant:

| Variant | Mods | Xmx | Peak RSS | Post-GC Java RSS | Load-to-world | TPS proxy |
|---|---:|---:|---:|---:|---:|---:|
| baseline/free-wins | 430 | 16G | 23.83 GiB | 24.22 GiB | 130.8s | OK |
| no first deco batch | 408 | 16G | 21.15 GiB | n/a | 112.7s | OK |
| no first deco batch | 408 | 8G | 19.92 GiB | 19.04 GiB | 118.8s | OK |
| no first deco batch + `MALLOC_ARENA_MAX=2` | 408 | 8G | 19.68 GiB | 18.54 GiB | 115.8s | OK |
| no first deco batch + no-THP JVM flag | 408 | 8G | 19.64 GiB | 18.54 GiB | 112.3s | OK |
| ZGC soft cap | 408 | 10G | 41.09 GiB | 41.23 GiB | 245.6s | Bad |

The no-THP JVM flag did not help because host transparent huge pages are configured as `always`; `AnonHugePages` remained ~16.1 GiB in smaps.

## Heap Class Buckets

Measured from `jcmd GC.class_histogram`.

| Bucket | Baseline MiB | No-deco MiB | Delta |
|---|---:|---:|---:|
| arrays | 2752.2 | 2279.5 | -472.7 |
| collections/maps | 1191.9 | 943.3 | -248.6 |
| other Java objects | 862.0 | 716.5 | -145.5 |
| Minecraft model/render | 745.3 | 498.9 | -246.4 |
| Minecraft block/item/recipe | 406.3 | 298.8 | -107.5 |
| EMI/JEI | 300.9 | 150.8 | -150.1 |
| Gson JSON | 127.8 | 68.9 | -58.9 |
| Geckolib/Citadel models | 116.3 | 116.3 | ~0 |

Interpretation: decorative block libraries amplify several buckets at once: baked models/quads, block/item registries, JSON/resource data, EMI stacks, and backing arrays/maps.

## Largest Static Content Surfaces Seen Before Removal

From jar asset/data inventory of the live instance before removals. Score is a rough model pressure score weighted toward blockstates/models/textures.

| Jar | Score | Blockstates | Block models | Item models | Textures | Recipes | Action |
|---|---:|---:|---:|---:|---:|---:|---|
| `chipped-forge-1.20.1-3.0.7.jar` | 129676 | 6981 | 9839 | 6987 | 12300 | 14 | moved out |
| `Steam_Rails-1.7.2+forge-mc1.20.1.jar` | 70016 | 1438 | 8968 | 1911 | 4217 | 2856 | kept, progression/logistics |
| `handcrafted-forge-1.20.1-3.0.6.jar` | 65319 | 267 | 12109 | 285 | 1009 | 317 | moved out |
| `Excessive Building` | 27791 | 1389 | 2494 | 1338 | 817 | 1256 | moved out |
| `Quark-4.0-462.jar` | 18625 | 809 | 1469 | 1000 | 972 | 1602 | moved out |
| `mcw-furniture` | 18251 | 652 | 2337 | 654 | 20 | 654 | moved out |
| `mcw-roofs` | 16500 | 605 | 2076 | 607 | 32 | 607 | moved out |
| `absentbydesign` | 12412 | 460 | 1464 | 478 | 0 | 916 | moved out |
| `supplementaries` | 11765 | 234 | 1415 | 287 | 1096 | 306 | moved out |
| `another_furniture` | 11532 | 177 | 1451 | 178 | 1223 | 239 | moved out |
| `mcw-windows` | 11380 | 328 | 1561 | 326 | 164 | 317 | moved out |
| `createdeco` | 11377 | 397 | 973 | 412 | 589 | 1731 | moved out |
| `buildersaddition` | 10023 | 326 | 1261 | 356 | 27 | 676 | moved out |
| `mcw-doors` | 9566 | 246 | 1134 | 260 | 702 | 257 | moved out |
| `Twigs` | 6329 | 256 | 570 | 259 | 278 | 549 | moved out |

Kept high-score content is mostly progression-bearing: TConstruct, Create, Goety, Botania, Blue Skies, Twilight Forest, Ars, Blood Magic, etc.

## Removed From Active Pack

First pure-deco batch:

- `absent-by-design`
- `amendments`
- `another-furniture`
- `beautify-decorate`
- `buildersaddition`
- `chipped`
- `excessive-building`
- `framedblocks`
- `handcrafted`
- `twigs`
- all Macaw building/decor modules: bridges, doors, fences, furniture, holidays, lights, paintings, paths, roofs, stairs, trapdoors, windows

Second aggressive non-progression/aesthetic batch:

- `bettergrassify`
- `bushier-flowers`
- `create-deco`
- `dynamic-trees-quark`
- `everythingcopper`
- `immersive-weathering-forge`
- `plonk`
- `quark`
- `supplementaries`
- `zeta` because Quark was the only active reason to keep it

Also moved generated integration configs referencing those mods, including Chipped/FramedBlocks/Handcrafted/Quark/Immersive Weathering/Supplementaries entries under `config/adpother` and `config/adchimneys`.

## Active Reference Cleanup

Cleaned active references in:

- `config/classselector/kits.json`
- `config/class_enhancement.toml`
- `config/incontrol/spawn.json`
- `config/ftbquests/quests/chapters/village_economy.snbt`
- `kubejs/server_scripts/35_villager_trades/10_coin_villager_trades.js`
- `kubejs/server_scripts/50_loot/30_global_loot_progression_scrub.js`
- `kubejs/server_scripts/50_loot/40_emerald_loot_coin_replacement.js`
- `kubejs/server_scripts/10_tags/30_stone_cobble_compat.js`
- `kubejs/server_scripts/10_tags/40_dirt_grass_compat.js`
- `kubejs/server_scripts/30_recipe_replace/115_material_economy_recipe_pass.js`
- `kubejs/config/input_rewrites.json`
- `tools/generate_expert_quest_book.mjs`

Search over active `config`, `kubejs`, `mods`, `index.toml`, `pack.toml`, and `tools` now only finds the unrelated `codebeautify` comment in `config/mobcontrol.toml` for the broad deco regex.

## Remaining Big Content Surfaces

These are not removed because they currently serve progression, world structure, or major branch identity:

- `Steam n Rails`: large model surface, but core intersite logistics.
- `TConstruct` and Tinkers addons: large texture/model surface, but core tool/metallurgy spine.
- `Create`: large model/recipe surface, but core infrastructure spine.
- `Goety`, `Botania`, `MNA`, `Hexerei`, `Ars`, `Blood Magic`: magic branch content.
- `Blue Skies`, `Twilight Forest`, `Fallout Wastelands`, etc.: adventure/dimension branch content.
- `natures_spirit`: high model score, but treated as worldgen/biome content rather than pure deco in this pass.


See also: `docs/memory_target_findings.md` for the exact 10 GiB and 6 GiB target envelopes.

## Follow-Up A/B Results

Measured after the aggressive deco removal set, using the live Prism instance with jars disabled transiently by `tools/profile_prism_variant.sh`.

| Variant | Extra Disabled | Xmx | Mods Loaded | Peak RSS | Post-GC Java RSS | Load-to-world | Result |
|---|---|---:|---:|---:|---:|---:|---|
| `jvm_xmx8g_all_deco_removed_malloc2` | deco/aesthetic set only | 8G | 398 | 19.29 GiB | 18.88 GiB | 109.8s | viable |
| `jvm_xmx8g_all_deco_no_emi_addons` | EMI addons | 8G | 394 | 19.08 GiB | 18.30 GiB | 106.8s | tiny win |
| `jvm_xmx8g_all_deco_no_rails` | Steam n Rails + navigator | 8G | 396 | 18.57 GiB | 18.22 GiB | 104.7s | measurable but design-core |
| `jvm_xmx8g_all_deco_no_nature_spirit` | Nature's Spirit + DT addon | 8G | 396 | 18.56 GiB | 18.29 GiB | 104.2s | measurable |
| `jvm_xmx8g_all_deco_no_client_effects2` | DH, Oculus, sound/physics/effects | 8G | 390 | 19.28 GiB | 18.24 GiB | 101.7s | no RSS win |
| `jvm_xmx6g_all_deco_removed_malloc2` | deco/aesthetic set only | 6G | 398 | 16.50 GiB | 16.33 GiB | 113.8s | viable current floor without THP wrapper |
| `jvm_xmx6g_all_deco_prctl_no_thp` | process-level THP disable | 6G | 398 | 16.20 GiB | 15.91 GiB | 115.3s | current viable floor for full design after deco cuts |
| `jvm_xmx6g_all_deco_experimental_mem_mixins` | Ferrite/ModernFix experimental memory flags | 6G | 398 | 16.25 GiB | 15.95 GiB | 117.5s | no win; reverted |
| `jvm_xmx6g_all_deco_no_emi_core` | EMI core + addons | 6G | 393 | 15.95 GiB | 15.87 GiB | 122.8s | small win, major UX cost |
| `jvm_xmx4g_all_deco_removed_malloc2` | deco/aesthetic set only | 4G | 398 | 13.48 GiB | 13.37 GiB | failed/OOM | Distant Horizons threads OOM during world prep |
| `jvm_xmx4g_all_deco_no_dh` | plus Distant Horizons | 4G | n/a | ~13.6 GiB while stuck | n/a | did not reach world | non-playable GC/worldgen stall |
| `jvm_xmx6g_cut_adventure_dims` | adventure/dimension group | 6G | 386 | 15.77 GiB | 15.71 GiB | 99.4s | modest win |
| `jvm_xmx6g_cut_heavy_magic2` | heavy magic pillar | 6G | 367 | 15.34 GiB | 15.26 GiB | 82.4s | modest-large win, design-breaking |
| `jvm_xmx6g_cut_dynamic_trees` | Dynamic Trees ecosystem | 6G | 393 | 15.99 GiB | 15.91 GiB | 116.3s | mostly neutral |
| `jvm_xmx6g_cut_tcon_addons` | TCon add-ons, core TCon kept | 6G | 385 | 14.97 GiB | 14.90 GiB | 109.8s | largest single branch win so far |
| `jvm_xmx6g_cut_magic_adventure_tcon` | magic + adventure + TCon add-ons | 6G | 342 | 13.34 GiB | 13.26 GiB | 62.8s | viable but removes major pack pillars |
| `jvm_xmx4g_cut_magic_adventure_tcon` | same broad cuts | 4G | 342 | 11.29 GiB | 11.22 GiB | 63.0s | viable stripped envelope |
| `jvm_xmx4g_extreme_cut_envelope` | broad cuts plus rails, Nature's Spirit, EMI, DH, client effects | 4G | 325 | 12.14 GiB | 11.01 GiB | 58.2s | peak worse than 342-mod 4G run; not a target path |
| `jvm_xmx3g_extreme_cut_envelope` | same extreme cuts | 3G | 325 | 11.01 GiB | 9.93 GiB | 61.2s | lowest successful launch, still above 10 GiB peak |
| `jvm_xmx2g_extreme_cut_envelope` | same extreme cuts | 2G | 325 | ~8.3 GiB transient | n/a | did not reach world after >10m | non-playable, terminated |

## Current Bottleneck

`jvm_xmx6g_all_deco_prctl_no_thp` proves host transparent huge pages are not the remaining explanation:

- `AnonHugePages`: 0 kB after process-level `prctl(PR_SET_THP_DISABLE)`
- post-GC RSS: ~15.9 GiB
- HotSpot NMT committed: ~7.65 GiB
- G1 heap: 6 GiB committed, ~5.45 GiB used after forced GC

The remaining gap is anonymous process memory outside HotSpot NMT. The largest `pmap` regions are anonymous mappings: the Java heap at ~6.1 GiB plus additional multi-GiB anonymous regions. Treat this as client/runtime/native/resource-cache pressure, not as one obvious mod jar.

## Practical Conclusions

- The repo-side deco removal is still worth keeping; it removed the only obviously wasteful high-model content and made 6G heap viable.
- The current integrated client floor is about 16 GiB RSS with 6G heap.
- 4G heap is not playable with this content graph; even without Distant Horizons it stalls in world prep/GC.
- Removing single medium categories such as Steam n Rails, Nature's Spirit, EMI, or client effects does not move the pack close to 10 GiB.
- The lowest successful launch measured was the extreme 325-mod, 3G-heap envelope at 11.01 GiB peak RSS; 2G did not reach world after more than 10 minutes.
- Reaching `<10 GiB` on the integrated client is not achieved even after removing deco, adventure dimensions, heavy magic, TCon add-ons, rails, Nature's Spirit, EMI, Distant Horizons, and client effects. It likely requires either cutting below ~325 active mods, accepting a non-playable low heap, or changing the runtime model.

## Remaining Options If `<10 GiB` Is Mandatory

The destructive branch-cut tests have now been run. The important result is that even a 325-mod extreme envelope at 3G heap still peaks at 11.01 GiB. That means the target is not reachable by merely removing the obvious decorative mods or one major branch.

Real options left:

1. Define a smaller edition/profile below ~325 active mods. This means removing additional whole systems beyond the tested adventure, heavy magic, TCon add-ons, rails, Nature's Spirit, EMI, DH, and client-effect cuts.
2. Split client/server runtime. Profile a dedicated server plus a client connected to it; this may improve client RSS but may not reduce total simultaneous host memory.
3. Accept a higher target for the full expert pack, likely 16 GiB RSS class for integrated single-player after deco removal.
4. Keep the current full design and document 6G heap as the minimum viable heap after the deco cut; 4G is not playable for the full design.
5. Pursue native/graphics-level investigation outside normal modpack content, because HotSpot NMT under-reports the RSS gap. This is lower-confidence than content cuts and likely driver/LWJGL/resource-cache behavior.

## Next Validation Needed

Run a fresh Packwiz/Prism instance from the repo and profile again. The live Prism instance still contains old downloaded jars unless rebuilt/synced from the repo.

Minimum validation:

1. Build/sync a fresh instance from this repo.
2. Confirm removed mod jars are absent.
3. Launch to world.
4. Run the same RSS/NMT/class-histogram profile.
5. Compare against `postgc_baseline` and `jvm_xmx8g_no_deco_malloc2_no_thp`.
