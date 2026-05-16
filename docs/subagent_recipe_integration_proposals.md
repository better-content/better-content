# Subagent Recipe Integration Proposals

Three GPT-5.3 medium-reasoning subagents audited recipe graph, quest/economy, and train logistics surfaces. This file aggregates the actionable proposals and current decisions.

## Implemented Now

### Steam n Rails Returns

- Restored `mods/create-steam-n-rails.pw.toml` from git.
- Kept `create-track-map` disabled because prior profiling identified a startup crash risk.
- Reworked Create III quests to be Steam n Rails/Create train focused instead of Little Logistics/Railways Navigator focused.
- Existing recipe surfaces already reference `railways:track_coupler` in manufactured plate rewrites.

### Economy Tier Reduction

- Active coin tiers are now: copper, iron, brass, gold, platinum.
- Starting Out quest reward is now exactly 4 copper coins.
- Non-starting quest rewards are cumulative 4-count packets from the active tier ladder.
- KubeJS global coin catalogue and graph catalogue now only expose active tiers.
- Villager/Wares/loot currency references were normalized away from disabled coin tiers.

### Quest Visual Language

- Dependency lines are hidden by default.
- Direction is communicated by left-to-right layout, chapter tier tabs, node shape, node scale, subtitles, icon choice, and min-width capstone/casing nodes.
- Full language is documented in `docs/quest_book_visual_language.md`.

## High-Value Follow-Up Proposals

### MUST DO: AE2Things Storage Cleanup

- Proposal: gate AE2Things disk housings/drives behind `kubejs:impossible_machine_casing`; put larger cells behind post-AE2/hybrid materials.
- Evidence: recipe audit flagged cheap amethyst/raw routes for disk housing and disk drives.
- Why it fits: AE2 is local intelligence, not cheap infinite storage.
- Risk: cheap storage trivializes bounded matter and logistics.
- Implementation surface: `kubejs/server_scripts/30_recipe_replace/100_high_value_mod_progression_gates.js`.
- Confidence: high.

### MUST DO: Alchemistry Quarantine / Create/PNCR Parity

- Proposal: keep Alchemistry as compatibility/reference only; remove direct dissolver/fusion gameplay routes unless mirrored through Create/PNCR synthesis.
- Evidence: audit found thousands of Alchemistry recipes, including dissolver/fusion breadth.
- Why it fits: user stated Alchemistry is present for recipe reference; Create/PNCR is the player-facing dissolver parity.
- Risk: default Alchemistry routes bypass deposit interpretation and authored chemistry.
- Implementation surface: material economy pass and Create/PNCR recipe scripts.
- Confidence: high.

### SHOULD DO: Little Logistics Later, Not Now

- Proposal: keep Little Logistics disabled until explicitly chosen; if re-added, place it after Power Grid/OC2R as low-scale physical route infrastructure.
- Evidence: current quest/recipe graph previously had dead Little Logistics nodes while mod metadata was disabled.
- Why it fits: it supports physical logistics but overlaps Steam n Rails.
- Risk: re-adding it now increases surface area and memory pressure while Steam n Rails is the design-core train mod.
- Implementation surface: restore metadata, re-add Create III side branch, keep power/OC2R gates.
- Confidence: medium-high.

### SHOULD DO: Ars Energistique as Post-AE2 Hybrid Branch

- Proposal: re-enable Ars Energistique only after AE2 + Ethereal Slate and gate source cells/bridges accordingly.
- Evidence: post-AE2 plan already names Source-AE hybrid as a branch.
- Why it fits: it gives post-AE2 magic/tech content without global logistics.
- Risk: source storage/cells can become another hidden infinite-ish resource pool.
- Implementation surface: mod metadata, magic gate pass, AE2/post-AE2 recipe gates, quest chapter.
- Confidence: high.

### MAYBE: Create Occult Engineering

- Proposal: re-enable as a Create brass + Blood Magic mid-tier bridge if memory budget allows.
- Evidence: existing high-value gate script already has scaffolding for occult/tech bridges.
- Why it fits: it ties Blood permission to Create manufacturing.
- Risk: occult mining/logistics can bypass extraction if not curated.
- Implementation surface: restore metadata, strict recipe gate, loot audit.
- Confidence: medium.

### MAYBE: Hex Casting / Programmable Magic

- Proposal: re-enable as Ethereal Slate plus optional OC2R casing branch.
- Evidence: design places programmable magic late; current magic quest chapter already references Hex/Psi style late magic.
- Why it fits: programmable magic is a strong post-midgame reward.
- Risk: teleport/logistics spells must be disabled or hard-contained.
- Implementation surface: mod metadata, Blood tier gates, denylist/removal pass.
- Confidence: medium.

### MAYBE: Apotheosis Combat Branch

- Proposal: only re-enable with a serious loot/spawner/gem control pass.
- Evidence: existing gate scaffolding exists, but the mod is broad and loot-heavy.
- Why it fits: can be a late combat/adventure reward lane.
- Risk: loot affixes/spawners/gems can overpower authored recipe progression.
- Implementation surface: metadata, recipes, loot tables, configs.
- Confidence: medium.
