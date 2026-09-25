"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Gauge,
  RotateCcw,
  Trash2,
  Info,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Wallet,
  ChevronDown,
  PiggyBank,
  ShieldAlert,
  PieChart,
  CheckCircle2,
  ClipboardList,
  Landmark,
} from "lucide-react"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useMediaQuery } from "@/hooks/use-media-query"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { RiskLevelsGraphic, LEVELS } from "./risk-levels-graphic"
import { FundProjectionChart } from "./fund-projection-chart"
import { Disclosure } from "./disclosure"

const DRAFT_KEY = draftKey("test-perfil-riesgo")

interface RiskDraft {
  answers?: Record<number, string>
  showResults?: boolean
  level?: number
  capital?: string
  currency?: "USD" | "DOP"
  rates?: Partial<Record<RateKey, string>>
  monthlyIncome?: string
  fundMultiplier?: number
  savePct?: string
  savedAt?: string
}

interface Option {
  text: string
  key: string
  risk?: number
  ceiling?: number
  situation?: "A" | "B" | "C"
  richQuick?: boolean
}

interface Question {
  id: number
  text: string
  hint?: string
  options: Option[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "Inviertes 10,000 y al mes ves en tu app que solo valen 8,000. ¿Qué harías?",
    hint: "Responde como lo harías de verdad, no como te gustaría.",
    options: [
      { text: "Vender todo: no soporto perder", key: "q1_sell", risk: 1 },
      { text: "Me preocupo, pero no toco nada", key: "q1_hold", risk: 2 },
      { text: "Es normal: el dinero no se pierde hasta que vendo", key: "q1_calm", risk: 3 },
    ],
  },
  {
    id: 2,
    text: "En las noticias dicen que las acciones están cayendo fuerte (todo en números rojos). Tú…",
    options: [
      { text: "Salgo de todo hasta que se calme", key: "q2_exit", risk: 1 },
      { text: "Espero sentado, no muevo nada", key: "q2_wait", risk: 2 },
      { text: "Compro más: está de oferta", key: "q2_buy", risk: 3 },
    ],
  },
  {
    id: 3,
    text: "¿Para qué es este dinero que vas a invertir?",
    options: [
      { text: "Un gasto que tengo cerca (auto, viaje, gastos)", key: "q3_short", risk: 1 },
      { text: "Una meta a 3–10 años (casa, hijos, negocio)", key: "q3_mid", risk: 2 },
      { text: "Jubilación o legado: 10+ años sin tocarlo", key: "q3_long", risk: 3 },
    ],
  },
  {
    id: 4,
    text: "¿Alguna vez has invertido o puesto tu dinero a plazo?",
    hint: "Ser honesto aquí te ahorra dinero.",
    options: [
      { text: "Nunca: apenas voy a empezar", key: "q4_none", ceiling: 1 },
      { text: "Solo ahorro en el banco (CD, cuenta)", key: "q4_bank", ceiling: 2 },
      { text: "He puesto dinero en fondos o en la bolsa", key: "q4_funds", ceiling: 3 },
      { text: "Sé qué es un ETF y leo noticias de empresas", key: "q4_adv", ceiling: 3 },
    ],
  },
  {
    id: 5,
    text: "¿Tienes un fondo de emergencia (dinero aparte para imprevistos)?",
    options: [
      { text: "No, y no tengo nada ahorrado", key: "q5_none", situation: "A" },
      { text: "Tengo algo, pero no sé si alcanza", key: "q5_some", situation: "A" },
      { text: "Sí, tengo varios meses de gastos cubiertos", key: "q5_yes", situation: "B" },
    ],
  },
  {
    id: 6,
    text: "¿Cómo es tu ingreso?",
    options: [
      { text: "Empleo fijo y estable por ahora", key: "q6_job", situation: "B" },
      { text: "Independiente o negocio propio", key: "q6_free", situation: "C" },
      { text: "Pueden reducirme o despedirme pronto", key: "q6_risk", situation: "C" },
    ],
  },
  {
    id: 7,
    text: "Si tu inversión bajara 30% y la dejas quieta… ¿podrías aguantar?",
    options: [
      { text: "No: ese dinero lo necesito o me hace falta", key: "q7_no", risk: 1 },
      { text: "Sí, esperaría 1–3 años a que se recupere", key: "q7_wait", risk: 2 },
      { text: "Sí, no lo tocaré en 10+ años", key: "q7_ten", risk: 3 },
    ],
  },
  {
    id: 8,
    text: "Entre estas dos, ¿cuál te haría más feliz?",
    options: [
      { text: "Ganar 5% seguro, sin sustos", key: "q8_safe", risk: 1 },
      { text: "Un punto medio: algo de riesgo, algo seguro", key: "q8_mix", risk: 2 },
      { text: "Que crezca lo máximo, aunque vaya en montaña rusa", key: "q8_max", risk: 3 },
    ],
  },
  {
    id: 9,
    text: "De todo lo que tienes ahorrado, este dinero…",
    options: [
      { text: "Es casi todo, o lo voy a necesitar pronto", key: "q9_all", risk: 1 },
      { text: "Es una parte que puedo dejar quieta un par de años", key: "q9_part", risk: 2 },
      { text: "Es de lo que no necesito por muchos años", key: "q9_extra", risk: 3 },
    ],
  },
  {
    id: 10,
    text: "¿Qué te haría dormir mejor por la noche?",
    options: [
      { text: "Ver que mi saldo nunca baja, aunque crezca lento", key: "q10_safe", risk: 1 },
      { text: "Un equilibrio: crecer sin volverse loco", key: "q10_bal", risk: 2 },
      { text: "Aceptar bajadas fuertes si a cambio crece más", key: "q10_growth", risk: 3 },
    ],
  },
  {
    id: 11,
    text: "¿Cuál es tu meta real al invertir?",
    options: [
      { text: "No perder poder de compra (la inflación)", key: "q11_infl", risk: 1 },
      { text: "Alcanzar una meta concreta (casa, negocio…)", key: "q11_goal", risk: 2 },
      { text: "Hacer crecer el patrimonio a 20–30 años", key: "q11_wealth", risk: 3 },
      { text: "Hacerme rico lo antes posible", key: "q11_rich", risk: 3, richQuick: true },
    ],
  },
  {
    id: 12,
    text: "¿Cada cuánto revisarías tu inversión?",
    options: [
      { text: "Todos los días, varias veces", key: "q12_daily", risk: 1 },
      { text: "Un par de veces al año", key: "q12_rare", risk: 3 },
      { text: "Solo si hace falta / lo tengo automatizado", key: "q12_auto", risk: 2 },
    ],
  },
]

interface Slice {
  label: string
  pct: number
}

const sliceColors = ["#2e7d32", "#66bb6a", "#a5d6a7", "#1b5e20", "#81c784", "#c8e6c9"]

/** Distribuciones SOLO de capital a invertir (el fondo de emergencia va aparte). */
const portfolios: Record<number, Record<"A" | "B" | "C", Slice[]>> = {
  1: {
    A: [
      { label: "AFI líquido", pct: 55 },
      { label: "Certificados", pct: 45 },
    ],
    B: [
      { label: "Certificados", pct: 50 },
      { label: "AFI líquido", pct: 50 },
    ],
    C: [
      { label: "AFI líquido", pct: 45 },
      { label: "Certificados cortos", pct: 55 },
    ],
  },
  2: {
    A: [
      { label: "ETF global indexado", pct: 60 },
      { label: "AFI líquido / estabilidad", pct: 40 },
    ],
    B: [
      { label: "ETF global indexado", pct: 80 },
      { label: "Bonos / estabilidad", pct: 20 },
    ],
    C: [
      { label: "ETF global indexado", pct: 70 },
      { label: "AFI líquido", pct: 30 },
    ],
  },
  3: {
    A: [
      { label: "ETF indexado (base)", pct: 70 },
      { label: "Acciones (máx. 7–10)", pct: 30 },
    ],
    B: [
      { label: "ETF indexado (base)", pct: 65 },
      { label: "Acciones (máx. 7–10)", pct: 35 },
    ],
    C: [
      { label: "ETF indexado", pct: 75 },
      { label: "Acciones (pocas)", pct: 25 },
    ],
  },
}

