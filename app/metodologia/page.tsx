import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Calculator,
  Mail,
  Scale,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"
import { pageJsonLd, pageMetadata } from "@/lib/seo"
import { CERTIFICATE_REFERENCE_LABEL, RATES, RATE_META, formatRateDate } from "@/lib/rates"
import JsonLd from "@/components/tool-seo/json-ld"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"
import BrandDots from "@/components/common/brand-dots/brand-dots"

export function generateMetadata() {
  return pageMetadata(
    "Metodología y fuentes",
    "Cómo elegimos las fórmulas de HOLENTIA, qué fuentes oficiales usamos y cuándo revisamos cada tasa. Metodología abierta y sin cajas negras.",
    "/metodologia",
  )
}

const criterios = [
  {
    title: "Fuente oficial primero",
    desc: "Si existe una norma, resolución o manual público, esa es la referencia. Cuando no existe un dato único, lo decimos y damos un rango con contexto.",
  },
  {
    title: "Fórmula explicable",
    desc: "Preferimos la fórmula que puedes reproducir a mano o en una hoja de cálculo. Si un cálculo tiene un supuesto, aparece en la herramienta.",
  },
  {
    title: "Resultado comprobable",
    desc: "Las fórmulas de mayor impacto tienen tests con casos conocidos. Si cambia una tasa, el test falla hasta que se actualiza el caso.",
  },
  {
    title: "Límites visibles",
    desc: "Una estimación no es un diagnóstico ni una asesoría. Cada herramienta explica qué no puede saber con los datos que pides.",
  },
]

const limites = [
  "Los resultados son estimaciones educativas. No sustituyen una nómina, una liquidación del Ministerio de Trabajo, una factura eléctrica ni una asesoría profesional.",
  "Las tasas, topes y precios cambian. La fecha de revisión indica cuándo verificamos los valores, no una garantía de que sigan igual hoy.",
  "Las fórmulas de salud usan promedios de población. No conocen tu historial clínico, medicamentos, embarazo, composición corporal real ni contexto familiar.",
  "Los cálculos financieros usan los datos que escribes. Si el plazo, la tasa o el monto cambian, el resultado cambia: no es una predicción de mercado.",
  "No pedimos cuenta, no guardamos datos en un servidor y no podemos ver tus resultados. Esa privacidad también significa que no podemos corregir un dato tuyo desde fuera.",
]

const tasas = [
  {
    grupo: "tss" as const,
    area: "TSS",
    valor: `SFS ${(RATES.tss.sfsRate * 100).toFixed(2)}% · AFP ${(RATES.tss.afpRate * 100).toFixed(2)}% · topes RD$${RATES.tss.sfsCap.toLocaleString("es-DO")} / RD$${RATES.tss.afpCap.toLocaleString("es-DO")}`,
  },
  {
    grupo: "isr" as const,
    area: "ISR",
    valor: `Exento hasta ${RATES.isr.exemptUpTo.toLocaleString("es-DO")}; tramos 15%, 20% y 25%`,
  },
  {
    grupo: "itbis" as const,
    area: "ITBIS",
    valor: `General ${RATES.itbis.general * 100}% · reducido ${RATES.itbis.reduced * 100}%`,
  },
  {
    grupo: "severance" as const,
    area: "Prestaciones",
    valor: `Salario diario = mensual ÷ ${RATES.severance.dailyDivisor}`,
  },
  {
    grupo: "electricity" as const,
    area: "Electricidad",
    valor: `Cargo fijo RD$${RATES.electricity.fixedCharge} · tramos RD$${RATES.electricity.tier1Price} / RD$${RATES.electricity.tier2Price} / RD$${RATES.electricity.tier3Price} · umbral ${RATES.electricity.noTierThreshold} kWh`,
  },
  {
    grupo: "fuel" as const,
    area: "Combustible",
    valor: `Galón de referencia RD$${RATES.fuel.defaultGallonPrice} · ${RATES.fuel.litersPerGallon} L/galón`,
  },
  {
    grupo: "certificate" as const,
    area: "Certificados",
    valor: `${CERTIFICATE_REFERENCE_LABEL} · retención ${RATES.certificate.withholding * 100}% · año de ${RATES.certificate.daysPerYear} días`,
  },
  {
    grupo: "exchange" as const,
    area: "Tipo de cambio",
    valor: `RD$${RATES.exchange.usdToDop} por US$1 (redondeo de referencia)`,
  },
  {
    grupo: "aguinaldo" as const,
    area: "Aguinaldo",
    valor: `${RATES.aguinaldo.monthsPerYear} meses · pago máximo ${RATES.aguinaldo.paymentDeadline} · exento de ISR`,
  },
  {
    grupo: "inflation" as const,
    area: "Inflación",
    valor: `${RATES.inflation.referenceAnnual * 100}% anual (referencia)`,
  },
]

