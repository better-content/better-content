ServerEvents.recipes(function (event) {
    var INGOT_TAGS = ['c:ingots', 'forge:ingots']
    var NUGGET_TAGS = ['c:nuggets', 'forge:nuggets']
    var BLOCK_TAGS = ['c:storage_blocks', 'forge:storage_blocks']

    function matchesAnyTag(itemId, tags) {
        var stack = Item.of(itemId)
        for (var i = 0; i < tags.length; i++) {
            if (Ingredient.of('#' + tags[i]).test(stack)) {
                return true
            }
        }
        return false
    }

    function ingredientMatchesAnyTag(ingredientJson, tags) {
        if (!ingredientJson) return false

            if (ingredientJson.tag) {
                for (var i = 0; i < tags.length; i++) {
                    if (ingredientJson.tag === tags[i]) {
                        return true
                    }
                }
            }

            if (ingredientJson.item) {
                return matchesAnyTag(ingredientJson.item, tags)
            }

            return false
    }

    function isNineOfTagToOne(type, inputTags, outputTags) {
        event.forEachRecipe({ type: type }, function (recipe) {
            var json = recipe.json
            if (!json || !json.result || !json.result.item) return

                var resultItem = json.result.item
                var resultCount = json.result.count || 1

                if (resultCount !== 1) return
                    if (!matchesAnyTag(resultItem, outputTags)) return

                        var matched = false

                        if (type === 'minecraft:crafting_shaped') {
                            var pattern = json.pattern || []
                            var key = json.key || {}
                            var count = 0
                            var ok = true

                            for (var r = 0; r < pattern.length; r++) {
                                var row = pattern[r]
                                for (var c = 0; c < row.length; c++) {
                                    var ch = row.charAt(c)
                                    if (ch === ' ') {
                                        ok = false
                                        break
                                    }

                                    var ing = key[ch]
                                    if (!ingredientMatchesAnyTag(ing, inputTags)) {
                                        ok = false
                                        break
                                    }

                                    count++
                                }
                                if (!ok) break
                            }

                            matched = ok && count === 9
                        }

                        if (type === 'minecraft:crafting_shapeless') {
                            var ingredients = json.ingredients || []
                            if (ingredients.length === 9) {
                                matched = true
                                for (var i = 0; i < ingredients.length; i++) {
                                    if (!ingredientMatchesAnyTag(ingredients[i], inputTags)) {
                                        matched = false
                                        break
                                    }
                                }
                            }
                        }

                        if (matched) {
                            console.log('[KubeJS] Removing compression recipe: ' + recipe.getId())
                            event.remove({ id: recipe.getId() })
                        }
        })
    }

    // 9 nuggets -> 1 ingot
    isNineOfTagToOne('minecraft:crafting_shaped', NUGGET_TAGS, INGOT_TAGS)
    isNineOfTagToOne('minecraft:crafting_shapeless', NUGGET_TAGS, INGOT_TAGS)

    // 9 ingots -> 1 block
    isNineOfTagToOne('minecraft:crafting_shaped', INGOT_TAGS, BLOCK_TAGS)
    isNineOfTagToOne('minecraft:crafting_shapeless', INGOT_TAGS, BLOCK_TAGS)
})
