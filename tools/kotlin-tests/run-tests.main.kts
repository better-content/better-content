#!/usr/bin/env kotlin

import java.io.ByteArrayOutputStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.createDirectories
import kotlin.system.exitProcess

data class TestCase(val name: String, val run: () -> Unit)

val root = Paths.get("").toAbsolutePath().normalize()
val tests = mutableListOf<TestCase>()
val activeFilter = System.getenv("BTM_KOTLIN_TEST_FILTER")?.trim()?.takeIf { it.isNotEmpty() }

fun test(name: String, block: () -> Unit) {
    if (activeFilter != null && !name.contains(activeFilter, ignoreCase = true)) return
    tests += TestCase(name, block)
}

fun runCommand(vararg args: String, workdir: Path = root): Pair<Int, String> {
    val process = ProcessBuilder(args.toList())
        .directory(workdir.toFile())
        .redirectErrorStream(true)
        .start()
    val buffer = ByteArrayOutputStream()
    process.inputStream.copyTo(buffer)
    val exit = process.waitFor()
    return exit to buffer.toString(Charsets.UTF_8)
}

fun assertTrue(value: Boolean, message: String) {
    if (!value) error(message)
}

fun assertContains(text: String, needle: String, message: String) {
    assertTrue(text.contains(needle), "$message\nMissing: $needle\nOutput:\n$text")
}

fun assertNotContains(text: String, needle: String, message: String) {
    assertTrue(!text.contains(needle), "$message\nUnexpected: $needle\nOutput:\n$text")
}

test("help shows public commands") {
    val (exit, output) = runCommand("tools/btm", "--help")
    assertTrue(exit == 0, "help should exit 0, got $exit")
    assertContains(output, "tools/btm test static", "help should list static test")
    assertContains(output, "tools/btm build sync server", "help should list build sync server")
    assertContains(output, "tools/btm doctor env", "help should list doctor env")
}

test("runtime without instance is usage error") {
    val (exit, output) = runCommand("tools/btm", "test", "runtime")
    assertTrue(exit == 2, "runtime without instance should exit 2, got $exit")
    assertContains(output, "test runtime requires --instance PATH", "runtime usage error should be specific")
}

test("scenario help shows scenarios") {
    val (exit, output) = runCommand("tools/btm", "test", "scenario", "--help")
    assertTrue(exit == 0, "scenario help should exit 0, got $exit")
    assertContains(output, "Scenarios:", "scenario help should list scenario section")
    assertContains(output, "opening_progression", "scenario help should include opening_progression")
}

test("unknown scenario is a usage error") {
    val (exit, output) = runCommand("tools/btm", "test", "scenario", "not_a_real_scenario")
    assertTrue(exit == 2, "unknown scenario should exit 2, got $exit")
    assertContains(output, "unknown scenario: not_a_real_scenario", "unknown scenario error should be specific")
}

test("doctor repo succeeds") {
    val (exit, output) = runCommand("tools/btm", "doctor", "repo")
    assertTrue(exit == 0, "doctor repo should exit 0, got $exit")
    assertContains(output, "repo check passed", "doctor repo should pass")
}

test("build sync server dry-run works") {
    val temp = Files.createTempDirectory("btm-kotlin-test-sync-server")
    try {
        val (exit, output) = runCommand("tools/btm", "--json", "build", "sync", "server", "--dir", temp.toString(), "--dry-run")
        assertTrue(exit == 0, "server sync dry-run should exit 0, got $exit")
        assertContains(output, "\"status\":\"success\"", "server sync dry-run should report success JSON")
    } finally {
        runCommand("bash", "-lc", "rm -rf '${temp.toString().replace("'", "'\\''")}'")
    }
}

test("build sync client dry-run works") {
    val temp = Files.createTempDirectory("btm-kotlin-test-sync-client")
    try {
        val (exit, output) = runCommand("tools/btm", "--json", "build", "sync", "client", "--dir", temp.toString(), "--dry-run")
        assertTrue(exit == 0, "client sync dry-run should exit 0, got $exit")
        assertContains(output, "\"status\":\"success\"", "client sync dry-run should report success JSON")
    } finally {
        runCommand("bash", "-lc", "rm -rf '${temp.toString().replace("'", "'\\''")}'")
    }
}

test("doctor runtime without instance is usage error") {
    val (exit, output) = runCommand("tools/btm", "doctor", "runtime")
    assertTrue(exit == 2, "doctor runtime without instance should exit 2, got $exit")
    assertContains(output, "doctor runtime requires --instance PATH", "doctor runtime usage error should be specific")
}

test("doctor runtime accepts a minimal runtime shape") {
    val temp = Files.createTempDirectory("btm-kotlin-test-runtime-doctor")
    try {
        temp.resolve("mods").createDirectories()
        temp.resolve("logs").createDirectories()
        temp.resolve("kubejs/config").createDirectories()
        Files.writeString(temp.resolve("logs/latest.log"), "")
        Files.writeString(temp.resolve("run.sh"), "#!/usr/bin/env bash\n")
        val (exit, output) = runCommand("tools/btm", "doctor", "runtime", "--instance", temp.toString())
        assertTrue(exit == 0, "doctor runtime should exit 0 for a minimal runtime shape, got $exit")
        assertContains(output, "runtime check passed", "doctor runtime should report a passing summary")
    } finally {
        runCommand("bash", "-lc", "rm -rf '${temp.toString().replace("'", "'\\''")}'")
    }
}

