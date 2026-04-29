# Validation Report

Date: 2026-04-29

## Static Validation Passed

Commands run successfully after the latest autonomous passes:

```sh
node tools/generate_expert_quest_book.mjs
node tools/validate_quest_dependencies.mjs
find kubejs/server_scripts -name '*.js' -print0 | xargs -0 -n1 node --check
node tools/expert_graph_audit.mjs
packwiz refresh
git diff --check
```

## Current Generated State

- Quest chapters: 20
- Quest count: 197
- Quest dependency refs: 207
- Quest/reward/task IDs checked: 1187
- Villager trade rows parsed by audit: 140
- Recipe dump records scanned by audit: 50077

## Confirmed Static Fixes

- Andesite alloy non-alloying recipes are explicitly removed by KubeJS.
- Andesite casing is deployer-only in the pack script.
- Later custom machine casings use Create mechanical crafting.
- Sky Steel ingots use heated Create mixing and Sky Steel sheets use Create pressing.
- Emerald currency loot in non-block loot tables is explicitly replaced with Dot Coin tiers by LootJS.
- Quest rewards use copper-only Starting Out rewards and cumulative coin-tier rewards elsewhere.
- Acid Vat source remains read-only; pack scripts only reference exposed Acid Vat items.

## In-Game Validation Still Required

- Launch a disposable instance and run `/reload`.
- Confirm no KubeJS, LootJS, MoreJS, FTB Quests, or recipe loading errors in logs.
- Open FTB Quests and verify description rendering, dependencies, chapter order, and rewards.
- Spawn each villager profession and wandering trader; confirm Dot Coin trades replace emerald trades.
- Open representative loot chests and confirm emerald currency has become Dot Coins while ore/block drops remain intact.
- Check EMI/JEI visibility for later machine casing mechanical crafting and Sky Steel mixing/pressing.
- Re-run after the Acid Vat mod agent lands changes.

## Nuclear synthesis integration

- Added `mods/fission_reactor-0.1.0.jar`.
- Added `mods/gases_and_plasmas-0.1.0.jar`.
- Added pack-side fission/fusion gate recipes in `140_nuclear_synthesis_power_gates.js`.
- Reworked the electricity chapter into SU Heat and Electricity.
- Added the Fusion Power and Plasma quest chapter.
