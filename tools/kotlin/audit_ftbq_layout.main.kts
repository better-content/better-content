#!/usr/bin/env kotlin

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.system.exitProcess

data class QuestNode(
    val chapter: String,
    val id: String,
    val title: String,
    val x: Double,
    val y: Double,
    val size: Double,
    val dependencies: List<String>,
)

data class Box(val left: Double, val right: Double, val top: Double, val bottom: Double)
data class Segment(val from: QuestNode, val to: QuestNode)
data class Finding(val severity: String, val chapter: String, val message: String)

val repo = Paths.get("").toAbsolutePath().normalize()
val chapterDir = repo.resolve("config/ftbquests/quests/chapters")

var checkMode = false
var failOnWarning = false
var chapterFilter: Set<String>? = null
var index = 0
while (index < args.size) {
    when (args[index]) {
        "--check" -> {
            checkMode = true
            index += 1
        }
        "--fail-on-warning" -> {
            failOnWarning = true
            index += 1
        }
        "--chapters" -> {
            val raw = args.getOrNull(index + 1) ?: error("--chapters needs a comma-separated list")
            chapterFilter = raw.split(',').map { it.trim().removeSuffix(".snbt") }.filter { it.isNotBlank() }.toSet()
            index += 2
        }
        else -> error("unknown argument: ${args[index]}")
    }
}

fun read(path: Path): String = Files.readString(path)

fun splitQuestBlocks(text: String): List<String> {
    val blocks = mutableListOf<String>()
    val current = StringBuilder()
    var inQuests = false
    var inQuestBlock = false
    var depth = 0
    for (line in text.lineSequence()) {
        val trimmed = line.trim()
        if (!inQuests) {
            if (trimmed == "quests: [") inQuests = true
            continue
        }
        if (!inQuestBlock) {
            when {
                line.startsWith("\t\t{") -> {
                    inQuestBlock = true
                    depth = 0
                    current.clear()
                }
                line.startsWith("\t]") -> break
                else -> continue
            }
        }
        current.appendLine(line)
        depth += line.count { it == '{' }
        depth -= line.count { it == '}' }
        if (depth <= 0) {
            blocks += current.toString()
            inQuestBlock = false
        }
    }
    return blocks
}

