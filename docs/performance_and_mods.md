# Performance And Mods

## Active Pack State

Active downloaded mods are the current `mods/*.pw.toml` files. Active custom bundled jars in `mods/` include:

TaCZ 1.1.8 is active on both sides with its recommended playerAnimator integration (already present) and client-only Accelerated Rendering optimization. Create Armorer, Applied Armorer, and Immersive Armorer ship as external TaCZ gun-pack ZIPs under `tacz/`. The shared TaCZ benches begin at brass factory manufacture; the themed benches then require brass/Create, post-AE2 Impossible, and Electrical milestones respectively.

Pinned Valkyrien Skies family transport manifests are active and side `both`:

- Valkyrien Skies `valkyrienskies-120-2.4.11.jar`
- Eureka `eureka-1201-1.6.3.jar`
- VS: Clockwork `clockwork-0.5.6.jar`
- Trackwork `trackwork-1.20.1-1.2.4.jar`

All four mods ship as integrated transport surfaces. Eureka owns primitive post-Part-Builder wooden watercraft, Trackwork is a peer of Create trains, and powered Eureka/Clockwork flight progresses through Aether plus Airtight lift, PNCR gas hardware, and PCB-controlled stabilization. The version-locked surface contract classifies all 145 family registry items: 119 supported survival entries and 26 hidden technical, creative, incomplete, tool-conflict, or unsupported-worldgen entries. The 2026-07-16 user-directed in-game test is the playable-stability signoff; the automated harness remains the regression and compatibility evidence surface. Shoulder Surfing remains removed because its own compatibility warning identifies Valkyrien Skies as incompatible.

- `better_content_fixes-0.1.0.jar`
- `class_selector-1.0.0.jar`
- `oc2r_create_bridge-0.1.0.jar`
- `create-train-fuel-scaling-0.1.0.jar`
- `create-transmission-loss-0.1.0.jar`
- `dimension_drink-1.0.0.jar`
- `dynamic_trees_hexerei-1.0.0.jar`
- `dynamic_trees_malum-1.0.0.jar`
- `heat_sync-0.1.0.jar`
- `latent-chemlib-0.1.0.jar`
- `oc2r_wireless_pubsub-1.0.0.jar`
- `pillager_campaigns-0.2.0.jar`
- `world-lifecycle-manager-0.1.0.jar`
- `procedural_bouquets-0.1.0.jar`
- `realistic_ores-0.1.0.jar`
- `rpg_stats-1.0.0.jar`
- `settlement_roads-0.1.0.jar`
- `player-traces-0.1.0.jar`
- `village_walls-1.0.0.jar`


Do not infer active state from old RAM cuts or runtime caches. In the current repo, Hexerei, Iron's Spells, Malum, Occultism, Goety, Forbidden and Arcanus, Polymorph, Supplementaries, Amendments, and Genetic Animals are active. Genetic Animals is restored at the previously used `0.11.12` release on both client and server. A 2026-07-19 reset-runtime smoke passed with zero soft findings and no tick-behind warnings; Genetic Animals catches and logs an `UnsupportedOperationException` while attempting to extend an immutable village-animal pool, so its ordinary replacement animals load but village-specific animal injection remains unproven. Supplementaries is retained as the physical ash-layer target for Pollution of the Realms; its ash layers are excluded from RBP solid physics. The July 2026 breadth cut still retires Ice and Fire, Dungeon Crawl, Create Big Cannons, Reliquary, the secondary Delight food families, and their now-orphaned libraries. Markdown Manual remains solely because essential OC2R requires it at mod construction. Roots Classic, Mahoutsukai, Eidolon, Theurgy, Psi, and Hex Casting do not have active `mods/*.pw.toml` entries and should be treated as inactive/future unless re-added.

## Runtime Pruning

Disposable runtimes can inherit stale jars from `server-template/`, `server-instance/`, or launcher caches. The supported cleanup surface is `tools/bc build sync ...`; internal runtime pruning still derives from the staged mod set and server-side client-only exclusions. No runtime claim is currently supported.

