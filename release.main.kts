#!/usr/bin/env kotlin

import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import kotlin.system.exitProcess

val root = __FILE__.canonicalFile.parentFile
var jobs = 2
when (args.size) {
    0 -> Unit
    2 -> {
        if (args[0] != "--jobs") {
            System.err.println("usage: ./release.main.kts [--jobs 1..4]")
            exitProcess(2)
        }
        jobs = args[1].toIntOrNull() ?: 0
    }
    else -> {
        System.err.println("usage: ./release.main.kts [--jobs 1..4]")
        exitProcess(2)
    }
}
if (jobs !in 1..4) {
    System.err.println("release jobs must be between 1 and 4")
    exitProcess(2)
}

val runId = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC)
    .format(java.time.Instant.now()) + "-" + ProcessHandle.current().pid()
val evidence = root.resolve("generated/test-evidence/$runId")
evidence.mkdirs()
evidence.resolve("release-request.txt").writeText(
    "run_id=$runId\njobs=$jobs\ncommand=./release.main.kts --jobs $jobs\nstarted_at=${java.time.Instant.now()}\n",
)

fun run(vararg command: String): Int = ProcessBuilder(*command)
    .directory(root)
    .inheritIO()
    .apply { environment()["BC_TEST_RUN_ID"] = runId }
    .start()
    .waitFor()

val preparation = run(root.resolve("gradlew").absolutePath, "--no-daemon", "prepareFreshDist", "-PreleaseJobs=$jobs")
if (preparation != 0) {
    println("release run: $runId")
    println("evidence: ${evidence.absolutePath}")
    exitProcess(preparation)
}

val tests = run(root.resolve("test.main.kts").absolutePath, "all")
println("release run: $runId")
println("evidence: ${evidence.absolutePath}")
exitProcess(tests)
