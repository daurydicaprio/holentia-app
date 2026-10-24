import type { Metadata } from "next"
import Link from "next/link"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import SectionTabs from "@/components/sections/section-tabs"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import JsonLd from "@/components/tool-seo/json-ld"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "es-DO",
      description:
        "Herramientas gratuitas de bienestar integral: mente, relaciones, cuerpo y finanzas. Calculadoras, simuladores y tests que funcionan en tu navegador.",
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      description:
        "Herramientas gratuitas de bienestar integral que funcionan en el navegador, sin cuenta ni datos personales.",
      inLanguage: "es-DO",
    },
  ],
}

export default function Home() {
  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 focus:outline-none">
      <JsonLd data={homeJsonLd} />
      <SectionSwipeNavigation />

      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
        <div className="relative w-full flex justify-center mb-8">
          <Logo size="lg" />

          <div className="absolute right-0 sm:right-4 md:right-6 top-4">
            <MenuButton />
          </div>
        </div>

        <SectionTabs neutral />

        <div className="mt-12 text-center max-w-3xl px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance text-gray-900 dark:text-gray-100">
            Tu camino hacia el bienestar integral
          </h1>
          <BrandDots className="mt-6" />

          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-pretty text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100">HOLENTIA</span> es tu compañero en el
            desarrollo personal, con herramientas prácticas diseñadas para transformar cada aspecto de tu vida.
          </p>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            Selecciona una sección para comenzar.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/mis-datos"
              data-interactive="true"
              className="inline-block py-1 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 dark:decoration-gray-600 dark:hover:text-gray-100"
            >
              Mis datos
            </Link>
            <span aria-hidden className="mx-2 text-gray-300 dark:text-gray-600">
              ·
            </span>
            <Link
              href="/metodologia"
              data-interactive="true"
              className="inline-block py-1 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 dark:decoration-gray-600 dark:hover:text-gray-100"
            >
              Metodología y fuentes
            </Link>
            <span aria-hidden className="mx-2 text-gray-300 dark:text-gray-600">
              ·
            </span>
            <Link
              href="/accesibilidad"
              data-interactive="true"
              className="inline-block py-1 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 dark:decoration-gray-600 dark:hover:text-gray-100"
            >
              Accesibilidad
            </Link>
          </p>
        </div>
      </div>

      <Footer />
      <MobileFab />
    </main>
  )
}
