// Reversible host separation for Excavated Variants' runtime-generated Realistic Ores
// blocks. Native stone and deepslate recipes ship in Realistic Ores itself; this pass
// discovers every additional enabled host rather than hard-coding the generated matrix.

var BC_EV_ORE_CHUNKS = {
    bauxite_laterite: 'realisticores:ore_chunk_bauxite_laterite',
    coal_measures: 'realisticores:ore_chunk_coal_measures',
    copper_sulfide: 'realisticores:ore_chunk_copper_sulfide_ore',
    corundum_beryl_gem_vein: 'realisticores:ore_chunk_corundum_beryl_gem_vein',
    cupriferous_redbed_redstone_vein: 'realisticores:ore_chunk_cupriferous_redbed_redstone_vein',
    emerald_schist_beryl_vein: 'realisticores:ore_chunk_emerald_schist_beryl_vein',
    ironstone: 'realisticores:ore_chunk_ironstone',
    kimberlite_pipe: 'realisticores:ore_chunk_kimberlite_pipe',
    lazurite_vein: 'realisticores:ore_chunk_lazurite_vein',
    lead_zinc_vein: 'realisticores:ore_chunk_lead_zinc_vein',
    nickel_sulfide: 'realisticores:ore_chunk_nickel_sulfide_ore',
    osmiridium_lava_sulfide: 'realisticores:ore_chunk_osmiridium_lava_sulfide_ore',
    phosphate_rock: 'realisticores:ore_chunk_phosphate_rock',
    quartz_vein: 'realisticores:ore_chunk_quartz_vein',
    soul_bearing_black_shale_soulstone_vein: 'realisticores:ore_chunk_soul_bearing_black_shale_soulstone_vein',
    sulfur_bearing_pyrite: 'realisticores:ore_chunk_sulfur_bearing_pyrite_ore',
    thorium: 'realisticores:ore_chunk_thorium_ore',
    tin: 'realisticores:ore_chunk_tin_ore',
    tin_tungsten_greisen: 'realisticores:ore_chunk_tin_tungsten_greisen',
    titanium_iron_oxide: 'realisticores:ore_chunk_titanium_iron_oxide_ore',
    uranium: 'realisticores:ore_chunk_uranium_ore',
    zinc: 'realisticores:ore_chunk_zinc_ore'
}

function bcExactItemIngredient(itemId) {
    return { type: 'forge:nbt', item: itemId }
}

function bcIsExcavatedVariantOreBlock(block) {
    var blockClass = block.getClass()
    while (blockClass != null) {
        if (String(blockClass.getName()) === 'dev.lukebemish.excavatedvariants.impl.ModifiedOreBlock') return true
        blockClass = blockClass.getSuperclass()
    }
    return false
}

ServerEvents.recipes(function (event) {
    if (!Platform.isLoaded('excavated_variants')) return

    var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
    var blockRegistry = ForgeRegistries.BLOCKS
    // Static validation stubs do not expose the live Forge registry.
    if (blockRegistry == null) return

    var blocks = blockRegistry.getValues().iterator()
    var registered = 0

    while (blocks.hasNext()) {
        var block = blocks.next()
        // Rhino's Java wrappers do not reliably implement Java inheritance for
        // `instanceof`, so walk the actual Java class hierarchy instead.
        if (!bcIsExcavatedVariantOreBlock(block)) continue

        var oreId = String(block.ore.id)
        var chunkId = BC_EV_ORE_CHUNKS[oreId]
        if (!chunkId) continue

        var oreBlockId = String(ForgeRegistries.BLOCKS.getKey(block))
        var stoneBlockId = String(block.stone.blockId)
        var recipePath = oreBlockId.replace(':', '/')

        event.custom({
            type: 'create:crushing',
            ingredients: [bcExactItemIngredient(oreBlockId)],
            processingTime: 250,
            results: [
                { item: chunkId },
                { item: stoneBlockId }
            ]
        }).id('kubejs:realistic_ores/host_separation/' + recipePath)

        event.shapeless(oreBlockId, [chunkId, stoneBlockId])
            .id('kubejs:realistic_ores/host_reassembly/' + recipePath)

        registered++
    }

    console.info('[BC ore chunks] Registered ' + registered + ' Excavated Variants host cycles')
})
