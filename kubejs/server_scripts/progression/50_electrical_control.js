ServerEvents.recipes(function (event) {
    event.remove({ id: 'powergrid:item_application/conductive_casing' })
    event.custom({
        type: 'create:deploying',
        ingredients: [{ item: 'create:copper_casing' }, { item: 'morered:red_alloy_wire' }],
        results: [{ item: 'powergrid:conductive_casing' }]
    }).id('kubejs:electrical_control/conductive_casing')

    event.custom({
        type: 'pneumaticcraft:pressure_chamber', pressure: 2.0,
        inputs: [
            { type: 'pneumaticcraft:stacked_item', item: 'kubejs:airtight_machine_block', count: 1 },
            { type: 'pneumaticcraft:stacked_item', item: 'powergrid:conductive_casing', count: 1 },
            { type: 'pneumaticcraft:stacked_item', tag: 'forge:plates/copper', count: 4 },
            { type: 'pneumaticcraft:stacked_item', item: 'morered:red_alloy_wire', count: 2 },
            { type: 'pneumaticcraft:stacked_item', item: 'create:electron_tube', count: 1 }
        ],
        results: [{ item: 'kubejs:electrical_machine_block', count: 2 }]
    }).id('kubejs:electrical_control/electrical_machine_block')

    event.remove({ output: 'pneumaticcraft:pneumatic_dynamo' })
    event.shaped('pneumaticcraft:pneumatic_dynamo', ['GTG', 'PMP', 'SCS'], {
        G: 'pneumaticcraft:compressed_iron_gear', T: 'pneumaticcraft:advanced_pressure_tube',
        P: 'pneumaticcraft:printed_circuit_board', M: 'kubejs:electrical_machine_block',
        S: '#forge:ingots/steel', C: 'powergrid:copper_coil'
    }).id('kubejs:electrical_control/direct_root/first_fe_generator')
    event.remove({ id: 'morered:soldering_table' })
    event.shaped('morered:soldering_table', ['PPP', 'WMW', ' C '], {
        P: 'morered:stone_plate', W: 'morered:red_alloy_wire',
        M: 'kubejs:electrical_machine_block', C: '#forge:plates/copper'
    }).id('kubejs:electrical_control/direct_root/circuit_design_station')
})
