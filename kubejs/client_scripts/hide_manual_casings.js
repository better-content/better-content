// kubejs/client_scripts/hide_manual_create_casing_recipes.js
//
// KubeJS 6+ / Forge 1.20.1 / Rhino-safe.
// Hides Create casing item-application recipes from JEI.
// Does not remove server recipes, so Deployers still work.

const HIDE_CREATE_CASING_OUTPUTS = [
    'create:andesite_casing',
'create:copper_casing',
'create:brass_casing',
'create:railway_casing'
]

const POSSIBLE_CREATE_ITEM_APPLICATION_CATEGORIES = [
    'create:item_application',
'create:deploying'
]

JEIEvents.removeRecipes(event => {
    POSSIBLE_CREATE_ITEM_APPLICATION_CATEGORIES.forEach(category => {
        HIDE_CREATE_CASING_OUTPUTS.forEach(output => {
            event.remove(category, output)
        })
    })
})