If a runtime dump mentions a mod not present in current manifests or bundled jars, treat it as contaminated until the runtime is rebuilt and pruned.

Runtime graph, recipe-audit, and block-hardness diagnostics ship disabled in source configs. `tools/bc build dumps` enables them only in its disposable server runtime before collecting retained evidence.

Current heat authority: `heat_sync` owns industrial heat storage, transfer, pipe ambient bridge behavior, hot water, and the coolant exchanger. The former standalone coolant jar and redundant fission reactor jar are retired from the active pack; `latent_chemlib` remains the nuclear/fission authority and emits process heat into HeatSync.

## Memory Findings

Historical profiling showed that strict low-memory targets are profile decisions, not JVM-flag tweaks:

- A useful full-pack shape did not reach a strict 10 GiB peak RSS world-entry target in the old measurements.
- A 6 GiB-class profile required a separate lite pack shape that kept the tech/survival/Blood Magic/AE2/OC2R skeleton and removed broad adventure, magic, decorative, client visual, and model-heavy content.
- Client memory pressure was dominated by model, texture, atlas, and native/render caches more than by one Java heap collection.
- Removing large worldgen/decorative/model surfaces gave larger wins than small JVM adjustments.

Current full-pack work should assume a higher memory budget unless the user explicitly asks for a lite profile. Do not delete active content for memory reasons without a new measured A/B against current manifests.

Current dedicated-server defaults are 4 GiB initial and 16 GiB maximum heap, with DH request/render distance at 32 chunks. Dimension Fonts no longer add their former artificial per-player monster ramp or forced aggro acceleration; configured ordinary spawning and font progression remain.

## C2ME, DH, LC, And TFTH

Current source state keeps C2ME, Distant Horizons, Lost Cities, and The Flesh That Hates active. Their previous guarded/unguarded Lost Cities regression harness was removed because it required multiple worlds and violated the one-world validation rule.

Historical conclusions to preserve:

- C2ME had real previous watchdog/deadlock risk during login and chunk access.
- Spectator/creative-style fast flight rubberbanding on dedicated servers should be diagnosed as chunk delivery and server tick pressure first when `allow-flight=true` is already present. Fresh logs should be checked for `moved too quickly`, `moved wrongly`, `Can't keep up`, chunk stalls, DH queue pressure, and C2ME no-tick view-distance behavior before attributing it to client controls.
- DH should remain enabled for stability validation rather than being disabled to make the test easier.
- DH server generation request radii must stay constrained. A fresh dedicated runtime with `maxSyncOnLoadRequestDistance = 512` and `maxGenerationRequestDistance = 512` produced a C2ME chunk-read stall during DH `PRE_EXISTING_ONLY` import. Current source state keeps `maxGenerationRequestDistance = 16`, trims `maxSyncOnLoadRequestDistance` to `32`, caps DH per-player upload to `256` KB/s, and enables adaptive transfer speed to reduce client movement rubberbanding while flying on dedicated servers.
- Lost Cities, Twilight Forest, and Fallout Wastelands are routed through Creating Space datapack entries under `kubejs/data/*/creatingspace/rocket_accessible_dimension/`.
- TFTH now has an active manifest/config state; any older claim that no TFTH mod was identified is stale.
- TFTH's six bundled structures are disabled by `datapacks/worldgen_compat_fixes`: upstream restricts them to Mushroom Fields and gives them a `flesh_human` creature spawn override, which violates the biome's intended sanctuary behavior.

Revalidate with the current harness after touching `config/c2me.toml`, `config/DistantHorizons.toml`, `config/better_content_fixes-common.toml`, Creating Space dimension routes, Lost Cities worldgen, custom worldgen mods, or portable harness logic.

## Valkyrien Skies Family

Valkyrien Skies, Eureka, VS: Clockwork, and Trackwork are active as pinned transport progression. Their automated stability scenario was removed under the one-world test rule; player-control, rendering, and compatibility behavior remain manual-playtest surfaces.