/** Versión en dólares: sin AFI local (no existe en USD); único instrumento propio es el fondo a 30 días. */
const portfoliosUsd: Record<number, Record<"A" | "B" | "C", Slice[]>> = {
  ...portfolios,
  1: {
    A: [{ label: "Fondo a 30 días (USD)", pct: 100 }],
    B: [{ label: "Fondo a 30 días (USD)", pct: 100 }],
    C: [{ label: "Fondo a 30 días (USD)", pct: 100 }],
  },
  2: {
    A: [
      { label: "ETF global indexado", pct: 60 },
      { label: "Fondo a 30 días (USD)", pct: 40 },
    ],
    B: [
      { label: "ETF global indexado", pct: 80 },
      { label: "Bonos / estabilidad", pct: 20 },
    ],
    C: [
      { label: "ETF global indexado", pct: 70 },
      { label: "Fondo a 30 días (USD)", pct: 30 },
    ],
  },
}

const situationMeta: Record<"A" | "B" | "C", { title: string; pickIf: string }> = {
  A: {
    title: "Opción A · Prioriza seguridad",
    pickIf: "Tu ingreso es inestable o apenas construyes colchón: más liquidez, menos riesgo.",
  },
  B: {
    title: "Opción B · Estándar",
    pickIf: "Ingreso estable y colchón: estructura equilibrada para crecer a largo plazo.",
  },
  C: {
    title: "Opción C · Ingresos variables",
    pickIf: "Independiente o empleo en riesgo: mantén más disponibilidad sin frenar del todo.",
  },
}

const ABC_DOP = 50000
const ABC_USD = 3000
const INSTR_MIN = {
  DOP: { liquid: 5000, cert: 10000, d30: 10000 },
  USD: { d30: 200 },
}
/** Hasta aquí el capital se considera "pequeño" → nivel 1–2. */
const LEVEL_CAP: Record<"USD" | "DOP", number> = { DOP: 5000, USD: 3000 }

/** Tasas anuales de referencia por instrumento (editables por el usuario, sin chips globales). */
type RateKey = "afi" | "cert" | "afi30" | "etf" | "usd30"
const DEFAULT_RATES: Record<RateKey, string> = { afi: "8", cert: "6", afi30: "9", etf: "10", usd30: "10" }
const RATE_META: Record<RateKey, { label: string; hint: string }> = {
  afi: { label: "AFI líquido", hint: "Histórico ~8% anual. Retiro en 1 día hábil." },
  cert: { label: "Certificado", hint: "Históricamente rinde ~40–50% menos que el AFI (≈6%)." },
  afi30: { label: "AFI a más de 30 días", hint: "Plazos de 30/90/180 días: históricamente mejor que el líquido." },
  etf: { label: "ETF / bolsa", hint: "Niveles 2–3 (EE.UU. / mundial). Referencia 10%, no es garantía." },
  usd30: { label: "Fondo a 30 días (USD)", hint: "Única opción en dólares. Referencia 10–15%." },
}

/** Mínimo real por instrumento para poder abrirlo (usa las etiquetas de los pasteles). */
const SLICE_MIN: Record<string, number> = {
  "AFI líquido": 5000,
  "AFI líquido / estabilidad": 5000,
  "AFI a más de 30 días": 10000,
  Certificados: 10000,
  "Certificados cortos": 10000,
  "Fondo a 30 días (USD)": 200,
}

/** Tasa por etiqueta de rodaja (fallback: AFI líquido). */
function rateKeyForLabel(label: string): RateKey | null {
  if (label.startsWith("Certificado")) return "cert"
  if (label.startsWith("AFI a más")) return "afi30"
  if (label.startsWith("ETF") || label.startsWith("Acciones") || label.startsWith("Bonos")) return "etf"
  if (label.startsWith("Fondo a 30 días")) return "usd30"
  if (label.startsWith("Cuenta")) return null
  return "afi"
}

/** Tasa efectiva de una clave: default si está vacía/inválida, tope 100%. */
function readRate(k: RateKey, rates: Record<RateKey, string>): number {
  const n = Number.parseFloat((rates[k] ?? "").replace(/,/g, ""))
  return isNaN(n) || n < 0 ? Number.parseFloat(DEFAULT_RATES[k]) : Math.min(n, 100)
}

function sliceRate(label: string, rates: Record<RateKey, string>): number {
  const k = rateKeyForLabel(label)
  return k ? readRate(k, rates) : 0
}

/** Etiqueta corta de cada tasa (para citar en captions). */
const RATE_SHORT: Record<RateKey, string> = {
  afi: "AFI líquido",
  cert: "certificado",
  afi30: "AFI 30+",
  etf: "ETF",
  usd30: "fondo 30 días",
}

/**
 * "AFI líquido 8% · certificado 6%": cita SOLO las tasas de las rodajas que
 * realmente se usan (la cuenta no rinde y un instrumento ausente no va en el copy).
 */
function rateSummary(labels: string[], rates: Record<RateKey, string>): string {
  const keys: RateKey[] = []
  for (const label of labels) {
    const k = rateKeyForLabel(label)
    if (k && !keys.includes(k)) keys.push(k)
  }
  if (keys.length === 0) return "sin inversión (todo en cuenta)"
  return keys.map((k) => `${RATE_SHORT[k]} ${readRate(k, rates)}%`).join(" · ")
}

/** Solo dígitos, comas y puntos: los inputs no aceptan letras. */
function filterNumeric(value: string): string {
  return value.replace(/[^\d.,]/g, "")
}

/** Formatea con coma de miles (100000 → 100,000); conserva el decimal tras el último separador. */
function formatWithCommas(value: string): string {
  if (!value) return ""
  const [intPartRaw, ...rest] = value.split(/[.,]/)
  const intPart = (intPartRaw || "").replace(/\D/g, "")
  const dec = rest.length > 0 ? `.${rest.join("").replace(/\D/g, "")}` : ""
  if (!intPart && !dec) return ""
  const grouped = intPart ? Number(intPart).toLocaleString("en-US") : ""
  return rest.length > 0 ? `${grouped}${dec}` : grouped
}

/** Parsea "25,000" / "25.5" → número (sin coma de miles). */
function parseNumeric(value: string): number {
  const n = Number.parseFloat(value.replace(/,/g, ""))
  return isNaN(n) ? NaN : n
}

function sliceMin(label: string): number {
  return SLICE_MIN[label] ?? 0
}

/**
 * Aplica los mínimos de cada instrumento a un template de porcentajes.
 * Sube cada rodaja a su mínimo (quitándole exceso a las que sobren) o
 * devuelve null si el monto no alcanza para tener los dos instrumentos.
 */
function feasibleSlices(template: Slice[], capital: number): Slice[] | null {
  if (capital <= 0 || template.length === 0) return null
  const amounts = template.map((s) => ({ label: s.label, min: sliceMin(s.label), amount: 0 }))
  let assigned = 0
  template.forEach((s, i) => {
    amounts[i].amount = Math.round((capital * s.pct) / 100)
    assigned += amounts[i].amount
  })
  amounts[amounts.length - 1].amount += capital - assigned

  const totalMin = amounts.reduce((sum, a) => sum + a.min, 0)
  if (capital < totalMin) return null

  for (const a of amounts) {
    if (a.amount >= a.min) continue
    const deficit = a.min - a.amount
    a.amount = a.min
    let need = deficit
    for (const o of amounts) {
      if (o === a || need <= 0) continue
      const take = Math.min(o.amount - o.min, need)
      if (take <= 0) continue
      o.amount -= take
      need -= take
    }
  }

  const kept = amounts.filter((a) => a.amount > 0)
  if (kept.length === 0) return null

  // pcts fraccionales: el monto manda (el % solo se redondea al mostrar)
  return kept.map((a) => ({ label: a.label, pct: (a.amount / capital) * 100 }))
}

