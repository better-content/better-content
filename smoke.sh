#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
FORGE_VERSION=47.4.13
SETTLE_SECONDS="${BC_SMOKE_SETTLE_SECONDS:-10}"
RUN_ROOT="${BC_SMOKE_RUN_ROOT:-$HOME/.cache/bc/smoke}"
SMOKE_USERNAME="${BC_SMOKE_USERNAME:-SmokeClient}"
PORT=25565

fail() { printf 'smoke failed: %s\n' "$*" >&2; exit 1; }
for command in awk packwiz pgrep pipx python3 readlink rg setsid sha256sum unzip Xvfb; do
  command -v "$command" >/dev/null 2>&1 || fail "$command is required"
done
[[ "$SETTLE_SECONDS" =~ ^[0-9]+$ ]] || fail 'BC_SMOKE_SETTLE_SECONDS must be a non-negative integer'

if [[ -n "${BC_JAVA:-}" ]]; then
  JAVA_CANDIDATE="$BC_JAVA"
elif [[ -n "${JAVA_HOME:-}" ]]; then
  JAVA_CANDIDATE="$JAVA_HOME/bin/java"
else
  JAVA_CANDIDATE="$(command -v java 2>/dev/null || true)"
fi
[[ -n "$JAVA_CANDIDATE" && -x "$JAVA_CANDIDATE" ]] || fail 'Java was not found; set BC_JAVA or JAVA_HOME to Java 17'
JAVA="$(readlink -f -- "$JAVA_CANDIDATE")"
JAVA_MAJOR="$("$JAVA" -version 2>&1 | awk -F'[\".]' '/version/ { if ($2 == "1") print $3; else print $2; exit }')"
[[ "$JAVA_MAJOR" == 17 ]] || fail "Java 17 is required; $JAVA reports major version ${JAVA_MAJOR:-unknown}"
JSHELL="$(dirname -- "$JAVA")/jshell"
[[ -x "$JSHELL" ]] || fail "jshell is required next to $JAVA"
export BC_JAVA="$JAVA"

shopt -s nullglob
client_candidates=("$ROOT"/dist/*/client/better-content.zip)
server_candidates=("$ROOT"/dist/*/server/better-content.zip)
shopt -u nullglob
[[ "${#client_candidates[@]}" -eq 1 && "${#server_candidates[@]}" -eq 1 ]] \
  || fail 'dist/ must contain exactly one client ZIP and one server ZIP; run ./dist.sh exactly once first'
client_zip="${client_candidates[0]}"
server_zip="${server_candidates[0]}"
client_release="$(dirname -- "$(dirname -- "$client_zip")")"
server_release="$(dirname -- "$(dirname -- "$server_zip")")"
[[ "$client_release" == "$server_release" ]] || fail 'client and server candidates belong to different releases'

client_hash_before="$(sha256sum -- "$client_zip" | awk '{print $1}')"
server_hash_before="$(sha256sum -- "$server_zip" | awk '{print $1}')"
token="$(date -u +%Y%m%dT%H%M%SZ)-$$"
run="$RUN_ROOT/$token"
server_extract="$run/server-extract"
client="$run/client"
evidence="$run/evidence"
client_main="${BC_SMOKE_CLIENT_MAIN:-$HOME/.cache/bc/smoke/client-main}"
mkdir -p -- "$server_extract" "$client" "$evidence"
printf 'client  %s  %s\nserver  %s  %s\n' "$client_hash_before" "$client_zip" \
  "$server_hash_before" "$server_zip" > "$evidence/candidate-sha256-before.txt"

python3 - "$PORT" <<'PY' || fail 'production port 25565 is already in use; faithful smoke will not substitute another port'
import socket, sys
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 0)
try:
    s.bind(('0.0.0.0', int(sys.argv[1])))
finally:
    s.close()
PY

