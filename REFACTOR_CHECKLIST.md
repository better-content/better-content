# Better Content Refactor Checklist

## Header
- Objective: Execute a clean-break progression migration for Better Content with six-era causal graph and owning-mod migrations for Realistic Ores, Latent ChemLib, Heat Sync, Better Content Fixes, and pack KubeJS.
- Current phase: Phase 1 — Control, Claims, and Baseline Capture
- Active repository: better-content-modpack
- Active task: Capture baseline state, reconcile claims, inventory staged KubeJS candidates, and establish ownership mapping.
- Last reviewed UTC timestamp: 2026-08-20T00:00:00Z
- Last completed checkpoint: AGENTS.md and baseline git status + claim files captured.
- Exact next action: Reconcile active claims and classify executable KubeJS candidates before any gameplay edits.
- Known blockers: Active overlapping claims in `agent-work`; unknown recipe IDs/registry identities for some installed optional addons.
- Active lane claims: `/root/host_tags`, `/root/realistic_mod`
- Current validation status:
  - `better-content-modpack`: Not yet run
  - `realistic-ores`: Not yet run
  - `latent-chemlib`: Not yet run
  - `heat-sync`: Not yet run
  - `better-content-fixes`: Not yet run

## Task ledger

### P1-BM-01 — Baseline capture and claim resolution
- [ ] Stable task ID: `P1-BM-01`
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
- Deviations from this plan: Not yet applicable
- Follow-up work: none yet

### P1-BM-02 — Reconcile active claims for realistic ore lifecycle and tags
- [ ] Stable task ID: `P1-BM-02`
- Intended player-visible behavior: Prevent duplicate ownership conflicts while staging migration.
- Owning repository: `better-content-modpack`
- Source area: `/home/dev/.local/share/worklane/agent-work/`
- Dependencies: `P1-BM-01`
- Implementation note: Existing active claims identified:
  - `/root/host_tags` owns `kubejs/server_scripts/10_tags/60_realistic_ores_deposit_tags.js`, `.../50_loot/13_realistic_ores_surface_sample_drops.js`, `.../40_recipe_add/52_realistic_ores_excavated_host_cycles.js`
  - `/root/realistic_mod` owns `realistic-ores` core migration work in progress.
- Validation evidence: Claimed files listed and no third claim overlaps currently inspected.
- Deviations from this plan: None
- Follow-up work: update/extend primary claim before touching claimed files.

### P1-BM-03 — Inventory executable candidate script surface
- [ ] Stable task ID: `P1-BM-03`
- Intended player-visible behavior: None (inventory-only first pass).
- Owning repository: `better-content-modpack`
- Source area: `kubejs/server_scripts` and staged directories (`check`, `remove`, `move`, `move_to_mod`, `refactor`)
- Dependencies: `P1-BM-01`
- Implementation note: Enumerate all `.js` files currently in executable kubejs roots and staged candidate directories; no gameplay edits yet.
- Validation evidence: Pending.
- Deviations from this plan: None
- Follow-up work: classify each file as migrate-to-mod, replace in KubeJS, retain-out-of-scope, remove-after-replacement.

### P2-RO-01 — Build progression manifest
- [ ] Stable task ID: `P2-RO-01`
- Intended player-visible behavior: N/A (discovery artifact used to prevent regressions).
- Owning repository: `better-content-modpack`
- Source area: Realistic Ores/pack runtime dependencies
- Dependencies: `P1-BM-03`
- Implementation note: Record canonical IDs, owners, prerequisites, outputs, and ownership of progression-critical recipes.
- Validation evidence: Not yet run.
- Deviations from this plan: None
- Follow-up work: add cross-links to dependent assets and KubeJS replacements.

### P2-RO-02 — Build ores processing matrix manifest
- [ ] Stable task ID: `P2-RO-02`
- Intended player-visible behavior: N/A
- Owning repository: `better-content-modpack`
- Source area: Realistic Ores processing data and current script-generated recipes
- Dependencies: `P1-BM-03`
- Implementation note: Include each family block lifecycle, asset IDs, assay/route behavior, and terminal canonical items.
- Validation evidence: Pending.
- Deviations from this plan: None
- Follow-up work: include ADLODS mapping and surface indicators.

### P2-TR-01 — Build transport capability manifest
- [ ] Stable task ID: `P2-TR-01`
- Intended player-visible behavior: N/A
- Owning repository: `better-content-modpack`
- Source area: Eureka/VS/Clockwork/Trackwork integrations
- Dependencies: `P1-BM-03`
- Implementation note: Classify each transport root with conditions, outputs, and bypasses.
- Validation evidence: Pending.
- Deviations from this plan: None
- Follow-up work: apply explicit gating recipes in era scripts.