/** Cuando no caben dos instrumentos: uno solo (elegido según situación). */
function singleSliceFor(capital: number, situation: "A" | "B" | "C", currency: "USD" | "DOP"): Slice {
  if (currency === "USD") return { label: "Fondo a 30 días (USD)", pct: 100 }
  if (situation === "B" && capital >= sliceMin("Certificados")) return { label: "Certificados", pct: 100 }
  return { label: "AFI líquido", pct: 100 }
}

const FUND_COLORS = { cash: "#9ca3af", afi: "#388e3c", cert: "#81c784" }

interface FundPart {
  label: string
  amount: number
  pct: number
  color: string
  why: string
}

/**
 * Reparto sugerido del colchón por tramos (aprobado):
 * <5k cuenta · 5k–10k todo AFI · 10k–35k 20% cuenta/80% AFI · 35k–50k 30/40/30 ·
 * >50k 20% cuenta + 80% en 70% AFI / 30% certificado.
 * USD: fondo a 30 días desde $200 (única opción en dólares).
 */
function fundSuggestion(fundSize: number, currency: "USD" | "DOP"): FundPart[] {
  if (currency === "USD") {
    if (fundSize < INSTR_MIN.USD.d30) {
      return [
        {
          label: "Cuenta a la vista",
          amount: fundSize,
          pct: 100,
          color: FUND_COLORS.cash,
          why: "Todavía no llegas al mínimo del fondo en USD ($200): sigue ahorrando.",
        },
      ]
    }
    return [
      {
        label: "Fondo a 30 días (USD)",
        amount: fundSize,
        pct: 100,
        color: FUND_COLORS.afi,
        why: "Única opción en dólares: mínimo $200 y retiro en una ventana de ~5 días al mes.",
      },
    ]
  }
  if (fundSize < INSTR_MIN.DOP.liquid) {
    return [
      {
        label: "Cuenta a la vista",
        amount: fundSize,
        pct: 100,
        color: FUND_COLORS.cash,
        why: "Aún no llegas al mínimo del AFI líquido (RD$5,000). Sigue ahorrando: al llegar, ábrelo.",
      },
    ]
  }
  if (fundSize < INSTR_MIN.DOP.cert) {
    return [
      {
        label: "AFI líquido",
        amount: fundSize,
        pct: 100,
        color: FUND_COLORS.afi,
        why: "Le gana a la inflación y se retira lun–vie 9am–3pm. El certificado pide RD$10,000: todavía no combina.",
      },
    ]
  }
  if (fundSize < 35000) {
    const cash = Math.round(fundSize * 0.2)
    return [
      {
        label: "Cuenta a la vista",
        amount: cash,
        pct: 20,
        color: FUND_COLORS.cash,
        why: "Para gastos repentinos sin tocar inversiones.",
      },
      {
        label: "AFI líquido",
        amount: fundSize - cash,
        pct: 80,
        color: FUND_COLORS.afi,
        why: "Le gana a la inflación; retiro en 1 día hábil.",
      },
    ]
  }
  if (fundSize < 50000) {
    const cash = Math.round(fundSize * 0.3)
    const afi = Math.round(fundSize * 0.4)
    return [
      {
        label: "Cuenta a la vista",
        amount: cash,
        pct: 30,
        color: FUND_COLORS.cash,
        why: "Para gastos repentinos sin tocar inversiones.",
      },
      {
        label: "AFI líquido",
        amount: afi,
        pct: 40,
        color: FUND_COLORS.afi,
        why: "Para emergencias que aceptan tarjeta o retiros parciales.",
      },
      {
        label: "Certificado vía web",
        amount: fundSize - cash - afi,
        pct: 30,
        color: FUND_COLORS.cert,
        why: "Dinero quieto a plazo (30–360 días). Si lo cancelas, pierdes 3% anual proporcional.",
      },
    ]
  }
  // >RD$50,000: 20% en cuenta y el 80% restante repartido 70% AFI / 30% certificado.
  const cash = Math.round(fundSize * 0.2)
  const afi = Math.round((fundSize - cash) * 0.7)
  return [
    {
      label: "Cuenta a la vista",
      amount: cash,
      pct: 20,
      color: FUND_COLORS.cash,
      why: "Para gastos repentinos sin tocar inversiones.",
    },
    {
      label: "AFI líquido",
      amount: afi,
      pct: Math.round((afi / fundSize) * 100),
      color: FUND_COLORS.afi,
      why: "La mayor parte: le gana a la inflación y retiras en 1 día hábil.",
    },
    {
      label: "Certificado vía web",
      amount: fundSize - cash - afi,
      pct: 100 - 20 - Math.round((afi / fundSize) * 100),
      color: FUND_COLORS.cert,
      why: "Más rendimiento que el AFI a plazo fijo (30–360 días); penalidad si cancelas antes.",
    },
  ]
}

function formatMoney(value: number, currency: "USD" | "DOP"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(value)
}

function PortfolioPie({ slices, id }: { slices: Slice[]; id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const { resolvedTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const isDark = resolvedTheme === "dark"
    try {
      chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: slices.map((s) => s.label),
          datasets: [
            {
              data: slices.map((s) => s.pct),
              backgroundColor: sliceColors,
              borderColor: isDark ? "#1f2937" : "#ffffff",
              borderWidth: 2,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "58%",
          animation: { animateRotate: true, duration: isMobile ? 500 : 1200 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (c) => `${c.label}: ${Math.round(c.parsed * 100) / 100}%`,
              },
            },
          },
        },
      })
    } catch {
      // chart no crítico: los % se listan debajo
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [slices, resolvedTheme, isMobile])

  return (
    <div className="h-[160px] w-full" id={id}>
      <canvas ref={canvasRef} aria-hidden />
    </div>
  )
}

