#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
FORGE_COORD=1.20.1-47.4.13
FORGE_VERSION=47.4.13
SETTLE_SECONDS="${BC_SMOKE_SETTLE_SECONDS:-10}"
RUN_ROOT="${BC_SMOKE_RUN_ROOT:-$HOME/.cache/bc/smoke}"
SMOKE_USERNAME="${BC_SMOKE_USERNAME:-SmokeClient}"
fail() { printf 'smoke failed: %s\n' "$*" >&2; exit 1; }
for command in java pipx rg Xvfb; do command -v "$command" >/dev/null || fail "$command is required"; done
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
server_pid=''; client_pid=''; xvfb_pid=''
cleanup() {
  [ -z "$client_pid" ] || kill "$client_pid" 2>/dev/null || true
  [ -z "$server_pid" ] || kill "$server_pid" 2>/dev/null || true
  [ -z "$xvfb_pid" ] || kill "$xvfb_pid" 2>/dev/null || true
  [ -z "$client_pid" ] || wait "$client_pid" 2>/dev/null || true
  [ -z "$server_pid" ] || wait "$server_pid" 2>/dev/null || true
  [ -z "$xvfb_pid" ] || wait "$xvfb_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
(cd "$server" && exec java @user_jvm_args.txt @"libraries/net/minecraftforge/forge/$FORGE_COORD/unix_args.txt" nogui) >"$server_log" 2>&1 & server_pid=$!
deadline=$((SECONDS+900))
until rg -q 'Done \([0-9.]+s\)!.*For help' "$server_log" 2>/dev/null; do
  kill -0 "$server_pid" 2>/dev/null || fail "server exited before ready; see $server_log"
  ((SECONDS<deadline)) || fail "server readiness timed out; see $server_log"
  sleep 1
done
display=":$((100+port%100))"
Xvfb "$display" -screen 0 1280x720x24 -nolisten tcp >"$xvfb_log" 2>&1 & xvfb_pid=$!
sleep 1; kill -0 "$xvfb_pid" 2>/dev/null || fail "Xvfb failed; see $xvfb_log"
(
  export DISPLAY="$display" LIBGL_ALWAYS_SOFTWARE=1 MESA_GL_VERSION_OVERRIDE=4.6 MESA_GLSL_VERSION_OVERRIDE=460 ALSOFT_DRIVERS=null
  exec pipx run --spec portablemc portablemc --main-dir "$client_main" --work-dir "$client" --timeout 120 start --jvm "$(command -v java)" --jvm-args='-Xms4G -Xmx16G -XX:+UseG1GC -Dfile.encoding=UTF-8' --resolution 1280x720 -u "$SMOKE_USERNAME" -i "$smoke_uuid" -s 127.0.0.1 -p "$port" "forge:1.20.1-$FORGE_VERSION"
) >"$client_log" 2>&1 & client_pid=$!
deadline=$((SECONDS+600))
until rg -Fq "$SMOKE_USERNAME joined the game" "$server_log" 2>/dev/null; do
  kill -0 "$client_pid" 2>/dev/null || fail "client exited before join; see $client_log"
  kill -0 "$server_pid" 2>/dev/null || fail "server exited before join; see $server_log"
  ((SECONDS<deadline)) || fail "client join timed out; see $client_log"
  sleep 1
done
settle_until=$((SECONDS+SETTLE_SECONDS))
until { ((SECONDS>=settle_until)) && rg -q '\[EMI\] Reloaded EMI in [0-9]+ms' "$client_log" 2>/dev/null; }; do
  kill -0 "$client_pid" 2>/dev/null || fail 'client exited before EMI finished reloading'
  kill -0 "$server_pid" 2>/dev/null || fail 'server exited before EMI finished reloading'
  ((SECONDS<deadline)) || fail "client settle or EMI readiness timed out; see $client_log"
  sleep 1
done
kill -0 "$client_pid" 2>/dev/null || fail 'client exited during settle'
kill -0 "$server_pid" 2>/dev/null || fail 'server exited during settle'
kill "$client_pid" 2>/dev/null || true; wait "$client_pid" 2>/dev/null || true; client_pid=''
kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; server_pid=''
kill "$xvfb_pid" 2>/dev/null || true; wait "$xvfb_pid" 2>/dev/null || true; xvfb_pid=''
if rg -n -i 'OutOfMemoryError|fatal error has been detected|crash report|Error loading KubeJS script|(\[|/)ERROR\] \[KubeJS( Startup| Client| Server)?/\]|KubeJS errors found \[[1-9][0-9]*\]|ThreadingDetector|ReportedException' "$server_log" "$client_log"; then fail 'fatal or KubeJS error log signature detected'; fi
trap - EXIT INT TERM
printf 'smoke passed: boot, join, settle, stop, log health\nrun: %s\n' "$run"
