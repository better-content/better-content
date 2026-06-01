# Content Systems

## Recipe Authority

KubeJS recipe overrides are the authoritative content surface. The active server recipe passes live under `kubejs/server_scripts/20_recipe_remove/`, `30_recipe_replace/`, `35_villager_trades/`, `40_recipe_add/`, `50_loot/`, and `60_worldgen/`.

Important policies:

- Remove easy metal compression and raw nugget/ingot/block liquidity.
- Replace vanilla valuables in high-impact recipes with manufactured parts, casings, slates, alloys, plates, circuits, or terrain-gated materials.
- Keep easy hand-stacked automation and furnace metal shortcuts out of the grid/furnace: `145_vanillish_recipe_expert_pass.js` routes ordinary engineering to Create assembly/compaction and magic or alchemy workstations to Blood Magic alchemy.
- Remove teleportation, chunk-loading, creative, infinity, and package-wormhole bypasses unless explicitly re-authored.
- Keep recipes Rhino-safe and deterministic under `kubejs:*` IDs.

Dimension travel is intentionally narrow: meteor rift anchors and Creating Space rocket routes are the only authored cross-dimension surfaces. Direct portal/key recipes, portal structures, and JEI/EMI visibility for those route items should stay disabled unless a route is deliberately re-authored through one of those two surfaces.

## Materials And Chemistry

Deposit processing is multi-surface:

- `45_deposit_furnace_fallbacks.js`: poor emergency fallback.
- `60_worldgen/10_r_ores_melted.js`: TCon melter and ore-melting outputs.
- `50_create_deposit_preprocessing.js`: Create crushing/washing preparation.
- `55_realistic_ores_identity_outputs.js`: deposit identity outputs and acid/ball routes.
- `56_alchemistry_dissolver_create_port.js`, `58_create_pncr_molecular_synthesis.js`, and `59_formulaic_synthesis_magic_routes.js`: Create/PNCR/magic-facing chemistry parity.
- `65_chemlib_plate_manufacturing_routes.js`: Chemlib plates through Create pressing and TCon casting where supported.

Alchemistry/ChemLib content informs material identity, but the authored progression route is Create, TCon, PNCR, and Blood Magic-adjacent synthesis rather than a direct free transmutation lane.

## Create And Tinkers

Tinkers establishes seared/scorched metallurgy before Create authority. Create addon integration is handled through `121_create_stack_integration_gates.js`; PNCR compression gates in `122_pneumaticcraft_create_pressing_gates.js` make compressed iron and compressed stone Create pressing outputs and remove pressure/explosion shortcuts.

The first woodcutting tool is a flint TConstruct hand axe crafted from a Farmer's Delight flint knife and a stick. No Tree Punching tools, loose rocks, pottery, vessels, and straw-binding routes are not part of the active early-game spine.

Create trains and physical logistics are a first-class progression lane. Package teleportation remains removed until redesigned.

`123_more_red_primitive_circuitry.js` makes More Red the primitive electronics layer. Red alloy is a terrestrial Create mixing product, red alloy wire is pressed from that alloy, and the soldering table is built from andesite-tier Create parts. Later circuit recipes in Power Grid, PneumaticCraft, OC2R, AE2, and redstone-bearing Create controls consume More Red wire/diodes/gates before escalating to Power Grid integrated circuits. `143_circuit_pncr_assembly_authority.js` makes the finished circuit step a PNCR assembly laser/drill operation: upstream processes can prepare boards, traces, wafers, or printed processors, but completed PCB, Power Grid, OC2R, AE2, and impossible-circuit outputs come from PNCR assembly.

## World Physics

Realistic Block Physics uses authored material definitions where available, then applies the `stone` definition as the overworld default for every otherwise-unmatched supported block. AE2 sky stone blocks are the intentional gravity-exempt exception.

## Blood Magic And Body Systems

