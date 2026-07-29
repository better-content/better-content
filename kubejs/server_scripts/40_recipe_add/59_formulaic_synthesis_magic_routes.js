// Formulaic synthesis expansion.
//
// Tech routes give throughput and automation. Blood Magic provides manual,
// count-scaled batches where life-force extraction, dangerous sorting, and
// player attention are more immersive than machinery; Ars handles purified
// resonance and source stabilization.

function bcSynExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

function bcSynIngredientExists(ingredient) {
    if (!ingredient || ingredient.tag || ingredient.fluid) return true
    if (ingredient.item) return bcSynExists(ingredient.item)
    return true
}

function bcSynMixing(event, id, ingredients, output, heat, time, sideProducts) {
    if (!bcSynExists(output.item)) return
    for (var i = 0; i < ingredients.length; i++) {
        if (!bcSynIngredientExists(ingredients[i])) return
    }
    var results = [output]
    for (var s = 0; s < (sideProducts || []).length; s++) {
        var side = sideProducts[s]
        if (!bcSynExists(side.item)) continue
        var sideResult = { item: side.item }
        if (side.count && side.count > 1) sideResult.count = side.count
        if (side.chance && side.chance < 1) sideResult.chance = side.chance
        results.push(sideResult)
    }
    var recipe = {
        type: 'create:mixing',
        ingredients: ingredients,
        results: results,
        processingTime: time || 200
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:synthesis/formulaic/create_mixing/' + id)
}

function bcSynBloodAlchemy(event, id, inputs, output, syphon, ticks, tier) {
    var outputItem = typeof output === 'string' ? output : output.item
    var outputCount = typeof output === 'string' ? 1 : (output.count || 1)
    if (!bcSynExists(outputItem)) return
    for (var i = 0; i < inputs.length; i++) {
        if (!bcSynIngredientExists(inputs[i])) return
    }
    var result = { item: outputItem }
    if (outputCount > 1) result.count = outputCount
    event.custom({
        type: 'bloodmagic:alchemytable',
        input: inputs,
        output: result,
        syphon: syphon,
        ticks: ticks,
        upgradeLevel: tier
    }).id('kubejs:synthesis/magic/blood_alchemy/' + id)
}

function bcSynBloodArc(event, id, input, inputCount, tool, output, sideProducts) {
    if (!bcSynExists(input) || !bcSynExists(tool) || !bcSynExists(output.item)) return
    var added = []
    for (var i = 0; i < (sideProducts || []).length; i++) {
        var side = sideProducts[i]
        if (!bcSynExists(side.item)) continue
        var item = { item: side.item }
        if (side.count && side.count > 1) item.count = side.count
        added.push({
            type: item,
            chance: side.chance || 0.25,
            mainchance: side.mainchance || 0.0
        })
    }
    var recipe = {
        type: 'bloodmagic:arc',
        input: { item: input },
        inputsize: inputCount || 1,
        tool: { item: tool },
        consumeingredient: true,
        mainoutputchance: 0.0,
        output: output
    }
    if (added.length > 0) recipe.addedoutput = added
    event.custom(recipe).id('kubejs:synthesis/magic/blood_arc/' + id)
}

function bcSynArsImbuement(event, id, input, output, pedestalItems, sourceCost) {
    if (!bcSynExists(input) || !bcSynExists(output)) return
    event.custom({
        type: 'ars_nouveau:imbuement',
        count: 1,
        input: { item: input },
        output: output,
        pedestalItems: pedestalItems.map(function (item) { return { item: { item: item } } }),
        source: sourceCost
    }).id('kubejs:synthesis/magic/ars_imbuement/' + id)
}

function bcSynArsApparatus(event, id, reagent, output, pedestalItems, sourceCost) {
    if (!bcSynExists(reagent) || !bcSynExists(output)) return
    for (var i = 0; i < pedestalItems.length; i++) {
        if (!bcSynExists(pedestalItems[i])) return
    }
    event.custom({
        type: 'ars_nouveau:enchanting_apparatus',
        keepNbtOfReagent: false,
        output: { item: output },
        pedestalItems: pedestalItems.map(function (item) { return { item: item } }),
        reagent: [{ item: reagent }],
        sourceCost: sourceCost
    }).id('kubejs:synthesis/magic/ars_apparatus/' + id)
}

var BC_SYN_SIDE_GASES = {
    acetic: { item: 'chemlib:carbon_dioxide', chance: 0.30 },
    sulfuric: { item: 'chemlib:sulfur_dioxide', chance: 0.30 },
    hydrochloric: { item: 'chemlib:hydrogen', chance: 0.30 },
    nitric: { item: 'chemlib:nitrogen_dioxide', chance: 0.35 },
    phosphoric: { item: 'chemlib:oxygen', chance: 0.22 }
}

var BC_SYN_MAGIC_CRYSTALS = [
    { input: 'minecraft:quartz', output: 'chemlib:silicon_dioxide', source: 400, pedestal: ['ars_nouveau:source_gem'] },
    { input: 'chemlib:silicon_dioxide', output: 'chemlib:silicon', source: 900, pedestal: ['ars_nouveau:source_gem', 'bloodmagic:reinforcedslate'] },
    { input: 'chemlib:beryl', output: 'chemlib:beryllium', source: 1200, pedestal: ['ars_nouveau:source_gem', 'minecraft:emerald'] },
    { input: 'ae2:certus_quartz_crystal', output: 'ae2:fluix_dust', source: 1800, pedestal: ['ars_nouveau:source_gem', 'minecraft:redstone', 'bloodmagic:infusedslate'] }
]

var BC_SYN_MAGIC_CUTTING_FLUIDS = {
    acetic: {
        item: 'kubejs:sanguine_acetic_cutting_fluid',
        acid: 'chemlib:acetic_acid',
        base: 'bloodmagic:basiccuttingfluid',
        slate: 'bloodmagic:blankslate',
        syphon: 4000,
        ticks: 160,
        tier: 1
    },
    sulfuric: {
        item: 'kubejs:sanguine_sulfuric_cutting_fluid',
        acid: 'chemlib:sulfuric_acid',
        base: 'bloodmagic:intermediatecuttingfluid',
        slate: 'bloodmagic:reinforcedslate',
        syphon: 7000,
        ticks: 220,
        tier: 2
    },
    hydrochloric: {
        item: 'kubejs:sanguine_hydrochloric_cutting_fluid',
        acid: 'chemlib:hydrochloric_acid',
        base: 'bloodmagic:intermediatecuttingfluid',
        slate: 'bloodmagic:infusedslate',
        syphon: 9000,
        ticks: 260,
        tier: 3
    },
    nitric: {
        item: 'kubejs:sanguine_nitric_cutting_fluid',
        acid: 'chemlib:nitric_acid',
        base: 'bloodmagic:advancedcuttingfluid',
        slate: 'bloodmagic:demonslate',
        syphon: 13000,
        ticks: 340,
        tier: 4
    },
    phosphoric: {
        item: 'kubejs:sanguine_phosphoric_cutting_fluid',
        acid: 'chemlib:phosphoric_acid',
        base: 'bloodmagic:advancedcuttingfluid',
        slate: 'bloodmagic:etherealslate',
        syphon: 16000,
        ticks: 400,
        tier: 4
    }
}

ServerEvents.recipes(function (event) {
    for (var fluidKey in BC_SYN_MAGIC_CUTTING_FLUIDS) {
        var cuttingFluid = BC_SYN_MAGIC_CUTTING_FLUIDS[fluidKey]
         bcSynBloodAlchemy(event, fluidKey + '_cutting_fluid_charge', [
            { item: cuttingFluid.acid },
            { item: cuttingFluid.base },
            { item: cuttingFluid.slate },
            { item: 'ars_nouveau:source_gem' }
        ], cuttingFluid.item, cuttingFluid.syphon, cuttingFluid.ticks, cuttingFluid.tier)
    }

    var safeOxideReductions = [
        { id: 'iron', oxide: 'chemlib:iron_oxide', element: 'chemlib:iron' },
        { id: 'lead', oxide: 'chemlib:lead_oxide', element: 'chemlib:lead' },
        { id: 'tin', oxide: 'chemlib:tin_oxide', element: 'chemlib:tin' },
        { id: 'zinc', oxide: 'chemlib:zinc_oxide', element: 'chemlib:zinc' },
        { id: 'copper', oxide: 'chemlib:copper_ii_oxide', element: 'chemlib:copper' },
        { id: 'nickel', oxide: 'chemlib:nickel_oxide', element: 'chemlib:nickel' },
        { id: 'titanium', oxide: 'chemlib:titanium_oxide', element: 'chemlib:titanium' },
        { id: 'aluminum', oxide: 'chemlib:aluminum_oxide', element: 'chemlib:aluminum' }
    ]
    for (var e = 0; e < safeOxideReductions.length; e++) {
        var reduction = safeOxideReductions[e]
        if (!bcSynExists(reduction.oxide) || !bcSynExists(reduction.element)) continue
         bcSynBloodAlchemy(event, reduction.id + '_blood_reduction', [
            { item: reduction.oxide, count: 4 },
            { item: 'bloodmagic:reinforcedslate' },
            { item: BC_SYN_MAGIC_CUTTING_FLUIDS.sulfuric.item }
        ], { item: reduction.element, count: 4 }, 9000, 260, 2)
         bcSynBloodArc(event, reduction.id + '_sulfuric_reduction_gas', reduction.oxide, 2, BC_SYN_MAGIC_CUTTING_FLUIDS.sulfuric.item, { item: reduction.element, count: 2 }, [
            BC_SYN_SIDE_GASES.sulfuric
        ])
    }

    var deposits = global.BC_RO_DEPOSITS || []
    if (deposits.length > 0) {
        for (var d = 0; d < deposits.length; d++) {
            var dep = deposits[d]
            if (bcSynExists(dep.crushed) &&  bcSynExists(dep.primary)) {
                 bcSynBloodAlchemy(event, dep.id + '_cutting_primary', [
                    { item: dep.crushed },
                    { item: 'bloodmagic:blankslate' },
                    { item: BC_SYN_MAGIC_CUTTING_FLUIDS.acetic.item }
                ], { item: dep.primary, count: 4 }, 4800, 220, 1)
                 bcSynBloodArc(event, dep.id + '_arc_primary_gas', dep.crushed, 1, BC_SYN_MAGIC_CUTTING_FLUIDS.acetic.item, { item: dep.primary, count: 2 }, [
                    BC_SYN_SIDE_GASES.acetic
                ])
            }
            if (bcSynExists(dep.crushed) &&  bcSynExists(dep.trace)) {
                 bcSynBloodAlchemy(event, dep.id + '_life_trace', [
                    { item: dep.crushed },
                    { item: 'bloodmagic:infusedslate' },
                    { item: BC_SYN_MAGIC_CUTTING_FLUIDS.nitric.item }
                ], { item: dep.trace, count: 2 }, 11000, 320, 3)
                 bcSynBloodArc(event, dep.id + '_arc_trace_gas', dep.crushed, 1, BC_SYN_MAGIC_CUTTING_FLUIDS.nitric.item, { item: dep.trace }, [
                    BC_SYN_SIDE_GASES.nitric
                ])
            }
            if (bcSynExists(dep.crushed) &&  bcSynExists(dep.hard)) {
                 bcSynBloodAlchemy(event, dep.id + '_life_hard_fraction', [
                    { item: dep.crushed },
                    { item: 'bloodmagic:demonslate' },
                    { item: BC_SYN_MAGIC_CUTTING_FLUIDS.hydrochloric.item }
                ], { item: dep.hard, count: 2 }, 14000, 380, 4)
                 bcSynBloodArc(event, dep.id + '_arc_hard_gas', dep.crushed, 1, BC_SYN_MAGIC_CUTTING_FLUIDS.hydrochloric.item, { item: dep.hard }, [
                    BC_SYN_SIDE_GASES.hydrochloric
                ])
            }
            if (bcSynExists(dep.crushed) &&  bcSynExists(dep.rare)) {
                 bcSynBloodAlchemy(event, dep.id + '_life_rare_fraction', [
                    { item: dep.crushed },
                    { item: 'bloodmagic:etherealslate' },
                    { item: BC_SYN_MAGIC_CUTTING_FLUIDS.phosphoric.item }
                ], { item: dep.rare, count: 2 }, 18000, 460, 4)
                 bcSynBloodArc(event, dep.id + '_arc_rare_gas', dep.crushed, 1, BC_SYN_MAGIC_CUTTING_FLUIDS.phosphoric.item, { item: dep.rare }, [
                    BC_SYN_SIDE_GASES.phosphoric
                ])
            }
        }
    }

    for (var c = 0; c < BC_SYN_MAGIC_CRYSTALS.length; c++) {
        var crystal = BC_SYN_MAGIC_CRYSTALS[c]
         bcSynArsImbuement(event, crystal.output.replace(':', '_'), crystal.input, crystal.output, crystal.pedestal, crystal.source)
    }

     bcSynArsApparatus(event, 'stabilized_sealed_cell', 'latent_chemlib:sealed_chemical_cell', 'latent_chemlib:sealed_chemical_cell', [
        'ars_nouveau:source_gem',
        'bloodmagic:reinforcedslate',
        'kubejs:pressure_seal',
        'minecraft:amethyst_shard'
    ], 1200)
})
