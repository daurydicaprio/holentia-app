"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gauge, RotateCcw, Trash2, Info, Lightbulb, AlertTriangle, TrendingUp, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useMediaQuery } from "@/hooks/use-media-query"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("test-perfil-riesgo")

interface RiskDraft {
  answers?: Record<number, string>
  showResults?: boolean
  level?: number
  capital?: string
  currency?: "USD" | "DOP"
  savedAt?: string
}

type OptionKey = string

interface Option {
  text: string
  key: OptionKey
  /** 1 conservador · 2 medio · 3 arriesgado (solo dimensiones de riesgo) */
  risk?: number
  /** techo de nivel por conocimiento: 1 | 2 | 3 */
  ceiling?: number
  /** preselección de pastel situacional: A | B | C */
  situation?: "A" | "B" | "C"
  /** marca "hacerme rico rápido" */
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
    text: "Si tu inversión cae 20% en un mes, ¿qué harías?",
    hint: "Responde como lo harías de verdad, no como te gustaría.",
    options: [
      { text: "Vender todo: no puedo ver perder dinero", key: "q1_sell", risk: 1 },
      { text: "Esperar a que se recupere, sin tocar nada", key: "q1_hold", risk: 2 },
      { text: "Compraría más: está de oferta", key: "q1_buy", risk: 3 },
    ],
  },
  {
    id: 2,
    text: "Cuando el mercado está en rojo, tú…",
    options: [
      { text: "Me estreso y reviso el saldo a cada rato", key: "q2_stress", risk: 1 },
      { text: "Sigo mi plan de largo plazo", key: "q2_plan", risk: 2 },
      { text: "Lo veo como oportunidad", key: "q2_opp", risk: 3 },
    ],
  },
  {
    id: 3,
    text: "¿Cuándo vas a necesitar este dinero?",
    options: [
      { text: "En menos de 3 años", key: "q3_short", risk: 1 },
      { text: "Entre 3 y 10 años", key: "q3_mid", risk: 2 },
      { text: "Más de 10 años (ideal 20–30)", key: "q3_long", risk: 3 },
    ],
  },
  {
    id: 4,
    text: "¿Cuánto sabes de inversiones hoy?",
    hint: "Ser honesto aquí te ahorra dinero.",
    options: [
      { text: "Nada: aún no invierto", key: "q4_none", ceiling: 1 },
      { text: "Certificados o fondos (nivel 1)", key: "q4_basic", ceiling: 2 },
      { text: "Sé qué es un ETF / fondo indexado", key: "q4_etf", ceiling: 3 },
      { text: "Leo noticias, balancees y sigo mercados", key: "q4_adv", ceiling: 3 },
    ],
  },
  {
    id: 5,
    text: "¿Qué tan estable es tu ingreso?",
    options: [
      { text: "Estable y con fondo de emergencia", key: "q5_safe", situation: "B" },
      { text: "Estable, pero sin fondo de emergencia", key: "q5_nofund", situation: "A" },
      { text: "Independiente o posible despido en 1 año", key: "q5_risk", situation: "C" },
    ],
  },
  {
    id: 6,
    text: "¿Cuál es tu objetivo principal al invertir?",
    options: [
      { text: "No perder poder de compra (inflación)", key: "q6_inflation", risk: 1 },
      { text: "Hacer crecer el patrimonio a 20–30 años", key: "q6_wealth", risk: 2 },
      { text: "Hacerme rico lo antes posible", key: "q6_rich", risk: 3, richQuick: true },
    ],
  },
]

const levelInfo: Record<number, { name: string; badge: string; blurb: string; rate: number }> = {
  1: {
    name: "Nivel 1 · Conservador",
    badge: "Base sólida",
    blurb:
      "Certificados, mercado local y fondos de inversión (en pesos o en dólares). Poco riesgo y le gana a la inflación. Con poco tiempo es factible y es donde la mayoría debe estar.",
    rate: 6,
  },
  2: {
    name: "Nivel 2 · Crecimiento",
    badge: "ETFs y fondos indexados",
    blurb:
      "Bolsa de EE.UU. y mundial vía ETF o fondos indexados. Diversificación global sin elegir acciones. Es más que suficiente para la mayoría de las personas.",
    rate: 9,
  },
  3: {
    name: "Nivel 3 · Acciones individuales",
    badge: "Solo con conocimiento",
    blurb:
      "Acciones de empresas concretas. Requiere leer mercados y noticias: dedica al menos un año de estudio antes de subir. Si el capital es chico, 7–10 empresas como máximo.",
    rate: 11,
  },
}

interface Slice {
  label: string
  pct: number
}

const sliceColors = ["#2e7d32", "#66bb6a", "#a5d6a7", "#1b5e20", "#81c784", "#c8e6c9"]

