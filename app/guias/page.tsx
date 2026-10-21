import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Eye } from "lucide-react"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import MenuButton from "@/components/common/menu-button/menu-button"
import GuideArchive from "@/components/guides/guide-archive"
import GuideCompactCard from "@/components/guides/guide-compact-card"
import GuideFeaturedCard from "@/components/guides/guide-featured-card"
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
  const featured = summaries[0]
  const secondary = summaries.slice(1, 4)

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={guidesIndexJsonLd(guides)} />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
          <MenuButton />
        </div>

        <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Logo size="md" />
          <BrandDots className="mt-4 mb-5" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Biblioteca
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

        {featured ? (
          <>
            <section
              aria-label="Guías principales"
              className={`mt-12 grid gap-10 lg:mt-14 lg:gap-12 ${
                secondary.length > 0
                  ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
                  : ""
              }`}
            >
              <GuideFeaturedCard guide={featured} />

              {secondary.length > 0 ? (
                <aside aria-label="Más guías" className="self-start">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {secondary.map((guide) => (
                      <GuideCompactCard key={guide.slug} guide={guide} />
                    ))}
                  </div>
                </aside>
              ) : null}
            </section>

            <GuideArchive guides={summaries} />
          </>
        ) : (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
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
      </div>

      <Footer />
    </main>
  )
}
