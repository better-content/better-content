Ore Y-Bands (centralized knobs) - Forge 1.20.1

What this datapack does
- Adds NEW ore generation placed_features for the ores listed below.
- Each ore has its own knob via its own placed_feature (count) and configured_feature (vein size).
- Nether ores are NOT included (no cobalt, no ardite, etc.).

Important notes
- This pack *adds* generation. If a mod also generates the same ore by default, you may get double generation.
  If you want full centralization, disable the original ore-gen via that mod’s config/datapack options (when available),
  or remove their placed_features from biomes.
- All features are added to all Overworld biomes at the UNDERGROUND_ORES step.

Where to tweak knobs
- data/oreyband/worldgen/placed_feature/*.json  -> adjust "count" (frequency) and/or swap to rarity_filter
- data/oreyband/worldgen/configured_feature/*.json -> adjust "size" (vein size) and targets

Band ranges used (absolute Y)
- coal: 0..319
- copper: 30..319
- iron: 0..60
- zinc: 0..319
- tin: 60..319
- saltpeter: 60..319
- aluminum/lead/nickel/lithium: 30..60
- gold/redstone/diamond/emerald/silver/sapphire: 0..30
- titanium/platinum/osmium/tungsten/enderium shard: -30..0
- deepslate titanium/platinum/osmium/tungsten/void_crystal/chlorophyll: -60..-30

This version also removes a set of known vanilla + mod ore placed_features from overworld underground_ores
based on your placed_feature ID list, to reduce double-generation.
