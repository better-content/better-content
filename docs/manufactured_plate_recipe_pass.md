# Manufactured Plate Recipe Pass

This pass adds `kubejs/server_scripts/30_recipe_replace/130_manufactured_plate_recipe_pass.js`.

## Design Rule

Plain ingots remain acceptable for low-power handcrafting, simple survival items, and ordinary building. Machine-like recipes, route/logistics infrastructure, electronics, storage authority, and automation upgrades should consume manufactured parts.

The pass uses `#forge:plates/iron`, `#forge:plates/copper`, `#forge:plates/gold`, and `#forge:plates/brass` where possible so players can satisfy the requirement through either:

- Create pressing
- TCon molten casting
- existing compatible plate routes

## Covered Families

- Create machines/logistics still using raw metals or redstone.
- Create Connected and diesel/acid-adjacent brass infrastructure.
- Power Grid power blocks and circuits.
- OC2R hardware, boards, memories, and network parts.
- Creating Space rocket parts that were raw-ingot assemblies.
- Little Logistics vessels, docks, route components, and chargers.
- AE2 and AE2 addon gaps not covered by the earlier material economy pass.
- Building Gadgets and Sophisticated automation/storage upgrades.

## Scheduled Follow-Up

Chemlib has many useful plate materials. A follow-up coverage pass should verify that every plate used by progression gates has both a Create pressing route and a TCon casting route where matching molten fluids exist. Missing routes should be added explicitly instead of assuming another mod provides them.

Decorative blocks may have shallow manufacturing depth, but should not become deep mandatory chokepoints. If decorative blocks become expensive, they should also be sideloaded through coin/villager or Wares trade systems.

## Validation

- `node --check kubejs/server_scripts/30_recipe_replace/130_manufactured_plate_recipe_pass.js`
