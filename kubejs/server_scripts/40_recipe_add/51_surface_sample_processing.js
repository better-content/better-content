// Surface indicators are prospecting rubble, not full ore blocks. Milling a collected
// sample has a modest chance to recover one matching crushed-deposit item.

var BC_SURFACE_SAMPLE_PROCESSING = [
    ['coal_measures', 'coal_measures'],
    ['ironstone', 'ironstone'],
    ['copper_sulfide_ore', 'copper_sulfide_ore'],
    ['tin_ore', 'tin_ore'],
    ['zinc_ore', 'zinc_ore'],
    ['lead_zinc_vein', 'lead_zinc_vein'],
    ['quartz_vein', 'quartz_vein'],
    ['bauxite_laterite', 'bauxite_laterite'],
    ['nickel_sulfide_ore', 'nickel_sulfide_ore'],
    ['osmiridium_lava_sulfide_ore', 'osmiridium_lava_sulfide_ore'],
    ['tin_tungsten_greisen', 'tin_tungsten_greisen'],
    ['titanium_iron_oxide_ore', 'titanium_iron_oxide_ore'],
    ['kimberlite_pipe', 'kimberlite_pipe'],
    ['emerald_schist_beryl_vein', 'emerald_schist_beryl_vein'],
    ['corundum_beryl_gem_vein', 'corundum_beryl_gem_vein'],
    ['uranium_ore', 'uranium_ore'],
    ['thorium_ore', 'thorium_ore'],
    ['cupriferous_redbed_redstone_vein', 'cupriferous_redbed_redstone_vein'],
    ['lazurite_vein', 'lazurite_vein'],
    ['phosphate_rock', 'phosphate_rock'],
    ['soul_bearing_black_shale_soulstone_vein', 'soul_bearing_black_shale_soulstone_vein'],
    ['sulfur_bearing_pyrite_ore', 'sulfur_bearing_pyrite_ore']
]

ServerEvents.recipes(function (event) {
    for (var i = 0; i < BC_SURFACE_SAMPLE_PROCESSING.length; i++) {
        var row = BC_SURFACE_SAMPLE_PROCESSING[i]
        event.custom({
            type: 'create:milling',
            ingredients: [{ item: 'realisticores:surface_sample_' + row[0] }],
            processingTime: 100,
            results: [
                { item: 'realisticores:crushed_' + row[1], chance: 0.25 },
                { item: 'minecraft:flint', chance: 0.10 }
            ]
        }).id('kubejs:create/milling/surface_samples/' + row[0])
    }
})
