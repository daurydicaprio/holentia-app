import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { sectionsData } from "../lib/data.ts"
import { RELATED_TOOL_SLUGS } from "../lib/related-tools.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tools = Object.values(sectionsData).flatMap((section) => section.cards)
const slugs = new Set(tools.map((tool) => tool.slug))
const incoming = Object.fromEntries([...slugs].map((slug) => [slug, 0]))
const problems = []

for (const [slug, related] of Object.entries(RELATED_TOOL_SLUGS)) {
  if (!slugs.has(slug)) problems.push(`origen desconocido: ${slug}`)
  if (related.length < 2 || related.length > 3) {
    problems.push(`${slug}: ${related.length} enlaces (deben ser 2–3)`)
  }
  if (new Set(related).size !== related.length) problems.push(`${slug}: enlaces duplicados`)
  for (const target of related) {
    if (!slugs.has(target)) problems.push(`${slug} → ${target}: destino inexistente`)
    if (target === slug) problems.push(`${slug} → ${target}: enlace a sí misma`)
    if (incoming[target] !== undefined) incoming[target] += 1
  }
}

for (const slug of slugs) {
  if (!RELATED_TOOL_SLUGS[slug]) problems.push(`${slug}: sin entrada en lib/related-tools.ts`)
  if (incoming[slug] < 2) problems.push(`${slug}: solo ${incoming[slug]} enlaces entrantes`)
  if (!fs.existsSync(path.join(root, "app", slug, "page.tsx"))) {
    problems.push(`${slug}: no existe app/${slug}/page.tsx`)
  }
}

if (problems.length > 0) {
  console.error("Enlaces internos con problemas:\n" + problems.map((item) => `- ${item}`).join("\n"))
  process.exit(1)
}

console.log(`Enlaces internos OK: ${tools.length} herramientas, 2–3 salientes y ≥2 entrantes por herramienta.`)
