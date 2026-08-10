// Curated acid + grinding-ball processing for Realistic Ores.
// Solvent selects chemistry; the catalogue selects one appropriate ball and a
// fixed assay. Balls are catalysts and are returned in every processing route.

function bcRoExpand(items) {
    var ingredients = []
    for (var i = 0; i < items.length; i++) {
        var value = items[i]
        var copies = value.count || 1
        for (var c = 0; c < copies; c++) {
            if (value.item) ingredients.push({ item: value.item })
            else if (value.tag) ingredients.push({ tag: value.tag })
        }
    }
    return ingredients
}

function bcRoResults(products, ball) {
    var results = []
    for (var i = 0; i < products.length; i++) {
        var result = { item: products[i][0] }
        if (products[i][1] > 1) result.count = products[i][1]
        results.push(result)
    }
    results.push({ item: 'kubejs:mineral_tailings' })
    results.push({ item: ball })
    return results
}

function bcRoCompacting(event, id, output, inputs, heat) {
    var recipe = {
        type: 'create:compacting',
        ingredients: bcRoExpand(inputs),
        results: [{ item: output }]
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id(id)
}

function bcRoComponent(event, id, output, inputs, ball, heat) {
    var results = [{ item: output }]
    if (ball) results.push({ item: ball })
    var recipe = {
        type: 'create:mixing',
        ingredients: bcRoExpand(inputs),
        results: results,
        processingTime: 220
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:realistic_ores/components/' + id)
}

ServerEvents.recipes(function (event) {
    var balls = global.BC_RO_BALL_BY_ID || {}
    var solvents = global.BC_RO_SOLVENT_BY_ID || {}
    var deposits = global.BC_REALISTIC_ORES || []

    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/andesite', balls.andesite, [{ item: 'create:andesite_alloy', count: 5 }])
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/iron', balls.iron, [{ tag: 'forge:ingots/iron', count: 5 }])
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/brass', balls.brass, [{ tag: 'forge:ingots/brass', count: 5 }])
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/steel', balls.steel, [{ tag: 'forge:ingots/steel', count: 4 }, { item: balls.iron }], 'heated')
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/nickel', balls.nickel, [{ tag: 'forge:ingots/nickel', count: 4 }, { item: balls.steel }], 'heated')
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/titanium', balls.titanium, [{ item: 'chemlib:titanium_ingot', count: 4 }, { item: balls.nickel }], 'heated')
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/blood_infused', balls.blood_infused, [{ item: 'bloodmagic:demonslate', count: 3 }, { item: 'minecraft:redstone', count: 3 }, { item: balls.steel }], 'heated')
    bcRoCompacting(event, 'kubejs:realistic_ores/grinding_ball/fluix', balls.fluix, [{ item: 'ae2:fluix_crystal', count: 2 }, { item: 'ae2:certus_quartz_crystal', count: 2 }, { item: balls.steel }], 'heated')

    for (var d = 0; d < deposits.length; d++) {
        var dep = deposits[d]
        if (!dep.leach) continue
        var ball = balls[dep.ball]
        var solvent = solvents[dep.leach.solvent]
        var ingredients = bcRoExpand([{ item: dep.crushed, count: 4 }, { item: ball }])
        var fluidInput = { amount: solvent.amount }
        if (solvent.tag) fluidInput.fluidTag = solvent.tag
        else fluidInput.fluid = solvent.fluid
        ingredients.push(fluidInput)

        var leachRecipe = {
            type: 'create:mixing',
            ingredients: ingredients,
            results: bcRoResults(dep.leach.products, ball),
            processingTime: 260
        }
        if (dep.leach.solvent !== 'ethanol' && dep.leach.solvent !== 'acetic') leachRecipe.heatRequirement = 'heated'
        event.custom(leachRecipe).id('kubejs:realistic_ores/leaching/' + dep.id)
    }

    bcRoComponent(event, 'tungsten_carbide_insert', 'kubejs:tungsten_carbide_insert', [
        { item: 'chemlib:tungsten', count: 2 }, { item: 'chemlib:carbon' }, { item: balls.steel }
    ], balls.steel, 'heated')
    bcRoComponent(event, 'corundum_lapping_grit', 'kubejs:corundum_lapping_grit', [
        { item: 'chemlib:aluminum_oxide' }, { item: 'minecraft:amethyst_shard' }, { item: 'chemlib:beryllium' }, { item: balls.brass }
    ], balls.brass, null)
    bcRoComponent(event, 'mountain_beryl_lens', 'kubejs:mountain_beryl_lens', [
        { item: 'minecraft:emerald' }, { item: 'chemlib:beryllium' }, { item: 'chemlib:silicon_dioxide' }, { item: 'kubejs:corundum_lapping_grit' }
    ], null, 'heated')
    bcRoComponent(event, 'fissile_salt_blend', 'kubejs:fissile_salt_blend', [
        { item: 'chemlib:uranium' }, { item: 'chemlib:thorium' }, { item: 'chemlib:sodium_nitrate' }
    ], null, 'heated')
    bcRoComponent(event, 'soulstone_carbon_matrix', 'kubejs:soulstone_carbon_matrix', [
        { item: 'chemlib:carbon' }, { item: 'chemlib:sulfur' }, { item: 'minecraft:soul_sand' }, { item: balls.blood_infused }
    ], balls.blood_infused, 'heated')
    bcRoComponent(event, 'redbed_signal_salt', 'kubejs:redbed_signal_salt', [
        { item: 'minecraft:redstone' }, { item: 'chemlib:copper_nitrate' }, { item: 'chemlib:iron_oxide' }, { item: balls.iron }
    ], balls.iron, null)
    bcRoComponent(event, 'lazurite_logic_pigment', 'kubejs:lazurite_logic_pigment', [
        { item: 'minecraft:lapis_lazuli' }, { item: 'chemlib:sodium_chloride' }, { item: 'chemlib:aluminum_oxide' }, { item: 'kubejs:redbed_signal_salt' }
    ], null, null)
    bcRoComponent(event, 'phosphate_flux', 'kubejs:phosphate_flux', [
        { item: 'chemlib:phosphoric_acid' }, { item: 'chemlib:phosphorus' }, { item: 'chemlib:calcium' }, { item: 'minecraft:bone_meal' }
    ], null, null)
})
