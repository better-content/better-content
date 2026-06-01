#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const repo = process.cwd()
const full = rel => path.join(repo, rel)
const read = rel => fs.readFileSync(full(rel), 'utf8')
const readJson = rel => JSON.parse(read(rel))

const dumpRoot = 'generated/runtime-dumps/kubejs-config'
const outputRoot = 'generated/validation'

const hardPrefixRejects = [
  'ae2:',
  'advanced_ae:',
  'ars_nouveau:',
  'pneumaticcraft:',
  'bloodmagic:',
  'chemlib:',
  'createbigcannons:',
  'k_turrets:',
  'tconstruct:',
  'wares:',
  'protection_pixel:',
  'sophisticatedbackpacks:',
  'sophisticatedstorage:'
]

const hardExactRejects = new Set([
  'create:track',
  'create:track_station',
  'create:controller_rail',
  'create:precision_mechanism',
  'minecraft:tnt',
  'minecraft:tnt_minecart',
  'minecraft:flint_and_steel',
  'minecraft:gunpowder',
  'minecraft:fire_charge',
  'minecraft:water_bucket',
  'minecraft:lava_bucket',
  'minecraft:emerald',
  'minecraft:emerald_block',
  'minecraft:golden_carrot',
  'minecraft:golden_apple',
  'minecraft:bone_meal',
  'minecraft:redstone_torch',
  'minecraft:note_block',
  'minecraft:chest_minecart',
  'minecraft:hopper_minecart',
  'minecraft:furnace_minecart',
  'farmersdelight:flint_knife',
  'tconstruct:hand_axe',
  'quark:seed_pouch',
  'minecraft:bucket'
])

const hardPatternRejects = [
  /(^|:)stripped_/,
  /(^|:).*(log|wood|planks)$/,
  /(^|:).*(pickaxe|_axe|shovel|hoe|sword|knife|hammer|saw|mattock|excavator)$/,
  /(^|:).*(helmet|chestplate|leggings|boots)$/,
  /(^|:).*(chest|barrel|crate|basket|backpack|pouch|sack|satchel|bundle)$/,
  /(^|:).*(controller|machine|casing|gearbox|motor|engine|generator|reactor|turbine|processor|circuit|chip|coil|dynamo|pump|pipe|duct|tube|cable|wire|terminal|drive|cell|battery|capacitor|module|upgrade|propeller|water_wheel|cogwheel)$/,
  /(^|:).*(ingot|nugget|plate|sheet|gear|rod|wire|dust|gem|crystal|alloy|slate|orb)$/,
  /(^|:).*(spell|wand|staff|ritual|rune|altar|pedestal|source_jar|blood_orb)$/,
  /(^|:).*(gunpowder|explosive|blast|fuse)/,
  /(^|:)coin_(diamond|emerald|gold|netherite|amethyst)/,
  /(^|:).*redstone/,
  /(^|:).*(spawn_egg|creative|debug|command)/
]

const starterExceptions = new Set([
  'create:copper_diving_helmet',
  'create:copper_diving_boots'
])

const roleMatchers = [
  ['Food', /(food|meal|stew|soup|pie|cake|bread|toast|apple|berry|carrot|potato|onion|cabbage|tomato|rice|mushroom|seed|panicle|crop|tea|coffee|juice|beer|vodka|wine)/],
  ['Water', /(water|canteen|waterskin|bowl|cup|diving|snorkel)/],
  ['Camp', /(torch|lantern|candle|campfire|charcoal|match|bedroll)/],
  ['Route', /(map|compass|spyglass|rope|lead|saddle|rail|minecart|glider|boat|cart|waystone|signpost|calendar|clock)/],
  ['Trade', /(coin|emerald|voucher|note)/],
  ['Blasting', /(gunpowder|fire_charge|blast|explosive|fuse)/],
  ['Material', /(paper|string|leather|clay|brick|flint|bone|feather|wool|hide)/]
]

