// First woodcutting tool route after removing No Tree Punching.
// The Farmer's Delight flint knife is the authored intermediary.

var BTM_PRIMITIVE_FLINT_HAND_AXE = Item.of('tconstruct:hand_axe', '{Damage:0,tic_broken:0b,tic_materials:["tconstruct:flint","tconstruct:wood","tconstruct:string"],tic_modifiers:[{level:1,name:"tconstruct:jagged"},{level:1,name:"tconstruct:cultivated"},{level:1,name:"tconstruct:stringy"},{level:1,name:"tconstruct:stripping"}],tic_persistent:{},tic_stats:{"tconstruct:attack_damage":7.25f,"tconstruct:attack_speed":0.9f,"tconstruct:durability":85.0f,"tconstruct:harvest_tier":"minecraft:stone","tconstruct:mining_speed":3.5f},tic_volatile_data:{abilities:1,upgrades:3}}')

ServerEvents.recipes(function (event) {
    event.shaped(BTM_PRIMITIVE_FLINT_HAND_AXE, [
        'F ',
        'S '
    ], {
        F: 'farmersdelight:flint_knife',
        S: '#forge:rods/wooden'
    }).id('kubejs:primitive/flint_hand_axe')
})
