// Dev-only runtime graph dumps for validation and graph tooling.
//
// Enable with kubejs/config/runtime_graph_dumps.json, then restart or /reload.
// This script is intentionally conservative: unknown recipe serializers are kept
// as parsed=false records with raw JSON rather than being dropped.

var BC_RUNTIME_DUMP_CONFIG = 'kubejs/config/runtime_graph_dumps.json'
var BC_RUNTIME_DUMP_DIR = 'generated/runtime-dumps/'
var BC_RUNTIME_FALLBACK_PREFIX = 'kubejs/config/runtime_graph_'

var BcRuntimeBuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var BcRuntimeRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
var BcRuntimeModList = null
try {
    BcRuntimeModList = Java.loadClass('net.minecraftforge.fml.ModList')
} catch (e) {
    BcRuntimeModList = null
}

function bcRuntimeDumpConfig() {
    var fallback = {
        enabled: false,
        outputDir: BC_RUNTIME_DUMP_DIR
    }
    var cfg = JsonIO.read(BC_RUNTIME_DUMP_CONFIG)
    if (!cfg) return fallback
    return {
        enabled: cfg.enabled === true,
        outputDir: String(cfg.outputDir || fallback.outputDir)
    }
}

function bcRuntimeNormalizeOutputDir(outputDir) {
    var dir = String(outputDir || BC_RUNTIME_DUMP_DIR)
    if (!dir.endsWith('/')) dir += '/'
    return dir
}

function bcRuntimeWriteFile(outputDir, fileName, payload) {
    var primaryPath = outputDir + fileName
    try {
        JsonIO.write(primaryPath, payload)
        return primaryPath
    } catch (e) {
        var fallbackPath = BC_RUNTIME_FALLBACK_PREFIX + fileName
        JsonIO.write(fallbackPath, payload)
        console.warn('[BC-RUNTIME-GRAPH] primary write failed for ' + primaryPath + '; wrote fallback ' + fallbackPath + ' (' + e + ')')
        return fallbackPath
    }
}

function bcRuntimeCall(target, methodNames, args) {
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

function bcRuntimeNamespace(id) {
    var split = String(id).split(':')
    return split.length < 2 ? 'UNKNOWN' : split[0]
}

function bcRuntimePushUnique(arr, value) {
    if (value === null || value === undefined) return
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) return
    }
    arr.push(value)
}

function bcRuntimeSortStrings(arr) {
    arr.sort(function (a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })
    return arr
}

function bcRuntimeRegistryId(registry, value) {
    if (value === null || value === undefined) return null
    try {
        var key = registry.getKey(value)
        return key ? String(key) : null
    } catch (e) {
        return null
    }
}

function bcRuntimeClassName(value) {
    if (value === null || value === undefined) return null
    try {
        return String(value.getClass().getName())
    } catch (e) {
        return null
    }
}

function bcRuntimeBoolean(target, methodNames) {
    var value = bcRuntimeCall(target, methodNames, [])
    if (value === null || value === undefined) return null
    return value === true
}

function bcRuntimeNumber(target, methodNames) {
    var value = bcRuntimeCall(target, methodNames, [])
    if (value === null || value === undefined) return null
    var number = Number(value)
    return isNaN(number) ? null : number
}

function bcRuntimeFoodMetadata(item) {
    var edible = bcRuntimeBoolean(item, ['isEdible'])
    if (edible !== true) return null
    var food = bcRuntimeCall(item, ['getFoodProperties'], [])
    if (!food) return { edible: true }
    return {
        edible: true,
        nutrition: bcRuntimeNumber(food, ['getNutrition']),
        saturation_modifier: bcRuntimeNumber(food, ['getSaturationModifier']),
        meat: bcRuntimeBoolean(food, ['isMeat']),
        always_eat: bcRuntimeBoolean(food, ['canAlwaysEat']),
        fast_food: bcRuntimeBoolean(food, ['isFastFood'])
    }
}

