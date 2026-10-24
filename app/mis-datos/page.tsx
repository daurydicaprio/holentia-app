import Link from "next/link"
import { ArrowLeft, Database, Download, ShieldCheck, Upload } from "lucide-react"
import { pageJsonLd, pageMetadata } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"
import { DataBackup } from "@/components/mis-datos/data-backup"

export function generateMetadata() {
  return pageMetadata(
    "Mis datos",
    "Descarga un backup JSON de tus datos de HOLENTIA o restaura uno anterior. Todo ocurre en tu navegador, sin cuentas ni servidores.",
    "/mis-datos",
  )
}

const pasos = [
  {
    icon: Download,
    title: "Descarga",
    desc: "Se genera un JSON con tus borradores, diarios, hábitos y simulaciones guardadas en este navegador.",
  },
  {
    icon: ShieldCheck,
    title: "Guarda el archivo",
    desc: "El backup puede tener datos personales. No se sube a ningún servidor: tú decides dónde guardarlo.",
  },
  {
    icon: Upload,
    title: "Restaura",
    desc: "Al importar, revisas el contenido antes de escribir. Las claves repetidas se reemplazan y las demás se conservan.",
  },
]

export default function MisDatosPage() {
  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={pageJsonLd("Mis datos", "/mis-datos")} />
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Mis datos</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Llévate tus datos o restaura un backup. Sin cuenta, sin nube y sin que nada salga de este navegador.
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Database className="h-3.5 w-3.5" aria-hidden />
            Backup local en formato JSON
          </p>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {pasos.map((paso) => (
            <div
              key={paso.title}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <paso.icon className="mb-2 h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
              <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{paso.title}</h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{paso.desc}</p>
            </div>
          ))}
        </div>

        <DataBackup />
      </div>
      <Footer />
    </main>
  )
}
