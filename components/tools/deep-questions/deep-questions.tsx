"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Copy, Shuffle, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Generador de preguntas profundas: 3 categorías × 15 preguntas, en orden
// curado; «Mezclar» reordena en el cliente (nunca en SSR, para no romper la
// hidratación). Solo se guarda la categoría preferida (patrón D).
const DRAFT_KEY = draftKey("preguntas-profundas")

interface Category {
  id: string
  name: string
  hint: string
  questions: string[]
}

const CATEGORIES: Category[] = [
  {
    id: "pareja",
    name: "Pareja",
    hint: "Para una noche sin pantallas, tú a tú.",
    questions: [
      "¿Qué momento de nuestra historia juntos repetirías una y otra vez?",
      "¿Qué te hace sentir más amado/a, y qué te cuesta pedir?",
      "¿Cómo imaginas nuestra vida dentro de 10 años?",
      "¿Qué sueño no me has contado todavía?",
      "¿Cuándo te sentiste más orgulloso/a de mí?",
      "¿Qué te preocupa últimamente y te cuesta sacar en conversación?",
      "¿Qué necesitas de mí cuando tienes una semana difícil?",
      "¿Qué te gustaría que hiciéramos más seguido juntos?",
      "¿Cuál es un miedo tuyo que pocas personas conocen?",
      "Si pudieras pedirme una sola cosa sin miedo a sonar raro/a, ¿qué sería?",
      "¿Qué aprendiste del amor en tu familia, para bien y para no repetirlo?",
      "¿Qué te hace reír de verdad, de esa risa que no puedes controlar?",
      "¿Qué parte de ti sientes que todavía no conozco del todo?",
      "¿Hay algo que te gustaría perdonarte a ti mismo/a?",
      "¿Cómo te gustaría celebrar nuestros próximos logros?",
    ],
  },
  {
    id: "familia",
    name: "Familia y amistad",
    hint: "Sobremesa, llamada larga o un paseo.",
    questions: [
      "¿Qué recuerdo de tu infancia te hace sonreír sin fallar?",
      "¿Quién te enseñó algo que usas todos los días?",
      "¿Qué consejo de alguien de tu familia nunca has olvidado?",
      "¿Qué te gustaría que la gente entendiera mejor de ti?",
      "¿Cuál ha sido la decisión más valiente de tu vida?",
      "¿En qué momento supiste que éramos amigos de verdad?",
      "¿Qué te hubiera gustado saber a los 18 años?",
      "¿Cuál es un orgullo tuyo que casi nunca cuentas?",
      "¿Qué persona te marcó y de qué manera?",
      "¿Qué te devuelve la energía cuando estás cansado/a del todo?",
      "¿Qué costumbre de tu familia te gustaría mantener siempre?",
      "¿A quién te gustaría agradecerle algo que nunca le dijiste?",
      "¿Qué canción te lleva directo a un recuerdo?",
      "¿Cuál es la mejor conversación que recuerdas haber tenido?",
      "¿Con qué personas sacas tu mejor versión?",
    ],
  },
  {
    id: "tu",
    name: "Para conocerte tú",
    hint: "Un espejo con buena luz y sin prisa.",
    questions: [
      "¿Qué harías si supieras que no puedes fallar?",
      "¿Qué es lo que más te gusta de tu carácter, aunque nadie te lo haya dicho?",
      "¿Qué situación te cuesta manejar y qué te ayudaría de verdad?",
      "¿Con quién puedes ser tú sin filtros?",
      "¿Qué parte de tu rutina te hace bien y no sueltas por nada?",
      "¿Qué te gustaría aprender solo por el placer de hacerlo?",
      "¿Cuándo fue la última vez que hiciste algo por primera vez?",
      "¿Qué te dices a ti mismo/a cuando todo sale mal?",
      "¿Qué límite te ha costado más poner?",
      "¿Qué te da miedo perder, y por qué es tan valioso para ti?",
      "¿Cuál es tu forma favorita de estar solo/a?",
      "¿Qué te gustaría que cambiara en tu día a día en seis meses?",
      "¿A quién admiras sin habérselo dicho nunca?",
      "¿Qué experiencia te cambió la forma de ver la vida?",
      "¿Qué versión de ti quieres construir este año?",
    ],
  },
]

const COMO_USARLAS = [
  "Túrnense: quien responde habla sin interrupciones; el otro solo escucha.",
  "No hay respuestas correctas: cuenta la verdad de cada uno, sin adornos.",
  "Una buena pregunta puede durar media hora; no hay prisa por pasar a la siguiente.",
]

const sequential = (length: number) => Array.from({ length }, (_, i) => i)

