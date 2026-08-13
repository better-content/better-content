// Deposit source tags for Realistic Ores. These tags are consumed by TCon and
// Create recipe generators.

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

function bcAddDepositTags(event) {
    for (var id in BC_DEPOSIT_SOURCE_BLOCKS) {
        var tag = 'kubejs:deposit_blocks/' + id
        var blocks = BC_DEPOSIT_SOURCE_BLOCKS[id]
        for (var i = 0; i < blocks.length; i++) event.add(tag, blocks[i])
    }
}

ServerEvents.tags('item', function (event) {
    bcAddDepositTags(event)
    for (var id in BC_DEPOSIT_ORE_CHUNKS) {
        event.add('kubejs:deposit_blocks/' + id, BC_DEPOSIT_ORE_CHUNKS[id])
    }
})
ServerEvents.tags('block', function (event) {  bcAddDepositTags(event) })
