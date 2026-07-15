// Shared formal-magic proof and school-focus tags.

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

    var upstreamFocus = {
        blood: 'irons_spellbooks:blood_vial',
        nature: 'minecraft:poisonous_potato',
        ice: 'irons_spellbooks:frozen_bone',
        ender: 'minecraft:ender_pearl',
        fire: 'minecraft:blaze_rod',
        holy: 'irons_spellbooks:divine_pearl',
        lightning: 'irons_spellbooks:lightning_bottle',
        evocation: 'minecraft:emerald',
        eldritch: 'minecraft:echo_shard'
    }
    var schools = BC_FORMAL_MAGIC_TAGS.irons_schools || {}
    var schoolIds = Object.keys(schools)
    var oldAggregate = []
    var newAggregate = []
    for (var s = 0; s < schoolIds.length; s++) {
        var school = schoolIds[s]
        var tag = 'irons_spellbooks:' + school + '_focus'
        event.remove(tag, upstreamFocus[school])
        event.add(tag, schools[school].focus)
        oldAggregate.push(upstreamFocus[school])
        newAggregate.push(schools[school].focus)
    }
    event.remove('irons_spellbooks:school_focus', oldAggregate)
    event.add('irons_spellbooks:school_focus', newAggregate)
})
