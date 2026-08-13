// Surface samples normalize into the same host-independent chunk as mined ore.
// Oil seeps remain indicators and are not converted into ore.

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []
    for (var d = 0; d < deposits.length; d++) {
        event.custom({
            type: 'create:crushing',
            ingredients: [{ item: deposits[d].sample }],
            results: [{ item: deposits[d].chunk }],
            processingTime: 100
        }).id('kubejs:realistic_ores/sample_to_chunk/' + deposits[d].id)
    }
})
