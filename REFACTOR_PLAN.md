# Better Content Major KubeJS and Technology Progression Refactor

## 1. Objective and Definition of Success

Rebuild the pack’s early and middle technology progression into a legible causal graph centered on:

- Tinkers’ Construct for primitive tools, casting, melting, alloying, Smeltery, and Foundry.
- Create for hand-cranked workshop machinery, kinetic automation, and precision manufacturing.
- Eureka/VS, Clockwork, Trackwork, rail addons, and related Create transport as optional engineering branches.
- Realistic Ores for deposit identity, mining, prospecting, host preservation, crushing, separation, coproducts, and ore-specific assets.
- PneumaticCraft for contained pressure, gases, and thermal chemistry.
- PowerGrid and compatible circuit mods for electrical engineering.
- Latent ChemLib for chemical-state behavior, gasification, radiation, and disturbed radioactive material.
- Heat Sync for shared heat transport, heat-producing radioactive forms, and Create boiler heating.

The completed graph has six named eras:

1. Hand Workshop
2. Powered Works
3. Precision Factory
4. Thermal & Pressure
5. Electrical Control
6. Aerospace

Success means:

- A player can understand why each era follows the previous one.
- Every required progression root is reachable without circular recipes.
- There is no unintended passive Create power before a Font expedition and Nether access.
- TCon metallurgy is necessary before Create machinery.
- Realistic Ore deposits behave like mixed geological bodies instead of reskinned vanilla ore.
- Advanced ore recovery provides bounded, understandable rewards without a universal processing chain.
- Primitive VS experiments are available early while reliable advanced flight remains later.
- Uranium and thorium remain normally obtainable but become materially hazardous after disturbance.
- Heat Sync heat is consumed, conserved, and useful for Create boilers.
- KubeJS contains only pack-specific, explicit integration glue.
- Reusable mechanics live in Realistic Ores, Latent ChemLib, Heat Sync, or Better Content Fixes.
- The final pack passes its sole supported runtime evaluation, `./smoke.sh`.

AE2, Raw Impossible, Impossible, Protection Pixel, post-AE2 utility convergence, and the wider magic rewrite are excluded from this pass except where an in-scope script must avoid breaking their later entry points.

---

## 2. Current-State Protection

The current Better Content worktree contains a major user-authored classification pass:

- Most former scripts are deleted at their original locations.
- Candidate scripts now appear under `check/`, `remove/`, `move/`, `move_to_mod/`, and `refactor/`.
- Unrelated changes exist in pack metadata, documentation, and mod declarations.
- Existing claims cover Realistic Ores tags, sample drops, Excavated Variants host cycles, resources, recipes, and documentation.

These conditions are binding:

- Treat every existing modification and untracked file as user-owned.
- Do not restore the deleted legacy layout wholesale.
- Do not discard a classified candidate until its behavior has been inventoried.
- Do not touch unrelated changes in `pack.toml`, `index.toml`, `docs/performance_and_mods.md`, or unrelated `mods/*.pw.toml` unless integration of a rebuilt custom mod strictly requires it.
- Reconcile the two active Realistic Ores claims before overlapping edits.
- KubeJS loads JavaScript recursively under its active script roots. Folder names such as `remove`, `check`, and `refactor` do not disable scripts. The final tree must therefore contain only intentionally executable `.js` files.
- In-scope legacy scripts may be used as behavioral references but none survive unchanged.
- Out-of-scope candidate scripts are either left exactly as user-organized if they are intentionally active, or moved out of executable KubeJS roots after confirming the user’s intent. They are not silently deleted as collateral cleanup.
- Do not create a replacement `tools/` tree or depend on quarantined code.

This is a clean-break gameplay migration:

- New Machine Block IDs replace Machine Casing IDs.
- `corundum_beryl_gem_vein` becomes the amethyst-beryl pegmatite family.
- Washed concentrates and generic tailings leave the active processing graph.
- No compatibility aliases, recipe aliases, missing-block migrations, or DFU are added for pre-refactor identities.
- Existing worlds are not guaranteed to retain removed KubeJS blocks or items. World backup and a new-world recommendation must be documented in release notes.

---

## 3. Mandatory On-Disk Checklist

Before the first source edit, create:

`/home/dev/better-content-modpack/REFACTOR_CHECKLIST.md`

It is a tracked operational document, not a generated validator. It must contain:

### Header

- Objective.
- Current phase.
- Active repository.
- Active task.
- Last reviewed UTC timestamp.
- Last completed checkpoint.
- Exact next action.
- Known blockers.
- Active lane claims.
- Current validation status for each repository.

### Task-entry format

Every task records:

- Stable task ID such as `P3-RO-07`.
- Checkbox.
- Intended player-visible behavior.
- Owning repository.
- Source area.
- Dependencies.
- Implementation note.
- Validation evidence.
- Deviations from this plan.
- Follow-up work, if any.

### Required review cadence

Read and update the checklist:

- at the beginning of every work session;
- after compaction or loss of conversational context;
- before the first edit in any repository;
- before switching repositories;
- before starting a new phase;
- after each bounded feature is implemented;
- after every failed build or test;
- after resolving a failure;
- before marking any item complete;
- before every commit;
- before replacing a custom-mod artifact in the pack;
- before the final pack smoke;
- at final handoff.

A task is checked only when its evidence field is filled. “Code written” is not evidence.

### Repository safety checkpoint

Before editing each repository:

1. Read every claim in `/home/dev/.local/share/worklane/agent-work/`.
2. Run `git status --short`.
3. Record overlapping dirty files in the checklist.
4. Create or update the primary agent’s own claim.
5. Resolve active overlapping claims before editing the claimed area.
6. Preserve unrelated dirty and untracked files.

### Failure handling

When validation fails:

- leave the affected checklist item unchecked;
- record the command, exit status, and concise failure;
- determine whether it is caused by the current change, pre-existing work, dependency resolution, or environment;
- fix in-scope regressions before continuing;
- do not hide, weaken, or remove existing validation to obtain a pass;
- do not proceed to pack integration with a failing required sibling-mod check.

The checklist is complete only when all required tasks are checked, every deviation is explained, no claim overlap remains unresolved, and the final `./smoke.sh` result is recorded.

---

## 4. Execution Phases

## Phase 1 — Control, Claims, and Baseline Capture

- Create the on-disk checklist.
- Capture `git status --short` for:
  - `better-content-modpack`;
  - `realistic-ores`;
  - `latent-chemlib`;
  - `heat-sync`;
  - `better-content-fixes`.
- Read each repository’s `AGENTS.md`.
- Reconcile existing claims over:
  - deposit tags;
  - surface sample drops;
  - Excavated Variants host cycles;
  - Realistic Ores resources and documentation.
- Inventory all executable KubeJS files currently under action-named directories.
- Classify each in-scope script as:
  - replace with new pack glue;
  - move behavior into an owning mod;
  - remove after replacement exists;
  - retain only for an out-of-scope system;
  - reject as obsolete or unsafe.
- Record the current custom-mod artifact/version flow so rebuilt sibling jars are installed through the repository’s documented process.
- Do not change gameplay during this phase.

Phase gate: the checklist exists, dirty work is recorded, claims are resolved, and every in-scope candidate script has an owner.

## Phase 2 — Detailed Discovery and Planning-Limit Remedy

The present plan cannot safely enumerate every installed addon recipe ID, registry identity, or runtime compatibility hook from conversational context alone. Phase 2 resolves only discoverable implementation facts; it does not reopen the gameplay decisions in this plan.

Create three detailed sections in the checklist or linked tracked Markdown documents:

### `progression_manifest`

For every progression-critical output, record:

- canonical item or block ID;
- owning mod;
- era;
- whether it is an era root or downstream item;
- native recipe IDs;
- all pack-authored recipe IDs;
- required input forms;
- machine or crafting surface;
- direct prerequisites;
- downstream consumers;
- known alternate acquisitions;
- loot, trade, quest, or worldgen bypasses;
- removal or replacement action;
- final authoritative recipe owner.

Required coverage includes:

- TCon stations, Melter, Smeltery, Foundry, casts, grout, nether grout;
- Create Hand Crank, shafts, cogs, belts, casings, Millstone, Press, Mixer, Deployer, Mechanical Crafter, passive power, pumps, trains, and addon roots;
- all six Machine Blocks;
- PneumaticCraft compressed iron, pressure tubes, compressor, pressure chamber, gas and chemistry roots;
- PowerGrid conductive casing, first generation, storage, wires, motors, and circuit roots;
- Creating Space aerospace roots;
- Latent ChemLib machines and handling surfaces;
- Heat Sync pipes, firebox, coolant, and Boiler Heater.

### `realistic_ores_processing`

For every deposit, record:

- family ID;
- current block, sample, chunk, and crushed IDs;
- intended final IDs;
- native and Excavated Variants hosts;
- scattered-vein worldgen;
- ADLODS large-deposit mapping;
- surface-indicator mapping;
- primary material;
- assay constituents and grades;
- permitted grinding media;
- permitted fluid routes;
- primary and coproduct outputs;
- thermal exits;
- molten forms;
- final canonical item forms;
- uranium/thorium hazard profile;
- asset status.

### `transport_surface`

For every Eureka/VS/Create-addon root, record:

- item ID;
- native recipe IDs;
- installed-mod condition;
- capability it unlocks;
- primitive, precision, thermal, electrical, or aerospace class;
- Machine Block root, if any;
- native downstream component that replaces further Machine Block use;
- Aether material requirement;
- bypasses through loot, assemblies, alternate crafting, or addon compatibility.

### Phase-2 resolution rules

- Inspect installed source, jars, generated recipes, and registry resources.
- Prefer exact recipe IDs over broad output removal.
- Use explicit mod-loaded conditions for genuinely optional addons.
- Mandatory progression items must not silently disappear through `Item.exists` checks.
- If an installed identifier differs, substitute the installed identifier without changing gameplay.
- If an installed API has a supported equivalent, use it.
- Stop for user direction only if a required behavior is technically impossible or two installed mods impose mutually exclusive requirements.
- Do not create a new pack linter, validator, graph solver, or audit command. The manifests are human-maintained implementation records.
- Update the on-disk checklist at the end of every inventory group.

Phase gate: all three manifests are complete enough to trace every direct era root from world acquisition to its first downstream consumer, with no unresolved recipe ownership.

## Phase 3 — Realistic Ores Ownership Migration

Implement Realistic Ores changes before deleting their KubeJS predecessors.

### Registry and lifecycle ownership

Move into `realistic_ores`:

- deposit-family item registrations;
- small chunk BlockItems;
- surface sample placement behavior;
- surface sample loot;
- chunk and crushed-feed resources;
- deposit tags;
- native host block separation;
- host-preserving reconstruction;
- optional Excavated Variants compatibility;
- Create crushing and milling recipes;
- Create separation recipes;
- furnace, Melter, Smeltery, and Foundry recipes;
- grinding-ball items and return behavior;
- concentrate items;
- gem chips;
- relevant molten forms;
- language, models, textures, and recipe-viewer resources.

Keep in the modpack:

- ADLODS configuration and deposit frequency;
- progression recipes that combine Realistic Ores outputs with unrelated pack-specific era roots;
- pack quests and documentation;
- optional cross-mod gates that are unique to this pack.

### Deposit family identities

The final active families are:

1. `coal_measures`
2. `ironstone`
3. `copper_sulfide`
4. `tin`
5. `zinc`
6. `lead_zinc_vein`
7. `quartz_vein`
8. `bauxite_laterite`
9. `nickel_sulfide`
10. `osmiridium_lava_sulfide`
11. `tin_tungsten_greisen`
12. `titanium_iron_oxide`
13. `kimberlite_pipe`
14. `emerald_schist_beryl`
15. `amethyst_beryl_pegmatite`
16. `uranium_ore`
17. `thorium_ore`
18. `cupriferous_redbed_redstone_vein`
19. `lazurite_vein`
20. `phosphate_rock`
21. `soul_bearing_black_shale_soulstone_vein`
22. `sulfur_bearing_pyrite_ore`
23. `gold_quartz_vein`

Rename the former corundum-beryl family throughout registrations, resources, worldgen, tags, recipes, language, quests, and docs. Do not retain the old name as an alias.

### Small chunk and surface sample contract

For each family:

- Register `realistic_ores:small_ore_chunk_<family>`.
- The item is the BlockItem for the matching `surface_sample_<family>` block.
- Placing the item creates that sample block.
- Breaking the sample without Silk Touch returns exactly one identical small chunk.
- Silk Touch also returns exactly one small chunk; it does not expose a separate sample item.
- Fortune does not increase the drop.
- Explosions may destroy the sample according to ordinary block survival; they must never duplicate it.
- Nine matching small chunks shapelessly craft into one full deposit chunk.
- The 9:1 conversion is irreversible.
- Small chunks do not furnace, melt, crush, mill, wash, leach, dissolve, or enter generic ore-processing tags.
- Recipe viewers show only placement identity and the 9:1 recipe.
- Existing surface sample worldgen places the same block state and therefore yields the new small chunk item.

### Ordinary ore block lifecycle

- Natural mining without Silk Touch gives exactly one full family chunk.
- Fortune does not multiply it.
- Silk Touch returns the exact hosted ore block.
- Hosted ore blocks do not enter generic ore item tags used by third-party processing.
- The only processing action for a hosted block item is exact separation:
  - input: exact hosted block;
  - output: one family chunk and the exact substrate.
- Reassembly consumes:
  - one family chunk;
  - one exact substrate;
  - output: exactly the corresponding hosted ore block.
- Separation and reassembly remain lossless and one-for-one.
- Native stone/deepslate hosts use static resources.
- Excavated Variants compatibility identifies both the deposit and its modified host at runtime.
- Runtime variants receive mining tags and exact cycle recipes but remain excluded from generic processing-facing ore item tags.
- Unknown runtime variants log one concise warning and receive no lossy fallback recipe.

### Scattered veins and ADLODS

Maintain two intentional geological scales:

- Realistic Ores scattered veins provide ordinary exploration and mining.
- ADLODS provides large, uncommon industrial bodies.

ADLODS remains pack-owned because it already works and complements scattered veins.

For every discoverable ADLODS body:

- map it to a Realistic Ores family;
- configure a corresponding surface indicator;
- ensure the indicator uses the family’s surface sample block;
- ensure multiple nearby indicators do not create an ore duplication loop;
- use direct exposure instead of an artificial indicator where lava-exposed geology is naturally visible;
- remove or remap obsolete ADLODS deposits that bypass the family model.

Add `gold_quartz_vein` at approximately 25% of ordinary quartz-deposit frequency:

- same broad geological depth family as ordinary quartz;
- smaller average body than common quartz;
- moderately rare, not treasure-only;
- separate sample, small chunk, chunk, crushed feed, processing definition, tags, loot, and assets;
- normal quartz remains common and unchanged in purpose.

Uranium and thorium retain normal scattered-vein and ADLODS availability. Do not reduce them to token rarity and do not disable their sensible raw thermal exits.

### Processing states

The final production graph is:

```text
hosted ore block
  ├─ Silk Touch → exact hosted ore block
  └─ ordinary mining → full family chunk
surface sample ⇄ placed sample
  └─ 9 small chunks → full family chunk
full chunk
  ├─ early thermal exit
  ├─ Millstone → crushed feed, expected 1.1
  └─ Crushing Wheels → crushed feed, expected 1.9
crushed feed
  ├─ improved thermal exit
  └─ curated separation → named concentrate(s)
named concentrate
  └─ best thermal or molten exit
```

Remove from the active graph:

- universal `washed_*` forms;
- generic mineral tailings;
- a generic wash step;
- assay items;
- universal solvent compatibility;
- generic waste-to-value recovery;
- Alchemistry dissolution as an alternate universal ore ladder.

Existing washed-concentrate and tailings registrations, models, textures, recipes, and visibility rules are removed once no active recipe or quest refers to them.

### Crushing yields

Millstone recipe for one full chunk:

- one guaranteed crushed feed;
- one independent 10% bonus crushed feed;
- expected output: 1.1.

Crushing Wheels recipe for one full chunk:

- one guaranteed crushed feed;
- three independent 30% bonus crushed feeds;
- range: 1–4;
- expected output: 1.9.

No other pre-separation random yield multiplier is added.

### Separation batch format

Every separation recipe consumes:

- four matching crushed feeds;
- one valid grinding ball;
- exactly the route fluid specification.

Fluid specifications:

- Water route: 500 mB water.
- Single-acid route: 250 mB water plus 250 mB named acid.
- Mixed-acid route: 250 mB hydrochloric acid plus 250 mB nitric acid.
- Mixed acid is the only route without additional water.
- Create’s native two-fluid mixing support is used.
- No custom leaching workstation is added.

Every successful batch returns:

- four primary concentrates deterministically;
- each unlocked coproduct independently at its grade probability;
- the grinding ball according to its return chance;
- no tailings;
- no washed form.

Assay probabilities:

- Major: 100%.
- Minor: 50%.
- Trace: 20%.
- Precious: 5%.

### Exact deposit separation matrix

“Outputs” below are coproduct concentrates. Four primary concentrates are always produced unless the route is invalid.

| Deposit | Primary | Route 1 | Route 2 | Route 3 |
|---|---|---|---|---|
| Coal measures | Coal | Andesite + water → carbon 100% | Blood + HCl → carbon 100%, iron 20% | None |
| Ironstone | Iron | Iron + water → nickel 50% | Steel + HCl → chromium 20% | Nickel + nitric → nickel 50%, chromium 20% |
| Copper sulfide | Copper | Brass + water → sulfur 100%, iron 50% | Steel + sulfuric → sulfur 100%, iron 50% | Nickel + mixed acid → sulfur 100%, iron 50%, gold 5% |
| Tin | Tin | Brass + water → quartz 100% | Steel + HCl → quartz 100%, tungsten 20% | Titanium + nitric → tungsten 20% |
| Zinc | Zinc | Brass + water → lead 50% | Steel + sulfuric → lead 50%, cadmium 20% | Nickel + nitric → cadmium 20% |
| Lead-zinc | Lead | Brass + water → zinc 100% | Steel + sulfuric → zinc 100% | Nickel + nitric → zinc 100%, silver 5% |
| Quartz vein | Quartz | Andesite + water → silicon 100% | Brass + HCl → silicon 100%, copper 20% | Nickel + mixed acid → silicon 100%, copper 20%, gold 5% |
| Bauxite laterite | Aluminum | Steel + sulfuric → nickel 50% | Titanium + HCl → titanium 50%, gallium 20% | None |
| Nickel sulfide | Nickel | Iron + water → sulfur 100%, iron 50% | Nickel + sulfuric → cobalt 20% | Titanium + mixed acid → cobalt 20%, platinum 5% |
| Osmiridium sulfide | Osmium | Nickel + water → sulfur 100% | Titanium + nitric → iridium 50% | Titanium + mixed acid → iridium 50%, platinum 5% |
| Tin-tungsten greisen | Tungsten | Brass + water → tin 100%, quartz 100% | Steel + HCl → tin 100%, quartz 100% | Titanium + nitric → tin 100%, tantalum 20% |
| Titanium-iron oxide | Titanium | Iron + water → iron 100% | Steel + HCl → iron 100%, chromium 20% | Titanium + sulfuric → iron 100%, chromium 20% |
| Kimberlite | Diamond | Steel + water → carbon 100%, magnesium 50% | Blood + HCl → carbon 100% | Fluix + HCl → magnesium 50% |
| Emerald schist-beryl | Emerald | Steel + water → beryl 100% | Titanium + HCl → beryllium 50%, silicon 20% | Fluix + HCl → aluminum 50%, silicon 20% |
| Amethyst-beryl pegmatite | Amethyst | Steel + water → aluminum 100%, quartz 50% | Titanium + HCl → beryllium 50%, quartz 50% | Fluix + HCl → aluminum 100%, beryllium 50% |
| Uranium ore | Uranium | Titanium + sulfuric → lead 50%, calcium 50%, thorium 20% | Nickel + nitric → lead 50%, thorium 20% | None |
| Thorium ore | Thorium | Titanium + sulfuric → lead 50%, uranium 20% | Nickel + nitric → lead 50%, uranium 20% | None |
| Cupriferous redbed | Redstone | Brass + water → copper 100%, iron 50% | Steel + HCl → copper 100%, iron 50% | Nickel + mixed acid → copper 100%, gold 5% |
| Lazurite vein | Lapis | Andesite + water → sodium 50% | Steel + HCl → aluminum 50%, silicon 20% | Fluix + HCl → sodium 50%, aluminum 50%, silicon 20% |
| Phosphate rock | Phosphate | Iron + water → calcium 100% | Steel + sulfuric → calcium 100% | None |
| Soul-bearing black shale | Soul sand | Blood + water → carbon 100% | Blood + HCl → carbon 100%, sulfur 50% | Fluix + HCl → redstone 20% |
| Sulfur-bearing pyrite | Sulfur | Iron + water → iron 100% | Brass + sulfuric → iron 100%, copper 50% | Nickel + mixed acid → copper 50%, gold 5% |
| Gold-quartz vein | Gold | Nickel + mixed acid → quartz 100%, copper 20% | Titanium + mixed acid → quartz 100%, silver 50%, copper 20% | None |

Mixed hydrochloric/nitric acid is restricted to gold-bearing or platinum-group recovery. It is not a generic “strongest acid” accepted by every deposit.

### Acid progression

Thermal & Pressure unlocks:

- sulfuric acid;
- hydrochloric acid.

Electrical Control unlocks:

- nitric acid;
- mixed hydrochloric/nitric acid.

Remove ethanol, acetic acid, and phosphoric acid from Realistic Ores separation. They may remain for unrelated chemistry if still used elsewhere.

Acid manufacture principles:

- Create handles ordinary open mixing of solids and stable liquids.
- PneumaticCraft owns contained gas reactions, pressure, and temperature-sensitive synthesis.
- ChemLib canonical fluids are used directly where they exist.
- PowerGrid’s generic acid is replaced only in recipes where the chemical identity matters:
  - sulfuric acid for batteries;
  - hydrochloric acid for copper-board etching.
- Mixed acid is made in an Electrical-era contained recipe from hydrochloric and nitric acid and is consumed immediately or stored only in a compatible container.
- The player does not craft an abstract “acid tier.”

### Grinding balls

Register and retain exactly eight media:

| Medium | Cost | Earliest era | Return chance |
|---|---|---|---:|
| Andesite | 4 andesite-alloy units | Powered Works | 80% |
| Iron | 4 iron ingots | Powered Works | 84% |
| Brass | 4 brass ingots | Precision Factory | 87% |
| Steel | 4 steel ingots | Thermal & Pressure | 91% |
| Nickel | 4 nickel ingots | Thermal & Pressure | 93% |
| Titanium | 4 titanium ingots | Electrical Control | 95% |
| Blood-infused | One steel ball plus Blood proof | Later magic crossing | 97% |
| Fluix | One steel ball plus Fluix proof | Post-AE2 crossing | 98% |

Rules:

- One ball is consumed as an ingredient in every separation batch.
- It is independently returned at the listed chance.
- Primary yield does not change by ball tier.
- Ball value comes from route affinity, coproduct access, survival, and progression.
- Blood and Fluix are specialist branches, not mandatory for the six-era main spine.
- No universal ball works on every deposit.
- Existing old survival values and five-ingot recipes are replaced.

### Thermal and molten yield ladder

For metallic primary or constituent feeds:

| Feed | Furnace/blast furnace | Melter | Smeltery | Foundry |
|---|---:|---:|---:|---:|
| Full chunk | 4 nuggets | 90 mB | 180 mB | 180 mB plus eligible mixed-feed coproducts |
| Crushed feed | 9 nuggets | 120 mB | 135 mB | 150 mB plus eligible mixed-feed coproducts |
| Concentrate | 12 nuggets | 135 mB | 150 mB | 180 mB with no new coproducts |

Rules:

- Blasting changes time, not yield.
- Bauxite full chunks and crushed feed have no furnace, Melter, Smeltery, or Foundry exit.
- Aluminum appears only after bauxite separation.
- Coal never melts and receives no invented molten form.
- Materials receive molten forms only where useful and sensible.
- Existing native TCon quartz, diamond, emerald, and amethyst fluids are reused.
- Add deposit-metal molten forms where native or ChemLib metallurgy needs them.
- A complete metallic route averages approximately 3.8 ingots per mined chunk before bounded specialist coproduct recovery.
- Foundry coproducts occur only while the feed remains mixed.
- Concentrates never generate unrelated deposit coproducts.

Gem rules:

- Retain chips for diamond, emerald, and amethyst.
- Nine matching chips make one gem.
- One gem may split into nine chips only if that reverse recipe does not create a cross-mod multiplication loop.
- Gem furnace and melting yields use the corresponding chip fraction of the configured material unit.
- Quartz and bulk materials use their native unit rather than pretending to be ingots.

### Canonical final forms

For every recovered constituent:

1. Use a ChemLib ingot or plate when ChemLib provides it.
2. Otherwise use the material-owning mod’s manufactured form.
3. Otherwise use the bare ChemLib element or compound item.
4. Do not create a duplicate KubeJS ingot merely to normalize naming.
5. Tags may unify equivalent manufactured forms, but recipes emit one canonical item.

Examples:

- iron, copper, zinc, aluminum, nickel, uranium, and thorium prefer ChemLib manufactured forms where registered;
- native gems remain native gems;
- sulfur, carbon, silicon, calcium, and similar nonmetal outputs use the appropriate ChemLib element/compound where no manufactured form is meaningful;
- lapis, redstone, coal, quartz, soul sand, and phosphate retain their meaningful native/bulk identities.

Phase 2 records the installed item ID selected for every constituent before recipes are emitted.

---

## 5. Tinkers’ Construct and Dimensional Fonts

### Primitive tool bootstrap

- Keep TCon as the first durable tool system.
- Hide or remove vanilla-style tool recipes only where the TCon replacement is proven reachable.
- Replace hard-coded constructed-tool NBT with supported TCon recipe, material, part-builder, or tool-construction APIs.
- Do not mint finished TCon tools through arbitrary `Item.of(...NBT...)`.
- Use native TCon stations, parts, materials, modifiers, and addon weapons.
- Preserve supported conversion recipes only when they cannot bypass material or station progression.
- Quests prove actual native construction, not possession of a fabricated stack.

### Font coverage and grout

The active dimensional Fonts are exactly:

- Nether;
- Aether;
- Undergarden;
- Otherside.

The End is not an active Font in this progression and receives no grout recipe.

Remove all ordinary Overworld clay-based grout recipes and add:

| Font | Binder | Other inputs | Output |
|---|---|---|---:|
| Nether | Netherrack | 1 sand + 1 gravel | 2 grout |
| Aether | Holystone | 1 sand + 1 gravel | 2 grout |
| Undergarden | Deepsoil | 1 sand + 1 gravel | 2 grout |
| Otherside | Cobbled sculk stone | 1 sand + 1 gravel | 2 grout |

Also provide bulk shapeless forms:

- one binder;
- four sand;
- four gravel;
- eight grout.

Any one Font therefore starts seared metallurgy. None is mechanically privileged as the sole correct opening.

### Seared metallurgy and Create handoff

The required sequence is:

```text
primitive TCon tools
→ reach any Font
→ grout
→ seared brick
→ Melter/Smeltery
→ molten andesite alloy
→ Hand Crank workshop
→ Andesite Machine Block
→ Millstone and Press
```

Andesite alloy:

- Remove shaped and shapeless solid-alloy recipes.
- Remove Create mixing recipes that directly create solid andesite alloy.
- Define true TCon alloying:
  - molten stone plus molten zinc; or
  - molten stone plus molten iron.
- Both routes produce molten andesite alloy.
- Cast molten andesite alloy into Create’s native andesite-alloy item.
- Preserve one output economy across both metal variants.
- Do not simulate alloying by pouring metal over a solid andesite block.

Brass:

- Form brass through TCon alloying only.
- Remove Create mixing and other early solid-brass shortcuts.
- Create may press, deploy, cut, or assemble already formed brass.

Create/TCon interaction:

- Create spouts may fill supported TCon casts.
- Spout casting does not create a higher yield than TCon casting.
- TCon remains the authority for alloy composition.
- Create remains the authority for kinetic handling and assembly.

### Foundry gate

The Foundry is not available from the first Font expedition.

Unlock native nether grout through a heated Create Mixer recipe:

- magma;
- soul sand or soul soil;
- gravel;
- output at native nether-grout yield.

Remove hand crafting and furnace-like shortcuts that produce nether grout or scorched material without Create. The Foundry therefore proves both seared metallurgy and powered kinetic processing.

---

## 6. Machine Blocks and the Six-Era Spine

### Public block identities

Register exactly:

- `kubejs:andesite_machine_block`
- `kubejs:copper_machine_block`
- `kubejs:brass_machine_block`
- `kubejs:airtight_machine_block`
- `kubejs:electrical_machine_block`
- `kubejs:space_machine_block`

Remove from this progression:

- Seared Machine Casing;
- old `*_machine_casing` tier identities;
- Circuited Machine Casing;
- Scorched Machine Casing;
- Raw Impossible and Impossible casings from this pass.

No aliases are added.

### Machine Block rule

A Machine Block is an era proof, not a universal ingredient.

- Only the first machine or small set of direct roots for an era consumes that era’s Machine Block.
- Downstream machines use outputs made by those roots and the owning mod’s native components.
- Do not rewrite every machine recipe to contain a Machine Block.
- Do not use broad per-output replacement passes.
- A direct root recipe is explicitly listed in the progression manifest.

### Block construction contracts

#### Andesite Machine Block

Bill of materials:

- one seared-brick block;
- four andesite-alloy units;
- four iron plates.

Assembly:

- ordinary workshop crafting;
- iron plates are obtainable through TCon casting before the Press;
- no Create casing, Press, Deployer, or passive SU is required.

Direct roots:

- Create Millstone;
- Create Mechanical Press.

The Mechanical Mixer follows from Press-made iron plates and a whisk. It does not consume another Machine Block.

