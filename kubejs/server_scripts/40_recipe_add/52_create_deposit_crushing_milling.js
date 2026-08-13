// Replaced Realistic Ores Create compatibility for crushing/milling processing with
// explicit byproduct control and a weaker normal-milling profile.

function bcRoDepositName(dep) {
    return dep.sample.replace('realistic_ores:surface_sample_', '')
}

function bcRoBuildRecipeResults(chunk, byproduct, host) {
    return [
        { item: chunk },
        { item: host },
        { item: byproduct[0], chance: byproduct[1] }
    ]
}

function bcRoBuildMillingResults(crushed, byproduct) {
    return [
        { item: crushed },
        { item: byproduct[0], chance: byproduct[1] }
    ]
}

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []

    for (var i = 0; i < deposits.length; i++) {
        var dep = deposits[i]
        if (!dep || !dep.chunk || !dep.sample || !dep.crushingByproduct || !dep.millingByproduct) continue

        var deposit = bcRoDepositName(dep)
        var normalDeposit = 'realistic_ores:' + deposit
        var deepslateDeposit = 'realistic_ores:deepslate_' + deposit
        var crushingResults = bcRoBuildRecipeResults(dep.chunk, dep.crushingByproduct, 'minecraft:stone')
        var millingResults = bcRoBuildMillingResults(dep.crushed, dep.millingByproduct)
        var crushingDeepslateResults = bcRoBuildRecipeResults(dep.chunk, dep.crushingByproduct, 'minecraft:deepslate')

        event.remove({ id: 'realistic_ores:compat/create/crushing/' + deposit })
        event.remove({ id: 'realistic_ores:compat/create/crushing/deepslate_' + deposit })

        event.custom({
            type: 'create:crushing',
            ingredients: [{ type: 'forge:nbt', item: normalDeposit }],
            results: crushingResults,
            processingTime: 250
        }).id('realistic_ores:compat/create/crushing/' + deposit)

        event.custom({
            type: 'create:crushing',
            ingredients: [{ type: 'forge:nbt', item: deepslateDeposit }],
            results: crushingDeepslateResults,
            processingTime: 250
        }).id('realistic_ores:compat/create/crushing/deepslate_' + deposit)

        event.custom({
            type: 'create:milling',
            ingredients: [{ type: 'forge:nbt', item: dep.chunk }],
            results: millingResults,
            processingTime: 300
        }).id('kubejs:realistic_ores/milling/' + deposit)
    }
})