/** Estructuras de pastel por nivel y situación (sugerencias educativas). */
const portfolios: Record<number, Record<"A" | "B" | "C", Slice[]>> = {
  1: {
    A: [
      { label: "Efectivo / emergencia", pct: 40 },
      { label: "Certificados", pct: 35 },
      { label: "FIA (pesos o USD)", pct: 25 },
    ],
    B: [
      { label: "Colchón emergencia", pct: 20 },
      { label: "Certificados", pct: 40 },
      { label: "FIA (pesos o USD)", pct: 40 },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 45 },
      { label: "Certificados cortos", pct: 35 },
      { label: "FIA líquido", pct: 20 },
    ],
  },
  2: {
    A: [
      { label: "Efectivo / emergencia", pct: 50 },
      { label: "ETF global indexado", pct: 50 },
    ],
    B: [
      { label: "Colchón emergencia", pct: 10 },
      { label: "ETF global (80–90% stock index)", pct: 75 },
      { label: "Bonos / estabilidad", pct: 15 },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 30 },
      { label: "ETF global indexado", pct: 60 },
      { label: "FIA líquido", pct: 10 },
    ],
  },
  3: {
    A: [
      { label: "Efectivo / emergencia", pct: 50 },
      { label: "ETF indexado (base)", pct: 40 },
      { label: "Acciones (máx. 7–10)", pct: 10 },
    ],
    B: [
      { label: "ETF indexado (base)", pct: 55 },
      { label: "Acciones (7–10 si < $10k)", pct: 35 },
      { label: "Colchón", pct: 10 },
    ],
    C: [
      { label: "Colchón / efectivo", pct: 35 },
      { label: "ETF indexado", pct: 45 },
      { label: "Acciones (pocas)", pct: 20 },
    ],
  },
}

const situationMeta: Record<"A" | "B" | "C", { title: string; pickIf: string }> = {
  A: {
    title: "Opción A · Sin colchón",
    pickIf: "Elige esta si no tienes fondo de emergencia o tu ingreso es inestable.",
  },
  B: {
    title: "Opción B · Estándar",
    pickIf: "Elige esta si ya tienes fondo de emergencia y tu ingreso es estable.",
  },
  C: {
    title: "Opción C · Ingresos variables",
    pickIf: "Elige esta si trabajas independiente o podrían despedirte pronto.",
  },
}

const USD_TO_DOP = 59

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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return ""
  }
}

/** Doughnut de una estructura de portafolio. */
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
}

