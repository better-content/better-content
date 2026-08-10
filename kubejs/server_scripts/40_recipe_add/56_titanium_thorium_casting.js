// Pack-owned molten forms keep direct TCon processing chemically honest for
// titanium and thorium instead of substituting an unrelated metal.

ServerEvents.recipes(function (event) {
    function fluidOutput(ref, amount) {
        var output = { amount: amount }
        if (ref.indexOf('forge:') === 0) output.tag = ref
        else output.fluid = ref
        return output
    }

    function meltConcentrate(id, input, fluid, temperature) {
        event.custom({
            type: 'tconstruct:melting',
            ingredient: { item: input },
            result: fluidOutput(fluid, 90),
            temperature: temperature,
            time: 120
        }).id('kubejs:tconstruct/melting/concentrate/' + id)
    }

    function castIngot(id, fluid, result, time) {
        event.custom({
            type: 'tconstruct:casting_table',
            cast: { tag: 'tconstruct:casts/single_use/ingot' },
            cast_consumed: true,
            fluid: { fluid: fluid, amount: 90 },
            result: { item: result },
            cooling_time: time
        }).id('kubejs:tconstruct/casting/' + id + '_sand_cast')

        event.custom({
            type: 'tconstruct:casting_table',
            cast: { tag: 'tconstruct:casts/multi_use/ingot' },
            cast_consumed: false,
            fluid: { fluid: fluid, amount: 90 },
            result: { item: result },
            cooling_time: time
        }).id('kubejs:tconstruct/casting/' + id + '_cast')
    }

    castIngot('titanium_ingot', 'kubejs:molten_titanium', 'chemlib:titanium_ingot', 140)
    castIngot('thorium_ingot', 'kubejs:molten_thorium', 'chemlib:thorium_ingot', 140)

    meltConcentrate('osmiridium', 'kubejs:osmiridium_concentrate', 'forge:molten_osmium', 1450)
    meltConcentrate('tungsten', 'kubejs:tungsten_concentrate', 'forge:molten_tungsten', 1450)
    meltConcentrate('titanium', 'kubejs:titanium_concentrate', 'kubejs:molten_titanium', 950)
    meltConcentrate('uranium', 'kubejs:uranium_concentrate', 'forge:molten_uranium', 950)
    meltConcentrate('thorium', 'kubejs:thorium_concentrate', 'kubejs:molten_thorium', 950)
})
