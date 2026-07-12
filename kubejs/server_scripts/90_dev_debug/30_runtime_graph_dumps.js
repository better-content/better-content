// Dev-only runtime graph dumps for validation and graph tooling.
//
// Enable with kubejs/config/runtime_graph_dumps.json, then restart or /reload.
// This script is intentionally conservative: unknown recipe serializers are kept
// as parsed=false records with raw JSON rather than being dropped.

var BTM_RUNTIME_DUMP_CONFIG = 'kubejs/config/runtime_graph_dumps.json'
var BTM_RUNTIME_DUMP_DIR = 'generated/runtime-dumps/'
var BTM_RUNTIME_FALLBACK_PREFIX = 'kubejs/config/runtime_graph_'

var BtmRuntimeBuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var BtmRuntimeRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
var BtmRuntimeModList = null
try {
    BtmRuntimeModList = Java.loadClass('net.minecraftforge.fml.ModList')
} catch (e) {
    BtmRuntimeModList = null
}

function btmRuntimeDumpConfig() {
    var fallback = {
        enabled: false,
        outputDir: BTM_RUNTIME_DUMP_DIR
    }
    var cfg = JsonIO.read(BTM_RUNTIME_DUMP_CONFIG)
    if (!cfg) return fallback
    return {
        enabled: cfg.enabled === true,
        outputDir: String(cfg.outputDir || fallback.outputDir)
    }
}

function btmRuntimeNormalizeOutputDir(outputDir) {
    var dir = String(outputDir || BTM_RUNTIME_DUMP_DIR)
    if (!dir.endsWith('/')) dir += '/'
    return dir
}

function btmRuntimeWriteFile(outputDir, fileName, payload) {
    var primaryPath = outputDir + fileName
    try {
        JsonIO.write(primaryPath, payload)
        return primaryPath
    } catch (e) {
        var fallbackPath = BTM_RUNTIME_FALLBACK_PREFIX + fileName
        JsonIO.write(fallbackPath, payload)
        console.warn('[BTM-RUNTIME-GRAPH] primary write failed for ' + primaryPath + '; wrote fallback ' + fallbackPath + ' (' + e + ')')
        return fallbackPath
    }
}

function btmRuntimeCall(target, methodNames, args) {
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

function btmRuntimeNamespace(id) {
    var split = String(id).split(':')
    return split.length < 2 ? 'UNKNOWN' : split[0]
}

function btmRuntimePushUnique(arr, value) {
    if (value === null || value === undefined) return
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) return
    }
    arr.push(value)
}

function btmRuntimeSortStrings(arr) {
    arr.sort(function (a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })
    return arr
}

function btmRuntimeRegistryDump(registry) {
    var out = {}
    var keys = registry.keySet().iterator()
    while (keys.hasNext()) {
        var key = keys.next()
        var id = String(key)
        out[id] = {
            namespace: btmRuntimeNamespace(id)
        }
    }
    return out
}

function btmRuntimeHolderTags(holder) {
    var tags = []
    try {
        var stream = btmRuntimeCall(holder, ['tags'], [])
        var tagArray = stream ? btmRuntimeCall(stream, ['toArray'], []) : null
        if (!tagArray) return tags
        for (var i = 0; i < tagArray.length; i++) {
            var tag = tagArray[i]
            var location = btmRuntimeCall(tag, ['location'], [])
            if (location) btmRuntimePushUnique(tags, String(location))
        }
    } catch (e) {
        // Registry holder tags are best-effort only.
    }
    return btmRuntimeSortStrings(tags)
}

function btmRuntimeCollectRegistryTags(registry) {
    var tagMap = {}
    var keys = registry.keySet().iterator()
    while (keys.hasNext()) {
        var key = keys.next()
        var id = String(key)
        var entry = registry.get(key)
        var holder = btmRuntimeCall(entry, ['builtInRegistryHolder'], [])
        var tags = holder ? btmRuntimeHolderTags(holder) : []
        for (var i = 0; i < tags.length; i++) {
            var tagId = tags[i]
            if (!tagMap[tagId]) tagMap[tagId] = []
            tagMap[tagId].push(id)
        }
    }
    for (var tagId in tagMap) btmRuntimeSortStrings(tagMap[tagId])
    return tagMap
}

function btmRuntimeRegistryAccess(event) {
    try {
        if (event.server && event.server.registryAccess) return event.server.registryAccess()
    } catch (e) {
        // Fall back to built-in registry holders below.
    }
    return null
}

