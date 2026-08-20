ServerEvents.recipes(function (event) {
    event.custom({
        type: 'pneumaticcraft:pressure_chamber', pressure: 4.5,
        inputs: [
            { type: 'pneumaticcraft:stacked_item', item: 'kubejs:electrical_machine_block', count: 1 },
            { type: 'pneumaticcraft:stacked_item', item: 'creatingspace:rocket_casing', count: 2 },
            { type: 'pneumaticcraft:stacked_item', item: 'creatingspace:inconel_sheet', count: 2 },
            { type: 'pneumaticcraft:stacked_item', item: 'creatingspace:hastelloy_ingot', count: 2 },
            { type: 'pneumaticcraft:stacked_item', tag: 'forge:plates/titanium', count: 2 }
        ],
        results: [{ item: 'kubejs:space_machine_block' }]
    }).id('kubejs:aerospace/space_machine_block')

    ;[
        ['creatingspace:rocket_engineer_table', ['ABA', 'SMS', 'ACA'], { A: 'creatingspace:rocket_casing', B: 'creatingspace:engine_structure', M: 'kubejs:space_machine_block', S: 'creatingspace:inconel_sheet', C: 'create:precision_mechanism' }],
        ['creatingspace:mechanical_electrolyzer', ['TST', 'AMA', 'TPT'], { T: '#forge:plates/titanium', S: 'creatingspace:hastelloy_ingot', M: 'kubejs:space_machine_block', A: 'creatingspace:rocket_casing', P: 'pneumaticcraft:pressure_tube' }],
        ['creatingspace:air_liquefier', ['ISI', 'AMA', 'IPI'], { I: 'creatingspace:inconel_sheet', S: 'creatingspace:hastelloy_ingot', M: 'kubejs:space_machine_block', A: 'creatingspace:rocket_casing', P: 'pneumaticcraft:pressure_tube' }]
    ].forEach(function (root) {
        event.remove({ id: root[0] })
        event.shaped(root[0], root[1], root[2]).id('kubejs:aerospace/direct_root/' + root[0].substring('creatingspace:'.length))
    })
})
