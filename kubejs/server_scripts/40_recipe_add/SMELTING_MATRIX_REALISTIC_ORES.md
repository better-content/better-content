# Realistic Ores Smelting Matrix

Source: proposed processing matrix (furnace fallback, Create/TCon smeltery, and TCon foundry routes).

| Deposit ID | Crushed Item | Furnace fallback | Smeltery (`tconstruct:melting`) | Foundry (`tconstruct:ore_melting`) |
|---|---|---|---|---|
| `coal_measures` | `realistic_ores:crushed_coal_measures` | `minecraft:coal x1` *(blasting x1)* | **Defer** *(no native molten contract yet)* | **Defer** *(add molten route if/when `forge:molten_coal` is introduced)* |
| `ironstone` | `realistic_ores:crushed_ironstone` | `minecraft:iron_nugget x1` *(or direct ingot)* | `forge:molten_iron 90mb @800C` | `forge:molten_iron 180mb @800C` + byproducts: `forge:molten_nickel 45mb`, `forge:molten_chromium 22mb` |
| `copper_sulfide` | `realistic_ores:crushed_copper_sulfide_ore` | `tconstruct:copper_nugget x1` *(or direct ingot)* | `forge:molten_copper 90mb @500C` | `forge:molten_copper 180mb @500C` + byproducts: `forge:molten_iron 45mb`, `forge:molten_gold 22mb` |
| `tin` | `realistic_ores:crushed_tin_ore` | `chemlib:tin_nugget x1` *(or direct ingot)* | `forge:molten_tin 90mb @225C` | `forge:molten_tin 180mb @225C` + byproducts: `tconstruct:molten_quartz 45mb`, `forge:molten_tungsten 22mb` |
| `zinc` | `realistic_ores:crushed_zinc_ore` | `create:zinc_nugget x1` *(or direct ingot)* | `forge:molten_zinc 90mb @420C` | `forge:molten_zinc 180mb @420C` + byproducts: `forge:molten_lead 45mb`, `forge:molten_cadmium 22mb` |
| `lead_zinc_vein` | `realistic_ores:crushed_lead_zinc_vein` | `chemlib:lead_nugget x1` *(or direct ingot)* | `forge:molten_lead 90mb @420C` | `forge:molten_lead 180mb @420C` + byproducts: `forge:molten_zinc 45mb`, `forge:molten_silver 45mb` |
| `quartz_vein` | `realistic_ores:crushed_quartz_vein` | `minecraft:quartz x1+` | `forge:molten_quartz 90mb @1035C` | `forge:molten_quartz 180mb @1035C` + byproducts: `forge:molten_gold 22mb`, `forge:molten_copper 22mb` |
| `bauxite_laterite` | `realistic_ores:crushed_bauxite_laterite` | `chemlib:aluminum_nugget x1` *(or direct ingot)* | `forge:molten_aluminum 90mb @425C` | `forge:molten_aluminum 180mb @425C` + byproducts: `forge:molten_iron 45mb`, `forge:molten_nickel 22mb` |
| `nickel_sulfide` | `realistic_ores:crushed_nickel_sulfide_ore` | `chemlib:nickel_nugget x1` *(or direct ingot)* | `forge:molten_nickel 90mb @950C` | `forge:molten_nickel 180mb @950C` + byproducts: `forge:molten_iron 45mb`, `forge:molten_cobalt 22mb` |
| `osmiridium_lava_sulfide` | `realistic_ores:crushed_osmiridium_lava_sulfide_ore` | `kubejs:osmiridium_concentrate x1` *(or cast-ingot route)* | `tconstruct:molten_osmium 45mb @1450C` | `tconstruct:molten_osmium 90mb @1450C` + byproduct: `forge:molten_platinum 45mb` |
| `tin_tungsten_greisen` | `realistic_ores:crushed_tin_tungsten_greisen` | `chemlib:tin_nugget x1` *(or tungsten route)* | `forge:molten_tungsten 90mb @1450C` | `forge:molten_tungsten 180mb @1450C` + byproducts: `forge:molten_tin 45mb`, `tconstruct:molten_quartz 90mb` |
| `titanium_iron_oxide` | `realistic_ores:crushed_titanium_iron_oxide_ore` | `chemlib:titanium_nugget x1` *(or cast ingot route)* | `kubejs:molten_titanium 90mb @950C` | `kubejs:molten_titanium 180mb @950C` + byproducts: `forge:molten_iron 90mb`, `forge:molten_chromium 22mb` |
| `kimberlite_pipe` | `realistic_ores:crushed_kimberlite_pipe` | `minecraft:diamond x1+` | `tconstruct:molten_diamond 45mb @1450C` | `tconstruct:molten_diamond 90mb @1450C` + byproduct: `forge:molten_nickel 22mb` |
| `emerald_schist_beryl` | `realistic_ores:crushed_emerald_schist_beryl_vein` | `minecraft:emerald x1+` | `tconstruct:molten_emerald 45mb @1450C` | `tconstruct:molten_emerald 90mb @1450C` + byproducts: `forge:molten_aluminum 45mb`, `tconstruct:molten_quartz 22mb` |
| `corundum_beryl_vein` | `realistic_ores:crushed_corundum_beryl_gem_vein` | `minecraft:amethyst_shard x1+` *(or `minecraft:emerald` if preferred)* | `tconstruct:molten_amethyst 45mb @1450C` | `tconstruct:molten_amethyst 90mb @1450C` + byproducts: `tconstruct:molten_emerald 22mb`, `tconstruct:molten_quartz 22mb` |
| `uranium_ore` | `realistic_ores:crushed_uranium_ore` | `kubejs:uranium_concentrate x1` *(or gated ingot route)* | `forge:molten_uranium 90mb @950C` | `forge:molten_uranium 180mb @950C` + byproduct: `forge:molten_lead 45mb` |
| `thorium_ore` | `realistic_ores:crushed_thorium_ore` | `kubejs:thorium_concentrate x1` *(or gated ingot route)* | `kubejs:molten_thorium 90mb @950C` | `kubejs:molten_thorium 180mb @950C` + byproduct: `forge:molten_lead 45mb` |
| `cupriferous_redbed_redstone_vein` | `realistic_ores:crushed_cupriferous_redbed_redstone_vein` | `minecraft:redstone x1+` | **Defer** *(no native molten mapping in current pack)* | **Defer** *(add molten copper/trace route if desired)* |
| `lazurite_vein` | `realistic_ores:crushed_lazurite_vein` | `minecraft:lapis_lazuli x1+` | **Defer** *(no native molten mapping in current pack)* | **Defer** |
| `phosphate_rock` | `realistic_ores:crushed_phosphate_rock` | `chemlib:phosphate x1+` | **Defer** *(no native molten mapping in current pack)* | **Defer** |
| `soul_bearing_black_shale_soulstone_vein` | `realistic_ores:crushed_soul_bearing_black_shale_soulstone_vein` | `minecraft:soul_sand x1+` *(or coal/charcoal fallback variant if preferred)* | **Defer** | **Defer** |
| `sulfur_bearing_pyrite_ore` | `realistic_ores:crushed_sulfur_bearing_pyrite_ore` | `chemlib:sulfur x1+` *(or raw-iron fallback in mixed-route variants)* | **Defer** | **Defer** |

