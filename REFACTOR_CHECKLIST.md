# Better Content Refactor Checklist

## Header
- Objective: Execute a clean-break progression migration for Better Content with six-era causal graph and owning-mod migrations for Realistic Ores, Latent ChemLib, Heat Sync, Better Content Fixes, and pack KubeJS.
- Current phase: Complete — implementation, artifact integration, and full smoke validation passed
- Active repository: better-content-modpack
- Active task: Delivery — commit and push the validated pack integration.
- Last reviewed UTC timestamp: 2026-08-20T18:34:00Z
- Last completed checkpoint: `./smoke.sh` passed boot, join, settle, stop, and log-health gates at `/home/dev/.cache/bc/smoke/20260820T082409Z-2740424`.
- Exact next action: Refresh the final pack index, commit, push, and remove the `/root` claim.
- Known blockers: None.
- Active lane claims: `/root` only; all sibling claims were removed after their validated pushes.
- Current validation status:
  - `better-content-modpack`: PASS — `./smoke.sh`, 2026-08-20, boot/join/settle/stop/log health
  - `realistic-ores`: PASS — `./gradlew verifyFull --no-daemon`, 2026-08-20, JVM/resource/JaCoCo gates
  - `latent-chemlib`: PASS — `./gradlew verifyFull --no-daemon`, 2026-08-20, 37/37 required GameTests
  - `heat-sync`: PASS — `./gradlew verifyFull --no-daemon`, 2026-08-20, 7/7 required GameTests
  - `better-content-fixes`: PASS — `./gradlew verifyFull`, 2026-08-20, 19/19 required GameTests

## Task ledger

### P1-BM-01 — Baseline capture and claim resolution
- [x] Stable task ID: `P1-BM-01`
- Intended player-visible behavior: None (discovery-only in this phase).
- Owning repository: `better-content-modpack`
- Source area: repo-root + kubejs + claims coordination
- Dependencies: None
- Implementation note: Capture initial git status for all repos, read AGENTS.md and all active claim files, then record overlap and next owner assignments before edits.
- Validation evidence: Status files written (below):
  - `better-content-modpack`: clean in snapshot (no output in `git status --short`)
  - `realistic-ores`: clean in snapshot
  - `latent-chemlib`: clean in snapshot
  - `heat-sync`: clean in snapshot
  - `better-content-fixes`: clean in snapshot
- All five repository `AGENTS.md` files were read on 2026-08-20; all five `git status --short` commands produced no output.
- Deviations from this plan: The current checkouts are clean and contain no user-authored dirty/untracked classification pass, unlike the historical state described in Section 2. The classified scripts are committed on branch `agent/realistic-ore-processing` and remain executable until deliberately replaced.
- Follow-up work: None.

### P1-BM-02 — Reconcile active claims for realistic ore lifecycle and tags
- [x] Stable task ID: `P1-BM-02`
- Intended player-visible behavior: Prevent duplicate ownership conflicts while staging migration.
- Owning repository: `better-content-modpack`
- Source area: `/home/dev/.local/share/worklane/agent-work/`
- Dependencies: `P1-BM-01`
- Implementation note: Re-read `/home/dev/.local/share/worklane/agent-work/`; historical `/root/host_tags` and `/root/realistic_mod` claims no longer exist. Created `/root` claim for primary pack coordination and integration.
- Validation evidence: Claim directory contained no `agent--*.md` files before `/root` created `agent--root.md` at 2026-08-20T07:14:08Z; therefore no active overlap remains.
- Deviations from this plan: Historical claim references in the initial checklist snapshot were stale and have been replaced with live claim state.
- Follow-up work: None.

### P1-BM-03 — Inventory executable candidate script surface
- [x] Stable task ID: `P1-BM-03`
- Intended player-visible behavior: None (inventory-only first pass).
- Owning repository: `better-content-modpack`
- Source area: `kubejs/server_scripts` and staged directories (`check`, `remove`, `move`, `move_to_mod`, `refactor`)
- Dependencies: `P1-BM-01`
- Implementation note: Enumerate all `.js` files currently in executable kubejs roots and staged candidate directories; no gameplay edits yet.
- Validation evidence: `docs/refactor_manifests.md` contains exactly 105 candidate rows, matching the 105 `.js` files found recursively under the three active KubeJS roots.
- Deviations from this plan: None
- Follow-up work: None.

