# Realistic Ore Processing

Realistic Ores owns deposit registration, worldgen, block lifecycle, processing
recipes, outputs, tags, and assets. Pack KubeJS does not register duplicate
chunks, crushed feeds, concentrates, tailings, or molten exits.

## First-contact geology

The complete player-facing worldgen roster is deliberately limited to ten
behavioural fantasies:

| Deposit | Immediate promise | Visual identity |
| --- | --- | --- |
| Coal Measures | fuel | broad broken black strata |
| Ironstone | iron and tools | thick rusty bedded bands |
| Copper Bloom | copper | green oxidation around brassy mineralization |
| Tin Quartz | bronze and quartz | white crystal ribbons with dark inclusions |
| Brassroot | zinc and brass | yellow-grey branching roots |
| Redbed | redstone | aggressive red fracture network |
| Evaporite Beds | salt and preservation | pale crystalline beds |
| Gem Pipe | a rare gem jackpot | vertical pipe with indicator crystals |
| Hotstone | dangerous usable heat and heavy matter | dark energetic mineral body |
| Black Shale | supernatural material | black strata with violet contamination |

Oil Seep remains a separate fluid surface feature. Technical materials survive
as assay depth where they have an audited pack use; they do not create additional
worldgen families merely to preserve chemical taxonomy.

Each family exposes authored stone and deepslate blocks, a surface sample whose
item identity is `small_ore_chunk_<family>`, a full `ore_chunk_<family>`, and a
`crushed_<family>` processing feed. Native and Excavated Variants hosts separate
and reassemble losslessly. Scattered family worldgen and ADLODS deposits remain
complementary exploration layers.

## Processing depth

1. Ordinary mining yields one host-independent chunk; Silk Touch preserves the
   exact ore block. Nine small chunks combine into one full chunk.
2. A millstone produces two crushed feeds and Crushing Wheels produce three.
   A full chunk cooks to two primary units; one crushed feed cooks to one.
3. Separation consumes four matching crushed feeds, one route-specific grinding
   ball, and 500 mB of the declared water or acid route. It yields four units of
   primary concentrate plus the route's curated coproduct chances. Create recipes
   are capped at four result entries, including the grinding-ball return; rich
   routes may consume their premium medium to keep that runtime limit.
4. Furnace exits resolve to canonical native or ChemLib forms. TConstruct molten
   exits are metal-only; quartz, gems, salts, carbon, and other nonmetals remain
   item-form outputs.

Gem Pipe and Hotstone use route-specific assay variants, so one legible deposit
fantasy can reveal several late technical profiles without multiplying blocks.
The retained catalogue is 24 audited outputs plus rock salt, sodium chloride,
and saltpeter.

Sulfuric and hydrochloric routes begin in Thermal & Pressure. Nitric acid begins
under Electrical Control. Mixed hydrochloric/nitric acid remains restricted to
the declared precious-metal routes.

## Immediate utility

The processing backend is intentionally deep, but every family must communicate
something before that backend is required. Coal chunks burn directly. Evaporite
material yields Rock Salt for cooking and preservation. Black Shale supports soul
fire and yields soul sand. Gem Pipe yields rough gem chips. Hotstone emits light,
hurts on contact, and can be consolidated into magma.

## Grinding media

| Ball | Return chance | Role |
| --- | ---: | --- |
| Andesite | 80% | first mechanical concentration |
| Iron | 84% | common base-metal route |
| Brass | 87% | precision route |
| Steel | 91% | pressure-era sulfides |
| Nickel | 93% | heat/acid-resistant processing |
| Titanium | 95% | electrical and aerospace route |
| Blood-infused | 97% | optional magic crossing |
| Fluix | 98% | optional post-AE2 crossing |

The ball is returned probabilistically by its recipe. Route affinity is explicit;
a higher return chance does not make every ball valid for every deposit.

## Design contract

World appearance supplies the useful prior; the name confirms the immediate
fantasy; behaviour proves it; EMI supplies the exact assay and recipe details.
The art remains dirty, morphology-first geology with host rock visually dominant.
Systemic Salience does not turn ores into neon aspect tokens.

## Retained constituent utility audit

| Constituent | Why it survives |
| --- | --- |
| Coal, iron, copper, tin, zinc | immediate fuel, tools, bronze, brass, and progression roots |
| Gold, redstone, quartz, lapis | familiar technical and magical crafting economies |
| Diamond, emerald, amethyst | immediate Gem Pipe jackpot value and ordinary gem uses |
| Rock salt, sodium chloride, saltpeter | cooking/preservation first; chemical and nitrate depth later |
| Soul sand, sulfur | immediate Black Shale/soul utility; soul, reagent, and pollution chemistry |
| Aluminum, cobalt, osmium, silver | live TConstruct materials and pack metallurgy/electrum routes |
| Nickel | grinding medium and Creating Space alloy routes |
| Titanium | premium grinding medium, Space Machine Block, aerospace recipes, and molten material |
| Uranium | Hotstone fissile assay, Necronium, nuclear simulation, and Protection Pixel recipes |
| Thorium | Hotstone fissile assay, nuclear decay chain, quests, and Protection Pixel recipes |
| Lead, cadmium | Hotstone/Brassroot assay depth and real placeable-block absorber behavior in Latent's nuclear environment scan |

The removed beryl/beryllium, calcium, carbon, chromium, gallium, iridium,
magnesium, phosphate, platinum, silicon, sodium, tantalum, and tungsten
concentrates had no distinct live consumer strong enough to earn assay output.
Archived Alchemistry configuration is not treated as a live use. The obsolete
`latent_chemlib/material_coefficients` data file was removed because the runtime
nuclear simulation does not load it; absorber evidence comes from the actual
block-ID environment scan.
