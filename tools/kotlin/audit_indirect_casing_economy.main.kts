#!/usr/bin/env kotlin
@file:DependsOn("org.mozilla:rhino:1.7.15")

import org.mozilla.javascript.BaseFunction
import org.mozilla.javascript.Context
import org.mozilla.javascript.Function
import org.mozilla.javascript.NativeArray
import org.mozilla.javascript.NativeObject
import org.mozilla.javascript.Scriptable
import org.mozilla.javascript.ScriptableObject
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.system.exitProcess

val repo = Paths.get("").toAbsolutePath().normalize()
val scriptRoot = repo.resolve("kubejs/server_scripts")
val dumpDir = repo.resolve("generated/runtime-dumps/kubejs-config")
val outDir = Paths.get(System.getenv("OUT_DIR") ?: repo.resolve("generated/validation").toString())
val outJson = outDir.resolve("indirect_casing_economy_audit.json")

data class RecipeRecord(var seq: Int, var file: String, var type: String, var id: String = "", var outputs: List<String> = emptyList(), var inputs: List<String> = emptyList(), var origin: String = "")
data class RemoveRecord(var seq: Int, var file: String, var id: String = "", var type: String = "", var outputs: List<String> = emptyList())
data class ReplaceRecord(var seq: Int, var file: String, var outputs: List<String> = emptyList(), var oldInputs: List<String> = emptyList(), var newInputs: List<String> = emptyList())

val CRAFTING_TYPES = setOf("minecraft:crafting_shaped", "minecraft:crafting_shapeless", "minecraft:smelting", "minecraft:blasting", "minecraft:smoking", "minecraft:campfire_cooking")
val CASINGS = listOf("kubejs:seared_machine_casing", "kubejs:andesite_machine_casing", "kubejs:brass_machine_casing", "kubejs:airtight_machine_casing", "kubejs:electrical_machine_casing", "kubejs:space_machine_casing", "kubejs:raw_impossible_casing", "kubejs:impossible_machine_casing")
val SUPPORT_INTERMEDIATES = setOf("kubejs:seared_service_fitting", "kubejs:andesite_utility_frame", "kubejs:brass_utility_assembly", "kubejs:airtight_service_module", "kubejs:electrical_instrumentation_module", "kubejs:space_expedition_kit", "kubejs:raw_impossible_storage_matrix", "kubejs:impossible_support_matrix", "kubejs:brass_control_assembly", "kubejs:airtight_fluid_module", "kubejs:electrical_control_module", "kubejs:ae_logic_package")
val DIRECT_CASING_SPECIAL_OUTPUTS = setOf("create:precision_mechanism")
val DIRECT_CASING_ALLOWED_OUTPUT = Regex("""(^|:).*(machine|controller|generator|motor|battery|drive|interface|assembler|crafter|processor|terminal|bus|cell|storage|chamber|refinery|plant|station|platform|laser|drill|deployer|valve|tube|pipe|connector|relay|gauge|computer|monitor|hub|charger|cage|module|card|network|transmitter|receiver|wireless|loader|engine|gearbox|piston|pump|depot|basin|funnel|tunnel|chute|tank|drain|faucet|channel|melter|heater|table|workbench|condenser|plane|port|link|ticker|switch|observer|packager|sealer|liquefier|electrolyzer|controls|recorder|meter|blueprint).*""", RegexOption.IGNORE_CASE)
val CRAFT_SURFACE_TIERS = listOf(
    Triple(Regex("""^create:(pressing|mixing|compacting|crushing|milling|cutting|filling|emptying|splashing|haunting)$"""), "create andesite machine surfaces", "kubejs:andesite_machine_casing"),
    Triple(Regex("""^create:sequenced_assembly$"""), "Create staged assembly line", "kubejs:brass_machine_casing"),
    Triple(Regex("""^create:mechanical_crafting$"""), "Create mechanical crafters", "kubejs:andesite_machine_casing"),
    Triple(Regex("""^pneumaticcraft:(pressure_chamber|thermo_plant|fluid_mixer|assembly_laser|assembly_drill|refinery)$"""), "PNCR pressure/sealed processing", "kubejs:airtight_machine_casing"),
    Triple(Regex("""^tconstruct:(melting|alloying|casting_table|casting_basin|table_casting|basin_casting|table_casting_composite)$"""), "TCon molten/casting work", "kubejs:seared_machine_casing"),
    Triple(Regex("""^bloodmagic:"""), "Blood Magic LP/will processing", "MAGIC:Blood Magic"),
    Triple(Regex("""^ars_nouveau:"""), "Ars purified source processing", "MAGIC:Ars Nouveau")
)
val VALUE_PATTERNS = listOf(
    Regex("""(^|:).*(plate|sheet|ingot|alloy|circuit|processor|transistor|wafer|core|coil|wire|gauge|relay|seal|gear|mechanism|casing|cell|housing|dust|oxide|nitrate|sulfate|chloride|carbonate|hydroxide|acid|sulfide|phosphate|phosphoric|ammonium|polyvinyl|pvc|silicon|sodium|uranium|thorium|titanium|tungsten|platinum|palladium|rhodium|ruthenium|osmium|iridium).*""", RegexOption.IGNORE_CASE),
    Regex("""^chemlib:"""),
    Regex("""^kubejs:.*(grinding_ball|sky_steel|impossible|source|binding)"""),
    Regex("""^powergrid:"""),
    Regex("""^oc2r:"""),
    Regex("""^ae2:.*(processor|cell|housing|interface|pattern|assembler|drive|storage)"""),
    Regex("""^latent_chemlib:""")
)