Blood Magic is the magic parent spine. `40_blood_orbs_from_still_beating_hearts.js` removes default Blood Orb altar recipes and replaces them with level-threshold heart-key recipes. `82_blood_magic_lifeforce_rework.js` makes altar/rune escalation costly, uses Undergarden materials for the Blood Altar body, and keeps sacrifice helpers deeper in the tree.

Food and potion identity are handled through `70_food_potion_reagents.js`: food blocks discover/refine effect identity, and the brewing stand combines processed extracts rather than serving as the main discovery ladder. Body-survival mods and configs include Diet, Thirst Was Taken, Cold Sweat, Diminishing Health defaults, PlayerRevive, and related KubeJS tooltip/content support.

Non-village natural crop and edible-plant diversity is relocated into Undergarden forage by `datapacks/datapack_foraging_everywhere`. Village farms, Wares, and villager food routes remain the explicit surface exception; ordinary Overworld biome forage should not be the first renewable source for specialty crops.

Starting loadouts are owned by the embark point-buy config in `config/classselector/embark.json`; `config/classselector/kits.json` remains safe legacy fallback data. The active embark quota is 18 points. The pool is support-only: hydration, light, scouting, local maps, rope, animal routing, limited water-route gear, small vanilla rail starts, low coin float, wheat baseline, finished rations, and drink stock. It must not include starter tools, logs/planks, generic storage, renewable specialty crop starts, ready-made TNT or TNT inputs, Protection Pixel gear, AE2, PNCR pressure items, Blood Magic LP/orbs, Create trains, Wares routes, or other missing-logistics progression before those systems provide power.

`126_cross_magic_irons_spellcraft.js` is the current Iron's Spells integration surface. It treats Iron's spellcraft as an authored branch of the magic spine: Blood Magic slates set tier, Ars apparatus handles source stabilization, Botania runic altar handles rune school identity, Hexerei cauldron handles folk/alchemical setup, Malum spirit infusion upgrades school power, and Goety rituals handle cursed/high-danger artifacts. Occultism, Forbidden and Arcanus, Reliquary, Hexerei, Botania, Goety, Ars, and Malum reagents are intentionally mixed into the recipes so Iron's spell outputs cannot be mass-crafted from only vanilla valuables and Iron's own drops.

## Casings And Manufactured Parts

The casing economy is the cross-mod machine-frame system. `99_machine_casing_progression.js`, `130_manufactured_plate_recipe_pass.js`, `136_machine_casing_ecosystem_expansion.js`, `137_casing_aesthetic_component_routes.js`, and `142_late_tier_material_economy_completion.js` spread casing and manufactured-part requirements across automation, logistics, electronics, and utility blocks.

Do not add a simple crafting recipe for a component that bypasses a cased or manufactured route. Benign aesthetic or low-power variants are acceptable only when they do not shortcut a stronger machine surface.

## Loot, Coins, Wares, And Trades

Coins are defined in `global.BTM_COIN_TIERS`: copper, zinc, iron, industrial iron, brass, gold, and platinum using Create Deco coin items. `35_villager_trades/10_coin_villager_trades.js` replaces village trades with dotcoin purchases and lossy coin exchange.

Loot is treated as a crafting surface:

- `20_world_chest_coin_tiers.js` injects tiered coin rewards into world chests.
- `30_global_loot_progression_scrub.js` removes creative, netherite, flight, global-bypass items, and high-tier Iron's Spells books/orbs/inks from random loot; selected high-tier Iron's scroll tables also have scrolls removed while low-tier discovery remains possible.
- `40_emerald_loot_coin_replacement.js` replaces emerald currency loot with coins in chest, entity, package, and wares tables while excluding block ore drops.
- `kubejs/data/wares/` contains current Wares package and agreement loot tables.

Trades should support recovery and route planning without replacing factories, metallurgy, or chemistry.

## Quests

Quest generation is driven by `tools/generate_expert_quest_book.mjs` and exported generated state under `generated/ftbquests/`. The generator still contains references to some inactive or candidate mods; only installed manifests, bundled jars, and emitted current quest data should be treated as source truth. When quest intent changes, update this doc or `progression.md`, then regenerate and validate the generated quest content.
