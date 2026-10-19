import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { directoryJsonLd, pageMetadata, sectionLabel } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import ToolCard from "@/components/sections/tool-card"
import { sectionsData } from "@/lib/data"
import type { SectionType } from "@/types"

export function generateMetadata() {
  return pageMetadata(
    "Directorio de herramientas",
    "Todas las herramientas de HOLENTIA en un solo lugar: calculadoras, simuladores y tests por sección. Gratuitas, sin registro y en tu navegador.",
    "/herramientas",
  )
}

const SECTION_ORDER: SectionType[] = ["mente", "relaciones", "cuerpo", "finanzas"]

// Mapa estático por sección (texto + borde del chip ancla y del enlace «Ver sección»)
const sectionLinkClasses: Record<SectionType, string> = {
  mente: "text-mente-dark hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter",
  relaciones:
    "text-relaciones hover:text-relaciones-darkest dark:text-relaciones-light dark:hover:text-relaciones-lighter",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
  finanzas:
    "text-finanzas-dark hover:text-finanzas-darkest dark:text-finanzas-light dark:hover:text-finanzas-lighter",
}

const chipClasses: Record<SectionType, string> = {
  mente: "border-gray-300 text-mente-dark hover:border-mente dark:border-gray-600 dark:text-mente-light dark:hover:border-mente-light",
  relaciones:
    "border-gray-300 text-relaciones hover:border-relaciones dark:border-gray-600 dark:text-relaciones-light dark:hover:border-relaciones-light",
  cuerpo:
    "border-gray-300 text-cuerpo-darkest hover:border-cuerpo-dark dark:border-gray-600 dark:text-cuerpo-light dark:hover:border-cuerpo-light",
  finanzas:
    "border-gray-300 text-finanzas-dark hover:border-finanzas dark:border-gray-600 dark:text-finanzas-light dark:hover:border-finanzas-light",
}

export default function DirectorioHerramientasPage() {
  const secciones = SECTION_ORDER.map((id) => ({
    id,
    label: sectionLabel(id),
    href: `/${id}`,
    cards: (sectionsData[id]?.cards ?? []).filter((card) => card.isAvailable),
  }))
  const totalHerramientas = secciones.reduce((total, seccion) => total + seccion.cards.length, 0)

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={directoryJsonLd()} />
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
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

        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" />
          <BrandDots className="mt-5 mb-6" />
          <h1 className="text-3xl font-bold sm:text-4xl">Directorio de herramientas</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Las {totalHerramientas} herramientas de HOLENTIA organizadas por sección: calculadoras, simuladores y
            tests gratuitos, sin registro y funcionando en tu navegador.
          </p>
        </div>

        {/* Chips ancla por sección */}
        <nav aria-label="Ir a una sección" className="mb-10 flex flex-wrap justify-center gap-2">
          {secciones.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              data-interactive="true"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${chipClasses[seccion.id]}`}
            >
              {seccion.label}
              <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">· {seccion.cards.length}</span>
            </a>
          ))}
        </nav>

        {secciones.map((seccion) => (
          <section key={seccion.id} id={seccion.id} className="mb-12 scroll-mt-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{seccion.label}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {seccion.cards.length} herramientas disponibles
                </p>
              </div>
              <Link
                href={seccion.href}
                data-interactive="true"
                className={`inline-flex items-center gap-1 py-2 text-sm font-medium ${sectionLinkClasses[seccion.id]}`}
              >
                Ver sección
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {seccion.cards.map((card, index) => (
                <ToolCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </main>
  )
}
