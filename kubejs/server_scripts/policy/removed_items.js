// Narrow deny policy. Each listed output is intentionally unavailable; unlike
// the former staging script this never scans arbitrary recipe JSON.
var BC_DISABLED_ITEMS = (JsonIO.read('kubejs/config/quarantined_items.json') || { items: [] }).items || []
var BC_CHEMLIB_HIDDEN = JsonIO.read('kubejs/config/chemlib_form_policy.json') || {}
BC_DISABLED_ITEMS = BC_DISABLED_ITEMS
    .concat(BC_CHEMLIB_HIDDEN.hidden_gas_buckets || [])
    .concat(BC_CHEMLIB_HIDDEN.hidden_forms || [])
    .concat(BC_CHEMLIB_HIDDEN.hidden_compounds || [])

ServerEvents.recipes(function (event) {
    ;[
        'burnt:gunpowder_recipe',
        'burnt:fire_barrel_recipe_2',
        'createdieselgenerators:bulk_fermenting/lava',
        'pneumaticcraft:amadron/emerald_to_oil',
        'ars_nouveau:water_essence_to_bucket',
        'ars_nouveau:water_essence_to_obsidian',
        'ars_nouveau:fire_essence_to_magma_block',
        'ars_nouveau:conjuration_essence_to_soul_sand',
        'ars_nouveau:conjuration_essence_to_end_stone',
        'bloodmagic:alchemytable/sigil_lava_bucket',
        'bloodmagic:alchemytable/sigil_water_bucket',
        'bloodmagic:alchemytable/sigil_water_bottle',
        'bloodmagic:alchemytable/reagent_frost_water_sigil',
        'bloodmagic:alchemytable/sulfur_from_sigil',
        'bloodmagic:alchemytable/advance_cutting_fluid_sigil',
        'bloodmagic:alchemytable/basic_cutting_fluid_sigil',
        'bloodmagic:alchemytable/clay_from_sand_sigil',
        'bloodmagic:alchemytable/intermediate_cutting_fluid_sigil',
        'bloodmagic:alchemytable/leather_from_flesh_sigil',
        'createdieselgenerators:distillation/crude_oil',
        'createdieselgenerators:distillation/superheated_crude_oil',
        // Exact final-graph closures for serializers whose outputs are not
        // matched by KubeJS's generic output filter.
        'ars_elemental:head_cut/behead_dragon',
        'ars_nouveau:drygmy_charm',
        'ars_nouveau:enchanters_sword',
        'ars_nouveau:relay_warp',
        'ars_nouveau:stable_warp_scroll',
        'ars_nouveau:thread_drygmy',
        'ars_nouveau:thread_whirlisprig',
        'ars_nouveau:warp_scroll_copy',
        'ars_nouveau:whirlisprig_charm',
        'arseng:source_acceptor',
        'arseng:source_cell_housing',
        'arseng:source_storage_cell_1k',
        'arseng:source_storage_cell_4k',
        'arseng:source_storage_cell_16k',
        'arseng:source_storage_cell_64k',
        'arseng:source_storage_cell_256k',
        'pneumaticcraft:pressure_chamber/pressure_chamber_disenchanting',
        'pneumaticcraft:pressure_chamber/pressure_chamber_enchanting',
        'tconstruct:tools/severing/ender_dragon_head',
        'tconstruct:smeltery/entity_melting/heads/ender_dragon'
    ].forEach(function (id) { event.remove({ id: id }) })
    event.remove({ type: 'occultism:miner' })
    event.remove({ type: 'bloodmagic:dimension_drink' })
    event.replaceInput({ id: 'bloodmagic:alchemytable/reagent_suppression' },
        'bloodmagic:teleposer', 'minecraft:sponge')
    BC_DISABLED_ITEMS.forEach(function (item) { event.remove({ output: item }) })
})
