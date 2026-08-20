// Pack-owned progression items/blocks for expert machine casings and manufacturing intermediates.

function bcTitleCase(raw) {
    var words = String(raw).split('_')
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > 0) words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1)
    }
    return words.join(' ')
}

StartupEvents.registry('block', function (event) {
    var casings = global.BC_MACHINE_CASING_TIERS || []
    for (var i = 0; i < casings.length; i++) {
        var path = casings[i].item.substring('kubejs:'.length)
        event.create(path)
            .displayName(casings[i].display)
            .hardness(3.5)
            .resistance(6.0)
            .soundType('metal')
            .requiresTool(true)
    }
})

StartupEvents.registry('fluid', function (event) {
    event.create('phosphoric_acid_fluid')
        .displayName('Phosphoric Acid')
        .thinTexture(0xd8b65a)
        .bucketColor(0xd8b65a)

    event.create('molten_titanium')
        .displayName('Molten Titanium')
        .thickTexture(0xc6ccd2)
        .bucketColor(0xc6ccd2)

    event.create('molten_thorium')
        .displayName('Molten Thorium')
        .thickTexture(0xe4e0c8)
        .bucketColor(0xe4e0c8)
})

StartupEvents.registry('item', function (event) {
    event.create('sky_steel_ingot').displayName('Sky Steel Ingot')
    event.create('sky_steel_sheet').displayName('Sky Steel Sheet')

    var overhaulIntermediates = [
        ['rotational_compressor_core', 'Rotational Compressor Core'],
        ['pressure_seal', 'Pressure Seal'],
        ['seared_service_fitting', 'Seared Service Fitting'],
        ['andesite_utility_frame', 'Andesite Utility Frame'],
        ['brass_control_assembly', 'Brass Control Assembly'],
        ['brass_utility_assembly', 'Brass Utility Assembly'],
        ['airtight_fluid_module', 'Airtight Fluid Module'],
        ['airtight_service_module', 'Airtight Service Module'],
        ['electrical_control_module', 'Electrical Control Module'],
        ['electrical_instrumentation_module', 'Electrical Instrumentation Module'],
        ['space_expedition_kit', 'Space Expedition Kit'],
        ['raw_impossible_storage_matrix', 'Raw Impossible Storage Matrix'],
        ['ae_logic_package', 'AE Logic Package'],
        ['impossible_support_matrix', 'Impossible Support Matrix'],
        ['purified_blood_catalyst', 'Purified Blood Catalyst'],
        ['purified_source_core', 'Purified Source Core'],
        ['living_binding', 'Living Binding'],
        ['mountain_beryl_lens', 'Mountain Beryl Lens'],
        ['corundum_lapping_grit', 'Corundum Lapping Grit'],
        ['kimberlite_diamond_seed', 'Kimberlite Diamond Seed'],
        ['tungsten_carbide_insert', 'Tungsten Carbide Insert'],
        ['titanium_thermal_plate', 'Titanium Thermal Plate'],
        ['soulstone_carbon_matrix', 'Soulstone Carbon Matrix'],
        ['platinum_group_residue', 'Platinum Group Residue']
    ]

    for (var o = 0; o < overhaulIntermediates.length; o++) {
        event.create(overhaulIntermediates[o][0]).displayName(overhaulIntermediates[o][1])
    }

    var processingMedia = [
        ['andesite_grinding_ball', 'Andesite Grinding Ball'],
        ['iron_grinding_ball', 'Iron Grinding Ball'],
        ['brass_grinding_ball', 'Brass Grinding Ball'],
        ['steel_grinding_ball', 'Steel Grinding Ball'],
        ['nickel_grinding_ball', 'Nickel Grinding Ball'],
        ['titanium_grinding_ball', 'Titanium Grinding Ball'],
        ['blood_infused_grinding_ball', 'Blood-Infused Grinding Ball'],
        ['fluix_grinding_ball', 'Fluix Grinding Ball']
    ]

    for (var p = 0; p < processingMedia.length; p++) {
        event.create(processingMedia[p][0]).displayName(processingMedia[p][1])
    }

    var oreIntermediates = [
        ['mineral_tailings', 'Mineral Tailings'],
        ['osmiridium_concentrate', 'Osmiridium Concentrate'],
        ['tungsten_concentrate', 'Tungsten Concentrate'],
        ['titanium_concentrate', 'Titanium Concentrate'],
        ['uranium_concentrate', 'Uranium Concentrate'],
        ['thorium_concentrate', 'Thorium Concentrate'],
        ['vanadium_contact_catalyst', 'Vanadium Contact Catalyst'],
        ['oxygenated_vanadium_contact_catalyst', 'Oxygenated Vanadium Contact Catalyst']
    ]

    for (var oi = 0; oi < oreIntermediates.length; oi++) {
        event.create(oreIntermediates[oi][0]).displayName(oreIntermediates[oi][1])
    }

    var existingOreIntermediates = {}
    for (var eoi = 0; eoi < oreIntermediates.length; eoi++) existingOreIntermediates[oreIntermediates[eoi][0]] = true
    var oreMaterials = global.BC_RO_MATERIALS || []
    for (var omi = 0; omi < oreMaterials.length; omi++) {
        var oreMaterial = oreMaterials[omi]
        var concentrate = oreMaterial.concentrate || ('kubejs:' + oreMaterial.id + '_concentrate')
        var concentratePath = concentrate.substring('kubejs:'.length)
        if (!existingOreIntermediates[concentratePath]) {
            event.create(concentratePath)
                .displayName(oreMaterial.display + ' Concentrate')
        }
        event.create('washed_' + concentratePath)
            .displayName('Washed ' + oreMaterial.display + ' Concentrate')
    }

    event.create('diamond_chip').displayName('Diamond Chip')
    event.create('emerald_chip').displayName('Emerald Chip')
    event.create('amethyst_chip').displayName('Amethyst Chip')

    var magicCuttingFluids = [
        ['sanguine_acetic_cutting_fluid', 'Sanguine Acetic Cutting Fluid', 64],
        ['sanguine_sulfuric_cutting_fluid', 'Sanguine Sulfuric Cutting Fluid', 256],
        ['sanguine_hydrochloric_cutting_fluid', 'Sanguine Hydrochloric Cutting Fluid', 256],
        ['sanguine_nitric_cutting_fluid', 'Sanguine Nitric Cutting Fluid', 1024],
        ['sanguine_phosphoric_cutting_fluid', 'Sanguine Phosphoric Cutting Fluid', 1024]
    ]

    for (var m = 0; m < magicCuttingFluids.length; m++) {
        event.create(magicCuttingFluids[m][0])
            .displayName(magicCuttingFluids[m][1])
            .maxDamage(magicCuttingFluids[m][2])
            .glow(true)
    }

    var reagents = [
        ['mashed_salmonberries', 'Mashed Salmonberries'],
        ['charred_blazing_chili', 'Charred Blazing Chili'],
        ['green_tea_extract', 'Green Tea Extract'],
        ['caffeine_extract', 'Caffeine Extract'],
        ['vision_extract', 'Vision Extract'],
        ['brine_extract', 'Brine Extract'],
        ['rose_hip_extract', 'Rose Hip Extract'],
        ['heatproof_extract', 'Heatproof Extract'],
        ['fermented_pomegranate_extract', 'Fermented Pomegranate Extract'],
        ['toxic_extract', 'Toxic Extract'],
        ['leaping_extract', 'Leaping Extract'],
        ['featherlight_extract', 'Featherlight Extract'],
        ['melon_life_extract', 'Melon Life Extract'],
        ['turtle_guard_extract', 'Turtle Guard Extract'],
        ['weakening_extract', 'Weakening Extract'],
        ['shadow_extract', 'Shadow Extract'],
        ['harm_extract', 'Harm Extract'],
        ['slowness_extract', 'Slowness Extract'],
        ['stabilized_reagent', 'Trip Fuel']
    ]

    for (var r = 0; r < reagents.length; r++) {
        event.create(reagents[r][0]).displayName(reagents[r][1])
    }

})
