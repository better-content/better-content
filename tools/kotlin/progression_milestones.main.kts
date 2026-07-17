#!/usr/bin/env kotlin

import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.Comparator
import java.util.concurrent.TimeUnit
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.system.exitProcess

data class Config(
    val phase: String?,
    val timeoutSeconds: Int,
    val port: Int,
    val bootstrapMode: String,
    val keepRuns: Boolean,
    val runRoot: Path,
    val statusPath: Path?,
    val summaryPath: Path?,
    val latestStatusPath: Path?,
    val latestSummaryPath: Path?,
)

data class Server(val process: Process, val stdin: BufferedWriter, val log: Path)

fun usage(message: String? = null): Nothing {
    if (message != null) System.err.println(message)
    System.err.println("Usage: tools/bc test scenario progression_milestones [--phase ID] [--timeout SECONDS] [--port PORT] [--bootstrap-mode always|once|never] [--run-root PATH] [--keep-runs]")
    exitProcess(2)
}

fun envPath(name: String): Path? = System.getenv(name)?.takeIf(String::isNotBlank)?.let { Paths.get(it).toAbsolutePath().normalize() }

fun config(args: Array<String>): Config {
    var phase: String? = null
    var timeout = 240
    var port = System.getenv("BC_HARNESS_ACTUAL_PORT")?.toIntOrNull() ?: System.getenv("BC_HARNESS_REQUESTED_PORT")?.toIntOrNull() ?: 25569
    var bootstrap = "always"
    var keepRuns = false
    var runRoot = envPath("BC_HARNESS_RUN_ROOT") ?: Paths.get(System.getProperty("user.home"), ".cache", "bc", "progression-milestones")
    var status = envPath("BC_HARNESS_STATUS_PATH")
    var summary = envPath("BC_HARNESS_SUMMARY_PATH")
    var latestStatus = envPath("BC_HARNESS_LATEST_STATUS_PATH")
    var latestSummary = envPath("BC_HARNESS_LATEST_SUMMARY_PATH")
    var index = 0
    while (index < args.size) {
        when (args[index]) {
            "--phase" -> { phase = args.getOrNull(index + 1) ?: usage("--phase needs an id"); index += 2 }
            "--timeout" -> { timeout = args.getOrNull(index + 1)?.toIntOrNull() ?: usage("--timeout needs a positive integer"); index += 2 }
            "--port" -> { port = args.getOrNull(index + 1)?.toIntOrNull() ?: usage("--port needs a positive integer"); index += 2 }
            "--bootstrap-mode" -> { bootstrap = args.getOrNull(index + 1) ?: usage("--bootstrap-mode needs a value"); index += 2 }
            "--run-root" -> { runRoot = Paths.get(args.getOrNull(index + 1) ?: usage("--run-root needs a path")).toAbsolutePath().normalize(); index += 2 }
            "--keep-runs" -> { keepRuns = true; index += 1 }
            "--status-path" -> { status = Paths.get(args.getOrNull(index + 1) ?: usage("--status-path needs a path")).toAbsolutePath().normalize(); index += 2 }
            "--summary-path" -> { summary = Paths.get(args.getOrNull(index + 1) ?: usage("--summary-path needs a path")).toAbsolutePath().normalize(); index += 2 }
            "--latest-status-path" -> { latestStatus = Paths.get(args.getOrNull(index + 1) ?: usage("--latest-status-path needs a path")).toAbsolutePath().normalize(); index += 2 }
            "--latest-summary-path" -> { latestSummary = Paths.get(args.getOrNull(index + 1) ?: usage("--latest-summary-path needs a path")).toAbsolutePath().normalize(); index += 2 }
            "--help" -> usage()
            else -> usage("unknown argument: ${args[index]}")
        }
    }
    if (timeout <= 0 || port <= 0) usage("timeout and port must be positive")
    if (bootstrap !in setOf("always", "once", "never")) usage("invalid bootstrap mode: $bootstrap")
    return Config(phase, timeout, port, bootstrap, keepRuns, runRoot, status, summary, latestStatus, latestSummary)
}