function bcRuntimeItemMetadata(item) {
    var blockId = null
    try {
        var block = bcRuntimeCall(item, ['getBlock'], [])
        if (block) blockId = bcRuntimeRegistryId(BcRuntimeBuiltInRegistries.BLOCK, block)
    } catch (e) {
        blockId = null
    }

    var remainingItemId = null
    try {
        if (item.hasCraftingRemainingItem()) {
            remainingItemId = bcRuntimeRegistryId(BcRuntimeBuiltInRegistries.ITEM, item.getCraftingRemainingItem())
        }
    } catch (e) {
        remainingItemId = null
    }

    var maxDamage = bcRuntimeNumber(item, ['getMaxDamage'])
    return {
        java_class: bcRuntimeClassName(item),
        description_id: String(bcRuntimeCall(item, ['getDescriptionId'], []) || 'UNKNOWN'),
        max_stack_size: bcRuntimeNumber(item, ['getMaxStackSize']),
        max_damage: maxDamage,
        damageable: maxDamage === null ? null : maxDamage > 0,
        block_id: blockId,
        crafting_remaining_item_id: remainingItemId,
        food: bcRuntimeFoodMetadata(item)
    }
}

function bcRuntimeBlockMetadata(block) {
    var state = bcRuntimeCall(block, ['defaultBlockState'], [])
    var itemId = null
    try {
        itemId = bcRuntimeRegistryId(BcRuntimeBuiltInRegistries.ITEM, block.asItem())
        if (itemId === 'minecraft:air') itemId = null
    } catch (e) {
        itemId = null
    }
    return {
        java_class: bcRuntimeClassName(block),
        description_id: String(bcRuntimeCall(block, ['getDescriptionId'], []) || 'UNKNOWN'),
        item_id: itemId,
        default_state: {
            air: bcRuntimeBoolean(state, ['isAir']),
            has_block_entity: bcRuntimeBoolean(state, ['hasBlockEntity']),
            replaceable: bcRuntimeBoolean(state, ['canBeReplaced']),
            requires_correct_tool_for_drops: bcRuntimeBoolean(state, ['requiresCorrectToolForDrops']),
            light_emission: bcRuntimeNumber(state, ['getLightEmission'])
        }
    }
}

function bcRuntimeRegistryDump(registry, kind) {
    var out = {}
    var keys = registry.keySet().iterator()
    while (keys.hasNext()) {
        var key = keys.next()
        var id = String(key)
        var entry = registry.get(key)
        var metadata = {}
        if (kind === 'item') metadata = bcRuntimeItemMetadata(entry)
        else if (kind === 'block') metadata = bcRuntimeBlockMetadata(entry)
        metadata.namespace = bcRuntimeNamespace(id)
        out[id] = metadata
    }
    return out
}

function bcRuntimeHolderTags(holder) {
    var tags = []
    try {
        var stream = bcRuntimeCall(holder, ['tags'], [])
        var tagArray = stream ?  bcRuntimeCall(stream, ['toArray'], []) : null
        if (!tagArray) return tags
        for (var i = 0; i < tagArray.length; i++) {
            var tag = tagArray[i]
            var location = bcRuntimeCall(tag, ['location'], [])
            if (location)  bcRuntimePushUnique(tags, String(location))
        }
    } catch (e) {
        // Registry holder tags are best-effort only.
    }
    return bcRuntimeSortStrings(tags)
}

function bcRuntimeCollectRegistryTags(registry) {
    var tagMap = {}
    var keys = registry.keySet().iterator()
    while (keys.hasNext()) {
        var key = keys.next()
        var id = String(key)
        var entry = registry.get(key)
        var holder = bcRuntimeCall(entry, ['builtInRegistryHolder'], [])
        var tags = holder ?  bcRuntimeHolderTags(holder) : []
        for (var i = 0; i < tags.length; i++) {
            var tagId = tags[i]
            if (!tagMap[tagId]) tagMap[tagId] = []
            tagMap[tagId].push(id)
        }
    }
    for (var tagId in tagMap)  bcRuntimeSortStrings(tagMap[tagId])
    return tagMap
}