test("smoke rejects non-numeric port") {
    val (exit, output) = runCommand("tools/btm", "test", "smoke", "--port", "abc")
    assertTrue(exit == 2, "smoke with non-numeric port should exit 2, got $exit")
    assertContains(output, "--port needs a number", "smoke should reject non-numeric ports")
}

test("runtime mod prune removes source jars") {
    val temp = Files.createTempDirectory("btm-kotlin-test-prune-runtime-mods")
    val dest = temp.resolve("mods/synthetic-fixture-sources.jar")
    try {
        Files.createDirectories(dest.parent)
        Files.write(dest, byteArrayOf())
        val (exit, output) = runCommand("tools/btm", "internal", "prune-runtime-mods", "--target-dir", temp.toString(), "--side", "server", "--apply")
        assertTrue(exit == 1, "internal prune-runtime-mods should report missing expected runtime mods on an incomplete temp dir, got $exit")
        assertTrue(!Files.exists(dest), "prune-runtime-mods should remove source jars from runtime mods")
        assertContains(output, "runtime mod prune:", "prune-runtime-mods should report runtime mod summary")
    } finally {
        runCommand("bash", "-lc", "rm -rf '${temp.toString().replace("'", "'\\''")}'")
    }
}

test("internal kubejs assets validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-kubejs-assets")
    assertTrue(exit == 0, "internal validate-kubejs-assets should exit 0, got $exit")
    assertContains(output, "kubejs assets validate", "internal validate-kubejs-assets should report validator summary")
}

test("internal autonomous contracts validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-autonomous-contracts")
    assertTrue(exit == 0, "internal validate-autonomous-contracts should exit 0, got $exit")
    assertContains(output, "autonomous contract validators: 89 pass(es), 0 hard failure(s)", "internal validate-autonomous-contracts should match expected summary")
}

test("internal pack contract validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-pack-contract")
    assertTrue(exit == 0, "internal validate-pack-contract should exit 0, got $exit")
    assertContains(output, "pack contract audit:", "internal validate-pack-contract should report contract audit summary")
}

test("internal contract completeness report runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "contract-completeness-report", "--check", "--no-write")
    assertTrue(exit == 0, "internal contract-completeness-report --check --no-write should exit 0, got $exit")
    assertContains(output, "contract completeness:", "internal contract-completeness-report should report classification summary")
}

test("internal realistic hands validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-realistic-hands")
    assertTrue(exit == 0, "internal validate-realistic-hands should exit 0, got $exit")
    assertContains(output, "Realistic Hands validates", "internal validate-realistic-hands should report validator summary")
}

test("internal js syntax check runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "check-js-syntax")
    assertTrue(exit == 0, "internal check-js-syntax should exit 0, got $exit")
    assertContains(output, "Rhino", "internal check-js-syntax should report Rhino-based syntax validation")
}

test("internal json surface check runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "check-json-surface")
    assertTrue(exit == 0, "internal check-json-surface should exit 0, got $exit")
    assertContains(output, "all repo JSON parses", "internal check-json-surface should report JSON surface validation")
}

test("internal burnt sync check runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "sync-burnt-coverage-tags", "--check")
    assertTrue(exit == 0, "internal sync-burnt-coverage-tags --check should exit 0, got $exit")
    assertContains(output, "missing_rows", "internal sync-burnt-coverage-tags should report missing_rows")
}

test("internal chemistry identity validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-chemistry-identity")
    assertTrue(exit == 0, "internal validate-chemistry-identity should exit 0, got $exit")
    assertContains(output, "chemistry identity matrix validates", "internal validate-chemistry-identity should report validator summary")
}

test("internal player progression contracts validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-player-progression-contracts")
    assertTrue(exit == 0, "internal validate-player-progression-contracts should exit 0, got $exit")
    assertContains(output, "player progression contract validators:", "internal validate-player-progression-contracts should report validator summary")
}

test("internal LC TFTH DH contract validator runs through btm") {
    val (exit, output) = runCommand("tools/btm", "internal", "validate-lc-tfth-dh-contracts")
    assertTrue(exit == 0, "internal validate-lc-tfth-dh-contracts should exit 0, got $exit")
    assertContains(output, "LC/TFTH/DH contract validators:", "internal validate-lc-tfth-dh-contracts should report validator summary")
}

