# Questbook Standards

## Purpose

The questbook is a player-facing field guide to real pack behavior. It explains what the player can do, why an action matters, and which capabilities genuinely require earlier work. It is not a second recipe lock, an arbitrary progression gate, a checklist of every ingredient, or a substitute for JEI and EMI.

Every chapter should answer three questions at a glance:

1. Where do I start?
2. What can I pursue in parallel?
3. What concrete capability or accomplishment does each route reach?

Dependencies encode literal recipe, action, or capability requirements. Narrative recommendations belong in descriptions, not dependency lines. Optional branches must remain optional even when they are sensible preparation.

## Chapter Roles

Use the smallest chapter set that gives the route a readable identity. A chapter should describe one coherent phase, system, or reference collection rather than becoming a miscellaneous holding area.

Every live chapter group must contain at least one live chapter. Keep categories for unfinished or stored chapters out of `chapter_groups.snbt` until those chapters are promoted into the runtime book.

- Guidance chapters teach an active play phase through a readable graph.
- Overview chapters use native FTB quest links to summarize milestones owned elsewhere. Linked milestones do not duplicate tasks or rewards.
- Completionist chapters are exhaustive reference collections. Their layout may be denser, but every entry still needs an automatic, semantically correct task and a distinct icon.
- Hidden technical quests may anchor integration state, but they do not appear as player-facing progression.
- Do not keep retired guided chapters beside the live book. Delete obsolete drafts once every retained milestone has an authoritative live home; any temporary non-runtime draft must remain outside `config/ftbquests/quests/` and outside reveal overrides.

`Landmarks` is the model for an overview chapter: compact, always visible, and composed mainly of native links. It shows the early route without becoming a mandatory spine or duplicating completion state.

## Graph Layout

Design the graph before polishing prose. A valid quest file can still be a bad map.

### Reading Direction

- Default to left-to-right progression.
- Place the primary route on a stable visual axis.
- Keep ordinary steps roughly 1.5 units apart. Increase spacing to about 2–2.5 units around major junctions, large nodes, or dense labels.
- Use short diagonals to separate branches. Avoid long diagonals, backtracking lines, and crossings.
- A new player's eye should find the entry, follow the main route, and distinguish optional districts without opening every node.

### Structure

- Give every chapter an unmistakable entry node. Do not begin a chapter with an unsupported self-check.
- Build a visible trunk for the chapter's central capability.
- Attach specialist routes as coherent lanes or constellations with their own local direction.
- Use shared horizontal or vertical alignment as a visual grammar, not arbitrary coordinates.
- Keep related equipment and actions near one another. Do not scatter a recipe chain merely to fill empty space.
- Never use chapter images, colored rectangles, or other artwork as quest connectors. Every line that appears to connect two nodes must be a native FTB dependency edge.
- Keep dependency lines visible in player-facing chapters. Resolve crossings by removing redundant dependencies or moving nodes, not by hiding real edges.

For a large hub chapter such as Homesteading, establish a practical central route and organize optional systems into named visual districts. Connect each district with direct dependencies where progression is real, leave genuinely independent routes visibly independent, and avoid implying causality with a decorative bus.

### Shapes and Scale

- Circle, size 1: ordinary action or acquisition.
- Rounded square, about size 1.2–1.3: equipment, station, or capability hub.
- Diamond, about size 1.2: route choice, aggregate, or junction.
- Hexagon, about size 1.3–1.5: named milestone or substantial accomplishment.
- Oversized nodes are exceptional and must carry proportional visual importance.

Shape communicates role. Do not use it as decoration or vary it randomly within a lane.

## Dependencies and Completion

Each line must be defensible as a mechanical statement: “the target cannot be performed or crafted without the source capability.” If that sentence is false, remove the dependency.

- Prefer the literal recipe inputs or capability-producing quests over a nearby narrative milestone.
- Use `one_completed` when any one branch truly supplies the required capability.
- Dependency-only aggregates are appropriate for combining automatic accomplishments; do not add a manual check merely to make the player acknowledge the aggregate.
- Items already acquired should satisfy ordinary item tasks unless the intended action genuinely must happen after another event.
- Use gameplay criteria for actions such as transport, assembly, operation, repair, harvest, or multiblock formation. A pile of components must not satisfy a functional accomplishment.
- Use stack predicates when correctness depends on NBT, capabilities, composition, or state rather than item identity.
- Preserve a quest or task ID when it still represents the same action. Assign a stable unique ID when the semantics change.

## Manual Check Policy

Manual checkmarks are a scarce exception. They are not a default task type.

A manual check is acceptable only when the accomplishment is broad, meaningful, not reliably observable, and worth asking the player to attest deliberately. It should generally describe a substantial built condition or considered choice, not possession, crafting, travel, or a small routine action.

- Never use a checkmark as a section heading, spacer, or decorative parent.
- Never start a normal progression chapter with a trivial checkmark.
- Do not use checks where an item task, criterion, predicate, structure task, or dependency aggregate can represent the action.
- Keep the total count pack-wide extremely small; roughly six is a useful upper bound, not a quota.
- A checkmark may gate nothing when it is advice. If it gates progression, its completion standard must be explicit and substantial.

## Icons

