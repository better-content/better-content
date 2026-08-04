#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
STATE_DIR="$SCRIPT_DIR/.prestige"
CONTROL_DIR="$STATE_DIR/control"
ARCHIVE_DIR="$STATE_DIR/archives"
TRANSACTION_DIR="$STATE_DIR/transactions"
LINEAGE_FILE="$STATE_DIR/lineage-v1.tsv"
RESET_FILE="$CONTROL_DIR/reset-request-v1.tsv"
STAGED_FILE="$CONTROL_DIR/staged-request-v1.tsv"
SUCCESSOR_FILE="$CONTROL_DIR/successor-request-v1.tsv"
HEALTH_FILE="$CONTROL_DIR/health-result-v1.tsv"
SHUTDOWN_FILE="$CONTROL_DIR/shutdown-request-v1.tsv"
HEALTH_TIMEOUT_SECONDS="${PRESTIGE_HEALTH_TIMEOUT_SECONDS:-300}"
HEALTH_STABILITY_SECONDS="${PRESTIGE_HEALTH_STABILITY_SECONDS:-10}"

die() {
  printf 'prestige supervisor failed: %s\n' "$*" >&2
  exit 1
}

for command in awk base64 cmp cut find flock mkfifo mv sha256sum sort stat unzip xargs zip; do
  command -v "$command" >/dev/null 2>&1 || die "missing required command: $command"
done
[[ -x "$SCRIPT_DIR/run.sh" ]] || die "missing executable Forge launcher: $SCRIPT_DIR/run.sh"
[[ "$HEALTH_TIMEOUT_SECONDS" =~ ^[1-9][0-9]*$ ]] || die "PRESTIGE_HEALTH_TIMEOUT_SECONDS must be positive"
[[ "$HEALTH_STABILITY_SECONDS" =~ ^[0-9]+$ ]] || die "PRESTIGE_HEALTH_STABILITY_SECONDS must be non-negative"

mkdir -p -- "$CONTROL_DIR" "$ARCHIVE_DIR" "$TRANSACTION_DIR"
exec 9>"$STATE_DIR/supervisor.lock"
flock -n 9 || die "another prestige supervisor owns $STATE_DIR/supervisor.lock"

declare -a CONTRACT_LINES=()

load_contract() {
  local path="$1"
  local magic="$2"
  local count="$3"
  [[ -f "$path" && ! -L "$path" ]] || die "contract is not a regular file: $path"
  mapfile -t CONTRACT_LINES < "$path"
  [[ "${#CONTRACT_LINES[@]}" -eq "$count" ]] || die "contract has the wrong line count: $path"
  [[ "${CONTRACT_LINES[0]}" == "$magic" ]] || die "contract has an unsupported version: $path"
}

contract_value() {
  local index="$1"
  local key="$2"
  local line="${CONTRACT_LINES[$index]}"
  local prefix="${key}"$'\t'
  [[ "$line" == "$prefix"* ]] || die "contract field $index is not $key"
  local value="${line#"$prefix"}"
  [[ -n "$value" && "$value" != *$'\t'* && "$value" != *$'\r'* ]] || die "contract field $key is blank or malformed"
  printf '%s' "$value"
}

validate_id() {
  [[ "$2" =~ ^[a-z0-9][a-z0-9_-]{0,63}$ ]] || die "$1 is outside the v1 identifier contract: $2"
}

validate_world_name() {
  [[ "$1" =~ ^[A-Za-z0-9._-]{1,128}$ && "$1" != "." && "$1" != ".." ]] || die "unsupported level-name: $1"
}

validate_signed_long() {
  [[ "$2" =~ ^-?[0-9]+$ ]] || die "$1 is not a signed integer: $2"
}

atomic_write() {
  local target="$1"
  shift
  local partial="${target}.partial"
  [[ ! -e "$partial" ]] || die "partial contract already exists: $partial"
  (umask 077; printf '%s\n' "$@" > "$partial")
  mv -T -- "$partial" "$target"
}

