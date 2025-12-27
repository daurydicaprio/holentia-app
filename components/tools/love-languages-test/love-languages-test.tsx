"use client"

import { useState } from "react"
import { Heart, RotateCcw } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

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

export function LoveLanguagesTest() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (questionId: number, language: string) => {
    setAnswers({ ...answers, [questionId]: language })
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

    const sortedLanguages = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([language, score]) => ({ language, score }))

    return sortedLanguages
  }

  if (showResults) {
    const results = calculateResults()
    const primaryLanguage = results[0]

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-purple-600 dark:text-purple-400 mb-4">
            Tu lenguaje del amor principal
          </h2>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl mb-6">
            <h3 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-4">
              {languageDescriptions[primaryLanguage.language].name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              {languageDescriptions[primaryLanguage.language].description}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3">Consejos para ti:</h4>
            <ul className="space-y-2">
              {languageDescriptions[primaryLanguage.language].tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3">Distribución de tus lenguajes:</h4>
            <div className="space-y-3">
              {results.map(({ language, score }) => (
                <div key={language}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{languageDescriptions[language].name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {score}/{questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetTest}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Volver a hacer el test
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, option.language)}
              className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
            >
              <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
