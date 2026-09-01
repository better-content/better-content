#!/usr/bin/env sh
set -eu

if command -v gradle >/dev/null 2>&1; then
    exec gradle "$@"
fi
command -v java >/dev/null 2>&1 || { echo "Java 17 is required." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl is required." >&2; exit 1; }
command -v unzip >/dev/null 2>&1 || { echo "unzip is required." >&2; exit 1; }

GRADLE_VERSION=8.8
GRADLE_DIST="gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_HOME="${HOME}/.gradle/wrapper/dists/gradle-${GRADLE_VERSION}"

if [ ! -x "$GRADLE_HOME/bin/gradle" ]; then
    if [ -e "$GRADLE_HOME" ]; then
        echo "Incomplete Gradle fallback exists at $GRADLE_HOME; remove that exact directory and retry." >&2
        exit 1
    fi
    WRAPPER_TEMP=$(mktemp -d)
    curl -fsSL -o "$WRAPPER_TEMP/$GRADLE_DIST" "https://services.gradle.org/distributions/$GRADLE_DIST"
    unzip -q "$WRAPPER_TEMP/$GRADLE_DIST" -d "$WRAPPER_TEMP/extracted"
    mkdir -p "$(dirname "$GRADLE_HOME")"
    mv "$WRAPPER_TEMP/extracted/gradle-${GRADLE_VERSION}" "$GRADLE_HOME"
    rm -rf -- "$WRAPPER_TEMP"
fi

exec "$GRADLE_HOME/bin/gradle" "$@"
