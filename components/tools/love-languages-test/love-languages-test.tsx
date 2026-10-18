"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Check, Copy, Heart, RotateCcw, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { CountUp } from "@/components/ui/count-up"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Test de los 5 lenguajes del amor (versión educativa y abreviada).
// Quiz de una pregunta a la vez con avance automático; el avance y el
// resultado se guardan en el navegador (patrón D) para poder continuar.
const DRAFT_KEY = draftKey("test-lenguajes-amor")

interface Question {
  id: number
  text: string
  options: {
    text: string
    language: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "Me siento más amado/a cuando...",
    options: [
      { text: "Mi pareja me dice palabras cariñosas y me halaga", language: "palabras" },
      { text: "Mi pareja pasa tiempo de calidad conmigo sin distracciones", language: "tiempo" },
      { text: "Mi pareja me hace regalos, aunque sean pequeños", language: "regalos" },
      { text: "Mi pareja hace cosas para ayudarme", language: "servicio" },
      { text: "Mi pareja me abraza, besa y muestra afecto físico", language: "fisico" },
    ],
  },
  {
    id: 2,
    text: "Me siento especial cuando...",
    options: [
      { text: "Alguien me elogia sinceramente", language: "palabras" },
      { text: "Alguien me dedica su atención plena", language: "tiempo" },
      { text: "Alguien me sorprende con un detalle", language: "regalos" },
      { text: "Alguien me ayuda con una tarea importante", language: "servicio" },
      { text: "Alguien me da un abrazo reconfortante", language: "fisico" },
    ],
  },
  {
    id: 3,
    text: "Para demostrar amor, yo prefiero...",
    options: [
      { text: "Expresar mis sentimientos con palabras", language: "palabras" },
      { text: "Pasar tiempo juntos haciendo actividades", language: "tiempo" },
      { text: "Dar regalos significativos", language: "regalos" },
      { text: "Hacer cosas útiles por la otra persona", language: "servicio" },
      { text: "Mostrar cariño con contacto físico", language: "fisico" },
    ],
  },
  {
    id: 4,
    text: "Me duele más cuando...",
    options: [
      { text: "Alguien me critica o me habla con dureza", language: "palabras" },
      { text: "Alguien está conmigo pero no me presta atención", language: "tiempo" },
      { text: "Alguien olvida una fecha especial", language: "regalos" },
      { text: "Alguien no me ayuda cuando lo necesito", language: "servicio" },
      { text: "Alguien me rechaza físicamente", language: "fisico" },
    ],
  },
  {
    id: 5,
    text: "Lo que más valoro en una relación es...",
    options: [
      { text: "La comunicación verbal y el aprecio mutuo", language: "palabras" },
      { text: "Los momentos compartidos y la conexión", language: "tiempo" },
      { text: "Los detalles y gestos simbólicos", language: "regalos" },
      { text: "Las acciones y el apoyo práctico", language: "servicio" },
      { text: "La cercanía física y el contacto", language: "fisico" },
    ],
  },
]

const languageDescriptions: Record<string, { name: string; description: string; tips: string[] }> = {
  palabras: {
    name: "Palabras de Afirmación",
    description:
      "Tu lenguaje del amor principal son las palabras de afirmación. Te sientes amado/a cuando escuchas elogios sinceros, palabras de aliento y expresiones verbales de cariño.",
    tips: [
      "Expresa verbalmente tu amor y aprecio con frecuencia",
      "Escribe notas o mensajes cariñosos",
      "Elogia los logros y cualidades de tu pareja",
      "Evita las críticas duras o el sarcasmo hiriente",
    ],
  },
  tiempo: {
    name: "Tiempo de Calidad",
    description:
      "Tu lenguaje del amor principal es el tiempo de calidad. Te sientes amado/a cuando alguien te dedica atención plena y comparte momentos significativos contigo.",
    tips: [
      "Planifica actividades para hacer juntos regularmente",
      "Elimina las distracciones cuando estés con tu pareja",
      "Escucha activamente y participa en conversaciones profundas",
      "Crea rituales especiales como cenas semanales o paseos",
    ],
  },
  regalos: {
    name: "Recibir Regalos",
    description:
      "Tu lenguaje del amor principal son los regalos. Te sientes amado/a cuando recibes obsequios pensados, sin importar su valor monetario.",
    tips: [
      "Da regalos significativos en fechas especiales",
      "Sorprende con pequeños detalles sin motivo aparente",
      "Recuerda los gustos y preferencias de tu pareja",
      "El gesto y el pensamiento son más importantes que el precio",
    ],
  },
  servicio: {
    name: "Actos de Servicio",
    description:
      "Tu lenguaje del amor principal son los actos de servicio. Te sientes amado/a cuando alguien hace cosas para ayudarte y facilitar tu vida.",
    tips: [
      "Ayuda con tareas cotidianas sin que te lo pidan",
      "Anticípate a las necesidades de tu pareja",
      "Cumple tus promesas y compromisos",
      "Las acciones hablan más fuerte que las palabras",
    ],
  },
  fisico: {
    name: "Contacto Físico",
    description:
      "Tu lenguaje del amor principal es el contacto físico. Te sientes amado/a a través de abrazos, besos, caricias y cercanía física.",
    tips: [
      "Muestra afecto físico con frecuencia",
      "Toma la mano de tu pareja al caminar",
      "Da abrazos reconfortantes en momentos difíciles",
      "Respeta los límites personales de cada uno",
    ],
  },
}

