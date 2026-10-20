import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import GuideMarkdown from "@/components/guides/guide-markdown"
import GuideToolLinks from "@/components/guides/guide-tool-links"
import JsonLd from "@/components/tool-seo/json-ld"
import { formatGuideDate, guideCategoryLabel } from "@/lib/guide-format"
import { getAllGuides, getGuideBySlug, isGuidePreview } from "@/lib/guides"
import { guideJsonLd, guideMetadata } from "@/lib/seo"
import type { GuideCategory } from "@/types/guide"

const categoryText: Record<GuideCategory, string> = {
  mente: "text-mente-dark dark:text-mente-light",
  relaciones: "text-relaciones dark:text-relaciones-light",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light",
  finanzas: "text-finanzas-dark dark:text-finanzas-light",
  general: "text-gray-600 dark:text-gray-300",
}

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return {
      title: "Guía no encontrada",
      robots: { index: false, follow: false },
    }
  }

  return guideMetadata(guide, { noindex: isGuidePreview() })
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) notFound()

  const accentClass = categoryText[guide.category] ?? categoryText.general

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={guideJsonLd(guide)} />

      <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/guias"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Todas las guías
          </Link>
          <MenuButton />
        </div>

        <article className="mx-auto max-w-3xl">
          <header className="border-b border-gray-200 pb-8 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.16em] ${accentClass}`}
              >
                {guideCategoryLabel(guide.category)}
              </span>
              {guide.draft ? (
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
                  Borrador · solo vista previa
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] dark:text-gray-100">
              {guide.title}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {guide.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{guide.author}</span>
              <span aria-hidden="true">·</span>
              <span>
                Actualizada el <time dateTime={guide.updatedAt}>{formatGuideDate(guide.updatedAt)}</time>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                {guide.readingTime} min de lectura
              </span>
            </div>
          </header>

          <GuideToolLinks primaryTool={guide.primaryTool} relatedTools={guide.relatedTools} />

          <GuideMarkdown content={guide.content} category={guide.category} />

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
            <Link
              href="/guias"
              data-interactive="true"
              className="inline-flex items-center gap-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver a todas las guías
            </Link>
            <Link
              href={`/${guide.primaryTool}`}
              data-interactive="true"
              className="inline-flex items-center gap-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Abrir la herramienta
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

        </article>
      </div>

      <Footer />
    </main>
  )
}
