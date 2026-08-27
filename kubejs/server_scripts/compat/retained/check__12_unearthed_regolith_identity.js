var BC_REGOLITH_STONES = [
    'beige_limestone', 'conglomerate', 'dolomite', 'gabbro',
    'granodiorite', 'grey_limestone', 'kimberlite', 'limestone',
    'mudstone', 'phyllite', 'quartzite', 'rhyolite', 'sandstone',
    'siltstone', 'slate', 'stone', 'white_granite'
]

LootJS.modifiers(function (event) {
    for (var i = 0; i < BC_REGOLITH_STONES.length; i++) {
        var stone = BC_REGOLITH_STONES[i]
        var regolith = 'unearthed:' + stone + '_regolith'
        event.addLootTableModifier('unearthed:blocks/' + stone + '_regolith')
            .replaceLoot('unearthed:regolith', regolith, true)
        event.addLootTableModifier('unearthed:blocks/' + stone + '_grassy_regolith')
            .replaceLoot('unearthed:regolith', regolith, true)
    }
})
