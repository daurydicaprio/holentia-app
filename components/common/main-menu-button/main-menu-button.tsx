"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { motion, AnimatePresence } from "framer-motion"

interface MainMenuButtonProps {
  variant?: "default" | "tool" | "mobile"
  section?: string | null
}

export default function MainMenuButton({ variant = "default", section }: MainMenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determinar colores basados en la sección
  let accentColor = "#3B82F6" // Color azul por defecto
  let hoverBgColor = "rgba(59, 130, 246, 0.1)" // Color de fondo hover azul

  if (section === "mente") {
    accentColor = "#1976d2" // Color mente
    hoverBgColor = "rgba(25, 118, 210, 0.1)" // Color de fondo hover mente
  } else if (section === "cuerpo") {
    accentColor = "#ffa000" // Color cuerpo
    hoverBgColor = "rgba(255, 160, 0, 0.1)" // Color de fondo hover cuerpo
  } else if (section === "finanzas") {
    accentColor = "#388e3c" // Color finanzas
    hoverBgColor = "rgba(56, 142, 60, 0.1)" // Color de fondo hover finanzas
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"

  // Estilos base para el botón según la variante
  const getButtonStyles = () => {
    const baseStyles = {
      height: variant === "mobile" ? "44px" : "48px",
      width: variant === "mobile" ? "44px" : "48px",
      borderRadius: "9999px",
      backgroundColor: isDark
        ? variant === "tool"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(30, 30, 30, 0.7)"
        : variant === "tool"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(255, 255, 255, 0.7)",
      boxShadow: isMenuOpen
        ? `0 3px 10px rgba(0, 0, 0, 0.15), 0 0 0 2px ${accentColor}`
        : "0 2px 5px rgba(0, 0, 0, 0.08)",
      border: `1.5px solid ${isMenuOpen ? accentColor : isDark ? "#333333" : "#e5e7eb"}`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      position: "relative",
      overflow: "hidden",
      color: variant === "tool" ? "#ffffff" : "inherit",
    }

    return baseStyles
  }

  const handleMenuToggle = () => {
    triggerHapticFeedback(isMenuOpen ? "light" : "medium")
    setIsMenuOpen(!isMenuOpen)
  }

  // Función para cerrar el menú después de hacer clic en un enlace
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

  // Posicionamiento del menú según la variante
  const menuPosition = variant === "mobile" ? { top: "60px", right: "0" } : { top: "60px", right: "0" }

  // Ancho del menú según la variante
  const menuWidth = variant === "mobile" ? "64" : "72"

  return (
    <div ref={menuRef} className="relative" style={{ zIndex: 100 }}>
      <button
        ref={buttonRef}
        style={getButtonStyles()}
        className={`flex items-center justify-center ${
          variant === "mobile"
            ? "hover:bg-white/30 dark:hover:bg-white/30 active:bg-white/50 dark:active:bg-white/50"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        } active:scale-90 transition-transform`}
        onClick={handleMenuToggle}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <AnimatePresence mode="wait">
          {isMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              style={{ zIndex: 90 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menú desplegable */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute w-${menuWidth} border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden`}
              style={{
                ...menuPosition,
                zIndex: 100,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                backgroundColor: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="py-3 px-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
              </div>

              <div className="py-2">
                <Link
                  href="/"
                  className={`block px-5 py-3 transition-all duration-200 ${
                    isActive("/")
                      ? `font-medium bg-gray-100 dark:bg-gray-700`
                      : `hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Inicio</span>
                    {isActive("/") && <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400" />}
                  </div>
                </Link>

                <Link
                  href="/mente"
                  className={`block px-5 py-3 transition-all duration-200 ${
                    isActive("/mente")
                      ? `font-medium text-[#1976d2] bg-blue-50 dark:bg-blue-900/20`
                      : `hover:bg-blue-50 dark:hover:bg-blue-900/20`
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Mente</span>
                    {isActive("/mente") && <div className="w-2 h-2 rounded-full bg-[#1976d2]" />}
                  </div>
                </Link>

                <Link
                  href="/cuerpo"
                  className={`block px-5 py-3 transition-all duration-200 ${
                    isActive("/cuerpo")
                      ? `font-medium text-[#ffa000] bg-amber-50 dark:bg-amber-900/20`
                      : `hover:bg-amber-50 dark:hover:bg-amber-900/20`
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Cuerpo</span>
                    {isActive("/cuerpo") && <div className="w-2 h-2 rounded-full bg-[#ffa000]" />}
                  </div>
                </Link>

                <Link
                  href="/finanzas"
                  className={`block px-5 py-3 transition-all duration-200 ${
                    isActive("/finanzas")
                      ? `font-medium text-[#388e3c] bg-green-50 dark:bg-green-900/20`
                      : `hover:bg-green-50 dark:hover:bg-green-900/20`
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Finanzas</span>
                    {isActive("/finanzas") && <div className="w-2 h-2 rounded-full bg-[#388e3c]" />}
                  </div>
                </Link>
              </div>

              <div className="py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                <Link
                  href="/ayuda"
                  className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Ayuda</span>
                  </div>
                </Link>
                <Link
                  href="/apoyar"
                  className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  style={{ color: accentColor }}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Hacer donación</span>
                  </div>
                </Link>
              </div>

              <div className="py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                <button
                  onClick={() => {
                    triggerHapticFeedback("medium")
                    setTheme(isDark ? "light" : "dark")
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span>Modo {isDark ? "Claro" : "Oscuro"}</span>
                    <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
