// Canonical material, grinding-media, and starter-deposit catalogues.

// Keep this in startup scope so item registration and server recipe generation
// consume the same identities.
global.BC_RO_MATERIALS = [
    { id: 'coal', display: 'Coal', kind: 'bulk', output: 'minecraft:coal' },
    { id: 'carbon', display: 'Carbon', kind: 'bulk', output: 'chemlib:carbon' },
    { id: 'iron', display: 'Iron', kind: 'metal', output: 'minecraft:iron_ingot', nugget: 'minecraft:iron_nugget', fluidTag: 'forge:molten_iron', temperature: 800 },
    { id: 'nickel', display: 'Nickel', kind: 'metal', output: 'chemlib:nickel_ingot', nugget: 'chemlib:nickel_nugget', fluidTag: 'forge:molten_nickel', temperature: 950 },
    { id: 'chromium', display: 'Chromium', kind: 'metal', output: 'chemlib:chromium_ingot', nugget: 'chemlib:chromium_nugget', fluidTag: 'forge:molten_chromium', temperature: 1450 },
    { id: 'copper', display: 'Copper', kind: 'metal', output: 'minecraft:copper_ingot', nugget: 'tconstruct:copper_nugget', fluidTag: 'forge:molten_copper', temperature: 500 },
    { id: 'sulfur', display: 'Sulfur', kind: 'bulk', output: 'chemlib:sulfur' },
    { id: 'gold', display: 'Gold', kind: 'metal', output: 'minecraft:gold_ingot', nugget: 'minecraft:gold_nugget', fluidTag: 'forge:molten_gold', temperature: 700 },
    { id: 'tin', display: 'Tin', kind: 'metal', output: 'chemlib:tin_ingot', nugget: 'chemlib:tin_nugget', fluidTag: 'forge:molten_tin', temperature: 225 },
    { id: 'quartz', display: 'Quartz', kind: 'bulk', output: 'minecraft:quartz', fluid: 'tconstruct:molten_quartz', fluidUnit: 90, temperature: 1035 },
    { id: 'tungsten', display: 'Tungsten', kind: 'metal', output: 'chemlib:tungsten_ingot', nugget: 'chemlib:tungsten_nugget', fluidTag: 'forge:molten_tungsten', temperature: 1450 },
    { id: 'zinc', display: 'Zinc', kind: 'metal', output: 'create:zinc_ingot', nugget: 'create:zinc_nugget', fluidTag: 'forge:molten_zinc', temperature: 420 },
    { id: 'lead', display: 'Lead', kind: 'metal', output: 'chemlib:lead_ingot', nugget: 'chemlib:lead_nugget', fluidTag: 'forge:molten_lead', temperature: 420 },
    { id: 'cadmium', display: 'Cadmium', kind: 'metal', output: 'chemlib:cadmium_ingot', nugget: 'chemlib:cadmium_nugget', fluidTag: 'forge:molten_cadmium', temperature: 595 },
    { id: 'silver', display: 'Silver', kind: 'metal', output: 'chemlib:silver_ingot', nugget: 'chemlib:silver_nugget', fluidTag: 'forge:molten_silver', temperature: 790 },
    { id: 'silicon', display: 'Silicon', kind: 'bulk', output: 'chemlib:silicon' },
    { id: 'aluminum', display: 'Aluminum', kind: 'metal', output: 'chemlib:aluminum_ingot', nugget: 'chemlib:aluminum_nugget', fluidTag: 'forge:molten_aluminum', temperature: 425 },
    { id: 'titanium', display: 'Titanium', kind: 'metal', output: 'chemlib:titanium_ingot', nugget: 'chemlib:titanium_nugget', fluid: 'kubejs:molten_titanium', temperature: 950, concentrate: 'kubejs:titanium_concentrate' },
    { id: 'gallium', display: 'Gallium', kind: 'metal', output: 'chemlib:gallium_ingot', nugget: 'chemlib:gallium_nugget' },
    { id: 'cobalt', display: 'Cobalt', kind: 'metal', output: 'chemlib:cobalt_ingot', nugget: 'chemlib:cobalt_nugget', fluidTag: 'forge:molten_cobalt', temperature: 950 },
    { id: 'platinum', display: 'Platinum', kind: 'metal', output: 'chemlib:platinum_ingot', nugget: 'chemlib:platinum_nugget', fluidTag: 'forge:molten_platinum', temperature: 1450 },
    { id: 'osmium', display: 'Osmiridium', kind: 'metal', output: 'chemlib:osmium_ingot', nugget: 'chemlib:osmium_nugget', fluidTag: 'forge:molten_osmium', temperature: 1450, concentrate: 'kubejs:osmiridium_concentrate' },
    { id: 'iridium', display: 'Iridium', kind: 'metal', output: 'chemlib:iridium_ingot', nugget: 'chemlib:iridium_nugget' },
    { id: 'tantalum', display: 'Tantalum', kind: 'metal', output: 'chemlib:tantalum_ingot', nugget: 'chemlib:tantalum_nugget' },
    { id: 'magnesium', display: 'Magnesium', kind: 'metal', output: 'chemlib:magnesium_ingot', nugget: 'chemlib:magnesium_nugget' },
    { id: 'diamond', display: 'Diamond', kind: 'gem', output: 'minecraft:diamond', chip: 'kubejs:diamond_chip', fluid: 'tconstruct:molten_diamond', temperature: 1450 },
    { id: 'emerald', display: 'Emerald', kind: 'gem', output: 'minecraft:emerald', chip: 'kubejs:emerald_chip', fluid: 'tconstruct:molten_emerald', temperature: 1450 },
    { id: 'beryl', display: 'Beryl', kind: 'bulk', output: 'chemlib:beryl' },
    { id: 'beryllium', display: 'Beryllium', kind: 'metal', output: 'chemlib:beryllium_ingot', nugget: 'chemlib:beryllium_nugget' },
    { id: 'amethyst', display: 'Amethyst', kind: 'gem', output: 'minecraft:amethyst_shard', chip: 'kubejs:amethyst_chip', fluid: 'tconstruct:molten_amethyst', temperature: 1450 },
    { id: 'uranium', display: 'Uranium', kind: 'metal', output: 'chemlib:uranium_ingot', nugget: 'chemlib:uranium_nugget', fluidTag: 'forge:molten_uranium', temperature: 950, concentrate: 'kubejs:uranium_concentrate' },
    { id: 'thorium', display: 'Thorium', kind: 'metal', output: 'chemlib:thorium_ingot', nugget: 'chemlib:thorium_nugget', fluid: 'kubejs:molten_thorium', temperature: 950, concentrate: 'kubejs:thorium_concentrate' },
    { id: 'calcium', display: 'Calcium', kind: 'metal', output: 'chemlib:calcium_ingot', nugget: 'chemlib:calcium_nugget' },
    { id: 'redstone', display: 'Redstone', kind: 'bulk', output: 'minecraft:redstone' },
    { id: 'lapis', display: 'Lapis Lazuli', kind: 'bulk', output: 'minecraft:lapis_lazuli' },
    { id: 'sodium', display: 'Sodium', kind: 'metal', output: 'chemlib:sodium_ingot', nugget: 'chemlib:sodium_nugget' },
    { id: 'phosphate', display: 'Phosphate', kind: 'bulk', output: 'chemlib:phosphate' },
    { id: 'soul_sand', display: 'Soul Sand', kind: 'bulk', output: 'minecraft:soul_sand' }
]

