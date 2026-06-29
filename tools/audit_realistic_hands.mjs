#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import {
  BLOCK_TOOL_TAGS,
  ITEM_TOOL_TAGS,
  compileRealisticHands,
  summarizeRepresentativeSeparation
} from './lib/realistic_hands_policy.mjs'

const repo = process.cwd()
const defaultProbePath = path.join(repo, 'generated/runtime-dumps/block_hardness_probe.json')
const outputJsonPath = process.argv[2] || path.join(repo, 'generated/runtime-dumps/realistic_hands_audit.json')
const outputJsPath = process.argv[3] || path.join(repo, 'kubejs/startup_scripts/99_realistic_hands_assignments.js')
const outputMdPath = outputJsonPath.replace(/\.json$/i, '.md')

const knifeBlockTags = ['minecraft:crops', 'minecraft:flowers', 'minecraft:leaves', 'minecraft:replaceable', 'minecraft:saplings']

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function readJson(file) {
  return JSON.parse(read(file))
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
}

function rel(file) {
  return path.relative(repo, file)
}

function sortUnique(values) {
  return [...new Set(values.filter(Boolean).map(String))].sort()
}

function listFiles(root, predicate) {
  if (!fs.existsSync(root)) return []
  const out = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(file, predicate))
    else if (predicate(file)) out.push(file)
  }
  return out
}

function tagIdFromParts(parts, kind) {
  const dataIndex = parts.lastIndexOf('data')
  if (dataIndex < 0) return null
  const namespace = parts[dataIndex + 1]
  const tagsIndex = parts.indexOf('tags', dataIndex)
  if (!namespace || tagsIndex < 0 || parts[tagsIndex + 1] !== kind) return null
  const relParts = parts.slice(tagsIndex + 2)
  if (!relParts.length) return null
  relParts[relParts.length - 1] = relParts[relParts.length - 1].replace(/\.json$/i, '')
  return `${namespace}:${relParts.join('/')}`
}

function addTagValues(map, tag, values) {
  if (!tag || !Array.isArray(values)) return
  if (!map.has(tag)) map.set(tag, [])
  map.get(tag).push(...values)
}

function parseTagJson(text) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed.values)) return []
  return parsed.values.map((value) => {
    if (typeof value === 'string') return value
    if (value && typeof value.id === 'string') return value.id
    return null
  }).filter(Boolean)
}

function readDirTagMaps(root, kind) {
  const map = new Map()
  for (const file of listFiles(root, (candidate) => candidate.endsWith('.json'))) {
    const tag = tagIdFromParts(file.split(path.sep), kind)
    if (!tag) continue
    try {
      addTagValues(map, tag, parseTagJson(read(file)))
    } catch (err) {
      console.warn(`Skipping unreadable tag file ${rel(file)}: ${err.message}`)
    }
  }
  return map
}

