import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function PoliticaCookiesPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">Política de Cookies</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl mb-8 border-l-4 border-green-500">
            <h3 className="mt-0 text-green-700 dark:text-green-300">Buenas Noticias</h3>
            <p className="mb-0 text-lg">
              <strong>HOLENTIA no utiliza cookies de seguimiento, análisis o publicidad.</strong> Tu privacidad es
              nuestra prioridad.
            </p>
          </div>

          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar
            información sobre tu visita. Se utilizan comúnmente para mejorar la experiencia del usuario, realizar
            análisis y mostrar publicidad personalizada.
          </p>

          <h2>2. Uso de Cookies en Holentia</h2>
          <p>
            <strong>HOLENTIA utiliza únicamente cookies técnicas esenciales</strong> necesarias para el funcionamiento
            básico de la aplicación. Estas cookies son:
          </p>

          <h3>Cookies Estrictamente Necesarias</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Propósito</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>theme-preference</code>
                  </td>
                  <td>Guarda tu preferencia de tema (modo claro/oscuro)</td>
                  <td>Persistente (localStorage)</td>
                </tr>
                <tr>
                  <td>
                    <code>holentia-visited</code>
                  </td>
                  <td>
                    Indica si has visitado el sitio anteriormente (para no mostrar el modal de bienvenida repetidamente)
                  </td>
                  <td>Persistente (localStorage)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            <strong>Importante:</strong> Estas cookies se almacenan únicamente en el almacenamiento local de tu
            navegador (localStorage) y nunca se envían a ningún servidor externo.
          </p>

          <h2>3. Lo Que NO Hacemos</h2>
          <p>A diferencia de muchos sitios web, HOLENTIA se compromete a NO utilizar:</p>
          <ul>
            <li>
              <strong>Cookies de análisis:</strong> No utilizamos Google Analytics ni servicios similares para rastrear
              tu comportamiento.
            </li>
            <li>
              <strong>Cookies de publicidad:</strong> No mostramos anuncios ni utilizamos cookies para publicidad
              dirigida.
            </li>
            <li>
              <strong>Cookies de redes sociales:</strong> No integramos botones o widgets de redes sociales que puedan
              rastrearte.
            </li>
            <li>
              <strong>Cookies de terceros:</strong> No permitimos que terceros establezcan cookies en tu dispositivo a
              través de nuestro sitio.
            </li>
          </ul>

          <h2>4. Gestión de Cookies</h2>
          <p>
            Puedes controlar y/o eliminar las cookies como desees. Puedes borrar todas las cookies que ya están en tu
            dispositivo y configurar la mayoría de los navegadores para que no se almacenen.
          </p>

          <h3>Cómo Eliminar Cookies en HOLENTIA</h3>
          <p>Para eliminar las cookies utilizadas por HOLENTIA:</p>
          <ol>
            <li>Abre las herramientas de desarrollo de tu navegador (F12 en la mayoría de navegadores)</li>
            <li>Ve a la pestaña "Aplicación" o "Storage"</li>
            <li>Busca "Local Storage" y selecciona el dominio de HOLENTIA</li>
            <li>Elimina las entradas que desees</li>
          </ol>

          <p>
            O simplemente, borra los datos de navegación de tu navegador seleccionando "Cookies y otros datos de
            sitios".
          </p>

          <h2>5. Impacto de Eliminar Cookies</h2>
          <p>Si eliminas las cookies de HOLENTIA:</p>
          <ul>
            <li>Perderás tu preferencia de tema (modo claro/oscuro) y volverá al predeterminado del sistema.</li>
            <li>El modal de bienvenida podría mostrarse nuevamente en tu próxima visita.</li>
            <li>
              <strong>No afectará:</strong> Todas las herramientas seguirán funcionando normalmente, ya que no dependen
              de cookies para su operación.
            </li>
          </ul>

          <h2>6. Almacenamiento Local</h2>
          <p>
            HOLENTIA utiliza el almacenamiento local del navegador (localStorage) para guardar temporalmente datos de
            las herramientas que utilizas, como:
          </p>
          <ul>
            <li>Simulaciones guardadas en calculadoras</li>
            <li>Preferencias de visualización</li>
            <li>Estados de herramientas en uso</li>
          </ul>
          <p>
            <strong>Estos datos permanecen únicamente en tu dispositivo</strong> y nunca se transmiten a nuestros
            servidores ni a terceros.
          </p>

          <h2>7. Actualizaciones de Esta Política</h2>
          <p>
            Si en el futuro decidimos implementar nuevas funcionalidades que requieran el uso de cookies adicionales,
            actualizaremos esta política y te notificaremos claramente.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos a través de la sección de{" "}
            <Link href="/ayuda" className="text-blue-600 dark:text-blue-400 hover:underline">
              Ayuda
            </Link>
            .
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mt-8">
            <h3 className="mt-0">Nuestro Compromiso con Tu Privacidad</h3>
            <p className="mb-0">
              En HOLENTIA creemos que tu privacidad es un derecho fundamental. Por eso, hemos diseñado nuestra
              plataforma para funcionar sin necesidad de rastrear tu actividad, recopilar tus datos o monetizar tu
              información. Puedes usar nuestras herramientas con total confianza y tranquilidad.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
