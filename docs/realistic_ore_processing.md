# Realistic Ore Processing Theory

This is the living design contract for geological deposit processing in Better Content.
It explains what the system is trying to model, which behaviors are invariants, how the
current numbers should be interpreted, and how to extend the system without creating a
second processing economy. The Java mod and KubeJS catalogues remain the executable
source of truth; this document owns the theory that those files implement.

## Thesis

An ore deposit is a mixed geological body, not a differently colored block containing a
single finished metal. Mining should preserve the identity of the deposit while avoiding
an inventory full of visually different host-rock variants. Processing should then make
the player choose how much work and infrastructure to invest before taking a useful
output.

The system therefore separates three ideas that ordinary ore items often conflate:

- **Architecture:** the exact ore block and the exact stone that hosts it.
- **Geology:** a host-independent chunk that names the deposit and carries its mixed assay.
- **Refinement:** crushed feed and constituent-specific concentrates whose value rises as
  gangue is rejected and coproducts are deliberately recovered.

The intended production route is:

```text
ore block -> chunk -> crushed feed -> separated concentrate -> washed concentrate -> product
    ^          |           |                   |                    |
    |          +-----------+-------------------+--------------------+-> early thermal exits
    +-- exact substrate + chunk reconstructs the same block
```

The longest route maximizes production. Earlier exits remain meaningful when the current
material can sensibly be furnaced or melted. A player may trade yield and coproduct access
for speed, fuel simplicity, or lower infrastructure.

## Invariants

These rules define the system. A recipe or compatibility integration that violates one of
them is a design change, not a harmless alternate recipe.

1. **Ordinary mining produces one chunk.** Fortune does not multiply it. Silk Touch keeps
   the exact ore block.
2. **Chunks are host-independent.** Stone, deepslate, gravel, and runtime Excavated
   Variants hosts of the same deposit converge on the same chunk stack.
3. **Building is lossless.** Separating an ore block returns exactly one chunk and its
   exact substrate; crafting those two inputs reconstructs exactly that ore block.
4. **Ore blocks have one processing meaning.** Apart from reconstruction, the only
   processing recipe on an ore block is block-to-chunk separation. Ore block items stay
   out of generic processing-facing ore tags.
5. **The first irreversible step is crushing the chunk.** A chunk crushes into one
   guaranteed crushed feed plus three independent 30% bonus rolls.
6. **Deposits stay mixed until separation.** Chunks and crushed feeds retain the deposit
   identity. Separation creates constituent-specific concentrates; washing never splits
   the assay again.
7. **Every stage may have a sensible early exit.** On mixed feed, furnaces and Smelteries
   recover only the deposit primary; on concentrates they recover the named constituent.
   Foundries recover the best yield and may expose coproducts that still exist in mixed
   feed.
8. **More processing means more recovery, not a different primary material.** Stage
   upgrades are monotonic for a given constituent.
9. **Chemistry is curated.** Each deposit has two or three reviewed media/solvent routes.
   There is no Cartesian product of every ball, acid, and deposit.
10. **Waste remains visible.** Separation emits mineral tailings. A valuable assay output
    must not be hidden inside a generic waste loop that can be recovered without the
    deposit's authored route.

## Material states

| State | What it means | Mixed? | Reversible? |
| --- | --- | --- | --- |
| Ore block | Deposit embedded in one exact architectural substrate | Yes | Yes, with its returned substrate |
| Surface sample | Prospecting evidence for a deposit family | Yes | No; it resolves to one chunk |
| Chunk | Portable run-of-mine deposit, independent of host appearance | Yes | Yes only through block reconstruction |
| Crushed feed | Mechanically liberated deposit particles | Yes | No |
| Separated concentrate | One named constituent selected from the assay | No | No |
| Washed concentrate | The same constituent with additional gangue removed | No | No |
| Tailings | Rejected gangue and unrecovered material | Residual | No |

This state model is also an inventory model. Host diversity exists in placed blocks, where
it matters visually. Mined material collapses to one stack per deposit, where host identity
would otherwise be clutter. Constituent identity appears only after a process has actually
separated it.

