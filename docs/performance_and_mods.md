# Performance And Mods

## Active Pack State

Active downloaded mods are the current `mods/*.pw.toml` files. Active custom bundled jars in `mods/` include:

- `btmfixes-0.1.0.jar`
- `classselector-1.0.0.jar`
- `computerbridge-0.1.0.jar`
- `create-transmission-loss-0.1.0.jar`
- `fission_reactor-0.1.0.jar`
- `gases_and_plasmas-0.1.0.jar`
- `heatsync-0.1.0.jar`
- `latent_chemlib-0.1.0.jar`
- `liquid_coolant-0.1.0.jar`
- `obelisks-1.0.0.jar`
- `pillagercampaigns-0.2.0.jar`
- `procedural_bouquets-0.1.0.jar`
- `realisticores-0.1.0.jar`
- `rpgstats-1.0.0.jar`
- `settlementroads-0.1.0.jar`
- `villagewalls-1.0.0.jar`

Do not infer active state from old RAM cuts or runtime caches. In the current repo, Botania, Hexerei, Iron's Spells, Malum, Occultism, Goety, Forbidden and Arcanus, and Reliquary have active manifests. Theurgy, Psi, and Hex Casting do not have active `mods/*.pw.toml` entries and should be treated as inactive/future unless re-added.

## Runtime Pruning

Disposable runtimes can inherit stale jars from `server-template/`, `server-instance/`, or launcher caches. `tools/prune_runtime_mods.mjs` is wired into `tools/bootstrap_server.sh` to remove jars not expected from active manifests plus bundled jars, while also respecting server-side client-only exclusions from `tools/_runtime_common.sh`.

If a runtime dump mentions a mod not present in current manifests or bundled jars, treat it as contaminated until the runtime is rebuilt and pruned.

## Memory Findings

Historical profiling showed that strict low-memory targets are profile decisions, not JVM-flag tweaks:

- A useful full-pack shape did not reach a strict 10 GiB peak RSS world-entry target in the old measurements.
- A 6 GiB-class profile required a separate lite pack shape that kept the tech/survival/Blood Magic/AE2/OC2R skeleton and removed broad adventure, magic, decorative, client visual, and model-heavy content.
- Client memory pressure was dominated by model, texture, atlas, and native/render caches more than by one Java heap collection.
- Removing large worldgen/decorative/model surfaces gave larger wins than small JVM adjustments.

Current full-pack work should assume a higher memory budget unless the user explicitly asks for a lite profile. Do not delete active content for memory reasons without a new measured A/B against current manifests.

## C2ME, DH, LC, And TFTH

Current source state keeps C2ME, Distant Horizons, Lost Cities, and The Flesh That Hates active. The focused stability harness is `tools/lc_tfth_c2me_dh_stability.py`.

Historical conclusions to preserve:

- C2ME had real previous watchdog/deadlock risk during login and chunk access.
- DH should remain enabled for stability validation rather than being disabled to make the test easier.
- Lost Cities is routed through Creating Space datapack entries under `kubejs/data/*/creatingspace/rocket_accessible_dimension/`.
- TFTH now has an active manifest/config state; any older claim that no TFTH mod was identified is stale.

Revalidate with the current harness after touching `config/c2me.toml`, `config/DistantHorizons.toml`, Lost Cities/Creating Space datapack routes, TFTH config, custom worldgen mods, or portable harness logic.

## Custom Mod Notes

Canonical custom mod sources live under `/home/gerald/mcmods`. Use `/home/gerald/mcmods/settlement-roads` for settlement roads unless explicitly told otherwise.

Prior repairs worth retaining as current expectations:

- `settlementroads` should avoid unbounded tick-time work and clean level-unload state.
- `villagewalls` should cap automatic wall generation work and avoid endless retries for failed village cells.
- `btmfixes` includes compatibility behavior for C2ME safe-random guard noise around EMI tooltip indexing.

Rebuild and redeploy custom jars deliberately; then sync, prune, boot, and validate with the relevant harness.

## Heat Unification Feasibility

Static audit date: 2026-05-17. Scope was replacing Create: New Age heat with a neutral authoritative `btm_heat` system while treating `fission_reactor` as redundant with `latent_chemlib`.

