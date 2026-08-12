# Better Content

Build 40 provenance is declared in `tools/custom_mod_inventory.json`. It is the
authoritative 24-custom-mod inventory: source owner/repository/commit, Forge
target, reobfuscated build task, deployed jar, and persistence/worldgen role.
Custom runtime jars are rebuilt with `reobfJar`; third-party artifacts come from
committed Packwiz metadata. Arcane Chunkloaders and TCon Affixes are root-owned;
Traces must be an independently pinned checkout before release validation can
pass. Generated chunks are preserved: worldgen changes apply only to new chunks.

Better Content is an expert Forge 1.20.1 modpack and its supporting content layer.

## Community and support

For modpack and mod discussion, playtest feedback, and bug reports, join the [Better Content Discord](https://discord.gg/EkRnZbzqS9).