function zipList(file) {
  try {
    return execFileSync('zipinfo', ['-1', file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
      .split(/\r?\n/)
      .filter(Boolean)
  } catch {
    return []
  }
}

function zipRead(file, entry) {
  return execFileSync('unzip', ['-p', file, entry], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
}

function readJarTagMaps(root, kind) {
  const map = new Map()
  const jars = [
    ...listFiles(path.join(root, 'mods'), (file) => file.endsWith('.jar')),
    ...listFiles(path.join(root, 'libraries'), (file) => file.endsWith('.jar'))
  ]
  const marker = `/tags/${kind}/`

  for (const jar of jars) {
    for (const entry of zipList(jar)) {
      if (!entry.startsWith('data/') || !entry.endsWith('.json') || !entry.includes(marker)) continue
      const tag = tagIdFromParts(entry.split('/'), kind)
      if (!tag) continue
      try {
        addTagValues(map, tag, parseTagJson(zipRead(jar, entry)))
      } catch (err) {
        console.warn(`Skipping unreadable tag entry ${rel(jar)}:${entry}: ${err.message}`)
      }
    }
  }

  return map
}

function mergeTagMaps(...maps) {
  const out = new Map()
  for (const map of maps) {
    for (const [tag, values] of map.entries()) addTagValues(out, tag, values)
  }
  return out
}

function resolveTagValues(map, tag, seen = new Set()) {
  if (seen.has(tag)) return []
  seen.add(tag)
  const out = []
  for (const value of map.get(tag) || []) {
    if (value.startsWith('#')) out.push(...resolveTagValues(map, value.slice(1), seen))
    else out.push(value)
  }
  return sortUnique(out)
}

function buildTagEvidence(root) {
  const blockTags = mergeTagMaps(
    readJarTagMaps(root, 'blocks'),
    readDirTagMaps(path.join(root, 'kubejs/data'), 'blocks')
  )
  const itemTags = mergeTagMaps(
    readJarTagMaps(root, 'items'),
    readDirTagMaps(path.join(root, 'kubejs/data'), 'items')
  )
  const blockEvidenceTags = sortUnique(['kubejs:hand_breakable', ...Object.values(BLOCK_TOOL_TAGS), ...knifeBlockTags])
  const itemEvidenceTags = sortUnique(Object.values(ITEM_TOOL_TAGS).flat())

  return {
    blockMembers: Object.fromEntries(blockEvidenceTags.map((tag) => [tag, resolveTagValues(blockTags, tag)])),
    itemMembers: Object.fromEntries(itemEvidenceTags.map((tag) => [tag, resolveTagValues(itemTags, tag)]))
  }
}

function parseAssignmentsFromJs(file, globalName) {
  if (!fs.existsSync(file)) return null
  const match = read(file).match(new RegExp(`global\\.${globalName}\\s*=\\s*({[\\s\\S]*})\\s*$`))
  return match ? JSON.parse(match[1]) : null
}

function normalizeLegacyAssignments(data) {
  const blocks = {}
  const items = {}
  for (const tool of ['hand', 'knife', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword']) {
    blocks[tool] = new Set(data?.blocks?.[tool] || [])
  }
  for (const tool of ['knife', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword']) {
    items[tool] = new Set(data?.items?.[tool] || [])
  }
  return { blocks, items }
}

function breakableBlock(record) {
  return record && !record.missing && Number(record.defaultDestroyTime) >= 0
}

function loadUniverse() {
  if (fs.existsSync(defaultProbePath)) {
    const dump = readJson(defaultProbePath)
    return {
      mode: 'runtime-probe',
      input: rel(defaultProbePath),
      runtimeProbeSchema: dump.schema || 'UNKNOWN',
      blockRecords: (dump.allBlocks && dump.allBlocks.length ? dump.allBlocks : dump.selectedBlocks || []).filter(breakableBlock),
      itemRecords: (dump.allItems || []).filter((record) => record && !record.missing)
    }
  }

  const currentJsonPath = path.join(repo, 'generated/runtime-dumps/realistic_hands_audit.json')
  const currentJsPath = path.join(repo, 'kubejs/startup_scripts/99_realistic_hands_assignments.js')
  const currentJson = fs.existsSync(currentJsonPath) ? readJson(currentJsonPath) : null
  const currentJs = parseAssignmentsFromJs(currentJsPath, 'BTM_REALISTIC_HANDS_ASSIGNMENTS')
  const combinedBlocks = new Set()
  const combinedItems = new Set()

  for (const source of [currentJson, currentJs]) {
    for (const values of Object.values(source?.blocks || {})) for (const id of values) combinedBlocks.add(id)
    for (const id of source?.unassignedBreakableBlocks || []) combinedBlocks.add(id)
    for (const values of Object.values(source?.items || {})) for (const id of values) combinedItems.add(id)
  }

  return {
    mode: 'assignment-seed',
    input: `${rel(currentJsonPath)} + ${rel(currentJsPath)}`,
    runtimeProbeSchema: 'realistic-hands-assignment-seed',
    blockRecords: [...combinedBlocks].sort().map((id) => ({ id, missing: false, defaultDestroyTime: 0 })),
    itemRecords: [...combinedItems].sort().map((id) => ({ id, missing: false }))
  }
}

function writeJs(assignments) {
  const payload = JSON.stringify(assignments, null, 2)
  const js = `// Generated by tools/audit_realistic_hands.mjs.\n` +
    `// Do not hand-edit block or item membership here; rerun the Realistic Hands audit instead.\n` +
    `global.BTM_REALISTIC_HANDS_ASSIGNMENTS = ${payload}\n`
  ensureDir(outputJsPath)
  fs.writeFileSync(outputJsPath, js)
}

function writeMd(assignments) {
  const reps = summarizeRepresentativeSeparation(assignments)
  const topOrigins = Object.entries(assignments.originCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
  const lines = [
    '# Realistic Hands Audit',
    '',
    `Input: \`${assignments.input}\``,
    `Runtime probe schema: \`${assignments.runtimeProbeSchema}\``,
    '',
    '## Totals',
    '',
    `- Breakable block records: ${assignments.blockCount}`,
    `- Item records: ${assignments.itemCount}`,
    `- Hand blocks: ${assignments.blocks.hand.length}`,
    `- Knife blocks: ${assignments.blocks.knife.length}`,
    `- Axe blocks: ${assignments.blocks.axe.length}`,
    `- Pickaxe blocks: ${assignments.blocks.pickaxe.length}`,
    `- Shovel blocks: ${assignments.blocks.shovel.length}`,
    `- Hoe blocks: ${assignments.blocks.hoe.length}`,
    `- Sword blocks: ${assignments.blocks.sword.length}`,
    `- Unassigned breakable blocks: ${assignments.unassignedBreakableBlocks.length}`,
    '',
    '## Representative Separation',
    '',
    `- projectvibrantjourneys:short_grass knife: ${reps.knifeGrass}`,
    `- minecraft:oak_leaves knife: ${reps.knifeLeaves}`,
    `- minecraft:cobweb sword: ${reps.swordCobweb}`,
    `- minecraft:tripwire sword: ${reps.swordTripwire}`,
    '',
    '## Outcome Families',
    '',
    `- Knife transform fiber: ${assignments.outcomeFamilies.knife_transform_fiber.length}`,
    `- Knife transform organics: ${assignments.outcomeFamilies.knife_transform_organics.length}`,
    `- Knife extra sticks: ${assignments.outcomeFamilies.knife_extra_sticks.length}`,
    `- Sword preserve web: ${assignments.outcomeFamilies.sword_preserve_web.length}`,
    '',
    '## Largest Origins',
    ''
  ]

  for (const [origin, count] of topOrigins) lines.push(`- ${origin}: ${count}`)

  lines.push('', '## Unassigned Breakable Block Samples', '')
  lines.push(...assignments.unassignedBreakableBlocks.slice(0, 80).map((id) => `- ${id}`))
  fs.writeFileSync(outputMdPath, `${lines.join('\n')}\n`)
}

const universe = loadUniverse()
const tagEvidence = buildTagEvidence(repo)
const legacyAssignments = normalizeLegacyAssignments(
  parseAssignmentsFromJs(path.join(repo, 'kubejs/startup_scripts/99_realistic_hands_assignments.js'), 'BTM_REALISTIC_HANDS_ASSIGNMENTS') ||
  (fs.existsSync(path.join(repo, 'generated/runtime-dumps/realistic_hands_audit.json'))
    ? readJson(path.join(repo, 'generated/runtime-dumps/realistic_hands_audit.json'))
    : null)
)

const assignments = compileRealisticHands({
  blockRecords: universe.blockRecords,
  itemRecords: universe.itemRecords,
  tagEvidence,
  legacyAssignments,
  input: universe.input,
  runtimeProbeSchema: universe.runtimeProbeSchema
})

ensureDir(outputJsonPath)
fs.writeFileSync(outputJsonPath, `${JSON.stringify(assignments, null, 2)}\n`)
writeJs(assignments)
writeMd(assignments)

console.log(`Wrote ${rel(outputJsonPath)}`)
console.log(`Wrote ${rel(outputJsPath)}`)
console.log(`Wrote ${rel(outputMdPath)}`)
console.log(`mode=${universe.mode}`)
console.log(`unassigned=${assignments.unassignedBreakableBlocks.length}`)
