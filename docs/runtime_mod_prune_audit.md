# Runtime Mod Prune Audit

Date: 2026-05-16

## Finding

Disposable server bootstraps could inherit stale jar caches from `server-template/mods` or `server-instance/mods` after the current Packwiz manifest was resolved. Because those copies used `--ignore-existing`, removed mods could reappear in validation runtimes and contaminate generated recipe evidence.

Observed contamination in `/tmp/btm-recipe-audit` included retired or removed jars such as `acid_vat`, Botania, Chipped, Occultism, Supplementaries, Theurgy, Malum, and old AE2/Create add-ons.

## Fix

Added `tools/prune_runtime_mods.mjs` and wired it into `tools/bootstrap_server.sh` after cache copy and Packwiz resolution. The pruner:

- builds the expected runtime mod set from bundled jars plus `mods/*.pw.toml`;
- applies the server-side client-only exclusion globs from `tools/_runtime_common.sh`;
- supports dry-run and apply modes;
- removes jars or native libraries in the target runtime that are not part of the current expected set.

## Evidence

After applying the pruner to the contaminated disposable runtime:

```text
runtime mod prune: side=server expected=199 actual=199 unexpected=0 missing=0 excluded=17 mode=dry-run
```

Targeted checks for known stale jars returned no matches:

```text
acid_vat, botania, chipped, occultism, supplementaries, theurgy, malum, apotheosis, createappliedkinetics
```

This protects future runtime recipe dumps from using stale removed mods as source truth.
