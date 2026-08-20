# TCon combat animation and DPS map

This pass treats DPS as a hard balance requirement. Utility, manufacturing difficulty, and input difficulty are useful descriptive properties, but none can compensate for a weak damage profile.

## Normalization rule

The melee reference is a clean TCon Sword made from the same offensive material, with wood in every non-offensive slot. The audited profiles are Copper, Cobalt, and Manyullyn. Their head attack values are 0.5, 2.25, and 3.5; the Sword therefore deals `(3 + head attack) × 1.6` DPS.

For a chassis with total offensive-head scale `a` and preserved attack speed `s`, the normalized definition uses base attack damage `3a` and attack-damage multiplier `1.6 / (s × a)`. Better Combat combo attacks have mean damage multiplier 1.0. This produces exactly 100% of same-material Sword DPS before traits, modifiers, armor, and target effects. Global dual-wield speed is 1.0, and the Dagger and Sickle combo multipliers are normalized to mean 1.0 in both single- and dual-wield use.

Chisel has no material head and is the sole fixed exception: it is normalized to the Copper reference (3.2 damage at 1.75 speed, 100%).

## Tools

| Better Combat set | TCon chassis | Preserved speed | Copper / Cobalt / Manyullyn DPS |
|---|---|---:|---:|
| Anchor | `tinkers_things:blockram` | 1.70 | 100% / 100% / 100% |
| Axe | `tconstruct:hand_axe` | 0.90 | 100% / 100% / 100% |
| Claw | `additionalweaponry:sniffer_claws` | 1.50 final | 100% / 100% / 100% |
| Hammer | `tconstruct:sledge_hammer`, `tconstruct:vein_hammer` | 0.75, 0.85 | 100% / 100% / 100% |
| Heavy Axe | `tconstruct:broad_axe` | 0.60 | 100% / 100% / 100% |
| Mace | `tconstruct:excavator`, `tinkers_things:shovel`, `additionalweaponry:wrench` | 1.00, 1.00, 1.50 final | 100% / 100% / 100% |
| Pickaxe | `tconstruct:pickaxe`, `tconstruct:mattock`, `tconstruct:pickadze`, `tconstruct:war_pick`, `tinkers_things:chisel` | 1.20, 0.90, 1.30, 1.20, 1.75 | 100% / 100% / 100%; Chisel Copper-only 100% |
| Scythe | `tconstruct:scythe` | 0.70 | 100% / 100% / 100% |
| Sickle | `tconstruct:kama` | 1.60 | 100% / 100% / 100% |
| Sword | `tinkers_battle_spades:battle_spade` | 1.20 | 100% / 100% / 100% |

## Weapons

| Better Combat set | TCon chassis | Preserved speed | DPS result |
|---|---|---:|---:|
| Axe | `additionalweaponry:butcher_knife` | 1.15 | 100% / 100% / 100% |
| Battlestaff | `construct_arsenal:quarterstaff` | 2.00 | 100% / 100% / 100% |
| Heavy Bow | `tconstruct:longbow` | native | ranged baseline |
| Light Bow | `tinkers_things:shortbow` | native | 100% Longbow projectile proxy |
| Claymore | `tconstruct:cleaver`, `tinkersweaponry:greatsword`, `construct_arsenal:helix_blade` | 1.00, 1.10, 0.50 | 100% / 100% / 100% |
| Coral Blade | `tinkers_khopesh:khopesh` | 1.80 | 100% / 100% / 100% |
| Heavy Crossbow | `tconstruct:crossbow` | native | ranged baseline |
| Light Crossbow | `tconstruct:swasher`, `tinkers_things:blowpipe` | native | 100% Copper Crossbow timing proxy |
| Cutlass | `additionalweaponry:cutlass` | 1.00 | 100% / 100% / 100% |
| Dagger | `tconstruct:dagger` | 2.00 | 100% / 100% / 100% |
| Double Axe | `tconstruct:minotaur_axe` | 0.90 | 100% / 100% / 100% |
| Fist | `construct_arsenal:buckler` | 1.20 | 100% / 100% / 100% |
| Glaive | `additionalweaponry:pitchfork` | 0.80 | 100% / 100% / 100% |
| Halberd | `tinkers_things:halberd` | 0.80 | 100% / 100% / 100% |
| Katana | `tinkers_katanas:katana` | 1.80 | 100% / 100% / 100% |
| Lance | `tinkersweaponry:lance` | 1.80 | 100% / 100% / 100% |
| Mace | `tconstruct:battlesign` | 1.20 | 100% / 100% / 100% |
| Rapier | `tinker_rapier:rapier_tic` | 2.75 | 100% / 100% / 100% |
| Soul Knife | `tinker_rapier:estoc_tic` | 1.80 | 100% / 100% / 100% |
| Spear | `tinkersweaponry:pike` | 1.80 | 100% / 100% / 100% |
| Staff | `tinkers_things:amethyst_staff` | 1.00 | 100% / 100% / 100% |
| Sword | `tconstruct:sword` | 1.60 | reference, 100% |
| Trident | `tconstruct:javelin` | 1.10 | 100% / 100% / 100% |
| Twin Blade | `tinkers_katanas:fuma_shuriken` | 1.30 | 100% / 100% / 100% |
| Wand | `additionalweaponry:scepter` | 1.00 | 100% / 100% / 100% |

All 32 Better Combat animation presets are represented across the two tables. The ranged proxy holds cadence and velocity constant and adjusts projectile damage: Shortbow receives +0.5 projectile damage, Blowpipe is reduced to 0.1, and Swasher uses 1.47. Fluid-specific Swasher effects, ammunition modifiers, traits, and upgrades are outside the clean-chassis comparison.

## Native-use exclusions

These remain on their native cast, throw, block, or utility interaction because forcing a melee preset would misrepresent their primary use:

- Caster staves: `tconstruct:earth_staff`, `tconstruct:ender_staff`, `tconstruct:ichor_staff`, `tconstruct:sky_staff`
- Throwers: `tconstruct:shuriken`, `tconstruct:throwing_axe`, `additionalweaponry:arrow_sling`, `construct_arsenal:throwing_card`
- Shields: `tconstruct:plate_shield`, `tconstruct:travelers_shield`, `tinkers_things:laminar_shield`
- Utility: `tconstruct:fishing_rod`, `tconstruct:flint_and_brick`, `tconstruct:melting_pan`

Scepter and Amethyst Staff are deliberate melee-capable hybrids to cover Wand and Staff. Buckler is the deliberate Fist candidate. Their original blocking/use cadence remains unchanged; one material slot supplies the offensive head stats needed for same-material normalization.
