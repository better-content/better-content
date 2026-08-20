// Player-facing provenance for every retained Ars glyph.
// The same contract drives inscription recipes and these explanations.

var BC_FORMAL_TOOLTIP_DATA = JsonIO.read('kubejs/config/formal_magic_domains.json') || {}

function bcFormalTooltipGlyphId(rawName) {
    var value = String(rawName)
    return value.indexOf(':') >= 0 ? value : 'ars_nouveau:glyph_' + value
}

function bcFormalTooltipName(id) {
    return String(id).replace('blood_magic', 'Blood Magic').replace('hexerei', 'Hexerei')
        .replace('occultism', 'Occultism').replace('malum', 'Malum').replace('goety', 'Goety')
        .replace('core', 'Ars grammar')
}

ItemEvents.tooltip(function (event) {
    var overrides = BC_FORMAL_TOOLTIP_DATA.origin_overrides || {}
    var roles = BC_FORMAL_TOOLTIP_DATA.formal_roles || {}
    var glyphs = (BC_FORMAL_TOOLTIP_DATA.glyphs || []).concat(BC_FORMAL_TOOLTIP_DATA.addon_glyphs || [])

    for (var i = 0; i < glyphs.length; i++) {
        var spec = glyphs[i]
        var itemId = bcFormalTooltipGlyphId(spec[0])
        var glyphName = itemId.substring(itemId.indexOf(':') + 1).replace(/^glyph_/, '')
        var origins = overrides[glyphName] || [spec[2]]
        var labels = []
        for (var o = 0; o < origins.length; o++) labels.push(bcFormalTooltipName(origins[o]))

        event.add(itemId, Text.gray('Formal origins: ' + labels.join(' · ')))
        event.add(itemId, Text.darkGray('Role: ' + (roles[spec[2]] || roles.core)))
    }

    var quarantined = BC_FORMAL_TOOLTIP_DATA.quarantined_glyphs || []
    for (var q = 0; q < quarantined.length; q++) {
        event.add(quarantined[q].id, Text.red('Quarantined formalism'))
        event.add(quarantined[q].id, Text.darkRed(quarantined[q].reason))
    }
})
