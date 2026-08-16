var BC_HAND_MINEABLE_REGOLITH_STONES = [
    'beige_limestone', 'conglomerate', 'dolomite', 'gabbro',
    'granodiorite', 'grey_limestone', 'kimberlite', 'limestone',
    'mudstone', 'phyllite', 'quartzite', 'rhyolite', 'sandstone',
    'siltstone', 'slate', 'stone', 'white_granite'
]

BlockEvents.modification(function (event) {
    BC_HAND_MINEABLE_REGOLITH_STONES.forEach(function (stone) {
        event.modify('unearthed:' + stone + '_regolith', function (block) {
            block.requiresTool = false
        })
        event.modify('unearthed:' + stone + '_grassy_regolith', function (block) {
            block.requiresTool = false
        })
    })
})
