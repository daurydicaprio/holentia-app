import { sectionsData } from "@/lib/data"
import type { SectionType } from "@/types"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import SectionTabs from "@/components/sections/section-tabs"
import SectionHeader from "@/components/sections/section-header"
import ToolsGrid from "@/components/sections/tools-grid"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import MenuButton from "@/components/common/menu-button/menu-button"
import JsonLd from "@/components/tool-seo/json-ld"
import { sectionJsonLd } from "@/lib/seo"

interface SectionPageProps {
  section: SectionType
}

/** Página de sección server-rendered (mente/relaciones/cuerpo/finanzas) */
export default function SectionPage({ section }: SectionPageProps) {
  const sectionData = sectionsData[section]

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <JsonLd data={sectionJsonLd(section)} />
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto">
        <div className="relative w-full flex justify-center mb-2">
          <div className="mt-6">
            <Logo section={section} size="lg" />
          </div>

          {/* Botón de menú alineado con el borde de las tarjetas */}
          <div className="absolute top-6 right-0 sm:right-4 md:right-6">
            <MenuButton section={section} />
          </div>
        </div>

        <SectionTabs />

        <SectionHeader section={sectionData} />

        {sectionData.intro && (
          <p className="mt-6 max-w-3xl px-4 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {sectionData.intro}
          </p>
        )}

        <ToolsGrid cards={sectionData.cards} section={section} />
      </div>

      <Footer section={section} />
      <MobileFab />
    </main>
  )
}
