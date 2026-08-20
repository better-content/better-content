// Single source of truth for pack-authored Realistic Ores processing.
// Native block separation and chunk crushing remain owned by Realistic Ores.

function bcRoDeposit(id, block, primary, assay, preview, routes) {
    return {
        id: id,
        display: block.replace(/_/g, ' '),
        block: block,
        chunk: 'realistic_ores:ore_chunk_' + block,
        crushed: 'realistic_ores:crushed_' + block,
        sample: 'realistic_ores:surface_sample_' + block,
        primary: primary,
        assay: assay,
        foundryPreview: preview,
        routes: routes
    }
}

function bcRoRoute(ball, solvent, unlocks) {
    return { ball: ball, solvent: solvent, unlocks: unlocks || [] }
}

var BC_REALISTIC_ORES = [
    bcRoDeposit('coal_measures', 'coal_measures', 'coal', [
        { id: 'carbon', grade: 'major' }, { id: 'iron', grade: 'trace' }
    ], ['iron'], [bcRoRoute('andesite', null, ['carbon']), bcRoRoute('blood_infused', 'ethanol', ['carbon', 'iron'])]),
    bcRoDeposit('ironstone', 'ironstone', 'iron', [
        { id: 'nickel', grade: 'minor' }, { id: 'chromium', grade: 'trace' }
    ], ['nickel', 'chromium'], [bcRoRoute('iron', null, ['nickel']), bcRoRoute('steel', 'hydrochloric', ['chromium']), bcRoRoute('nickel', 'nitric', ['nickel', 'chromium'])]),
    bcRoDeposit('copper_sulfide', 'copper_sulfide_ore', 'copper', [
        { id: 'sulfur', grade: 'major' }, { id: 'iron', grade: 'minor' }, { id: 'gold', grade: 'precious' }
    ], ['iron', 'gold'], [bcRoRoute('brass', null, ['sulfur', 'iron']), bcRoRoute('brass', 'sulfuric', ['sulfur', 'iron']), bcRoRoute('nickel', 'nitric', ['iron', 'gold'])]),
    bcRoDeposit('tin', 'tin_ore', 'tin', [
        { id: 'quartz', grade: 'major' }, { id: 'tungsten', grade: 'trace' }
    ], ['quartz', 'tungsten'], [bcRoRoute('brass', null, ['quartz']), bcRoRoute('fluix', 'hydrochloric', ['quartz']), bcRoRoute('titanium', 'phosphoric', ['tungsten'])]),
    bcRoDeposit('zinc', 'zinc_ore', 'zinc', [
        { id: 'lead', grade: 'minor' }, { id: 'cadmium', grade: 'trace' }
    ], ['lead', 'cadmium'], [bcRoRoute('brass', null, ['lead']), bcRoRoute('brass', 'sulfuric', ['lead', 'cadmium']), bcRoRoute('steel', 'acetic', ['cadmium'])]),
    bcRoDeposit('lead_zinc_vein', 'lead_zinc_vein', 'lead', [
        { id: 'zinc', grade: 'major' }, { id: 'silver', grade: 'precious' }
    ], ['zinc', 'silver'], [bcRoRoute('brass', null, ['zinc']), bcRoRoute('brass', 'nitric', ['zinc', 'silver']), bcRoRoute('steel', 'sulfuric', ['zinc'])]),
    bcRoDeposit('quartz_vein', 'quartz_vein', 'quartz', [
        { id: 'silicon', grade: 'major' }, { id: 'copper', grade: 'trace' }, { id: 'gold', grade: 'precious' }
    ], ['copper', 'gold'], [bcRoRoute('andesite', null, ['silicon']), bcRoRoute('fluix', 'hydrochloric', ['silicon']), bcRoRoute('brass', 'nitric', ['copper', 'gold'])]),
    bcRoDeposit('bauxite_laterite', 'bauxite_laterite', 'aluminum', [
        { id: 'nickel', grade: 'minor' }, { id: 'titanium', grade: 'minor' }, { id: 'gallium', grade: 'trace' }
    ], ['nickel', 'titanium'], [bcRoRoute('steel', null, ['nickel']), bcRoRoute('iron', 'acetic', ['nickel']), bcRoRoute('titanium', 'hydrochloric', ['titanium', 'gallium'])]),
    bcRoDeposit('nickel_sulfide', 'nickel_sulfide_ore', 'nickel', [
        { id: 'sulfur', grade: 'major' }, { id: 'iron', grade: 'minor' }, { id: 'cobalt', grade: 'trace' }, { id: 'platinum', grade: 'precious' }
    ], ['iron', 'cobalt'], [bcRoRoute('iron', null, ['sulfur', 'iron']), bcRoRoute('nickel', 'sulfuric', ['cobalt']), bcRoRoute('nickel', 'nitric', ['cobalt', 'platinum'])]),
    bcRoDeposit('osmiridium_lava_sulfide', 'osmiridium_lava_sulfide_ore', 'osmium', [
        { id: 'iridium', grade: 'minor' }, { id: 'platinum', grade: 'precious' }, { id: 'sulfur', grade: 'major' }
    ], ['platinum'], [bcRoRoute('nickel', null, ['sulfur']), bcRoRoute('nickel', 'nitric', ['iridium', 'platinum']), bcRoRoute('titanium', 'phosphoric', ['platinum'])]),
    bcRoDeposit('tin_tungsten_greisen', 'tin_tungsten_greisen', 'tungsten', [
        { id: 'tin', grade: 'major' }, { id: 'quartz', grade: 'major' }, { id: 'tantalum', grade: 'trace' }
    ], ['tin', 'quartz'], [bcRoRoute('brass', null, ['tin', 'quartz']), bcRoRoute('fluix', 'hydrochloric', ['tin', 'quartz']), bcRoRoute('titanium', 'phosphoric', ['tin', 'tantalum'])]),
    bcRoDeposit('titanium_iron_oxide', 'titanium_iron_oxide_ore', 'titanium', [
        { id: 'iron', grade: 'major' }, { id: 'chromium', grade: 'trace' }
    ], ['iron', 'chromium'], [bcRoRoute('iron', null, ['iron']), bcRoRoute('titanium', 'hydrochloric', ['chromium']), bcRoRoute('titanium', 'phosphoric', ['iron', 'chromium'])]),
    bcRoDeposit('kimberlite_pipe', 'kimberlite_pipe', 'diamond', [
        { id: 'carbon', grade: 'major' }, { id: 'magnesium', grade: 'minor' }
    ], ['magnesium'], [bcRoRoute('steel', null, ['carbon', 'magnesium']), bcRoRoute('blood_infused', 'ethanol', ['carbon']), bcRoRoute('fluix', 'hydrochloric', ['magnesium'])]),
    bcRoDeposit('emerald_schist_beryl', 'emerald_schist_beryl_vein', 'emerald', [
        { id: 'beryl', grade: 'major' }, { id: 'beryllium', grade: 'minor' }, { id: 'aluminum', grade: 'minor' }, { id: 'silicon', grade: 'trace' }
    ], ['aluminum'], [bcRoRoute('fluix', null, ['beryl']), bcRoRoute('fluix', 'hydrochloric', ['beryllium', 'silicon']), bcRoRoute('titanium', 'phosphoric', ['aluminum'])]),
    bcRoDeposit('corundum_beryl_vein', 'corundum_beryl_gem_vein', 'amethyst', [
        { id: 'aluminum', grade: 'major' }, { id: 'beryllium', grade: 'minor' }, { id: 'quartz', grade: 'minor' }
    ], ['aluminum', 'quartz'], [bcRoRoute('fluix', null, ['aluminum']), bcRoRoute('fluix', 'hydrochloric', ['beryllium', 'quartz']), bcRoRoute('titanium', 'phosphoric', ['aluminum', 'beryllium'])]),
    bcRoDeposit('uranium_ore', 'uranium_ore', 'uranium', [
        { id: 'lead', grade: 'minor' }, { id: 'thorium', grade: 'trace' }, { id: 'calcium', grade: 'minor' }
    ], ['lead', 'thorium'], [bcRoRoute('titanium', null, ['lead', 'calcium']), bcRoRoute('titanium', 'sulfuric', ['thorium']), bcRoRoute('nickel', 'nitric', ['lead', 'thorium'])]),
    bcRoDeposit('thorium_ore', 'thorium_ore', 'thorium', [
        { id: 'uranium', grade: 'trace' }, { id: 'lead', grade: 'minor' }
    ], ['lead', 'uranium'], [bcRoRoute('titanium', null, ['lead']), bcRoRoute('titanium', 'sulfuric', ['uranium']), bcRoRoute('nickel', 'nitric', ['uranium', 'lead'])]),
    bcRoDeposit('cupriferous_redbed_redstone_vein', 'cupriferous_redbed_redstone_vein', 'redstone', [
        { id: 'copper', grade: 'major' }, { id: 'iron', grade: 'minor' }, { id: 'gold', grade: 'precious' }
    ], ['copper', 'iron'], [bcRoRoute('brass', null, ['copper', 'iron']), bcRoRoute('fluix', 'hydrochloric', ['copper']), bcRoRoute('brass', 'nitric', ['copper', 'gold'])]),
    bcRoDeposit('lazurite_vein', 'lazurite_vein', 'lapis', [
        { id: 'sodium', grade: 'minor' }, { id: 'aluminum', grade: 'minor' }, { id: 'silicon', grade: 'trace' }
    ], ['aluminum'], [bcRoRoute('andesite', null, ['sodium']), bcRoRoute('fluix', 'hydrochloric', ['aluminum', 'silicon']), bcRoRoute('steel', 'acetic', ['sodium', 'aluminum'])]),
    bcRoDeposit('phosphate_rock', 'phosphate_rock', 'phosphate', [
        { id: 'calcium', grade: 'major' }
    ], [], [bcRoRoute('iron', null, ['calcium']), bcRoRoute('steel', 'acetic', ['calcium']), bcRoRoute('titanium', 'sulfuric', ['calcium'])]),
    bcRoDeposit('soul_bearing_black_shale_soulstone_vein', 'soul_bearing_black_shale_soulstone_vein', 'soul_sand', [
        { id: 'carbon', grade: 'major' }, { id: 'sulfur', grade: 'minor' }, { id: 'redstone', grade: 'trace' }
    ], [], [bcRoRoute('blood_infused', null, ['carbon']), bcRoRoute('blood_infused', 'ethanol', ['carbon', 'sulfur']), bcRoRoute('fluix', 'hydrochloric', ['redstone'])]),
    bcRoDeposit('sulfur_bearing_pyrite_ore', 'sulfur_bearing_pyrite_ore', 'sulfur', [
        { id: 'iron', grade: 'major' }, { id: 'copper', grade: 'minor' }, { id: 'gold', grade: 'precious' }
    ], [], [bcRoRoute('iron', null, ['iron']), bcRoRoute('brass', 'sulfuric', ['copper']), bcRoRoute('brass', 'nitric', ['copper', 'gold'])])
]

