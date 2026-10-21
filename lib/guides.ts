import { readFileSync, readdirSync } from "node:fs"
import { basename, join } from "node:path"
import { parse } from "yaml"
import type { Guide, GuideCategory, GuideSummary } from "@/types/guide"

const GUIDES_DIR = join(process.cwd(), "content", "guias")
const WORDS_PER_MINUTE = 220

/**
 * Las guías con `draft: true` solo se renderizan en desarrollo y en previews
 * de Vercel. En producción no aparecen ni en el índice ni en el sitemap.
 */
export function isGuidePreview(): boolean {
  return (
    process.env.GUIDES_PREVIEW === "1" ||
    process.env.GUIDES_PREVIEW === "true" ||
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview"
  )
}

function countWords(content: string): number {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
}

function readGuideFile(file: string): Guide {
  const raw = readFileSync(file, "utf8")
  if (!raw.startsWith("---\n")) {
    throw new Error(`La guía ${file} no empieza con frontmatter YAML.`)
  }

  const end = raw.indexOf("\n---", 4)
  if (end === -1) {
    throw new Error(`La guía ${file} tiene el frontmatter sin cerrar.`)
  }

  const data = (parse(raw.slice(4, end)) ?? {}) as Record<string, unknown>
  const slug = basename(file, ".md")
  const content = raw.slice(end + 4).replace(/^\n/, "").trim()
  const draft = data.draft !== false

  return {
    title: String(data.title ?? ""),
    slug,
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    category: (data.category as GuideCategory) ?? "general",
    primaryTool: String(data.primaryTool ?? ""),
    relatedTools: Array.isArray(data.relatedTools) ? data.relatedTools.map(String) : [],
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: String(data.updatedAt ?? data.publishedAt ?? ""),
    reviewedAt: data.reviewedAt ? String(data.reviewedAt) : undefined,
    author: String(data.author ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    image: data.image ? String(data.image) : undefined,
    imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    sources: Array.isArray(data.sources) ? (data.sources as Guide["sources"]) : [],
    faq: Array.isArray(data.faq) ? (data.faq as Guide["faq"]) : [],
    draft,
    content,
    readingTime: Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE)),
  }
}

function guideFiles(): string[] {
  return readdirSync(GUIDES_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "README.md" &&
        !entry.name.startsWith("_"),
    )
    .map((entry) => join(GUIDES_DIR, entry.name))
    .sort()
}

/** Devuelve todas las guías visibles en el entorno actual (borradores incluidos en preview). */
export function getAllGuides(options?: { includeDrafts?: boolean }): Guide[] {
  const includeDrafts = options?.includeDrafts ?? isGuidePreview()

  return guideFiles()
    .map(readGuideFile)
    .filter((guide) => includeDrafts || !guide.draft)
    .sort((a, b) => {
      const byDate = b.publishedAt.localeCompare(a.publishedAt)
      return byDate !== 0 ? byDate : a.title.localeCompare(b.title, "es")
    })
}

/** Solo guías publicadas: alimenta sitemap, llms y enlaces públicos. */
export function getPublishedGuides(): Guide[] {
  return getAllGuides({ includeDrafts: false })
}

export function getGuideBySlug(slug: string, options?: { includeDrafts?: boolean }): Guide | undefined {
  return getAllGuides(options).find((guide) => guide.slug === slug)
}

export function toGuideSummary(guide: Guide): GuideSummary {
  return {
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    excerpt: guide.excerpt,
    category: guide.category,
    primaryTool: guide.primaryTool,
    author: guide.author,
    cover: guide.cover,
    image: guide.image,
    imageAlt: guide.imageAlt,
    publishedAt: guide.publishedAt,
    updatedAt: guide.updatedAt,
    draft: guide.draft,
    readingTime: guide.readingTime,
  }
}
