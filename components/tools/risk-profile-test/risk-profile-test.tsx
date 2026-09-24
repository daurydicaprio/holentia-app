"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gauge, RotateCcw, Trash2, Info, Lightbulb, AlertTriangle, TrendingUp, Calculator, Wallet } from "lucide-react"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useMediaQuery } from "@/hooks/use-media-query"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { RiskLevelsGraphic, LEVELS } from "./risk-levels-graphic"

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
  savedAt?: string
}

interface Option {
  text: string
  key: string
  /** 1 conservador · 2 medio · 3 arriesgado */
  risk?: number
  /** techo de nivel por conocimiento: 1 | 2 | 3 */
  ceiling?: number
  /** preselección pastel: A | B | C */
  situation?: "A" | "B" | "C"
  /** marca "enriquecerme rápido" */
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
  isFund?: boolean
}

const sliceColors = ["#2e7d32", "#66bb6a", "#a5d6a7", "#1b5e20", "#81c784", "#c8e6c9"]

const portfolios: Record<number, Record<"A" | "B" | "C", Slice[]>> = {
  1: {
    A: [
      { label: "Efectivo / emergencia", pct: 40, isFund: true },
      { label: "Certificados", pct: 35 },
      { label: "AFI (pesos o USD)", pct: 25 },
    ],
    B: [
      { label: "Colchón emergencia", pct: 20, isFund: true },
      { label: "Certificados", pct: 40 },
      { label: "AFI (pesos o USD)", pct: 40 },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 45, isFund: true },
      { label: "Certificados cortos", pct: 35 },
      { label: "AFI líquido", pct: 20 },
    ],
  },
  2: {
    A: [
      { label: "Efectivo / emergencia", pct: 50, isFund: true },
      { label: "ETF global indexado", pct: 50 },
    ],
    B: [
      { label: "Colchón emergencia", pct: 10, isFund: true },
      { label: "ETF global (80–90% stock index)", pct: 75 },
      { label: "Bonos / estabilidad", pct: 15 },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 30, isFund: true },
      { label: "ETF global indexado", pct: 60 },
      { label: "AFI líquido", pct: 10 },
    ],
  },
  3: {
    A: [
      { label: "Efectivo / emergencia", pct: 50, isFund: true },
      { label: "ETF indexado (base)", pct: 40 },
      { label: "Acciones (máx. 7–10)", pct: 10 },
    ],
    B: [
      { label: "ETF indexado (base)", pct: 55 },
      { label: "Acciones (7–10 si < $10k)", pct: 35 },
      { label: "Colchón", pct: 10, isFund: true },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 35, isFund: true },
      { label: "ETF indexado", pct: 45 },
      { label: "Acciones (pocas)", pct: 20 },
    ],
  },
}

const situationMeta: Record<"A" | "B" | "C", { title: string; pickIf: string }> = {
  A: {
    title: "Opción A · Sin colchón",
    pickIf: "Todavía no tienes fondo de emergencia o tu ingreso es inestable.",
  },
  B: {
    title: "Opción B · Estándar",
    pickIf: "Ya tienes colchón y tu ingreso es estable.",
  },
  C: {
    title: "Opción C · Ingresos variables",
    pickIf: "Trabajas independiente o tu empleo puede caer pronto.",
  },
}

const USD_TO_DOP = 59
const RATES = [8, 10, 15]

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
                label: (c) => `${c.label}: ${c.parsed}%`,
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

interface ComputedResult {
  level: number
  knowledgeCeiling: number
  knowledgeLocked: boolean
  situation: "A" | "B" | "C"
  richQuick: boolean
  /** Frase de sugerencia para el héroe */
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

  // Situación: Q6 C gana; si no, Q5 decide A/B; default B
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
  const [currency, setCurrency] = useState<"USD" | "DOP">("USD")
  const [rateInput, setRateInput] = useState<string>("10")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [fundMultiplier, setFundMultiplier] = useState(2)
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

  const fundSize = income * fundMultiplier

  const capitalUsd = currency === "USD" ? capital : capital / USD_TO_DOP
  const lowCapital = capital > 0 && capitalUsd < 3000

  const effectiveLevel = lowCapital && result ? Math.min(result.level, 2) : (result?.level ?? 1)

  const selectedRate = useMemo(() => {
    const n = Number.parseFloat(rateInput)
    return isNaN(n) || n < 0 ? (currency === "USD" ? 10 : 8) : n
  }, [rateInput, currency])

