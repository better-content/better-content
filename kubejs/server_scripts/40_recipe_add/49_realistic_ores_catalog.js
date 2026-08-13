// Single source of truth for pack-authored Realistic Ores processing.
// Native block separation and chunk crushing remain owned by Realistic Ores.

var BC_REALISTIC_ORES = [
    { id: 'coal_measures', crushed: 'realisticores:crushed_coal_measures', sample: 'realisticores:surface_sample_coal_measures', ball: 'andesite', crushingByproduct: ['minecraft:charcoal', 0.25], millingByproduct: ['minecraft:coal', 0.15], products: [['minecraft:coal', 4], ['chemlib:carbon', 1]], leach: { solvent: 'ethanol', products: [['minecraft:coal', 5], ['chemlib:carbon', 2]] } },
    { id: 'ironstone', crushed: 'realisticores:crushed_ironstone', sample: 'realisticores:surface_sample_ironstone', ball: 'iron', crushingByproduct: ['minecraft:gravel', 0.22], millingByproduct: ['minecraft:stone', 0.16], products: [['create:crushed_raw_iron', 5], ['chemlib:chromium_oxide', 1]], leach: { solvent: 'sulfuric', products: [['create:crushed_raw_iron', 7], ['chemlib:chromium_oxide', 1]] } },
    { id: 'copper_sulfide', crushed: 'realisticores:crushed_copper_sulfide_ore', sample: 'realisticores:surface_sample_copper_sulfide_ore', ball: 'brass', crushingByproduct: ['minecraft:flint', 0.24], millingByproduct: ['minecraft:gravel', 0.18], products: [['create:crushed_raw_copper', 5], ['chemlib:sulfur', 1]], leach: { solvent: 'sulfuric', products: [['create:crushed_raw_copper', 7], ['chemlib:sulfur', 2]] } },
    { id: 'tin', crushed: 'realisticores:crushed_tin_ore', sample: 'realisticores:surface_sample_tin_ore', ball: 'iron', crushingByproduct: ['minecraft:quartz', 0.20], millingByproduct: ['create:crushed_raw_tin', 0.12], products: [['create:crushed_raw_tin', 5], ['minecraft:quartz', 1]] },
    { id: 'zinc', crushed: 'realisticores:crushed_zinc_ore', sample: 'realisticores:surface_sample_zinc_ore', ball: 'brass', crushingByproduct: ['minecraft:cobblestone', 0.22], millingByproduct: ['create:crushed_raw_lead', 0.12], products: [['create:crushed_raw_zinc', 5], ['create:crushed_raw_lead', 1]], leach: { solvent: 'sulfuric', products: [['create:crushed_raw_zinc', 7], ['create:crushed_raw_lead', 2]] } },
    { id: 'lead_zinc_vein', crushed: 'realisticores:crushed_lead_zinc_vein', sample: 'realisticores:surface_sample_lead_zinc_vein', ball: 'brass', crushingByproduct: ['minecraft:gravel', 0.20], millingByproduct: ['create:crushed_raw_zinc', 0.12], products: [['create:crushed_raw_lead', 4], ['create:crushed_raw_zinc', 2]], leach: { solvent: 'nitric', products: [['create:crushed_raw_lead', 6], ['create:crushed_raw_zinc', 3]] } },
    { id: 'quartz_vein', crushed: 'realisticores:crushed_quartz_vein', sample: 'realisticores:surface_sample_quartz_vein', ball: 'andesite', crushingByproduct: ['minecraft:flint', 0.20], millingByproduct: ['minecraft:quartz', 0.14], products: [['minecraft:quartz', 6]], leach: { solvent: 'ethanol', products: [['minecraft:quartz', 8], ['chemlib:silicon_dioxide', 1]] } },
    { id: 'bauxite_laterite', crushed: 'realisticores:crushed_bauxite_laterite', sample: 'realisticores:surface_sample_bauxite_laterite', ball: 'steel', crushingByproduct: ['minecraft:clay_ball', 0.18], millingByproduct: ['minecraft:gravel', 0.13], products: [['create:crushed_raw_aluminum', 5], ['chemlib:aluminum_oxide', 1]], leach: { solvent: 'acetic', products: [['create:crushed_raw_aluminum', 7], ['chemlib:aluminum_oxide', 2]] } },
    { id: 'nickel_sulfide', crushed: 'realisticores:crushed_nickel_sulfide_ore', sample: 'realisticores:surface_sample_nickel_sulfide_ore', ball: 'steel', crushingByproduct: ['minecraft:flint', 0.21], millingByproduct: ['create:crushed_raw_nickel', 0.12], products: [['create:crushed_raw_nickel', 5], ['chemlib:sulfur', 1]], leach: { solvent: 'sulfuric', products: [['create:crushed_raw_nickel', 7], ['chemlib:sulfur', 2]] } },
    { id: 'osmiridium_lava_sulfide', crushed: 'realisticores:crushed_osmiridium_lava_sulfide_ore', sample: 'realisticores:surface_sample_osmiridium_lava_sulfide_ore', ball: 'titanium', crushingByproduct: ['minecraft:gravel', 0.20], millingByproduct: ['minecraft:blackstone', 0.12], products: [['kubejs:osmiridium_concentrate', 3], ['chemlib:sulfur', 1]], leach: { solvent: 'nitric', products: [['kubejs:osmiridium_concentrate', 5], ['kubejs:platinum_group_residue', 1]] } },
    { id: 'tin_tungsten_greisen', crushed: 'realisticores:crushed_tin_tungsten_greisen', sample: 'realisticores:surface_sample_tin_tungsten_greisen', ball: 'nickel', crushingByproduct: ['minecraft:gravel', 0.18], millingByproduct: ['create:crushed_raw_tin', 0.12], products: [['create:crushed_raw_tin', 3], ['kubejs:tungsten_concentrate', 3]] },
    { id: 'titanium_iron_oxide', crushed: 'realisticores:crushed_titanium_iron_oxide_ore', sample: 'realisticores:surface_sample_titanium_iron_oxide_ore', ball: 'nickel', crushingByproduct: ['minecraft:gravel', 0.20], millingByproduct: ['create:crushed_raw_iron', 0.12], products: [['kubejs:titanium_concentrate', 4], ['create:crushed_raw_iron', 2]], leach: { solvent: 'sulfuric', products: [['kubejs:titanium_concentrate', 6], ['create:crushed_raw_iron', 3]] } },
    { id: 'kimberlite_pipe', crushed: 'realisticores:crushed_kimberlite_pipe', sample: 'realisticores:surface_sample_kimberlite_pipe', ball: 'steel', crushingByproduct: ['minecraft:stone', 0.18], millingByproduct: ['minecraft:gravel', 0.12], products: [['chemlib:carbon', 4], ['chemlib:magnesium_oxide', 1]] },
    { id: 'emerald_schist_beryl', crushed: 'realisticores:crushed_emerald_schist_beryl_vein', sample: 'realisticores:surface_sample_emerald_schist_beryl_vein', ball: 'steel', crushingByproduct: ['minecraft:amethyst_shard', 0.08], millingByproduct: ['minecraft:emerald', 0.06], products: [['chemlib:beryl', 3], ['minecraft:emerald', 1]], leach: { solvent: 'hydrochloric', products: [['chemlib:beryllium_chloride', 5], ['minecraft:emerald', 1]] } },
    { id: 'corundum_beryl_vein', crushed: 'realisticores:crushed_corundum_beryl_gem_vein', sample: 'realisticores:surface_sample_corundum_beryl_gem_vein', ball: 'steel', crushingByproduct: ['minecraft:quartz', 0.20], millingByproduct: ['minecraft:amethyst_shard', 0.12], products: [['chemlib:aluminum_oxide', 4], ['minecraft:amethyst_shard', 1]] },
    { id: 'uranium_ore', crushed: 'realisticores:crushed_uranium_ore', sample: 'realisticores:surface_sample_uranium_ore', ball: 'titanium', crushingByproduct: ['minecraft:gravel', 0.20], millingByproduct: ['create:crushed_raw_iron', 0.12], products: [['kubejs:uranium_concentrate', 4], ['create:crushed_raw_lead', 1]] },
    { id: 'thorium_ore', crushed: 'realisticores:crushed_thorium_ore', sample: 'realisticores:surface_sample_thorium_ore', ball: 'titanium', crushingByproduct: ['minecraft:gravel', 0.20], millingByproduct: ['create:crushed_raw_lead', 0.12], products: [['kubejs:thorium_concentrate', 4], ['create:crushed_raw_lead', 1]] },
    { id: 'cupriferous_redbed_redstone_vein', crushed: 'realisticores:crushed_cupriferous_redbed_redstone_vein', sample: 'realisticores:surface_sample_cupriferous_redbed_redstone_vein', ball: 'brass', crushingByproduct: ['minecraft:redstone', 0.24], millingByproduct: ['minecraft:flint', 0.14], products: [['minecraft:redstone', 6], ['create:crushed_raw_copper', 1]], leach: { solvent: 'sulfuric', products: [['minecraft:redstone', 8], ['create:crushed_raw_copper', 3]] } },
    { id: 'lazurite_vein', crushed: 'realisticores:crushed_lazurite_vein', sample: 'realisticores:surface_sample_lazurite_vein', ball: 'andesite', crushingByproduct: ['minecraft:lapis_lazuli', 0.20], millingByproduct: ['minecraft:gravel', 0.12], products: [['minecraft:lapis_lazuli', 6], ['chemlib:aluminum_oxide', 1]], leach: { solvent: 'hydrochloric', products: [['minecraft:lapis_lazuli', 8], ['chemlib:aluminum_oxide', 2]] } },
    { id: 'phosphate_rock', crushed: 'realisticores:crushed_phosphate_rock', sample: 'realisticores:surface_sample_phosphate_rock', ball: 'iron', crushingByproduct: ['minecraft:bone_meal', 0.20], millingByproduct: ['minecraft:gravel', 0.12], products: [['chemlib:phosphate', 4], ['chemlib:calcium_carbonate', 1]], leach: { solvent: 'sulfuric', products: [['chemlib:phosphate', 6], ['chemlib:calcium_sulfate', 2]] } },
    { id: 'soul_bearing_black_shale_soulstone_vein', crushed: 'realisticores:crushed_soul_bearing_black_shale_soulstone_vein', sample: 'realisticores:surface_sample_soul_bearing_black_shale_soulstone_vein', ball: 'blood_infused', crushingByproduct: ['minecraft:soul_sand', 0.28], millingByproduct: ['minecraft:coal', 0.14], products: [['chemlib:carbon', 4], ['minecraft:soul_sand', 1]], leach: { solvent: 'acetic', products: [['chemlib:carbon', 6], ['minecraft:soul_sand', 2]] } },
    { id: 'sulfur_bearing_pyrite_ore', crushed: 'realisticores:crushed_sulfur_bearing_pyrite_ore', sample: 'realisticores:surface_sample_sulfur_bearing_pyrite_ore', ball: 'iron', crushingByproduct: ['minecraft:flint', 0.24], millingByproduct: ['minecraft:coal', 0.14], products: [['chemlib:sulfur', 4], ['create:crushed_raw_iron', 2]], leach: { solvent: 'sulfuric', products: [['chemlib:sulfur', 6], ['create:crushed_raw_iron', 3]] } }
]

