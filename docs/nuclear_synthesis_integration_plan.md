# Nuclear Synthesis Integration

## Source Promotion

Moved these custom mod repositories out of the deferred synthesis stack and into the active top-level custom-mod set:

- `/home/gerald/mcmods/fission_reactor`
- `/home/gerald/mcmods/fusion_reactor`

Both repositories had existing uncommitted source work before this integration. The move preserved that state.

## Build Script Updates

Updated `/home/gerald/mcmods/build.sh` so normal pack builds include:

- `classselector`
- `meteordimensions`
- `oreoverhaul`
- `rpgstats`
- `fission_reactor`
- `fusion_reactor`

Updated `/home/gerald/mcmods/testbuild.sh` similarly, while retaining `acid_vat` for test-output builds.

## Built Jars Added To Pack

Built and copied these jars into `mods/`:

- `mods/fission_reactor-0.1.0.jar`
- `mods/gases_and_plasmas-0.1.0.jar`

`packwiz refresh` indexed both jars.

## Pack-Side Recipe Integration

Added `kubejs/server_scripts/30_recipe_replace/140_nuclear_synthesis_power_gates.js`.

Fission is treated as mid-game synthesis and heat infrastructure:

- `fission_reactor:fission_fuel_acceptor` uses Create mechanical crafting.
- `fission_reactor:fission_reactor_rod` uses Create mechanical crafting.
- Both require Power Grid / Create New Age heat infrastructure and ChemLib nuclear/extreme-band plates.

Fusion / Gases and Plasmas is split into two levels:

- Space-era gas handling: pipes, compressor, fan, electrolyzer.
- Post-AE2 power-grade fusion: electromagnet and ionizer.

The ionizer intentionally requires both AE2 casing/control and fission reactor hardware. This keeps fusion from becoming just another mid-game generator.

## Quest Book Integration

Regenerated the quest book with 20 chapters and 197 quests.

Reworked `electricity.snbt` into:

- `Brass Tier - SU Heat and Electricity`

It now explicitly teaches:

- water wheel SU
- windmill SU
- blaze burner heat
- Create Diesel power
- Create New Age solar heat
- Power Grid generator step sequence
- heat pipes / heat pumps
- Stirling engine heat-to-SU
- fission fuel acceptor / reactor rod

Added a new late chapter:

- `Platinum Tier - Fusion Power and Plasma`

It covers:

- gas pipe network
- gas compressor
- gas fan
- electrolyzer
- AE2 control permission
- electromagnet
- ionizer
- reactive matter cell readiness

## Validation

Passed:

- `./gradlew --no-daemon clean build` in `/home/gerald/mcmods/fission_reactor`
- `./gradlew --no-daemon clean build` in `/home/gerald/mcmods/fusion_reactor`
- `node tools/validate_quest_dependencies.mjs`
- `find kubejs/server_scripts -name '*.js' -print0 | xargs -0 -n1 node --check`
- `packwiz refresh`
- `git diff --check`

## Runtime Checks Needed

The current local registry dump predates the new jars, so runtime validation needs a fresh instance/reload dump.

Inspect these in EMI after launching the refreshed pack:

- `fission_reactor:fission_fuel_acceptor`
- `fission_reactor:fission_reactor_rod`
- `gases_and_plasmas:gas_pipe`
- `gases_and_plasmas:gas_compressor`
- `gases_and_plasmas:gas_fan`
- `gases_and_plasmas:electrolyzer`
- `gases_and_plasmas:electromagnet`
- `gases_and_plasmas:ionizer`
- `create_new_age:stirling_engine`
- `powergrid:generator_housing`
- `powergrid:generator_induction_rotor`
- `powergrid:generator_commutator`
