// Hexerei manufactures physical Occultism components; Occultism owns ritual
// activation, spirit fire, bindings, and summoned-servant gameplay.
//
// Hexerei is the preparation practice downstream of Font expeditions. Its core
// apparatus and characteristic reagents therefore retain matter from Nether,
// Aether, Undergarden, and Otherside runs. Occultism still owns spirit fire,
// pentacles, named bindings, and the Foliot -> Djinni -> Afrit -> Marid ladder;
// Hexerei owns only the physical preparation of each impure chalk.

function bcFontIngredient(id) {
    if (id.charAt(0) === '#') return { tag: id.substring(1) }
    return { item: id }
}

function bcFontResult(id, count) {
    var result = { item: id }
    if (count && count > 1) result.count = count
    return result
}

function bcFontCanCraft(output, inputs) {
    try {
        if (!Item.exists(output)) return false
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].charAt(0) !== '#' && !Item.exists(inputs[i])) return false
        }
        return true
    } catch (e) {
        return false
    }
}

function bcFontCauldron(event, id, output, count, fluid, inputs, options) {
    if (!bcFontCanCraft(output, inputs)) return
    event.remove({ output: output })
    var recipe = {
        type: 'hexerei:mixingcauldron',
        liquid: { fluid: fluid },
        ingredients: inputs.map(bcFontIngredient),
        output: bcFontResult(output, count),
        liquidOutput: { fluid: fluid },
        fluidLevelsConsumed: options.fluidLevelsConsumed || 250
    }
    if (options.heatRequirement) recipe.heatRequirement = options.heatRequirement
    if (options.moonRequirement) recipe.moonRequirement = options.moonRequirement
    event.custom(recipe).id('kubejs:fonts_spine/hexerei_cauldron/' + id)
}

