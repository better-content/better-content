ServerEvents.recipes(event => {
    // Keep logistics useful but bounded: local pipes, extraction/filtering/retrieval,
    // and local crafting are available; high-speed, high-priority, and pressurizer
    // escalation remains unavailable until later storage systems take over.
    event.remove({mod: 'prettypipes'})

    event.shaped('4x prettypipes:pipe', [' R ', 'IGI', ' C '], {
        R: 'minecraft:redstone',
        I: 'minecraft:iron_bars',
        G: '#forge:glass',
        C: 'create:copper_casing'
    }).id('kubejs:pretty_pipes/pipe')

    event.shaped('prettypipes:wrench', ['PI ', 'II ', '  R'], {
        P: 'prettypipes:pipe', I: 'minecraft:iron_ingot', R: '#forge:dyes/red'
    }).id('kubejs:pretty_pipes/wrench')

    event.shaped('prettypipes:blank_module', ['QRQ', 'SPS', 'QRQ'], {
        Q: 'minecraft:quartz', R: 'minecraft:redstone', S: 'minecraft:stone_slab', P: 'prettypipes:pipe'
    }).id('kubejs:pretty_pipes/blank_module')

    const lowModules = [
        ['low_extraction_module', 'minecraft:piston'],
        ['low_filter_module', 'minecraft:hopper'],
        ['low_speed_module', 'minecraft:sugar'],
        ['low_crafting_module', 'minecraft:crafting_table']
    ]
    lowModules.forEach(entry => event.shaped('prettypipes:' + entry[0], [' P ', 'RMR', ' R '], {
        P: entry[1], R: 'minecraft:redstone', M: 'prettypipes:blank_module'
    }).id('kubejs:pretty_pipes/' + entry[0]))

    event.shaped('prettypipes:low_retrieval_module', [' P ', 'RMR', ' E '], {
        P: 'minecraft:sticky_piston', R: 'minecraft:redstone_block', M: 'prettypipes:blank_module', E: 'minecraft:ender_pearl'
    }).id('kubejs:pretty_pipes/low_retrieval_module')

    event.shaped('prettypipes:item_terminal', ['DPI', 'RCE', 'IPD'], {
        D: 'minecraft:diamond', P: 'minecraft:ender_pearl', I: 'create:brass_casing',
        R: 'prettypipes:low_retrieval_module', C: '#forge:chests', E: 'prettypipes:low_extraction_module'
    }).id('kubejs:pretty_pipes/item_terminal')

    event.shaped('prettypipes:crafting_terminal', [' C ', 'RTR', ' R '], {
        C: 'minecraft:crafting_table', T: 'prettypipes:item_terminal', R: 'minecraft:redstone'
    }).id('kubejs:pretty_pipes/crafting_terminal')
})
