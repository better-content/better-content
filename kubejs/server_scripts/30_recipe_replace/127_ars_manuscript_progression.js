// Ars is the programmable formal-magic system. Its book and writing desk are early
// shells; inks set global depth and native proof tags set thematic breadth.

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
    var domain = spec[2]
    var catalyst = spec[3]
    var output = 'ars_nouveau:glyph_' + name
    if (!bcFormalExists(output)) return

    var tierData = {
        1: { exp: 27, ink: 'irons_spellbooks:common_ink' },
        2: { exp: 55, ink: 'irons_spellbooks:rare_ink' },
        3: { exp: 160, ink: 'irons_spellbooks:epic_ink' }
    }[tier]

    event.custom({
        type: 'ars_nouveau:glyph',
        count: 1,
        exp: tierData.exp,
        inputItems: [
            bcFormalGlyphInput(tierData.ink),
            bcFormalGlyphInput('#kubejs:formal_magic/domain/' + domain),
            bcFormalGlyphInput(catalyst)
        ],
        output: output
    }).id('kubejs:formal_magic/ars/glyph/' + name)
}

ServerEvents.recipes(function (event) {
    var glyphs = BC_FORMAL_MAGIC.glyphs || []
    for (var i = 0; i < glyphs.length; i++) {
        event.remove({ output: 'ars_nouveau:glyph_' + glyphs[i][0] })
    }

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
    }).id('kubejs:formal_magic/ars/novice_spell_book')

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
            { item: 'irons_spellbooks:uncommon_ink' },
            { item: 'minecraft:obsidian' },
            { item: 'minecraft:diamond' }
        ],
        result: { item: 'ars_nouveau:apprentice_spell_book' }
    }).id('ars_nouveau:apprentice_spell_book_upgrade')

    event.custom({
        type: 'ars_nouveau:book_upgrade',
        ingredients: [
            { item: 'ars_nouveau:apprentice_spell_book' },
            { item: 'irons_spellbooks:epic_ink' },
            { item: 'minecraft:nether_star' },
            { item: 'ars_nouveau:wilden_tribute' }
        ],
        result: { item: 'ars_nouveau:archmage_spell_book' }
    }).id('ars_nouveau:archmage_spell_book_upgrade')

    for (var g = 0; g < glyphs.length; g++) bcFormalGlyph(event, glyphs[g])

})
