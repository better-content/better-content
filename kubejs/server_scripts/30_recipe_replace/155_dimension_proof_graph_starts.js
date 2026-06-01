// Dimension proof gates for external reward graph starts.
// Meteor dimensions provide native material proofs for route tools; they do not
// become labels for the main Create, AE2, PNCR, OC2R, or side-magic spines.

var BTM_DIM_PROOF_ADDED = 0

function btmDimProofShaped(event, output, pattern, keys, recipeId, count) {
    event.remove({ output: output })
    event.shaped(count ? Item.of(output, count) : output, pattern, keys).id(recipeId)
    BTM_DIM_PROOF_ADDED++
}

ServerEvents.recipes(function (event) {
    BTM_DIM_PROOF_ADDED = 0

    // Aether -> air travel and expedition mobility.
    btmDimProofShaped(event, 'hangglider:glider_wing', [
        '  S',
        ' SA',
        'SAA'
    ], {
        S: 'aether:skyroot_stick',
        A: 'aether:blue_aercloud'
    }, 'kubejs:dimension_graph/aether/glider_wing')

    btmDimProofShaped(event, 'hangglider:glider_framework', [
        ' Z ',
        'IAI',
        'I I'
    ], {
        Z: 'aether:zanite_gemstone',
        I: '#forge:plates/iron',
        A: 'aether:aerogel'
    }, 'kubejs:dimension_graph/aether/glider_framework')

    btmDimProofShaped(event, 'immersive_aircraft:sail', [
        'AAA',
        'SBS',
        'AAA'
    ], {
        A: 'aether:blue_aercloud',
        S: 'minecraft:string',
        B: 'aether:ambrosium_shard'
    }, 'kubejs:dimension_graph/aether/aircraft_sail')

    btmDimProofShaped(event, 'immersive_aircraft:hull', [
        'SZS',
        'PAP',
        'SZS'
    ], {
        S: 'aether:skyroot_log',
        Z: 'aether:zanite_gemstone',
        P: '#forge:plates/iron',
        A: 'aether:aerogel'
    }, 'kubejs:dimension_graph/aether/aircraft_hull')

    btmDimProofShaped(event, 'immersive_aircraft:propeller', [
        ' Q ',
        'PAP',
        ' Q '
    ], {
        Q: 'aether:quicksoil_glass',
        P: '#forge:plates/iron',
        A: 'aether:aerogel'
    }, 'kubejs:dimension_graph/aether/aircraft_propeller')

    // Everdawn -> advanced hydration and drink route supplies. Basic Thirst
    // bowls, bottles, buckets, and early water purification stay outside this gate.
    btmDimProofShaped(event, 'cold_sweat:waterskin', [
        ' B ',
        'LPL',
        ' L '
    ], {
        B: 'blue_skies:brewberry',
        L: '#forge:leather',
        P: 'blue_skies:pyrope_gem'
    }, 'kubejs:dimension_graph/everdawn/waterskin', 2)

    btmDimProofShaped(event, 'brewinandchewin:keg', [
        'PUP',
        'ICI',
        'PUP'
    ], {
        P: 'blue_skies:lunar_planks',
        U: 'blue_skies:polished_umber',
        I: '#forge:plates/iron',
        C: 'minecraft:honeycomb'
    }, 'kubejs:dimension_graph/everdawn/keg')

    console.info('[dimension-proof-graph-starts] registered ' + BTM_DIM_PROOF_ADDED + ' recipe gates')
})
