"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Check, Copy, Flame, Heart, Save, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Diario para parejas: una pregunta al día (rotación determinista por fecha
// local), dos respuestas (tú / tu pareja) e historial con racha en el
// navegador. La pregunta del día se calcula tras el montaje porque las
// páginas son estáticas: un HTML prerenderizado quedaría con la fecha del
// build y los usuarios verían una pregunta desactualizada.
const ENTRIES_KEY = "holentia:diario-parejas:entries:v1"
const DRAFT_KEY = draftKey("diario-parejas")

const QUESTIONS: string[] = [
  "¿Qué momento de hoy con tu pareja te gustaría repetir?",
  "¿Qué pequeño gesto de hoy agradeces?",
  "¿Qué te hizo reír hoy?",
  "¿Qué necesitas mañana de mí?",
  "¿Qué te ilusiona de esta semana?",
  "¿Qué aprendimos juntos últimamente?",
  "Cuenta un detalle de hoy que no quieras olvidar.",
  "¿Qué te ayudó hoy a sentirte en calma?",
  "¿Qué te gustaría hacer juntos este fin de semana?",
  "¿Qué te hizo sentir orgulloso/a hoy?",
  "¿Qué preocupación quieres soltar esta noche?",
  "¿Qué te gustaría agradecerle a tu pareja hoy?",
  "¿Cómo te sentiste cuidado/a hoy?",
  "¿Qué canción describe tu día?",
  "¿Qué momento del día querrías congelar?",
  "¿Qué te gustaría que hiciéramos más seguido?",
  "¿Qué aprendiste hoy de ti mismo/a?",
  "¿Qué te dio energía hoy?",
  "¿Qué te costó hoy y cómo lo manejaste?",
  "¿Qué plan pequeño propones para mañana?",
  "¿Qué palabra define tu día?",
  "¿Qué te gustaría que tu pareja supiera de tu día?",
  "¿Qué te hizo sentir cerca de mí hoy?",
  "¿Qué te pareció lo mejor de nuestra semana?",
  "¿En qué momento te sentiste escuchado/a?",
  "¿Qué te gustaría mejorar de nuestra rutina?",
  "¿Qué te hace sentir en casa?",
  "¿Qué te gustaría que celebráramos pronto?",
  "¿Qué recuerdo bonito te pasó por la mente hoy?",
  "¿Qué quieres que te desee para mañana?",
]

interface CoupleEntry {
  id: string
  date: string // YYYY-MM-DD (fecha local)
  question: string
  mine: string
  partner: string
  savedAt: string
}

interface CoupleDraft {
  date?: string
  mine?: string
  partner?: string
}

const localDayKey = (d: Date) => d.toLocaleDateString("en-CA")

function parseIsoDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function formatDay(iso: string): string {
  const text = parseIsoDay(iso).toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Índice determinista por fecha local: todos ven la misma pregunta ese día.
function questionForDay(dayKey: string): string {
  const day = parseIsoDay(dayKey)
  const days = Math.floor(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) / 86400000)
  return QUESTIONS[days % QUESTIONS.length]
}

