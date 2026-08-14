// Starcatcher is the only meaningful fishing route. Rare native rod variants remain.
ServerEvents.recipes(function (event) {
    event.remove({ output: 'minecraft:fishing_rod' })
    event.remove({ output: 'tconstruct:fishing_rod' })
    event.remove({ id: 'starcatcher:hook' })
    event.remove({ id: 'starcatcher:rod_from_vanilla' })
    event.remove({ id: 'starcatcher:vanilla_bobber_from_fishing_rod' })
})
