// Realistic Ores smelting and smeltery/foundry integration matrix.

var BC_RO_SMELTING_MATRIX = {
    coal_measures: {
        furnace: { item: 'minecraft:coal', count: 1 },
        melting: null,
        foundry: null
    },
    ironstone: {
        furnace: { item: 'minecraft:iron_ingot', count: 1 },
        melting: { fluid: 'forge:molten_iron', amount: 90, temp: 800 },
        foundry: { fluid: 'forge:molten_iron', amount: 180, temp: 800, byproducts: [['forge:molten_nickel', 45], ['forge:molten_chromium', 22]] }
    },
    copper_sulfide: {
        furnace: { item: 'minecraft:copper_ingot', count: 1 },
        melting: { fluid: 'forge:molten_copper', amount: 90, temp: 500 },
        foundry: { fluid: 'forge:molten_copper', amount: 180, temp: 500, byproducts: [['forge:molten_iron', 45], ['forge:molten_gold', 22]] }
    },
    tin: {
        furnace: { item: 'chemlib:tin_ingot', count: 1 },
        melting: { fluid: 'forge:molten_tin', amount: 90, temp: 225 },
        foundry: { fluid: 'forge:molten_tin', amount: 180, temp: 225, byproducts: [['tconstruct:molten_quartz', 45], ['forge:molten_tungsten', 22]] }
    },
    zinc: {
        furnace: { item: 'create:zinc_ingot', count: 1 },
        melting: { fluid: 'forge:molten_zinc', amount: 90, temp: 420 },
        foundry: { fluid: 'forge:molten_zinc', amount: 180, temp: 420, byproducts: [['forge:molten_lead', 45], ['forge:molten_cadmium', 22]] }
    },
    lead_zinc_vein: {
        furnace: { item: 'chemlib:lead_ingot', count: 1 },
        melting: { fluid: 'forge:molten_lead', amount: 90, temp: 420 },
        foundry: { fluid: 'forge:molten_lead', amount: 180, temp: 420, byproducts: [['forge:molten_zinc', 45], ['forge:molten_silver', 45]] }
    },
    quartz_vein: {
        furnace: { item: 'minecraft:quartz', count: 1 },
        melting: { fluid: 'forge:molten_quartz', amount: 90, temp: 1035 },
        foundry: { fluid: 'forge:molten_quartz', amount: 180, temp: 1035, byproducts: [['forge:molten_gold', 22], ['forge:molten_copper', 22]] }
    },
    bauxite_laterite: {
        furnace: { item: 'chemlib:aluminum_ingot', count: 1 },
        melting: { fluid: 'forge:molten_aluminum', amount: 90, temp: 425 },
        foundry: { fluid: 'forge:molten_aluminum', amount: 180, temp: 425, byproducts: [['forge:molten_iron', 45], ['forge:molten_nickel', 22]] }
    },
    nickel_sulfide: {
        furnace: { item: 'chemlib:nickel_ingot', count: 1 },
        melting: { fluid: 'forge:molten_nickel', amount: 90, temp: 950 },
        foundry: { fluid: 'forge:molten_nickel', amount: 180, temp: 950, byproducts: [['forge:molten_iron', 45], ['forge:molten_cobalt', 22]] }
    },
    osmiridium_lava_sulfide: {
        furnace: { item: 'kubejs:osmiridium_concentrate', count: 1 },
        melting: { fluid: 'tconstruct:molten_osmium', amount: 45, temp: 1450 },
        foundry: { fluid: 'tconstruct:molten_osmium', amount: 90, temp: 1450, byproducts: [['forge:molten_platinum', 45]] }
    },
    tin_tungsten_greisen: {
        furnace: { item: 'chemlib:tin_ingot', count: 1 },
        melting: { fluid: 'forge:molten_tungsten', amount: 90, temp: 1450 },
        foundry: { fluid: 'forge:molten_tungsten', amount: 180, temp: 1450, byproducts: [['forge:molten_tin', 45], ['tconstruct:molten_quartz', 90]] }
    },
    titanium_iron_oxide: {
        furnace: { item: 'chemlib:titanium_ingot', count: 1 },
        melting: { fluid: 'kubejs:molten_titanium', amount: 90, temp: 950 },
        foundry: { fluid: 'kubejs:molten_titanium', amount: 180, temp: 950, byproducts: [['forge:molten_iron', 90], ['forge:molten_chromium', 22]] }
    },
    kimberlite_pipe: {
        furnace: { item: 'minecraft:diamond', count: 1 },
        melting: { fluid: 'tconstruct:molten_diamond', amount: 45, temp: 1450 },
        foundry: { fluid: 'tconstruct:molten_diamond', amount: 90, temp: 1450, byproducts: [['forge:molten_nickel', 22]] }
    },
    emerald_schist_beryl: {
        furnace: { item: 'minecraft:emerald', count: 1 },
        melting: { fluid: 'tconstruct:molten_emerald', amount: 45, temp: 1450 },
        foundry: { fluid: 'tconstruct:molten_emerald', amount: 90, temp: 1450, byproducts: [['forge:molten_aluminum', 45], ['tconstruct:molten_quartz', 22]] }
    },
    corundum_beryl_vein: {
        furnace: { item: 'minecraft:amethyst_shard', count: 1 },
        melting: { fluid: 'tconstruct:molten_amethyst', amount: 45, temp: 1450 },
        foundry: { fluid: 'tconstruct:molten_amethyst', amount: 90, temp: 1450, byproducts: [['tconstruct:molten_emerald', 22], ['tconstruct:molten_quartz', 22]] }
    },
    uranium_ore: {
        furnace: { item: 'kubejs:uranium_concentrate', count: 1 },
        melting: { fluid: 'forge:molten_uranium', amount: 90, temp: 950 },
        foundry: { fluid: 'forge:molten_uranium', amount: 180, temp: 950, byproducts: [['forge:molten_lead', 45]] }
    },
    thorium_ore: {
        furnace: { item: 'kubejs:thorium_concentrate', count: 1 },
        melting: { fluid: 'kubejs:molten_thorium', amount: 90, temp: 950 },
        foundry: { fluid: 'kubejs:molten_thorium', amount: 180, temp: 950, byproducts: [['forge:molten_lead', 45]] }
    },
    cupriferous_redbed_redstone_vein: {
        furnace: { item: 'minecraft:redstone', count: 1 },
        melting: null,
        foundry: null
    },
    lazurite_vein: {
        furnace: { item: 'minecraft:lapis_lazuli', count: 1 },
        melting: null,
        foundry: null
    },
    phosphate_rock: {
        furnace: { item: 'chemlib:phosphate', count: 1 },
        melting: null,
        foundry: null
    },
    soul_bearing_black_shale_soulstone_vein: {
        furnace: { item: 'minecraft:soul_sand', count: 1 },
        melting: null,
        foundry: null
    },
    sulfur_bearing_pyrite_ore: {
        furnace: { item: 'chemlib:sulfur', count: 1 },
        melting: null,
        foundry: null
    }
}

