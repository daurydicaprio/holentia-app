"use client"

import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Algo salió mal</h1>
      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
        Ocurrió un error inesperado al cargar esta página. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
