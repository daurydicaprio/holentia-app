import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function QueEsHolentiaPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </Link>
          <MenuButton />
        </div>

        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">¿Qué es Holentia?</h1>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-xl mb-8">
            <p className="text-lg text-center text-gray-700 dark:text-gray-200 mb-0">
              <strong>HOLENTIA</strong> es tu plataforma integral de bienestar que te acompaña en el camino hacia una
              vida más equilibrada, saludable y próspera.
            </p>
          </div>

          <h2>Nuestra Misión</h2>
          <p>
            Creemos que el bienestar verdadero es holístico e integra múltiples aspectos de tu vida. Por eso, HOLENTIA
            te ofrece herramientas prácticas y accesibles para que puedas trabajar en cuatro áreas fundamentales:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="mt-0 text-blue-700 dark:text-blue-300">Mente</h3>
              <p className="mb-0">
                Herramientas para cultivar claridad mental, resiliencia emocional y equilibrio psicológico. Desarrolla
                hábitos mentales positivos y aprende a gestionar el estrés y las emociones.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="mt-0 text-purple-700 dark:text-purple-300">Relaciones</h3>
              <p className="mb-0">
                Fortalece tus vínculos interpersonales con técnicas de comunicación, resolución de conflictos y
                desarrollo de empatía. Construye relaciones más profundas y significativas.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border-l-4 border-amber-500">
              <h3 className="mt-0 text-amber-700 dark:text-amber-300">Cuerpo</h3>
              <p className="mb-0">
                Energiza tu cuerpo con rutinas de ejercicio, planes nutricionales y consejos para un estilo de vida
                activo. Cuida tu salud física y descubre tu mejor versión.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500">
              <h3 className="mt-0 text-green-700 dark:text-green-300">Finanzas</h3>
              <p className="mb-0">
                Domina tus finanzas con herramientas para presupuestar, invertir y alcanzar tus metas económicas.
                Aprende a gestionar tu dinero con confianza y estrategia.
              </p>
            </div>
          </div>

          <h2>¿Qué hace especial a Holentia?</h2>
          <ul>
            <li>
              <strong>Herramientas Prácticas:</strong> No solo teoría, sino calculadoras, simuladores y ejercicios
              interactivos que puedes usar de inmediato.
            </li>
            <li>
              <strong>Diseño Intuitivo:</strong> Interfaz moderna y fácil de usar, optimizada para dispositivos móviles
              y escritorio.
            </li>
            <li>
              <strong>Acceso Gratuito:</strong> Todas nuestras herramientas están disponibles sin costo para que todos
              puedan mejorar su bienestar.
            </li>
            <li>
              <strong>Privacidad Total:</strong> No recopilamos ni almacenamos tu información personal. Tus datos
              permanecen en tu dispositivo.
            </li>
            <li>
              <strong>En Constante Evolución:</strong> Añadimos regularmente nuevas herramientas y mejoramos las
              existentes basándonos en las necesidades de nuestra comunidad.
            </li>
          </ul>

          <h2>Nuestros Valores</h2>
          <p>En HOLENTIA, nos guiamos por valores fundamentales que reflejan nuestro compromiso con tu bienestar:</p>
          <ul>
            <li>
              <strong>Accesibilidad:</strong> El bienestar no debe ser un lujo. Todas nuestras herramientas son
              gratuitas y accesibles.
            </li>
            <li>
              <strong>Privacidad:</strong> Respetamos tu intimidad. No rastreamos, no vendemos datos, no recopilamos
              información personal.
            </li>
            <li>
              <strong>Calidad:</strong> Cada herramienta está cuidadosamente diseñada para ser útil, precisa y fácil de
              usar.
            </li>
            <li>
              <strong>Empoderamiento:</strong> Te damos las herramientas para que tomes el control de tu bienestar y
              tomes decisiones informadas.
            </li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mt-8">
            <h3 className="mt-0">Comienza Tu Viaje Hoy</h3>
            <p className="mb-4">
              Explora nuestras secciones y descubre herramientas que te ayudarán a transformar tu vida. Ya sea que
              quieras mejorar tu salud mental, fortalecer tus relaciones, cuidar tu cuerpo o dominar tus finanzas,
              HOLENTIA está aquí para acompañarte en cada paso del camino.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mente"
                className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Explorar Mente
              </Link>
              <Link
                href="/relaciones"
                className="inline-block px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Explorar Relaciones
              </Link>
              <Link
                href="/cuerpo"
                className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                Explorar Cuerpo
              </Link>
              <Link
                href="/finanzas"
                className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Explorar Finanzas
              </Link>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
