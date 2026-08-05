#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
STATE_DIR="$SCRIPT_DIR/.prestige"
CONTROL_DIR="$STATE_DIR/control"
ARCHIVE_DIR="$STATE_DIR/archives"
TRANSACTION_DIR="$STATE_DIR/transactions"
LINEAGE_FILE="$STATE_DIR/lineage-v2.tsv"
LEGACY_LINEAGE_FILE="$STATE_DIR/lineage-v1.tsv"
RESET_FILE="$CONTROL_DIR/reset-request-v2.tsv"
STAGED_FILE="$CONTROL_DIR/staged-request-v2.tsv"
DRAFT_FILE="$CONTROL_DIR/draft-v2.tsv"
SUCCESSOR_FILE="$CONTROL_DIR/successor-request-v2.tsv"
HEALTH_FILE="$CONTROL_DIR/health-result-v2.tsv"
SHUTDOWN_FILE="$CONTROL_DIR/shutdown-request-v2.tsv"
HEALTH_TIMEOUT_SECONDS="${PRESTIGE_HEALTH_TIMEOUT_SECONDS:-300}"
HEALTH_STABILITY_SECONDS="${PRESTIGE_HEALTH_STABILITY_SECONDS:-10}"

die() { printf 'prestige supervisor failed: %s\n' "$*" >&2; exit 1; }

for command in awk base64 cmp cut find flock mkfifo mv od sha256sum sort stat tr unzip xargs zip; do
  command -v "$command" >/dev/null 2>&1 || die "missing required command: $command"
done
[[ -x "$SCRIPT_DIR/run-forge.sh" ]] || die "missing executable Forge launcher: $SCRIPT_DIR/run-forge.sh"
[[ "$HEALTH_TIMEOUT_SECONDS" =~ ^[1-9][0-9]*$ ]] || die "PRESTIGE_HEALTH_TIMEOUT_SECONDS must be positive"
[[ "$HEALTH_STABILITY_SECONDS" =~ ^[0-9]+$ ]] || die "PRESTIGE_HEALTH_STABILITY_SECONDS must be non-negative"

mkdir -p -- "$CONTROL_DIR" "$ARCHIVE_DIR" "$TRANSACTION_DIR"
exec 9>"$STATE_DIR/supervisor.lock"
flock -n 9 || die "another prestige supervisor owns $STATE_DIR/supervisor.lock"

declare -a CONTRACT_LINES=()
load_contract() {
  local path="$1" magic="$2" count="$3"
  [[ -f "$path" && ! -L "$path" ]] || die "contract is not a regular file: $path"
  mapfile -t CONTRACT_LINES < "$path"
  [[ "${#CONTRACT_LINES[@]}" -eq "$count" ]] || die "contract has the wrong line count: $path"
  [[ "${CONTRACT_LINES[0]}" == "$magic" ]] || die "contract has an unsupported version: $path"
}

contract_value() {
  local index="$1" key="$2" line="${CONTRACT_LINES[$1]}" prefix="${2}"$'\t'
  [[ "$line" == "$prefix"* ]] || die "contract field $index is not $key"
  local value="${line#"$prefix"}"
  [[ -n "$value" && "$value" != *$'\t'* && "$value" != *$'\r'* ]] || die "contract field $key is blank or malformed"
  printf '%s' "$value"
}

validate_id() { [[ "$2" =~ ^[a-z0-9][a-z0-9_-]{0,63}$ ]] || die "$1 is outside the identifier contract: $2"; }
validate_world_name() { [[ "$1" =~ ^[A-Za-z0-9._-]{1,128}$ && "$1" != "." && "$1" != ".." ]] || die "unsupported level-name: $1"; }
validate_signed_long() { [[ "$2" =~ ^-?[0-9]+$ ]] || die "$1 is not a signed integer: $2"; }
validate_biome() { [[ "$1" =~ ^[a-z0-9_.-]+:[a-z0-9_./-]+$ ]] || die "biome is not a resource location: $1"; }

atomic_write() {
  local target="$1"; shift
  local partial="${target}.partial"
  [[ ! -e "$partial" ]] || die "partial contract already exists: $partial"
  (umask 077; printf '%s\n' "$@" > "$partial")
  mv -T -- "$partial" "$target"
}

