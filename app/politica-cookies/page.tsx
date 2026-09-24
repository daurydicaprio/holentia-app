import Link from "next/link"
import { ArrowLeft, Shield, Cookie, Lock, Database, Eye, CheckCircle2 } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Volver</span>
          </Link>
          <MenuButton />
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/10 dark:bg-green-400/5 blur-3xl rounded-full"></div>
            <Logo size="lg" />
          </div>
        </div>

        {/* Title with icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg">
            <Cookie className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
            Política de Cookies
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Actualizado en {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
          </p>
        </div>

        {/* Good news banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 mb-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-green-500 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Buenas Noticias</h2>
                <p className="text-lg text-green-700 dark:text-green-200 leading-relaxed">
                  <strong>HOLENTIA no utiliza cookies de seguimiento, análisis o publicidad.</strong> Tu privacidad es
                  nuestra prioridad absoluta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          {/* What are cookies */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">¿Qué son las cookies?</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar
              información sobre tu visita, mejorar la experiencia del usuario y, en muchos casos, rastrear tu actividad
              en línea.
            </p>
          </section>

          {/* Our usage */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Uso de Cookies en Holentia</h2>
            </div>
            <div className="pl-12 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>HOLENTIA utiliza únicamente cookies técnicas esenciales</strong> necesarias para el
                funcionamiento básico de la aplicación:
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Cookies Estrictamente Necesarias
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">theme-preference</code>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Guarda tu preferencia de tema (modo claro/oscuro)
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">Persistente (localStorage)</span>
                    </div>
                  </div>
                  {[
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
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <code className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
                          {item.key}
                        </code>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500">Persistente (localStorage)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border-l-4 border-amber-500">
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Importante:</strong> Todo esto vive únicamente en el almacenamiento local de tu navegador y
                  nunca se envía a ningún servidor. Puedes borrarlo cuando quieras: cada herramienta tiene su botón
                  «Borrar mis datos» y en la página de Ayuda hay un botón para borrarlo todo de una vez.
                </p>
              </div>
            </div>
          </section>

          {/* What we don't do */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:scale-110 transition-transform">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lo Que NO Hacemos</h2>
            </div>
            <div className="pl-12">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A diferencia de muchos sitios web, HOLENTIA se compromete a NO utilizar:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Cookies de análisis", desc: "No rastreamos tu comportamiento" },
                  { title: "Cookies de publicidad", desc: "Cero anuncios ni seguimiento" },
                  { title: "Cookies de redes sociales", desc: "Sin widgets que te rastreen" },
                  { title: "Cookies de terceros", desc: "Ninguna empresa externa accede a tu info" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-red-900 dark:text-red-200">{item.title}</div>
                      <div className="text-sm text-red-700 dark:text-red-300">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Privacy commitment */}
          <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Nuestro Compromiso con Tu Privacidad
              </h3>
              <p className="text-lg text-blue-800 dark:text-blue-200 leading-relaxed">
                En HOLENTIA creemos que tu privacidad es un derecho fundamental. Por eso, hemos diseñado nuestra
                plataforma para funcionar sin necesidad de rastrear tu actividad, recopilar tus datos o monetizar tu
                información. Puedes usar nuestras herramientas con total confianza y tranquilidad.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
            <p className="text-gray-700 dark:text-gray-300">¿Tienes preguntas sobre nuestra política de cookies?</p>
            <Link
              href="/ayuda"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Visita nuestra página de Ayuda
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