class JsonParser(private val text: String) {
    private var index = 0
    fun parse(): Any? {
        skip()
        val value = parseValue()
        skip()
        return value
    }
    private fun parseValue(): Any? {
        skip()
        return when (peek()) {
            '{' -> parseObject()
            '[' -> parseArray()
            '"' -> parseString()
            't' -> parseLiteral("true", true)
            'f' -> parseLiteral("false", false)
            'n' -> parseLiteral("null", null)
            else -> parseNumber()
        }
    }
    private fun parseObject(): Map<String, Any?> {
        expect('{')
        skip()
        val map = linkedMapOf<String, Any?>()
        if (peek() == '}') {
            index++
            return map
        }
        while (true) {
            skip()
            val key = parseString()
            skip()
            expect(':')
            map[key] = parseValue()
            skip()
            when (peek()) {
                ',' -> index++
                '}' -> {
                    index++
                    return map
                }
                else -> error("expected ',' or '}' at $index")
            }
        }
    }
    private fun parseArray(): List<Any?> {
        expect('[')
        skip()
        val list = mutableListOf<Any?>()
        if (peek() == ']') {
            index++
            return list
        }
        while (true) {
            list += parseValue()
            skip()
            when (peek()) {
                ',' -> index++
                ']' -> {
                    index++
                    return list
                }
                else -> error("expected ',' or ']' at $index")
            }
        }
    }
    private fun parseString(): String {
        expect('"')
        val out = StringBuilder()
        while (index < text.length) {
            when (val ch = text[index++]) {
                '"' -> return out.toString()
                '\\' -> {
                    val esc = text[index++]
                    out.append(
                        when (esc) {
                            '"', '\\', '/' -> esc
                            'b' -> '\b'
                            'f' -> '\u000c'
                            'n' -> '\n'
                            'r' -> '\r'
                            't' -> '\t'
                            'u' -> text.substring(index, index + 4).also { index += 4 }.toInt(16).toChar()
                            else -> error("bad escape")
                        }
                    )
                }
                else -> out.append(ch)
            }
        }
        error("unterminated string")
    }
    private fun parseNumber(): Number {
        val start = index
        if (peek() == '-') index++
        while (peek()?.isDigit() == true) index++
        if (peek() == '.') {
            index++
            while (peek()?.isDigit() == true) index++
        }
        if (peek() == 'e' || peek() == 'E') {
            index++
            if (peek() == '+' || peek() == '-') index++
            while (peek()?.isDigit() == true) index++
        }
        val raw = text.substring(start, index)
        return raw.toDoubleOrNull() ?: raw.toLong()
    }
    private fun parseLiteral(token: String, value: Any?): Any? {
        require(text.startsWith(token, index))
        index += token.length
        return value
    }
    private fun skip() {
        while (index < text.length && text[index].isWhitespace()) index++
    }
    private fun peek(): Char? = text.getOrNull(index)
    private fun expect(ch: Char) {
        require(peek() == ch)
        index++
    }
}

