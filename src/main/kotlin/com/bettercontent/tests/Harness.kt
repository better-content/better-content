package com.bettercontent.tests

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.io.BufferedWriter
import java.net.ServerSocket
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardCopyOption
import java.nio.file.StandardOpenOption
import java.security.MessageDigest
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.UUID
import java.util.concurrent.TimeUnit
import java.util.zip.ZipFile
import kotlin.io.path.absolutePathString
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.io.path.isDirectory
import kotlin.io.path.name
import kotlin.io.path.readText
import kotlin.io.path.writeText

data class CandidatePair(
    val release: Path,
    val client: Path,
    val server: Path,
    val clientSha256: String,
    val serverSha256: String,
)

object Hashes {
    fun sha256(path: Path): String {
        val digest = MessageDigest.getInstance("SHA-256")
        Files.newInputStream(path).use { input ->
            val buffer = ByteArray(1024 * 1024)
            while (true) {
                val count = input.read(buffer)
                if (count < 0) break
                digest.update(buffer, 0, count)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}

object CandidateLocator {
    fun locate(root: Path): CandidatePair {
        val dist = root.resolve("dist")
        require(dist.isDirectory()) { "dist/ is absent; an explicit fresh dist is required before pack-level testing" }
        val clients = Files.walk(dist).use { stream ->
            stream.filter { it.endsWith("client/better-content.zip") }.sorted().toList()
        }
        val servers = Files.walk(dist).use { stream ->
            stream.filter { it.endsWith("server/better-content.zip") }.sorted().toList()
        }
        require(clients.size == 1 && servers.size == 1) {
            "dist/ must contain exactly one client ZIP and one server ZIP (found ${clients.size}/${servers.size})"
        }
        val clientRelease = clients.single().parent.parent
        val serverRelease = servers.single().parent.parent
        require(clientRelease == serverRelease) { "client and server candidates belong to different releases" }
        return CandidatePair(
            clientRelease,
            clients.single(),
            servers.single(),
            Hashes.sha256(clients.single()),
            Hashes.sha256(servers.single()),
        )
    }
}

object ZipContracts {
    fun entryText(zip: Path, entry: String): String = ZipFile(zip.toFile()).use { archive ->
        val item = archive.getEntry(entry) ?: error("candidate is missing $entry")
        archive.getInputStream(item).bufferedReader().use { it.readText() }
    }

    fun soleTopLevelDirectory(zip: Path): String = ZipFile(zip.toFile()).use { archive ->
        val roots = archive.entries().asSequence()
            .map { it.name.substringBefore('/') }
            .filter { it.isNotBlank() }
            .toSet()
        require(roots.size == 1) { "server candidate must contain exactly one top-level directory: $roots" }
        roots.single()
    }

    fun extract(zip: Path, destination: Path) {
        destination.createDirectories()
        ZipFile(zip.toFile()).use { archive ->
            archive.entries().asSequence().forEach { entry ->
                val target = destination.resolve(entry.name).normalize()
                require(target.startsWith(destination.normalize())) { "unsafe ZIP entry: ${entry.name}" }
                if (entry.isDirectory) target.createDirectories()
                else {
                    target.parent.createDirectories()
                    archive.getInputStream(entry).use { input -> Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING) }
                }
            }
        }
    }
}

data class TestConfig(
    val root: Path,
    val runId: String,
    val runRoot: Path,
    val settleSeconds: Long,
    val username: String,
    val clientMain: Path,
    val java: Path,
) {
    companion object {
        fun load(): TestConfig {
            val root = Path.of(System.getProperty("bc.repo.root", ".")).toAbsolutePath().normalize()
            val runId = System.getenv("BC_TEST_RUN_ID")?.takeIf { it.isNotBlank() }
                ?: DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC)
                    .format(Instant.now()) + "-" + ProcessHandle.current().pid()
            val runRoot = System.getenv("BC_TEST_RUN_ROOT")?.let { Path.of(it) }
                ?: root.resolve("generated/test-evidence")
            val settle = System.getenv("BC_TEST_SETTLE_SECONDS")?.toLongOrNull() ?: 10L
            require(settle >= 0) { "BC_TEST_SETTLE_SECONDS must be non-negative" }
            val javaCandidate = System.getenv("BC_JAVA")?.let { Path.of(it) }
                ?: System.getenv("JAVA_HOME")?.let { Path.of(it).resolve("bin/java") }
                ?: Path.of(System.getProperty("java.home")).resolve("bin/java")
            require(Files.isExecutable(javaCandidate)) { "Java executable was not found: $javaCandidate" }
            require(System.getProperty("java.specification.version") == "17") { "Java 17 is required" }
            return TestConfig(
                root,
                runId,
                runRoot.toAbsolutePath().normalize(),
                settle,
                System.getenv("BC_TEST_USERNAME") ?: "SmokeClient",
                System.getenv("BC_TEST_CLIENT_MAIN")?.let { Path.of(it) }
                    ?: Path.of(System.getProperty("user.home"), ".cache/bc/tests/client-main"),
                javaCandidate.toAbsolutePath().normalize(),
            )
        }
    }
}

class EvidenceRun(val config: TestConfig, val suite: String) {
    private val mapper: ObjectMapper = jacksonObjectMapper()
    val directory: Path = config.runRoot.resolve(config.runId).resolve(suite).also { it.createDirectories() }
    val fixture: Path = directory.resolve("fixture").also { it.createDirectories() }
    private val events = directory.resolve("events.jsonl")
    private val started = Instant.now()
    private var failure: String? = null

