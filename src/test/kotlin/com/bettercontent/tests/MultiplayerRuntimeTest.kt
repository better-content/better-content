package com.bettercontent.tests

import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assumptions.assumeTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.junit.jupiter.api.extension.RegisterExtension

@Tag("multiplayer")
@TestMethodOrder(OrderAnnotation::class)
class MultiplayerRuntimeTest {
    companion object {
        @JvmField @RegisterExtension val evidence = EvidenceExtension("multiplayer")
        lateinit var server: DedicatedServerFixture
        lateinit var client: ClientFixture
        var joined = false
        var settled = false

        @JvmStatic
        @BeforeAll
        fun start() {
            server = DedicatedServerFixture(evidence.run)
            client = ClientFixture(evidence.run, server)
        }

        @JvmStatic
        @AfterAll
        fun stop() {
            if (::client.isInitialized) client.close()
            if (::server.isInitialized) server.close()
            evidence.run.event("process_cleanup", mapOf("complete" to true))
        }
    }

    @Test @Order(1)
    fun exactClientJoinsFreshDedicatedServer() = evidence.run.checkpoint("dedicated client join") {
        server.waitReady()
        client.prepare()
        client.launchDedicated()
        client.waitDedicatedJoin()
        joined = true
    }

    @Test @Order(2)
    fun joinedClientSettlesContent() {
        assumeTrue(joined, "client join prerequisite failed")
        evidence.run.checkpoint("client settle") {
            client.waitSettled()
            settled = true
        }
    }

    @Test @Order(3)
    fun multiplayerEvidenceIsCleanAndCandidatesAreUnchanged() {
        assumeTrue(settled, "client settle prerequisite failed")
        evidence.run.checkpoint("multiplayer log and hash audit") {
            client.close()
            server.stopGracefully()
            server.auditLogs()
            server.assertHashes()
            client.assertHashes()
        }
    }
}
