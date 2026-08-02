// Valkyrien Skies family transport progression.
// - Eureka watercraft follows primitive, non-metal TConstruct workstations.
// - Trackwork land propulsion follows the Create railway/precision milestone.
// - Powered Eureka/Clockwork flight requires both Aether proof and Airtight casing work.

var BC_VS_TRANSPORT = {
    airtight: 'kubejs:airtight_machine_casing',
    railway: 'create:railway_casing',
    precision: 'create:precision_mechanism',
    aercloud: 'aether:blue_aercloud',
    aerogel: 'aether:aerogel',
    ambrosium: 'aether:ambrosium_shard',
    holystone: 'aether:holystone',
    zanite: 'aether:zanite_gemstone',
    skyroot: 'aether:skyroot_stick',
    quicksoilGlass: 'aether:quicksoil_glass',
    compressedIron: 'pneumaticcraft:ingot_iron_compressed',
    pressureTube: 'pneumaticcraft:pressure_tube',
    pressureSeal: 'kubejs:pressure_seal',
    pcb: 'pneumaticcraft:printed_circuit_board',
    wanderliteMatrix: 'vs_clockwork:wanderlite_matrix'
}

var BC_EUREKA_HELM_WOODS = [
    'oak',
    'spruce',
    'birch',
    'jungle',
    'acacia',
    'dark_oak',
    'crimson',
    'warped'
]

function bcVsShaped(event, output, pattern, keys, id, count) {
    event.remove({ output: output })
    var result = count && count > 1 ? (count + 'x ' + output) : output
    event.shaped(result, pattern, keys).id(id)
}

function bcVsFactory(event, output, pattern, keys, id, count) {
    event.remove({ output: output })
    global.bcFactoryCrafting(event, id, output, count || 1, pattern, keys, true)
}

function bcVsPressure(event, output, count, pressure, inputs, id) {
    event.remove({ output: output })
    global.bcPncrPressure(event, id, output, count || 1, pressure, inputs)
}

