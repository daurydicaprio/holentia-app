import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import SectionTabs from "@/components/sections/section-tabs"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
        <div className="relative w-full flex justify-center mb-8">
          <Logo size="lg" />

          {/* Botón de menú posicionado con más espacio respecto al logo */}
          <div className="absolute right-0 sm:right-4 md:right-12 lg:right-20 top-4">
            <MenuButton />
          </div>
        </div>

        <SectionTabs />

        <div className="mt-12 text-center max-w-2xl px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">Tu camino hacia el bienestar integral</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-pretty leading-relaxed">
            <span className="font-semibold text-gray-800 dark:text-gray-200">HOLENTIA</span> te acompaña en tu
            desarrollo personal con herramientas prácticas diseñadas para mejorar tu mente, relaciones, cuerpo y
            finanzas. Explora las secciones y descubre cómo transformar tu bienestar.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-pretty">
            Selecciona una sección para comenzar tu viaje hacia una vida más equilibrada y plena.
          </p>
        </div>
      </div>

      <Footer />
      <MobileFab />
    </main>
  )
}
