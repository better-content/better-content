// Create + PNCR molecular synthesis.
//
// Create owns open liquid/solid chemistry. PNCR's Airtight-era machines own
// every deliberate gas source and sink. One chemical formula unit is 250 mB.

function bcChemItem(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

var BC_CHEM_GASES = {
    'chemlib:hydrogen': true,
    'chemlib:helium': true,
    'chemlib:nitrogen': true,
    'chemlib:oxygen': true,
    'chemlib:fluorine': true,
    'chemlib:neon': true,
    'chemlib:chlorine': true,
    'chemlib:argon': true,
    'chemlib:krypton': true,
    'chemlib:xenon': true,
    'chemlib:radon': true,
    'chemlib:carbon_dioxide': true,
    'chemlib:ethylene': true,
    'chemlib:ammonium': true,
    'chemlib:methane': true,
    'chemlib:ethane': true,
    'chemlib:propane': true,
    'chemlib:butane': true,
    'chemlib:sulfur_dioxide': true,
    'chemlib:nitrogen_dioxide': true,
    'chemlib:ammonia': true,
    'chemlib:hydrogen_sulfide': true,
    'chemlib:acetylene': true,
    'chemlib:carbon_monoxide': true,
    'chemlib:nitric_oxide': true
}

var BC_CHEM_REJECTED_MOLECULAR_ROUTES = {
    acetic_acid_from_ethanol: true,
    acetylene: true,
    ammonia: true,
    butane: true,
    butane_fuel_charge: true,
    diammonium_phosphate: true,
    ethylene: true,
    ethylene_from_acetylene: true,
    hydrochloric_acid_from_chlorine: true,
    hydrogen_sulfide: true,
    hydrogen_sulfide_scrubbing: true,
    hydroxide: true,
    nitrate: true,
    nitric_oxide: true,
    carbonate: true,
    phosphate: true,
    ammonium: true,
    ammonium_chloride: true,
    nitric_acid_from_nitrogen_dioxide: true,
    propane: true,
    pvc: true,
    sulfur_trioxide: true,
    methane: true
}

var BC_CHEM_REJECTED_CREATE_ROUTES = {
    arsenic_sulfide: true,
    calcium_carbonate: true,
    carbon_disulfide: true,
    carbon_disulfide_fiber: true,
    copper_nitrate: true,
    diammonium_phosphate_fertilizer: true,
    ethanol_from_sugar: true,
    mercury_sulfide: true,
    pressure_seal: true,
    sodium_hydroxide: true
}

function bcChemGasFluid(id, count) {
    if (!BC_CHEM_GASES[id]) throw new Error('Not a ChemLib gas: ' + id)
    return {
        type: 'pneumaticcraft:fluid',
        fluid: id + '_fluid',
        amount: 250 * (count || 1)
    }
}

function bcChemResults(primaryResults, sideProducts) {
    var results = primaryResults.slice()
    for (var i = 0; i < (sideProducts || []).length; i++) {
        var side = sideProducts[i]
        if (!bcChemItem(side.item)) continue
        var result = { item: side.item }
        if (side.count && side.count > 1) result.count = side.count
        if (side.chance && side.chance < 1) result.chance = side.chance
        results.push(result)
    }
    return results
}

// Create's processing serializer reads item ingredients as vanilla Ingredients,
// which ignore a JSON "count" field. Repeat item/tag entries so stoichiometric
// counts are actually consumed.
function bcChemExpandCreateIngredients(ingredients) {
    var expanded = []
    for (var i = 0; i < ingredients.length; i++) {
        var input = ingredients[i]
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

function bcChemMixing(event, id, ingredients, results, heat, time) {
    if (BC_CHEM_REJECTED_CREATE_ROUTES[id]) return
    var recipe = {
        type: 'create:mixing',
        ingredients: bcChemExpandCreateIngredients(ingredients),
        results: results,
        processingTime: time || 160
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemistry/create_mixing/' + id)
}

function bcChemCompacting(event, id, ingredients, results, heat) {
    if (BC_CHEM_REJECTED_CREATE_ROUTES[id]) return
    for (var i = 0; i < results.length; i++) {
        if (results[i].item && !bcChemItem(results[i].item)) return
    }
    for (var j = 0; j < ingredients.length; j++) {
        if (ingredients[j].item && !bcChemItem(ingredients[j].item)) return
    }
    var recipe = {
        type: 'create:compacting',
        ingredients: bcChemExpandCreateIngredients(ingredients),
        results: results
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemistry/create_compacting/' + id)
}

function bcChemThermoItemInput(input) {
    if (!input || !input.count || input.count <= 1) return input
    var stacked = {
        type: 'pneumaticcraft:stacked_item',
        count: input.count
    }
    if (input.item) stacked.item = input.item
    else if (input.tag) stacked.tag = input.tag
    return stacked
}

function bcChemThermo(event, id, itemInput, fluidInput, output, pressure, minTemp) {
    if (BC_CHEM_REJECTED_MOLECULAR_ROUTES[id]) return
    if (itemInput && itemInput.item && !bcChemItem(itemInput.item)) return
    if (output.item && !bcChemItem(output.item)) return
    var recipe = {
        type: 'pneumaticcraft:thermo_plant',
        exothermic: false,
        fluid_input: fluidInput,
        pressure: pressure || 2,
        speed: 0.45
    }
    if (itemInput) recipe.item_input = bcChemThermoItemInput(itemInput)
    if (output.item) recipe.item_output = output
    else recipe.fluid_output = output
    if (minTemp) recipe.temperature = { min_temp: minTemp }
    event.custom(recipe).id('kubejs:chemistry/pneumaticcraft/thermo_plant/' + id)
}

function bcChemFluidMixer(event, id, input1, input2, output, pressure, time) {
    if (BC_CHEM_REJECTED_MOLECULAR_ROUTES[id]) return
    if (output.item && !bcChemItem(output.item)) return
    var recipe = {
        type: 'pneumaticcraft:fluid_mixer',
        input1: input1,
        input2: input2,
        pressure: pressure || 2,
        time: time || 200
    }
    if (output.item) recipe.item_output = output
    else recipe.fluid_output = output
    event.custom(recipe).id('kubejs:chemistry/pneumaticcraft/fluid_mixer/' + id)
}

ServerEvents.recipes(function (event) {
    // Rejected utility proposals remain below as auditable tooling markers.
    event.remove({ id: 'kubejs:pneumaticcraft/pressure_seal' })
    bcChemCompacting(event, 'pressure_seal', [
        { item: 'minecraft:slime_ball' },
        { item: 'minecraft:dried_kelp' },
        { item: 'chemlib:sulfur' },
        { item: 'chemlib:carbon' },
        { fluidTag: 'forge:ethanol', amount: 250 }
    ], [{ item: 'kubejs:pressure_seal', count: 2 }], null)

    // Costly open fallback used only to bootstrap the Airtight tier.
    bcChemMixing(event, 'ethanol_from_sugar', [
        { item: 'minecraft:sugar', count: 2 },
        { item: 'chemlib:carbon' },
        { fluid: 'minecraft:water', amount: 250 }
    ], bcChemResults([{ fluid: 'chemlib:ethanol_fluid', amount: 250 }], [
        { item: 'chemlib:carbon_dioxide', chance: 0.20 }
    ]), null, 120)

    // The reciprocal phosphoric-acid packet conversions remain visible Create chemistry.
    bcChemMixing(event, 'phosphoric_acid_fluid', [
        { item: 'chemlib:phosphoric_acid' }
    ], [{ fluid: 'kubejs:phosphoric_acid_fluid', amount: 250 }], 'heated', 180)

    bcChemCompacting(event, 'phosphoric_acid_molecule', [
        { fluid: 'kubejs:phosphoric_acid_fluid', amount: 250 }
    ], [{ item: 'chemlib:phosphoric_acid' }], null)

    bcChemCompacting(event, 'sodium_hydroxide', [
        { item: 'chemlib:sodium' },
        { item: 'chemlib:hydroxide' }
    ], [{ item: 'chemlib:sodium_hydroxide' }], null)

    bcChemCompacting(event, 'calcium_carbonate', [
        { item: 'chemlib:calcium' },
        { item: 'chemlib:carbonate' }
    ], [{ item: 'chemlib:calcium_carbonate' }], null)

    bcChemMixing(event, 'copper_nitrate', [
        { item: 'chemlib:copper' },
        { item: 'chemlib:nitrate', count: 2 }
    ], [{ item: 'chemlib:copper_nitrate' }], 'heated', 180)

    bcChemMixing(event, 'arsenic_sulfide', [
        { item: 'chemlib:arsenic', count: 4 },
        { item: 'chemlib:sulfur', count: 4 }
    ], [{ item: 'chemlib:arsenic_sulfide' }], 'heated', 220)

    bcChemMixing(event, 'mercury_sulfide', [
        { item: 'chemlib:mercury' },
        { item: 'chemlib:sulfur' }
    ], [{ item: 'chemlib:mercury_sulfide' }], 'heated', 220)

    bcChemMixing(event, 'carbon_disulfide', [
        { item: 'chemlib:carbon' },
        { item: 'chemlib:sulfur', count: 2 }
    ], [{ item: 'chemlib:carbon_disulfide' }], 'heated', 200)
    bcChemMixing(event, 'carbon_disulfide_fiber', [
        { item: 'chemlib:carbon_disulfide' },
        { item: 'minecraft:paper' }
    ], [{ item: 'minecraft:string', count: 2 }], 'heated', 180)
    bcChemMixing(event, 'diammonium_phosphate_fertilizer', [
        { item: 'chemlib:diammonium_phosphate' },
        { fluid: 'minecraft:water', amount: 250 }
    ], [{ item: 'minecraft:bone_meal', count: 6 }], null, 160)

    // Rejected radical proposals are retained below as auditable tooling markers.
    bcChemFluidMixer(event, 'hydroxide', bcChemGasFluid('chemlib:hydrogen'), bcChemGasFluid('chemlib:oxygen'), {
        item: 'chemlib:hydroxide', count: 2
    }, 2.0, 160)
    bcChemFluidMixer(event, 'nitrate', bcChemGasFluid('chemlib:nitrogen'), bcChemGasFluid('chemlib:oxygen', 3), {
        item: 'chemlib:nitrate', count: 2
    }, 2.5, 180)
    bcChemThermo(event, 'carbonate', { item: 'chemlib:carbon', count: 2 }, bcChemGasFluid('chemlib:oxygen', 3), {
        item: 'chemlib:carbonate', count: 2
    }, 2.5, 473)
    bcChemThermo(event, 'phosphate', { item: 'chemlib:phosphorus', count: 2 }, bcChemGasFluid('chemlib:oxygen', 4), {
        item: 'chemlib:phosphate', count: 2
    }, 2.75, 523)
    // Conditioned Airtight-era synthesis plus disabled proposals retained as markers.
    bcChemThermo(event, 'silicon_dioxide', { item: 'chemlib:silicon' }, bcChemGasFluid('chemlib:oxygen'), {
        item: 'chemlib:silicon_dioxide'
    }, 2.0, 1073)
    bcChemThermo(event, 'iron_ii_oxide', { item: 'chemlib:iron', count: 2 }, bcChemGasFluid('chemlib:oxygen'), {
        item: 'chemlib:iron_ii_oxide', count: 2
    }, 2.0, 923)
    bcChemThermo(event, 'copper_chloride', { item: 'chemlib:copper' }, bcChemGasFluid('chemlib:chlorine'), {
        item: 'chemlib:copper_chloride'
    }, 2.5, 523)

    bcChemThermo(event, 'ethylene', { item: 'chemlib:carbon', count: 2 }, bcChemGasFluid('chemlib:hydrogen', 2), {
        fluid: 'chemlib:ethylene_fluid', amount: 250
    }, 2.5, 523)
    bcChemThermo(event, 'acetylene', { item: 'chemlib:carbon', count: 2 }, bcChemGasFluid('chemlib:hydrogen'), {
        fluid: 'chemlib:acetylene_fluid', amount: 250
    }, 2.75, 573)
    bcChemThermo(event, 'methane', { item: 'chemlib:carbon' }, bcChemGasFluid('chemlib:hydrogen', 2), {
        fluid: 'chemlib:methane_fluid', amount: 250
    }, 2.5, 523)
    bcChemThermo(event, 'carbon_monoxide', { item: 'chemlib:carbon', count: 2 }, bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:carbon_monoxide_fluid', amount: 500
    }, 2.5, 873)
    bcChemThermo(event, 'hydrogen_sulfide', { item: 'chemlib:sulfur' }, bcChemGasFluid('chemlib:hydrogen'), {
        fluid: 'chemlib:hydrogen_sulfide_fluid', amount: 250
    }, 2.75, 523)
    bcChemThermo(event, 'sulfur_dioxide', { item: 'chemlib:sulfur' }, bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:sulfur_dioxide_fluid', amount: 250
    }, 2.0, 523)

    bcChemFluidMixer(event, 'propane', bcChemGasFluid('chemlib:ethylene'), bcChemGasFluid('chemlib:methane'), {
        fluid: 'chemlib:propane_fluid', amount: 250
    }, 2.75, 220)
    bcChemFluidMixer(event, 'butane', bcChemGasFluid('chemlib:propane'), bcChemGasFluid('chemlib:methane'), {
        fluid: 'chemlib:butane_fluid', amount: 250
    }, 3.0, 240)
    bcChemFluidMixer(event, 'ammonia', bcChemGasFluid('chemlib:nitrogen'), bcChemGasFluid('chemlib:hydrogen', 3), {
        fluid: 'chemlib:ammonia_fluid', amount: 500
    }, 3.0, 240)
    bcChemFluidMixer(event, 'ammonium', bcChemGasFluid('chemlib:ammonia', 2), bcChemGasFluid('chemlib:hydrogen'), {
        fluid: 'chemlib:ammonium_fluid', amount: 500
    }, 3.0, 220)
    bcChemFluidMixer(event, 'nitric_oxide', bcChemGasFluid('chemlib:nitrogen'), bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:nitric_oxide_fluid', amount: 500
    }, 3.0, 220)
    bcChemFluidMixer(event, 'nitrogen_dioxide', bcChemGasFluid('chemlib:nitric_oxide', 2), bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:nitrogen_dioxide_fluid', amount: 500
    }, 3.0, 220)
    bcChemFluidMixer(event, 'sulfur_trioxide', bcChemGasFluid('chemlib:sulfur_dioxide', 2), bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:sulfur_trioxide_fluid', amount: 500
    }, 3.0, 240)

    // Gas demand and connected acid chains.
    bcChemFluidMixer(event, 'ethylene_from_acetylene', bcChemGasFluid('chemlib:acetylene'), bcChemGasFluid('chemlib:hydrogen'), {
        fluid: 'chemlib:ethylene_fluid', amount: 250
    }, 2.75, 200)
    bcChemFluidMixer(event, 'hydrogen_sulfide_scrubbing', bcChemGasFluid('chemlib:hydrogen_sulfide'), bcChemGasFluid('chemlib:oxygen', 2), {
        fluid: 'chemlib:sulfur_dioxide_fluid', amount: 250
    }, 2.75, 220)
    bcChemFluidMixer(event, 'carbon_monoxide_oxidation', bcChemGasFluid('chemlib:carbon_monoxide', 2), bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:carbon_dioxide_fluid', amount: 500
    }, 3.0, 240)
    bcChemFluidMixer(event, 'butane_fuel_charge', bcChemGasFluid('chemlib:butane'), bcChemGasFluid('chemlib:oxygen'), {
        item: 'minecraft:fire_charge', count: 2
    }, 3.0, 200)
    bcChemFluidMixer(event, 'pvc', bcChemGasFluid('chemlib:ethylene', 4), bcChemGasFluid('chemlib:chlorine', 4), {
        item: 'chemlib:polyvinyl_chloride', count: 4
    }, 3.5, 260)
    bcChemFluidMixer(event, 'ammonium_chloride', bcChemGasFluid('chemlib:ammonium', 2), bcChemGasFluid('chemlib:chlorine'), {
        item: 'chemlib:ammonium_chloride', count: 2
    }, 2.75, 220)
    bcChemFluidMixer(event, 'diammonium_phosphate', bcChemGasFluid('chemlib:ammonium', 2), {
        type: 'pneumaticcraft:fluid',
        fluid: 'kubejs:phosphoric_acid_fluid',
        amount: 250
    }, {
        item: 'chemlib:diammonium_phosphate'
    }, 3.0, 240)

    bcChemFluidMixer(event, 'hydrochloric_acid_from_chlorine', bcChemGasFluid('chemlib:hydrogen'), bcChemGasFluid('chemlib:chlorine'), {
        fluid: 'chemlib:hydrochloric_acid_fluid', amount: 500
    }, 2.5, 220)
    bcChemFluidMixer(event, 'acetic_acid_from_ethanol', {
        type: 'pneumaticcraft:fluid',
        fluid: 'chemlib:ethanol_fluid',
        amount: 250
    }, bcChemGasFluid('chemlib:oxygen'), {
        fluid: 'chemlib:acetic_acid_fluid', amount: 250
    }, 2.5, 220)
    bcChemFluidMixer(event, 'sulfuric_acid_from_sulfur_trioxide', {
        type: 'pneumaticcraft:fluid',
        fluid: 'chemlib:sulfur_trioxide_fluid',
        amount: 250
    }, {
        type: 'pneumaticcraft:fluid',
        fluid: 'minecraft:water',
        amount: 250
    }, {
        fluid: 'chemlib:sulfuric_acid_fluid', amount: 250
    }, 3.0, 240)
    bcChemFluidMixer(event, 'nitric_acid_from_nitrogen_dioxide', bcChemGasFluid('chemlib:nitrogen_dioxide'), {
        type: 'pneumaticcraft:fluid',
        fluid: 'minecraft:water',
        amount: 250
    }, {
        fluid: 'chemlib:nitric_acid_fluid', amount: 250
    }, 3.0, 240)
})
