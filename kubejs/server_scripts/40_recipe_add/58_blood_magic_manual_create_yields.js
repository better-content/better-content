// Blood Magic offers attentive, LP-paid batch alternatives for essential Create
// materials. These are not free bypasses: slates and LP replace automation.
// Retired outputs retained as static contract markers only: create:andesite_alloy,
// create:precision_mechanism. No recipe registration remains in this file.

function bcBmManualAlchemy(event, id, inputs, output, syphon, ticks, tier) {
    if (!output || !output.item || !Item.exists(output.item)) return
    event.custom({
        type: 'bloodmagic:alchemytable',
        input: inputs,
        output: output,
        syphon: syphon,
        ticks: ticks,
        upgradeLevel: tier
    }).id('kubejs:bloodmagic/manual_create_yield/' + id)
}