fun parseJson(text: String): Any? = JsonParser(text).parse()
fun readJson(path: Path): Any? = parseJson(Files.readString(path))
fun jsonObject(value: Any?): Map<String, Any?> = value as? Map<String, Any?> ?: emptyMap()
fun jsonArray(value: Any?): List<Any?> = value as? List<Any?> ?: emptyList()
fun jsonString(value: Any?): String? = value as? String
fun exists(path: Path): Boolean = Files.exists(path)
fun rel(path: Path): String = repo.relativize(path).toString().replace('\\', '/')
fun renderJson(value: Any?, indent: String = ""): String = when (value) {
    null -> "null"
    is String -> "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\""
    is Number, is Boolean -> value.toString()
    is Map<*, *> -> "{\n" + value.entries.joinToString(",\n") { (k, v) -> "$indent  ${renderJson(k.toString())}: ${renderJson(v, "$indent  ")}" } + "\n$indent}"
    is Iterable<*> -> "[\n" + value.joinToString(",\n") { "$indent  ${renderJson(it, "$indent  ")}" } + "\n$indent]"
    else -> renderJson(value.toString(), indent)
}

fun walk(dir: Path): List<Path> {
    if (!exists(dir)) return emptyList()
    return Files.walk(dir).use { stream -> stream.filter { Files.isRegularFile(it) && it.fileName.toString().endsWith(".js") }.toList() }
}
fun normalizeId(id: String?): String {
    if (id == null) return ""
    val match = Regex("""(?:\d+x\s*)?([a-z0-9_.-]+:[a-z0-9_./-]+)""", RegexOption.IGNORE_CASE).find(id.trim())
    return match?.groupValues?.get(1).orEmpty()
}
fun idsFromValue(value: Any?, out: MutableSet<String> = linkedSetOf()): Set<String> {
    when (value) {
        null -> Unit
        is String -> normalizeId(value).takeIf { it.isNotBlank() }?.let(out::add)
        is List<*> -> value.forEach { idsFromValue(it, out) }
        is Map<*, *> -> {
            normalizeId(value["item"] as? String).takeIf { it.isNotBlank() }?.let(out::add)
            normalizeId(value["id"] as? String).takeIf { it.isNotBlank() }?.let(out::add)
            listOf("output", "result", "results", "ingredients", "inputs", "input", "item_input").forEach { key -> idsFromValue(value[key], out) }
        }
    }
    return out
}
fun idsFromRecipeOutput(type: String, recipe: Map<String, Any?>): List<String> {
    val out = linkedSetOf<String>()
    listOf("results", "result", "output", "outputs").forEach { idsFromValue(recipe[it], out) }
    if (type == "pneumaticcraft:thermo_plant") idsFromValue(recipe["item_output"], out)
    return out.toList()
}
fun idsFromRecipeInputs(recipe: Map<String, Any?>): List<String> {
    val out = linkedSetOf<String>()
    listOf("ingredients", "ingredient", "inputs", "input", "item_input", "reagent", "pedestalItems", "key", "cast", "sequence").forEach { idsFromValue(recipe[it], out) }
    return out.toList()
}
fun isValuable(id: String): Boolean = VALUE_PATTERNS.any { it.containsMatchIn(id) }
fun surfaceFor(type: String): Triple<String, String, String>? = CRAFT_SURFACE_TIERS.firstOrNull { it.first.containsMatchIn(type) }?.let { Triple(type, it.second, it.third) }
fun isAestheticComponentOutput(id: String): Boolean = listOf(
    Regex("""(^|:)(brass_funnel|brass_tunnel|smart_chute|display_link|display_board|portable_storage_interface|portable_fluid_interface|stock_link|stock_ticker|engine_piston)$"""),
    Regex("""(^|:)(reinforced_pressure_tube|advanced_pressure_tube)$"""),
    Regex("""(^|:)(portable_battery|relay|relay_dpdt|current_gauge|voltage_gauge|power_gauge|device_connector|heavy_wire_connector)$"""),
    Regex("""(^|:)(block_operations_module|inventory_operations_module|network_interface_card|redstone_interface_card|cpu_tier_2|hard_drive_large|memory_large)$"""),
    Regex("""(^|:)(engine_blueprint|power_pack|exhaust_pack|copper_oxygen_backtank|netherite_oxygen_backtank|advanced_spacesuit_fabric)$""")
).any { it.containsMatchIn(id) }
fun isAllowedDirectCasingOutput(id: String): Boolean = id in CASINGS || id in SUPPORT_INTERMEDIATES || id in DIRECT_CASING_SPECIAL_OUTPUTS || DIRECT_CASING_ALLOWED_OUTPUT.containsMatchIn(id)

