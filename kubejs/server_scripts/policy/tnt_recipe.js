// TNT deliberately accepts only the two vanilla sands, independent of broad sand tags.
ServerEvents.tags('item', function (event) {
    event.add('kubejs:tnt_sand', 'minecraft:sand')
    event.add('kubejs:tnt_sand', 'minecraft:red_sand')
})

ServerEvents.recipes(function (event) {
    event.remove({ id: 'minecraft:tnt' })
    event.shaped('minecraft:tnt', ['GSG', 'SGS', 'GSG'], {
        G: 'minecraft:gunpowder',
        S: '#kubejs:tnt_sand'
    }).id('minecraft:tnt')
})