### P2-RO-01 — Build progression manifest
- [x] Stable task ID: `P2-RO-01`
- Intended player-visible behavior: N/A (discovery artifact used to prevent regressions).
- Owning repository: `better-content-modpack`
- Source area: Realistic Ores/pack runtime dependencies
- Dependencies: `P1-BM-03`
- Implementation note: Record canonical IDs, owners, prerequisites, outputs, and ownership of progression-critical recipes.
- Validation evidence: Linked `docs/refactor_manifests.md#progression_manifest` records exact installed recipe IDs from Build 68 jars and the owner, era, prerequisites, bypass action, and final surface for each spine root.
- Deviations from this plan: None
- Follow-up work: None.

### P2-RO-02 — Build ores processing matrix manifest
- [x] Stable task ID: `P2-RO-02`
- Intended player-visible behavior: N/A
- Owning repository: `better-content-modpack`
- Source area: Realistic Ores processing data and current script-generated recipes
- Dependencies: `P1-BM-03`
- Implementation note: Include each family block lifecycle, asset IDs, assay/route behavior, and terminal canonical items.
- Validation evidence: Linked `docs/refactor_manifests.md#realistic_ores_processing` records all 23 final families, current identities, canonical form pattern, primary output, ADLODS mapping, batch/grade/media/yield contracts, ownership, and asset status.
- Deviations from this plan: None
- Follow-up work: None.

### P2-TR-01 — Build transport capability manifest
- [x] Stable task ID: `P2-TR-01`
- Intended player-visible behavior: N/A
- Owning repository: `better-content-modpack`
- Source area: Eureka/VS/Clockwork/Trackwork integrations
- Dependencies: `P1-BM-03`
- Implementation note: Classify each transport root with conditions, outputs, and bypasses.
- Validation evidence: Linked `docs/refactor_manifests.md#transport_surface` records exact installed Eureka, Clockwork, Trackwork, and Create root recipe IDs, era/capability class, Machine Block root, Aether rule, and bypass policy.
- Deviations from this plan: None
- Follow-up work: None.

### P5-BCF-01 — Vanilla boat durability, destruction, and recipes
- [x] Stable task ID: `P5-BCF-01`
- Intended player-visible behavior: Vanilla boats and chest boats withstand ten times normal accumulated damage, drop no replacement vessel when destroyed, and use wood-matched TCon-reinforced recipes; modded vessels are unchanged.
- Owning repository: `better-content-fixes`
- Source area: config, a narrow `Boat` mixin, Minecraft recipe overrides, and GameTests
- Dependencies: Installed Forge 1.20.1 and TConstruct ingredient serializer.
- Implementation note: Live claims and clean repository status were re-read at 2026-08-20T07:14:47Z. `/root` owns this non-overlapping area. Vanilla bytecode confirms `Boat.hurt` uses a `40.0F` accumulated-damage threshold and `Boat.destroy` owns only the vessel item drop; `ChestBoat.destroy` separately preserves chest contents.
- Validation evidence: `./gradlew verifyFull` exited 0 on 2026-08-20; Gradle reported `BUILD SUCCESSFUL in 35s`, all 19 required Forge GameTests passed, and `VanillaBoatRecipeResourcesTest` passed under `:test`.
- Deviations from this plan: None.
- Follow-up work: None.