Final rating: partially feasible. The custom stack can move cleanly if `btm_heat` provides a Forge capability with heat storage, temperature conversion, side-aware transfer, sync/tooltips, and optional radiation/event hooks. PNCR, Cold Sweat, FIAHI, Weather2, and Temperature Bands should remain separate owners of their native semantics; bridges should be shallow and explicit. CNA removal is not blocked by content, but it is a broad pack edit because recipes, quests, ALOD configs, HeatSync tags, and custom mod compile dependencies still reference `create_new_age:*`.

Current heat ownership:

- Create: New Age: current machine heat transport, storage, reactor/radiation API provider, and pack-side heat item source. It is not a good long-term authority because pack custom mods depend directly on its implementation classes.
- `latent_chemlib`: nuclear and high-energy chemistry source. It stores chemical temperature/energy in its own state, consumes recipe `min_temperature`, `heat_cost`, and `heat_emission` data, and currently emits heat into CNA `HeatBlockEntity`.
- `liquid_coolant`: coolant transport/exchange layer. It has JSON-defined cold/hot fluid pairs and a `coolant_exchanger` that consumes or stores CNA heat.
- `heatsync`: ambient/body bridge and pipe balancing layer. It samples Cold Sweat world temperature, maps it to CNA heat units, adjusts CNA heat pipes, and exposes hot/cold pipes back to Cold Sweat as block temperature.
- PNCR: independent pressure and heat machine system. It has public `IHeatExchangerLogic`, `IHeatExchangerAdapter`, `IHeatRegistry`, `HEAT_EXCHANGER_CAPABILITY`, and recipe `TemperatureRange` APIs. PNCR should stay the owner of thermo-plant recipe semantics.
- Cold Sweat: body-temperature authority and ambient temperature calculator. It exposes block temperature registration, temp modifiers, world temperature helpers, and direct entity temperature APIs.
- FIAHI: food temperature/container integration layered on Cold Sweat. Local jar inspection shows Cold Sweat boiler/icebox mixins and config-only stable container controls, not a broad public heat API.
- Weather2: weather/storm ambient input. Keep it as weather state only; do not make it own machine heat.
- Temperature Bands: worldgen/biome temperature shaping via mixins and config (`bandSize`, vertical bands, noise, range, grade shift). Treat as an ambient input to Cold Sweat/world climate, not a machine heat surface.

CNA and `fission_reactor` removal impact:

- Custom Java compile breaks: `latent_chemlib`, `liquid_coolant`, and `heatsync` all declare CNA as a required dependency and import `org.antarcticgardens.cna.content.heat.*`.
- `latent_chemlib` breakpoints: `LatentMachineBlockEntity` implements CNA `HeatBlockEntity`; `NuclearSimulationService` accepts CNA heat sinks and calls CNA `NuclearUtil.createRadiation`. Port this to `btm_heat` heat emission plus either a `btm_heat` radiation hook or a separate pack-owned radiation service.
- `liquid_coolant` breakpoints: `CoolantExchangerBlockEntity` and creative source block entities implement CNA `HeatBlockEntity`; exchange logic is mostly portable because it already accepts plain heat numbers. Recipes and demo commands still reference `create_new_age:heat_pipe`.
- `heatsync` breakpoints: pipe tracking, neighbor averaging, Cold Sweat block-temp output, and radiator tags are keyed to CNA heat pipes/entities. This becomes either the initial `btm_heat` pipe implementation or a bridge module over the new capability.
- Pack content references: CNA appears in recipe gates for heat pipes, heat pumps, stirling engines, electrical parts, energising recipes, late-tier components, liquid coolant, hooks/drones, protection pixel, deferred integration, generated quest tooling, graph audits, EMI hiding, loot scrub, and ALOD magnetite/thorium configs.
- Worldgen/content references: `datapacks/no_thorium_or_magnetite_veins` and `config/adlods/Deposits/{thorium,magnetite}.cfg` target CNA ore/block ids. Replace with `latent_chemlib`/Chemlib or pack-owned ore ids, or remove if those materials move fully into authored deposits.
- `fission_reactor`: active bundled jar is listed, but no canonical `/home/gerald/mcmods/fission-reactor` source directory was found in the static audit. Treat it as remove/deprecate, not port. Update active jar lists and runtime pruning expectations when removal is intentional.

