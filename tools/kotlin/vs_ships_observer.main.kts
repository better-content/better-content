#!/usr/bin/env kotlin

import java.awt.Robot
import java.awt.Toolkit
import java.awt.image.BufferedImage
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.concurrent.TimeUnit
import javax.imageio.ImageIO
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.system.exitProcess

fun usage(message: String? = null): Nothing {
    if (message != null) System.err.println(message)
    System.err.println("Usage: kotlin tools/kotlin/vs_ships_observer.main.kts --client-dir PATH --argfile PATH --server HOST:PORT --evidence-dir PATH --capture-signal PATH --stop-signal PATH")
    exitProcess(2)
}
fun tail(path: Path, limit: Long = 512_000): String {
    if (!path.exists()) return ""
    path.toFile().inputStream().use { input ->
        input.skip((path.toFile().length() - limit).coerceAtLeast(0))
        return input.readBytes().toString(Charsets.UTF_8)
    }
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

var clientDir: Path? = null
var argfile: Path? = null
var evidenceDir: Path? = null
var captureSignal: Path? = null
var stopSignal: Path? = null
var serverAddress: String? = null
var index = 0
while (index < args.size) {
    when (args[index]) {
        "--client-dir" -> { clientDir = Paths.get(args.getOrNull(index + 1) ?: usage("--client-dir needs a path")); index += 2 }
        "--argfile" -> { argfile = Paths.get(args.getOrNull(index + 1) ?: usage("--argfile needs a path")); index += 2 }
        "--evidence-dir" -> { evidenceDir = Paths.get(args.getOrNull(index + 1) ?: usage("--evidence-dir needs a path")); index += 2 }
        "--capture-signal" -> { captureSignal = Paths.get(args.getOrNull(index + 1) ?: usage("--capture-signal needs a path")); index += 2 }
        "--stop-signal" -> { stopSignal = Paths.get(args.getOrNull(index + 1) ?: usage("--stop-signal needs a path")); index += 2 }
        "--server" -> { serverAddress = args.getOrNull(index + 1) ?: usage("--server needs HOST:PORT"); index += 2 }
        else -> usage("unknown argument: ${args[index]}")
    }
}
val gameDir = clientDir?.toAbsolutePath()?.normalize() ?: usage("--client-dir is required")
val argsFile = argfile?.toAbsolutePath()?.normalize() ?: usage("--argfile is required")
val evidence = evidenceDir?.toAbsolutePath()?.normalize()?.apply { createDirectories() } ?: usage("--evidence-dir is required")
val capture = captureSignal?.toAbsolutePath()?.normalize() ?: usage("--capture-signal is required")
val stop = stopSignal?.toAbsolutePath()?.normalize() ?: usage("--stop-signal is required")
val server = serverAddress ?: usage("--server is required")
val console = evidence.resolve("observer-client-console.log")
val process = ProcessBuilder("java", "-Xms2G", "-Xmx6G", "@${argsFile}")
    .directory(gameDir.toFile())
    .redirectErrorStream(true)
    .redirectOutput(console.toFile())
    .start()
val deadline = System.currentTimeMillis() + 900_000
var captured = false
var connected = false
try {
    while (System.currentTimeMillis() < deadline && process.isAlive && !stop.exists()) {
        val latestText = tail(gameDir.resolve("logs/latest.log"))
        val warningVisible = Regex("shouldersurfing is incompatible with valkyrienskies", RegexOption.IGNORE_CASE).containsMatchIn(latestText)
        val startupFinished = Regex("Game took [0-9.]+ seconds to start", RegexOption.IGNORE_CASE).containsMatchIn(latestText)
        if (!connected && (warningVisible || startupFinished)) {
            Thread.sleep(2_000)
            val robot = Robot()
            val screen = Toolkit.getDefaultToolkit().screenSize
            if (warningVisible) {
                robot.mouseMove(screen.width / 2, screen.height - 43)
                robot.mousePress(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
                robot.mouseRelease(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
                Thread.sleep(2_000)
            }
            robot.mouseMove(screen.width / 2, (screen.height * 0.59).toInt())
            robot.mousePress(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            robot.mouseRelease(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            Thread.sleep(1_500)
            robot.mouseMove(screen.width / 2, (screen.height * 0.817).toInt())
            robot.mousePress(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            robot.mouseRelease(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            Thread.sleep(1_000)
            Toolkit.getDefaultToolkit().systemClipboard.setContents(java.awt.datatransfer.StringSelection(server), null)
            robot.keyPress(java.awt.event.KeyEvent.VK_CONTROL)
            robot.keyPress(java.awt.event.KeyEvent.VK_V)
            robot.keyRelease(java.awt.event.KeyEvent.VK_V)
            robot.keyRelease(java.awt.event.KeyEvent.VK_CONTROL)
            robot.mouseMove(screen.width / 2, (screen.height * 0.743).toInt())
            robot.mousePress(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            robot.mouseRelease(java.awt.event.InputEvent.BUTTON1_DOWN_MASK)
            connected = true
        }
        if (!captured && capture.exists()) {
            Thread.sleep(3_000)
            val image = Robot().createScreenCapture(Toolkit.getDefaultToolkit().screenSize.let { java.awt.Rectangle(it) })
            ImageIO.write(image, "png", evidence.resolve("observer-sync.png").toFile())
            Files.writeString(evidence.resolve("observer-pixels.txt"), "nonblank=${nonblank(image)}\n")
            captured = true
        }
        Thread.sleep(500)
    }
} finally {
    if (process.isAlive) {
        process.destroy()
        if (!process.waitFor(20, TimeUnit.SECONDS)) process.destroyForcibly()
    }
}
val latest = gameDir.resolve("logs/latest.log")
if (latest.exists()) Files.copy(latest, evidence.resolve("observer-latest.log"), java.nio.file.StandardCopyOption.REPLACE_EXISTING)
val hardFailure = Regex("Mod Loading has failed|Preparing crash report|This crash report has been saved|Mixin apply failed|NoClassDefFoundError|NoSuchMethodError", RegexOption.IGNORE_CASE)
val text = tail(console) + "\n" + tail(latest)
exitProcess(if (captured && evidence.resolve("observer-pixels.txt").exists() && !hardFailure.containsMatchIn(text)) 0 else 1)
