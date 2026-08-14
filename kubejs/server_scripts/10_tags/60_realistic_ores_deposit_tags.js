// Processing-facing tags for Realistic Ores. Ore blocks and host-independent
// chunks intentionally live in separate tag families so generic ore recipes
// cannot treat either form as the other.

var BC_DEPOSIT_SOURCE_BLOCKS = {
    coal_measures: ['realistic_ores:coal_measures', 'realistic_ores:deepslate_coal_measures'],
    ironstone: ['realistic_ores:ironstone', 'realistic_ores:deepslate_ironstone'],
    copper_sulfide: ['realistic_ores:copper_sulfide_ore', 'realistic_ores:deepslate_copper_sulfide_ore'],
    tin: ['realistic_ores:tin_ore', 'realistic_ores:deepslate_tin_ore'],
    zinc: ['realistic_ores:zinc_ore', 'realistic_ores:deepslate_zinc_ore'],
    lead_zinc_vein: ['realistic_ores:lead_zinc_vein', 'realistic_ores:deepslate_lead_zinc_vein'],
    quartz_vein: ['realistic_ores:quartz_vein', 'realistic_ores:deepslate_quartz_vein'],
    bauxite_laterite: ['realistic_ores:bauxite_laterite', 'realistic_ores:deepslate_bauxite_laterite'],
    nickel_sulfide: ['realistic_ores:nickel_sulfide_ore', 'realistic_ores:deepslate_nickel_sulfide_ore'],
    osmiridium_lava_sulfide: ['realistic_ores:osmiridium_lava_sulfide_ore', 'realistic_ores:deepslate_osmiridium_lava_sulfide_ore'],
    tin_tungsten_greisen: ['realistic_ores:tin_tungsten_greisen', 'realistic_ores:deepslate_tin_tungsten_greisen'],
    titanium_iron_oxide: ['realistic_ores:titanium_iron_oxide_ore', 'realistic_ores:deepslate_titanium_iron_oxide_ore'],
    kimberlite_pipe: ['realistic_ores:kimberlite_pipe', 'realistic_ores:deepslate_kimberlite_pipe'],
    emerald_schist_beryl: ['realistic_ores:emerald_schist_beryl_vein', 'realistic_ores:deepslate_emerald_schist_beryl_vein'],
    corundum_beryl_vein: ['realistic_ores:corundum_beryl_gem_vein', 'realistic_ores:deepslate_corundum_beryl_gem_vein'],
    uranium_ore: ['realistic_ores:uranium_ore', 'realistic_ores:deepslate_uranium_ore'],
    thorium_ore: ['realistic_ores:thorium_ore', 'realistic_ores:deepslate_thorium_ore'],
    cupriferous_redbed_redstone_vein: ['realistic_ores:cupriferous_redbed_redstone_vein', 'realistic_ores:deepslate_cupriferous_redbed_redstone_vein'],
    lazurite_vein: ['realistic_ores:lazurite_vein', 'realistic_ores:deepslate_lazurite_vein'],
    phosphate_rock: ['realistic_ores:phosphate_rock', 'realistic_ores:deepslate_phosphate_rock'],
    soul_bearing_black_shale_soulstone_vein: ['realistic_ores:soul_bearing_black_shale_soulstone_vein', 'realistic_ores:deepslate_soul_bearing_black_shale_soulstone_vein'],
    sulfur_bearing_pyrite_ore: ['realistic_ores:sulfur_bearing_pyrite_ore', 'realistic_ores:deepslate_sulfur_bearing_pyrite_ore']
}

var BC_DEPOSIT_ORE_CHUNKS = {
    coal_measures: 'realistic_ores:ore_chunk_coal_measures',
    ironstone: 'realistic_ores:ore_chunk_ironstone',
    copper_sulfide: 'realistic_ores:ore_chunk_copper_sulfide_ore',
    tin: 'realistic_ores:ore_chunk_tin_ore',
    zinc: 'realistic_ores:ore_chunk_zinc_ore',
    lead_zinc_vein: 'realistic_ores:ore_chunk_lead_zinc_vein',
    quartz_vein: 'realistic_ores:ore_chunk_quartz_vein',
    bauxite_laterite: 'realistic_ores:ore_chunk_bauxite_laterite',
    nickel_sulfide: 'realistic_ores:ore_chunk_nickel_sulfide_ore',
    osmiridium_lava_sulfide: 'realistic_ores:ore_chunk_osmiridium_lava_sulfide_ore',
    tin_tungsten_greisen: 'realistic_ores:ore_chunk_tin_tungsten_greisen',
    titanium_iron_oxide: 'realistic_ores:ore_chunk_titanium_iron_oxide_ore',
    kimberlite_pipe: 'realistic_ores:ore_chunk_kimberlite_pipe',
    emerald_schist_beryl: 'realistic_ores:ore_chunk_emerald_schist_beryl_vein',
    corundum_beryl_vein: 'realistic_ores:ore_chunk_corundum_beryl_gem_vein',
    uranium_ore: 'realistic_ores:ore_chunk_uranium_ore',
    thorium_ore: 'realistic_ores:ore_chunk_thorium_ore',
    cupriferous_redbed_redstone_vein: 'realistic_ores:ore_chunk_cupriferous_redbed_redstone_vein',
    lazurite_vein: 'realistic_ores:ore_chunk_lazurite_vein',
    phosphate_rock: 'realistic_ores:ore_chunk_phosphate_rock',
    soul_bearing_black_shale_soulstone_vein: 'realistic_ores:ore_chunk_soul_bearing_black_shale_soulstone_vein',
    sulfur_bearing_pyrite_ore: 'realistic_ores:ore_chunk_sulfur_bearing_pyrite_ore'
}

