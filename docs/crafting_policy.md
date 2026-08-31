# Crafting graph policy

This is the living policy and audit ledger for player-facing item integration.
It records the current runtime categorization, the working meaning of a crafting
graph, settled support rules, unresolved policy choices, and durable audit
findings. It is not an implementation plan and does not itself change recipes,
visibility, loot, trades, or gameplay.

The inventory baseline is the complete runtime snapshot
`2e0e850052bc489d0faaaf06`, generated 2026-08-31. That snapshot contains 338
loaded mod IDs, 18,244 items, 24,445 recipes, 11,586 loot tables, and 4,064
sampled trade contexts. Registry, recipe, tag, and loot evidence is complete;
trade evidence is sampled and must not be treated as exhaustive.

## Policy status

Statements marked **settled** are the current pack policy. Statements marked
**working** are precise enough to guide the audit but remain open to revision in
the findings discussion. Statements marked **open** require an explicit policy
decision before implementation is planned.

## Two independent axes

Every loaded mod has a primary role and a support scope. These axes answer
different questions and must not be inferred from one another.

### Primary role

| Role | Meaning | Loaded mods |
| --- | --- | ---: |
| `content` | Primarily supplies player-facing materials, equipment, machines, building pieces, or transformation systems. | 76 |
| `world` | Primarily supplies dimensions, terrain, structures, ecology, entities, weather, or persistent world processes. | 58 |
| `edge_provider` | Primarily connects two or more otherwise independent systems. | 11 |
| `gameplay_system` | Primarily changes player rules, progression state, survival rules, combat, or systemic behavior. | 26 |
| `presentation` | Primarily exposes, explains, searches, renders, or organizes other content. | 25 |
| `infrastructure` | Primarily supplies APIs, libraries, loaders, scripting, compatibility plumbing, diagnostics, or performance work. | 142 |

The role is descriptive, not a support waiver. Patchouli is presentation but
has valid guide-book recipes. FTB Filter System is presentation but registers a
craftable smart filter. KubeJS is infrastructure but owns pack-authored items.
Dimension Drink is world-facing while its two block items are backend objects.

### Support scope

The support rules are **settled**:

- An item-owning mod defaults to `full`. Full support covers every registered
  item in the current item set except a declared family or item exclusion.
- A zero-item mod is `not_applicable` for item crafting, but its non-item edges
  can still be required to make another mod's graph reachable.
- Role never implies support scope. In particular, `content` is not synonymous
  with full support and `infrastructure` is not synonymous with exclusion.
- Exceptions are item-family-first. An individual exception is used only when
  no coherent family exists.
- A registered functional upstream item may be excluded only when it is
  technical, creative-only, a canonical duplicate, or a documented feature
  cut with a system or balance rationale.
- Existing hide lists, recipe removals, and quarantine entries are evidence to
  review, not inherited policy. Each must be revalidated under these rules.
- A mod update triggers recategorization when its registered item set changes.
  A version-string change alone does not.
- A future mod, item-owning namespace, or item family without a classification
  is an error. It must not silently inherit a broad allowlist or exclusion.
- Broad decorative and exploration mods, including Quark, Dawn of Time,
  Nature's Spirit, The Aether, and The Twilight Forest, are fully supported.
  Their breadth is not a reason to weaken coverage.
- A broken route in a fully supported mod is integration debt. The mod must not
  be relabeled selective merely to suppress the finding.

There are 134 loaded item-owning mods and 204 zero-item mods in the baseline.
The family exception ledger is intentionally not declared complete: completing
it is one result of the findings discussion, not a premise imported from the
old quarantine.

## Working definition of the crafting graph

The following is the **working** definition to use while discussing findings:

1. The graph includes every intended survival acquisition and transformation
   edge, not only crafting-table recipes. Machine recipes, rituals, casting,
   loot, trades, mob drops, world acquisition, stateful conversions, copying,
   container returns, and documented dynamic producers can all be edges.
2. A supported terminal item is integrated when a player can reach it through
   at least one intended route. A decorative block can be terminal; it does not
   need an artificial downstream consumer.