function btmRuntimeCollectAccessTags(access, registryKey, fallbackRegistry) {
    if (!access) return btmRuntimeCollectRegistryTags(fallbackRegistry)
    try {
        var registry = access.registryOrThrow(registryKey)
        var tagMap = {}
        var tags = registry.getTagNames().iterator()
        while (tags.hasNext()) {
            var tagKey = tags.next()
            var tagId = String(tagKey.location())
            tagMap[tagId] = []
            var optional = registry.getTag(tagKey)
            if (!optional || !optional.isPresent()) continue
            var holders = optional.get().stream().toArray()
            for (var i = 0; i < holders.length; i++) {
                var id = registry.getKey(holders[i].value())
                if (id) tagMap[tagId].push(String(id))
            }
            btmRuntimeSortStrings(tagMap[tagId])
        }
        return tagMap
    } catch (e) {
        console.warn('[BTM-RUNTIME-GRAPH] server registry tag scan failed; falling back to built-in holders (' + e + ')')
        return btmRuntimeCollectRegistryTags(fallbackRegistry)
    }
}

function btmRuntimeTagsPayload(access) {
    return {
        schema: 'obelisks.tags.v1',
        item_tags: btmRuntimeCollectAccessTags(access, BtmRuntimeRegistries.ITEM, BtmRuntimeBuiltInRegistries.ITEM),
        block_tags: btmRuntimeCollectAccessTags(access, BtmRuntimeRegistries.BLOCK, BtmRuntimeBuiltInRegistries.BLOCK),
        fluid_tags: btmRuntimeCollectAccessTags(access, BtmRuntimeRegistries.FLUID, BtmRuntimeBuiltInRegistries.FLUID),
        entity_tags: btmRuntimeCollectAccessTags(access, BtmRuntimeRegistries.ENTITY_TYPE, BtmRuntimeBuiltInRegistries.ENTITY_TYPE)
    }
}

function btmRuntimeModDump() {
    var out = {}
    if (!BtmRuntimeModList) return out
    try {
        var mods = BtmRuntimeModList.get().getMods().iterator()
        while (mods.hasNext()) {
            var mod = mods.next()
            var modId = String(mod.getModId())
            out[modId] = {
                displayName: String(mod.getDisplayName()),
                version: String(mod.getVersion())
            }
        }
    } catch (e) {
        // Mod list is useful but not required for recipe/runtime graph consumers.
    }
    return out
}

function btmRuntimeEntry(kind, id, count) {
    return {
        kind: kind,
        id: id,
        count: count || 1
    }
}

function btmRuntimeRecipeRecord(recipe) {
    var id = String(recipe.getId ? recipe.getId() : recipe.id || 'UNKNOWN')
    var type = String(recipe.getType ? recipe.getType() : recipe.type || 'UNKNOWN')
    var rawText = '{}'
    try {
        rawText = String(recipe.json)
    } catch (err) {
        rawText = '{}'
    }

    var raw = {}
    try {
        raw = JSON.parse(rawText)
    } catch (ignored) {
        raw = { text: rawText }
    }

    return {
        id: id,
        type: type,
        category: type,
        source: {
            kind: 'runtime',
            declared_by: 'kubejs_or_datapack_unknown',
            file: null
        },
        inputs: btmRuntimeParseInputs(raw),
        outputs: btmRuntimeParseOutputs(raw),
        catalysts: [],
        fluids_in: btmRuntimeParseFluids(raw, true),
        fluids_out: btmRuntimeParseFluids(raw, false),
        requirements: {
            heat: raw.heatRequirement || raw.heat || null,
            pressure: raw.pressure || null,
            energy: raw.energy || raw.fe || null,
            time: raw.processingTime || raw.time || raw.duration || null
        },
        machines: btmRuntimeMachines(type),
        tags: [],
        parsed: true,
        raw: raw
    }
}

function btmRuntimeParseInputs(raw) {
    var out = []
    btmRuntimeCollectIngredient(raw.ingredient, out)
    btmRuntimeCollectIngredient(raw.ingredients, out)
    if (raw.key) {
        for (var k in raw.key) btmRuntimeCollectIngredient(raw.key[k], out)
    }
    return out
}

function btmRuntimeCollectIngredient(value, out) {
    if (!value) return
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) btmRuntimeCollectIngredient(value[i], out)
        return
    }
    if (value.item) out.push(btmRuntimeEntry('item', String(value.item), Number(value.count || value.Count || 1)))
    else if (value.tag) out.push(btmRuntimeEntry('tag', String(value.tag), Number(value.count || 1)))
    else if (value.ingredient) btmRuntimeCollectIngredient(value.ingredient, out)
}

