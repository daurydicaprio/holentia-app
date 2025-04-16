"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import DesktopHeader from "./desktop-header"
import MobileHeader from "./mobile-header"

export default function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null
  const isToolPage = pathParts.length > 1

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  if (!mounted) return null

  // Solo mostrar el header móvil en páginas de herramientas cuando estamos en dispositivo móvil
  if (isMobile && isToolPage) {
    return <MobileHeader section={section} />
  }

  // En todos los demás casos, mostrar el header de escritorio
  return <DesktopHeader />
}
