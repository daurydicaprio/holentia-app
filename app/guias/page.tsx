import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Eye } from "lucide-react"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import MenuButton from "@/components/common/menu-button/menu-button"
import GuideCard from "@/components/guides/guide-card"
import JsonLd from "@/components/tool-seo/json-ld"
import { getAllGuides, getPublishedGuides, isGuidePreview, toGuideSummary } from "@/lib/guides"
import { guidesIndexJsonLd, guidesIndexMetadata } from "@/lib/seo"

export function generateMetadata() {
  return {
    ...guidesIndexMetadata(),
    robots:
      isGuidePreview() || getPublishedGuides().length === 0
        ? { index: false, follow: false }
        : undefined,
  }
}

export default function GuiasPage() {
  const guides = getAllGuides()
  const preview = isGuidePreview() && guides.some((guide) => guide.draft)
  const summaries = guides.map(toGuideSummary)

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={guidesIndexJsonLd(guides)} />

      <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <MenuButton />
        </div>

        <header className="flex flex-col items-center text-center mb-10">
          <Logo size="lg" />
          <BrandDots className="mt-5 mb-6" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Guías HOLENTIA
          </p>
          <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-gray-100">
            Guías de HOLENTIA
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
            Explicaciones claras, ejemplos con números y enlaces a la herramienta que resuelve el paso siguiente.
            Sin relleno y sin registro.
          </p>
          {preview ? (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Vista previa: los borradores no se publican ni se indexan.
            </p>
          ) : null}
        </header>

        {summaries.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Las primeras guías están en revisión
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Estamos verificando fuentes y ejemplos antes de publicarlas. Mientras tanto, puedes explorar las
              herramientas y resolver tu caso con tus propios números.
            </p>
            <Link
              href="/herramientas"
              data-interactive="true"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Ver herramientas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <p className="max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Las guías explican el contexto; las calculadoras hacen la cuenta. Todo funciona en tu navegador.
          </p>
          <Link
            href="/herramientas"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Explorar herramientas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
