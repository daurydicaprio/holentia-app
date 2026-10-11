"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import type { FaqItem } from "@/lib/seo"

// Mapa estático para que Tailwind genere las clases por sección
// Hover suave con el tinte "lighter" de cada sección (no el glass, que es demasiado fuerte para filas de texto)
const sectionFaqStyles: Record<string, { hover: string; iconWrap: string; icon: string }> = {
  mente: {
    hover: "hover:bg-mente-lighter/30",
    iconWrap: "bg-mente-lighter/50 group-hover:bg-mente-lighter",
    icon: "text-mente-DEFAULT dark:text-mente-light",
  },
  relaciones: {
    hover: "hover:bg-relaciones-lighter/30",
    iconWrap: "bg-relaciones-lighter/50 group-hover:bg-relaciones-lighter",
    icon: "text-relaciones-DEFAULT dark:text-relaciones-light",
  },
  cuerpo: {
    hover: "hover:bg-cuerpo-lighter/40",
    iconWrap: "bg-cuerpo-lighter/50 group-hover:bg-cuerpo-lighter",
    icon: "text-cuerpo-dark dark:text-cuerpo-light",
  },
  finanzas: {
    hover: "hover:bg-finanzas-lighter/30",
    iconWrap: "bg-finanzas-lighter/50 group-hover:bg-finanzas-lighter",
    icon: "text-finanzas-DEFAULT dark:text-finanzas-light",
  },
}

interface ToolFaqProps {
  faq: FaqItem[]
  section?: string
}

/** FAQ en acordeón (una pregunta abierta a la vez) — el contenido sigue en el HTML inicial para SEO */
export default function ToolFaq({ faq, section = "finanzas" }: ToolFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (faq.length === 0) return null

  const styles = sectionFaqStyles[section] ?? sectionFaqStyles.finanzas

  return (
    <section aria-labelledby="faq-heading" className="mt-10 rounded-2xl border border-gray-200 bg-white/60 p-6 dark:border-gray-700 dark:bg-black/20">
      <h2 id="faq-heading" className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Preguntas frecuentes
      </h2>
      <div className="space-y-3">
        {faq.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={item.question}
              className="rounded-xl border border-gray-200/80 bg-white/50 dark:border-gray-700/80 dark:bg-black/20"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-gray-800 transition-colors dark:text-gray-100 ${styles.hover}`}
                >
                  <span>{item.question}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${styles.iconWrap}`}
                  >
                    {isOpen ? (
                      <Minus aria-hidden="true" className={`h-4 w-4 ${styles.icon}`} />
                    ) : (
                      <Plus aria-hidden="true" className={`h-4 w-4 ${styles.icon}`} />
                    )}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
