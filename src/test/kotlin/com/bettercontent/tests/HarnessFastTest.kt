package com.bettercontent.tests

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import java.nio.file.Files
import java.nio.file.Path
import java.time.Duration
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.createDirectories
import kotlin.io.path.writeText

@Tag("fast")
class HarnessFastTest {
    @Test
    fun activeReleaseInventoryIsUniqueAndMatchesBundledArtifacts() {
        val root = Path.of(System.getProperty("bc.repo.root")).toAbsolutePath().normalize()
        val document = jacksonObjectMapper().readTree(root.resolve("gradle/active-custom-mods.json").toFile())
        assertEquals("bc.active_custom_mods.v1", document.path("schema").asText())
        val mods = document.path("mods")
        assertEquals(33, mods.size())
        assertEquals(33, mods.map { it.path("repository").asText() }.toSet().size)
        assertEquals(33, mods.map { it.path("modId").asText() }.toSet().size)
        mods.forEach { mod ->
            assertTrue(Files.isRegularFile(root.resolve("mods").resolve(mod.path("artifact").asText())))
            assertTrue(mod.path("tasks").isArray && mod.path("tasks").size() > 0)
        }
    }

    @Test
    fun candidateLocatorRejectsMismatchedReleaseDirectories(@TempDir root: Path) {
        zip(root.resolve("dist/a/client/better-content.zip"), mapOf("manifest.json" to "{}"))
        zip(root.resolve("dist/b/server/better-content.zip"), mapOf("server/eula.txt" to "eula=false"))

        val error = assertThrows(IllegalArgumentException::class.java) { CandidateLocator.locate(root) }
        assertTrue(error.message!!.contains("different releases"))
    }

    @Test
    fun hashGuardDetectsChangedCandidate(@TempDir root: Path) {
        val file = root.resolve("candidate.zip")
        file.writeText("before")
        val before = Hashes.sha256(file)
        file.writeText("after")
        assertTrue(before != Hashes.sha256(file))
    }

    @Test
    fun runtimeSnapshotRequiresCompleteConsistentDocuments(@TempDir root: Path) {
        val mapper = jacksonObjectMapper()
        val names = listOf("recipes.json", "registries.json", "tags.json", "mods.json", "loot.json", "trades.json", "worldgen.json", "lighting.json")
        mapper.writeValue(root.resolve("snapshot.json").toFile(), mapOf(
            "schema" to "bc.runtime_dump_completion.v2",
            "complete" to true,
            "evidence_state" to "complete",
            "files" to names,
            "snapshot_id" to "snapshot-1",
            "surfaces" to mapOf("recipes" to mapOf("complete_for_contract" to true)),
        ))
        names.forEach { name ->
            val data = mutableMapOf<String, Any>("snapshot_id" to "snapshot-1")
            if (name == "recipes.json") data.putAll(mapOf("complete" to true, "partial_count" to 0, "error_count" to 0))
            mapper.writeValue(root.resolve(name).toFile(), data)
        }
        assertEquals("snapshot-1", RuntimeSnapshotValidator.validate(root))

        mapper.writeValue(root.resolve("tags.json").toFile(), mapOf("snapshot_id" to "other"))
        assertThrows(IllegalArgumentException::class.java) { RuntimeSnapshotValidator.validate(root) }
    }

    @Test
    fun logPolicyNamesWarningsAndFatalRecords(@TempDir root: Path) {
        val clean = root.resolve("clean.log").also { it.writeText("[INFO] ready\n") }
        val bad = root.resolve("bad.log").also { it.writeText("[Server/WARN] unsafe\nReportedException: boom\n") }
        assertTrue(LogPolicy.findings(listOf(clean)).isEmpty())
        val findings = LogPolicy.findings(listOf(bad))
        assertEquals(2, findings.size)
        assertEquals(listOf(1, 2), findings.map { it.line })
    }

    @Test
    fun managedProcessCapturesOutputAndStops(@TempDir root: Path) {
        val log = root.resolve("process.log")
        ManagedProcess("fixture", listOf("sh", "-c", "echo ready; while :; do sleep 1; done"), root, log).use { process ->
            process.waitForLog(Regex("ready"), Duration.ofSeconds(5), "fixture readiness")
            assertTrue(process.alive)
        }
    }

    private fun zip(path: Path, entries: Map<String, String>) {
        path.parent.createDirectories()
        ZipOutputStream(Files.newOutputStream(path)).use { output ->
            entries.forEach { (name, value) ->
                output.putNextEntry(ZipEntry(name))
                output.write(value.toByteArray())
                output.closeEntry()
            }
        }
    }
}