### P10-LC-01 — Fixed radioactive family integration
- [x] Stable task ID: `P10-LC-01`
- Intended player-visible behavior: Uranium/thorium forms have fixed family radiation and heat profiles without isotope NBT; natural ore is inert until disturbed and disturbed state persists.
- Owning repository: `latent-chemlib`
- Source area: nuclear form rule loader, emission scheduling, disturbance SavedData, public profile/event APIs
- Dependencies: Realistic Ores tag contract; no mandatory Heat Sync dependency
- Implementation note: Commit `68ef420` is pushed. Exact item/tag/block/tag v2 rules distinguish radiation, heat, inert, and placed behavior; bundled profiles consume `realistic_ores:radioactive_forms/...` tags. Heat is published through a fixed emission event and Heat Sync remains optional.
- Validation evidence: `./gradlew verifyFull --no-daemon` passed on 2026-08-20, including 37/37 Forge GameTests with Heat Sync absent, JVM tests, and JaCoCo gates. Runtime jar SHA-256 after pack integration: `82df151c04a1fb4e658bc46b83055bdd6c04be850578f3cc6475b16cc0333486`.
- Deviations from this plan: Combined era recipes remain pack-owned, so no native Latent recipe rewrite was added.
- Follow-up work: None.

### P11-HS-01 — Conserved Create boiler heater
- [x] Stable task ID: `P11-HS-01`
- Intended player-visible behavior: `heat_sync:boiler_heater` consumes exactly 1/2/3 stored heat for matching Create boiler strength and reports active state, comparator output, and goggles data.
- Owning repository: `heat-sync`
- Source area: block/block entity, capability, Create registration, config, persistence/network, optional Latent bridge, assets/recipe/tests
- Dependencies: Create 6.0.8; optional Latent emission event
- Implementation note: Commit `34f0f5e` is pushed. Server tick consumption is required because the installed Create registry provides a read-only heater lookup; only successfully delivered heat is advertised and inactive tanks return `NO_HEAT`.
- Validation evidence: `./gradlew verifyFull --no-daemon` passed on 2026-08-20, including 7/7 headless GameTests, JSON parsing, and `git diff --check`. Runtime jar SHA-256 in the pack: `ae72a760b441b54267e6255048df0bdb755715a68d62a25019b2403eb78f8353`.
- Deviations from this plan: Optional Ponder scene omitted as permitted. Create API adaptation is recorded above.
- Follow-up work: None.

### P3-RO-01 — Canonical salient ore lifecycle
- [x] Stable task ID: `P3-RO-01`
- Intended player-visible behavior: Ten legible deposits each have one canonical small-sample/full-chunk/crushed/concentrate lifecycle, exact host separation/reassembly, declared grinding media, thermal/TCon exits, and family-scoped discovery.
- Owning repository: `realistic-ores`
- Source area: Java registries/serializers, generated resources, worldgen, processing definitions, optional Excavated Variants integration
- Dependencies: Installed ChemLib/Create/TConstruct and optional Excavated Variants.
- Implementation note: Systemic Salience superseded the 23-family proof branch. `origin/agent/systemic-salience` implements Coal Measures, Ironstone, Copper Bloom, Tin Quartz, Brassroot, Redbed, Evaporite Beds, Gem Pipe, Hotstone, and Black Shale, with 27 audited outputs and no compatibility aliases for deleted geology.
- Validation evidence: `./gradlew verifyFull stageRuntimeJar` passes exact-count, no-obsolete-reference, worldgen/resource, morphology, processing-output, Create four-result-limit, and retained-output reachability contracts. Pack-level evidence is the supported `./smoke.sh` run recorded with the Systemic Salience integration commit.
- Deviations from this plan: TConstruct 1.20 uses one melting recipe pool for both Melter and Smeltery. Native shared values are 90/120/135 mB and Foundry values are 180/150/180 mB; distinct Smeltery-only middle yields would require a bespoke recipe interception. Gem reverse splitting is omitted because no cross-mod multiplication-safe contract was proven.
- Follow-up work: None.

### P5-BCF-02 — Install owning boat implementation
- [x] Stable task ID: `P5-BCF-02`
- Intended player-visible behavior: The validated Java implementation and exact vanilla recipe overrides replace broad KubeJS boat mutation/hiding.
- Owning repository: `better-content-modpack`
- Source area: `mods/better-content-fixes-0.1.0.jar`, pack index, obsolete boat scripts
- Dependencies: `P5-BCF-01`
- Implementation note: `stageRuntimeJar` passed; deployed the reobfuscated artifact, ran `packwiz refresh`, then deleted both superseded boat KubeJS candidates.
- Validation evidence: Installed jar SHA-256 `16c977e89517b94669e320448871d6f9f81345757d60ce2babf0a72526fba393`; final pack smoke passed.
- Deviations from this plan: None.
- Follow-up work: None.

