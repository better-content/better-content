// Runtime-only Excavated Variants compatibility for Realistic Ores-owned deposit tags.
// Native blocks and chunks are tagged by the Realistic Ores mod itself.

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

function bcIsExcavatedRealisticOre(block) {
    var blockClass = block.getClass()
    while (blockClass != null) {
        if (String(blockClass.getName()) === 'dev.lukebemish.excavatedvariants.impl.ModifiedOreBlock') return true
        blockClass = blockClass.getSuperclass()
    }
    return false
}

function bcForEachExcavatedRealisticOre(callback) {
    if (!Platform.isLoaded('excavated_variants')) return
    var registry = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').BLOCKS
    if (registry == null) return
    var blocks = registry.getValues().iterator()
    while (blocks.hasNext()) {
        var block = blocks.next()
        if (!bcIsExcavatedRealisticOre(block)) continue
        var family = BC_EV_ORE_TO_DEPOSIT[String(block.ore.id)]
        if (family) callback(String(registry.getKey(block)), family)
    }
}

ServerEvents.tags('item', function (event) {
    bcForEachExcavatedRealisticOre(function (blockId, family) {
        event.add('realistic_ores:deposit_ore_blocks', blockId)
        event.add('realistic_ores:deposit_ore_blocks/' + family, blockId)
        event.remove('forge:ores', blockId)
        event.remove('c:ores', blockId)
    })
})

ServerEvents.tags('block', function (event) {
    bcForEachExcavatedRealisticOre(function (blockId, family) {
        event.add('realistic_ores:deposit_ore_blocks', blockId)
        event.add('realistic_ores:deposit_ore_blocks/' + family, blockId)
    })
})