function computeResult(answers: Record<number, string>): ComputedResult {
  const byId = new Map<number, Option>()
  for (const q of questions) {
    for (const opt of q.options) byId.set(q.id, byId.get(q.id) ?? opt)
  }
  // rebuild properly: pick chosen option per question
  const chosen: Option[] = []
  for (const q of questions) {
    const key = answers[q.id]
    const opt = q.options.find((o) => o.key === key)
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

  const situation = (chosen.find((o) => o.situation)?.situation ?? "B") as "A" | "B" | "C"
  const richQuick = chosen.some((o) => o.richQuick)

  return { level, knowledgeCeiling, knowledgeLocked, situation, richQuick }
}

export function RiskProfileTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const router = useRouter()
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [capitalInput, setCapitalInput] = useState("")
  const [currency, setCurrency] = useState<"USD" | "DOP">("USD")
  const [savedFlash, setSavedFlash] = useState(false)
  const [restored, setRestored] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  // Restaurar Tipo D (solo cliente)
  useEffect(() => {
    const draft = storageGet<RiskDraft>(DRAFT_KEY, {})
    if (draft.answers && Object.keys(draft.answers).length >= questions.length && draft.level) {
      setAnswers(draft.answers)
      if (draft.capital !== undefined) setCapitalInput(draft.capital)
      if (draft.currency === "USD" || draft.currency === "DOP") setCurrency(draft.currency)
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

  const capitalUsd = currency === "USD" ? capital : capital / USD_TO_DOP
  const lowCapital = capital > 0 && capitalUsd < 3000

  const effectiveLevel = lowCapital && result ? Math.min(result.level, 2) : (result?.level ?? 1)
  const levelRate = levelInfo[effectiveLevel]?.rate ?? 8

  const proj5 = capital > 0 ? capital * Math.pow(1 + levelRate / 100, 5) : 0
  const proj10 = capital > 0 ? capital * Math.pow(1 + levelRate / 100, 10) : 0

  // Autoguardado Tipo D (solo cuando hay progreso real)
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
  }, [phase, answers, capitalInput, currency, result])

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

  const resetAll = () => {
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers({})
    setCapitalInput("")
    setCurrency("USD")
    setRestored(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const clearData = () => {
    storageRemove(DRAFT_KEY)
    setCapitalInput("")
    triggerHapticFeedback("medium")
    setSavedFlash(false)
  }

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
            <strong>Responde con la mayor honestidad posible.</strong> El test solo sirve si eres sincero contigo
            mismo. Son 6 preguntas, menos de 2 minutos.
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
          {question.hint && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{question.hint}</p>
          )}
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

  /* ---------- RESULT ---------- */
  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Responde las 6 preguntas para ver tu perfil.</p>
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

  const slices = portfolios[effectiveLevel][result.situation]
  const situations: Array<"A" | "B" | "C"> = ["A", "B", "C"]
  const chosenSlices = portfolios[effectiveLevel]

  return (
    <div className="space-y-6">
      {/* Héroe resultado */}
      <div
        className="rounded-xl p-6 sm:p-8 text-white text-center shadow-lg"
        style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">
          {levelInfo[effectiveLevel].badge}
        </div>
        <div className="text-3xl sm:text-4xl font-bold mb-2">{levelInfo[effectiveLevel].name}</div>
        <p className="text-sm sm:text-base opacity-90 max-w-xl mx-auto leading-relaxed">
          {levelInfo[effectiveLevel].blurb}
        </p>
        {lowCapital && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Capital chico: te conviene el nivel 1–2
          </div>
        )}
      </div>

      {/* Candado conocimiento */}
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

      {/* Prisa / riqueza */}
      {result.richQuick && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
            <strong>No busques hacerte rico con las inversiones.</strong> Sirven para hacer crecer el patrimonio;
            la riqueza real se construye en <strong>20–30 años</strong>. Las prisas son malos compañeros.
          </p>
        </div>
      )}

      {/* Los 5 niveles */}
      <details className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg group">
        <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-gray-800 dark:text-gray-100">
          <span>Los 5 niveles de inversión (según Daury)</span>
          <ChevronDown className="h-5 w-5 text-[#388e3c] transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <strong className="text-[#388e3c]">1 · Certificados, mercado local, FIA</strong> — poco riesgo, le
            gana a la inflación. Incluye fondos en dólares.
          </p>
          <p>
            <strong className="text-[#388e3c]">2 · ETF y fondos indexados (USA / mundial)</strong> — bolsa global
            sin elegir acciones. Más que suficiente para la mayoría.
          </p>
          <p>
            <strong className="text-[#388e3c]">3 · Acciones individuales</strong> — exige conocimiento de
            mercados y noticias; mínimo ~1 año de estudio antes de subir. Si capital &lt; $10k: 7–10 empresas.
          </p>
          <p className="text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
            <strong>4 y 5 (forex, margen, opciones…):</strong> no los necesitas para crecer patrimonio. Solo lo
            regulado, sin prisa, a largo plazo. En Holentia no los recomendamos.
          </p>
        </div>
      </details>

      {/* 3 pasteles situacionales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">3 formas de armar tu portafolio</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Sugerencias educativas para tu nivel. Tú decides — es tu responsabilidad.
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
                  {sitSlices.map((s, i) => (
                    <li key={s.label} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sliceColors[i % sliceColors.length] }}
                      />
                      <span className="flex-1">{s.label}</span>
                      <strong className="tabular-nums">{s.pct}%</strong>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                  {situationMeta[sit].pickIf}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capital + moneda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">¿Cuánto planeas invertir?</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Esto no cambia tu perfil: solo ajusta la proyección y un consejo por monto.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={capitalInput}
            onChange={(e) => setCapitalInput(e.target.value)}
            placeholder="Ej: 4000"
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"
            data-interactive="true"
          />
          <div className="flex gap-2">
            {(["USD", "DOP"] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCurrency(c)
                  triggerHapticFeedback("light")
                }}
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

        {lowCapital && (
          <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              Con menos de <strong>$3,000</strong>, quédate en <strong>nivel 1–2</strong>: son menos riesgosos y
              mueven la aguja. Ejemplo: invertir $1,000 al 15% en un año son solo <strong>$150</strong> — con
              $3,000–$4,000 la diferencia entre niveles ya se nota. El capital chico crece mejor en la base.
            </p>
          </div>
        )}
      </div>

      {/* Proyección + link */}
      {capital > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#388e3c]" />
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Proyección a 5 y 10 años</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">En 5 años (~{levelRate}% anual)</div>
              <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                {formatMoney(proj5, currency)}
              </div>
            </div>
            <div className="rounded-xl bg-[#388e3c]/10 px-4 py-5 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">En 10 años (~{levelRate}% anual)</div>
              <div className="text-2xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
                {formatMoney(proj10, currency)}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Estimación educativa con interés compuesto (aportes no incluidos). Tasa de referencia de tu nivel — no
            es garantía. A largo plazo (20–30 años) el efecto se multiplica.
          </p>
          <Link
            href="/calculadora-interes-compuesto"
            className="inline-flex items-center gap-2 text-[#388e3c] font-semibold hover:underline"
            data-interactive="true"
          >
            Verlo en mayor dimensión en la calculadora de interés compuesto →
          </Link>
        </div>
      )}

      {/* Acciones */}
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
          {savedFlash
            ? "Guardado local ✓"
            : `Último test${result ? "" : ""} · Nivel ${effectiveLevel}`}
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
