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
  ShieldAlert,
  PieChart,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useMediaQuery } from "@/hooks/use-media-query"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { RiskLevelsGraphic, LEVELS } from "./risk-levels-graphic"
import { FundProjectionChart } from "./fund-projection-chart"

const DRAFT_KEY = draftKey("test-perfil-riesgo")

interface RiskDraft {
  answers?: Record<number, string>
  showResults?: boolean
  level?: number
  capital?: string
  currency?: "USD" | "DOP"
  rate?: string
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

const ABC_DOP = 100000
const ABC_USD = 3000
const INSTR_MIN = {
  DOP: { liquid: 5000, cert: 10000, d30: 10000 },
  USD: { d30: 200 },
}
/** Hasta aquí el capital se considera "pequeño" → nivel 1–2. */
const LEVEL_CAP: Record<"USD" | "DOP", number> = { DOP: 5000, USD: 3000 }
const RATES = [8, 10, 15]

/** Mínimo real por instrumento para poder abrirlo (usa las etiquetas de los pasteles). */
const SLICE_MIN: Record<string, number> = {
  "AFI líquido": 5000,
  "AFI líquido / estabilidad": 5000,
  Certificados: 10000,
  "Certificados cortos": 10000,
  "Fondo a 30 días (USD)": 200,
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

/** Encabezado centrado de las secciones inferiores: icono + título + subtítulo. */
function SectionHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: ReactNode }) {
  return (
    <div className="text-center mb-4">
      <div className="inline-flex items-center justify-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-[#388e3c] dark:text-[#81c784]" aria-hidden />
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      {subtitle !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
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
      ? "ingreso independiente"
      : incomeKey === "q6_risk"
        ? "tu empleo puede cambiar pronto"
        : "ingreso estable"

  let reason = `Quédate en el nivel ${level}: ${fundPhrase} y ${incomePhrase}.`
  if (knowledgeLocked) {
    reason = `Quédate en el nivel ${level}: estás empezando y primero conviene aprender.`
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
  const [rateInput, setRateInput] = useState<string>("8")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [fundMultiplier, setFundMultiplier] = useState(0)
  const [savePct, setSavePct] = useState("")
  const [showLevels, setShowLevels] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [restored, setRestored] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  useEffect(() => {
    const draft = storageGet<RiskDraft>(DRAFT_KEY, {})
    if (draft.answers && Object.keys(draft.answers).length >= questions.length && draft.level) {
      setAnswers(draft.answers)
      if (draft.capital !== undefined) setCapitalInput(draft.capital)
      if (draft.currency === "USD" || draft.currency === "DOP") setCurrency(draft.currency)
      if (typeof draft.rate === "string") setRateInput(draft.rate)
      if (draft.monthlyIncome !== undefined) setMonthlyIncome(draft.monthlyIncome)
      if (typeof draft.fundMultiplier === "number") setFundMultiplier(draft.fundMultiplier)
      if (typeof draft.savePct === "string") setSavePct(draft.savePct)
      setPhase("result")
      setRestored(true)
    }
    firstLoad.current = false
  }, [])

  const result = useMemo(() => {
    if (phase !== "result") return null
    if (Object.keys(answers).length < questions.length) return null
    return computeResult(answers)
  }, [phase, answers])

  const capital = useMemo(() => {
    const n = Number.parseFloat(capitalInput)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [capitalInput])

  const income = useMemo(() => {
    const n = Number.parseFloat(monthlyIncome)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [monthlyIncome])

  const hasFund = fundMultiplier > 0
  const fundSize = income * fundMultiplier
  const fundTarget = income * 2

  const saveRate = useMemo(() => {
    const n = Number.parseFloat(savePct)
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

  const abcThreshold = currency === "DOP" ? ABC_DOP : ABC_USD
  const showABC =
    capital > 0 && capital >= abcThreshold && !(currency === "USD" && effectiveLevel === 1)

  const selectedRate = useMemo(() => {
    const n = Number.parseFloat(rateInput)
    return isNaN(n) || n < 0 ? (currency === "USD" ? 10 : 8) : n
  }, [rateInput, currency])

  const proj5 = capital > 0 ? capital * Math.pow(1 + selectedRate / 100, 5) : 0
  const proj10 = capital > 0 ? capital * Math.pow(1 + selectedRate / 100, 10) : 0

  const inflationLoss = fundSize > 0 ? fundSize * 0.04 : 0
  const fundYearReturn = fundSize > 0 ? fundSize * (selectedRate / 100) : 0

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
        rate: rateInput,
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
  }, [phase, answers, capitalInput, currency, rateInput, monthlyIncome, fundMultiplier, savePct, result])

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
    setRateInput(c === "USD" ? "10" : "8")
    triggerHapticFeedback("light")
  }

  const resetAll = () => {
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers({})
    setCapitalInput("")
    setCurrency("DOP")
    setRateInput("8")
    setMonthlyIncome("")
    setFundMultiplier(0)
    setSavePct("")
    setShowLevels(false)
    setRestored(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const clearData = () => {
    storageRemove(DRAFT_KEY)
    setCapitalInput("")
    setMonthlyIncome("")
    setSavePct("")
    setFundMultiplier(0)
    triggerHapticFeedback("medium")
    setSavedFlash(false)
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
            {question.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(question.id, option.key)}
                className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#388e3c] hover:bg-[#388e3c]/5 dark:hover:bg-[#388e3c]/10 transition-all"
                data-interactive="true"
              >
                <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
              </button>
            ))}
          </div>
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
  const distSubtitle =
    capital <= 0
      ? "Escribe cuánto planeas invertir arriba para ver montos."
      : maxTogether === 0
        ? `Montos sobre ${formatMoney(capital, currency)}.`
        : `Montos sobre ${formatMoney(capital, currency)}. ${
            maxTogether === 1
              ? instruments.length > 1
                ? `Este monto te deja elegir 1 instrumento a la vez de los ${instruments.length} que listamos.`
                : "Este monto te alcanza para 1 instrumento."
              : `Con este monto caben hasta ${maxTogether} instrumentos a la vez.`
          }${capital < abcThreshold ? ` A/B/C desde ${formatMoney(abcThreshold, currency)}.` : ""}`

  return (
    <div className="space-y-6">
      {/* 1 · Héroe */}
      <div
        className="rounded-xl p-6 sm:p-8 text-white text-center shadow-lg"
        style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">Tu resultado</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Perfil de riesgo</h2>
        <p className="text-base sm:text-lg font-semibold mb-4 max-w-xl mx-auto leading-snug">{result.reason}</p>
        <div className="bg-white/15 rounded-xl p-4 max-w-xl mx-auto text-left">
          <div className="font-bold text-lg mb-1">{levelDef.name}</div>
          <div className="text-xs uppercase tracking-wider opacity-75 mb-2">{levelDef.short}</div>
          <p className="text-sm opacity-90 leading-relaxed">{levelDef.desc}</p>
        </div>
        {lowCapital && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Capital pequeño (menos de {formatMoney(levelCap, currency)}): te conviene el nivel 1–2
          </div>
        )}
      </div>

      {/* 2 · Aviso conocimiento */}
      {result.knowledgeLocked && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Apetito alto, conocimiento bajo.</strong> Primero aprende: quédate en el{" "}
            <strong>nivel {result.knowledgeCeiling}</strong> (o baja) hasta que domines lo básico — con poco tiempo
            los niveles 1 y 2 son factibles y <strong>le ganan a la inflación</strong>. No necesitas subir de nivel
            para hacer crecer tu patrimonio.
          </div>
        </div>
      )}

      {/* 3 · Aviso prisa */}
      {result.richQuick && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
            <strong>No busques hacerte rico con las inversiones.</strong> Sirven para hacer crecer el patrimonio;
            la riqueza real se construye en <strong>20–30 años</strong>. Las prisas son malos compañeros.
          </p>
        </div>
      )}

      {/* 4 · Ver niveles (colapsado) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => {
            setShowLevels(!showLevels)
            triggerHapticFeedback("light")
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-[#388e3c] hover:bg-[#388e3c]/5 transition-colors"
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
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-5">
              Tu nivel está resaltado en el arco. Solo lo regulado, sin prisa, a largo plazo.
            </p>

            <RiskLevelsGraphic activeLevel={effectiveLevel} />

            <ul className="mt-5 space-y-3">
              {LEVELS.map((lvl) => {
                const isActive = lvl.n === effectiveLevel
                return (
                  <li
                    key={lvl.n}
                    className={`rounded-lg border p-3 ${
                      lvl.danger
                        ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/15"
                        : isActive
                          ? "border-[#388e3c] bg-[#388e3c]/5 dark:bg-[#388e3c]/10"
                          : "border-gray-200 dark:border-gray-700"
                    } ${isActive ? "ring-1 ring-[#388e3c]" : ""}`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          lvl.danger
                            ? "bg-red-600 text-white"
                            : isActive
                              ? "bg-[#388e3c] text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lvl.n}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          lvl.danger ? "text-red-700 dark:text-red-400" : "text-gray-800 dark:text-gray-100"
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
                      className={`text-xs mt-1 leading-relaxed ${
                        lvl.danger ? "text-red-700 dark:text-red-300" : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <strong className={lvl.danger ? "text-red-700 dark:text-red-400" : "text-[#388e3c]"}>
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

      {/* 5 · Plan del fondo de emergencia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <SectionHeader
          icon={ShieldAlert}
          title="Tu fondo de emergencia"
          subtitle="Va aparte de tu portafolio: es tu colchón para imprevistos. Primero esto, después invertir."
        />

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto ganas al mes?</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder={currency === "DOP" ? "Ej: 45000" : "Ej: 800"}
              className={inputClass}
              data-interactive="true"
            />
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400">¿Cuánto tienes ya ahorrado?</span>
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
            {hasFund && fundSize > 0 && (
              <p className="text-xs text-[#1b5e20] dark:text-[#a5d6a7] mt-2 font-medium">
                Tienes {formatMoney(fundSize, currency)} ({fundMultiplier} meses de sueldo) · meta mínima 2× ={" "}
                {formatMoney(fundTarget, currency)}
              </p>
            )}
          </div>

          {/* Sin fondo: educación + plan de ahorro con gráfico */}
          {!hasFund && (
            <div className="rounded-lg bg-[#388e3c]/5 dark:bg-[#388e3c]/10 border border-[#388e3c]/30 p-4">
              <div className="flex items-start gap-2 mb-3">
                <ShieldAlert className="h-5 w-5 text-[#388e3c] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-gray-100">Primero: tu fondo de emergencia.</strong>{" "}
                  El mínimo sugerido es <strong>2× sueldo</strong>
                  {income > 0 && (
                    <>
                      {" "}
                      = <strong>{formatMoney(fundTarget, currency)}</strong>
                    </>
                  )}
                  . Sin colchón, invertir no funciona: el dinero debe estar quieto y con constancia; si hay una
                  emergencia, venderías en el peor momento.
                </div>
              </div>
              <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                ¿Qué % de tu sueldo puedes ahorrar al mes?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  inputMode="numeric"
                  value={savePct}
                  onChange={(e) => setSavePct(e.target.value)}
                  placeholder="Ej: 15"
                  className={`${inputClass} max-w-[120px]`}
                  data-interactive="true"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">% de tu sueldo</span>
              </div>
              {monthsToFund !== null ? (
                <>
                  <p className="text-xs text-[#1b5e20] dark:text-[#a5d6a7] mt-3 font-medium">
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
                  />
                </>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pon cuánto ganas al mes para ver cuánto tienes ahorrado.
            </p>
          )}

          {/* Rendimiento vs inflación del colchón */}
          {hasFund && fundSize > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#388e3c]/10 px-4 py-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Rendimiento 1 año (tasa {selectedRate}%)
                </div>
                <div className="text-xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                  +{formatMoney(fundYearReturn, currency)}
                </div>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-4 text-center border border-red-200 dark:border-red-800">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Inflación ~4% si lo dejas parado
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                  −{formatMoney(inflationLoss, currency)}
                </div>
              </div>
            </div>
          )}

          {/* Simulador de presupuesto: de dónde sale el ahorro */}
          <div className="rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <ClipboardList className="h-5 w-5 text-[#388e3c] flex-shrink-0" />
              <span>
                Para ahorrar más al mes y llegar antes a tu colchón, organiza ingresos y gastos con el simulador de
                presupuesto.
              </span>
            </div>
            <Link
              href="/crear-presupuesto-personal"
              className="inline-flex items-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              data-interactive="true"
            >
              Abrir presupuesto →
            </Link>
          </div>

          {/* Dónde poner el colchón */}
          {hasFund && fundSize > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Dónde poner tu colchón (alta liquidez, no es "invertir a largo plazo")
              </p>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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
                    <span className="block mt-1 text-amber-700 dark:text-amber-400">
                      Cancelar antes de tiempo: <strong>3% anual sobre el capital</strong> (solo los días que
                      falten). Ej.: RD$10,000 con 1 mes por vencer ≈ <strong>RD$25</strong> + te reajustan los
                      intereses ya ganados a tasa de ahorro. Un retiro temprano puede comerse tus ganancias.
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
                    {formatMoney(INSTR_MIN.USD.d30, "USD")}. En dólares no hay AFI líquido: el mínimo es plazo de
                    30 días. Penalidad si retiras antes.
                  </li>
                )}
              </ul>
              {currency === "DOP" && fundSize < INSTR_MIN.DOP.liquid && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-3 leading-relaxed">
                  Tu colchón aún no alcanza el mínimo de AFI líquido (RD$5,000): déjalo en cuenta o sigue ahorrando
                  hasta llegar.
                </p>
              )}
              {currency === "USD" && fundSize < INSTR_MIN.USD.d30 && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-3 leading-relaxed">
                  Tu colchón aún no alcanza el mínimo del fondo en USD ($200): sigue ahorrando hasta llegar.
                </p>
              )}
              {currency === "DOP" && fundSize >= 15000 && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">
                  Sugerencia: parte líquida (AFI) + resto a 30 días o certificado, según tu monto.
                </p>
              )}
              {currency === "DOP" && fundSize >= INSTR_MIN.DOP.liquid && fundSize < 15000 && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">
                  Con este monto, todo a AFI líquido (mín. RD$5,000): es lo que puedes abrir ahora.
                </p>
              )}
              {currency === "USD" && fundSize >= INSTR_MIN.USD.d30 && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">
                  En dólares: fondo a 30 días (mín. $200) es tu opción de mayor liquidez.
                </p>
              )}
            </div>
          )}

          {/* Elección: no invertir + inflación + tarjeta */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              ¿Prefieres no invertir tu fondo de emergencia?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Es válido. Pero ten en cuenta:{" "}
              {fundSize > 0 ? (
                <>
                  dejar <strong>{formatMoney(fundSize, currency)}</strong> quietos pierde ~{" "}
                  <strong className="text-red-600 dark:text-red-400">{formatMoney(inflationLoss, currency)}</strong>{" "}
                  al año por inflación (~4%).
                </>
              ) : (
                <>el dinero parado pierde ~3–5% al año de poder de compra.</>
              )}{" "}
              Pregúntate: <em>¿cuándo fue mi última emergencia? ¿No siempre es una parte, no todo de golpe?</em>
            </p>
            <div className="rounded-lg bg-[#388e3c]/5 dark:bg-[#388e3c]/10 border border-[#388e3c]/40 p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <Info className="h-4 w-4 text-[#388e3c] flex-shrink-0" />
                <span>
                  Si pagas con <strong>tarjeta de crédito</strong> (hospital, llantas…): no financies. Saca del
                  colchón <strong>2–3 días antes del vencimiento</strong>.
                </span>
              </div>
              <Link
                href="/tarjeta-corte-vencimiento"
                className="inline-flex items-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                data-interactive="true"
              >
                Ver corte y vencimiento →
              </Link>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              Si la emergencia pide <strong>efectivo</strong>, retira del fondo <strong>líquido</strong> (horario
              de oficina). No hace falta tocar inversiones a largo plazo.
            </p>
          </div>
        </div>
      </div>

      {/* 6 · Tu dinero a invertir */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <SectionHeader
          icon={Wallet}
          title="Tu dinero a invertir"
          subtitle="Define cuánto vas a invertir, en qué moneda y qué tasa esperas: esto alimenta la distribución y la proyección."
        />

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto planeas invertir?</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                placeholder={currency === "DOP" ? "Ej: 25000" : "Ej: 1500"}
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
            <label className="block text-sm font-medium mb-2">Tasa anual que esperas (%)</label>
            <div className="flex flex-wrap gap-2">
              {RATES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRateInput(String(r))
                    triggerHapticFeedback("light")
                  }}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    Number(rateInput) === r
                      ? "bg-[#388e3c] text-white"
                      : "bg-[#388e3c]/10 hover:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784]"
                  }`}
                  data-interactive="true"
                >
                  {r}%
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Referencia actual: ~8% en pesos · 10–15% en dólares (no es garantía).
            </p>
          </div>
        </div>

        {lowCapital && (
          <div className="mt-5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              {currency === "DOP" ? (
                <>
                  Para invertir en <strong>pesos hace falta al menos RD$5,000</strong>. Con poco capital quédate en{" "}
                  <strong>nivel 1–2</strong>: menos riesgo y mueve la aguja cuando crezca.
                </>
              ) : (
                <>
                  Desde <strong>$200</strong> ya puedes empezar (fondo a 30 días). Con menos de{" "}
                  <strong>$3,000</strong> quédate en <strong>nivel 1–2</strong>: menos riesgo y mueve la aguja
                  cuando crezca.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* 7 · Cómo distribuir */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <SectionHeader icon={PieChart} title="Cómo distribuir tu dinero" subtitle={distSubtitle} />

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
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Instrumentos a los que alcanza tu monto
            </p>
            <ul className="space-y-2">
              {instruments.map((inst) => (
                <li key={inst.name} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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
              const sitSlices =
                feasibleSlices(chosenSlices[sit], capital) ?? [singleSliceFor(capital, sit, currency)]
              const isRecommended = sit === result.situation
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
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 leading-snug">
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
                        <li key={s.label} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sliceColors[i % sliceColors.length] }}
                          />
                          <span className="flex-1">{s.label}</span>
                          <span className="text-right tabular-nums">
                            <strong>{Math.round(s.pct)}%</strong>
                            {amount > 0 && (
                              <span className="block text-[10px] text-gray-500 dark:text-gray-400">
                                {formatMoney(amount, currency)}
                              </span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                    {showABC
                      ? situationMeta[sit].pickIf
                      : sitSlices.length === 1
                        ? "Un solo instrumento: por ahora este monto no alcanza para dividir."
                        : "Estructura simple para tu nivel y moneda."}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {capital > 0 && instruments.length > 0 && (
          <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Tu fondo de emergencia queda fuera de estos montos — ya lo planificaste arriba.
          </p>
        )}
      </div>

      {/* 8 · Proyección + interés compuesto */}
      {capital > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <SectionHeader
            icon={TrendingUp}
            title="Proyección"
            subtitle={`Aportes no incluidos · tasa ${selectedRate}% anual · no es garantía.`}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">En 5 años</div>
              <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                {formatMoney(proj5, currency)}
              </div>
            </div>
            <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">En 10 años</div>
              <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                {formatMoney(proj10, currency)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap rounded-lg border border-[#388e3c]/40 bg-[#388e3c]/5 dark:bg-[#388e3c]/10 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calculator className="h-5 w-5 text-[#388e3c] flex-shrink-0" />
              ¿Quieres sumar aportes mensuales o ver otros plazos?
            </div>
            <Link
              href="/calculadora-interes-compuesto"
              className="inline-flex items-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              data-interactive="true"
            >
              Abrir calculadora de interés compuesto →
            </Link>
          </div>
        </div>
      )}

      {/* 9 · Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={startQuiz}
          className="flex-1 flex items-center justify-center gap-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          data-interactive="true"
        >
          <RotateCcw className="h-5 w-5" />
          Repetir test
        </button>
        <button
          onClick={() => {
            resetAll()
            router.push("/finanzas")
          }}
          className="flex-1 flex items-center justify-center gap-2 border border-[#388e3c] text-[#388e3c] hover:bg-[#388e3c]/10 px-6 py-3 rounded-lg font-medium transition-colors"
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
