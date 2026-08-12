LootJS.modifiers(function (event) {
    if (!Platform.isLoaded('realisticores')) return
    if (!Item.exists('realisticores:surface_sample_coal_measures')) return

    var deposits = global.BC_REALISTIC_ORES || []
    for (var i = 0; i < deposits.length; i++) {
        var deposit = deposits[i]
        if (!deposit.sample || !deposit.chunk) continue

        var sampleBlock = deposit.sample.split(':')[1]
        if (!sampleBlock) continue

        event.addLootTableModifier('realisticores:blocks/' + sampleBlock)
            .replaceLoot(deposit.sample, deposit.chunk, true)
    }
})
