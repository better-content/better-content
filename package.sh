#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
MC_VERSION=1.20.1
FORGE_VERSION=47.4.13
FORGE_COORD="$MC_VERSION-$FORGE_VERSION"
fail() { printf 'package failed: %s\n' "$*" >&2; exit 1; }

copy_content() {
  local target="$1" path
  mkdir -p "$target"
  for path in config defaultconfigs datapacks defaultresources globalresources kubejs mods resourcepacks shaderpacks tacz options.txt; do
    [ ! -e "$ROOT/$path" ] || cp -a "$ROOT/$path" "$target/"
  done
}

resolve_artifacts() {
  python3 - "$ROOT" "$1" "$2" <<'PY'
import fnmatch, hashlib, os, pathlib, shutil, sys, tomllib, urllib.request
root, target, side = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3]
client_only = ('ambientsounds*','bettergrassify*','configured*','controlling*','DistantHorizons*','embeddium*','entityculling*','hold-my-items*','mouse-tweaks*','no-more-popups*','no-recipe-book*','oculus*','presence-footsteps*','shoulder-surfing*','sound-physics*','the-one-probe*','true-darkness*','darkness*')
for folder in ('mods','resourcepacks','shaderpacks'):
    for manifest in sorted((root / folder).glob('*.pw.toml')):
        data = tomllib.loads(manifest.read_text())
        if data.get('side', 'both') not in ('both', side):
            continue
        name = data.get('filename', '')
        if side == 'server' and any(fnmatch.fnmatch(name.lower(), pattern.lower()) for pattern in client_only):
            continue
        download = data.get('download', {})
        url = download.get('url')
        if not url and download.get('mode') == 'metadata:curseforge':
            cf = data.get('update', {}).get('curseforge', {})
            url = f"https://www.curseforge.com/api/v1/mods/{cf['project-id']}/files/{cf['file-id']}/download"
        if not url:
            continue
        destination = target / folder / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            destination.unlink()
        algorithm = download.get('hash-format', '').replace('-', '').lower()
        expected = download.get('hash', '').lower()
        cache = root / 'generated/cache/packwiz-downloads' / folder / name
        if cache.is_file():
            try:
                os.link(cache, destination)
            except OSError:
                shutil.copy2(cache, destination)
        else:
            request = urllib.request.Request(url, headers={'User-Agent':'better-content-packager/1.0'})
            with urllib.request.urlopen(request, timeout=120) as response, destination.open('wb') as output:
                shutil.copyfileobj(response, output)
        if algorithm and expected:
            actual = hashlib.new(algorithm, destination.read_bytes()).hexdigest()
            if actual != expected:
                raise SystemExit(f"hash mismatch for {manifest}: expected {expected}, got {actual}")
PY
}

stage_side() {
  local side="$1" target="$2"
  copy_content "$target"
  resolve_artifacts "$target" "$side"
}

install_server() {
  local server="$1" accept_eula="$2" port="${3:-25565}"
  local installer="$ROOT/forge-$FORGE_COORD-installer.jar"
  [ -f "$installer" ] || fail "missing Forge installer: $installer"
  local server_cache="${BC_PACKAGE_SERVER_CACHE:-$HOME/.cache/bc/smoke/server}"
  if [ -f "$server_cache/libraries/net/minecraftforge/forge/$FORGE_COORD/unix_args.txt" ]; then
    cp -al "$server_cache/libraries" "$server/"
  else
    cp "$installer" "$server/"
    (cd "$server" && java -jar "$(basename "$installer")" --installServer)
  fi
  printf 'eula=%s\n' "$accept_eula" > "$server/eula.txt"
  cat > "$server/server.properties" <<EOF
allow-flight=true
difficulty=normal
enable-command-block=true
level-name=world
level-type=minecraft\:flat
max-players=2
online-mode=false
server-ip=127.0.0.1
server-port=$port
spawn-protection=0
view-distance=4
simulation-distance=4
EOF
  printf '%s\n' '-Xms2G' '-Xmx8G' '-XX:+UseG1GC' '-Dfile.encoding=UTF-8' > "$server/user_jvm_args.txt"
}

package_runtime() {
  (($# == 3)) || fail 'usage: package.sh runtime SERVER_DIR CLIENT_DIR PORT'
  command -v java >/dev/null || fail 'java is required'
  command -v python3 >/dev/null || fail 'python3 is required'
  stage_side server "$1"
  stage_side client "$2"
  install_server "$1" true "$3"
}

package_dist() {
  (($# <= 1)) || fail 'usage: package.sh dist [OUTPUT_DIR]'
  for command in java packwiz python3 zip; do command -v "$command" >/dev/null || fail "$command is required"; done
  local out_root="${1:-$ROOT/dist}"
  local current_version current_build next_build version version_dir_name release_dir client_dir server_dir stage
  current_version="$(awk -F ' *= *' '$1 == "version" { value=$2; gsub(/^"|"$/, "", value); print value; exit }' "$ROOT/pack.toml")"
  current_build="$(printf '%s' "$current_version" | sed -nE 's/^.*[^0-9]([0-9]+)$/\1/p')"
  [ -n "$current_build" ] || fail 'pack version must end in a numeric build number'
  next_build=$((10#$current_build + 1))
  version="$(printf '%s' "$current_version" | sed -E "s/[0-9]+$/$next_build/")"
  version_dir_name="$(printf '%s' "$version" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9._-')"
  mkdir -p "$out_root"
  out_root="$(cd "$out_root" && pwd)"
  release_dir="$out_root/$version_dir_name"
  [ ! -e "$release_dir" ] || fail "version directory already exists: $release_dir"
  client_dir="$release_dir/client"
  server_dir="$release_dir/server"
  stage="$server_dir/server-tree/better-content-server"
  mkdir -p "$client_dir" "$stage"
  local escaped_version
  escaped_version="$(printf '%s' "$version" | sed 's/[&|\\]/\\&/g')"
  sed -i -E "0,/^version *=/{s|^version *=.*$|version = \"$escaped_version\"|}" "$ROOT/pack.toml"
  (cd "$ROOT" && packwiz refresh >/dev/null)
  (cd "$ROOT" && packwiz curseforge export -o "$client_dir/better-content.zip" -s client -y)
  stage_side server "$stage"
  install_server "$stage" false 25565
  cat > "$stage/SERVER_README.txt" <<'TXT'
Better Content server distribution

Set eula=true only after accepting Mojang's EULA. This archive is packaging output and
carries no validation, verification, compatibility, or runtime-health claim.
TXT
  (cd "$server_dir/server-tree" && zip -q -r "$server_dir/better-content.zip" better-content-server)
  printf 'version: %s\nclient: %s\nserver: %s\n' "$version" "$client_dir/better-content.zip" "$server_dir/better-content.zip"
}

case "${1:-}" in
  runtime) shift; package_runtime "$@" ;;
  dist) shift; package_dist "$@" ;;
  *) fail 'usage: package.sh <runtime SERVER_DIR CLIENT_DIR PORT|dist [OUTPUT_DIR]>' ;;
esac
