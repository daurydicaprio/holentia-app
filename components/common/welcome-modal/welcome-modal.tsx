"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Logo from "@/components/common/logo/logo"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    // Verificar si es la primera visita
    const hasVisited = localStorage.getItem("holentia-visited")

    if (!hasVisited) {
      setIsOpen(true)
      localStorage.setItem("holentia-visited", "true")
    }
  }, [])

  const handleClose = () => {
    triggerHapticFeedback("medium")
    setIsOpen(false)
  }

  const MotionDialogContent = motion(DialogContent)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <MotionDialogContent
        className="sm:max-w-md p-0 overflow-hidden border-0 shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Encabezado con gradiente */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-8 pb-16">
          <DialogHeader>
            <h2 className="text-center text-3xl font-bold text-white">Bienvenido a HOLENTIA</h2>
          </DialogHeader>
        </div>

        {/* Logo superpuesto sobre el borde del gradiente */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
            <Logo size="sm" />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 pt-2 pb-6">
          <div className="space-y-4 text-center">
            <p className="text-base text-gray-600 dark:text-gray-300">
              Descubre herramientas que transformarán tu bienestar integral. HOLENTIA te ofrece recursos para:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <motion.div
                className="bg-mente-glass/30 p-4 rounded-lg"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold text-mente-DEFAULT">Cultivar tu mente</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Claridad y bienestar emocional</p>
              </motion.div>

              <motion.div
                className="bg-cuerpo-glass/30 p-4 rounded-lg"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold text-cuerpo-DEFAULT">Energizar tu cuerpo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Salud y actividad física</p>
              </motion.div>

              <motion.div
                className="bg-finanzas-glass/30 p-4 rounded-lg"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold text-finanzas-DEFAULT">Dominar tus finanzas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Planificación y crecimiento</p>
              </motion.div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Explora, aprende y crece con nuestras calculadoras, simuladores y planificadores diseñados para mejorar tu
              calidad de vida.
            </p>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-2">
          <Button onClick={handleClose} className="w-full sm:w-auto px-8 py-6 text-base relative group overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-4 transition-all duration-300">
              Comenzar a explorar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </DialogFooter>
      </MotionDialogContent>
    </Dialog>
  )
}
