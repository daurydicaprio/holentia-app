import Link from "next/link"
import { ArrowLeft, Scale, FileText, Shield, AlertTriangle, Globe, Mail } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function AvisoLegalPage() {
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
          <Logo size="md" />
        </div>

        {/* Title with icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
            Aviso Legal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Actualizado en {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          {/* General information */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Información General</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
              Este sitio web, <strong>HOLENTIA</strong>, es una plataforma de herramientas de bienestar integral creada
              por Daury DiCaprio. El acceso y uso de este sitio está sujeto a los términos y condiciones descritos en
              este documento.
            </p>
          </section>

          {/* Purpose */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Objeto y Ámbito</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
              HOLENTIA proporciona herramientas gratuitas para el bienestar en las áreas de <strong>mente</strong>,{" "}
              <strong>relaciones</strong>, <strong>cuerpo</strong> y <strong>finanzas</strong>. Todas las herramientas
              son de carácter informativo y educativo.
            </p>
          </section>

          {/* Responsibility */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Responsabilidad y Limitaciones</h2>
            </div>
            <div className="pl-12 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Las herramientas proporcionadas son de carácter informativo y educativo.{" "}
                <strong>No sustituyen el asesoramiento profesional especializado.</strong>
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border-l-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Importante</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      Las calculadoras financieras, herramientas de bienestar mental y demás recursos son estimaciones.
                      No constituyen asesoramiento financiero, médico o psicológico profesional. Siempre consulte con un
                      profesional cualificado para decisiones importantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Privacidad y Protección de Datos</h2>
            </div>
            <div className="pl-12 space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/30">
                <p className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  HOLENTIA no recopila, almacena ni procesa información personal.
                </p>
                <ul className="space-y-2 text-green-700 dark:text-green-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    No utilizamos cookies de seguimiento
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    No compartimos información con terceros
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    No creamos perfiles de usuario
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    No almacenamos historial de uso
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contacto</h2>
            </div>
            <div className="pl-12">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Para consultas relacionadas con este aviso legal:
              </p>
              <Link
                href="/ayuda"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Ir a Ayuda
              </Link>
            </div>
          </section>

          {/* Responsible use */}
          <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-400/10 to-slate-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Uso Responsable</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Al utilizar HOLENTIA, aceptas estos términos y te comprometes a hacer un uso responsable y ético de las
                herramientas proporcionadas. Trabajemos juntos para crear una comunidad de bienestar basada en el
                respeto y la mejora continua.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
