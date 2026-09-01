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
import java.time.Duration

@Tag("multiplayer")
@TestMethodOrder(OrderAnnotation::class)
class MultiplayerRuntimeTest {
    companion object {
        @JvmField @RegisterExtension val evidence = EvidenceExtension("multiplayer")
        lateinit var server: DedicatedServerFixture
        lateinit var client: ClientFixture
        var joined = false
        var settled = false
        var gui = false

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
    fun worldCondenserConfigureScreenOpens() {
        assumeTrue(settled, "client settle prerequisite failed")
        evidence.run.checkpoint("World Condenser GUI") {
            server.send("world_lifecycle_manager gui player ${server.config.username} configure")
            server.waitLog(Regex("Opened Prestige configure for ${Regex.escape(server.config.username)}"), "World Condenser configure GUI", Duration.ofMinutes(2))
            Thread.sleep(2000)
            client.capture("world-condenser-configure.png")
            gui = true
        }
    }

    @Test @Order(4)
    fun multiplayerEvidenceIsCleanAndCandidatesAreUnchanged() {
        assumeTrue(gui, "GUI prerequisite failed")
        evidence.run.checkpoint("multiplayer log and hash audit") {
            client.close()
            server.stopGracefully()
            server.auditLogs()
            server.assertHashes()
            client.assertHashes()
        }
    }
}