export default function MetodologiaPage() {
  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
      <JsonLd data={pageJsonLd("Metodología y fuentes", "/metodologia")} />
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            data-interactive="true"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <MenuButton />
        </div>

        <div className="flex flex-col items-center text-center mb-12">
          <Logo size="lg" />
          <BrandDots className="mt-5 mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Metodología y fuentes
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Cómo se calcula lo que ves, de dónde salen las tasas y qué límites tiene cada herramienta.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Última revisión editorial: {formatRateDate(RATE_META.general.reviewedAt)}
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Cómo elegimos una fórmula</h2>
            </div>
            <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              No hay una caja negra. Cada herramienta parte de una regla que se puede explicar, con una fuente
              verificable y un ejemplo que puedes repetir. Estos son los cuatro criterios que usamos.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {criterios.map((criterio) => (
                <div
                  key={criterio.title}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{criterio.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{criterio.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <Calculator className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tasas y referencias vigentes</h2>
            </div>
            <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Las herramientas financieras leen estos valores de un único archivo interno. La nota al pie de cada
              calculadora muestra la fecha de revisión y el enlace a la fuente.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">Tasas y referencias usadas por las herramientas financieras</caption>
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
                      Área
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
                      Referencia
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
                      Vigente desde
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
                      Fuente
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasas.map((tasa) => {
                    const meta = RATE_META[tasa.grupo]
                    return (
                      <tr key={tasa.grupo} className="border-t border-gray-200 dark:border-gray-700">
                        <th scope="row" className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">
                          {tasa.area}
                        </th>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{tasa.valor}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-400">
                          {formatRateDate(meta.effectiveFrom)}
                        </td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                          <a
                            href={meta.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-gray-300 underline-offset-2 hover:text-finanzas-dark dark:decoration-gray-600 dark:hover:text-finanzas-light"
                          >
                            {meta.source}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Los valores están fijados en el código y se revisan a mano. La app no consulta bancos, DGII ni
              instituciones en tiempo real.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Revisión y correcciones</h2>
            </div>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Revisamos las tasas y los textos al menos una vez al año, y antes de publicar una herramienta nueva. La
              fecha visible en las calculadoras financieras es la última revisión efectiva, no la fecha del build. Si
              una fuente cambia, actualizamos el valor, los tests y la nota al pie en el mismo cambio.
            </p>
            <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Si encuentras un dato desactualizado, un error de fórmula o una explicación confusa, escríbenos a{" "}
              <a
                href="mailto:soporte@holentia.com?subject=Correcci%C3%B3n%20de%20metodolog%C3%ADa"
                className="font-medium text-finanzas-dark underline underline-offset-2 hover:text-finanzas-darkest dark:text-finanzas-light dark:hover:text-finanzas-lighter"
              >
                soporte@holentia.com
              </a>
              . Incluye la página, el dato y, si puedes, la fuente que lo contradice.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Límites que debes tener claros</h2>
            </div>
            <ul className="space-y-3">
              {limites.map((limite) => (
                <li key={limite} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-finanzas dark:text-finanzas-light" aria-hidden />
                  <span>{limite}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Transparencia editorial</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              HOLENTIA no vende datos, no muestra anuncios personalizados y no recibe pagos de bancos ni de
              instituciones por recomendar un producto. Las referencias de rendimiento son rangos educativos, no una
              oferta. Cuando una guía menciona una fuente, la enlazamos en el texto.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/accesibilidad"
                data-interactive="true"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
              >
                Accesibilidad
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ayuda"
                data-interactive="true"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
              >
                Centro de ayuda
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:soporte@holentia.com"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Escribir
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