for (var i = 0; i < BC_REALISTIC_ORES.length; i++) {
    var deposit = BC_REALISTIC_ORES[i]
    if (!deposit.chunk && deposit.sample) {
        deposit.chunk = deposit.sample.replace('realisticores:surface_sample_', 'realisticores:ore_chunk_')
    }
}

var BC_RO_BALLS = [
    { id: 'andesite', item: 'kubejs:andesite_grinding_ball', primaryBonus: 0, secondaryBonus: 0.00, traceBonus: 0.00, bias: 'gangue' },
    { id: 'iron', item: 'kubejs:iron_grinding_ball', primaryBonus: 0, secondaryBonus: 0.06, traceBonus: 0.02, bias: 'ferrous' },
    { id: 'brass', item: 'kubejs:brass_grinding_ball', primaryBonus: 0, secondaryBonus: 0.08, traceBonus: 0.03, bias: 'nonferrous' },
    { id: 'steel', item: 'kubejs:steel_grinding_ball', primaryBonus: 1, secondaryBonus: 0.10, traceBonus: 0.04, bias: 'general' },
    { id: 'nickel', item: 'kubejs:nickel_grinding_ball', primaryBonus: 1, secondaryBonus: 0.12, traceBonus: 0.07, bias: 'hard' },
    { id: 'titanium', item: 'kubejs:titanium_grinding_ball', primaryBonus: 1, secondaryBonus: 0.14, traceBonus: 0.10, bias: 'rare' },
    { id: 'blood_infused', item: 'kubejs:blood_infused_grinding_ball', primaryBonus: 0, secondaryBonus: 0.10, traceBonus: 0.09, bias: 'blood' },
    { id: 'fluix', item: 'kubejs:fluix_grinding_ball', primaryBonus: 0, secondaryBonus: 0.10, traceBonus: 0.09, bias: 'ae' }
]

