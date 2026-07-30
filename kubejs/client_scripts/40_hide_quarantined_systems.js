var BC_HIDDEN_QUARANTINED_ITEMS = [
    'alchemistry:atomizer',
    'alchemistry:combiner',
    'alchemistry:compactor',
    'alchemistry:dissolver',
    'alchemistry:fission_chamber_controller',
    'alchemistry:fission_core',
    'alchemistry:fusion_chamber_controller',
    'alchemistry:fusion_core',
    'alchemistry:liquifier',
    'alchemistry:reactor_casing',
    'alchemistry:reactor_energy',
    'alchemistry:reactor_glass',
    'alchemistry:reactor_input',
    'alchemistry:reactor_output',
    'ars_nouveau:glyph_conjure_water',
    'ars_nouveau:ritual_conjure_island_plains',
    'ars_nouveau:ritual_conjure_island_desert',
    'ars_caelum:ritual_conjure_island_geode',
    'ars_caelum:ritual_conjure_island_vexing',
    'ars_caelum:ritual_conjure_island_village',
    'ars_caelum:ritual_conjure_island_flourishing',
    'ars_caelum:ritual_conjure_island_end_portal',
    'ars_caelum:ritual_conjure_island_blazing',
    'ars_caelum:ritual_sedimentation',
    'bloodmagic:watersigil',
    'bloodmagic:lavasigil',
    'bloodmagic:reagentwater',
    'bloodmagic:reagentlava',
    'occultism:miner_debug_unspecialized',
    'occultism:miner_foliot_unspecialized',
    'occultism:miner_djinni_ores',
    'occultism:miner_afrit_deeps',
    'occultism:miner_marid_master',
    'sophisticatedbackpacks:stack_upgrade_omega_tier',
    'sophisticatedstorage:stack_upgrade_omega_tier',
    'createdieselgenerators:distillation_controller',
    'createdieselgenerators:pumpjack_head',
    'createdieselgenerators:pumpjack_hole',
    'createdieselgenerators:pumpjack_bearing',
    'createdieselgenerators:pumpjack_crank',
    'createdieselgenerators:oil_scanner',
    'pneumaticcraft:air_compressor',
    'pneumaticcraft:advanced_air_compressor',
    'pneumaticcraft:liquid_compressor',
    'pneumaticcraft:advanced_liquid_compressor',
    'pneumaticcraft:thermal_compressor',
    'pneumaticcraft:manual_compressor',
    'pneumaticcraft:electrostatic_compressor',
    'pneumaticcraft:solar_compressor',
    'pneumaticcraft:flux_compressor',
    'pneumaticcraft:creative_compressor',
    'pneumaticcraft:jet_boots_upgrade_4',
    'pneumaticcraft:jet_boots_upgrade_5'
]

var BC_CHEMLIB_FORM_POLICY = JsonIO.read('kubejs/config/chemlib_form_policy.json') || { hidden_gas_buckets: [], hidden_forms: [], hidden_compounds: [] }

var BC_HIDDEN_CONFIRMED_CLEANUP_ITEMS = [
    'create:chromatic_compound',
    'create:refined_radiance_casing',
    'create:shadow_steel_casing',
    'creatingspace:crystal_shard',
    'creatingspace:incomplete_iron_injector',
    'creatingspace:injector_grid',
    'creatingspace:reinforced_injector_grid',
    'createdeco:netherite_sheet',
    'forbidden_arcanus:orb_of_temporary_flight',
    'forbidden_arcanus:reinforced_deorum_axe',
    'forbidden_arcanus:reinforced_deorum_hoe',
    'forbidden_arcanus:reinforced_deorum_pickaxe',
    'forbidden_arcanus:reinforced_deorum_shovel',
    'forbidden_arcanus:reinforced_deorum_sword',
    'minecraft:knowledge_book',
    'minecraft:petrified_oak_slab',
    'rpgstats:bone_ritual_dagger',
    'rpgstats:carpus_catalyst',
    'rpgstats:carpus_heart',
    'rpgstats:diamond_ritual_dagger',
    'rpgstats:echo_ritual_dagger',
    'rpgstats:gold_ritual_dagger',
    'rpgstats:heart_flesh',
    'rpgstats:hemostasis_catalyst',
    'rpgstats:hemostasis_heart',
    'rpgstats:iron_ritual_dagger',
    'rpgstats:myofibra_catalyst',
    'rpgstats:myofibra_heart',
    'rpgstats:osteon_catalyst',
    'rpgstats:osteon_heart',
    'rpgstats:synapsis_catalyst',
    'rpgstats:synapsis_heart'
]

var BC_HIDDEN_DIRECT_DIMENSION_TRAVEL_ITEMS = [
    'fallout_wastelands_:portal_frame',
    'fallout_wastelands_:wastelands',
    'undergarden:catalyst',
    'bloodmagic:simplekey',
    'bloodmagic:minekey',
    'bloodmagic:mineentrancekey',
    'bloodmagic:teleposer',
    'bloodmagic:telepositionsigil',
    'bloodmagic:reagentteleposition',
    'bloodmagic:teleposerfocus',
    'bloodmagic:reinforcedteleposerfocus',
    'bloodmagic:enhancedteleposerfocus',
    'irons_spellbooks:portal_frame',
    'irons_spellbooks:pocket_dimension_portal_frame',
    'irons_spellbooks:wayward_compass',
    'aether:aether_portal_frame',
    'deeperdarker:otherside_portal'
]

var BC_HIDDEN_ITEMS = BC_HIDDEN_QUARANTINED_ITEMS
    .concat(BC_HIDDEN_CONFIRMED_CLEANUP_ITEMS)
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_gas_buckets || [])
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_forms || [])
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_compounds || [])
    .concat(BC_HIDDEN_DIRECT_DIMENSION_TRAVEL_ITEMS)

JEIEvents.hideItems(function (event) {
    BC_HIDDEN_ITEMS.forEach(function (item) { event.hide(item) })
})

if (Platform.isLoaded('emi') && typeof EMIEvents !== 'undefined') {
    EMIEvents.hideItems(function (event) {
        BC_HIDDEN_ITEMS.forEach(function (item) { event.hide(item) })
    })
}
