#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs"
import { basename, join } from "node:path"
import { parse } from "yaml"

const ROOT = process.cwd()
const GUIDES_DIR = join(ROOT, "content", "guias")
const DATA_FILE = join(ROOT, "lib", "data.ts")

const errors = []
const warnings = []
const guides = []

const addError = (file, message) => errors.push(`${file}: ${message}`)
const addWarning = (file, message) => warnings.push(`${file}: ${message}`)

const categories = new Set(["cuerpo", "mente", "relaciones", "finanzas", "general"])
const staticRoutes = new Set([
  "/",
  "/herramientas",
  "/guias",
  "/mente",
  "/relaciones",
  "/cuerpo",
  "/finanzas",
  "/ayuda",
  "/que-es-holentia",
  "/aviso-legal",
  "/politica-cookies",
  "/apoyar",
])

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const placeholderPattern = /\b(TODO|TBD)\b/
const loremPattern = /\b(lorem ipsum|pendiente de escribir|placeholder)\b/i
const rawHtmlPattern = /<[a-z][^>]*>/i
const h1Pattern = /^#\s+/m
const h2Pattern = /^##\s+/gm

function readFrontmatter(file) {
  const raw = readFileSync(file, "utf8")
  if (!raw.startsWith("---\n")) {
    throw new Error("no empieza con frontmatter YAML (---)")
  }

  const end = raw.indexOf("\n---", 4)
  if (end === -1) {
    throw new Error("frontmatter sin cierre (---)")
  }

  const frontmatter = raw.slice(4, end)
  const body = raw.slice(end + 4).replace(/^\n/, "")
  return { data: parse(frontmatter) ?? {}, body }
}

function isValidDate(value) {
  return typeof value === "string" && datePattern.test(value)
}

function wordCount(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
}

function checkInternalLink(file, href, toolSlugs, guideSlugs) {
  if (!href.startsWith("/") || href.startsWith("//")) return

  const path = href.split("#")[0].split("?")[0]
  if (!path) return

  if (staticRoutes.has(path)) return

  if (path.startsWith("/guias/")) {
    const slug = path.slice("/guias/".length)
    if (!guideSlugs.has(slug)) {
      addError(file, `enlace interno a una guía inexistente: ${href}`)
    }
    return
  }

  const slug = path.slice(1)
  if (path.startsWith("/calculadora-") || toolSlugs.has(slug)) {
    if (!toolSlugs.has(slug)) {
      addError(file, `enlace interno a una herramienta inexistente: ${href}`)
    }
    return
  }

  addWarning(file, `enlace interno no verificado: ${href}`)
}

const dataSource = readFileSync(DATA_FILE, "utf8")
const toolSlugs = new Set(
  [...dataSource.matchAll(/\bslug:\s*["']([^"']+)["']/g)].map((match) => match[1]),
)

const entries = readdirSync(GUIDES_DIR, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".md") &&
      entry.name !== "README.md" &&
      !entry.name.startsWith("_"),
  )
  .map((entry) => join(GUIDES_DIR, entry.name))
  .sort()

const guideSlugs = new Set(entries.map((file) => basename(file, ".md")))
const titles = new Map()

