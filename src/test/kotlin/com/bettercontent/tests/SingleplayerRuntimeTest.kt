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

@Tag("singleplayer")
@TestMethodOrder(OrderAnnotation::class)
class SingleplayerRuntimeTest {
    companion object {
        @JvmField @RegisterExtension val evidence = EvidenceExtension("singleplayer")
        lateinit var client: ClientFixture
        var title = false
        var joined = false

        @JvmStatic
        @BeforeAll
        fun start() {
            client = ClientFixture(evidence.run)
            client.prepare()
            client.launchSingleplayer()
        }

        @JvmStatic
        @AfterAll
        fun stop() {
            if (::client.isInitialized) client.close()
            evidence.run.event("process_cleanup", mapOf("complete" to true))
        }
    }

    @Test @Order(1)
    fun clientReachesCustomizedTitleScreen() = evidence.run.checkpoint("single-player title screen") {
        client.waitTitleScreen()
        title = true
    }

    @Test @Order(2)
    fun clientNavigatesIntoFreshIntegratedWorld() {
        assumeTrue(title, "title screen prerequisite failed")
        evidence.run.checkpoint("single-player world join") {
            client.navigateSingleplayer()
            client.capture("singleplayer-navigation.png")
            client.waitSingleplayerJoin()
            client.capture("singleplayer-world.png")
            joined = true
        }
    }

    @Test @Order(3)
    fun singleplayerEvidenceIsCleanAndCandidatesAreUnchanged() {
        assumeTrue(joined, "single-player join prerequisite failed")
        evidence.run.checkpoint("single-player log and hash audit") {
            client.close()
            LogPolicy.requireClean(collectLogs(evidence.run.directory))
            client.assertHashes()
        }
    }
}
