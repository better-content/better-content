// Pack-owned molten forms keep direct TCon processing chemically honest for
// titanium and thorium instead of substituting an unrelated metal.

ServerEvents.recipes(function (event) {
    function fluidOutput(ref, amount) {
        var output = { amount: amount }
        if (ref.indexOf('forge:') === 0) output.tag = ref
        else output.fluid = ref
        return output
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

})
