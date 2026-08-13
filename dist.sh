#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
fail() { printf 'dist failed: %s\n' "$*" >&2; exit 1; }
command -v packwiz >/dev/null || fail 'packwiz is required'
command -v zip >/dev/null || fail 'zip is required'
[ -f pack.toml ] || fail 'pack.toml is required'
current_version="$(awk -F ' *= *' '$1 == "version" { value=$2; gsub(/^"|"$/, "", value); print value; exit }' pack.toml)"
[ -n "$current_version" ] || fail 'pack.toml does not declare version'
current_build="$(printf '%s' "$current_version" | sed -nE 's/^.*[^0-9]([0-9]+)$/\1/p')"
[ -n "$current_build" ] || fail 'pack version must end in a numeric build number'
next_build=$((10#$current_build + 1))
version="$(printf '%s' "$current_version" | sed -E "s/[0-9]+$/$next_build/")"
version_dir_name="$(printf '%s' "$version" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9._-')"
[ -n "$version_dir_name" ] || fail 'pack version cannot form a directory name'
out_root="${1:-$ROOT/dist}"
mkdir -p "$out_root"
out_root="$(cd "$out_root" && pwd)"
release_dir="$out_root/$version_dir_name"
[ ! -e "$release_dir" ] || fail "version directory already exists: $release_dir"
escaped_version="$(printf '%s' "$version" | sed 's/[&|\\]/\\&/g')"
sed -i -E "0,/^version *=/{s|^version *=.*$|version = \"$escaped_version\"|}" pack.toml
packwiz refresh >/dev/null
client_dir="$release_dir/client"
server_dir="$release_dir/server"
stage="$server_dir/server-tree/better-content-server"
client_zip="$client_dir/better-content.zip"
server_zip="$server_dir/better-content.zip"
mkdir -p "$client_dir" "$stage"
packwiz curseforge export -o "$client_zip" -s client -y
for path in \
  config defaultconfigs datapacks defaultresources globalresources kubejs libraries mods \
  quests resourcepacks scripts shaderpacks tacz options.txt run.sh run-forge.sh \
  prestige-server.sh
 do
  [ ! -e "$path" ] || cp -a "$path" "$stage/"
done
printf '%s\n' 'eula=false' > "$stage/eula.txt"
cat > "$stage/SERVER_README.txt" <<'TXT'
Better Content server content distribution

Set eula=true only after accepting Mojang's EULA. This archive is packaging output and
carries no validation, verification, compatibility, or runtime-health claim.
TXT
(cd "$server_dir/server-tree" && zip -q -r "$server_zip" better-content-server)
printf 'version: %s\nclient: %s\nserver: %s\n' "$version" "$client_zip" "$server_zip"
