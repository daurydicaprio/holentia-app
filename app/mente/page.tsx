import { sectionsData } from "@/lib/data"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import SectionTabs from "@/components/sections/section-tabs"
import SectionHeader from "@/components/sections/section-header"
import ToolsGrid from "@/components/sections/tools-grid"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"

export default function MentePage() {
  const section = "mente"
  const sectionData = sectionsData[section]

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <Header />
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto">
        <div className="mt-6 mb-2">
          <Logo section={section} size="lg" />
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
