// Replaced Realistic Ores Create compatibility for crushing/milling processing with
// explicit byproduct control and a weaker normal-milling profile.

function bcRoDepositName(dep) {
    return dep.sample.replace('realisticores:surface_sample_', '')
}

function bcRoBuildRecipeResults(chunk, byproduct, host) {
    return [
        { item: chunk },
        { item: host },
        { item: byproduct[0], chance: byproduct[1] }
    ]
}

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []

    for (var i = 0; i < deposits.length; i++) {
        var dep = deposits[i]
        if (!dep || !dep.chunk || !dep.sample || !dep.crushingByproduct || !dep.millingByproduct) continue

        var deposit = bcRoDepositName(dep)
        var normalDeposit = 'realisticores:' + deposit
        var deepslateDeposit = 'realisticores:deepslate_' + deposit
        var crushingResults = bcRoBuildRecipeResults(dep.chunk, dep.crushingByproduct, 'minecraft:stone')
        var millingResults = bcRoBuildRecipeResults(dep.chunk, dep.millingByproduct, 'minecraft:stone')
        var crushingDeepslateResults = bcRoBuildRecipeResults(dep.chunk, dep.crushingByproduct, 'minecraft:deepslate')
        var millingDeepslateResults = bcRoBuildRecipeResults(dep.chunk, dep.millingByproduct, 'minecraft:deepslate')

        event.remove({ id: 'realisticores:compat/create/crushing/' + deposit })
        event.remove({ id: 'realisticores:compat/create/crushing/deepslate_' + deposit })

        event.custom({
            type: 'create:crushing',
            ingredients: [{ type: 'forge:nbt', item: normalDeposit }],
            results: crushingResults,
            processingTime: 250
        }).id('realisticores:compat/create/crushing/' + deposit)

        event.custom({
            type: 'create:crushing',
            ingredients: [{ type: 'forge:nbt', item: deepslateDeposit }],
            results: crushingDeepslateResults,
            processingTime: 250
        }).id('realisticores:compat/create/crushing/deepslate_' + deposit)

        event.custom({
            type: 'create:milling',
            ingredients: [{ type: 'forge:nbt', item: normalDeposit }],
            results: millingResults,
            processingTime: 300
        }).id('kubejs:realistic_ores/milling/' + deposit)

        event.custom({
            type: 'create:milling',
            ingredients: [{ type: 'forge:nbt', item: deepslateDeposit }],
            results: millingDeepslateResults,
            processingTime: 300
        }).id('kubejs:realistic_ores/milling/deepslate_' + deposit)
    }
})
