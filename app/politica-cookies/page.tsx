import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Cookie, Database, Lock, ShieldCheck, X } from "lucide-react"
import { pageMetadata, pageJsonLd } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"

export function generateMetadata() {
  return pageMetadata(
    "Política de Cookies",
    "Política de cookies de HOLENTIA: qué es localStorage, cómo se guardan tus borradores en tu dispositivo y cómo borrarlos en cualquier momento.",
    "/politica-cookies",
  )
}
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

const localStorageKeys = [
  {
    key: "theme-preference",
    desc: "Guarda tu preferencia de tema (modo claro/oscuro)",
  },
  {
    key: "holentia:diario-guiado:entries:v1",
    desc: "Tus entradas del Diario Guiado",
  },
  {
    key: "holentia:crear-presupuesto-personal:draft:v1",
    desc: "Borrador de tu presupuesto personal",
  },
  {
    key: "holentia:calculadora-interes-compuesto:draft:v1",
    desc: "Borrador de la calculadora de interés compuesto",
  },
  {
    key: "holentia:calculadora-interes-compuesto:simulations:v1",
    desc: "Tus simulaciones guardadas de interés compuesto (máx. 3)",
  },
  {
    key: "holentia:calculadora-prestamo:draft:v1",
    desc: "Borrador de la calculadora de préstamo",
  },
  {
    key: "holentia:calculadora-prestamo:simulations:v1",
    desc: "Tus simulaciones guardadas de préstamo (máx. 3)",
  },
  {
    key: "holentia:calculadora-consumo-electrico:draft:v1",
    desc: "Borrador de la calculadora de consumo eléctrico",
  },
  {
    key: "holentia:calculadora-gasto-combustible:draft:v1",
    desc: "Borrador de la calculadora de gasto de combustible",
  },
  {
    key: "holentia:calculadora-calorias:draft:v1",
    desc: "Borrador de la calculadora de calorías",
  },
  {
    key: "holentia:tarjeta-corte-vencimiento:draft:v1",
    desc: "Tu tarjeta guardada (días de corte y vencimiento)",
  },
  {
    key: "holentia:calculadora-hidratacion:draft:v1",
    desc: "Borrador de la calculadora de hidratación",
  },
  {
    key: "holentia:calculadora-interes-tarjeta:draft:v1",
    desc: "Borrador de la calculadora de interés de tarjeta",
  },
  {
    key: "holentia:test-perfil-riesgo:draft:v1",
    desc: "Tu último test de perfil de riesgo (nivel y fecha)",
  },
  {
    key: "holentia:tracker-gastos-hormiga:entries:v1",
    desc: "Tus gastos anotados en el tracker de gastos hormiga",
  },
  {
    key: "holentia:calculadora-aguinaldo:draft:v1",
    desc: "Borrador de la calculadora de aguinaldo",
  },
  {
    key: "holentia:calculadora-itbis:draft:v1",
    desc: "Borrador de la calculadora de ITBIS",
  },
  {
    key: "holentia:calculadora-certificado-financiero:draft:v1",
    desc: "Borrador de la calculadora de certificado financiero",
  },
]

const notUsedItems = [
  { title: "Cookies de análisis", desc: "No rastreamos tu comportamiento" },
  { title: "Cookies de publicidad", desc: "Cero anuncios ni seguimiento" },
  { title: "Cookies de redes sociales", desc: "Sin widgets que te rastreen" },
  { title: "Cookies de terceros", desc: "Ninguna empresa externa accede a tu info" },
]

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={pageJsonLd("Política de cookies", "/politica-cookies")} />
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            data-interactive="true"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
            Política de Cookies
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Actualizado en octubre de 2026
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-10 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Buenas noticias</h2>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                <strong>HOLENTIA no utiliza cookies de seguimiento, análisis o publicidad.</strong> Tu privacidad es
                nuestra prioridad absoluta.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">¿Qué son las cookies?</h2>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar
              información sobre tu visita, mejorar la experiencia del usuario y, en muchos casos, rastrear tu actividad
              en línea.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Uso de almacenamiento local en HOLENTIA
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                <strong>HOLENTIA utiliza únicamente almacenamiento local (localStorage) esencial</strong> necesario para
                el funcionamiento básico de la aplicación:
              </p>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="space-y-3">
                  {localStorageKeys.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <code className="break-all font-mono text-sm text-gray-900 dark:text-gray-100">
                          {item.key}
                        </code>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500">Persistente (localStorage)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5 dark:bg-amber-900/20">
                <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                  <strong>Importante:</strong> Todo esto vive únicamente en el almacenamiento local de tu navegador y
                  nunca se envía a ningún servidor. Puedes borrarlo cuando quieras: cada herramienta tiene su botón
                  «Borrar mis datos» y en la página de Ayuda hay un botón para borrarlo todo de una vez.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lo que NO hacemos</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {notUsedItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Nuestro compromiso con tu privacidad
            </h2>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              En HOLENTIA creemos que tu privacidad es un derecho fundamental. Por eso, hemos diseñado nuestra
              plataforma para funcionar sin necesidad de rastrear tu actividad, recopilar tus datos o monetizar tu
              información. Puedes usar nuestras herramientas con total confianza y tranquilidad.
            </p>
          </section>

          <section className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              ¿Tienes preguntas sobre nuestra política de cookies?
            </p>
            <Link
              href="/ayuda"
              data-interactive="true"
              className="group inline-flex h-10 items-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Visitar la página de Ayuda
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
