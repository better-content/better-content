// Ars is the programmable formal-magic system. Its book and writing desk are early
// shells; depth proofs set complexity and per-glyph origin tags preserve provenance.

var BC_FORMAL_MAGIC = JsonIO.read('kubejs/config/formal_magic_domains.json') || { glyphs: [] }

function bcFormalExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

function bcFormalIngredient(input) {
    var value = String(input)
    if (value.indexOf('#') === 0) return { tag: value.substring(1) }
    return { item: value }
}

function bcFormalGlyphInput(input) {
    return { item: bcFormalIngredient(input) }
}

function bcFormalGlyph(event, spec) {
    var name = spec[0]
    var tier = spec[1]
    var catalyst = spec[3]
    var output = name.indexOf(':') >= 0 ? name : 'ars_nouveau:glyph_' + name
    if (!bcFormalExists(output)) return
    var glyphName = output.substring(output.indexOf(':') + 1).replace(/^glyph_/, '')

    var tierData = {
        1: { exp: 27, proof: '#kubejs:formal_magic/proof/common' },
        2: { exp: 55, proof: '#kubejs:formal_magic/proof/rare' },
        3: { exp: 160, proof: '#kubejs:formal_magic/proof/epic' }
    }[tier]

    event.custom({
        type: 'ars_nouveau:glyph',
        count: 1,
        exp: tierData.exp,
        inputItems: [
            bcFormalGlyphInput('ars_nouveau:blank_parchment'),
            bcFormalGlyphInput(tierData.proof),
            bcFormalGlyphInput('#kubejs:formal_magic/glyph_origin/' + glyphName),
            bcFormalGlyphInput(catalyst)
        ],
        output: output
    }).id('kubejs:formal_magic/ars/glyph/' + name.replace(':', '/'))
}

ServerEvents.recipes(function (event) {
    var glyphs = (BC_FORMAL_MAGIC.glyphs || []).concat(BC_FORMAL_MAGIC.addon_glyphs || [])
    for (var i = 0; i < glyphs.length; i++) {
        var glyphOutput = glyphs[i][0].indexOf(':') >= 0 ? glyphs[i][0] : 'ars_nouveau:glyph_' + glyphs[i][0]
        event.remove({ output: glyphOutput })
    }
    var quarantined = BC_FORMAL_MAGIC.quarantined_glyphs || []
    for (var q = 0; q < quarantined.length; q++) event.remove({ output: quarantined[q].id })

    event.remove({ output: 'ars_nouveau:novice_spell_book' })
    event.remove({ output: 'ars_nouveau:apprentice_spell_book' })
    event.remove({ output: 'ars_nouveau:archmage_spell_book' })
    event.remove({ output: 'ars_nouveau:scribes_table' })

    event.shaped('ars_nouveau:novice_spell_book', [
        ' AP',
        'ABA',
        'PA '
    ], {
        A: 'create:andesite_alloy',
        B: 'minecraft:book',
        P: 'minecraft:paper'
    }).id('ars_nouveau:novice_spell_book')

    event.shaped('ars_nouveau:scribes_table', [
        'PCP',
        ' L ',
        'W W'
    ], {
        P: 'minecraft:paper',
        C: 'create:copper_sheet',
        L: 'minecraft:lectern',
        W: '#minecraft:planks'
    }).id('kubejs:formal_magic/ars/scribes_table')

    event.custom({
        type: 'ars_nouveau:book_upgrade',
        ingredients: [
            { item: 'ars_nouveau:novice_spell_book' },
            { tag: 'kubejs:formal_magic/proof/uncommon' },
            { item: 'minecraft:obsidian' },
            { item: 'minecraft:diamond' }
        ],
        result: { item: 'ars_nouveau:apprentice_spell_book' }
    }).id('ars_nouveau:apprentice_spell_book_upgrade')

    event.custom({
        type: 'ars_nouveau:book_upgrade',
        ingredients: [
            { item: 'ars_nouveau:apprentice_spell_book' },
            { tag: 'kubejs:formal_magic/proof/legendary' },
            { item: 'minecraft:nether_star' },
            { item: 'ars_nouveau:wilden_tribute' }
        ],
        result: { item: 'ars_nouveau:archmage_spell_book' }
    }).id('ars_nouveau:archmage_spell_book_upgrade')

    for (var g = 0; g < glyphs.length; g++) bcFormalGlyph(event, glyphs[g])

})
