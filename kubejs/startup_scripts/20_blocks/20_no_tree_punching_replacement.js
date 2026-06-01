// Lightweight No Tree Punching replacement.
// Hands can gather only the authored survival whitelist; other blocks need matching tools.

var BtmNtprBlockTags = Java.loadClass('net.minecraft.tags.BlockTags')
var BtmNtprItemTags = Java.loadClass('net.minecraft.tags.ItemTags')
var BtmNtprToolActions = Java.loadClass('net.minecraftforge.common.ToolActions')
var BtmNtprEventResult = Java.loadClass('net.minecraftforge.eventbus.api.Event$Result')
var BtmNtprResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var BtmNtprForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')

console.info('[BTM-NTPR] registering no-tree-punching replacement block gates')

var BtmNtprHandBreakable = BtmNtprBlockTags.create(new BtmNtprResourceLocation('kubejs', 'hand_breakable'))
var BtmNtprKnives = BtmNtprItemTags.create(new BtmNtprResourceLocation('forge', 'tools/knives'))

function btmNtprCall(target, methodNames, args) {
    if (target === null || target === undefined) return null
    for (var i = 0; i < methodNames.length; i++) {
        try {
            if (args && args.length === 1) return target[methodNames[i]](args[0])
            if (args && args.length === 2) return target[methodNames[i]](args[0], args[1])
            if (args && args.length === 3) return target[methodNames[i]](args[0], args[1], args[2])
            if (args && args.length) return target[methodNames[i]].apply(target, args)
            return target[methodNames[i]]()
        } catch (e) {
            // Try the next mapped or obfuscated name.
        }
    }
    return null
}

function btmNtprBool(value) {
    return value === true || String(value) === 'true'
}

function btmNtprTagId(tag) {
    var location = btmNtprCall(tag, ['location'], [])
    return location ? String(location) : String(tag)
}

function btmNtprStateIs(state, tag) {
    var wanted = btmNtprTagId(tag)
    var stream = btmNtprCall(state, ['getTags', 'm_204343_'], [])
    var iterator = stream ? btmNtprCall(stream, ['iterator'], []) : null
    if (!iterator) return false

    while (btmNtprBool(btmNtprCall(iterator, ['hasNext'], []))) {
        if (btmNtprTagId(btmNtprCall(iterator, ['next'], [])) === wanted) return true
    }

    return false
}

function btmNtprStackIsEmpty(stack) {
    if (stack === null || stack === undefined) return true
    return btmNtprBool(btmNtprCall(stack, ['isEmpty', 'm_41619_'], []))
}

function btmNtprStackCanPerform(stack, action) {
    if (btmNtprStackIsEmpty(stack)) return false
    return btmNtprBool(btmNtprCall(stack, ['canPerformAction'], [action]))
}

function btmNtprStackHasTag(stack, tag) {
    if (btmNtprStackIsEmpty(stack)) return false

    var wanted = btmNtprTagId(tag)
    var stream = btmNtprCall(stack, ['getTags'], [])
    var iterator = stream ? btmNtprCall(stream, ['iterator'], []) : null
    if (!iterator) return false

    while (btmNtprBool(btmNtprCall(iterator, ['hasNext'], []))) {
        if (btmNtprTagId(btmNtprCall(iterator, ['next'], [])) === wanted) return true
    }

    return false
}

function btmNtprStackCorrectForDrops(stack, state) {
    if (btmNtprStackIsEmpty(stack)) return false
    return btmNtprBool(btmNtprCall(stack, ['isCorrectToolForDrops', 'm_41735_'], [state]))
}

function btmNtprIsCreative(player) {
    if (btmNtprBool(btmNtprCall(player, ['isCreative', 'isCreativeMode'], []))) return true

    var abilities = btmNtprCall(player, ['getAbilities', 'm_150110_'], [])
    if (abilities && abilities.instabuild === true) return true

    return false
}

function btmNtprStateId(state) {
    var block = btmNtprCall(state, ['getBlock', 'm_60734_'], [])
    var key = block ? BtmNtprForgeRegistries.BLOCKS.getKey(block) : null
    return key ? String(key) : ''
}

function btmNtprIsLeafState(state) {
    var id = btmNtprStateId(state)
    if (!id) return false

    var path = id.indexOf(':') >= 0 ? id.split(':')[1] : id
    return path.indexOf('leaves') >= 0 || path.indexOf('leaf') >= 0
}

