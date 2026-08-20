// Persistent chunk loading is owned by the magic-gated Arcane Chunk Loader family.
ServerEvents.recipes(function (event) {
    event.remove({ id: 'pneumaticcraft:chunkloader_upgrade' })
})
