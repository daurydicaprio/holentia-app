"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  Brain,
  CalendarDays,
  Clock,
  Coffee,
  Droplets,
  Info,
  Moon,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
  type LucideIcon,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Test educativo de calidad del sueño (inspirado en el PSQI y el ISI, sin ser
// ninguno de los dos): 11 preguntas de hábitos y síntomas, puntaje 0–33 que se
// normaliza a 0–100 (más alto = mejor). Orienta y sugiere; no diagnostica.
// Las señales de apnea (ronquido con pausas, somnolencia diurna) se derivan a
// consulta médica. Todo queda en el navegador.
const DRAFT_KEY = draftKey("test-calidad-sueno")

interface QuestionOption {
  label: string
  value: number
  key?: string
}

interface Question {
  id: string
  question: string
  hint?: string
  options: QuestionOption[]
}

const QUESTIONS: Question[] = [
  {
    id: "hours",
    question: "¿Cuántas horas duermes normalmente entre semana?",
    hint: "Cuenta el tiempo real dormido, no el que pasas en la cama.",
    options: [
      { label: "Menos de 5 horas", value: 0 },
      { label: "Entre 5 y 6 horas", value: 1 },
      { label: "Entre 6 y 7 horas", value: 2 },
      { label: "Entre 7 y 9 horas", value: 3 },
      { label: "Más de 9 horas", value: 2 },
    ],
  },
  {
    id: "latency",
    question: "¿Cuánto tardas en quedarte dormido/a?",
    hint: "Un promedio de las últimas dos semanas.",
    options: [
      { label: "15 minutos o menos", value: 3 },
      { label: "Entre 16 y 30 minutos", value: 2 },
      { label: "Entre 31 y 60 minutos", value: 1 },
      { label: "Más de 60 minutos", value: 0 },
    ],
  },
  {
    id: "awakenings",
    question: "¿Cuántas noches a la semana despiertas en la madrugada?",
    options: [
      { label: "Ninguna", value: 3 },
      { label: "1 o 2 noches", value: 2 },
      { label: "3 o 4 noches", value: 1 },
      { label: "5 noches o más", value: 0 },
    ],
  },
  {
    id: "back",
    question: "Cuando despiertas de madrugada, ¿vuelves a dormirte?",
    options: [
      { label: "No me despierto de madrugada", value: 3 },
      { label: "Sí, en menos de 15 minutos", value: 3 },
      { label: "Entre 15 y 30 minutos", value: 2 },
      { label: "Entre 30 y 60 minutos", value: 1 },
      { label: "Más de 60 minutos o no vuelvo a dormir", value: 0 },
    ],
  },
  {
    id: "reason",
    question: "¿Por qué sueles despertarte?",
    hint: "Elige la causa más frecuente: nos ayuda a personalizar los consejos.",
    options: [
      { label: "No me despierto de madrugada", value: 3, key: "none" },
      { label: "Para ir al baño", value: 2, key: "bathroom" },
      { label: "Por ruido, luz o calor", value: 1, key: "noise" },
      { label: "Por preocupaciones o estrés", value: 1, key: "stress" },
      { label: "Por dolor o molestias", value: 1, key: "pain" },
      { label: "Sin un motivo claro", value: 1, key: "unknown" },
    ],
  },
  {
    id: "refreshed",
    question: "¿Cómo te sientes al despertar?",
    options: [
      { label: "Descansado/a", value: 3 },
      { label: "Con algo de cansancio", value: 1 },
      { label: "Muy cansado/a", value: 0 },
    ],
  },
  {
    id: "snoring",
    question: "¿Roncas fuerte o alguien notó pausas al respirar?",
    options: [
      { label: "No ronco", value: 3 },
      { label: "Ronco a veces", value: 2 },
      { label: "Ronco fuerte casi todas las noches", value: 1 },
      { label: "Me han notado pausas o atragantos", value: 0 },
    ],
  },
  {
    id: "caffeine",
    question: "¿Tomas café, té o energizantes después de las 4 de la tarde?",
    options: [
      { label: "Nunca o casi nunca", value: 3 },
      { label: "A veces", value: 2 },
      { label: "Casi todos los días", value: 1 },
      { label: "Todos los días", value: 0 },
    ],
  },
  {
    id: "screens",
    question: "¿Usas pantallas (celular, TV, laptop) en la hora antes de dormir?",
    options: [
      { label: "Nunca", value: 3 },
      { label: "A veces", value: 2 },
      { label: "Casi siempre", value: 1 },
      { label: "Siempre", value: 0 },
    ],
  },
  {
    id: "schedule",
    question: "¿Qué tan regulares son tus horarios de sueño?",
    hint: "Compara la hora de acostarte y levantarte entre semana y el fin de semana.",
    options: [
      { label: "Muy regulares (±30 minutos)", value: 3 },
      { label: "Bastante regulares", value: 2 },
      { label: "Irregulares", value: 1 },
      { label: "Turnos rotativos o muy irregulares", value: 0 },
    ],
  },
  {
    id: "daytime",
    question: "¿Te quedas dormido/a o con mucho sueño durante el día?",
    options: [
      { label: "Nunca", value: 3 },
      { label: "A veces", value: 2 },
      { label: "Seguido", value: 1 },
      { label: "Casi todos los días", value: 0 },
    ],
  },
]

const MAX_SCORE = QUESTIONS.reduce(
  (total, question) => total + Math.max(...question.options.map((option) => option.value)),
  0,
)

interface Band {
  min: number
  name: string
  summary: string
  badgeClass: string
}

const BANDS: Band[] = [
  {
    min: 80,
    name: "Buen descanso",
    summary:
      "Tus respuestas apuntan a una buena calidad de sueño: duración, continuidad y hábitos están alineados. Mantén la rutina y ajusta solo lo que notes flojo.",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  {
    min: 60,
    name: "A mejorar",
    summary:
      "Duermes, pero hay señales que te restan descanso. Con cambios pequeños y constantes —horario, cafeína y pantallas— deberías notar la diferencia en 2–3 semanas.",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  },
  {
    min: 40,
    name: "Descanso frágil",
    summary:
      "Tu sueño se está rompiendo: despertares, poca duración o hábitos que empujan en contra. Prioriza el descanso como parte del día, no como lo que sobra.",
    badgeClass: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  },
  {
    min: 0,
    name: "Calidad baja",
    summary:
      "Tus respuestas sugieren un descanso muy afectado. Empieza por lo básico y, si se mantiene varias semanas o afecta tu día, consulta a un profesional de salud.",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200",
  },
]

interface Tip {
  icon: LucideIcon
  title: string
  text: string
}

const questionIndex = (id: string) => QUESTIONS.findIndex((question) => question.id === id)

function selectedOption(answers: Record<number, number>, id: string): QuestionOption | undefined {
  const index = questionIndex(id)
  if (index === -1) return undefined
  const selected = answers[index]
  return selected === undefined ? undefined : QUESTIONS[index].options[selected]
}

function buildTips(answers: Record<number, number>): Tip[] {
  const tips: Tip[] = []
  const hours = selectedOption(answers, "hours")?.value
  const latency = selectedOption(answers, "latency")?.value
  const reason = selectedOption(answers, "reason")
  const caffeine = selectedOption(answers, "caffeine")?.value
  const screens = selectedOption(answers, "screens")?.value
  const schedule = selectedOption(answers, "schedule")?.value
  const daytime = selectedOption(answers, "daytime")?.value

  if (hours !== undefined && hours <= 1) {
    tips.push({
      icon: Moon,
      title: "Amplía tu ventana de sueño",
      text: "Apunta a 7–9 horas. Adelanta 15 minutos la hora de acostarte cada 2–3 noches hasta llegar; no intentes recuperar toda la semana el fin de semana.",
    })
  }
  if (latency !== undefined && latency <= 1) {
    tips.push({
      icon: Clock,
      title: "Si no te duermes en ~20 minutos, levántate",
      text: "Sal de la cama, mantén la luz baja y haz algo tranquilo (leer, audio) hasta que tengas sueño. No mires el reloj ni te quedes dando vueltas.",
    })
  }
  if (reason?.key === "bathroom") {
    tips.push({
      icon: Droplets,
      title: "Cuida los líquidos de la noche",
      text: "Bebe menos 1–2 horas antes de acostarte, vacía la vejiga justo antes de dormir y reduce el alcohol: ambos aumentan las idas al baño.",
    })
  }
  if (reason?.key === "stress") {
    tips.push({
      icon: Brain,
      title: "Vacía la mente antes de acostarte",
      text: "Escribe pendientes y preocupaciones con su plan 1–2 horas antes. Si despiertas de madrugada, anota lo que ronda tu cabeza y vuelve a la cama.",
    })
  }
  if (reason?.key === "noise") {
    tips.push({
      icon: Volume2,
      title: "Oscuro, fresco y silencioso",
      text: "Cuarto a 18–21 °C, cortinas opacas, tapones o ruido blanco. Deja el teléfono fuera de la vista y apaga luces intensas.",
    })
  }
  if (reason?.key === "pain") {
    tips.push({
      icon: BedDouble,
      title: "El dolor que interrumpe, se trata",
      text: "Despertar por dolor no es normal: consulta a un profesional y revisa colchón, almohada y posición al dormir.",
    })
  }
  if (caffeine !== undefined && caffeine <= 1) {
    tips.push({
      icon: Coffee,
      title: "Mueve la cafeína a la mañana",
      text: "La cafeína tarda 5–6 horas en reducirse a la mitad: toma tu última taza antes de las 2 pm (4 pm como máximo) y evita energizantes por la tarde.",
    })
  }
  if (screens !== undefined && screens <= 1) {
    tips.push({
      icon: Smartphone,
      title: "Baja el ritmo una hora antes",
      text: "Luz tenue y pantallas fuera (o en modo cálido) durante la última hora. Leer en papel o escuchar un audio funciona igual de bien.",
    })
  }
  if (schedule !== undefined && schedule <= 1) {
    tips.push({
      icon: CalendarDays,
      title: "Fija tu hora de despertar",
      text: "La misma hora ±30 minutos todos los días, fin de semana incluido: es el ancla del reloj biológico. La hora de acostarte se acomoda después.",
    })
  }
  if (daytime !== undefined && daytime <= 1) {
    tips.push({
      icon: Sun,
      title: "Mucho sueño de día",
      text: "Si tienes somnolencia casi todos los días, prioriza 7–9 horas y revisa los ronquidos. Si sigue, consulta: no es normal vivir con sueño.",
    })
  }
  if (tips.length === 0) {
    tips.push({
      icon: Sparkles,
      title: "Mantén lo que funciona",
      text: "Horario estable, 7–9 horas, cafeína temprano y una rutina de bajada. Lo que ya haces bien, sostenlo.",
    })
  }
  return tips.slice(0, 4)
}

interface SleepDraft {
  answers?: Record<number, number>
  showResult?: boolean
  savedAt?: string
}

export function SleepQualityTest() {
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
    const draft = storageGet<SleepDraft>(DRAFT_KEY, {})
    const stored = draft.answers ?? {}
    const sanitized: Record<number, number> = {}
    QUESTIONS.forEach((question, index) => {
      const value = stored[index]
      if (typeof value === "number" && value >= 0 && value < question.options.length) {
        sanitized[index] = value
      }
    })
    const answeredCount = Object.keys(sanitized).length
    if (answeredCount > 0) {
      setAnswers(sanitized)
      if (answeredCount >= QUESTIONS.length && draft.showResult) {
        setPhase("result")
        setRestored(true)
      } else {
        const firstMissing = QUESTIONS.findIndex((_, index) => sanitized[index] === undefined)
        setPhase("quiz")
        setCurrentQuestion(firstMissing === -1 ? QUESTIONS.length - 1 : firstMissing)
      }
    }
    firstLoad.current = false
  }, [])

  const score = useMemo(() => {
    let total = 0
    QUESTIONS.forEach((question, index) => {
      const selected = answers[index]
      if (selected !== undefined) total += question.options[selected]?.value ?? 0
    })
    return total
  }, [answers])

  const complete = useMemo(
    () => QUESTIONS.every((_, index) => answers[index] !== undefined),
    [answers],
  )

  const percent = Math.round((score / MAX_SCORE) * 100)
  const band = useMemo(() => BANDS.find((item) => percent >= item.min) ?? BANDS[BANDS.length - 1], [percent])
  const animatedPercent = useCountUp(percent, { duration: 500, decimals: 0 })
  const tips = useMemo(() => buildTips(answers), [answers])

  const snoring = selectedOption(answers, "snoring")?.value ?? 3
  const daytime = selectedOption(answers, "daytime")?.value ?? 3
  const redFlag = snoring === 0 || (daytime === 0 && snoring <= 1)

  // Autoguardado del borrador con debounce 500 ms (se salta la carga inicial)
  useEffect(() => {
    if (firstLoad.current) return
    if (phase === "intro" && Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: SleepDraft = {
        answers,
        showResult: phase === "result",
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
  }, [phase, answers])

  const startQuiz = () => {
    setPhase("quiz")
    setCurrentQuestion(0)
    setAnswers({})
    setRestored(false)
    triggerHapticFeedback("light")
  }

  const handleAnswer = (question: number, option: number) => {
    setAnswers((prev) => ({ ...prev, [question]: option }))
    triggerHapticFeedback("light")
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) setCurrentQuestion(currentQuestion + 1)
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
          <p className="text-sm text-white dark:text-mente-lighter">Tu calidad de sueño</p>
          <p className="mt-2 text-5xl font-bold tabular-nums">
            {animatedPercent}
            <span className="text-2xl font-semibold text-white/80 dark:text-mente-lighter"> / 100</span>
          </p>
          <span className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${band.badgeClass}`}>
            {band.name}
          </span>
          <p className="mt-3 text-xs text-white dark:text-mente-lighter">
            {score} de {MAX_SCORE} puntos · {restored ? "recuperado de tu último test guardado" : "según tus respuestas"}
          </p>
        </div>

        {/* Escala */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="relative">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <div className="w-[40%] bg-red-500" />
              <div className="w-[20%] bg-orange-500" />
              <div className="w-[20%] bg-amber-400 dark:bg-amber-500" />
              <div className="flex-1 bg-emerald-400 dark:bg-emerald-500" />
            </div>
            <div
              className="absolute -top-1 h-5 w-1 rounded-full bg-gray-900 ring-2 ring-white dark:bg-white dark:ring-gray-800"
              style={{ left: `calc(${percent}% - 2px)` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] leading-tight text-gray-500 dark:text-gray-400 sm:text-xs">
            <span>
              Baja
              <br />
              0–39
            </span>
            <span>
              Frágil
              <br />
              40–59
            </span>
            <span>
              A mejorar
              <br />
              60–79
            </span>
            <span>
              Buena
              <br />
              80–100
            </span>
          </div>
        </div>

        {/* Alerta de consulta */}
        {redFlag && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>
              Roncar fuerte, hacer pausas al respirar o tener mucho sueño de día puede indicar apnea del sueño. Este
              test no la diagnostica: coméntalo con un médico o especialista en sueño.
            </span>
          </div>
        )}

        {/* Qué significa */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold">{band.name}: ¿qué hago ahora?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{band.summary}</p>

          <h3 className="mt-5 text-sm font-semibold text-gray-800 dark:text-gray-200">Tus sugerencias</h3>
          <div className="mt-3 space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <tip.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-mente-dark dark:text-mente-light" />
                <div>
                  <p className="text-sm font-semibold">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Empieza por una o dos sugerencias, no por todas a la vez: el sueño mejora con constancia.
          </p>
        </div>

        {/* Enlaces */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold">Completa tu plan de sueño</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            La calidad y el horario se ayudan entre sí: calcula a qué hora acostarte para despertar al final de un
            ciclo y prueba la respiración 4-7-8 para bajar el ritmo antes de dormir.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href="/calculadora-sueno"
              className="inline-flex items-center gap-1 font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              data-interactive="true"
            >
              Calculadora de ciclos de sueño
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/tecnicas-respiracion"
              className="inline-flex items-center gap-1 font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              data-interactive="true"
            >
              Respiración 4-7-8
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

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
              Test educativo inspirado en cuestionarios de calidad del sueño (PSQI, ISI) y en guías de higiene del
              sueño: orienta, no diagnostica. Si sospechas apnea, insomnio persistente o tienes mucho sueño de día,
              consulta a un profesional.
            </span>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- CUESTIONARIO ---------- */
  if (phase === "quiz") {
    const item = QUESTIONS[currentQuestion]
    const selected = answers[currentQuestion]
    const pct = Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pregunta {currentQuestion + 1} de {QUESTIONS.length}
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

          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Pensando en las últimas 2 semanas:</p>
          <h2 className="mb-2 text-xl font-bold">{item.question}</h2>
          {item.hint && <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">{item.hint}</p>}

          <div className={`space-y-3 ${item.hint ? "" : "mt-5"}`}>
            {item.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion, optionIndex)}
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
            <Moon className="h-6 w-6 text-mente-dark dark:text-mente-light" />
          </div>
          <h2 className="text-xl font-bold">Test de calidad del sueño</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong>Responde pensando en las últimas 2 semanas.</strong> Son 11 preguntas y toma unos 2 minutos: cuánto
          duermes, si despiertas de madrugada, por qué, cómo vuelves a dormirte y qué hábitos te acompañan. Al final
          verás tu puntuación (0–100) y consejos según tus respuestas.
        </p>
        <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Inspirado en cuestionarios de calidad del sueño (PSQI, ISI) y en las guías de higiene del sueño de la AASM.
        </p>
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            Es una herramienta <strong>orientativa</strong>, no un diagnóstico. Tus respuestas quedan solo en tu
            navegador y puedes borrarlas cuando quieras.
          </p>
        </div>
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
