// Physical proof that the hand-cranked workshop can regulate continuous power.

StartupEvents.registry('item', function (event) {
    event.create('incomplete_andesite_machine_casing')
        .displayName('Incomplete Andesite Machine Casing')
        .maxStackSize(16)

    event.create('incomplete_workshop_governor')
        .displayName('Incomplete Workshop Governor')
        .maxStackSize(16)

    event.create('workshop_governor')
        .displayName('Workshop Governor')
        .maxStackSize(16)
})
