// Circuit assembly authority.
//
// Upstream processes can prepare wafers, boards, traces, and primitive logic,
// but the finished circuit item should come off the PNCR assembly laser/drill.

function btmCircuitExists(id) {
    try { return Item.exists(id) } catch (e) { return false }
}

function btmCircuitIngredient(input) {
    if (input.charAt(0) === '#') return { tag: input.substring(1) }
    return { item: input }
}

function btmCircuitAssembly(event, program, id, input, output, count) {
    if (!btmCircuitExists(input) || !btmCircuitExists(output)) return
    event.remove({ output: output })
    event.custom({
        type: 'pneumaticcraft:assembly_' + program,
        input: btmCircuitIngredient(input),
        program: program,
        result: {
            item: output,
            count: count || 1
        }
    }).id('kubejs:circuit_authority/pncr_assembly/' + id)
}

ServerEvents.recipes(function (event) {
    btmCircuitAssembly(event, 'drill', 'pneumaticcraft_printed_circuit_board', 'pneumaticcraft:unassembled_pcb', 'pneumaticcraft:printed_circuit_board', 1)
    btmCircuitAssembly(event, 'laser', 'powergrid_integrated_circuit', 'powergrid:incomplete_circuit', 'powergrid:integrated_circuit', 1)
    btmCircuitAssembly(event, 'laser', 'oc2r_circuit_board', 'pneumaticcraft:printed_circuit_board', 'oc2r:circuit_board', 1)

    btmCircuitAssembly(event, 'laser', 'create_new_age_blank_circuit', 'powergrid:integrated_circuit', 'create_new_age:blank_circuit', 1)
    btmCircuitAssembly(event, 'drill', 'create_new_age_copper_circuit', 'create_new_age:blank_circuit', 'create_new_age:copper_circuit', 1)

    btmCircuitAssembly(event, 'laser', 'ae2_logic_processor', 'ae2:printed_logic_processor', 'ae2:logic_processor', 1)
    btmCircuitAssembly(event, 'laser', 'ae2_calculation_processor', 'ae2:printed_calculation_processor', 'ae2:calculation_processor', 1)
    btmCircuitAssembly(event, 'laser', 'ae2_engineering_processor', 'ae2:printed_engineering_processor', 'ae2:engineering_processor', 1)
})