function btmNtprIsLooseSurfaceState(state) {
    var id = btmNtprStateId(state)
    if (!id) return false

    var path = id.indexOf(':') >= 0 ? id.split(':')[1] : id
    return path === 'gravel' ||
        path === 'sand' ||
        path === 'red_sand' ||
        path.indexOf('gravel') >= 0 ||
        path.lastIndexOf('_sand') === path.length - '_sand'.length
}

function btmNtprIsSurfacePlantState(state) {
    var id = btmNtprStateId(state)
    if (!id) return false

    var path = id.indexOf(':') >= 0 ? id.split(':')[1] : id
    return path === 'grass' ||
        path === 'short_grass' ||
        path === 'tall_grass' ||
        path === 'fern' ||
        path === 'large_fern' ||
        path === 'dead_bush' ||
        path === 'sugar_cane' ||
        path === 'cactus' ||
        path === 'bamboo' ||
        path === 'bamboo_sapling' ||
        path === 'vine' ||
        path === 'cave_vines' ||
        path === 'cave_vines_plant' ||
        path === 'glow_lichen' ||
        path.indexOf('grass') >= 0 ||
        path.indexOf('fern') >= 0 ||
        path.indexOf('flower') >= 0 ||
        path.indexOf('bush') >= 0 ||
        path.indexOf('shrub') >= 0 ||
        path.indexOf('reed') >= 0 ||
        path.indexOf('vine') >= 0
}

function btmNtprIsHandBreakable(state) {
    if (btmNtprIsSurfacePlantState(state) || btmNtprIsLeafState(state)) return false

    return btmNtprStateIs(state, BtmNtprHandBreakable) ||
        btmNtprIsLooseSurfaceState(state)
}

function btmNtprHasMatchingTool(player, state) {
    if (btmNtprIsCreative(player)) return true

    var stack = btmNtprCall(player, ['getMainHandItem', 'm_21205_'], [])
    if (btmNtprIsSurfacePlantState(state) || btmNtprIsLeafState(state)) {
        return btmNtprStackHasTag(stack, BtmNtprKnives)
    }

    var axeBlock = btmNtprStateIs(state, BtmNtprBlockTags.MINEABLE_WITH_AXE)
    var pickaxeBlock = btmNtprStateIs(state, BtmNtprBlockTags.MINEABLE_WITH_PICKAXE)
    var shovelBlock = btmNtprStateIs(state, BtmNtprBlockTags.MINEABLE_WITH_SHOVEL)
    var hoeBlock = btmNtprStateIs(state, BtmNtprBlockTags.MINEABLE_WITH_HOE)
    var swordBlock = btmNtprStateIs(state, BtmNtprBlockTags.SWORD_EFFICIENT)

    if (axeBlock && btmNtprStackCanPerform(stack, BtmNtprToolActions.AXE_DIG)) return true
    if (pickaxeBlock && btmNtprStackCanPerform(stack, BtmNtprToolActions.PICKAXE_DIG) && btmNtprStackCorrectForDrops(stack, state)) return true
    if (shovelBlock && btmNtprStackCanPerform(stack, BtmNtprToolActions.SHOVEL_DIG)) return true
    if (hoeBlock && btmNtprStackCanPerform(stack, BtmNtprToolActions.HOE_DIG)) return true
    if (swordBlock && btmNtprStackCanPerform(stack, BtmNtprToolActions.SWORD_DIG)) return true

    return false
}

function btmNtprShouldDeny(player, state) {
    if (!player || !state) return false
    if (btmNtprIsHandBreakable(state)) return false
    return !btmNtprHasMatchingTool(player, state)
}

function btmNtprBlockStateAt(level, pos) {
    if (!level || !pos) return null
    return btmNtprCall(level, ['getBlockState', 'm_8055_'], [pos])
}

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerEvent$BreakSpeed', function (event) {
    if (btmNtprShouldDeny(event.getEntity(), event.getState())) {
        event.setNewSpeed(0.0)
        event.setCanceled(true)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerEvent$HarvestCheck', function (event) {
    if (btmNtprShouldDeny(event.getEntity(), event.getTargetBlock())) {
        event.setCanHarvest(false)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerInteractEvent$LeftClickBlock', function (event) {
    var state = btmNtprBlockStateAt(event.getLevel(), event.getPos())
    if (btmNtprShouldDeny(event.getEntity(), state)) {
        event.setUseBlock(BtmNtprEventResult.DENY)
        event.setUseItem(BtmNtprEventResult.DENY)
        event.setCanceled(true)
    }
})

ForgeEvents.onEvent('net.minecraftforge.event.level.BlockEvent$BreakEvent', function (event) {
    if (btmNtprShouldDeny(event.getPlayer(), event.getState())) {
        event.setCanceled(true)
    }
})
