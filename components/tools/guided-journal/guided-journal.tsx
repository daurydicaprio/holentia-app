"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Calendar, Check, Copy, Feather, Flame, PencilLine, Save, Trash2, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

interface JournalEntry {
  id: string
  date: string
  mood: string
  gratitude: string
  challenges: string
  achievements: string
  tomorrow: string
}

const JOURNAL_KEY = "holentia:diario-guiado:entries:v1"
const JOURNAL_KEY_LEGACY = "holentia-journal-entries"
const DRAFT_KEY = draftKey("diario-guiado")

const EMPTY_ENTRY = { mood: "", gratitude: "", challenges: "", achievements: "", tomorrow: "" }

const MOODS = [
  { value: "Muy bien", emoji: "😄" },
  { value: "Bien", emoji: "🙂" },
  { value: "Normal", emoji: "😐" },
  { value: "Algo mal", emoji: "🙁" },
  { value: "Mal", emoji: "😢" },
] as const

const MOOD_EMOJI: Record<string, string> = Object.fromEntries(MOODS.map((m) => [m.value, m.emoji]))

function loadEntries(): JournalEntry[] {
  // Migra la clave legada una sola vez
  const legacy = storageGet<JournalEntry[]>(JOURNAL_KEY_LEGACY, [])
  if (legacy.length > 0) {
    storageSet(JOURNAL_KEY, legacy)
    storageRemove(JOURNAL_KEY_LEGACY)
    return legacy
  }
  return storageGet<JournalEntry[]>(JOURNAL_KEY, [])
}

function persistEntries(entries: JournalEntry[]) {
  storageSet(JOURNAL_KEY, entries)
}

