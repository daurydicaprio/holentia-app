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
  mente: "text-mente dark:text-mente-light",
  relaciones: "text-relaciones dark:text-relaciones-light",
  cuerpo: "text-cuerpo-dark dark:text-cuerpo-light",
  finanzas: "text-finanzas dark:text-finanzas-light",
}

const sectionUnderlineClass: Record<string, string> = {
  mente: "bg-mente dark:bg-mente-light",
  relaciones: "bg-relaciones dark:bg-relaciones-light",
  cuerpo: "bg-cuerpo-dark dark:bg-cuerpo-light",
  finanzas: "bg-finanzas dark:bg-finanzas-light",
}

const sectionButtonClass: Record<string, string> = {
  mente: "border-mente text-mente hover:bg-mente-glass dark:border-mente-light dark:text-mente-light",
  relaciones:
    "border-relaciones text-relaciones hover:bg-relaciones-glass dark:border-relaciones-light dark:text-relaciones-light",
  cuerpo: "border-cuerpo-dark text-cuerpo-dark hover:bg-cuerpo-glass dark:border-cuerpo-light dark:text-cuerpo-light",
  finanzas: "border-finanzas text-finanzas hover:bg-finanzas-glass dark:border-finanzas-light dark:text-finanzas-light",
}

interface ToolPageShellProps {
  section: string
  tool: CardData
  faq?: FaqItem[]
  children: React.ReactNode
}

/** Shell server-rendered de las páginas de herramienta: H1, descripción, FAQ y JSON-LD (con BreadcrumbList) en el HTML inicial */
export default function ToolPageShell({ section, tool, faq = [], children }: ToolPageShellProps) {
  const titleClass = sectionTitleClass[section] ?? "text-finanzas"
  const underlineClass = sectionUnderlineClass[section] ?? "bg-finanzas"
  const buttonClass = sectionButtonClass[section] ?? "border-finanzas text-finanzas"
  const jsonLd = toolJsonLd(section, tool.slug, faq)

  const buttonStyles =
    "inline-flex h-10 items-center gap-2 rounded-md border bg-white/60 px-5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 dark:bg-black/20"

  return (
    <main className="min-h-screen flex flex-col">
      {jsonLd && <JsonLd data={jsonLd} />}

      <UnifiedHeader section={section} />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
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

        <ToolFaq faq={faq} section={section} />
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