3. A supported ingredient or intermediate is integrated when it has a reachable
   producer and participates in a reachable downstream conversion family.
4. Material forms may be evaluated as a conversion family. Every supported
   form must be reachable within that family, but each form does not need a
   distinct external sink.
5. A recipe whose required input is unreachable does not make its output
   reachable. A live consumer of a deliberately removed input is itself a graph
   defect or an unresolved policy edge.
6. Viewer hiding is presentation only. It neither disables acquisition nor
   proves that an item is unsupported.
7. A guide entry, tooltip, model, config toggle, or creative-tab presence is
   evidence of intent but is not an acquisition edge.
8. Dynamic and world-mediated routes count, but when runtime data cannot prove
   them they must be documented explicitly rather than assumed.
9. An intended closed feature must close producers, consumers, copied variants,
   guide promises, loot, trades, and visibility consistently. Partial closure is
   graph leakage.

The boundary between “crafting graph” and the wider acquisition graph remains
open for naming. The audit uses the wider meaning because otherwise loot-only,
world-only, and ritual-only content could not be judged coherently.

## Complete primary-role inventory

This inventory classifies every mod ID in the baseline exactly once. The
classification is **working**: changing a role changes how findings are grouped,
not the mod's support obligations or current gameplay.

### Content — 76

`adchimneys`, `additionalweaponry`, `ae2`, `amendments`,
`arcane_chunk_loaders`, `armoroftheages`, `ars_elemental`, `ars_nouveau`,
`artifacts`, `bloodmagic`, `brewinandchewin`, `buildinggadgets2`, `burnt`,
`chemlib`, `construct_arsenal`, `create`, `createdeco`,
`createdieselgenerators`, `creatingspace`, `dawnoftimebuilder`,
`everythingcopper`, `explosionoverhaul`, `farmersdelight`, `farmersrespite`,
`fowlplay`, `framedblocks`, `goety`, `hangglider`, `heat_sync`, `hexerei`,
`jumbofurnace`, `k_turrets`, `latent_chemlib`, `littlelogistics`, `lootr`,
`malum`, `minecraft`, `moreartifacts`, `morered`, `naturescompass`, `oc2r`,
`occultism`, `pneumaticcraft`, `powergrid`, `prettypipes`, `protection_pixel`,
`quark`, `rail_scout`, `rats`, `realistic_ores`, `rehooked`, `relics`,
`sophisticatedbackpacks`, `sophisticatedstorage`, `starcatcher`,
`supplementaries`, `tacz`, `tconstruct`, `the_flesh_that_hates`,
`tinker_rapier`, `tinkers_advanced`, `tinkers_battle_spades`,
`tinkers_construct_affixes`, `tinkers_katanas`, `tinkers_khopesh`,
`tinkers_things`, `tinkersweaponry`, `tinymultiblocklib`, `trackwork`,
`tradingpost`, `ubesdelight`, `valkyrienskies`, `vs_clockwork`, `vs_eureka`,
`wares`, `water_survival`.

### World — 58

`adlods`, `adpother`, `aether`, `alexscaves`, `better_content_economy`,
`bettercaves`, `biomespawnpoint`, `born_in_chaos_v1`,
`claustrophobic_dungeons`, `complicated_bees`, `depth_director`,
`dimension_drink`, `dtaether`, `dtarsnouveau`, `dtnatures_spirit`, `dtquark`,
`dttwilightforest`, `dynamic_trees_hexerei`, `dynamic_trees_malum`,
`dynamictrees`, `dynamictreesplus`, `eanimod`, `endermanoverhaul`, `enhancedai`,
`fallout_wastelands_`, `farsightedmobs`, `forgottenruins`, `guardvillagers`,
`hyle`, `immersive_weathering`, `immersive_weathering_sampler`,
`improved_village_placement`, `incontrol`, `kelvin`, `looot`, `lostcities`,
`natures_spirit`, `player_traces`, `procedural_bouquets`,
`projectvibrantjourneys`, `satako`, `savage_and_ravage`, `sereneseasons`,
`settlement_roads`, `simplebedrockmodel`, `structure_generation_improver`,
`structurify`, `t_and_t`, `takesapillage`, `tectonic`, `thalassophobia`,
`the_bumblezone`, `tntutils`, `twilightforest`, `unearthed`, `village_walls`,
`weather2`, `world_lifecycle_manager`.

