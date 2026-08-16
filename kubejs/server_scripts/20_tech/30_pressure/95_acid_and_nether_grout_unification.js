ServerEvents.recipes(event => {
    // Power Grid's generic acid is split into chemistry-specific ChemLib fluids.
    // Batteries want sulfuric acid; copper-board etching wants hydrochloric acid.
    event.remove({ id: 'powergrid:mixing/acid' })
    event.remove({ output: Fluid.of('powergrid:acid', 1) })
    event.remove({ id: 'powergrid:sequenced_assembly/battery' })
    event.remove({ id: 'powergrid:mixing/etched_circuit_board' })

    event.custom({
        type: 'create:sequenced_assembly',
        ingredient: { item: 'powergrid:conductive_casing' },
        loops: 3,
        results: [
            { chance: 100.0, item: 'powergrid:battery' },
            { chance: 5.0, item: 'powergrid:conductive_casing' },
            { chance: 2.0, item: 'chemlib:copper_plate' },
            { chance: 2.0, item: 'chemlib:zinc_plate' }
        ],
        sequence: [
            {
                type: 'create:deploying',
                ingredients: [
                    { item: 'powergrid:incomplete_battery' },
                    { tag: 'forge:plates/copper' }
                ],
                results: [{ item: 'powergrid:incomplete_battery' }]
            },
            {
                type: 'create:deploying',
                ingredients: [
                    { item: 'powergrid:incomplete_battery' },
                    { tag: 'forge:plates/zinc' }
                ],
                results: [{ item: 'powergrid:incomplete_battery' }]
            },
            {
                type: 'create:filling',
                ingredients: [
                    { item: 'powergrid:incomplete_battery' },
                    { amount: 250, fluid: 'chemlib:sulfuric_acid_fluid', nbt: {} }
                ],
                results: [{ item: 'powergrid:incomplete_battery' }]
            }
        ],
        transitionalItem: { item: 'powergrid:incomplete_battery' }
    }).id('kubejs:powergrid/sequenced_assembly/battery_sulfuric')

    event.custom({
        type: 'create:mixing',
        heatRequirement: 'heated',
        ingredients: [
            { item: 'powergrid:unetched_circuit' },
            { amount: 250, fluid: 'chemlib:hydrochloric_acid_fluid', nbt: {} }
        ],
        results: [{ item: 'powergrid:incomplete_circuit' }]
    }).id('kubejs:powergrid/mixing/etched_circuit_board_hydrochloric')

    // Remove TConstruct nether grout crafting + furnace-style processing into scorched brick.
    event.remove({ output: 'tconstruct:nether_grout', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'tconstruct:nether_grout', type: 'minecraft:crafting_shapeless' })
    event.remove({ input: 'tconstruct:nether_grout', type: 'minecraft:smelting' })
    event.remove({ input: 'tconstruct:nether_grout', type: 'minecraft:blasting' })

    // Remove flint + magma casting table shortcut for scorched bricks.
    event.remove({ id: 'tconstruct:smeltery/casting/scorched/brick_composite' })

    // Scorched metallurgy is the later Nether-specific refractory boundary.
    // Both batches run on the hand-cranked Mixer, but all special aggregate is
    // native to the Nether rather than coupling this route to Undergarden.
    event.custom({
        type: 'create:mixing',
        ingredients: [
            { item: 'minecraft:magma_cream' },
            { item: 'minecraft:soul_sand' },
            { item: 'minecraft:soul_soil' },
            { item: 'minecraft:gravel' }
        ],
        processingTime: 120,
        results: [{ item: 'tconstruct:nether_grout', count: 2 }]
    }).id('kubejs:create/mixing/nether_grout_small')

    event.custom({
        type: 'create:mixing',
        ingredients: [
            { item: 'minecraft:magma_block' },
            { item: 'minecraft:soul_sand', count: 4 },
            { item: 'minecraft:soul_soil', count: 4 },
            { item: 'minecraft:gravel', count: 4 }
        ],
        processingTime: 120,
        results: [{ item: 'tconstruct:nether_grout', count: 8 }]
    }).id('kubejs:create/mixing/nether_grout_bulk')
})