var BC_DEPOSIT_FORGE_ORE_TAGS = {
    coal_measures: ['coal'],
    ironstone: ['iron'],
    copper_sulfide: ['copper'],
    tin: ['tin'],
    zinc: ['zinc'],
    lead_zinc_vein: ['lead', 'zinc'],
    quartz_vein: ['quartz'],
    bauxite_laterite: ['aluminum'],
    nickel_sulfide: ['nickel'],
    osmiridium_lava_sulfide: ['osmium', 'iridium'],
    tin_tungsten_greisen: ['tin', 'tungsten'],
    titanium_iron_oxide: ['titanium', 'iron'],
    kimberlite_pipe: ['diamond'],
    emerald_schist_beryl: ['emerald'],
    corundum_beryl_vein: [],
    uranium_ore: ['uranium'],
    thorium_ore: ['thorium'],
    cupriferous_redbed_redstone_vein: ['redstone', 'copper'],
    lazurite_vein: ['lapis'],
    phosphate_rock: ['phosphate'],
    soul_bearing_black_shale_soulstone_vein: [],
    sulfur_bearing_pyrite_ore: ['sulfur']
}

var BC_EV_ORE_TO_DEPOSIT = {
    bauxite_laterite: 'bauxite_laterite',
    coal_measures: 'coal_measures',
    copper_sulfide: 'copper_sulfide',
    corundum_beryl_gem_vein: 'corundum_beryl_vein',
    cupriferous_redbed_redstone_vein: 'cupriferous_redbed_redstone_vein',
    emerald_schist_beryl_vein: 'emerald_schist_beryl',
    ironstone: 'ironstone',
    kimberlite_pipe: 'kimberlite_pipe',
    lazurite_vein: 'lazurite_vein',
    lead_zinc_vein: 'lead_zinc_vein',
    nickel_sulfide: 'nickel_sulfide',
    osmiridium_lava_sulfide: 'osmiridium_lava_sulfide',
    phosphate_rock: 'phosphate_rock',
    quartz_vein: 'quartz_vein',
    soul_bearing_black_shale_soulstone_vein: 'soul_bearing_black_shale_soulstone_vein',
    sulfur_bearing_pyrite: 'sulfur_bearing_pyrite_ore',
    thorium: 'thorium_ore',
    tin: 'tin',
    tin_tungsten_greisen: 'tin_tungsten_greisen',
    titanium_iron_oxide: 'titanium_iron_oxide',
    uranium: 'uranium_ore',
    zinc: 'zinc'
}

function bcAddNativeOreBlockTags(event) {
    for (var id in BC_DEPOSIT_SOURCE_BLOCKS) {
        var blocks = BC_DEPOSIT_SOURCE_BLOCKS[id]
        for (var i = 0; i < blocks.length; i++) {
            event.add('kubejs:deposit_ore_blocks', blocks[i])
            event.add('kubejs:deposit_ore_blocks/' + id, blocks[i])
        }
    }
}

function bcIsExcavatedVariantBlockForTags(block) {
    var blockClass = block.getClass()
    while (blockClass != null) {
        if (String(blockClass.getName()) === 'dev.lukebemish.excavatedvariants.impl.ModifiedOreBlock') return true
        blockClass = blockClass.getSuperclass()
    }
    return false
}

function bcForEachExcavatedDepositBlock(callback) {
    if (!Platform.isLoaded('excavated_variants')) return

    var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
    var blockRegistry = ForgeRegistries.BLOCKS
    if (blockRegistry == null) return

    var blocks = blockRegistry.getValues().iterator()
    while (blocks.hasNext()) {
        var block = blocks.next()
        if (!bcIsExcavatedVariantBlockForTags(block)) continue

        var depositId = BC_EV_ORE_TO_DEPOSIT[String(block.ore.id)]
        if (!depositId) continue

        callback(String(blockRegistry.getKey(block)), depositId)
    }
}

function bcRemoveGenericOreItemTags(event, itemId, depositId) {
    event.remove('forge:ores', itemId)
    event.remove('c:ores', itemId)

    var materialTags = BC_DEPOSIT_FORGE_ORE_TAGS[depositId] || []
    for (var i = 0; i < materialTags.length; i++) {
        event.remove('forge:ores/' + materialTags[i], itemId)
        event.remove('c:ores/' + materialTags[i], itemId)
    }
}

ServerEvents.tags('item', function (event) {
    bcAddNativeOreBlockTags(event)

    for (var id in BC_DEPOSIT_SOURCE_BLOCKS) {
        var blocks = BC_DEPOSIT_SOURCE_BLOCKS[id]
        for (var i = 0; i < blocks.length; i++) bcRemoveGenericOreItemTags(event, blocks[i], id)
    }

    for (var chunkId in BC_DEPOSIT_ORE_CHUNKS) {
        var chunk = BC_DEPOSIT_ORE_CHUNKS[chunkId]
        event.add('kubejs:deposit_chunks', chunk)
        event.add('kubejs:deposit_chunks/' + chunkId, chunk)
    }

    bcForEachExcavatedDepositBlock(function (blockId, depositId) {
        event.add('kubejs:deposit_ore_blocks', blockId)
        event.add('kubejs:deposit_ore_blocks/' + depositId, blockId)
        bcRemoveGenericOreItemTags(event, blockId, depositId)
    })
})

ServerEvents.tags('block', function (event) {
    bcAddNativeOreBlockTags(event)
    bcForEachExcavatedDepositBlock(function (blockId, depositId) {
        event.add('kubejs:deposit_ore_blocks', blockId)
        event.add('kubejs:deposit_ore_blocks/' + depositId, blockId)
    })
})
