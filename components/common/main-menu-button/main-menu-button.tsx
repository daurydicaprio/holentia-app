"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { motion, AnimatePresence } from "framer-motion"

export default function MainMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const menuRef = useRef(null)
  // Añadir estado para el efecto ripple
  const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Determinar el color del texto para el botón de donación
  let donationTextColor = "#3B82F6" // Color azul por defecto
  let buttonAccentColor = "#3B82F6" // Color azul por defecto
  let buttonHoverBgColor = "rgba(59, 130, 246, 0.1)" // Color de fondo hover azul
  let activeMenuItemBg = "rgba(59, 130, 246, 0.1)" // Color de fondo para ítem activo

  if (section === "mente") {
    donationTextColor = "#1976d2" // Color mente
    buttonAccentColor = "#1976d2" // Color mente
    buttonHoverBgColor = "rgba(25, 118, 210, 0.1)" // Color de fondo hover mente
    activeMenuItemBg = "rgba(25, 118, 210, 0.15)" // Color de fondo para ítem activo
  } else if (section === "cuerpo") {
    donationTextColor = "#ffa000" // Color cuerpo
    buttonAccentColor = "#ffa000" // Color cuerpo
    buttonHoverBgColor = "rgba(255, 160, 0, 0.1)" // Color de fondo hover cuerpo
    activeMenuItemBg = "rgba(255, 160, 0, 0.15)" // Color de fondo para ítem activo
  } else if (section === "finanzas") {
    donationTextColor = "#388e3c" // Color finanzas
    buttonAccentColor = "#388e3c" // Color finanzas
    buttonHoverBgColor = "rgba(56, 142, 60, 0.1)" // Color de fondo hover finanzas
    activeMenuItemBg = "rgba(56, 142, 60, 0.15)" // Color de fondo para ítem activo
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const buttonBgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.7)"
  const buttonBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  const menuBgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)"

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Mejorar el feedback táctil con intensidad basada en el estado del menú
    triggerHapticFeedback(isMenuOpen ? "light" : "medium")

    // Crear efecto ripple
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRipple({ active: true, x, y })

      // Desactivar el ripple después de la animación
      setTimeout(() => setRipple({ active: false, x: 0, y: 0 }), 700)
    }

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

  // Variantes de animación para el menú - Mejoradas para más fluidez
  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.92,
      y: -15,
      x: 20,
      transition: {
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1], // Curva de aceleración personalizada
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.0, 0.0, 0.2, 1.1], // Curva de desaceleración con ligero rebote
        staggerChildren: 0.05, // Añadir animación escalonada para los hijos
        delayChildren: 0.05, // Pequeño retraso antes de animar los hijos
      },
    },
  }

  // Variantes para los elementos del menú
  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  // Variantes de animación para el backdrop - Mejoradas para más fluidez
  const backdropVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1], // Curva de aceleración personalizada
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.0, 0.0, 0.2, 1], // Curva de desaceleración personalizada
      },
    },
  }

  // Variantes para el icono del menú - Nuevas animaciones más fluidas
  const iconVariants = {
    menu: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }, // Efecto de rebote suave
    },
    close: {
      rotate: 180,
      scale: 1,
      transition: { duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }, // Efecto de rebote suave
    },
  }

  if (!mounted) {
    return null
  }

  // Determinar si una sección está activa
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <div ref={menuRef} className="relative z-[2000] main-menu-button-container">
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        style={{
          height: "48px",
          width: "48px",
          borderRadius: "9999px",
          backgroundColor: buttonBgColor,
          boxShadow: isMenuOpen
            ? `0 3px 10px rgba(0, 0, 0, 0.15), 0 0 0 2px ${buttonAccentColor}`
            : "0 2px 5px rgba(0, 0, 0, 0.08)",
          border: `1.5px solid ${isMenuOpen ? buttonAccentColor : buttonBorderColor}`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Transición más suave con rebote
          position: "relative",
          zIndex: 1000,
          overflow: "hidden", // Para contener el efecto ripple
        }}
        className="active:scale-90 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleMenuToggle}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = buttonAccentColor
          e.currentTarget.style.backgroundColor = buttonHoverBgColor
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseOut={(e) => {
          if (!isMenuOpen) {
            e.currentTarget.style.borderColor = buttonBorderColor
            e.currentTarget.style.backgroundColor = buttonBgColor
          }
          e.currentTarget.style.transform = "scale(1)"
        }}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {/* Efecto ripple */}
        {ripple.active && (
          <span
            className="absolute rounded-full bg-white/30 dark:bg-white/20 animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "120px",
              height: "120px",
              marginLeft: "-60px",
              marginTop: "-60px",
            }}
          />
        )}

        <div className="relative w-6 h-6">
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }} // Transición más suave con rebote
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }} // Transición más suave con rebote
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              className="absolute right-0 top-[60px] w-72 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
              style={{
                zIndex: 2001,
                backdropFilter: "blur(20px)", // Aumentado para mejor efecto
                WebkitBackdropFilter: "blur(20px)", // Aumentado para mejor efecto
                backgroundColor: menuBgColor,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)", // Sombra mejorada
                transformOrigin: "top right", // Origen de la animación desde la esquina superior derecha
              }}
            >
              <motion.div
                className="py-3 px-5 border-b border-gray-200 dark:border-gray-700"
                variants={menuItemVariants}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
              </motion.div>
              <div className="py-2">
                <motion.div variants={menuItemVariants}>
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
                      {isActive("/") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
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
                      {isActive("/mente") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2 h-2 rounded-full bg-[#1976d2]"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
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
                      {isActive("/cuerpo") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2 h-2 rounded-full bg-[#ffa000]"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
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
                      {isActive("/finanzas") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2 h-2 rounded-full bg-[#388e3c]"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="py-2 border-t border-gray-200 dark:border-gray-700 mt-1"
                variants={menuItemVariants}
              >
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
                  style={{ color: donationTextColor }}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">Hacer donación</span>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                className="py-2 border-t border-gray-200 dark:border-gray-700 mt-1"
                variants={menuItemVariants}
              >
                <button
                  onClick={() => {
                    triggerHapticFeedback("medium")
                    setTheme(currentTheme === "dark" ? "light" : "dark")
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
                      className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full"
                    >
                      {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </motion.div>
                  </div>
                </button>
              </motion.div>
            </motion.div>

            {/* Backdrop mejorado */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              className="fixed inset-0"
              style={{
                zIndex: 1999,
                backdropFilter: "blur(12px)", // Aumentado para mejor efecto
                WebkitBackdropFilter: "blur(12px)", // Aumentado para mejor efecto
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Más oscuro para mejor contraste
              }}
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