fun deleteTree(path: Path) {
    if (!path.exists()) return
    Files.walk(path).use { stream -> stream.sorted(Comparator.reverseOrder()).forEach(Files::deleteIfExists) }
}

fun run(command: List<String>, root: Path): Int = ProcessBuilder(command).directory(root.toFile()).inheritIO().start().waitFor()

fun setPort(path: Path, port: Int) {
    val lines = if (path.exists()) Files.readAllLines(path).toMutableList() else mutableListOf()
    val found = lines.indexOfFirst { it.startsWith("server-port=") }
    if (found >= 0) lines[found] = "server-port=$port" else lines += "server-port=$port"
    Files.writeString(path, lines.joinToString("\n", postfix = "\n"))
}

fun start(serverDir: Path, port: Int, evidence: Path): Server {
    setPort(serverDir.resolve("server.properties"), port)
    val log = evidence.resolve("server-console.log")
    val process = ProcessBuilder("./run.sh", "nogui").directory(serverDir.toFile()).redirectErrorStream(true).redirectOutput(log.toFile()).start()
    return Server(process, process.outputStream.bufferedWriter(), log)
}

fun tail(path: Path, limit: Long = 512_000): String {
    if (!path.exists()) return ""
    path.toFile().inputStream().use { input ->
        input.skip((path.toFile().length() - limit).coerceAtLeast(0))
        return input.readBytes().toString(Charsets.UTF_8)
    }
}

fun waitFor(server: Server, pattern: Regex, timeoutSeconds: Int, label: String) {
    val deadline = System.currentTimeMillis() + timeoutSeconds * 1000L
    while (System.currentTimeMillis() < deadline) {
        if (!server.process.isAlive) error("$label exited with ${server.process.exitValue()}")
        val output = tail(server.log)
        if (Regex("Better Content Validation Probe .* failed to load correctly").containsMatchIn(output)) {
            error("$label hit a fatal startup signature; see ${server.log}")
        }
        if (pattern.containsMatchIn(output)) return
        Thread.sleep(1000)
    }
    error("$label timed out after ${timeoutSeconds}s")
}

fun command(server: Server, value: String) {
    server.stdin.write(value)
    server.stdin.newLine()
    server.stdin.flush()
}

fun stop(server: Server?) {
    if (server == null || !server.process.isAlive) return
    runCatching { command(server, "stop"); server.process.waitFor(15, TimeUnit.SECONDS) }
    val descendants = server.process.toHandle().descendants().toList()
    descendants.filter { it.isAlive }.forEach { it.destroy() }
    if (server.process.isAlive) server.process.destroy()
    Thread.sleep(1000)
    descendants.filter { it.isAlive }.forEach { it.destroyForcibly() }
    if (server.process.isAlive) server.process.destroyForcibly()
}

fun jsonEscape(value: String) = value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n")
fun json(value: Any?): String = when (value) {
    null -> "null"
    is String -> "\"${jsonEscape(value)}\""
    is Boolean, is Number -> value.toString()
    is Map<*, *> -> value.entries.joinToString("{", "}") { "\"${jsonEscape(it.key.toString())}\":${json(it.value)}" }
    is Iterable<*> -> value.joinToString("[", "]") { json(it) }
    else -> json(value.toString())
}
fun write(path: Path?, value: Any?) { if (path != null) { path.parent?.createDirectories(); Files.writeString(path, json(value) + "\n") } }
fun latest(target: Path?, source: Path?) { if (target != null && source != null && source.exists()) { target.parent?.createDirectories(); Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING) } }

