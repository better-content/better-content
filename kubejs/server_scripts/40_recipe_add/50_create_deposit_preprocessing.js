// Deterministic water beneficiation. Four crushed feed produce a richer,
// bounded assay; the selected grinding ball is always returned.

function bcRoRepeatItem(results, pair) {
    var result = { item: pair[0] }
    if (pair[1] > 1) result.count = pair[1]
    results.push(result)
}

function bcRoRepeatedIngredient(id, count) {
    var ingredients = []
    for (var i = 0; i < count; i++) ingredients.push({ item: id })
    return ingredients
}

ServerEvents.recipes(function (event) {
    event.remove({ id: 'create:milling/calcite' })

    var deposits = global.BC_REALISTIC_ORES || []
    var balls = global.BC_RO_BALL_BY_ID || {}
    for (var d = 0; d < deposits.length; d++) {
        var dep = deposits[d]
        var ball = balls[dep.ball]
        var ingredients = bcRoRepeatedIngredient(dep.crushed, 4)
        ingredients.push({ item: ball })
        ingredients.push({ fluid: 'minecraft:water', amount: 500 })

        var results = []
        for (var p = 0; p < dep.products.length; p++) bcRoRepeatItem(results, dep.products[p])
        results.push({ item: 'kubejs:mineral_tailings', count: 2 })
        results.push({ item: ball })

        event.custom({
            type: 'create:mixing',
            ingredients: ingredients,
            results: results,
            processingTime: 180
        }).id('kubejs:realistic_ores/beneficiation/' + dep.id)
    }

    event.custom({
        type: 'create:mixing',
        ingredients: [
            { item: 'kubejs:mineral_tailings' }, { item: 'kubejs:mineral_tailings' },
            { item: 'minecraft:clay_ball' }, { fluid: 'minecraft:water', amount: 250 }
        ],
        results: [{ item: 'minecraft:brick' }],
        heatRequirement: 'heated',
        processingTime: 240
    }).id('kubejs:realistic_ores/tailings/clay_recovery')
})
