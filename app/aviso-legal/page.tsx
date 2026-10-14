import Link from "next/link"
import { ArrowLeft, ArrowRight, FileText, Globe, Mail, Shield, AlertTriangle } from "lucide-react"
import { pageMetadata, pageJsonLd } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"

export function generateMetadata() {
  return pageMetadata(
    "Aviso Legal",
    "Aviso legal de HOLENTIA: titularidad del sitio, condiciones de uso, propiedad intelectual y limitación de responsabilidad de las herramientas educativas.",
    "/aviso-legal",
  )
}
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={pageJsonLd("Aviso legal", "/aviso-legal")} />
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
            Aviso Legal
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Actualizado en octubre de 2026
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Información general</h2>
            </div>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Este sitio web, <strong>HOLENTIA</strong>, es una plataforma de herramientas de bienestar integral creada
              por Daury DiCaprio. El acceso y uso de este sitio está sujeto a los términos y condiciones descritos en
              este documento.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Objeto y ámbito</h2>
            </div>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              HOLENTIA proporciona herramientas gratuitas para el bienestar en las áreas de <strong>mente</strong>,{" "}
              <strong>relaciones</strong>, <strong>cuerpo</strong> y <strong>finanzas</strong>. Todas las herramientas
              son de carácter informativo y educativo.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Responsabilidad y limitaciones
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Las herramientas proporcionadas son de carácter informativo y educativo.{" "}
                <strong>No sustituyen el asesoramiento profesional especializado.</strong>
              </p>
              <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5 dark:bg-amber-900/20">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">Importante</p>
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                  Las calculadoras financieras, herramientas de bienestar mental y demás recursos son estimaciones. No
                  constituyen asesoramiento financiero, médico o psicológico profesional. Siempre consulte con un
                  profesional cualificado para decisiones importantes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Privacidad y protección de datos
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                HOLENTIA no recopila, almacena ni procesa información personal.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                {[
                  "No utilizamos cookies de seguimiento",
                  "No compartimos información con terceros",
                  "No creamos perfiles de usuario",
                  "No almacenamos historial de uso",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Contacto</h2>
            </div>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Para consultas relacionadas con este aviso legal:
            </p>
            <Link
              href="/ayuda"
              data-interactive="true"
              className="group mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Ir a Ayuda
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Uso responsable</h2>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Al utilizar HOLENTIA, aceptas estos términos y te comprometes a hacer un uso responsable y ético de las
              herramientas proporcionadas. Trabajemos juntos para crear una comunidad de bienestar basada en el respeto
              y la mejora continua.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
