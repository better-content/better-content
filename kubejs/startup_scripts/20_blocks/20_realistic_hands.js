// Realistic Hands runtime enforcement.
// Primitive loose-earth surfaces stay hand-breakable and shovel-usable; all other authored blocks require a matching first-class tool identity.

var BtmRealisticHandsEventResult = Java.loadClass('net.minecraftforge.eventbus.api.Event$Result')
var BtmRealisticHandsForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')

var BtmRealisticHandsAssignments = null
var BtmRealisticHandsBlockSets = {}
var BtmRealisticHandsItemSets = {}
var BtmRealisticHandsLoadedSchema = null

function btmRealisticHandsCall(target, methodNames, args) {
    if (target === null || target === undefined) return null
    for (var i = 0; i < methodNames.length; i++) {
        try {
            if (args && args.length === 1) return target[methodNames[i]](args[0])
            if (args && args.length === 2) return target[methodNames[i]](args[0], args[1])
            if (args && args.length === 3) return target[methodNames[i]](args[0], args[1], args[2])
            if (args && args.length) return target[methodNames[i]].apply(target, args)
            return target[methodNames[i]]()
        } catch (e) {
        }
    }
    return null
}

function btmRealisticHandsBool(value) {
    return value === true || String(value) === 'true'
}

function btmRealisticHandsMakeSet(values) {
    var out = {}
    if (!values) return out
    try {
        for (var i = 0; i < values.length; i++) out[String(values[i])] = true
    } catch (ignored) {
    }
    return out
}

function btmRealisticHandsRefreshAssignments() {
    var current = global.BTM_REALISTIC_HANDS_ASSIGNMENTS || { blocks: {}, items: {} }
    var schema = String(current.schema || 'UNKNOWN')
    if (BtmRealisticHandsAssignments === current && BtmRealisticHandsLoadedSchema === schema) return

    BtmRealisticHandsAssignments = current
    BtmRealisticHandsLoadedSchema = schema
    var blocks = BtmRealisticHandsAssignments.blocks || {}
    var items = BtmRealisticHandsAssignments.items || {}
    BtmRealisticHandsBlockSets = {
        hand: btmRealisticHandsMakeSet(blocks.hand),
        knife: btmRealisticHandsMakeSet(blocks.knife),
        axe: btmRealisticHandsMakeSet(blocks.axe),
        pickaxe: btmRealisticHandsMakeSet(blocks.pickaxe),
        shovel: btmRealisticHandsMakeSet(blocks.shovel),
        hoe: btmRealisticHandsMakeSet(blocks.hoe),
        sword: btmRealisticHandsMakeSet(blocks.sword)
    }
    BtmRealisticHandsItemSets = {
        knife: btmRealisticHandsMakeSet(items.knife),
        axe: btmRealisticHandsMakeSet(items.axe),
        pickaxe: btmRealisticHandsMakeSet(items.pickaxe),
        shovel: btmRealisticHandsMakeSet(items.shovel),
        hoe: btmRealisticHandsMakeSet(items.hoe),
        sword: btmRealisticHandsMakeSet(items.sword)
    }

    console.info('[BTM-RealisticHands] loaded schema=' + schema +
        ' hand=' + Object.keys(BtmRealisticHandsBlockSets.hand).length +
        ' knife=' + Object.keys(BtmRealisticHandsBlockSets.knife).length +
        ' axe=' + Object.keys(BtmRealisticHandsBlockSets.axe).length +
        ' pickaxe=' + Object.keys(BtmRealisticHandsBlockSets.pickaxe).length +
        ' shovel=' + Object.keys(BtmRealisticHandsBlockSets.shovel).length +
        ' hoe=' + Object.keys(BtmRealisticHandsBlockSets.hoe).length +
        ' sword=' + Object.keys(BtmRealisticHandsBlockSets.sword).length)
}

btmRealisticHandsRefreshAssignments()

function btmRealisticHandsStackIsEmpty(stack) {
    if (stack === null || stack === undefined) return true
    return btmRealisticHandsBool(btmRealisticHandsCall(stack, ['isEmpty', 'm_41619_'], []))
}

function btmRealisticHandsIsCreative(player) {
    if (btmRealisticHandsBool(btmRealisticHandsCall(player, ['isCreative', 'isCreativeMode'], []))) return true

    var abilities = btmRealisticHandsCall(player, ['getAbilities', 'm_150110_'], [])
    if (abilities && abilities.instabuild === true) return true

    return false
}

function btmRealisticHandsStateId(state) {
    var block = btmRealisticHandsCall(state, ['getBlock', 'm_60734_'], [])
    var key = block ? BtmRealisticHandsForgeRegistries.BLOCKS.getKey(block) : null
    return key ? String(key) : ''
}

