LootJS.modifiers(event => {
    const m = event.addBlockLootModifier("minecraft:gravel");

    for (let i = 0; i < 3; i++) {
        m.addLoot("minecraft:gunpowder").randomChance(0.125);
        // ~0–3 drops depending on RNG
    }
});
