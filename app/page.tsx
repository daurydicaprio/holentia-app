import Logo from "@/components/common/logo/logo"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import SectionTabs from "@/components/sections/section-tabs"
import WelcomeModal from "@/components/common/welcome-modal/welcome-modal"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import MainMenuButton from "@/components/common/main-menu-button/main-menu-button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <Header />
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
        <div className="relative w-full flex justify-center mb-8">
          <Logo size="lg" />

          {/* Botón de menú posicionado con más espacio respecto al logo */}
          <div className="absolute right-0 sm:right-4 md:right-12 lg:right-20 top-4 main-menu-button-container">
            <MainMenuButton />
          </div>
        </div>

        <SectionTabs />

        <div className="mt-12 text-center max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Bienvenido a HOLENTIA</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Selecciona una sección para explorar herramientas que te ayudarán a mejorar tu bienestar integral.
          </p>
        </div>
      </div>

      <Footer />
      <MobileFab />
      <WelcomeModal />
    </main>
  )
}
