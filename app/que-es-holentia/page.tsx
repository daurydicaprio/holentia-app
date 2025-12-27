import Link from "next/link"
import { ArrowLeft, Heart, Shield, Sparkles, Users } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function QueEsHolentiaPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:gap-3"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver</span>
          </Link>
          <MenuButton />
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/10 blur-3xl rounded-full"></div>
            <Logo size="lg" />
          </div>
        </div>

        <article className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            ¿Qué es Holentia?
          </h1>

          <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-12">
            Tu compañero integral para el bienestar
          </p>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-green-500/5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-8 rounded-2xl mb-12 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
            <p className="text-xl text-center text-gray-700 dark:text-gray-200 mb-0 leading-relaxed">
              <strong className="text-blue-600 dark:text-blue-400">HOLENTIA</strong> es tu plataforma integral de
              bienestar que te acompaña en el camino hacia una vida más equilibrada, saludable y próspera.
            </p>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="mt-0 mb-3">Nuestra Misión</h2>
              <p>
                Creemos que el bienestar verdadero es holístico e integra múltiples aspectos de tu vida. Por eso,
                HOLENTIA te ofrece herramientas prácticas y accesibles para que puedas trabajar en cuatro áreas
                fundamentales:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-12 not-prose">
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-xl">
              <h3 className="mt-0 mb-3 text-xl font-semibold text-blue-700 dark:text-blue-300">🧠 Mente</h3>
              <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                Herramientas para cultivar claridad mental, resiliencia emocional y equilibrio psicológico. Desarrolla
                hábitos mentales positivos y aprende a gestionar el estrés y las emociones.
              </p>
            </div>

            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-xl">
              <h3 className="mt-0 mb-3 text-xl font-semibold text-purple-700 dark:text-purple-300">💜 Relaciones</h3>
              <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                Fortalece tus vínculos interpersonales con técnicas de comunicación, resolución de conflictos y
                desarrollo de empatía. Construye relaciones más profundas y significativas.
              </p>
            </div>

            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:border-amber-400 dark:hover:border-amber-500 transition-all hover:shadow-xl">
              <h3 className="mt-0 mb-3 text-xl font-semibold text-amber-700 dark:text-amber-300">💪 Cuerpo</h3>
              <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                Energiza tu cuerpo con rutinas de ejercicio, planes nutricionales y consejos para un estilo de vida
                activo. Cuida tu salud física y descubre tu mejor versión.
              </p>
            </div>

            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-xl">
              <h3 className="mt-0 mb-3 text-xl font-semibold text-green-700 dark:text-green-300">💰 Finanzas</h3>
              <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                Domina tus finanzas con herramientas para presupuestar, invertir y alcanzar tus metas económicas.
                Aprende a gestionar tu dinero con confianza y estrategia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-6 mt-12">
            <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="mt-0 mb-6">¿Qué hace especial a Holentia?</h2>
            </div>
          </div>

          <div className="grid gap-4 not-prose mb-12">
            {[
              {
                title: "Herramientas Prácticas",
                desc: "No solo teoría, sino calculadoras, simuladores y ejercicios interactivos que puedes usar de inmediato.",
              },
              {
                title: "Diseño Intuitivo",
                desc: "Interfaz moderna y fácil de usar, optimizada para dispositivos móviles y escritorio.",
              },
              {
                title: "Acceso Gratuito",
                desc: "Todas nuestras herramientas están disponibles sin costo para que todos puedan mejorar su bienestar.",
              },
              {
                title: "Privacidad Total",
                desc: "No recopilamos ni almacenamos tu información personal. Tus datos permanecen en tu dispositivo.",
              },
              {
                title: "En Constante Evolución",
                desc: "Añadimos regularmente nuevas herramientas y mejoramos las existentes basándonos en las necesidades de nuestra comunidad.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 mb-6 mt-12">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="mt-0 mb-3">Nuestros Valores</h2>
              <p>
                En HOLENTIA, nos guiamos por valores fundamentales que reflejan nuestro compromiso con tu bienestar:
              </p>
            </div>
          </div>

          <div className="space-y-4 not-prose mb-12">
            {[
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
            ].map((value, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{value.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl mt-12 border border-gray-700/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-blue-400" />
                <h3 className="mt-0 mb-0 text-white text-2xl font-bold">Comienza Tu Viaje Hoy</h3>
              </div>
              <p className="mb-6 text-gray-300 leading-relaxed">
                Explora nuestras secciones y descubre herramientas que te ayudarán a transformar tu vida. Ya sea que
                quieras mejorar tu salud mental, fortalecer tus relaciones, cuidar tu cuerpo o dominar tus finanzas,
                HOLENTIA está aquí para acompañarte en cada paso del camino.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mente"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Mente
                </Link>
                <Link
                  href="/relaciones"
                  className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Relaciones
                </Link>
                <Link
                  href="/cuerpo"
                  className="inline-flex items-center px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Cuerpo
                </Link>
                <Link
                  href="/finanzas"
                  className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Finanzas
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
