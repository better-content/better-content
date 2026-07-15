#!/usr/bin/env kotlin

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.time.Instant
import kotlin.io.path.exists
import kotlin.system.exitProcess

val root: Path = Paths.get("").toAbsolutePath().normalize()
val manifestPath = root.resolve("tools/dynamic_trees_coverage_manifest.json")
val registriesPath = root.resolve("generated/runtime-dumps/registries.json")
val tagsPath = root.resolve("generated/runtime-dumps/tags.json")
val reportDir = root.resolve("generated/validation")
val jsonReportPath = reportDir.resolve("dynamic_trees_coverage.json")
val mdReportPath = reportDir.resolve("dynamic_trees_coverage.md")
val failures = mutableListOf<String>()
val warnings = mutableListOf<String>()

class JsonParser(private val text: String) {
    private var index = 0
    fun parse(): Any? {
        skipWhitespace()
        val value = parseValue()
        skipWhitespace()
        return value
    }
    private fun parseValue(): Any? {
        skipWhitespace()
        return when (val ch = text.getOrNull(index)) {
            '{' -> parseObject()
            '[' -> parseArray()
            '"' -> parseString()
            't' -> parseLiteral("true", true)
            'f' -> parseLiteral("false", false)
            'n' -> parseLiteral("null", null)
            '-', in '0'..'9' -> parseNumber()
            else -> error("unexpected JSON character at $index: $ch")
        }
    }
    private fun parseObject(): Map<String, Any?> {
        val result = linkedMapOf<String, Any?>()
        expect('{')
        skipWhitespace()
        if (peek('}')) {
            index += 1
            return result
        }
        while (true) {
            skipWhitespace()
            val key = parseString()
            skipWhitespace()
            expect(':')
            result[key] = parseValue()
            skipWhitespace()
            when {
                peek('}') -> {
                    index += 1
                    return result
                }
                peek(',') -> index += 1
                else -> error("expected ',' or '}' at $index")
            }
        }
    }
    private fun parseArray(): List<Any?> {
        val result = mutableListOf<Any?>()
        expect('[')
        skipWhitespace()
        if (peek(']')) {
            index += 1
            return result
        }
        while (true) {
            result += parseValue()
            skipWhitespace()
            when {
                peek(']') -> {
                    index += 1
                    return result
                }
                peek(',') -> index += 1
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
                            'u' -> {
                                val hex = text.substring(index, index + 4)
                                index += 4
                                hex.toInt(16).toChar()
                            }
                            else -> error("bad escape: $esc")
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
        if (peek('-')) index += 1
        while (text.getOrNull(index)?.isDigit() == true) index += 1
        if (peek('.')) {
            index += 1
            while (text.getOrNull(index)?.isDigit() == true) index += 1
        }
        if (peek('e') || peek('E')) {
            index += 1
            if (peek('+') || peek('-')) index += 1
            while (text.getOrNull(index)?.isDigit() == true) index += 1
        }
        val raw = text.substring(start, index)
        return if (raw.contains('.') || raw.contains('e', ignoreCase = true)) raw.toDouble() else raw.toLong()
    }
    private fun parseLiteral(token: String, value: Any?): Any? {
        require(text.startsWith(token, index))
        index += token.length
        return value
    }
    private fun skipWhitespace() {
        while (text.getOrNull(index)?.isWhitespace() == true) index += 1
    }
    private fun expect(ch: Char) {
        require(text.getOrNull(index) == ch) { "expected '$ch' at $index" }
        index += 1
    }
    private fun peek(ch: Char): Boolean = text.getOrNull(index) == ch
}

fun parseJson(text: String): Any? = JsonParser(text).parse()
fun readJson(path: Path): Map<String, Any?> = parseJson(Files.readString(path)) as? Map<String, Any?> ?: emptyMap()
fun obj(value: Any?): Map<String, Any?> = value as? Map<String, Any?> ?: emptyMap()
fun arr(value: Any?): List<Any?> = value as? List<Any?> ?: emptyList()
fun str(value: Any?): String? = value as? String
fun rel(path: Path): String = root.relativize(path).toString().replace('\\', '/')
fun fail(message: String) { failures += message }
fun warn(message: String) { warnings += message }

fun walkFiles(dir: Path, predicate: (Path) -> Boolean): List<Path> {
    if (!dir.exists()) return emptyList()
    return Files.walk(dir).use { stream ->
        stream.filter { Files.isRegularFile(it) && predicate(it) }.toList().sorted()
    }
}

fun jsonEscape(value: String): String = buildString {
    for (ch in value) {
        when (ch) {
            '\\' -> append("\\\\")
            '"' -> append("\\\"")
            '\n' -> append("\\n")
            '\r' -> append("\\r")
            '\t' -> append("\\t")
            else -> append(ch)
        }
    }
}

fun toJson(value: Any?): String = when (value) {
    null -> "null"
    is String -> "\"${jsonEscape(value)}\""
    is Number, is Boolean -> value.toString()
    is Map<*, *> -> value.entries.joinToString(prefix = "{", postfix = "}") { (k, v) -> "${toJson(k.toString())}:${toJson(v)}" }
    is Iterable<*> -> value.joinToString(prefix = "[", postfix = "]") { toJson(it) }
    else -> toJson(value.toString())
}

fun collectSpeciesRefs(value: Any?, out: MutableSet<String> = mutableSetOf()): Set<String> {
    when (value) {
        is Map<*, *> -> {
            for ((key, child) in value) {
                if (key == "species" && child is String && ':' in child) out += child
                if (key == "random" && child is Map<*, *>) {
                    child.keys.filterIsInstance<String>().filter { ':' in it && it != "..." }.forEach { out += it }
                }
                collectSpeciesRefs(child, out)
            }
        }
        is List<*> -> value.forEach { collectSpeciesRefs(it, out) }
    }
    return out
}

fun idNamespace(id: String): String = id.substringBefore(':', "")
fun idPath(id: String): String = id.substringAfter(':', id)
fun stripTreeSuffix(name: String): String =
    name.removeSuffix("_sapling").removeSuffix("_leaves").removeSuffix("_branch")

fun treeRoots(): List<Path> {
    val roots = mutableListOf<Path>()
    roots += walkFiles(root.resolve("datapacks"), { it.fileName.toString() == "species" }).map { it.parent }
    if (root.resolve("datapacks").exists()) {
        Files.walk(root.resolve("datapacks")).use { stream ->
            stream.filter { Files.isDirectory(it) && it.parent?.fileName?.toString() == "trees" }.forEach { roots.add(it) }
        }
    }
    val customRoot = root.resolve("generated/custom-mod-sources")
    if (customRoot.exists()) {
        Files.list(customRoot).use { stream ->
            stream.filter { Files.isDirectory(it) && it.fileName.toString().startsWith("dynamic-trees-") }
                .map { it.resolve("src/main/resources/trees") }
                .filter { it.exists() }
                .forEach { treesDir ->
                    Files.list(treesDir).use { namespaces ->
                        namespaces.filter { Files.isDirectory(it) }.forEach { roots.add(it) }
                    }
                }
        }
    }
    return roots.distinct().sorted()
}

if (!manifestPath.exists()) fail("missing ${rel(manifestPath)}")
if (!registriesPath.exists()) fail("missing retained runtime dump: ${rel(registriesPath)}")
if (!tagsPath.exists()) fail("missing retained runtime dump: ${rel(tagsPath)}")

val manifest = if (manifestPath.exists()) readJson(manifestPath) else emptyMap()
val nativeSourceNamespaces = arr(manifest["native_dt_source_namespaces"]).mapNotNull(::str).toSet()
val customSourceNamespaces = obj(manifest["custom_dt_source_namespaces"]).mapValues { (_, value) -> str(value) ?: "" }.filterValues { it.isNotBlank() }
val intentionallyStaticNamespaces = arr(manifest["intentionally_static_namespaces"]).mapNotNull(::str).toSet()
val knownExternalSpecies = arr(manifest["known_external_species"]).mapNotNull(::str).toSet()
val defaultClassification = str(manifest["default_unlisted_classification"]) ?: "static_intentional_pending_review"

val registries = if (registriesPath.exists()) readJson(registriesPath) else emptyMap()
val blocks = obj(registries["blocks"]).keys.map { it.toString() }.toSet()
val items = obj(registries["items"]).keys.map { it.toString() }.toSet()
val tags = if (tagsPath.exists()) readJson(tagsPath) else emptyMap()
val blockTags = obj(tags["block_tags"]).mapValues { (_, value) -> arr(value).mapNotNull(::str).toSet() }
val dtSaplings = blockTags["dynamictrees:saplings"] ?: emptySet()
val dtLeaves = blockTags["dynamictrees:leaves"] ?: emptySet()

data class SpeciesResource(val id: String, val path: Path, val family: String?, val leaves: String?, val primitiveSapling: String?)
data class FamilyResource(val id: String, val path: Path, val primitiveLog: String?, val primitiveStrippedLog: String?)
data class LeavesResource(val id: String, val path: Path, val primitiveLeaves: String?)
data class TreeFamilyInventory(val tag: String, val namespace: String, val classification: String, val values: List<String>)

val roots = treeRoots()
val speciesResources = mutableMapOf<String, SpeciesResource>()
val familyResources = mutableMapOf<String, FamilyResource>()
val leavesResources = mutableMapOf<String, LeavesResource>()
val worldgenSpeciesRefs = linkedMapOf<String, MutableSet<String>>()

for (treeRoot in roots) {
    val namespace = treeRoot.fileName.toString()
    for (path in walkFiles(treeRoot.resolve("species")) { it.fileName.toString().endsWith(".json") }) {
        val id = "$namespace:${path.fileName.toString().removeSuffix(".json")}"
        val json = runCatching { readJson(path) }.getOrElse {
            fail("species JSON does not parse: ${rel(path)}: ${it.message}")
            continue
        }
        speciesResources[id] = SpeciesResource(id, path, str(json["family"]), str(json["leaves_properties"]), str(json["primitive_sapling"]))
    }
    for (path in walkFiles(treeRoot.resolve("families")) { it.fileName.toString().endsWith(".json") }) {
        val id = "$namespace:${path.fileName.toString().removeSuffix(".json")}"
        val json = runCatching { readJson(path) }.getOrElse {
            fail("family JSON does not parse: ${rel(path)}: ${it.message}")
            continue
        }
        familyResources[id] = FamilyResource(id, path, str(json["primitive_log"]), str(json["primitive_stripped_log"]))
    }
    for (path in walkFiles(treeRoot.resolve("leaves_properties")) { it.fileName.toString().endsWith(".json") }) {
        val id = "$namespace:${path.fileName.toString().removeSuffix(".json")}"
        val json = runCatching { readJson(path) }.getOrElse {
            fail("leaves_properties JSON does not parse: ${rel(path)}: ${it.message}")
            continue
        }
        leavesResources[id] = LeavesResource(id, path, str(json["primitive_leaves"]))
    }
    for (path in walkFiles(treeRoot.resolve("world_gen")) { it.fileName.toString().endsWith(".json") }) {
        val json = runCatching { parseJson(Files.readString(path)) }.getOrElse {
            fail("world_gen JSON does not parse: ${rel(path)}: ${it.message}")
            continue
        }
        val refs = collectSpeciesRefs(json)
        if (refs.isNotEmpty()) worldgenSpeciesRefs.getOrPut(rel(path)) { linkedSetOf() }.addAll(refs)
    }
}

val inferredDtSpecies = (
    dtSaplings.map { "${idNamespace(it)}:${stripTreeSuffix(idPath(it))}" } +
        dtLeaves.map { "${idNamespace(it)}:${stripTreeSuffix(idPath(it))}" }
    ).toSet()
val knownSpecies = speciesResources.keys + inferredDtSpecies + knownExternalSpecies
val configuredFeatureSpeciesRefs = linkedMapOf<String, MutableSet<String>>()

val configuredFeatureRoots = listOf(root.resolve("datapacks"), root.resolve("generated/custom-mod-sources"))
for (base in configuredFeatureRoots) {
    for (path in walkFiles(base) { it.toString().replace('\\', '/').contains("/worldgen/configured_feature/") && it.fileName.toString().endsWith(".json") }) {
        if ("/build/" in path.toString().replace('\\', '/')) continue
        val json = runCatching { parseJson(Files.readString(path)) }.getOrElse {
            fail("configured feature JSON does not parse: ${rel(path)}: ${it.message}")
            continue
        }
        val refs = collectSpeciesRefs(json)
        if (refs.isNotEmpty()) configuredFeatureSpeciesRefs.getOrPut(rel(path)) { linkedSetOf() }.addAll(refs)
    }
}

for (species in speciesResources.values) {
    val strictLocalResource = rel(species.path).startsWith("generated/custom-mod-sources/")
    val family = species.family
    if (family == null) fail("species missing family: ${rel(species.path)}")
    else if (strictLocalResource && family !in familyResources) fail("species references unknown family: ${rel(species.path)} -> $family")
    val leaves = species.leaves
    if (leaves == null) fail("species missing leaves_properties: ${rel(species.path)}")
    else if (strictLocalResource && leaves !in leavesResources) fail("species references unknown leaves_properties: ${rel(species.path)} -> $leaves")
    val sapling = species.primitiveSapling
    if (sapling == null && strictLocalResource) warn("custom species has no primitive_sapling: ${rel(species.path)}")
    else if (strictLocalResource && sapling != null && blocks.isNotEmpty() && sapling !in blocks && sapling !in items) {
        fail("species primitive_sapling not present in retained registries: ${rel(species.path)} -> $sapling")
    }
}

for (family in familyResources.values) {
    for (id in listOfNotNull(family.primitiveLog, family.primitiveStrippedLog)) {
        if (blocks.isNotEmpty() && id !in blocks) fail("family primitive log not present in retained block registry: ${rel(family.path)} -> $id")
    }
}

for (leaves in leavesResources.values) {
    val primitiveLeaves = leaves.primitiveLeaves
    if (primitiveLeaves == null) fail("leaves_properties missing primitive_leaves: ${rel(leaves.path)}")
    else if (blocks.isNotEmpty() && primitiveLeaves !in blocks) fail("leaves primitive_leaves not present in retained block registry: ${rel(leaves.path)} -> $primitiveLeaves")
}

for ((path, refs) in worldgenSpeciesRefs + configuredFeatureSpeciesRefs) {
    for (ref in refs) {
        if (ref !in knownSpecies) fail("worldgen references unknown Dynamic Trees species: $path -> $ref")
    }
}

val configuredFeatureIds = walkFiles(root.resolve("datapacks")) {
    it.toString().replace('\\', '/').contains("/worldgen/configured_feature/") && it.fileName.toString().endsWith(".json")
}.associate { path ->
    val rel = rel(path)
    val parts = rel.split("/")
    val namespace = parts.getOrNull(parts.indexOf("data") + 1) ?: "UNKNOWN"
    val id = "$namespace:${path.fileName.toString().removeSuffix(".json")}"
    id to rel
}
for (path in walkFiles(root.resolve("datapacks")) { it.toString().replace('\\', '/').contains("/worldgen/placed_feature/") && it.fileName.toString().endsWith(".json") }) {
    val json = runCatching { readJson(path) }.getOrElse {
        fail("placed feature JSON does not parse: ${rel(path)}: ${it.message}")
        continue
    }
    val feature = str(json["feature"]) ?: continue
    if (idNamespace(feature) in listOf("bcdimtrees", "dthexerei", "dtmalum") && feature !in configuredFeatureIds) {
        fail("placed feature references missing configured feature: ${rel(path)} -> $feature")
    }
}

val logTags = blockTags.filterKeys { tag ->
    tag.endsWith("_logs") || tag.endsWith(":logs") || "/logs/" in tag || tag.endsWith("_stems") || tag.endsWith(":stems")
}.filterValues { values -> values.any { id -> id in blocks && idNamespace(id) !in setOf("dynamictrees", "dynamictreesplus") } }

val primitiveLogsToSpecies = speciesResources.values.mapNotNull { species ->
    familyResources[species.family]?.primitiveLog?.let { it to species.id }
}.groupBy({ it.first }, { it.second })

val inventory = logTags.map { (tag, values) ->
    val namespace = tag.substringBefore(':')
    val classification = when {
        values.any { it in primitiveLogsToSpecies } -> "custom_dt"
        namespace in nativeSourceNamespaces -> "native_dt"
        namespace in customSourceNamespaces -> "custom_dt_expected"
        namespace in intentionallyStaticNamespaces -> "static_intentional"
        else -> defaultClassification
    }
    TreeFamilyInventory(tag, namespace, classification, values.sorted())
}.sortedWith(compareBy<TreeFamilyInventory> { it.classification }.thenBy { it.tag })

val cancellers = walkFiles(root.resolve("datapacks")) {
    it.toString().replace('\\', '/').contains("/world_gen/feature_cancellers.json") && it.fileName.toString().endsWith(".json")
} + roots.flatMap { treeRoot ->
    walkFiles(treeRoot.resolve("world_gen")) { it.fileName.toString() == "feature_cancellers.json" }
}
val cancellerReport = cancellers.distinct().sorted().map { path ->
    val json = runCatching { parseJson(Files.readString(path)) }.getOrNull()
    val entries = arr(json)
    val replacementRefs = worldgenSpeciesRefs[rel(path.parent.resolve("default.json"))] ?: emptySet()
    if (entries.isNotEmpty() && replacementRefs.isEmpty()) warn("feature cancellers have no same-namespace world_gen/default species evidence: ${rel(path)}")
    mapOf("path" to rel(path), "entries" to entries.size, "same_namespace_replacement_species" to replacementRefs.sorted())
}

val report = linkedMapOf<String, Any?>(
    "schema" to "bc:dynamic_trees_coverage_report:v1",
    "generatedAt" to Instant.now().toString(),
    "manifest" to rel(manifestPath),
    "status" to if (failures.isEmpty()) "pass" else "fail",
    "failures" to failures,
    "warnings" to warnings,
    "counts" to mapOf(
        "treeRoots" to roots.size,
        "species" to speciesResources.size,
        "families" to familyResources.size,
        "leavesProperties" to leavesResources.size,
        "worldgenSpeciesReferenceFiles" to worldgenSpeciesRefs.size,
        "configuredFeatureSpeciesReferenceFiles" to configuredFeatureSpeciesRefs.size,
        "treeFamilyTags" to inventory.size
    ),
    "classifications" to inventory.groupingBy { it.classification }.eachCount().toSortedMap(),
    "species" to speciesResources.keys.sorted(),
    "worldgenSpeciesReferences" to (worldgenSpeciesRefs + configuredFeatureSpeciesRefs).mapValues { it.value.sorted() }.toSortedMap(),
    "treeFamilies" to inventory.map {
        mapOf("tag" to it.tag, "namespace" to it.namespace, "classification" to it.classification, "values" to it.values)
    },
    "featureCancellers" to cancellerReport,
)

Files.createDirectories(reportDir)
Files.writeString(jsonReportPath, toJson(report) + "\n")
Files.writeString(mdReportPath, buildString {
    appendLine("# Dynamic Trees Coverage")
    appendLine()
    appendLine("- Status: `${report["status"]}`")
    appendLine("- Species resources: `${speciesResources.size}`")
    appendLine("- Tree-family tags inventoried: `${inventory.size}`")
    appendLine("- Report JSON: `${rel(jsonReportPath)}`")
    appendLine()
    appendLine("## Classifications")
    for ((classification, count) in inventory.groupingBy { it.classification }.eachCount().toSortedMap()) {
        appendLine("- `$classification`: `$count`")
    }
    if (failures.isNotEmpty()) {
        appendLine()
        appendLine("## Failures")
        failures.forEach { appendLine("- $it") }
    }
    if (warnings.isNotEmpty()) {
        appendLine()
        appendLine("## Warnings")
        warnings.forEach { appendLine("- $it") }
    }
})

if (failures.isNotEmpty()) {
    System.err.println(failures.joinToString("\n") { "FAIL - $it" })
    System.err.println("wrote ${rel(jsonReportPath)} and ${rel(mdReportPath)}")
    exitProcess(1)
}

println("ok - Dynamic Trees coverage validates (${speciesResources.size} species, ${inventory.size} tree-family tags; wrote ${rel(jsonReportPath)})")