ensure_lineage() {
  if [[ ! -e "$LINEAGE_FILE" ]]; then
    local entropy
    entropy="$(printf '%s:%s:%s' "$(date +%s%N)" "$$" "$SCRIPT_DIR" | sha256sum | cut -c1-32)"
    atomic_write "$LINEAGE_FILE" \
      'BC_PRESTIGE_LINEAGE_V1' \
      "lineage"$'\t'"lineage-$entropy" \
      "prestige_count"$'\t''0'
  fi
  load_contract "$LINEAGE_FILE" 'BC_PRESTIGE_LINEAGE_V1' 3
  LINEAGE_ID="$(contract_value 1 lineage)"
  PRESTIGE_COUNT="$(contract_value 2 prestige_count)"
  validate_id 'lineage ID' "$LINEAGE_ID"
  [[ "$PRESTIGE_COUNT" =~ ^[0-9]+$ ]] || die "prestige count is not non-negative"
}

server_property() {
  local key="$1"
  local properties="$SCRIPT_DIR/server.properties"
  [[ -f "$properties" && ! -L "$properties" ]] || die "missing regular server.properties"
  local value
  value="$(awk -F= -v key="$key" '$1 == key { count++; value=substr($0, index($0,"=")+1) } END { if (count == 1) print value; else exit 1 }' "$properties")" \
    || die "server.properties must contain exactly one $key entry"
  printf '%s' "$value"
}

set_server_seed() {
  local seed="$1"
  local properties="$SCRIPT_DIR/server.properties"
  local partial="$CONTROL_DIR/server.properties.partial"
  [[ ! -e "$partial" ]] || die "stale server.properties partial exists"
  awk -v seed="$seed" '
    BEGIN { found=0 }
    /^level-seed=/ { if (found++) exit 40; print "level-seed=" seed; next }
    { print }
    END { if (!found) print "level-seed=" seed }
  ' "$properties" > "$partial" || { rm -f -- "$partial"; die "could not update level-seed"; }
  mv -T -- "$partial" "$properties"
}

parse_reset() {
  load_contract "$RESET_FILE" 'BC_PRESTIGE_RESET_V1' 8
  [[ "$(contract_value 1 state)" == 'committed' ]] || die "reset request is not committed"
  REQUEST_LINEAGE="$(contract_value 2 lineage)"
  REQUEST_TRANSACTION="$(contract_value 3 transaction)"
  REQUEST_WORLD="$(contract_value 4 world)"
  REQUEST_OLD_SEED="$(contract_value 5 old_seed)"
  REQUEST_SUCCESSOR_SEED="$(contract_value 6 successor_seed)"
  REQUEST_IMPACT="$(contract_value 7 impact)"
  validate_id 'request lineage ID' "$REQUEST_LINEAGE"
  validate_id 'request transaction ID' "$REQUEST_TRANSACTION"
  validate_world_name "$REQUEST_WORLD"
  validate_signed_long 'old seed' "$REQUEST_OLD_SEED"
  validate_signed_long 'successor seed' "$REQUEST_SUCCESSOR_SEED"
  [[ "$REQUEST_IMPACT" == 'any' ]] || die "impact profile is not allowlisted: $REQUEST_IMPACT"
  [[ "$REQUEST_LINEAGE" == "$LINEAGE_ID" ]] || die "reset request lineage does not match durable lineage"
}

