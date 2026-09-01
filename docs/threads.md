# Threads

Threads is a contextual, non-objective collection of 52 illustrated possibilities: four suits of thirteen cards. World concerns encountered places, Works concerns learned making, Powers concerns negotiated capability, and Fragility concerns systems that reveal their limits. The deck borrows the pleasure of discovering and displaying a finite archive without imitating an existing tarot deck or another game's visual language.

Forty-five cards are live. Fragility 7–13 are permanently sealed future identities: the reader may show their names, suits, aspects, and positions, but they have no trigger, lore, invitation, action, doorway, or facsimile behavior in this world.

## Player contract

- Nothing appears merely because the player logged in or returned. Discovery must follow a contextual native action.
- The automatic tease never captures input. An 8×8 code-drawn archive glyph and one localized line form a compact lockup centered at `screenWidth / 2`, with the lockup's visual center at `screenHeight / 3`. The glyph is two logical pixels above the text. No item, block, panel, or card artwork is rendered.
- The line is 72% of the normal GUI font, shrinking no lower than 55% for a long title, and remains one line. It is white with a true-black eight-neighbour outline. Reveal copy is exactly `You've revealed the card: %s`; completion copy is `You've completed card %s`. A second, still smaller line shows the reader binding (`Ctrl+J` by default) while the tease is visible.
- A notice lasts 3.2 seconds: 400 ms fade-in, 2.2 seconds held, and 600 ms fade-out. Twelve deterministic one-pixel wisps use the exact Systemic Salience aspect color; eight dust motes use archive gold `#C6A15B`. They remain tightly bounded around the glyph and drift upward/outward without tint, blur, progress styling, or crosshair coverage.
- The subdued native page/plate rustle plays once at fade-in. There is no synthetic tone. An open screen pauses both time and particles. Notices queue and display one at a time; the collapsed unread marker continues to represent unread plates.
- `Ctrl+J` and the pause-menu button open the reader. Its catalogue has four suit tabs and thirteen stable positions per suit. Every identity, suit, and aspect is inspectable; unknown and future cards remain sealed.
- An unread thumbnail is a dark archive plate with a faint suit edge and leaking aspect trace. Selecting it shows the unexposed plate and `Let the plate develop / Click or Space to remember`; development does not start automatically.
- Development is a single 800 ms linear crossfade from the neutral code-drawn archive plate to the untouched native illustration. There is no separately generated archive, pigment, aspect, tint, trace, or pulse layer. A click or Space during development completes it and is consumed before any doorway or facsimile control.
- Title, prose, invitation, action, doorway, and facsimile controls remain hidden until development completes. Only completion marks a plate read; Escape or navigation beforehand leaves it unread.
- Known lore and art persist across the lineage. Current invitations, active state, and current completion reset for each successor generation. Re-encountering a known card in a successor produces a contextual notice without marking its plate unread again. Completion history retains total count, first generation, last generation, and route counts.
- A live card exposes a doorway only when a specific authoritative native surface exists. Doorways open native Font, Ponder, EMI, guide, or system interfaces; FTB Quests is not a Thread navigation target. A card such as Ruins may omit the control rather than offer a vague or false destination. Signed facsimiles are freely reissued cosmetic copies; they retain collector and lineage identity, grant nothing, and never unlock a card for their recipient.
- On-character display remains unresolved. Do not ship a placeholder cosmetic render.

## Trigger contract

Every live card has separate reveal and completion routes. A single signal may reveal a card or complete an already-active card, never both. Signals are exact bounded lowercase types and bounded values; route values may use an exact value, `|` alternatives, or `*`. Native mods integrate through the optional `ThreadSignals.emit(ServerPlayer, type, value, correlationToken)` surface, so they retain ownership of what counts as a real action and both halves must carry the same episode token.

Pack bridges observe operating boundaries rather than inventory proxies wherever the installed mod exposes them. Create's action-backed criteria cover the deployer, water wheel, pump, train, long travel, and finished Precision Mechanism. Create: Power Grid requires energized terminals plus an actual wire connection, followed by a live consumer. AE2 begins when its pattern-encoding menu is used and completes at the crafting CPU's native job-finished boundary. A Valkyrien Skies episode follows one physical ship until the player makes landfall after 128 blocks. Occultism uses the golden bowl's valid ritual start and successful stop. Relics uses positive native relic experience twice on the same tagged physical stack in distinct contexts. Ars Energistique begins only when positive Source is converted into AE power and completes when the correlated AE2 crafting CPU finishes work. Unsupported OC2-file and generic Hexerei variants are not advertised as acquisition routes.

World journeys bind realm identity to a complete visit. Entering The Bumblezone reveals
`deep_own_light` / The Deep Grows Its Own Light; returning from that same journey completes it.
Entering Ratlantis reveals `silence_has_teeth` / Silence Has Teeth; its correlated return completes
it. The retired generic pollen and logistics identities have no aliases or migration because no
historical player card data exists to preserve.

Fragility is deliberately stricter than a generic milestone list:

| Card | Reveal | Completion |
| --- | --- | --- |
| A Life Reaches Its Tether | the player enters Downed Player Revival's actual downed state | the active card's player later dies |
| Ruins Are Instructions | the player physically enters the bounds of a major ruin-like registered structure | the player leaves alive carrying an item identity absent on entry |
| Enemies Do Not Share a Cause | two distinct hostile mobs target the player within one 45-second encounter | one of those tracked hostiles damages another |
| A Copy Can Outlive the Work | a substantial Create schematic is successfully accepted for publication | the correlated publication succeeds |
| An Army Walks Toward You | Pillager Campaigns enters gathering, approaching, or materialized state for the player | that campaign reaches survived, defeated, retreated, or target-dead outcome |
| A World Can Be Condensed | an operator commits through a standalone World Condenser Interface | the next lineage generation is verified at successor login |

Fragility 7–13—A World Can Be Wagered, Severity Has a Yield, Disaster Can Have an Agenda, Apocalypses Can Disagree, Other Hands Have Built Caches, Recognition Changes Both Sides, and Defeat Need Not Be Erasure—are reserved. Their authored candidate plates do not make them live.

## Definition and delivery contract

Every definition includes exact `suit`, `order`, and canonical lowercase `aspect`: `impact`, `tempo`, `work`, `mobility`, `endurance`, `robustness`, `renewal`, or `control`. Loading requires exactly 52 approved identities, exactly orders 1–13 in every suit, and the approved future flags. Future definitions reject exposed content or routes.

Bounded packet protocol 7 validates card ID, title, suit, order, aspect, resource locations, state, history, unique identities, and list sizes no larger than 52. Automatic notices contain only notice kind, card ID, bounded title, suit, and aspect—never a game asset, artwork, prose, or trigger data.

The collection persists per player at the World Lifecycle Manager lineage boundary. Physical facsimiles may be lost with a world and reissued in its successor. Threads foreshadows `lineage_endgame.md`; it does not explain its cosmology or implement the promised endgame systems.
