// Exact host separation for Excavated Variants' runtime-generated Realistic
// Ores blocks. Native stone/deepslate cycles are supplied by Realistic Ores.

var BC_EV_ORE_CHUNKS = {
    bauxite_laterite: 'realistic_ores:ore_chunk_bauxite_laterite',
    coal_measures: 'realistic_ores:ore_chunk_coal_measures',
    copper_sulfide: 'realistic_ores:ore_chunk_copper_sulfide_ore',
    corundum_beryl_gem_vein: 'realistic_ores:ore_chunk_corundum_beryl_gem_vein',
    cupriferous_redbed_redstone_vein: 'realistic_ores:ore_chunk_cupriferous_redbed_redstone_vein',
    emerald_schist_beryl_vein: 'realistic_ores:ore_chunk_emerald_schist_beryl_vein',
    ironstone: 'realistic_ores:ore_chunk_ironstone',
    kimberlite_pipe: 'realistic_ores:ore_chunk_kimberlite_pipe',
    lazurite_vein: 'realistic_ores:ore_chunk_lazurite_vein',
    lead_zinc_vein: 'realistic_ores:ore_chunk_lead_zinc_vein',
    nickel_sulfide: 'realistic_ores:ore_chunk_nickel_sulfide_ore',
    osmiridium_lava_sulfide: 'realistic_ores:ore_chunk_osmiridium_lava_sulfide_ore',
    phosphate_rock: 'realistic_ores:ore_chunk_phosphate_rock',
    quartz_vein: 'realistic_ores:ore_chunk_quartz_vein',
    soul_bearing_black_shale_soulstone_vein: 'realistic_ores:ore_chunk_soul_bearing_black_shale_soulstone_vein',
    sulfur_bearing_pyrite: 'realistic_ores:ore_chunk_sulfur_bearing_pyrite_ore',
    thorium: 'realistic_ores:ore_chunk_thorium_ore',
    tin: 'realistic_ores:ore_chunk_tin_ore',
    tin_tungsten_greisen: 'realistic_ores:ore_chunk_tin_tungsten_greisen',
    titanium_iron_oxide: 'realistic_ores:ore_chunk_titanium_iron_oxide_ore',
    uranium: 'realistic_ores:ore_chunk_uranium_ore',
    zinc: 'realistic_ores:ore_chunk_zinc_ore'
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
    if (blockRegistry == null) return

    var blocks = blockRegistry.getValues().iterator()
    var registered = 0

    while (blocks.hasNext()) {
        var block = blocks.next()
        // Rhino's wrappers do not reliably expose Java inheritance to
        // `instanceof`, so inspect the actual Java class hierarchy.
        if (!bcIsExcavatedVariantOreBlock(block)) continue

        var chunkId = BC_EV_ORE_CHUNKS[String(block.ore.id)]
        if (!chunkId) continue

        var oreBlockId = String(blockRegistry.getKey(block))
        var substrateId = String(block.stone.blockId)
        var recipePath = oreBlockId.replace(':', '/')

        event.custom({
            type: 'create:crushing',
            ingredients: [{ item: oreBlockId }],
            processingTime: 250,
            results: [
                { item: chunkId },
                { item: substrateId }
            ]
        }).id('kubejs:realistic_ores/host_separation/' + recipePath)

        event.shapeless(oreBlockId, [chunkId, substrateId])
            .id('kubejs:realistic_ores/host_reassembly/' + recipePath)

        registered++
    }

    console.info('[BC ore chunks] Registered ' + registered + ' Excavated Variants host cycles')
})