// Días consecutivos con entrada, contando desde hoy (o ayer si hoy no hay).
// Misma semántica que el diario guiado, con claves YYYY-MM-DD directas.
function computeStreak(entries: CoupleEntry[]): number {
  if (entries.length === 0) return 0
  const days = new Set(entries.map((e) => e.date))
  const cursor = new Date()
  if (!days.has(localDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(localDayKey(cursor))) return 0
  }
  let streak = 0
  while (days.has(localDayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function formatEntryText(entry: CoupleEntry): string {
  const lines = [`Diario para parejas — ${formatDay(entry.date)}`, `«${entry.question}»`]
  if (entry.mine) lines.push(`Tú: ${entry.mine}`)
  if (entry.partner) lines.push(`Tu pareja: ${entry.partner}`)
  return lines.join("\n\n")
}

const TEXTAREA_CLASSES =
  "w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-relaciones dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-relaciones-light"

export function CouplesJournal() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [entries, setEntries] = useState<CoupleEntry[]>([])
  const [mine, setMine] = useState("")
  const [partner, setPartner] = useState("")
  const [justSaved, setJustSaved] = useState(false)
  const [draftFlash, setDraftFlash] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const touched = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Montaje: fecha local, entradas guardadas y respuesta de hoy (entrada o borrador)
  useEffect(() => {
    const today = localDayKey(new Date())
    setDayKey(today)
    const loaded = storageGet<CoupleEntry[]>(ENTRIES_KEY, [])
    const valid = loaded.filter((e) => typeof e?.date === "string" && typeof e?.question === "string")
    setEntries(valid)
    const draft = storageGet<CoupleDraft>(DRAFT_KEY, {})
    const todayEntry = valid.find((e) => e.date === today)
    if (draft.date === today && (draft.mine || draft.partner)) {
      setMine(draft.mine ?? "")
      setPartner(draft.partner ?? "")
    } else if (todayEntry) {
      setMine(todayEntry.mine)
      setPartner(todayEntry.partner)
    }
    setMounted(true)
  }, [])

  const question = dayKey ? questionForDay(dayKey) : null
  const streak = useMemo(() => computeStreak(entries), [entries])

  // Autoguarda el borrador de hoy (solo tras la primera edición del usuario,
  // para no re-guardar ni parpadear al precargar la entrada del día)
  useEffect(() => {
    if (!mounted || !dayKey || !touched.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (mine || partner) {
        if (storageSet(DRAFT_KEY, { date: dayKey, mine, partner })) {
          setDraftFlash(true)
          setTimeout(() => setDraftFlash(false), 1500)
        }
      } else {
        storageRemove(DRAFT_KEY)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [mine, partner, mounted, dayKey])

  const saveToday = () => {
    if (!dayKey || !question) return
    if (!mine.trim() && !partner.trim()) return
    const entry: CoupleEntry = {
      id: dayKey,
      date: dayKey,
      question,
      mine: mine.trim(),
      partner: partner.trim(),
      savedAt: new Date().toISOString(),
    }
    const updated = entries.some((e) => e.date === dayKey)
      ? entries.map((e) => (e.date === dayKey ? entry : e))
      : [entry, ...entries]
    setEntries(updated)
    storageSet(ENTRIES_KEY, updated)
    storageRemove(DRAFT_KEY)
    setDraftFlash(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1500)
    triggerHapticFeedback("medium")
  }

  const copyEntry = async (entry: CoupleEntry) => {
    try {
      await navigator.clipboard.writeText(formatEntryText(entry))
      setCopiedId(entry.id)
      setTimeout(() => setCopiedId(null), 1500)
      triggerHapticFeedback("light")
    } catch {
      // Portapapeles no disponible (contexto no seguro): sin acción
    }
  }

  const requestDelete = (id: string) => {
    setConfirmDeleteId(id)
    setConfirmClearAll(false)
    if (pendingTimer.current) clearTimeout(pendingTimer.current)
    pendingTimer.current = setTimeout(() => setConfirmDeleteId(null), 4000)
    triggerHapticFeedback("light")
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    storageSet(ENTRIES_KEY, updated)
    setConfirmDeleteId(null)
    triggerHapticFeedback("medium")
  }

  const requestClearAll = () => {
    setConfirmClearAll(true)
    setConfirmDeleteId(null)
    if (pendingTimer.current) clearTimeout(pendingTimer.current)
    pendingTimer.current = setTimeout(() => setConfirmClearAll(false), 4000)
    triggerHapticFeedback("light")
  }

  const clearAll = () => {
    setEntries([])
    storageRemove(ENTRIES_KEY)
    storageRemove(DRAFT_KEY)
    setMine("")
    setPartner("")
    setConfirmClearAll(false)
    triggerHapticFeedback("medium")
  }

  const hasContent = Boolean(mine.trim() || partner.trim())

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Ritual de hoy */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-relaciones-lighter p-1.5 dark:bg-relaciones-dark">
            <Heart className="h-5 w-5 text-relaciones-dark dark:text-relaciones-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Pregunta de hoy</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{dayKey ? formatDay(dayKey) : "…"}</p>
          </div>
        </div>

        <div className="mb-5 rounded-lg bg-relaciones-lighter p-4 dark:bg-relaciones-dark">
          {question ? (
            <p className="text-sm font-semibold leading-relaxed text-relaciones-darkest dark:text-relaciones-lighter">
              «{question}»
            </p>
          ) : (
            <div className="space-y-2" aria-hidden="true">
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/70 dark:bg-gray-600" />
              <div className="h-4 w-3/5 animate-pulse rounded bg-white/70 dark:bg-gray-600" />
            </div>
          )}
        </div>

        <label htmlFor="couple-mine" className="mb-1 block text-sm font-medium">
          Tú
        </label>
        <textarea
          id="couple-mine"
          value={mine}
          onChange={(e) => {
            touched.current = true
            setMine(e.target.value)
          }}
          rows={4}
          maxLength={800}
          placeholder="Escribe lo que hoy quieres contar…"
          className={TEXTAREA_CLASSES}
        />

        <label htmlFor="couple-partner" className="mb-1 mt-4 block text-sm font-medium">
          Tu pareja <span className="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="couple-partner"
          value={partner}
          onChange={(e) => {
            touched.current = true
            setPartner(e.target.value)
          }}
          rows={4}
          maxLength={800}
          placeholder="Si están juntos, deja aquí su respuesta."
          className={TEXTAREA_CLASSES}
        />

        <button
          type="button"
          onClick={saveToday}
          disabled={!hasContent}
          data-interactive="true"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-relaciones px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-relaciones-dark active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {justSaved ? (
            <>
              <Check className="h-5 w-5" />
              Entrada guardada
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Guardar la entrada de hoy
            </>
          )}
        </button>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {draftFlash ? "Borrador guardado" : "Se guarda en tu navegador"}
        </p>

        <Link
          href="/preguntas-profundas"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-relaciones-dark underline underline-offset-2 dark:text-relaciones-lighter"
          data-interactive="true"
        >
          ¿Quieren más? Prueben las 45 preguntas profundas
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Historial */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Nuestro historial</h2>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-relaciones-lighter px-2.5 py-1 text-xs font-medium text-relaciones-dark dark:bg-relaciones-dark dark:text-relaciones-lighter">
                <Flame className="h-3.5 w-3.5" />
                {streak === 1 ? "1 día seguido" : `${streak} días seguidos`}
              </span>
            )}
            {mounted && entries.length > 0 && (
              <button
                type="button"
                data-interactive="true"
                onClick={() => (confirmClearAll ? clearAll() : requestClearAll())}
                className={`rounded-md text-xs font-medium transition-colors ${
                  confirmClearAll
                    ? "flex items-center gap-1 bg-red-600 px-2.5 py-1.5 text-white hover:bg-red-700"
                    : "px-2 py-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                }`}
              >
                {confirmClearAll ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    ¿Seguro? Borrar todo
                  </>
                ) : (
                  "Borrar todo"
                )}
              </button>
            )}
          </div>
        </div>

        {!mounted ? null : entries.length === 0 ? (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay entradas guardadas. La primera puede ser la de hoy.
            </p>

            <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Para que la conversación fluya</h3>
              <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">Escuchen sin arreglar.</strong> La primera
                  respuesta no busca soluciones; busca entender.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">Una frase corta vale.</strong> No tienen que
                  escribir un ensayo ni responder todo de una vez.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">No hace falta estar de acuerdo.</strong> La
                  pregunta abre una conversación, no una discusión que haya que ganar.
                </li>
              </ul>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Las respuestas quedan solo en este navegador. Si comparten el dispositivo, pueden borrar todo desde
                el historial.
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Entender cómo se vinculan también ayuda:{" "}
                <Link
                  href="/test-apego"
                  data-interactive="true"
                  className="font-semibold text-relaciones-dark underline underline-offset-2 dark:text-relaciones-lighter"
                >
                  hagan el test de apego
                </Link>
                .
              </p>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold">Si hoy no fluye, empiecen por una frase</h3>
              <ul className="mt-2 space-y-1.5 text-sm italic text-gray-600 dark:text-gray-400">
                <li>«Hoy me sentí…»</li>
                <li>«Algo que aprecié de ti fue…»</li>
                <li>«Una cosa que necesito esta semana es…»</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const isConfirming = confirmDeleteId === entry.id
              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatDay(entry.date)}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-interactive="true"
                        onClick={() => void copyEntry(entry)}
                        aria-label="Copiar entrada"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-relaciones transition-[colors,transform] duration-150 hover:bg-relaciones-lighter active:scale-[0.97] dark:text-relaciones-light dark:hover:bg-relaciones-dark"
                      >
                        {copiedId === entry.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        data-interactive="true"
                        onClick={() => (isConfirming ? deleteEntry(entry.id) : requestDelete(entry.id))}
                        aria-label={isConfirming ? "Confirmar borrado de la entrada" : "Borrar entrada"}
                        className={`flex items-center justify-center rounded-lg transition-[colors,transform] duration-150 active:scale-[0.97] ${
                          isConfirming
                            ? "gap-1 bg-red-600 px-2.5 py-2 text-xs font-medium text-white hover:bg-red-700"
                            : "h-9 w-9 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        }`}
                      >
                        {isConfirming ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            ¿Seguro?
                          </>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">«{entry.question}»</p>
                  {entry.mine && (
                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Tú:</span> {entry.mine}
                    </p>
                  )}
                  {entry.partner && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Tu pareja:</span>{" "}
                      {entry.partner}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
