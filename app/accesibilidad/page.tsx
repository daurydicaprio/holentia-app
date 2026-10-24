import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Keyboard,
  Mail,
  MonitorSmartphone,
  MousePointerClick,
  ScanEye,
  AlertTriangle,
} from "lucide-react"
import { pageJsonLd, pageMetadata } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

export function generateMetadata() {
  return pageMetadata(
    "Accesibilidad",
    "Cómo cuidamos la accesibilidad en HOLENTIA: teclado, lectores de pantalla, contraste, alternativas a los gráficos y limitaciones conocidas.",
    "/accesibilidad",
  )
}

const practicas = [
  {
    icon: Keyboard,
    title: "Teclado y foco",
    desc: "Los botones, enlaces, campos, acordeones y gráficos interactivos se pueden recorrer con Tab. El foco visible no se elimina y los controles tienen nombre accesible.",
  },
  {
    icon: ScanEye,
    title: "Contraste y color",
    desc: "El texto usa tokens con contraste AA en claro y oscuro. El color nunca es la única señal: los gráficos combinan línea sólida/discontinua, etiquetas y números.",
  },
  {
    icon: MousePointerClick,
    title: "Áreas táctiles",
    desc: "Los controles principales buscan un área cómoda en móvil. Los elementos interactivos marcan `data-interactive` para no disparar por accidente el cambio de sección.",
  },
  {
    icon: MonitorSmartphone,
    title: "Sin dependencia del ratón",
    desc: "Las calculadoras, tests y diarios funcionan con teclado y con lector de pantalla. Los resultados importantes se anuncian con regiones `aria-live`.",
  },
]

const graficos = [
  "Cada canvas de Chart.js lleva `role=\"img\"` y un `aria-label` con el mensaje principal.",
  "Debajo hay una tabla plegable con los datos por año o mes, encabezados de columna y una descripción para lectores de pantalla.",
  "La dona del perfil de riesgo mantiene una lista visible con porcentajes y montos como alternativa textual.",
  "El selector de nivel de riesgo es un grupo de botones con `aria-pressed`; no está escondido dentro de una imagen.",
]

const limites = [
  "No tenemos una certificación externa de accesibilidad. Usamos WCAG 2.2 AA como referencia de diseño y revisamos los flujos principales, pero no afirmamos conformidad total.",
  "El barrido con axe-core 4.11 de octubre de 2026 cubrió 42 rutas en claro/oscuro y móvil/escritorio, con 0 violaciones en esa muestra. No sustituye una auditoría manual con cada tecnología de asistencia.",
  "Las tablas de datos de los gráficos aparecen después de calcular. Si tu lector de pantalla no anuncia el cambio, revisa la región de resultados o vuelve a recorrer el encabezado.",
  "En pantallas estrechas, algunas tablas y el detalle de los gráficos se desplazan horizontalmente. El contenido sigue disponible, pero puede requerir scroll.",
  "Las animaciones respetan `prefers-reduced-motion`; si tu sistema no lo activa, algunas transiciones breves seguirán visibles.",
  "No hay anuncios, chatbots ni widgets de terceros que introduzcan barreras externas. El único contenido externo son los enlaces a fuentes oficiales, que se abren en otra pestaña.",
]

export default function AccesibilidadPage() {
  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={pageJsonLd("Accesibilidad", "/accesibilidad")} />
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Accesibilidad
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            El bienestar tiene que poder usarse. Estas son las decisiones que tomamos, lo que todavía falla y cómo
            avisarnos.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Actualizado en octubre de 2026</p>
        </div>

        <div className="space-y-12">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-5 w-5 text-finanzas dark:text-finanzas-light" aria-hidden />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nuestro compromiso</h2>
            </div>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              HOLENTIA es una app pequeña y sin backend, pero la accesibilidad no es un extra. Diseñamos con HTML
              semántico, foco visible, contraste suficiente y alternativas textuales para que las herramientas sirvan
              también si no ves la pantalla o no usas el ratón.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">Qué hacemos bien</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {practicas.map((practica) => (
                <div
                  key={practica.title}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <practica.icon className="mb-2 h-5 w-5 text-finanzas dark:text-finanzas-light" aria-hidden />
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{practica.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{practica.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">Gráficos con alternativa</h2>
            <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Un gráfico no puede ser la única forma de leer un resultado. Los cuatro canvas financieros tienen una
              descripción y una tabla de datos.
            </p>
            <ul className="space-y-3">
              {graficos.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-finanzas dark:text-finanzas-light" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Limitaciones conocidas</h2>
            </div>
            <ul className="space-y-3">
              {limites.map((limite) => (
                <li key={limite} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden />
                  <span>{limite}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reportar una barrera</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Escríbenos a{" "}
              <a
                href="mailto:soporte@holentia.com?subject=Accesibilidad%20en%20HOLENTIA"
                className="font-medium text-finanzas-dark underline underline-offset-2 hover:text-finanzas-darkest dark:text-finanzas-light dark:hover:text-finanzas-lighter"
              >
                soporte@holentia.com
              </a>{" "}
              con la página, el navegador, el dispositivo y la tecnología de asistencia que usas. Si puedes, cuenta qué
              esperabas que pasara y qué pasó. Leemos cada reporte y corregimos lo que está en nuestras manos.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/metodologia"
                data-interactive="true"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
              >
                Metodología
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ayuda"
                data-interactive="true"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
              >
                Centro de ayuda
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