unzip -q -- "$server_zip" -d "$server_extract"
mapfile -t server_roots < <(find "$server_extract" -mindepth 1 -maxdepth 1 -type d -print)
[[ "${#server_roots[@]}" -eq 1 ]] || fail 'server candidate must contain exactly one top-level directory'
server="${server_roots[0]}"
python3 - "$server/eula.txt" "$server/server.properties" <<'PY'
import pathlib, sys
eula, properties = map(pathlib.Path, sys.argv[1:])
def replace_exact(path, old, new):
    text = path.read_text()
    if text.count(old) != 1 or new in text:
        raise SystemExit(f"candidate does not contain exactly one expected setting {old!r}: {path}")
    path.write_text(text.replace(old, new))
replace_exact(eula, 'eula=false', 'eula=true')
replace_exact(properties, 'online-mode=true', 'online-mode=false')
PY

printf 'importing exact CurseForge client candidate: %s\n' "$client_zip"
(
  cd -- "$client"
  packwiz curseforge import "$client_zip" -y
) > "$evidence/client-import.log" 2>&1
"$ROOT/package.sh" resolve "$client" "$client" client > "$evidence/client-artifacts.log" 2>&1

server_log="$evidence/server.log"
client_log="$evidence/client.log"
xvfb_log="$evidence/xvfb.log"
server_fifo="$run/server-console.fifo"
mkfifo -m 600 -- "$server_fifo"
exec 7<>"$server_fifo"
rm -f -- "$server_fifo"
server_pid=''
client_pid=''
client_game_pid=''
xvfb_pid=''

group_alive() { [[ -n "$1" ]] && kill -0 -- "-$1" 2>/dev/null; }
stop_group() {
  local group="$1"
  [[ -n "$group" ]] || return 0
  kill -TERM -- "-$group" 2>/dev/null || return 0
  for _ in {1..20}; do group_alive "$group" || return 0; sleep 1; done
  kill -KILL -- "-$group" 2>/dev/null || true
}
stop_pid() {
  local pid="$1"
  [[ -n "$pid" ]] || return 0
  kill -TERM "$pid" 2>/dev/null || return 0
  for _ in {1..20}; do kill -0 "$pid" 2>/dev/null || return 0; sleep 1; done
  kill -KILL "$pid" 2>/dev/null || true
}
cleanup() {
  [[ -z "$client_game_pid" ]] || stop_pid "$client_game_pid"
  [[ -z "$client_pid" ]] || stop_group "$client_pid"
  [[ -z "$server_pid" ]] || stop_group "$server_pid"
  [[ -z "$xvfb_pid" ]] || kill "$xvfb_pid" 2>/dev/null || true
  [[ -z "$client_pid" ]] || wait "$client_pid" 2>/dev/null || true
  [[ -z "$server_pid" ]] || wait "$server_pid" 2>/dev/null || true
  [[ -z "$xvfb_pid" ]] || wait "$xvfb_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(
  cd -- "$server"
  exec setsid ./run.sh
) <&7 >> "$server_log" 2>&1 &
server_pid=$!

wait_for_log() {
  local pattern="$1" message="$2" deadline=$((SECONDS+${3:-900}))
  until rg -q "$pattern" "$server_log" 2>/dev/null; do
    kill -0 "$server_pid" 2>/dev/null || fail "$message; server exited; see $server_log"
    ((SECONDS < deadline)) || fail "$message; see $server_log"
    sleep 1
  done
}
wait_for_done_count() {
  local expected="$1" message="$2" deadline=$((SECONDS+900)) actual
  while :; do
    actual="$(rg -c 'Done \([0-9.]+s\)!.*For help' "$server_log" 2>/dev/null || true)"
    [[ "${actual:-0}" -ge "$expected" ]] && return
    kill -0 "$server_pid" 2>/dev/null || fail "$message; server exited; see $server_log"
    ((SECONDS < deadline)) || fail "$message; see $server_log"
    sleep 1
  done
}
console() { printf '%s\n' "$1" >&7; }

