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

The selectors map exactly to `test`, `candidateTest`, `serverTest`, `multiplayerTest`, and
`singleplayerTest`. Gradle also exposes the aggregate `modpackTest`, but `test.main.kts all`
deliberately sequences `test`, the candidate gate, and the three independent runtime groups so a
candidate failure prevents Minecraft startup while a later runtime-group failure does not hide the
other groups' evidence. Each runtime group uses a fresh fixture.

`fast` writes ordinary Gradle XML and HTML reports only. Candidate, runtime, and `all` runs share a
run ID and write structured evidence beneath `generated/test-evidence/<run-id>/`: incremental JSON
events, a `bc.modpack_test_run.v1` summary, candidate hashes, logs, runtime data, and timeout
diagnostics. The single-player group also records the customized title screen without injecting
input. Failed fixtures are retained. Automated tests must not synthesize mouse movement or mouse
clicks. Threads reader development, the World Condenser configuration screen, and single-player
world creation are manual visual gates. Before rerunning, inspect the existing run and report its
ID, hashes, failed or aborted cases, evidence path, retained fixture, and process cleanup state.

A runtime snapshot is evidence for a target only when its snapshot ID appears in that run's server
events and the run's `candidate_selected` hashes match the target under discussion. Completeness
makes a snapshot usable evidence; recency alone does not make it current. Preserve unmatched
snapshots as historical candidate evidence and do not use their volatile totals as claims about the
tracked pack.

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