var BC_RO_BALLS = global.BC_RO_BALLS || []

var BC_RO_SOLVENTS = [
    { id: 'ethanol', fluidTag: 'forge:ethanol' },
    { id: 'acetic', fluid: 'chemlib:acetic_acid_fluid' },
    { id: 'sulfuric', fluid: 'chemlib:sulfuric_acid_fluid' },
    { id: 'hydrochloric', fluid: 'chemlib:hydrochloric_acid_fluid' },
    { id: 'nitric', fluid: 'chemlib:nitric_acid_fluid' },
    { id: 'phosphoric', fluid: 'kubejs:phosphoric_acid_fluid' }
]

var BC_RO_MATERIAL_BY_ID = {}
var BC_RO_BALL_BY_ID = {}
var BC_RO_SOLVENT_BY_ID = {}
var bcRoMaterials = global.BC_RO_MATERIALS || []
for (var mi = 0; mi < bcRoMaterials.length; mi++) {
    var material = bcRoMaterials[mi]
    material.concentrate = material.concentrate || ('kubejs:' + material.id + '_concentrate')
    material.washed = 'kubejs:washed_' + material.concentrate.substring('kubejs:'.length)
    BC_RO_MATERIAL_BY_ID[material.id] = material
}
for (var bi = 0; bi < BC_RO_BALLS.length; bi++) BC_RO_BALL_BY_ID[BC_RO_BALLS[bi].id] = BC_RO_BALLS[bi]
for (var si = 0; si < BC_RO_SOLVENTS.length; si++) BC_RO_SOLVENT_BY_ID[BC_RO_SOLVENTS[si].id] = BC_RO_SOLVENTS[si]

global.BC_REALISTIC_ORES = BC_REALISTIC_ORES
global.BC_RO_BALLS = BC_RO_BALLS
global.BC_RO_SOLVENTS = BC_RO_SOLVENTS
global.BC_RO_MATERIAL_BY_ID = BC_RO_MATERIAL_BY_ID
global.BC_RO_BALL_BY_ID = BC_RO_BALL_BY_ID
global.BC_RO_SOLVENT_BY_ID = BC_RO_SOLVENT_BY_ID
