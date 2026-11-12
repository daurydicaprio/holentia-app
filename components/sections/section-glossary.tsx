import Link from "next/link"
import { AlertCircle, ArrowRight, BookOpen, ExternalLink, Lightbulb } from "lucide-react"
import type { SectionGlossaryContent, GlossarySection } from "@/lib/section-glossary"
import { cn } from "@/lib/utils"

interface SectionGlossaryProps {
  section: GlossarySection
  content: SectionGlossaryContent
}

// Clases estáticas por sección: Tailwind las ve completas y no depende de templates.
const sectionStyles: Record<
  GlossarySection,
  {
    accent: string
    eyebrow: string
    example: string
    link: string
    source: string
    focus: string
  }
> = {
  mente: {
    accent: "text-mente-dark dark:text-mente-light",
    eyebrow: "text-mente-darkest dark:text-mente-light",
    example: "bg-mente-lighter text-gray-900 dark:bg-mente-dark dark:text-gray-100",
    link: "text-mente-dark hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter",
    source: "text-mente-dark hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter",
    focus: "focus-visible:ring-mente dark:focus-visible:ring-mente-light",
  },
  relaciones: {
    accent: "text-relaciones-dark dark:text-relaciones-lighter",
    eyebrow: "text-relaciones-darkest dark:text-relaciones-lighter",
    example: "bg-relaciones-lighter text-gray-900 dark:bg-relaciones-dark dark:text-gray-100",
    link: "text-relaciones-dark hover:text-relaciones-darkest dark:text-relaciones-lighter dark:hover:text-white",
    source:
      "text-relaciones-dark hover:text-relaciones-darkest dark:text-relaciones-lighter dark:hover:text-white",
    focus: "focus-visible:ring-relaciones dark:focus-visible:ring-relaciones-light",
  },
  cuerpo: {
    accent: "text-cuerpo-darkest dark:text-cuerpo-light",
    eyebrow: "text-cuerpo-darkest dark:text-cuerpo-light",
    example: "bg-cuerpo-lighter text-gray-900 dark:bg-cuerpo-darkest dark:text-gray-100",
    link: "text-cuerpo-darkest underline-offset-2 hover:underline dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
    source:
      "text-cuerpo-darkest underline-offset-2 hover:underline dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
    focus: "focus-visible:ring-cuerpo dark:focus-visible:ring-cuerpo-light",
  },
}

/**
 * Glosario breve de un hub. Server component: todo el texto queda en el HTML
 * inicial para SEO/GEO y no añade estado ni persistencia.
 */
export default function SectionGlossary({ section, content }: SectionGlossaryProps) {
  const styles = sectionStyles[section]

  return (
    <section
      id="conceptos-clave"
      aria-labelledby="conceptos-clave-title"
      className="w-full max-w-6xl mx-auto px-4 mt-12 scroll-mt-8"
    >
      <div className="border-t border-gray-200 pt-10 dark:border-gray-700">
        <div className="max-w-3xl">
          <p className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-wide", styles.eyebrow)}>
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            Glosario de la sección
          </p>
          <h2 id="conceptos-clave-title" className="mt-2 text-2xl font-bold sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {content.intro}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {content.terms.map((item) => (
            <article
              key={item.slug}
              id={`concepto-${item.slug}`}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className={cn("text-lg font-semibold", styles.accent)}>{item.term}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {item.definition}
              </p>
              <p
                className={cn(
                  "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-relaxed",
                  styles.example,
                )}
              >
                <Lightbulb aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{item.example}</span>
              </p>
              {item.related && item.related.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {item.related.map((link) => (
                    <Link
                      key={link.slug}
                      href={`/${link.slug}`}
                      data-interactive="true"
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        styles.link,
                        styles.focus,
                      )}
                    >
                      {link.label}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <AlertCircle aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", styles.accent)} />
            <span>{content.disclaimer}</span>
          </p>
          {content.sources.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              Fuentes:{" "}
              {content.sources.map((source, index) => (
                <span key={source.href}>
                  {index > 0 && " · "}
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-interactive="true"
                    className={cn(
                      "inline-flex items-center gap-1 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      styles.source,
                      styles.focus,
                    )}
                  >
                    {source.label}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
