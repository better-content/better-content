// Forge 1.20.1
// Triples durability of all No Tree Punching flint tools

StartupEvents.modifyItem(event => {

    const flintTools = [
        'notreepunching:flint_pickaxe',
        'notreepunching:flint_axe',
        'notreepunching:flint_shovel',
        'notreepunching:flint_hoe',
        'notreepunching:flint_knife',     // if present
        'notreepunching:flint_macuahuitl'      // if present
    ]

    flintTools.forEach(id => {
        event.modify(id, item => {
            item.maxDamage = item.maxDamage * 3
        })
    })

})
