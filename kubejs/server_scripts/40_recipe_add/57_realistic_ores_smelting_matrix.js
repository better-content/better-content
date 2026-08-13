// Furnace, Smeltery, and Foundry exits for each Realistic Ores processing stage.

function bcRoStageItem(material, stage) {
    if (material.kind === 'metal') {
        if (stage === 0) return { item: material.nugget, count: 4 }
        return { item: material.output, count: stage }
    }
    if (material.kind === 'gem') {
        if (stage === 0) return { item: material.chip, count: 4 }
        return { item: material.output, count: stage }
    }
    return { item: material.output, count: [2, 4, 8, 12][stage] }
}

function bcRoFluidResult(material, amount) {
    var result = { amount: amount }
    if (material.fluidTag) result.tag = material.fluidTag
    else result.fluid = material.fluid
    return result
}

function bcRoBaseFluidAmount(material, stage) {
    if (material.kind === 'metal' || material.kind === 'gem') return [40, 90, 180, 270][stage]
    return (material.fluidUnit || 90) * [2, 4, 8, 12][stage]
}

function bcRoPreviewAmount(material, stage) {
    if (material.kind === 'bulk') return stage === 0 ? 45 : 90
    return stage === 0 ? 10 : 45
}

function bcRoCook(event, id, input, output) {
    event.remove({ type: 'minecraft:smelting', input: input })
    event.remove({ type: 'minecraft:blasting', input: input })
    event.smelting(Item.of(output.item, output.count), input).xp(0.1).cookingTime(240)
        .id('kubejs:realistic_ores/furnace/' + id)
    event.blasting(Item.of(output.item, output.count), input).xp(0.1).cookingTime(120)
        .id('kubejs:realistic_ores/blasting/' + id)
}

function bcRoMelt(event, id, type, input, material, amount, byproducts) {
    var recipe = {
        type: type,
        ingredient: { item: input },
        result: bcRoFluidResult(material, amount),
        temperature: material.temperature,
        time: 120
    }
    if (type === 'tconstruct:ore_melting') recipe.rate = 'metal'
    if (byproducts && byproducts.length > 0) recipe.byproducts = byproducts
    event.custom(recipe).id('kubejs:realistic_ores/' + (type === 'tconstruct:ore_melting' ? 'foundry/' : 'smeltery/') + id)
}

function bcRoPreviewByproducts(dep, materials, stage) {
    var byproducts = []
    for (var i = 0; i < dep.foundryPreview.length; i++) {
        var preview = materials[dep.foundryPreview[i]]
        if (!preview || (!preview.fluid && !preview.fluidTag) || preview.id === dep.primary) continue
        var output = bcRoFluidResult(preview, bcRoPreviewAmount(preview, stage))
        output.rate = 'metal'
        byproducts.push(output)
    }
    return byproducts
}

ServerEvents.recipes(function (event) {
    var deposits = global.BC_REALISTIC_ORES || []
    var materials = global.BC_RO_MATERIAL_BY_ID || {}

    for (var d = 0; d < deposits.length; d++) {
        var dep = deposits[d]
        var primary = materials[dep.primary]
        if (!primary) continue

        bcRoCook(event, dep.id + '/chunk', dep.chunk, bcRoStageItem(primary, 0))
        bcRoCook(event, dep.id + '/crushed', dep.crushed, bcRoStageItem(primary, 1))

        if (primary.fluid || primary.fluidTag) {
            var chunkBase = bcRoBaseFluidAmount(primary, 0)
            var crushedBase = bcRoBaseFluidAmount(primary, 1)
            bcRoMelt(event, dep.id + '/chunk', 'tconstruct:melting', dep.chunk, primary, chunkBase * 2, null)
            bcRoMelt(event, dep.id + '/chunk', 'tconstruct:ore_melting', dep.chunk, primary, chunkBase * 3, bcRoPreviewByproducts(dep, materials, 0))
            bcRoMelt(event, dep.id + '/crushed', 'tconstruct:melting', dep.crushed, primary, crushedBase * 2, null)
            bcRoMelt(event, dep.id + '/crushed', 'tconstruct:ore_melting', dep.crushed, primary, crushedBase * 3, bcRoPreviewByproducts(dep, materials, 1))
        }
    }

    var materialList = global.BC_RO_MATERIALS || []
    for (var m = 0; m < materialList.length; m++) {
        var material = materialList[m]
        bcRoCook(event, 'concentrates/' + material.id + '/separated', material.concentrate, bcRoStageItem(material, 2))
        bcRoCook(event, 'concentrates/' + material.id + '/washed', material.washed, bcRoStageItem(material, 3))

        if (material.fluid || material.fluidTag) {
            var separatedBase = bcRoBaseFluidAmount(material, 2)
            var washedBase = bcRoBaseFluidAmount(material, 3)
            bcRoMelt(event, 'concentrates/' + material.id + '/separated', 'tconstruct:melting', material.concentrate, material, separatedBase * 2, null)
            bcRoMelt(event, 'concentrates/' + material.id + '/separated', 'tconstruct:ore_melting', material.concentrate, material, separatedBase * 3, null)
            bcRoMelt(event, 'concentrates/' + material.id + '/washed', 'tconstruct:melting', material.washed, material, washedBase * 2, null)
            bcRoMelt(event, 'concentrates/' + material.id + '/washed', 'tconstruct:ore_melting', material.washed, material, washedBase * 3, null)
        }
    }

    ;[
        ['diamond', 'minecraft:diamond'],
        ['emerald', 'minecraft:emerald'],
        ['amethyst', 'minecraft:amethyst_shard']
    ].forEach(function (gem) {
        var chips = []
        for (var chipIndex = 0; chipIndex < 9; chipIndex++) chips.push('kubejs:' + gem[0] + '_chip')
        event.shapeless(Item.of(gem[1], 1), chips)
            .id('kubejs:realistic_ores/gem_chips/' + gem[0] + '/assemble')
        event.shapeless(Item.of('kubejs:' + gem[0] + '_chip', 9), [gem[1]])
            .id('kubejs:realistic_ores/gem_chips/' + gem[0] + '/split')
    })
})
