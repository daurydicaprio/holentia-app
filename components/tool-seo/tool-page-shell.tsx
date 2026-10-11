import type React from "react"
import Link from "next/link"
import { ChevronLeft, Coffee } from "lucide-react"
import type { CardData } from "@/types"
import UnifiedHeader from "@/components/common/header/unified-header"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import Footer from "@/components/common/footer/footer"
import ScrollToTop from "@/components/common/scroll-to-top/scroll-to-top"
import JsonLd from "./json-ld"
import ToolFaq from "./tool-faq"
import { sectionLabel, toolJsonLd, type FaqItem } from "@/lib/seo"

// Mapas estáticos para que Tailwind genere las clases por sección
const sectionTitleClass: Record<string, string> = {
  mente: "text-mente-DEFAULT",
  relaciones: "text-relaciones-DEFAULT",
  cuerpo: "text-cuerpo-DEFAULT",
  finanzas: "text-finanzas-DEFAULT",
}

const sectionUnderlineClass: Record<string, string> = {
  mente: "bg-mente-DEFAULT",
  relaciones: "bg-relaciones-DEFAULT",
  cuerpo: "bg-cuerpo-DEFAULT",
  finanzas: "bg-finanzas-DEFAULT",
}

const sectionButtonClass: Record<string, string> = {
  mente: "border-mente-DEFAULT text-mente-DEFAULT hover:bg-mente-glass",
  relaciones: "border-relaciones-DEFAULT text-relaciones-DEFAULT hover:bg-relaciones-glass",
  cuerpo: "border-cuerpo-DEFAULT text-cuerpo-DEFAULT hover:bg-cuerpo-glass",
  finanzas: "border-finanzas-DEFAULT text-finanzas-DEFAULT hover:bg-finanzas-glass",
}

interface ToolPageShellProps {
  section: string
  tool: CardData
  faq?: FaqItem[]
  children: React.ReactNode
}

/** Shell server-rendered de las páginas de herramienta: breadcrumb, H1, descripción, FAQ y JSON-LD en el HTML inicial */
export default function ToolPageShell({ section, tool, faq = [], children }: ToolPageShellProps) {
  const titleClass = sectionTitleClass[section] ?? "text-finanzas-DEFAULT"
  const underlineClass = sectionUnderlineClass[section] ?? "bg-finanzas-DEFAULT"
  const buttonClass = sectionButtonClass[section] ?? "border-finanzas-DEFAULT text-finanzas-DEFAULT"
  const jsonLd = toolJsonLd(section, tool.slug, faq)

  const buttonStyles =
    "inline-flex h-10 items-center gap-2 rounded-md border bg-white/60 px-5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 dark:bg-black/20"

  return (
    <main className="min-h-screen flex flex-col">
      {jsonLd && <JsonLd data={jsonLd} />}

      <UnifiedHeader section={section} />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <nav aria-label="Migas de pan" className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${section}`} className="hover:underline">
                {sectionLabel(section)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">
              {tool.title}
            </li>
          </ol>
        </nav>

        <header className="mb-6 text-center">
          <h1 className={`text-2xl font-bold sm:text-3xl ${titleClass}`} style={{ marginBottom: "0.25rem" }}>
            {tool.title}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300" style={{ marginBottom: "0.5rem" }}>
            {tool.description}
          </p>
          <div
            aria-hidden="true"
            className={`mx-auto mt-1 h-[0.175rem] w-16 rounded-full ${underlineClass}`}
            style={{ marginBottom: "1rem" }}
          />
        </header>

        <div className="mb-6 hidden items-center justify-between md:flex">
          <Link href={`/${section}`} className={`${buttonStyles} ${buttonClass}`}>
            <ChevronLeft className="h-4 w-4" />
            Volver a {sectionLabel(section)}
          </Link>

          <Link href="/apoyar" className={`${buttonStyles} ${buttonClass}`}>
            <Coffee className="h-4 w-4" />
            Hacer donación
          </Link>
        </div>

        {children}

        <ToolFaq faq={faq} />
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
