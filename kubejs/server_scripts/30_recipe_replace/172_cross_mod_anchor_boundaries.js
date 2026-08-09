// Native-anchor cross-mod boundaries.
//
// These recipes move progression authority to a small set of ingredients that
// already dominate their own mod's recipe graph. Downstream native recipes are
// intentionally left alone. Each boundary stays on a machine or ritual surface;
// none of these anchors is returned to the ordinary crafting grid.

function bcAnchorExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

function bcAnchorIngredient(id) {
    if (id.charAt(0) === '#') return { tag: id.substring(1) }
    return { item: id }
}

function bcAnchorCanMake(output, inputs) {
    if (!bcAnchorExists(output)) return false
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i]
        if (input.charAt(0) !== '#' && !bcAnchorExists(input)) return false
    }
    return true
}

function bcAnchorResult(output, count) {
    var result = { item: output }
    if (count && count > 1) result.count = count
    return result
}

function bcAnchorStack(id, count) {
    var stack = bcAnchorIngredient(id)
    stack.type = 'pneumaticcraft:stacked_item'
    stack.count = count || 1
    return stack
}

function bcAnchorRemove(event, output) {
    event.remove({ output: output })
}

function bcAnchorMechanical(event, id, output, count, pattern, keys) {
    var inputs = []
    for (var symbol in keys) inputs.push(keys[symbol])
    if (!bcAnchorCanMake(output, inputs)) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'create:mechanical_crafting',
        acceptMirrored: true,
        pattern: pattern,
        key: global.bcRecipeKey(keys),
        result: bcAnchorResult(output, count || 1)
    }).id('kubejs:cross_mod_anchor/create_mechanical/' + id)
}

function bcAnchorMixing(event, id, output, count, inputs) {
    if (!bcAnchorCanMake(output, inputs)) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'create:mixing',
        ingredients: inputs.map(bcAnchorIngredient),
        results: [bcAnchorResult(output, count)]
    }).id('kubejs:cross_mod_anchor/create_mixing/' + id)
}

function bcAnchorPressure(event, id, output, count, pressure, inputs) {
    var ids = inputs.map(function (entry) { return entry.id })
    if (!bcAnchorCanMake(output, ids)) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'pneumaticcraft:pressure_chamber',
        inputs: inputs.map(function (entry) { return bcAnchorStack(entry.id, entry.count) }),
        pressure: pressure,
        results: [bcAnchorResult(output, count)]
    }).id('kubejs:cross_mod_anchor/pncr_pressure/' + id)
}

function bcAnchorBloodAlchemy(event, id, output, count, inputs, syphon, ticks, tier) {
    if (!bcAnchorCanMake(output, inputs)) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'bloodmagic:alchemytable',
        input: inputs.map(bcAnchorIngredient),
        output: bcAnchorResult(output, count),
        syphon: syphon,
        ticks: ticks,
        upgradeLevel: tier
    }).id('kubejs:cross_mod_anchor/blood_alchemy/' + id)
}

function bcAnchorHexerei(event, id, output, count, inputs) {
    if (!bcAnchorCanMake(output, inputs)) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'hexerei:mixingcauldron',
        liquid: { fluid: 'minecraft:water' },
        ingredients: inputs.map(bcAnchorIngredient),
        output: bcAnchorResult(output, count),
        liquidOutput: { fluid: 'minecraft:water' },
        fluidLevelsConsumed: 333,
        heatRequirement: 'heated'
    }).id('kubejs:cross_mod_anchor/hexerei_cauldron/' + id)
}

function bcAnchorArsImbuement(event, id, output, input, pedestalItems, source) {
    if (!bcAnchorCanMake(output, [input].concat(pedestalItems))) return
    bcAnchorRemove(event, output)
    event.custom({
        type: 'ars_nouveau:imbuement',
        count: 1,
        input: bcAnchorIngredient(input),
        output: output,
        pedestalItems: pedestalItems.map(function (item) {
            return { item: bcAnchorIngredient(item) }
        }),
        source: source
    }).id('kubejs:cross_mod_anchor/ars_imbuement/' + id)
}

function bcAnchorMalumInfusion(event, id, output, count, input, inputCount, extras, spirits) {
    var allInputs = [input]
    for (var i = 0; i < extras.length; i++) allInputs.push(extras[i].id)
    if (!bcAnchorCanMake(output, allInputs)) return
    bcAnchorRemove(event, output)
    var mainInput = bcAnchorIngredient(input)
    mainInput.count = inputCount || 1
    event.custom({
        type: 'malum:spirit_infusion',
        input: mainInput,
        extra_items: extras.map(function (entry) {
            var ingredient = bcAnchorIngredient(entry.id)
            ingredient.count = entry.count || 1
            return ingredient
        }),
        spirits: spirits,
        output: bcAnchorResult(output, count)
    }).id('kubejs:cross_mod_anchor/malum_spirit_infusion/' + id)
}

