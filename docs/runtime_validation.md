# Runtime Validation

The supported runtime surface is one explicit lifecycle smoke:

```text
tools/bc test smoke --bootstrap-mode always
```

It prepares one disposable dedicated-server world and one Xvfb-backed client under `~/.cache/bc/smoke`, connects `SmokeClient`, waits 30 seconds, disconnects it through the server, and stops the server. The test fails on startup, join, lifecycle, or hard-log failures and writes diagnostics beneath its disposable run root.

Optional controls are `--run-root PATH`, `--bootstrap-mode always|once|never`, `--port N`, and `--idle-seconds N`. It never creates cycles, variants, cloned worlds, or additional test worlds.

## Complementary source checks

```text
tools/bc doctor env
tools/bc test static
tools/bc test kotlin
tools/bc test fast
```

Kotlin harness lifecycle tests synchronize on the per-run `lock.json`; incidental harness-root entries such as `port-reservations/` are not evidence that a run is ready to interrupt or inspect.

The smoke proves lifecycle and client/server network compatibility only. Gameplay, worldgen distributions, progression routes, and visual quality require separately designed evidence.

## Item/block integration matrix

```text
tools/bc build integration-matrix [--output-dir PATH]
```

The default output is `generated/validation/integration-matrix/`: `integration-matrix.json` is the structured evidence contract, `integration-matrix.tsv` is the spreadsheet view, and `integration-summary.md` carries aggregate findings and the prioritized remediation backlog. The matrix covers the union of retained runtime item and block registries and keeps objective evidence separate from the authored per-ID reviewer decisions in `tools/integration_review.json`.

Objective connection states are `acquired_and_used`, `acquisition_only`, `use_only`, `referenced_only`, and `no_evidence`. They describe observable connections, not design acceptance; the review contract supplies the verdict, severity, confidence, rationale, and evidence references for each ID. Completionist quest stubs count only as reference evidence and do not prove acquisition or downstream use.

Retained recipes, registries, tags, and pack-authored source surfaces are strong inputs, but the matrix cannot exhaustively observe native or dynamically generated loot, trades, or worldgen. Those gaps must remain explicit evidence limitations or runtime-verification findings rather than being reported as definite absence.

Agentic review delegation uses a frozen registry union and deterministic, non-overlapping ID shards. Each agent returns only its assigned review records with the seeded `evidence_refs` unchanged; the root reviewer validates exact shard coverage, adjudicates policy-sensitive findings, and merges the shards before accepting the manifest. The generator rejects duplicate IDs, changed evidence references, malformed records, and unreviewed registry drift. A completed pass must contain zero `automatic-evidence-pass` records.

## Mod integration matrix

```text
tools/bc build mod-integration-matrix [--output-dir PATH] [--staging-dir PATH]
```

The command resolves dedicated client and server mod distributions, recursively inventories top-level and embedded Forge mod IDs, and writes JSON, TSV, and Markdown outputs under `generated/validation/mod-integration-matrix/`. It records provider artifacts, side presence, dependency edges, verified archive namespaces, item/block evidence, configuration and data overrides, objective connection state, and the review decision from `tools/mod_integration_review.json`.

Connection states are `system_integrated`, `pack_configured`, `referenced_only`, `present_only`, and `dependency_only`. Embedded libraries, platform helpers, performance infrastructure, scripting APIs, and confirmed client utilities remain matrix rows but are excluded from the content-integration backlog. Resolved distribution presence is not runtime-load proof, and automatic reviews are triage decisions rather than final adjudication.
