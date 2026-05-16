# Known Issues

Date: 2026-04-29

- The offline recipe audit uses the live recipe dump and does not fully prove final post-KubeJS recipe-manager state. Use the KubeJS audit dump after `/reload` for final effective recipes.
- FTB Quests generated descriptions need an in-game UI check.
- Onboarding gating is not yet wired to a confirmed `onboarding_complete` FTB stage/event mirror.
- Villager and Wares coin pricing needs playtest tuning against actual obelisk/dimension coin income.
- Relics did not appear in the current generated loot table dump; if it injects rewards at runtime, it still needs in-client source verification.
- Acid Vat is retired from the active pack; chemistry validation now targets Create and PNCR routes.
