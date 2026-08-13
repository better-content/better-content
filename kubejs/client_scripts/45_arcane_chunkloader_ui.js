JEIEvents.hideItems(function (event) {
    event.hide([
        'pneumaticcraft:chunkloader_upgrade',
        'ae2:debug_chunk_loader'
    ])
})

ItemEvents.tooltip(function (event) {
    var descriptions = {
        'arcane_chunk_loaders:flux_chunk_anchor': 'Buffers Forge Energy (FE/RF) from any side.',
        'arcane_chunk_loaders:kinetic_chunk_anchor': 'Buffers Create rotational work from its vertical shaft.',
        'arcane_chunk_loaders:source_chunk_anchor': 'Accepts Source through the Ars Nouveau source interface.',
        'arcane_chunk_loaders:lifeforce_chunk_anchor': 'Accepts Blood Magic life essence fluid from any side.',
        'arcane_chunk_loaders:pressure_chunk_anchor': 'Accepts PneumaticCraft air through pressure tubes.',
        'arcane_chunk_loaders:soul_chunk_anchor': 'Sneak-use with an empty hand to transfer Goety soul energy.',
        'arcane_chunk_loaders:spirit_chunk_anchor': 'Use Malum spirits on the anchor or insert them automatically.',
        'arcane_chunk_loaders:aureal_chunk_anchor': 'Sneak-use with an empty hand to transfer Aureal.'
    }
    Object.keys(descriptions).forEach(function (id) {
        event.add(id, [
            Text.gray(descriptions[id]),
            Text.darkPurple('Loads and ticks the centered 3x3 chunk area.'),
            Text.gray('A redstone signal disables loading without stopping charging.')
        ])
    })
})
