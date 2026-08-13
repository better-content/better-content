// Interchangeable early magical proof for the pack-owned chunk-anchor family.
ServerEvents.tags('item', function (event) {
    event.add('arcane_chunk_loaders:magic_catalysts', [
        'ars_nouveau:source_gem',
        'bloodmagic:blankslate',
        'hexerei:blood_sigil',
        'occultism:spirit_attuned_gem',
        'malum:processed_soulstone',
        'goety:magic_emerald',
        'forbidden_arcanus:arcane_crystal',
        'irons_spellbooks:arcane_essence'
    ])
})
