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
import RelatedGuides from "@/components/guides/related-guides"
import { sectionLabel, toolJsonLd, type FaqItem } from "@/lib/seo"

// Mapas estáticos para que Tailwind genere las clases por sección
const sectionTitleClass: Record<string, string> = {
  mente: "text-mente dark:text-mente-light",
  relaciones: "text-relaciones dark:text-relaciones-light",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light",
  finanzas: "text-finanzas dark:text-finanzas-light",
}

const sectionUnderlineClass: Record<string, string> = {
  mente: "bg-mente dark:bg-mente-light",
  relaciones: "bg-relaciones dark:bg-relaciones-light",
  cuerpo: "bg-cuerpo-dark dark:bg-cuerpo-light",
  finanzas: "bg-finanzas dark:bg-finanzas-light",
}

const sectionButtonClass: Record<string, string> = {
  mente:
    "border-mente text-mente-dark hover:bg-mente-dark hover:text-white dark:border-mente-light dark:text-mente-light dark:hover:bg-mente-light dark:hover:text-black",
  relaciones:
    "border-relaciones text-relaciones hover:bg-relaciones-dark hover:text-white dark:border-relaciones-light dark:text-relaciones-light dark:hover:bg-relaciones-light dark:hover:text-black",
  cuerpo:
    "border-cuerpo-dark text-cuerpo-darkest hover:bg-cuerpo hover:text-black dark:border-cuerpo-light dark:text-cuerpo-light dark:hover:bg-cuerpo-light dark:hover:text-black",
  finanzas:
    "border-finanzas text-finanzas-dark hover:bg-finanzas-dark hover:text-white dark:border-finanzas-light dark:text-finanzas-light dark:hover:bg-finanzas-light dark:hover:text-black",
}

interface ToolPageShellProps {
  section: string
  tool: CardData
  faq?: FaqItem[]
  children: React.ReactNode
}

/** Shell server-rendered de las páginas de herramienta: H1, descripción, FAQ acordeón y JSON-LD (WebApplication + BreadcrumbList + FAQPage) en el HTML inicial */
export default function ToolPageShell({ section, tool, faq = [], children }: ToolPageShellProps) {
  const titleClass = sectionTitleClass[section] ?? "text-finanzas"
  const underlineClass = sectionUnderlineClass[section] ?? "bg-finanzas"
  const buttonClass = sectionButtonClass[section] ?? "border-finanzas text-finanzas"
  const jsonLd = toolJsonLd(section, tool.slug, faq)

  const buttonStyles =
    "inline-flex h-10 items-center gap-2 rounded-md border bg-white/60 px-5 text-sm font-medium backdrop-blur-sm transition-[colors,transform] duration-150 active:scale-[0.97] dark:bg-black/20"

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      {jsonLd && <JsonLd data={jsonLd} />}

      <UnifiedHeader section={section} />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <header className="mb-6 pt-6 text-center">
          <h1 className={`mb-1 text-2xl font-bold sm:text-3xl ${titleClass}`}>{tool.title}</h1>
          <p className="mx-auto mb-2 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
            {tool.description}
          </p>
          <div aria-hidden="true" className={`mx-auto mb-4 h-[0.175rem] w-16 rounded-full ${underlineClass}`} />
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/${section}`}
            data-interactive="true"
            className={`${buttonStyles} ${buttonClass}`}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a {sectionLabel(section)}
          </Link>

          <Link href="/apoyar" data-interactive="true" className={`${buttonStyles} ${buttonClass}`}>
            <Coffee className="h-4 w-4" />
            Hacer donación
          </Link>
        </div>

        {children}

        <ToolFaq faq={faq} section={section} />

        <RelatedGuides toolSlug={tool.slug} />
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
