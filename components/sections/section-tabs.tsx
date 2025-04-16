"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function SectionTabs() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    // Extraer la sección del pathname
    const section = pathname.split("/")[1]
    if (section && ["mente", "cuerpo", "finanzas"].includes(section)) {
      setActiveTab(section)
    } else {
      setActiveTab(null)
    }
  }, [pathname])

  const handleTabClick = () => {
    triggerHapticFeedback("light")
  }

  // Determinar las clases para cada pestaña
  const menteTabClass =
    activeTab === "mente"
      ? "text-mente-DEFAULT section-tab-active"
      : "text-gray-600 dark:text-gray-400 opacity-70 hover:opacity-90 hover:text-mente-DEFAULT"

  const cuerpoTabClass =
    activeTab === "cuerpo"
      ? "text-cuerpo-DEFAULT section-tab-active"
      : "text-gray-600 dark:text-gray-400 opacity-70 hover:opacity-90 hover:text-cuerpo-DEFAULT"

  const finanzasTabClass =
    activeTab === "finanzas"
      ? "text-finanzas-DEFAULT section-tab-active"
      : "text-gray-600 dark:text-gray-400 opacity-70 hover:opacity-90 hover:text-finanzas-DEFAULT"

  return (
    <div className="flex gap-4 justify-center flex-wrap mt-6">
      <Link href="/mente" className={`section-tab section-tab-mente ${menteTabClass}`} onClick={handleTabClick}>
        Mente
      </Link>

      <Link href="/cuerpo" className={`section-tab section-tab-cuerpo ${cuerpoTabClass}`} onClick={handleTabClick}>
        Cuerpo
      </Link>

      <Link
        href="/finanzas"
        className={`section-tab section-tab-finanzas ${finanzasTabClass}`}
        onClick={handleTabClick}
      >
        Finanzas
      </Link>
    </div>
  )
}
