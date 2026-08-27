# Better Content Implementation Plan

This is the maintained implementation contract for the completed clean-break
progression refactor. It describes current ownership and change procedure. Exact
recipes, IDs, values, and behavior live in executable source and the focused
documents under `docs/`.

## Objectives

- Keep the six-era progression causal, reachable, and legible.
- Keep runtime systems in their owning custom mods and retain only narrow
  cross-mod policy in KubeJS.
- Keep all active KubeJS files intentionally executable and indexed.
- Treat installed registry IDs, current mod APIs, and generated resources as the
  implementation authority.
- Make clean breaks explicit; do not invent aliases or migrations that the
  owning implementation does not support.

## Current progression spine

1. Hand Workshop: native TConstruct tools, a Dimension Font expedition, seared
   metallurgy, cast Andesite Alloy, and hand-cranked Create work.
2. Powered Works: Andesite and Copper Machine Blocks root milling, pressing,
   mixing, pumps, renewable kinetic power, and primitive transport.
3. Precision Factory: TConstruct brass and the Brass Machine Block root
   deployment, mechanical crafting, trains, and precision control.
4. Thermal & Pressure: heated Nether grout, the Airtight Machine Block,
   PneumaticCraft pressure, acids, and Heat Sync process heat.
5. Electrical Control: the Electrical Machine Block roots generation, circuit
   design, sensors, and nitric or selected mixed-acid processing.
6. Aerospace: the Space Machine Block roots Creating Space engineering,
   atmosphere processing, propulsion, guidance, and life support.

Machine Blocks appear only at their explicit capability roots. Downstream
recipes return to native mod parts. Optional Eureka, Clockwork, Trackwork, and
Create train branches never become prerequisites for the ordinary factory spine.

## Runtime ownership

- Realistic Ores owns its 23 geological families, worldgen, block lifecycle,
  processing definitions, grinding media, outputs, tags, and assets.
- Latent ChemLib owns contained chemistry, radioactive family profiles,
  disturbance persistence, and heat emissions.
- Heat Sync owns industrial heat storage and transfer, pipe ambient mapping,
  hot water, coolant exchange, and Create boiler heating. It is a native system,
  not a bridge to a retired temperature mod.
- Dimension Drink owns Dimension Font worldgen and neutral-charge obelisk travel.
  The unmodified economy is 15,000 capacity, a 600-charge start cost, 0 join cost,
  0.25 passive charge per inactive tick, and active drain of 80 plus 40 per participant
  per second. A full Font therefore supplies 120 solo active seconds after entry.
  It exposes no resource fluid, resource item input, or compatibility
  heart path. Charge exhaustion returns participants and closes the run.
- Settlement Roads owns settlement graph planning, persistence, and placement.
  Ground roads are complete three-wide dirt-path surfaces in grassy biomes and
  gravel in non-grassy biomes, with deterministic 20% coarse-dirt edge detail.
  Ground roads have no cobblestone guide marks or walls; bridge masonry remains.
- Better Content Fixes owns bounded pack repair behavior that requires Java or
  mixins, including reinforced vanilla boat behavior and exact recipe resources.
- Tinkers' Construct Affixes owns its material profiles and combat integration.
- World Lifecycle Manager and Player Traces remain independent required custom
  mods with non-overlapping persistence responsibilities.

## KubeJS boundary

The three active roots contain 72 scripts: 6 client, 58 server, and 8 startup.
Every JavaScript file below those roots executes recursively. Directories named
`retained` or `reviewed` communicate review history, not inactive state. The
exact current path index is `kjs-script-summaries.md` and the summarized
ownership manifest is `docs/refactor_manifests.md`.

KubeJS may own:

- stable pack Machine Blocks and genuinely cross-mod transition items;
- explicit recipes that combine outputs from multiple owners;
- exact progression removals, tags, tooltips, economy offers, and optional-mod
  guards required by the pack;
- bounded compatibility glue with an identified owner and reason.

KubeJS must not duplicate a custom mod's registry, lifecycle, persistence,
worldgen, processing catalogue, or broad recipe inspection.

## Documentation contract

Living docs are extensible. Add a focused document when needed and index it in
`docs/README.md`; do not enforce a fixed count. Update the closest living docs,
`docs/refactor_manifests.md`, and `kjs-script-summaries.md` with the implementing
change. Historical run evidence stays outside the tracked documentation tree.

## Change procedure

1. Read the workspace and repository `AGENTS.md` files, claims, and dirty state.
2. Trace the proposed statement through source, resources, metadata, and the
   deployed artifact before changing it.
3. Implement in the owning repository; preserve unrelated work and clean-break
   policy.
4. Run that repository's documented validation and stage its reobfuscated
   runtime JAR when deployment is required.
5. Commit and push each coherent repository-local change.
6. Copy requested runtime JARs to `better-content-modpack/mods/`, run
   `packwiz refresh`, update living docs, and commit the pack integration.
7. Run `./smoke.sh` as the sole supported assembled-pack runtime evaluation.

The live completion record is `REFACTOR_CHECKLIST.md`; it must describe current
state, never an imaginary active agent or stale next action.
