import Link from "next/link"
import { ArrowLeft, Coffee, Gift, Heart, Rocket, Sparkles, Users } from "lucide-react"
import { pageMetadata, pageJsonLd } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"

export function generateMetadata() {
  return pageMetadata(
    "Apoya a HOLENTIA",
    "No todas las contribuciones son monetarias: descubre maneras de apoyar HOLENTIA y mantener sus herramientas de bienestar gratuitas para todos.",
    "/apoyar",
  )
}
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

const impactItems = [
  {
    icon: Sparkles,
    title: "100% gratis",
    desc: "Mantenemos todas las herramientas gratuitas para todos",
  },
  {
    icon: Users,
    title: "Sin anuncios",
    desc: "Tu experiencia sin interrupciones ni rastreo",
  },
  {
    icon: Rocket,
    title: "Mejora continua",
    desc: "Nuevas herramientas y funcionalidades cada mes",
  },
]

export default function ApoyarPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={pageJsonLd("Apoyar", "/apoyar")} />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <MenuButton />
        </div>

        <div className="flex flex-col items-center text-center mb-12">
          <Logo size="lg" />
          <BrandDots className="mt-5 mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Apoya a HOLENTIA
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
            Tu apoyo nos ayuda a mantener <strong className="font-semibold text-gray-900 dark:text-gray-100">HOLENTIA</strong>{" "}
            gratuita, sin anuncios y en constante mejora para todos.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {impactItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 mb-4">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5 text-center">
            Formas de contribuir
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <Coffee className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Donación única</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
                Invítanos un café y ayúdanos a seguir desarrollando nuevas herramientas para tu bienestar.
              </p>
              <a
                href="mailto:soporte@holentia.com?subject=Quiero%20apoyar%20a%20HOLENTIA%20(contribuci%C3%B3n%20%C3%BAnica)"
                data-interactive="true"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Coffee className="h-4 w-4" />
                Hacer una donación
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <Gift className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Apoyo mensual</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
                Conviértete en patrocinador y ayúdanos a planificar el futuro de HOLENTIA con confianza.
              </p>
              <a
                href="mailto:soporte@holentia.com?subject=Quiero%20apoyar%20a%20HOLENTIA%20(apoyo%20mensual)"
                data-interactive="true"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Gift className="h-4 w-4" />
                Ser patrocinador
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-900 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Otras formas de ayudar
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xl mx-auto">
            No todas las contribuciones son monetarias:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Comparte</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recomienda HOLENTIA a amigos y familia</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Opina</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Déjanos tu feedback para mejorar</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Contribuye</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sugiere nuevas herramientas</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center dark:border-gray-700 dark:bg-gray-900">
          <Heart className="mx-auto h-8 w-8 text-gray-400 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Gracias por tu apoyo</h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Cada contribución, sin importar el monto, nos ayuda a mantener HOLENTIA funcionando y mejorando. Gracias
            por creer en nuestra misión de hacer el bienestar accesible para todos.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