function shuffled(length: number): number[] {
  const order = sequential(length)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function DeepQuestions() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [order, setOrder] = useState<number[]>(() => sequential(CATEGORIES[0].questions.length))
  const [position, setPosition] = useState(0)
  const [copied, setCopied] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const question = category.questions[order[position] ?? 0]

  // Cargar categoría preferida (patrón D)
  useEffect(() => {
    const parsed = storageGet<{ categoryId?: string }>(DRAFT_KEY, {})
    if (parsed.categoryId && CATEGORIES.some((c) => c.id === parsed.categoryId)) {
      const saved = CATEGORIES.find((c) => c.id === parsed.categoryId)
      if (saved) {
        setCategoryId(saved.id)
        setOrder(sequential(saved.questions.length))
        setPosition(0)
      }
    }
  }, [])

  // Autoguardado con debounce 500 ms (se salta la carga inicial)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { categoryId })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [categoryId])

  const selectCategory = (next: Category) => {
    setCategoryId(next.id)
    setOrder(sequential(next.questions.length))
    setPosition(0)
    triggerHapticFeedback("light")
  }

  const nextQuestion = () => {
    setPosition((prev) => (prev + 1) % category.questions.length)
    triggerHapticFeedback("light")
  }

  const previousQuestion = () => {
    setPosition((prev) => Math.max(0, prev - 1))
    triggerHapticFeedback("light")
  }

  const shuffleDeck = () => {
    setOrder(shuffled(category.questions.length))
    setPosition(0)
    triggerHapticFeedback("medium")
  }

  const copyQuestion = async () => {
    try {
      await navigator.clipboard.writeText(`«${question}»\n\nPreguntas profundas para conversar — HOLENTIA`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      triggerHapticFeedback("light")
    } catch {
      // Portapapeles no disponible (contexto no seguro): sin acción
    }
  }

  const clearData = () => {
    setCategoryId(CATEGORIES[0].id)
    setOrder(sequential(CATEGORIES[0].questions.length))
    setPosition(0)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Elige el momento</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          45 preguntas para conversaciones que valen. Elige con quién y deja que fluya.
        </p>

        <div className="space-y-2">
          {CATEGORIES.map((option) => {
            const selected = option.id === categoryId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectCategory(option)}
                aria-pressed={selected}
                data-interactive="true"
                className={`w-full rounded-lg border p-3 text-left transition-[colors,transform] duration-150 active:scale-[0.97] ${
                  selected
                    ? "border-relaciones bg-relaciones-lighter dark:border-relaciones-light dark:bg-relaciones-dark"
                    : "border-gray-200 hover:border-relaciones-light dark:border-gray-700 dark:hover:border-relaciones-light"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{option.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      selected
                        ? "bg-relaciones text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option.questions.length} preguntas
                  </span>
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    selected ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {option.hint}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={shuffleDeck}
          data-interactive="true"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-[colors,transform] duration-150 hover:bg-gray-200 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Shuffle className="h-4 w-4" />
          Mezclar el orden
        </button>

        <div className="mt-6 flex items-center justify-between">
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

      {/* Escenario */}
      <div className="space-y-4 lg:col-span-3">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-relaciones-lighter px-3 py-1 text-xs font-medium text-relaciones-dark dark:bg-relaciones-dark dark:text-relaciones-lighter">
              {category.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Pregunta {position + 1} de {category.questions.length}
            </span>
          </div>

          <div aria-live="polite" className="my-8 flex min-h-[8rem] items-center justify-center">
            <p className="text-center text-xl font-bold leading-relaxed text-gray-800 dark:text-gray-100 sm:text-2xl">
              «{question}»
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={position === 0}
              data-interactive="true"
              className="rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-[colors,transform] duration-150 hover:bg-gray-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={nextQuestion}
              data-interactive="true"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-relaciones px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-relaciones-dark active:scale-[0.97]"
            >
              Otra pregunta
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={copyQuestion}
              data-interactive="true"
              className="flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "¡Copiada!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Cómo aprovecharlas */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold">Cómo aprovecharlas</h2>
          <ol className="mt-3 space-y-2">
            {COMO_USARLAS.map((tip, i) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-relaciones-lighter text-[11px] font-bold text-relaciones-dark dark:bg-relaciones-dark dark:text-relaciones-lighter">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            Para convertir una pregunta en un ritual diario,{" "}
            <Link
              href="/diario-parejas"
              data-interactive="true"
              className="font-semibold text-relaciones-dark underline underline-offset-2 dark:text-relaciones-lighter"
            >
              prueba el diario para parejas
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
