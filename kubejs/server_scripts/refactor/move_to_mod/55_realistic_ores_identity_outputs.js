// Grinding media manufacture and deposit-derived progression components.
// Ore separation recipes themselves are generated from the catalog in 50_*.

function bcRoExpandMediaInputs(items) {
    var ingredients = []
    for (var i = 0; i < items.length; i++) {
        var input = items[i]
        var count = input.count || 1
        for (var c = 0; c < count; c++) {
            if (input.item) ingredients.push({ item: input.item })
            else if (input.tag) ingredients.push({ tag: input.tag })
        }
    }
    return ingredients
}

function bcRoMediaCompacting(event, id, output, inputs) {
    event.custom({
        type: 'create:compacting',
        ingredients: bcRoExpandMediaInputs(inputs),
        results: [{ item: output }]
    }).id('kubejs:realistic_ores/grinding_ball/' + id)
}

function bcRoComponent(event, id, output, inputs, ballId, heat) {
    var results = [{ item: output }]
    if (ballId) {
        var ball = global.BC_RO_BALL_BY_ID[ballId]
        results.push({ item: ball.item, chance: ball.returnChance })
    }
    var recipe = {
        type: 'create:mixing',
        ingredients: bcRoExpandMediaInputs(inputs),
        results: results,
        processingTime: 220
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:realistic_ores/components/' + id)
}

ServerEvents.recipes(function (event) {
    var balls = global.BC_RO_BALL_BY_ID || {}

    bcRoMediaCompacting(event, 'andesite', balls.andesite.item, [{ item: 'create:andesite_alloy', count: 5 }])
    bcRoMediaCompacting(event, 'iron', balls.iron.item, [{ tag: 'forge:ingots/iron', count: 5 }])
    bcRoMediaCompacting(event, 'brass', balls.brass.item, [{ tag: 'forge:ingots/brass', count: 5 }])
    bcRoMediaCompacting(event, 'steel', balls.steel.item, [{ tag: 'forge:ingots/steel', count: 5 }])
    bcRoMediaCompacting(event, 'nickel', balls.nickel.item, [{ tag: 'forge:ingots/nickel', count: 5 }])
    bcRoMediaCompacting(event, 'titanium', balls.titanium.item, [{ item: 'chemlib:titanium_ingot', count: 5 }])
    bcRoMediaCompacting(event, 'blood_infused', balls.blood_infused.item, [
        { item: balls.steel.item }, { item: 'bloodmagic:demonslate', count: 3 }, { item: 'minecraft:redstone', count: 3 }
    ])
    bcRoMediaCompacting(event, 'fluix', balls.fluix.item, [
        { item: balls.steel.item }, { item: 'ae2:fluix_crystal', count: 2 }, { item: 'ae2:certus_quartz_crystal', count: 2 }
    ])

    bcRoComponent(event, 'tungsten_carbide_insert', 'kubejs:tungsten_carbide_insert', [
        { item: 'chemlib:tungsten', count: 2 }, { item: 'chemlib:carbon' }, { item: balls.steel.item }
    ], 'steel', 'heated')
    bcRoComponent(event, 'corundum_lapping_grit', 'kubejs:corundum_lapping_grit', [
        { item: 'chemlib:aluminum_oxide' }, { item: 'minecraft:amethyst_shard' }, { item: 'chemlib:beryllium' }, { item: balls.brass.item }
    ], 'brass', null)
    bcRoComponent(event, 'mountain_beryl_lens', 'kubejs:mountain_beryl_lens', [
        { item: 'minecraft:emerald' }, { item: 'chemlib:beryllium' }, { item: 'chemlib:silicon_dioxide' }, { item: 'kubejs:corundum_lapping_grit' }
    ], null, 'heated')
    bcRoComponent(event, 'soulstone_carbon_matrix', 'kubejs:soulstone_carbon_matrix', [
        { item: 'chemlib:carbon' }, { item: 'chemlib:sulfur' }, { item: 'minecraft:soul_sand' }, { item: balls.blood_infused.item }
    ], 'blood_infused', 'heated')
})
