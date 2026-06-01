// Dev-only block hardness registry probe. Enable kubejs/config/block_hardness_probe.json,
// then restart or /reload. Writes actual runtime block destroy-time values.

var BTM_BLOCK_PROBE_CONFIG = 'kubejs/config/block_hardness_probe.json'
var BTM_BLOCK_PROBE_DEFAULT_DIR = 'generated/runtime-dumps/'

var BtmBlockProbeBuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var BtmBlockProbeResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
var BtmBlockProbeBlockTags = Java.loadClass('net.minecraft.tags.BlockTags')
var BtmBlockProbeHandBreakableTag = BtmBlockProbeBlockTags.create(new BtmBlockProbeResourceLocation('kubejs', 'hand_breakable'))

var BTM_BLOCK_PROBE_DEFAULT_BLOCKS = [
    'minecraft:dirt',
    'minecraft:grass_block',
    'minecraft:coarse_dirt',
    'minecraft:rooted_dirt',
    'minecraft:mud',
    'minecraft:sand',
    'minecraft:gravel',
    'minecraft:stone',
    'minecraft:cobblestone',
    'minecraft:deepslate',
    'minecraft:tuff',
    'minecraft:calcite',
    'minecraft:oak_log',
    'minecraft:oak_planks',
    'minecraft:iron_block',
    'minecraft:obsidian',
    'minecraft:bedrock',
    'ae2:sky_stone_block',
    'create:andesite_casing',
    'undergarden:shiverstone',
    'undergarden:depthrock',
    'malum:runewood_log',
    'hexerei:willow_log',
    'hexerei:mahogany_log'
]

var BTM_BLOCK_PROBE_TAGS = [
    { id: 'minecraft:mineable/pickaxe', tag: BtmBlockProbeBlockTags.MINEABLE_WITH_PICKAXE },
    { id: 'minecraft:mineable/axe', tag: BtmBlockProbeBlockTags.MINEABLE_WITH_AXE },
    { id: 'minecraft:mineable/shovel', tag: BtmBlockProbeBlockTags.MINEABLE_WITH_SHOVEL },
    { id: 'minecraft:mineable/hoe', tag: BtmBlockProbeBlockTags.MINEABLE_WITH_HOE },
    { id: 'minecraft:sword_efficient', tag: BtmBlockProbeBlockTags.SWORD_EFFICIENT },
    { id: 'minecraft:needs_stone_tool', tag: BtmBlockProbeBlockTags.NEEDS_STONE_TOOL },
    { id: 'minecraft:needs_iron_tool', tag: BtmBlockProbeBlockTags.NEEDS_IRON_TOOL },
    { id: 'minecraft:needs_diamond_tool', tag: BtmBlockProbeBlockTags.NEEDS_DIAMOND_TOOL },
    { id: 'kubejs:hand_breakable', tag: BtmBlockProbeHandBreakableTag }
]

function btmBlockProbeReadConfig() {
    var fallback = {
        enabled: false,
        outputDir: BTM_BLOCK_PROBE_DEFAULT_DIR,
        writeAllBlocks: false,
        blockIds: BTM_BLOCK_PROBE_DEFAULT_BLOCKS
    }

    var cfg = JsonIO.read(BTM_BLOCK_PROBE_CONFIG)
    if (!cfg) return fallback

    return {
        enabled: cfg.enabled === true,
        outputDir: String(cfg.outputDir || fallback.outputDir),
        writeAllBlocks: cfg.writeAllBlocks === true || cfg.scanAllBlocks === true,
        blockIds: btmBlockProbeArray(cfg.blockIds, fallback.blockIds)
    }
}

function btmBlockProbeArray(value, fallback) {
    if (!value) return fallback
    var out = []
    try {
        for (var i = 0; i < value.length; i++) out.push(String(value[i]))
    } catch (e) {
        return fallback
    }
    return out.length ? out : fallback
}

function btmBlockProbeCall(target, methodNames, args) {
    if (target === null || target === undefined) return null
    for (var i = 0; i < methodNames.length; i++) {
        try {
            if (args && args.length === 1) return target[methodNames[i]](args[0])
            if (args && args.length === 2) return target[methodNames[i]](args[0], args[1])
            if (args && args.length === 3) return target[methodNames[i]](args[0], args[1], args[2])
            if (args && args.length) return target[methodNames[i]].apply(target, args)
            return target[methodNames[i]]()
        } catch (e) {
            // Try the next mapping/overload.
        }
    }
    return null
}

