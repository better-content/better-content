var BC_REPLACED_FISHING_RODS = [
    'minecraft:fishing_rod',
    'tconstruct:fishing_rod'
]

JEIEvents.hideItems(function (event) {
    BC_REPLACED_FISHING_RODS.forEach(function (item) {
        event.hide(item)
    })
})

if (Platform.isLoaded('emi') && typeof EMIEvents !== 'undefined') {
    EMIEvents.hideItems(function (event) {
        BC_REPLACED_FISHING_RODS.forEach(function (item) {
            event.hide(item)
        })
    })
}