### P6-PACK-01 — Six clean-break Machine Blocks and visual family
- [x] Stable task ID: `P6-PACK-01`
- Intended player-visible behavior: Six clearly differentiated, placeable Machine Blocks act only as era proofs and replace all old Machine Casing progression identities.
- Owning repository: `better-content-modpack`
- Source area: `kubejs/startup_scripts`, `kubejs/assets/kubejs`, bounded era recipe scripts
- Dependencies: `P2-RO-01`, installed Create/TCon/PNCR/PowerGrid/Creating Space IDs
- Implementation note: The image-generation skill produced a full-family 3x2 concept sheet. Final 16x16 faces were deterministically redrawn and palette-polished in Java, with opaque RGBA pixels, symmetric sides, aligned seams, and unique side/top/bottom textures for every tier. Live claims and dirty state were re-read immediately before this boundary; no claim overlaps the pack source area.
- Validation evidence: Native-scale viewer inspection completed for all six side faces; Java ImageIO generation established exact 16x16 RGBA output and SHA-256-distinct faces. Final `./smoke.sh` passed all runtime gates.
- Deviations from this plan: The lane has neither ImageMagick nor Pillow, so the final pixel cleanup/downsampling workflow used Java BufferedImage/ImageIO rather than installing OS packages. The generated concept sheet is reference-only; no raw AI image is shipped as a game texture.
- Follow-up work: None.

### P6-PACK-02 — Bounded era graph and candidate cleanup
- [x] Stable task ID: `P6-PACK-02`
- Intended player-visible behavior: The six eras have direct causal roots without universal casing ingredients, broad JSON recipe introspection, duplicate ore ownership, or obsolete casing/washed/tailings identities.
- Owning repository: `better-content-modpack`
- Source area: active KubeJS roots, inactive review boundary, assets, configs, and owning-mod runtime jars
- Dependencies: `P3-RO-01`, `P5-BCF-02`, `P10-LC-01`, `P11-HS-01`.
- Implementation note: Replaced 105 staged candidates with bounded progression/policy/compat scripts; retained reviewed unrelated behavior, quarantined the two JSON-inspection candidates outside executable roots, removed all superseded Realistic Ores and boat implementations, and deleted obsolete casing/box/ore-form assets.
- Validation evidence: Startup loaded 7/7 scripts with zero errors/warnings in the final smoke; server recipes, registries, and log-health gates passed. Runtime jar hashes are recorded in their owning tasks.
- Deviations from this plan: None.
- Follow-up work: None.

### P7-QD-01 — Quest and documentation migration
- [x] Stable task ID: `P7-QD-01`
- Intended player-visible behavior: The live book teaches the six-era causal route, exact ore lifecycle, fixed radioactive disturbance, Heat Sync boiler heating, acids, aerospace roots, and optional transport as branches.
- Owning repository: `better-content-modpack`
- Source area: six live FTB chapter files and `docs/` progression/content/ore guides
- Dependencies: Completed runtime graph.
- Implementation note: Preserved semantic IDs, assigned signed-safe unique IDs for new nodes, replaced old casing identities, added explicit Eureka/Trackwork/Clockwork branches, and synchronized descriptions/tasks/dependencies with implemented recipes and events.
- Validation evidence: Final smoke loaded the questbook and completed client join/log-health gates. Authoring review covered entry/trunk/branches, icon identities, literal dependencies, and concise action-led text; final in-game visual polish remains a normal playtest activity rather than a validation blocker.
- Deviations from this plan: No standalone quest layout renderer exists in the supported repository surface; runtime loading and manual source/layout review were used as specified by `docs/questbook_standards.md`.
- Follow-up work: None.