Current evidence from 2026-07-10: `~/.cache/bc/bc-vs-stability-expanded-3cycle` passed three fresh DH-enabled quick lifecycle cycles, and `~/.cache/bc/bc-vs-matrix-expanded-direct` passed three paired current-config/DH-disabled boots cloned from identical disposable baselines. The old DH-disabled startup stall did not reproduce with the corrected matrix launcher, so it is not current evidence of a DH-off-only defect.

Automated full-family activation evidence from 2026-07-11: `~/.cache/bc/bc-vs-full-family-activation` passed a fresh quick server lifecycle with Clockwork and Trackwork registry/component checks, save/restart persistence, removal/unload, and clean shutdown; 37 physics-queue warnings remained non-fatal. `~/.cache/bc/bc-vs-combined-activation` then passed combined client preparation, join/render, six-component Eureka assembly, one-ship registration, reconnect visibility, and explicit translation, but failed the old automated `mount_movement` oracle because the pilot could not mount the assembled helm. That historical run remains classified `mount_camera_failure`; it also retained Dimension Drink/C2ME far-chunk-write errors for compatibility follow-up.

Full release evidence from `~/.cache/bc/bc-vs-release-all` on 2026-07-11 completed all nine orchestrated lanes. The multi-dimension server lifecycle and all ten isolation variants passed with no crash report, JVM fatal error, dependency/mixin failure, or save corruption. Current full-family startup produced 40 physics-queue warnings; disabling C2ME raised this to 82, and disabling both DH and C2ME raised it to 91. All seven client lanes failed before release acceptance: core and both C2ME-disabled combined fixtures reached assembly/translation but failed helm mounting; Clockwork failed to produce Eureka's assembly packet log; Trackwork was blocked by onboarding; current and DH-disabled combined clients timed out from the server. The timeouts were not client crashes and reproduced without DH. ModernFix also reported wrong-thread reload-listener registration, and Moonlight reported applying its VS forced-crash prevention workaround. Specialized add-on mechanics, observer sync, and restart persistence remain unproven.

After removing automated mount/movement/observer control, `~/.cache/bc/bc-vs-release-simplified` completed all nine lanes on 2026-07-12. The server lifecycle and all ten matrix variants again passed. Clockwork, combined C2ME-disabled, and combined DH+C2ME-disabled clients completed assembly, translation, reconnect, and server-restart lifecycle assertions; their only classification was `render_environment_inconclusive` under Xvfb/llvmpipe. Core, Trackwork, combined current, and combined DH-disabled stopped before assembly because the software client did not meet the source-fixture visibility score. No crash report or JVM fatal error was produced. The remaining automated limitation is the Xvfb visual oracle, not a reproduced VS-family crash. The 2026-07-16 in-game acceptance supplies the playable-control signoff that automation deliberately does not own. Client/integrated-server runs disable ModernFix's integrated-server watchdog in `config/modernfix-mixins.properties` so VS/DH/worldgen backlog experiments do not create misleading 40-second integrated tick failures. A render-thread frame in Thirst or Forge HUD overlay code inside such a dump is only a sampled thread state unless the server thread also points there.

The 2026-07-16 post-integration reset-runtime smoke passed with zero soft findings. A same-day retired full-family client orchestration retry reached a playable dedicated server, then stopped in its first lifecycle lane because Moonlight's known VS forced-crash-prevention message matched `dependency_mixin_failure`; 109 physics-queue warnings were also retained. This is historical compatibility evidence only.

## Persistent Chunk Loading


## Custom Mod Notes

Canonical custom mod sources live under `generated/custom-mod-sources`. World Lifecycle Manager is checked out from `https://github.com/better-content/world-lifecycle-manager.git` at `../world-lifecycle-manager`. Use `../settlement-roads` for settlement roads unless explicitly told otherwise. `../dynamic-trees-dimension-compat` is the canonical `dynamic_trees_dimension_compat` source checkout for pack-owned dimension forest Dynamic Trees coverage.

