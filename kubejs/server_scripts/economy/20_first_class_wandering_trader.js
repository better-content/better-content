// First-class wandering traders: themed, coin-only stock with curated Wares and Font-map integrations.

var BC_WT_THEME_TAG = 'better_content_fixes:wandering_trader_theme'
var BC_WT_VALID_THEMES = { naturalist: true, surveyor: true, quartermaster: true, antiquarian: true }
var BC_WT_COINS = {}
var BC_WT_COIN_ITEMS = {}
var BC_WT_COIN_CATALOGUE = global.BC_COIN_TIERS || []
for (var bcWtCoinIndex = 0; bcWtCoinIndex < BC_WT_COIN_CATALOGUE.length; bcWtCoinIndex++) {
    BC_WT_COINS[BC_WT_COIN_CATALOGUE[bcWtCoinIndex].id] = BC_WT_COIN_CATALOGUE[bcWtCoinIndex].item
    BC_WT_COIN_ITEMS[BC_WT_COIN_CATALOGUE[bcWtCoinIndex].item] = true
}

// Row shape: [coin tier, cost, output item, output count, max uses, xp].
var BC_WT_MARKETS = {
    naturalist: {
        common: [
            [
                ['copper', 2, 'minecraft:oak_sapling', 4, 8, 2],
                ['copper', 3, 'minecraft:jungle_sapling', 4, 8, 2],
                ['copper', 4, 'minecraft:mangrove_propagule', 2, 6, 3],
                ['copper', 4, 'minecraft:cherry_sapling', 2, 6, 3]
            ],
            [
                ['copper', 2, 'minecraft:sugar_cane', 8, 8, 2],
                ['copper', 3, 'minecraft:bamboo', 16, 8, 2],
                ['copper', 2, 'minecraft:brown_mushroom', 8, 8, 2],
                ['copper', 4, 'minecraft:glow_berries', 8, 6, 3]
            ],
            [
                ['copper', 3, 'minecraft:blue_orchid', 4, 8, 2],
                ['copper', 3, 'minecraft:cornflower', 4, 8, 2],
                ['copper', 4, 'minecraft:spore_blossom', 2, 4, 6],
                ['copper', 3, 'minecraft:pink_petals', 8, 6, 4]
            ],
            [
                ['copper', 3, 'minecraft:moss_block', 8, 8, 2],
                ['copper', 4, 'minecraft:big_dripleaf', 2, 6, 3],
                ['copper', 3, 'minecraft:sea_pickle', 4, 8, 2],
                ['zinc', 4, 'minecraft:mycelium', 8, 6, 4]
            ],
            [
                ['iron', 4, 'minecraft:honeycomb', 8, 8, 8],
                ['iron', 4, 'minecraft:honey_bottle', 4, 8, 8],
                ['iron', 5, 'minecraft:slime_ball', 8, 8, 8],
                ['iron', 5, 'minecraft:rabbit_foot', 2, 6, 8]
            ]
        ],
        rare: [
            ['brass', 6, 'minecraft:cod_bucket', 1, 3, 12],
            ['gold', 6, 'minecraft:axolotl_bucket', 1, 2, 16],
            ['gold', 6, 'minecraft:torchflower_seeds', 2, 3, 18],
            ['gold', 7, 'minecraft:sniffer_egg', 1, 1, 22]
        ]
    },
    surveyor: {
        common: [
            [
                ['zinc', 2, 'minecraft:clay', 8, 8, 4],
                ['zinc', 3, 'minecraft:mud', 16, 8, 4],
                ['zinc', 3, 'minecraft:terracotta', 16, 8, 4],
                ['zinc', 3, 'minecraft:red_sand', 24, 8, 4]
            ],
            [
                ['zinc', 3, 'minecraft:calcite', 16, 8, 4],
                ['zinc', 3, 'minecraft:tuff', 24, 8, 4],
                ['zinc', 3, 'minecraft:dripstone_block', 16, 8, 4],
                ['iron', 5, 'minecraft:blue_ice', 8, 4, 8]
            ],
            [
                ['zinc', 3, 'minecraft:lantern', 4, 8, 4],
                ['zinc', 4, 'minecraft:soul_lantern', 4, 8, 4],
                ['zinc', 4, 'minecraft:campfire', 2, 8, 4],
                ['zinc', 5, 'minecraft:soul_campfire', 2, 6, 6]
            ],
            [
                ['iron', 5, 'minecraft:scaffolding', 32, 8, 8],
                ['iron', 4, 'minecraft:chain', 16, 8, 8],
                ['iron', 6, 'minecraft:lead', 4, 6, 8],
                ['brass', 6, 'create:super_glue', 1, 4, 14]
            ],
            [
                ['iron', 5, 'create:track', 32, 5, 12],
                ['brass', 5, 'minecraft:compass', 1, 4, 12],
                ['gold', 5, 'minecraft:spyglass', 1, 3, 16],
                ['brass', 5, 'minecraft:clock', 1, 4, 12]
            ]
        ],
        rare: [
            ['gold', 6, 'minecraft:recovery_compass', 1, 2, 18],
            ['gold', 7, 'create:linked_controller', 1, 2, 18],
            ['gold', 6, 'additionalweaponry:wrench', 1, 3, 16],
            ['gold', 6, 'create:copper_diving_helmet', 1, 2, 16]
        ]
    },
    quartermaster: {
        common: [
            [
                ['iron', 6, 'minecraft:saddle', 1, 4, 8],
                ['iron', 6, 'minecraft:lead', 4, 6, 8],
                ['iron', 5, 'minecraft:name_tag', 1, 4, 8],
                ['iron', 5, 'minecraft:bell', 1, 4, 8]
            ],
            [
                ['brass', 5, 'minecraft:ender_pearl', 2, 6, 12],
                ['brass', 5, 'minecraft:magma_cream', 4, 6, 12],
                ['brass', 4, 'minecraft:glowstone_dust', 12, 8, 12],
                ['brass', 4, 'minecraft:quartz', 16, 8, 12]
            ],
            [
                ['brass', 5, 'minecraft:clock', 1, 4, 12],
                ['brass', 5, 'minecraft:compass', 1, 4, 12],
                ['gold', 5, 'minecraft:spyglass', 1, 3, 16],
                ['gold', 6, 'minecraft:recovery_compass', 1, 2, 18]
            ],
            [
                ['brass', 6, 'create:super_glue', 1, 4, 14],
                ['gold', 6, 'create:copper_diving_boots', 1, 2, 16],
                ['gold', 6, 'create:copper_diving_helmet', 1, 2, 16],
                ['gold', 6, 'additionalweaponry:wrench', 1, 3, 16]
            ],
            [
                ['gold', 5, 'minecraft:blaze_rod', 4, 4, 16],
                ['gold', 5, 'minecraft:ghast_tear', 2, 4, 16],
                ['gold', 6, 'minecraft:phantom_membrane', 2, 4, 18],
                ['gold', 6, 'minecraft:echo_shard', 1, 3, 18]
            ]
        ],
        rare: [
            ['platinum', 8, 'pneumaticcraft:night_vision_upgrade', 1, 1, 24],
            ['platinum', 8, 'minecraft:shulker_shell', 1, 2, 22],
            ['platinum', 7, 'minecraft:totem_of_undying', 1, 1, 24],
            ['gold', 6, 'minecraft:heart_of_the_sea', 1, 2, 18]
        ]
    },
    antiquarian: {
        common: [
            [
                ['brass', 5, 'minecraft:music_disc_13', 1, 2, 12],
                ['brass', 5, 'minecraft:music_disc_cat', 1, 2, 12],
                ['gold', 5, 'minecraft:music_disc_otherside', 1, 2, 16],
                ['gold', 5, 'minecraft:music_disc_5', 1, 2, 16]
            ],
            [
                ['gold', 6, 'minecraft:angler_pottery_sherd', 1, 2, 18],
                ['gold', 6, 'minecraft:archer_pottery_sherd', 1, 2, 18],
                ['gold', 6, 'minecraft:brewer_pottery_sherd', 1, 2, 18],
                ['gold', 6, 'minecraft:miner_pottery_sherd', 1, 2, 18]
            ],
            [
                ['platinum', 7, 'minecraft:coast_armor_trim_smithing_template', 1, 1, 22],
                ['platinum', 7, 'minecraft:dune_armor_trim_smithing_template', 1, 1, 22],
                ['platinum', 7, 'minecraft:ward_armor_trim_smithing_template', 1, 1, 22],
                ['platinum', 7, 'minecraft:wild_armor_trim_smithing_template', 1, 1, 22]
            ],
            [
                ['gold', 6, 'minecraft:torchflower_seeds', 2, 3, 18],
                ['gold', 6, 'minecraft:pitcher_pod', 2, 3, 18],
                ['gold', 6, 'minecraft:echo_shard', 1, 3, 18],
                ['brass', 5, 'minecraft:amethyst_shard', 12, 8, 12]
            ],
            [
                ['iron', 5, 'minecraft:bell', 1, 4, 8],
                ['gold', 5, 'minecraft:spyglass', 1, 3, 16],
                ['brass', 5, 'minecraft:nautilus_shell', 2, 4, 12],
                ['gold', 6, 'minecraft:heart_of_the_sea', 1, 2, 18]
            ]
        ],
        rare: [
            ['platinum', 8, 'minecraft:dragon_head', 1, 1, 28],
            ['platinum', 7, 'minecraft:silence_armor_trim_smithing_template', 1, 1, 24],
            ['platinum', 7, 'minecraft:spire_armor_trim_smithing_template', 1, 1, 22],
            ['gold', 7, 'minecraft:sniffer_egg', 1, 1, 22]
        ]
    }
}