### Edge provider — 11

`ars_creo`, `arseng`, `better_content_fixes`, `bumblezone_cultivars`,
`compressedcreativity`, `epicfighttinkercompat`, `excavated_variants`,
`oc2r_create_bridge`, `oc2r_wireless_pubsub`, `ratlantis_logistics`,
`tomeofblood`.

### Gameplay system — 26

`class_selector`, `cold_sweat`, `configurabledeath`,
`create_train_fuel_scaling`, `create_transmission_loss`, `diet`,
`downed_player_revival`, `dynamicvillagertrades`, `epicfight`,
`globalgamerules`, `keepcuriosinventory`, `nomobfarm`, `pillager_campaigns`,
`polymorph`, `rbp`, `realisticphysics`, `rpg_stats`,
`simpledaylengthextender`, `sleepingoverhaul`, `solcarrot`,
`staaaaaaaaaaaack`, `systemic_salience`, `temperaturebands`, `thirst`,
`trashslot`, `unloaded_activity`.

### Presentation — 25

`appleskin`, `better_content_quests`, `better_content_threads`,
`cumulus_menus`, `dynamic_survival_hud`, `emi_loot`, `emi_ores`, `fancymenu`,
`findme`, `ftbfiltersystem`, `ftbquests`, `guideme`, `inventorysorter`, `jeed`,
`jei`, `markdown_manual`, `modonomicon`, `particular`, `patchouli`, `pingwheel`,
`ponder`, `quickstack`, `sodiumdynamiclights`, `tconjei`, `tponder`.

### Infrastructure — 142

`alltheleaks`, `almostunified`, `architectury`, `athena`, `balm`, `blueprint`,
`c2me`, `c2me_base`, `c2me_client_uncapvd`,
`c2me_fixes_chunkio_threading_issues`, `c2me_fixes_general_threading_issues`,
`c2me_fixes_worldgen_threading_issues`, `c2me_fixes_worldgen_vanilla_bugs`,
`c2me_notickvd`, `c2me_opts_allocs`, `c2me_opts_chunk_access`,
`c2me_opts_chunkio`, `c2me_opts_math`, `c2me_opts_scheduling`,
`c2me_opts_worldgen_general`, `c2me_opts_worldgen_vanilla`,
`c2me_rewrites_chunk_serializer`, `c2me_rewrites_chunkio`, `c2me_server_utils`,
`c2me_threading_chunkio`, `c2me_threading_lighting`, `c2me_threading_worldgen`,
`citadel`, `cloth_config`, `collective`, `coroutil`, `creativecore`,
`cristellib`, `curios`, `defaultresources`, `dynamic_asset_generator`,
`etstlib`, `expandability`, `fabric_api`, `fabric_api_base`,
`fabric_api_lookup_api_v1`, `fabric_biome_api_v1`, `fabric_block_api_v1`,
`fabric_block_view_api_v2`, `fabric_blockrenderlayer_v1`,
`fabric_client_tags_api_v1`, `fabric_command_api_v1`, `fabric_command_api_v2`,
`fabric_content_registries_v0`, `fabric_convention_tags_v1`,
`fabric_data_attachment_api_v1`, `fabric_data_generation_api_v1`,
`fabric_dimensions_v1`, `fabric_entity_events_v1`,
`fabric_events_interaction_v0`, `fabric_game_rule_api_v1`, `fabric_item_api_v1`,
`fabric_item_group_api_v1`, `fabric_key_binding_api_v1`,
`fabric_lifecycle_events_v1`, `fabric_loot_api_v2`, `fabric_message_api_v1`,
`fabric_mining_level_api_v1`, `fabric_model_loading_api_v1`, `fabric_models_v0`,
`fabric_networking_api_v1`, `fabric_object_builder_api_v1`,
`fabric_particles_v1`, `fabric_recipe_api_v1`, `fabric_registry_sync_v0`,
`fabric_renderer_api_v1`, `fabric_renderer_indigo`,
`fabric_rendering_data_attachment_v1`, `fabric_rendering_fluids_v1`,
`fabric_rendering_v1`, `fabric_resource_conditions_api_v1`,
`fabric_resource_loader_v0`, `fabric_screen_api_v1`,
`fabric_screen_handler_api_v1`, `fabric_sound_api_v1`,
`fabric_transfer_api_v1`, `fabric_transitive_access_wideners_v1`, `fastbench`,
`fastfurnace`, `ferritecore`, `flywheel`, `forge`, `forgeendertech`,
`framework`, `ftbbackups2`, `ftblibrary`, `ftbteams`, `ftbxmodcompat`, `fusion`,
`fzzy_config`, `geckolib`, `glitchcore`, `globalpacks`, `insanelib`,
`jsonthings`, `konkrete`, `kotlinforforge`, `kubejs`, `kubejs_create`,
`kubejsbloodmagic`, `kuma_api`, `lithostitched`, `lodestone`, `logbegone`,
`lootjs`, `mantle`, `melody`, `midnightlib`, `mixinsquared`, `modernfix`,
`moonlight`, `morejs`, `nitrogen_internals`, `octolib`, `placebo`,
`playeranimator`, `polylib`, `puzzlesaccessapi`, `puzzleslib`,
`resourcefulconfig`, `resourcefullib`, `rhino`, `runtime_data_dumper`,
`searchables`, `sedna`, `smartbrainlib`, `sodiumoptionsapi`,
`sophisticatedcore`, `spark`, `spectrelib`, `terrablender`,
`useitemonblockevent`, `valhelsia_core`, `xlpackets`,
`yet_another_config_lib_v3`, `yungsapi`, `zeta`.

