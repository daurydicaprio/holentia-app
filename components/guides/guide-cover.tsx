import Image from "next/image"
import { Activity, BookOpen, Brain, Compass, Heart, TrendingUp, Wallet, type LucideIcon } from "lucide-react"
import type { GuideCategory } from "@/types/guide"

type CoverVariant = "featured" | "grid" | "compact"

interface CoverTheme {
  background: string
  mark: string
  markClass: string
  icon: LucideIcon
  iconClass: string
  ringClass: string
  wordmarkClass: string
}

const coverThemes: Record<string, CoverTheme> = {
  growth: {
    background: "bg-gradient-to-br from-finanzas-darkest via-finanzas-dark to-finanzas",
    mark: "10%",
    markClass: "text-white/15",
    icon: TrendingUp,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
  salary: {
    background: "bg-gradient-to-br from-mente-dark via-mente to-mente-light",
    mark: "RD$",
    markClass: "text-white/15",
    icon: Wallet,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
  body: {
    background: "bg-gradient-to-br from-cuerpo-dark via-cuerpo to-cuerpo-light",
    mark: "%",
    markClass: "text-black/15",
    icon: Activity,
    iconClass: "text-black/25",
    ringClass: "border-black/10",
    wordmarkClass: "text-black/45",
  },
  invest: {
    background: "bg-gradient-to-br from-finanzas-darkest via-finanzas-dark to-finanzas-accent",
    mark: "0→1",
    markClass: "text-white/15",
    icon: Compass,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
}

const categoryFallback: Record<GuideCategory, CoverTheme> = {
  mente: {
    background: "bg-gradient-to-br from-mente-dark via-mente to-mente-light",
    mark: "H",
    markClass: "text-white/15",
    icon: Brain,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
  relaciones: {
    background: "bg-gradient-to-br from-relaciones-dark via-relaciones to-relaciones-light",
    mark: "H",
    markClass: "text-white/15",
    icon: Heart,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
  cuerpo: {
    background: "bg-gradient-to-br from-cuerpo-dark via-cuerpo to-cuerpo-light",
    mark: "H",
    markClass: "text-black/15",
    icon: Activity,
    iconClass: "text-black/25",
    ringClass: "border-black/10",
    wordmarkClass: "text-black/45",
  },
  finanzas: {
    background: "bg-gradient-to-br from-finanzas-darkest via-finanzas-dark to-finanzas",
    mark: "H",
    markClass: "text-white/15",
    icon: Wallet,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
  general: {
    background: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600",
    mark: "H",
    markClass: "text-white/15",
    icon: BookOpen,
    iconClass: "text-white/30",
    ringClass: "border-white/10",
    wordmarkClass: "text-white/50",
  },
}

const markSize: Record<CoverVariant, string> = {
  featured: "bottom-5 left-5 text-7xl sm:bottom-6 sm:left-6 sm:text-8xl",
  grid: "bottom-3.5 left-4 text-5xl",
  compact: "bottom-2.5 left-3 text-3xl",
}

const iconSize: Record<CoverVariant, string> = {
  featured: "right-5 top-5 h-16 w-16 sm:right-6 sm:top-6 sm:h-20 sm:w-20",
  grid: "right-4 top-4 h-11 w-11",
  compact: "right-3 top-3 h-7 w-7",
}

const wordmarkSize: Record<CoverVariant, string> = {
  featured: "bottom-5 right-5 text-[10px] sm:bottom-6 sm:right-6",
  grid: "bottom-3.5 right-4 text-[9px]",
  compact: "hidden",
}

const defaultSizes: Record<CoverVariant, string> = {
  featured: "(min-width: 1024px) 720px, 100vw",
  grid: "(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw",
  compact: "(min-width: 1024px) 144px, (min-width: 640px) 128px, 112px",
}

interface GuideCoverProps {
  category: GuideCategory
  cover?: string
  image?: string
  imageAlt?: string
  variant?: CoverVariant
  className: string
  sizes?: string
  priority?: boolean
}

/**
 * Portada editorial: foto local cuando existe y, si no, gradiente de marca.
 * La foto se sirve desde `public/guias/`; nunca se hacen llamadas a terceros.
 */
export default function GuideCover({
  category,
  cover,
  image,
  imageAlt,
  variant = "grid",
  className,
  sizes,
  priority = false,
}: GuideCoverProps) {
  if (image) {
    return (
      <div
        className={`relative isolate overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 ${className}`}
      >
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          priority={priority}
          sizes={sizes ?? defaultSizes[variant]}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    )
  }

  const theme = (cover && coverThemes[cover]) || categoryFallback[category] || categoryFallback.general
  const Icon = theme.icon

  return (
    <div
      aria-hidden="true"
      className={`relative isolate overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 ${theme.background} ${className}`}
    >
      <span className="guide-cover-grid absolute inset-0" />
      <span
        className={`absolute -right-16 -top-20 h-56 w-56 rounded-full border-[22px] ${theme.ringClass}`}
      />
      <span
        className={`absolute -bottom-24 -left-16 h-56 w-56 rounded-full border-[18px] ${theme.ringClass}`}
      />
      <span
        className={`absolute font-black leading-none tracking-tighter ${markSize[variant]} ${theme.markClass}`}
      >
        {theme.mark}
      </span>
      <Icon
        strokeWidth={1.2}
        className={`absolute ${iconSize[variant]} ${theme.iconClass}`}
      />
      <span
        className={`absolute font-semibold uppercase tracking-[0.2em] ${wordmarkSize[variant]} ${theme.wordmarkClass}`}
      >
        HOLENTIA
      </span>
    </div>
  )
}
