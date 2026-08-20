// General chemistry transformations.
//
// These routes turn acid/ball outputs into a reusable manufacturing language:
// roast salts, leach solids, precipitate powders, and scrub gases.

function bcChemXExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

function bcChemXIngredient(input) {
    if (typeof input !== 'string') return input
    if (input.charAt(0) === '#') return { tag: input.substring(1) }
    return { item: input }
}

function bcChemXExpandCreateIngredients(inputs) {
    var expanded = []
    for (var i = 0; i < inputs.length; i++) {
        var input = bcChemXIngredient(inputs[i])
        var copies = input && (input.item || input.tag) ? (input.count || 1) : 1
        for (var copyIndex = 0; copyIndex < copies; copyIndex++) {
            var copy = {}
            for (var key in input) {
                if (key !== 'count') copy[key] = input[key]
            }
            expanded.push(copy)
        }
    }
    return expanded
}

function bcChemXIngredientExists(input) {
    if (!input) return false
    if (typeof input !== 'string') return true
    if (input.charAt(0) === '#') return true
    return bcChemXExists(input)
}

function bcChemXCanCraft(output, inputs) {
    if (!bcChemXExists(output)) return false
    for (var i = 0; i < inputs.length; i++) {
        if (!bcChemXIngredientExists(inputs[i])) return false
    }
    return true
}

function bcChemXResult(item, count, chance) {
    var result = { item: item }
    if (count && count > 1) result.count = count
    if (chance && chance < 1) result.chance = chance
    return result
}

function bcChemXMix(event, id, output, count, inputs, fluid, amount, heat, time, side) {
    if (!bcChemXCanCraft(output, inputs)) return
    var ingredients = bcChemXExpandCreateIngredients(inputs)
    if (fluid) ingredients.push({ fluid: fluid, amount: amount || 250 })
    var results = [bcChemXResult(output, count || 1)]
    if (side &&  bcChemXExists(side.item)) results.push(bcChemXResult(side.item, side.count || 1, side.chance || 1))
    var recipe = {
        type: 'create:mixing',
        ingredients: ingredients,
        results: results,
        processingTime: time || 180
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemistry/transform/create_mixing/' + id)
}

function bcChemXCompact(event, id, output, count, inputs, heat, side) {
    if (!bcChemXCanCraft(output, inputs)) return
    var results = [bcChemXResult(output, count || 1)]
    if (side &&  bcChemXExists(side.item)) results.push(bcChemXResult(side.item, side.count || 1, side.chance || 1))
    var recipe = {
        type: 'create:compacting',
        ingredients: bcChemXExpandCreateIngredients(inputs),
        results: results,
        processingTime: 180
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemistry/transform/create_compacting/' + id)
}

function bcChemXPressure(event, id, output, count, inputs, pressure) {
    if (!bcChemXCanCraft(output, inputs)) return
    event.custom({
        type: 'pneumaticcraft:pressure_chamber',
        inputs: inputs.map(function (input) {
            var stack = bcChemXIngredient(input)
            stack.type = 'pneumaticcraft:stacked_item'
            stack.count = stack.count || 1
            return stack
        }),
        pressure: pressure || 2.0,
        results: [bcChemXResult(output, count || 1)]
    }).id('kubejs:chemistry/transform/pncr_pressure/' + id)
}

function bcChemXGasFixation(event, id, solid, gas, gasUnits, output, pressure, temp) {
    if (!bcChemXExists(solid) || !bcChemXExists(output)) return
    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        exothermic: false,
        item_input: { item: solid },
        fluid_input: {
            type: 'pneumaticcraft:fluid',
            fluid: gas + '_fluid',
            amount: 250 * (gasUnits || 1)
        },
        item_output: { item: output },
        pressure: pressure || 2.5,
        speed: 0.45,
        temperature: { min_temp: temp || 473 }
    }).id('kubejs:chemistry/transform/pncr_thermo/' + id)
}

ServerEvents.recipes(function (event) {
    bcChemXGasFixation(event, 'carbon_dioxide_scrub_lime',
        'chemlib:calcium_oxide', 'chemlib:carbon_dioxide', 1,
        'chemlib:calcium_carbonate', 2.5, 423)
})