## Reversible block cycle

The block cycle exists so geological blocks remain usable as building materials without
turning mining into a host-variant inventory problem:

```text
exact hosted ore block --Create crushing--> deposit chunk + exact substrate
deposit chunk + exact substrate --shapeless craft--> exact hosted ore block
```

Native stone and deepslate recipes are emitted by Realistic Ores. Runtime Excavated
Variants blocks are discovered from `ModifiedOreBlock`; their ore identity selects the
chunk and their stone identity selects the returned substrate. The block tags required for
mining remain intact, while generic Forge and common ore **item** tags are stripped so
another mod cannot treat the decorative block as raw process feed.

This cycle must stay exactly one-for-one. It is not an ore-doubling step, a Fortune path,
or a way to exchange one substrate for another.

## Crushing and variance

Chunk crushing produces one guaranteed crushed feed and three independent bonus rolls:

```text
1 + Bernoulli(0.30) + Bernoulli(0.30) + Bernoulli(0.30)
```

The result ranges from one to four crushed feeds and has an expected value of 1.9. The
three rolls are intentionally independent: the crusher sometimes produces a notably rich
batch rather than a fixed decimal-equivalent output. This is the only randomized yield
before assay recovery.

Surface samples always become their matching chunk. They prove where a deposit family is
present but cannot skip the crusher or enter the concentrate ladder directly.

## Separation theory

Separation is the point at which a deposit becomes material-specific. Every recipe consumes
four matching crushed feeds, one grinding ball, and either water or a reviewed leach:

| Route type | Liquid input | Fixed outputs |
| --- | --- | --- |
| Mechanical/water | 500 mB water | 4 primary concentrates, 2 tailings |
| Solvent leach | 250 mB water + 250 mB solvent | 4 primary concentrates, 2 tailings |

The route may add one concentrate for each unlocked coproduct. Its independent chance is
set by the deposit assay grade:

| Assay grade | Coproduct chance |
| --- | ---: |
| Major | 100% |
| Minor | 50% |
| Trace | 20% |
| Precious | 5% |

An assay describes what the geology contains. A route's `unlocks` list describes what that
specific combination can recover. Being present in the assay does not make a constituent
available through every route. This is how media and solvents express selectivity without
inventing a universal machine tier.

The primary output is fixed rather than rolled because the deposit is named for a reliable
economic product. Coproducts create route choice and geological identity, not a chance that
the entire batch was worthless.

## Grinding media are identities, not tiers

Grinding balls are parallel process choices. Their material identity controls which
deposits and coproducts they can expose; their return chance controls operating cost. A
higher survival chance does not automatically make a ball valid for a route.

| Medium | Survival chance |
| --- | ---: |
| Andesite | 55% |
| Brass | 68% |
| Blood-infused | 73% |
| Fluix | 76% |
| Iron | 82% |
| Nickel | 84% |
| Titanium | 88% |
| Steel | 91% |

Ordinary metal media consume five matching ingots or alloy units. Blood-infused and Fluix
media modify a steel ball with their own progression proof. Manufacture and ore separation
do not use Create basin heat; a temperature requirement belongs only on a process whose
physical or magical transformation actually needs it.

## Solvent language

The six supported leach identities are ethanol, acetic acid, sulfuric acid, hydrochloric
acid, nitric acid, and phosphoric acid. They are not interchangeable strength levels.
Each communicates a distinct feedstock and infrastructure story:

- Ethanol begins with open sugar fermentation.
- Acetic acid oxidizes ethanol with contained oxygen.
- Sulfuric acid uses water electrolysis, sulfur oxidation, and a reusable vanadium contact
  catalyst under PneumaticCraft pressure and temperature.
- Hydrochloric acid uses kelp-derived sodium chloride and sulfuric acid.
- Nitric acid uses saltpeter and sulfuric acid.
- Phosphoric acid uses crushed phosphate rock and sulfuric acid and leaves calcium sulfate
  plus tailings.

Open Create preparation is appropriate for solids and ordinary liquids. PneumaticCraft
owns contained gas, pressure, and temperature work. Separation itself has no basin-heat
variant; making an acid difficult and applying it selectively are different progression
decisions.

