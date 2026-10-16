"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MenuButtonProps {
  section?: string | null
  isSquare?: boolean
  isCompact?: boolean
}

// Mapa estático para que Tailwind genere las clases por sección
const sectionLinkClass: Record<string, string> = {
  mente: "text-mente",
  relaciones: "text-relaciones",
  cuerpo: "text-cuerpo-dark dark:text-cuerpo",
  finanzas: "text-finanzas",
}

const linkClass =
  "block px-5 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"

export default function MenuButton({ section, isSquare = false, isCompact = false }: MenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"

  // Determinar si estamos en una página de herramienta
  const isToolPage = pathname.split("/").filter(Boolean).length > 1

  const handleMenuToggle = () => {
    triggerHapticFeedback(isMenuOpen ? "light" : "medium")
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLinkClick = () => {
    triggerHapticFeedback("light")
    setIsMenuOpen(false)
  }

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Cerrar el menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isMenuOpen])

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Determinar si una sección está activa
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  if (!mounted) return null

  // Clases para el botón según el contexto
  const buttonClasses = [
    "relative z-50 flex items-center justify-center transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white",
    isMenuOpen
      ? "ring-2 ring-gray-900 dark:ring-white"
      : "shadow-sm",
    isCompact
      ? "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white shadow-none"
      : isToolPage
        ? "bg-white/30 hover:bg-white/40 active:bg-white/50 text-white shadow-none"
        : isDark
          ? "bg-gray-800/70 hover:bg-gray-800/90 text-white shadow-none"
          : "bg-white/70 hover:bg-white/90 text-gray-800",
    isSquare ? "rounded-md" : "rounded-full",
    "w-11 h-11",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        type="button"
        data-interactive="true"
        className={buttonClasses}
        onClick={handleMenuToggle}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span className="grid h-5 w-5 place-items-center">
          <Menu
            aria-hidden="true"
            className={`col-start-1 row-start-1 h-5 w-5 transition-all duration-200 ${
              isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            aria-hidden="true"
            className={`col-start-1 row-start-1 h-5 w-5 transition-all duration-200 ${
              isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </span>
      </button>

      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menú desplegable */}
          <div className="absolute right-0 top-12 z-50 w-64 animate-[hol-menu-in_0.15s_ease-out] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-3 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
            </div>

            <div className="py-2">
              <Link
                href="/"
                data-interactive="true"
                className={`${linkClass} ${
                  isActive("/")
                    ? "bg-gray-100 font-medium dark:bg-gray-800"
                    : ""
                }`}
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <span className="flex-grow">Inicio</span>
                  {isActive("/") && <span className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400" />}
                </span>
              </Link>

              {(["mente", "relaciones", "cuerpo", "finanzas"] as const).map((s) => (
                <Link
                  key={s}
                  href={`/${s}`}
                  data-interactive="true"
                  className={`${linkClass} capitalize ${
                    isActive(`/${s}`)
                      ? `bg-gray-100 font-medium dark:bg-gray-800 ${sectionLinkClass[s]}`
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  <span className="flex items-center">
                    <span className="flex-grow">{s}</span>
                    {isActive(`/${s}`) && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s === "mente"
                            ? "bg-mente"
                            : s === "relaciones"
                              ? "bg-relaciones"
                              : s === "cuerpo"
                                ? "bg-cuerpo"
                                : "bg-finanzas"
                        }`}
                      />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-1 border-t border-gray-200 py-2 dark:border-gray-700">
              <Link
                href="/que-es-holentia"
                data-interactive="true"
                className={linkClass}
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <span className="flex-grow">¿Qué es Holentia?</span>
                </span>
              </Link>
              <Link href="/ayuda" data-interactive="true" className={linkClass} onClick={handleLinkClick}>
                <span className="flex items-center">
                  <span className="flex-grow">Ayuda</span>
                </span>
              </Link>
              <Link
                href="/apoyar"
                data-interactive="true"
                className={`${linkClass} font-medium text-gray-900 dark:text-gray-100`}
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <span className="flex-grow">Hacer donación</span>
                </span>
              </Link>
            </div>

            <div className="mt-1 border-t border-gray-200 py-2 dark:border-gray-700">
              <Link
                href="/aviso-legal"
                data-interactive="true"
                className={`${linkClass} text-xs`}
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <span className="flex-grow">Aviso legal</span>
                </span>
              </Link>
              <Link
                href="/politica-cookies"
                data-interactive="true"
                className={`${linkClass} text-xs`}
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <span className="flex-grow">Política de cookies</span>
                </span>
              </Link>
            </div>

            <div className="mt-1 border-t border-gray-200 py-2 dark:border-gray-700">
              <button
                type="button"
                data-interactive="true"
                onClick={() => {
                  triggerHapticFeedback("medium")
                  setTheme(isDark ? "light" : "dark")
                  setIsMenuOpen(false)
                }}
                className="w-full px-5 py-3 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="flex items-center justify-between">
                  <span>Modo {isDark ? "Claro" : "Oscuro"}</span>
                  <span className="rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
