package com.bettercontent.tests.release

import com.bettercontent.tests.Hashes
import com.bettercontent.tests.CandidateLocator
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardCopyOption
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.jar.JarFile
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.io.path.name
import kotlin.io.path.readText

data class ActiveMod(
    val repository: String,
    val modId: String,
    val artifact: String,
    val tasks: List<String>,
)

data class ActiveModManifest(val schema: String, val mods: List<ActiveMod>)
data class BuiltMod(val definition: ActiveMod, val commit: String, val jar: Path, val sha256: String)

private val mapper = jacksonObjectMapper()

fun main(args: Array<String>) {
    require(args.size == 2) { "usage: ReleasePipeline ROOT JOBS" }
    val root = Path.of(args[0]).toAbsolutePath().normalize()
    val jobs = args[1].toInt()
    require(jobs in 1..4) { "release jobs must be between 1 and 4" }
    val workspace = root.parent
    val manifest: ActiveModManifest = mapper.readValue(root.resolve("gradle/active-custom-mods.json").toFile())
    require(manifest.schema == "bc.active_custom_mods.v1") { "unexpected active-mod manifest schema" }
    require(manifest.mods.size == 33) { "fresh dist requires exactly 33 active custom mods" }
    require(manifest.mods.map { it.repository }.toSet().size == manifest.mods.size) { "duplicate repository in active-mod manifest" }
    require(manifest.mods.map { it.modId }.toSet().size == manifest.mods.size) { "duplicate mod ID in active-mod manifest" }

    val runId = System.getenv("BC_TEST_RUN_ID")?.takeIf { it.isNotBlank() }
        ?: DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC)
            .format(Instant.now()) + "-" + ProcessHandle.current().pid()
    val evidence = root.resolve("generated/test-evidence/$runId/release").also { it.createDirectories() }
    val staging = evidence.resolve("staged-jars").also { it.createDirectories() }

    val preflight = manifest.mods.map { mod ->
        val repository = workspace.resolve("mod_source").resolve(mod.repository)
        if (!repository.resolve(".git").exists()) "${mod.repository}\tmissing" else {
            val status = capture(repository, listOf("git", "status", "--porcelain"))
            if (status.isBlank()) "${mod.repository}\tclean" else "${mod.repository}\tdirty\t${status.replace('\n', ' ')}"
        }
    }
    Files.writeString(evidence.resolve("preflight.tsv"), preflight.joinToString("\n", postfix = "\n"))
    require(preflight.all { it.endsWith("\tclean") }) { "all active repositories must exist and be clean; see ${evidence.resolve("preflight.tsv")}" }

    val executor = Executors.newFixedThreadPool(jobs)
    val futures = manifest.mods.map { mod -> executor.submit(Callable { build(root, workspace, evidence, staging, mod) }) }
    executor.shutdown()
    val built = mutableListOf<BuiltMod>()
    val failures = mutableListOf<String>()
    futures.forEachIndexed { index, future ->
        try {
            built += future.get()
        } catch (error: Exception) {
            failures += "${manifest.mods[index].repository}: ${error.cause?.message ?: error.message}"
        }
    }
    if (failures.isNotEmpty()) Files.writeString(evidence.resolve("failures.txt"), failures.joinToString("\n", postfix = "\n"))
    require(failures.isEmpty()) { "custom-mod validation failed; nothing was deployed:\n${failures.joinToString("\n")}" }

    val modsDirectory = root.resolve("mods")
    built.forEach { item ->
        Files.list(modsDirectory).use { stream ->
            stream.filter { it.name.endsWith(".jar") && jarDeclaresMod(it, item.definition.modId) }
                .forEach { existing -> if (existing.fileName.toString() != item.definition.artifact) Files.delete(existing) }
        }
        Files.copy(item.jar, modsDirectory.resolve(item.definition.artifact), StandardCopyOption.REPLACE_EXISTING)
    }

    runLogged(root, listOf("packwiz", "refresh"), evidence.resolve("packwiz-refresh.log"))
    runLogged(root, listOf(root.resolve("dist.sh").toString()), evidence.resolve("dist.log"))
    val candidates = CandidateLocator.locate(root)
    val provenance = mapOf(
        "schema" to "bc.fresh_dist_provenance.v1",
        "created_at" to Instant.now().toString(),
        "candidates" to mapOf(
            "client" to candidates.client.toString(),
            "client_sha256" to candidates.clientSha256,
            "server" to candidates.server.toString(),
            "server_sha256" to candidates.serverSha256,
        ),
        "mods" to built.sortedBy { it.definition.repository }.map {
            mapOf(
                "repository" to it.definition.repository,
                "mod_id" to it.definition.modId,
                "commit" to it.commit,
                "artifact" to it.definition.artifact,
                "sha256" to it.sha256,
            )
        },
    )
    mapper.writerWithDefaultPrettyPrinter().writeValue(evidence.resolve("provenance.json").toFile(), provenance)
    println("fresh candidate prepared once; tests have not run yet")
    println("release evidence: $evidence")
}

private fun build(root: Path, workspace: Path, evidence: Path, staging: Path, mod: ActiveMod): BuiltMod {
    val repository = workspace.resolve("mod_source").resolve(mod.repository)
    val log = evidence.resolve("mod-${mod.repository}.log")
    val command = listOf(repository.resolve("gradlew").toString(), "--no-daemon", "clean") + mod.tasks
    runLogged(repository, command, log)
    val jar = repository.resolve("build/libs").resolve(mod.artifact)
    require(Files.isRegularFile(jar)) { "${mod.repository} did not stage ${mod.artifact}" }
    require(jarDeclaresMod(jar, mod.modId)) { "${mod.artifact} does not declare ${mod.modId}" }
    val staged = staging.resolve(mod.artifact)
    Files.copy(jar, staged, StandardCopyOption.REPLACE_EXISTING)
    return BuiltMod(mod, capture(repository, listOf("git", "rev-parse", "HEAD")).trim(), staged, Hashes.sha256(staged))
}

private fun jarDeclaresMod(path: Path, modId: String): Boolean = runCatching {
    JarFile(path.toFile()).use { jar ->
        val entry = jar.getJarEntry("META-INF/mods.toml") ?: return@use false
        jar.getInputStream(entry).bufferedReader().use { reader ->
            Regex("""modId\s*=\s*[\"']${Regex.escape(modId)}[\"']""").containsMatchIn(reader.readText())
        }
    }
}.getOrDefault(false)

private fun runLogged(cwd: Path, command: List<String>, log: Path) {
    log.parent.createDirectories()
    val process = ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true).redirectOutput(log.toFile()).start()
    val status = process.waitFor()
    require(status == 0) { "command failed ($status): ${command.joinToString(" ")}; see $log" }
}

private fun capture(cwd: Path, command: List<String>): String {
    val process = ProcessBuilder(command).directory(cwd.toFile()).redirectErrorStream(true).start()
    val output = process.inputStream.bufferedReader().use { it.readText() }
    require(process.waitFor() == 0) { "command failed: ${command.joinToString(" ")}" }
    return output
}
