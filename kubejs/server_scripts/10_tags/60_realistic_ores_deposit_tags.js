// Deposit source tags for Realistic Ores. These tags are consumed by TCon, Create,
// and Acid Vat recipe generators.

var BTM_DEPOSIT_SOURCE_BLOCKS = {
    coal_measures: ['realisticores:coal_measures', 'realisticores:deepslate_coal_measures'],
    ironstone: ['realisticores:ironstone', 'realisticores:deepslate_ironstone'],
    copper_sulfide: ['realisticores:copper_sulfide_ore', 'realisticores:deepslate_copper_sulfide_ore'],
    tin: ['realisticores:tin_ore', 'realisticores:deepslate_tin_ore'],
    zinc: ['realisticores:zinc_ore', 'realisticores:deepslate_zinc_ore'],
    lead_zinc_vein: ['realisticores:lead_zinc_vein', 'realisticores:deepslate_lead_zinc_vein'],
    quartz_vein: ['realisticores:quartz_vein', 'realisticores:deepslate_quartz_vein'],
    bauxite_laterite: ['realisticores:bauxite_laterite', 'realisticores:deepslate_bauxite_laterite']
}

function btmAddDepositTags(event) {
    for (var id in BTM_DEPOSIT_SOURCE_BLOCKS) {
        var tag = 'kubejs:deposit_blocks/' + id
        var blocks = BTM_DEPOSIT_SOURCE_BLOCKS[id]
        for (var i = 0; i < blocks.length; i++) event.add(tag, blocks[i])
    }
}

ServerEvents.tags('item', function (event) { btmAddDepositTags(event) })
ServerEvents.tags('block', function (event) { btmAddDepositTags(event) })