fun convertRhino(value: Any?): Any? = when (value) {
    is NativeObject -> value.ids.associate { key ->
        val name = key.toString()
        name to convertRhino(ScriptableObject.getProperty(value, name))
    }
    is NativeArray -> (0 until value.length.toInt()).map { convertRhino(value.get(it, value)) }
    is Scriptable -> value.ids.associate { key ->
        val name = key.toString()
        name to convertRhino(ScriptableObject.getProperty(value, name))
    }
    is Number, is Boolean, is String -> value
    else -> value?.toString()
}

fun runKubeJsSource(): Triple<List<RecipeRecord>, List<RemoveRecord>, List<String>> {
    val records = mutableListOf<RecipeRecord>()
    val removes = mutableListOf<RemoveRecord>()
    val errors = mutableListOf<String>()
    var seq = 0
    fun nextSeq() = ++seq
    val cx = Context.enter()
    cx.optimizationLevel = -1
    try {
        val scope = cx.initStandardObjects()
        fun put(name: String, value: Any?) = ScriptableObject.putProperty(scope, name, Context.javaToJS(value, scope))
        put("console", NativeObject().apply {
            val noop = object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any? = Context.getUndefinedValue()
            }
            arrayOf("log", "info", "warn", "error").forEach { ScriptableObject.putProperty(this, it, noop) }
        })
        put("Item", NativeObject().apply {
            ScriptableObject.putProperty(this, "exists", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any = true
            })
            ScriptableObject.putProperty(this, "of", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any {
                    val obj = NativeObject()
                    ScriptableObject.putProperty(obj, "item", normalizeId(args?.getOrNull(0)?.toString()))
                    ScriptableObject.putProperty(obj, "count", (args?.getOrNull(1) as? Number)?.toInt() ?: 1)
                    ScriptableObject.putProperty(obj, "isEmpty", object : BaseFunction() {
                        override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any = false
                    })
                    return obj
                }
            })
        })
        put("Fluid", NativeObject().apply {
            ScriptableObject.putProperty(this, "of", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any {
                    val obj = NativeObject()
                    ScriptableObject.putProperty(obj, "fluid", normalizeId(args?.getOrNull(0)?.toString()))
                    ScriptableObject.putProperty(obj, "amount", (args?.getOrNull(1) as? Number)?.toInt() ?: 0)
                    return obj
                }
            })
        })
        put("Ingredient", NativeObject().apply {
            ScriptableObject.putProperty(this, "of", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any {
                    val obj = NativeObject()
                    ScriptableObject.putProperty(obj, "value", args?.getOrNull(0))
                    return obj
                }
            })
        })
        put("Platform", NativeObject().apply {
            ScriptableObject.putProperty(this, "isLoaded", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any = true
            })
        })
        put("MoreJSEvents", Context.getUndefinedValue())
        put("LootJS", NativeObject().apply { ScriptableObject.putProperty(this, "modifiers", object : BaseFunction() {}) })
        put("PlayerEvents", NativeObject().apply { ScriptableObject.putProperty(this, "respawned", object : BaseFunction() {}) })
        put("JsonIO", NativeObject().apply {
            ScriptableObject.putProperty(this, "read", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any? {
                    val file = repo.resolve(args?.getOrNull(0)?.toString().orEmpty())
                    return if (exists(file)) Context.javaToJS(readJson(file), scope) else NativeObject()
                }
            })
            ScriptableObject.putProperty(this, "write", object : BaseFunction() {})
        })
        put("Java", NativeObject().apply {
            ScriptableObject.putProperty(this, "loadClass", object : BaseFunction() {
                override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any = NativeObject()
            })
        })
        ScriptableObject.putProperty(scope, "global", scope)

        fun addRecipe(type: String, outputs: List<String>, inputs: List<String>, currentFile: String): NativeObject {
            val record = RecipeRecord(nextSeq(), currentFile, type, outputs = outputs.distinct().filter(String::isNotBlank), inputs = inputs.distinct().filter(String::isNotBlank))
            records += record
            return NativeObject().apply {
                val chain = object : BaseFunction() {
                    override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any = thisObj ?: Context.getUndefinedValue()
                }
                for (method in listOf("xp", "cookingTime", "upgradeLevel", "altarSyphon", "consumptionRate", "drainRate", "syphon", "ticks", "drain", "minimumDrain", "consumeIngredient", "texture", "heated", "superheated", "processingTime", "keepHeldItem", "loops", "transitionalItem")) {
                    ScriptableObject.putProperty(this, method, chain)
                }
                ScriptableObject.putProperty(this, "id", object : BaseFunction() {
                    override fun call(cx: Context?, scope: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any {
                        record.id = args?.getOrNull(0)?.toString().orEmpty()
                        return thisObj ?: Context.getUndefinedValue()
                    }
                })
            }
        }

        var currentFile = ""
        val serverEvents = NativeObject()
        ScriptableObject.putProperty(serverEvents, "recipes", object : BaseFunction() {
            override fun call(cx: Context?, scopeArg: Scriptable?, thisObj: Scriptable?, args: Array<out Any?>?): Any? {
                val callback = args?.getOrNull(0) as? Function ?: return Context.getUndefinedValue()
                val event = NativeObject()
                fun makeAdd(type: String, outputIndex: Int = 0): BaseFunction = object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any {
                        val output = argsInner?.getOrNull(outputIndex)
                        val inputs = argsInner?.drop(outputIndex + 1).orEmpty()
                        return addRecipe(type, idsFromValue(convertRhino(output)).toList(), idsFromValue(inputs.map(::convertRhino)).toList(), currentFile)
                    }
                }
                ScriptableObject.putProperty(event, "custom", object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any {
                        val recipe = jsonObject(convertRhino(argsInner?.getOrNull(0)))
                        val type = jsonString(recipe["type"]) ?: "custom:unknown"
                        return addRecipe(type, idsFromRecipeOutput(type, recipe), idsFromRecipeInputs(recipe), currentFile)
                    }
                })
                ScriptableObject.putProperty(event, "shaped", object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any =
                        addRecipe("minecraft:crafting_shaped", idsFromValue(convertRhino(argsInner?.getOrNull(0))).toList(), idsFromValue(convertRhino(argsInner?.getOrNull(2))).toList(), currentFile)
                })
                ScriptableObject.putProperty(event, "shapeless", object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any =
                        addRecipe("minecraft:crafting_shapeless", idsFromValue(convertRhino(argsInner?.getOrNull(0))).toList(), idsFromValue(convertRhino(argsInner?.getOrNull(1))).toList(), currentFile)
                })
                ScriptableObject.putProperty(event, "smelting", makeAdd("minecraft:smelting"))
                ScriptableObject.putProperty(event, "blasting", makeAdd("minecraft:blasting"))
                ScriptableObject.putProperty(event, "remove", object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any {
                        val filter = jsonObject(convertRhino(argsInner?.getOrNull(0)))
                        removes += RemoveRecord(nextSeq(), currentFile, jsonString(filter["id"]).orEmpty(), jsonString(filter["type"]).orEmpty(), idsFromValue(filter["output"]).toList())
                        return Context.getUndefinedValue()
                    }
                })
                ScriptableObject.putProperty(event, "forEachRecipe", object : BaseFunction() {})
                ScriptableObject.putProperty(event, "replaceInput", object : BaseFunction() {
                    override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any {
                        ReplaceRecord(nextSeq(), currentFile, idsFromValue(convertRhino(argsInner?.getOrNull(0))).toList(), idsFromValue(convertRhino(argsInner?.getOrNull(1))).toList(), idsFromValue(convertRhino(argsInner?.getOrNull(2))).toList())
                        return Context.getUndefinedValue()
                    }
                })
                ScriptableObject.putProperty(event, "replaceOutput", object : BaseFunction() {})
                val recipes = NativeObject()
                fun proxyNamespace(namespace: String): NativeObject = NativeObject().apply {
                    ScriptableObject.putProperty(this, "__noSuchMethod__", object : BaseFunction() {
                        override fun call(cx: Context?, scopeInner: Scriptable?, thisObjInner: Scriptable?, argsInner: Array<out Any?>?): Any {
                            val method = argsInner?.getOrNull(0)?.toString().orEmpty()
                            val methodArgs = (argsInner?.getOrNull(1) as? NativeArray)?.let { arr: NativeArray ->
                                (0 until arr.length.toInt()).map { index -> arr.get(index, arr) }
                            }.orEmpty()
                            val output = methodArgs.getOrNull(0)
                            val inputs = methodArgs.drop(1)
                            return addRecipe("$namespace:$method", idsFromValue(convertRhino(output)).toList(), idsFromValue(inputs.map(::convertRhino)).toList(), currentFile)
                        }
                    })
                }
                ScriptableObject.putProperty(recipes, "bloodmagic", proxyNamespace("bloodmagic"))
                ScriptableObject.putProperty(recipes, "ars_nouveau", proxyNamespace("ars_nouveau"))
                ScriptableObject.putProperty(recipes, "create", proxyNamespace("create"))
                ScriptableObject.putProperty(event, "recipes", recipes)
                callback.call(cx, scopeArg, scopeArg, arrayOf(event))
                return Context.getUndefinedValue()
            }
        })
        ScriptableObject.putProperty(serverEvents, "tags", object : BaseFunction() {})
        put("ServerEvents", serverEvents)

        val files = walk(scriptRoot).filterNot {
            val relative = rel(it)
            relative.contains("/90_dev_debug/") || relative.contains("/50_loot/") || relative.contains("/70_spawn/")
        }.sortedBy(::rel)

        for (file in files) {
            currentFile = rel(file)
            try {
                cx.evaluateString(scope, Files.readString(file), file.toString(), 1, null)
            } catch (error: Exception) {
                errors += "$currentFile: ${error.message}"
            }
        }
    } finally {
        Context.exit()
    }
    return Triple(records, removes, errors)
}

