# Weapon Balance Philosophy

This is the living design authority for weapon balance in Better Content. It records the reasoning that should survive individual tuning passes: what a weapon owes the player, which advantages may alter its damage budget, how comparisons are made, and what must be documented when a weapon breaks the ordinary rules.

The document currently contains only the Tinkers' Construct family philosophy. Other weapon systems should be added as named sections when they receive a deliberate balance pass; they must not be assumed to inherit TCon numbers merely because this is the first completed model.

## Living-document contract

Update this document whenever a balance pass changes a system's reference weapon, normalized damage band, treatment of reach or speed, generic-effect valuation, alternate-mode policy, or exception rules. Put exact machine-readable coefficients in the owning source/config catalogue and keep this document focused on durable reasoning plus the current player-facing map.

Every system section should state:

- its reference weapon and measurement conditions;
- its baseline and permitted spread;
- which usability costs earn damage and which advantages spend it;
- which generic effects count toward effective DPS;
- how AOE, alternate modes, ranged attacks, and signature exceptions are handled;
- the source files that own exact values and the supported validation path.

Balance is not sameness. The goal is a catalogue in which weapons with meaningfully different handling remain credible choices, while no weapon is excused from combat output because it is useful, expensive, rare, or aesthetically distinctive.

## Shared principles

These principles apply unless a later weapon-system section explicitly replaces one and explains why.

1. **DPS is mandatory.** Utility, manufacturing difficulty, rarity, and mob-specific bonuses do not substitute for general combat output.
2. **Normalize baselines, not every build.** Materials, traits, upgrades, affixes, player execution, and encounter conditions may create divergence after the clean chassis is sound.
3. **Costs and advantages are asymmetric.** Short reach and slow commitment are strongly punishing and deserve meaningful compensation. Long reach and high speed are advantages, but their rewards diminish; they should not erase a weapon's damage floor.
4. **Slow attacks hit harder.** Equal raw DPS is only a starting point because missed, interrupted, or overkilling slow swings are costlier. Per-hit damage must visibly express commitment.
5. **Ordinary AOE is not a second damage bar.** Most melee animation sets already cleave or sweep. Ordinary AOE is a useful texture, not grounds for a large DPS penalty; only exceptional, reliable area coverage warrants separate budgeting.
6. **Generic effects count; narrow effects do not.** Armor piercing, armor bypass, unconditional offhand attacks, and generic burst belong in effective DPS. Bonuses restricted to a mob family do not.
7. **Primary and alternate modes are separate budgets.** A throw, charge shot, charged strike, block counter, or cast must not silently inherit permission from the melee baseline.
8. **Animation identity needs a viable carrier.** Every supported animation set should map to at least one weapon or tool that is mechanically credible. Cool or unique animation sets are not reserved for knowingly weak candidates.
9. **Exceptions are explicit and scarce.** A signature move may exceed the ordinary model when preserving it is worth more than mathematical consistency, but the exception must be named rather than hidden inside the baseline.
10. **Tools and weapons remain separate catalogues.** A tool may fight well, but its combat comparison and presentation should not obscure whether its primary identity is work or warfare.

## Tinkers' Construct family

### Scope and intent

The TCon pass normalizes clean chassis across Tinkers' Construct and its installed weapon/tool extensions, then maps them to Better Combat animation sets. It does not promise that every material, trait, upgrade, or encounter will be identical. Its exact coefficients and classifications live in `kubejs/config/tcon_edps_catalogue.json`.

### Baseline

The old flat 100% target is reduced globally. The five relative tiers now occupy the complete 20-point span requested, but `100` means 90% of the former same-material Sword baseline:

| Relative tier | Absolute old-baseline DPS |
|---:|---:|
| 90 | 81.0% |
| 95 | 85.5% |
| 100 | 90.0% |
| 105 | 94.5% |
| 110 | 99.0% |

Ordinary melee keeps its native attack speed and raw material scaling. At zero head stats, its attack multiplier is `absolute tier × 1.6 / (offensive-head scale × attack speed)`. This deliberately makes slower weapons hit harder. Ordinary AOE is usually only a nice-to-have and receives no separate tax.

Armor-sensitive generic innates are solved against the runtime-derived hostile catalogue: 0.0 Trash armor at 60%, 0.1 Elite armor at 30%, and 3.0 Boss-band armor at 10%, with canonical toughness 0. Pierce and the Estoc's generic armor bypass count; Smite, Bane, Antiaquatic, material traits, and upgrades do not. The source snapshot is `docs/tcon_combat_profile.json` (374 hostile types, including 44 high-health boss exclusions).

### Tools

