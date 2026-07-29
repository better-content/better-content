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

The default output is `generated/validation/integration-matrix/`: `integration-matrix.json` is the structured evidence contract, `integration-matrix.tsv` is the spreadsheet view, and `integration-summary.md` carries aggregate findings and the prioritized remediation backlog. The matrix covers the union of retained runtime item and block registries and keeps immutable objective evidence separate from reviewer-owned evidence in the authored per-ID decisions in `tools/integration_review.json`. Runtime dump provenance fingerprints every recipe-affecting source and deployed jar; the matrix reports the retained snapshot as fresh, stale, or missing without using file timestamps.

With fresh evidence, objective connection states are `acquired_and_used`, `acquisition_only`, `use_only`, `referenced_only`, and `no_evidence`; stale or missing evidence instead yields `runtime_evidence_stale`. These states describe observable connections, not design acceptance. The v3 review contract supplies the maintained verdict, severity, confidence, rationale, computed `objective_evidence_refs`, and reviewer-owned `reviewer_evidence_refs` for each ID. Pack-authored purchase trades count as acquisition, sell-to-market trades count as demand, and the configured purchase blocklist is honored. Completionist quest stubs count only as reference evidence and do not prove acquisition or downstream use.

Retained recipes, registries, tags, and pack-authored source surfaces are strong inputs. The strict build also stages the exact server mod distribution and indexes native recipe and loot-table declarations with artifact/entry provenance. Native declarations are reference and diagnostic evidence only: retained runtime recipes remain authoritative, block self-drops do not prove initial acquisition, and loot declarations do not prove that their chest, entity, fishing, ritual, or structure source occurs. Missing runtime evidence from a stale snapshot is reported as `runtime_evidence_stale` and can support only `needs_runtime_verification`, never a high-confidence acceptance or removal decision.

The current non-worldgen repair pass leaves no `needs_integration` or `remove_or_hide` verdicts. Remaining findings are `needs_runtime_verification` records with an explicit required oracle: effective placement/worldgen, active loot injection and occurrence, dynamic acquisition, fire/equipment/fluid interaction, Wares NBT lifecycle, or player-facing role. The lifecycle smoke cannot close any of those categories.

Agentic review delegation uses a frozen registry union and deterministic, non-overlapping ID shards. Each agent returns only its assigned review records with the seeded `objective_evidence_refs` unchanged and may add only concrete reviewer evidence; the root reviewer validates exact shard coverage, adjudicates policy-sensitive findings, and merges the shards before accepting the manifest. Concrete reviewer evidence is restricted to an existing repo file that contains the reviewed ID (optionally on the cited line), an existing assets/data entry in a repo JAR whose namespace and path match the reviewed ID, or retained item/block registry metadata for that same ID. The generator rejects duplicate IDs, changed objective evidence, malformed records, unsupported reviewer evidence, and unreviewed registry drift. Internal `--seed-review` mode exists only to prepare drift and review shards. The supported `tools/bc build integration-matrix` path is strict: a completed pass must contain zero `automatic-evidence-pass` records, and an accepted verdict must have objective or reviewer evidence.

## Mod integration matrix

```text
tools/bc build mod-integration-matrix [--output-dir PATH] [--staging-dir PATH]
```

The command resolves dedicated client and server mod distributions, recursively inventories top-level and embedded Forge mod IDs, and writes JSON, TSV, and Markdown outputs under `generated/validation/mod-integration-matrix/`. It records provider artifacts, side presence, dependency edges, verified archive namespaces, item/block evidence, configuration and data overrides, objective connection state, and the review decision from `tools/mod_integration_review.json`.

Connection states are `system_integrated`, `pack_configured`, `referenced_only`, `present_only`, and `dependency_only`. Embedded libraries, platform helpers, performance infrastructure, scripting APIs, and confirmed client utilities remain matrix rows but are excluded from the content-integration backlog. Resolved distribution presence is not runtime-load proof, and automatic reviews are triage decisions rather than final adjudication.