Minimum `btm_heat` API:

- Forge capability: side-aware `IBtmHeatStorage` for `getHeat`, `setHeat`, `addHeat`, `extractHeat`, `maxHeat`, `thermalCapacity`, `thermalResistance`, `canConnect`, and simulation-mode transfer.
- Temperature model: explicit conversion between heat energy and temperature, with constants for ambient baseline, absolute zero clamp, and configured unit bridges to Cold Sweat MC units and PNCR Celsius-like recipe temperatures.
- Transfer model: deterministic server tick transfer for pipes, radiators, coolant exchangers, and adjacent machine faces; sync packets/tooltips should be part of the shared implementation rather than each bridge copying CNA helpers.
- Data hooks: JSON/data-pack entries for coolant heat per bucket, machine heat capacity/loss, radiator emission strength, nuclear heat emission, and ambient coupling.
- Event/hooks: `HeatEmissionEvent`, `AmbientHeatSampleEvent`, and optional `RadiationEmissionEvent` so `latent_chemlib`, `heatsync`, and future bridges do not call each other directly.

Bridge matrix:

- `latent_chemlib`: high confidence. Replace CNA `HeatBlockEntity` with `btm_heat` capability. Nuclear heat already emits as numeric values; radiation is the only separate service decision.
- `liquid_coolant`: high confidence. Keep coolant JSON and exchange math; replace block entities with `IBtmHeatStorage` and replace `create_new_age:heat_pipe` recipes with `btm_heat:heat_pipe` or equivalent.
- `heatsync`: high confidence if it becomes part of `btm_heat`, medium if kept as an addon. The current Cold Sweat recursion guard is useful and should be retained.
- PNCR: medium confidence. Public heat capability allows adapters that mirror or exchange with nearby `btm_heat`, but thermo-plant recipes should remain PNCR recipes with PNCR temperature checks. Avoid mixins unless direct machine temperature override is required.
- Cold Sweat: high confidence for block/player temperature exposure. Use a registered `BlockTemp` for `btm_heat` radiators/pipes and Cold Sweat APIs for ambient sampling. Avoid double application by suppressing `btm_heat` block temps while sampling ambient, matching current HeatSync behavior.
- FIAHI: low-to-medium confidence. Treat as a Cold Sweat food-container consumer. Config can whitelist or exclude stable containers; deeper food heat sharing would require FIAHI-specific mixin work.
- Weather2: low direct bridge value. Use weather as an ambient modifier only if Cold Sweat does not already account for storm/overcast conditions sufficiently.
- Temperature Bands: medium for ambient input, low for runtime bridge. It changes world temperature distribution through config/mixins; keep it upstream of Cold Sweat rather than feeding machine heat.

Recommended port order:

1. Create `btm_heat` with the capability, basic pipe, radiator, creative source/sink, sync/tooltips, and unit conversion tests.
2. Port `liquid_coolant` to `btm_heat`; its exchange logic is the smallest proving ground.
3. Port `latent_chemlib` heat storage/emission and decide the radiation hook.
4. Fold or port `heatsync` into `btm_heat` for Cold Sweat ambient sampling and block temperature output.
5. Add optional PNCR adapter blocks or capability wrappers; keep PNCR native heat machines valid.
6. Remove CNA and `fission_reactor` pack references in one content pass, replacing heat pipes/pumps/stirling/energising surfaces with `btm_heat`, Power Grid, Create, or PNCR equivalents.

Validation required before shipping the actual migration:

- Static: `rg create_new_age` and `rg fission_reactor` should show only intentional removal notes or migration docs.
- Custom mods: unit tests for `btm_heat`, `liquid_coolant`, `latent_chemlib`, and `heatsync`/bridge math; `gradlew build` for each touched mod.
- Pack: `node --check` for touched KubeJS, `node tools/validate_kubejs_assets.mjs`, and `tools/server_content_smoke.sh --server-dir /tmp/btm-content-smoke --reset-runtime`.
- Runtime: a disposable server/client join with PNCR, Cold Sweat, FIAHI, Weather2, Temperature Bands, `btm_heat`, `liquid_coolant`, `heatsync` or replacement bridge, and `latent_chemlib`; confirm no CNA or `fission_reactor` jars remain.
