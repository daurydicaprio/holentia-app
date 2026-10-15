import Link from "next/link"
import { ArrowLeft, Brain, Dumbbell, HeartHandshake, Wallet } from "lucide-react"
import { pageMetadata, pageJsonLd } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"

export function generateMetadata() {
  return pageMetadata(
    "¿Qué es HOLENTIA?",
    "HOLENTIA es tu plataforma de bienestar: herramientas gratuitas de mente, relaciones, cuerpo y finanzas en tu navegador, sin cuenta ni datos personales.",
    "/que-es-holentia",
  )
}
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

const sectionCards = [
  {
    name: "Mente",
    href: "/mente",
    icon: Brain,
    iconClass: "text-mente dark:text-mente-light",
    titleClass: "text-mente-dark dark:text-mente-light",
    desc: "Herramientas para cultivar claridad mental, resiliencia emocional y equilibrio psicológico. Desarrolla hábitos mentales positivos y aprende a gestionar el estrés y las emociones.",
  },
  {
    name: "Relaciones",
    href: "/relaciones",
    icon: HeartHandshake,
    iconClass: "text-relaciones dark:text-relaciones-light",
    titleClass: "text-relaciones-dark dark:text-relaciones-light",
    desc: "Fortalece tus vínculos interpersonales con técnicas de comunicación, resolución de conflictos y desarrollo de empatía. Construye relaciones más profundas y significativas.",
  },
  {
    name: "Cuerpo",
    href: "/cuerpo",
    icon: Dumbbell,
    iconClass: "text-cuerpo-dark dark:text-cuerpo-light",
    titleClass: "text-cuerpo-dark dark:text-cuerpo-light",
    desc: "Energiza tu cuerpo con rutinas de ejercicio, planes nutricionales y consejos para un estilo de vida activo. Cuida tu salud física y descubre tu mejor versión.",
  },
  {
    name: "Finanzas",
    href: "/finanzas",
    icon: Wallet,
    iconClass: "text-finanzas dark:text-finanzas-light",
    titleClass: "text-finanzas-dark dark:text-finanzas-light",
    desc: "Domina tus finanzas con herramientas para presupuestar, invertir y alcanzar tus metas económicas. Aprende a gestionar tu dinero con confianza y estrategia.",
  },
]

const specialFeatures = [
  {
    title: "Herramientas prácticas",
    desc: "No solo teoría, sino calculadoras, simuladores y ejercicios interactivos que puedes usar de inmediato.",
  },
  {
    title: "Diseño intuitivo",
    desc: "Interfaz moderna y fácil de usar, optimizada para dispositivos móviles y escritorio.",
  },
  {
    title: "Acceso gratuito",
    desc: "Todas nuestras herramientas están disponibles sin costo para que todos puedan mejorar su bienestar.",
  },
  {
    title: "Privacidad total",
    desc: "No recopilamos ni almacenamos tu información personal. Tus datos permanecen en tu dispositivo.",
  },
  {
    title: "En constante evolución",
    desc: "Añadimos regularmente nuevas herramientas y mejoramos las existentes basándonos en las necesidades de nuestra comunidad.",
  },
]

const values = [
  {
    title: "Accesibilidad",
    desc: "El bienestar no debe ser un lujo. Todas nuestras herramientas son gratuitas y accesibles.",
  },
  {
    title: "Privacidad",
    desc: "Respetamos tu intimidad. No rastreamos, no vendemos datos, no recopilamos información personal.",
  },
  {
    title: "Calidad",
    desc: "Cada herramienta está cuidadosamente diseñada para ser útil, precisa y fácil de usar.",
  },
  {
    title: "Empoderamiento",
    desc: "Te damos las herramientas para que tomes el control de tu bienestar y tomes decisiones informadas.",
  },
]

export default function QueEsHolentiaPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={pageJsonLd("¿Qué es HOLENTIA?", "/que-es-holentia")} />
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
            ¿Qué es HOLENTIA?
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
            Tu compañero integral para el bienestar
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-12 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <strong className="font-semibold text-gray-900 dark:text-gray-100">HOLENTIA</strong> es tu plataforma
            integral de bienestar que te acompaña en el camino hacia una vida más equilibrada, saludable y próspera.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Nuestra misión</h2>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            Creemos que el bienestar verdadero es holístico e integra múltiples aspectos de tu vida. Por eso, HOLENTIA
            te ofrece herramientas prácticas y accesibles para que puedas trabajar en cuatro áreas fundamentales:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {sectionCards.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                data-interactive="true"
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <section.icon className={`h-5 w-5 ${section.iconClass}`} />
                  <h3 className={`text-lg font-semibold ${section.titleClass}`}>{section.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{section.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ¿Qué hace especial a HOLENTIA?
          </h2>
          <div className="space-y-3">
            {specialFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Nuestros valores</h2>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            En HOLENTIA nos guiamos por valores fundamentales que reflejan nuestro compromiso con tu bienestar:
          </p>
          <div className="space-y-4">
            {values.map((value, index) => (
              <div key={value.title} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gray-900 p-6 sm:p-8 dark:bg-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Comienza tu viaje hoy</h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-300 mb-6">
            Explora nuestras secciones y descubre herramientas que te ayudarán a transformar tu vida. Ya sea que
            quieras mejorar tu salud mental, fortalecer tus relaciones, cuidar tu cuerpo o dominar tus finanzas,
            HOLENTIA está aquí para acompañarte en cada paso del camino.
          </p>
          <div className="flex flex-wrap gap-3">
            {sectionCards.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                data-interactive="true"
                className="inline-flex h-10 items-center rounded-md border border-white/20 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Explorar {section.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
