// Starcatcher is the only meaningful fishing route. Rare native rod variants remain.
ServerEvents.recipes(function (event) {
    event.remove({ output: 'minecraft:fishing_rod' })
    event.remove({ output: 'tconstruct:fishing_rod' })
    event.remove({ id: 'starcatcher:hook' })
    event.remove({ id: 'starcatcher:rod_from_vanilla' })
    event.remove({ id: 'starcatcher:vanilla_bobber_from_fishing_rod' })
    event.remove({ id: 'tconstruct:tools/building/fishing_rod' })
    event.remove({ id: 'tconstruct:tables/recycling/fishing_rod' })
    event.remove({ id: 'tconstruct:tools/modifiers/slotless/fishing_rod_tip_clearing' })
    event.remove({ id: 'tconstruct:tools/modifiers/slotless/fishing_rod_tipping' })
})