  const proj5 = capital > 0 ? capital * Math.pow(1 + selectedRate / 100, 5) : 0
  const proj10 = capital > 0 ? capital * Math.pow(1 + selectedRate / 100, 10) : 0

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
  }, [phase, answers, capitalInput, currency, rateInput, monthlyIncome, fundMultiplier, result])

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
    setCurrency("USD")
    setRateInput("10")
    setMonthlyIncome("")
    setFundMultiplier(2)
    setRestored(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const clearData = () => {
    storageRemove(DRAFT_KEY)
    setCapitalInput("")
    setMonthlyIncome("")
    triggerHapticFeedback("medium")
    setSavedFlash(false)
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"

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
  const situations: Array<"A" | "B" | "C"> = ["A", "B", "C"]
  const chosenSlices = portfolios[effectiveLevel]

  return (
    <div className="space-y-6">
      {/* 1 · Héroe: solo perfil + sugerencia + descripción */}
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
            Capital chico: te conviene el nivel 1–2
          </div>
        )}
      </div>

      {/* 2 · Aviso conocimiento (gustó) */}
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

      {/* 4 · Los 5 niveles — gráfico + lista (4 y 5 en rojo) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Los 5 niveles de inversión</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
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

      {/* 5 · Fondo de emergencia + capital + tasa (inputs de planificación) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#388e3c]" />
          Tu situación en números
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Esto no cambia tu perfil: alimenta los montos del portafolio y la proyección.
        </p>

        <div className="space-y-5">
          {/* Sueldo + multiplicador fondo */}
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto ganas al mes?</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="Ej: 45000"
              className={inputClass}
              data-interactive="true"
            />
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400">Fondo de emergencia:</span>
              {[2, 4, 6].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setFundMultiplier(m)
                    triggerHapticFeedback("light")
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    fundMultiplier === m
                      ? "bg-[#388e3c] text-white"
                      : "bg-[#388e3c]/10 hover:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784]"
                  }`}
                  data-interactive="true"
                >
                  {m}× sueldo
                </button>
              ))}
            </div>
            {fundSize > 0 && (
              <p className="text-xs text-[#1b5e20] dark:text-[#a5d6a7] mt-2 font-medium">
                Tu colchón objetivo: {formatMoney(fundSize, currency)} ({fundMultiplier} meses de sueldo)
              </p>
            )}
          </div>

          {/* Capital + moneda */}
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuánto planeas invertir?</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                placeholder="Ej: 4000"
                className={`flex-1 ${inputClass}`}
                data-interactive="true"
              />
              <div className="flex gap-2">
                {(["USD", "DOP"] as const).map((c) => (
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

          {/* Tasa esperada — chips 8/10/15 */}
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
              Con menos de <strong>$3,000</strong>, quédate en <strong>nivel 1–2</strong>: son menos riesgosos y
              mueven la aguja. Ejemplo: invertir $1,000 al 15% en un año son solo <strong>$150</strong> — con
              $3,000–$4,000 la diferencia entre niveles ya se nota.
            </p>
          </div>
        )}
      </div>

      {/* 6 · Portafolio con montos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Cómo distribuir tu dinero</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Tres formas para tu nivel.
          {capital > 0 ? (
            <>
              {" "}
              Montos calculados sobre <strong>{formatMoney(capital, currency)}</strong>.
            </>
          ) : (
            " Escribe cuánto planeas invertir arriba para ver montos."
          )}{" "}
          Tú decides — es tu responsabilidad.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {situations.map((sit) => {
            const sitSlices = chosenSlices[sit]
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
                    {situationMeta[sit].title}
                  </h4>
                  {isRecommended && (
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
                        <span className="flex-1">
                          {s.label}
                          {s.isFund && fundSize > 0 && (
                            <span className="block text-[10px] text-gray-400 dark:text-gray-500">
                              colchón ≈ {formatMoney(fundSize, currency)}
                            </span>
                          )}
                        </span>
                        <span className="text-right tabular-nums">
                          <strong>{s.pct}%</strong>
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
                  {situationMeta[sit].pickIf}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7 · Proyección + link compuesto (integrados) */}
      {capital > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-[#388e3c]" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Proyección</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Aportes no incluidos · tasa {selectedRate}% anual · no es garantía.
          </p>

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

      {/* 8 · Acciones */}
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
