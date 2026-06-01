#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const repo = process.cwd()
const inputPath = process.argv[2] || path.join(repo, 'generated/runtime-dumps/block_hardness_probe.json')
const outputJsonPath = process.argv[3] || path.join(repo, 'generated/runtime-dumps/ntp_breakability_audit.json')
const outputMdPath = outputJsonPath.replace(/\.json$/i, '.md')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
}

function namespaceOf(id) {
  return String(id).includes(':') ? String(id).split(':')[0] : 'minecraft'
}

function pathOf(id) {
  return String(id).includes(':') ? String(id).split(':')[1] : String(id)
}

function has(tags, tag) {
  return Array.isArray(tags) && tags.includes(tag)
}

function isLeaf(id) {
  const p = pathOf(id)
  return p.includes('leaves') || p.includes('leaf')
}

function isLooseSurface(id) {
  const p = pathOf(id)
  return p === 'gravel' || p === 'sand' || p === 'red_sand' || p.includes('gravel') || p.endsWith('_sand')
}

function isSurfacePlant(id) {
  const p = pathOf(id)
  return p === 'grass' ||
    p === 'short_grass' ||
    p === 'tall_grass' ||
    p === 'fern' ||
    p === 'large_fern' ||
    p === 'dead_bush' ||
    p === 'sugar_cane' ||
    p === 'cactus' ||
    p === 'bamboo' ||
    p === 'bamboo_sapling' ||
    p === 'vine' ||
    p === 'cave_vines' ||
    p === 'cave_vines_plant' ||
    p === 'glow_lichen' ||
    p.includes('grass') ||
    p.includes('fern') ||
    p.includes('flower') ||
    p.includes('bush') ||
    p.includes('shrub') ||
    p.includes('reed') ||
    p.includes('vine')
}

function classify(record) {
  if (record.ntpr) return record.ntpr

  const tags = record.runtimeTags || record.miningTags || []
  const surfacePlant = isSurfacePlant(record.id)
  const leaf = isLeaf(record.id)
  const looseSurface = isLooseSurface(record.id)
  const handTag = has(tags, 'kubejs:hand_breakable')
  const toolCategories = []

  if (has(tags, 'minecraft:mineable/axe')) toolCategories.push('axe')
  if (has(tags, 'minecraft:mineable/pickaxe')) toolCategories.push('pickaxe')
  if (has(tags, 'minecraft:mineable/shovel')) toolCategories.push('shovel')
  if (has(tags, 'minecraft:mineable/hoe')) toolCategories.push('hoe')
  if (has(tags, 'minecraft:sword_efficient')) toolCategories.push('sword')

  return {
    surfacePlant,
    leaf,
    looseSurface,
    handBreakable: !surfacePlant && !leaf && (handTag || looseSurface),
    knifeOnly: surfacePlant || leaf,
    toolCategories: surfacePlant || leaf ? [] : toolCategories,
    denyRiskWithoutMatchingTool: !surfacePlant && !leaf && !handTag && !looseSurface && toolCategories.length === 0
  }
}

function countByNamespace(records) {
  const counts = new Map()
  for (const r of records) counts.set(namespaceOf(r.id), (counts.get(namespaceOf(r.id)) || 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([namespace, count]) => ({ namespace, count }))
}

function sample(records, limit = 40) {
  return records.slice(0, limit).map((r) => ({
    id: r.id,
    defaultDestroyTime: r.defaultDestroyTime,
    defaultStateDestroySpeed: r.defaultStateDestroySpeed,
    requiresCorrectToolForDrops: r.requiresCorrectToolForDrops,
    miningTags: r.miningTags || [],
    ntpr: classify(r)
  }))
}

if (!fs.existsSync(inputPath)) {
  console.error(`Missing runtime probe dump: ${inputPath}`)
  console.error('Enable kubejs/config/block_hardness_probe.json with writeAllBlocks=true, then restart or /reload first.')
  process.exit(1)
}

const dump = readJson(inputPath)
const records = (dump.allBlocks && dump.allBlocks.length ? dump.allBlocks : dump.selectedBlocks || [])
  .filter((r) => r && !r.missing)

const breakableRecords = records.filter((r) => Number(r.defaultDestroyTime) >= 0)
const denyRisk = breakableRecords.filter((r) => classify(r).denyRiskWithoutMatchingTool)
const positiveHardness = denyRisk.filter((r) => Number(r.defaultDestroyTime) > 0)
const zeroHardness = denyRisk.filter((r) => Number(r.defaultDestroyTime) === 0)

const audit = {
  schema: 'obelisks.ntp_breakability_audit.v2',
  generatedBy: 'tools/audit_ntp_breakability.mjs',
  input: path.relative(repo, inputPath),
  runtimeProbeSchema: dump.schema || null,
  totals: {
    runtimeBlockRecords: records.length,
    breakableRuntimeBlockRecords: breakableRecords.length,
    denyRisk: denyRisk.length,
    positiveHardnessDenyRisk: positiveHardness.length,
    zeroHardnessDenyRisk: zeroHardness.length
  },
  denyRiskByNamespace: countByNamespace(denyRisk),
  positiveHardnessDenyRiskByNamespace: countByNamespace(positiveHardness),
  samples: {
    positiveHardnessDenyRisk: sample(positiveHardness),
    zeroHardnessDenyRisk: sample(zeroHardness)
  },
  denyRisk: denyRisk.map((r) => ({
    id: r.id,
    namespace: namespaceOf(r.id),
    defaultDestroyTime: r.defaultDestroyTime,
    defaultStateDestroySpeed: r.defaultStateDestroySpeed,
    requiresCorrectToolForDrops: r.requiresCorrectToolForDrops,
    runtimeTags: r.runtimeTags || [],
    miningTags: r.miningTags || [],
    ntpr: classify(r)
  }))
}

ensureDir(outputJsonPath)
fs.writeFileSync(outputJsonPath, `${JSON.stringify(audit, null, 2)}\n`)

const lines = [
  '# NTP Breakability Audit',
  '',
  `Input: \`${path.relative(repo, inputPath)}\``,
  `Runtime probe schema: \`${audit.runtimeProbeSchema || 'UNKNOWN'}\``,
  '',
  '## Totals',
  '',
  `- Runtime block records: ${audit.totals.runtimeBlockRecords}`,
  `- Breakable runtime block records: ${audit.totals.breakableRuntimeBlockRecords}`,
  `- Deny-risk blocks: ${audit.totals.denyRisk}`,
  `- Positive-hardness deny-risk blocks: ${audit.totals.positiveHardnessDenyRisk}`,
  `- Zero-hardness deny-risk blocks: ${audit.totals.zeroHardnessDenyRisk}`,
  '',
  '## Positive-Hardness Deny Risk By Namespace',
  '',
  ...audit.positiveHardnessDenyRiskByNamespace.slice(0, 40).map((r) => `- ${r.namespace}: ${r.count}`),
  '',
  '## Positive-Hardness Samples',
  '',
  ...audit.samples.positiveHardnessDenyRisk.map((r) => `- ${r.id} (${r.defaultDestroyTime})`),
  '',
  '## Zero-Hardness Samples',
  '',
  ...audit.samples.zeroHardnessDenyRisk.map((r) => `- ${r.id}`)
]

fs.writeFileSync(outputMdPath, `${lines.join('\n')}\n`)

console.log(`Wrote ${path.relative(repo, outputJsonPath)}`)
console.log(`Wrote ${path.relative(repo, outputMdPath)}`)
console.log(`Deny risk: ${audit.totals.denyRisk} (${audit.totals.positiveHardnessDenyRisk} positive hardness)`)
