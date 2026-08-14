# Realistic Ores processing contract

This is the quick implementation reference beside the recipe generator. The maintained
design rationale and authoring contract live in
[`docs/realistic_ore_processing.md`](../../../docs/realistic_ore_processing.md).

`49_realistic_ores_catalog.js` declares the 22 deposits, material forms, assays, Foundry previews, grinding media, solvents, and curated routes. `57_realistic_ores_smelting_matrix.js` is the only generated furnace/TConstruct authority.

| Feed unit | Furnace | Smeltery | Foundry |
| --- | ---: | ---: | ---: |
| Metal-bearing chunk | 4 nuggets | 8 nuggets | 12 nuggets + mixed-feed preview |
| Crushed metal feed | 1 ingot | 2 ingots | 3 ingots + mixed-feed preview |
| Separated metal concentrate | 2 ingots | 4 ingots | 6 ingots |
| Washed metal concentrate | 3 ingots | 6 ingots | 9 ingots |

Bulk minerals use furnace-equivalent counts `2 → 4 → 8 → 12`; gems use `4 chips → 1 → 2 → 3 gems`. Smeltery and Foundry recipes exist only where the pack has a meaningful molten form. Once the mixer has made constituent-specific concentrates, the Foundry multiplies that constituent rather than splitting the deposit again.
