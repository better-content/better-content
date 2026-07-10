#!/usr/bin/env kotlin

import java.awt.Rectangle
import java.awt.Robot
import java.awt.Toolkit
import java.awt.GraphicsEnvironment
import java.awt.datatransfer.StringSelection
import java.awt.event.InputEvent
import java.awt.event.KeyEvent
import java.awt.image.BufferedImage
import java.io.BufferedWriter
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.Instant
import java.util.concurrent.TimeUnit
import javax.imageio.ImageIO
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.system.exitProcess

data class RunningServer(val process: Process, val stdin: BufferedWriter, val log: Path)
data class PhaseResult(val name: String, val status: String, val durationMs: Long, val detail: String? = null)

val root = Paths.get("").toAbsolutePath().normalize()
if ((System.getenv("DISPLAY").isNullOrBlank() || GraphicsEnvironment.isHeadless()) && System.getenv("BTM_VS_XVFB") != "1") {
    val command = listOf("xvfb-run", "-a", "-s", "-screen 0 1280x720x24", "kotlin", "-J-Djava.awt.headless=false", root.resolve("tools/kotlin/vs_ships_client.main.kts").toString()) + args
    val process = ProcessBuilder(command).directory(root.toFile()).inheritIO().apply { environment()["BTM_VS_XVFB"] = "1" }.start()
    exitProcess(process.waitFor())
}

