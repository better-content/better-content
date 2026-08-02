// kubejs/server_scripts/20_recipe_remove/30_remove_items.js

var Gson = Java.loadClass('com.google.gson.Gson')
var GSON = new Gson()
var QUARANTINE_POLICY = JsonIO.read('kubejs/config/quarantined_items.json') || { schema: '', items: [] }
var CHEMLIB_FORM_POLICY = JsonIO.read('kubejs/config/chemlib_form_policy.json') || { hidden_gas_buckets: [], hidden_forms: [], hidden_compounds: [] }

if (QUARANTINE_POLICY.schema !== 'bc.quarantined_items.v1') {
    console.warn('[KubeJS] Ignoring unsupported quarantine manifest schema: ' + QUARANTINE_POLICY.schema)
    QUARANTINE_POLICY = { schema: 'bc.quarantined_items.v1', items: [] }
}

var DISABLED_ITEMS = (QUARANTINE_POLICY.items || [])
    .concat(CHEMLIB_FORM_POLICY.hidden_gas_buckets || [])
    .concat(CHEMLIB_FORM_POLICY.hidden_forms || [])
    .concat(CHEMLIB_FORM_POLICY.hidden_compounds || [])

function safeString(value) {
    if (value == null) return ''
    try {
        return value.toString()
    } catch (ignored) {
        return ''
    }
}

function recipeJsonString(recipe) {
    try {
        return GSON.toJson(recipe.json)
    } catch (ignored) {
        try {
            return safeString(recipe.json)
        } catch (ignoredAgain) {
            return ''
        }
    }
}

ServerEvents.recipes(function (event) {
    console.log('========== Disabled item deep scan start ==========')

    event.remove({ id: 'burnt:gunpowder_recipe' })
    event.remove({ id: 'burnt:fire_barrel_recipe_2' })
    event.remove({ type: 'occultism:miner' })
    event.remove({ type: 'bloodmagic:dimension_drink' })
    event.remove({ id: 'createdieselgenerators:bulk_fermenting/lava' })
    event.remove({ id: 'pneumaticcraft:amadron/emerald_to_oil' })
    event.remove({ id: 'ars_nouveau:water_essence_to_bucket' })
    event.remove({ id: 'ars_nouveau:water_essence_to_obsidian' })
    event.remove({ id: 'ars_nouveau:fire_essence_to_magma_block' })
    event.remove({ id: 'ars_nouveau:conjuration_essence_to_soul_sand' })
    event.remove({ id: 'ars_nouveau:conjuration_essence_to_end_stone' })

    // Normal output selector pass. Unknown or absent registrations are safe:
    // remove selectors simply match no recipes.
    DISABLED_ITEMS.forEach(function (item) {
        event.remove({ output: item })
    })

    var idsToRemove = []

    // Deep JSON scan pass.
    event.forEachRecipe({}, function (recipe) {
        var id = safeString(recipe.getId())
        var type = safeString(recipe.getType())
        var json = recipeJsonString(recipe)
        var matchedItem = null

        DISABLED_ITEMS.forEach(function (item) {
            if (matchedItem == null && json.indexOf(item) !== -1) matchedItem = item
        })

        if (matchedItem != null) {
            console.log('[KubeJS] Queued recipe containing disabled item:')
            console.log('  matched item: ' + matchedItem)
            console.log('  recipe id: ' + id)
            console.log('  recipe type: ' + type)
            idsToRemove.push(id)
        }
    })

    idsToRemove.forEach(function (id) {
        if (id !== '') event.remove({ id: id })
    })

    console.log('[KubeJS] Deep scan removed recipe count: ' + idsToRemove.length)
    console.log('========== Disabled item deep scan end ==========')
})