var BC_WT_WARES_REGULAR = null
var BC_WT_WARES_RARE = null
var BC_WT_RANDOM_SOURCE = null
var BC_WT_FORGE_REGISTRIES = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
var BC_WT_ARRAY_LIST = Java.loadClass('java.util.ArrayList')

function bcWtItemExists(id) {
    try { return Item.exists(id) } catch (ignored) { return false }
}

function bcWtTheme(entity) {
    try {
        var id = String(entity.persistentData.getString(BC_WT_THEME_TAG))
        if (BC_WT_VALID_THEMES[id]) return id
    } catch (ignored) {
    }
    return 'naturalist'
}

function bcWtChooseRow(pool, random) {
    var start = random.nextInt(pool.length)
    for (var offset = 0; offset < pool.length; offset++) {
        var row = pool[(start + offset) % pool.length]
        var coin = BC_WT_COINS[row[0]]
        if (coin && bcWtItemExists(coin) && bcWtItemExists(row[2])) return row
    }
    console.error('[first-class-wandering-trader] No valid candidate in themed slot; using safe copper torch stock.')
    return ['copper', 1, 'minecraft:torch', 4, 1, 0]
}

function bcWtApplyRow(offer, entity, random, slot, rare) {
    var market = BC_WT_MARKETS[bcWtTheme(entity)] || BC_WT_MARKETS.naturalist
    var pool = rare ? market.rare : market.common[slot]
    var row = bcWtChooseRow(pool, random)
    var coin = BC_WT_COINS[row[0]] || 'createdeco:copper_coin'
    offer.setFirstInput(Item.of(coin, row[1]))
    offer.setOutput(Item.of(row[2], row[3]))
    offer.setMaxUses(row[4])
    offer.setVillagerExperience(row[5])
    offer.setPriceMultiplier(0.0)
    offer.setRewardExp(false)
}

