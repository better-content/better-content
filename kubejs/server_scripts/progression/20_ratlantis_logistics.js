// Ratlantis supplies the consumable roots of scalable logistics. Native
// crafting ingredients remain intact; Ratlantis Logistics consumes the tier
// component additively when the result is crafted.
var BC_DISABLED_INPUTLESS_RAT_OUTPUTS = [
    'rats:rat_upgrade_ore_doubling',
    'rats:rat_upgrade_fisherman',
    'rats:rat_upgrade_milker',
    'rats:rat_upgrade_aristocrat',
    'rats:rat_upgrade_christmas',
    'rats:rat_upgrade_support'
]

ServerEvents.recipes(function (event) {
    // This contextual recipe outputs an NBT-cleared copy of any module. It has
    // no static graph edges and would also charge a second tier component for
    // re-crafting an existing module, so it is not part of the restored ladder.
    event.remove({ id: 'prettypipes:module_clearing' })
    BC_DISABLED_INPUTLESS_RAT_OUTPUTS.forEach(function (item) {
        event.remove({ output: item })
    })
    event.remove({ output: 'rats:chunky_cheese_token' })
    event.remove({ output: 'rats:ratlantis_portal' })
})