function bcRoByproducts(list) {
    var out = []
    if (!list) return out
    for (var i = 0; i < list.length; i++) out.push({ fluid: list[i][0], amount: list[i][1] })
    return out
}

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []

    for (var i = 0; i < deposits.length; i++) {
        var dep = deposits[i]
        var matrix = BC_RO_SMELTING_MATRIX[dep.id]
        if (!matrix || !dep.crushed) continue

        if (matrix.furnace) {
            var furnaceOutput = { item: matrix.furnace.item }
            if (matrix.furnace.count > 1) furnaceOutput.count = matrix.furnace.count

            event.remove({ type: 'minecraft:smelting', input: dep.crushed })
            event.remove({ type: 'minecraft:blasting', input: dep.crushed })

            event.smelting(furnaceOutput, dep.crushed, 0).id('kubejs:realistic_ores/smelting/fallback/' + dep.id)
            event.blasting(furnaceOutput, dep.crushed, 0).id('kubejs:realistic_ores/blasting/fallback/' + dep.id)
        }

        if (matrix.melting) {
            var melting = {
                type: 'tconstruct:melting',
                ingredient: { item: dep.crushed },
                result: { fluid: matrix.melting.fluid, amount: matrix.melting.amount },
                temperature: matrix.melting.temp
            }
            if (matrix.melting.byproducts) melting.byproducts = bcRoByproducts(matrix.melting.byproducts)
            event.custom(melting).id('kubejs:realistic_ores/melting/' + dep.id)
        }

        if (matrix.foundry) {
            var foundry = {
                type: 'tconstruct:ore_melting',
                ingredient: { item: dep.crushed },
                result: { fluid: matrix.foundry.fluid, amount: matrix.foundry.amount },
                temperature: matrix.foundry.temp
            }
            if (matrix.foundry.byproducts) foundry.byproducts = bcRoByproducts(matrix.foundry.byproducts)
            event.custom(foundry).id('kubejs:realistic_ores/foundry_melting/' + dep.id)
        }
    }
})