function bcWtOfferOutputId(offer) {
    if (!offer) return ''
    try {
        var result = offer.getResult ? offer.getResult() : offer.result
        if (result && result.getItem) return String(BC_WT_FORGE_REGISTRIES.ITEMS.getKey(result.getItem()))
        return result ? String(result.id) : ''
    } catch (ignored) {
        return ''
    }
}

function bcWtStackId(stack) {
    if (!stack) return ''
    try {
        if (stack.getItem) return String(BC_WT_FORGE_REGISTRIES.ITEMS.getKey(stack.getItem()))
        return String(stack.id)
    } catch (ignored) {
        return ''
    }
}

function bcWtIsWanderer(merchant) {
    if (!merchant) return false
    try {
        if (merchant.getType) {
            return String(BC_WT_FORGE_REGISTRIES.ENTITY_TYPES.getKey(merchant.getType())) === 'minecraft:wandering_trader'
        }
        return String(merchant.type) === 'minecraft:wandering_trader'
    } catch (ignored) {
        return false
    }
}

function bcWtSingleListing(listing) {
    var listings = new BC_WT_ARRAY_LIST()
    listings.add(listing)
    return listings
}

function bcWtCaptureWaresAgreement(listings) {
    if (!listings) return null
    if (BC_WT_RANDOM_SOURCE == null) {
        BC_WT_RANDOM_SOURCE = Java.loadClass('net.minecraft.util.RandomSource').create()
    }
    for (var i = 0; i < listings.size(); i++) {
        var listing = listings.get(i)
        try {
            if (bcWtOfferOutputId(listing.getOffer(null, BC_WT_RANDOM_SOURCE)) === 'wares:sealed_delivery_agreement') {
                return listing
            }
        } catch (ignored) {
        }
    }
    return null
}

