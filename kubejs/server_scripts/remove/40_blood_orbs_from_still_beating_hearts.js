// A lived-life proof gates Blood Magic entry; later Blood Orbs keep their native recipes.

ServerEvents.recipes(function (event) {
    if (!Platform.isLoaded('bloodmagic') || !Platform.isLoaded('rpg_stats')) return
    if (!event.recipes.bloodmagic || !event.recipes.bloodmagic.altar) {
        console.warn('[blood-orbs-from-hearts] Blood Magic KubeJS addon API not found; skipping.')
        return
    }

    event.remove({ id: 'bloodmagic:altar/weakbloodorb' })
    event.recipes.bloodmagic
        .altar('bloodmagic:weakbloodorb', 'rpg_stats:still_beating_heart')
        .upgradeLevel(1)
        .altarSyphon(2400)
        .consumptionRate(20)
        .drainRate(20)
        .id('kubejs:bloodmagic/still_beating_heart_to_weak_orb')
})
