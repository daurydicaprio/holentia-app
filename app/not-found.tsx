import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col items-center justify-center p-4 text-center focus:outline-none">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o no está disponible en este momento.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  )
}