## Washing

Washing is a one-to-one transformation from a separated material concentrate to the washed
form of that same material. It removes remaining gangue and raises recovery at the thermal
exit. It does not inspect the parent deposit, roll its assay, create new coproducts, or
change the constituent's identity.

That distinction keeps the process legible:

- **Separation asks:** which constituents can this route recover?
- **Washing asks:** how much of this already separated constituent can be recovered?

## Thermal exits and yield semantics

Furnace and blast-furnace recipes share the same output; blasting is only faster. The
current primary-output ladder per feed item is:

| Feed | Metal furnace | Gem furnace | Bulk furnace |
| --- | ---: | ---: | ---: |
| Chunk | 4 nuggets | 4 chips | 2 items |
| Crushed feed | 1 ingot | 1 gem | 4 items |
| Separated concentrate | 2 ingots | 2 gems | 8 items |
| Washed concentrate | 3 ingots | 3 gems | 12 items |

Nine gem chips assemble into one gem and one gem splits into nine chips, so the early gem
exit remains exact and usable.

Where a meaningful molten form exists, the Smeltery yields twice the furnace-equivalent
primary and the Foundry yields three times it. For metals and gems the fluid bases per feed
are 40, 90, 180, and 270 mB across the four stages before those multipliers. Bulk materials
with a molten form use their configured fluid unit against the `2, 4, 8, 12` ladder.

These are progression-value units, not a claim of strict real-world molar mass balance.
Tailings, media loss, probabilistic liberation, and rising recovery make the direction of
the process physical, while the counts keep the game economy legible. Any move to strict
mass conservation would require rebasing the complete crusher, concentrate, furnace, and
molten matrix together; a single locally “realistic” recipe would break the global ladder.

### Smeltery and Foundry responsibilities

- A Smeltery returns only the primary material. It is an early high-yield exit, not a
  chemical separator.
- A Foundry returns the best primary yield. For chunks and crushed feeds it may also emit
  the deposit's curated `foundryPreview` byproducts because those feeds are still mixed.
- A Foundry processing separated or washed concentrate returns only that named constituent
  at the Foundry multiplier. Other constituents have already gone to their own concentrate
  stacks or the tailings.
- Materials without a registered meaningful molten form receive furnace exits only.

`foundryPreview` is deliberately narrower than the complete assay. It represents
coproducts recoverable through direct molten handling; route-specific or chemically awkward
constituents remain reasons to build the separation line.

## Waste and loss

Tailings make rejected material visible and give processing a conclusion beyond free yield
multiplication. The current low-value sink combines two tailings, clay, and water into one
brick. Future sinks may support construction, containment, or pollution remediation, but
must not become a generic route back to valuable metals or gems.

Grinding-ball non-return is an operating cost, not a hidden product chance. Solvent is
consumed. Coproduct rolls are independent. These losses are allowed because block/chunk
reconstruction—not the production ladder—is the system's strict lossless boundary.

## Catalogue contract

`49_realistic_ores_catalog.js` declares each deposit with these meanings:

| Field | Contract |
| --- | --- |
| `id` | Stable recipe/tag path for the deposit |
| `block` | Realistic Ores registry suffix used to derive block, chunk, crushed, and sample IDs |
| `primary` | Reliable economic constituent used by all early exits |
| `assay` | Non-primary constituents and their geological grades |
| `foundryPreview` | Assay constituents exposed by direct Foundry processing |
| `routes` | Two or three valid combinations of ball, optional solvent, and unlocked coproducts |

The startup material catalogue owns each constituent's item class, final item, nugget or
chip where needed, molten identity where one exists, and processing temperature. The
server-side generator derives concentrate identities and recipes from those catalogues.
Hand-authored parallel furnace or melting recipes are not valid overrides.

## Authoring a deposit

When adding or changing a deposit, review the whole state machine rather than adding the
first recipe that makes the new item usable.

1. Define the native block, chunk, crushed feed, surface sample, loot, block separation,
   and exact reconstruction in Realistic Ores.
