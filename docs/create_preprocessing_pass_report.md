# Create Preprocessing Pass Report

Implemented `kubejs/server_scripts/40_recipe_add/50_create_deposit_preprocessing.js`.

## Added Chain

- `kubejs:deposit_blocks/<deposit>` -> Realistic Ores crushed deposit item via `create:crushing`.
- Realistic Ores crushed deposit item -> washed primary/trace concentrates via `create:splashing`.
- Realistic Ores crushed deposit item -> improved TCon `melting` and `ore_melting` input.

## Starter Deposits Covered

- coal measures
- ironstone
- copper sulfide
- tin
- zinc
- lead-zinc vein
- quartz vein
- bauxite laterite

## Design Fit

Create improves preparation and concentrate handling, but does not replace TCon metallurgy. The washed outputs are concentrates and trace materials; high-value interpretation still runs through TCon/Foundry or Create/PNCR.
