#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
FORGE_VERSION=47.4.13
SETTLE_SECONDS="${BC_SMOKE_SETTLE_SECONDS:-10}"
RUN_ROOT="${BC_SMOKE_RUN_ROOT:-$HOME/.cache/bc/smoke}"
SMOKE_USERNAME="${BC_SMOKE_USERNAME:-SmokeClient}"
fail() { printf 'smoke failed: %s\n' "$*" >&2; exit 1; }
for command in java pgrep pipx readlink rg setsid Xvfb; do command -v "$command" >/dev/null || fail "$command is required"; done
JSHELL="$(dirname "$(readlink -f "$(command -v java)")")/jshell"
[ -x "$JSHELL" ] || fail "jshell is required next to the selected Java runtime"
[[ "$SETTLE_SECONDS" =~ ^[0-9]+$ ]] || fail 'BC_SMOKE_SETTLE_SECONDS must be a non-negative integer'
token="$(date -u +%Y%m%dT%H%M%SZ)-$$"
run="$RUN_ROOT/$token"; server="$run/server"; client="$run/client"; client_main="${BC_SMOKE_CLIENT_MAIN:-$HOME/.cache/bc/smoke/client}"; evidence="$run/evidence"
mkdir -p "$evidence"
port="$(python3 - <<'PY'
import socket
s=socket.socket(); s.bind(('127.0.0.1',0)); print(s.getsockname()[1]); s.close()
PY
)"
smoke_uuid="$(BC_SMOKE_USERNAME="$SMOKE_USERNAME" python3 - <<'PY'
import hashlib
import os
import uuid

digest = bytearray(hashlib.md5(f"OfflinePlayer:{os.environ['BC_SMOKE_USERNAME']}".encode()).digest())
digest[6] = (digest[6] & 0x0f) | 0x30
digest[8] = (digest[8] & 0x3f) | 0x80
print(uuid.UUID(bytes=bytes(digest)).hex)
PY
)"
"$ROOT/package.sh" runtime "$server" "$client" "$port" >"$evidence/package.log" 2>&1
server_log="$evidence/server.log"; client_log="$evidence/client.log"; xvfb_log="$evidence/xvfb.log"
server_fifo="$run/server-console.fifo"
mkfifo -m 600 "$server_fifo"
exec 7<>"$server_fifo"
rm -f "$server_fifo"
server_pid=''; client_pid=''; client_game_pid=''; xvfb_pid=''
group_alive() { [ -n "$1" ] && kill -0 -- "-$1" 2>/dev/null; }
stop_group() {
  local group="$1"
  [ -n "$group" ] || return 0
  kill -TERM -- "-$group" 2>/dev/null || return 0
  for _ in {1..20}; do group_alive "$group" || return 0; sleep 1; done
  kill -KILL -- "-$group" 2>/dev/null || true
}
stop_pid() {
  local pid="$1"
  [ -n "$pid" ] || return 0
  kill -TERM "$pid" 2>/dev/null || return 0
  for _ in {1..20}; do kill -0 "$pid" 2>/dev/null || return 0; sleep 1; done
  kill -KILL "$pid" 2>/dev/null || true
}
cleanup() {
  [ -z "$client_game_pid" ] || stop_pid "$client_game_pid"
  [ -z "$client_pid" ] || stop_group "$client_pid"
  [ -z "$server_pid" ] || stop_group "$server_pid"
  active_process="$server/.world_lifecycle_manager/control/active-successor-process-v1.tsv"
  if [ -f "$active_process" ]; then
    active_pid="$(awk -F '\t' '$1 == "pid" { print $2 }' "$active_process")"
    case "$active_pid" in ''|*[!0-9]*) ;; *) kill "$active_pid" 2>/dev/null || true ;; esac
  fi
  [ -z "$xvfb_pid" ] || kill "$xvfb_pid" 2>/dev/null || true
  [ -z "$client_pid" ] || wait "$client_pid" 2>/dev/null || true
  [ -z "$server_pid" ] || wait "$server_pid" 2>/dev/null || true
  [ -z "$xvfb_pid" ] || wait "$xvfb_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

start_server() {
  timeout="$1" interrupt="$2"
  (
    cd "$server"
    export PRESTIGE_HEALTH_TIMEOUT_SECONDS="$timeout"
    export PRESTIGE_HEALTH_STABILITY_SECONDS=1
    export PRESTIGE_TEST_INTERRUPT_AT="$interrupt"
    exec setsid ./run.sh nogui
  ) <&7 >>"$server_log" 2>&1 &
  server_pid=$!
}

