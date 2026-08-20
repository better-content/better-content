# Realistic Ore Processing

Realistic Ores owns deposit registration, worldgen, block lifecycle, processing
recipes, outputs, tags, and assets for all 23 families. Pack KubeJS does not
register duplicate chunks, crushed feeds, concentrates, washed forms, tailings,
or molten exits.

## Geological lifecycle

Each family exposes a surface sample, placeable small chunk, full ore chunk, and
crushed feed under the `realistic_ores` namespace. Breaking an ordinary deposit
without Silk Touch drops its full family chunk; Silk Touch preserves the block.
Small chunks place the matching surface-sample block and have exactly one
production conversion: nine small chunks become one full chunk. They do not
enter ore-processing tags directly.

Scattered veins and ADLODS are complementary layers. Scattered veins preserve
family-specific host and contact geology; ADLODS supplies a separate
large-deposit exploration layer. Neither silently disables the other. Native
stone/deepslate hosts and runtime Excavated Variants hosts separate and
reassemble losslessly through exact family recipes.

The final families are coal measures, ironstone, copper sulfide, tin, zinc,
lead-zinc vein, quartz vein, bauxite laterite, nickel sulfide, osmiridium lava
sulfide, tin-tungsten greisen, titanium-iron oxide, kimberlite pipe,
emerald-schist beryl, amethyst-beryl pegmatite, uranium ore, thorium ore,
cupriferous redbed redstone vein, lazurite vein, phosphate rock, soul-bearing
black-shale soulstone vein, sulfur-bearing pyrite ore, and gold-quartz vein.

## Three processing stages

1. Mechanical crushing converts a full chunk to crushed feed. Millstones average
   1.1 feed; Crushing Wheels average 1.9.
2. A separation batch consumes four crushed feed, 500 mB water when the route
   requires it, the route's acid packet, and one grinding ball. It always yields
   four primary concentrate; Major, Minor, Trace, and Precious coproducts occur
   at 100%, 50%, 20%, and 5% respectively.
3. Furnace, Melter/Smeltery, or Foundry exits resolve to canonical native or
   ChemLib forms. Ordinary furnace recovery is four nuggets; molten exits follow
   the owning recipe's documented 90–180 mB ladder. TConstruct 1.20 exposes one
   shared melting pool to both the Melter and Smeltery, so those two stations use
   the same 90/120/135 mB values while Foundry routes use 180/150/180 mB. There
   is no generic washed concentrate, assay, universal-solvent, or tailings layer.

Sulfuric and hydrochloric routes begin in Thermal & Pressure. Nitric acid begins
under Electrical Control. Mixed hydrochloric/nitric acid is restricted to the
gold and platinum-group routes declared by the deposit matrix.

## Grinding media

| Ball | Return chance | Role |
| --- | ---: | --- |
| Andesite | 80% | first mechanical concentration |
| Iron | 84% | common base-metal route |
| Brass | 87% | precision route |
| Steel | 91% | pressure-era sulfides |
| Nickel | 93% | heat/acid resistant processing |
| Titanium | 95% | electrical and aerospace-grade route |
| Blood-infused | 97% | optional magic crossing |
| Fluix | 98% | optional post-AE2 crossing |

The ball is returned probabilistically by its recipe; it is not a permanent
catalyst. Route affinity is explicit in the matrix, so a higher return chance
does not make every material valid for every deposit.

## Radioactive families

Uranium and thorium remain normally obtainable. Natural worldgen blocks are
inert until disturbed. Mining, placement, inventory, dropped-item, and container
forms resolve through Latent ChemLib's fixed family profiles without isotope
NBT. Disturbed placed-block state persists, and Latent publishes the matching
heat emission for Heat Sync consumers.