function btmRealisticHandsStackId(stack) {
    if (btmRealisticHandsStackIsEmpty(stack)) return ''
    var item = btmRealisticHandsCall(stack, ['getItem', 'm_41720_'], [])
    var key = item ? BtmRealisticHandsForgeRegistries.ITEMS.getKey(item) : null
    return key ? String(key) : ''
}

function btmRealisticHandsBlockIn(setName, id) {
    return id && BtmRealisticHandsBlockSets[setName] && BtmRealisticHandsBlockSets[setName][id] === true
}

function btmRealisticHandsItemIn(setName, id) {
    return id && BtmRealisticHandsItemSets[setName] && BtmRealisticHandsItemSets[setName][id] === true
}

function btmRealisticHandsHasMatchingTool(player, state) {
    if (btmRealisticHandsIsCreative(player)) return true

    var id = btmRealisticHandsStateId(state)
    if (!id) return false

    var stack = btmRealisticHandsCall(player, ['getMainHandItem', 'm_21205_'], [])
    var itemId = btmRealisticHandsStackId(stack)

    if (btmRealisticHandsBlockIn('knife', id) && btmRealisticHandsItemIn('knife', itemId)) return true
    if (btmRealisticHandsBlockIn('axe', id) && btmRealisticHandsItemIn('axe', itemId)) return true
    if (btmRealisticHandsBlockIn('pickaxe', id) && btmRealisticHandsItemIn('pickaxe', itemId)) return true
    if (btmRealisticHandsBlockIn('shovel', id) && btmRealisticHandsItemIn('shovel', itemId)) return true
    if (btmRealisticHandsBlockIn('hoe', id) && btmRealisticHandsItemIn('hoe', itemId)) return true
    if (btmRealisticHandsBlockIn('sword', id) && btmRealisticHandsItemIn('sword', itemId)) return true

    return false
}

function btmRealisticHandsShouldDeny(player, state) {
    btmRealisticHandsRefreshAssignments()
    if (!player || !state) return false
    var id = btmRealisticHandsStateId(state)
    if (!id) return false
    if (btmRealisticHandsBlockIn('hand', id)) return false
    return !btmRealisticHandsHasMatchingTool(player, state)
}

function btmRealisticHandsDamageMainHandKnife(player, state) {
    if (!player || !state || btmRealisticHandsIsCreative(player)) return

    var blockId = btmRealisticHandsStateId(state)
    if (!btmRealisticHandsBlockIn('knife', blockId)) return

    var stack = btmRealisticHandsCall(player, ['getMainHandItem', 'm_21205_'], [])
    var itemId = btmRealisticHandsStackId(stack)
    if (!btmRealisticHandsItemIn('knife', itemId)) return
    if (!btmRealisticHandsBool(btmRealisticHandsCall(stack, ['isDamageableItem', 'm_41763_'], []))) return

    var currentDamage = Number(btmRealisticHandsCall(stack, ['getDamageValue', 'm_41773_'], []) || 0)
    var maxDamage = Number(btmRealisticHandsCall(stack, ['getMaxDamage', 'm_41776_'], []) || 0)
    if (maxDamage <= 0) return

    var nextDamage = currentDamage + 1
    if (nextDamage >= maxDamage) {
        btmRealisticHandsCall(stack, ['shrink', 'm_41774_'], [1])
    } else {
        btmRealisticHandsCall(stack, ['setDamageValue', 'm_41721_'], [nextDamage])
    }
}

function btmRealisticHandsBlockStateAt(level, pos) {
    if (!level || !pos) return null
    return btmRealisticHandsCall(level, ['getBlockState', 'm_8055_'], [pos])
}

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerEvent$BreakSpeed', function (event) {
    if (btmRealisticHandsShouldDeny(event.getEntity(), event.getState())) {
        event.setNewSpeed(0.0)
        event.setCanceled(true)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerEvent$HarvestCheck', function (event) {
    if (btmRealisticHandsShouldDeny(event.getEntity(), event.getTargetBlock())) {
        event.setCanHarvest(false)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerInteractEvent$LeftClickBlock', function (event) {
    var state = btmRealisticHandsBlockStateAt(event.getLevel(), event.getPos())
    if (btmRealisticHandsShouldDeny(event.getEntity(), state)) {
        event.setUseBlock(BtmRealisticHandsEventResult.DENY)
        event.setUseItem(BtmRealisticHandsEventResult.DENY)
        event.setCanceled(true)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.level.BlockEvent$BreakEvent', function (event) {
    if (btmRealisticHandsShouldDeny(event.getPlayer(), event.getState())) {
        event.setCanceled(true)
        return
    }
    btmRealisticHandsDamageMainHandKnife(event.getPlayer(), event.getState())
})
