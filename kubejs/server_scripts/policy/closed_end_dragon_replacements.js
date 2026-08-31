// The vanilla dragon boss is not an acquisition route. Legitimate consumers
// accept finite Ice and Fire ecology products; consumers of cut features have
// already been removed by the quarantine policy.
ServerEvents.recipes(function (event) {
    event.replaceInput({}, 'minecraft:dragon_breath', '#forge:bloods/dragon')
    event.replaceInput({}, 'minecraft:dragon_head', '#forge:skulls/dragon')
    event.replaceInput({}, 'minecraft:dragon_egg', '#forge:eggs/dragon')

    event.remove({ output: 'moreartifacts:hero_shield' })
    event.shaped('moreartifacts:hero_shield', ['SES', 'DHD', ' S '], {
        S: '#forge:ingots/steel', E: '#forge:eggs/dragon',
        D: '#forge:gems/diamond', H: 'minecraft:shield'
    }).id('kubejs:dragon_ecology/moreartifacts_hero_shield')

    event.remove({ output: 'minecraft:elytra' })
    event.custom({
        type: 'create:mechanical_crafting',
        pattern: ['ASA', 'PCP', 'ASA'],
        key: {
            A: { item: 'iceandfire:amphithere_feather' },
            S: { item: 'iceandfire:stymphalian_bird_feather' },
            P: { item: 'iceandfire:pixie_wings' },
            C: { item: 'minecraft:phantom_membrane' }
        },
        result: { item: 'minecraft:elytra' },
        acceptMirrored: false
    }).id('kubejs:dragon_ecology/mechanical_elytra')
    event.shaped('2x minecraft:elytra', ['S S', ' E ', 'S S'], {
        S: '#forge:scales/dragon', E: 'minecraft:elytra'
    }).id('kubejs:dragon_ecology/quark_elytra_duplication')

    event.remove({ output: 'createdeco:netherite_sheet' })
    event.custom({
        type: 'create:pressing',
        ingredients: [{ item: 'minecraft:netherite_ingot' }],
        results: [{ item: 'createdeco:netherite_sheet' }]
    }).id('kubejs:create_deco/netherite_sheet_restore')
})
