# Testing and fresh distributions

Pack-level tests are intentionally expensive and run only when explicitly requested. Ordinary
changes use focused inspection or the owning format/tool. Changes to the test harness itself use:

```sh
./test.main.kts fast
```

An explicit pack-test request selects one existing candidate group:

```sh
./test.main.kts candidate
./test.main.kts server
./test.main.kts multiplayer
./test.main.kts singleplayer
./test.main.kts all
```

The selectors map to the Gradle tasks `candidateTest`, `serverTest`, `multiplayerTest`,
`singleplayerTest`, and `modpackTest`. Each runtime group uses a fresh fixture. `all` validates the
candidate before starting Minecraft and then continues independent runtime groups after a group
failure so one authorized run leaves useful cross-system evidence.

Evidence is written beneath `generated/test-evidence/<run-id>/`. Each suite records incremental
JSON events, a `bc.modpack_test_run.v1` summary, candidate hashes, logs, screenshots, runtime data,
and timeout diagnostics. Failed fixtures are retained. Before rerunning, inspect the existing run
and report its ID, hashes, failed or aborted cases, evidence path, retained fixture, and process
cleanup state.

## Fresh distributions

Only an explicit fresh-dist request authorizes:

```sh
./release.main.kts
./release.main.kts --jobs 4
```

The release command consumes `gradle/active-custom-mods.json`, requires clean active repositories,
runs their full documented verification with bounded parallelism, validates and deploys all staged
runtime JARs together, refreshes Packwiz, runs `dist.sh` exactly once, and finally invokes the full
pack suite. It records repository commits and JAR hashes before testing the unchanged ZIP pair.
