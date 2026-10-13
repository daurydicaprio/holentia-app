"use client"

import Link from "next/link"

interface FooterProps {
  section?: string | null
}

// Enlace del crédito por sección (tokens, sin hex). Sin sección: neutro de la base.
const linkClassBySection: Record<string, string> = {
  mente: "text-mente hover:text-mente-dark dark:text-mente-light dark:hover:text-mente-lighter",
  relaciones:
    "text-relaciones hover:text-relaciones-dark dark:text-relaciones-light dark:hover:text-relaciones-lighter",
  cuerpo: "text-cuerpo-dark hover:text-cuerpo-darkest dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
  finanzas: "text-finanzas hover:text-finanzas-dark dark:text-finanzas-light dark:hover:text-finanzas-lighter",
}

const fallbackLinkClass =
  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 underline underline-offset-2"

export default function Footer({ section }: FooterProps) {
  const linkClass = (section && linkClassBySection[section]) || fallbackLinkClass

  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="mb-2">Hecho con ❤ 🇩🇴 #VERyGoodforlife</div>
      <div className="text-xs opacity-75">
        <Link
          href="https://daurydicaprio.com"
          target="_blank"
          className={`transition-colors duration-200 ${linkClass}`}
        >
          Daury DiCaprio
        </Link>
      </div>
    </footer>
  )
}