function bcRuntimeRegistryAccess(event) {
    try {
        if (event.server && event.server.registryAccess) return event.server.registryAccess()
    } catch (e) {
        // Fall back to built-in registry holders below.
    }
    return null
}

function bcRuntimeCollectAccessTags(access, registryKey, fallbackRegistry) {
    if (!access) return bcRuntimeCollectRegistryTags(fallbackRegistry)
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
             bcRuntimeSortStrings(tagMap[tagId])
        }
        return tagMap
    } catch (e) {
        console.warn('[BC-RUNTIME-GRAPH] server registry tag scan failed; falling back to built-in holders (' + e + ')')
        return bcRuntimeCollectRegistryTags(fallbackRegistry)
    }
}

function bcRuntimeTagsPayload(access) {
    return {
        schema: 'bc.tags.v1',
        item_tags: bcRuntimeCollectAccessTags(access, BcRuntimeRegistries.ITEM, BcRuntimeBuiltInRegistries.ITEM),
        block_tags: bcRuntimeCollectAccessTags(access, BcRuntimeRegistries.BLOCK, BcRuntimeBuiltInRegistries.BLOCK),
        fluid_tags: bcRuntimeCollectAccessTags(access, BcRuntimeRegistries.FLUID, BcRuntimeBuiltInRegistries.FLUID),
        entity_tags: bcRuntimeCollectAccessTags(access, BcRuntimeRegistries.ENTITY_TYPE, BcRuntimeBuiltInRegistries.ENTITY_TYPE)
    }
}

function bcRuntimeModDump() {
    var out = {}
    if (!BcRuntimeModList) return out
    try {
        var mods = BcRuntimeModList.get().getMods().iterator()
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

function bcRuntimeEntry(kind, id, count) {
    return {
        kind: kind,
        id: id,
        count: count || 1
    }
}

function bcRuntimeRecipeRecord(recipe) {
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
        inputs: bcRuntimeParseInputs(raw),
        outputs: bcRuntimeParseOutputs(raw),
        catalysts: [],
        fluids_in: bcRuntimeParseFluids(raw, true),
        fluids_out: bcRuntimeParseFluids(raw, false),
        requirements: {
            heat: raw.heatRequirement || raw.heat || null,
            pressure: raw.pressure || null,
            energy: raw.energy || raw.fe || null,
            time: raw.processingTime || raw.time || raw.duration || null
        },
        machines: bcRuntimeMachines(type),
        tags: [],
        parsed: true,
        raw: raw
    }
}

function bcRuntimeParseInputs(raw) {
    var out = []
     bcRuntimeCollectIngredient(raw.ingredient, out)
     bcRuntimeCollectIngredient(raw.ingredients, out)
    if (raw.key) {
        for (var k in raw.key)  bcRuntimeCollectIngredient(raw.key[k], out)
    }
    return out
}

function bcRuntimeCollectIngredient(value, out) {
    if (!value) return
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++)  bcRuntimeCollectIngredient(value[i], out)
        return
    }
    if (value.item) out.push(bcRuntimeEntry('item', String(value.item), Number(value.count || value.Count || 1)))
    else if (value.tag) out.push(bcRuntimeEntry('tag', String(value.tag), Number(value.count || 1)))
    else if (value.ingredient)  bcRuntimeCollectIngredient(value.ingredient, out)
}

function bcRuntimeParseOutputs(raw) {
    var out = []
     bcRuntimeCollectOutput(raw.result, out)
     bcRuntimeCollectOutput(raw.results, out)
     bcRuntimeCollectOutput(raw.output, out)
     bcRuntimeCollectOutput(raw.outputs, out)
    return out
}

