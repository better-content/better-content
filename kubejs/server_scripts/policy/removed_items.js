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
        'ars_nouveau:conjuration_essence_to_end_stone'
    ].forEach(function (id) { event.remove({ id: id }) })
    event.remove({ type: 'occultism:miner' })
    event.remove({ type: 'bloodmagic:dimension_drink' })
    BC_DISABLED_ITEMS.forEach(function (item) { event.remove({ output: item }) })
})