ensure_lineage() {
  if [[ ! -e "$LINEAGE_FILE" ]]; then
    if [[ -f "$LEGACY_LINEAGE_FILE" ]]; then
      load_contract "$LEGACY_LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V1' 3
      LINEAGE_ID="$(contract_value 1 lineage)"
      TOTAL_PRESTIGES="$(contract_value 2 prestige_count)"
      validate_id 'lineage ID' "$LINEAGE_ID"
      [[ "$TOTAL_PRESTIGES" =~ ^[0-9]+$ ]] || die "legacy prestige count is invalid"
      atomic_write "$LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V2' \
        "lineage"$'\t'"$LINEAGE_ID" "total_prestiges"$'\t'"$TOTAL_PRESTIGES" \
        "unspent_points"$'\t'"$TOTAL_PRESTIGES" "generation"$'\t'"$TOTAL_PRESTIGES"
    else
      local entropy
      entropy="$(printf '%s:%s:%s' "$(date +%s%N)" "$$" "$SCRIPT_DIR" | sha256sum | cut -c1-32)"
      atomic_write "$LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V2' \
        "lineage"$'\t'"lineage-$entropy" "total_prestiges"$'\t''0' \
        "unspent_points"$'\t''0' "generation"$'\t''0'
    fi
  fi
  load_contract "$LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V2' 5
  LINEAGE_ID="$(contract_value 1 lineage)"
  TOTAL_PRESTIGES="$(contract_value 2 total_prestiges)"
  UNSPENT_POINTS="$(contract_value 3 unspent_points)"
  GENERATION="$(contract_value 4 generation)"
  validate_id 'lineage ID' "$LINEAGE_ID"
  [[ "$TOTAL_PRESTIGES" =~ ^[0-9]+$ && "$UNSPENT_POINTS" =~ ^[0-9]+$ && "$GENERATION" =~ ^[0-9]+$ ]] \
    || die "lineage counters are invalid"
  (( UNSPENT_POINTS <= TOTAL_PRESTIGES && GENERATION == TOTAL_PRESTIGES )) || die "lineage counters violate MVP invariants"
}

server_property() {
  local key="$1" properties="$SCRIPT_DIR/server.properties" value
  [[ -f "$properties" && ! -L "$properties" ]] || die "missing regular server.properties"
  value="$(awk -F= -v key="$key" '$1 == key { count++; value=substr($0,index($0,"=")+1) } END { if(count==1) print value; else exit 1 }' "$properties")" \
    || die "server.properties must contain exactly one $key entry"
  printf '%s' "$value"
}

set_server_seed() {
  local seed="$1" properties="$SCRIPT_DIR/server.properties" partial="$CONTROL_DIR/server.properties.partial"
  rm -f -- "$partial"
  awk -v seed="$seed" 'BEGIN{found=0} /^level-seed=/{if(found++)exit 40;print "level-seed="seed;next}{print} END{if(!found)print "level-seed="seed}' \
    "$properties" > "$partial" || { rm -f -- "$partial"; die "could not update level-seed"; }
  mv -T -- "$partial" "$properties"
}

random_seed() {
  local seed
  seed="$(od -An -N8 -t d8 /dev/urandom | tr -d '[:space:]')"
  validate_signed_long 'random seed' "$seed"
  printf '%s' "$seed"
}

parse_reset() {
  load_contract "$RESET_FILE" 'BC_PRESTIGE_RESET_V2' 8
  [[ "$(contract_value 1 state)" == committed ]] || die "reset request is not committed"
  REQUEST_LINEAGE="$(contract_value 2 lineage)"
  REQUEST_TRANSACTION="$(contract_value 3 transaction)"
  REQUEST_WORLD="$(contract_value 4 world)"
  REQUEST_OLD_SEED="$(contract_value 5 old_seed)"
  REQUEST_BIOME="$(contract_value 6 biome)"
  [[ "$(contract_value 7 seed_mode)" == random ]] || die "seed mode is not random"
  validate_id 'request lineage ID' "$REQUEST_LINEAGE"; validate_id 'transaction ID' "$REQUEST_TRANSACTION"
  validate_world_name "$REQUEST_WORLD"; validate_signed_long 'old seed' "$REQUEST_OLD_SEED"; validate_biome "$REQUEST_BIOME"
  [[ "$REQUEST_LINEAGE" == "$LINEAGE_ID" ]] || die "reset request lineage does not match durable lineage"
}