wait_for_done_count 1 'packaged production server readiness timed out'
console 'world_lifecycle_manager select minecraft:plains minecraft:forest minecraft:meadow'
wait_for_log 'Selected Prestige biomes minecraft:plains > minecraft:forest > minecraft:meadow' 'CLI biome selection failed'
console 'world_lifecycle_manager stage'
wait_for_log 'Staged prestige reset' 'CLI stage did not acknowledge success'
console 'world_lifecycle_manager commit'
wait_for_log 'Prestige commit accepted: .* clean shutdown is scheduled' 'CLI commit did not acknowledge acceptance'
wait_for_log 'committed; successor world is active' 'packaged lifecycle transaction did not commit' 1200
wait_for_done_count 2 'packaged successor server readiness timed out'
rg -q $'^perks\t-$' "$server/.world_lifecycle_manager/perks-v2.tsv" \
  || fail 'successful packaged lifecycle unexpectedly required or allocated a perk'
rg -q $'^generation\t1$' "$server/.world_lifecycle_manager/lineage-v5.tsv" \
  || fail 'successful packaged lifecycle did not advance lineage exactly once'
shopt -s nullglob
archive=("$server"/.world_lifecycle_manager/archives/*.zip)
shopt -u nullglob
[[ "${#archive[@]}" -eq 1 ]] || fail 'successful packaged lifecycle did not publish exactly one archive'
lineage_id="$(awk -F '\t' '$1 == "lineage" {print $2}' "$server/.world_lifecycle_manager/lineage-v5.tsv")"
transaction_id="$(basename -- "${archive[0]}" | sed -E 's/^.*-(transaction-[a-z0-9_-]+)\.zip$/\1/')"
(
  cd -- "$server"
  ./world-lifecycle-manager-server.sh verify-archive "${archive[0]}" "$lineage_id" "$transaction_id"
) > "$evidence/archive-verification.log" 2>&1 || fail 'packaged archive failed its operator verification command'
[[ -s "$server/logs/world-lifecycle-manager-supervisor.log" ]] || fail 'durable supervisor log was not created'

smoke_uuid="$(BC_SMOKE_USERNAME="$SMOKE_USERNAME" python3 - <<'PY'
import hashlib, os, uuid
digest = bytearray(hashlib.md5(f"OfflinePlayer:{os.environ['BC_SMOKE_USERNAME']}".encode()).digest())
digest[6] = (digest[6] & 0x0f) | 0x30
digest[8] = (digest[8] & 0x3f) | 0x80
print(uuid.UUID(bytes=bytes(digest)).hex)
PY
)"
display=":$((200 + $$ % 500))"
Xvfb "$display" -screen 0 1280x720x24 -nolisten tcp 7<&- > "$xvfb_log" 2>&1 &
xvfb_pid=$!
sleep 1
kill -0 "$xvfb_pid" 2>/dev/null || fail "Xvfb failed; see $xvfb_log"
(
  exec 7<&-
  export DISPLAY="$display" LIBGL_ALWAYS_SOFTWARE=1 MESA_GL_VERSION_OVERRIDE=4.6 MESA_GLSL_VERSION_OVERRIDE=460 ALSOFT_DRIVERS=null
  exec setsid pipx run --spec portablemc portablemc --main-dir "$client_main" --work-dir "$client" --timeout 120 \
    start --jvm "$JAVA" --jvm-args='-Xms4G -Xmx16G -XX:+UseG1GC -Dfile.encoding=UTF-8' \
    --resolution 1280x720 -u "$SMOKE_USERNAME" -i "$smoke_uuid" -s 127.0.0.1 -p "$PORT" \
    "forge:1.20.1-$FORGE_VERSION"
) > "$client_log" 2>&1 &
client_pid=$!

deadline=$((SECONDS+600))
until rg -Fq "$SMOKE_USERNAME joined the game" "$server_log" 2>/dev/null; do
  group_alive "$client_pid" || fail "candidate client exited before join; see $client_log"
  kill -0 "$server_pid" 2>/dev/null || fail "candidate server exited before join; see $server_log"
  ((SECONDS < deadline)) || fail "candidate client join timed out; see $client_log"
  sleep 1
done
client_game_pid="$(pgrep -f -- "--gameDir $client .*--uuid $smoke_uuid" | head -n 1)"
[[ "$client_game_pid" =~ ^[0-9]+$ ]] || fail 'could not identify the joined Minecraft client JVM'

settle_until=$((SECONDS+SETTLE_SECONDS))
until { ((SECONDS >= settle_until)) && rg -q '\[EMI\] Reloaded EMI in [0-9]+ms' "$client_log" 2>/dev/null \
    && rg -q 'Loaded [0-9]+ advancements' "$client_log" 2>/dev/null; }; do
  kill -0 "$client_game_pid" 2>/dev/null || fail 'candidate client exited before terrain and EMI finished loading'
  kill -0 "$server_pid" 2>/dev/null || fail 'candidate server exited before client settle completed'
  ((SECONDS < deadline)) || fail "candidate client settle timed out; see $client_log"
  sleep 1
done

# Open the shipped screen over its supported operator-console route. Gameplay mouse buttons are
# intentionally not synthesized: GLFW's grabbed-cursor input is nondeterministic under headless X.
console "world_lifecycle_manager gui player $SMOKE_USERNAME configure"
wait_for_log "Opened Prestige configure for $SMOKE_USERNAME" 'packaged World Condenser GUI command was not accepted'
sleep 2
DISPLAY="$display" "$JSHELL" > "$evidence/condenser-gui-capture.log" 2>&1 <<EOF
import java.awt.Robot;
import java.awt.Rectangle;
import java.awt.Toolkit;
import java.io.File;
import javax.imageio.ImageIO;
var robot = new Robot();
ImageIO.write(robot.createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize())), "png", new File("$evidence/world-condenser-configure.png"));
/exit
EOF
[[ -s "$evidence/world-condenser-configure.png" ]] || fail 'World Condenser GUI screenshot was not captured'

stop_pid "$client_game_pid"
client_game_pid=''
stop_group "$client_pid"
wait "$client_pid" 2>/dev/null || true
client_pid=''
console stop
wait "$server_pid"
server_pid=''
kill "$xvfb_pid" 2>/dev/null || true
wait "$xvfb_pid" 2>/dev/null || true
xvfb_pid=''

if rg -n -i 'OutOfMemoryError|fatal error has been detected|crash report|Error loading KubeJS script|(\[|/)ERROR\] \[KubeJS( Startup| Client| Server)?/\]|KubeJS errors found \[[1-9][0-9]*\]|ThreadingDetector|ReportedException' \
    "$server_log" "$client_log"; then
  fail 'fatal or KubeJS error log signature detected'
fi
client_hash_after="$(sha256sum -- "$client_zip" | awk '{print $1}')"
server_hash_after="$(sha256sum -- "$server_zip" | awk '{print $1}')"
printf 'client  %s  %s\nserver  %s  %s\n' "$client_hash_after" "$client_zip" \
  "$server_hash_after" "$server_zip" > "$evidence/candidate-sha256-after.txt"
[[ "$client_hash_after" == "$client_hash_before" ]] || fail 'client candidate ZIP changed during smoke'
[[ "$server_hash_after" == "$server_hash_before" ]] || fail 'server candidate ZIP changed during smoke'

trap - EXIT INT TERM
printf 'smoke passed: exact candidate lifecycle, join, GUI, settle, stop, and hash identity\n'
printf 'client sha256: %s\nserver sha256: %s\nrun: %s\n' "$client_hash_after" "$server_hash_after" "$run"
