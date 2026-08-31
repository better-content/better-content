# Balance policy register

This is the canonical human-readable register for pack departures from upstream
behavior. Acquisition channels include recipes, machines/rituals, loot, trades,
worldgen/entity drops, quests/guides, and runtime hooks. Verification is pending
until the fresh distribution smoke snapshot unless marked static.

| Domain | Upstream behavior | Pack behavior | Owner | Rationale | Channels | Verification |
|---|---|---|---|---|---|---|
| Technology eras | Parallel roots | Hand/TCon → Create Powered Works → Create precision/steam → PneumaticCraft + Heat Sync → PowerGrid + More Red → Creating Space | pack progression | Legible capability sequence | recipes, quests, guides | pending runtime |
| Create steam | Native low-cost engine | Brass Machine Block required | Create | Precision proof | recipe | pending runtime |
| Electrical generation | Dynamo, bee, weather, AE2, Ars conversion peers | PowerGrid alone owns stationary generation; OC2R remains a consumer/peer | PowerGrid | One electrical authority | recipes, loot, quests, guides | pending runtime |
| Conventional tools | Many fixed tools | Ordinary fixed tools close; unique weapons and gear remain | Tinkers' Construct | Material-system coherence | recipes, loot, trades | pending runtime |
| Mahogany | Hexerei and Nature's Spirit plus Dynamic Trees | Hexerei inputs convert and Dynamic Trees Hexerei is removed | Nature's Spirit | One material authority | recipes, worldgen, loot | static + pending runtime |
| Hand fishing | Vanilla/TCon rods | Only Starcatcher rods remain | Starcatcher | One fishing system | recipes, loot | pending runtime |
| Petroleum | Create Diesel extraction/distillation | PneumaticCraft splitting supplies retained fuel consumers | PneumaticCraft | Finite process ownership | recipes, machines | pending runtime |
| Ratlantis | Token/portal alternatives | Dimension Font only; token loot and recipes removed | Dimension Font | One entry route | loot, recipes, world | pending runtime |
| Logistics | Ungated roots and hidden post-craft tax | Visible Ratlantis components root Pretty Pipes, Sophisticated automation, Create requests, AE2, Little Logistics, and Rats | Ratlantis Logistics | Player-visible costs | recipes, custom hook | custom tests passed; runtime pending |
| AE2 | Independent start/generators | Energy Acceptor requires PowerGrid, Ratlantis, OC2R, meteor material, and Impossible Matter; AE generators close | AE2 with PowerGrid supply | Conjunctive late root | recipes | pending runtime |
| Occultism parenting | Independent/End-oriented | Hexerei cauldron preparations require Aether, Nether, Bumblezone, and Ratlantis trophies equally | Hexerei | Four-Font parent | cauldron, rituals, guides | pending runtime |
| Blood siblings | Mixed hierarchy | Blood Magic, Malum, and Goety are siblings under Blood; Ars is concurrent | Blood domain | Clear magic ownership | recipes, docs | pending runtime |
| Finite matter | Water/lava and familiar generators | Ars generation glyphs/rituals, Blood sigils/consumers, Drygmy, and Whirlisprig generation close; finite bucket transformations remain | matter policy | No inputless nonliving matter | recipes, rituals | pending runtime |
| Finite space | Occultism remote/infinite storage and mining | Storage controllers/remotes/stabilizers, satchel, wormholes, mineshaft, and miners close; dimensional matrix remains finite | space policy | Bounded storage | recipes, rituals, guides | pending runtime |
| Flight tiers | Creative hooks, top jet/omega, ritual flight | Red Hook creative flight is off; jet boots 4–5 and omega close; listed finite/local alternatives remain | mobility policy | Bounded mobility | config, recipes | pending runtime |
| Stored travel | Warp/recall families | Ars warp, Goety Recall/Call/End Walk, Recall Potion, and Spatial Sign close; local/combat/creature transport and dragon horn remain | mobility policy | No stored-coordinate player travel | recipes, rituals, runtime | pending runtime |
| Fluids | PneumaticCraft can respect infinite sources | Exception off; hose-pulley safeguards remain; strict vanilla sources are deferred | PneumaticCraft | Avoid new fluid migration | config | static |
| Dragon ecology | Vanilla dragon boss products | Vanilla head/egg/breath close and legitimate consumers use generic Ice and Fire tags | Ice and Fire | Closed-End replacement | worldgen, drops, recipes, loot | pending runtime |
| Ice and Fire world | Common defaults | Complete Overworld ecology at least-frequent nonzero settings; wild griefing full, tamed griefing off | Ice and Fire | Rare but complete ecology | config, worldgen | pending runtime |
| Dragonsteel | Native fixed equipment | Armor 8/3/2500; leaked native tools 2500/9; equal TCon materials at 1500, 8.0, 3.0, netherite tier | Tinkers' Construct | Controlled top material | config, recipes, TCon data | pending runtime |
| Closed End | Vanilla portal/city ecosystem | End is inaccessible; orbit biome is `minecraft:is_end`; compatible ecology and rituals move there | Creating Space | Preserve content without End access | dimensions, tags, worldgen | pending runtime |
| End resources | End-only catches/bees/trims/Elytra | Catches move to Ratlantis; bee lineage uses Overworld chorus; trims use rituals; Elytra uses mechanical Ice and Fire inputs | Ice and Fire / magic owners | Finite replacements | fishing, mutations, rituals, recipes | pending runtime |
| Quests | Generated graph plus live SNBT | Nine hand-authored chapters remain; PowerGrid replaces the Dynamo milestone with stable IDs | FTB Quests | One quest source | quests, criteria | pending harness/runtime |
| Quest code | 25 criteria and 38 predicates registered | Exact 12 live criteria and 31 live predicates | Better Content Quests | No dead registrations | custom runtime | custom tests passed; runtime pending |
| Source anchor | Chunk anchor not a SourceManager provider | One Source Anchor exposes 144,000 Source and can pay the 100,000 sink | Arcane Chunk Loaders | Make Impossible Matter payable | custom runtime | custom GameTest passed; pack runtime pending |
| Known debt | Renewable vanilla fluid/stone loops | Explicit non-blocking debt; not claimed compliant | future finite-matter pass | Honest scope | policy | recorded |

Elemental Dragonsteel modifiers are used only if an existing compatible modifier
is present. None was available in the inspected runtime, so the three equal-stat
materials ship without invented custom-code modifiers.
