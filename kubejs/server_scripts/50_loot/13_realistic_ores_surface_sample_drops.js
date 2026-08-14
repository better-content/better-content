LootJS.modifiers(function (event) {
    if (!Platform.isLoaded('realistic_ores')) return
    if (!Item.exists('realistic_ores:surface_sample_coal_measures')) return

    // Samples are prospecting hints, not a shortcut around chunk crushing.
    // Replace every sample item emitted by its block loot table with the same
    // host-independent chunk used by ordinary ore mining.
    var deposits = global.BC_REALISTIC_ORES || []
    for (var i = 0; i < deposits.length; i++) {
        var deposit = deposits[i]
        if (!deposit.sample || !deposit.chunk) continue

        var sampleBlock = deposit.sample.split(':')[1]
        if (!sampleBlock) continue

        event.addLootTableModifier('realistic_ores:blocks/' + sampleBlock)
            .replaceLoot(deposit.sample, deposit.chunk, true)
    }
})
