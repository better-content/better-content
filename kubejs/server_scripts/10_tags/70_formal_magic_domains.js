// Shared formal-magic depth, origin, and per-glyph provenance tags.

var BC_FORMAL_MAGIC_TAGS = JsonIO.read('kubejs/config/formal_magic_domains.json') || {}

ServerEvents.tags('item', function (event) {
    var proofs = BC_FORMAL_MAGIC_TAGS.proofs || {}
    var proofTiers = Object.keys(proofs)
    for (var i = 0; i < proofTiers.length; i++) {
        var tier = proofTiers[i]
        event.add('kubejs:formal_magic/proof/' + tier, proofs[tier])
    }

    var domains = BC_FORMAL_MAGIC_TAGS.domains || {}
    var domainIds = Object.keys(domains)
    for (var d = 0; d < domainIds.length; d++) {
        var domain = domainIds[d]
        event.add('kubejs:formal_magic/domain/' + domain, domains[domain])
    }

    var originOverrides = BC_FORMAL_MAGIC_TAGS.origin_overrides || {}
    var glyphs = (BC_FORMAL_MAGIC_TAGS.glyphs || []).concat(BC_FORMAL_MAGIC_TAGS.addon_glyphs || [])
    for (var g = 0; g < glyphs.length; g++) {
        var spec = glyphs[g]
        var rawName = String(spec[0])
        var glyphName = rawName.substring(rawName.lastIndexOf(':') + 1).replace(/^glyph_/, '')
        var origins = originOverrides[glyphName] || [spec[2]]
        for (var o = 0; o < origins.length; o++) {
            var reagents = domains[origins[o]] || []
            event.add('kubejs:formal_magic/glyph_origin/' + glyphName, reagents)
        }
    }
})
