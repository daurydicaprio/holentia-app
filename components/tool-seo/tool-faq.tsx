import type { FaqItem } from "@/lib/seo"

interface ToolFaqProps {
  faq: FaqItem[]
}

/** FAQ visible en HTML (server) — aporta contenido citable para buscadores y AI crawlers */
export default function ToolFaq({ faq }: ToolFaqProps) {
  if (faq.length === 0) return null

  return (
    <section aria-labelledby="faq-heading" className="mt-10 rounded-2xl border border-gray-200 bg-white/60 p-6 dark:border-gray-700 dark:bg-black/20">
      <h2 id="faq-heading" className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Preguntas frecuentes
      </h2>
      <dl className="space-y-4">
        {faq.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-gray-800 dark:text-gray-100">{item.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