global.BC_RO_BALLS = [
    { id: 'andesite', item: 'kubejs:andesite_grinding_ball', returnChance: 0.55 },
    { id: 'iron', item: 'kubejs:iron_grinding_ball', returnChance: 0.82 },
    { id: 'brass', item: 'kubejs:brass_grinding_ball', returnChance: 0.68 },
    { id: 'steel', item: 'kubejs:steel_grinding_ball', returnChance: 0.91 },
    { id: 'nickel', item: 'kubejs:nickel_grinding_ball', returnChance: 0.84 },
    { id: 'titanium', item: 'kubejs:titanium_grinding_ball', returnChance: 0.88 },
    { id: 'blood_infused', item: 'kubejs:blood_infused_grinding_ball', returnChance: 0.73 },
    { id: 'fluix', item: 'kubejs:fluix_grinding_ball', returnChance: 0.76 }
]

global.BC_STARTER_DEPOSITS = [
    {
        id: 'coal_measures', displayName: 'Coal Measures', tag: 'realistic_ores:deposit_ore_blocks/coal_measures',
        yBand: 'surface_or_shallow_underground', dangerTier: 'early', primary: 'coal', secondary: 'iron', tertiary: null,
        primaryFluidTag: null, secondaryFluidTag: 'forge:molten_iron', tertiaryFluidTag: null,
        firstUsefulProcessingTier: 'furnace_fallback_or_create_preprocess', lateProcessingRole: 'carbon_and_trace_iron_package', notes: 'Existing TCon script maps the TCon-valid output to iron.'
    },
    {
        id: 'ironstone', displayName: 'Ironstone', tag: 'realistic_ores:deposit_ore_blocks/ironstone',
        yBand: 'shallow_underground', dangerTier: 'early_mid', primary: 'iron', secondary: 'nickel', tertiary: 'chromium',
        primaryFluidTag: 'forge:molten_iron', secondaryFluidTag: 'forge:molten_nickel', tertiaryFluidTag: 'forge:molten_chromium',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'industrial_iron_trace_metals', notes: 'Chromium is used as a confirmed molten trace stand-in for vanadium-like value.'
    },
    {
        id: 'copper_sulfide', displayName: 'Copper Sulfide', tag: 'realistic_ores:deposit_ore_blocks/copper_sulfide',
        yBand: 'shallow_underground_or_hills', dangerTier: 'early_mid', primary: 'copper', secondary: 'iron', tertiary: 'gold',
        primaryFluidTag: 'forge:molten_copper', secondaryFluidTag: 'forge:molten_iron', tertiaryFluidTag: 'forge:molten_gold',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'acid_ball_sulfide_route', notes: 'Starter copper deposit.'
    },
    {
        id: 'tin', displayName: 'Tin Vein', tag: 'realistic_ores:deposit_ore_blocks/tin',
        yBand: 'hills_or_shallow_underground', dangerTier: 'early_mid', primary: 'tin', secondary: 'quartz', tertiary: 'tungsten',
        primaryFluidTag: 'forge:molten_tin', secondaryFluidTag: 'forge:molten_quartz', tertiaryFluidTag: 'forge:molten_tungsten',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'bronze_and_late_heat_metals', notes: 'Starter bronze support without making steel the main axis.'
    },
    {
        id: 'zinc', displayName: 'Zinc Vein', tag: 'realistic_ores:deposit_ore_blocks/zinc',
        yBand: 'hills', dangerTier: 'early_mid', primary: 'zinc', secondary: 'lead', tertiary: 'cadmium',
        primaryFluidTag: 'forge:molten_zinc', secondaryFluidTag: 'forge:molten_lead', tertiaryFluidTag: 'forge:molten_cadmium',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'brass_and_chemical_trace_route', notes: 'Create brass support.'
    },
    {
        id: 'lead_zinc_vein', displayName: 'Lead-Zinc Vein', tag: 'realistic_ores:deposit_ore_blocks/lead_zinc_vein',
        yBand: 'underground', dangerTier: 'mid', primary: 'lead', secondary: 'zinc', tertiary: 'silver',
        primaryFluidTag: 'forge:molten_lead', secondaryFluidTag: 'forge:molten_zinc', tertiaryFluidTag: 'forge:molten_silver',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'electronics_and_noble_trace_route', notes: 'Supports power and OC2R progression.'
    },
    {
        id: 'quartz_vein', displayName: 'Quartz Vein', tag: 'realistic_ores:deposit_ore_blocks/quartz_vein',
        yBand: 'hills_or_mountains', dangerTier: 'mid', primary: 'quartz', secondary: null, tertiary: null,
        primaryFluidTag: 'forge:molten_quartz', secondaryFluidTag: null, tertiaryFluidTag: null,
        firstUsefulProcessingTier: 'create_preprocess', lateProcessingRole: 'silicon_and_ae2_route', notes: 'Confirmed by registry only where a matching deposit tag exists.'
    },
    {
        id: 'bauxite_laterite', displayName: 'Bauxite Laterite', tag: 'realistic_ores:deposit_ore_blocks/bauxite_laterite',
        yBand: 'surface_or_hills', dangerTier: 'mid', primary: 'aluminum', secondary: 'iron', tertiary: 'nickel',
        primaryFluidTag: 'forge:molten_aluminum', secondaryFluidTag: 'forge:molten_iron', tertiaryFluidTag: 'forge:molten_nickel',
        firstUsefulProcessingTier: 'melter', lateProcessingRole: 'space_alloys_and_chemistry', notes: 'Later starter-adjacent deposit for Creating Space alloys.'
    }
]