test("LC TFTH scenario fixture validates required jar matching") {
    val script = """
import tempfile
from pathlib import Path
import sys
sys.path.insert(0, "tools")
from lc_tfth_c2me_dh_stability import CONFIG
from portable_minecraft_harness import verify_required_jars

with tempfile.TemporaryDirectory() as tmp:
    mods = Path(tmp) / "mods"
    mods.mkdir()
    for name in [
        "lostcities-1.20-7.4.11.jar",
        "TFTH 1.1b.jar",
        "c2meF-0.2.0+alpha.13-all.jar",
        "DistantHorizons-2.4.5-b-1.20.1-fabric-forge.jar",
        "btmfixes-0.1.0.jar",
    ]:
        (mods / name).write_text("")
    found = verify_required_jars(mods, CONFIG.required_jars)
    assert found["lostcities"].startswith("lostcities")
    assert found["the_flesh_that_hates"].startswith("TFTH")
    assert found["c2me"].startswith("c2meF")
    assert found["DistantHorizons"].startswith("DistantHorizons")
    assert found["btmfixes"].startswith("btmfixes")
print("fixture jar matching ok")
""".trimIndent()
    val (exit, output) = runCommand("python3", "-c", script)
    assertTrue(exit == 0, "LC TFTH fixture jar matching should exit 0, got $exit\n$output")
    assertContains(output, "fixture jar matching ok", "fixture jar matching should report success")
}

test("LC TFTH scenario fixture validates fatal and DH activity regexes") {
    val script = """
import tempfile
from pathlib import Path
import sys
sys.path.insert(0, "tools")
from lc_tfth_c2me_dh_stability import CONFIG
from portable_minecraft_harness import any_log_matches

samples = {
    "modernfix_watchdog": "ModernFix watchdog server thread dump",
    "crash_report": "Preparing crash report with this crash report has been saved",
    "c2me_thread_guard": "ThreadingDetector IllegalStateException accessing LegacyRandomSource from wrong thread",
    "dh_worldgen_exception": "RuntimeException in DistantHorizons BatchGenerator",
    "lostcities_exception": "lostcities LostCityTerrainFeature NullPointerException",
    "tfth_exception": "the_flesh_that_hates FleshBlockSpread IllegalStateException",
    "jvm_fatal": "OutOfMemoryError: Java heap space",
}
for key, sample in samples.items():
    assert CONFIG.fatal_patterns[key].search(sample), key
with tempfile.TemporaryDirectory() as tmp:
    log = Path(tmp) / "latest.log"
    log.write_text("[DistantHorizons] LOD World Gen full data source queued\n")
    assert any_log_matches([log], CONFIG.activity_patterns["distant_horizons"])
print("fixture regex matching ok")
""".trimIndent()
    val (exit, output) = runCommand("python3", "-c", script)
    assertTrue(exit == 0, "LC TFTH fixture regex matching should exit 0, got $exit\n$output")
    assertContains(output, "fixture regex matching ok", "fixture regex matching should report success")
}

test("LC TFTH scenario fixture validates summary classification and arg profiles") {
    val script = """
import sys
from types import SimpleNamespace
sys.path.insert(0, "tools")
import lc_tfth_c2me_dh_stability as scenario
from portable_minecraft_harness import CycleResult

original = sys.argv[:]
try:
    sys.argv = ["lc_tfth_c2me_dh_stability.py"]
    full = scenario.parse_args()
    assert full.cycles == 3
    assert full.idle_seconds == 180
    assert full.tfth_seconds == 120
    sys.argv = ["lc_tfth_c2me_dh_stability.py", "--cycles", "1", "--idle-seconds", "30", "--tfth-seconds", "30"]
    short = scenario.parse_args()
    assert short.cycles == 1
    assert short.idle_seconds == 30
    assert short.tfth_seconds == 30
finally:
    sys.argv = original

passing = [CycleResult(index=1, status="PASS")]
failing = [CycleResult(index=1, status="FAIL")]
assert all(result.status == "PASS" for result in passing) and len(passing) == 1
assert not (all(result.status == "PASS" for result in failing) and len(failing) == 1)
print("fixture profile and summary classification ok")
""".trimIndent()
    val (exit, output) = runCommand("python3", "-c", script)
    assertTrue(exit == 0, "LC TFTH fixture profile/classification should exit 0, got $exit\n$output")
    assertContains(output, "fixture profile and summary classification ok", "fixture profile/classification should report success")
}

test("kotlin test filter runs only matching cases") {
    val (exit, output) = runCommand("tools/btm", "test", "kotlin", "--filter", "doctor repo succeeds")
    assertTrue(exit == 0, "test kotlin --filter should exit 0, got $exit")
    assertContains(output, "ok - doctor repo succeeds", "filtered kotlin tests should include the requested case")
    assertContains(output, "tests: 1, failures: 0", "filtered kotlin tests should run exactly one case")
    assertNotContains(output, "ok - help shows public commands", "filtered kotlin tests should exclude non-matching cases")
}

if (tests.isEmpty()) {
    System.err.println("FAIL - no tests matched filter: ${activeFilter ?: "ALL"}")
    exitProcess(1)
}

var failures = 0
for (case in tests) {
    try {
        case.run()
        println("ok - ${case.name}")
    } catch (error: Throwable) {
        failures += 1
        System.err.println("FAIL - ${case.name}: ${error.message}")
    }
}

println("tests: ${tests.size}, failures: $failures")
exitProcess(if (failures == 0) 0 else 1)
