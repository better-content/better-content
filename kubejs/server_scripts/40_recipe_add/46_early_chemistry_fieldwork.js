// Bounded chemistry fieldwork before Seared/Create machinery.
// The catalog records accepted routes and rejected guardrails so this teaser
// cannot silently expand into a second chemistry progression branch.

ServerEvents.recipes(function (event) {
    var catalog = JsonIO.read('kubejs/config/early_chemistry_routes.json')
    if (!catalog || !catalog.routes) return

    function addAuthored(authored) {
        if (!authored || !authored.id || !authored.json) return
        event.custom(authored.json).id(authored.id)
    }

    for (var i = 0; i < catalog.routes.length; i++) {
        var route = catalog.routes[i]
        if (route.verdict !== 'accepted') continue
        if (route.requires_mod && !Platform.isLoaded(route.requires_mod)) continue
        addAuthored(route.authored)
        if (route.additional_authored) {
            for (var j = 0; j < route.additional_authored.length; j++) {
                addAuthored(route.additional_authored[j])
            }
        }
    }
})