#### Copper Machine Block

Bill of materials:

- one Andesite Machine Block;
- one Create copper casing;
- four copper plates;
- one Nether brick;
- two andesite-alloy units.

Assembly:

- Hand-Crank-powered compacting or sequenced workshop assembly;
- copper plates come from the Press;
- provide a pre-Deployer copper-casing recipe using stripped wood and copper plates;
- the copper-casing recipe does not itself unlock a machine.

Direct roots:

- Water Wheel;
- Windmill Bearing;
- Mechanical Pump;
- the first primitive Eureka/VS assembly root where the installed addon requires one.

Nether brick makes all passive water and wind power Nether-gated. The Hand Crank remains the only positive SU source before this block.

#### Brass Machine Block

Bill of materials:

- one Copper Machine Block;
- one Create brass casing;
- four brass plates;
- two electron tubes;
- one polished rose quartz.

Assembly:

- Hand-Crank or passive-powered Create compacting;
- brass is TCon-alloyed;
- brass plates come from the Press;
- brass casing receives a pre-Deployer compacting recipe from stripped wood and brass sheet;
- no Precision Mechanism, Deployer, or Mechanical Crafter may appear in this block’s prerequisites.

Direct roots:

- Deployer;
- Mechanical Crafter;
- the first train/precision-transport control root.

The Mechanical Crafter recipe may output the native multi-block quantity expected by Create.

#### Airtight Machine Block

Bill of materials:

- one Brass Machine Block;
- four compressed-iron ingots;
- two pressure tubes;
- two pressure seals.

Pressure seals:

- remain pack-owned only if no native compatible sealing item exists;
- use rubber or another installed resilient sealing material plus an iron plate;
- do not require pressure machinery.

Initial compressed iron:

- use PneumaticCraft’s supported primitive/explosive route or an explicit Create Workshop route confirmed in Phase 2;
- it must be obtainable without a compressor or pressure chamber;
- automated compressed iron later moves to PneumaticCraft.

Assembly:

- Mechanical Crafter;
- no PneumaticCraft pressure-chamber step is required to make the first block.

Direct roots:

- Rotational Compressor;
- first pressure-chamber controller/interface root.

Downstream PneumaticCraft parts use native compressed iron, pressure tubes, plastics, and pressure outputs.

#### Electrical Machine Block

Bill of materials:

- one Airtight Machine Block;
- one PowerGrid conductive casing;
- four copper plates;
- two primitive MoreRed-compatible circuit components;
- one electron tube.

The first conductive casing:

- is mechanically assembled from copper, insulation, and redstone;
- does not require FE;
- later PowerGrid manufacturing may use its native powered processes.

Assembly:

- PneumaticCraft pressure assembly or the installed supported precision surface;
- must not require an existing generator, electrical machine, or advanced circuit.

Direct roots:

- first non-creative FE generator;
- first circuit-design/manufacturing station;
- first advanced Latent reaction-conditioning controller where applicable.

Wires, batteries, motors, relays, and later circuits use PowerGrid or native manufactured components instead of additional Electrical Machine Blocks unless they are separately identified as a true root.

#### Space Machine Block

Bill of materials:

- one Electrical Machine Block;
- two rocket-casing components;
- two Inconel sheets;
- two Hastelloy ingots;
- two titanium plates.

Assembly:

- Electrical-era controlled assembly;
- alloys are produced through established metallurgy;
- sheets are made on existing Press/rolling infrastructure;
- it cannot require any machine that it directly unlocks.

Direct roots:

- Rocket Engineer Table;
- Mechanical Electrolyzer;
- Air Liquefier.

Downstream rocket construction uses native aerospace frames, tanks, engines, guidance, fuels, and life-support components.

---

## 7. Era-by-Era Player Progression

## Era 1 — Hand Workshop

Required:

- primitive gathering;
- TCon tool construction;
- reach any active Font;
- grout and seared bricks;
- Melter/Smeltery;
- molten andesite alloy;
- cast plates and basic alloys;
- Hand Crank.

Unavailable:

- passive SU;
- Create ore machines;
- Brass automation;
- PneumaticCraft pressure;
- FE;
- stable powered flight.

## Era 2 — Powered Works

Required roots:

- Andesite Machine Block;
- Millstone;
- Mechanical Press;
- Mixer derived from Press output;
- Copper Machine Block after Nether brick;
- Water Wheel, Windmill Bearing, and Pump.

Capabilities:

- mechanical crushing and pressing;
- basic mixing;
- passive SU after Nether;
- early ore concentration routes;
- primitive ships, Clockwork experiments, and basic Trackwork.

Unavailable:

- Deployer;
- Mechanical Crafter;
- precision mechanisms;
- pressure chemistry;
- electrical control.

## Era 3 — Precision Factory

Required:

- TCon brass alloying;
- brass sheets and casing;
- electron tubes;
- Brass Machine Block;
- Deployer;
- Mechanical Crafter.

Capabilities:

- sequenced assembly;
- trains and railway controls;
- advanced Trackwork;
- reliable Clockwork control;
- construction of Airtight Machine Block.

## Era 4 — Thermal & Pressure

Required:

- Foundry access through Create-made nether grout;
- compressed iron;
- Airtight Machine Block;
- Rotational Compressor;
- pressure chamber;
- sulfuric and hydrochloric acid;
- steel and nickel processing balls.

Capabilities:

- contained gases;
- PneumaticCraft chemistry;
- industrial leaching;
- practical powered flight;
- Heat Sync industrial heat and boiler heating;
- richer ore coproduct recovery.

## Era 5 — Electrical Control

Required:

- mechanically produced conductive casing;
- primitive circuitry;
- Electrical Machine Block;
- first FE generator;
- circuit-design root;
- nitric acid and mixed acid.

Capabilities:

- sensors;
- stabilization;
- gyros;
- advanced Clockwork/VS control;
- full gold and PGM recovery;
- advanced Latent reactions and nuclear control;
- titanium processing medium.

## Era 6 — Aerospace

Required:

- rocket alloys and sheets;
- Electrical-era control;
- Space Machine Block;
- Rocket Engineer Table;
- Mechanical Electrolyzer;
- Air Liquefier.

Capabilities:

- advanced life support;
- oxidizer and gas infrastructure;
- engineered spaceflight;
- stable high-performance flight using Aether-derived materials where applicable.

---

## 8. Create, Eureka/VS, Clockwork, Trackwork, and Railways

Transport is an optional branch, not a mandatory prerequisite for ordinary factory progression.

### Powered Works transport

Allow:

- primitive Eureka ship assembly and helm/control;
- primitive Clockwork kinetic/physics experiments;
- basic Trackwork wheels, suspension, or tracks;
- low-reliability mechanical steering.

Requirements:

- at least Andesite infrastructure;
- Copper Machine Block for the first true powered transport root;
- no Aether material for initial experiments;
- no FE or advanced circuits.

### Precision Factory transport

Allow:

- Create trains;
- railway stations and controls;
- advanced Trackwork;
- controlled Clockwork physics components;
- better ship steering and mechanical automation.

Requirements:

- Brass Machine Block for the first precision control root;
- native precision components afterward;
- no Electrical Machine Block on every transport recipe.

### Thermal & Pressure transport

Allow:

- pneumatic actuators;
- contained gas systems;
- practical powered aircraft;
- improved ballast, lift, and pressure control.

Requirements:

- Airtight infrastructure;
- PneumaticCraft outputs;
- no Aether requirement for merely functional powered flight.

### Electrical transport

Allow:

- stabilization;
- sensors;
- gyros;
- feedback control;
- exotic Clockwork physics;
- autonomous or highly controlled vessels.

Requirements:

