"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Copy, HeartHandshake, Info, RotateCcw, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { CountUp } from "@/components/ui/count-up"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Test de estilo de apego (herramienta educativa, inspirada en la teoría del
// apego adulto). 12 afirmaciones de 0 a 3 → 4 estilos (3 ítems por estilo).
// No es un test clínico ni una etiqueta: los estilos son un continuo.
const DRAFT_KEY = draftKey("test-apego")

interface StyleDef {
  key: string
  name: string
  description: string
  tips: string[]
}

const STYLES: StyleDef[] = [
  {
    key: "seguro",
    name: "Estilo seguro",
    description:
      "Te sientes cómodo/a con la cercanía y con tu independencia: confías en los demás, pides ayuda cuando la necesitas y también sabes estar solo/a. Es una base sólida para relaciones estables.",
    tips: [
      "Sigue practicando la comunicación abierta: di lo que sientes sin esperar que lo adivinen.",
      "Tu calma ayuda a regular a las personas que quieres; nombra lo que ves sin juzgar.",
      "Pregunta en vez de suponer: no todo el mundo vive la cercanía como tú.",
    ],
  },
  {
    key: "ansioso",
    name: "Estilo ansioso",
    description:
      "Buscas cercanía y confirmación, y la incertidumbre te activa: un mensaje sin responder puede darte vueltas toda la tarde. No es «ser demasiado»: es un patrón que se puede suavizar.",
    tips: [
      "Nombra lo que necesitas en vez de esperar que lo adivinen: «cuando no me escribes, me preocupo».",
      "Antes de reaccionar a un silencio, respira y pregunta directamente.",
      "Cuida tus rutinas y espacios propios: la calma también se entrena.",
    ],
  },
  {
    key: "evitativo",
    name: "Estilo evitativo",
    description:
      "Valoras tu independencia y te cuesta pedir ayuda o mostrar vulnerabilidad. Cuando alguien se acerca demasiado, sientes ganas de tomar distancia. La buena noticia: la cercanía también se practica.",
    tips: [
      "Empieza compartiendo cosas pequeñas: pedir ayuda es un músculo que se entrena.",
      "Avisa cuando necesites espacio en vez de desaparecer: «necesito un rato y vuelvo».",
      "Mostrar vulnerabilidad no es debilidad: deja que la relación sea de dos.",
    ],
  },
  {
    key: "temeroso",
    name: "Estilo temeroso",
    description:
      "Quieres cercanía y a la vez te da miedo salir herido/a: aparecen ganas de acercarte y de huir casi al mismo tiempo. Es un patrón conocido y trabajable, con buena respuesta al acompañamiento profesional.",
    tips: [
      "Ve despacio: la seguridad se construye con experiencias pequeñas y repetidas.",
      "Habla de tus miedos con la persona correcta, sin exigirte perfección.",
      "El acompañamiento profesional ayuda mucho en este estilo: pedirlo es un paso de cuidado.",
    ],
  },
]

const STATEMENTS: { text: string; style: string }[] = [
  { text: "Me resulta fácil acercarme a los demás y confiar en ellos.", style: "seguro" },
  { text: "Cuando algo me preocupa, busco apoyo en alguien cercano sin problema.", style: "seguro" },
  { text: "Me siento bien dando y recibiendo cariño; la cercanía no me agobia.", style: "seguro" },
  { text: "Me preocupa que las personas que quiero no me quieran igual.", style: "ansioso" },
  { text: "Necesito que me confirmen seguido que todo está bien en la relación.", style: "ansioso" },
  { text: "Si alguien tarda en responder, me cuesta no pensar que algo va mal.", style: "ansioso" },
  { text: "Prefiero resolver mis problemas solo/a antes que pedir ayuda.", style: "evitativo" },
  { text: "Cuando alguien se acerca demasiado, siento necesidad de tomar distancia.", style: "evitativo" },
  { text: "Me incomoda hablar de mis sentimientos, incluso con personas cercanas.", style: "evitativo" },
  { text: "Quiero mucha cercanía, pero a la vez me da miedo que me hagan daño.", style: "temeroso" },
  { text: "Aunque deseo estar muy unido/a a alguien, me cuesta confiar del todo.", style: "temeroso" },
  { text: "Cuando una relación se vuelve más seria, siento ganas de acercarme y de huir a la vez.", style: "temeroso" },
]