2. Confirm ordinary mining is exactly one chunk, Fortune-independent, and Silk Touch keeps
   the exact block.
3. Add every new constituent to the startup material catalogue before server recipes refer
   to it. Give it a truthful `metal`, `gem`, or `bulk` class and only a real molten form.
4. Add one catalogue entry with a primary, a reviewed assay, a narrow Foundry preview, and
   two or three curated routes.
5. Make every route geologically and chemically intelligible. `unlocks` must be a subset of
   the assay; `foundryPreview` must also be a non-primary subset of the assay.
6. Ensure at least one route is reachable at the intended progression point. A valid JSON
   recipe whose medium or solvent cannot be produced is not reachable content.
7. Provide separated and washed item assets for any new constituent. Do not use one generic
   concentrate texture for materially different outputs.
8. Let the shared generators create washing and thermal exits. Remove direct ore-block,
   furnace, crusher, or TConstruct compatibility recipes that bypass the state model.
9. Check JEI/EMI readability: the player should be able to distinguish the early exit, the
   highest-yield route, coproduct opportunities, ball wear, and solvent cost.
10. Update this document when theory or shared numbers change; update the executable
    catalogue, not this document, when only one deposit's assay changes.

## Rejected patterns

- Ore blocks directly furnacing, milling, dissolving, or melting into products.
- Fortune multiplying ordinary chunk drops.
- Different chunk items for stone, deepslate, gravel, or decorative host variants.
- Reconstruction that changes host, loses material, or returns more than one block.
- Generic ore item tags that silently re-enable third-party processing recipes.
- One universal grinding ball, one universally best ball, or every ball working everywhere.
- Every acid working on every deposit.
- Washing a mixed deposit and rediscovering its assay.
- Smeltery coproducts or post-separation Foundry coproducts appearing from nowhere.
- Tailings loops that become a better ore source than the deposit.
- A high-yield side recipe outside the generated matrix.

## Open design questions

These are current boundaries worth revisiting through play rather than silently changing:

- **Foundry completeness:** direct Foundry recipes currently expose a curated preview, not
  every assay constituent. If “all outputs” becomes literal, every deposit and yield must
  be rebalanced against the separation routes.
- **Crusher variance:** the `1 + 3x30%` model gives useful texture but can feel swingy in
  small batches. Its expected value and automation behavior should be evaluated together.
- **Washing uniformity:** all materials currently use the same one-step wash. Material-
  specific wash media would add identity but also recipe and JEI cost.
- **Tailings consequences:** the current brick sink is intentionally weak. Pollution,
  storage, or remediation may give tailings more weight, but must preserve bounded matter.
- **Accounting model:** current numbers express gameplay recovery rather than strict mass.
  A conservation-first revision is possible only as a whole-system rebalance.

## Source and validation map

The processing contract is split deliberately:

- `realistic-ores`: native loot, Silk Touch behavior, block/chunk reconstruction, chunk
  crushing resources, and resource tests.
- `kubejs/startup_scripts/00_globals/20_tech/20_realistic_ore_materials.js`: material forms and
  grinding-ball survival.
- `49_realistic_ores_catalog.js`: deposits, assays, previews, solvents, and curated routes.
- `50_create_deposit_preprocessing.js`: separation, grade chances, washing, and tailings.
- `52_realistic_ores_excavated_host_cycles.js`: runtime host-specific block cycles.
- `57_realistic_ores_smelting_matrix.js`: all generated furnace, Smeltery, and Foundry exits.
- `59_reachable_acid_authoring.js`: reachable solvent production.
- `realistic-ores`: native `deposit_ore_blocks` and `deposit_chunks` tag families.
- `60_realistic_ores_excavated_variant_tags.js`: runtime Excavated Variants membership in
  those mod-owned tags and generic ore-item isolation for generated variants.

Run `./gradlew verifyFull` in `realistic-ores` after native resource changes, rebuild and
install its jar, then run the modpack's sole supported evaluation, `./smoke.sh`. A passing
load is necessary but not sufficient: inspect representative recipes in JEI/EMI and verify
one native and one Excavated Variants block cycle in play whenever host logic changes.
