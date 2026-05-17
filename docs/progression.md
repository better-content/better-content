# Progression

## Spine

The pack has two primary crafting spines and one pressure spine:

- Tech spine: Tinkers seared/scorched metallurgy into Create andesite/brass automation, then Power Grid, OC2R, Creating Space, and AE2-local intelligence.
- Magic spine: Still-Beating Heart and Blood Magic orb/slate progression parent most side magic rather than letting each magic mod open independently.
- Adventure spine: obelisks, dimensions, combat, villages, wares, and coins provide route pressure and recovery options without replacing production.

Local logistics stays first. Create trains and physical routes should matter before AE2 dominates a site, and OC2R is the intended intersite information bridge.

## Machine Casing Ladder

The active casing catalogue is `global.BTM_MACHINE_CASING_TIERS` in `kubejs/startup_scripts/00_globals/20_progression_catalogues.js`:

| Order | Casing | Authority |
| --- | --- | --- |
| 1 | `kubejs:seared_machine_casing` | TCon seared |
| 2 | `kubejs:scorched_machine_casing` | TCon scorched |
| 3 | `kubejs:andesite_machine_casing` | Create andesite |
| 4 | `kubejs:brass_machine_casing` | Create brass |
| 5 | `kubejs:airtight_machine_casing` | PneumaticCraft pressure |
| 6 | `kubejs:electrical_machine_casing` | Power Grid and electrical work |
| 7 | `kubejs:circuited_machine_casing` | PNCR assembly and OC2R |
| 8 | `kubejs:space_machine_casing` | Creating Space |
| 9 | `kubejs:raw_impossible_casing` | unfinished AE2 body |
| 10 | `kubejs:impossible_machine_casing` | AE2 and final Blood Magic |

`kubejs/server_scripts/30_recipe_replace/99_machine_casing_progression.js`, `136_machine_casing_ecosystem_expansion.js`, and related replacement passes keep high-impact machines tied to this ladder. Each new tier should depend on earlier tier capabilities and add a real manufacturing dependency from its own tier.

## Early Chokepoints

- Netherrack grout keeps seared metallurgy tied to Nether-obelisk preparation.
- `create:andesite_alloy` is an alloying output, not easy nugget crafting.
- `create:deployer` gates `create:andesite_casing`.
- More Red is the terrestrial primitive circuitry layer around early Create: red alloy comes from Create mixing, wire from Create pressing, and the soldering table consumes andesite-tier parts instead of Nether/blaze ingredients.
- Finished circuit items belong to PNCR assembly laser/drill. Earlier surfaces prepare boards, traces, wafers, and printed processors; PNCR assembly completes the circuit.
- Passive Create SU sources are pushed to the andesite machine-casing tier.
- Clean water, serious extraction, and body-system recovery depend on sustainable tech rather than free early infrastructure.

Deadlock checks:

- Do not require Create andesite casing before the first TCon seared/scorched infrastructure.
- Do not require brass machinery before andesite casing is reachable.
- Do not require Nether/blaze materials for the first primitive circuit table or More Red red-alloy wire.
- Do not require AE2 storage or automation before the AE2 casing tier itself.
- If grout requires netherrack, Nether access must remain reachable before melter/smeltery dependence.

## Deposits And Y Bands

Deposit progression is authored through ADLODS configs, Realistic Ores tags, and KubeJS processing. Active deposit config files exist for aluminum, amethyst, ancient debris, coal, cobalt, copper, diamond, emerald, gas pockets, gold, iridium, iron, lapis, lead, magnetite, nether gold, nether quartz, nickel, osmium, palladium, platinum, redstone, rhodium, ruby, ruthenium, sapphire, silver, thorium, tin, topaz, uranium, and zinc.

The starter catalogue in `global.BTM_STARTER_DEPOSITS` currently names coal measures, ironstone, copper sulfide, tin, zinc, lead-zinc vein, quartz vein, and bauxite laterite. Processing should keep furnace output as a poor fallback, TCon melter/smeltery as first primary interpretation, foundry/byproduct work as better interpretation, and Create/PNCR chemistry as later material identity.

## Magic Gates

Still-Beating Hearts bridge body systems into Blood Magic. `rpgstats:still_beating_heart` is a milestone item, not bulk fuel. Current KubeJS adds pack-owned heart keys and Blood Orb altar recipes in `40_blood_orbs_from_still_beating_hearts.js`; `82_blood_magic_lifeforce_rework.js` makes Blood Altar infrastructure more expensive.

Blood Magic slates are the side-magic authority:

- Blank Slate: first side-magic/workstation permissions such as Hexerei, Malum, and early utility.
- Reinforced Slate: Ars-style entry and Altar II magic.
- Infused Slate: Occultism basics, Tome of Blood, Goety, and comparable mid magic.
- Demonic Slate: Botania runic tier, Forbidden and Arcanus, and stronger magic.
- Ethereal Slate: late programmable or endgame magic where installed and confirmed.

Do not gate guidebooks when a workstation/core item can be gated. Do not use hearts in side-magic recipe spam; use slates and authored intermediates.

Iron's Spells is integrated as a cross-magic spellcraft branch, not as an independent vanilla-crafting branch. `126_cross_magic_irons_spellcraft.js` removes the direct Iron's spellcraft outputs and rebuilds them through Blood Magic tier costs plus Ars apparatus, Botania runic altar, Hexerei cauldron, Malum spirit infusion, and Goety ritual work. Malum spirits are the shared reagent language for schools and upgrades; Occultism, Forbidden and Arcanus, Hexerei, Botania, Goety, Reliquary, and Ars reagents provide theme and tier identity. Low-tier scroll discovery may remain loot-based, but high-tier spell books, upgrade orbs, high inks, and high-tier scroll tables are scrubbed as progression bypasses.

## Late And Post-AE2

AE2 is late local intelligence, not early global logistics. `impossible_machine_casing` should mark the point where AE2-scale systems, high Sophisticated Storage control, and late utility can appear. Post-AE2 branches currently include Protection Pixel, Tome of Blood, TiCEX data files, hooks/drones/backpack utility gates, and Creating Space dimension access gates where the installed mods exist.

Theurgy, Psi, and Hex Casting are not active manifest entries in the current repo. Treat references to them in old reports or generator comments as candidate/future design, not current pack state.