fun usage(message: String? = null): Nothing {
    if (message != null) System.err.println(message)
    System.err.println("Usage: tools/btm test scenario-headful vs_ships_client --profile quick|release [--bootstrap-mode always|once|never] [--port N] [--run-root PATH] [--keep-runs]")
    exitProcess(2)
}
fun q(value: String?) = if (value == null) "null" else "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\""
fun deleteTree(path: Path) {
    if (!path.exists()) return
    Files.walk(path).use { it.sorted(java.util.Comparator.reverseOrder()).forEach(Files::deleteIfExists) }
}
fun tail(path: Path, limit: Long = 1_000_000): String {
    if (!path.exists()) return ""
    path.toFile().inputStream().use { input ->
        input.skip((path.toFile().length() - limit).coerceAtLeast(0))
        return input.readBytes().toString(Charsets.UTF_8)
    }
}
fun run(command: List<String>, timeoutSeconds: Long, output: Path): Int {
    val process = ProcessBuilder(command).directory(root.toFile()).redirectErrorStream(true).redirectOutput(output.toFile()).start()
    if (!process.waitFor(timeoutSeconds, TimeUnit.SECONDS)) {
        process.destroy()
        if (!process.waitFor(10, TimeUnit.SECONDS)) process.destroyForcibly()
        return 124
    }
    return process.exitValue()
}
fun setPort(path: Path, port: Int) {
    val lines = if (path.exists()) Files.readAllLines(path).toMutableList() else mutableListOf()
    val index = lines.indexOfFirst { it.startsWith("server-port=") }
    if (index >= 0) lines[index] = "server-port=$port" else lines += "server-port=$port"
    Files.writeString(path, lines.joinToString("\n", postfix = "\n"))
}
fun startServer(serverDir: Path, port: Int, log: Path): RunningServer {
    setPort(serverDir.resolve("server.properties"), port)
    val process = ProcessBuilder("./run.sh", "nogui").directory(serverDir.toFile()).redirectErrorStream(true).redirectOutput(log.toFile()).start()
    return RunningServer(process, process.outputStream.bufferedWriter(), log)
}
fun send(server: RunningServer, command: String, commands: StringBuilder) {
    commands.appendLine(command)
    server.stdin.write(command)
    server.stdin.newLine()
    server.stdin.flush()
}
fun waitFor(path: Path, pattern: Regex, timeoutSeconds: Long, process: Process? = null, minMatches: Int = 1) {
    val deadline = System.currentTimeMillis() + timeoutSeconds * 1000
    while (System.currentTimeMillis() < deadline) {
        if (process != null && !process.isAlive) error("process exited with ${process.exitValue()} while waiting for ${pattern.pattern}")
        if (pattern.findAll(tail(path)).count() >= minMatches) return
        Thread.sleep(500)
    }
    error("timed out waiting for ${pattern.pattern}")
}
fun stopServer(server: RunningServer?, commands: StringBuilder) {
    if (server == null || !server.process.isAlive) return
    runCatching { send(server, "stop", commands) }
    if (!server.process.waitFor(60, TimeUnit.SECONDS)) {
        server.process.destroy()
        if (!server.process.waitFor(10, TimeUnit.SECONDS)) server.process.destroyForcibly()
    }
}
fun stopProcess(process: Process?) {
    if (process == null || !process.isAlive) return
    process.destroy()
    if (!process.waitFor(20, TimeUnit.SECONDS)) process.destroyForcibly()
}
fun prepareArgfile(clientDir: Path, username: String, port: Int, out: Path, log: Path) {
    val command = listOf(root.resolve("tools/btm").toString(), "internal", "minecraft-client-argfile", "--client-dir", clientDir.toString(), "--version-id", "1.20.1-forge-47.4.13", "--username", username, "--server", "127.0.0.1:$port", "--out", out.toString())
    if (run(command, 600, log) != 0) error("client argument generation failed; see $log")
    Files.writeString(out, Files.readString(out) + "\"--width\"\n\"1280\"\n\"--height\"\n\"720\"\n")
}
fun startClient(clientDir: Path, argfile: Path, console: Path): Process {
    Files.deleteIfExists(clientDir.resolve("logs/latest.log"))
    return ProcessBuilder("java", "-Xms2G", "-Xmx6G", "@${argfile}")
        .directory(clientDir.toFile()).redirectErrorStream(true).redirectOutput(console.toFile()).start()
}
fun configureClient(clientDir: Path) {
    Files.writeString(clientDir.resolve("options.txt"), "guiScale:3\npauseOnLostFocus:false\nautoJump:false\nfullscreen:false\n")
}
fun screenshot(robot: Robot, out: Path): BufferedImage {
    val image = robot.createScreenCapture(Rectangle(Toolkit.getDefaultToolkit().screenSize))
    ImageIO.write(image, "png", out.toFile())
    return image
}
fun nonblank(image: BufferedImage): Boolean {
    val colors = mutableSetOf<Int>()
    var luminance = 0L
    var samples = 0
    for (y in 0 until image.height step 24) for (x in 0 until image.width step 24) {
        val rgb = image.getRGB(x, y)
        colors += rgb
        luminance += ((rgb shr 16) and 255) + ((rgb shr 8) and 255) + (rgb and 255)
        samples++
    }
    return colors.size >= 16 && luminance > samples * 12L
}
fun waitForPlayableFrame(robot: Robot, out: Path, timeoutSeconds: Long): Boolean {
    val deadline = System.currentTimeMillis() + timeoutSeconds * 1000
    while (System.currentTimeMillis() < deadline) {
        val image = screenshot(robot, out)
        if (nonblank(image)) return true
        Thread.sleep(5_000)
    }
    return false
}
fun helmControlsVisible(image: BufferedImage): Boolean {
    fun brightness(x: Int, y: Int): Int {
        val rgb = image.getRGB(x, y)
        return ((rgb shr 16) and 255) + ((rgb shr 8) and 255) + (rgb and 255)
    }
    val center = brightness(image.width / 2, image.height / 2 + 3)
    val leftPanel = brightness((image.width * 0.32).toInt(), (image.height * 0.28).toInt())
    val rightPanel = brightness((image.width * 0.68).toInt(), (image.height * 0.28).toInt())
    return center > 75 && leftPanel < 180 && rightPanel < 180
}
fun click(robot: Robot, x: Int, y: Int, button: Int = InputEvent.BUTTON1_DOWN_MASK) {
    robot.mouseMove(x, y)
    robot.mousePress(button)
    Thread.sleep(150)
    robot.mouseRelease(button)
}
fun rightClickCenter(robot: Robot, sneak: Boolean) {
    val screen = Toolkit.getDefaultToolkit().screenSize
    robot.mouseMove(screen.width / 2, screen.height / 2)
    if (sneak) robot.keyPress(KeyEvent.VK_SHIFT)
    click(robot, screen.width / 2, screen.height / 2, InputEvent.BUTTON3_DOWN_MASK)
    if (sneak) robot.keyRelease(KeyEvent.VK_SHIFT)
}
fun typeChat(robot: Robot, text: String) {
    Toolkit.getDefaultToolkit().systemClipboard.setContents(StringSelection(text), null)
    robot.keyPress(KeyEvent.VK_T)
    robot.keyRelease(KeyEvent.VK_T)
    Thread.sleep(300)
    robot.keyPress(KeyEvent.VK_CONTROL)
    robot.keyPress(KeyEvent.VK_V)
    robot.keyRelease(KeyEvent.VK_V)
    robot.keyRelease(KeyEvent.VK_CONTROL)
    robot.keyPress(KeyEvent.VK_ENTER)
    robot.keyRelease(KeyEvent.VK_ENTER)
    Thread.sleep(500)
}
fun dismissCompatibilityWarning(robot: Robot, clientDir: Path, process: Process, screenshotPath: Path): Boolean {
    val latest = clientDir.resolve("logs/latest.log")
    val warning = Regex("shouldersurfing is incompatible with valkyrienskies", RegexOption.IGNORE_CASE)
    val startupFinished = Regex("Game took [0-9.]+ seconds to start", RegexOption.IGNORE_CASE)
    val deadline = System.currentTimeMillis() + 180_000
    while (System.currentTimeMillis() < deadline && process.isAlive) {
        val text = tail(latest)
        if (warning.containsMatchIn(text)) {
            Thread.sleep(2_000)
            screenshot(robot, screenshotPath)
            val screen = Toolkit.getDefaultToolkit().screenSize
            click(robot, screen.width / 2, screen.height - 43)
            Thread.sleep(2_000)
            return true
        }
        if (startupFinished.containsMatchIn(text)) return false
        Thread.sleep(500)
    }
    return false
}
fun connectFromTitle(robot: Robot, port: Int, screenshotPath: Path) {
    val screen = Toolkit.getDefaultToolkit().screenSize
    screenshot(robot, screenshotPath)
    click(robot, screen.width / 2, (screen.height * 0.59).toInt())
    Thread.sleep(1_500)
    click(robot, screen.width / 2, (screen.height * 0.817).toInt())
    Thread.sleep(1_000)
    Toolkit.getDefaultToolkit().systemClipboard.setContents(StringSelection("127.0.0.1:$port"), null)
    robot.keyPress(KeyEvent.VK_CONTROL)
    robot.keyPress(KeyEvent.VK_V)
    robot.keyRelease(KeyEvent.VK_V)
    robot.keyRelease(KeyEvent.VK_CONTROL)
    Thread.sleep(300)
    click(robot, screen.width / 2, (screen.height * 0.743).toInt())
}
fun assertShips(server: RunningServer, commands: StringBuilder, makeStatic: Boolean, attempts: Int = 1): Int {
    val pattern = Regex("Set ([0-9]+) ships? to be is-static=$makeStatic", RegexOption.IGNORE_CASE)
    repeat(attempts) {
        val previous = pattern.findAll(tail(server.log)).count()
        send(server, "vs set-static @v[] $makeStatic", commands)
        waitFor(server.log, pattern, 30, server.process, previous + 1)
        val count = pattern.findAll(tail(server.log)).last().groupValues[1].toInt()
        if (count > 0) return count
        Thread.sleep(2_000)
    }
    error("ship assertion reported zero ships after $attempts attempt(s)")
}
fun parseLastPosition(text: String, username: String): Triple<Double, Double, Double>? {
    val pattern = Regex("${Regex.escape(username)} has the following entity data: \\[([-+0-9.Ee]+)d, ([-+0-9.Ee]+)d, ([-+0-9.Ee]+)d]")
    return pattern.findAll(text).lastOrNull()?.destructured?.let { (x, y, z) -> Triple(x.toDouble(), y.toDouble(), z.toDouble()) }
}
fun distance(a: Triple<Double, Double, Double>, b: Triple<Double, Double, Double>): Double {
    val dx = a.first - b.first
    val dy = a.second - b.second
    val dz = a.third - b.third
    return kotlin.math.sqrt(dx * dx + dy * dy + dz * dz)
}
fun classify(text: String, error: Throwable): String {
    val message = error.message.orEmpty()
    val phaseChecks = listOf(
        "client_bootstrap_failure" to Regex("runtime preparation|argument generation|prepared client runtime", RegexOption.IGNORE_CASE),
        "ship_assembly_failure" to Regex("helm|assembly|assemble|ship assertion|Found ship", RegexOption.IGNORE_CASE),
        "ship_movement_collision_failure" to Regex("movement|position before|position after|collision", RegexOption.IGNORE_CASE),
        "passenger_sync_failure" to Regex("observer", RegexOption.IGNORE_CASE),
        "ship_save_reload_failure" to Regex("restart|reconnect", RegexOption.IGNORE_CASE),
        "mount_camera_failure" to Regex("mount|dismount|passenger|camera|vehicle", RegexOption.IGNORE_CASE),
    )
    phaseChecks.firstOrNull { it.second.containsMatchIn(message) }?.let { return it.first }
    val logChecks = listOf(
        "client_render_failure" to Regex("ModelBakery|BlockRenderDispatcher|rendering block entity|Tesselating block|RenderSystem|OpenGL.*error|ClientBlockStateColorCache|ClientLevelWrapper.getBlockColor", RegexOption.IGNORE_CASE),
        "flywheel_visual_failure" to Regex("Flywheel.*(?:ERROR|Exception)|Create.*visual.*(?:ERROR|Exception)|Instancing.*(?:ERROR|Exception)", RegexOption.IGNORE_CASE),
        "ship_save_reload_failure" to Regex("Failed to load ship|ShipData.*(?:ERROR|Exception)|corrupt", RegexOption.IGNORE_CASE),
        "dependency_mixin_failure" to Regex("Mixin apply failed|NoClassDefFoundError|ClassNotFoundException|NoSuchMethodError|NoSuchFieldError", RegexOption.IGNORE_CASE),
        "eureka_init_failure" to Regex("(?:ERROR|FATAL|Exception).{0,200}(?:eureka|vs_eureka)", setOf(RegexOption.IGNORE_CASE, RegexOption.DOT_MATCHES_ALL)),
        "clockwork_init_failure" to Regex("(?:ERROR|FATAL|Exception).{0,200}(?:clockwork|vs_clockwork)", setOf(RegexOption.IGNORE_CASE, RegexOption.DOT_MATCHES_ALL)),
        "trackwork_init_failure" to Regex("(?:ERROR|FATAL|Exception).{0,200}trackwork", setOf(RegexOption.IGNORE_CASE, RegexOption.DOT_MATCHES_ALL)),
        "vs_init_failure" to Regex("(?:ERROR|FATAL|Exception).{0,200}(?:valkyrienskies|org\\.valkyrienskies)", setOf(RegexOption.IGNORE_CASE, RegexOption.DOT_MATCHES_ALL)),
    )
    return logChecks.firstOrNull { it.second.containsMatchIn(text) }?.first ?: "unclassified_vs_client_failure"
}