var BC_RO_SOLVENTS = [
    { id: 'ethanol', fluid: 'chemlib:ethanol_fluid', amount: 250, time: 180, primary: 0, secondary: 0.24, trace: 0.06, heat: null },
    { id: 'acetic', fluid: 'chemlib:acetic_acid_fluid', amount: 250, time: 200, primary: 1, secondary: 0.32, trace: 0.10, heat: null },
    { id: 'sulfuric', fluid: 'chemlib:sulfuric_acid_fluid', amount: 250, time: 220, primary: 2, secondary: 0.48, trace: 0.14, heat: 'heated' },
    { id: 'hydrochloric', fluid: 'chemlib:hydrochloric_acid_fluid', amount: 250, time: 230, primary: 2, secondary: 0.44, trace: 0.18, heat: 'heated' },
    { id: 'nitric', fluid: 'chemlib:nitric_acid_fluid', amount: 250, time: 260, primary: 1, secondary: 0.38, trace: 0.28, heat: 'heated' },
    { id: 'phosphoric', fluid: 'kubejs:phosphoric_acid_fluid', amount: 250, time: 230, primary: 1, secondary: 0.42, trace: 0.16, heat: 'heated' }
]

var BC_RO_BALL_BY_ID = {}
var BC_RO_SOLVENT_BY_ID = {}
var BC_RO_RETENTION = {}
for (var b = 0; b < BC_RO_BALLS.length; b++) BC_RO_BALL_BY_ID[BC_RO_BALLS[b].id] = BC_RO_BALLS[b].item
for (var s = 0; s < BC_RO_SOLVENTS.length; s++) {
    var solvent = BC_RO_SOLVENTS[s]
    BC_RO_SOLVENT_BY_ID[solvent.id] = solvent
    BC_RO_RETENTION[solvent.id] = {}
    for (var rb = 0; rb < BC_RO_BALLS.length; rb++) BC_RO_RETENTION[solvent.id][BC_RO_BALLS[rb].id] = 1.0
}

global.BC_REALISTIC_ORES = BC_REALISTIC_ORES
global.BC_RO_BALLS = BC_RO_BALLS
global.BC_RO_SOLVENTS = BC_RO_SOLVENTS
global.BC_RO_BALL_BY_ID = BC_RO_BALL_BY_ID
global.BC_RO_SOLVENT_BY_ID = BC_RO_SOLVENT_BY_ID
global.BC_RO_RETENTION = BC_RO_RETENTION
