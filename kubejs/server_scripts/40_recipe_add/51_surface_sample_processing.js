// Surface samples are bounded prospecting evidence: eight samples yield one
// crushed feed. Oil seeps remain indicators and are not converted into ore.

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []
    for (var d = 0; d < deposits.length; d++) {
        var ingredients = []
        for (var i = 0; i < 8; i++) ingredients.push({ item: deposits[d].sample })
        event.custom({
            type: 'create:mixing',
            ingredients: ingredients,
            results: [{ item: deposits[d].crushed }],
            processingTime: 300
        }).id('kubejs:realistic_ores/sample_milling/' + deposits[d].id)
    }
})
