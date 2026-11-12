import test from "node:test"
import assert from "node:assert/strict"
import { sectionsData } from "../lib/data.ts"
import { SECTION_GLOSSARY, getSectionGlossary } from "../lib/section-glossary.ts"

test("glosario de sección: cubre cuerpo, mente y relaciones", () => {
  assert.deepEqual(Object.keys(SECTION_GLOSSARY).sort(), ["cuerpo", "mente", "relaciones"])
  assert.equal(getSectionGlossary("finanzas"), undefined)
})

test("glosario de sección: cada concepto tiene definición, ejemplo y enlaces válidos", () => {
  const problems = []

  for (const [section, content] of Object.entries(SECTION_GLOSSARY)) {
    const availableSlugs = new Set(sectionsData[section].cards.map((card) => card.slug))

    if (content.terms.length < 6) problems.push(`${section}: menos de 6 conceptos`)
    if (content.sources.length < 2) problems.push(`${section}: menos de 2 fuentes`)

    for (const term of content.terms) {
      if (!term.definition.trim()) problems.push(`${section}/${term.slug}: sin definición`)
      if (!term.example.trim()) problems.push(`${section}/${term.slug}: sin ejemplo`)
      if (!term.related?.length) problems.push(`${section}/${term.slug}: sin herramienta relacionada`)

      for (const link of term.related ?? []) {
        if (!availableSlugs.has(link.slug)) {
          problems.push(`${section}/${term.slug}: herramienta inexistente ${link.slug}`)
        }
      }
    }

    if (new Set(content.terms.map((term) => term.slug)).size !== content.terms.length) {
      problems.push(`${section}: slugs duplicados`)
    }

    for (const source of content.sources) {
      if (!source.href.startsWith("https://")) problems.push(`${section}: fuente sin HTTPS`)
    }
  }

  assert.deepEqual(problems, [])
})
