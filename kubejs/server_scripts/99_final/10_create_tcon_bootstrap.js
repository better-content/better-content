// Final authority for the hand-cranked Create workshop and TCon metallurgy boundary.
// This runs after broad recipe policy passes so later scripts cannot quietly restore a bypass.

var BC_CREATE_TCON = JsonIO.read('kubejs/config/create_tcon_bootstrap.json')

var BC_CREATE_TCON_MANUAL_RECIPES = [
    { output: 'create:hand_crank', pattern: ['PPP', ' A ', ' S '], key: { P: '#minecraft:planks', A: 'create:andesite_alloy', S: 'create:shaft' } },
    { output: 'create:shaft', count: 8, pattern: ['A', 'A'], key: { A: 'create:andesite_alloy' } },
    { output: 'create:cogwheel', count: 2, pattern: [' P ', 'PSP', ' P '], key: { P: '#minecraft:planks', S: 'create:shaft' } },
    { output: 'create:large_cogwheel', count: 2, pattern: ['PPP', 'PCP', 'PPP'], key: { P: '#minecraft:planks', C: 'create:cogwheel' } },
    { output: 'create:belt_connector', pattern: ['KKK', 'KKK'], key: { K: 'minecraft:dried_kelp' } },
    { output: 'create:whisk', pattern: [' A ', 'AIA', 'III'], key: { A: 'create:andesite_alloy', I: '#forge:plates/iron' } },
    { output: 'create:basin', pattern: ['A A', 'ICI', 'AAA'], key: { A: 'create:andesite_alloy', I: '#forge:plates/iron', C: 'kubejs:seared_machine_casing' } },
    { output: 'create:depot', pattern: [' I ', ' C ', ' A '], key: { I: '#forge:plates/iron', C: 'kubejs:seared_machine_casing', A: 'create:andesite_alloy' } },
    { output: 'create:mechanical_press', pattern: [' S ', ' C ', ' I '], key: { S: 'create:shaft', C: 'kubejs:seared_machine_casing', I: 'minecraft:iron_block' } },
    { output: 'create:mechanical_mixer', pattern: [' S ', ' C ', ' W '], key: { S: 'create:shaft', C: 'kubejs:seared_machine_casing', W: 'create:whisk' } },
    { output: 'create:millstone', pattern: [' S ', 'ACA', ' O '], key: { S: 'create:cogwheel', A: 'minecraft:smooth_stone', C: 'kubejs:andesite_machine_casing', O: 'minecraft:stone' } },
    { output: 'create:mechanical_saw', pattern: [' B ', 'ACA', ' S '], key: { B: 'minecraft:iron_block', A: '#forge:plates/iron', C: 'kubejs:andesite_machine_casing', S: 'create:shaft' } },
    { output: 'create:mechanical_drill', pattern: [' I ', 'ACA', ' S '], key: { I: 'minecraft:iron_pickaxe', A: '#forge:plates/iron', C: 'kubejs:andesite_machine_casing', S: 'create:shaft' } },
    { output: 'create:mechanical_crafter', count: 3, pattern: ['AEA', 'CCC', 'AAA'], key: { A: 'create:andesite_alloy', E: 'create:electron_tube', C: 'kubejs:andesite_machine_casing' } },
    { output: 'create:gearbox', pattern: [' C ', 'CAC', ' C '], key: { C: 'create:cogwheel', A: 'create:andesite_casing' } },
    { output: 'create:vertical_gearbox', pattern: ['C C', ' A ', 'C C'], key: { C: 'create:cogwheel', A: 'create:andesite_casing' } },
    { output: 'create:clutch', pattern: [' R ', 'SAS', ' R '], key: { R: 'minecraft:redstone', S: 'create:shaft', A: 'create:andesite_casing' } },
    { output: 'create:gearshift', pattern: [' R ', 'SAS', ' R '], key: { R: 'minecraft:redstone_torch', S: 'create:shaft', A: 'create:andesite_casing' } }
]

function bcCreateTconFail(message) {
    throw new Error('[BC-CREATE-TCON] ' + message)
}

function bcCreateTconItemExists(id) {
    try { return Item.exists(id) } catch (ignored) { return false }
}

function bcCreateTconTagExists(id) {
    try {
        var ingredient = Ingredient.of('#' + id)
        return !(ingredient.isEmpty && ingredient.isEmpty())
    } catch (ignored) {
        return false
    }
}

function bcCreateTconRequireIngredient(ref, context) {
    var ingredientRef = String(ref)
    if (ingredientRef.indexOf('#') === 0) {
        if (!bcCreateTconTagExists(ingredientRef.substring(1))) bcCreateTconFail(context + ' references empty item tag ' + ingredientRef)
    } else if (!bcCreateTconItemExists(ingredientRef)) {
        bcCreateTconFail(context + ' references missing item ' + ingredientRef)
    }
}