### P12-INT-01 — Install artifacts and validate the assembled pack
- [x] Stable task ID: `P12-INT-01`
- Intended player-visible behavior: The distributed pack boots a dedicated server, admits its client, exposes JEI/EMI and quests, and shuts down without fatal registration or mixin errors.
- Owning repository: `better-content-modpack`
- Source area: four local mod jars, Packwiz metadata, smoke runtime
- Dependencies: All implementation tasks.
- Implementation note: Installed and refreshed the validated Better Content Fixes, Realistic Ores, Latent ChemLib, and Heat Sync artifacts. Corrected two client-only Shoulder Surfing classifications and removed its incompatible optional camera-fix add-on after evidence-backed smoke failures.
- Validation evidence: `./smoke.sh` exited 0: `smoke passed: boot, join, settle, stop, log health`; run evidence is `/home/dev/.cache/bc/smoke/20260820T082409Z-2740424`.
- Deviations from this plan: Optional camera-fix add-on removed because it attempted an invalid mixin-on-mixin target against the installed Valkyrien Skies version.
- Follow-up work: None.

## Validation/failure log

- 2026-08-20T07:25Z — Machine Block texture inspection command exited 127 because ImageMagick's `identify` and `montage` binaries are not installed in the immutable lane. Classification: environment/tool availability, not a source regression. Resolution: use the available image viewer for native files and user-space image tooling already present in project language environments; do not modify the OS image.
- 2026-08-20T07:26Z — Pillow probe exited 1 (`ModuleNotFoundError: PIL`). Classification: environment/tool availability. Resolution: use the installed Java 17 `BufferedImage`/`ImageIO` APIs for deterministic 16×16 pixel generation; no system or Python package installation is needed.
- 2026-08-20T08:07Z — a zsh parameter expansion used an unsupported modifier while flattening reviewed scripts. Classification: authoring command syntax. Resolution: reran the move with explicit, safe parameter substitutions; no source content was lost.
- 2026-08-20T08:18Z — `apply_patch` could not delete binary PNG assets because they are not valid UTF-8. Classification: tool/content mismatch. Resolution: resolved and reviewed the exact obsolete asset paths first, then removed only those binary files directly.
- 2026-08-20T08:41Z — the first stale Realistic Ores asset cleanup piped newline-delimited paths into `sort -z`, producing a filename-too-long failure. Classification: authoring command delimiter mismatch. Resolution: reran the exact reviewed match set with `find -print0`; 180 superseded owned assets were removed.
- 2026-08-20T18:01Z — `./smoke.sh` was stopped with exit 130 after the server had already written a fatal mod-loading crash and an updater thread kept the failed JVM alive. Classification: pre-existing pack metadata error exposed by the required integration run. `ssrcamerafixes` was marked `side = "both"` despite loading `net.minecraft.client.Options`; Forge also reported a related client-class mixin transformation while constructing Create. Resolution: classify Shoulder Surfing Camera Fixes as client-only, refresh the pack index, and rerun the full smoke without weakening any gate.
- 2026-08-20T18:13Z — the second `./smoke.sh` run was stopped with exit 130 after its server crash report proved the remaining Create construction failure was independent of the camera-fix add-on. Bytecode inspection traced `net.minecraft.client.Minecraft` references to Shoulder Surfing Reloaded's dynamically selected Create compatibility mixins; the client camera mod itself was also marked `side = "both"`. Classification: pre-existing pack metadata error. Resolution: classify Shoulder Surfing Reloaded as client-only, refresh, and rerun the unchanged smoke gates.
- 2026-08-20T18:23Z — the third `./smoke.sh` reached a ready server but exited at the client-before-join gate. The captured client log identified `ssrcamerafixes.mixins.json:MixinVsCameraSkipZoomOnSsr` attempting to target Valkyrien Skies' `MixinCamera`, which Mixin rejects because the target is itself a mixin. Classification: incompatible optional add-on version, unrelated to the refactor content. Resolution: remove Shoulder Surfing Camera Fixes & Additions; keep the base client-only Shoulder Surfing mod, refresh, and rerun the unchanged smoke gates.
- 2026-08-20T18:33Z — final `./smoke.sh` exited 0 and passed boot, join, settle, stop, and log-health gates. Evidence: `/home/dev/.cache/bc/smoke/20260820T082409Z-2740424`.
