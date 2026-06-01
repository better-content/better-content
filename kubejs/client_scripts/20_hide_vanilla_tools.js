var BTM_VANILLA_TOOL_TIERS = ['wooden', 'stone', 'iron', 'golden', 'diamond', 'netherite']
var BTM_VANILLA_TOOL_KINDS = ['pickaxe', 'axe', 'shovel', 'sword', 'hoe']

var BTM_VANILLA_STYLE_TOOL_FAMILIES = [
    ['ae2', ['certus_quartz', 'fluix', 'nether_quartz']],
    ['aether', ['gravitite', 'holystone', 'skyroot', 'zanite']],
    ['blue_skies', ['aquite', 'bluebright', 'charoite', 'comet', 'diopside', 'dusk', 'frostbright', 'horizonite', 'lunar', 'lunar_stone', 'maple', 'pyrope', 'starlit', 'turquoise_stone']],
    ['botania', ['elementium']],
    ['deeperdarker', ['resonarium', 'warden']],
    ['everythingcopper', ['copper']],
    ['forbidden_arcanus', ['draco_arcanus']],
    ['goety', ['dark']],
    ['iceandfire', ['copper', 'dragonbone', 'dragonsteel_fire', 'dragonsteel_ice', 'dragonsteel_lightning', 'myrmex_desert', 'myrmex_jungle', 'silver']],
    ['malum', ['soul_stained_steel']],
    ['the_finley_dimension_remastered', ['forglite']],
    ['undergarden', ['cloggrum', 'forgotten', 'froststeel', 'utherium']]
]

var BTM_VANILLA_STYLE_TOOL_EXTRAS = [
    'ars_nouveau:enchanters_sword',
    'botania:glass_pickaxe',
    'botania:manasteel_axe',
    'botania:manasteel_hoe',
    'botania:manasteel_shovel',
    'botania:manasteel_sword',
    'botania:star_sword',
    'botania:terra_axe',
    'botania:terra_sword',
    'botania:thunder_sword',
    'create:cardboard_sword',
    'forbidden_arcanus:slimec_pickaxe',
    'goety:diamond_ice_axe',
    'goety:eerie_pickaxe',
    'goety:graverobber_shovel',
    'goety:iron_ice_axe',
    'goety:rampaging_axe',
    'iceandfire:ghost_sword',
    'iceandfire:hippogryph_sword',
    'occultism:iesnium_pickaxe',
    'occultism:infused_pickaxe',
    'the_flesh_that_hates:flesh_axe',
    'the_flesh_that_hates:flesh_sword',
    'twilightforest:fiery_pickaxe',
    'twilightforest:fiery_sword',
    'twilightforest:giant_pickaxe',
    'twilightforest:giant_sword',
    'twilightforest:ironwood_axe',
    'twilightforest:ironwood_hoe',
    'twilightforest:ironwood_pickaxe',
    'twilightforest:ironwood_shovel',
    'twilightforest:ironwood_sword',
    'twilightforest:knightmetal_axe',
    'twilightforest:knightmetal_pickaxe',
    'twilightforest:knightmetal_sword',
    'twilightforest:steeleaf_axe',
    'twilightforest:steeleaf_hoe',
    'twilightforest:steeleaf_pickaxe',
    'twilightforest:steeleaf_shovel',
    'twilightforest:steeleaf_sword'
]

function vanillaToolIds() {
    var tools = []
    for (var ti = 0; ti < BTM_VANILLA_TOOL_TIERS.length; ti++) {
        for (var ki = 0; ki < BTM_VANILLA_TOOL_KINDS.length; ki++) {
            tools.push('minecraft:' + BTM_VANILLA_TOOL_TIERS[ti] + '_' + BTM_VANILLA_TOOL_KINDS[ki])
        }
    }

    for (var fi = 0; fi < BTM_VANILLA_STYLE_TOOL_FAMILIES.length; fi++) {
        var family = BTM_VANILLA_STYLE_TOOL_FAMILIES[fi]
        for (var mi = 0; mi < family[1].length; mi++) {
            for (var fki = 0; fki < BTM_VANILLA_TOOL_KINDS.length; fki++) {
                tools.push(family[0] + ':' + family[1][mi] + '_' + BTM_VANILLA_TOOL_KINDS[fki])
            }
        }
    }

    for (var ei = 0; ei < BTM_VANILLA_STYLE_TOOL_EXTRAS.length; ei++) tools.push(BTM_VANILLA_STYLE_TOOL_EXTRAS[ei])

    return tools
}

JEIEvents.hideItems(function (event) {
    vanillaToolIds().forEach(function (tool) {
        event.hide(tool)
    })
})

if (Platform.isLoaded('emi') && typeof EMIEvents !== 'undefined') {
    EMIEvents.hideItems(function (event) {
        vanillaToolIds().forEach(function (tool) {
            event.hide(tool)
        })
    })
}
