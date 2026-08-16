// ChemLib full integration routes.
//
// This pass gives guarded element and molecule families process and demand
// roles. Create remains bulk/open processing and PNCR owns sealed pressure and
// thermal control. Material entry stays with exact, independently audited routes.

function bcFullChemExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

var BC_FULL_CHEM_DISSOLVER_TABLE = JsonIO.read('kubejs/config/alchemistry_dissolver_port.json') || { recipes: [] }

function bcFullChemGet(object, key) {
    if (!object || !key) return null
    try {
        if (object.containsKey && !object.containsKey(key)) return null
        if (object.get) return object.get(key)
    } catch (ignored) {}
    try {
        return object[key]
    } catch (ignored2) {
        return null
    }
}

function bcFullChemFluidExists(id) {
    if (id === 'minecraft:water') return true
    try {
        if (typeof Fluid !== 'undefined' && Fluid.exists) return Fluid.exists(id)
    } catch (e) {}
    return BC_FULL_CHEM_KNOWN_FLUIDS[id] === true
}

function bcFullChemIngredientExists(input) {
    if (!input) return false
    if (input.tag || input.fluid) return true
    if (input.item) return bcFullChemExists(input.item)
    return true
}

function bcFullChemAllInputsExist(inputs) {
    for (var i = 0; i < inputs.length; i++) {
        if (!bcFullChemIngredientExists(inputs[i])) return false
    }
    return true
}

function bcFullChemResult(item, count, chance) {
    var result = { item: item }
    if (count && count > 1) result.count = count
    if (chance && chance < 1) result.chance = chance
    return result
}

function bcFullChemSideResults(items) {
    var results = []
    for (var i = 0; i < (items || []).length; i++) {
        var item = items[i]
        if (!bcFullChemExists(item.item)) continue
        results.push(bcFullChemResult(item.item, item.count || 1, item.chance || null))
    }
    return results
}

function bcFullChemExpandCreateInputs(inputs) {
    var expanded = []
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i]
        var copies = input && (input.item || input.tag) ? (input.count || 1) : 1
        for (var copyIndex = 0; copyIndex < copies; copyIndex++) {
            var copy = {}
            for (var key in input) {
                if (key !== 'count') copy[key] = input[key]
            }
            expanded.push(copy)
        }
    }
    return expanded
}

