# Runtime Validation

The supported runtime surface is one explicit lifecycle smoke:

```text
tools/bc test smoke --bootstrap-mode always
```

It prepares one disposable dedicated-server world and one Xvfb-backed client under `~/.cache/bc/smoke`, connects `SmokeClient`, waits 30 seconds, disconnects it through the server, and stops the server. The test fails on startup, join, lifecycle, or hard-log failures and writes diagnostics beneath its disposable run root.

Optional controls are `--run-root PATH`, `--bootstrap-mode always|once|never`, `--port N`, and `--idle-seconds N`. It never creates cycles, variants, cloned worlds, or additional test worlds.

For a bounded recapture tied to that same world, use:

```text
tools/bc test smoke --bootstrap-mode always --capture-dumps --oracle-manifest tools/runtime-oracles/changed_scope.json
```

This enables the live dump command before startup, joins the ordinary smoke client, invokes `bcgraph dump` in the same disposable server world, promotes the complete shared-snapshot dump set, and evaluates only the manifest's changed scope. The current manifest checks the 11 statically approved chemistry routes, absence of every exact or patterned rejected recipe cohort, and live registration for the 37 independently adjudicated packet IDs. Rows whose blocker is static design, integration, world occurrence, or behavior are emitted as `not_oracle_ready` or behavior-pending; registration evidence never upgrades them to accepted. The result is retained as `generated/runtime-dumps/changed_scope_oracle.json` and explicitly makes no global 19,315-ID completion claim.

## Complementary source checks

```text
tools/bc doctor env
tools/bc test static
tools/bc test kotlin
tools/bc test fast
```

Kotlin harness lifecycle tests synchronize on the per-run `lock.json`; incidental harness-root entries such as `port-reservations/` are not evidence that a run is ready to interrupt or inspect.

The ordinary smoke proves lifecycle and client/server network compatibility only. Changed-scope dump capture additionally proves live recipe/registry declarations and rejected-route absence, but not machine execution, gas escape, hazards, provenance, container transfer, world occurrence, progression traversal, or visual quality.

## Live recipe graph

`tools/bc build dumps` starts one disposable dedicated server and invokes the
operator-only `bcgraph dump` command after startup. The bundled
`bcrecipegraph` Forge mod reads the final live `RecipeManager`, after datapack
and KubeJS mutations, and writes a candidate `bc.recipe_graph.v2` snapshot to
`generated/runtime-dumps/recipes.json`. The same command writes
matching registry, tag, effective loot-table, sampled dynamic trade, worldgen,
mod, and `bc.runtime_dump_completion.v2` snapshots with a shared ID. Promotion
is all-or-nothing: every recipe must have a complete normalized edge, every
serializer export must succeed, and every exact runtime surface must have zero
errors. An incomplete candidate remains in the disposable server directory for
diagnosis and is never copied over retained evidence or fingerprinted as fresh.

`loot.json` serializes the server's post-reload loot-table definitions. That is
exact loaded-table evidence, not proof that any chest, mob, structure, fishing,
or ritual context occurs in reachable play. `trades.json` evaluates every live
villager and wandering-trader listing against 16 stable seeds, retaining each
distinct sampled offer and its full NBT. It is explicitly a deterministic
sample contract, not an exhaustive claim about randomized or state-dependent
offers. `worldgen.json` codec-serializes the effective configured-feature,
placed-feature, biome, structure, and Forge biome-modifier registries. Registry
presence is not proof of placement, distribution, biome attachment, or
occurrence in an existing world. These qualified datasets are included in the
retained provenance fingerprint only after their declared contract passes.

Recipe input slots retain AND semantics and each slot's alternatives retain OR
semantics. Tag membership is resolved from the matching live `tags.json` rather
than duplicated in every recipe. The exporter preserves counted stacked
ingredients where the live API exposes them, including PneumaticCraft pressure
chamber display inputs, and records output alternatives as groups. It also
attempts to retain each serializer's network payload and records an explicit
normalization state. Partial records remain useful diagnostics, but one partial
row makes the completion snapshot false and blocks promotion of the entire
candidate graph.

The mod never dumps automatically during startup, reload, or player login. On
a manually managed server, run `/bcgraph dump` as an operator.

On 2026-07-30 the smoke passed after the AdPother/Latent gas unification using the staged reobfuscated `latent_chemlib-0.1.0.jar`: the dedicated server completed a fresh spawn, the client joined and remained connected for the bounded settle window, and both sides shut down cleanly with no hard-log finding. An earlier attempt timed out while the exact-contact adapter recursively waited for a chunk that was still loading; the captured thread dump identified `AdpotherCloudView.contactAt` as the caller. The corrected and validated bridge now obtains cloud block entities only from already-materialized chunks, including both exact-contact and gas-selector reads.

On 2026-08-01 the release-candidate smoke passed again with `--bootstrap-mode always`: one disposable dedicated-server world booted, the Xvfb client joined and remained connected for the bounded settle window, and both sides shut down cleanly with no hard-log finding. Before the smoke, retained runtime dumps were refreshed, 25 newly visible AdPother gas item/block IDs received explicit runtime-oracle review records, and the static, Kotlin, and 19-repository fast suites passed.

