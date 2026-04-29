# Magic Power-Spike Gate Pass

This pass adds a second Blood Magic gate layer in `kubejs/server_scripts/30_recipe_replace/125_magic_power_spike_gates.js`.

The earlier `80_magic_progression_blood_slate_gates.js` gates first real workstations/core items. This pass targets operational power spikes that the full item graph audit found still relying on plain vanilla valuables after workstation entry.

## Rule

- Guidebooks are not gated.
- Custom gate materials are not added.
- Existing Blood Magic slates are the authority.
- One operational power layer per mod family is preferred over slate spam in every recipe.

## Tier Coverage

| Blood tier | Gate item | Covered systems |
| --- | --- | --- |
| I | `bloodmagic:blankslate` | Hexerei, Malum, Roots Classic, Reliquary entry power |
| II | `bloodmagic:reinforcedslate` | Ars ritual tablets, Ars addons, Nature's Aura generators/autocrafter, Iron's Spells utility |
| III | `bloodmagic:infusedslate` | Goety focus/altar layer, Eidolon altar/focus layer |
| IV | `bloodmagic:demonslate` | Botania engineering blocks, Theurgy incubator/liquefaction layer, Ars Caelum large rituals, Ars Creo/Technica escalation |
| V | `bloodmagic:etherealslate` | Psi, Hex Casting, Hexalia, Mana and Artifice conduits/rituals, Ars Energistique source/AE bridges, Archmage upgrade |

## Hard Removals

- `bloodmagic:teleposer`
- `vampirism:crossbow_arrow_teleport`

These conflict with the normal-logistics rule unless re-authored later as explicit endgame infrastructure.

## Validation

- `node --check kubejs/server_scripts/30_recipe_replace/125_magic_power_spike_gates.js`

Runtime `/reload` is still required because recipe filters depend on KubeJS item/recipe registry state.
