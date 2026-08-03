// Surface indicators are prospecting rubble, not full ore blocks. This retained
// table is historical/tooling context only; no furnace or milling route registers.

var BC_SURFACE_SAMPLE_PROCESSING = [
    { id: 'coal_measures', output: 'minecraft:coal', count: 1 },
    { id: 'ironstone', output: 'minecraft:iron_nugget', count: 2 },
    { id: 'copper_sulfide_ore', output: 'tconstruct:copper_nugget', count: 2 },
    { id: 'tin_ore', output: 'chemlib:tin_nugget', count: 2 },
    { id: 'zinc_ore', output: 'create:zinc_nugget', count: 2 },
    { id: 'lead_zinc_vein', output: 'chemlib:lead_nugget', count: 2 },
    { id: 'quartz_vein', output: 'minecraft:quartz', count: 1 },
    { id: 'bauxite_laterite', output: 'chemlib:aluminum_nugget', count: 2 },
    { id: 'nickel_sulfide_ore', output: 'chemlib:nickel_nugget', count: 2 },
    { id: 'osmiridium_lava_sulfide_ore', output: 'chemlib:osmium_nugget', count: 2 },
    { id: 'tin_tungsten_greisen', output: 'chemlib:tungsten_nugget', count: 2 },
    { id: 'titanium_iron_oxide_ore', output: 'chemlib:titanium_nugget', count: 2 },
    { id: 'kimberlite_pipe', output: 'chemlib:carbon', count: 1 },
    { id: 'emerald_schist_beryl_vein', output: 'chemlib:beryllium_nugget', count: 2 },
    { id: 'corundum_beryl_gem_vein', output: 'chemlib:aluminum_nugget', count: 2 },
    { id: 'uranium_ore', output: 'chemlib:uranium_nugget', count: 2 },
    { id: 'thorium_ore', output: 'chemlib:thorium_nugget', count: 2 },
    { id: 'cupriferous_redbed_redstone_vein', output: 'minecraft:redstone', count: 2 },
    { id: 'lazurite_vein', output: 'minecraft:lapis_lazuli', count: 2 },
    { id: 'phosphate_rock', output: 'minecraft:bone_meal', count: 2 },
    { id: 'soul_bearing_black_shale_soulstone_vein', output: 'chemlib:carbon', count: 2 },
    { id: 'sulfur_bearing_pyrite_ore', output: 'minecraft:iron_nugget', count: 2 },
    { id: 'oil_seep', output: 'chemlib:carbon', count: 2, noCrushed: true }
]

ServerEvents.recipes(function (event) {
    // Retired create:milling and kubejs:create/milling/surface_samples/* markers:
    // no surface-sample recipe registers pending bounded prospecting-feed yields.
})