ServerEvents.recipes(function (event) {
    // Primitive exploration hook: a working ship is the first payoff for building
    // the Part Builder and Tinker Station. Material-bearing TCon parts match by
    // item id, so wood, stone, bone, and later replacements all remain valid.
    for (var i = 0; i < BC_EUREKA_HELM_WOODS.length; i++) {
        var wood = BC_EUREKA_HELM_WOODS[i]
        bcVsShaped(event, 'vs_eureka:' + wood + '_ship_helm', [
            ' H ',
            'FSF',
            'P P'
        ], {
            H: 'tconstruct:tool_handle',
            F: 'minecraft:' + wood + '_fence',
            S: 'minecraft:' + wood + '_slab',
            P: 'minecraft:' + wood + '_planks'
        }, 'kubejs:vs_transport/eureka/' + wood + '_ship_helm')
    }

    bcVsShaped(event, 'vs_eureka:engine', [
        'CRC',
        'BHB',
        'LFL'
    ], {
        C: '#forge:cobblestone',
        R: 'tconstruct:repair_kit',
        B: 'tconstruct:small_blade',
        H: 'tconstruct:tool_handle',
        L: '#minecraft:logs',
        F: 'minecraft:furnace'
    }, 'kubejs:vs_transport/eureka/primitive_engine')

    bcVsShaped(event, 'vs_eureka:floater', [
        'SPS',
        'PRP',
        'SPS'
    ], {
        S: 'minecraft:string',
        P: '#minecraft:planks',
        R: 'tconstruct:repair_kit'
    }, 'kubejs:vs_transport/eureka/primitive_floater', 8)

    bcVsShaped(event, 'vs_eureka:ballast', [
        'CRC',
        'RTR',
        'CCC'
    ], {
        C: '#forge:cobblestone',
        R: 'tconstruct:repair_kit',
        T: 'tconstruct:tool_binding'
    }, 'kubejs:vs_transport/eureka/primitive_ballast', 4)

    bcVsShaped(event, 'vs_eureka:anchor', [
        ' H ',
        'SBS',
        'CCC'
    ], {
        H: 'tconstruct:tool_handle',
        S: 'minecraft:string',
        B: 'tconstruct:small_blade',
        C: '#forge:cobblestone'
    }, 'kubejs:vs_transport/eureka/primitive_anchor')

    // Trackwork is the rough-terrain peer to Create trains. Every independent
    // propulsion root crosses both railway casing and precision mechanisms.
    bcVsFactory(event, 'trackwork:simple_wheel_part', [
        'KAK',
        'RCP',
        'KAK'
    ], {
        K: 'minecraft:dried_kelp',
        A: 'create:andesite_alloy',
        R: BC_VS_TRANSPORT.railway,
        C: 'create:cogwheel',
        P: BC_VS_TRANSPORT.precision
    }, 'kubejs:vs_transport/trackwork/simple_wheel_part', 2)

    bcVsShaped(event, 'trackwork:small_simple_wheel_part', [
        ' K ',
        'KPK',
        ' K '
    ], {
        K: 'minecraft:dried_kelp',
        P: 'trackwork:simple_wheel_part'
    }, 'kubejs:vs_transport/trackwork/small_simple_wheel_part')

    bcVsShaped(event, 'trackwork:med_simple_wheel_part', [
        ' K ',
        'GPG',
        ' K '
    ], {
        K: 'minecraft:dried_kelp',
        G: 'create:cogwheel',
        P: 'trackwork:simple_wheel_part'
    }, 'kubejs:vs_transport/trackwork/med_simple_wheel_part')

    bcVsShaped(event, 'trackwork:large_simple_wheel_part', [
        'KDK',
        'GPG',
        'KDK'
    ], {
        K: 'minecraft:dried_kelp',
        D: 'minecraft:dried_kelp_block',
        G: 'create:large_cogwheel',
        P: 'trackwork:simple_wheel_part'
    }, 'kubejs:vs_transport/trackwork/large_simple_wheel_part')

    bcVsFactory(event, 'trackwork:phys_track', [
        'APA',
        'RCR',
        'BBB'
    ], {
        A: 'create:andesite_alloy',
        P: BC_VS_TRANSPORT.precision,
        R: BC_VS_TRANSPORT.railway,
        C: 'create:cogwheel',
        B: 'create:belt_connector'
    }, 'kubejs:vs_transport/trackwork/phys_track', 2)

    bcVsFactory(event, 'trackwork:suspension_track', [
        'MPM',
        'RCR',
        'BBB'
    ], {
        M: 'create:mechanical_piston',
        P: BC_VS_TRANSPORT.precision,
        R: BC_VS_TRANSPORT.railway,
        C: 'create:cogwheel',
        B: 'create:belt_connector'
    }, 'kubejs:vs_transport/trackwork/suspension_track', 2)

    bcVsShaped(event, 'trackwork:track_level_controller', [
        ' E ',
        'MCM',
        ' R '
    ], {
        E: 'create:electron_tube',
        M: 'create:mechanical_piston',
        C: BC_VS_TRANSPORT.precision,
        R: BC_VS_TRANSPORT.railway
    }, 'kubejs:vs_transport/trackwork/track_level_controller')

    bcVsShaped(event, 'trackwork:track_tool_kit', [
        'CTC',
        'WRH',
        ' P '
    ], {
        C: '#forge:plates/copper',
        T: 'create:red_toolbox',
        W: 'create:wrench',
        R: BC_VS_TRANSPORT.railway,
        H: 'create:hand_crank',
        P: BC_VS_TRANSPORT.precision
    }, 'kubejs:vs_transport/trackwork/track_tool_kit')

    bcVsShaped(event, 'trackwork:horn', [
        ' B ',
        'NRN',
        ' A '
    ], {
        B: '#forge:plates/brass',
        N: 'minecraft:note_block',
        R: BC_VS_TRANSPORT.railway,
        A: 'create:andesite_alloy'
    }, 'kubejs:vs_transport/trackwork/horn')

    // Aether proves buoyancy; Airtight casing proves the sealed manufacture
    // needed for powered flight. Cheap wool/paper/leather/membrane routes are
    // removed explicitly so no native balloon bypass survives.
    var balloonBypassIds = [
        'vs_eureka:balloon_leather',
        'vs_eureka:balloon_membrane',
        'vs_eureka:balloon_paper',
        'vs_eureka:balloon_wool'
    ]
    for (var j = 0; j < balloonBypassIds.length; j++) event.remove({ id: balloonBypassIds[j] })
    event.remove({ output: 'vs_eureka:balloon' })
    global.bcFactoryCrafting(event, 'kubejs:vs_transport/eureka/aether_balloon', 'vs_eureka:balloon', 8, [
        'CAC',
        'ABA',
        'CIC'
    ], {
        C: 'farmersdelight:canvas',
        A: BC_VS_TRANSPORT.aerogel,
        B: BC_VS_TRANSPORT.aercloud,
        I: BC_VS_TRANSPORT.airtight
    }, true)

    // Aerodynamic parts each carry Aether identity. Functional controllers,
    // bearings, and engines additionally consume an Airtight casing.
    bcVsFactory(event, 'vs_clockwork:propeller_blade', [
        ' SQ',
        'SIQ',
        'S  '
    ], {
        S: BC_VS_TRANSPORT.skyroot,
        Q: BC_VS_TRANSPORT.quicksoilGlass,
        I: 'create:iron_sheet'
    }, 'kubejs:vs_transport/clockwork/propeller_blade', 4)

    bcVsFactory(event, 'vs_clockwork:wide_propeller_blade', [
        'BQB',
        'SIS',
        ' B '
    ], {
        B: 'vs_clockwork:propeller_blade',
        Q: BC_VS_TRANSPORT.quicksoilGlass,
        S: BC_VS_TRANSPORT.skyroot,
        I: 'create:iron_sheet'
    }, 'kubejs:vs_transport/clockwork/wide_propeller_blade', 2)

    bcVsFactory(event, 'vs_clockwork:flap', [
        'CAC',
        'SIS',
        'CAC'
    ], {
        C: 'farmersdelight:canvas',
        A: BC_VS_TRANSPORT.aerogel,
        S: BC_VS_TRANSPORT.skyroot,
        I: 'create:iron_sheet'
    }, 'kubejs:vs_transport/clockwork/flap', 4)

    bcVsFactory(event, 'vs_clockwork:wing', [
        'FQF',
        'BAB',
        'FQF'
    ], {
        F: 'vs_clockwork:flap',
        Q: BC_VS_TRANSPORT.quicksoilGlass,
        B: '#forge:plates/brass',
        A: BC_VS_TRANSPORT.aerogel
    }, 'kubejs:vs_transport/clockwork/wing', 4)

    bcVsFactory(event, 'vs_clockwork:balloon_casing', [
        'BBB',
        'BAB',
        'BBB'
    ], {
        B: 'vs_eureka:balloon',
        A: '#forge:plates/brass'
    }, 'kubejs:vs_transport/clockwork/balloon_casing', 8)

    bcVsFactory(event, 'vs_clockwork:blade_controller', [
        ' P ',
        'AIA',
        ' B '
    ], {
        P: BC_VS_TRANSPORT.precision,
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight,
        B: 'vs_clockwork:propeller_blade'
    }, 'kubejs:vs_transport/clockwork/blade_controller')

    bcVsFactory(event, 'vs_clockwork:juryrigged_propeller_bearing', [
        ' B ',
        'AIA',
        ' M '
    ], {
        B: 'vs_clockwork:blade_controller',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight,
        M: 'create:mechanical_bearing'
    }, 'kubejs:vs_transport/clockwork/juryrigged_propeller_bearing')

    bcVsFactory(event, 'vs_clockwork:brass_propeller_bearing', [
        ' P ',
        'ABA',
        ' C '
    ], {
        P: BC_VS_TRANSPORT.precision,
        A: BC_VS_TRANSPORT.ambrosium,
        B: 'vs_clockwork:juryrigged_propeller_bearing',
        C: 'create:brass_casing'
    }, 'kubejs:vs_transport/clockwork/brass_propeller_bearing')

    bcVsFactory(event, 'vs_clockwork:phys_bearing', [
        'TMT',
        'AIA',
        ' P '
    ], {
        T: 'create:turntable',
        M: BC_VS_TRANSPORT.wanderliteMatrix,
        A: BC_VS_TRANSPORT.aercloud,
        I: BC_VS_TRANSPORT.airtight,
        P: BC_VS_TRANSPORT.pcb
    }, 'kubejs:vs_transport/clockwork/phys_bearing')

    bcVsFactory(event, 'vs_clockwork:command_seat', [
        ' W ',
        'LIL',
        'APA'
    ], {
        W: '#minecraft:wool',
        L: 'create:linked_controller',
        I: BC_VS_TRANSPORT.airtight,
        A: BC_VS_TRANSPORT.ambrosium,
        P: BC_VS_TRANSPORT.pcb
    }, 'kubejs:vs_transport/clockwork/command_seat')

    bcVsFactory(event, 'vs_clockwork:gas_thruster', [
        'DAD',
        'PIP',
        'DAD'
    ], {
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.aerogel,
        P: 'vs_clockwork:propeller_blade',
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/gas_thruster')

    bcVsFactory(event, 'vs_clockwork:gas_engine', [
        ' D ',
        'AIA',
        ' T '
    ], {
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight,
        T: 'create:fluid_tank'
    }, 'kubejs:vs_transport/clockwork/gas_engine')

    // Aether-native material proof. Clockwork's disabled meteor/ore features do
    // not provide a survival origin, so PNCR synthesis owns the first Nyx and
    // Wanderlite transitions while the native decorative conversions remain.
    bcVsPressure(event, 'vs_clockwork:cobbled_nyx', 4, 2.0, [
        { id: BC_VS_TRANSPORT.holystone, count: 4 },
        { id: BC_VS_TRANSPORT.ambrosium, count: 2 },
        { id: BC_VS_TRANSPORT.compressedIron, count: 2 }
    ], 'kubejs:vs_transport/clockwork/material/cobbled_nyx')

    bcVsFactory(event, 'vs_clockwork:charged_nyx', [
        'AMA',
        'NSN',
        'AMA'
    ], {
        A: BC_VS_TRANSPORT.ambrosium,
        M: BC_VS_TRANSPORT.aercloud,
        N: 'vs_clockwork:nyx',
        S: BC_VS_TRANSPORT.pressureSeal
    }, 'kubejs:vs_transport/clockwork/material/charged_nyx', 2)

    bcVsPressure(event, 'vs_clockwork:wanderlite_crystal', 4, 3.0, [
        { id: 'vs_clockwork:charged_nyx', count: 1 },
        { id: BC_VS_TRANSPORT.zanite, count: 2 },
        { id: BC_VS_TRANSPORT.aerogel, count: 2 },
        { id: BC_VS_TRANSPORT.compressedIron, count: 1 }
    ], 'kubejs:vs_transport/clockwork/material/wanderlite_crystal')
    event.shapeless('9x vs_clockwork:wanderlite_crystal', ['vs_clockwork:wanderlite_block'])
        .id('kubejs:vs_transport/clockwork/material/wanderlite_crystal_from_block')

    // Basic Aether/Airtight flight structure and general ship mechanisms.
    bcVsFactory(event, 'vs_clockwork:balloon_encased_shaft', [
        ' B ',
        'SAS',
        ' B '
    ], {
        B: 'vs_clockwork:balloon_casing',
        S: 'create:shaft',
        A: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/basic/balloon_encased_shaft', 2)

    bcVsFactory(event, 'vs_clockwork:andesite_flap_bearing', [
        ' F ',
        'AIA',
        ' C '
    ], {
        F: 'vs_clockwork:flap',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight,
        C: 'create:andesite_casing'
    }, 'kubejs:vs_transport/clockwork/basic/andesite_flap_bearing')

    bcVsFactory(event, 'vs_clockwork:spinoff_bearing', [
        ' T ',
        'AIA',
        ' C '
    ], {
        T: 'create:turntable',
        A: BC_VS_TRANSPORT.aercloud,
        I: BC_VS_TRANSPORT.airtight,
        C: 'create:andesite_casing'
    }, 'kubejs:vs_transport/clockwork/basic/spinoff_bearing', 2)

    bcVsFactory(event, 'vs_clockwork:universal_shaft', [
        ' S ',
        'AIA',
        ' S '
    ], {
        S: 'create:shaft',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/basic/universal_shaft', 2)

    bcVsFactory(event, 'vs_clockwork:universal_shaft_item', [
        ' K ',
        'SPS',
        ' K '
    ], {
        K: 'minecraft:dried_kelp',
        S: 'vs_clockwork:universal_shaft',
        P: BC_VS_TRANSPORT.pressureSeal
    }, 'kubejs:vs_transport/clockwork/basic/universal_shaft_item')

    bcVsFactory(event, 'vs_clockwork:redstone_resistor', [
        ' W ',
        'DID',
        ' S '
    ], {
        W: 'morered:red_alloy_wire',
        D: 'morered:diode',
        I: BC_VS_TRANSPORT.airtight,
        S: 'create:shaft'
    }, 'kubejs:vs_transport/clockwork/basic/redstone_resistor')

    bcVsFactory(event, 'vs_clockwork:screwdriver', [
        '  I',
        ' A ',
        'S  '
    ], {
        I: BC_VS_TRANSPORT.compressedIron,
        A: BC_VS_TRANSPORT.ambrosium,
        S: BC_VS_TRANSPORT.skyroot
    }, 'kubejs:vs_transport/clockwork/basic/screwdriver')

    bcVsFactory(event, 'vs_clockwork:sugar_rocket', [
        ' P ',
        'GAG',
        'SIS'
    ], {
        P: 'minecraft:paper',
        G: 'minecraft:gunpowder',
        A: BC_VS_TRANSPORT.ambrosium,
        S: 'minecraft:sugar',
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/basic/sugar_rocket', 2)

    bcVsFactory(event, 'vs_clockwork:goo_block', [
        'ASA',
        'SGS',
        'ASA'
    ], {
        A: BC_VS_TRANSPORT.aerogel,
        S: BC_VS_TRANSPORT.pressureSeal,
        G: 'minecraft:slime_block'
    }, 'kubejs:vs_transport/clockwork/basic/goo_block')

    // Clockwork gas hardware is a PNCR child rather than a cheap parallel gas
    // bootstrap. Derived ducts inherit the Airtight and pressure-tube root.
    bcVsFactory(event, 'vs_clockwork:duct', [
        'ITI',
        'TAT',
        'ITI'
    ], {
        I: BC_VS_TRANSPORT.compressedIron,
        T: BC_VS_TRANSPORT.pressureTube,
        A: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/pressure/duct', 8)

    bcVsFactory(event, 'vs_clockwork:duct_tank', [
        ' D ',
        'STS',
        ' D '
    ], {
        D: 'vs_clockwork:duct',
        S: BC_VS_TRANSPORT.pressureSeal,
        T: 'pneumaticcraft:small_tank'
    }, 'kubejs:vs_transport/clockwork/pressure/duct_tank')

    bcVsFactory(event, 'vs_clockwork:air_compressor', [
        ' D ',
        'CAC',
        ' S '
    ], {
        D: 'vs_clockwork:duct',
        C: BC_VS_TRANSPORT.compressedIron,
        A: BC_VS_TRANSPORT.airtight,
        S: 'kubejs:rotational_compressor_core'
    }, 'kubejs:vs_transport/clockwork/pressure/air_compressor')

    bcVsFactory(event, 'vs_clockwork:coal_burner', [
        ' D ',
        'AIA',
        ' F '
    ], {
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight,
        F: 'minecraft:furnace'
    }, 'kubejs:vs_transport/clockwork/pressure/coal_burner')

    bcVsFactory(event, 'vs_clockwork:pump_duct', [
        ' C ',
        'DTD',
        ' T '
    ], {
        C: 'create:cogwheel',
        D: 'vs_clockwork:duct',
        T: BC_VS_TRANSPORT.pressureTube
    }, 'kubejs:vs_transport/clockwork/pressure/pump_duct')

    bcVsFactory(event, 'vs_clockwork:redstone_duct', [
        ' W ',
        'DDD',
        ' R '
    ], {
        W: 'morered:red_alloy_wire',
        D: 'vs_clockwork:duct',
        R: 'vs_clockwork:redstone_resistor'
    }, 'kubejs:vs_transport/clockwork/pressure/redstone_duct')

    bcVsFactory(event, 'vs_clockwork:valve_duct', [
        ' S ',
        'DTD',
        ' S '
    ], {
        S: BC_VS_TRANSPORT.pressureSeal,
        D: 'vs_clockwork:duct',
        T: BC_VS_TRANSPORT.pressureTube
    }, 'kubejs:vs_transport/clockwork/pressure/valve_duct')

    bcVsFactory(event, 'vs_clockwork:gas_nozzle', [
        ' B ',
        'DID',
        ' A '
    ], {
        B: 'vs_clockwork:propeller_blade',
        D: 'vs_clockwork:duct',
        I: BC_VS_TRANSPORT.compressedIron,
        A: BC_VS_TRANSPORT.aerogel
    }, 'kubejs:vs_transport/clockwork/pressure/gas_nozzle')

    bcVsFactory(event, 'vs_clockwork:steam_generator', [
        ' C ',
        'DTD',
        ' A '
    ], {
        C: '#forge:plates/copper',
        D: 'vs_clockwork:duct',
        T: BC_VS_TRANSPORT.pressureTube,
        A: BC_VS_TRANSPORT.ambrosium
    }, 'kubejs:vs_transport/clockwork/pressure/steam_generator')

    bcVsFactory(event, 'vs_clockwork:exhaust', [
        ' B ',
        'DAD',
        ' B '
    ], {
        B: 'minecraft:iron_bars',
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.aerogel
    }, 'kubejs:vs_transport/clockwork/pressure/exhaust')

    bcVsFactory(event, 'vs_clockwork:gas_heater', [
        ' B ',
        'DAD',
        ' I '
    ], {
        B: 'create:empty_blaze_burner',
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/pressure/gas_heater')

    bcVsFactory(event, 'vs_clockwork:hose_port', [
        ' S ',
        'DTD',
        ' K '
    ], {
        S: BC_VS_TRANSPORT.pressureSeal,
        D: 'vs_clockwork:duct',
        T: BC_VS_TRANSPORT.pressureTube,
        K: 'minecraft:dried_kelp'
    }, 'kubejs:vs_transport/clockwork/pressure/hose_port')

    bcVsFactory(event, 'vs_clockwork:gas_backtank', [
        ' V ',
        'TAT',
        ' S '
    ], {
        V: 'vs_clockwork:valve_duct',
        T: 'vs_clockwork:duct_tank',
        A: BC_VS_TRANSPORT.aerogel,
        S: BC_VS_TRANSPORT.pressureSeal
    }, 'kubejs:vs_transport/clockwork/pressure/gas_backtank')

    bcVsFactory(event, 'vs_clockwork:extendon', [
        ' U ',
        'DTD',
        ' T '
    ], {
        U: 'vs_clockwork:universal_shaft_item',
        D: 'vs_clockwork:duct',
        T: BC_VS_TRANSPORT.pressureTube
    }, 'kubejs:vs_transport/clockwork/pressure/extendon')

    bcVsFactory(event, 'vs_clockwork:extendon_hose', [
        ' S ',
        'HEH',
        ' S '
    ], {
        S: BC_VS_TRANSPORT.pressureSeal,
        H: 'vs_clockwork:hose_port',
        E: 'vs_clockwork:extendon'
    }, 'kubejs:vs_transport/clockwork/pressure/extendon_hose', 2)

    // Printed boards own active stabilization, sensing, automation, and exotic
    // physics. These recipes all inherit Aether/Airtight through their parts.
    bcVsFactory(event, 'vs_clockwork:smart_flap_bearing', [
        ' P ',
        'AIA',
        ' F '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        A: BC_VS_TRANSPORT.aerogel,
        I: BC_VS_TRANSPORT.airtight,
        F: 'vs_clockwork:andesite_flap_bearing'
    }, 'kubejs:vs_transport/clockwork/control/smart_flap_bearing')

    bcVsFactory(event, 'vs_clockwork:copter_bearing', [
        ' P ',
        'ZIZ',
        ' B '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        Z: BC_VS_TRANSPORT.zanite,
        I: BC_VS_TRANSPORT.airtight,
        B: 'vs_clockwork:brass_propeller_bearing'
    }, 'kubejs:vs_transport/clockwork/control/copter_bearing')

    bcVsFactory(event, 'vs_clockwork:physics_infuser', [
        ' P ',
        'MIM',
        ' A '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        M: BC_VS_TRANSPORT.wanderliteMatrix,
        I: BC_VS_TRANSPORT.airtight,
        A: BC_VS_TRANSPORT.ambrosium
    }, 'kubejs:vs_transport/clockwork/control/physics_infuser')

    bcVsFactory(event, 'vs_clockwork:gyro', [
        ' T ',
        'MPM',
        ' F '
    ], {
        T: 'create:turntable',
        M: BC_VS_TRANSPORT.wanderliteMatrix,
        P: BC_VS_TRANSPORT.pcb,
        F: 'create:flywheel'
    }, 'kubejs:vs_transport/clockwork/control/gyro')

    bcVsFactory(event, 'vs_clockwork:reactionwheel', [
        ' F ',
        'APA',
        ' R '
    ], {
        F: 'create:flywheel',
        A: BC_VS_TRANSPORT.ambrosium,
        P: BC_VS_TRANSPORT.pcb,
        R: BC_VS_TRANSPORT.railway
    }, 'kubejs:vs_transport/clockwork/control/reactionwheel')

    var sensorRecipes = [
        { output: 'vs_clockwork:alt_meter', proof: BC_VS_TRANSPORT.aercloud, base: 'minecraft:compass' },
        { output: 'vs_clockwork:distance_sensor', proof: BC_VS_TRANSPORT.quicksoilGlass, base: 'create:content_observer' },
        { output: 'vs_clockwork:gyroscopic_sensor', proof: BC_VS_TRANSPORT.zanite, base: 'minecraft:compass' },
        { output: 'vs_clockwork:impact_sensor', proof: BC_VS_TRANSPORT.aerogel, base: 'create:content_observer' }
    ]
    for (var k = 0; k < sensorRecipes.length; k++) {
        var sensor = sensorRecipes[k]
        bcVsFactory(event, sensor.output, [
            ' P ',
            'BIB',
            ' A '
        ], {
            P: BC_VS_TRANSPORT.pcb,
            B: sensor.base,
            I: BC_VS_TRANSPORT.airtight,
            A: sensor.proof
        }, 'kubejs:vs_transport/clockwork/control/' + sensor.output.split(':')[1])
    }

    bcVsFactory(event, 'vs_clockwork:lodefocus', [
        ' Z ',
        'WPI',
        ' Z '
    ], {
        Z: BC_VS_TRANSPORT.zanite,
        W: 'vs_clockwork:wanderglass',
        P: BC_VS_TRANSPORT.pcb,
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/control/lodefocus', 4)

    bcVsFactory(event, 'vs_clockwork:delivery_chute', [
        ' P ',
        'CAC',
        ' D '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        C: 'create:chute',
        A: BC_VS_TRANSPORT.airtight,
        D: 'create:depot'
    }, 'kubejs:vs_transport/clockwork/control/delivery_chute')

    bcVsFactory(event, 'vs_clockwork:delivery_cannon', [
        ' P ',
        'CAC',
        ' D '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        C: 'vs_clockwork:delivery_chute',
        A: BC_VS_TRANSPORT.airtight,
        D: 'minecraft:dispenser'
    }, 'kubejs:vs_transport/clockwork/control/delivery_cannon')

    bcVsFactory(event, 'vs_clockwork:gas_crafter', [
        ' P ',
        'DAD',
        ' I '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        D: 'vs_clockwork:duct',
        A: BC_VS_TRANSPORT.ambrosium,
        I: BC_VS_TRANSPORT.airtight
    }, 'kubejs:vs_transport/clockwork/control/gas_crafter')

    bcVsFactory(event, 'vs_clockwork:slicker', [
        ' P ',
        'SAS',
        ' B '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        S: BC_VS_TRANSPORT.pressureSeal,
        A: BC_VS_TRANSPORT.aerogel,
        B: 'create:brass_casing'
    }, 'kubejs:vs_transport/clockwork/control/slicker')

    bcVsFactory(event, 'vs_clockwork:solver', [
        ' P ',
        'MIM',
        ' S '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        M: BC_VS_TRANSPORT.wanderliteMatrix,
        I: 'vs_clockwork:physics_infuser',
        S: BC_VS_TRANSPORT.ambrosium
    }, 'kubejs:vs_transport/clockwork/control/solver')

    bcVsFactory(event, 'vs_clockwork:gravitron', [
        ' P ',
        'MAM',
        ' B '
    ], {
        P: BC_VS_TRANSPORT.pcb,
        M: BC_VS_TRANSPORT.wanderliteMatrix,
        A: BC_VS_TRANSPORT.ambrosium,
        B: 'vs_clockwork:phys_bearing'
    }, 'kubejs:vs_transport/clockwork/control/gravitron')

    var aeronautArmor = [
        { output: 'vs_clockwork:aeronaut_goggles', base: 'pneumaticcraft:compressed_iron_helmet' },
        { output: 'vs_clockwork:aeronaut_jacket', base: 'pneumaticcraft:compressed_iron_chestplate' },
        { output: 'vs_clockwork:aeronaut_jumpers', base: 'pneumaticcraft:compressed_iron_leggings' },
        { output: 'vs_clockwork:aeronaut_boots', base: 'pneumaticcraft:compressed_iron_boots' }
    ]
    for (var m = 0; m < aeronautArmor.length; m++) {
        var armor = aeronautArmor[m]
        bcVsFactory(event, armor.output, [
            'APA',
            'WBW',
            'SAS'
        ], {
            A: BC_VS_TRANSPORT.aerogel,
            P: BC_VS_TRANSPORT.pcb,
            W: 'vs_clockwork:wanderlite_crystal',
            B: armor.base,
            S: BC_VS_TRANSPORT.pressureSeal
        }, 'kubejs:vs_transport/clockwork/control/' + armor.output.split(':')[1])
    }

    console.info('[vs-transport-progression] registered primitive boats, train-peer land vehicles, and staged Aether/PNCR aeronautics')
})
