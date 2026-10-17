"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"

const TABS = [
  {
    href: "/mente",
    label: "Mente",
    section: "mente",
    activeClass: "text-mente dark:text-mente-light",
    hoverClass: "hover:text-mente-darkest dark:hover:text-mente-light",
    focusClass: "focus-visible:ring-mente dark:focus-visible:ring-mente-light",
  },
  {
    href: "/relaciones",
    label: "Relaciones",
    section: "relaciones",
    activeClass: "text-relaciones dark:text-relaciones-light",
    hoverClass: "hover:text-relaciones-darkest dark:hover:text-relaciones-light",
    focusClass: "focus-visible:ring-relaciones dark:focus-visible:ring-relaciones-light",
  },
  {
    href: "/cuerpo",
    label: "Cuerpo",
    section: "cuerpo",
    activeClass: "text-cuerpo-darkest dark:text-cuerpo-light",
    hoverClass: "hover:text-cuerpo-darkest dark:hover:text-cuerpo-light",
    focusClass: "focus-visible:ring-cuerpo dark:focus-visible:ring-cuerpo-light",
  },
  {
    href: "/finanzas",
    label: "Finanzas",
    section: "finanzas",
    activeClass: "text-finanzas-dark dark:text-finanzas-light",
    hoverClass: "hover:text-finanzas-darkest dark:hover:text-finanzas-light",
    focusClass: "focus-visible:ring-finanzas dark:focus-visible:ring-finanzas-light",
  },
] as const

interface SectionTabsProps {
  /** true en la home (página monocroma): hovers neutros, sin colores de sección. */
  neutral?: boolean
}

export default function SectionTabs({ neutral = false }: SectionTabsProps) {
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()

  const activeSection = pathname?.split("/").filter(Boolean)[0] ?? null

  return (
    <nav aria-label="Secciones" className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
      {TABS.map((tab) => {
        const isActive = activeSection === tab.section
        const hoverClass = neutral ? "hover:text-gray-900 dark:hover:text-white" : tab.hoverClass
        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={() => triggerHapticFeedback("light")}
            data-interactive="true"
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-4 py-2.5 text-sm transition-colors duration-200",
              "text-gray-600 dark:text-gray-400",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              tab.focusClass,
              isActive ? cn(tab.activeClass, "font-semibold") : hoverClass,
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
