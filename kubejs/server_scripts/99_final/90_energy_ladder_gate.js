// Final authority for the normal-air, first-FE, and AE energy ladder.
//
// Manual/Create workshop -> Rotational Compressor -> normal PNCR air ->
// Pneumatic Dynamo (first FE) -> electrical storage/converters.
// AE receives no native generation or FE injection. The HeatSync transducer
// remains uncraftable until a finite impossible-matter source is implemented.

var BC_ENERGY_RETIRED_COMPRESSORS = [
    'pneumaticcraft:air_compressor',
    'pneumaticcraft:advanced_air_compressor',
    'pneumaticcraft:liquid_compressor',
    'pneumaticcraft:advanced_liquid_compressor',
    'pneumaticcraft:thermal_compressor',
    'pneumaticcraft:manual_compressor',
    'pneumaticcraft:electrostatic_compressor',
    'pneumaticcraft:solar_compressor',
    'pneumaticcraft:flux_compressor',
    'pneumaticcraft:electric_compressor',
    'pneumaticcraft:creative_compressor'
]

var BC_ENERGY_NATIVE_AE_INPUTS = [
    'ae2:energy_acceptor',
    'ae2:cable_energy_acceptor',
    'ae2:energy_cell',
    'ae2:dense_energy_cell',
    'ae2:creative_energy_cell',
    'ae2:crystal_resonance_generator',
    'ae2:vibration_chamber'
]

function bcEnergyRequireItem(id) {
    if (!Item.exists(id)) throw new Error('[BC-ENERGY] Required item is missing: ' + id)
}

function bcEnergyRemoveOutputs(event, outputs) {
    for (var i = 0; i < outputs.length; i++) event.remove({ output: outputs[i] })
}

