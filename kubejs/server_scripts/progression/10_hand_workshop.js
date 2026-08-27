// Any one active Font can start seared metallurgy. TCon owns alloy composition;
// Create begins only after the hand-cranked workshop is physically reachable.
var BC_FONT_BINDERS = [
    ['nether', 'minecraft:netherrack'],
    ['aether', 'aether:holystone'],
    ['undergarden', 'undergarden:deepsoil'],
    ['otherside', 'deeperdarker:cobbled_sculk_stone']
]

ServerEvents.recipes(function (event) {
    event.remove({ output: 'tconstruct:grout' })
    BC_FONT_BINDERS.forEach(function (font) {
        event.shapeless('2x tconstruct:grout', [font[1], '#minecraft:sand', 'minecraft:gravel'])
            .id('kubejs:hand_workshop/font_grout/' + font[0])
        event.shapeless('8x tconstruct:grout', [font[1], '#minecraft:sand', '#minecraft:sand', '#minecraft:sand', '#minecraft:sand', 'minecraft:gravel', 'minecraft:gravel', 'minecraft:gravel', 'minecraft:gravel'])
            .id('kubejs:hand_workshop/font_grout/' + font[0] + '_bulk')
    })

    event.remove({ type: 'minecraft:crafting_shaped', output: 'create:andesite_alloy' })
    event.remove({ type: 'minecraft:crafting_shapeless', output: 'create:andesite_alloy' })
    event.remove({ type: 'create:mixing', output: 'create:andesite_alloy' })
    event.remove({ id: 'tconstruct:compat/create/andesite_alloy_iron' })
    event.remove({ id: 'tconstruct:compat/create/andesite_alloy_zinc' })

    ;[['iron', 'forge:molten_iron'], ['zinc', 'forge:molten_zinc']].forEach(function (route) {
        event.custom({
            type: 'tconstruct:alloy',
            inputs: [
                { tag: 'tconstruct:seared_stone', amount: 90 },
                { tag: route[1], amount: 90 }
            ],
            result: { fluid: 'kubejs:molten_andesite_alloy', amount: 180 },
            temperature: 800
        }).id('kubejs:hand_workshop/alloying/andesite_alloy_' + route[0])
    })
    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_andesite_alloy', amount: 90 },
        result: 'create:andesite_alloy',
        cooling_time: 50
    }).id('kubejs:hand_workshop/casting/andesite_alloy_ingot')

    event.remove({ id: 'create:crafting/kinetics/hand_crank' })
    event.shaped('create:hand_crank', ['PPP', ' A ', ' S '], {
        P: '#minecraft:planks', A: 'create:andesite_alloy', S: 'create:shaft'
    }).id('kubejs:hand_workshop/hand_crank')
})
