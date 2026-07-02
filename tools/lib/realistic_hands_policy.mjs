export const HAND_TOOL = 'hand'
export const CANONICAL_TOOLS = ['knife', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword']
export const ALL_TOOL_KEYS = [HAND_TOOL, ...CANONICAL_TOOLS]

export const ITEM_TOOL_TAGS = {
  knife: [
    'forge:tools/knives',
    'forge:knives',
    'c:tools/knives',
    'c:knives',
    'farmersdelight:tools/knives',
    'forge:tools/shears',
    'c:tools/shears',
    'forge:tools/scythes',
    'c:tools/scythes'
  ],
  axe: ['minecraft:axes', 'forge:tools/axes', 'forge:axes'],
  pickaxe: ['minecraft:pickaxes', 'forge:tools/pickaxes', 'forge:pickaxes'],
  shovel: ['minecraft:shovels', 'forge:tools/shovels', 'forge:shovels'],
  hoe: ['minecraft:hoes', 'forge:tools/hoes', 'forge:hoes'],
  sword: ['minecraft:swords', 'forge:tools/swords', 'forge:swords']
}

export const BLOCK_TOOL_TAGS = {
  axe: 'minecraft:mineable/axe',
  pickaxe: 'minecraft:mineable/pickaxe',
  shovel: 'minecraft:mineable/shovel',
  hoe: 'minecraft:mineable/hoe',
  sword: 'minecraft:sword_efficient'
}

const KNIFE_BLOCK_TAGS = [
  'minecraft:crops',
  'minecraft:flowers',
  'minecraft:leaves',
  'minecraft:replaceable',
  'minecraft:saplings'
]

const LEGACY_TOOL_ORDER = ['knife', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword', 'hand']

const HAND_EXACT_IDS = new Set([
  'minecraft:sand',
  'minecraft:red_sand',
  'minecraft:gravel',
  'minecraft:dirt',
  'minecraft:coarse_dirt',
  'minecraft:grass_block',
  'minecraft:mycelium',
  'minecraft:podzol',
  'minecraft:rooted_dirt',
  'minecraft:mud',
  'minecraft:soul_sand',
  'minecraft:suspicious_gravel',
  'minecraft:suspicious_sand'
])

const SWORD_EXACT_IDS = new Set([
  'minecraft:cobweb',
  'minecraft:web',
  'minecraft:tripwire'
])

const PICKAXE_EXACT_IDS = new Set([
  'minecraft:bell',
  'minecraft:loom',
  'minecraft:lever',
  'minecraft:rail',
  'minecraft:redstone_torch',
  'minecraft:redstone_wall_torch',
  'minecraft:soul_torch',
  'minecraft:soul_wall_torch',
  'minecraft:torch',
  'minecraft:wall_torch',
  'ars_nouveau:rune',
  'fallout_wastelands_:cage',
  'fallout_wastelands_:oven',
  'fallout_wastelands_:pipe',
  'quark:pipe',
  'swem:shop'
])

const UNEARTHED_PICKAXE_IDS = new Set([
  'unearthed:beige_limestone_grassy_regolith',
  'unearthed:conglomerate_grassy_regolith',
  'unearthed:dolomite_grassy_regolith',
  'unearthed:gabbro_grassy_regolith',
  'unearthed:granodiorite_grassy_regolith',
  'unearthed:grey_limestone_grassy_regolith',
  'unearthed:kimberlite_grassy_regolith',
  'unearthed:limestone_grassy_regolith',
  'unearthed:mudstone_grassy_regolith',
  'unearthed:overgrown_andesite',
  'unearthed:overgrown_diorite',
  'unearthed:overgrown_granite',
  'unearthed:phyllite_grassy_regolith',
  'unearthed:quartzite_grassy_regolith',
  'unearthed:rhyolite_grassy_regolith',
  'unearthed:sandstone_grassy_regolith',
  'unearthed:siltstone_grassy_regolith',
  'unearthed:slate_grassy_regolith',
  'unearthed:stone_grassy_regolith',
  'unearthed:white_granite_grassy_regolith',
  'unearthed:white_granite_regolith'
])

const SOIL_KEYWORDS = [
  'sand',
  'gravel',
  'dirt',
  'mud',
  'regolith',
  'loam',
  'silt',
  'soil',
  'sediment',
  'grassy_',
  'grass_block',
  'mycelium',
  'podzol'
]

const PLANT_KEYWORDS = [
  'flower',
  'sapling',
  'leaves',
  'leaf',
  'vine',
  'vines',
  'crop',
  'crops',
  'grass',
  'fern',
  'bush',
  'shrub',
  'reed',
  'cane',
  'root',
  'roots',
  'moss',
  'petal',
  'petals',
  'berry',
  'bloom',
  'blossom',
  'mushroom',
  'fungus',
  'fungi',
  'pod',
  'pods',
  'thatch',
  'fiber',
  'fibers',
  'fibres',
  'plant',
  'plants',
  'flora',
  'weed',
  'herb',
  'cocoon',
  'nipa'
]

const PLANT_EXCLUSIONS = [
  'grass_block',
  'grassy_',
  'glass',
  'grass_path',
  'path',
  'pressure_plate',
  'planter',
  'planter_box'
]

const WOOD_KEYWORDS = [
  'log',
  'wood',
  'plank',
  'branch',
  'crate',
  'ladder',
  'barrel',
  'chest',
  'bookshelf',
  'scaffold',
  'trapdoor',
  'door',
  'fence',
  'fence_gate',
  'sign',
  'hanging_sign',
  'button',
  'boat',
  'raft',
  'beam',
  'post'
]

const SHOVEL_KEYWORDS = [
  'path',
  'powder',
  'slush',
  'dust',
  'ash',
  'soot',
  'mulch',
  'peat',
  'compost',
  'snow',
  'concrete_powder'
]

const HOE_KEYWORDS = [
  'farmland',
  'tilled',
  'cultivated',
  'fertile_soil',
  'rich_soil',
  'garden_soil'
]

const PICKAXE_KEYWORDS = [
  'glass',
  'pane',
  'brick',
  'bricks',
  'tile',
  'tiles',
  'ore',
  'machine',
  'engine',
  'gearbox',
  'casing',
  'metal',
  'steel',
  'iron',
  'copper',
  'bronze',
  'gold',
  'silver',
  'tin',
  'lead',
  'nickel',
  'uranium',
  'stone',
  'deepslate',
  'andesite',
  'granite',
  'diorite',
  'basalt',
  'slate',
  'limestone',
  'marble',
  'gabbro',
  'rhyolite',
  'quartzite',
  'dolomite',
  'kimberlite',
  'obsidian',
  'concrete',
  'terracotta',
  'ceramic',
  'lantern',
  'torch',
  'altar',
  'pedestal',
  'relay',
  'sourcelink',
  'turret',
  'sensor'
]

function localName(id) {
  return String(id).includes(':') ? String(id).split(':').slice(1).join(':') : String(id)
}

function namespace(id) {
  return String(id).includes(':') ? String(id).split(':')[0] : 'minecraft'
}

function sortUnique(values) {
  return [...new Set(values.filter(Boolean).map(String))].sort()
}

function hasRuntimeTag(record, tag) {
  return Array.isArray(record?.runtimeTags) && record.runtimeTags.includes(tag)
}

function hasToolAction(record, action) {
  return Array.isArray(record?.toolActions) && record.toolActions.includes(action)
}

function inTagEvidence(tagEvidence, kind, tag, id) {
  const bucket = kind === 'item' ? tagEvidence?.itemMembers : tagEvidence?.blockMembers
  return Array.isArray(bucket?.[tag]) && bucket[tag].includes(id)
}

function keywordMatch(name, keywords) {
  return keywords.some((keyword) => name.includes(keyword))
}

function isPotted(name) {
  return name.startsWith('potted_') || name.includes('_potted_')
}

function isWebLike(name) {
  return name.includes('cobweb') || name === 'web' || name.endsWith('_web') || name.includes('webbing')
}

function isLooseSurface(name) {
  if (HAND_EXACT_IDS.has(`minecraft:${name}`)) return true
  if (keywordMatch(name, SOIL_KEYWORDS)) return true
  return false
}

function isWorkedSoil(name) {
  return keywordMatch(name, HOE_KEYWORDS)
}

function isLooseShovelSurface(name) {
  return keywordMatch(name, SHOVEL_KEYWORDS)
}

function isWoodLike(name) {
  return keywordMatch(name, WOOD_KEYWORDS)
}

function isPlantLike(name) {
  if (isPotted(name)) return true
  if (PLANT_EXCLUSIONS.some((keyword) => name.includes(keyword))) return false
  return keywordMatch(name, PLANT_KEYWORDS)
}

function isPickaxeLike(name) {
  return keywordMatch(name, PICKAXE_KEYWORDS)
}

function legacyToolForId(id, legacyAssignments, kind) {
  const groups = legacyAssignments?.[kind] || {}
  for (const tool of LEGACY_TOOL_ORDER) {
    if (groups[tool]?.has(id)) return tool
  }
  return null
}

function makeAssignment(tools, stage, source, detail, outcome = 'default') {
  return {
    tools: sortUnique(tools),
    origin: `${stage}:${source}`,
    detail,
    outcome
  }
}

function classifyBlock(record, tagEvidence, legacyAssignments) {
  const id = String(record.id)
  const name = localName(id)

  if (UNEARTHED_PICKAXE_IDS.has(id)) return makeAssignment(['pickaxe'], 'override', 'exact', 'grass-over-stone regolith stays stone-routed')
  if (id === 'dynamictrees:rooty_gravel') return makeAssignment(['hand'], 'override', 'exact', 'primitive loose rooty gravel')
  if (namespace(id) === 'excavated_variants' && name.startsWith('gravel_')) return makeAssignment(['shovel'], 'override', 'gravel-ore-family', 'gravel-substrate ore stays loose-earth routed')
  if (HAND_EXACT_IDS.has(id)) return makeAssignment(['hand'], 'override', 'exact', 'primitive loose surface')
  if (SWORD_EXACT_IDS.has(id) || isWebLike(name)) return makeAssignment(['sword'], 'override', 'web-family', 'preserve-cut soft surface', 'sword_preserve_web')
  if (PICKAXE_EXACT_IDS.has(id)) return makeAssignment(['pickaxe'], 'override', 'exact', 'explicit non-loose utility block')

  if (isPotted(name)) return makeAssignment(['knife'], 'delegation', 'potted-plants', 'potted plant family', 'knife_transform_organics')
  if (isWorkedSoil(name)) return makeAssignment(['hoe'], 'delegation', 'cultivated-soil', 'cultivated or farm-worked surface')
  if (isWoodLike(name)) return makeAssignment(['axe'], 'delegation', 'wood-products', 'logs, branches, planks, or wood products')
  if (isPlantLike(name)) {
    const outcome = name.includes('grass') || name.includes('reed') || name.includes('cane')
      ? 'knife_transform_fiber'
      : 'knife_transform_organics'
    return makeAssignment(['knife'], 'delegation', 'organics', 'plants, leaves, vines, crops, pods, or small organics', outcome)
  }
  if (isLooseSurface(name)) return makeAssignment(['hand'], 'delegation', 'loose-earth', 'sand, gravel, dirt, mud, regolith, or similar loose earth')
  if (isLooseShovelSurface(name)) return makeAssignment(['shovel'], 'delegation', 'loose-worked-earth', 'loose non-hand earth surface')

  for (const tag of KNIFE_BLOCK_TAGS) {
    if (hasRuntimeTag(record, tag) || inTagEvidence(tagEvidence, 'block', tag, id)) {
      const outcome = tag === 'minecraft:leaves' ? 'knife_extra_sticks' : 'knife_transform_organics'
      return makeAssignment(['knife'], 'inference', `block-tag:${tag}`, 'runtime or authored tag evidence', outcome)
    }
  }

  for (const tool of ['axe', 'pickaxe', 'shovel', 'hoe', 'sword']) {
    const tag = BLOCK_TOOL_TAGS[tool]
    if (tag && (hasRuntimeTag(record, tag) || inTagEvidence(tagEvidence, 'block', tag, id))) {
      const outcome = tool === 'sword' ? 'sword_preserve_web' : 'default'
      return makeAssignment([tool], 'inference', `block-tag:${tag}`, 'runtime or authored mining tag evidence', outcome)
    }
  }

  const legacy = legacyToolForId(id, legacyAssignments, 'blocks')
  if (legacy) {
    const tool = legacy === 'hand' ? 'pickaxe' : legacy
    const detail = legacy === 'hand' ? 'legacy hand evidence upgraded to solid-block default' : 'legacy assignment carried forward'
    return makeAssignment([tool], 'inference', `legacy:${legacy}`, detail)
  }

  if (isPickaxeLike(name)) return makeAssignment(['pickaxe'], 'heuristic', 'solid-default', 'stone, glass, metal, machine, or solid utility keyword')
  return makeAssignment(['pickaxe'], 'heuristic', 'catchall-solid', 'residual solid/default classification')
}

function classifyItem(record, tagEvidence, legacyAssignments) {
  const id = String(record.id)
  const name = localName(id)

  const itemTagOrder = ['knife', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword']
  for (const tool of itemTagOrder) {
    for (const tag of ITEM_TOOL_TAGS[tool] || []) {
      if (inTagEvidence(tagEvidence, 'item', tag, id)) {
        return makeAssignment([tool], 'delegation', `item-tag:${tag}`, 'authored item tag delegation')
      }
    }
  }

  if (hasToolAction(record, 'axe')) return makeAssignment(['axe'], 'inference', 'tool-action:axe', 'runtime tool action evidence')
  if (hasToolAction(record, 'pickaxe')) return makeAssignment(['pickaxe'], 'inference', 'tool-action:pickaxe', 'runtime tool action evidence')
  if (hasToolAction(record, 'shovel')) return makeAssignment(['shovel'], 'inference', 'tool-action:shovel', 'runtime tool action evidence')
  if (hasToolAction(record, 'hoe')) return makeAssignment(['hoe'], 'inference', 'tool-action:hoe', 'runtime tool action evidence')
  if (hasToolAction(record, 'sword')) return makeAssignment(['sword'], 'inference', 'tool-action:sword', 'runtime tool action evidence')

  if (name.includes('knife') || name.includes('shears') || name.includes('shear') || name.includes('scythe') || name.includes('sickle')) {
    return makeAssignment(['knife'], 'heuristic', 'blade-cutters', 'knife-equivalent cutter family')
  }
  if (name.includes('pickaxe') || name.endsWith('_pick')) return makeAssignment(['pickaxe'], 'heuristic', 'name', 'pickaxe name heuristic')
  if (name.includes('shovel') || name.includes('spade')) return makeAssignment(['shovel'], 'heuristic', 'name', 'shovel name heuristic')
  if (name.includes('hoe')) return makeAssignment(['hoe'], 'heuristic', 'name', 'hoe name heuristic')
  if (name.includes('axe') || name.includes('hatchet') || name.includes('adze')) return makeAssignment(['axe'], 'heuristic', 'name', 'axe name heuristic')
  if (name.includes('sword') || name.includes('blade')) return makeAssignment(['sword'], 'heuristic', 'name', 'sword name heuristic')

  const legacy = legacyToolForId(id, legacyAssignments, 'items')
  if (legacy) return makeAssignment([legacy], 'inference', `legacy:${legacy}`, 'legacy assignment carried forward')
  return null
}

export function compileRealisticHands({ blockRecords, itemRecords, tagEvidence, legacyAssignments, input, runtimeProbeSchema }) {
  const blockAssignments = {}
  const itemAssignments = {}
  const blocksByTool = Object.fromEntries(ALL_TOOL_KEYS.map((tool) => [tool, []]))
  const itemsByTool = Object.fromEntries(CANONICAL_TOOLS.map((tool) => [tool, []]))

  for (const record of blockRecords) {
    const assignment = classifyBlock(record, tagEvidence, legacyAssignments)
    if (!assignment) continue
    blockAssignments[record.id] = assignment
    for (const tool of assignment.tools) {
      if (blocksByTool[tool]) blocksByTool[tool].push(record.id)
    }
  }

  for (const record of itemRecords) {
    const assignment = classifyItem(record, tagEvidence, legacyAssignments)
    if (!assignment) continue
    itemAssignments[record.id] = assignment
    for (const tool of assignment.tools) {
      if (itemsByTool[tool]) itemsByTool[tool].push(record.id)
    }
  }

  const assignedBlockIds = new Set(Object.keys(blockAssignments))
  const unassignedBreakableBlocks = sortUnique(blockRecords.filter((record) => !assignedBlockIds.has(record.id)).map((record) => record.id))

  const originCounts = {}
  for (const assignment of Object.values(blockAssignments)) {
    originCounts[assignment.origin] = (originCounts[assignment.origin] || 0) + 1
  }

  const outcomeFamilies = {
    knife_transform_fiber: sortUnique(Object.entries(blockAssignments)
      .filter(([, assignment]) => assignment.outcome === 'knife_transform_fiber')
      .map(([id]) => id)),
    knife_transform_organics: sortUnique(Object.entries(blockAssignments)
      .filter(([, assignment]) => assignment.outcome === 'knife_transform_organics')
      .map(([id]) => id)),
    knife_extra_sticks: sortUnique(Object.entries(blockAssignments)
      .filter(([, assignment]) => assignment.outcome === 'knife_extra_sticks')
      .map(([id]) => id)),
    sword_preserve_web: sortUnique(Object.entries(blockAssignments)
      .filter(([, assignment]) => assignment.outcome === 'sword_preserve_web')
      .map(([id]) => id))
  }

  return {
    schema: 'obelisks.realistic_hands.assignments.v1',
    generatedBy: 'tools/audit_realistic_hands.mjs',
    input,
    runtimeProbeSchema,
    blockCount: blockRecords.length,
    itemCount: itemRecords.length,
    blocks: Object.fromEntries(Object.entries(blocksByTool).map(([tool, values]) => [tool, sortUnique(values)])),
    items: Object.fromEntries(Object.entries(itemsByTool).map(([tool, values]) => [tool, sortUnique(values)])),
    blockAssignments,
    itemAssignments,
    outcomeFamilies,
    originCounts,
    unassignedBreakableBlocks
  }
}

export function summarizeRepresentativeSeparation(assignments) {
  const knifeSet = new Set(assignments.blocks?.knife || [])
  const swordSet = new Set(assignments.blocks?.sword || [])
  return {
    knifeGrass: knifeSet.has('projectvibrantjourneys:short_grass'),
    knifeLeaves: knifeSet.has('minecraft:oak_leaves'),
    swordCobweb: swordSet.has('minecraft:cobweb'),
    swordTripwire: swordSet.has('minecraft:tripwire')
  }
}

export function isAllowedHandFamily(id) {
  const name = localName(id)
  return HAND_EXACT_IDS.has(String(id)) || isLooseSurface(name)
}

export function isPlayerFacingExempt(id, exemptions) {
  const value = String(id)
  const name = localName(value)
  return (exemptions.exactIds || []).includes(value) ||
    (exemptions.namespaces || []).includes(namespace(value)) ||
    (exemptions.pathPrefixes || []).some((prefix) => name.startsWith(prefix)) ||
    (exemptions.pathSuffixes || []).some((suffix) => name.endsWith(suffix)) ||
    (exemptions.pathContains || []).some((needle) => name.includes(needle))
}
