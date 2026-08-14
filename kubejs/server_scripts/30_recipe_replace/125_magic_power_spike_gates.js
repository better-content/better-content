// Second-layer Blood Magic gates for operational magic power spikes.
// The first magic gate file handles entry workstations. This file catches strong rituals,
// spell focuses, generators, and programmable/networked magic that can otherwise be made
// from plain vanilla valuables after the entry item is obtained.

var BC_MAGIC_T1 = 'bloodmagic:blankslate'
var BC_MAGIC_T2 = 'bloodmagic:reinforcedslate'
var BC_MAGIC_T3 = 'bloodmagic:infusedslate'
var BC_MAGIC_T4 = 'bloodmagic:demonslate'
var BC_MAGIC_T5 = 'bloodmagic:etherealslate'

function bcMagicReplace(event, filter, oldInputs, gate) {
    for (var i = 0; i < oldInputs.length; i++) event.replaceInput(filter, oldInputs[i], gate)
}

function bcMagicGateOutputs(event, outputs, oldInputs, gate) {
    for (var i = 0; i < outputs.length; i++)  bcMagicReplace(event, { output: outputs[i] }, oldInputs, gate)
}

function bcMagicRemoveOutputs(event, outputs) {
    for (var i = 0; i < outputs.length; i++) event.remove({ output: outputs[i] })
}

ServerEvents.recipes(function (event) {
    var commonVanillaValuables = [
        'minecraft:redstone', '#forge:dusts/redstone',
        'minecraft:lapis_lazuli', '#forge:gems/lapis', '#forge:storage_blocks/lapis',
        'minecraft:gold_ingot', '#forge:ingots/gold', '#forge:storage_blocks/gold',
        'minecraft:diamond', '#forge:gems/diamond', '#forge:storage_blocks/diamond',
        'minecraft:emerald', '#forge:gems/emerald', '#forge:storage_blocks/emerald',
        'minecraft:amethyst_shard', '#forge:gems/amethyst', '#forge:storage_blocks/amethyst',
        'minecraft:glowstone', 'minecraft:glowstone_dust', '#forge:dusts/glowstone'
    ]

    // Blood I: first folk/spirit power should consume actual altar output, not only vanilla craft stock.
     bcMagicGateOutputs(event, [
        'malum:spirit_altar'
    ], commonVanillaValuables.concat(['minecraft:torch']), BC_MAGIC_T1)

    // Formal depth II: rituals operationalize earned vocabulary without Blood parenting Ars.
     bcMagicGateOutputs(event, [
        'ars_nouveau:ritual_brazier',
        'ars_nouveau:ritual_scrying',
        'ars_nouveau:ritual_overgrowth',
        'ars_nouveau:ritual_disintegration',
        'ars_nouveau:ritual_harvest',
        'ars_nouveau:ritual_restoration',
        'ars_nouveau:ritual_forestation',
        'ars_nouveau:ritual_sunrise',
        'ars_nouveau:ritual_burrowing',
        'ars_nouveau:ritual_challenge',
        'ars_nouveau:ritual_binding',
        'ars_nouveau:ritual_flowering',
        'ars_nouveau:ritual_fertility',
        'ars_nouveau:ritual_animal_summon',
        'ars_nouveau:ritual_gravity',
        'ars_nouveau:ritual_wilden_summon',
        'ars_elemental:ritual_detection',
        'ars_elemental:ritual_tesla_coil'
    ], commonVanillaValuables.concat([
        '#forge:storage_blocks/source', '#forge:gems/source', 'ars_nouveau:source_gem',
        'ars_nouveau:earth_essence', 'ars_nouveau:air_essence', 'minecraft:ender_pearl'
    ]), '#kubejs:formal_magic/proof/rare')

    // Blood IV: Goety operational power. Keep Goety's internal focus chain,
    // but make the cheap focus entry and altar variants require a Demonic Slate.
     bcMagicGateOutputs(event, [
        'goety:dark_altar',
        'goety:dark_altar_stone',
        'goety:dark_altar_deepslate',
        'goety:dark_altar_blackstone',
        'goety:dark_altar_end_stone',
        'goety:dark_altar_ominous_stone',
        'goety:dark_altar_highrock',
        'goety:dark_altar_prismarine',
        'goety:empty_focus',
        'goety:focus_bag',
        'goety:focus_pack',
        'goety:sensing_focus',
        'goety:crafting_focus',
        'goety:biting_focus',
        'goety:teeth_focus',
        'goety:shredding_focus',
        'goety:wind_blast_focus',
        'goety:swarm_focus',
        'goety:ignite_focus',
        'goety:fireball_focus',
        'goety:fire_breath_focus',
        'goety:frost_breath_focus',
        'goety:chilling_focus',
        'goety:poison_dart_focus',
        'goety:earth_punch_focus',
        'goety:water_whip_focus',
        'goety:water_jet_focus',
        'goety:thunderbolt_focus',
        'goety:updraft_focus',
        'goety:pulverize_focus',
        'goety:cushion_focus',
        'goety:command_focus',
        'goety:steaming_focus',
        'goety:glow_light_focus',
        'goety:mauling_focus',
        'goety:hunting_focus',
        'goety:prisma_beam_focus',
        'goety:burrowing_focus',
        'goety:electrocute_focus',
        'goety:soul_heal_focus',
        'goety:bulwark_focus',
        'goety:grapple_focus',
        'goety:tunnel_focus',
        'goety:ender_chest_focus',
        'goety:barricade_focus',
        'goety:arrow_rain_focus'
    ], commonVanillaValuables.concat([
        'minecraft:book', 'minecraft:dispenser', 'minecraft:piston', 'minecraft:shield',
        'minecraft:tnt', '#forge:gunpowder', '#forge:rods/blaze', '#forge:ender_pearls',
        '#forge:gems/quartz', '#forge:ingots/iron', 'goety:magic_emerald', 'goety:cursed_bars',
        'goety:mystic_core', 'goety:empty_focus'
    ]), BC_MAGIC_T4)

    // Formal depth III: Creo is the Create-era formal-motion crossing.
     bcMagicGateOutputs(event, [
        'ars_creo:starbuncle_wheel'
    ], commonVanillaValuables.concat(['create:water_wheel']), '#kubejs:formal_magic/proof/epic')

    // Formal depth V: Énergistique is the post-AE2 Source-network capstone.
     bcMagicGateOutputs(event, [
        'arseng:me_source_jar',
        'arseng:source_acceptor',
        'arseng:source_cell_housing',
        'arseng:portable_source_cell_64k',
        'arseng:portable_source_cell_256k'
    ], commonVanillaValuables.concat([
        '#forge:ingots/iron', 'minecraft:book', 'minecraft:paper',
        'ars_nouveau:manipulation_essence', 'ars_nouveau:source_gem_block',
        'ae2:cell_component_64k', 'ae2:cell_component_256k'
    ]), '#kubejs:formal_magic/proof/legendary')

    // Hard removals for normal-logistics bypasses from magic-adjacent systems.
     bcMagicRemoveOutputs(event, [
        'bloodmagic:teleposer',
        'vampirism:crossbow_arrow_teleport'
    ])
})
