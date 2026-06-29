#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {
  CANONICAL_TOOLS,
  isAllowedHandFamily,
  isPlayerFacingExempt,
  summarizeRepresentativeSeparation
} from './lib/realistic_hands_policy.mjs'

const repo = process.cwd()
const assignmentsPath = path.join(repo, 'kubejs/startup_scripts/99_realistic_hands_assignments.js')
const auditPath = path.join(repo, 'generated/runtime-dumps/realistic_hands_audit.json')
const exemptionsPath = path.join(repo, 'tools/realistic_hands_exemptions.json')

function die(message) {
  console.error(`FAIL - ${message}`)
  process.exit(1)
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function readJson(file) {
  return JSON.parse(read(file))
}

function parseAssignments() {
  const text = read(assignmentsPath)
  const match = text.match(/global\.BTM_REALISTIC_HANDS_ASSIGNMENTS\s*=\s*({[\s\S]*})\s*$/)
  if (!match) die(`could not parse assignments from ${path.relative(repo, assignmentsPath)}`)
  return JSON.parse(match[1])
}

if (!fs.existsSync(assignmentsPath)) die(`missing ${path.relative(repo, assignmentsPath)}`)
if (!fs.existsSync(auditPath)) die(`missing ${path.relative(repo, auditPath)}; regenerate the Realistic Hands audit`)
if (!fs.existsSync(exemptionsPath)) die(`missing ${path.relative(repo, exemptionsPath)}`)

const assignments = parseAssignments()
const audit = readJson(auditPath)
const exemptions = readJson(exemptionsPath)

const handBlocks = assignments.blocks?.hand || []
const handViolations = handBlocks.filter((id) => !isPlayerFacingExempt(id, exemptions) && !isAllowedHandFamily(id))
const unresolved = (audit.unassignedBreakableBlocks || []).filter((id) => !isPlayerFacingExempt(id, exemptions))
const blockAssignments = assignments.blockAssignments || {}
const itemAssignments = assignments.itemAssignments || {}

const missingCanonicalAssignments = Object.entries(blockAssignments)
  .filter(([, assignment]) => !assignment.tools?.includes('hand') && !assignment.tools?.some((tool) => CANONICAL_TOOLS.includes(tool)))
  .map(([id]) => id)

const missingOrigins = Object.entries(blockAssignments)
  .filter(([, assignment]) => !assignment.origin || !assignment.detail)
  .map(([id]) => id)

const itemCoverageFailures = []
for (const tool of CANONICAL_TOOLS) {
  const blockCount = assignments.blocks?.[tool]?.length || 0
  const itemCount = assignments.items?.[tool]?.length || 0
  if (blockCount > 0 && itemCount === 0) itemCoverageFailures.push(`${tool}: no delegated tool items`)
}

const reps = summarizeRepresentativeSeparation(assignments)
const representativeFailures = []
if (!reps.knifeGrass) representativeFailures.push('projectvibrantjourneys:short_grass must remain knife-classified')
if (!reps.swordCobweb) representativeFailures.push('minecraft:cobweb must remain sword-classified')
if ((assignments.blocks?.knife || []).includes('minecraft:cobweb')) representativeFailures.push('minecraft:cobweb must not collapse into knife')
if ((assignments.blocks?.sword || []).includes('projectvibrantjourneys:short_grass')) representativeFailures.push('projectvibrantjourneys:short_grass must not collapse into sword')

const missingOutcomes = []
if (!assignments.outcomeFamilies?.knife_transform_fiber?.length) missingOutcomes.push('knife_transform_fiber')
if (!assignments.outcomeFamilies?.sword_preserve_web?.length) missingOutcomes.push('sword_preserve_web')

const knifeItemSet = new Set(assignments.items?.knife || [])
for (const id of ['additionalweaponry:butcher_knife']) {
  if (Object.keys(itemAssignments).includes(id) && !knifeItemSet.has(id)) itemCoverageFailures.push(`${id}: expected knife delegation`)
}

const allViolations = [
  ...handViolations.map((id) => `hand:${id}`),
  ...unresolved.map((id) => `unassigned:${id}`),
  ...missingCanonicalAssignments.map((id) => `tool:${id}`),
  ...missingOrigins.map((id) => `origin:${id}`),
  ...itemCoverageFailures,
  ...representativeFailures,
  ...missingOutcomes
]

if (allViolations.length) {
  console.error(`FAIL - Realistic Hands validation has ${allViolations.length} violation(s)`)
  console.error(`hand violations: ${handViolations.length}`)
  console.error(`unassigned blocks: ${unresolved.length}`)
  console.error(`assignment metadata failures: ${missingCanonicalAssignments.length + missingOrigins.length}`)
  console.error(allViolations.slice(0, 400).join('\n'))
  process.exit(1)
}

console.log(`ok - Realistic Hands validates (${handBlocks.length} hand entries, ${audit.unassignedBreakableBlocks.length} unassigned entries, knife and sword remain distinct)`)
