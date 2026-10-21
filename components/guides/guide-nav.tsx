import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import MenuButton from "@/components/common/menu-button/menu-button"

/**
 * Barra del detalle de guía: logo centrado y acciones simétricas a los lados.
 * Las columnas laterales comparten ancho para que el logo quede en el centro exacto.
 */
export default function GuideNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-background dark:border-gray-800">
      <div className="mx-auto flex h-20 max-w-5xl items-center px-4 sm:px-6">
        <div className="flex w-20 justify-start sm:w-44">
          <Link
            href="/guias"
            data-interactive="true"
            aria-label="Volver a todas las guías"
            className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 sm:w-auto sm:justify-start sm:px-3 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Todas las guías</span>
          </Link>
        </div>

        <div className="flex flex-1 justify-center">
          <Logo size="sm" />
        </div>

        <div className="flex w-20 justify-end sm:w-44">
          <MenuButton />
        </div>
      </div>
    </header>
  )
}