The 44 Fabric-family IDs and 21 C2ME-family IDs account for 65 of the
infrastructure entries. Keeping their embedded module IDs explicit avoids
mistaking loader internals for 65 unreviewed content mods.

## Settled family decisions

These decisions can constrain later implementation without resolving every
individual item now:

- Latent ChemLib and ChemLib are fully supported. “Integrate all chemistry” is
  the governing direction. The 25 ChemLib gas-bucket containers are a
  documented feature cut because Latent ChemLib owns containment and Pollution
  of the Realms owns ambient gases; the represented substances remain
  supported through their other forms.
- Every supported ChemLib material form belongs to a reachable conversion
  family. Individual forms do not each require a distinct sink.
- `ars_nouveau:glyph_conjure_water` and `ars_elemental:glyph_rewind` are
  documented feature cuts: the former violates finite-matter policy and the
  latter exposes rollback duplication. Other Ars removals do not inherit those
  rationales.
- Base Valkyrien Skies test, assembly, and debug blocks; Clockwork
  creative/debug/incomplete/unsupported-worldgen objects; Minecraft's knowledge
  book and petrified slab; Create's deprecated chromatic, radiance, and shadow
  steel; some Creating Space sequenced intermediates; PneumaticCraft's creative
  compressor; AE2's debug chunk loader; and Dimension Drink's backend blocks
  are valid exclusion families in principle. Exact IDs still belong in the
  eventual reviewable exception register.

## Durable audit findings

The following findings are evidence for discussion, not an implementation
queue ordered by severity:

- The existing quarantine has 75 entries: 14 stale inactive `alchemistry:*`
  IDs and 61 active entries, with no per-item rationales.
- ChemLib policy currently hides 194 forms and 29 compounds. All 223 have no
  runtime producer, direct consumer, or consumed-tag participation because the
  removal policy severed them. Oxygen and sulfur-dioxide buckets still have
  live consumers despite the gas-bucket feature cut.
- The vanilla/TConstruct tool hide policy names 130 IDs. Of the 113 IDs that
  still exist, every one remains recipe-producible; the other 17 are stale No
  Tree Punching IDs. The current TConstruct authority is therefore
  presentation-only for those tools.
