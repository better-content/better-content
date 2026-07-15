#!/usr/bin/env kotlin

import java.nio.file.Files
import java.nio.file.Paths
import kotlin.system.exitProcess

val root = Paths.get("").toAbsolutePath().normalize()
val files = listOf(
    "kubejs/config/tech_parenting.json" to listOf("\"schema\": \"bc.tech_parenting.v1\"", "\"entries\"", "\"era\": \"survival\""),
    "kubejs/config/magic_parenting.json" to listOf("\"schema\": \"bc.magic_parenting.v1\"", "\"entries\"", "\"mod\": \"bloodmagic\""),
    "kubejs/config/economy_acquisition.json" to listOf("\"schema\": \"bc.economy_acquisition.v1\"", "\"entries\"", "\"policy\": \"currency_only\""),
    "kubejs/config/surface_registry.json" to listOf("\"schema\": \"bc.surface_registry.v1\"", "\"recipe_surface_types\"", "\"acquisition_surface_types\""),
    "kubejs/config/formal_magic_domains.json" to listOf("\"schema\": \"bc.formal_magic_domains.v1\"", "\"ink_tiers\"", "\"irons_schools\"", "\"glyphs\""),
)
val failures = mutableListOf<String>()

for ((path, needles) in files) {
    val abs = root.resolve(path)
    if (!Files.isRegularFile(abs)) {
        failures += "missing $path"
        continue
    }
    val text = Files.readString(abs)
    val missing = needles.filterNot(text::contains)
    if (missing.isNotEmpty()) failures += "$path missing ${missing.joinToString(", ")}"
}

val formalPath = root.resolve("kubejs/config/formal_magic_domains.json")
if (Files.isRegularFile(formalPath)) {
    val formal = Files.readString(formalPath)
    val glyphRows = Regex("""\[\"([a-z0-9_]+)\",\s*([123]),\s*\"([a-z_]+)\",\s*\"([^\"]+)\"\]""")
        .findAll(formal)
        .map { it.groupValues[1] }
        .toList()
    val duplicateGlyphs = glyphRows.groupingBy { it }.eachCount().filterValues { it > 1 }.keys
    if (glyphRows.size != 77) failures += "formal magic manifest classifies ${glyphRows.size} glyphs, expected 77"
    if (duplicateGlyphs.isNotEmpty()) failures += "formal magic manifest duplicates glyphs: ${duplicateGlyphs.sorted().joinToString(", ")}"

    val runtimePath = root.resolve("generated/runtime-dumps/recipes.json")
    if (Files.isRegularFile(runtimePath)) {
        val runtimeGlyphs = Regex("""ars_nouveau:glyph_([a-z0-9_]+)""")
            .findAll(Files.readString(runtimePath))
            .map { it.groupValues[1] }
            .toSet()
        val classifiedGlyphs = glyphRows.toSet()
        val missing = runtimeGlyphs - classifiedGlyphs
        val stale = classifiedGlyphs - runtimeGlyphs
        if (missing.isNotEmpty()) failures += "unclassified runtime Ars glyphs: ${missing.sorted().joinToString(", ")}"
        if (stale.isNotEmpty()) failures += "formal magic glyphs absent from retained runtime: ${stale.sorted().joinToString(", ")}"
    }

    val expectedSchools = setOf("blood", "nature", "ice", "ender", "fire", "holy", "lightning", "evocation", "eldritch")
    val missingSchools = expectedSchools.filterNot { formal.contains("\"$it\": { \"domain\"") }
    if (missingSchools.isNotEmpty()) failures += "formal magic manifest missing Iron's schools: ${missingSchools.sorted().joinToString(", ")}"

    val arsScript = Files.readString(root.resolve("kubejs/server_scripts/30_recipe_replace/127_ars_manuscript_progression.js"))
    val ironsScript = Files.readString(root.resolve("kubejs/server_scripts/30_recipe_replace/126_cross_magic_irons_spellcraft.js"))
    val tagScript = Files.readString(root.resolve("kubejs/server_scripts/10_tags/70_formal_magic_domains.js"))
    if (!arsScript.contains("kubejs:formal_magic/ars/glyph/")) failures += "Ars formal recipe generator marker missing"
    if (!ironsScript.contains("kubejs:formal_magic/irons/ink/")) failures += "Iron's formal ink generator marker missing"
    if (!tagScript.contains("irons_spellbooks:school_focus")) failures += "Iron's school focus override marker missing"

}

if (failures.isNotEmpty()) {
    failures.forEach { System.err.println("FAIL - $it") }
    exitProcess(1)
}

println("progression contracts validate")
