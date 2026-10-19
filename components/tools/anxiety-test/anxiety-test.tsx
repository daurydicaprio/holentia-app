"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Brain, Info, RotateCcw, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Test de ansiedad GAD-7 (Spitzer et al., 2006): 7 preguntas de 0 a 3,
// puntaje total 0–21 con cuatro bandas orientativas. Es una herramienta de
// cribado (screening): orienta, no diagnostica. Todo queda en el navegador.
const DRAFT_KEY = draftKey("test-ansiedad")

const ITEMS = [
  "¿Te has sentido nervioso/a, ansioso/a o con los nervios de punta?",
  "¿No has podido dejar de preocuparte o controlar la preocupación?",
  "¿Te has preocupado demasiado por diferentes cosas?",
  "¿Has tenido dificultad para relajarte?",
  "¿Te has sentido inquieto/a, como si no pudieras quedarte quieto/a?",
  "¿Te has sentido fácilmente molesto/a o irritable?",
  "¿Has sentido miedo, como si algo terrible pudiera pasar?",
]

const OPTIONS = [
  { label: "Nunca", value: 0 },
  { label: "Varios días", value: 1 },
  { label: "Más de la mitad de los días", value: 2 },
  { label: "Casi todos los días", value: 3 },
]

interface Band {
  min: number
  max: number
  name: string
  summary: string
  tips: string[]
  barClass: string
  badgeClass: string
}