| Better Combat set | Tool | Tier | Preserved speed | Identity |
|---|---|---:|---:|---|
| Axe | Hand Axe | 110 | 0.90 | Compact chopper with a slow, high-payoff axe cadence. |
| Claw | Sniffer Claws | 110 | 1.50 final | Point-blank claws; the top tier pays for punishing reach. |
| Hammer | Sledge Hammer | 110 | 0.75 | Extremely slow blunt mining weapon with large committed hits. |
| Hammer | Vein Hammer | 110 | 0.85 | Heavy multi-block hammer; Pierce II is included in E-DPS. |
| Pickaxe | Mattock | 110 | 0.90 | Short hybrid digging swings with slow-hit compensation. |
| Heavy Axe | Broad Axe | 105 | 0.60 | Slowest two-handed forestry axe and one of the largest hits. |
| Mace | Excavator | 105 | 1.00 | Broad digging head delivered through weighty mace swings. |
| Mace | Shovel | 105 | 1.00 | Conventional one-head digging shovel with blunt attacks. |
| Pickaxe | Pickaxe | 105 | 1.20 | Mining pick with canon-weighted Pierce I. |
| Pickaxe | Pickadze | 105 | 1.30 | Quick pick-adze hybrid and compact overhead pattern. |
| Pickaxe | War Pick | 105 | 1.20 | Melee pick plus a separately budgeted light-crossbow charge. |
| Scythe | Scythe | 105 | 0.70 | Long, slow harvesting sweep; normal cleave is not a DPS substitute. |
| Sword | Battle Spade | 105 | 1.20 | Two-head combat spade using deliberate sword combos. |
| Anchor | Blockram | 100 | 1.70 | Fast utility ram with a separately tracked returning throw. |
| Mace | Wrench | 100 | 1.50 final | Fast engineering implement; convenience does not replace damage. |
| Pickaxe | Chisel | 100 | 1.75 | Fixed-stat precision tool solved at the zero-head reference point. |
| Sickle | Kama | 100 | 1.60 | Fast harvesting sickle with normalized dual-wield combos. |

Shovel and Battle Spade are intentionally different: the Shovel is a conventional one-head tool using blunt mace motion, while the Battle Spade is a two-head dedicated combat chassis with slower sword strings and a higher material damage scale.

### Weapons

| Better Combat set | Weapon | Tier | Preserved speed | Identity |
|---|---|---:|---:|---|
| Cutlass | Cutlass | 110 | 1.00 | Short naval blade rewarded for close-range risk. |
| Dagger | Dagger | 110 | 2.00 | Fast normalized dual-wield strings at very short reach. |
| Fist | Buckler | 110 | 1.20 | Point-blank shield punches, blocking, and a separate throw budget. |
| Light Crossbow | Blowpipe | 110 | native | High-friction rapid ranged chassis at the top ranged tier. |
| Axe | Butcher Knife | 105 | 1.15 | Heavy kitchen blade with axe timing. |
| Claymore | Cleaver | 105 | 1.00 | Classic broad two-handed cleaver. |
| Claymore | Greatsword | 105 | 1.10 | Slow great blade with high per-hit damage; normal AOE is untaxed. |
| Claymore | Helix Blade | 105 | 0.50 | Most committed exotic blade and largest ordinary hit. |
| Double Axe | Minotaur Axe | 105 | 0.90 | Two-head axe; native +7 sprint charge is an explicit epic exception. |
| Glaive | Pitchfork | 105 | 0.80 | Slow polearm with glaive sweeps. |
| Halberd | Halberd | 105 | 0.80 | Poleaxe pattern mixing thrusts and chops. |
| Mace | Battlesign | 105 | 1.20 | Blocking sign with a separate 100-tier charged Bonk budget. |
| Staff | Amethyst Staff | 105 | 1.00 | Melee-capable crystal staff preserving caster identity. |
| Trident | Javelin | 105 | 1.10 | Thrusting spear; throw remains 105 on a per-hit basis. |
| Twin Blade | Fuma Shuriken | 105 | 1.30 | Twin-blade melee form plus a separate returning throw. |
| Wand | Scepter | 105 | 1.00 | One-handed melee wand covering the unique Wand set. |
| Light Bow | Shortbow | 105 | native | Quick light-bow reference. |
| Light Crossbow | Swasher | 105 | native | Fluid-powered light crossbow; fluid effects are excluded. |
| Sword | Sword | 100 | 1.60 | Central melee reference at 90% of the former baseline. |
| Coral Blade | Khopesh | 100 | 1.80 | Fast curved blade with canon-weighted Pierce I. |
| Soul Knife | Estoc | 100 | 1.80 | Generic armor-bypassing secondary damage is included in E-DPS. |
| Heavy Bow | Longbow | 100 | native | Heavy-bow ranged reference at the new centre. |
| Heavy Crossbow | Crossbow | 100 | native | Heavy-crossbow ranged reference at the new centre. |
| Battlestaff | Quarterstaff | 95 | 2.00 | Fast long staff; 95 rather than 90 because it has no Pierce. |
| Katana | Katana | 95 | 1.80 | Fast two-head sword with fluid reach and cadence. |
| Rapier | Rapier | 95 | 2.75 | Very fast thrusting weapon with controlled two-head scaling. |
| Spear | Pike | 95 | 1.80 | Fast long-reach spear, modestly below centre. |
| Lance | Lance | 90 | 1.80 | Fast one-handed 3.5-reach weapon with Pierce I; the sole 90. |

The catalogue covers all 32 Better Combat animation sets. Ranged coefficients are lowered on the same absolute tier scale: Longbow/Crossbow 0.90, Shortbow/Swasher 0.945, and Blowpipe 0.99.

### Alternate modes and exclusions

Returning Blockram, Buckler, and Fuma Shuriken throws use the 100-tier Throwing Axe family target. Javelin throws stay at 105 per hit. Battlesign's charged Bonk and War Pick's charge projectile target 100. These are recorded separately so a strong alternate action cannot silently inflate the melee baseline. The Minotaur Axe sprint charge is the one explicit signature exception.

Caster staves, dedicated throwers, full shields, Fishing Rod, Flint and Brick, and Melting Pan remain native-use exclusions: forcing melee animation or DPS assumptions onto their primary cast, throw, block, or utility interaction would be misleading.

`kubejs/config/tcon_edps_catalogue.json` is authoritative. The repository's supported end-to-end evaluation remains `./smoke.sh`; the catalogue keeps category separation, animation parents, coefficients, Pierce/Estoc armor inputs, and the runtime snapshot reviewable as data.