fun firstString(block: String, key: String): String? =
    Regex("""\b${Regex.escape(key)}:\s*"([^"]+)"""").find(block)?.groupValues?.get(1)

fun firstDouble(block: String, key: String, default: Double? = null): Double =
    Regex("""\b${Regex.escape(key)}:\s*(-?[0-9]+(?:\.[0-9]+)?)d?""").find(block)?.groupValues?.get(1)?.toDouble()
        ?: default
        ?: error("missing $key in quest block:\n$block")

fun dependencies(block: String): List<String> {
    val content = Regex("""dependencies:\s*\[([^\]]*)]""").find(block)?.groupValues?.get(1) ?: return emptyList()
    return Regex(""""([0-9A-Fa-f]{16})"""").findAll(content).map { it.groupValues[1].uppercase() }.toList()
}

fun parseChapter(path: Path): List<QuestNode> {
    val chapter = path.fileName.toString().removeSuffix(".snbt")
    return splitQuestBlocks(read(path)).map { block ->
        QuestNode(
            chapter = chapter,
            id = (firstString(block, "id") ?: error("$chapter: quest missing id")).uppercase(),
            title = firstString(block, "title") ?: firstString(block, "subtitle") ?: firstString(block, "id") ?: "<untitled>",
            x = firstDouble(block, "x"),
            y = firstDouble(block, "y"),
            size = firstDouble(block, "size", 1.0),
            dependencies = dependencies(block),
        )
    }
}

fun nodeBox(node: QuestNode): Box {
    // Coordinates are FTBQ editor units. These bounds intentionally model the visible
    // rounded node plus its title text, not just the icon square.
    val titleWidth = 0.92 + node.title.length * 0.075
    val width = max(1.28, min(3.05, titleWidth)) * node.size
    val height = 0.72 * node.size
    return Box(node.x - width / 2.0, node.x + width / 2.0, node.y - height / 2.0, node.y + height / 2.0)
}

fun labelBox(node: QuestNode): Box {
    // The out-of-game renderer displays task/reward metadata to the right of titles.
    // This expanded box catches the practical visual collisions seen in screenshots.
    val base = nodeBox(node)
    return Box(base.left, base.right + 0.78, base.top - 0.05, base.bottom + 0.05)
}

fun overlap(a: Box, b: Box): Boolean =
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

fun ccw(ax: Double, ay: Double, bx: Double, by: Double, cx: Double, cy: Double): Double =
    (cy - ay) * (bx - ax) - (by - ay) * (cx - ax)

fun segmentsCross(a: Segment, b: Segment): Boolean {
    if (setOf(a.from.id, a.to.id).intersect(setOf(b.from.id, b.to.id)).isNotEmpty()) return false
    val a1 = ccw(a.from.x, a.from.y, b.from.x, b.from.y, b.to.x, b.to.y)
    val a2 = ccw(a.to.x, a.to.y, b.from.x, b.from.y, b.to.x, b.to.y)
    val b1 = ccw(a.from.x, a.from.y, a.to.x, a.to.y, b.from.x, b.from.y)
    val b2 = ccw(a.from.x, a.from.y, a.to.x, a.to.y, b.to.x, b.to.y)
    if (a1 == 0.0 || a2 == 0.0 || b1 == 0.0 || b2 == 0.0) return false
    return (a1 > 0) != (a2 > 0) && (b1 > 0) != (b2 > 0)
}

fun connectedComponents(nodes: List<QuestNode>): List<List<QuestNode>> {
    val byId = nodes.associateBy { it.id }
    val edges = mutableMapOf<String, MutableSet<String>>()
    for (node in nodes) edges.getOrPut(node.id) { mutableSetOf() }
    for (node in nodes) {
        for (dep in node.dependencies) {
            if (dep !in byId) continue
            edges.getOrPut(node.id) { mutableSetOf() } += dep
            edges.getOrPut(dep) { mutableSetOf() } += node.id
        }
    }
    val seen = mutableSetOf<String>()
    val components = mutableListOf<List<QuestNode>>()
    for (node in nodes) {
        if (!seen.add(node.id)) continue
        val queue = ArrayDeque<String>()
        val ids = mutableListOf<String>()
        queue += node.id
        while (queue.isNotEmpty()) {
            val id = queue.removeFirst()
            ids += id
            for (next in edges[id].orEmpty()) {
                if (seen.add(next)) queue += next
            }
        }
        components += ids.mapNotNull { byId[it] }
    }
    return components.sortedByDescending { it.size }
}

val chapterFiles = Files.list(chapterDir).use { stream ->
    stream.filter { it.fileName.toString().endsWith(".snbt") }
        .filter { chapterFilter == null || it.fileName.toString().removeSuffix(".snbt") in chapterFilter!! }
        .sorted()
        .toList()
}

val findings = mutableListOf<Finding>()
var totalNodes = 0
var totalEdges = 0
var totalNodeOverlaps = 0
var totalLabelRisks = 0
var totalCrossings = 0

for (file in chapterFiles) {
    val nodes = parseChapter(file)
    val chapter = file.fileName.toString().removeSuffix(".snbt")
    val byId = nodes.associateBy { it.id }
    totalNodes += nodes.size

    val missingDeps = nodes.flatMap { node -> node.dependencies.filter { it !in byId }.map { node to it } }
    for ((node, dep) in missingDeps) {
        findings += Finding("error", chapter, "${node.title} depends on missing quest id $dep")
    }

    val components = connectedComponents(nodes)
    if (nodes.isNotEmpty() && components.size > 1) {
        findings += Finding(
            "error",
            chapter,
            "chapter is disconnected: ${components.size} components; components=${components.map { c -> c.take(6).joinToString("/", prefix = "[", postfix = if (c.size > 6) "/...]" else "]") { it.title } }}",
        )
    }

    val edges = nodes.flatMap { node ->
        node.dependencies.mapNotNull { dep -> byId[dep]?.let { Segment(it, node) } }
    }
    totalEdges += edges.size

    val nodeOverlaps = mutableListOf<String>()
    val labelRisks = mutableListOf<String>()
    for (i in nodes.indices) {
        for (j in i + 1 until nodes.size) {
            val a = nodes[i]
            val b = nodes[j]
            if (overlap(nodeBox(a), nodeBox(b))) {
                nodeOverlaps += "${a.title} <-> ${b.title}"
            } else if (overlap(labelBox(a), labelBox(b))) {
                labelRisks += "${a.title} <-> ${b.title}"
            }
        }
    }
    totalNodeOverlaps += nodeOverlaps.size
    totalLabelRisks += labelRisks.size
    nodeOverlaps.take(40).forEach { findings += Finding("error", chapter, "node overlap: $it") }
    labelRisks.take(40).forEach { findings += Finding("warning", chapter, "label/metadata collision risk: $it") }

    val crossings = mutableListOf<String>()
    for (i in edges.indices) {
        for (j in i + 1 until edges.size) {
            val a = edges[i]
            val b = edges[j]
            if (segmentsCross(a, b)) crossings += "${a.from.title}->${a.to.title} crosses ${b.from.title}->${b.to.title}"
        }
    }
    totalCrossings += crossings.size
    crossings.take(40).forEach { findings += Finding("warning", chapter, "dependency line crossing: $it") }

    if (!checkMode) {
        println("$chapter nodes=${nodes.size} edges=${edges.size} components=${components.size} nodeOverlaps=${nodeOverlaps.size} labelRisks=${labelRisks.size} crossings=${crossings.size}")
    }
}

val errors = findings.count { it.severity == "error" }
val warnings = findings.count { it.severity == "warning" }
println("ftbq layout audit: chapters=${chapterFiles.size} nodes=$totalNodes edges=$totalEdges errors=$errors warnings=$warnings nodeOverlaps=$totalNodeOverlaps labelRisks=$totalLabelRisks crossings=$totalCrossings")

for (finding in findings) {
    println("${finding.severity.uppercase()} ${finding.chapter}: ${finding.message}")
}

if (errors > 0 || (failOnWarning && warnings > 0)) exitProcess(1)