- Electrical root outputs;
- circuits, motors, sensors, and PowerGrid parts.

### Aether material rule

Aether materials gate:

- stable high-performance flight;
- lightweight advanced frames;
- reliable altitude control;
- aerospace-grade lift or control.

They do not gate:

- primitive boats;
- primitive Eureka ships;
- early Clockwork experimentation;
- basic Trackwork;
- low-performance aircraft.

### Recipe rewrite policy

For each installed addon:

- enumerate its progression-relevant recipes;
- classify capability, not namespace;
- replace only exact recipes that violate the era;
- retain decorative and harmless components;
- do not put one casing into every addon recipe;
- use native downstream components after the first gated root;
- remove stale references to absent addon IDs;
- do not use arbitrary namespace scanning.

---

## 9. Vanilla Boats in Better Content Fixes

Move vanilla boat durability and destruction behavior out of KubeJS into `better-content-fixes`.

Scope:

- `minecraft:boat`;
- `minecraft:chest_boat`;
- all vanilla wood variants represented by those entity types.

Do not affect:

- modded boat entity classes;
- Eureka ships;
- VS contraptions;
- rafts or addon vessels unless they are literally vanilla boat entities.

Behavior:

- vanilla boats tolerate approximately ten times the native accumulated damage;
- chest boats use the same multiplier;
- destruction produces no boat or chest-boat item;
- passengers, collision, movement, and networking remain vanilla;
- existing worlds’ vanilla boats acquire the behavior automatically;
- do not globally cancel unrelated entity drops.

Recipes:

- remove the simple vanilla five-plank boat recipe;
- rebuild each wood-family boat from its matching planks plus supported TCon wooden parts or material predicates;
- use supported TCon ingredient matching rather than hard-coded part NBT;
- chest boats require the completed boat, a chest, and additional TCon binding/reinforcement material;
- recipe output remains the native vanilla item;
- JEI/EMI shows one authoritative recipe per variant.

Implementation:

- use the narrowest vanilla Boat/ChestBoat hook;
- keep durability multiplier configurable with default `10.0`;
- keep no-drop behavior configurable but enabled by default;
- add focused unit/resource/GameTest coverage inside Better Content Fixes;
- replace the KubeJS no-boats script only after the mod behavior and recipes exist.

---

## 10. Latent ChemLib Integration

### Ownership boundary

Latent ChemLib owns:

- radioactive-form resolution;
- disturbed/natural state;
- radiation emission;
- inventory, dropped-item, container, and placed-block scanning;
- gasification of ChemLib gas items;
- chemical machine gates exposed through native recipes/configuration.

Realistic Ores owns:

- uranium/thorium blocks and processing forms;
- tags identifying family forms;
- processing recipes.

Heat Sync owns:

- interpretation of Latent’s radiogenic heat output;
- heat-network and environmental heat integration.

KubeJS owns only era recipes that combine their native outputs.

### Static radioactive form mapping

Add or extend Latent’s data-driven nuclear-form rules to support:

- exact item IDs;
- item tags;
- exact block IDs;
- block tags;
- family identity;
- fixed radiation strength;
- fixed Heat Sync source strength;
- whether the natural worldgen block is initially inert;
- whether placed forms are always active.

Define Realistic Ores tags for:

- uranium full chunks;
- uranium crushed feed;
- uranium concentrate;
- uranium final forms;
- uranium hosted ore blocks;
- thorium equivalents.

Only uranium and thorium families use this integration.

### Disturbance contract

Natural world-generated uranium/thorium ore:

- is initially inert;
- does not continuously scan as a radioactive source merely because it exists underground.

Disturbance occurs when:

- mined normally;
- mined with Silk Touch;
- converted into chunk, crushed feed, concentrate, molten, ingot, plate, or chemical form;
- dropped as an item;
- stored in a player inventory;
- stored in an item-holding block entity;
- placed again after being obtained;
- reconstructed into a hosted ore block.

After disturbance:

- the material is statically hazardous according to its form mapping;
- it does not need per-stack isotope NBT;
- stack splitting and merging do not conserve a simulated daughter inventory;
- save/reload retains placed disturbed state;
- a naturally generated block and a player-replaced identical block can behave differently through Latent’s placed lifecycle data.

Existing Latent isotope simulation remains available for its other systems. Realistic Ores integration deliberately uses fixed form profiles.

### Radiation and heat scaling

- Small chunks emit less than full chunks.
- Crushed feed emits at least as much as an equivalent full chunk stack.
- Concentrates and final forms emit more per item because material is enriched.
- Hosted blocks disturbed through Silk Touch or reconstruction emit as placed radioactive blocks.
- Stack emission scales with count but is capped by Latent’s existing simulation budget.
- Containers are scanned through existing active-holder scheduling rather than every inventory every tick.
- Dropped items use the existing radioactive item entity path.
- Radiation and radiogenic heat use separate configured values.

### Heat Sync bridge API

Latent exposes a read-only emission profile for a resolved stack or placed form:

- family;
- radioactive strength;
- heat strength;
- active/inert state.

Heat Sync adds an optional Latent bridge that:

- has a compile-time optional dependency only;
- reads Latent emission profiles;
- treats active radioactive holders as bounded local heat sources;
- exposes that heat to adjacent Heat Sync pipes/storage and environmental mapping;
- does not modify Latent isotope state;
- does not create FE;
- does not duplicate heat on repeated scans.

This dependency direction avoids a cycle: Heat Sync may integrate Latent; Latent does not require Heat Sync.

### Latent progression gates

Airtight Machine Block era:

- gas capture;
- chemical cells/tanks;
- gas release;
- tubes;
- dry-air separation;
- basic hazard containment.

Electrical Machine Block era:

- reaction conditioning;
- advanced sensing;
- controlled nuclear handling;
- advanced chamber pacing;
- electrical instrumentation.

ChemLib gas recipe outputs remain ordinary ChemLib gas items. Latent’s existing gasification behavior converts or releases them; Realistic Ores does not create duplicate gas fluids.

---

## 11. Heat Sync Boiler Heater

Add `heat_sync:boiler_heater`.

### Block and capability behavior

- A placeable block with a Heat Sync heat capability.
- Maximum stored heat default: `400`.
- Ambient baseline follows Heat Sync’s existing `100` convention.
- Heat input is accepted from sides and bottom.
- The top face is reserved for the Create boiler/tank relationship.
- It connects to heat pipes, Thermal Fireboxes, coolant systems, PowerGrid thermal devices, PneumaticCraft heat bridges, and radiogenic sources through existing Heat Sync capability rules.
- It contains no fuel slot and produces no heat itself.
- It never converts FE directly into boiler heat.

### Create registration

Register the block in Create’s supported `BoilerHeater.REGISTRY`.

The heater callback:

- runs authoritatively on the server;
- reads the block entity’s stored heat;
- returns no boiler heat below the first threshold;
- consumes stored heat only when a boiler actually requests usable heat;
- avoids client-side mutation;
- avoids consumption during simulated/read-only queries if Create exposes them;
- synchronizes changed state.

Default strength curve:

| Stored heat | Create heater strength | Heat consumed per active tick |
|---:|---:|---:|
| Below 180 | 0 | 0 |
| 180–259.999 | 1 | 1 |
| 260–339.999 | 2 | 2 |
| 340–400 | 3 | 3 |

All thresholds and costs are configurable. If Create’s installed API uses a continuous strength rather than discrete levels, return the exact equivalent values `1.0`, `2.0`, and `3.0`.

The heater:

- drops to a lower level immediately when heat falls below a threshold;
- stops entirely below 180;
- does not reserve nonexistent heat;
- cannot report heat after the corresponding consumption has failed;
- does not consume heat when no boiler is present;
- does not consume heat on the client;
- supports multiple heaters under a boiler using Create’s native aggregation.

