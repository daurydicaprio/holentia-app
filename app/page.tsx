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

        <div className="mt-12 text-center max-w-3xl px-4 sm:px-6">
          <div className="relative mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
                Tu camino hacia el bienestar integral
              </span>
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 blur-3xl -z-10 rounded-full" />
          </div>

          <div className="space-y-6 mb-8">
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed text-pretty">
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                HOLENTIA
              </span>{" "}
              es tu compañero en el desarrollo personal, con herramientas prácticas diseñadas para{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">transformar</span> cada aspecto de tu
              vida.
            </p>

            <div className="relative inline-block">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-pretty leading-relaxed px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                Selecciona una sección para comenzar tu viaje hacia una vida más{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">equilibrada</span>,{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">consciente</span> y{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">plena</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileFab />
    </main>
  )
}
