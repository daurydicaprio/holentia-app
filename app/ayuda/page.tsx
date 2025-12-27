import Link from "next/link"
import { ArrowLeft, HelpCircle, MessageCircle, Book, Lightbulb, Search, Mail, ExternalLink } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function AyudaPage() {
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
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 blur-3xl rounded-full"></div>
            <Logo size="lg" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
            Centro de Ayuda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Estamos aquí para ayudarte</p>
        </div>

        {/* Quick help cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="p-3 rounded-2xl bg-blue-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">Guías de Usuario</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                Aprende a usar todas las herramientas de HOLENTIA con nuestras guías paso a paso.
              </p>
              <Link
                href="/que-es-holentia"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
              >
                Ver guías <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="p-3 rounded-2xl bg-purple-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">Preguntas Frecuentes</h3>
              <p className="text-purple-800 dark:text-purple-200 mb-4 leading-relaxed">
                Encuentra respuestas rápidas a las preguntas más comunes sobre HOLENTIA.
              </p>
              <button className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all">
                Ver FAQs <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">Preguntas Frecuentes</h2>

          <div className="space-y-4">
            {[
              {
                question: "¿HOLENTIA es completamente gratis?",
                answer:
                  "Sí, todas las herramientas de HOLENTIA son completamente gratuitas y estarán disponibles para siempre. Nuestro objetivo es hacer el bienestar accesible para todos.",
              },
              {
                question: "¿Necesito crear una cuenta para usar HOLENTIA?",
                answer:
                  "No, no necesitas crear cuenta ni proporcionar información personal. Todas las herramientas funcionan directamente en tu navegador sin necesidad de registro.",
              },
              {
                question: "¿Mis datos se guardan en algún servidor?",
                answer:
                  "No. Todos tus datos se almacenan localmente en tu dispositivo. HOLENTIA no tiene acceso a ninguna información que introduzcas en las herramientas.",
              },
              {
                question: "¿Las calculadoras financieras son precisas?",
                answer:
                  "Las calculadoras proporcionan estimaciones basadas en fórmulas estándar. Son herramientas educativas y no sustituyen el asesoramiento financiero profesional.",
              },
              {
                question: "¿Puedo usar HOLENTIA en mi dispositivo móvil?",
                answer:
                  "Sí, HOLENTIA está completamente optimizada para dispositivos móviles, tablets y computadoras. Funciona en cualquier navegador moderno.",
              },
              {
                question: "¿Cómo puedo sugerir nuevas herramientas?",
                answer:
                  "Valoramos tus ideas. Puedes enviarnos tus sugerencias a través de nuestro formulario de contacto o dejando un comentario en nuestras redes sociales.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              >
                <summary className="flex items-start gap-4 cursor-pointer list-none">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-open:scale-110 transition-transform">
                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">{faq.question}</h3>
                  </div>
                  <div className="text-gray-400 group-open:rotate-180 transition-transform">▼</div>
                </summary>
                <div className="mt-4 ml-14 text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-700/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">
              ¿Aún tienes preguntas?
            </h3>
            <p className="text-lg text-indigo-800 dark:text-indigo-200 mb-6 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos y responderemos tus preguntas lo antes posible.
            </p>
            <a
              href="mailto:soporte@holentia.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
