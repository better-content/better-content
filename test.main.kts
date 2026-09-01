#!/usr/bin/env kotlin

import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import kotlin.system.exitProcess

val root = __FILE__.canonicalFile.parentFile
val selector = args.firstOrNull()
val taskBySelector = mapOf(
    "fast" to "test",
    "candidate" to "candidateTest",
    "server" to "serverTest",
    "multiplayer" to "multiplayerTest",
    "singleplayer" to "singleplayerTest",
)

fun usage(): Nothing {
    System.err.println("usage: ./test.main.kts <fast|candidate|server|multiplayer|singleplayer|all>")
    exitProcess(2)
}

if (selector == null || (selector !in taskBySelector && selector != "all") || args.size != 1) usage()
val selected = selector ?: usage()

val runId = System.getenv("BC_TEST_RUN_ID")?.takeIf { it.isNotBlank() }
    ?: DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC)
        .format(java.time.Instant.now()) + "-" + ProcessHandle.current().pid()
val evidence = root.resolve("generated/test-evidence/$runId")
evidence.mkdirs()

fun gradle(task: String): Int {
    println("test suite: $task (run $runId)")
    val process = ProcessBuilder(root.resolve("gradlew").absolutePath, "--no-daemon", task)
        .directory(root)
        .inheritIO()
        .apply { environment()["BC_TEST_RUN_ID"] = runId }
        .start()
    return process.waitFor()
}

val statuses = linkedMapOf<String, Int>()
if (selected == "all") {
    statuses["fast"] = gradle("test")
    statuses["candidate"] = gradle("candidateTest")
    if (statuses.getValue("candidate") == 0) {
        listOf("server", "multiplayer", "singleplayer").forEach { name ->
            statuses[name] = gradle(taskBySelector.getValue(name))
        }
    } else {
        println("candidate validation failed; heavyweight suites were not started")
    }
} else {
    statuses[selected] = gradle(taskBySelector.getValue(selected))
}

println("run: $runId")
println("evidence: ${evidence.absolutePath}")
statuses.forEach { (name, status) -> println("$name: ${if (status == 0) "passed" else "failed ($status)"}") }
exitProcess(if (statuses.values.all { it == 0 }) 0 else 1)