ServerEvents.recipes(function (event) {
    // Non-crafting serializers are removed by exact native ID because generic
    // output filters cannot reliably inspect every mod's custom result codec.
    event.remove({ id: 'ars_nouveau:imbuement_abjuration_essence' })
    event.remove({ id: 'ars_nouveau:imbuement_manipulation_essence' })
    event.remove({ id: 'malum:spirit_infusion/esoteric_spool' })
    event.remove({ id: 'malum:spirit_infusion/alchemical_impetus' })
    event.remove({ id: 'malum:spirit_infusion/soul_stained_steel_ingot' })

    // Compressed Creativity's rotor is the shared mechanical heart of its air/SU
    // machinery. PNCR blades and a pack pressure seal carry the Airtight proof.
    bcAnchorMechanical(event, 'compressedcreativity_engine_rotor',
        'compressedcreativity:engine_rotor', 1, [
            'BTB',
            'PSP',
            'BTB'
        ], {
            B: 'pneumaticcraft:turbine_blade',
            T: 'pneumaticcraft:advanced_pressure_tube',
            P: 'kubejs:pressure_seal',
            S: 'create:shaft'
        })

    // Little Logistics uses one spring throughout its rolling stock. Mixing the
    // spring on Create machinery makes that native hub the transport boundary.
    bcAnchorMixing(event, 'littlelogistics_spring', 'littlelogistics:spring', 4, [
        'create:andesite_alloy',
        '#forge:nuggets/iron',
        '#forge:string',
        '#forge:string'
    ])

    // Weather control is electrical instrumentation, not an iron/redstone grid
    // trinket. Its own weather item remains the hub for the mod's instruments.
    bcAnchorPressure(event, 'weather2_weather_item', 'weather2:weather_item', 1, 1.5, [
        { id: 'kubejs:electrical_instrumentation_module', count: 1 },
        { id: 'powergrid:redstone_relay', count: 1 },
        { id: '#forge:plates/gold', count: 2 },
        { id: '#forge:plates/iron', count: 4 }
    ])

    // Diving air belongs to the normal-air spine. The completed tank is a
    // reviewed fallback boundary because Thalassophobia has no useful native hub.
    bcAnchorPressure(event, 'thalassophobia_oxygen_tank', 'thalassophobia:oxygen_tank', 1, 2.0, [
        { id: 'pneumaticcraft:air_canister', count: 1 },
        { id: 'kubejs:pressure_seal', count: 2 },
        { id: 'thalassophobia:pearl', count: 1 },
        { id: '#forge:plates/gold', count: 2 }
    ])

    // Shadow dust controls More Artifacts' supernatural equipment family. Blood
    // alchemy turns the hub itself into the boundary instead of rewriting each use.
    bcAnchorBloodAlchemy(event, 'moreartifacts_shadow_dust', 'moreartifacts:shadow_dust', 4, [
        'minecraft:redstone',
        'minecraft:ender_pearl',
        'minecraft:diamond',
        'deeperdarker:cobbled_sculk_stone',
        'bloodmagic:infusedslate'
    ], 6000, 160, 2)

    // Ars keeps its native imbuement hierarchy. Blood proofs are added to the
    // pedestal ring at the two essences that dominate consequential utility.
    bcAnchorHexerei(event, 'ars_blank_thread', 'ars_nouveau:blank_thread', 4, [
        'ars_nouveau:magebloom_fiber',
        'ars_nouveau:magebloom_fiber',
        'ars_nouveau:magebloom_fiber',
        'hexerei:wax_blend',
        '#forge:nuggets/gold',
        'bloodmagic:blankslate'
    ])
    bcAnchorArsImbuement(event, 'ars_abjuration_essence',
        'ars_nouveau:abjuration_essence', '#forge:gems/source', [
            'minecraft:fermented_spider_eye',
            'minecraft:sugar',
            'minecraft:milk_bucket',
            'bloodmagic:reinforcedslate'
        ], 2500)
    bcAnchorArsImbuement(event, 'ars_manipulation_essence',
        'ars_nouveau:manipulation_essence', '#forge:gems/source', [
            'minecraft:stone_button',
            'minecraft:redstone',
            'minecraft:clock',
            'bloodmagic:infusedslate'
        ], 3000)

    // Malum's three recurring manufactured hubs now carry ascending Blood proofs
    // while retaining Malum spirit infusion and its native reagents/spirits.
    bcAnchorMalumInfusion(event, 'malum_esoteric_spool', 'malum:esoteric_spool', 4,
        '#forge:ingots/iron', 4, [
            { id: 'malum:hex_ash', count: 2 },
            { id: 'bloodmagic:blankslate', count: 1 }
        ], [{ type: 'arcane', count: 4 }])
    bcAnchorMalumInfusion(event, 'malum_alchemical_impetus', 'malum:alchemical_impetus', 1,
        'malum:alchemical_calx', 8, [
            { id: 'malum:processed_soulstone', count: 3 },
            { id: 'malum:hex_ash', count: 1 },
            { id: 'bloodmagic:reinforcedslate', count: 1 }
        ], [{ type: 'arcane', count: 4 }, { type: 'earthen', count: 4 }])
    bcAnchorMalumInfusion(event, 'malum_soul_stained_steel', 'malum:soul_stained_steel_ingot', 1,
        'minecraft:iron_ingot', 1, [
            { id: 'malum:processed_soulstone', count: 4 },
            { id: 'bloodmagic:infusedslate', count: 1 }
        ], [{ type: 'wicked', count: 3 }, { type: 'earthen', count: 1 }, { type: 'arcane', count: 1 }])

    // Occultism begins downstream of Hexerei. Otherstone is the recurring native
    // hub, so all recipe acquisition is concentrated into the mixing cauldron.
    bcAnchorHexerei(event, 'occultism_otherstone', 'occultism:otherstone', 8, [
        'minecraft:andesite',
        'minecraft:andesite',
        'hexerei:moon_dust',
        'hexerei:infused_fabric',
        'deeperdarker:cobbled_sculk_stone',
        'bloodmagic:reinforcedslate'
    ])
})
