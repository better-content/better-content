# Food Effect Graph Dump

The pack now has a runtime food audit dump for building food progression and quest-book graphs from real item data instead of hand-maintained guesses.

## How To Generate

1. Set `enabled` to `true` in `kubejs/config/audit_dumps.json`.
2. Keep `writeFoodEffectIndex` as `true`.
3. Start the pack or run `/reload`.
4. Read:
   - `kubejs/config/food_effect_index.json`
   - `kubejs/config/food_effect_summary.json`

## What It Captures

- item id
- namespace
- description id
- nutrition
- saturation modifier
- meat / always-eat / fast-food flags
- item tags where available
- fixed food effects from vanilla/Forge `FoodProperties`
- effect amplifier, duration, probability, and visibility flags

## Known Limit

This is intentionally a runtime dump, but it only sees food effects exposed through `FoodProperties`. If a mod applies effects only in custom item-use code, the food will still appear as food, but its hidden behavior may not appear in the effect list. Those cases should be handled with mod-specific adapters after the dump identifies suspicious high-value foods with no visible effects.

## Graph Use

Use `food_effect_summary.json` for the first quest-book pass:

- group by effect for buff-route nodes
- use nutrition and saturation for expedition-stock tiers
- promote foods with strong effects, high duration, or rare ingredients into progression gates
- keep ordinary foods in showcase/catalogue nodes

After the dump exists, run:

```sh
node tools/analyze_food_effect_graph.mjs
```

This writes:

- `docs/food_effect_graph_audit.md`
- `kubejs/config/food_effect_progression_candidates.json`
