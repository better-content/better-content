// Acid Vat dissolver-parity layer for starter deposits.
// Alchemistry remains reference/compat data; Acid Vat is the authored chemical route.

var BTM_ACID_VAT_DEPOSITS = [
    { id: 'coal_measures', input: 'realisticores:crushed_coal_measures', acid: 'chemlib:acetic_acid_fluid', time: 120, results: [{ item: 'chemlib:carbon', count: 16 }, { item: 'chemlib:iron', count: 2 }] },
    { id: 'ironstone', input: 'realisticores:crushed_ironstone', acid: 'chemlib:sulfuric_acid_fluid', time: 90, results: [{ item: 'chemlib:iron', count: 18 }, { item: 'chemlib:nickel', count: 4 }, { item: 'chemlib:chromium', count: 2 }] },
    { id: 'copper_sulfide', input: 'realisticores:crushed_copper_sulfide_ore', acid: 'chemlib:sulfuric_acid_fluid', time: 90, results: [{ item: 'chemlib:copper', count: 18 }, { item: 'chemlib:iron', count: 4 }, { item: 'chemlib:gold', count: 1 }, { item: 'chemlib:sulfur', count: 6 }] },
    { id: 'tin', input: 'realisticores:crushed_tin_ore', acid: 'chemlib:hydrochloric_acid_fluid', time: 110, results: [{ item: 'chemlib:tin', count: 18 }, { item: 'chemlib:silicon', count: 4 }, { item: 'chemlib:tungsten', count: 1 }] },
    { id: 'zinc', input: 'realisticores:crushed_zinc_ore', acid: 'chemlib:hydrochloric_acid_fluid', time: 110, results: [{ item: 'chemlib:zinc', count: 18 }, { item: 'chemlib:lead', count: 3 }, { item: 'chemlib:cadmium', count: 1 }] },
    { id: 'lead_zinc_vein', input: 'realisticores:crushed_lead_zinc_vein', acid: 'chemlib:nitric_acid_fluid', time: 120, results: [{ item: 'chemlib:lead', count: 18 }, { item: 'chemlib:zinc', count: 6 }, { item: 'chemlib:silver', count: 3 }] },
    { id: 'quartz_vein', input: 'realisticores:crushed_quartz_vein', acid: 'chemlib:hydrochloric_acid_fluid', time: 120, results: [{ item: 'chemlib:silicon', count: 16 }, { item: 'chemlib:gold', count: 1 }, { item: 'chemlib:copper', count: 2 }] },
    { id: 'bauxite_laterite', input: 'realisticores:crushed_bauxite_laterite', acid: 'chemlib:sulfuric_acid_fluid', time: 130, results: [{ item: 'chemlib:aluminum', count: 18 }, { item: 'chemlib:iron', count: 5 }, { item: 'chemlib:nickel', count: 3 }] }
]

ServerEvents.recipes(function (event) {
    if (!Platform.isLoaded('acid_vat')) return

    for (var i = 0; i < BTM_ACID_VAT_DEPOSITS.length; i++) {
        var dep = BTM_ACID_VAT_DEPOSITS[i]
        var slurryId = 'acid_vat:btm_' + dep.id + '_slurry'

        event.custom({
            type: 'acid_vat:acid_vat',
            input: { count: 1, ingredient: { item: dep.input } },
            acid: dep.acid,
            acid_amount: 250,
            processing_time: dep.time,
            slurry_amount: 250,
            slurry_id: slurryId
        }).id('kubejs:acid_vat/deposits/' + dep.id)

        event.custom({
            type: 'acid_vat:centrifuge',
            slurry_id: slurryId,
            slurry_amount: 250,
            processing_time: 120,
            results: dep.results
        }).id('kubejs:acid_vat/centrifuge/deposits/' + dep.id)
    }
})
