// priority: 0
ServerEvents.recipes(event => {
    console.log('[kubejs] >>> LOADER VERSION ACTIVE (ZZ_ingot_rewrites_loader.js) <<<');

    const IRON   = 'minecraft:iron_ingot';
    const COPPER = 'minecraft:copper_ingot';
    const BRASS  = 'create:brass_ingot';

    function apply(list, fromItem, toItem, label) {
        if (!list) list = [];
        console.log(`[kubejs] ${label}: ${list.length} recipe ids`);
        for (let i = 0; i < Math.min(5, list.length); i++) {
            console.log(`[kubejs]   ${label}[${i}] = ${list[i]}`);
        }
        for (let i = 0; i < list.length; i++) {
            const id = ('' + list[i]).trim();
            if (id) event.replaceInput({ id: id }, fromItem, toItem);
        }
    }

    const cfg = JsonIO.read('kubejs/config/input_rewrites.json');
    console.log('[kubejs] cfg loaded keys = ' + Object.keys(cfg || {}));

    // Legacy steel rewrites are intentionally disabled. The expert progression now
    // gates machine families through tiered casings instead of becoming a steel pack.
    console.log('[kubejs] iron/copper->steel rewrites disabled by casing progression pass');
    apply(cfg && cfg.brassFromIron,   IRON,   BRASS, 'iron->brass');
    apply(cfg && cfg.brassFromCopper, COPPER, BRASS, 'copper->brass');
});
