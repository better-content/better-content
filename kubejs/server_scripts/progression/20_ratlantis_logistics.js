// Ratlantis supplies visible, recipe-level roots for scalable logistics. The
// former post-craft inventory charge is gone; every component is consumed in
// the recipe the player can inspect.
var BC_DISABLED_INPUTLESS_RAT_OUTPUTS = [
    'rats:rat_upgrade_ore_doubling',
    'rats:rat_upgrade_fisherman',
    'rats:rat_upgrade_milker',
    'rats:rat_upgrade_aristocrat',
    'rats:rat_upgrade_christmas',
    'rats:rat_upgrade_support'
]

ServerEvents.recipes(function (event) {
    // This contextual recipe outputs an NBT-cleared copy of any module. It has
    // no static graph edges and would also charge a second tier component for
    // re-crafting an existing module, so it is not part of the restored ladder.
    event.remove({ id: 'prettypipes:module_clearing' })
    BC_DISABLED_INPUTLESS_RAT_OUTPUTS.forEach(function (item) {
        event.remove({ output: item })
    })
    event.remove({ output: 'rats:chunky_cheese_token' })
    event.remove({ output: 'rats:ratlantis_portal' })

    event.remove({ output: 'prettypipes:pipe' })
    event.shaped('8x prettypipes:pipe', ['RGR', 'ILI', 'RGR'], {
        R: 'minecraft:redstone', G: '#forge:glass', I: 'minecraft:iron_bars',
        L: 'ratlantis_logistics:courier_lattice'
    }).id('kubejs:ratlantis_logistics/root/pretty_pipes')

    event.remove({ output: 'sophisticatedstorage:hopper_upgrade' })
    event.shaped('sophisticatedstorage:hopper_upgrade', ['IRI', 'HLH', ' U '], {
        I: '#forge:ingots/iron', R: '#forge:dusts/redstone', H: 'minecraft:hopper',
        L: 'ratlantis_logistics:courier_lattice', U: 'sophisticatedstorage:upgrade_base'
    }).id('kubejs:ratlantis_logistics/root/sophisticated_automation')

    event.remove({ output: 'create:redstone_requester' })
    event.shapeless('create:redstone_requester', [
        'create:stock_link', '#forge:dusts/redstone', '#forge:ingots/iron',
        'ratlantis_logistics:oratchalcum_mechanism'
    ]).id('kubejs:ratlantis_logistics/root/create_request_logistics')

    event.remove({ output: 'rats:rat_upgrade_basic' })
    event.shaped('rats:rat_upgrade_basic', ['CCC', 'CLC', 'CCC'], {
        C: '#forge:cheese', L: 'ratlantis_logistics:courier_lattice'
    }).id('kubejs:ratlantis_logistics/root/rat_work_orders')

    // Docks and rails stay inertly available. Every usable native vehicle pays
    // its Ratlantis proof within the visible recipe.
    ;[
        'littlelogistics:barge', 'littlelogistics:barrel_barge',
        'littlelogistics:energy_locomotive', 'littlelogistics:energy_tug',
        'littlelogistics:fishing_barge', 'littlelogistics:fluid_barge',
        'littlelogistics:seater_barge', 'littlelogistics:steam_locomotive',
        'littlelogistics:tug', 'littlelogistics:vacuum_barge'
    ].forEach(function (vehicle) {
        event.replaceInput({ output: vehicle }, '#forge:ingots/iron',
            'ratlantis_logistics:courier_lattice')
    })
    event.replaceInput({ output: 'littlelogistics:fishing_barge' },
        'minecraft:fishing_rod', 'starcatcher:humble_rod')

    // AE2's first usable electrical supply conjunctively proves the PowerGrid,
    // Ratlantis, OC2R, meteor, and Impossible Matter roots.
    event.remove({ output: 'ae2:energy_acceptor' })
    event.shapeless('ae2:energy_acceptor', [
        'powergrid:generator_housing',
        'ratlantis_logistics:arcane_logistics_core',
        'oc2r:computer',
        'ae2:sky_stone_block',
        'kubejs:impossible_support_matrix'
    ]).id('kubejs:ratlantis_logistics/root/ae2_powergrid_energy_acceptor')
})
