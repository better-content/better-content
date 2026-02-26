// kubejs/server_scripts/tcon_steel_block_casting.js

ServerEvents.recipes(event => {
    const COOLING_TICKS = 15 * 60 * 20 // 15 minutes * 60 sec * 20 tps = 18000
    const IRON_MB = 18 * 144           // 18 ingots worth

    event.recipes.tconstruct
    .casting_basin(
        'tconstruct:steel_block',  // result
        'quark:charcoal_block',    // cast item (consumed)
    Fluid.of('tconstruct:molten_iron', IRON_MB) // input fluid
    )
    .coolingTime(COOLING_TICKS)
})