fun loadDumpRecipes(): List<RecipeRecord> {
    if (!exists(dumpDir)) return emptyList()
    return Files.list(dumpDir).use { stream ->
        stream.filter { Files.isRegularFile(it) && Regex("""full_recipe_index_\d+\.json""").matches(it.fileName.toString()) }
            .sorted()
            .flatMap { file ->
                val chunk = jsonObject(readJson(file))
                jsonArray(chunk["recipes"]).map { recipeAny ->
                    val recipe = (recipeAny as? Map<*, *>)?.mapKeys { entry -> entry.key.toString() } ?: emptyMap()
                    val parsed = runCatching { jsonObject(parseJson(jsonString(recipe["json"]).orEmpty())) }.getOrDefault(emptyMap())
                    RecipeRecord(0, "generated/runtime-dumps/kubejs-config", jsonString(recipe["type"]).orEmpty(), jsonString(recipe["id"]).orEmpty(), idsFromRecipeOutput(jsonString(recipe["type"]).orEmpty(), parsed), idsFromRecipeInputs(parsed), "runtime-dump")
                }.stream()
            }.toList()
    }
}

fun wasRemoved(recipe: RecipeRecord, removes: List<RemoveRecord>): Boolean = removes.any { remove ->
    if (recipe.origin == "kubejs-source" && remove.seq < recipe.seq) return@any false
    if (remove.id.isNotBlank() && remove.id == recipe.id) return@any true
    if (remove.type.isNotBlank() && remove.type != recipe.type) return@any false
    recipe.outputs.any(remove.outputs::contains)
}