function idLooksReal(value) {
  return typeof value === 'string' && /^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(value) && !value.startsWith('forge:')
}

function addStat(map, item, field, recipe) {
  if (!idLooksReal(item)) return
  if (!map.has(item)) {
    map.set(item, {
      item,
      inputRecipeCount: 0,
      outputRecipeCount: 0,
      mentionedRecipeCount: 0,
      inputTypes: new Set(),
      outputTypes: new Set(),
      recipes: new Set()
    })
  }
  const stat = map.get(item)
  stat.recipes.add(recipe.id)
  if (field === 'input') {
    stat.inputRecipeCount++
    stat.inputTypes.add(recipe.type)
  } else if (field === 'output') {
    stat.outputRecipeCount++
    stat.outputTypes.add(recipe.type)
  } else {
    stat.mentionedRecipeCount++
  }
}

function collectRecipeItems(value, recipe, map, pathParts = []) {
  if (value == null) return
  const key = pathParts.at(-1) || ''
  if (typeof value === 'string') {
    if (!idLooksReal(value)) return
    if (key === 'item') {
      const parentKey = pathParts.at(-2) || ''
      const asOutput = /result|output|outputs|results|secondary|byproduct/.test(parentKey)
      addStat(map, value, asOutput ? 'output' : 'input', recipe)
    } else if (/result|output|outputs|results/.test(key)) {
      addStat(map, value, 'output', recipe)
    } else if (/ingredient|input|tool|base|addition|template|pattern/.test(key)) {
      addStat(map, value, 'input', recipe)
    } else {
      addStat(map, value, 'mention', recipe)
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((entry, i) => collectRecipeItems(entry, recipe, map, [...pathParts, String(i)]))
    return
  }
  if (typeof value === 'object') {
    for (const [nextKey, nextValue] of Object.entries(value)) {
      collectRecipeItems(nextValue, recipe, map, [...pathParts, nextKey])
    }
  }
}

function loadRecipes() {
  const manifest = readJson(`${dumpRoot}/full_recipe_index_manifest.json`)
  const recipes = []
  for (let i = 0; i < manifest.chunkCount; i++) {
    const name = `full_recipe_index_${String(i).padStart(4, '0')}.json`
    for (const recipe of readJson(`${dumpRoot}/${name}`).recipes) {
      try {
        recipe.parsed = JSON.parse(recipe.json)
        recipes.push(recipe)
      } catch (error) {
        recipes.push({ ...recipe, parseError: error.message })
      }
    }
  }
  return recipes
}

function roleFor(item) {
  const local = item.split(':')[1]
  for (const [role, pattern] of roleMatchers) {
    if (pattern.test(local)) return role
  }
  return 'Other'
}

function rejectionReasons(item, extra = {}) {
  const reasons = []
  const isException = starterExceptions.has(item)
  for (const prefix of hardPrefixRejects) {
    if (item.startsWith(prefix)) reasons.push(`prefix ${prefix}`)
  }
  if (hardExactRejects.has(item)) reasons.push('exact hard reject')
  for (const pattern of hardPatternRejects) {
    if (!isException && pattern.test(item)) reasons.push(`pattern ${pattern.source}`)
  }
  if (extra.functionalBlocks?.has(item)) reasons.push('functional crafting/processing block')
  return reasons
}

function candidateScore(stat, item) {
  const role = roleFor(item)
  let score = 0
  if (role !== 'Other') score += 4
  score += Math.min(6, stat.inputRecipeCount / 3)
  score += Math.min(3, stat.outputRecipeCount / 6)
  if (stat.inputRecipeCount > 0 && stat.outputRecipeCount > 0) score += 2
  if (['Food', 'Water', 'Camp', 'Route', 'Trade', 'Blasting'].includes(role)) score += 3
  if (item.startsWith('minecraft:')) score += 1
  if (item.startsWith('farmersdelight:') || item.startsWith('farmersrespite:') || item.startsWith('brewinandchewin:')) score += 1
  return score
}

function loadFunctionalBlocks() {
  const out = new Set()
  const file = 'generated/runtime-dumps/crafting-relevant-functional-blocks.tsv'
  if (!fs.existsSync(full(file))) return out
  for (const line of read(file).split(/\r?\n/).slice(1)) {
    const id = line.split('\t')[0]
    if (idLooksReal(id)) out.add(id)
  }
  return out
}

function loadProgressionItems(recipes, itemStats) {
  const out = new Set()
  const file = `${dumpRoot}/progression_recipe_mentions.json`
  if (!fs.existsSync(full(file))) return out
  const byId = new Map(recipes.map(recipe => [recipe.id, recipe]))
  for (const recipeList of Object.values(readJson(file))) {
    for (const ref of recipeList) {
      const recipe = byId.get(ref.id)
      if (!recipe) continue
      const before = new Set(itemStats.keys())
      collectRecipeItems(recipe.parsed, recipe, itemStats)
      for (const item of itemStats.keys()) {
        if (!before.has(item)) out.add(item)
      }
    }
  }
  return out
}

function starterItems() {
  const embark = readJson('config/classselector/embark.json')
  const kits = readJson('config/classselector/kits.json')
  const items = []
  for (const entry of embark.items || []) items.push({ source: `embark:${entry.id}`, ...entry })
  for (const kit of kits || []) {
    for (const entry of kit.items || []) items.push({ source: `kit:${kit.id}`, ...entry })
  }
  return { embark, kits, items }
}

function summarizeSets(set, max = 8) {
  return [...set].sort().slice(0, max)
}

const recipes = loadRecipes()
const itemStats = new Map()
for (const recipe of recipes) {
  if (recipe.parsed) collectRecipeItems(recipe.parsed, recipe, itemStats)
}

const functionalBlocks = loadFunctionalBlocks()
const progressionScratch = new Map()
const progressionItems = loadProgressionItems(recipes, progressionScratch)
const starters = starterItems()

const currentStarterAudit = starters.items.map(entry => {
  const stat = itemStats.get(entry.item) || {
    inputRecipeCount: 0,
    outputRecipeCount: 0,
    mentionedRecipeCount: 0,
    inputTypes: new Set(),
    outputTypes: new Set(),
    recipes: new Set()
  }
  const reasons = rejectionReasons(entry.item, { functionalBlocks, progressionItems })
  return {
    source: entry.source,
    item: entry.item,
    category: entry.category || 'Kit',
    count: entry.count,
    cost: entry.cost || null,
    role: roleFor(entry.item),
    inputRecipeCount: stat.inputRecipeCount,
    outputRecipeCount: stat.outputRecipeCount,
    sampleInputTypes: summarizeSets(stat.inputTypes),
    sampleOutputTypes: summarizeSets(stat.outputTypes),
    progressionRecipeParticipant: progressionItems.has(entry.item),
    rejectionReasons: reasons
  }
})

const candidatePool = [...itemStats.values()]
  .map(stat => ({
    ...stat,
    role: roleFor(stat.item),
    score: candidateScore(stat, stat.item),
    progressionRecipeParticipant: progressionItems.has(stat.item),
    rejectionReasons: rejectionReasons(stat.item, { functionalBlocks, progressionItems })
  }))
  .filter(stat => stat.role !== 'Other')
  .filter(stat => stat.role !== 'Material')
  .filter(stat => stat.rejectionReasons.length === 0)
  .filter(stat => stat.inputRecipeCount + stat.outputRecipeCount >= 2)
  .sort((a, b) => b.score - a.score || b.inputRecipeCount - a.inputRecipeCount || a.item.localeCompare(b.item))

const byRole = {}
for (const candidate of candidatePool) {
  byRole[candidate.role] ||= []
  if (byRole[candidate.role].length < 20) {
    byRole[candidate.role].push({
      item: candidate.item,
      score: Number(candidate.score.toFixed(2)),
      inputRecipeCount: candidate.inputRecipeCount,
      outputRecipeCount: candidate.outputRecipeCount,
      sampleInputTypes: summarizeSets(candidate.inputTypes, 5),
      sampleOutputTypes: summarizeSets(candidate.outputTypes, 5)
    })
  }
}

const starterRejects = currentStarterAudit.filter(entry => entry.rejectionReasons.length > 0)
const starterSummary = {
  embarkItems: starters.embark.items.length,
  embarkQuota: starters.embark.pointQuota,
  kitCount: starters.kits.length,
  starterStacks: starters.items.length,
  rejectedStarterEntries: starterRejects.length
}

const report = {
  generatedBy: 'tools/audit_starting_item_economy.mjs',
  source: {
    recipeDump: dumpRoot,
    recipeCount: recipes.length,
    starterConfigs: ['config/classselector/embark.json', 'config/classselector/kits.json']
  },
  summary: starterSummary,
  currentStarterAudit,
  candidateRoles: byRole,
  notes: [
    'Candidate scoring is advisory. Hard rejects are progression-safety rules, not balance decisions.',
    'Progression recipe participation is reported as context, but not automatically rejected; common support items such as torches and compasses appear in progression-adjacent recipes without being progression keys.',
    'Recipe graph depth counts recipe participation, so high-score items still need design review before becoming starter options.'
  ]
}

fs.mkdirSync(full(outputRoot), { recursive: true })
fs.writeFileSync(full(`${outputRoot}/starting_item_economy_audit.json`), JSON.stringify(report, null, 2) + '\n')

const md = []
md.push('# Starting Item Economy Audit')
md.push('')
md.push(`Recipes scanned: ${recipes.length}`)
md.push(`Embark options: ${starterSummary.embarkItems} at quota ${starterSummary.embarkQuota}`)
md.push(`Fallback kits: ${starterSummary.kitCount}`)
md.push(`Starter entries audited: ${starterSummary.starterStacks}`)
md.push(`Rejected starter entries: ${starterSummary.rejectedStarterEntries}`)
md.push('')
if (starterRejects.length) {
  md.push('## Starter Safety Findings')
  for (const entry of starterRejects) {
    md.push(`- ${entry.source} ${entry.item}: ${entry.rejectionReasons.join(', ')}`)
  }
  md.push('')
}
md.push('## Current Starter Roles')
for (const entry of currentStarterAudit) {
  const progressionNote = entry.progressionRecipeParticipant ? '; progression-adjacent recipe participant' : ''
  md.push(`- ${entry.source} ${entry.item}: ${entry.role}; inputs ${entry.inputRecipeCount}, outputs ${entry.outputRecipeCount}${progressionNote}`)
}
md.push('')
md.push('## Interesting Safe Candidate Pool')
for (const role of Object.keys(byRole).sort()) {
  md.push(`### ${role}`)
  for (const candidate of byRole[role].slice(0, 12)) {
    md.push(`- ${candidate.item}: score ${candidate.score}, inputs ${candidate.inputRecipeCount}, outputs ${candidate.outputRecipeCount}`)
  }
}
md.push('')
md.push('## Conclusion')
md.push('The current starter pool is mostly support economy rather than production economy. The safest expansion space is route, hydration, light, food variety, animal routing, and low-value trade. Machine surfaces, storage, tools, raw metals, casing/circuit materials, ready explosives, and magic or network starters are rejected.')
fs.writeFileSync(full(`${outputRoot}/starting_item_economy_audit.md`), md.join('\n') + '\n')

console.log(`scanned ${recipes.length} recipes`)
console.log(`starter entries: ${starterSummary.starterStacks}; rejected: ${starterSummary.rejectedStarterEntries}`)
console.log(`wrote ${outputRoot}/starting_item_economy_audit.json`)
console.log(`wrote ${outputRoot}/starting_item_economy_audit.md`)
if (starterRejects.length) process.exitCode = 1