`prestige` and `traces` are independent required custom mods. World Lifecycle Manager owns only the verified dedicated-server reset and persistent schematic-library surface; `better_content_fixes` contains no World Lifecycle Manager registrations or assets. Player Traces owns world-local movement/annotation shards under the active save, uses the full dimension namespace, bounds persisted/network inputs, and drains dirty state on shutdown. Its `player_traces_v3` packets mark requesting-player footprints as `own`, expose note edit capability without exposing creator identity, and reject invalid movement ordinals, non-finite strengths, stale revisions, oversized text, and oversized record counts. The overlay renders vanilla depth-tested cyan footprint/note quads plus bounded server-authored guidance ribbons for nearby changed notes at `AFTER_PARTICLES`; notes become seen only after a close on-screen view. Erosion and density filtering remain deferred. Player Traces never copies, replaces, desaturates, or composites the viewport. Server-root legacy Player Traces data is ignored so it cannot leak across World Lifecycle Manager generations.

Advanced Chimneys is active on its pinned Forge 1.20.1 release, with ForgeEndertech already supplied as its dependency. The maintained `config/adchimneys/` emitter definitions cover the pack's active furnace, burner, smeltery, and generator surfaces.

Set `BC_CUSTOM_MODS_DIR` to use a different custom-mod checkout when running validation in another environment.

Prior repairs worth retaining as current expectations:

- Forest-generation notes and fixed-seed results below are historical evidence only while the replacement one-world worldgen suite is designed. `dt_forest_worldgen_fix` disables reliance on Nature's Spirit modified vanilla biome packs and adds explicit Dynamic Trees selectors for vanilla forest biomes. Dark forests remove the vanilla `minecraft:dark_forest_vegetation` feature and replace its huge mushrooms through Dynamic Trees Plus brown/red mushroom species in the dark forest selector. Hyle/Unearthed dirt replacement stays enabled; `better_content_fixes` registers 37 Unearthed regolith/overgrown surface blocks as Dynamic Trees dirt-like soil aliases. Do not restore Unearthed DT soil-property JSON files, because they make Dynamic Trees expect unregistered `rooty_unearthed_*` blocks during worldgen. The external DT Nature's Spirit addon still logs bad redwood species growth-logic ids; treat that as an addon bug unless patched in a custom jar.
- Hyle/Unearthed stone replacement is pack-owned by `datapacks/hyle_deep`: the placed feature starts at Y -64 and uses only the exhaustive default, limestone, and sedimentary Unearthed regions. Active regions contain no empty/no-replacement palette entries, deepslate and tuff are Hyle-replaceable, and later vanilla granite/diorite/andesite/tuff features are removed so they cannot overwrite the completed geology pass. The upstream Hyle configured feature ships with an empty region list, while its Unearthed data also contains stale block IDs and vanilla-preserving region entries; the pack overrides those inputs. `better_content_fixes` moves Hyle to underground-decoration tail so it also consumes stone-family outputs from underground structures, ores, and decor, while leaving authored surface blocks outside the geology pass. Hyle can still resolve its lowest interpolation slice to a no-replacement sentinel, so `better_content_fixes` completes leftover replaceable blocks in the bottom chunk section from each column's nearest valid generated stratum. `better_content_fixes` also defers SGI support-terrain conforming until decoration tail so foundations sample Hyle's final Unearthed palette, then retains the post-conform Hyle pass as a safety net. Fresh fixed-seed smoke evidence under `~/.cache/bc/unearthed-comprehensive-smoke` audited 529 full chunks: Y -64 through -1 had zero vanilla host stones; the entire below-Y64 range had zero granite, diorite, andesite, deepslate, or tuff and 246 isolated stone blocks from cross-chunk late feature writes. Do not add a chunk-load replacement sweep for that bounded residue because it would rewrite player-placed stone. These changes affect fresh chunks only.
- Dimension forest coverage now includes CurseForge DT addons for Aether and Twilight Forest plus bundled `dynamic_trees_dimension_compat` species/decorator coverage for Undergarden. The removed sky-dimension mod, Finley, and Call From The Depths are no longer active pack content. Current retained radius-2 evidence before this refactor included Aether skyroot grove 154 `dtaether:skyroot_branch`, Twilight dense forest 3528 DT branch blocks, and Undergarden wigglewood 398 `dynamic_trees_dimension_compat:wigglewood_branch`; refresh dimension forest evidence after the next worldgen scenario pass.
- `better_content_fixes` no longer attempts Dynamic Trees fallen-log reconstruction. Dynamic Trees falling trees should remain item-drop only until there is a reconstruction path that produces stable, believable world results rather than sparse misplaced logs.
- Burnt grass compatibility is pack-owned in `better_content_fixes`. Burnt still hardcodes generic `burnt:burnt_grass` in its spread path, so `better_content_fixes` now intercepts those final placements for the full pack burnable grass-like source set, keeps native Burnt outputs where they exist, and supplies `better_content_fixes:burnt_*` variants for the remaining modded surfaces including Unearthed overgrown stone and grassy regolith blocks. The authoritative source list is `../better-content-fixes/src/main/resources/data/better_content_fixes/burnt_grass_replacements.json`, and the generated palette assets come from the paired tool scripts in that module.
- Regolith farming now also lives in `better_content_fixes`. The pack registers 17 `better_content_fixes:*_regolith_farmland` blocks matching the Unearthed grassy regolith surface set, hoes grassy regolith directly into those variants when the space above is clear, and explicitly supports crop-type plants. Each farmland resolves its matching plain regolith after block registration and reverts to that block instead of minting vanilla dirt on dehydration, support failure, or trampling. The pack-side farmland tag is `#c:farmland`, which now includes vanilla farmland plus the full regolith farmland palette for downstream dirt/farmland consumers such as RBP block categorization.
- `settlement_roads` should avoid unbounded tick-time work and clean level-unload state.
- `village_walls` should cap automatic wall generation work and avoid endless retries for failed village cells.
- `pillager_campaigns` placement and materialization scans should use already-loaded `LevelChunk` data via `getChunkNow`, not blocking `ServerLevel.getHeight` or `getBlockState` calls from chunk-load paths.
- Pillager campaigns use a 20-tick bounded scheduler and procedural cells around players. Discovery plans off-thread, environmental setup samples a deterministic 7x7 noise-biome grid without generating chunks, and territory radius is capped at 32 chunks. Economy and abstract travel are deterministic saved-data work with no loaded-chunk growth multiplier. Captains issue at most one shared real-navigation probe per squad interval, reject unloaded candidate chunks before height/path queries, cache reachable approaches, and invalidate stuck routes. TConstruct registries and part-builder recipes are inspected only during finite armory production; materialization, withdrawal, snapshot restoration, and placement remain loaded-chunk-only. Ping Wheel 1.10.1 and Thalassophobia 1.8 are pinned client-and-server additions for the approved post-freeze playtest surface. Thalassophobia leeches remain registered for explicit item/command use but are removed from natural river, swamp, and mangrove-swamp spawns, including Spawn Balance Utility's tables.
- Fowl Play 1.2.1 is pinned for Forge 1.20.1 on both client and server, adding ambient birds and their native behaviors without an additional required dependency.
- `better_content_fixes` includes compatibility behavior for C2ME safe-random guard noise around EMI tooltip indexing.
- Worldgen C2ME compatibility fixes now include a pack datapack no-op for PVJ Nether `charred_bones` groundcover, and `dimension_drink_ore_relocation` routes relocated Malum cthonic gold through vanilla `minecraft:ore` instead of Malum's custom cross-chunk writer.
- Dimension Font placement uses vanilla `Structure`/`StructureSet` spacing and a reobfuscated, 32-block-radius site writer. The copper altar, font, supports, and lighting fit wholly in the start chunk; surrounding paths and sparse palette details follow local terrain. Every write is clipped only by the vanilla structure `BoundingBox`, and layout decisions use serialized site data plus absolute coordinates, so callback order and a C2ME callback `chunkPos` that differs from the active slice cannot change ownership or produce far-chunk writes. The writer does not call `WorldGenLevel.ensureCanWrite`. Forge GameTests deliberately pass mismatched callback chunks, verify an adjacent-chunk sentinel remains untouched, and validate the complete center and bounded approaches. Layout version 2 is for newly generated worlds and intentionally does not deserialize old Dimension Font pieces.
- Latent chemical clouds are non-targetable hand/raytrace volumes and render as sparse non-occluding particles instead of depth-writing block models.
- InControl owns the Forbidden & Arcanus Lost Soul spawn policy: natural spawns are denied where the sky is visible or where the floor belongs to `#kubejs:grass_like`.
- `dynamic_trees_dimension_compat`, `dynamic_trees_malum`, and `dynamic_trees_hexerei` are active Dynamic Trees extension jars in `mods/`; rebuild and run their unit tests and Forge game tests before redeploying them.
- `class-selector` owns the fixed class selection path and spawn lock handoff. `config/class_selector/embark.json` is currently set to class mode; keep any inactive embark fallback data small, high-signal, and support-only, and keep spawn-biome selection temperate so the locked-spawn loop starts in intended climates.
- `realistic_ores` plus Excavated Variants should produce gravel variants for every custom deposit covered by the stone configured features. If deposit ids change in the custom source, regenerate both `defaultresources/excavated_variants/excavated_variants/variants/realistic_ores.json5` and the matching `datapacks/worldgen_compat_fixes/data/realistic_ores/worldgen/configured_feature/*_stone.json` overrides.