function bcFullChemMix(event, id, inputs, outputs, heat, time) {
    if (!bcFullChemAllInputsExist(inputs)) return
    var results = []
    for (var i = 0; i < outputs.length; i++) {
        var output = outputs[i]
        if (!bcFullChemExists(output.item)) return
        results.push(bcFullChemResult(output.item, output.count || 1, output.chance || null))
    }
    var recipe = {
        type: 'create:mixing',
        ingredients: bcFullChemExpandCreateInputs(inputs),
        results: results,
        processingTime: time || 200
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemlib_full/create_mixing/' + id)
}

function bcFullChemCompact(event, id, inputs, outputs, heat) {
    if (!bcFullChemAllInputsExist(inputs)) return
    var results = []
    for (var i = 0; i < outputs.length; i++) {
        var output = outputs[i]
        if (!bcFullChemExists(output.item)) return
        results.push(bcFullChemResult(output.item, output.count || 1, output.chance || null))
    }
    var recipe = {
        type: 'create:compacting',
        ingredients: bcFullChemExpandCreateInputs(inputs),
        results: results,
        processingTime: 180
    }
    if (heat) recipe.heatRequirement = heat
    event.custom(recipe).id('kubejs:chemlib_full/create_compacting/' + id)
}

function bcFullChemPressure(event, id, inputs, output, pressure) {
    if (!bcFullChemAllInputsExist(inputs) || !bcFullChemExists(output.item)) return
    var pressureInputs = []
    for (var i = 0; i < inputs.length; i++) {
        var mapped = bcFullChemPressureInput(inputs[i])
        if (!mapped) return
        pressureInputs.push(mapped)
    }
    event.custom({
        type: 'pneumaticcraft:pressure_chamber',
        inputs: pressureInputs,
        pressure: pressure,
        results: [bcFullChemResult(output.item, output.count || 1, null)]
    }).id('kubejs:chemlib_full/pncr_pressure/' + id)
}

function bcFullChemPressureInput(input) {
    if (input.type) return input
    if (input.item) return { type: 'pneumaticcraft:stacked_item', item: input.item, count: input.count || 1 }
    return null
}

function bcFullChemGasFluid(id, count) {
    if (!BC_FULL_CHEM_MOLECULE_GASES[id]) return null
    return {
        type: 'pneumaticcraft:fluid',
        fluid: id + '_fluid',
        amount: 250 * (count || 1)
    }
}

function bcFullChemThermoItemInput(input) {
    if (!input || !input.count || input.count <= 1) return input
    return {
        type: 'pneumaticcraft:stacked_item',
        item: input.item,
        count: input.count
    }
}

function bcFullChemThermo(event, id, itemInput, fluidInput, itemOutput, pressure, temp) {
    if (!itemInput || !fluidInput || !bcFullChemExists(itemInput.item) || !bcFullChemExists(itemOutput.item)) return
    event.custom({
        type: 'pneumaticcraft:thermo_plant',
        exothermic: false,
        item_input: bcFullChemThermoItemInput(itemInput),
        fluid_input: fluidInput,
        item_output: itemOutput,
        pressure: pressure || 2.5,
        speed: 0.45,
        temperature: { min_temp: temp || 473 }
    }).id('kubejs:chemlib_full/pncr_thermo/' + id)
}

function bcFullChemCompound(element, suffix) {
    var aliases = BC_FULL_CHEM_COMPOUND_ALIASES[element]
    if (aliases && aliases[suffix]) return aliases[suffix]
    return 'chemlib:' + element + '_' + suffix
}

var BC_FULL_CHEM_KNOWN_FLUIDS = {
    'minecraft:water': true,
    'chemlib:ethanol_fluid': true,
    'chemlib:acetic_acid_fluid': true,
    'chemlib:hydrochloric_acid_fluid': true,
    'chemlib:nitric_acid_fluid': true,
    'chemlib:sulfuric_acid_fluid': true,
    'kubejs:phosphoric_acid_fluid': true,
    'chemlib:oxygen_fluid': true,
    'chemlib:hydrogen_fluid': true,
    'chemlib:chlorine_fluid': true
}

var BC_FULL_CHEM_MOLECULE_GASES = {
    'chemlib:hydrogen': true,
    'chemlib:helium': true,
    'chemlib:nitrogen': true,
    'chemlib:oxygen': true,
    'chemlib:fluorine': true,
    'chemlib:neon': true,
    'chemlib:chlorine': true,
    'chemlib:argon': true,
    'chemlib:krypton': true,
    'chemlib:xenon': true,
    'chemlib:radon': true,
    'chemlib:carbon_dioxide': true,
    'chemlib:ethylene': true,
    'chemlib:ammonium': true,
    'chemlib:methane': true,
    'chemlib:ethane': true,
    'chemlib:propane': true,
    'chemlib:butane': true,
    'chemlib:sulfur_dioxide': true,
    'chemlib:nitrogen_dioxide': true,
    'chemlib:ammonia': true,
    'chemlib:hydrogen_sulfide': true,
    'chemlib:acetylene': true,
    'chemlib:carbon_monoxide': true,
    'chemlib:nitric_oxide': true
}

var BC_FULL_CHEM_COMPOUND_ALIASES = {
    carbon: { oxide: 'chemlib:carbon_dioxide', sulfide: 'chemlib:carbon_disulfide' },
    copper: { oxide: 'chemlib:copper_i_oxide', hydroxide: 'chemlib:copper_ii_hydroxide', sulfate: 'chemlib:copper_ii_sulfate', sulfide: 'chemlib:copper_i_sulfide' },
    iron: { sulfate: 'chemlib:iron_ii_sulfate', nitrate: 'chemlib:iron_iii_nitrate' },
    silicon: { oxide: 'chemlib:silicon_dioxide' }
}

var BC_FULL_CHEM_EXPLICIT_COMPOUNDS = {
    'chemlib:sodium_hydroxide': true,
    'chemlib:calcium_carbonate': true,
    'chemlib:copper_chloride': true,
    'chemlib:copper_nitrate': true,
    'chemlib:arsenic_sulfide': true,
    'chemlib:mercury_sulfide': true,
    'chemlib:carbon_disulfide': true
}

var BC_FULL_CHEM_ELEMENT_GROUPS = [
    { id: 'light_metal', elements: ['aluminum', 'gallium', 'indium', 'thallium'] },
    { id: 'alkali', elements: ['lithium', 'sodium', 'potassium', 'rubidium', 'cesium', 'francium'] },
    { id: 'alkaline', elements: ['beryllium', 'magnesium', 'calcium', 'strontium', 'barium', 'radium'] },
    { id: 'transition', elements: ['scandium', 'titanium', 'vanadium', 'chromium', 'manganese', 'iron', 'cobalt', 'nickel', 'copper', 'zinc'] },
    { id: 'refractory', elements: ['tin', 'zirconium', 'niobium', 'molybdenum', 'hafnium', 'tantalum', 'tungsten', 'rhenium'] },
    { id: 'noble', elements: ['ruthenium', 'rhodium', 'palladium', 'osmium', 'iridium', 'platinum', 'gold', 'silver'] },
    { id: 'rare_earth', elements: ['lanthanum', 'cerium', 'praseodymium', 'neodymium', 'samarium', 'europium', 'gadolinium', 'terbium', 'dysprosium', 'holmium', 'erbium', 'thulium', 'ytterbium', 'lutetium', 'yttrium'] },
    { id: 'chalcophile', elements: ['cadmium', 'mercury', 'lead', 'bismuth', 'arsenic', 'antimony', 'selenium', 'tellurium'] },
    { id: 'radioactive', elements: ['actinium', 'thorium', 'protactinium', 'uranium', 'polonium'] },
    { id: 'biogenic', elements: ['carbon', 'nitrogen', 'oxygen', 'phosphorus', 'sulfur', 'chlorine', 'iodine', 'fluorine', 'silicon'] },
    { id: 'gas', elements: ['hydrogen', 'helium', 'neon', 'argon', 'krypton', 'xenon', 'radon'] }
]

var BC_FULL_CHEM_FAMILIES = [
    { id: 'oxide', suffix: 'oxide', heat: 'heated', pressure: 2.0, temp: 473 },
    { id: 'hydroxide', suffix: 'hydroxide', heat: null, pressure: 2.0, temp: 423 },
    { id: 'carbonate', suffix: 'carbonate', heat: null, pressure: 2.25, temp: 423 },
    { id: 'chloride', suffix: 'chloride', heat: 'heated', pressure: 2.75, temp: 523 },
    { id: 'nitrate', suffix: 'nitrate', heat: 'heated', pressure: 3.25, temp: 573 },
    { id: 'sulfate', suffix: 'sulfate', heat: 'heated', pressure: 3.0, temp: 548 },
    { id: 'sulfide', suffix: 'sulfide', heat: 'heated', pressure: 2.5, temp: 523 },
    { id: 'phosphate', suffix: 'phosphate', heat: 'heated', pressure: 3.0, temp: 548 }
]

// Explicit terminal decisions for produced registrations whose purpose is their
// placed light-emitting block behavior rather than another crafting sink.
var BC_FULL_CHEM_TERMINAL_OUTPUTS = {
    'chemlib:argon_lamp_block': 'functional_light_block',
    'chemlib:helium_lamp_block': 'functional_light_block',
    'chemlib:krypton_lamp_block': 'functional_light_block',
    'chemlib:neon_lamp_block': 'functional_light_block',
    'chemlib:radon_lamp_block': 'functional_light_block',
    'chemlib:xenon_lamp_block': 'functional_light_block'
}

// These loops are authored in the neighboring identity/transformation passes;
// retaining the exact IDs here makes their cross-script ownership explicit.
var BC_FULL_CHEM_EXISTING_LOOPS = [
    'chemlib:beryl',
    'chemlib:iron_disulfide',
    'chemlib:iron_ii_oxide',
    'chemlib:phosphate'
]

var BC_FULL_CHEM_MOLECULES = [
    { id: 'cellulose', item: 'chemlib:cellulose', managedExplicitly: true },
    { id: 'starch', item: 'chemlib:starch', managedExplicitly: true },
    { id: 'sucrose', item: 'chemlib:sucrose', managedExplicitly: true },
    { id: 'ethanol', item: 'chemlib:ethanol' },
    { id: 'acetic_acid', item: 'chemlib:acetic_acid' },
    { id: 'ethylene', item: 'chemlib:ethylene', airtightGas: true },
    { id: 'acetylene', item: 'chemlib:acetylene', airtightGas: true },
    { id: 'methane', item: 'chemlib:methane', airtightGas: true },
    { id: 'propane', item: 'chemlib:propane', airtightGas: true },
    { id: 'butane', item: 'chemlib:butane', airtightGas: true },
    { id: 'carbon_monoxide', item: 'chemlib:carbon_monoxide', airtightGas: true },
    { id: 'carbon_disulfide', item: 'chemlib:carbon_disulfide', managedExplicitly: true },
    { id: 'ammonia', item: 'chemlib:ammonia', airtightGas: true },
    { id: 'ammonium', item: 'chemlib:ammonium', airtightGas: true },
    { id: 'ammonium_chloride', item: 'chemlib:ammonium_chloride', managedExplicitly: true },
    { id: 'diammonium_phosphate', item: 'chemlib:diammonium_phosphate', managedExplicitly: true },
    { id: 'hydrogen_sulfide', item: 'chemlib:hydrogen_sulfide', airtightGas: true },
    { id: 'sulfur_dioxide', item: 'chemlib:sulfur_dioxide', airtightGas: true },
    { id: 'sulfur_trioxide', item: 'chemlib:sulfur_trioxide', managedExplicitly: true },
    { id: 'nitric_oxide', item: 'chemlib:nitric_oxide', airtightGas: true },
    { id: 'nitrogen_dioxide', item: 'chemlib:nitrogen_dioxide', airtightGas: true },
    { id: 'polyvinyl_chloride', item: 'chemlib:polyvinyl_chloride', managedExplicitly: true }
]

// Formula adjacency is retained below as audit context only. A registered
// dissolver composition does not prove a bounded industrial synthesis route.
// Material-specific recipes must be reviewed and registered explicitly.
var BC_FULL_CHEM_FORMULA_ROUTES_ENABLED = false

function bcFullChemFormulaFor(compound) {
    var recipes = bcFullChemGet(BC_FULL_CHEM_DISSOLVER_TABLE, 'recipes') || []
    for (var i = 0; i < recipes.length; i++) {
        var row = recipes[i]
        var input = bcFullChemGet(row, 'input')
        if (bcFullChemGet(input, 'item') === compound) return bcFullChemGet(row, 'results') || []
    }
    return []
}

function bcFullChemFormulaComponent(source) {
    var item = bcFullChemGet(source, 'item')
    if (!item || !bcFullChemExists(item)) return null
    return { item: item, count: bcFullChemGet(source, 'count') || 1 }
}

function bcFullChemRegisterFormulaCompound(event, elementItem, family, compound) {
    var formula = bcFullChemFormulaFor(compound)
    if (!formula.length) return

    var itemInputs = []
    var gasInputs = []
    for (var i = 0; i < formula.length; i++) {
        var component = bcFullChemFormulaComponent(formula[i])
        if (!component) return
        if (BC_FULL_CHEM_MOLECULE_GASES[component.item]) gasInputs.push(component)
        else itemInputs.push(component)
    }

    if (gasInputs.length === 0) {
        bcFullChemMix(event, 'compound/' + elementItem.substring(8) + '/' + family.id,
            itemInputs, [{ item: compound }], family.heat, 220)
        return
    }

    if (gasInputs.length === 1 && itemInputs.length === 1) {
        bcFullChemThermo(event, 'compound/' + elementItem.substring(8) + '/' + family.id,
            itemInputs[0], bcFullChemGasFluid(gasInputs[0].item, gasInputs[0].count),
            { item: compound }, family.pressure, family.temp)
        return
    }

    // Sulfate formulas are metal + S + 4O. One sulfuric-acid unit supplies
    // the exact S/O vector while excess hydrogen is safely discarded.
    if (family.id === 'sulfate' && gasInputs.length === 1 && gasInputs[0].item === 'chemlib:oxygen') {
        var metal = null
        for (var j = 0; j < itemInputs.length; j++) {
            if (itemInputs[j].item === elementItem) metal = itemInputs[j]
        }
        if (metal) {
            bcFullChemThermo(event, 'compound/' + elementItem.substring(8) + '/' + family.id,
                metal, {
                    type: 'pneumaticcraft:fluid',
                    fluid: 'chemlib:sulfuric_acid_fluid',
                    amount: 250
                }, { item: compound }, family.pressure, family.temp)
        }
    }
}

function bcFullChemRegisterElement(event, group, element) {
    if (!BC_FULL_CHEM_FORMULA_ROUTES_ENABLED) return
    var elementItem = 'chemlib:' + element
    if (!bcFullChemExists(elementItem)) return

    if (BC_FULL_CHEM_MOLECULE_GASES[elementItem]) return

    for (var f = 0; f < BC_FULL_CHEM_FAMILIES.length; f++) {
        var family = BC_FULL_CHEM_FAMILIES[f]
        if (family.id === 'oxide' && (element === 'carbon' || element === 'silicon')) continue
        var compound = bcFullChemCompound(element, family.suffix)
        if (!bcFullChemExists(compound) || BC_FULL_CHEM_EXPLICIT_COMPOUNDS[compound]) continue
        bcFullChemRegisterFormulaCompound(event, elementItem, family, compound)

    }

}

function bcFullChemRegisterMolecule(event, molecule) {
    if (!bcFullChemExists(molecule.item)) return
    if (molecule.airtightGas || molecule.managedExplicitly) return
    if (molecule.outputs && molecule.outputs.length > 0) {
         bcFullChemMix(event, 'molecule/use/' + molecule.id + '/' + molecule.process, [{ item: molecule.item }], molecule.outputs, null, 180)
    }
}

ServerEvents.recipes(function (event) {
    for (var g = 0; g < BC_FULL_CHEM_ELEMENT_GROUPS.length; g++) {
        var group = BC_FULL_CHEM_ELEMENT_GROUPS[g]
        for (var e = 0; e < group.elements.length; e++) {
             bcFullChemRegisterElement(event, group, group.elements[e])
        }
    }

    for (var m = 0; m < BC_FULL_CHEM_MOLECULES.length; m++) {
         bcFullChemRegisterMolecule(event, BC_FULL_CHEM_MOLECULES[m])
    }

})