function btmBlockProbeNumber(value) {
    if (value === null || value === undefined) return null
    var n = Number(value)
    if (isNaN(n)) return null
    return n
}

function btmBlockProbeBool(value) {
    return value === true || String(value) === 'true'
}

function btmBlockProbeTagId(tag) {
    var location = btmBlockProbeCall(tag, ['location'], [])
    return location ? String(location) : String(tag)
}

function btmBlockProbeUniquePush(arr, value) {
    if (value === null || value === undefined) return
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) return
    }
    arr.push(value)
}

function btmBlockProbeSortStrings(arr) {
    arr.sort(function (a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })
    return arr
}

function btmBlockProbeBlockById(id) {
    try {
        var key = new BtmBlockProbeResourceLocation(id)
        var block = BtmBlockProbeBuiltInRegistries.BLOCK.get(key)
        var actualKey = BtmBlockProbeBuiltInRegistries.BLOCK.getKey(block)
        if (String(actualKey) !== id) return null
        return block
    } catch (e) {
        return null
    }
}

function btmBlockProbeTags(state) {
    var out = []
    if (!state) return out

    try {
        var stream = btmBlockProbeCall(state, ['getTags', 'm_204343_'], [])
        var iterator = stream ? btmBlockProbeCall(stream, ['iterator'], []) : null
        while (iterator && btmBlockProbeBool(btmBlockProbeCall(iterator, ['hasNext'], []))) {
            var tagId = btmBlockProbeTagId(btmBlockProbeCall(iterator, ['next'], []))
            btmBlockProbeUniquePush(out, tagId)
        }
    } catch (e) {
        // Some unusual states may not expose tag streams cleanly through Rhino.
    }

    return btmBlockProbeSortStrings(out)
}

function btmBlockProbeMiningTags(tags) {
    var out = []
    var wanted = {}
    for (var i = 0; i < BTM_BLOCK_PROBE_TAGS.length; i++) wanted[BTM_BLOCK_PROBE_TAGS[i].id] = true
    for (var j = 0; j < tags.length; j++) {
        if (wanted[tags[j]]) btmBlockProbeUniquePush(out, tags[j])
    }
    return btmBlockProbeSortStrings(out)
}

function btmBlockProbeTagContains(tags, id) {
    for (var i = 0; i < tags.length; i++) {
        if (tags[i] === id) return true
    }
    return false
}

function btmBlockProbePath(id) {
    return id.indexOf(':') >= 0 ? id.split(':')[1] : id
}

function btmBlockProbeIsLeafId(id) {
    var path = btmBlockProbePath(id)
    return path.indexOf('leaves') >= 0 || path.indexOf('leaf') >= 0
}

function btmBlockProbeIsLooseSurfaceId(id) {
    var path = btmBlockProbePath(id)
    return path === 'gravel' ||
        path === 'sand' ||
        path === 'red_sand' ||
        path.indexOf('gravel') >= 0 ||
        path.lastIndexOf('_sand') === path.length - '_sand'.length
}