ServerEvents.recipes(function (event) {
    // Hexerei's crafting station is an overworld folk-crafting entry point.
    event.remove({ output: 'hexerei:mixing_cauldron' })
    event.shaped('hexerei:mixing_cauldron', [
        'III',
        'ICI',
        ' I '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'minecraft:cauldron'
    }).id('kubejs:hexerei/overworld_mixing_cauldron')

    // Peer preparations retain distinct Font provenance instead of inheriting
    // Blood Magic's slate ladder.
    bcFontCauldron(event, 'moon_dust_aether', 'hexerei:moon_dust', 4, 'minecraft:water', [
        'minecraft:redstone',
        'minecraft:glowstone_dust',
        'aether:ambrosium_shard',
        'aether:zanite_gemstone',
        'minecraft:redstone',
        'minecraft:glowstone_dust',
        'aether:ambrosium_shard',
        'aether:zanite_gemstone'
    ], { moonRequirement: 'full_moon' })

    bcFontCauldron(event, 'infused_fabric_undergarden', 'hexerei:infused_fabric', 2, 'minecraft:water', [
        'minecraft:black_dye',
        'minecraft:leather',
        'minecraft:string',
        'undergarden:cloggrum_ingot',
        'minecraft:leather',
        'minecraft:string',
        'undergarden:cloggrum_ingot',
        'undergarden:regalium_crystal'
    ], {})

    bcFontCauldron(event, 'blood_sigil_nether', 'hexerei:blood_sigil', 1, 'minecraft:lava', [
        'minecraft:redstone',
        'minecraft:polished_blackstone',
        'minecraft:magma_cream',
        'minecraft:soul_soil',
        'minecraft:redstone',
        'minecraft:polished_blackstone',
        'minecraft:blaze_powder',
        'minecraft:nether_brick'
    ], { fluidLevelsConsumed: 333, heatRequirement: 'heated' })

    bcFontCauldron(event, 'crystal_ball_otherside', 'hexerei:crystal_ball', 1, 'minecraft:lava', [
        'minecraft:glass',
        'deeperdarker:gloomslate',
        'minecraft:glass',
        'deeperdarker:soul_dust',
        'hexerei:moon_dust',
        'deeperdarker:soul_crystal',
        'minecraft:glass',
        'deeperdarker:gloomslate'
    ], { heatRequirement: 'heated' })

    // White remains the universal base. Gold remains the binding/possession
    // adjunct; purple retains the End-stone route reached through Foliot work;
    // red still requires Afrit essence. Spirit fire continues to purify all four.
    bcFontCauldron(event, 'occultism_chalk_white_impure', 'occultism:chalk_white_impure', 1, 'minecraft:water', [
        'occultism:burnt_otherstone',
        'occultism:otherworld_ashes',
        'deeperdarker:soul_dust',
        'hexerei:moon_dust',
        'occultism:burnt_otherstone',
        'occultism:otherworld_ashes'
    ], { heatRequirement: 'heated' })

    bcFontCauldron(event, 'occultism_chalk_gold_impure', 'occultism:chalk_gold_impure', 1, 'minecraft:water', [
        'occultism:chalk_white_impure',
        '#forge:dusts/gold',
        '#forge:dusts/glowstone',
        'aether:ambrosium_shard',
        'aether:ambrosium_shard',
        'hexerei:moon_dust'
    ], { heatRequirement: 'heated' })

    bcFontCauldron(event, 'occultism_chalk_purple_impure', 'occultism:chalk_purple_impure', 1, 'minecraft:water', [
        'occultism:chalk_white_impure',
        '#forge:dusts/end_stone',
        '#forge:dusts/obsidian',
        '#forge:dusts/obsidian',
        'undergarden:regalium_crystal',
        'undergarden:regalium_crystal'
    ], { heatRequirement: 'heated' })

    bcFontCauldron(event, 'occultism_chalk_red_impure', 'occultism:chalk_red_impure', 1, 'minecraft:lava', [
        'occultism:chalk_white_impure',
        'occultism:afrit_essence',
        'minecraft:blaze_powder',
        'minecraft:magma_cream',
        'hexerei:blood_sigil',
        'minecraft:soul_soil'
    ], { fluidLevelsConsumed: 333, heatRequirement: 'heated' })

    // These are physical components/tools. Their ritual-derived ingredients
    // preserve Occultism's summoning and spirit-fire progression.
    ;[
        'occultism:spirit_attuned_crystal',
        'occultism:spirit_attuned_pickaxe_head',
        'occultism:book_of_binding_empty'
    ].forEach(function (output) { event.remove({ output: output }) })
    bcFontCauldron(event, 'occultism_spirit_attuned_crystal', 'occultism:spirit_attuned_crystal', 1, 'minecraft:water', [
        'occultism:spirit_attuned_gem', 'occultism:spirit_attuned_gem',
        'occultism:spirit_attuned_gem', 'occultism:spirit_attuned_gem'
    ], { heatRequirement: 'heated' })
    bcFontCauldron(event, 'occultism_spirit_attuned_pickaxe_head', 'occultism:spirit_attuned_pickaxe_head', 1, 'minecraft:water', [
        'occultism:spirit_attuned_gem', 'occultism:spirit_attuned_gem', 'occultism:spirit_attuned_gem'
    ], { heatRequirement: 'heated' })
    bcFontCauldron(event, 'occultism_empty_binding_book', 'occultism:book_of_binding_empty', 1, 'minecraft:water', [
        'occultism:awakened_feather', 'occultism:purified_ink', 'occultism:taboo_book'
    ], { heatRequirement: 'heated' })

    // Keep the storage controller and remote progression used by the live
    // questline. Only the portable satchel remains disabled.
    event.remove({ output: 'occultism:satchel' })
    event.remove({ id: 'occultism:ritual/craft_satchel' })

    // The disabled miner family cannot bypass material production, but the
    // remaining high Occultism ritual still stays on its own Font spine.
    event.replaceInput({ id: 'occultism:ritual/craft_dimensional_mineshaft' },
        'occultism:spirit_attuned_crystal', 'hexerei:blood_sigil')
    event.replaceInput({ id: 'occultism:ritual/craft_dimensional_mineshaft' },
        'minecraft:ender_eye', 'deeperdarker:sculk_bone')
})