Rebuild and redeploy custom jars deliberately; then sync, prune, boot, and validate with the relevant harness.

## Heat Authority

Current implementation date: 2026-08-03.

`heat_sync` is the pack-owned industrial heat authority. It provides the Forge heat capability, native heat pipe, creative heat/cold sources, coolant exchanger, hot water, coolant data loading, transfer helpers, sync/tooltips, and Cold Sweat ambient bridge behavior.

Create: Power Grid keeps its native electrical and device-overheat simulation. HeatSync provides an optional adapter for Power Grid block entities that expose `ThermalBehaviour`, mapping Power Grid device temperature into the HeatSync capability so HeatSync pipes and exchangers can exchange heat without making Power Grid a second pack heat API.

`latent_chemlib` remains the nuclear and high-energy chemistry authority. Its ordinary reaction chamber owns deliberately conditioned sealed reactions, but it is not a nuclear machine. Every loaded unstable isotope with configured half-life and daughter evidence emits continuous deterministic decay heat from an exactly debited microbatch and explicit mass defect; the containing and adjacent HeatSync sinks share that heat rather than duplicating it. Criticality is the stricter emergent subset: unstable isotope mass number and fissility, then concentration, density, temperature, neutron flux, moderation, contact, and geometry determine eligibility without an element-name allowlist. Opposing sufficiently hot and dense compatible light-gas streams can fuse at their collision boundary. These paths debit their source matter, preserve daughter/product state, express mass defect as heat and radiation, and can melt real nearby material. Radioactive stacks remain chemically active while carried by lava. No fission or fusion block, reactor power ladder, or nuclear energy capability exists; scheduler profiles bound loaded-world work rather than defining a machine.

The AdPother bridge is a terminal adapter, not a second atmospheric scheduler. It preserves AdPother's emitter and chimney selection, runs chimney filters before handoff, inserts accepted units directly into Latent clouds, and exposes loaded clouds back to AdPother point-pollution and gas-detection reads. Entity hazards query only the exact eye cell, avoiding chunk-area projections. Same-species insertion performs a deterministic bounded merge/place pass, while ignition walks only the existing Latent neighbor budget to total an adjacent mixed-species flammable component. The resulting bounded-power blast uses the ordinary Forge explosion path so Explosion Overhaul remains authoritative. Cloud evolution continues to spend only the existing `latent_chemlib` scheduler budgets; there is no deferred integration queue, coalescing tier, or degraded simulation mode.

PNCR retains its native pressure, heat, and thermo-plant semantics. The explicit Latent boundary gives selected pressure tubes either normal-air or chemical service, with separate ledgers and a dry-air separation route; PNCR transport does not become a second persisted chemistry authority.

Retired content: the standalone coolant jar, redundant fission reactor jar, and Create New Age runtime dependency are no longer active pack content. Rebuild disposable runtimes before validating so stale copied jars do not mask missing dependency problems.