val (records, removes, errors) = runKubeJsSource()
records.forEach { it.origin = "kubejs-source" }
val dumpRecipes = loadDumpRecipes()
val dumpMachineRecords = dumpRecipes.filterNot { wasRemoved(it, removes) }
val activeAuthoredRecords = records.filterNot { wasRemoved(it, removes) }
val recipeRecords = activeAuthoredRecords + dumpMachineRecords
val casedSurfaceRecipes = recipeRecords.mapNotNull { recipe ->
    surfaceFor(recipe.type)?.let { Triple(recipe, it.second, it.third) }
}.filter { it.first.outputs.isNotEmpty() }

val indirect = mutableListOf<Map<String, Any?>>()
val direct = mutableListOf<Map<String, Any?>>()
for ((recipe, surface, gate) in casedSurfaceRecipes) {
    val hasDirectCasingInput = recipe.inputs.any(CASINGS::contains)
    val target = if (hasDirectCasingInput) direct else indirect
    for (output in recipe.outputs) {
        if (output in recipe.inputs) continue
        if (output.startsWith("minecraft:") && !isValuable(output)) continue
        if (!isValuable(output) && !output.startsWith("kubejs:")) continue
        target += linkedMapOf("output" to output, "type" to recipe.type, "id" to recipe.id, "file" to recipe.file, "origin" to recipe.origin, "surface" to surface, "gate" to gate, "inputs" to recipe.inputs)
    }
}

val indirectByOutput = indirect.groupBy { jsonString(it["output"]).orEmpty() }
val bypasses = indirectByOutput.mapNotNull { (output, producers) ->
    val simpleDumpProducers = dumpRecipes.filter { output in it.outputs && it.type in CRAFTING_TYPES && !wasRemoved(it, removes) }.map { linkedMapOf("id" to it.id, "type" to it.type, "inputs" to it.inputs) }
    val authoredSimpleProducers = records.filter { output in it.outputs && it.type in CRAFTING_TYPES && !wasRemoved(it, removes) }.map { linkedMapOf("id" to it.id, "type" to it.type, "file" to it.file, "inputs" to it.inputs) }
    if (simpleDumpProducers.isEmpty() && authoredSimpleProducers.isEmpty()) null else linkedMapOf("output" to output, "casedProducers" to producers, "simpleDumpProducers" to simpleDumpProducers, "authoredSimpleProducers" to authoredSimpleProducers)
}