const OPTIONS = [
  { label: "Nada", value: 0 },
  { label: "Poco", value: 1 },
  { label: "Bastante", value: 2 },
  { label: "Mucho", value: 3 },
]

interface AttachmentDraft {
  answers?: Record<number, number>
  showResult?: boolean
  savedAt?: string
}

export function AttachmentTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [savedFlash, setSavedFlash] = useState(false)
  const [copied, setCopied] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  // Restaurar avance guardado (completo → resultado; a medias → quiz)
  useEffect(() => {
    const draft = storageGet<AttachmentDraft>(DRAFT_KEY, {})
    const validAnswers: Record<number, number> = {}
    for (const [key, value] of Object.entries(draft.answers ?? {})) {
      const index = Number(key)
      if (STATEMENTS[index] && typeof value === "number" && value >= 0 && value <= 3) {
        validAnswers[index] = value
      }
    }
    const answeredCount = Object.keys(validAnswers).length
    if (answeredCount > 0) {
      setAnswers(validAnswers)
      if (answeredCount >= STATEMENTS.length && draft.showResult) {
        setPhase("result")
      } else {
        const firstMissing = STATEMENTS.findIndex((_, i) => validAnswers[i] === undefined)
        setPhase("quiz")
        setCurrentQuestion(firstMissing === -1 ? STATEMENTS.length - 1 : firstMissing)
      }
    }
    firstLoad.current = false
  }, [])

  const scoreByStyle = useMemo(() => {
    const scores: Record<string, number> = {}
    for (const style of STYLES) scores[style.key] = 0
    for (const [key, value] of Object.entries(answers)) {
      const statement = STATEMENTS[Number(key)]
      if (statement) scores[statement.style] += value
    }
    return scores
  }, [answers])

  const results = useMemo(
    () =>
      STYLES.map((style) => ({ style, score: scoreByStyle[style.key] ?? 0 })).sort((a, b) => b.score - a.score),
    [scoreByStyle],
  )

  const complete = useMemo(() => STATEMENTS.every((_, i) => answers[i] !== undefined), [answers])
  const MAX_PER_STYLE = 9

  // Autoguardado con debounce 500 ms (se salta la carga inicial)
  useEffect(() => {
    if (firstLoad.current) return
    if (phase === "intro" && Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: AttachmentDraft = { answers, showResult: phase === "result", savedAt: new Date().toISOString() }
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
    triggerHapticFeedback("light")
  }

  const handleAnswer = (index: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
    triggerHapticFeedback("light")
    setTimeout(() => {
      if (currentQuestion < STATEMENTS.length - 1) setCurrentQuestion(currentQuestion + 1)
      else setPhase("result")
    }, 300)
  }

  const clearData = () => {
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers({})
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const copyResult = async () => {
    const dominant = results[0]
    const text = [
      `Mi estilo de apego dominante: ${dominant.style.name} (${dominant.score}/${MAX_PER_STYLE}).`,
      "",
      "Distribución:",
      ...results.map(({ style, score }) => `· ${style.name}: ${score}/${MAX_PER_STYLE}`),
      "",
      "Los estilos son un continuo, no una etiqueta fija.",
      "Test de estilo de apego — HOLENTIA",
    ].join("\n")

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      triggerHapticFeedback("light")
    } catch {
      // Portapapeles no disponible (contexto no seguro): sin acción
    }
  }

  /* ---------- RESULTADO ---------- */
  if (phase === "result" && complete) {
    const dominant = results[0]

    return (
      <div aria-live="polite" className="animate-result-in space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-center">
            <HeartHandshake className="h-12 w-12 text-relaciones dark:text-relaciones-light" />
          </div>
          <h2 className="mb-4 text-center text-xl font-bold text-relaciones dark:text-relaciones-light">
            Tu estilo de apego dominante
          </h2>
          <div className="mb-6 rounded-xl bg-relaciones-lighter p-6 dark:bg-relaciones-dark">
            <h3 className="mb-2 text-center text-2xl font-bold text-relaciones-darkest dark:text-relaciones-lighter">
              {dominant.style.name}
            </h3>
            <p className="mb-3 text-center text-sm font-medium text-relaciones-dark dark:text-relaciones-lighter">
              Puntaje: {dominant.score}/{MAX_PER_STYLE}
            </p>
            <p className="text-center text-gray-700 dark:text-gray-300">{dominant.style.description}</p>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold">Distribución de tus estilos:</h4>
            <div className="space-y-3">
              {results.map(({ style, score }) => (
                <div key={style.key}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">{style.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <CountUp value={score} format={(n) => String(n)} duration={400} />/{MAX_PER_STYLE}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-relaciones transition-all duration-500 dark:bg-relaciones-light"
                      style={{ width: `${(score / MAX_PER_STYLE) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold">Qué puedes hacer:</h4>
            <ul className="space-y-2">
              {dominant.style.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-relaciones dark:text-relaciones-light">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/test-lenguajes-amor"
            className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-relaciones-dark underline underline-offset-2 dark:text-relaciones-lighter"
            data-interactive="true"
          >
            ¿Cómo das y recibes cariño? Haz el test de lenguajes del amor
            <ArrowRight className="h-3 w-3" />
          </Link>

          <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
            Los estilos son un continuo, no una etiqueta fija: pueden cambiar con el tiempo, con relaciones seguras y
            con acompañamiento profesional.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              data-interactive="true"
              onClick={startQuiz}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-relaciones px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-relaciones-dark active:scale-[0.97]"
            >
              <RotateCcw className="h-5 w-5" />
              Hacer el test de nuevo
            </button>
            <button
              data-interactive="true"
              onClick={copyResult}
              className="flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "¡Copiado!" : "Copiar resultado"}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
            </span>
            <button
              data-interactive="true"
              onClick={clearData}
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

  /* ---------- CUESTIONARIO ---------- */
  if (phase === "quiz") {
    const statement = STATEMENTS[currentQuestion]
    const selected = answers[currentQuestion]
    const pct = Math.round(((currentQuestion + 1) / STATEMENTS.length) * 100)

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Afirmación {currentQuestion + 1} de {STATEMENTS.length}
              </span>
              <span className="text-sm font-medium text-relaciones dark:text-relaciones-lighter">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-relaciones transition-all duration-300 dark:bg-relaciones-light"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            ¿Qué tan identificado/a te sientes con esta afirmación?
          </p>
          <h2 className="mb-5 text-xl font-bold text-gray-800 dark:text-gray-100">{statement.text}</h2>

          <div className="space-y-3">
            {OPTIONS.map((option) => {
              const isSelected = selected === option.value
              return (
                <button
                  key={option.value}
                  data-interactive="true"
                  onClick={() => handleAnswer(currentQuestion, option.value)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all active:scale-[0.97] ${
                    isSelected
                      ? "border-relaciones bg-relaciones-lighter dark:border-relaciones-light dark:bg-relaciones-dark"
                      : "border-gray-200 hover:border-relaciones hover:bg-relaciones-lighter dark:border-gray-700 dark:hover:border-relaciones-light dark:hover:bg-relaciones-dark"
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                </button>
              )
            })}
          </div>

          {currentQuestion > 0 && (
            <button
              data-interactive="true"
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1)
                triggerHapticFeedback("light")
              }}
              className="mt-4 text-sm font-medium text-gray-500 transition-colors hover:text-relaciones dark:text-gray-400"
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
          <div className="rounded-lg bg-relaciones-lighter p-2 dark:bg-relaciones-dark">
            <HeartHandshake className="h-6 w-6 text-relaciones-dark dark:text-relaciones-light" />
          </div>
          <h2 className="text-xl font-bold">Test de estilo de apego</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong>Responde sin pensarlo demasiado.</strong> Son 12 afirmaciones y toma unos 2 minutos. Al final verás
          tu estilo dominante entre cuatro (seguro, ansioso, evitativo y temeroso) y qué puedes hacer con él.
        </p>
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            Es una herramienta <strong>educativa inspirada en la teoría del apego</strong>, no un test clínico ni una
            etiqueta. Tus respuestas quedan solo en tu navegador.
          </p>
        </div>
        <button
          type="button"
          onClick={startQuiz}
          data-interactive="true"
          className="w-full rounded-lg bg-relaciones px-6 py-4 font-semibold text-white transition-[colors,transform] duration-150 hover:bg-relaciones-dark active:scale-[0.97]"
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
