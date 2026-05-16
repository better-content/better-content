# Wandering Trader Trade Audit

## Source

- Trade script: `kubejs/server_scripts/35_villager_trades/10_coin_villager_trades.js`
- Trade hook: MoreJS `villagerTrades` and `wandererTrades`
- Currency: Create Deco Dot Coins, not emeralds

## Villager Trade Surface

The script removes vanilla and modded villager trades before rebuilding the village economy as authored coin markets.

Static authored rows in the current script:

| Surface | Authored Rows |
|---|---:|
| Low-tier repeated village buy markets | 90 |
| Industrial iron market | 30 |
| Gold market | 22 |
| Platinum market | 20 |
| Coin exchange rows | 9 |
| Sell-to-villager copper payout rows | 57 |
| Profession-specific buy rows | 136 |
| Normal villager total | 364 |
| Wandering trader market | 167 |

Rows are guarded by `Item.exists`, so missing optional/modded items are skipped at runtime instead of creating broken trades.

## Wandering Trader Pass

Before this pass the wandering trader had only 16 authored offers. The new `BTM_WANDERER_MARKET` contains 167 unique output items:

| Pool | Rows |
|---|---:|
| Level 1 regular pool | 91 |
| Level 2 rare pool | 76 |

Coin tier spread:

| Coin Tier | Rows |
|---|---:|
| Copper | 57 |
| Zinc | 23 |
| Iron | 12 |
| Brass | 15 |
| Gold | 38 |
| Platinum | 22 |

The trader identity is broad travel scarcity rather than mandatory progression:

- ecology and biome recovery: saplings, fungi, flowers, special plants, moss, drip leaves, berries
- dye and decor recovery: full dye set, rare flowers, pottery sherds, armor trim templates
- terrain and building locality: calcite, tuff, mud, podzol, mycelium, packed ice, red sand
- expedition supplies: saddle, leads, name tags, camp supplies, aquatic buckets, navigation tools
- late curios and recovery items: echo shards, sniffer materials, music discs, shulker shell, dragon curios
- limited tech convenience: Create track/tools/diving gear and one PneumaticCraft utility upgrade

The table intentionally avoids selling core machine casings, processors, Blood/Ars capstones, AE2 controller parts, and realistic-ore identity intermediates.