write_phase() {
  rm -f -- "$PHASE_FILE.partial"
  atomic_write "$PHASE_FILE" 'BC_PRESTIGE_TRANSACTION_PHASE_V1' \
    "transaction"$'\t'"$REQUEST_TRANSACTION" "phase"$'\t'"$1"
  CURRENT_PHASE="$1"
  if [[ "${PRESTIGE_TEST_INTERRUPT_AT:-}" == "$1" ]]; then
    printf 'prestige supervisor: test interruption at %s\n' "$1" >&2
    exit 86
  fi
}

read_phase() {
  load_contract "$PHASE_FILE" 'BC_PRESTIGE_TRANSACTION_PHASE_V1' 3
  [[ "$(contract_value 1 transaction)" == "$REQUEST_TRANSACTION" ]] || die "transaction phase identity mismatch"
  CURRENT_PHASE="$(contract_value 2 phase)"
}

validate_relative_path() {
  local path="$1"
  [[ -n "$path" && "$path" != /* && "$path" != *'\\'* && "$path" != *$'\n'* && "$path" != *$'\r'* && "$path" != *$'\t'* ]] || die "unsafe archive path: $path"
  [[ "/$path/" != *'/../'* && "/$path/" != *'/./'* && "$path" != *'//'* ]] || die "unsafe archive path segment: $path"
}

generate_archive_manifest() {
  local world="$1" output="$2"
  [[ -d "$world" && ! -L "$world" && -f "$world/level.dat" && ! -L "$world/level.dat" ]] || die "world lacks a regular level.dat"
  local unsafe rows="$output.rows" count=0
  unsafe="$(find "$world" -mindepth 1 -type l -print -quit)"; [[ -z "$unsafe" ]] || die "world contains symbolic link: $unsafe"
  unsafe="$(find "$world" -mindepth 1 ! -type d ! -type f -print -quit)"; [[ -z "$unsafe" ]] || die "world contains special file: $unsafe"
  : > "$rows"
  while IFS= read -r -d '' file; do
    local relative="${file#"$world/"}" encoded size digest
    validate_relative_path "$relative"
    encoded="$(printf '%s' "$relative" | base64 -w0 | tr '+/' '-_' | tr -d '=')"
    size="$(stat -c '%s' -- "$file")"; digest="$(sha256sum -- "$file" | cut -d' ' -f1)"
    printf 'file\t%s\t%s\t%s\n' "$encoded" "$size" "$digest" >> "$rows"; count=$((count+1))
  done < <(find "$world" -type f -print0 | sort -z)
  (( count > 0 )) || die "world inventory is empty"
  { printf 'BC_PRESTIGE_ARCHIVE_V1\nlineage\t%s\ntransaction\t%s\nfile_count\t%s\n' "$REQUEST_LINEAGE" "$REQUEST_TRANSACTION" "$count"; cat -- "$rows"; } > "$output"
  rm -f -- "$rows"
}

verify_archive_against_world() {
  local archive="$1" source_manifest="$2" verify_root="$3"
  rm -rf -- "$verify_root"; mkdir -p -- "$verify_root"
  unzip -tqq "$archive" >/dev/null || die "ZIP CRC verification failed"
  unzip -q "$archive" -d "$verify_root"
  generate_archive_manifest "$verify_root/world" "$verify_root/regenerated-manifest.tsv"
  cmp -s -- "$source_manifest" "$verify_root/prestige-archive-manifest-v1.tsv" || die "archive manifest differs from source"
  cmp -s -- "$source_manifest" "$verify_root/regenerated-manifest.tsv" || die "archive inventory differs from source"
}

create_verified_archive() {
  local input="$1" final="$2" verify="$3" partial="${2%.zip}.partial.zip" manifest="$1/prestige-archive-manifest-v1.tsv"
  generate_archive_manifest "$input/world" "$manifest"
  [[ ! -e "$final" && ! -e "$partial" ]] || die "archive destination already exists"
  (cd -- "$input" && { printf '%s\0' prestige-archive-manifest-v1.tsv; find world -type f -print0 | sort -z; } | xargs -0 zip -q "$partial")
  verify_archive_against_world "$partial" "$manifest" "$verify"
  local digest="$(sha256sum -- "$partial" | cut -d' ' -f1)"
  atomic_write "${final}.sha256" "$digest  $(basename -- "$final")"
  mv -T -- "$partial" "$final"
}

write_successor_request() {
  local attempt="$1" seed="$2"
  rm -f -- "$SUCCESSOR_FILE.partial"
  atomic_write "$SUCCESSOR_FILE" 'BC_PRESTIGE_SUCCESSOR_V2' \
    "lineage"$'\t'"$REQUEST_LINEAGE" "transaction"$'\t'"$REQUEST_TRANSACTION" \
    "successor_seed"$'\t'"$seed" "biome"$'\t'"$REQUEST_BIOME" "attempt"$'\t'"$attempt"
}

health_is_valid() {
  local expected_attempt="$1" expected_seed="$2"
  [[ -f "$HEALTH_FILE" && ! -L "$HEALTH_FILE" ]] || return 1
  mapfile -t CONTRACT_LINES < "$HEALTH_FILE"
  [[ "${#CONTRACT_LINES[@]}" -eq 12 && "${CONTRACT_LINES[0]}" == BC_PRESTIGE_HEALTH_V2 ]] || return 1
  [[ "${CONTRACT_LINES[1]}" == "lineage"$'\t'"$REQUEST_LINEAGE" && "${CONTRACT_LINES[2]}" == "transaction"$'\t'"$REQUEST_TRANSACTION" ]] || return 1
  [[ "${CONTRACT_LINES[3]}" == "successor_seed"$'\t'"$expected_seed" && "${CONTRACT_LINES[4]}" == "actual_seed"$'\t'"$expected_seed" ]] || return 1
  [[ "${CONTRACT_LINES[5]}" == "requested_biome"$'\t'"$REQUEST_BIOME" && "${CONTRACT_LINES[6]}" == "actual_biome"$'\t'"$REQUEST_BIOME" ]] || return 1
  [[ "${CONTRACT_LINES[7]}" == "attempt"$'\t'"$expected_attempt" && "${CONTRACT_LINES[8]}" == "world"$'\t'"$REQUEST_WORLD" ]] || return 1
  [[ "${CONTRACT_LINES[9]}" == "level_dat"$'\t''true' && "${CONTRACT_LINES[10]}" == "fresh_players"$'\t''true' && "${CONTRACT_LINES[11]}" == "status"$'\t''healthy' ]] || return 1
  [[ -f "$SCRIPT_DIR/$REQUEST_WORLD/level.dat" ]]
}

request_successor_shutdown() {
  rm -f -- "$SHUTDOWN_FILE" "$SHUTDOWN_FILE.partial"
  atomic_write "$SHUTDOWN_FILE" 'BC_PRESTIGE_SHUTDOWN_V2' "transaction"$'\t'"$REQUEST_TRANSACTION"
}

stop_console_relay() {
  if [[ -n "${CONSOLE_RELAY_PID:-}" ]]; then kill "$CONSOLE_RELAY_PID" 2>/dev/null || true; wait "$CONSOLE_RELAY_PID" 2>/dev/null || true; CONSOLE_RELAY_PID=''; fi
  exec 8>&- || true
}

stop_failed_server() {
  local pid="$1"
  process_is_live "$pid" || { wait "$pid" 2>/dev/null || true; return; }
  request_successor_shutdown
  local deadline=$((SECONDS+30))
  while process_is_live "$pid" && (( SECONDS < deadline )); do sleep 1; done
  if process_is_live "$pid"; then kill -TERM "$pid" 2>/dev/null || true; sleep 5; fi
  if process_is_live "$pid"; then kill -KILL "$pid" 2>/dev/null || true; fi
  wait "$pid" 2>/dev/null || true
}

process_is_live() {
  local pid="$1" state
  kill -0 "$pid" 2>/dev/null || return 1
  if [[ -r "/proc/$pid/stat" ]]; then
    state="$(awk '{print $3}' "/proc/$pid/stat" 2>/dev/null || true)"
    [[ "$state" != Z ]] || return 1
  fi
  return 0
}

commit_lineage() {
  ensure_lineage
  if (( TOTAL_PRESTIGES == TARGET_TOTAL && UNSPENT_POINTS == TARGET_UNSPENT && GENERATION == TARGET_GENERATION )); then
    return
  fi
  (( TOTAL_PRESTIGES == BASE_TOTAL && UNSPENT_POINTS == BASE_UNSPENT && GENERATION == BASE_GENERATION )) \
    || die "durable lineage changed outside the active transaction"
  rm -f -- "$LINEAGE_FILE.partial"
  atomic_write "$LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V2' \
    "lineage"$'\t'"$LINEAGE_ID" "total_prestiges"$'\t'"$TARGET_TOTAL" \
    "unspent_points"$'\t'"$TARGET_UNSPENT" "generation"$'\t'"$TARGET_GENERATION"
}

load_transaction_lineage() {
  load_contract "$TRANSACTION_ROOT/lineage-before-v2.tsv" 'BC_PRESTIGE_LINEAGE_V2' 5
  [[ "$(contract_value 1 lineage)" == "$REQUEST_LINEAGE" ]] || die "transaction lineage evidence has the wrong identity"
  BASE_TOTAL="$(contract_value 2 total_prestiges)"
  BASE_UNSPENT="$(contract_value 3 unspent_points)"
  BASE_GENERATION="$(contract_value 4 generation)"
  [[ "$BASE_TOTAL" =~ ^[0-9]+$ && "$BASE_UNSPENT" =~ ^[0-9]+$ && "$BASE_GENERATION" =~ ^[0-9]+$ ]] \
    || die "transaction lineage counters are invalid"
  (( BASE_UNSPENT <= BASE_TOTAL && BASE_GENERATION == BASE_TOTAL )) || die "transaction lineage evidence violates MVP invariants"
  TARGET_TOTAL=$((BASE_TOTAL+1)); TARGET_UNSPENT=$((BASE_UNSPENT+1)); TARGET_GENERATION=$((BASE_GENERATION+1))
}

run_successor_attempt() {
  local attempt="$1" seed="$2"; shift 2
  rm -f -- "$HEALTH_FILE" "$HEALTH_FILE.partial" "$SHUTDOWN_FILE" "$SHUTDOWN_FILE.partial"
  write_successor_request "$attempt" "$seed"; set_server_seed "$seed"; write_phase "attempt-$attempt-started"
  printf 'prestige supervisor: launching successor attempt %s/3 seed=%s biome=%s\n' "$attempt" "$seed" "$REQUEST_BIOME"
  local fifo="$CONTROL_DIR/successor-console-$REQUEST_TRANSACTION-$attempt.fifo"
  rm -f -- "$fifo"; mkfifo -m 600 -- "$fifo"; exec 8<>"$fifo"; rm -f -- "$fifo"
  "$SCRIPT_DIR/run-forge.sh" "$@" <&8 9>&- & SUCCESSOR_PID=$!
  printf '%s\n' "$SUCCESSOR_PID" > "$TRANSACTION_ROOT/successor.pid"
  cat <&0 >&8 & CONSOLE_RELAY_PID=$!
  local deadline=$((SECONDS+HEALTH_TIMEOUT_SECONDS))
  while kill -0 "$SUCCESSOR_PID" 2>/dev/null && (( SECONDS < deadline )); do
    if health_is_valid "$attempt" "$seed"; then
      local stable=$((SECONDS+HEALTH_STABILITY_SECONDS))
      while kill -0 "$SUCCESSOR_PID" 2>/dev/null && (( SECONDS < stable )); do sleep 1; done
      kill -0 "$SUCCESSOR_PID" 2>/dev/null || return 1
      return 0
    fi
    sleep 1
  done
  return 1
}

finalize_success() {
  cp -- "$SUCCESSOR_FILE" "$TRANSACTION_ROOT/successor-request-v2.tsv"
  cp -- "$HEALTH_FILE" "$TRANSACTION_ROOT/health-result-v2.tsv"
  write_phase health-verified
  verify_archive_against_world "$FINAL_ARCHIVE" "$ARCHIVE_INPUT/prestige-archive-manifest-v1.tsv" "$VERIFY_ROOT"
  commit_lineage
  if [[ "${PRESTIGE_TEST_INTERRUPT_AT:-}" == lineage-written ]]; then
    printf 'prestige supervisor: test interruption at lineage-written\n' >&2
    exit 86
  fi
  write_phase lineage-committed
  rm -f -- "$RESET_FILE" "$SUCCESSOR_FILE" "$HEALTH_FILE" "$SHUTDOWN_FILE" "$STAGED_FILE" "$DRAFT_FILE"
  rm -rf -- "$ARCHIVE_INPUT/world" "$VERIFY_ROOT"
  printf 'prestige supervisor: committed %s; successor world is active\n' "$REQUEST_TRANSACTION"
}

ensure_lineage
if [[ ! -e "$RESET_FILE" ]]; then
  set +e; "$SCRIPT_DIR/run-forge.sh" "$@"; INITIAL_EXIT=$?; set -e
  [[ -e "$RESET_FILE" ]] || exit "$INITIAL_EXIT"
fi
parse_reset
ACTIVE_WORLD_NAME="$(server_property level-name)"; validate_world_name "$ACTIVE_WORLD_NAME"
[[ "$ACTIVE_WORLD_NAME" == "$REQUEST_WORLD" ]] || die "reset world does not match level-name"
ACTIVE_WORLD="$SCRIPT_DIR/$ACTIVE_WORLD_NAME"
TRANSACTION_ROOT="$TRANSACTION_DIR/$REQUEST_TRANSACTION"
ARCHIVE_INPUT="$TRANSACTION_ROOT/archive-input"; VERIFY_ROOT="$TRANSACTION_ROOT/archive-verify"
PHASE_FILE="$TRANSACTION_ROOT/phase-v1.tsv"

if [[ ! -e "$TRANSACTION_ROOT" ]]; then
  mkdir -p -- "$ARCHIVE_INPUT"
  cp -- "$SCRIPT_DIR/server.properties" "$TRANSACTION_ROOT/server.properties.before"
  cp -- "$RESET_FILE" "$TRANSACTION_ROOT/reset-request-v2.tsv"
  cp -- "$LINEAGE_FILE" "$TRANSACTION_ROOT/lineage-before-v2.tsv"
  write_phase request-recorded
else
  [[ -f "$TRANSACTION_ROOT/reset-request-v2.tsv" ]] || die "existing transaction lacks reset evidence"
  [[ -f "$TRANSACTION_ROOT/lineage-before-v2.tsv" ]] || die "existing transaction lacks lineage evidence"
  cmp -s -- "$RESET_FILE" "$TRANSACTION_ROOT/reset-request-v2.tsv" || die "existing transaction reset identity changed"
  read_phase
fi
load_transaction_lineage
FINAL_ARCHIVE="$ARCHIVE_DIR/${LINEAGE_ID}-p$(printf '%06d' "$TARGET_TOTAL")-${REQUEST_TRANSACTION}.zip"

if [[ "$CURRENT_PHASE" == lineage-committed ]]; then
  rm -f -- "$RESET_FILE" "$SUCCESSOR_FILE" "$HEALTH_FILE" "$SHUTDOWN_FILE" "$STAGED_FILE" "$DRAFT_FILE"
  [[ -d "$ACTIVE_WORLD" ]] || die "committed lineage lacks canonical successor world"
  exec "$SCRIPT_DIR/run-forge.sh" "$@"
fi

if [[ "$CURRENT_PHASE" == health-verified ]]; then
  load_contract "$SUCCESSOR_FILE" 'BC_PRESTIGE_SUCCESSOR_V2' 6
  RECOVER_SEED="$(contract_value 3 successor_seed)"; RECOVER_ATTEMPT="$(contract_value 5 attempt)"
  health_is_valid "$RECOVER_ATTEMPT" "$RECOVER_SEED" || die "persisted health-verified phase no longer validates"
  SUCCESSOR_PID="$(<"$TRANSACTION_ROOT/successor.pid")"
  finalize_success
  if process_is_live "$SUCCESSOR_PID"; then
    stop_failed_server "$SUCCESSOR_PID"
  fi
  rm -f -- "$SHUTDOWN_FILE"
  exec "$SCRIPT_DIR/run-forge.sh" "$@"
fi

if [[ ! -d "$ARCHIVE_INPUT/world" ]]; then
  [[ -d "$ACTIVE_WORLD" && ! -L "$ACTIVE_WORLD" ]] || die "no canonical or staged old world is available"
  mv -T -- "$ACTIVE_WORLD" "$ARCHIVE_INPUT/world"; write_phase world-staged
fi

if [[ ! -f "$FINAL_ARCHIVE" ]]; then
  create_verified_archive "$ARCHIVE_INPUT" "$FINAL_ARCHIVE" "$VERIFY_ROOT"; write_phase archive-verified
else
  [[ -f "$ARCHIVE_INPUT/prestige-archive-manifest-v1.tsv" ]] || generate_archive_manifest "$ARCHIVE_INPUT/world" "$ARCHIVE_INPUT/prestige-archive-manifest-v1.tsv"
  verify_archive_against_world "$FINAL_ARCHIVE" "$ARCHIVE_INPUT/prestige-archive-manifest-v1.tsv" "$VERIFY_ROOT"
fi

START_ATTEMPT=1
if [[ "$CURRENT_PHASE" =~ ^attempt-([1-3])-started$ ]]; then START_ATTEMPT=$((BASH_REMATCH[1]+1)); fi
if [[ -d "$ACTIVE_WORLD" ]]; then
  quarantine="$TRANSACTION_ROOT/interrupted-successor-$(date +%s%N)"; mv -T -- "$ACTIVE_WORLD" "$quarantine"
fi

for ((attempt=START_ATTEMPT; attempt<=3; attempt++)); do
  if [[ -d "$ACTIVE_WORLD" ]]; then mv -T -- "$ACTIVE_WORLD" "$TRANSACTION_ROOT/failed-attempt-$((attempt-1))"; fi
  ATTEMPT_SEED="$(random_seed)"
  if run_successor_attempt "$attempt" "$ATTEMPT_SEED" "$@"; then
    finalize_success
    set +e; wait "$SUCCESSOR_PID"; EXIT_CODE=$?; set -e
    stop_console_relay; exit "$EXIT_CODE"
  fi
  printf 'prestige supervisor: successor attempt %s failed health verification\n' "$attempt" >&2
  if [[ -f "$HEALTH_FILE" ]]; then cp -- "$HEALTH_FILE" "$TRANSACTION_ROOT/failed-attempt-$attempt-health-v2.tsv"; fi
  cp -- "$SUCCESSOR_FILE" "$TRANSACTION_ROOT/failed-attempt-$attempt-request-v2.tsv"
  stop_failed_server "$SUCCESSOR_PID"; stop_console_relay
done

if [[ -d "$ACTIVE_WORLD" ]]; then mv -T -- "$ACTIVE_WORLD" "$TRANSACTION_ROOT/failed-attempt-3"; fi
cp -- "$TRANSACTION_ROOT/server.properties.before" "$SCRIPT_DIR/server.properties"
mv -T -- "$ARCHIVE_INPUT/world" "$ACTIVE_WORLD"
rm -f -- "$RESET_FILE" "$SUCCESSOR_FILE" "$HEALTH_FILE" "$SHUTDOWN_FILE" "$STAGED_FILE" "$DRAFT_FILE"
write_phase rolled-back
printf 'prestige supervisor: restored old world after three failed successor attempts\n' >&2
exec "$SCRIPT_DIR/run-forge.sh" "$@"