validate_relative_path() {
  local path="$1"
  [[ -n "$path" && "$path" != /* && "$path" != *'\\'* && "$path" != *$'\n'* && "$path" != *$'\r'* && "$path" != *$'\t'* ]] \
    || die "unsafe archive path: $path"
  [[ "/$path/" != *'/../'* && "/$path/" != *'/./'* && "$path" != *'//'* ]] || die "unsafe archive path segment: $path"
}

generate_archive_manifest() {
  local world="$1"
  local output="$2"
  [[ -d "$world" && ! -L "$world" ]] || die "world is not a regular directory: $world"
  [[ -f "$world/level.dat" && ! -L "$world/level.dat" ]] || die "world does not contain a regular level.dat"
  local unsafe
  unsafe="$(find "$world" -mindepth 1 -type l -print -quit)"
  [[ -z "$unsafe" ]] || die "world contains a symbolic link: $unsafe"
  unsafe="$(find "$world" -mindepth 1 ! -type d ! -type f -print -quit)"
  [[ -z "$unsafe" ]] || die "world contains a non-regular file: $unsafe"

  local rows="$output.rows"
  : > "$rows"
  local count=0
  while IFS= read -r -d '' file; do
    local relative="${file#"$world/"}"
    validate_relative_path "$relative"
    local encoded size digest
    encoded="$(printf '%s' "$relative" | base64 -w0 | tr '+/' '-_' | tr -d '=')"
    size="$(stat -c '%s' -- "$file")"
    digest="$(sha256sum -- "$file" | cut -d' ' -f1)"
    printf 'file\t%s\t%s\t%s\n' "$encoded" "$size" "$digest" >> "$rows"
    count=$((count + 1))
  done < <(find "$world" -type f -print0 | sort -z)
  [[ "$count" -gt 0 ]] || die "world inventory is empty"
  {
    printf 'BC_PRESTIGE_ARCHIVE_V1\n'
    printf 'lineage\t%s\n' "$REQUEST_LINEAGE"
    printf 'transaction\t%s\n' "$REQUEST_TRANSACTION"
    printf 'file_count\t%s\n' "$count"
    cat -- "$rows"
  } > "$output"
  rm -f -- "$rows"
}

create_verified_archive() {
  local archive_input="$1"
  local final_archive="$2"
  local partial_archive="${final_archive%.zip}.partial.zip"
  local manifest="$archive_input/prestige-archive-manifest-v1.tsv"
  local verify_root="$3"
  [[ ! -e "$final_archive" && ! -e "$partial_archive" ]] || die "archive destination already exists"
  generate_archive_manifest "$archive_input/world" "$manifest"
  (
    cd -- "$archive_input"
    {
      printf '%s\0' prestige-archive-manifest-v1.tsv
      find world -type f -print0 | sort -z
    } | xargs -0 zip -q "$partial_archive"
  )
  unzip -tqq "$partial_archive" >/dev/null || die "ZIP CRC verification failed"
  mkdir -p -- "$verify_root"
  unzip -q "$partial_archive" -d "$verify_root"
  [[ -f "$verify_root/prestige-archive-manifest-v1.tsv" ]] || die "verified extraction lacks manifest"
  generate_archive_manifest "$verify_root/world" "$verify_root/regenerated-manifest.tsv"
  cmp -s -- "$manifest" "$verify_root/prestige-archive-manifest-v1.tsv" || die "extracted manifest differs from source manifest"
  cmp -s -- "$manifest" "$verify_root/regenerated-manifest.tsv" || die "extracted file inventory or SHA-256 differs"
  local archive_digest
  archive_digest="$(sha256sum -- "$partial_archive" | cut -d' ' -f1)"
  atomic_write "${final_archive}.sha256" "$archive_digest  $(basename -- "$final_archive")"
  mv -T -- "$partial_archive" "$final_archive"
}

write_successor_request() {
  local attempt="$1"
  rm -f -- "$SUCCESSOR_FILE.partial"
  atomic_write "$SUCCESSOR_FILE" \
    'BC_PRESTIGE_SUCCESSOR_V1' \
    "lineage"$'\t'"$REQUEST_LINEAGE" \
    "transaction"$'\t'"$REQUEST_TRANSACTION" \
    "successor_seed"$'\t'"$REQUEST_SUCCESSOR_SEED" \
    "impact"$'\t'"$REQUEST_IMPACT" \
    "attempt"$'\t'"$attempt"
}

health_is_valid() {
  [[ -f "$HEALTH_FILE" && ! -L "$HEALTH_FILE" ]] || return 1
  mapfile -t CONTRACT_LINES < "$HEALTH_FILE"
  [[ "${#CONTRACT_LINES[@]}" -eq 10 && "${CONTRACT_LINES[0]}" == 'BC_PRESTIGE_HEALTH_V1' ]] || return 1
  [[ "${CONTRACT_LINES[1]}" == "lineage"$'\t'"$REQUEST_LINEAGE" ]] || return 1
  [[ "${CONTRACT_LINES[2]}" == "transaction"$'\t'"$REQUEST_TRANSACTION" ]] || return 1
  [[ "${CONTRACT_LINES[3]}" == "successor_seed"$'\t'"$REQUEST_SUCCESSOR_SEED" ]] || return 1
  [[ "${CONTRACT_LINES[4]}" == "actual_seed"$'\t'"$REQUEST_SUCCESSOR_SEED" ]] || return 1
  [[ "${CONTRACT_LINES[5]}" == "impact"$'\t'"$REQUEST_IMPACT" ]] || return 1
  [[ "${CONTRACT_LINES[6]}" == "spawn_biome"$'\t'* ]] || return 1
  local spawn_biome="${CONTRACT_LINES[6]#"spawn_biome"$'\t'}"
  [[ "$spawn_biome" =~ ^[a-z0-9_.-]+:[a-z0-9_./-]+$ ]] || return 1
  [[ "${CONTRACT_LINES[7]}" == "world"$'\t'"$REQUEST_WORLD" ]] || return 1
  [[ "${CONTRACT_LINES[8]}" == "level_dat"$'\t''true' ]] || return 1
  [[ "${CONTRACT_LINES[9]}" == "status"$'\t''healthy' ]] || return 1
  [[ -f "$SCRIPT_DIR/$REQUEST_WORLD/level.dat" ]] || return 1
}

request_successor_shutdown() {
  rm -f -- "$SHUTDOWN_FILE" "$SHUTDOWN_FILE.partial"
  atomic_write "$SHUTDOWN_FILE" \
    'BC_PRESTIGE_SHUTDOWN_V1' \
    "transaction"$'\t'"$REQUEST_TRANSACTION"
}

stop_failed_server() {
  local pid="$1"
  kill -0 "$pid" 2>/dev/null || { wait "$pid" || true; return; }
  request_successor_shutdown
  local deadline=$((SECONDS + 30))
  while kill -0 "$pid" 2>/dev/null && (( SECONDS < deadline )); do sleep 1; done
  if kill -0 "$pid" 2>/dev/null; then kill -TERM "$pid" 2>/dev/null || true; sleep 5; fi
  if kill -0 "$pid" 2>/dev/null; then kill -KILL "$pid" 2>/dev/null || true; fi
  wait "$pid" 2>/dev/null || true
}

commit_lineage() {
  local next_count=$((PRESTIGE_COUNT + 1))
  rm -f -- "$LINEAGE_FILE.partial"
  atomic_write "$LINEAGE_FILE" \
    'BC_PRESTIGE_LINEAGE_V1' \
    "lineage"$'\t'"$LINEAGE_ID" \
    "prestige_count"$'\t'"$next_count"
  PRESTIGE_COUNT="$next_count"
}

run_successor_attempt() {
  local attempt="$1"
  shift
  rm -f -- "$HEALTH_FILE" "$HEALTH_FILE.partial" "$SHUTDOWN_FILE" "$SHUTDOWN_FILE.partial"
  write_successor_request "$attempt"
  printf 'prestige supervisor: launching successor attempt %s/3\n' "$attempt"
  local console_fifo="$CONTROL_DIR/successor-console-$REQUEST_TRANSACTION-$attempt.fifo"
  rm -f -- "$console_fifo"
  mkfifo -m 600 -- "$console_fifo"
  exec 8<>"$console_fifo"
  rm -f -- "$console_fifo"
  "$SCRIPT_DIR/run.sh" "$@" <&8 &
  SUCCESSOR_PID=$!
  cat <&0 >&8 &
  CONSOLE_RELAY_PID=$!
  local deadline=$((SECONDS + HEALTH_TIMEOUT_SECONDS))
  while kill -0 "$SUCCESSOR_PID" 2>/dev/null && (( SECONDS < deadline )); do
    if health_is_valid; then
      local stable_until=$((SECONDS + HEALTH_STABILITY_SECONDS))
      while kill -0 "$SUCCESSOR_PID" 2>/dev/null && (( SECONDS < stable_until )); do sleep 1; done
      kill -0 "$SUCCESSOR_PID" 2>/dev/null || return 1
      return 0
    fi
    sleep 1
  done
  return 1
}

stop_console_relay() {
  if [[ -n "${CONSOLE_RELAY_PID:-}" ]]; then
    kill "$CONSOLE_RELAY_PID" 2>/dev/null || true
    wait "$CONSOLE_RELAY_PID" 2>/dev/null || true
    CONSOLE_RELAY_PID=''
  fi
  exec 8>&-
}

ensure_lineage

if [[ ! -e "$RESET_FILE" ]]; then
  set +e
  "$SCRIPT_DIR/run.sh" "$@"
  INITIAL_EXIT=$?
  set -e
  [[ -e "$RESET_FILE" ]] || exit "$INITIAL_EXIT"
fi

parse_reset
ACTIVE_WORLD_NAME="$(server_property level-name)"
validate_world_name "$ACTIVE_WORLD_NAME"
[[ "$ACTIVE_WORLD_NAME" == "$REQUEST_WORLD" ]] || die "reset world does not match server.properties level-name"
ACTIVE_WORLD="$SCRIPT_DIR/$ACTIVE_WORLD_NAME"
[[ -d "$ACTIVE_WORLD" && ! -L "$ACTIVE_WORLD" ]] || die "active world is not a regular directory: $ACTIVE_WORLD"

TRANSACTION_ROOT="$TRANSACTION_DIR/$REQUEST_TRANSACTION"
[[ ! -e "$TRANSACTION_ROOT" ]] || die "transaction directory already exists: $TRANSACTION_ROOT"
ARCHIVE_INPUT="$TRANSACTION_ROOT/archive-input"
VERIFY_ROOT="$TRANSACTION_ROOT/archive-verify"
mkdir -p -- "$ARCHIVE_INPUT"
cp -- "$SCRIPT_DIR/server.properties" "$TRANSACTION_ROOT/server.properties.before"
cp -- "$RESET_FILE" "$TRANSACTION_ROOT/reset-request-v1.tsv"
mv -T -- "$ACTIVE_WORLD" "$ARCHIVE_INPUT/world"

NEXT_COUNT=$((PRESTIGE_COUNT + 1))
FINAL_ARCHIVE="$ARCHIVE_DIR/${LINEAGE_ID}-p$(printf '%06d' "$NEXT_COUNT")-${REQUEST_TRANSACTION}.zip"
create_verified_archive "$ARCHIVE_INPUT" "$FINAL_ARCHIVE" "$VERIFY_ROOT"
set_server_seed "$REQUEST_SUCCESSOR_SEED"

for attempt in 1 2 3; do
  if [[ -e "$ACTIVE_WORLD" ]]; then
    mv -T -- "$ACTIVE_WORLD" "$TRANSACTION_ROOT/failed-attempt-$((attempt - 1))"
  fi
  if run_successor_attempt "$attempt" "$@"; then
    cp -- "$SUCCESSOR_FILE" "$TRANSACTION_ROOT/successor-request-v1.tsv"
    cp -- "$HEALTH_FILE" "$TRANSACTION_ROOT/health-result-v1.tsv"
    commit_lineage
    rm -f -- "$RESET_FILE" "$SUCCESSOR_FILE" "$HEALTH_FILE" "$SHUTDOWN_FILE" "$STAGED_FILE"
    rm -rf -- "$ARCHIVE_INPUT/world" "$VERIFY_ROOT"
    printf 'prestige supervisor: committed %s; successor world is active\n' "$REQUEST_TRANSACTION"
    set +e
    wait "$SUCCESSOR_PID"
    SUCCESSOR_EXIT=$?
    set -e
    stop_console_relay
    exit "$SUCCESSOR_EXIT"
  fi
  printf 'prestige supervisor: successor attempt %s failed health verification\n' "$attempt" >&2
  stop_failed_server "$SUCCESSOR_PID"
  stop_console_relay
done

if [[ -e "$ACTIVE_WORLD" ]]; then
  mv -T -- "$ACTIVE_WORLD" "$TRANSACTION_ROOT/failed-attempt-3"
fi
cp -- "$TRANSACTION_ROOT/server.properties.before" "$SCRIPT_DIR/server.properties"
mv -T -- "$ARCHIVE_INPUT/world" "$ACTIVE_WORLD"
rm -f -- "$RESET_FILE" "$SUCCESSOR_FILE" "$HEALTH_FILE" "$SHUTDOWN_FILE" "$STAGED_FILE"
printf 'prestige supervisor: restored old world after three failed successor attempts\n' >&2
exec "$SCRIPT_DIR/run.sh" "$@"
