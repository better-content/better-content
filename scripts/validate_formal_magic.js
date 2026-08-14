#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const contract = JSON.parse(fs.readFileSync(path.join(root, 'kubejs/config/formal_magic_domains.json'), 'utf8'))
const activeOrigins = new Set(['core', 'hexerei', 'occultism', 'blood_magic', 'malum', 'goety'])
const specs = [...(contract.glyphs || []), ...(contract.addon_glyphs || [])]
const quarantined = contract.quarantined_glyphs || []

function key(raw) {
  const id = String(raw)
  return id.slice(id.lastIndexOf(':') + 1).replace(/^glyph_/, '')
}

const errors = []
const seen = new Set()
for (const spec of specs) {
  const glyph = key(spec[0])
  if (seen.has(glyph)) errors.push(`duplicate obtainable glyph: ${glyph}`)
  seen.add(glyph)
  const origins = contract.origin_overrides[glyph] || [spec[2]]
  if (!origins.length) errors.push(`glyph has no origin: ${glyph}`)
  for (const origin of origins) {
    if (!activeOrigins.has(origin)) errors.push(`inactive origin ${origin} on ${glyph}`)
    if (!(contract.domains[origin] || []).length) errors.push(`origin has no reagents: ${origin}`)
    if (origin !== 'core' && !(contract.origin_milestones[origin] || []).length) {
      errors.push(`origin has no spine milestones: ${origin}`)
    }
  }
}

for (const entry of quarantined) {
  const glyph = key(entry.id)
  if (seen.has(glyph)) errors.push(`glyph is both obtainable and quarantined: ${glyph}`)
  seen.add(glyph)
  if (!entry.reason) errors.push(`quarantined glyph lacks reason: ${glyph}`)
  for (const origin of entry.origins || []) if (!activeOrigins.has(origin)) errors.push(`inactive quarantine origin: ${origin}`)
}

if (contract.schema !== 'bc.formal_magic_domains.v3') errors.push(`unexpected schema: ${contract.schema}`)
if (specs.length !== 106) errors.push(`expected 106 obtainable glyphs, found ${specs.length}`)
if (quarantined.length !== 2) errors.push(`expected 2 quarantined glyphs, found ${quarantined.length}`)
if (seen.size !== 108) errors.push(`expected exhaustive coverage of 108 glyphs, found ${seen.size}`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`formal magic provenance: PASS (${specs.length} obtainable, ${quarantined.length} quarantined, ${seen.size} total)`)
