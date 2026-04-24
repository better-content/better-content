// kubejs/server_scripts/disable_manual_create_casings.js
//
// Blocks player manual casing creation.
// Keeps Create item application recipes intact for Deployers.

const CREATE_CASING_MANUAL_APPLICATORS = [
    'create:andesite_alloy',
'minecraft:copper_ingot',
'create:brass_ingot',
'create:sturdy_sheet'
]

function isStrippedWoodLike(blockId) {
    return /^.+:stripped_.+_(log|wood|stem|hyphae)$/.test(blockId)
}

BlockEvents.rightClicked(event => {
    const itemId = event.item.id
    const blockId = event.block.id

    if (!CREATE_CASING_MANUAL_APPLICATORS.includes(itemId)) return
        if (!isStrippedWoodLike(blockId)) return

            event.cancel()
})