var profile = "quick"
var bootstrapMode = "always"
var keepRuns = false
var runRoot = System.getenv("BTM_HARNESS_RUN_ROOT")?.takeIf(String::isNotBlank)?.let(Paths::get) ?: Paths.get("/tmp/btm-vs-ships-client-quick")
var port = System.getenv("BTM_HARNESS_ACTUAL_PORT")?.toIntOrNull() ?: 25569
var index = 0
while (index < args.size) {
    when (args[index]) {
        "--profile" -> { profile = args.getOrNull(index + 1) ?: usage("--profile needs quick or release"); index += 2 }
        "--bootstrap-mode" -> { bootstrapMode = args.getOrNull(index + 1) ?: usage("--bootstrap-mode needs always, once, or never"); index += 2 }
        "--run-root" -> { runRoot = Paths.get(args.getOrNull(index + 1) ?: usage("--run-root needs a path")); index += 2 }
        "--port" -> { port = args.getOrNull(index + 1)?.toIntOrNull() ?: usage("--port needs a number"); index += 2 }
        "--keep-runs" -> { keepRuns = true; index++ }
        "--help" -> usage()
        else -> usage("unknown argument: ${args[index]}")
    }
}
if (profile !in setOf("quick", "release")) usage("invalid profile: $profile")
if (bootstrapMode !in setOf("always", "once", "never")) usage("invalid bootstrap mode: $bootstrapMode")
runRoot = runRoot.toAbsolutePath().normalize()
if (!keepRuns && bootstrapMode != "never") deleteTree(runRoot)
runRoot.createDirectories()

