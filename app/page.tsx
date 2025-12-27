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
          <div className="relative mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
              Tu camino hacia el bienestar integral
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 blur-2xl -z-10 rounded-full" />
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed text-pretty font-medium">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                HOLENTIA
              </span>{" "}
              te acompaña en tu desarrollo personal con herramientas prácticas diseñadas para transformar cada aspecto
              de tu vida.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">Mente</div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-500/0 group-hover:from-blue-400/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300" />
              </div>

              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl mb-2">💝</div>
                <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">Relaciones</div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-500/0 group-hover:from-purple-400/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />
              </div>

              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl mb-2">💪</div>
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">Cuerpo</div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-500/0 group-hover:from-amber-400/10 group-hover:to-amber-500/10 rounded-2xl transition-all duration-300" />
              </div>

              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">Finanzas</div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-500/0 group-hover:from-green-400/10 group-hover:to-green-500/10 rounded-2xl transition-all duration-300" />
              </div>
            </div>
          </div>

          <div className="relative">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-pretty leading-relaxed">
              Selecciona una sección para comenzar tu viaje hacia una vida más{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">equilibrada</span>,{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">saludable</span> y{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">plena</span>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <MobileFab />
    </main>
  )
}