interface LoveDraft {
  answers?: Record<number, string>
  showResult?: boolean
  savedAt?: string
}

export function LoveLanguagesTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [copied, setCopied] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoad = useRef(true)

  // Restaurar avance guardado (completo → resultado; a medias → quiz)
  useEffect(() => {
    const draft = storageGet<LoveDraft>(DRAFT_KEY, {})
    const validAnswers: Record<number, string> = {}
    for (const [key, value] of Object.entries(draft.answers ?? {})) {
      const question = questions.find((q) => q.id === Number(key))
      if (question && question.options.some((option) => option.language === value)) {
        validAnswers[question.id] = value
      }
    }
    const answeredCount = Object.keys(validAnswers).length
    if (answeredCount > 0) {
      setAnswers(validAnswers)
      if (answeredCount >= questions.length) {
        setShowResults(true)
      } else {
        const firstMissing = questions.findIndex((q) => validAnswers[q.id] === undefined)
        setCurrentQuestion(firstMissing === -1 ? questions.length - 1 : firstMissing)
      }
    }
    firstLoad.current = false
  }, [])

  // Autoguardado con debounce 500 ms (se salta la carga inicial)
  useEffect(() => {
    if (firstLoad.current) return
    if (!showResults && Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: LoveDraft = { answers, showResult: showResults, savedAt: new Date().toISOString() }
      if (storageSet(DRAFT_KEY, payload)) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [answers, showResults])

  const handleAnswer = (questionId: number, language: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: language }))
    triggerHapticFeedback("light")

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      setTimeout(() => {
        setShowResults(true)
      }, 300)
    }
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    triggerHapticFeedback("medium")
  }

  const clearData = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const calculateResults = () => {
    const scores: Record<string, number> = {
      palabras: 0,
      tiempo: 0,
      regalos: 0,
      servicio: 0,
      fisico: 0,
    }

    Object.values(answers).forEach((language) => {
      scores[language] = (scores[language] || 0) + 1
    })

    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([language, score]) => ({ language, score }))
  }

  const copyResult = async () => {
    const results = calculateResults()
    const main = results[0]
    const text = [
      `Mi lenguaje del amor principal: ${languageDescriptions[main.language].name}.`,
      "",
      "Distribución:",
      ...results.map(({ language, score }) => `· ${languageDescriptions[language].name}: ${score}/${questions.length}`),
      "",
      "Test de los 5 lenguajes del amor — HOLENTIA",
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

  if (showResults) {
    const results = calculateResults()
    const primaryLanguage = results[0]

    return (
      <div aria-live="polite" className="animate-result-in space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-center">
            <Heart className="h-12 w-12 text-relaciones dark:text-relaciones-light" />
          </div>
          <h2 className="mb-4 text-center text-xl font-bold text-relaciones dark:text-relaciones-light">
            Tu lenguaje del amor principal
          </h2>
          <div className="mb-6 rounded-xl bg-relaciones-lighter p-6 dark:bg-relaciones-dark">
            <h3 className="mb-4 text-center text-2xl font-bold text-relaciones-darkest dark:text-relaciones-lighter">
              {languageDescriptions[primaryLanguage.language].name}
            </h3>
            <p className="text-center text-gray-700 dark:text-gray-300">
              {languageDescriptions[primaryLanguage.language].description}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold">Consejos para ti:</h4>
            <ul className="space-y-2">
              {languageDescriptions[primaryLanguage.language].tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-relaciones dark:text-relaciones-light">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold">Distribución de tus lenguajes:</h4>
            <div className="space-y-3">
              {results.map(({ language, score }) => (
                <div key={language}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">{languageDescriptions[language].name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <CountUp value={score} format={(n) => String(n)} duration={400} />/{questions.length}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-relaciones transition-all duration-500 dark:bg-relaciones-light"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              data-interactive="true"
              onClick={resetTest}
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

          <p className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            Cómo das y recibes cariño también se relaciona con tu forma de vincularte.{" "}
            <Link
              href="/test-apego"
              data-interactive="true"
              className="font-semibold text-relaciones-dark underline underline-offset-2 dark:text-relaciones-lighter"
            >
              Haz el test de apego
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const selected = answers[question.id]

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-relaciones dark:text-relaciones-lighter">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-relaciones transition-all duration-300 dark:bg-relaciones-light"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-100">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === option.language
            return (
              <button
                data-interactive="true"
                key={index}
                onClick={() => handleAnswer(question.id, option.language)}
                aria-pressed={isSelected}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all active:scale-[0.97] ${
                  isSelected
                    ? "border-relaciones bg-relaciones-lighter dark:border-relaciones-light dark:bg-relaciones-dark"
                    : "border-gray-200 hover:border-relaciones hover:bg-relaciones-lighter dark:border-gray-700 dark:hover:border-relaciones-light dark:hover:bg-relaciones-dark"
                }`}
              >
                <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
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