val serverDir = runRoot.resolve("server")
val pilotDir = runRoot.resolve("pilot-client")
val observerDir = runRoot.resolve("observer-client")
val evidence = runRoot.resolve("evidence").apply { createDirectories() }
val phases = mutableListOf<PhaseResult>()
val commands = StringBuilder("# vs_ships_client commands\n")
var server: RunningServer? = null
var pilot: Process? = null
var observer: Process? = null
var failure: Throwable? = null
var compatibilityWarningObserved = false
var helmGuiAssemblyFailed = false
val robot = Robot().apply { autoDelay = 80 }
fun phase(name: String, block: () -> Unit) {
    val started = System.nanoTime()
    try {
        block()
        phases += PhaseResult(name, "passed", (System.nanoTime() - started) / 1_000_000)
    } catch (error: Throwable) {
        phases += PhaseResult(name, "failed", (System.nanoTime() - started) / 1_000_000, error.message)
        throw error
    }
}

try {
    phase("prepare_runtimes") {
        val shouldPrepareServer = bootstrapMode == "always" || (bootstrapMode == "once" && !serverDir.resolve("run.sh").exists())
        if (shouldPrepareServer) {
            val command = listOf(root.resolve("tools/btm").toString(), "internal", "prepare-server-runtime", "--server-dir", serverDir.toString(), "--port", port.toString(), "--reset-runtime")
            commands.appendLine(command.joinToString(" "))
            if (run(command, 900, evidence.resolve("prepare-server.log")) != 0) error("server runtime preparation failed")
        } else if (!serverDir.resolve("run.sh").exists()) error("prepared server runtime missing: $serverDir")
        val shouldPrepareClient = bootstrapMode == "always" || (bootstrapMode == "once" && !pilotDir.resolve("versions/1.20.1-forge-47.4.13").exists())
        if (shouldPrepareClient) {
            if (!keepRuns) deleteTree(pilotDir)
            val command = listOf(root.resolve("tools/btm").toString(), "internal", "prepare-client-runtime", "--client-dir", pilotDir.toString())
            commands.appendLine(command.joinToString(" "))
            if (run(command, 1_200, evidence.resolve("prepare-client.log")) != 0) error("client runtime preparation failed")
        } else if (!pilotDir.resolve("versions/1.20.1-forge-47.4.13").exists()) error("prepared client runtime missing: $pilotDir")
        configureClient(pilotDir)
        prepareArgfile(pilotDir, "AgentPilot", port, evidence.resolve("pilot.args"), evidence.resolve("pilot-argfile.log"))
        if (profile == "release") {
            deleteTree(observerDir)
            observerDir.createDirectories()
            if (run(listOf("cp", "-a", "--reflink=auto", "${pilotDir}/.", observerDir.toString()), 600, evidence.resolve("clone-observer.log")) != 0) error("observer runtime clone failed")
            configureClient(observerDir)
            prepareArgfile(observerDir, "AgentObserver", port, evidence.resolve("observer.args"), evidence.resolve("observer-argfile.log"))
        }
    }
    phase("server_boot") {
        server = startServer(serverDir, port, evidence.resolve("server-console-boot-1.log"))
        waitFor(server!!.log, Regex("Done \\([0-9.]+s\\)!"), 900, server!!.process)
        send(server!!, "op AgentPilot", commands)
        send(server!!, "forceload add 0 0", commands)
        send(server!!, "fill 0 199 0 2 199 0 minecraft:stone", commands)
        send(server!!, "setblock 0 200 0 vs_eureka:oak_ship_helm[facing=south]", commands)
        send(server!!, "setblock 1 200 0 vs_eureka:engine", commands)
        send(server!!, "setblock 2 200 0 vs_eureka:floater", commands)
        send(server!!, "setblock 6 199 0 minecraft:stone", commands)
        send(server!!, "setblock 6 200 0 vs_clockwork:phys_bearing", commands)
        send(server!!, "setblock 8 199 0 minecraft:stone", commands)
        send(server!!, "setblock 8 200 0 trackwork:phys_track", commands)
        send(server!!, "say BTM_VS_CLIENT_FIXTURE_READY", commands)
        waitFor(server!!.log, Regex("BTM_VS_CLIENT_FIXTURE_READY"), 30, server!!.process)
    }
    phase("client_join_render") {
        val joins = Regex("AgentPilot joined the game").findAll(tail(server!!.log)).count()
        pilot = startClient(pilotDir, evidence.resolve("pilot.args"), evidence.resolve("pilot-client-console-1.log"))
        compatibilityWarningObserved = dismissCompatibilityWarning(robot, pilotDir, pilot!!, evidence.resolve("shouldersurfing-vs-warning.png")) || compatibilityWarningObserved
        connectFromTitle(robot, port, evidence.resolve("pilot-title.png"))
        waitFor(server!!.log, Regex("AgentPilot joined the game"), 900, pilot, joins + 1)
        Thread.sleep(5_000)
        screenshot(robot, evidence.resolve("pilot-loading.png"))
        if (!waitForPlayableFrame(robot, evidence.resolve("pilot-joined.png"), 120)) error("joined client never produced a playable frame")
    }
    phase("helm_assembly") {
        val viewpoints = listOf("0.5 201.5 3.5 180 22", "0.5 201.3 2.8 180 25", "0.5 201.7 4.2 180 18")
        var visibleGui: Path? = null
        for ((attempt, viewpoint) in viewpoints.withIndex()) {
            send(server!!, "tp AgentPilot $viewpoint", commands)
            Thread.sleep(2_000)
            rightClickCenter(robot, sneak = true)
            val attemptPath = evidence.resolve("helm-gui-attempt-${attempt + 1}.png")
            val deadline = System.currentTimeMillis() + 10_000
            while (System.currentTimeMillis() < deadline) {
                val gui = screenshot(robot, attemptPath)
                if (helmControlsVisible(gui)) { visibleGui = attemptPath; break }
                Thread.sleep(1_000)
            }
            if (visibleGui != null) break
            robot.keyPress(KeyEvent.VK_ESCAPE)
            robot.keyRelease(KeyEvent.VK_ESCAPE)
            Thread.sleep(1_000)
        }
        val guiPath = visibleGui ?: error("helm GUI controls remained black after ${viewpoints.size} attempts")
        Files.copy(guiPath, evidence.resolve("helm-gui.png"), StandardCopyOption.REPLACE_EXISTING)
        val screen = Toolkit.getDefaultToolkit().screenSize
        click(robot, screen.width / 2, screen.height / 2 + 3)
        Thread.sleep(500)
        click(robot, screen.width / 2, screen.height / 2 + 3)
        robot.keyPress(KeyEvent.VK_ENTER)
        robot.keyRelease(KeyEvent.VK_ENTER)
        Thread.sleep(3_000)
        val guiAssembled = runCatching { assertShips(server!!, commands, makeStatic = true, attempts = 15) }.isSuccess
        if (!guiAssembled) {
            helmGuiAssemblyFailed = true
            phases += PhaseResult("helm_gui_assembly", "failed", 0, "GUI activation produced no server-side ship; continued with VS assembler item")
            robot.keyPress(KeyEvent.VK_ESCAPE)
            robot.keyRelease(KeyEvent.VK_ESCAPE)
            send(server!!, "item replace entity AgentPilot weapon.mainhand with valkyrienskies:ship_assembler", commands)
            send(server!!, "tp AgentPilot 1.5 204 0.5 0 90", commands)
            Thread.sleep(2_000)
            rightClickCenter(robot, sneak = false)
            assertShips(server!!, commands, makeStatic = true, attempts = 15)
            send(server!!, "item replace entity AgentPilot weapon.mainhand with minecraft:air", commands)
            send(server!!, "tp AgentPilot 0.5 201.5 3.5 180 22", commands)
        }
        screenshot(robot, evidence.resolve("ship-assembled.png"))
    }
    if (profile == "release") {
        phase("observer_join") {
            val captureSignal = evidence.resolve("capture-observer")
            val stopSignal = evidence.resolve("stop-observer")
            Files.deleteIfExists(captureSignal)
            Files.deleteIfExists(stopSignal)
            val command = listOf("xvfb-run", "-a", "-s", "-screen 0 1280x720x24", "kotlin", "-J-Djava.awt.headless=false", root.resolve("tools/kotlin/vs_ships_observer.main.kts").toString(), "--client-dir", observerDir.toString(), "--argfile", evidence.resolve("observer.args").toString(), "--server", "127.0.0.1:$port", "--evidence-dir", evidence.toString(), "--capture-signal", captureSignal.toString(), "--stop-signal", stopSignal.toString())
            commands.appendLine(command.joinToString(" "))
            observer = ProcessBuilder(command).directory(root.toFile()).redirectErrorStream(true).redirectOutput(evidence.resolve("observer-launcher.log").toFile()).start()
            waitFor(server!!.log, Regex("AgentObserver joined the game"), 900, observer)
            send(server!!, "tp AgentObserver AgentPilot", commands)
        }
    }
    phase("mount_movement") {
        rightClickCenter(robot, sneak = false)
        Thread.sleep(2_000)
        assertShips(server!!, commands, makeStatic = false)
        send(server!!, "data get entity AgentPilot Pos", commands)
        Thread.sleep(2_000)
        val before = parseLastPosition(tail(server!!.log), "AgentPilot") ?: error("mount movement position before was unavailable")
        robot.keyPress(KeyEvent.VK_W)
        Thread.sleep(4_000)
        robot.keyRelease(KeyEvent.VK_W)
        Thread.sleep(3_000)
        send(server!!, "data get entity AgentPilot Pos", commands)
        Thread.sleep(2_000)
        val after = parseLastPosition(tail(server!!.log), "AgentPilot") ?: error("mount movement position after was unavailable")
        val moved = distance(before, after)
        Files.writeString(evidence.resolve("movement.txt"), "before=$before\nafter=$after\ndistance=$moved\n")
        if (moved < 0.25) error("mount movement distance was $moved")
        screenshot(robot, evidence.resolve("ship-moved.png"))
        robot.keyPress(KeyEvent.VK_SHIFT)
        Thread.sleep(500)
        robot.keyRelease(KeyEvent.VK_SHIFT)
        assertShips(server!!, commands, makeStatic = true)
        if (profile == "release") {
            Files.writeString(evidence.resolve("capture-observer"), "capture\n")
            val deadline = System.currentTimeMillis() + 60_000
            while (System.currentTimeMillis() < deadline && !evidence.resolve("observer-sync.png").exists()) Thread.sleep(500)
            if (!evidence.resolve("observer-sync.png").exists()) error("observer sync screenshot was not captured")
        }
    }
    phase("client_reconnect") {
        stopProcess(pilot)
        pilot = null
        val joins = Regex("AgentPilot joined the game").findAll(tail(server!!.log)).count()
        pilot = startClient(pilotDir, evidence.resolve("pilot.args"), evidence.resolve("pilot-client-console-2.log"))
        compatibilityWarningObserved = dismissCompatibilityWarning(robot, pilotDir, pilot!!, evidence.resolve("shouldersurfing-vs-warning-reconnect.png")) || compatibilityWarningObserved
        connectFromTitle(robot, port, evidence.resolve("pilot-title-reconnect.png"))
        waitFor(server!!.log, Regex("AgentPilot joined the game"), 900, pilot, joins + 1)
        if (!waitForPlayableFrame(robot, evidence.resolve("pilot-reconnected.png"), 120)) error("reconnect never produced a playable frame")
        assertShips(server!!, commands, makeStatic = true)
    }
    phase("server_restart_reload") {
        stopProcess(pilot)
        pilot = null
        if (profile == "release") {
            Files.writeString(evidence.resolve("stop-observer"), "stop\n")
            if (!observer!!.waitFor(60, TimeUnit.SECONDS)) stopProcess(observer)
            if (observer!!.exitValue() != 0) error("observer client failed")
            observer = null
        }
        send(server!!, "save-all flush", commands)
        stopServer(server, commands)
        server = startServer(serverDir, port, evidence.resolve("server-console-boot-2.log"))
        waitFor(server!!.log, Regex("Done \\([0-9.]+s\\)!"), 900, server!!.process)
        pilot = startClient(pilotDir, evidence.resolve("pilot.args"), evidence.resolve("pilot-client-console-3.log"))
        compatibilityWarningObserved = dismissCompatibilityWarning(robot, pilotDir, pilot!!, evidence.resolve("shouldersurfing-vs-warning-restart.png")) || compatibilityWarningObserved
        connectFromTitle(robot, port, evidence.resolve("pilot-title-restart.png"))
        waitFor(server!!.log, Regex("AgentPilot joined the game"), 900, pilot)
        if (!waitForPlayableFrame(robot, evidence.resolve("pilot-after-server-restart.png"), 120)) error("server restart never produced a playable frame")
        assertShips(server!!, commands, makeStatic = true)
    }
} catch (error: Throwable) {
    failure = error
} finally {
    runCatching { Files.writeString(evidence.resolve("stop-observer"), "stop\n") }
    stopProcess(observer)
    stopProcess(pilot)
    stopServer(server, commands)
}