The August playtest stabilization pass also makes Complementary Reimagined's glowing-ore list consume all retained Excavated Variants ore IDs. `tools/bc internal sync-shader-glowing-ores` updates the packed shader deterministically, and chemistry validation fails if retained variants are missing from `block.10024`.

On 2026-08-02 the `arcane_chunkloaders` visual harness passed with all eight anchors command-placed in one superflat world. The representative minimal closure included Create, Power Grid, Ars Nouveau, Blood Magic, PneumaticCraft, Goety, Malum, and Forbidden and Arcanus; both captured views completed with no anchor tag, model, registry, or recipe errors. The same day's full smoke loaded the reobfuscated anchor jar and all four KubeJS integration scripts successfully on both sides, but is not recorded as a lifecycle pass: the Xvfb client later failed while Accelerated Rendering requested GLSL 4.60 from the lane's llvmpipe OpenGL 4.5 device. The failure was graphics-environment-specific and outside the anchor stack; the dedicated server completed startup and clean shutdown.

## Item/block integration matrix

```text
tools/bc build integration-matrix [--output-dir PATH] [--require-complete]
```

The default output is `generated/validation/integration-matrix/`: `integration-matrix.json` is the structured evidence contract, `integration-matrix.tsv` is the spreadsheet view, and `integration-summary.md` carries aggregate findings and the prioritized remediation backlog. The matrix covers the union of retained runtime item and block registries and keeps immutable objective evidence separate from reviewer-owned evidence in the authored per-ID decisions in `tools/integration_review.json`. Runtime dump provenance fingerprints every recipe-affecting source and deployed jar; the matrix reports the retained snapshot as fresh, stale, or missing without using file timestamps.

With fresh evidence, objective connection states are `acquired_and_used`, `acquisition_only`, `use_only`, `referenced_only`, and `no_evidence`; stale or missing evidence instead yields `runtime_evidence_stale`. These states describe observable connections, not design acceptance. The v3 review contract supplies the maintained verdict, severity, confidence, rationale, computed `objective_evidence_refs`, and reviewer-owned `reviewer_evidence_refs` for each ID. Pack-authored purchase trades count as acquisition, sell-to-market trades count as demand, and the configured purchase blocklist is honored. Completionist quest stubs count only as reference evidence and do not prove acquisition or downstream use.

Retained recipes, registries, tags, and pack-authored source surfaces are strong inputs. The strict build also stages the exact server mod distribution and indexes native recipe and loot-table declarations with artifact/entry provenance. Native declarations are reference and diagnostic evidence only: retained runtime recipes remain authoritative, block self-drops do not prove initial acquisition, and loot declarations do not prove that their chest, entity, fishing, ritual, or structure source occurs. Missing runtime evidence from a stale snapshot is reported as `runtime_evidence_stale` and can support only `needs_runtime_verification`, never a high-confidence acceptance or removal decision.

The current non-worldgen repair pass leaves no `needs_integration` or `remove_or_hide` verdicts. Remaining findings are `needs_runtime_verification` records with an explicit required oracle: effective placement/worldgen, active loot injection and occurrence, dynamic acquisition, fire/equipment/fluid interaction, Wares NBT lifecycle, or player-facing role. The lifecycle smoke cannot close any of those categories.

Agentic review delegation uses a frozen registry union and deterministic, non-overlapping ID shards. Each agent returns only its assigned review records with the seeded `objective_evidence_refs` unchanged and may add only concrete reviewer evidence; the root reviewer validates exact shard coverage, adjudicates policy-sensitive findings, and merges the shards before accepting the manifest. Concrete reviewer evidence is restricted to an existing repo file that contains the reviewed ID (optionally on the cited line), an existing assets/data entry in a repo JAR whose namespace and path match the reviewed ID, or retained item/block registry metadata for that same ID. The generator rejects duplicate IDs, changed objective evidence, malformed records, unsupported reviewer evidence, and unreviewed registry drift. Internal `--seed-review` mode exists only to prepare drift and review shards. The supported command always requires maintained review; add `--require-complete` for the release-grade immersion gate, which also requires fresh runtime evidence and a fulfilled approved entry-to-use-to-conclusion role contract for every effective item and block.

## Mod integration matrix

```text
tools/bc build mod-integration-matrix [--output-dir PATH] [--staging-dir PATH]
```

The command resolves dedicated client and server mod distributions, recursively inventories top-level and embedded Forge mod IDs, and writes JSON, TSV, and Markdown outputs under `generated/validation/mod-integration-matrix/`. It records provider artifacts, side presence, dependency edges, verified archive namespaces, item/block evidence, configuration and data overrides, objective connection state, and the review decision from `tools/mod_integration_review.json`.

Connection states are `system_integrated`, `pack_configured`, `referenced_only`, `present_only`, and `dependency_only`. Embedded libraries, platform helpers, performance infrastructure, scripting APIs, and confirmed client utilities remain matrix rows but are excluded from the content-integration backlog. Resolved distribution presence is not runtime-load proof, and automatic reviews are triage decisions rather than final adjudication.
