ServerEvents.recipes(function (event) {
    event.remove({ type: 'create:mixing', output: 'create:brass_ingot' })
    event.remove({ output: 'create:brass_casing' })
    event.custom({
        type: 'create:compacting',
        ingredients: [{ tag: 'forge:stripped_logs' }, { tag: 'forge:plates/brass' }],
        results: [{ item: 'create:brass_casing' }]
    }).id('kubejs:precision_factory/brass_casing')
    event.custom({
        type: 'create:compacting',
        ingredients: [
            { item: 'kubejs:copper_machine_block' }, { item: 'create:brass_casing' },
            { tag: 'forge:plates/brass' }, { tag: 'forge:plates/brass' },
            { tag: 'forge:plates/brass' }, { tag: 'forge:plates/brass' },
            { item: 'create:electron_tube' }, { item: 'create:electron_tube' },
            { item: 'create:polished_rose_quartz' }
        ],
        results: [{ item: 'kubejs:brass_machine_block', count: 4 }]
    }).id('kubejs:precision_factory/brass_machine_block')

    event.remove({ id: 'create:crafting/kinetics/deployer' })
    event.shaped('create:deployer', [' E ', ' B ', ' H '], {
        E: 'create:electron_tube', B: 'kubejs:brass_machine_block', H: 'create:brass_hand'
    }).id('kubejs:precision_factory/direct_root/deployer')
    event.remove({ id: 'create:crafting/kinetics/mechanical_crafter' })
    event.shaped('3x create:mechanical_crafter', [' E ', 'EBE', ' A '], {
        E: 'create:electron_tube', B: 'kubejs:brass_machine_block', A: 'create:andesite_alloy'
    }).id('kubejs:precision_factory/direct_root/mechanical_crafter')
    event.remove({ id: 'create:crafting/kinetics/track_station' })
    event.shaped('create:track_station', [' R ', ' B ', ' S '], {
        R: 'create:railway_casing', B: 'kubejs:brass_machine_block', S: 'create:sturdy_sheet'
    }).id('kubejs:precision_factory/transport_root/track_station')
})