Files.writeString(runRoot.resolve("commands.log"), commands.toString())
listOf(
    pilotDir.resolve("logs/latest.log") to evidence.resolve("pilot-latest.log"),
    serverDir.resolve("logs/latest.log") to evidence.resolve("server-latest.log"),
).forEach { (source, target) -> if (source.exists()) Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING) }
val allText = Files.walk(evidence).use { stream -> stream.filter(Files::isRegularFile).filter { it.fileName.toString().endsWith(".log") }.toList() }
    .joinToString("\n") { tail(it) }
val classifier = failure?.let { classify(allText, it) } ?: if (helmGuiAssemblyFailed) "ship_assembly_failure" else null
val status = if (failure == null && !helmGuiAssemblyFailed) "passed" else "failed"
val pilotConsoleText = Files.list(evidence).use { stream ->
    stream.filter { it.fileName.toString().matches(Regex("pilot-client-console-.*\\.log")) }.toList()
}.joinToString("\n") { tail(it) }
val dhClientColorFailures = Regex("Failed to get block color for block", RegexOption.IGNORE_CASE).findAll(pilotConsoleText).count()
val metricsJson = """{
  "status": ${q(status)},
  "classifier": ${q(classifier)},
  "profile": ${q(profile)},
  "compatibility_warning_observed": $compatibilityWarningObserved,
  "dh_client_color_failures": $dhClientColorFailures,
  "helm_gui_assembly_failed": $helmGuiAssemblyFailed,
  "phases": [${phases.joinToString(",") { "{\"name\":${q(it.name)},\"status\":${q(it.status)},\"duration_ms\":${it.durationMs},\"detail\":${q(it.detail)}}" }}]
}
"""
Files.writeString(evidence.resolve("metrics.json"), metricsJson)
Files.writeString(runRoot.resolve("metrics.json"), metricsJson)
val registryText = serverDir.resolve("generated/runtime-dumps/registries.json").let { if (it.exists()) Files.readString(it) else "" }
val registryNamespaces = listOf("valkyrienskies", "vs_eureka", "vs_clockwork", "trackwork")
Files.writeString(runRoot.resolve("registry-snapshot.json"), """{
  "namespaces": [${registryNamespaces.joinToString(",") { q(it) }}],
  "unknown_gaps": [${registryNamespaces.filterNot { registryText.contains("$it:") }.joinToString(",") { q(it) }}]
}
""")
Files.writeString(runRoot.resolve("summary.txt"), buildString {
    appendLine("vs_ships_client $status at ${Instant.now()} classifier=${classifier ?: "none"}")
    phases.forEach { appendLine("${it.name}: ${it.status}${it.detail?.let { detail -> " ($detail)" }.orEmpty()}") }
})
Files.writeString(runRoot.resolve("summary.json"), """{
  "scenario": "vs_ships_client",
  "status": ${q(status)},
  "profile": ${q(profile)},
  "classifier": ${q(classifier)},
  "compatibility_warning_observed": $compatibilityWarningObserved,
  "dh_client_color_failures": $dhClientColorFailures,
  "helm_gui_assembly_failed": $helmGuiAssemblyFailed,
  "phases": [${phases.joinToString(",") { "{\"name\":${q(it.name)},\"status\":${q(it.status)},\"duration_ms\":${it.durationMs},\"detail\":${q(it.detail)}}" }}]
}
""")
println("vs_ships_client: $status classifier=${classifier ?: "none"}")
failure?.message?.let { System.err.println(it) }
if (status == "passed" && !keepRuns) {
    deleteTree(serverDir)
    deleteTree(pilotDir)
    deleteTree(observerDir)
}
exitProcess(if (status == "passed") 0 else 1)
