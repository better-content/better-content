# Systemic Salience

Systemic Salience is a shared behavioral language, not a shared state system. RPG Stats owns permanent Life development, Diet plus the thin `systemic_salience` bridge own temporary bodily state, TConstruct owns material behavior, and Realistic Ores owns geological deposits and assay depth.

## Shared perceptual contract

| Aspect | Glyph | sRGB | Recurring meaning |
| --- | --- | --- | --- |
| Impact | ✦ | `#E4717D` | forceful magnitude and interruption |
| Tempo | » | `#AA652B` | action cadence and recovery timing |
| Work | ⚒ | `#CAA903` | productive throughput |
| Mobility | ➜ | `#C0E304` | locomotion and repositioning |
| Endurance | ∞ | `#35BBD0` | resource conservation and sustained effort |
| Robustness | ◆ | `#1175FC` | resistance to hostile conditions |
| Renewal | ✚ | `#6FEDBA` | restoration and bodily recovery |
| Control | ⊕ | `#8A6CB2` | accuracy, recoil, dispersion, and handling |

The palette was numerically optimized in OKLCH with an sRGB-gamut constraint. Its checked contract is a minimum pairwise OKLab distance of `0.10` under normal vision and full-strength Machado-style protan, deutan, and tritan simulations. The actual rounded palette clears `0.117` in the worst simulated model. Glyphs, names, value structure, physical morphology, and behavior remain mandatory parallel cues; color is never authoritative alone.

## Concrete mechanic inventory

| Authority | Concrete quantity or event | Operation | Aspect prior |
| --- | --- | --- | --- |
| RPG Stats / vanilla | attack damage | capped additive projection | Impact |
| RPG Stats / Epic Fight | impact | capped additive projection | Impact |
| RPG Stats / vanilla | attack speed | capped additive projection | Tempo |
| RPG Stats / TConstruct | item-use speed | capped multiplicative projection | Tempo |
| RPG Stats | mining speed | capped multiplicative projection | Work |
| RPG Stats / vanilla | movement speed | capped additive projection | Mobility |
| RPG Stats | hunger and thirst expenditure | capped multiplicative conservation | Endurance |
| RPG Stats / Epic Fight | stamina | capped multiplicative projection | Endurance |
| RPG Stats / Cold Sweat | heat and cold resistance | two capped additive projections | Robustness |
| RPG Stats / TACZ | recoil and dispersion | two capped reductions | Control |
| RPG Stats / Goety | spell range | capped multiplicative projection | Control |
| Diet / Epic Fight / Thirst | stamina, quenched state, sprint support | temporary thresholds | Fruits: Renewal + Endurance |
| Diet / vanilla | sustained-work exhaustion, tool preservation, long-haul sprint | temporary thresholds | Grains: Work + Endurance |
| Diet / Epic Fight | knockback/impact, brace, success recovery | temporary thresholds | Proteins: Impact + Robustness |
| Diet / Cold Sweat / vanilla | temperature drift, harmful-effect recovery, emergency protection | temporary thresholds | Vegetables: Robustness + Renewal |
| Sugar bridge | nutrient potency, cooldowns, nutrient decay, later debt | amplifies and accelerates existing bodily state | meta-food; not an aspect bucket |
| Alcohol bridge | composure/deferred harm versus impairment | midpoint benefit plus monotonic nonlinear impairment | meta-food; not an essential nutrient |
| TConstruct Affixes | 15 repository-owned materials | signed descriptive `-3..3` profiles | multiple affinities plus weakness |
| Realistic Ores | ten deposit families | name, morphology, immediate utility, assay behavior | Matter remains geology-first |

RPG allocations use a `cap × points / (points + 20)` curve: twenty committed points reach half the cap, allocation cannot be refunded during the life, and death wipes the allocation ledger. Exact projections stay in the RPG screen and tooltips.

## Nutrition configuration and presentation

Diet continues to classify and store Fruits, Grains, Proteins, and Vegetables. The bridge cancels Diet's generic decay/effect pass and supplies superlinear fullness decay, sugar load and metabolic debt, and inverted-U alcohol. The Diet-screen panel shows both affinities for every ordinary group. Alcohol has a center marker plus separate Composure and Impairment readouts, so the UI does not invite the player to fill it.

`systemic_salience-server.toml` exposes the decay exponent and baseline, sugar/debt/alcohol half-lives, amplification scales, every ordinary-nutrient threshold, and an `item_id=load` alcohol list. Sugar intensity remains tag-configurable through `systemic_salience:sugar_medium` and `systemic_salience:sugar_high`.

## Material-profile ownership

The resolved pack contains many third-party TConstruct definitions. Behavioral profiles are guaranteed only for the 15 materials authored by `tinkers_construct_affixes`; the owning mod tests exact profile coverage and shows “Pack-authored material profile” in tooltips. External materials retain native statistics and descriptions rather than receiving inferred labels which Better Content cannot truthfully own. This is an explicit boundary, not silent missing coverage.

## Prediction and accessibility acceptance protocol

Before a release changes the vocabulary, conduct the following blinded check with at least three people who did not author the changed content:

1. Present the ten deposit textures and names without EMI. Record the promised use each participant predicts. Coal Measures and Ironstone require unanimous correct first-contact predictions; at least eight of ten deposits must produce the intended broad promise from each participant.
2. Present five unseen pack-authored TConstruct tools with exact numbers hidden. Require participants to identify at least one correct strongest affinity on four of five.
3. After showing RPG aspect names once, repeat the material test and ask participants to explain two nutrition profiles. Improvement, not memorization of exact values, is the cross-system transfer criterion.
4. Repeat the deposit and glyph test under the pack's normal shaders in low light and with protan, deutan, and tritan filters. No decision may depend on hue alone.
5. Let participants consume sugar and low/moderate/high alcohol without formula text. They must discover that sugar spends reserves faster, moderate alcohol has the best tradeoff, and high alcohol is undesirable.

Automated builds enforce resource identity, palette distance, exact family/output contracts, projection curves, persistence rules, and processing result limits. The human protocol is the release gate for prediction; automated tests cannot establish that a player learned a useful prior.

## Maintainer restart rule

When adding a mechanic, first append its concrete quantity and causal owner to the inventory above. Cluster it into an existing aspect only if the same behavioral prior remains useful elsewhere. Add a new aspect only after the inventory proves the existing vocabulary cannot compress it. Name and color come last.
