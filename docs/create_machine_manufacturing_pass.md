# Create Machine Manufacturing Pass

This pass applies the active rule that Create machines should be used liberally in the expert recipe graph after early TCon metallurgy is established.

## Changed

In `kubejs/server_scripts/30_recipe_replace/99_machine_casing_progression.js`:

- `kubejs:brass_machine_casing` now uses `create:mechanical_crafting`.
- `kubejs:electrical_machine_casing` now uses `create:mechanical_crafting`.
- `kubejs:circuited_machine_casing` now uses `create:mechanical_crafting`.
- `kubejs:space_machine_casing` now uses `create:mechanical_crafting`.
- `kubejs:impossible_machine_casing` now uses `create:mechanical_crafting`.
- `kubejs:sky_steel_ingot` now uses heated `create:mixing` instead of shaped crafting.
- `kubejs:sky_steel_sheet` remains a Create pressing recipe.
- `kubejs:impossible_machine_casing` uses AE2 cable/processor/sky-stone infrastructure, not `ae2:controller`; the controller is unlocked by the casing rather than consumed by it.

## Why Andesite Stays Different

`kubejs:andesite_machine_casing` cannot require the mechanical crafter because the mechanical crafter itself is gated by the andesite machine casing tier. It remains a normal recipe that consumes deployer-made `create:andesite_casing`, so it still requires the early Create deployer path without deadlocking.

## Design Fit

- TCon still owns the early metallurgy and grout/meltery/smeltery path.
- Create becomes the broad manufacturing authority after andesite alloy and deployer assembly.
- Later casing tiers now visibly require Create infrastructure instead of only a crafting table.
- The casing ladder remains cumulative: each tier consumes the previous tier casing.

## Validation

- `node --check kubejs/server_scripts/30_recipe_replace/99_machine_casing_progression.js`
- `node tools/pack_test_suite.mjs`