    init {
        event("suite_started", mapOf("suite" to suite, "root" to config.root.absolutePathString()))
        capture("git-status.txt", listOf("git", "status", "--short"), config.root)
        capture("git-head.txt", listOf("git", "rev-parse", "HEAD"), config.root)
        capture("java-version.txt", listOf(config.java.toString(), "-version"), config.root)
    }

    @Synchronized
    fun event(type: String, fields: Map<String, Any?> = emptyMap()) {
        val document = linkedMapOf<String, Any?>("time" to Instant.now().toString(), "type" to type)
        document.putAll(fields)
        Files.writeString(
            events,
            mapper.writeValueAsString(document) + "\n",
            StandardCharsets.UTF_8,
            StandardOpenOption.CREATE,
            StandardOpenOption.APPEND,
        )
        writeSummary("running")
    }

    fun checkpoint(name: String, action: () -> Unit) {
        event("checkpoint_started", mapOf("name" to name))
        try {
            action()
            event("checkpoint_passed", mapOf("name" to name))
        } catch (error: Throwable) {
            failure = "$name: ${error.message ?: error::class.java.name}"
            event("checkpoint_failed", mapOf("name" to name, "error" to failure))
            throw error
        }
    }

    fun capture(name: String, command: List<String>, cwd: Path = config.root) {
        val output = directory.resolve(name)
        try {
            ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true).redirectOutput(output.toFile())
                .start().waitFor(30, TimeUnit.SECONDS)
        } catch (ignored: Exception) {
            output.writeText("evidence capture failed: ${ignored.message}\n")
        }
    }

    fun finish(success: Boolean) {
        if (!success && failure == null) failure = "suite failed outside a named checkpoint"
        event("suite_finished", mapOf("success" to success, "failure" to failure))
        writeSummary(if (success) "passed" else "failed")
        if (success && fixture.exists()) fixture.toFile().deleteRecursively()
        println("evidence: ${directory.absolutePathString()}")
    }

    private fun writeSummary(status: String) {
        val summary = linkedMapOf<String, Any?>(
            "schema" to "bc.modpack_test_run.v1",
            "run_id" to config.runId,
            "suite" to suite,
            "status" to status,
            "started_at" to started.toString(),
            "updated_at" to Instant.now().toString(),
            "failure" to failure,
            "evidence" to directory.absolutePathString(),
            "fixture" to fixture.absolutePathString(),
        )
        val temporary = directory.resolve(".run.json.tmp")
        mapper.writerWithDefaultPrettyPrinter().writeValue(temporary.toFile(), summary)
        Files.move(temporary, directory.resolve("run.json"), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE)
    }
}

