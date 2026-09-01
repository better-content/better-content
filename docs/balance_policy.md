# Balance policy register

This is the canonical human-readable register for pack departures from upstream
behavior. Acquisition channels include recipes, machines/rituals, loot, trades,
worldgen/entity drops, quests/guides, and runtime hooks. `Build 181` closes the
final Build 179 audit findings; its fresh distribution smoke and focused checks
passed.

| Domain | Upstream behavior | Pack behavior | Owner | Rationale | Channels | Verification |
|---|---|---|---|---|---|---|
| Technology eras | Parallel roots | Hand/TCon → Create Powered Works → Create precision/steam → PneumaticCraft + Heat Sync → PowerGrid + More Red → Creating Space | pack progression | Legible capability sequence | recipes, quests, guides | Build 181 runtime gate |
| Create steam | Native low-cost engine | Brass Machine Block required | Create | Precision proof | recipe | Build 181 runtime gate |
| Electrical generation | Dynamo, bee, weather, AE2, Ars conversion peers | PowerGrid alone owns stationary electrical generation; OC2R remains a consumer/peer; Creating Space's rocket generator is SU and Clockwork's steam generator is gas-network machinery | PowerGrid | One electrical authority | recipes, loot, quests, guides | Build 181 runtime gate |
| Conventional tools | Many fixed tools | Ordinary fixed tools close; unique weapons and gear remain | Tinkers' Construct | Material-system coherence | recipes, loot, trades | contract-backed recipe/loot gate |
| Mahogany | Hexerei and Nature's Spirit plus Dynamic Trees | Nature's Spirit owns the tree and canonical wood set; retained Hexerei functional/decorative variants consume Nature's Spirit mahogany; Dynamic Trees Hexerei is removed | Nature's Spirit | One material authority | recipes, worldgen, loot | contract-backed recipe/loot gate |
| Hand fishing | Vanilla/TCon rods | Only Starcatcher rods remain | Starcatcher | One fishing system | recipes, loot | contract-backed recipe/loot gate |
| Petroleum | Create Diesel extraction/distillation | PneumaticCraft splitting supplies retained fuel consumers; Create Diesel extraction, scanning, pumping, and both crude-oil distillation recipes close | PneumaticCraft | Finite process ownership | recipes, machines | Build 181 runtime gate |
| Ratlantis | Token/portal alternatives | Dimension Font only; token loot and recipes removed | Dimension Font | One entry route | loot, recipes, world | Build 181 runtime gate |
| Logistics | Ungated roots and hidden post-craft tax | Visible Ratlantis components root Pretty Pipes, Sophisticated automation, Create requests, AE2, Little Logistics, and Rats | Ratlantis Logistics | Player-visible costs | recipes, custom hook | custom test + Build 181 runtime gate |
| AE2 | Independent start/generators | Energy Acceptor requires PowerGrid, Ratlantis, OC2R, meteor material, and Impossible Matter; AE generators close | AE2 with PowerGrid supply | Conjunctive late root | recipes | Build 181 runtime gate |
| Occultism parenting | Independent/End-oriented | Hexerei cauldron preparations require Aether, Nether, Bumblezone, and Ratlantis trophies equally | Hexerei | Four-Font parent | cauldron, rituals, guides | Build 181 runtime gate |
| Blood siblings | Mixed hierarchy | Blood Magic, Malum, and Goety are siblings under Blood; Ars is concurrent | Blood domain | Clear magic ownership | recipes, docs | static + Build 181 runtime gate |
| Finite matter | Water/lava and familiar generators | Ars generation glyphs/rituals, Blood sigils and all six sigil-only consumers, Drygmy, and Whirlisprig generation close; finite bucket transformations remain | matter policy | No inputless nonliving matter | recipes, rituals | Build 181 runtime gate |
| Finite space | Occultism remote/infinite storage and mining | Storage controllers/remotes/stabilizers, satchel, wormholes, mineshaft, and miners close; dimensional matrix remains finite | space policy | Bounded storage | recipes, rituals, guides | Build 181 runtime gate |
| Flight tiers | Creative hooks, top jet/omega, ritual flight | Red Hook creative flight is off; jet boots 4–5 and omega close; listed finite/local alternatives remain | mobility policy | Bounded mobility | config, recipes | static + Build 181 runtime gate |
| Stored travel | Warp/recall families | Ars warp, Goety Recall/Call/End Walk, Recall Potion, and Spatial Sign close; local/combat/creature transport and dragon horn remain | mobility policy | No stored-coordinate player travel | recipes, rituals, runtime | Build 181 runtime gate |
| Fluids | PneumaticCraft can respect infinite sources | Exception off; hose-pulley safeguards remain; strict vanilla sources are deferred | PneumaticCraft | Avoid new fluid migration | config | static |
| Dragon ecology | Vanilla dragon boss products | Vanilla head/egg/breath close and legitimate custom-serializer consumers use generic Ice and Fire tags | Ice and Fire | Closed-End replacement | worldgen, drops, recipes, loot | Build 181 exact-consumer gate |
| Ice and Fire world | Common defaults | Complete Overworld ecology at least-frequent nonzero settings; wild griefing full, tamed griefing off | Ice and Fire | Rare but complete ecology | config, worldgen | static + Build 181 registry gate |
| Dragonsteel | Native fixed equipment | Armor 8/3/2500; leaked native tools 2500/9; equal TCon materials at 1500, 8.0, 3.0, netherite tier | Tinkers' Construct | Controlled top material | config, recipes, TCon data | static + Build 181 registry gate |
| Closed End | Vanilla portal/city ecosystem | End is inaccessible; orbit biome is `minecraft:is_end`; compatible ecology and rituals move there; End City loot injections are disabled | Creating Space | Preserve content without End access | dimensions, tags, worldgen | static + Build 181 worldgen gate |
| End resources | End-only catches/bees/trims/Elytra | Catches move to Ratlantis; bee lineage uses Overworld chorus; trims use rituals; Elytra uses mechanical Ice and Fire inputs | Ice and Fire / magic owners | Finite replacements | fishing, mutations, rituals, recipes | Build 181 runtime gate |
| Quests | Generated graph plus live SNBT | Secondary ledger with three independent ten-node milestone chapters and six optional completionist chapters | FTB Quests | Achievement record, not guidance | quests, criteria | layout review + runtime gate |
| Quest code | 25 criteria and 38 predicates registered | Exact 12 live criteria and 31 live predicates; retired detector branches removed | Better Content Quests | No dead quest work | custom runtime | custom test + runtime gate |
| Source anchor | Chunk anchor not a SourceManager provider | One Source Anchor exposes 144,000 Source and can pay the 100,000 sink | Arcane Chunk Loaders | Make Impossible Matter payable | custom runtime | custom GameTest + Build 181 runtime gate |
| Known debt | Renewable vanilla fluid/stone loops | Explicit non-blocking debt; not claimed compliant | future finite-matter pass | Honest scope | policy | recorded |

Elemental Dragonsteel modifiers are used only if an existing compatible modifier
is present. None was available in the inspected runtime, so the three equal-stat
materials ship without invented custom-code modifiers.

Build 179 supplied the completion baseline: 24,603 normalized recipes, 11,741
loot tables, 4,064 sampled trade offers, zero partial/error evidence, 338
classified server namespaces, and 359 classified client namespaces. Build 181
reduces the effective recipe graph to 24,461 recipes by closing 133
canonical Hexerei wood outputs, six Blood Magic sigil-only consumers, two
Create Diesel distillation recipes, and the remaining vanilla-dragon-head
melting edge while preserving the 16 rewritten dragon consumers.