### Persistence and feedback

Persist:

- stored heat;
- last delivered heater strength;
- active/inactive state needed for presentation.

Provide:

- block entity update packets;
- comparator output from 0–15 based on stored heat;
- Create goggle tooltip with stored/max heat and current heater strength;
- visual active state without high-frequency blockstate churn;
- language, blockstate, block model, item model, loot table, recipe, and optional Ponder scene.

### Recipe and progression

The Boiler Heater is a Thermal & Pressure downstream machine, not a new era root.

Recipe uses:

- one Heat Sync heat pipe;
- steel plates;
- copper thermal contact material;
- a pressure seal or equivalent;
- a native Create boiler-compatible casing component.

It does not consume another Airtight Machine Block because the Airtight roots already prove the era.

### Tests

Within `heat-sync`:

- threshold mapping;
- proportional consumption;
- no consumption below threshold;
- no consumption without a boiler request;
- no free output with empty storage;
- heat-capability input;
- save/reload;
- comparator scaling;
- multiple-heater behavior;
- Create registry integration;
- pipe, firebox, coolant, PneumaticCraft, and PowerGrid interoperability;
- radiogenic source interoperability when Latent is loaded.

Preserve all existing Heat Sync bridges.

---

## 12. KubeJS Architecture

After owning-mod replacements are installed, replace the action-oriented staging layout with a minimal executable tree.

### Startup scripts

Startup scripts contain only:

- the six Machine Block registrations;
- genuinely pack-owned transition items still required after mod migration;
- their display names, hardness, sound, render, and model bindings;
- small immutable shared constants required during registration.

Do not register:

- Realistic Ores lifecycle items;
- duplicate ChemLib forms;
- washed concentrates;
- tailings;
- duplicate TCon materials;
- deprecated casing tiers.

### Server scripts

Organize by behavior:

- explicit tags and narrow compatibility;
- Hand Workshop and Fonts;
- Powered Works;
- Precision Factory;
- Thermal & Pressure;
- Electrical Control;
- Aerospace;
- transport branches;
- narrow removal policy.

Rules:

- Use exact installed recipe IDs wherever possible.
- Output-wide removal is allowed only when the pack intentionally owns every route to that output and the replacement is declared in the same bounded script.
- Do not use `forEachRecipe` JSON string scanning.
- Do not perform arbitrary namespace introspection.
- Do not silently skip mandatory recipes through `Item.exists`.
- Optional-addon recipes use explicit mod-loaded guards.
- Do not build large quasi-schemas in `kubejs/config` merely to validate scripts.
- Delete stale catalogs once their data lives in Realistic Ores or another owning mod.
- Avoid global helper APIs unless two or more final scripts genuinely share a stable operation.
- Give every pack recipe a stable, namespaced, semantic ID.
- Comments explain progression ownership and circularity constraints, not historical debugging.

### Client scripts

Keep only:

- intentional JEI/EMI hiding of removed or unreachable forms;
- tool/boat hiding that remains necessary after owning-mod changes;
- concise tooltips that explain era or hazard behavior.

Remove hiding rules for items that no longer exist.

### Candidate-folder disposition

- `move_to_mod`: delete each candidate only after equivalent mod behavior passes that mod’s validation.
- `remove`: delete after confirming no active quest, recipe, tag, or config depends on it.
- `check`: either rewrite into the final architecture or leave out-of-scope behavior untouched; do not assume the name disables execution.
- `refactor`: use as reference, then replace with final scripts; do not leave the entire folder active.
- `move`: migrate the narrow useful helper or behavior, then remove the staging copy.

---

## 13. Assets

The image-generation skill is used during implementation because this work requires new raster textures.

### Machine Block visual family

Create unique side, top, and bottom textures for all six blocks.

Shared rules:

- 16×16 final resolution.
- Create-compatible industrial material language.
- Symmetric horizontal sides.
- Clearly distinct top and bottom.
- Corners and seams align when blocks are tiled.
- No unreadable microtext.
- No antialiasing or semi-transparent edge pixels in final opaque block textures.
- Increasing precision and complexity by era without becoming visually noisy.

Tier language:

- Andesite: rough cast stone/iron frame, broad seams.
- Copper: copper thermal bands and robust mechanical fastening.
- Brass: finer brass trim, gauges, and precision geometry.
- Airtight: sealed panels, compressed-iron body, gasket cues.
- Electrical: insulated conductive panels, restrained circuitry.
- Space: aerospace alloy, pressure-rated seams, clean high-precision paneling.

Workflow:

1. Inspect all existing casing textures and neighboring Create assets.
2. Generate full-scale concept sheets for the complete family.
3. Select one coherent family.
4. Crop faces.
5. Algorithmically downsample.
6. Palette-quantize against nearby Create materials.
7. Clean transparency.
8. Hand-polish every 16×16 face.
9. Inspect at native scale and enlarged nearest-neighbor scale.
10. Build matching blockstates, block models, and item models.

Do not ship raw AI output or a mechanically downsampled image without pixel cleanup.

### Realistic Ores assets

For each new or renamed family:

- full chunk;
- crushed feed;
- small chunk/BlockItem;
- surface sample if the block face changes;
- concentrates not already represented;
- molten fluid/bucket assets where added.

Asset principles:

- base each family on its geological visual identity;
- retain consistency with existing Realistic Ores ore textures;
- make small chunks recognizable as the same family as their placed sample;
- use one grayscale nugget-like chip base for diamond, emerald, and amethyst chips, tinting it per gem;
- avoid one generic concentrate texture for materially different constituents;
- update canonical texture hash/palette fixtures where Realistic Ores tests require them.

### Heat Sync and Better Content Fixes assets

- Boiler Heater visually belongs to Heat Sync and Create boiler infrastructure.
- Its active appearance communicates heat level without animation noise.
- Boat changes reuse native assets unless a recipe ingredient requires a new pack-owned item.
- Do not add decorative assets unrelated to the requested systems.

---

## 14. Quests and Documentation

Read `docs/questbook_standards.md` before editing live quests.

Primary chapters affected:

- `workshop.snbt`;
- `basic_tools.snbt`;
- `metal_tools.snbt`;
- `fonts_and_pacts.snbt`;
- `factory_and_transport.snbt`;
- `power.snbt`;
- `dangerous_matter.snbt`;
- `control_and_intelligence.snbt`;
- `routes_and_recovery.snbt`.

Quest rules:

- Preserve chapter, quest, task, and reward IDs when the meaning remains.
- Use new unique uppercase 16-digit hexadecimal IDs only for genuinely new quests.
- Search live and stored quest content before assigning new IDs.
- Do not duplicate native quests; link to their authoritative quest.
- Every quest states:
  - intended player action;
  - task proving it;
  - every literal prerequisite.
- Trace the actual recipe, event, tag, criterion, or mod behavior before writing prose.
- Remove references to old Machine Casings, washed concentrates, tailings, obsolete acid routes, and outdated processing yields.
- Teach optional transport as a branch, not a required spine.

Required quest flow:

- choose and reach any Font;
- make grout;
- establish seared metallurgy;
- alloy andesite;
- create the Hand Crank;
- make Andesite Machine Block;
- unlock Millstone and Press;
- reach Nether for passive power;
- make Copper Machine Block;
- alloy brass;
- make Brass Machine Block;
- unlock precision assembly;
- produce nether grout and Foundry;
- establish Airtight pressure chemistry;
- make sulfuric/HCl;
- establish electrical control;
- make nitric/mixed acid;
- handle radioactive materials safely;
- create Space Machine Block and aerospace roots.