class ManagedProcess(
    val name: String,
    command: List<String>,
    cwd: Path,
    val log: Path,
    environment: Map<String, String> = emptyMap(),
) : AutoCloseable {
    private val process: Process
    private val input: BufferedWriter

    init {
        log.parent.createDirectories()
        val builder = ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true)
            .redirectOutput(ProcessBuilder.Redirect.appendTo(log.toFile()))
        builder.environment().putAll(environment)
        process = builder.start()
        input = process.outputStream.bufferedWriter()
    }

    val alive: Boolean get() = process.isAlive
    val pid: Long get() = process.pid()

    fun send(line: String) {
        require(process.isAlive) { "$name is not running" }
        input.write(line)
        input.newLine()
        input.flush()
    }

    fun waitForLog(pattern: Regex, timeout: Duration, description: String) {
        val deadline = System.nanoTime() + timeout.toNanos()
        while (System.nanoTime() < deadline) {
            val text = if (log.exists()) log.readText() else ""
            if (pattern.containsMatchIn(text)) return
            check(process.isAlive) { "$name exited before $description; see $log" }
            Thread.sleep(500)
        }
        captureDiagnostics(log.parent.resolve("$name-timeout"))
        error("timed out waiting for $description; see $log")
    }

    fun waitForLogCount(pattern: Regex, expected: Int, timeout: Duration, description: String) {
        val deadline = System.nanoTime() + timeout.toNanos()
        while (System.nanoTime() < deadline) {
            val text = if (log.exists()) log.readText() else ""
            if (pattern.findAll(text).count() >= expected) return
            check(process.isAlive) { "$name exited before $description; see $log" }
            Thread.sleep(500)
        }
        captureDiagnostics(log.parent.resolve("$name-timeout"))
        error("timed out waiting for $description; see $log")
    }

    fun captureDiagnostics(prefix: Path) {
        prefix.parent.createDirectories()
        runCatching {
            ProcessBuilder("ps", "-ef", "--forest").redirectOutput(prefix.resolveSibling("${prefix.name}-processes.txt").toFile()).start().waitFor()
        }
        val handles = sequenceOf(process.toHandle()) + process.descendants().toList().asSequence()
        handles.filter { it.isAlive }.forEach { handle ->
            runCatching {
                ProcessBuilder("jcmd", handle.pid().toString(), "Thread.print")
                    .redirectErrorStream(true)
                    .redirectOutput(prefix.resolveSibling("${prefix.name}-${handle.pid()}-threads.txt").toFile())
                    .start().waitFor(15, TimeUnit.SECONDS)
            }
        }
    }

    fun stop(timeout: Duration = Duration.ofSeconds(20)) {
        runCatching { input.close() }
        val handles = process.descendants().toList().asReversed() + process.toHandle()
        handles.filter { it.isAlive }.forEach { it.destroy() }
        val deadline = System.nanoTime() + timeout.toNanos()
        while (handles.any { it.isAlive } && System.nanoTime() < deadline) Thread.sleep(100)
        handles.filter { it.isAlive }.forEach { it.destroyForcibly() }
        process.waitFor(5, TimeUnit.SECONDS)
    }

    override fun close() = stop()
}

object Commands {
    fun run(command: List<String>, cwd: Path, log: Path, environment: Map<String, String> = emptyMap()) {
        log.parent.createDirectories()
        val builder = ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true).redirectOutput(log.toFile())
        builder.environment().putAll(environment)
        val process = builder.start()
        val status = process.waitFor()
        check(status == 0) { "command failed ($status): ${command.joinToString(" ")}; see $log" }
    }

    fun runWithInput(command: List<String>, cwd: Path, log: Path, input: String, environment: Map<String, String> = emptyMap()) {
        log.parent.createDirectories()
        val builder = ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true).redirectOutput(log.toFile())
        builder.environment().putAll(environment)
        val process = builder.start()
        process.outputStream.bufferedWriter().use { it.write(input) }
        val status = process.waitFor()
        check(status == 0) { "command failed ($status): ${command.joinToString(" ")}; see $log" }
    }
}

fun freePort(): Int = ServerSocket(0).use { it.localPort }

fun replaceExact(path: Path, old: String, replacement: String) {
    val text = path.readText()
    require(text.windowed(old.length).count { it == old } == 1 && replacement !in text) {
        "$path does not contain exactly one expected setting $old"
    }
    path.writeText(text.replace(old, replacement))
}

fun offlineUuid(username: String): String {
    val bytes = MessageDigest.getInstance("MD5").digest("OfflinePlayer:$username".toByteArray())
    bytes[6] = ((bytes[6].toInt() and 0x0f) or 0x30).toByte()
    bytes[8] = ((bytes[8].toInt() and 0x3f) or 0x80).toByte()
    val value = java.nio.ByteBuffer.wrap(bytes)
    return UUID(value.long, value.long).toString().replace("-", "")
}
