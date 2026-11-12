import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { sectionsData } from "../lib/data.ts"
import { SECTION_GLOSSARY, getSectionGlossary } from "../lib/section-glossary.ts"

test("conceptos básicos: cubre cuerpo, mente y relaciones con una tarjeta por sección", () => {
  assert.deepEqual(Object.keys(SECTION_GLOSSARY).sort(), ["cuerpo", "mente", "relaciones"])
  assert.equal(getSectionGlossary("finanzas"), undefined)

  for (const [section, content] of Object.entries(SECTION_GLOSSARY)) {
    const card = sectionsData[section].cards.find((item) => item.slug === content.toolSlug)

    assert.ok(card, `${section}: falta la tarjeta ${content.toolSlug}`)
    assert.equal(card.category, section)
    assert.equal(card.isAvailable, true)
    assert.ok(card.metaTitle && card.metaTitle.length <= 60, `${section}: metaTitle fuera de rango`)
    assert.ok(
      card.metaDescription && card.metaDescription.length >= 120 && card.metaDescription.length <= 155,
      `${section}: metaDescription fuera de rango`,
    )
    assert.ok(
      fs.existsSync(path.join("app", content.toolSlug, "page.tsx")),
      `${section}: falta app/${content.toolSlug}/page.tsx`,
    )
    assert.ok(
      fs.existsSync(path.join("app", content.toolSlug, "opengraph-image.tsx")),
      `${section}: falta la OG de ${content.toolSlug}`,
    )
  }
})

test("conceptos básicos: cada término tiene categoría, definición, ejemplo y enlaces válidos", () => {
  const problems = []

  for (const [section, content] of Object.entries(SECTION_GLOSSARY)) {
    const availableSlugs = new Set(sectionsData[section].cards.map((card) => card.slug))
    const categoryIds = new Set(content.categories.map((category) => category.id))

    if (content.terms.length < 6) problems.push(`${section}: menos de 6 conceptos`)
    if (content.categories.length < 2) problems.push(`${section}: menos de 2 categorías`)
    if (content.sources.length < 2) problems.push(`${section}: menos de 2 fuentes`)

    for (const term of content.terms) {
      if (!term.definition.trim()) problems.push(`${section}/${term.slug}: sin definición`)
      if (!term.example.trim()) problems.push(`${section}/${term.slug}: sin ejemplo`)
      if (!categoryIds.has(term.category)) problems.push(`${section}/${term.slug}: categoría inexistente`)
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
    if (new Set(content.terms.map((term) => term.term)).size !== content.terms.length) {
      problems.push(`${section}: términos duplicados`)
    }

    for (const source of content.sources) {
      if (!source.href.startsWith("https://")) problems.push(`${section}: fuente sin HTTPS`)
    }
  }

  assert.deepEqual(problems, [])
})
