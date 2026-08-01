// Late authoritative repairs for vanilla recipes replaced or narrowed by mod datapacks.
ServerEvents.recipes(function (event) {
    event.remove({ id: 'minecraft:glass' })
    event.smelting('minecraft:glass', '#minecraft:smelts_to_glass')
        .xp(0.1)
        .cookingTime(200)
        .id('minecraft:glass')

    event.remove({ id: 'minecraft:chest' })
    event.shaped('minecraft:chest', [
        'PPP',
        'P P',
        'PPP'
    ], {
        P: '#minecraft:planks'
    }).id('minecraft:chest')

    event.remove({ id: 'minecraft:barrel' })
    event.shaped('minecraft:barrel', [
        'PSP',
        'P P',
        'PSP'
    ], {
        P: '#minecraft:planks',
        S: '#minecraft:wooden_slabs'
    }).id('minecraft:barrel')
})
