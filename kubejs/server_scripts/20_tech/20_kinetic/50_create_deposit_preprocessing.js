// Catalog-driven separation and washing for Realistic Ores.

function bcRoFourItems(item) {
    return [{ item: item }, { item: item }, { item: item }, { item: item }]
}

function bcRoAssayGrade(dep, materialId) {
    for (var i = 0; i < dep.assay.length; i++) {
        if (dep.assay[i].id === materialId) return dep.assay[i].grade
    }
    return null
}

function bcRoGradeChance(grade) {
    if (grade === 'major') return 1.0
    if (grade === 'minor') return 0.50
    if (grade === 'trace') return 0.20
    if (grade === 'precious') return 0.05
    return 0
}

function bcRoRouteName(route) {
    return route.ball + '_' + (route.solvent || 'water')
}

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []
    var balls = global.BC_RO_BALL_BY_ID || {}
    var solvents = global.BC_RO_SOLVENT_BY_ID || {}
    var materials = global.BC_RO_MATERIAL_BY_ID || {}

    for (var d = 0; d < deposits.length; d++) {
        var dep = deposits[d]
        var primary = materials[dep.primary]
        if (!primary) continue

        for (var r = 0; r < dep.routes.length; r++) {
            var route = dep.routes[r]
            var ball = balls[route.ball]
            if (!ball) continue

            var ingredients = bcRoFourItems(dep.crushed)
            ingredients.push({ item: ball.item })
            if (route.solvent) {
                ingredients.push({ fluid: 'minecraft:water', amount: 250 })
                var solvent = solvents[route.solvent]
                if (!solvent) continue
                if (solvent.fluidTag) ingredients.push({ fluidTag: solvent.fluidTag, amount: 250 })
                else ingredients.push({ fluid: solvent.fluid, amount: 250 })
            } else {
                ingredients.push({ fluid: 'minecraft:water', amount: 500 })
            }

            var results = [{ item: primary.concentrate, count: 4 }]
            var emitted = {}
            for (var u = 0; u < route.unlocks.length; u++) {
                var materialId = route.unlocks[u]
                if (materialId === dep.primary || emitted[materialId]) continue
                var coproduct = materials[materialId]
                var chance = bcRoGradeChance(bcRoAssayGrade(dep, materialId))
                if (!coproduct || chance <= 0) continue
                var output = { item: coproduct.concentrate }
                if (chance < 1) output.chance = chance
                results.push(output)
                emitted[materialId] = true
            }
            results.push({ item: 'kubejs:mineral_tailings', count: 2 })
            results.push({ item: ball.item, chance: ball.returnChance })

            event.custom({
                type: 'create:mixing',
                ingredients: ingredients,
                results: results,
                processingTime: route.solvent ? 240 : 180
            }).id('kubejs:realistic_ores/separation/' + dep.id + '/' + bcRoRouteName(route))
        }
    }

    var materialList = global.BC_RO_MATERIALS || []
    for (var m = 0; m < materialList.length; m++) {
        var material = materialList[m]
        event.custom({
            type: 'create:splashing',
            ingredients: [{ item: material.concentrate }],
            results: [{ item: material.washed }],
            processingTime: 120
        }).id('kubejs:realistic_ores/washing/' + material.id)
    }

    event.custom({
        type: 'create:mixing',
        ingredients: [
            { item: 'kubejs:mineral_tailings' }, { item: 'kubejs:mineral_tailings' },
            { item: 'minecraft:clay_ball' }, { fluid: 'minecraft:water', amount: 250 }
        ],
        results: [{ item: 'minecraft:brick' }],
        processingTime: 240
    }).id('kubejs:realistic_ores/tailings/clay_recovery')
})