wait_for_log() {
  pattern="$1" message="$2" limit="${3:-900}"
  deadline=$((SECONDS+limit))
  until rg -q "$pattern" "$server_log" 2>/dev/null; do
    [ -z "$server_pid" ] || kill -0 "$server_pid" 2>/dev/null || fail "$message; see $server_log"
    ((SECONDS<deadline)) || fail "$message; see $server_log"
    sleep 1
  done
}

wait_for_done_count() {
  expected="$1" message="$2"
  deadline=$((SECONDS+900))
  while :; do
    actual="$(rg -c 'Done \([0-9.]+s\)!.*For help' "$server_log" 2>/dev/null || true)"
    [ "${actual:-0}" -ge "$expected" ] && return
    [ -z "$server_pid" ] || kill -0 "$server_pid" 2>/dev/null || fail "$message; see $server_log"
    ((SECONDS<deadline)) || fail "$message; see $server_log"
    sleep 1
  done
}

console() { printf '%s\n' "$1" >&7; }

start_server 1 ''
wait_for_done_count 1 'initial supervised server readiness timed out'
console 'world_lifecycle_manager perks allocate safe_arrival'
wait_for_log 'Allocated safe_arrival' 'perk allocation failed'
console 'world_lifecycle_manager select minecraft:plains'
wait_for_log 'Selected Prestige biome minecraft:plains' 'prestige biome selection failed'
console 'world_lifecycle_manager stage'
wait_for_log 'Staged prestige reset' 'prestige staging failed'
console 'world_lifecycle_manager commit world'
wait_for_log 'restored old world after 3 failed successor attempts' 'forced lifecycle rollback did not complete' 600
wait_for_done_count 2 'rolled-back world did not restart'
rg -q $'^generation\t0$' "$server/.world_lifecycle_manager/lineage-v4.tsv" \
  || fail 'rollback changed the durable lineage generation'
[ ! -e "$server/.world_lifecycle_manager/perks-v1.tsv" ] || fail 'rollback published active perk state'
console stop
set +e; wait "$server_pid"; rollback_exit=$?; set -e
[ "$rollback_exit" -eq 0 ] || fail "rolled-back server stop exited $rollback_exit"
server_pid=''

start_server 300 health-verified
wait_for_done_count 3 'recovery scenario source world did not restart'
console 'world_lifecycle_manager perks allocate safe_arrival'
wait_for_log 'Allocated safe_arrival' 'recovery scenario perk allocation failed'
console 'world_lifecycle_manager select minecraft:plains'
console 'world_lifecycle_manager stage'
console 'world_lifecycle_manager commit world'
wait_for_log 'test interruption at health-verified' 'health-verified interruption was not reached' 900
set +e; wait "$server_pid"; interrupted_exit=$?; set -e
[ "$interrupted_exit" -eq 86 ] || fail "health-verified interruption exited $interrupted_exit instead of 86"
server_pid=''

start_server 300 ''
wait_for_log 'committed .* successor world is active' 'health-verified transaction did not recover and commit' 600
wait_for_done_count 5 'committed successor world did not restart'
rg -q $'^generation\t1$' "$server/.world_lifecycle_manager/lineage-v4.tsv" \
  || fail 'successful recovery did not advance lineage exactly once'
rg -q $'^perks\tsafe_arrival$' "$server/.world_lifecycle_manager/perks-v1.tsv" \
  || fail 'successful recovery did not publish active perk state'

deadline=$((SECONDS+900))
until rg -q 'Done \([0-9.]+s\)!.*For help' "$server_log" 2>/dev/null; do
  kill -0 "$server_pid" 2>/dev/null || fail "server exited before ready; see $server_log"
  ((SECONDS<deadline)) || fail "server readiness timed out; see $server_log"
  sleep 1
