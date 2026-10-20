"use client"

import Link from "next/link"

interface FooterProps {
  section?: string | null
}

// Enlace del crédito por sección (tokens, sin hex). Sin sección: neutro de la base.
// Claro: cuerpo arranca en `-darkest` y finanzas en `-dark` (la base no llega a 4.5:1 a 12px).
const linkClassBySection: Record<string, string> = {
  mente: "text-mente-dark hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter",
  relaciones:
    "text-relaciones hover:text-relaciones-dark dark:text-relaciones-light dark:hover:text-relaciones-lighter",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
  finanzas: "text-finanzas-dark hover:text-finanzas-darkest dark:text-finanzas-light dark:hover:text-finanzas-lighter",
}

const fallbackLinkClass =
  "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 underline underline-offset-2"

const siteLinks = [
  { href: "/herramientas", label: "Directorio de herramientas" },
  { href: "/guias", label: "Guías" },
  { href: "/que-es-holentia", label: "Qué es HOLENTIA" },
  { href: "/ayuda", label: "Ayuda" },
  { href: "/apoyar", label: "Apoyar" },
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/politica-cookies", label: "Política de cookies" },
] as const

export default function Footer({ section }: FooterProps) {
  const linkClass = (section && linkClassBySection[section]) || fallbackLinkClass

  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <nav aria-label="Enlaces del sitio" className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {siteLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-interactive="true"
            className="inline-block py-1.5 transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mb-2">Hecho con ❤ 🇩🇴 #VERyGoodforlife</div>
      <div className="text-xs">
        <Link
          href="https://daurydicaprio.com"
          target="_blank"
          data-interactive="true"
          className={`inline-block py-1 transition-colors duration-200 ${linkClass}`}
        >
          Daury DiCaprio
        </Link>
      </div>
    </footer>
  )
}
