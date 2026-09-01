#!/usr/bin/env kotlin

import kotlin.system.exitProcess

val root = __FILE__.canonicalFile.parentFile
val (mode, apply) = when (args.toList()) {
    listOf("audit") -> "audit" to false
    listOf("prune", "--apply") -> "prune" to true
    else -> {
        System.err.println("usage: ./maintenance.main.kts <audit|prune --apply>")
        exitProcess(2)
    }
}

val command = listOf(
    root.resolve("gradlew").absolutePath,
    "--no-daemon",
    "--quiet",
    "workspaceMaintenance",
    "-PmaintenanceMode=$mode",
    "-PmaintenanceApply=$apply",
)
val process = ProcessBuilder(command).directory(root).inheritIO().start()
exitProcess(process.waitFor())
