# Acid Vat Pass Report

Implemented `kubejs/server_scripts/40_recipe_add/60_acid_vat_deposit_slurries.js`.

## Added Chain

- Realistic Ores crushed deposit item + acid -> named Acid Vat slurry.
- Named slurry -> Chemlib element fractions in Acid Vat centrifuge.

## Acids Used

- Sulfuric acid for sulfide/oxide/laterite-heavy deposits.
- Hydrochloric acid for tin, zinc, and quartz routes.
- Nitric acid for lead-zinc noble trace handling.
- Acetic acid for coal/carbon package handling.

## Covered Starter Deposits

- coal measures -> carbon + iron
- ironstone -> iron + nickel + chromium
- copper sulfide -> copper + iron + gold + sulfur
- tin -> tin + silicon + tungsten
- zinc -> zinc + lead + cadmium
- lead-zinc vein -> lead + zinc + silver
- quartz vein -> silicon + gold + copper
- bauxite laterite -> aluminum + iron + nickel

## Notes

This is dissolver parity through Acid Vat rather than Alchemistry. Alchemistry remains present for recipe reference/compat, but the authored chemistry path is Acid Vat.
