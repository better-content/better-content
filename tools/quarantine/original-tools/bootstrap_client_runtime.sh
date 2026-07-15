#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
TOOLS_COMPAT_DIR="$ROOT/tools/quarantine/original-tools"
# shellcheck source=tools/quarantine/original-tools/_runtime_common.sh
source "$TOOLS_COMPAT_DIR/_runtime_common.sh"

client_dir="${CLIENT_DIR:-}"

usage() {
  cat <<USAGE
Usage: $(basename "$0") --client-dir PATH

Creates/syncs a repo-managed client game directory for direct local tests.
This does not touch Prism instances or player client roots. It prepares managed pack
content and copies the Forge installer so tools/launch_client_direct.sh can use the
local Forge/Minecraft libraries already present on this machine or installed later.
USAGE
}

while (($#)); do
  case "$1" in
    --client-dir) client_dir="${2:-}"; [[ -n "$client_dir" ]] || btm_usage_error "--client-dir needs a path"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) btm_usage_error "unknown argument: $1" ;;
  esac
done

[[ -n "$client_dir" ]] || btm_usage_error "--client-dir is required"

mkdir -p "$client_dir"/{logs,saves,versions,libraries,assets}
"$ROOT/tools/bc" build sync client --dir "$client_dir" --apply
if [[ "${BC_SKIP_PACKWIZ_DOWNLOADS:-0}" != "1" ]]; then
  "$ROOT/tools/bc" internal resolve-packwiz-downloads --target-dir "$client_dir" --side client --apply
fi
"$ROOT/tools/bc" internal prune-runtime-mods --target-dir "$client_dir" --side client --apply

prism_root="${BC_PRISM_ROOT:-$HOME/.local/share/PrismLauncher}"
forge_client_id="${BC_MC_VERSION}-forge-${BC_FORGE_VERSION}"
if [[ -d "$prism_root/libraries" && ! -L "$client_dir/libraries" ]]; then
  rm -rf "$client_dir/libraries"
  ln -s "$prism_root/libraries" "$client_dir/libraries"
fi
if [[ -d "$prism_root/assets" && ! -L "$client_dir/assets" ]]; then
  rm -rf "$client_dir/assets"
  ln -s "$prism_root/assets" "$client_dir/assets"
fi
if [[ -f "$prism_root/meta/net.minecraft/${BC_MC_VERSION}.json" ]]; then
  mkdir -p "$client_dir/versions/${BC_MC_VERSION}"
  cp "$prism_root/meta/net.minecraft/${BC_MC_VERSION}.json" "$client_dir/versions/${BC_MC_VERSION}/${BC_MC_VERSION}.json"
fi
if [[ -f "$prism_root/libraries/com/mojang/minecraft/${BC_MC_VERSION}/minecraft-${BC_MC_VERSION}-client.jar" ]]; then
  mkdir -p "$client_dir/versions/${BC_MC_VERSION}"
  ln -sf "$prism_root/libraries/com/mojang/minecraft/${BC_MC_VERSION}/minecraft-${BC_MC_VERSION}-client.jar" "$client_dir/versions/${BC_MC_VERSION}/${BC_MC_VERSION}.jar"
fi
if [[ -f "$prism_root/meta/net.minecraftforge/${BC_FORGE_VERSION}.json" ]]; then
  mkdir -p "$client_dir/versions/${forge_client_id}"
  kotlin "$ROOT/tools/kotlin/write_forge_client_version.main.kts" \
    "$prism_root/meta/net.minecraftforge/${BC_FORGE_VERSION}.json" \
    "$client_dir/versions/${forge_client_id}/${forge_client_id}.json" \
    "$BC_MC_VERSION" \
    "$forge_client_id"
fi

if [[ ! -f "$client_dir/versions/${BC_MC_VERSION}/${BC_MC_VERSION}.json" ]]; then
  btm_need curl
  btm_need python3
  mkdir -p "$client_dir/versions/${BC_MC_VERSION}"
  manifest_tmp="$(mktemp)"
  trap 'rm -f "$manifest_tmp"' EXIT
  curl -fsSL "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json" -o "$manifest_tmp"
  version_url="$(python3 - "$manifest_tmp" "$BC_MC_VERSION" <<'PY'
import json
import sys

manifest_path, target = sys.argv[1], sys.argv[2]
with open(manifest_path, "r", encoding="utf-8") as handle:
    manifest = json.load(handle)

for version in manifest.get("versions", []):
    if version.get("id") == target:
        print(version.get("url", ""))
        break
else:
    sys.exit(1)
PY
)"
  [[ -n "$version_url" ]] || {
    echo "ERROR: could not resolve Minecraft version metadata URL for $BC_MC_VERSION" >&2
    exit 1
  }
  curl -fsSL "$version_url" -o "$client_dir/versions/${BC_MC_VERSION}/${BC_MC_VERSION}.json"
  rm -f "$manifest_tmp"
  trap - EXIT
fi

installer="$(btm_find_forge_installer "$ROOT")"
if [[ -n "$installer" && -f "$installer" ]]; then
  java_bin="$(btm_java17)"
  cp "$installer" "$client_dir/forge-${BC_FORGE_COORD}-installer.jar"
  mkdir -p "$client_dir/versions/${forge_client_id}"
  unzip -p "$client_dir/forge-${BC_FORGE_COORD}-installer.jar" version.json > "$client_dir/versions/${forge_client_id}/${forge_client_id}.json"
  if [[ ! -f "$client_dir/launcher_profiles.json" ]]; then
    cat > "$client_dir/launcher_profiles.json" <<'EOF'
{"profiles":{},"settings":{},"version":3}
EOF
  fi
  if [[ ! -f "$client_dir/libraries/net/minecraftforge/forge/${BC_FORGE_COORD}/forge-${BC_FORGE_COORD}-client.jar" ]]; then
    "$java_bin" -jar "$client_dir/forge-${BC_FORGE_COORD}-installer.jar" --installClient "$client_dir"
  fi
fi

cat > "$client_dir/README.agent-runtime.txt" <<EOF
Better Content direct client runtime

Minecraft: ${BC_MC_VERSION}
Forge: ${BC_FORGE_VERSION}

Managed content is synced from:
  $ROOT

Launch through:
  $TOOLS_COMPAT_DIR/launch_client_direct.sh --client-dir "$client_dir" --username AgentClient --server 127.0.0.1:${BC_SERVER_PORT}

This directory is runtime state. Do not commit saves, logs, screenshots, options,
account files, assets, libraries, or downloaded versions.
EOF

echo "Bootstrapped client runtime: $client_dir"
