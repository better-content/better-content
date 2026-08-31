// Optional engineering branches consume one era proof at their first capability
// root. Native components carry every downstream recipe.
ServerEvents.recipes(function (event) {
    if (Platform.isLoaded('vs_eureka')) {
        ;['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'crimson', 'warped'].forEach(function (wood) {
            var helm = 'vs_eureka:' + wood + '_ship_helm'
            event.remove({ id: helm })
        })

        ;['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak'].forEach(function (wood) {
            var helm = 'vs_eureka:' + wood + '_ship_helm'
            event.shaped(helm, [' H ', 'FBF', 'P P'], {
                H: 'tconstruct:tool_handle', B: 'minecraft:barrel',
                F: 'minecraft:' + wood + '_fence', P: 'minecraft:' + wood + '_planks'
            }).id('kubejs:transport/hand_workshop/eureka/' + wood + '_ship_helm')
        })
    }

    if (Platform.isLoaded('vs_clockwork')) {
        event.remove({ id: 'vs_clockwork:crafting/kinetics/andesite_flap_bearing' })
        event.shaped('vs_clockwork:andesite_flap_bearing', [' A ', 'CMC', ' S '], {
            A: 'create:andesite_alloy', C: 'create:cogwheel',
            M: 'kubejs:copper_machine_block', S: 'create:shaft'
        }).id('kubejs:transport/powered_works/clockwork/andesite_flap_bearing')

        event.remove({ id: 'vs_clockwork:crafting/kinetics/brass_propeller_bearing' })
        event.shaped('vs_clockwork:brass_propeller_bearing', [' P ', 'BMB', ' S '], {
            P: 'create:precision_mechanism', B: '#forge:plates/brass',
            M: 'kubejs:brass_machine_block', S: 'create:shaft'
        }).id('kubejs:transport/precision_factory/clockwork/brass_propeller_bearing')

        event.remove({ id: 'vs_clockwork:crafting/pneumatics/air_compressor' })
        event.shaped('vs_clockwork:air_compressor', ['PTP', 'GAG', ' C '], {
            P: 'pneumaticcraft:pressure_tube', T: 'create:shaft',
            G: 'pneumaticcraft:compressed_iron_gear', A: 'kubejs:airtight_machine_block',
            C: 'create:brass_casing'
        }).id('kubejs:transport/thermal_pressure/clockwork/air_compressor')

        event.remove({ id: 'vs_clockwork:crafting/physics/gyro' })
        event.shaped('vs_clockwork:gyro', [' S ', 'CMC', ' P '], {
            S: 'vs_clockwork:gyroscopic_sensor', C: 'powergrid:integrated_circuit',
            M: 'kubejs:electrical_machine_block', P: 'create:precision_mechanism'
        }).id('kubejs:transport/electrical_control/clockwork/gyro')

        event.remove({ id: 'vs_clockwork:mechanical_crafting/gas_thruster' })
        event.shaped('vs_clockwork:gas_thruster', ['ABA', 'CMC', 'ATA'], {
            A: 'aether:aerogel', B: 'aether:blue_aercloud', C: 'powergrid:integrated_circuit',
            M: 'vs_clockwork:wanderlite_matrix', T: 'pneumaticcraft:pressure_tube'
        }).id('kubejs:transport/aerospace/clockwork/gas_thruster')
    }

    if (Platform.isLoaded('trackwork')) {
        event.remove({ id: 'trackwork:simple_wheel' })
        event.shaped('trackwork:simple_wheel', [' K ', 'KCK', ' K '], {
            K: 'minecraft:dried_kelp', C: 'kubejs:copper_machine_block'
        }).id('kubejs:transport/powered_works/trackwork/simple_wheel')
        event.remove({ id: 'trackwork:track_level_controller' })
        event.shaped('trackwork:track_level_controller', [' E ', 'MBM', ' R '], {
            E: 'create:electron_tube', M: 'create:precision_mechanism',
            B: 'kubejs:brass_machine_block', R: 'create:railway_casing'
        }).id('kubejs:transport/precision_factory/trackwork/level_controller')
    }

    if (Platform.isLoaded('rail_scout')) {
        event.remove({ id: 'rail_scout:rail_scout' })
        event.shaped('rail_scout:rail_scout', ['ECE', ' B ', ' M '], {
            E: 'create:electron_tube', C: 'create:railway_casing',
            B: 'minecraft:barrel', M: 'minecraft:minecart'
        }).id('kubejs:transport/precision_factory/rail_scout')
    }
})
