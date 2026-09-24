"use client"

import ScrollToTop from "@/components/common/scroll-to-top/scroll-to-top"

// Unificado con ScrollToTop (haptics + colores canónicos, incluye relaciones).
// Solo cambia: se muestra únicamente en móvil (< 768px).
export default function MobileFab() {
  return <ScrollToTop mobileOnly />
}
