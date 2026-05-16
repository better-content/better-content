# Acid Vat Retirement Report

Acid Vat is retired from the active pack content layer.

Current status:

- No `acid_vat` mod entry exists under `mods/`.
- No active KubeJS recipe script emits `acid_vat:*` recipes.
- The old deposit slurry generator was removed from `kubejs/server_scripts/40_recipe_add/`.
- Realistic Ores chemistry now lives in the Create mixer acid+ball route.
- PNCR owns pressure, gas, board, and processor chemistry.

Validation:

- `tools/validate_chemistry_identity.mjs` fails if the retired slurry script returns.
- `tools/validate_chemistry_identity.mjs` fails if active KubeJS scripts reference `acid_vat:`.
- `tools/pack_test_suite.mjs` checks that the retired deposit slurry script is absent.