function btmRuntimeParseOutputs(raw) {
    var out = []
    btmRuntimeCollectOutput(raw.result, out)
    btmRuntimeCollectOutput(raw.results, out)
    btmRuntimeCollectOutput(raw.output, out)
    btmRuntimeCollectOutput(raw.outputs, out)
    return out
}

function btmRuntimeCollectOutput(value, out) {
    if (!value) return
    if (typeof value === 'string') {
        out.push({ kind: 'item', id: value, count: 1, chance: 1.0 })
        return
    }
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) btmRuntimeCollectOutput(value[i], out)
        return
    }
    if (value.item) out.push({ kind: 'item', id: String(value.item), count: Number(value.count || value.Count || 1), chance: Number(value.chance || 1.0) })
    else if (value.id && String(value.id).indexOf(':') !== -1) out.push({ kind: 'item', id: String(value.id), count: Number(value.count || 1), chance: Number(value.chance || 1.0) })
}

function btmRuntimeParseFluids(raw, input) {
    var out = []
    var keys = input ? ['fluidIngredient', 'fluidIngredients', 'fluid_input', 'fluid_inputs'] : ['fluidResult', 'fluidResults', 'fluid_output', 'fluid_outputs']
    for (var i = 0; i < keys.length; i++) btmRuntimeCollectFluid(raw[keys[i]], out)
    return out
}

function btmRuntimeCollectFluid(value, out) {
    if (!value) return
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) btmRuntimeCollectFluid(value[i], out)
        return
    }
    if (value.fluid) out.push({ kind: 'fluid', id: String(value.fluid), amount: Number(value.amount || 1000) })
    else if (value.id && value.amount) out.push({ kind: 'fluid', id: String(value.id), amount: Number(value.amount) })
}

function btmRuntimeMachines(type) {
    var labels = {
        'create:pressing': 'Mechanical Press',
        'create:mixing': 'Mechanical Mixer',
        'create:crushing': 'Crushing Wheels',
        'minecraft:crafting_shaped': 'Crafting Table',
        'minecraft:crafting_shapeless': 'Crafting Table',
        'minecraft:smelting': 'Furnace'
    }
    return [{ id: type, label: labels[type] || type }]
}

ServerEvents.recipes(function (event) {
    var cfg = btmRuntimeDumpConfig()
    if (!cfg.enabled) return
    cfg.outputDir = btmRuntimeNormalizeOutputDir(cfg.outputDir)

    var recipes = []
    event.forEachRecipe({}, function (recipe) {
        recipes.push(btmRuntimeRecipeRecord(recipe))
    })

    var recipesPath = btmRuntimeWriteFile(cfg.outputDir, 'recipes.json', {
        schema: 'obelisks.recipe_graph.v1',
        minecraft: '1.20.1',
        loader: 'forge',
        generated_at: 'runtime_recipe_event',
        recipes: recipes
    })

    btmRuntimeWriteFile(cfg.outputDir, 'registries.json', {
        schema: 'obelisks.registries.v1',
        items: btmRuntimeRegistryDump(BtmRuntimeBuiltInRegistries.ITEM),
        blocks: btmRuntimeRegistryDump(BtmRuntimeBuiltInRegistries.BLOCK),
        fluids: btmRuntimeRegistryDump(BtmRuntimeBuiltInRegistries.FLUID),
        entities: btmRuntimeRegistryDump(BtmRuntimeBuiltInRegistries.ENTITY_TYPE)
    })

    btmRuntimeWriteFile(cfg.outputDir, 'tags.json', {
        schema: 'obelisks.tags.v1',
        item_tags: {},
        block_tags: {},
        fluid_tags: {},
        entity_tags: {}
    })

    btmRuntimeWriteFile(cfg.outputDir, 'mods.json', {
        schema: 'obelisks.mods.v1',
        mods: btmRuntimeModDump()
    })

    console.info('[BTM-RUNTIME-GRAPH] wrote ' + recipes.length + ' recipes to ' + recipesPath)
})

ServerEvents.loaded(function (event) {
    var cfg = btmRuntimeDumpConfig()
    if (!cfg.enabled) return
    cfg.outputDir = btmRuntimeNormalizeOutputDir(cfg.outputDir)
    var access = null
    try {
        access = event.server.registryAccess()
    } catch (e) {
        access = null
    }
    btmRuntimeWriteFile(cfg.outputDir, 'tags.json', btmRuntimeTagsPayload(access))
    console.info('[BTM-RUNTIME-GRAPH] wrote runtime tags to ' + cfg.outputDir + 'tags.json')
})
