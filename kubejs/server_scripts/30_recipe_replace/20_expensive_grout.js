// Any active Dimensional Font route can supply the mineral binder for the first
// seared workshop. The Overworld clay defaults remain removed, so one expedition
// is still required without making Nether the only valid opening.

var BC_FONT_GROUT_BINDERS = [
    { id: 'nether', item: 'minecraft:netherrack' },
    { id: 'aether', item: 'aether:holystone' },
    { id: 'undergarden', item: 'undergarden:deepsoil' },
    { id: 'otherside', item: 'deeperdarker:cobbled_sculk_stone' }
]

ServerEvents.recipes(function (event) {
    event.remove({ output: 'tconstruct:grout' })

    for (var i = 0; i < BC_FONT_GROUT_BINDERS.length; i++) {
        var binder = BC_FONT_GROUT_BINDERS[i]
        event.shapeless(Item.of('tconstruct:grout', 2), [
            binder.item,
            '#minecraft:sand',
            'minecraft:gravel'
        ]).id('kubejs:font_grout/' + binder.id)

        event.shapeless(Item.of('tconstruct:grout', 8), [
            binder.item,
            '#minecraft:sand', '#minecraft:sand', '#minecraft:sand', '#minecraft:sand',
            'minecraft:gravel', 'minecraft:gravel', 'minecraft:gravel', 'minecraft:gravel'
        ]).id('kubejs:font_grout/' + binder.id + '_bulk')
    }
})