ServerEvents.recipes(function (event) {
    var required = [
        'compressedcreativity:rotational_compressor',
        'compressedcreativity:compressed_air_engine',
        'pneumaticcraft:pneumatic_dynamo',
        'kubejs:rotational_compressor_core',
        'kubejs:airtight_machine_casing',
        'kubejs:electrical_machine_casing',
        'heatsync:thermal_firebox',
        'heatsync:impossible_matter_transducer'
    ]
    for (var r = 0; r < required.length; r++) bcEnergyRequireItem(required[r])

    bcEnergyRemoveOutputs(event, BC_ENERGY_RETIRED_COMPRESSORS)
    bcEnergyRemoveOutputs(event, BC_ENERGY_NATIVE_AE_INPUTS)

    event.remove({ output: 'compressedcreativity:rotational_compressor' })
    event.shaped('compressedcreativity:rotational_compressor', [
        'PSP',
        'CAC',
        'GKG'
    ], {
        P: 'create:propeller',
        S: 'create:shaft',
        C: 'kubejs:rotational_compressor_core',
        A: 'kubejs:airtight_machine_casing',
        G: 'pneumaticcraft:compressed_iron_gear',
        K: 'create:brass_casing'
    }).id('kubejs:energy_ladder/normal_air/rotational_compressor')

    // This is the first craftable FE source. Its PCB and electrical casing are
    // pressure-chamber work, so the recipe proves operational normal air.
    event.remove({ output: 'pneumaticcraft:pneumatic_dynamo' })
    event.shaped('pneumaticcraft:pneumatic_dynamo', [
        'GTG',
        'PAP',
        'SCS'
    ], {
        G: 'pneumaticcraft:compressed_iron_gear',
        T: 'pneumaticcraft:advanced_pressure_tube',
        P: 'pneumaticcraft:printed_circuit_board',
        A: 'kubejs:electrical_machine_casing',
        S: '#forge:plates/steel',
        C: 'powergrid:copper_coil'
    }).id('kubejs:energy_ladder/first_fe/pneumatic_dynamo')

    // Air-to-SU exists only after first FE and consumes the dynamo rotor/control
    // body. The pinned Compressed Creativity ratios make the return path lossy.
    event.remove({ output: 'compressedcreativity:compressed_air_engine' })
    event.shaped('compressedcreativity:compressed_air_engine', [
        'PTP',
        'RDR',
        'BAB'
    ], {
        P: '#forge:plates/brass',
        T: 'pneumaticcraft:advanced_pressure_tube',
        R: 'compressedcreativity:engine_rotor',
        D: 'pneumaticcraft:pneumatic_dynamo',
        B: '#forge:plates/copper',
        A: 'kubejs:airtight_machine_casing'
    }).id('kubejs:energy_ladder/post_fe/compressed_air_engine')

    // Storage and FE/SU converters consume first-FE hardware, so charged loot
    // or a broad casing recipe cannot skip the normal-air milestone.
    event.remove({ output: 'powergrid:battery' })
    event.shaped('powergrid:battery', [
        'ZSZ',
        'CAC',
        'ZPZ'
    ], {
        Z: '#forge:plates/zinc',
        S: 'chemlib:copper_ii_sulfate',
        C: 'powergrid:capacitor',
        A: 'kubejs:electrical_machine_casing',
        P: 'pneumaticcraft:pneumatic_dynamo'
    }).id('kubejs:energy_ladder/post_fe/powergrid_battery')

    event.remove({ output: 'powergrid:electric_motor' })
    event.shaped('powergrid:electric_motor', [
        'WCW',
        'PAP',
        ' S '
    ], {
        W: 'powergrid:wire',
        C: 'powergrid:copper_coil',
        P: 'pneumaticcraft:pneumatic_dynamo',
        A: 'kubejs:electrical_machine_casing',
        S: 'create:shaft'
    }).id('kubejs:energy_ladder/post_fe/powergrid_electric_motor')

    event.remove({ output: 'powergrid:constant_speed_motor' })
    event.shaped('powergrid:constant_speed_motor', [
        'RMR',
        'PAP',
        'RMR'
    ], {
        R: 'powergrid:redstone_relay',
        M: 'kubejs:electrical_control_module',
        P: 'pneumaticcraft:pneumatic_dynamo',
        A: 'kubejs:electrical_machine_casing'
    }).id('kubejs:energy_ladder/post_fe/powergrid_constant_speed_motor')

    event.remove({ output: 'powergrid:generator_housing' })
    event.shaped('powergrid:generator_housing', [
        'IMI',
        'PAP',
        'IOI'
    ], {
        I: '#forge:plates/iron',
        M: 'kubejs:electrical_control_module',
        P: 'pneumaticcraft:pneumatic_dynamo',
        A: 'kubejs:electrical_machine_casing',
        O: 'chemlib:aluminum_oxide'
    }).id('kubejs:energy_ladder/post_fe/powergrid_generator_housing')

    event.remove({ output: 'powergrid:vertical_generator_housing' })
    event.shaped('powergrid:vertical_generator_housing', [
        'ICI',
        'PAP',
        'III'
    ], {
        I: '#forge:plates/iron',
        C: 'powergrid:generator_commutator',
        P: 'pneumaticcraft:pneumatic_dynamo',
        A: 'kubejs:electrical_machine_casing'
    }).id('kubejs:energy_ladder/post_fe/powergrid_vertical_generator_housing')

    event.remove({ output: 'heatsync:thermal_firebox' })
    event.shaped('heatsync:thermal_firebox', [
        'IPI',
        'PHP',
        'SFS'
    ], {
        I: '#forge:plates/iron',
        P: 'heatsync:heat_pipe',
        H: 'tconstruct:seared_heater',
        S: 'tconstruct:seared_bricks',
        F: 'minecraft:blast_furnace'
    }).id('kubejs:energy_ladder/thermal/firebox')

    // Deliberately no transducer recipe: no installed implementation currently
    // owns finite impossible-matter inventory plus daughter/heat side effects.
    event.remove({ output: 'heatsync:impossible_matter_transducer' })
})
