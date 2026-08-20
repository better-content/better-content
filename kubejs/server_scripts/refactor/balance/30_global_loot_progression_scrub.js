// Global loot progression scrub. Loot is a crafting surface, so high-power materials
// and creative/flight/global-bypass items must not enter through random tables.

var BC_LOOT_REMOVE_ITEMS = [
    // Fishing acquisition is standardized on Starcatcher rods.
    'minecraft:fishing_rod',
    'tconstruct:fishing_rod',
    // Generated from registry: all creative and netherite-named items are removed from generic loot.
    'ae2:creative_energy_cell',
    'ae2:creative_fluid_cell',
    'ae2:creative_item_cell',
    'aether:netherite_gloves',
    'ars_nouveau:creative_source_jar',
    'ars_nouveau:creative_spell_book',
    'arseng:creative_source_cell',
    'art_update:netherite_multitool',
    'bloodmagic:activationcrystalcreative',
    'bloodmagic:fragment_netherite_scrap',
    'bloodmagic:gravel_netherite_scrap',
    'bloodmagic:sand_netherite',
    'create:creative_blaze_cake',
    'create:creative_crate',
    'create:creative_fluid_tank',
    'create:creative_motor',
    'create:netherite_backtank',
    'create:netherite_backtank_placeable',
    'create:netherite_diving_boots',
    'create:netherite_diving_helmet',
    'create_central_kitchen:creative_tab_icon',
    'create_connected:creative_fluid_vessel',
    'create_things_and_misc:netherite_portable_whistle',
    'createmoredrillheads:amethyst_dusts_tipped_netherite_drill',
    'createmoredrillheads:emerald_dusts_tipped_netherite_drill',
    'createmoredrillheads:netherite_drill',
    'createmoredrillheads:quartz_dusts_tipped_netherite_drill',
    'createmoredrillheads:redstone_dusts_tipped_netherite_drill',
    'creatingspace:netherite_oxygen_backtank',
    'creatingspace:netherite_oxygen_backtank_placeable',
    'farmersdelight:netherite_knife',
    'goety:netherite_ravager_armor',
    'goety:netherite_trampler_armor',
    'hexerei:broom_netherite_tip',
    'hexerei:creative_waxing_kit',
    'littlelogistics:creative_capacitor',
    'malum:creative_scythe',
    'minecraft:elytra',
    'minecraft:netherite_axe',
    'minecraft:netherite_block',
    'minecraft:netherite_boots',
    'minecraft:netherite_chestplate',
    'minecraft:netherite_helmet',
    'minecraft:netherite_hoe',
    'minecraft:netherite_ingot',
    'minecraft:netherite_leggings',
    'minecraft:netherite_pickaxe',
    'minecraft:netherite_scrap',
    'minecraft:netherite_shovel',
    'minecraft:netherite_sword',
    'minecraft:netherite_upgrade_smithing_template',
    'naturesaura:netherite_finder',
    'oc2r:creative_energy',
    'powergrid:creative_current_source',
    'powergrid:creative_resistor',
    'powergrid:creative_voltage_source',
    'protection_pixel:smallnetheritesheet',
    'sophisticatedbackpacks:netherite_backpack',
    'sophisticatedstorage:basic_to_netherite_tier_upgrade',
    'sophisticatedstorage:copper_to_netherite_tier_upgrade',
    'sophisticatedstorage:diamond_to_netherite_tier_upgrade',
    'sophisticatedstorage:gold_to_netherite_tier_upgrade',
    'sophisticatedstorage:iron_to_netherite_tier_upgrade',
    'sophisticatedstorage:limited_netherite_barrel_1',
    'sophisticatedstorage:limited_netherite_barrel_2',
    'sophisticatedstorage:limited_netherite_barrel_3',
    'sophisticatedstorage:limited_netherite_barrel_4',
    'sophisticatedstorage:netherite_barrel',
    'sophisticatedstorage:netherite_chest',
    'sophisticatedstorage:netherite_shulker_box',
    'tconstruct:creative_slot',
    'tconstruct:molten_netherite_bucket',
    'tconstruct:netherite_item_frame',
    'tconstruct:netherite_nugget',
    'theoneprobe:creativeprobe',
    'tinkers_advanced:blaze_netherite',
    'tinkers_advanced:molten_blaze_netherite_bucket',
    'ubesdelight:rolling_pin_netherite',
]

var BC_LOOT_EMERALD_TABLES_TO_COIN = [
    'minecraft:chests/village/village_armorer',
    'minecraft:chests/village/village_butcher',
    'minecraft:chests/village/village_cartographer',
    'minecraft:chests/village/village_desert_house',
    'minecraft:chests/village/village_fisher',
    'minecraft:chests/village/village_fletcher',
    'minecraft:chests/village/village_mason',
    'minecraft:chests/village/village_plains_house',
    'minecraft:chests/village/village_savanna_house',
    'minecraft:chests/village/village_shepherd',
    'minecraft:chests/village/village_snowy_house',
    'minecraft:chests/village/village_taiga_house',
    'minecraft:chests/village/village_tannery',
    'minecraft:chests/village/village_temple',
    'minecraft:chests/village/village_toolsmith',
    'minecraft:chests/village/village_weaponsmith'
]

function bcLootItemExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

LootJS.modifiers(function (event) {
    var allLoot = event.addLootTableModifier(/.*/)
    for (var i = 0; i < BC_LOOT_REMOVE_ITEMS.length; i++) {
        if (bcLootItemExists(BC_LOOT_REMOVE_ITEMS[i])) allLoot.removeLoot(BC_LOOT_REMOVE_ITEMS[i])
    }

    for (var j = 0; j < BC_LOOT_EMERALD_TABLES_TO_COIN.length; j++) {
        event.addLootTableModifier(BC_LOOT_EMERALD_TABLES_TO_COIN[j])
            .replaceLoot('minecraft:emerald', Item.of('createdeco:copper_coin', 4), true)
    }
})