function bcRuntimeCollectOutput(value, out) {
    if (!value) return
    if (typeof value === 'string') {
        out.push({ kind: 'item', id: value, count: 1, chance: 1.0 })
        return
    }
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++)  bcRuntimeCollectOutput(value[i], out)
        return
    }
    if (value.item) out.push({ kind: 'item', id: String(value.item), count: Number(value.count || value.Count || 1), chance: Number(value.chance || 1.0) })
    else if (value.id && String(value.id).indexOf(':') !== -1) out.push({ kind: 'item', id: String(value.id), count: Number(value.count || 1), chance: Number(value.chance || 1.0) })
}

function bcRuntimeParseFluids(raw, input) {
    var out = []
    var keys = input ? ['fluidIngredient', 'fluidIngredients', 'fluid_input', 'fluid_inputs'] : ['fluidResult', 'fluidResults', 'fluid_output', 'fluid_outputs']
    for (var i = 0; i < keys.length; i++)  bcRuntimeCollectFluid(raw[keys[i]], out)
    return out
}

function bcRuntimeCollectFluid(value, out) {
    if (!value) return
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++)  bcRuntimeCollectFluid(value[i], out)
        return
    }
    if (value.fluid) out.push({ kind: 'fluid', id: String(value.fluid), amount: Number(value.amount || 1000) })
    else if (value.id && value.amount) out.push({ kind: 'fluid', id: String(value.id), amount: Number(value.amount) })
}

function bcRuntimeMachines(type) {
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
    var cfg = bcRuntimeDumpConfig()
    if (!cfg.enabled) return
    cfg.outputDir = bcRuntimeNormalizeOutputDir(cfg.outputDir)

    var recipes = []
    event.forEachRecipe({}, function (recipe) {
        recipes.push(bcRuntimeRecipeRecord(recipe))
    })

    var recipesPath = bcRuntimeWriteFile(cfg.outputDir, 'recipes.json', {
        schema: 'bc.recipe_graph.v1',
        minecraft: '1.20.1',
        loader: 'forge',
        generated_at: 'runtime_recipe_event',
        recipes: recipes
    })

     bcRuntimeWriteFile(cfg.outputDir, 'registries.json', {
        schema: 'bc.registries.v1',
        items: bcRuntimeRegistryDump(BcRuntimeBuiltInRegistries.ITEM, 'item'),
        blocks: bcRuntimeRegistryDump(BcRuntimeBuiltInRegistries.BLOCK, 'block'),
        fluids: bcRuntimeRegistryDump(BcRuntimeBuiltInRegistries.FLUID, 'fluid'),
        entities: bcRuntimeRegistryDump(BcRuntimeBuiltInRegistries.ENTITY_TYPE, 'entity')
    })

     bcRuntimeWriteFile(cfg.outputDir, 'tags.json', {
        schema: 'bc.tags.v1',
        item_tags: {},
        block_tags: {},
        fluid_tags: {},
        entity_tags: {}
    })

     bcRuntimeWriteFile(cfg.outputDir, 'mods.json', {
        schema: 'bc.mods.v1',
        mods: bcRuntimeModDump()
    })

    console.info('[BC-RUNTIME-GRAPH] wrote ' + recipes.length + ' recipes to ' + recipesPath)
})

ServerEvents.loaded(function (event) {
    var cfg = bcRuntimeDumpConfig()
    if (!cfg.enabled) return
    cfg.outputDir = bcRuntimeNormalizeOutputDir(cfg.outputDir)
    var access = null
    try {
        access = event.server.registryAccess()
    } catch (e) {
        access = null
    }
     bcRuntimeWriteFile(cfg.outputDir, 'tags.json', bcRuntimeTagsPayload(access))
    console.info('[BC-RUNTIME-GRAPH] wrote runtime tags to ' + cfg.outputDir + 'tags.json')
})