const BANDS: Band[] = [
  {
    min: 0,
    max: 4,
    name: "Ansiedad mínima",
    summary:
      "Tus respuestas quedan en el rango mínimo: no se observan señales claras de ansiedad en las últimas dos semanas.",
    tips: [
      "Mantén tus rutinas de sueño, movimiento y descanso.",
      "Ante momentos de tensión, una práctica corta de respiración ayuda.",
      "Escribir lo que te preocupa ordena la cabeza: prueba el diario.",
    ],
    barClass: "bg-emerald-400 dark:bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  {
    min: 5,
    max: 9,
    name: "Ansiedad leve",
    summary: "Hay síntomas leves: es un buen momento para actuar con hábitos antes de que crezcan.",
    tips: [
      "Practica respiración guiada a diario: con 3–5 rondas basta.",
      "Cuida el sueño y baja la cafeína de la tarde.",
      "Si los síntomas duran semanas o interfieren con tu vida, consulta a un profesional.",
    ],
    barClass: "bg-amber-400 dark:bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  },
  {
    min: 10,
    max: 14,
    name: "Ansiedad moderada",
    summary: "Tus respuestas sugieren ansiedad moderada: conviene valorarlo con un profesional de salud mental.",
    tips: [
      "Habla con un psicólogo o profesional de salud mental.",
      "La respiración y el diario ayudan como apoyo, no como tratamiento único.",
      "Si afecta tu trabajo, estudio o sueño, no lo dejes para después.",
    ],
    barClass: "bg-orange-500",
    badgeClass: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  },
  {
    min: 15,
    max: 21,
    name: "Ansiedad grave",
    summary: "Tus respuestas sugieren ansiedad grave: busca apoyo profesional pronto. La ansiedad tiene tratamiento.",
    tips: [
      "Busca ayuda profesional esta semana: psicólogo, médico o tu seguro de salud.",
      "Cuéntale a alguien de confianza cómo estás.",
      "Si sientes que estás en crisis, llama al 911 o acude a emergencias.",
    ],
    barClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200",
  },
]

interface AnsiedadDraft {
  answers?: Record<number, number>
  showResult?: boolean
  score?: number
  savedAt?: string
}

export function AnxietyTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [restored, setRestored] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  // Restaurar el último test guardado (completo → resultado; a medias → quiz)
  useEffect(() => {
    const draft = storageGet<AnsiedadDraft>(DRAFT_KEY, {})
    const answeredCount = Object.keys(draft.answers ?? {}).length
    if (answeredCount > 0) {
      setAnswers(draft.answers ?? {})
      if (answeredCount >= ITEMS.length && draft.showResult) {
        setPhase("result")
        setRestored(true)
      } else {
        const firstMissing = ITEMS.findIndex((_, i) => draft.answers?.[i] === undefined)
        setPhase("quiz")
        setCurrentQuestion(firstMissing === -1 ? ITEMS.length - 1 : firstMissing)
      }
    }
    firstLoad.current = false
  }, [])

  const score = useMemo(() => {
    let total = 0
    for (let i = 0; i < ITEMS.length; i++) total += answers[i] ?? 0
    return total
  }, [answers])

  const complete = useMemo(() => ITEMS.every((_, i) => answers[i] !== undefined), [answers])
  const band = useMemo(() => BANDS.find((b) => score <= b.max) ?? BANDS[0], [score])
  const animatedScore = useCountUp(score, { duration: 500, decimals: 0 })

  // Autoguardado del borrador con debounce 500 ms (se salta la carga inicial)
  useEffect(() => {
    if (firstLoad.current) return
    if (phase === "intro" && Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: AnsiedadDraft = {
        answers,
        showResult: phase === "result",
        score,
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
  }, [phase, answers, score])

  const startQuiz = () => {
    setPhase("quiz")
    setCurrentQuestion(0)
    setAnswers({})
    setRestored(false)
    triggerHapticFeedback("light")
  }

  const handleAnswer = (itemIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemIndex]: value }))
    triggerHapticFeedback("light")
    setTimeout(() => {
      if (currentQuestion < ITEMS.length - 1) setCurrentQuestion(currentQuestion + 1)
      else {
        setPhase("result")
        setRestored(false)
      }
    }, 300)
  }

  const clearData = () => {
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers({})
    setRestored(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  /* ---------- RESULTADO ---------- */
  if (phase === "result" && complete) {
    return (
      <div aria-live="polite" className="animate-result-in space-y-4">
        {/* Héroe */}
        <div className="rounded-2xl border border-mente-border bg-gradient-to-br from-mente to-mente-dark p-6 text-center text-white shadow-lg dark:bg-none dark:bg-mente-glass dark:text-mente-text sm:p-8">
          <p className="text-sm text-white dark:text-mente-lighter">Tu resultado</p>
          <p className="mt-2 text-5xl font-bold tabular-nums">
            {animatedScore}
            <span className="text-2xl font-semibold text-white/80 dark:text-mente-lighter"> / 21</span>
          </p>
          <span className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${band.badgeClass}`}>
            {band.name}
          </span>
          {restored && (
            <p className="mt-3 text-xs text-white dark:text-mente-lighter">Recuperado de tu último test guardado.</p>
          )}
        </div>

        {/* Escala */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="relative">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <div className="w-[23%] bg-emerald-400 dark:bg-emerald-500" />
              <div className="w-[23%] bg-amber-400 dark:bg-amber-500" />
              <div className="w-[23%] bg-orange-500" />
              <div className="flex-1 bg-red-500" />
            </div>
            <div
              className="absolute -top-1 h-5 w-1 rounded-full bg-gray-900 ring-2 ring-white dark:bg-white dark:ring-gray-800"
              style={{ left: `calc(${(score / 21) * 100}% - 2px)` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] leading-tight text-gray-500 dark:text-gray-400 sm:text-xs">
            <span>
              Mínima
              <br />
              0–4
            </span>
            <span>
              Leve
              <br />
              5–9
            </span>
            <span>
              Moderada
              <br />
              10–14
            </span>
            <span>
              Grave
              <br />
              15–21
            </span>
          </div>
        </div>

        {/* Qué sigue */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold">{band.name}: ¿qué hago ahora?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{band.summary}</p>
          <ul className="mt-4 space-y-2">
            {band.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mente dark:bg-mente-light" />
                {tip}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href="/tecnicas-respiracion"
              className="inline-flex items-center gap-1 font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              data-interactive="true"
            >
              Practica respiración guiada
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/diario-guiado"
              className="inline-flex items-center gap-1 font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              data-interactive="true"
            >
              Escribe en el diario
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Aviso de crisis (solo banda grave) */}
        {score >= 15 && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>
              Si estás en crisis o tienes pensamientos de hacerte daño, busca ayuda ahora: llama al 911 o acude al
              servicio de emergencia más cercano. No tienes que enfrentarlo solo/a.
            </span>
          </div>
        )}

        {/* Acciones + aviso */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startQuiz}
              data-interactive="true"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-mente px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-mente-dark active:scale-[0.97]"
            >
              <RotateCcw className="h-5 w-5" />
              Repetir el test
            </button>
            <button
              type="button"
              onClick={clearData}
              data-interactive="true"
              className="flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Trash2 className="h-4 w-4" />
              Borrar mis datos
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-mente-lighter p-3 text-xs text-gray-800 dark:bg-mente-dark dark:text-gray-200">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-mente-dark dark:text-mente-light" />
            <span>
              El GAD-7 es un cuestionario de cribado (Spitzer et al., 2006): orienta, no diagnostica. Solo un
              profesional de salud puede evaluar y tratar la ansiedad.
            </span>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- CUESTIONARIO ---------- */
  if (phase === "quiz") {
    const item = ITEMS[currentQuestion]
    const selected = answers[currentQuestion]
    const pct = Math.round(((currentQuestion + 1) / ITEMS.length) * 100)

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pregunta {currentQuestion + 1} de {ITEMS.length}
              </span>
              <span className="text-sm font-medium text-mente-dark dark:text-mente-light">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-mente transition-all duration-300 dark:bg-mente-light"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Pensando en las últimas 2 semanas, ¿con qué frecuencia te ha molestado cada situación?
          </p>
          <h2 className="mb-5 text-xl font-bold">{item}</h2>

          <div className="space-y-3">
            {OPTIONS.map((option) => {
              const isSelected = selected === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion, option.value)}
                  aria-pressed={isSelected}
                  data-interactive="true"
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all active:scale-[0.97] ${
                    isSelected
                      ? "border-mente bg-mente-lighter dark:border-mente-light dark:bg-mente-dark"
                      : "border-gray-200 hover:border-mente-light hover:bg-mente-lighter dark:border-gray-700 dark:hover:border-mente-light dark:hover:bg-mente-dark"
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                </button>
              )
            })}
          </div>

          {currentQuestion > 0 && (
            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1)
                triggerHapticFeedback("light")
              }}
              className="mt-4 text-sm font-medium text-gray-500 transition-colors hover:text-mente dark:text-gray-400"
              data-interactive="true"
            >
              ← Atrás
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ---------- INTRO ---------- */
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-mente-lighter p-2 dark:bg-mente-dark">
            <Brain className="h-6 w-6 text-mente-dark dark:text-mente-light" />
          </div>
          <h2 className="text-xl font-bold">Test de ansiedad GAD-7</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong>Responde pensando en las últimas 2 semanas.</strong> Son 7 preguntas y toma unos 2 minutos. Al final
          verás tu puntaje (0–21) y qué se recomienda para tu nivel.
        </p>
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            Es una herramienta <strong>orientativa de cribado</strong> (GAD-7, Spitzer et al. 2006), no un diagnóstico.
            Tus respuestas quedan solo en tu navegador.
          </p>
        </div>
        {restored && (
          <div className="mb-6 rounded-lg border border-mente-border bg-mente-lighter p-4 text-sm text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
            Tienes un test guardado. Puedes repetirlo o borrarlo desde el resultado.
          </div>
        )}
        <button
          type="button"
          onClick={startQuiz}
          data-interactive="true"
          className="w-full rounded-md bg-mente px-6 py-4 font-semibold text-white transition-[colors,transform] duration-150 hover:bg-mente-dark active:scale-[0.97]"
        >
          Empezar el test
        </button>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
          </span>
          <button
            type="button"
            onClick={clearData}
            data-interactive="true"
            className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Borrar mis datos
          </button>
        </div>
      </div>
    </div>
  )
}