- Vanilla and TConstruct fishing rods are hidden and have crafting recipes
  removed, but the vanilla rod remains obtainable from nine loaded loot tables.
- Fifty Hexerei mahogany IDs are hidden. Thirty-six remain recipe-producible
  and sixteen are consumed. The server policy replaces inputs with Nature's
  Spirit but does not close Hexerei outputs, so the claimed wood-family collapse
  is incomplete.
- `rats:chunky_cheese_token` remains in the rat entity loot table at base
  probability 0.00010 plus the same Looting multiplier. This leaks a disabled
  Ratlantis route outside its intended Dimension Font acquisition.
- Six functional Create: Diesel Generators petroleum objects are quarantined:
  the distillation controller, oil scanner, and four pumpjack pieces. Upstream
  ships their recipes, models, and logic, while runtime retains crude-oil
  distillation but no crude-oil acquisition route.
- PneumaticCraft jet-boots tiers 4 and 5 have ordinary complete upstream
  late-survival recipes but are removed and hidden without a recorded rationale.
- Sophisticated Core explicitly enables omega upgrades while pack scripts remove
  and hide their recipes.
- Ars flight and island rituals and warp scrolls lack the recorded rationale of
  the two accepted glyph cuts. Warp-scroll copy and stable recipes remain live
  without a bootstrap route, and native guide content still advertises parts of
  the closed surface.
- Blood Magic water and lava sigils are removed, but live recipes still consume
  them for cutting fluids, clay, leather, frost reagent, water containers, lava
  buckets, and sulfur. Native guide content remains.
- Occultism documentation says the controller, remote, and satchel are closed,
  yet controller crafting and the remote ritual remain live. Miner and storage
  guide entries also remain after acquisition cuts.
- `createdeco:netherite_sheet` has no producer, consumer, or general Forge-tag
  participation; it appears only in an internal Create Deco tag.
- Confirmed full-support repair areas include formal Ars magic, Latent ChemLib,
  Heat Sync, OC2R, Fowl Play's feeder, ReHooked chains, Compressed Creativity's
  WIP family, Creating Space's space food, and six Rats upgrades. These are not
  candidates for blanket mod-level exclusions.
- Earlier graph inspection also found invalid or wrong tag edges in Ars
  Elemental, Heat Sync, Starcatcher, Dawn of Time, Burnt, and Creating Space;
  a missing Heat Sync firebox and usable transducer route; a missing leaping
  extract; Ratlantis's hidden post-craft tax across 495 recipes; and policy drift
  around compressed iron, stone, Trading Post, and the pack's factory-crafting
  helper.

## Open policy decisions

These questions must be discussed before implementation planning:

1. Is Create: Diesel Generators petroleum extraction a supported pack system,
   or is the intended surface biodiesel-only?
2. Is high-tier personal flight supported? This decision must cover both
   PneumaticCraft jet boots and Ars flight rather than treating them as unrelated
   removals.
3. Does TConstruct replace the acquisition of 113 ordinary tools, or only their
   recipe-viewer presentation?
4. Are Occultism storage and mining, Blood Magic's finite-fluid branches, and
   Sophisticated omega compression deliberate feature cuts?
5. Should Hexerei mahogany decorative variants survive as supported conversion
   outputs, or be fully removed in favor of Nature's Spirit?
6. Which guide and framework carrier items are player-supported, and which are
   technical delivery objects?
7. Should the policy retain the familiar name “crafting graph” for the wider
   acquisition-and-transformation graph, or adopt a more exact name?

## Maintenance

Update this document when the loaded mod set, primary-role classification,
support rule, accepted exception family, or durable audit conclusion changes.
Raw registry dumps and generated reports remain under `generated/` or an
untracked run root; do not copy them into `docs/`.

The first enforcement rollout, when separately planned, is intended to make
classification completeness blocking while reporting graph defects until the
known repair backlog is resolved. No enforcement mechanism is created by this
document. The user-authorized crafting-policy infrastructure exception to the
repository's current no-contract rule must be reflected explicitly in
`AGENTS.md` as part of that later implementation, not smuggled in through this
documentation change.