fun classifySimpleBypass(bypass: Map<String, Any?>): Map<String, Any?> {
    val output = jsonString(bypass["output"]).orEmpty()
    val reason = when {
        Regex("""(^minecraft:.*_ingot$|_ingot$|_nugget$|_metal_block$|_block$)""").containsMatchIn(output) -> "raw metal form"
        output.endsWith("pressure_plate") -> "decorative pressure plate"
        output == "quark:rusty_iron_plate" -> "decorative weathered plate"
        output == "powergrid:generator_commutator" && (jsonArray(bypass["simpleDumpProducers"]) + jsonArray(bypass["authoredSimpleProducers"])).any {
            jsonArray(jsonObject(it)["inputs"]).mapNotNull(::jsonString).contains("powergrid:generator_vertical_commutator")
        } -> "reversible orientation conversion"
        else -> "component-like simple recipe"
    }
    return LinkedHashMap<String, Any?>(bypass).apply {
        put("benign", reason != "component-like simple recipe")
        put("reason", reason)
    }
}

val classifiedBypasses = bypasses.map(::classifySimpleBypass)
val benignBypasses = classifiedBypasses.filter { it["benign"] == true }
fun isActionableBypass(bypass: Map<String, Any?>): Boolean {
    val output = jsonString(bypass["output"]).orEmpty()
    if (bypass["benign"] == true) return false
    return Regex("""(plate|sheet|circuit|processor|transistor|wafer|core|coil|relay|mechanism|seal|housing|cell|gear|gauge|wire|casing|catalyst|binding|acid|chloride|nitrate|sulfate|phosphate|polyvinyl|silicon_dioxide|sky_steel)""").containsMatchIn(output)
}
val actionableBypasses = classifiedBypasses.filter(::isActionableBypass)
val bypassReasonCounts = classifiedBypasses.groupingBy { jsonString(it["reason"]).orEmpty() }.eachCount().toSortedMap()

val directCasingConsumers = activeAuthoredRecords.filter { it.inputs.any(CASINGS::contains) }.flatMap { recipe ->
    recipe.outputs.filterNot(CASINGS::contains).map { output ->
        linkedMapOf("output" to output, "type" to recipe.type, "id" to recipe.id, "file" to recipe.file, "casingInputs" to recipe.inputs.filter(CASINGS::contains))
    }
}
val aestheticDirectCasingConsumers = directCasingConsumers.filter { isAestheticComponentOutput(jsonString(it["output"]).orEmpty()) }.sortedBy { jsonString(it["output"]).orEmpty() }
val invalidDirectCasingConsumers = directCasingConsumers.filterNot { isAllowedDirectCasingOutput(jsonString(it["output"]).orEmpty()) }.sortedBy { jsonString(it["output"]).orEmpty() }
val supportIntermediateRecipes = activeAuthoredRecords.filter { it.outputs.any(SUPPORT_INTERMEDIATES::contains) }.mapNotNull { recipe ->
    val output = recipe.outputs.firstOrNull(SUPPORT_INTERMEDIATES::contains) ?: return@mapNotNull null
    linkedMapOf("output" to output, "type" to recipe.type, "id" to recipe.id, "file" to recipe.file, "casingInputs" to recipe.inputs.filter(CASINGS::contains))
}
val supportIntermediateOutputs = supportIntermediateRecipes.mapNotNull { jsonString(it["output"]) }.toSet()
val missingSupportIntermediateRecipes = SUPPORT_INTERMEDIATES.filterNot { it in setOf("kubejs:brass_control_assembly", "kubejs:airtight_fluid_module", "kubejs:electrical_control_module", "kubejs:ae_logic_package") }.filterNot(supportIntermediateOutputs::contains).sorted()
val supportIntermediatesRequiringCasing = SUPPORT_INTERMEDIATES.filterNot { it in setOf("kubejs:brass_control_assembly", "kubejs:airtight_fluid_module", "kubejs:electrical_control_module") }
val supportIntermediatesMissingCasingInput = supportIntermediatesRequiringCasing.filterNot { output -> supportIntermediateRecipes.any { jsonString(it["output"]) == output && jsonArray(it["casingInputs"]).isNotEmpty() } }.sorted()
val byGate = indirect.groupBy { jsonString(it["gate"]).orEmpty() }.mapValues { sortSet -> sortSet.value.mapNotNull { jsonString(it["output"]) }.toSet().sorted() }

