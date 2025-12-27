import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function AvisoLegalPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">Aviso Legal</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
          </p>

          <h2>1. Información General</h2>
          <p>
            Este sitio web, <strong>HOLENTIA</strong>, es una plataforma de herramientas de bienestar integral creada
            por Daury DiCaprio. El acceso y uso de este sitio web está sujeto a los términos y condiciones que se
            describen a continuación.
          </p>

          <h2>2. Objeto y Ámbito de Aplicación</h2>
          <p>
            HOLENTIA es una aplicación web que proporciona herramientas gratuitas para el bienestar en las áreas de
            mente, relaciones, cuerpo y finanzas. Todas las herramientas son de carácter informativo y educativo.
          </p>

          <h2>3. Propiedad Intelectual</h2>
          <p>
            Todos los contenidos de este sitio web, incluyendo pero no limitado a textos, diseños, gráficos, interfaces,
            código fuente y demás elementos, son propiedad de Daury DiCaprio y están protegidos por las leyes de
            propiedad intelectual.
          </p>
          <p>Queda prohibido:</p>
          <ul>
            <li>La reproducción, distribución o modificación total o parcial de los contenidos sin autorización.</li>
            <li>El uso comercial de las herramientas o contenidos sin permiso expreso.</li>
            <li>La ingeniería inversa, descompilación o extracción del código fuente.</li>
          </ul>

          <h2>4. Responsabilidad y Limitaciones</h2>
          <p>
            Las herramientas proporcionadas en HOLENTIA son de carácter informativo y educativo. No sustituyen el
            asesoramiento profesional especializado.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500 my-4">
            <p className="mb-0">
              <strong>Importante:</strong> Las calculadoras financieras, herramientas de bienestar mental y demás
              recursos son estimaciones y no constituyen asesoramiento financiero, médico o psicológico profesional.
              Siempre consulte con un profesional cualificado para decisiones importantes.
            </p>
          </div>
          <p>HOLENTIA no se hace responsable de:</p>
          <ul>
            <li>Decisiones tomadas basándose únicamente en la información proporcionada.</li>
            <li>Errores o imprecisiones en los cálculos o resultados generados.</li>
            <li>Daños o perjuicios derivados del uso o imposibilidad de uso de las herramientas.</li>
            <li>La disponibilidad continua e ininterrumpida del servicio.</li>
          </ul>

          <h2>5. Privacidad y Protección de Datos</h2>
          <p>
            <strong>HOLENTIA no recopila, almacena ni procesa información personal de los usuarios.</strong> Todos los
            datos introducidos en las herramientas se procesan localmente en tu dispositivo y no se envían a ningún
            servidor.
          </p>
          <ul>
            <li>No utilizamos cookies de seguimiento o análisis.</li>
            <li>No compartimos información con terceros.</li>
            <li>No creamos perfiles de usuario.</li>
            <li>No almacenamos historial de uso.</li>
          </ul>

          <h2>6. Modificaciones</h2>
          <p>
            HOLENTIA se reserva el derecho de modificar, actualizar o eliminar cualquier contenido, herramienta o
            funcionalidad del sitio web en cualquier momento y sin previo aviso.
          </p>

          <h2>7. Enlaces a Terceros</h2>
          <p>
            Este sitio web puede contener enlaces a sitios de terceros. HOLENTIA no se hace responsable del contenido,
            políticas de privacidad o prácticas de sitios web de terceros.
          </p>

          <h2>8. Ley Aplicable y Jurisdicción</h2>
          <p>
            Este aviso legal se rige por las leyes aplicables. Para cualquier controversia derivada del uso de este
            sitio web, las partes se someten a los juzgados y tribunales competentes.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con este aviso legal, puedes contactarnos a través de la sección de{" "}
            <Link href="/ayuda" className="text-blue-600 dark:text-blue-400 hover:underline">
              Ayuda
            </Link>
            .
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mt-8">
            <h3 className="mt-0">Uso Responsable</h3>
            <p className="mb-0">
              Al utilizar HOLENTIA, aceptas estos términos y te comprometes a hacer un uso responsable y ético de las
              herramientas proporcionadas. Trabajemos juntos para crear una comunidad de bienestar basada en el respeto
              y la mejora continua.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