// Días consecutivos con entrada, contando desde hoy (o ayer si hoy no hay).
// Usa la fecha local del dispositivo (en-CA → YYYY-MM-DD) para no cruzar husos.
function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA")
  const days = new Set(entries.map((e) => dayKey(new Date(e.date))))
  const cursor = new Date()
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(dayKey(cursor))) return 0
  }
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function formatEntryText(entry: JournalEntry): string {
  const fecha = new Date(entry.date).toLocaleDateString("es-DO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const lines = [`Diario guiado — ${fecha}`]
  if (entry.mood) lines.push(`Ánimo: ${entry.mood}`)
  if (entry.gratitude) lines.push(`Gratitud: ${entry.gratitude}`)
  if (entry.challenges) lines.push(`Desafíos: ${entry.challenges}`)
  if (entry.achievements) lines.push(`Logros: ${entry.achievements}`)
  if (entry.tomorrow) lines.push(`Intención para mañana: ${entry.tomorrow}`)
  return lines.join("\n\n")
}

export function GuidedJournal() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>(EMPTY_ENTRY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [draftFlash, setDraftFlash] = useState(false)
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Carga las entradas en el cliente (evita desajustes de hidratación y el
  // destello del estado vacío: hasta montar no se pinta el historial)
  useEffect(() => {
    setEntries(loadEntries())
    setMounted(true)
  }, [])

  // Restaura el borrador en curso (formulario + edición pendiente)
  useEffect(() => {
    const draft = storageGet<Partial<JournalEntry> & { editingId?: string | null }>(DRAFT_KEY, {})
    const hasContent = Boolean(
      draft.mood || draft.gratitude || draft.challenges || draft.achievements || draft.tomorrow,
    )
    if (!hasContent) return
    setCurrentEntry({
      mood: draft.mood ?? "",
      gratitude: draft.gratitude ?? "",
      challenges: draft.challenges ?? "",
      achievements: draft.achievements ?? "",
      tomorrow: draft.tomorrow ?? "",
    })
    if (draft.editingId && loadEntries().some((e) => e.id === draft.editingId)) {
      setEditingId(draft.editingId)
    }
  }, [])

  // Autoguarda el borrador con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    const hasContent = Boolean(
      currentEntry.mood || currentEntry.gratitude || currentEntry.challenges || currentEntry.achievements || currentEntry.tomorrow,
    )
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (hasContent) {
        if (storageSet(DRAFT_KEY, { ...currentEntry, editingId })) {
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
  }, [currentEntry, editingId])

  const resetForm = () => {
    setCurrentEntry(EMPTY_ENTRY)
    setEditingId(null)
    storageRemove(DRAFT_KEY)
  }

  const saveEntry = () => {
    const hasContent = Boolean(
      currentEntry.mood || currentEntry.gratitude || currentEntry.challenges || currentEntry.achievements || currentEntry.tomorrow,
    )
    if (!hasContent) return

    const original = editingId ? entries.find((e) => e.id === editingId) : undefined
    const entry: JournalEntry = {
      id: editingId || Date.now().toString(),
      // Al editar se conserva la fecha original: el historial y la racha no se mueven
      date: original?.date ?? new Date().toISOString(),
      mood: currentEntry.mood || "",
      gratitude: currentEntry.gratitude || "",
      challenges: currentEntry.challenges || "",
      achievements: currentEntry.achievements || "",
      tomorrow: currentEntry.tomorrow || "",
    }

    const updatedEntries = editingId ? entries.map((e) => (e.id === editingId ? entry : e)) : [entry, ...entries]
    setEntries(updatedEntries)
    persistEntries(updatedEntries)
    resetForm()
    triggerHapticFeedback("medium")
  }

  const requestDelete = (id: string) => {
    setConfirmDeleteId(id)
    setConfirmClearAll(false)
    if (pendingTimer.current) clearTimeout(pendingTimer.current)
    pendingTimer.current = setTimeout(() => setConfirmDeleteId(null), 4000)
    triggerHapticFeedback("light")
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id)
    setEntries(updatedEntries)
    persistEntries(updatedEntries)
    setConfirmDeleteId(null)
    if (editingId === id) resetForm()
    triggerHapticFeedback("medium")
  }

  const requestClearAll = () => {
    setConfirmClearAll(true)
    setConfirmDeleteId(null)
    if (pendingTimer.current) clearTimeout(pendingTimer.current)
    pendingTimer.current = setTimeout(() => setConfirmClearAll(false), 4000)
    triggerHapticFeedback("light")
  }

  const clearAllEntries = () => {
    setEntries([])
    persistEntries([])
    setConfirmClearAll(false)
    resetForm()
    triggerHapticFeedback("medium")
  }

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry)
    setEditingId(entry.id)
    triggerHapticFeedback("light")
  }

  const cancelEdit = () => {
    resetForm()
    triggerHapticFeedback("light")
  }

  const selectMood = (value: string) => {
    setCurrentEntry((prev) => ({ ...prev, mood: prev.mood === value ? "" : value }))
    triggerHapticFeedback("light")
  }

  const copyEntry = async (entry: JournalEntry) => {
    try {
      await navigator.clipboard.writeText(formatEntryText(entry))
      setCopiedId(entry.id)
      setTimeout(() => setCopiedId(null), 1500)
      triggerHapticFeedback("light")
    } catch {
      // Portapapeles no disponible (contexto no seguro): sin acción
    }
  }

  const streak = computeStreak(entries)
  const recentMoods = entries.filter((e) => e.mood && MOOD_EMOJI[e.mood]).slice(0, 7)

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Formulario */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">{editingId ? "Editar entrada" : "Nueva entrada"}</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tus respuestas quedan solo en tu navegador.
        </p>

        <div className="space-y-4">
          <div>
            <span className="mb-2 block text-sm font-medium">¿Cómo te sientes hoy?</span>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => selectMood(m.value)}
                  aria-pressed={currentEntry.mood === m.value}
                  aria-label={m.value}
                  data-interactive="true"
                  className={`flex flex-col items-center gap-1 rounded-md px-1 py-2 text-center text-[11px] font-medium leading-tight transition-[colors,transform] duration-150 active:scale-[0.97] ${
                    currentEntry.mood === m.value
                      ? "bg-mente text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {m.emoji}
                  </span>
                  {m.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="journal-gratitude" className="mb-2 block text-sm font-medium">
              ¿Por qué estás agradecido/a hoy?
            </label>
            <textarea
              id="journal-gratitude"
              value={currentEntry.gratitude}
              onChange={(e) => setCurrentEntry({ ...currentEntry, gratitude: e.target.value })}
              placeholder="Escribe al menos tres cosas por las que estás agradecido..."
              className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white p-3 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-mente-light"
              data-interactive="true"
            />
          </div>

          <div>
            <label htmlFor="journal-challenges" className="mb-2 block text-sm font-medium">
              ¿Qué desafíos enfrentaste hoy?
            </label>
            <textarea
              id="journal-challenges"
              value={currentEntry.challenges}
              onChange={(e) => setCurrentEntry({ ...currentEntry, challenges: e.target.value })}
              placeholder="Describe los retos o dificultades del día..."
              className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white p-3 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-mente-light"
              data-interactive="true"
            />
          </div>

          <div>
            <label htmlFor="journal-achievements" className="mb-2 block text-sm font-medium">
              ¿Qué lograste hoy?
            </label>
            <textarea
              id="journal-achievements"
              value={currentEntry.achievements}
              onChange={(e) => setCurrentEntry({ ...currentEntry, achievements: e.target.value })}
              placeholder="Celebra tus logros, grandes y pequeños..."
              className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white p-3 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-mente-light"
              data-interactive="true"
            />
          </div>

          <div>
            <label htmlFor="journal-tomorrow" className="mb-2 block text-sm font-medium">
              ¿Qué harás mañana para cuidarte?
            </label>
            <textarea
              id="journal-tomorrow"
              value={currentEntry.tomorrow}
              onChange={(e) => setCurrentEntry({ ...currentEntry, tomorrow: e.target.value })}
              placeholder="Establece una intención para mañana..."
              className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white p-3 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-mente-light"
              data-interactive="true"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              data-interactive="true"
              onClick={saveEntry}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-mente px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-mente-dark active:scale-[0.97]"
            >
              <Save className="h-5 w-5" />
              {editingId ? "Actualizar entrada" : "Guardar entrada"}
            </button>
            {editingId && (
              <button
                type="button"
                data-interactive="true"
                onClick={cancelEdit}
                className="flex items-center justify-center gap-2 rounded-md bg-gray-300 px-6 py-3 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-400 active:scale-[0.97] dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
                Cancelar
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {draftFlash ? "Borrador guardado" : "El borrador se guarda mientras escribes"}
          </p>
        </div>
      </div>

      {/* Historial */}
      <div className="space-y-6 lg:col-span-3">
        {!mounted ? (
          <div aria-hidden="true" className="min-h-[220px] rounded-xl bg-white shadow-lg dark:bg-gray-800" />
        ) : entries.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <Feather className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p className="font-medium">Tu diario está en blanco</p>
              <p className="mt-1 text-sm">
                Escribe tu primera entrada con el formulario y guárdala. Con el tiempo verás tu progreso.
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <PencilLine className="h-4 w-4 text-mente-dark dark:text-mente-light" />
                Para empezar sin bloquearte
              </h3>
              <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">Un momento, no el día entero.</strong> Elige
                  una escena concreta y descríbela en dos o tres frases.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">Escribe sin corregir.</strong> La primera
                  versión no tiene que quedar bonita; solo tiene que ser tuya.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-200">Cierra con una intención.</strong> Una acción
                  pequeña para mañana vale más que un plan perfecto.
                </li>
              </ul>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
                  <p className="text-xl font-bold tabular-nums">0</p>
                  <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">Días de racha</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
                  <p className="text-xl font-bold tabular-nums">0</p>
                  <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">Entradas</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
                  <p className="text-xl font-bold">—</p>
                  <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">Ánimo frecuente</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Cuando guardes tu primera entrada, aquí verás tu racha y la evolución de tu ánimo.
              </p>
            </div>

            <p className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              Si hoy pesa mucho,{" "}
              <Link
                href="/test-ansiedad"
                data-interactive="true"
                className="font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              >
                el test de ansiedad
              </Link>{" "}
              puede ayudarte a ponerle nombre a lo que sientes.
            </p>

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold">Si no sabes por dónde empezar</h3>
              <ul className="mt-2 space-y-1.5 text-sm italic text-gray-600 dark:text-gray-400">
                <li>«Hoy me di cuenta de que…»</li>
                <li>«Lo que más me costó fue…»</li>
                <li>«Mañana quiero cuidarme así:…»</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {(streak >= 2 || recentMoods.length >= 2) && (
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                {streak >= 2 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Flame className="h-4 w-4 text-mente dark:text-mente-light" />
                      Racha
                    </span>
                    <span className="text-sm font-semibold">
                      {streak} {streak === 1 ? "día" : "días"} seguidos
                    </span>
                  </div>
                )}
                {recentMoods.length >= 2 && (
                  <div className={streak >= 2 ? "mt-4" : ""}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ánimo de tus últimas entradas</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {recentMoods.map((entry) => (
                        <span
                          key={entry.id}
                          className="text-xl"
                          title={new Date(entry.date).toLocaleDateString("es-DO", {
                            day: "numeric",
                            month: "short",
                          })}
                        >
                          {MOOD_EMOJI[entry.mood]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Entradas anteriores</h2>
                <button
                  type="button"
                  data-interactive="true"
                  onClick={confirmClearAll ? clearAllEntries : requestClearAll}
                  aria-label={confirmClearAll ? "Confirmar borrado de todas las entradas" : "Borrar todas las entradas"}
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
              </div>
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
                          <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                            {new Date(entry.date).toLocaleDateString("es-DO", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            data-interactive="true"
                            onClick={() => void copyEntry(entry)}
                            aria-label="Copiar entrada"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-mente transition-[colors,transform] duration-150 hover:bg-mente-lighter active:scale-[0.97] dark:text-mente-light dark:hover:bg-mente-dark"
                          >
                            {copiedId === entry.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            data-interactive="true"
                            onClick={() => editEntry(entry)}
                            aria-label="Editar entrada"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-mente transition-[colors,transform] duration-150 hover:bg-mente-lighter active:scale-[0.97] dark:text-mente-light dark:hover:bg-mente-dark"
                          >
                            <PencilLine className="h-4 w-4" />
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

                      {entry.mood && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Estado de ánimo:</span>{" "}
                          <span className="text-sm">
                            {MOOD_EMOJI[entry.mood] ? `${MOOD_EMOJI[entry.mood]} ` : ""}
                            {entry.mood}
                          </span>
                        </div>
                      )}
                      {entry.gratitude && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Gratitud:</span>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{entry.gratitude}</p>
                        </div>
                      )}
                      {entry.challenges && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Desafíos:</span>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{entry.challenges}</p>
                        </div>
                      )}
                      {entry.achievements && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Logros:</span>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{entry.achievements}</p>
                        </div>
                      )}
                      {entry.tomorrow && (
                        <div>
                          <span className="text-sm font-medium">Intención para mañana:</span>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{entry.tomorrow}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
