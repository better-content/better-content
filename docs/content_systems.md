# Content ownership

The modpack owns cross-mod progression policy, six Machine Blocks, genuinely
cross-mod transition items, exact era-root recipes, optional transport gates,
the milestone ledger, and player documentation. Owning mods keep lifecycle and
runtime logic.

| System | Owner | Pack boundary |
| --- | --- | --- |
| Deposits, chunks, samples, processing, grinding balls, canonical outputs | Realistic Ores | Supplies acid/era inputs only; no duplicate ore registration |
| Radioactive profiles, disturbance persistence, emissions | Latent ChemLib | Provides progression recipes and milestone recognition only where the accomplishment remains salient |
| Heat storage/transport and Create Boiler Heater | Heat Sync | Provides era placement; native UI and hover own operating facts |
| Blood Altar bootstrap and tier reference | Blood Magic | Still-Beating Heart plus overworld materials opens the altar; Blood Magic's in-game guide remains the authoritative Tier 1-5 multiblock reference |
| Occult physical components | Hexerei | Hexerei's mixing cauldron manufactures bounded physical Occultism components; Occultism retains rituals, spirit fire, bindings, and servants |
| Occult storage | None | Controller, remote, and satchel acquisition routes are closed; Pretty Pipes is the practical logistics surface |
| Vanilla boat durability, vessel-drop suppression, reinforced recipes | Better Content Fixes | No boat mutation or hiding scripts |
| Wandering-trader visit lifecycle and themed identity | Better Content Fixes | KubeJS authors five themed common offers, one themed rare offer, one Wares agreement, and an optional Font map; every direct payment is a Create Deco coin |
| TCon alloy composition and casting | Tinkers' Construct | Removes bypasses and authors exact cross-mod alloy recipes |
| Kinetic assembly | Create | Uses Machine Blocks only at listed direct roots |
| Pressure chemistry | PneumaticCraft | Pack authors bounded cross-mod acid/root recipes |
| Electrical components | PowerGrid and MoreRed | Electrical Block starts the first generator/design roots |
| Aerospace components | Creating Space | Space Block starts three aerospace roots |

## Stable pack IDs

- `kubejs:andesite_machine_block`
- `kubejs:copper_machine_block`
- `kubejs:brass_machine_block`
- `kubejs:airtight_machine_block`
- `kubejs:electrical_machine_block`
- `kubejs:space_machine_block`

These are clean-break identities. Old `*_machine_casing`, seared/scorched,
circuited, Raw Impossible, and Impossible casing IDs are not part of the public
six-era graph and receive no aliases.

## KubeJS layout

Startup scripts register only the stable Machine Blocks and still-required
pack transition items. Server scripts are grouped by progression era,
transport, compatibility, utility, and narrow removal policy. Mandatory recipes
use exact installed IDs; optional addon recipes use explicit mod-loaded guards.
Scripts do not scan arbitrary recipe JSON, inspect namespaces, or silently skip
mandatory roots.

## Item-hover annotations

Better Content owns one pack-authored item-hover annotation surface. Concise,
item-local pack facts appear through the normal tooltip pipeline, so EMI hover
and ordinary inventory hover show the same annotation. Static records live in
`kubejs/config/hover_annotations.json`; large stable families may instead be
generated from an existing authoritative config, such as formal glyph origins
or the TConstruct/Epic Fight handling catalogue.

Annotations correct a materially wrong or incomplete mental model. They do not
repeat ingredients, layouts, attributes, or ordinary uses that EMI and native
tooltips already communicate. Dynamic stack state remains owned by the source
mod. World events, controls, onboarding, scouting, and other guidance without a
natural item anchor remain on their event, HUD, or world surfaces.

## Achievement ledger

FTB Quests is not a progression guide. Its live authored surface is three
always-visible, independent ten-node chapters—World, Works, and Powers—plus six
optional completionist chapters. Milestones record durable accomplishments and
tease major possibilities; they contain no dependency graph, quest links,
recipe chains, onboarding instructions, or item-local explanatory prose.

Gameplay criteria, stack predicates, dimension or structure tasks, and only
then exact item tasks prove completion. Every player-visible completable quest
awards an authored Create Deco coin that remains manually claimed. Deleted
guide-node rewards are not redistributed. FTB visibility has no pack-authored
unlock policy or book-burning bypass.

The wandering trader is one shared temporary world visitor. Its first scheduled
arrival is after two active-server days, successful visits repeat every five
days, and themes rotate through Naturalist, Surveyor, Quartermaster, and
Antiquarian. Raw vanilla and third-party wandering offers are removed; only the
curated themed stock, Wares agreement, and dimensional Font-map adapter are
allowed, with every residual non-coin or secondary-cost offer disabled as an
integration error.

## New worlds and backups

The refactor supplies no old-world identity migration. Create a tested backup
before updating an existing world. New worlds are the supported baseline because
deposit identities, placed small chunks, disturbed radioactivity, and Machine
Block identities all participate in saved state.