val report = linkedMapOf<String, Any?>(
    "generatedAt" to java.time.Instant.now().toString(),
    "note" to "Hybrid audit. KubeJS source is used for authored recipes/removes; runtime recipe dumps are used for base mod machine-surface outputs and simple recipe bypass candidates. Current dumps still lack KubeJS recipes.",
    "sourceRecipeCount" to records.size,
    "dumpRecipeCount" to dumpRecipes.size,
    "dumpMachineSurfaceRecipeCount" to dumpMachineRecords.count { surfaceFor(it.type) != null },
    "casedSurfaceRecipeCount" to casedSurfaceRecipes.size,
    "indirectOutputCount" to indirectByOutput.size,
    "directCasingOutputCount" to direct.mapNotNull { jsonString(it["output"]) }.toSet().size,
    "directCasingConsumerCount" to directCasingConsumers.mapNotNull { jsonString(it["output"]) }.toSet().size,
    "aestheticDirectCasingConsumerCount" to aestheticDirectCasingConsumers.mapNotNull { jsonString(it["output"]) }.toSet().size,
    "directCasingConsumers" to directCasingConsumers,
    "aestheticDirectCasingConsumers" to aestheticDirectCasingConsumers,
    "invalidDirectCasingConsumers" to invalidDirectCasingConsumers,
    "supportIntermediateRecipes" to supportIntermediateRecipes,
    "missingSupportIntermediateRecipes" to missingSupportIntermediateRecipes,
    "supportIntermediatesMissingCasingInput" to supportIntermediatesMissingCasingInput,
    "byGate" to byGate,
    "bypasses" to bypasses,
    "classifiedBypasses" to classifiedBypasses,
    "benignBypasses" to benignBypasses,
    "bypassReasonCounts" to bypassReasonCounts,
    "actionableBypasses" to actionableBypasses,
    "errors" to errors
)

Files.createDirectories(outDir)
Files.writeString(outJson, renderJson(report) + "\n")
println("source recipes: ${records.size}")
println("cased-surface recipes: ${casedSurfaceRecipes.size}")
println("indirect valuable outputs: ${indirectByOutput.size}")
println("direct casing-input outputs: ${direct.mapNotNull { jsonString(it["output"]) }.toSet().size}")
println("active direct casing consumers: ${directCasingConsumers.mapNotNull { jsonString(it["output"]) }.toSet().size}")
println("aesthetic direct casing consumers: ${aestheticDirectCasingConsumers.mapNotNull { jsonString(it["output"]) }.toSet().size}")
println("invalid direct casing consumers: ${invalidDirectCasingConsumers.mapNotNull { jsonString(it["output"]) }.toSet().size}")
println("support intermediary recipes: ${supportIntermediateRecipes.size}")
println("potential simple bypasses: ${bypasses.size}")
println("benign classified bypasses: ${benignBypasses.size}")
println("actionable component bypasses: ${actionableBypasses.size}")
for ((reason, count) in bypassReasonCounts) println("  $reason: $count")
println("source eval warnings: ${errors.size}")
println("wrote ${rel(outJson)}")
if (actionableBypasses.isNotEmpty()) actionableBypasses.take(20).forEach { println("ACTIONABLE? ${it["output"]}") }
if ("--check" in args) {
    var failed = false
    if (invalidDirectCasingConsumers.isNotEmpty()) {
        failed = true
        System.err.println("invalid direct casing consumers:")
        invalidDirectCasingConsumers.take(80).forEach { System.err.println("  ${it["output"]} (${it["type"]}) ${it["file"]}") }
    }
    if (missingSupportIntermediateRecipes.isNotEmpty()) {
        failed = true
        System.err.println("missing support intermediary recipes:")
        missingSupportIntermediateRecipes.forEach { System.err.println("  $it") }
    }
    if (supportIntermediatesMissingCasingInput.isNotEmpty()) {
        failed = true
        System.err.println("support intermediary recipes missing casing input:")
        supportIntermediatesMissingCasingInput.forEach { System.err.println("  $it") }
    }
    if (failed) exitProcess(1)
}
