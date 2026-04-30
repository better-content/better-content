# Empirical Untouched Active Mod Removal A/B Report

Scope: active mods that were not part of the earlier disabled/re-enabled manifest were tested by actually launching the pack and measuring peak RSS through the same loaded-menu settle window. These numbers are empirical menu-load measurements, not jar-size estimates.

## Baseline

- Variant: `empirical_baseline_current_active`
- Peak RSS: `13.50 GiB` / `13827 MiB`
- Loaded mods: `348`
- Block atlas: `32768x16384x4`

## Valid Results Ranked By Measured RSS Win

| Variant | Disabled jars | Peak GiB | Delta GiB | Loaded mods | Block atlas |
|---|---:|---:|---:|---:|---|
| `empirical_combo_abyss_food` | 14 | 9.15 | 4.35 | 333 | `16384x16384x4` |
| `empirical_combo_abyss_explosion` | 2 | 9.21 | 4.29 | 346 | `16384x16384x4` |
| `empirical_cut_abyss2` | 1 | 10.09 | 3.41 | 347 | `16384x16384x4` |
| `empirical_repeat_cut_abyss2` | 1 | 10.16 | 3.34 | 347 | `16384x16384x4` |
| `empirical_cut_top_measured_5` | 6 | 10.23 | 3.27 | 342 | `16384x16384x4` |
| `empirical_combo_abyss_explosion_thalass_food` | 16 | 10.29 | 3.21 | 331 | `16384x16384x4` |
| `empirical_cut_worldgen_terrain_untouched` | 6 | 10.29 | 3.21 | 341 | `16384x16384x4` |
| `empirical_cut_thalassophobia` | 1 | 11.94 | 1.56 | 347 | `32768x16384x4` |
| `empirical_cut_playerrevive` | 1 | 11.97 | 1.53 | 347 | `32768x16384x4` |
| `empirical_cut_food_addons` | 13 | 12.00 | 1.50 | 334 | `32768x16384x4` |
| `empirical_cut_weather2` | 2 | 12.55 | 0.95 | 346 | `32768x16384x4` |
| `empirical_cut_explosion_overhaul` | 1 | 12.60 | 0.90 | 347 | `32768x16384x4` |
| `empirical_cut_thirst_only` | 1 | 12.77 | 0.73 | 347 | `32768x16384x4` |
| `empirical_cut_create_connected` | 1 | 12.81 | 0.69 | 347 | `32768x16384x4` |
| `empirical_repeat_cut_playerrevive` | 1 | 12.81 | 0.69 | 347 | `32768x16384x4` |
| `empirical_cut_build_helpers_only` | 4 | 12.92 | 0.58 | 344 | `32768x16384x4` |
| `empirical_cut_starcatcher` | 1 | 12.94 | 0.56 | 346 | `32768x16384x4` |
| `empirical_cut_create_untouched_clutter` | 12 | 13.12 | 0.38 | 336 | `32768x16384x4` |
| `empirical_baseline_current_active` | 0 | 13.50 | 0.00 | 348 | `32768x16384x4` |
| `empirical_combo_no_abyss_best_valid` | 18 | 13.62 | -0.12 | 329 | `32768x16384x4` |
| `empirical_cut_storage_builders` | 4 | 14.13 | -0.63 | 344 | `32768x16384x4` |
| `empirical_cut_ae2_addons` | 9 | 14.15 | -0.65 | 338 | `32768x16384x4` |

## Invalid Results

These runs did not reach the same modded menu state, usually because mandatory dependencies were removed. Their low RSS values are not valid memory wins.

| Variant | Marker | Peak GiB | Reason |
|---|---|---:|---|
| `empirical_cut_alchemistry_stack` | `menu` | 2.59 | failed before modded menu; no loaded-mod line |
| `empirical_cut_cold_sweat_pair` | `failed` | 2.25 | failed before modded menu; no loaded-mod line |
| `empirical_cut_guideme` | `failed` | 2.25 | failed before modded menu; no loaded-mod line |
| `empirical_cut_pollution` | `failed` | 2.25 | failed before modded menu; no loaded-mod line |
| `empirical_cut_survival_body_untouched` | `menu` | 2.60 | failed before modded menu; no loaded-mod line |

## Conclusions

- `The Abyss II` is the strongest confirmed untouched-active removal candidate. Two isolated runs measured `10.09 GiB` and `10.16 GiB`, both shrinking the block atlas from `32768x16384x4` to `16384x16384x4`.
- `Explosion Overhaul` is a real but smaller isolated win: `12.60 GiB`, about `0.90 GiB` below baseline.
- `Thalassophobia` is a strong isolated win: `11.94 GiB`, about `1.56 GiB` below baseline.
- `Weather2 + CoroUtil` is a moderate isolated win: `12.55 GiB`, about `0.95 GiB` below baseline.
- `Food addon cluster` is a moderate valid win: `12.00 GiB`, about `1.50 GiB` below baseline, but it cuts a lot of food variety.
- `AE2 addon cluster`, `storage/build helpers`, and broad `Create clutter` are not supported as RAM cuts by these measurements; they were weak or worse than baseline in this run set.
- Effects are non-additive. The best valid combo measured here was `Abyss II + food addon cluster` at `9.15 GiB`, closely followed by `Abyss II + Explosion Overhaul` at `9.21 GiB`. A larger combo regressed to `10.29 GiB`, so combination candidates need direct measurement.

## Recommended Next Empirical Step

Run repeat trials for the two best practical cut sets before changing repo contents:

1. `The Abyss II + Explosion Overhaul`
2. `The Abyss II + food addon cluster`
3. `The Abyss II + Explosion Overhaul + only the smallest subset of food addons`