for (const file of entries) {
  const relative = file.replace(`${ROOT}/`, "")
  let parsed

  try {
    parsed = readFrontmatter(file)
  } catch (error) {
    addError(relative, error.message)
    continue
  }

  const { data, body } = parsed
  const slug = basename(file, ".md")
  guides.push({ slug, data, body, file: relative })

  const required = [
    "title",
    "slug",
    "description",
    "excerpt",
    "category",
    "primaryTool",
    "author",
    "publishedAt",
    "updatedAt",
    "sources",
    "faq",
    "draft",
  ]

  for (const field of required) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      addError(relative, `falta el campo obligatorio "${field}"`)
    }
  }

  if (data.slug !== slug) {
    addError(relative, `el slug "${data.slug}" no coincide con el archivo "${slug}.md"`)
  }

  if (typeof data.title === "string") {
    if (data.title.length < 25) addWarning(relative, "el title es muy corto")
    if (data.title.length > 75) addWarning(relative, "el title pasa de 75 caracteres")
    if (titles.has(data.title)) {
      addError(relative, `title duplicado con ${titles.get(data.title)}`)
    } else {
      titles.set(data.title, relative)
    }
  }

  if (typeof data.description !== "string" || data.description.length < 120 || data.description.length > 155) {
    addError(relative, "la description debe tener entre 120 y 155 caracteres")
  }

  if (!categories.has(data.category)) {
    addError(relative, `categoría inválida: ${data.category}`)
  }

  if (!toolSlugs.has(data.primaryTool)) {
    addError(relative, `primaryTool inexistente: ${data.primaryTool}`)
  }

  if (!Array.isArray(data.relatedTools) || data.relatedTools.length < 1 || data.relatedTools.length > 3) {
    addError(relative, "relatedTools debe tener entre 1 y 3 herramientas")
  } else {
    for (const tool of data.relatedTools) {
      if (!toolSlugs.has(tool)) addError(relative, `relatedTools inexistente: ${tool}`)
    }
  }

  for (const field of ["publishedAt", "updatedAt", "reviewedAt"]) {
    if (data[field] !== undefined && !isValidDate(data[field])) {
      addError(relative, `${field} debe tener formato YYYY-MM-DD`)
    }
  }

  if (isValidDate(data.publishedAt) && isValidDate(data.updatedAt) && data.updatedAt < data.publishedAt) {
    addError(relative, "updatedAt no puede ser anterior a publishedAt")
  }

  if (isValidDate(data.publishedAt) && isValidDate(data.reviewedAt) && data.reviewedAt < data.publishedAt) {
    addError(relative, "reviewedAt no puede ser anterior a publishedAt")
  }

  if ((data.category === "finanzas" || data.category === "cuerpo") && !data.reviewedAt) {
    addError(relative, "reviewedAt es obligatorio en finanzas y salud")
  }

  if (typeof data.draft !== "boolean") {
    addError(relative, "draft debe ser true o false")
  }

  const minSources = data.category === "finanzas" || data.category === "cuerpo" ? 2 : 1
  if (!Array.isArray(data.sources) || data.sources.length < minSources) {
    addError(relative, `sources debe tener al menos ${minSources} fuentes para ${data.category}`)
  } else {
    for (const source of data.sources) {
      if (!source || typeof source.title !== "string" || !source.title.trim()) {
        addError(relative, "cada fuente necesita un title")
      }
      if (!source || typeof source.url !== "string" || !source.url.startsWith("https://")) {
        addError(relative, "cada fuente necesita una URL https")
      }
      if (source && !isValidDate(source.accessedAt)) {
        addError(relative, `la fuente "${source.title ?? "sin título"}" necesita accessedAt YYYY-MM-DD`)
      }
    }
  }

  if (!Array.isArray(data.faq) || data.faq.length < 3 || data.faq.length > 6) {
    addError(relative, "faq debe tener entre 3 y 6 preguntas")
  } else {
    for (const item of data.faq) {
      if (!item || typeof item.question !== "string" || item.question.trim().length < 10) {
        addError(relative, "cada FAQ necesita una pregunta de al menos 10 caracteres")
      }
      if (!item || typeof item.answer !== "string" || item.answer.trim().length < 20) {
        addError(relative, "cada FAQ necesita una respuesta de al menos 20 caracteres")
      }
    }
  }

  if (h1Pattern.test(body)) {
    addError(relative, "no incluir H1 en el cuerpo; el H1 sale del title")
  }

  const h2Count = (body.match(h2Pattern) ?? []).length
  if (h2Count < 3) addError(relative, `el cuerpo necesita al menos 3 H2 (tiene ${h2Count})`)

  if (placeholderPattern.test(body) || loremPattern.test(body)) {
    addError(relative, "el cuerpo contiene un placeholder (TODO, TBD, lorem ipsum…)")
  }

  if (rawHtmlPattern.test(body)) {
    addWarning(relative, "el cuerpo contiene una etiqueta HTML; usa Markdown puro")
  }

  const words = wordCount(body)
  if (words < 800) {
    addError(relative, `el cuerpo tiene ${words} palabras; el mínimo es 800`)
  }

  if (!body.includes("## Calcula tu caso")) {
    addWarning(relative, "falta el CTA final con el H2 «Calcula tu caso»")
  }

  if ((data.category === "finanzas" || data.category === "cuerpo") && !body.includes("## Fuentes")) {
    addWarning(relative, "falta la sección «## Fuentes» para exportar la guía")
  }

  if (typeof data.primaryTool === "string" && !body.includes(`](/${data.primaryTool})`)) {
    addWarning(relative, `el CTA no enlaza a la herramienta principal (${data.primaryTool})`)
  }

  for (const match of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    checkInternalLink(relative, match[1], toolSlugs, guideSlugs)
  }
}

const published = guides.filter((guide) => guide.data.draft === false)
const drafts = guides.filter((guide) => guide.data.draft === true)

console.log(`Guías revisadas: ${guides.length} (${published.length} publicadas, ${drafts.length} borradores)`)

if (warnings.length) {
  console.log(`\nAdvertencias (${warnings.length}):`)
  for (const warning of warnings) console.log(`  - ${warning}`)
}

if (errors.length) {
  console.error(`\nErrores (${errors.length}):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exitCode = 1
} else {
  console.log("\nTodo en orden.")
}