val root = Paths.get("").toAbsolutePath().normalize()
val cfg = config(args)
val contract = root.resolve("tools/progression_milestones_contract.json")
val phaseIds = Regex("\\\"id\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"").findAll(Files.readString(contract)).map { it.groupValues[1] }.toList()
if (cfg.phase != null && cfg.phase !in phaseIds) usage("unknown milestone phase: ${cfg.phase}")
val selected = cfg.phase?.let(::listOf) ?: phaseIds
cfg.runRoot.createDirectories()
if (!cfg.keepRuns && cfg.bootstrapMode != "never") deleteTree(cfg.runRoot.resolve("run"))
val serverDir = cfg.runRoot.resolve("run/server")
val evidence = cfg.runRoot.resolve("run/evidence").also(Path::createDirectories)
val status = linkedMapOf<String, Any?>("scenario" to "progression_milestones", "status" to "running", "phase" to "bootstrap", "run_root" to cfg.runRoot.toString(), "selected" to selected)
write(cfg.statusPath, status); latest(cfg.latestStatusPath, cfg.statusPath)
var server: Server? = null
val results = mutableListOf<Map<String, Any?>>()
var failure: String? = null
try {
    when (cfg.bootstrapMode) {
        "always" -> if (run(listOf("tools/bc", "internal", "prepare-server-runtime", "--server-dir", serverDir.toString(), "--port", cfg.port.toString(), "--reset-runtime"), root) != 0) error("runtime preparation failed")
        "once" -> if (!serverDir.resolve("run.sh").exists() && run(listOf("tools/bc", "internal", "prepare-server-runtime", "--server-dir", serverDir.toString(), "--port", cfg.port.toString(), "--reset-runtime"), root) != 0) error("runtime preparation failed")
        "never" -> if (!serverDir.resolve("run.sh").exists()) usage("prepared runtime missing for --bootstrap-mode never: $serverDir")
    }
    status["phase"] = "inject_probe"; write(cfg.statusPath, status); latest(cfg.latestStatusPath, cfg.statusPath)
    if (run(listOf("tools/bc", "internal", "inject-validation-probe", "--runtime-dir", serverDir.toString(), "--contract", contract.toString()), root) != 0) error("validation probe injection failed")
    status["phase"] = "start_server"; write(cfg.statusPath, status); latest(cfg.latestStatusPath, cfg.statusPath)
    val launched = start(serverDir, cfg.port, evidence)
    server = launched
    waitFor(launched, Regex("Done \\(.*For help, type \\\"help\\\""), cfg.timeoutSeconds, "server boot")
    selected.forEach { phase ->
        status["phase"] = phase; write(cfg.statusPath, status); latest(cfg.latestStatusPath, cfg.statusPath)
        command(server!!, "bcvalidate phase $phase")
        waitFor(server!!, Regex("BC_VALIDATION_PROBE_RESULT .*\\\"phase\\\":\\\"${Regex.escape(phase)}\\\".*\\\"status\\\":\\\"passed\\\""), cfg.timeoutSeconds, "phase $phase")
        if (phase == "primitive_tools") {
            command(server!!, "sam validate_opening_progression")
            waitFor(server!!, Regex("OPENING_PROGRESSION_VALIDATION PASS"), cfg.timeoutSeconds, "opening progression compatibility check")
        }
        results += mapOf("phase" to phase, "status" to "passed")
    }
} catch (error: Throwable) {
    failure = error.message ?: error::class.java.simpleName
} finally {
    stop(server)
}
status["status"] = if (failure == null) "passed" else "failed"
status["phase"] = "shutdown"
status["last_error"] = failure
status["evidence" ] = evidence.toString()
write(cfg.statusPath, status); latest(cfg.latestStatusPath, cfg.statusPath)
val summary = mapOf("schema" to "bc.progression_milestones.v1", "scenario" to "progression_milestones", "status" to status["status"], "selected" to selected, "results" to results, "error" to failure, "evidence" to evidence.toString())
write(cfg.summaryPath, summary); latest(cfg.latestSummaryPath, cfg.summaryPath)
if (failure != null) {
    System.err.println("progression milestones failed: $failure")
    exitProcess(1)
}
println("progression milestones passed: ${selected.joinToString(", ")}")