function bcWtAddAgreement(event, entity) {
    var rare = bcWtTheme(entity) === 'antiquarian'
    var listing = rare ? BC_WT_WARES_RARE : BC_WT_WARES_REGULAR
    if (listing == null) {
        console.error('[first-class-wandering-trader] Wares agreement listing is unavailable.')
        return
    }
    var offer = event.addRandomOffer(bcWtSingleListing(listing))
    if (!offer) return
    offer['morejs$setFirstInput'](Item.of(BC_WT_COINS.copper || 'createdeco:copper_coin', rare ? 12 : 6))
    offer['morejs$setMaxUses'](1)
    offer['morejs$setPriceMultiplier'](0.0)
    offer['morejs$setRewardExp'](false)
}

function bcWtAddFontMap(event) {
    try {
        var trades = Java.loadClass('com.bettercontent.dimensiondrink.trade.DimensionalFontMapTrades')
        var listing = trades.wanderingTraderListing(0)
        event.addRandomOffer(bcWtSingleListing(listing))
    } catch (error) {
        console.error('[first-class-wandering-trader] Dimension Drink Font-map listing is unavailable: ' + error)
    }
}

if (typeof MoreJSEvents !== 'undefined') {
    MoreJSEvents.wandererTrades(function (event) {
        BC_WT_WARES_REGULAR = bcWtCaptureWaresAgreement(event.getTrades(1))
        BC_WT_WARES_RARE = bcWtCaptureWaresAgreement(event.getTrades(2))

        event.removeVanillaTrades(1)
        event.removeVanillaTrades(2)
        event.removeModdedTrades(1)
        event.removeModdedTrades(2)

        for (var slot = 0; slot < 5; slot++) {
            (function (capturedSlot) {
                event.addCustomTrade(1, function (offer, entity, random) {
                    bcWtApplyRow(offer, entity, random, capturedSlot, false)
                })
            })(slot)
        }
        event.addCustomTrade(2, function (offer, entity, random) {
            bcWtApplyRow(offer, entity, random, 0, true)
        })
    })

    MoreJSEvents.updateWandererOffers(function (event) {
        if (!event.isWanderer()) return
        bcWtAddAgreement(event, event.entity)
        bcWtAddFontMap(event)
    })

    MoreJSEvents.playerStartTrading(function (event) {
        var merchant = event.merchant
        if (!bcWtIsWanderer(merchant)) return
        event.forEachOffers(function (offer, index) {
            try {
                var first = offer['morejs$getFirstInput']()
                var second = offer['morejs$getSecondInput']()
                var firstId = bcWtStackId(first)
                var secondId = bcWtStackId(second)
                if (!BC_WT_COIN_ITEMS[firstId] || (secondId && secondId !== 'minecraft:air')) {
                    offer['morejs$setDisabled'](true)
                    console.error('[first-class-wandering-trader] Disabled residual non-coin offer #' + index + '.')
                }
            } catch (error) {
                console.error('[first-class-wandering-trader] Could not inspect offer #' + index + ': ' + error)
            }
        })
    })
} else {
    console.error('[first-class-wandering-trader] MoreJS is unavailable; themed trades were not registered.')
}
