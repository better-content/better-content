var BC_QUARANTINE_POLICY = JsonIO.read('kubejs/config/quarantined_items.json') || { schema: '', items: [] }
if (BC_QUARANTINE_POLICY.schema !== 'bc.quarantined_items.v1') {
    console.warn('[KubeJS] Ignoring unsupported quarantine manifest schema: ' + BC_QUARANTINE_POLICY.schema)
    BC_QUARANTINE_POLICY = { schema: 'bc.quarantined_items.v1', items: [] }
}

var BC_CHEMLIB_FORM_POLICY = JsonIO.read('kubejs/config/chemlib_form_policy.json') || { hidden_gas_buckets: [], hidden_forms: [], hidden_compounds: [] }

var BC_HIDDEN_ITEMS = (BC_QUARANTINE_POLICY.items || [])
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_gas_buckets || [])
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_forms || [])
    .concat(BC_CHEMLIB_FORM_POLICY.hidden_compounds || [])

function bcHideRegisteredItems(event) {
    BC_HIDDEN_ITEMS.forEach(function (item) {
        try {
            if (Item.exists(item)) event.hide(item)
        } catch (ignored) {}
    })
}

JEIEvents.hideItems(function (event) {
    bcHideRegisteredItems(event)
})

if (Platform.isLoaded('emi') && typeof EMIEvents !== 'undefined') {
    EMIEvents.hideItems(function (event) {
        bcHideRegisteredItems(event)
    })
}