/** Encabezado centrado de las secciones inferiores: badge opcional + icono + título + subtítulo. */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: LucideIcon
  title: string
  subtitle?: ReactNode
  badge?: string
}) {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center gap-2 mb-2">
        {badge && (
          <span className="inline-block rounded-full bg-[#388e3c] text-white text-xs font-bold px-3 py-1 leading-normal">
            {badge}
          </span>
        )}
        <Icon className="h-6 w-6 text-[#388e3c] dark:text-[#81c784]" aria-hidden />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      {subtitle !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

interface ComputedResult {
  level: number
  knowledgeCeiling: number
  knowledgeLocked: boolean
  situation: "A" | "B" | "C"
  richQuick: boolean
  reason: string
}
function computeResult(answers: Record<number, string>): ComputedResult {
  const chosen: Option[] = []
  for (const q of questions) {
    const opt = q.options.find((o) => o.key === answers[q.id])
    if (opt) chosen.push(opt)
  }

  const riskOpts = chosen.filter((o) => o.risk !== undefined)
  const avgRisk =
    riskOpts.length > 0 ? riskOpts.reduce((s, o) => s + (o.risk ?? 0), 0) / riskOpts.length : 2

  let level = avgRisk < 1.6 ? 1 : avgRisk < 2.4 ? 2 : 3

  const ceilingOpt = chosen.find((o) => o.ceiling !== undefined)
  const knowledgeCeiling = ceilingOpt?.ceiling ?? 3
  const knowledgeLocked = level > knowledgeCeiling
  if (knowledgeLocked) level = knowledgeCeiling

  const q6 = answers[6]
  const q5 = answers[5]
  let situation: "A" | "B" | "C" = "B"
  if (q6 === "q6_free" || q6 === "q6_risk") situation = "C"
  else if (q5 === "q5_none" || q5 === "q5_some") situation = "A"
  else if (q5 === "q5_yes") situation = "B"

  const richQuick = chosen.some((o) => o.richQuick)

  const fundKey = answers[5]
  const fundPhrase =
    fundKey === "q5_none"
      ? "no tienes fondo de emergencia"
      : fundKey === "q5_some"
        ? "apenas tienes colchón de emergencia"
        : "ya tienes fondo de emergencia"

  const incomeKey = answers[6]
  const incomePhrase =
    incomeKey === "q6_free"
      ? "tienes ingreso independiente"
      : incomeKey === "q6_risk"
        ? "tu empleo puede cambiar pronto"
        : "tu ingreso es estable"

  let reason = `${fundPhrase[0].toUpperCase()}${fundPhrase.slice(1)} y ${incomePhrase}: primero el colchón, después invertir.`
  if (knowledgeLocked) {
    reason = "Estás empezando y primero conviene aprender: domina lo básico antes de subir de nivel."
  }

  return { level, knowledgeCeiling, knowledgeLocked, situation, richQuick, reason }
}

export function RiskProfileTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const router = useRouter()
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [capitalInput, setCapitalInput] = useState("")
  const [currency, setCurrency] = useState<"USD" | "DOP">("DOP")
  const [rates, setRates] = useState<Record<RateKey, string>>({ ...DEFAULT_RATES })
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [fundMultiplier, setFundMultiplier] = useState(0)
  const [savePct, setSavePct] = useState("10")
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [showLevels, setShowLevels] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [restored, setRestored] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  useEffect(() => {
    const draft = storageGet<RiskDraft>(DRAFT_KEY, {})
    const answered = questions.filter((q) => draft.answers?.[q.id])
    if (answered.length > 0) {
      setAnswers(draft.answers ?? {})
      if (draft.capital !== undefined) setCapitalInput(draft.capital)
      if (draft.currency === "USD" || draft.currency === "DOP") setCurrency(draft.currency)
      if (draft.rates) setRates({ ...DEFAULT_RATES, ...draft.rates })
      if (draft.monthlyIncome !== undefined) setMonthlyIncome(draft.monthlyIncome)
      if (typeof draft.fundMultiplier === "number") setFundMultiplier(draft.fundMultiplier)
      if (typeof draft.savePct === "string" && draft.savePct) setSavePct(draft.savePct)
      if (answered.length >= questions.length && draft.level) {
        setPhase("result")
        setRestored(true)
      } else {
        // Quiz a medio camino: continúa en la primera pregunta sin responder.
        setPhase("quiz")
        setCurrentQuestion(Math.min(answered.length, questions.length - 1))
      }
    }
    firstLoad.current = false
  }, [])

  const result = useMemo(() => {
    if (phase !== "result") return null
    if (Object.keys(answers).length < questions.length) return null
    return computeResult(answers)
  }, [phase, answers])

  const capital = useMemo(() => {
    const n = parseNumeric(capitalInput)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [capitalInput])

  const income = useMemo(() => {
    const n = parseNumeric(monthlyIncome)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [monthlyIncome])

  const hasFund = fundMultiplier > 0
  const fundSize = income * fundMultiplier
  const fundTarget = income * 2

  const saveRate = useMemo(() => {
    const n = parseNumeric(savePct)
    return isNaN(n) || n <= 0 ? 0 : Math.min(n, 100)
  }, [savePct])

  const monthsToFund = useMemo(() => {
    if (fundTarget <= 0 || saveRate <= 0 || income <= 0) return null
    const remaining = fundTarget - fundSize
    if (remaining <= 0) return null
    const monthlySave = income * (saveRate / 100)
    if (monthlySave <= 0) return null
    return Math.ceil(remaining / monthlySave)
  }, [fundSize, fundTarget, saveRate, income])

  const levelCap = LEVEL_CAP[currency]
  const lowCapital = capital > 0 && capital < levelCap

  const effectiveLevel = lowCapital && result ? Math.min(result.level, 2) : (result?.level ?? 1)

  // Al (re)cargar resultados la selección del arco vuelve al nivel del usuario.
  const prevLevelRef = useRef<number | null>(null)
  useEffect(() => {
    if (phase !== "result") return
    if (prevLevelRef.current !== effectiveLevel) {
      prevLevelRef.current = effectiveLevel
      setSelectedLevel(effectiveLevel)
    }
  }, [phase, effectiveLevel])

  const abcThreshold = currency === "DOP" ? ABC_DOP : ABC_USD
  const showABC =
    capital > 0 && capital >= abcThreshold && !(currency === "USD" && effectiveLevel === 1)

  const rateValue = (k: RateKey): number => readRate(k, rates)

  const inflationLoss = fundSize > 0 ? fundSize * 0.03 : 0
  const fundParts = fundSize > 0 ? fundSuggestion(fundSize, currency) : []
  // ¿Alguna parte del colchón cabe en un instrumento real (no todo en la cuenta)?
  const fundCanInvest = fundParts.some((p) => p.label !== "Cuenta a la vista")
  // Rendimiento anual del colchón = Σ por tramo con la tasa de su instrumento (cuenta: 0%).
  const fundYearReturn = fundParts.reduce((sum, p) => sum + p.amount * (sliceRate(p.label, rates) / 100), 0)
  const fundAfiRate = rateValue(currency === "USD" ? "usd30" : "afi")

  const instruments = useMemo(() => {
    if (capital <= 0) return [] as { name: string; min: number; note: string }[]
    if (currency === "USD") {
      if (capital < INSTR_MIN.USD.d30) return []
      return [
        {
          name: "Fondo a 30 días (USD)",
          min: INSTR_MIN.USD.d30,
          note: "Retiro en ventana de ~5 días al mes (ej. 25–30). Sin AFI líquido en dólares.",
        },
      ]
    }
    const list: { name: string; min: number; note: string }[] = []
    if (capital >= INSTR_MIN.DOP.liquid) {
      list.push({
        name: "AFI líquido",
        min: INSTR_MIN.DOP.liquid,
        note: "Retiro lun–vie 9am–3pm (sin feriados). Ideal para colchón.",
      })
    }
    if (capital >= INSTR_MIN.DOP.d30) {
      list.push({
        name: "AFI a más de 30 días",
        min: INSTR_MIN.DOP.d30,
        note: "Plazos de 30/90/180 días: históricamente rinde más que el líquido; el dinero queda 30 días mínimo.",
      })
    }
    if (capital >= INSTR_MIN.DOP.cert) {
      list.push({
        name: "Certificado financiero",
        min: INSTR_MIN.DOP.cert,
        note: "App, web o sucursal. Plazos 30/90/180/360. Penalidad si cancelas antes.",
      })
    }
    if (capital >= INSTR_MIN.DOP.d30) {
      list.push({
        name: "Fondo a 30 días",
        min: INSTR_MIN.DOP.d30,
        note: "Retiro en ventana de ~5 días al mes (ej. 25–30).",
      })
    }
    return list
  }, [capital, currency])

  useEffect(() => {
    if (firstLoad.current) return
    if (phase === "intro" && Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: RiskDraft = {
        answers,
        showResults: phase === "result",
        level: result?.level,
        capital: capitalInput,
        currency,
        rates,
        monthlyIncome,
        fundMultiplier,
        savePct,
        savedAt: new Date().toISOString(),
      }
      if (storageSet(DRAFT_KEY, payload)) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [phase, answers, capitalInput, currency, rates, monthlyIncome, fundMultiplier, savePct, result])

  const startQuiz = () => {
    setPhase("quiz")
    setCurrentQuestion(0)
    setAnswers({})
    triggerHapticFeedback("light")
  }

  const handleAnswer = (questionId: number, key: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: key }))
    triggerHapticFeedback("light")
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setPhase("result")
        setRestored(false)
      }
    }, 300)
  }

  const handleCurrency = (c: "USD" | "DOP") => {
    setCurrency(c)
    triggerHapticFeedback("light")
  }

  const resetAll = () => {
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers({})
    setCapitalInput("")
    setCurrency("DOP")
    setRates({ ...DEFAULT_RATES })
    setMonthlyIncome("")
    setFundMultiplier(0)
    setSavePct("10")
    setShowLevels(false)
    setRestored(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  /** Borra TODO (test + draft) y vuelve al inicio: el autosave no debe re-guardarlo. */
  const clearData = () => {
    resetAll()
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
      active
        ? "bg-[#388e3c] text-white"
        : "bg-[#388e3c]/10 hover:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784]"
    }`

  /* ---------- INTRO ---------- */
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#388e3c]/10 dark:bg-[#388e3c]/20">
              <Gauge className="h-6 w-6 text-[#388e3c] dark:text-[#81c784]" />
            </div>
            <h2 className="text-xl font-bold">Test de perfil de riesgo</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            <strong>Responde con la mayor honestidad posible.</strong> Son 12 preguntas sencillas, unos 3 minutos.
            Al final verás tu nivel y cómo distribuir tu dinero.
          </p>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3 mb-6">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              Herramienta educativa de <strong>Daury DiCaprio</strong>. Las estructuras son{" "}
              <strong>sugerencias</strong>, no asesoría personalizada: tus decisiones y tu responsabilidad. Solo se
              habla de lo regulado.
            </p>
          </div>

          {restored && (
            <div className="mb-6 rounded-lg bg-[#388e3c]/10 border border-[#388e3c]/30 p-4 text-sm text-[#1b5e20] dark:text-[#a5d6a7]">
              Tienes un test guardado. Puedes repetirlo o borrarlo desde el resultado.
            </div>
          )}

          <button
            onClick={startQuiz}
            className="w-full bg-[#388e3c] hover:bg-[#1b5e20] text-white px-6 py-4 rounded-lg font-semibold transition-colors"
            data-interactive="true"
          >
            Empezar el test
          </button>

          <div className="flex items-center justify-between mt-5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {savedFlash ? "Guardado local ✓" : "Se guarda en tu navegador"}
            </span>
            <button
              onClick={clearData}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
              data-interactive="true"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar mis datos
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- QUIZ ---------- */
  if (phase === "quiz") {
    const question = questions[currentQuestion]
    const pct = Math.round(((currentQuestion + 1) / questions.length) * 100)

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm font-medium text-[#388e3c] dark:text-[#81c784]">{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#388e3c] h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{question.text}</h2>
          {question.hint && <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{question.hint}</p>}
          {!question.hint && <div className="mb-5" />}

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.key
              return (
                <button
                  key={option.key}
                  onClick={() => handleAnswer(question.id, option.key)}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    isSelected
                      ? "border-[#388e3c] bg-[#388e3c]/10 dark:bg-[#388e3c]/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#388e3c] hover:bg-[#388e3c]/5 dark:hover:bg-[#388e3c]/10"
                  }`}
                  data-interactive="true"
                >
                  <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                </button>
              )
            })}
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1)
                triggerHapticFeedback("light")
              }}
              className="mt-4 text-sm font-medium text-gray-500 hover:text-[#388e3c] dark:text-gray-400 transition-colors"
              data-interactive="true"
            >
              ← Atrás
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ---------- RESULT fallback ---------- */
  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Responde las 12 preguntas para ver tu perfil.</p>
        <button
          onClick={startQuiz}
          className="bg-[#388e3c] hover:bg-[#1b5e20] text-white px-6 py-3 rounded-lg font-medium"
          data-interactive="true"
        >
          Empezar
        </button>
      </div>
    )
  }

  const levelDef = LEVELS[effectiveLevel - 1]
  const situations: Array<"A" | "B" | "C"> = showABC ? ["A", "B", "C"] : [result.situation]
  const chosenSlices = (currency === "USD" ? portfoliosUsd : portfolios)[effectiveLevel]

  // Proyección ponderada por instrumento con las tasas del usuario (recomendada).
  const projSlices =
    feasibleSlices(chosenSlices[result.situation], capital) ?? [singleSliceFor(capital, result.situation, currency)]
  const projAt = (years: number) =>
    projSlices.reduce((sum, s) => {
      const amount = (capital * s.pct) / 100
      return sum + amount * Math.pow(1 + sliceRate(s.label, rates) / 100, years)
    }, 0)
  const proj5 = capital > 0 ? projAt(5) : 0
  const proj10 = capital > 0 ? projAt(10) : 0
  const blendedRate =
    projSlices.reduce((sum, s) => sum + (s.pct / 100) * sliceRate(s.label, rates), 0) || rateValue("afi")

  // Cuántos instrumentos caben a la vez (suma de sus mínimos ≤ capital)
  const reachableMins = instruments.map((i) => i.min).sort((a, b) => a - b)
  let maxTogether = 0
  let minAcc = 0
  for (const m of reachableMins) {
    if (minAcc + m > capital) break
    minAcc += m
    maxTogether++
  }

  const floor = currency === "DOP" ? INSTR_MIN.DOP.liquid : INSTR_MIN.USD.d30
  // ¿El monto actual ya alcanza para abrir algo? (USD: desde $200 sí, aunque sea "capital pequeño")
  const canInvestNow = capital >= floor
  const distSubtitle =
    capital <= 0
      ? "Escribe cuánto planeas invertir arriba."
      : maxTogether === 0
        ? `Montos sobre ${formatMoney(capital, currency)}.`
        : `Montos sobre ${formatMoney(capital, currency)} · ${
            maxTogether === 1
              ? instruments.length > 1
                ? `elige 1 de los ${instruments.length} instrumentos listados`
                : "1 instrumento alcanza"
              : `caben hasta ${maxTogether} a la vez`
          }${capital < abcThreshold ? ` · A/B/C desde ${formatMoney(abcThreshold, currency)}` : ""}.`

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1 · Héroe */}
      <div
        className="rounded-xl p-7 sm:p-10 text-white text-center shadow-lg"
        style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">Tu resultado</div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">{levelDef.profileName}</h2>
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-semibold">
            Quédate en el nivel {effectiveLevel}
          </span>
        </div>
        <p className="text-base sm:text-lg font-semibold mb-3 max-w-xl mx-auto leading-snug">{result.reason}</p>
        <p className="text-sm sm:text-base opacity-90 mb-4 max-w-xl mx-auto leading-relaxed">{levelDef.blurb}</p>
        {lowCapital && (
          <div className="mb-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Capital pequeño (menos de {formatMoney(levelCap, currency)}): te conviene el nivel 1–2
          </div>
        )}
        <div className="max-w-xl mx-auto">
          <Disclosure label="Aprende qué significa tu nivel" align="center" tone="light">
            <strong className="block mb-1">{levelDef.name}</strong>
            <span className="block mb-2 opacity-90">{levelDef.short}</span>
            {levelDef.desc}
          </Disclosure>
        </div>
      </div>

      {/* 2 · Aviso conocimiento */}
      {result.knowledgeLocked && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Apetito alto, conocimiento bajo.</strong> Primero aprende: quédate en el{" "}
            <strong>nivel {result.knowledgeCeiling}</strong> (o baja) hasta que domines lo básico — con poco tiempo los
            niveles 1 y 2 <strong>le ganan a la inflación</strong>.
          </p>
        </div>
      )}

      {/* 3 · Aviso prisa */}
      {result.richQuick && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
            <strong>No busques hacerte rico con las inversiones.</strong> Sirven para crecer patrimonio; la riqueza real
            se construye en <strong>20–30 años</strong>.
          </p>
        </div>
      )}

      {/* 4 · Ver niveles (colapsado) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <button
          onClick={() => {
            setShowLevels(!showLevels)
            triggerHapticFeedback("light")
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-[#388e3c] hover:bg-[#388e3c]/5 transition-colors"
          data-interactive="true"
        >
          Ver niveles de inversor · Daury
          <ChevronDown className={`h-4 w-4 transition-transform ${showLevels ? "rotate-180" : ""}`} />
        </button>
        {showLevels && (
          <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1 mt-3">
              Los 5 niveles de inversión
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
              Tu nivel está resaltado en el arco. Toca cualquier nivel para ver su color. Solo lo regulado, sin prisa,
              a largo plazo.
            </p>

            <RiskLevelsGraphic
              activeLevel={effectiveLevel}
              selectedLevel={selectedLevel}
              onSelect={(n) => {
                setSelectedLevel(n)
                triggerHapticFeedback("light")
              }}
            />

            <ul className="mt-5 space-y-3">
              {LEVELS.map((lvl) => {
                const isActive = lvl.n === effectiveLevel
                const isColored = isActive || lvl.n === selectedLevel
                return (
                  <li
                    key={lvl.n}
                    role="button"
                    tabIndex={0}
                    aria-pressed={lvl.n === selectedLevel}
                    aria-label={`Ver nivel ${lvl.n}`}
                    onClick={() => {
                      setSelectedLevel(lvl.n)
                      triggerHapticFeedback("light")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedLevel(lvl.n)
                        triggerHapticFeedback("light")
                      }
                    }}
                    data-interactive="true"
                    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                      isActive
                        ? "border-[#388e3c] bg-[#388e3c]/5 dark:bg-[#388e3c]/10 ring-1 ring-[#388e3c]"
                        : isColored && lvl.danger
                          ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/15"
                          : isColored
                            ? "border-[#388e3c]/60 bg-[#388e3c]/5 dark:bg-[#388e3c]/10"
                            : "border-gray-200 dark:border-gray-700 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive || isColored
                            ? lvl.danger
                              ? "bg-red-600 text-white"
                              : "bg-[#388e3c] text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lvl.n}
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          isActive || isColored
                            ? lvl.danger
                              ? "text-red-700 dark:text-red-400"
                              : "text-gray-800 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {lvl.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase bg-[#388e3c] text-white px-2 py-0.5 rounded-full">
                          Tuyo
                        </span>
                      )}
                      {lvl.danger && (
                        <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                          No recomendado
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        lvl.danger
                          ? isColored
                            ? "text-red-700 dark:text-red-300"
                            : "text-red-700/60 dark:text-red-300/60"
                          : isColored
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      <strong
                        className={
                          lvl.danger
                            ? isColored
                              ? "text-red-700 dark:text-red-400"
                              : "text-red-700/70 dark:text-red-400/70"
                            : isColored
                              ? "text-[#388e3c]"
                              : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        {lvl.short}
                      </strong>{" "}
                      — {lvl.desc}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* 5 · Paso 1 — Fondo de emergencia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
        <SectionHeader
          icon={ShieldAlert}
          badge="Paso 1"
          title="Tu fondo de emergencia"
          subtitle="Va aparte de tu portafolio: primero el colchón, después invertir."
        />

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto ganas al mes?</label>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(formatWithCommas(filterNumeric(e.target.value)))}
              placeholder={currency === "DOP" ? "Ej: 45,000" : "Ej: 800"}
              className={inputClass}
              data-interactive="true"
            />
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">¿Cuánto tienes ya ahorrado?</span>
              <button
                onClick={() => {
                  setFundMultiplier(0)
                  triggerHapticFeedback("light")
                }}
                className={chipClass(fundMultiplier === 0)}
                data-interactive="true"
              >
                Sin fondo
              </button>
              {[2, 4, 6].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setFundMultiplier(m)
                    triggerHapticFeedback("light")
                  }}
                  className={chipClass(fundMultiplier === m)}
                  data-interactive="true"
                >
                  {m}× sueldo
                </button>
              ))}
            </div>
          </div>

          {/* Sin fondo: plan de ahorro con gráfico */}
          {!hasFund && (
            <div className="rounded-lg bg-[#388e3c]/5 dark:bg-[#388e3c]/10 border border-[#388e3c]/30 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong className="text-gray-900 dark:text-gray-100">Primero: tu fondo de emergencia.</strong> Es el
                dinero que te evita vender inversiones en el peor momento. Tu meta sugerida es{" "}
                <strong>2× sueldo</strong>
                {income > 0 && (
                  <>
                    {" "}
                    = <strong>{formatMoney(fundTarget, currency)}</strong>
                  </>
                )}
                . Ahorra primero esto; invertir viene después.
              </p>
              <label className="block text-sm font-medium mt-4 mb-2 text-gray-600 dark:text-gray-400">
                ¿Qué % de tu sueldo puedes ahorrar al mes?
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[5, 10, 15, 20].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSavePct(String(p))
                      triggerHapticFeedback("light")
                    }}
                    className={chipClass(savePct === String(p))}
                    data-interactive="true"
                  >
                    {p}%
                  </button>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-24 shrink-0">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={savePct}
                      onChange={(e) => setSavePct(filterNumeric(e.target.value).replace(/,/g, ""))}
                      placeholder="Otro %"
                      aria-label="Establece tu % de ahorro manualmente"
                      className={inputClass}
                      data-interactive="true"
                    />
                  </div>
                  <span className="text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">% de tu sueldo</span>
                </div>
              </div>
              {monthsToFund !== null ? (
                <>
                  <p className="text-sm text-[#1b5e20] dark:text-[#a5d6a7] mt-3 font-medium">
                    En ~{monthsToFund} {monthsToFund === 1 ? "mes" : "meses"}
                    {monthsToFund > 24 ? ` (unos ${Math.round(monthsToFund / 12)} años)` : ""} completas tu colchón
                    de {formatMoney(fundTarget, currency)} ahorrando {saveRate}% cada mes.
                  </p>
                  <FundProjectionChart
                    start={0}
                    monthly={income * (saveRate / 100)}
                    target={fundTarget}
                    months={monthsToFund}
                    currency={currency}
                    rate={fundAfiRate}
                    rateLabel={currency === "USD" ? "fondo a 30 días" : "AFI líquido"}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    La línea punteada azul muestra lo mismo ahorrando, pero invirtiéndolo cada mes en{" "}
                    {currency === "USD" ? "el fondo a 30 días" : "AFI líquido"} con la tasa que definiste (~
                    {fundAfiRate}%): al llegar a la meta, tendrías un poco más.
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  {income > 0
                    ? "Pon tu % de ahorro para ver en cuánto tiempo llegas a tu colchón."
                    : "Pon cuánto ganas al mes para calcular tu plan de ahorro."}
                </p>
              )}
            </div>
          )}

          {/* Ya tiene colchón */}
          {hasFund && fundSize > 0 && (
            <div className="rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#388e3c] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-gray-100">Ya tienes tu colchón mínimo ✓</strong> —{" "}
                {formatMoney(fundSize, currency)} ({fundMultiplier} meses de sueldo), meta mínima 2× ={" "}
                {formatMoney(fundTarget, currency)}. El dinero que sobre va a tu portafolio, no aquí.
              </p>
            </div>
          )}

          {hasFund && fundSize === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pon cuánto ganas al mes para ver cuánto tienes ahorrado.
            </p>
          )}

          {/* Sugerencia explícita de reparto del colchón */}
          {hasFund && fundSize > 0 && (
            <div className="rounded-xl border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank className="h-5 w-5 text-[#388e3c] flex-shrink-0" aria-hidden />
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Sugerencia para tu colchón de {formatMoney(fundSize, currency)}
                </p>
              </div>
              {fundParts.length > 1 && (
                <div className="mb-4 flex h-3 overflow-hidden rounded-full" aria-hidden>
                  {fundParts.map((p) => (
                    <div key={p.label} style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  ))}
                </div>
              )}
              <ul className="space-y-3">
                {fundParts.map((p) => (
                  <li key={p.label} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: p.color }}
                      aria-hidden
                    />
                    <div className="text-sm leading-relaxed">
                      <strong className="text-gray-900 dark:text-gray-100">
                        {p.label}: {formatMoney(p.amount, currency)} ({p.pct}%)
                      </strong>
                      <span className="block text-xs text-gray-600 dark:text-gray-400">{p.why}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Si lo inviertes / si lo dejas parado: dos caminos explícitos */}
          {hasFund && fundSize > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {fundCanInvest ? (
                <div className="rounded-xl border border-[#388e3c]/30 bg-[#388e3c]/10 px-5 py-5 text-center">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-[#1b5e20] dark:text-[#a5d6a7]">
                    <TrendingUp className="h-4 w-4" aria-hidden /> Si inviertes tu fondo
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-[#1b5e20] dark:text-[#a5d6a7]">
                    +{formatMoney(fundYearReturn, currency)}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                    Con las tasas que definiste ({rateSummary(fundParts.map((p) => p.label), rates)}), tus{" "}
                    {formatMoney(fundSize, currency)} podrían ser {formatMoney(fundSize + fundYearReturn, currency)} en
                    1 año.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-5 text-center dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                    <PiggyBank className="h-4 w-4" aria-hidden /> Todavía no abres el instrumento
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                    Con {formatMoney(fundSize, currency)} sigues por debajo del mínimo{" "}
                    {currency === "DOP" ? "del AFI líquido (RD$5,000)" : "del fondo a 30 días ($200)"}: este dinero
                    queda en tu cuenta y no rinde. Sigue ahorrando; al llegar al mínimo, ábrelo.
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-5 text-center dark:border-red-800 dark:bg-red-900/20">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" aria-hidden /> Si lo dejas parado
                </div>
                <div className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                  −{formatMoney(inflationLoss, currency)}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  La inflación (~3% promedio) le quita ese poder de compra cada año: quedaría en ~
                  {formatMoney(fundSize - inflationLoss, currency)} de valor real.
                </p>
              </div>
            </div>
          )}

          {/* Simulador de presupuesto: de dónde sale el ahorro */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 p-4 dark:bg-[#388e3c]/10">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <ClipboardList className="h-5 w-5 flex-shrink-0 text-[#388e3c]" aria-hidden />
              <span>Para ahorrar más al mes y llegar antes a tu colchón, organiza tus ingresos y gastos.</span>
            </div>
            <Link
              href="/crear-presupuesto-personal"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#388e3c] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1b5e20]"
              data-interactive="true"
            >
              Aprende a crear tu presupuesto →
            </Link>
          </div>

          {/* Detalles de cada instrumento (plegado) */}
          {hasFund &&
            fundSize > 0 &&
            (currency === "DOP" ? fundSize >= INSTR_MIN.DOP.liquid : fundSize >= INSTR_MIN.USD.d30) && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <Disclosure label="Ver detalles: mínimos, horarios y penalidades">
                  <ul className="space-y-3">
                    {currency === "DOP" && fundSize >= INSTR_MIN.DOP.liquid && (
                      <li>
                        <strong className="text-[#388e3c]">AFI líquido</strong> — mín.{" "}
                        {formatMoney(INSTR_MIN.DOP.liquid, "DOP")}. Retiro lun–vie 9am–3pm (sin feriados ni festivos).
                        Para emergencias que aceptan tarjeta o retiros parciales.
                      </li>
                    )}
                    {currency === "DOP" && fundSize >= INSTR_MIN.DOP.cert && (
                      <li>
                        <strong className="text-[#388e3c]">Certificado</strong> — mín.{" "}
                        {formatMoney(INSTR_MIN.DOP.cert, "DOP")}. App, web o sucursal. Plazos 30/90/180/360 días.
                        <span className="mt-1 block text-amber-700 dark:text-amber-400">
                          Cancelar antes de tiempo: <strong>3% anual sobre el capital</strong> (solo los días que
                          falten). Ej.: RD$10,000 con 1 mes por vencer ≈ <strong>RD$25</strong> + te reajustan los
                          intereses ya ganados a tasa de ahorro.
                        </span>
                      </li>
                    )}
                    {currency === "DOP" && fundSize >= INSTR_MIN.DOP.d30 && (
                      <li>
                        <strong className="text-[#388e3c]">Fondo a 30 días</strong> — mín.{" "}
                        {formatMoney(INSTR_MIN.DOP.d30, "DOP")}. Retiro en ventana de ~5 días fijados por el fondo
                        (ej. del 25 al 30). Penalidad si sacas antes del plazo.
                      </li>
                    )}
                    {currency === "USD" && fundSize >= INSTR_MIN.USD.d30 && (
                      <li>
                        <strong className="text-[#388e3c]">Fondo 30 días (USD)</strong> — mín.{" "}
                        {formatMoney(INSTR_MIN.USD.d30, "USD")}. En dólares no hay AFI líquido: el mínimo es plazo
                        de 30 días. Penalidad si retiras antes.
                      </li>
                    )}
                  </ul>
                </Disclosure>
              </div>
            )}

          {/* Elección: no invertir + tarjeta */}
          <div className="rounded-lg border border-gray-200 p-4 sm:p-5 dark:border-gray-700">
            <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
              ¿Prefieres no invertir tu fondo de emergencia?
            </p>
            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Puedes dejarlo quieto, pero pierde ~3% de poder de compra cada año. Antes de decidir, responde esto:{" "}
              <strong>¿cuándo fue tu última emergencia?</strong> Hospital, una avería del auto o un electrodoméstico
              rara vez llegan por el monto completo: casi siempre es una parte. Y la mayoría se puede pagar con{" "}
              <strong>tarjeta de crédito</strong>: retiras del colchón{" "}
              <strong>2–3 días antes del vencimiento</strong> y no financias nada. Por eso la sugerencia es
              invertirlo hasta el AFI líquido: <strong>sigue disponible en 1 día hábil</strong> y no se queda parado
              perdiendo valor.
            </p>
            <Disclosure label="Leer más: qué pasa si lo dejas parado">
              <p className="mb-2">
                {fundSize > 0 ? (
                  <>
                    Dejar <strong>{formatMoney(fundSize, currency)}</strong> quietos pierde ~{" "}
                    <strong className="text-red-600 dark:text-red-400">{formatMoney(inflationLoss, currency)}</strong>{" "}
                    al año por inflación (~3%).
                  </>
                ) : (
                  <>El dinero parado pierde ~3% al año de poder de compra.</>
                )}
              </p>
              <p>
                Invertirlo no lo bloquea: el AFI líquido se retira en horario de oficina (lun–vie 9am–3pm), así que
                sigue siendo tu colchón. No hace falta tocar inversiones a largo plazo.
              </p>
            </Disclosure>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 p-4 dark:bg-[#388e3c]/10">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Info className="h-4 w-4 flex-shrink-0 text-[#388e3c]" aria-hidden />
                <span>
                  ¿No domina tus fechas de corte y vencimiento? Aprende a usar la tarjeta a tu favor.
                </span>
              </div>
              <Link
                href="/tarjeta-corte-vencimiento"
                className="ml-auto inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#388e3c] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1b5e20]"
                data-interactive="true"
              >
                Comprende tu fecha de corte y vencimiento →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6 · Tu dinero a invertir */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
        <SectionHeader
          icon={Wallet}
          badge="Paso 2"
          title="Tu dinero a invertir"
          subtitle="Esto alimenta tu distribución y tu proyección."
        />

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto planeas invertir?</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={capitalInput}
                onChange={(e) => setCapitalInput(formatWithCommas(filterNumeric(e.target.value)))}
                placeholder={currency === "DOP" ? "Ej: 25,000" : "Ej: 1,500"}
                className={`flex-1 ${inputClass}`}
                data-interactive="true"
              />
              <div className="flex gap-2">
                {(["DOP", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCurrency(c)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      currency === c
                        ? "bg-[#388e3c] text-white"
                        : "bg-[#388e3c]/10 text-[#388e3c] dark:text-[#81c784] hover:bg-[#388e3c]/20"
                    }`}
                    data-interactive="true"
                  >
                    {c === "USD" ? "Dólares" : "Pesos RD"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tasas de referencia por instrumento (%)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(currency === "USD"
                ? (["usd30", "etf"] as RateKey[])
                : (["afi", "cert", "afi30", "etf"] as RateKey[])
              ).map((k) => (
                <div key={k}>
                  <label htmlFor={`rate-${k}`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {RATE_META[k].label}
                  </label>
                  <div className="relative">
                    <input
                      id={`rate-${k}`}
                      type="text"
                      inputMode="decimal"
                      value={rates[k]}
                      onChange={(e) => setRates((prev) => ({ ...prev, [k]: filterNumeric(e.target.value) }))}
                      onBlur={() =>
                        setRates((prev) => {
                          const n = Number.parseFloat(prev[k].replace(/,/g, ""))
                          // Normaliza al salir: vacío → default; tope 0–100%.
                          return {
                            ...prev,
                            [k]: isNaN(n) || n < 0 ? DEFAULT_RATES[k] : String(Math.min(n, 100)),
                          }
                        })
                      }
                      className={`${inputClass} pr-8`}
                      data-interactive="true"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">%</span>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-snug">{RATE_META[k].hint}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              La proyección usa la tasa de cada instrumento. No es garantía.
            </p>
          </div>
        </div>

        {lowCapital && (
          <div
            className={`mt-5 rounded-lg border p-4 flex items-start gap-3 ${
              canInvestNow
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                canInvestNow ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
              }`}
            />
            <p
              className={`text-sm leading-relaxed ${
                canInvestNow
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {currency === "USD" ? (
                canInvestNow ? (
                  <>
                    Desde <strong>$200</strong> ya puedes empezar (fondo a 30 días). Con menos de{" "}
                    <strong>$3,000</strong> quédate en <strong>nivel 1–2</strong>: menos riesgo y mueve la aguja
                    cuando crezca.
                  </>
                ) : (
                  <>
                    Con menos de <strong>$200</strong> aún no abres el fondo a 30 días. Quédate en{" "}
                    <strong>nivel 1–2</strong> y sigue ahorrando: primero el colchón, después el portafolio.
                  </>
                )
              ) : (
                <>
                  Para invertir en <strong>pesos hace falta al menos RD$5,000</strong>. Con poco capital quédate en{" "}
                  <strong>nivel 1–2</strong>: menos riesgo y mueve la aguja cuando crezca.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* 7 · Cómo distribuir */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
        <SectionHeader icon={PieChart} badge="Paso 3" title="Cómo distribuir tu dinero" subtitle={distSubtitle} />

        {capital > 0 && maxTogether === 0 && (
          <div className="mb-5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              Con {formatMoney(capital, currency)} aún no alcanza para abrir un instrumento: el mínimo para empezar
              es {formatMoney(floor, currency)}
              {currency === "DOP" ? " (AFI líquido)" : " (fondo a 30 días)"}. Sigue ahorrando y vuelve a calcular.
            </p>
          </div>
        )}

        {capital > 0 && instruments.length > 0 && (
          <div className="mb-5 rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Instrumentos a los que alcanza tu monto
            </p>
            <ul className="space-y-2">
              {instruments.map((inst) => (
                <li key={inst.name} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-[#388e3c]">{inst.name}</strong> (mín.{" "}
                  {formatMoney(inst.min, currency)}) — {inst.note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {capital > 0 && instruments.length > 0 && (
          <div
            className={
              showABC ? "grid sm:grid-cols-3 gap-4" : "grid sm:grid-cols-1 max-w-md gap-4"
            }
          >
            {situations.map((sit) => {
              const template = chosenSlices[sit]
              const feasible = feasibleSlices(template, capital)
              const sitSlices = feasible ?? [singleSliceFor(capital, sit, currency)]
              const isRecommended = sit === result.situation
              const singleNote =
                template.length === 1
                  ? currency === "USD"
                    ? "En dólares y a tu nivel todo va al fondo a 30 días: es el único instrumento de plazo corto."
                    : "A tu nivel todo va a un solo instrumento propio: sin dividir, sin complicarte."
                  : "Este monto aún no alcanza para dividir: falta el mínimo de un segundo instrumento."
              return (
                <div
                  key={sit}
                  className={`rounded-xl border p-4 ${
                    isRecommended
                      ? "border-[#388e3c] bg-[#388e3c]/5 dark:bg-[#388e3c]/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-base text-gray-800 dark:text-gray-100 leading-snug">
                      {showABC ? situationMeta[sit].title : "Tu distribución sugerida"}
                    </h4>
                    {(isRecommended || !showABC) && (
                      <span className="text-[10px] font-bold uppercase bg-[#388e3c] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                        Para ti
                      </span>
                    )}
                  </div>
                  <PortfolioPie slices={sitSlices} id={`pie-${sit}`} />
                  <ul className="mt-3 space-y-1.5">
                    {sitSlices.map((s, i) => {
                      const amount = capital > 0 ? Math.round((capital * s.pct) / 100) : 0
                      return (
                        <li key={s.label} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sliceColors[i % sliceColors.length] }}
                          />
                          <span className="flex-1">{s.label}</span>
                          <span className="text-right tabular-nums">
                            <strong>{Math.round(s.pct)}%</strong>
                            {amount > 0 && (
                              <span className="block text-xs text-gray-500 dark:text-gray-400">
                                {formatMoney(amount, currency)}
                              </span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {showABC
                      ? situationMeta[sit].pickIf
                      : sitSlices.length === 1
                        ? singleNote
                        : "Estructura simple para tu nivel y moneda."}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {capital > 0 && instruments.length > 0 && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Tu fondo de emergencia queda fuera de estos montos — ya lo planificaste arriba.
          </p>
        )}

        {/* Proyección integrada al Paso 3 (ponderada por instrumento); solo si alcanza algún instrumento */}
        {capital > 0 && maxTogether > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#388e3c] dark:text-[#81c784]" aria-hidden />
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Proyección</h4>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 leading-relaxed max-w-2xl mx-auto">
              Cada rodaja crece con la tasa de su instrumento ({rateSummary(projSlices.map((s) => s.label), rates)}) ·
              aportes no incluidos · no es garantía.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">En 5 años</div>
                <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                  {formatMoney(proj5, currency)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{formatMoney(proj5 - capital, currency)}
                </div>
              </div>
              <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">En 10 años</div>
                <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                  {formatMoney(proj10, currency)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{formatMoney(proj10 - capital, currency)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Calculator className="h-5 w-5 text-[#388e3c] flex-shrink-0" />
                <span>
                  Tasa combinada de tu distribución: <strong>~{blendedRate.toFixed(1)}%</strong> anual.
                </span>
              </div>
              <Link
                href="/calculadora-interes-compuesto"
                className="inline-flex items-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-5 py-3 rounded-lg text-base font-semibold transition-colors"
                data-interactive="true"
              >
                Abrir calculadora de interés compuesto →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 8 · Dónde invertir: instituciones reguladas */}
      <div className="rounded-xl border border-sky-300 bg-sky-50 p-5 sm:p-6 dark:border-sky-800 dark:bg-sky-900/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Landmark className="h-6 w-6 text-sky-700 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                ¿Dónde invertir en instituciones legales?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Abre tus AFI y certificados solo en entidades reguladas y supervisadas por la{" "}
                <strong>Superintendencia de Bancos (SIB)</strong>: así tu dinero queda protegido y tú, tranquilo.
              </p>
            </div>
          </div>
          <Link
            href="https://www.sb.gob.do/supervisados/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 text-base font-semibold transition-colors"
            data-interactive="true"
          >
            Ver instituciones reguladas en República Dominicana →
          </Link>
        </div>
      </div>

      {/* 9 · Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={startQuiz}
          className="flex-1 flex items-center justify-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-6 py-3.5 rounded-lg font-medium text-base transition-colors"
          data-interactive="true"
        >
          <RotateCcw className="h-5 w-5" />
          Repetir test
        </button>
        <button
          onClick={() => {
            // El test ya quedó guardado localmente: salir no lo borra.
            triggerHapticFeedback("light")
            router.push("/finanzas")
          }}
          className="flex-1 flex items-center justify-center gap-2 border border-[#388e3c] text-[#388e3c] hover:bg-[#388e3c]/10 px-6 py-3.5 rounded-lg font-medium text-base transition-colors"
          data-interactive="true"
        >
          Volver a finanzas
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {savedFlash ? "Guardado local ✓" : `Nivel ${effectiveLevel} · guardado local`}
        </span>
        <button
          onClick={clearData}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
          data-interactive="true"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Borrar mis datos
        </button>
      </div>
    </div>
  )
}
