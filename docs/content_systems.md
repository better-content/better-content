# Content ownership

The modpack owns cross-mod progression policy, six Machine Blocks, genuinely
cross-mod transition items, exact era-root recipes, optional transport gates,
quests, and player documentation. Owning mods keep lifecycle and runtime logic.

| System | Owner | Pack boundary |
| --- | --- | --- |
| Deposits, chunks, samples, processing, grinding balls, canonical outputs | Realistic Ores | Supplies acid/era inputs only; no duplicate ore registration |
| Radioactive profiles, disturbance persistence, emissions | Latent ChemLib | Provides progression recipes and quest guidance |
| Heat storage/transport and Create Boiler Heater | Heat Sync | Provides era placement and quest guidance |
| Vanilla boat durability, vessel-drop suppression, reinforced recipes | Better Content Fixes | No boat mutation or hiding scripts |
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

## New worlds and backups

The refactor supplies no old-world identity migration. Create a tested backup
before updating an existing world. New worlds are the supported baseline because
deposit identities, placed small chunks, disturbed radioactivity, and Machine
Block identities all participate in saved state.
