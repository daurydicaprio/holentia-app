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
    underlineClass: "bg-mente dark:bg-mente-light",
    focusClass: "focus-visible:ring-mente dark:focus-visible:ring-mente-light",
  },
  {
    href: "/relaciones",
    label: "Relaciones",
    section: "relaciones",
    activeClass: "text-relaciones dark:text-relaciones-light",
    hoverClass: "hover:text-relaciones-darkest dark:hover:text-relaciones-light",
    underlineClass: "bg-relaciones dark:bg-relaciones-light",
    focusClass: "focus-visible:ring-relaciones dark:focus-visible:ring-relaciones-light",
  },
  {
    href: "/cuerpo",
    label: "Cuerpo",
    section: "cuerpo",
    activeClass: "text-cuerpo-dark dark:text-cuerpo-light",
    hoverClass: "hover:text-cuerpo-darkest dark:hover:text-cuerpo-light",
    underlineClass: "bg-cuerpo-dark dark:bg-cuerpo-light",
    focusClass: "focus-visible:ring-cuerpo dark:focus-visible:ring-cuerpo-light",
  },
  {
    href: "/finanzas",
    label: "Finanzas",
    section: "finanzas",
    activeClass: "text-finanzas dark:text-finanzas-light",
    hoverClass: "hover:text-finanzas-darkest dark:hover:text-finanzas-light",
    underlineClass: "bg-finanzas dark:bg-finanzas-light",
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
            className={cn(
              "relative rounded-md px-4 py-2 text-sm transition-all duration-200",
              "text-gray-600 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              tab.focusClass,
              isActive ? cn(tab.activeClass, "font-semibold") : hoverClass,
            )}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-1 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all duration-300",
                isActive ? "w-8" : "w-0",
                tab.underlineClass,
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