done
display=":$((100+port%100))"
Xvfb "$display" -screen 0 1280x720x24 -nolisten tcp 7<&- >"$xvfb_log" 2>&1 & xvfb_pid=$!
sleep 1; kill -0 "$xvfb_pid" 2>/dev/null || fail "Xvfb failed; see $xvfb_log"
(
  exec 7<&-
  export DISPLAY="$display" LIBGL_ALWAYS_SOFTWARE=1 MESA_GL_VERSION_OVERRIDE=4.6 MESA_GLSL_VERSION_OVERRIDE=460 ALSOFT_DRIVERS=null
  exec setsid pipx run --spec portablemc portablemc --main-dir "$client_main" --work-dir "$client" --timeout 120 start --jvm "$(command -v java)" --jvm-args='-Xms4G -Xmx16G -XX:+UseG1GC -Dfile.encoding=UTF-8' --resolution 1280x720 -u "$SMOKE_USERNAME" -i "$smoke_uuid" -s 127.0.0.1 -p "$port" "forge:1.20.1-$FORGE_VERSION"
) >"$client_log" 2>&1 & client_pid=$!
deadline=$((SECONDS+600))
until rg -Fq "$SMOKE_USERNAME joined the game" "$server_log" 2>/dev/null; do
  group_alive "$client_pid" || fail "client exited before join; see $client_log"
  kill -0 "$server_pid" 2>/dev/null || fail "server exited before join; see $server_log"
  ((SECONDS<deadline)) || fail "client join timed out; see $client_log"
  sleep 1
done
client_game_pid="$(pgrep -f -- "--gameDir $client .*--uuid $smoke_uuid" | head -n 1)"
[[ "$client_game_pid" =~ ^[0-9]+$ ]] || fail 'could not identify the joined Minecraft client JVM'

capture_display() {
  output="$1"
  DISPLAY="$display" "$JSHELL" >"$evidence/gui-capture.log" 2>&1 <<EOF
import java.awt.Robot;
import java.awt.Rectangle;
import java.awt.Toolkit;
import java.io.File;
import javax.imageio.ImageIO;
ImageIO.write(new Robot().createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize())), "png", new File("$output"));
/exit
EOF
  [ -s "$output" ] || fail "GUI screenshot was not captured: $output"
  [ "$(stat -c '%s' "$output")" -gt 10000 ] || fail "GUI screenshot is unexpectedly blank: $output"
}

settle_until=$((SECONDS+SETTLE_SECONDS))
until { ((SECONDS>=settle_until)) && rg -q '\[EMI\] Reloaded EMI in [0-9]+ms' "$client_log" 2>/dev/null \
    && rg -q 'Loaded [0-9]+ advancements' "$client_log" 2>/dev/null; }; do
  kill -0 "$client_game_pid" 2>/dev/null || fail 'client exited before terrain and EMI finished loading'
  kill -0 "$server_pid" 2>/dev/null || fail 'server exited before EMI finished reloading'
  ((SECONDS<deadline)) || fail "client settle or EMI readiness timed out; see $client_log"
  sleep 1
done
console "world_lifecycle_manager gui player $SMOKE_USERNAME configure"
wait_for_log "Opened Prestige configure for $SMOKE_USERNAME" 'configure console command was not accepted'
sleep 2
capture_display "$evidence/world-condenser-configure.png"
console "world_lifecycle_manager gui player $SMOKE_USERNAME perks"
wait_for_log "Opened Prestige perks for $SMOKE_USERNAME" 'perks console command was not accepted'
sleep 2
capture_display "$evidence/world-condenser-perks.png"
cmp -s "$evidence/world-condenser-configure.png" "$evidence/world-condenser-perks.png" \
  && fail 'configure and perks console commands rendered the same GUI frame'
kill -0 "$client_game_pid" 2>/dev/null || fail 'client exited during GUI validation'
kill -0 "$server_pid" 2>/dev/null || fail 'server exited during settle'
stop_pid "$client_game_pid"; client_game_pid=''
stop_group "$client_pid"; wait "$client_pid" 2>/dev/null || true; client_pid=''
console stop
wait "$server_pid"; server_pid=''
kill "$xvfb_pid" 2>/dev/null || true; wait "$xvfb_pid" 2>/dev/null || true; xvfb_pid=''
if rg -n -i 'OutOfMemoryError|fatal error has been detected|crash report|Error loading KubeJS script|(\[|/)ERROR\] \[KubeJS( Startup| Client| Server)?/\]|KubeJS errors found \[[1-9][0-9]*\]|ThreadingDetector|ReportedException' "$server_log" "$client_log"; then fail 'fatal or KubeJS error log signature detected'; fi
trap - EXIT INT TERM
printf 'smoke passed: boot, join, settle, stop, log health\nrun: %s\n' "$run"