Every player-facing quest must have an explicit, meaningful, visually distinct icon.

- Use the item, block, tool, material, creature product, or symbol most directly associated with that quest's action.
- No missing icons, blank maps, generic checkboxes, generic spyglasses, or unrelated placeholders.
- Literal quests must not reuse another literal quest's icon within the live book. Deliberate repeated consideration icons in a tightly scoped selection screen are the only normal exception.
- Distinct item IDs are not enough when their rendered pixels are effectively identical. Inspect the actual in-game rendering.
- Avoid icons that render empty, nearly black, tiny, clipped, or as a missing model.
- Native quest links inherit the source quest's icon; do not recreate linked milestones merely to change presentation.

Icons are navigation landmarks. A player should be able to relocate a quest by silhouette and color before rereading its title.

## Titles and Descriptions

Titles are short, concrete, and player-facing. Prefer a capability or action over a category label.

Descriptions use one or two action-led sentences:

- Sentence one tells the player what to do.
- Sentence two explains the important mechanic, constraint, or consequence.

Name exact controls, states, and exceptions when they matter. Explain tool combinations where the recipe surface is unusual. Do not restate every ingredient visible in JEI, bury the action in lore, claim broader behavior than the implementation supplies, or describe a recommended order as mandatory.

Good copy distinguishes commonly confused mechanics: permanent spawn versus beds, shared pouch temperature versus preservation, world temperature versus body temperature, transport through a Font versus dimension entry by another route, and possessing components versus operating an assembled machine.

## Rewards

Rewards communicate scale and rarity without becoming exchangeable currency tiers.

- Ordinary early actions use authored copper rewards appropriate to effort.
- Trophy nodes replace ordinary copper with their approved rarity token.
- Completionist quests pay exactly eight `createdeco:copper_coin` each.
- Coin rarities are non-convertible tokens. Do not add exchange recipes or exchange trades.
- Linked overview markers inherit the original quest's reward; an overview must never duplicate it.
- Hidden technical anchors and informational instructions are rewardless.

## Visibility and Links

Visibility is a teaching tool, not a substitute for real requirements.

- Show enough of the route before onboarding completes that a new player can understand the immediate future.
- Gate detailed chapters at the capability that makes them relevant.
- Keep overview links visible as previews without exposing the gated destination chapter.
- Reveal overrides apply only to an explicit live-chapter whitelist. They never reveal hidden technical anchors or archived storage.
- A reveal action changes visibility only. It does not complete content tasks or grant rewards.
- All specialist branches within an unlocked chapter should normally appear together; avoid contextual curtains unless the design explicitly requires discovery.

Use native `quest_links` whenever another chapter owns the milestone. Completion, task, reward, and icon remain authoritative on the original quest.

## Authoring Review

Review the book as a player-facing map, not only as SNBT.

For every changed chapter:

1. Confirm the entry, trunk, branches, junctions, and capstones are visually legible.
2. Trace every visible line and justify it as a literal requirement; confirm that no chapter image resembles a connector.
3. Inspect every icon as rendered, including linked nodes and unusual NBT-backed items.
4. Read every title and description at normal UI scale.
5. Check that automatic tasks prove the stated action and reject component piles or lookalike items.
6. Inspect all live chapters after any shared style, icon, visibility, or task-policy change—not only the chapter edited most recently.
7. Confirm archived chapters remain outside the runtime chapter directory.

The supported pack evaluation remains `./smoke.sh`. It must confirm server readiness, client join, FTB chapter loading, JEI/EMI startup, and absence of fatal registration or mixin errors. Visual authoring review complements that runtime test; it does not replace it.

## Interaction Contract

A quest is an interface between player intent, observable game state, and pack implementation. Keep those three layers explicit whenever a quest is proposed or revised:

1. **Player contract:** name the action or capability the player is being taught and what completion promises.
2. **Detection contract:** identify the exact item task, predicate, criterion, event, dependency aggregate, or exceptional manual check that proves it.
3. **Implementation contract:** identify the recipe, tag, script, configuration, or custom-mod behavior that makes the text and detection true.

When one layer cannot be identified, the quest is not ready for runtime authoring. Advice may remain prose, but prose must not be converted into a dependency or completion condition merely to make the graph look connected.

Changes that cross these layers must remain synchronized. A recipe or event change requires review of its task and wording; a task change requires review of dependencies, links, reveal behavior, and rewards; an ID change requires review of every reference to that ID. Native links and technical anchors are references to authoritative state, not copies of it.

For agent-to-agent or agent-to-maintainer handoff, describe behavior rather than only filenames. State the intended action, proof mechanism, literal prerequisites, visibility transition, reward ownership, affected stable IDs, and any runtime integration outside the quest tree. Call out assumptions and unresolved in-game visual checks explicitly so the next author does not have to reconstruct intent from SNBT.

## Maintenance

This file is the living source of truth for questbook presentation and authoring policy. Update it when a playtest exposes a durable rule, when FTB integration changes the available task or visibility semantics, or when a new chapter establishes a better reusable visual pattern.

Do not append pass reports, screenshots, generated audits, or historical changelogs here. Fold the durable conclusion into the relevant rule and keep transient evidence outside the tracked documentation tree.