function bcCreateTconIngredient(ref) {
    var ingredientRef = String(ref)
    if (ingredientRef.indexOf('#') === 0) return { tag: ingredientRef.substring(1) }
    return { item: ingredientRef }
}

function bcCreateTconKeyJson(key) {
    var result = {}
    for (var symbol in key) result[symbol] = bcCreateTconIngredient(key[symbol])
    return result
}

function bcCreateTconValidateContract() {
    if (!BC_CREATE_TCON || BC_CREATE_TCON.schema !== 'bc.create_tcon_bootstrap.v1') {
        bcCreateTconFail('missing or unsupported create_tcon_bootstrap.json')
    }
    if (BC_CREATE_TCON.manual_recipe_outputs.length !== BC_CREATE_TCON_MANUAL_RECIPES.length) {
        bcCreateTconFail('manual recipe allowlist and implementation differ in size')
    }
    var configuredManual = {}
    for (var i = 0; i < BC_CREATE_TCON.manual_recipe_outputs.length; i++) configuredManual[BC_CREATE_TCON.manual_recipe_outputs[i]] = true
    for (var m = 0; m < BC_CREATE_TCON_MANUAL_RECIPES.length; m++) {
        var manual = BC_CREATE_TCON_MANUAL_RECIPES[m]
        if (!configuredManual[manual.output]) bcCreateTconFail('manual recipe is not allowlisted: ' + manual.output)
        if (!bcCreateTconItemExists(manual.output)) bcCreateTconFail('manual recipe output is not registered: ' + manual.output)
        for (var symbol in manual.key) bcCreateTconRequireIngredient(manual.key[symbol], manual.output)
    }
    for (var b = 0; b < BC_CREATE_TCON.bootstrap_items.length; b++) {
        if (!bcCreateTconItemExists(BC_CREATE_TCON.bootstrap_items[b])) {
            bcCreateTconFail('bootstrap startup item is not registered: ' + BC_CREATE_TCON.bootstrap_items[b])
        }
    }
    for (var s = 0; s < BC_CREATE_TCON.positive_su_sources.length; s++) {
        var source = BC_CREATE_TCON.positive_su_sources[s]
        if (!bcCreateTconItemExists(source.id)) bcCreateTconFail('positive-SU inventory references missing item ' + source.id)
        if (source.policy === 'create_mechanical_crafting') {
            for (var key in source.key) bcCreateTconRequireIngredient(source.key[key], source.id)
        } else if (source.policy !== 'manual_only' && source.policy !== 'recipe_less') {
            bcCreateTconFail('unsupported positive-SU policy for ' + source.id + ': ' + source.policy)
        }
    }
    if (BC_CREATE_TCON.forbidden_power_recipe_ids.length !== 9) {
        bcCreateTconFail('positive-SU bypass denylist must contain exactly nine audited recipe IDs')
    }
    if (BC_CREATE_TCON.forbidden_metallurgy_recipe_ids.length !== 10) {
        bcCreateTconFail('metallurgy bypass denylist must contain exactly ten audited recipe IDs')
    }
    for (var o = 0; o < BC_CREATE_TCON.ore_contract.ores.length; o++) {
        var ore = BC_CREATE_TCON.ore_contract.ores[o]
        if (!bcCreateTconTagExists(ore.input_tag)) bcCreateTconFail('ore contract references empty tag #' + ore.input_tag)
        if (!bcCreateTconItemExists(ore.nugget)) bcCreateTconFail('ore contract references missing nugget ' + ore.nugget)
    }
}

function bcCreateTconFluid(ref, amount, rate) {
    var out = { amount: amount }
    if (ref.tag) out.tag = ref.tag
    else out.fluid = ref.fluid
    if (rate) out.rate = rate
    return out
}