Documentation updates:

- rewrite `docs/realistic_ore_processing.md` to match the final three-stage system;
- update `docs/progression.md` with the six eras;
- document ownership boundaries in `docs/content_systems.md`;
- document new-world/backup expectations;
- explain that ADLODS and scattered veins are intentional complementary layers;
- explain small-chunk placement and 9:1 conversion;
- explain grinding-ball return chances and route affinities;
- explain radioactive disturbance and Heat Sync boiler use.

Use only the supported FTB Quests standalone layout harness for visual authoring and icon auditing. Do not add another quest compiler or validator.

---

## 15. Public APIs, Data Contracts, and Stable IDs

### Realistic Ores

Stable public resources:

- family-specific ore-block tags;
- family-specific full-chunk tags;
- family-specific crushed-feed tags;
- family-specific small-chunk tags;
- radioactive-family tags;
- canonical registry IDs for sample blocks, small chunks, full chunks, crushed feed, and concentrates.

Optional compat interfaces:

- lookup from hosted ore block to deposit family;
- lookup from deposit family plus substrate to reconstructed block;
- Excavated Variants host resolver;
- explicit failure for unknown ambiguous hosts.

Processing definitions must expose:

- family;
- primary;
- assay grade;
- permitted medium;
- fluid specification;
- unlocked coproducts;
- thermal form;
- canonical final form.

Whether represented as Java records plus bundled JSON or generated resources, there is one authoritative definition per deposit and no duplicate KubeJS catalog.

### Latent ChemLib

Expose a stable read-only emission result containing:

- resolved family;
- active/inert state;
- radiation strength;
- heat strength.

Support resolution from:

- item stack;
- placed block/lifecycle data;
- family tag.

Realistic Ores integration uses static profiles and does not require isotope NBT.

### Heat Sync

Add:

- `heat_sync:boiler_heater`;
- registered block entity;
- `IHeatStorage` capability;
- Create BoilerHeater registration;
- configuration entries for max heat, three thresholds, and three consumption rates;
- optional Latent bridge.

Do not break existing `IHeatStorage`, PneumaticCraft, PowerGrid, coolant, firebox, pipe, or Impossible APIs.

### Better Content Fixes

Add configuration:

- vanilla boat durability multiplier, default `10.0`;
- vanilla boat destruction drop suppression, default `true`.

Keep behavior scoped to vanilla boat entity classes.

### KubeJS

Stable pack identities are the six Machine Block IDs. No old casing identity is public after the clean break.

---

## 16. Validation and Evidence

## Realistic Ores

Run:

`./gradlew verifyFull`

Required coverage:

- every family has all required registered forms;
- small chunks place the matching sample;
- sample loot returns exactly one small chunk;
- 9:1 conversion exists and no reverse recipe exists;
- ordinary mining remains one chunk and Fortune-independent;
- Silk Touch preserves the exact block;
- native host separation/reassembly is one-for-one;
- Excavated Variants mapping preserves host;
- new gold-quartz resources are complete;
- old corundum-beryl identities are absent;
- processing definitions reference valid forms;
- no washed/tailings resources remain active;
- probabilities, ball returns, and thermal values match this plan;
- texture palette/hash fixtures are intentionally updated.

## Latent ChemLib

Run:

`./gradlew verifyFull --no-daemon`

Required coverage:

- natural uranium/thorium blocks are inert;
- mined chunks activate;
- Silk-Touched block items activate;
- replaced blocks remain active after save/reload;
- small chunks, full chunks, crushed feed, concentrates, and final forms resolve correctly;
- dropped items, inventories, and containers emit configured radiation;
- stack scaling is bounded;
- no Realistic Ores isotope NBT is required;
- gas outputs continue through existing gasification behavior;
- optional Heat Sync absence does not prevent Latent from loading.

## Heat Sync

Run:

`./gradlew verifyFull --no-daemon`

Required coverage:

- Boiler Heater storage and transfer;
- threshold mapping;
- proportional consumption;
- no passive/free heat;
- save/reload and client sync;
- comparator and goggle data;
- Create registry behavior;
- multiple heaters;
- existing firebox, coolant, PneumaticCraft, and PowerGrid bridges;
- optional Latent bridge;
- absence of Latent does not prevent Heat Sync from loading.

## Better Content Fixes

Because the change affects Forge runtime/GameTest behavior, run:

`./gradlew verifyFull`

Required coverage:

- only vanilla boats receive the multiplier;
- chest boats match;
- destruction drops are suppressed;
- unrelated entity drops remain;
- passengers and ordinary movement remain;
- native recipe resources are authoritative;
- modded vessels remain unaffected.

## Questbook

Use only:

- the documented standalone layout render;
- the documented icon audit.

Review affected live SNBT without introducing a compiler or schema validator.

## Modpack

After all rebuilt mod artifacts and KubeJS changes are integrated, run exactly:

`./smoke.sh`

This is the sole supported pack runtime evaluation.

Do not add:

- another smoke script;
- a recipe audit command;
- a reachability validator;
- a static contract suite;
- pack GameTests;
- an alternate assembler;
- a performance-budget harness;
- a persistence scenario harness.

Record the exact smoke result in the on-disk checklist.

---

## 17. Completion Order and Commit Boundaries

Use coherent repository boundaries:

1. Realistic Ores lifecycle and small chunks.
2. Realistic Ores processing matrix and assets.
3. Latent radioactive-form integration.
4. Heat Sync Boiler Heater and Latent bridge.
5. Better Content Fixes boat behavior.
6. Pack Machine Blocks and TCon/Create spine.
7. Pack transport gates.
8. Pack KubeJS cleanup.
9. Pack quests and documentation.
10. Final rebuilt-mod integration and smoke.

Before each boundary:

- update the checklist;
- reread claims;
- inspect dirty state;
- validate the owning repository.

Do not delete a KubeJS replacement candidate until its owning-mod implementation is built, validated, and integrated.

---

## 18. Assumptions and Fixed Defaults

- Forge/Minecraft remains 1.20.1.
- Installed mod APIs and registry IDs are authoritative implementation facts.
- Gameplay choices in this plan are fixed.
- Identifier substitutions discovered in Phase 2 do not require renewed design approval.
- All four listed binders provide complete coverage for active dimensional Fonts.
- The End remains outside the Font system.
- ADLODS remains enabled.
- Realistic Ores scattered veins remain enabled.
- Uranium and thorium remain normally obtainable.
- Mixed acid is restricted to gold/PGM-related routes.
- No generic washed concentrate or tailings layer survives.
- Small chunks are placement items and have only the 9:1 production conversion.
- The six Machine Block identities are clean breaks.
- Only direct era roots consume Machine Blocks.
- Hand Crank is the sole pre-Nether SU source.
- Primitive flight does not require Aether; reliable advanced flight does.
- Blood and Fluix processing remain optional later crossings.
- Existing worlds receive no identity migration.
- The on-disk checklist is mandatory and remains part of the final handoff.

## 19. Final Acceptance

The refactor is complete only when:

- all required checklist items contain evidence;
- no active claim overlap remains;
- no in-scope proposed-action script is unintentionally executing;
- no mandatory recipe silently disappears;
- the six-era graph is reachable and non-circular by recorded manual trace;
- all 23 deposits implement the specified lifecycle and processing contract;
- Machine Blocks have finished assets and exact direct-root recipes;
- Latent and Heat Sync behaviors are integrated without dependency cycles;
- vanilla boats have the requested durability and drop behavior;
- affected quests match implemented mechanics;
- all sibling repositories pass their required validation;
- the final modpack `./smoke.sh` passes;
- every deviation from the plan is documented in the checklist.