function btmBlockProbeIsSurfacePlantId(id) {
    var path = btmBlockProbePath(id)
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

function btmBlockProbeNtprClassification(id, tags) {
    var surfacePlant = btmBlockProbeIsSurfacePlantId(id)
    var leaf = btmBlockProbeIsLeafId(id)
    var looseSurface = btmBlockProbeIsLooseSurfaceId(id)
    var handTag = btmBlockProbeTagContains(tags, 'kubejs:hand_breakable')
    var toolCategories = []

    if (btmBlockProbeTagContains(tags, 'minecraft:mineable/axe')) toolCategories.push('axe')
    if (btmBlockProbeTagContains(tags, 'minecraft:mineable/pickaxe')) toolCategories.push('pickaxe')
    if (btmBlockProbeTagContains(tags, 'minecraft:mineable/shovel')) toolCategories.push('shovel')
    if (btmBlockProbeTagContains(tags, 'minecraft:mineable/hoe')) toolCategories.push('hoe')
    if (btmBlockProbeTagContains(tags, 'minecraft:sword_efficient')) toolCategories.push('sword')

    return {
        surfacePlant: surfacePlant,
        leaf: leaf,
        looseSurface: looseSurface,
        handBreakable: !surfacePlant && !leaf && (handTag || looseSurface),
        knifeOnly: surfacePlant || leaf,
        toolCategories: surfacePlant || leaf ? [] : toolCategories,
        denyRiskWithoutMatchingTool: !surfacePlant && !leaf && !handTag && !looseSurface && toolCategories.length === 0
    }
}

function btmBlockProbeRecord(id) {
    var block = btmBlockProbeBlockById(id)
    if (!block) {
        return {
            id: id,
            missing: true
        }
    }

    var state = btmBlockProbeCall(block, ['defaultBlockState', 'm_49966_'], [])
    var destroyTime = btmBlockProbeNumber(btmBlockProbeCall(block, ['defaultDestroyTime', 'm_155943_'], []))
    var stateDestroyTime = btmBlockProbeNumber(btmBlockProbeCall(state, ['getDestroySpeed', 'm_60800_'], [null, null]))
    var explosionResistance = btmBlockProbeNumber(btmBlockProbeCall(block, ['getExplosionResistance', 'm_7334_'], []))
    var runtimeTags = btmBlockProbeTags(state)

    return {
        id: id,
        missing: false,
        defaultDestroyTime: destroyTime,
        defaultStateDestroySpeed: stateDestroyTime,
        explosionResistance: explosionResistance,
        requiresCorrectToolForDrops: btmBlockProbeBool(btmBlockProbeCall(state, ['requiresCorrectToolForDrops', 'm_60815_'], [])),
        runtimeTags: runtimeTags,
        miningTags: btmBlockProbeMiningTags(runtimeTags),
        ntpr: btmBlockProbeNtprClassification(id, runtimeTags)
    }
}

function btmBlockProbeAllBlockIds() {
    var ids = []
    var keys = BtmBlockProbeBuiltInRegistries.BLOCK.keySet().iterator()
    while (keys.hasNext()) ids.push(String(keys.next()))
    return btmBlockProbeSortStrings(ids)
}

function btmBlockProbeSummarize(records) {
    var missing = []
    var distinctDestroyTimes = []
    var destroyTimeCounts = {}

    for (var i = 0; i < records.length; i++) {
        var r = records[i]
        if (r.missing) {
            missing.push(r.id)
            continue
        }

        var key = String(r.defaultDestroyTime)
        destroyTimeCounts[key] = (destroyTimeCounts[key] || 0) + 1
        btmBlockProbeUniquePush(distinctDestroyTimes, key)
    }

    btmBlockProbeSortStrings(missing)
    btmBlockProbeSortStrings(distinctDestroyTimes)

    return {
        totalRecords: records.length,
        missingCount: missing.length,
        missing: missing,
        distinctDefaultDestroyTimes: distinctDestroyTimes,
        defaultDestroyTimeCounts: destroyTimeCounts
    }
}

ServerEvents.recipes(function (event) {
    var cfg = btmBlockProbeReadConfig()
    if (!cfg.enabled) return

    var selected = []
    for (var i = 0; i < cfg.blockIds.length; i++) selected.push(btmBlockProbeRecord(cfg.blockIds[i]))

    var allBlocks = []
    if (cfg.writeAllBlocks) {
        var ids = btmBlockProbeAllBlockIds()
        for (var j = 0; j < ids.length; j++) allBlocks.push(btmBlockProbeRecord(ids[j]))
    }

    var out = {
        schema: 'obelisks.block_hardness_probe.v2',
        generatedBy: 'kubejs/server_scripts/90_dev_debug/40_block_hardness_probe.js',
        generatedAt: 'runtime_recipe_event',
        selectedSummary: btmBlockProbeSummarize(selected),
        selectedBlocks: selected,
        allBlockSummary: cfg.writeAllBlocks ? btmBlockProbeSummarize(allBlocks) : null,
        allBlocks: cfg.writeAllBlocks ? allBlocks : []
    }

    JsonIO.write(cfg.outputDir + 'block_hardness_probe.json', out)
    console.info('[BTM-BLOCK-HARDNESS-PROBE] wrote ' + selected.length + ' selected blocks' + (cfg.writeAllBlocks ? ' and ' + allBlocks.length + ' all-block records' : '') + ' to ' + cfg.outputDir + 'block_hardness_probe.json')
})