ServerEvents.recipes(function (event) {
    bcCreateTconValidateContract()

    // Defense in depth for native recipes and any stale datapack copies. KubeJS-owned
    // producers are also removed at their source so callback order cannot restore them.
    for (var fp = 0; fp < BC_CREATE_TCON.forbidden_power_recipe_ids.length; fp++) {
        event.remove({ id: BC_CREATE_TCON.forbidden_power_recipe_ids[fp] })
    }
    for (var fm = 0; fm < BC_CREATE_TCON.forbidden_metallurgy_recipe_ids.length; fm++) {
        event.remove({ id: BC_CREATE_TCON.forbidden_metallurgy_recipe_ids[fm] })
    }

    // Patterns are not a progression currency. TCon workstations and molten metal are.
    event.remove({ output: 'tconstruct:pattern' })
    ;[
        'tconstruct:tools/materials/copper/block',
        'tconstruct:tools/materials/copper/ingot',
        'tconstruct:tools/materials/copper/nugget',
        'tconstruct:tools/materials/copper/oxidized'
    ].forEach(function (id) { event.remove({ id: id }) })

    // This is the complete hand-crafting allowlist for the bootstrap workshop.
    for (var i = 0; i < BC_CREATE_TCON_MANUAL_RECIPES.length; i++) {
        var manual = BC_CREATE_TCON_MANUAL_RECIPES[i]
        event.remove({ output: manual.output })
        event.shaped(Item.of(manual.output, manual.count || 1), manual.pattern, manual.key)
            .id('kubejs:create_tcon_bootstrap/manual/' + manual.output.substring(manual.output.indexOf(':') + 1))
    }

    // Prestige lineage files are available in the first crank-powered workshop
    // and still use Create's ordinary material accounting.
    event.remove({ output: 'create:empty_schematic' })
    event.custom({
        type: 'create:mixing',
        ingredients: [{ item: 'minecraft:paper' }, { tag: 'forge:dyes/light_blue' }],
        results: [{ item: 'create:empty_schematic' }],
        processingTime: 80
    }).id('kubejs:create_tcon_bootstrap/manual/empty_schematic')

    event.remove({ output: 'create:schematic_and_quill' })
    event.custom({
        type: 'create:mixing',
        ingredients: [{ item: 'create:empty_schematic' }, { tag: 'forge:feathers' }],
        results: [{ item: 'create:schematic_and_quill' }],
        processingTime: 80
    }).id('kubejs:create_tcon_bootstrap/manual/schematic_and_quill')

    event.remove({ output: 'create:schematic_table' })
    event.shaped('create:schematic_table', [
        'WWW',
        ' S ',
        ' S '
    ], {
        W: '#minecraft:wooden_slabs',
        S: 'minecraft:smooth_stone'
    }).id('kubejs:create_tcon_bootstrap/manual/schematic_table')

    // The cannon uses the same Press/Basin instead of inheriting the later
    // Dispenser casing gate.
    event.remove({ output: 'create:schematicannon' })
    event.custom({
        type: 'create:compacting',
        ingredients: [
            { tag: 'forge:storage_blocks/iron' },
            { tag: 'forge:storage_blocks/iron' },
            { tag: 'minecraft:logs' },
            { tag: 'minecraft:logs' },
            { item: 'minecraft:smooth_stone' },
            { item: 'minecraft:smooth_stone' },
            { item: 'minecraft:bow' },
            { item: 'minecraft:redstone' }
        ],
        results: [{ item: 'create:schematicannon' }],
        processingTime: 200
    }).id('kubejs:create_tcon_bootstrap/manual/schematicannon')

    // The hand-cranked press and basin make the first Deployer without requiring a casing.
    event.remove({ output: 'create:deployer' })
    event.custom({
        type: 'create:compacting',
        ingredients: [
            { item: 'kubejs:seared_machine_casing' },
            { item: 'create:andesite_alloy' },
            { item: 'create:andesite_alloy' },
            { item: 'create:brass_ingot' },
            { tag: 'forge:plates/iron' },
            { item: 'minecraft:redstone' }
        ],
        results: [{ item: 'create:deployer' }],
        processingTime: 240
    }).id('kubejs:create_tcon_bootstrap/machine/first_deployer')

    event.remove({ output: 'create:andesite_casing' })
    event.custom({
        type: 'create:deploying',
        ingredients: [{ tag: 'minecraft:logs' }, { item: 'create:andesite_alloy' }],
        results: [{ item: 'create:andesite_casing' }]
    }).id('kubejs:create_tcon_bootstrap/machine/andesite_casing')

    event.remove({ output: 'kubejs:andesite_machine_casing' })
    event.custom({
        type: 'create:sequenced_assembly',
        ingredient: { item: 'create:andesite_alloy' },
        transitionalItem: { item: 'kubejs:incomplete_andesite_machine_casing' },
        sequence: [
            { type: 'create:deploying', ingredients: [{ item: 'kubejs:incomplete_andesite_machine_casing' }, { item: 'create:andesite_casing' }], results: [{ item: 'kubejs:incomplete_andesite_machine_casing' }] },
            { type: 'create:deploying', ingredients: [{ item: 'kubejs:incomplete_andesite_machine_casing' }, { item: 'create:andesite_alloy' }], results: [{ item: 'kubejs:incomplete_andesite_machine_casing' }] },
            { type: 'create:pressing', ingredients: [{ item: 'kubejs:incomplete_andesite_machine_casing' }], results: [{ item: 'kubejs:incomplete_andesite_machine_casing' }] }
        ],
        results: [{ item: 'kubejs:andesite_machine_casing' }],
        loops: 2
    }).id('kubejs:create_tcon_bootstrap/machine/andesite_machine_casing')

    // Every registered positive-SU block is either the crank, recipe-less creative content,
    // or rebuilt on an actual Create machine surface with a real casing and mechanism.
    for (var s = 0; s < BC_CREATE_TCON.positive_su_sources.length; s++) {
        var source = BC_CREATE_TCON.positive_su_sources[s]
        if (source.policy === 'manual_only') continue
        event.remove({ output: source.id })
        if (source.policy === 'recipe_less') continue
        event.custom({
            type: 'create:mechanical_crafting',
            acceptMirrored: true,
            pattern: source.pattern,
            key: bcCreateTconKeyJson(source.key),
            result: { item: source.id }
        }).id(source.recipe_id)
    }

    // TCon owns early alloy formation. Create may process formed metal, but cannot mix it
    // directly into andesite alloy, brass, or primitive red alloy ingots.
    for (var a = 0; a < BC_CREATE_TCON.forbidden_solid_alloy_mixing_outputs.length; a++) {
        event.remove({ type: 'create:mixing', output: BC_CREATE_TCON.forbidden_solid_alloy_mixing_outputs[a] })
    }
    event.remove({ type: 'minecraft:crafting_shaped', output: 'create:andesite_alloy' })
    event.remove({ type: 'minecraft:crafting_shapeless', output: 'create:andesite_alloy' })
    ;[
        'kubejs:tconstruct/casting_basin/andesite_alloy_zinc',
        'kubejs:tconstruct/casting_basin/andesite_alloy_iron',
        'tconstruct:compat/create/andesite_alloy_iron',
        'tconstruct:compat/create/andesite_alloy_zinc',
        'tconstruct:casting_basin/compat/create/andesite_alloy_iron',
        'tconstruct:casting_basin/compat/create/andesite_alloy_zinc'
    ].forEach(function (id) { event.remove({ id: id }) })
    ;[
        { id: 'andesite_alloy_zinc', cast: 'minecraft:andesite', fluid: 'forge:molten_zinc', output: 'create:andesite_alloy', count: 1 },
        { id: 'andesite_alloy_iron', cast: 'minecraft:andesite', fluid: 'forge:molten_iron', output: 'create:andesite_alloy', count: 1 },
        { id: 'red_alloy_brass', cast: 'minecraft:redstone_block', fluid: 'forge:molten_brass', output: 'morered:red_alloy_ingot', count: 1 }
    ].forEach(function (alloy) {
        event.custom({
            type: 'tconstruct:casting_basin',
            cast: { item: alloy.cast },
            cast_consumed: true,
            fluid: { tag: alloy.fluid, amount: 90 },
            result: alloy.count > 1 ? { item: alloy.output, count: alloy.count } : alloy.output,
            cooling_time: 100
        }).id('kubejs:create_tcon_bootstrap/alloy/' + alloy.id)
    })

    // Direct ore has one explicit economy: furnace recovery, Melter primary metal,
    // or Foundry-scale metal plus a geologically meaningful byproduct.
    var oreContract = BC_CREATE_TCON.ore_contract
    for (var o = 0; o < oreContract.ores.length; o++) {
        var ore = oreContract.ores[o]
        var input = '#' + ore.input_tag
        event.remove({ type: 'minecraft:smelting', input: input })
        event.remove({ type: 'minecraft:blasting', input: input })
        event.remove({ id: 'kubejs:tconstruct/melting/' + ore.id })
        event.remove({ id: 'kubejs:tconstruct/ore_melting/' + ore.id })

        event.smelting(Item.of(ore.nugget, oreContract.furnace_nuggets), input)
            .xp(0.1).cookingTime(240)
            .id('kubejs:create_tcon_bootstrap/ore/furnace/' + ore.id)
        event.blasting(Item.of(ore.nugget, oreContract.furnace_nuggets), input)
            .xp(0.1).cookingTime(120)
            .id('kubejs:create_tcon_bootstrap/ore/blasting/' + ore.id)

        event.custom({
            type: 'tconstruct:melting',
            ingredient: { tag: ore.input_tag },
            result: { tag: ore.molten_tag, amount: oreContract.melter_millibuckets },
            temperature: ore.temperature,
            time: 120
        }).id('kubejs:create_tcon_bootstrap/ore/melter/' + ore.id)

        var byproductRef = ore.byproduct_tag ? { tag: ore.byproduct_tag } : { fluid: ore.byproduct_fluid }
        event.custom({
            type: 'tconstruct:ore_melting',
            ingredient: { tag: ore.input_tag },
            result: { tag: ore.molten_tag, amount: oreContract.foundry_millibuckets },
            byproducts: [bcCreateTconFluid(byproductRef, oreContract.byproduct_millibuckets, 'metal')],
            rate: 'metal',
            temperature: ore.temperature,
            time: 180
        }).id('kubejs:create_tcon_bootstrap/ore/foundry/' + ore.id)
    }
})
