# Better Content Reconciliation Checklist

Updated 2026-08-26. This checklist records current reconciliation state. The
original migration is complete; there is no standing next action or permanent
agent assignment. New work begins from current repository state and live lane
claims.

## Implementation

- [x] Dimension Drink uses neutral internal charge only; legacy resource-fluid,
  resource-item, compatibility-heart, and arrival-scatter paths are removed.
- [x] The unmodified Font economy is 15,000 capacity, a 600-charge start cost,
  zero join cost, 0.25 passive charge/inactive tick, and 80 + 40/player
  drain/second, for 120 solo active seconds from full charge after entry.
- [x] Active Font sessions ticket their origin chunk and close on exhausted
  charge, returning participants.
- [x] Settlement Roads is active and places complete three-wide dirt path or
  gravel roads with deterministic 20% coarse-dirt edge detail.
- [x] Ground settlement roads have no cobblestone guide marks or roadside walls;
  bridge-specific stonework remains.
- [x] Heat Sync documentation and symbols describe the native Heat Sync system
  without retired mandatory dependencies.
- [x] Custom-mod metadata points at canonical Better Content repositories and
  issue trackers.
- [x] Repository validation and deployment instructions match implemented tasks,
  artifact names, wrapper policy, and helper paths.
- [x] The KubeJS index covers all 72 active scripts: 6 client, 58 server, and 8
  startup. No fixed living-document count is enforced.
- [x] Refactor manifests and plan describe current implementation instead of the
  retired staging inventory or obsolete ore yields.

## Validation and integration

- [x] Required custom-mod validation passes for every changed implementation or
  build surface.
- [x] Reobfuscated runtime JARs are staged and copied into `mods/` where source
  or embedded metadata changed.
- [x] `packwiz refresh` records the installed artifacts.
- [x] `git diff --check` passes in every changed repository.
- [x] Each coherent source-repository change is committed and pushed.
- [x] The final assembled-pack `./smoke.sh` passes boot, join, settle, shutdown,
  and fatal-log checks.

## Recorded evidence

Required repository gates passed before delivery. Fast gates were used where
the governing repository defines them; full gates covered Dimension Drink (8
GameTests), Dynamic Trees Malum (2), Heat Sync (17 with and without Creating
Space), Latent ChemLib (32 plus its production-refmap postcondition), Pillager
Campaigns (3), Player Traces (11), Settlement Roads (6), TConstruct Affixes
(7), Village Walls (2), Procedural Bouquets (7), and the other repositories'
documented release checks.

Source commits pushed for this reconciliation:

- Better Content Fixes `8916049`; Class Selector `fa0767a`; Create Transmission
  Loss `7499b74`; Dimension Drink `966e4c0`.
- Dynamic Trees Dimension `e0c2644`; Hexerei `233377d`; Malum `030bd2b`; Heat
  Sync `15d925d`; Latent ChemLib `cd7bcbc` and `6369cba`.
- OC2R Wireless `d034f91`; Pillager Campaigns `951d53e`; Player Traces
  `6c555aa`; Realistic Ores `096d892`.
- Settlement Roads `768e8ef`; TConstruct Affixes `f3aa88a`; Village Walls
  `d483afd`; World Lifecycle Manager `d66f0b5`.

Procedural Bouquets needed no source edit: validated HEAD `8b54706` was rebuilt
and its current runtime JAR replaced the stale pack copy. Deployed SHA-256
hashes are:

| Artifact | SHA-256 |
|---|---|
| Better Content Fixes | `76de799413c01d3d5685a1489004f5ce6cbd88880dc781c14e541c55a70a1290` |
| Class Selector | `f9465ba1cb4fe24dbe7115aff87c90859f9aee9bdc58b89dd0c7ed2852b4de38` |
| Dimension Drink | `eefa528e9b1ad6404cbca254d0f6600fd36c3c5c2772592dc73184e172d636d3` |
| Dynamic Trees Dimension | `feac6d662136b723d3803d308f075c7c56a03af5cccd934c9897a0c623e2d4c3` |
| Dynamic Trees Hexerei | `f370c0e70c3276533ca02d6006057662c7dea69c660c1251025bc0395cfcce3a` |
| Dynamic Trees Malum | `8cf89cc1211c497bdc168c01e51331361b56eadbb075390a6b096381a6a38f48` |
| Heat Sync | `dd2a2283ef5838d81945a45616e12ddb45e3a3401966846c630aaa9d97b1619c` |
| Latent ChemLib | `0ddbc1b068ef1a363266867cd3e363861c247fea494f4de3bdd63f10b5628272` |
| OC2R Wireless | `ea659de29b8f2d22417269845e0448fa5b931e4e3a15dedeb40ea33c0f66de48` |
| Pillager Campaigns | `301e07dee53bb4c97fb060f4130c2ab96670522a373343260693d034056c0f08` |
| Procedural Bouquets | `85ceb91f0f4c36b018b67d24be6945b692e3b93f23c1867b79d6140b75f9872e` |
| Settlement Roads | `166a858df01227f9a79c268455c6e7aa6813c3fb192c1893304a12b931194f41` |
| TConstruct Affixes | `d555aaa643f6a6a1d54b0ab991357712b59ad59dd9d7f52e74c59039bc91133e` |
| Village Walls | `541eec5208fb07858c29b83ff0f140a417543db5e3087edd56a0b181f8c34a9f` |

The final `./smoke.sh` passed boot, rollback/recovery, health-verified
interruption, successor commit, client join, terrain and EMI settle, both World
Condenser GUI captures, clean shutdown, and fatal-log checks. Evidence:
`/home/dev/.cache/bc/smoke/20260826T012638Z-2038327`.

Smoke also exposed two integration defects that were fixed before acceptance:
Latent ChemLib now rejects production JARs without its mixin refmap, and C2ME's
replacement/async I/O pair is disabled because it raced Dynamic Trees' plain
Poisson-disc cache and stalled successor recovery when only half-disabled.
C2ME threaded world generation and no-tick view distance remain active.
