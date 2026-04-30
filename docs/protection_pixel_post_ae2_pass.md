# Protection Pixel Post-AE2 Pass

## Decision

Protection Pixel is promoted to a post-AE2 body equipment branch.

Advanced AE remains quantum manufacturing and late AE infrastructure. Its quantum armor recipes are removed as the visible armor capstone because Protection Pixel has a broader and stronger equipment surface: armor load platform, armor kits, powered engines, mobility modules, environmental helmets, combat chestplates, and AS upgrades.

## Evidence

Confirmed local surfaces from the installed Protection Pixel jar include:

- `protection_pixel:armorloadplatform`
- `protection_pixel:smallnetheritesheet`
- `protection_pixel:alloyarmorplate`
- `protection_pixel:reinforcedfiber`
- `protection_pixel:heatresistantceramicsheet`
- `protection_pixel:powerengine`
- `protection_pixel:heatoverlockingmechanism`
- `protection_pixel:linkplate_helmet`
- `protection_pixel:linkplate_chestplate`
- `protection_pixel:linkplate_leggings`
- `protection_pixel:linkplate_boots`
- `protection_pixel:steamectoskeleton`
- `protection_pixel:suspjetpack`
- `protection_pixel:maneuveringwing`
- named helmet, chestplate, and leggings lines including `wingsofprismas_chestplate`

The upstream recipe layer is too early for this pack because many recipes are brass, iron, and Create-era. The pass therefore replaces base-part recipes and rewrites surviving named armor recipes to consume post-AE2 components.

## Implemented Gates

MUST DO:

- Proposal: remove Advanced AE quantum armor as the body capstone.
- Evidence: Protection Pixel provides a richer armor/equipment tree than the Advanced AE armor set.
- Why it fits the design: post-AE2 should fan into substantial reward branches, not only stronger storage.
- Risk: players expecting Advanced AE armor must follow the Protection Pixel branch instead.
- Implementation surface: `kubejs/server_scripts/30_recipe_replace/165_protection_pixel_post_ae2_gates.js`.
- Confidence level: high.

MUST DO:

- Proposal: gate Armor Load Platform, Power Engine, Link-Plate armor, Steam Ectoskeleton, jetpack, maneuvering wing, and AS upgrade work behind AE2 casing, quantum alloy, quantum core, fission rods, Ethereal Slate, sky steel, and late ChemLib plates.
- Evidence: these are the workstation/base equipment surfaces that make the mod operational.
- Why it fits the design: this turns late local intelligence, fission heat, magic permission, and extreme-depth material extraction into body-scale power.
- Risk: exact balance of plate counts and fission rod cost needs playtesting.
- Implementation surface: mechanical crafting, sequenced assembly, Create mixing.
- Confidence level: high.

SHOULD DO:

- Proposal: keep most named armor recipes from upstream, but replace cheap inputs with post-AE2 Protection Pixel components.
- Evidence: the named armor catalog is the mod's core reward surface.
- Why it fits the design: preserves content breadth while preventing early bypasses.
- Risk: alternate recipes may still need generated recipe dump verification after reload.
- Implementation surface: `event.replaceInput` safety net for named outputs.
- Confidence level: medium-high.

## Quest Book

Added `Protection Pixel` as a Late Matter Branches chapter. The local flow is:

`Armor Load Platform -> base sheets/fibers/ceramics -> armor plate + power engine -> kits + heat overlock -> Link-Plate / Ectoskeleton / mobility / combat / environment -> AS upgrades`.

The Post-AE2 overview now points to `protection_pixel:armorloadplatform` as the powered armor branch instead of Advanced AE quantum armor.

## Validation Notes

Expected in-game recipe inspection targets:

- `protection_pixel:armorloadplatform`
- `protection_pixel:smallnetheritesheet`
- `protection_pixel:alloyarmorplate`
- `protection_pixel:powerengine`
- `protection_pixel:heatoverlockingmechanism`
- `protection_pixel:linkplate_chestplate`
- `protection_pixel:steamectoskeleton`
- `protection_pixel:suspjetpack`
- `protection_pixel:maneuveringwing`
- `protection_pixel:wingsofprismas_chestplate`

After the next reload, confirm that Advanced AE quantum armor no longer appears as craftable and that named Protection Pixel armor recipes still resolve through the hardened base components.
