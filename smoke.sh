#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
work="${BC_SMOKE_WORK_DIR:-$ROOT/server-instance}"
settle="${BC_SMOKE_SETTLE_SECONDS:-10}"
server_cmd="${BC_SMOKE_SERVER_COMMAND:-./run.sh nogui}"
client_cmd="${BC_SMOKE_CLIENT_COMMAND:-}"
fail() { printf 'smoke failed: %s\n' "$*" >&2; exit 1; }
[ -n "$client_cmd" ] || fail 'BC_SMOKE_CLIENT_COMMAND is required'
[[ "$settle" =~ ^[0-9]+$ ]] || fail 'BC_SMOKE_SETTLE_SECONDS must be a non-negative integer'
command -v rg >/dev/null || fail 'rg is required'
mkdir -p "$work/logs"
token="$(date -u +%Y%m%dT%H%M%SZ)-$$"
server_log="$work/logs/smoke-server-$token.log"
client_log="$work/logs/smoke-client-$token.log"
server_pid=''; client_pid=''
cleanup() {
  [ -z "$client_pid" ] || kill "$client_pid" 2>/dev/null || true
  [ -z "$server_pid" ] || kill "$server_pid" 2>/dev/null || true
  [ -z "$client_pid" ] || wait "$client_pid" 2>/dev/null || true
  [ -z "$server_pid" ] || wait "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
(cd "$work" && exec bash -lc "$server_cmd") >"$server_log" 2>&1 & server_pid=$!
deadline=$((SECONDS + 300))
until rg -q 'Done \([0-9.]+s\)!|For help, type' "$server_log" 2>/dev/null; do
  kill -0 "$server_pid" 2>/dev/null || fail "server exited before ready; see $server_log"
  ((SECONDS < deadline)) || fail "server readiness timed out; see $server_log"
  sleep 1
done
(cd "$work" && exec bash -lc "$client_cmd") >"$client_log" 2>&1 & client_pid=$!
deadline=$((SECONDS + 300))
until rg -q 'joined the game|Logged in|Connecting to' "$server_log" "$client_log" 2>/dev/null; do
  kill -0 "$client_pid" 2>/dev/null || fail "client exited before join; see $client_log"
  ((SECONDS < deadline)) || fail 'client join timed out'
  sleep 1
done
sleep "$settle"
kill "$client_pid" 2>/dev/null || true; wait "$client_pid" 2>/dev/null || true; client_pid=''
kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; server_pid=''
if rg -n -i 'OutOfMemoryError|fatal error has been detected|crash report|Error loading KubeJS script|Connection reset|ThreadingDetector|ReportedException' "$server_log" "$client_log"; then fail 'fatal log signature detected'; fi
trap - EXIT INT TERM
printf 'smoke passed: boot, join, settle, stop, log health\n'
