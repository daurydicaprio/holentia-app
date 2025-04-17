"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Logo from "@/components/common/logo/logo"
import { ArrowRight } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    setMounted(true)

    // Verificar si es la primera visita
    const hasVisited = localStorage.getItem("holentia-visited")

    if (!hasVisited) {
      // Pequeño retraso para asegurar que el componente esté montado
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("holentia-visited", "true")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    triggerHapticFeedback("medium")
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-900"
        style={{
          width: "95vw",
          maxWidth: "500px",
          borderRadius: "16px",
        }}
      >
        {/* Encabezado con diseño minimalista */}
        <div className="relative bg-gradient-to-r from-blue-500 to-green-500 p-6">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
              <Logo size="sm" />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 pt-10 pb-4 mt-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Bienvenido a HOLENTIA
          </h2>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            Descubre herramientas que transformarán tu bienestar integral en tres áreas clave:
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Mente</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">Cuerpo</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <span className="text-green-600 dark:text-green-400 font-medium text-sm">Finanzas</span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0">
          <Button
            onClick={handleClose}
            className="w-full py-2 relative group transition-all duration-300 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
              Comenzar a explorar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
