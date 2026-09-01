package com.bettercontent.tests

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.extension.RegisterExtension
import java.util.zip.ZipFile

@Tag("candidate")
@TestMethodOrder(OrderAnnotation::class)
class CandidateContractTest {
    companion object {
        @JvmField
        @RegisterExtension
        val evidence = EvidenceExtension("candidate")

        lateinit var pair: CandidatePair

        @JvmStatic
        @BeforeAll
        fun locate() {
            pair = CandidateLocator.locate(TestConfig.load().root)
            evidence.run.event("candidate_selected", mapOf(
                "client" to pair.client.toString(), "server" to pair.server.toString(),
                "client_sha256" to pair.clientSha256, "server_sha256" to pair.serverSha256,
            ))
        }
    }

    @Test
    @Order(1)
    fun candidatesShareOneReleaseAndHaveStableHashes() {
        assertEquals(pair.release, pair.client.parent.parent)
        assertEquals(pair.release, pair.server.parent.parent)
        assertEquals(64, pair.clientSha256.length)
        assertEquals(64, pair.serverSha256.length)
    }

    @Test
    @Order(2)
    fun serverArchiveHasProductionDefaults() {
        val root = ZipContracts.soleTopLevelDirectory(pair.server)
        val eula = ZipContracts.entryText(pair.server, "$root/eula.txt")
        val properties = ZipContracts.entryText(pair.server, "$root/server.properties")
        val jvm = ZipContracts.entryText(pair.server, "$root/user_jvm_args.txt")
        assertEquals("eula=false\n", eula)
        assertTrue("online-mode=true" in properties)
        assertTrue("server-port=25565" in properties)
        assertTrue("level-type=minecraft\\:normal" in properties || "level-type=minecraft:normal" in properties)
        assertTrue("-Xms4G" in jvm && "-Xmx16G" in jvm)
    }

    @Test
    @Order(3)
    fun candidatesDoNotShipGeneratedRuntimeEvidence() {
        ZipFile(pair.server.toFile()).use { archive ->
            assertFalse(archive.entries().asSequence().any { "/generated/runtime-dumps/" in "/${it.name}" })
        }
        ZipFile(pair.client.toFile()).use { archive ->
            assertFalse(archive.entries().asSequence().any { "generated/runtime-dumps" in it.name })
        }
    }

    @Test
    @Order(4)
    fun contractChecksDoNotMutateCandidates() {
        assertEquals(pair.clientSha256, Hashes.sha256(pair.client))
        assertEquals(pair.serverSha256, Hashes.sha256(pair.server))
    }
}
