import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Mail, MessageCircle } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import { ClearAllData } from "@/components/common/clear-all-data/clear-all-data"
import JsonLd from "@/components/tool-seo/json-ld"
import { faqWithBreadcrumbJsonLd, pageMetadata, type FaqItem } from "@/lib/seo"

export function generateMetadata() {
  return pageMetadata(
    "Centro de Ayuda",
    "Guías, preguntas frecuentes y soporte de HOLENTIA: gratuitidad, privacidad de tus datos, precisión de las calculadoras y uso en móvil.",
    "/ayuda",
  )
}

const helpFaq: FaqItem[] = [
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
]

export default function AyudaPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={faqWithBreadcrumbJsonLd(helpFaq, "/ayuda", "Centro de Ayuda")} />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
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
            Centro de Ayuda
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/que-es-holentia"
            data-interactive="true"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Guías de usuario</h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-4">
              Aprende a usar todas las herramientas de HOLENTIA y conoce cómo funciona la plataforma.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              Ver guías
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <a
            href="#preguntas-frecuentes"
            data-interactive="true"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 mb-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Preguntas frecuentes</h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-4">
              Encuentra respuestas rápidas a las preguntas más comunes sobre HOLENTIA.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              Ver FAQs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        <section id="preguntas-frecuentes" aria-labelledby="faq-heading" className="mb-12">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {helpFaq.map((faq, i) => (
              <details
                key={i}
                data-interactive="true"
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <ClearAllData />

        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ¿Aún tienes preguntas?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
              Contáctanos y responderemos tus preguntas lo antes posible.
            </p>
            <a
              href="mailto:soporte@holentia.com"
              data-interactive="true"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Mail className="h-4 w-4" />
              Contactar soporte
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
