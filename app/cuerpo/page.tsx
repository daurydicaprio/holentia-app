import { sectionsData } from "@/lib/data"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import SectionTabs from "@/components/sections/section-tabs"
import SectionHeader from "@/components/sections/section-header"
import ToolsGrid from "@/components/sections/tools-grid"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import MainMenuButton from "@/components/common/main-menu-button/main-menu-button"

export default function CuerpoPage() {
  const section = "cuerpo"
  const sectionData = sectionsData[section]

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <Header />
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto">
        <div className="relative w-full flex justify-center mb-2">
          <div className="mt-6">
            <Logo section={section} size="lg" />
          </div>

          {/* Botón de menú alineado con el borde de las tarjetas */}
          <div className="absolute top-6 right-0 sm:right-4 md:right-6">
            <MainMenuButton section={section} />
          </div>
        </div>

        <SectionTabs />

        <SectionHeader section={sectionData} />

        <ToolsGrid cards={sectionData.cards} section={section} />
      </div>

      <Footer section={section} />
      <MobileFab />
    </main>
  )
}
