"use client"

import { useState } from "react"
import { Calendar, Save, Trash2, Edit2, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { storageGet, storageSet, storageRemove } from "@/lib/storage"

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

export function GuidedJournal() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window !== "undefined") return loadEntries()
    return []
  })

  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    mood: "",
    gratitude: "",
    challenges: "",
    achievements: "",
    tomorrow: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  const saveEntry = () => {
    if (
      !currentEntry.mood &&
      !currentEntry.gratitude &&
      !currentEntry.challenges &&
      !currentEntry.achievements &&
      !currentEntry.tomorrow
    ) {
      return
    }

    const entry: JournalEntry = {
      id: editingId || Date.now().toString(),
      date: new Date().toISOString(),
      mood: currentEntry.mood || "",
      gratitude: currentEntry.gratitude || "",
      challenges: currentEntry.challenges || "",
      achievements: currentEntry.achievements || "",
      tomorrow: currentEntry.tomorrow || "",
    }

    let updatedEntries: JournalEntry[]
    if (editingId) {
      updatedEntries = entries.map((e) => (e.id === editingId ? entry : e))
    } else {
      updatedEntries = [entry, ...entries]
    }

    setEntries(updatedEntries)
    persistEntries(updatedEntries)
    setCurrentEntry({ mood: "", gratitude: "", challenges: "", achievements: "", tomorrow: "" })
    setEditingId(null)
    triggerHapticFeedback("medium")
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id)
    setEntries(updatedEntries)
    persistEntries(updatedEntries)
    triggerHapticFeedback("medium")
  }

  const clearAllEntries = () => {
    setEntries([])
    persistEntries([])
    triggerHapticFeedback("medium")
  }

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry)
    setEditingId(entry.id)
    triggerHapticFeedback("light")
  }

  const cancelEdit = () => {
    setCurrentEntry({ mood: "", gratitude: "", challenges: "", achievements: "", tomorrow: "" })
    setEditingId(null)
    triggerHapticFeedback("light")
  }

  return (
    <div className="space-y-6">
      {/* Formulario de entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          {editingId ? "Editar entrada" : "Nueva entrada"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">¿Cómo te sientes hoy?</label>
            <select
              value={currentEntry.mood}
              onChange={(e) => setCurrentEntry({ ...currentEntry, mood: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona tu estado de ánimo</option>
              <option value="Muy bien">😄 Muy bien</option>
              <option value="Bien">🙂 Bien</option>
              <option value="Normal">😐 Normal</option>
              <option value="Algo mal">🙁 Algo mal</option>
              <option value="Mal">😢 Mal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">¿Por qué estás agradecido/a hoy?</label>
            <textarea
              value={currentEntry.gratitude}
              onChange={(e) => setCurrentEntry({ ...currentEntry, gratitude: e.target.value })}
              placeholder="Escribe al menos tres cosas por las que estás agradecido..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">¿Qué desafíos enfrentaste hoy?</label>
            <textarea
              value={currentEntry.challenges}
              onChange={(e) => setCurrentEntry({ ...currentEntry, challenges: e.target.value })}
              placeholder="Describe los retos o dificultades del día..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">¿Qué lograste hoy?</label>
            <textarea
              value={currentEntry.achievements}
              onChange={(e) => setCurrentEntry({ ...currentEntry, achievements: e.target.value })}
              placeholder="Celebra tus logros, grandes y pequeños..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">¿Qué harás mañana para cuidarte?</label>
            <textarea
              value={currentEntry.tomorrow}
              onChange={(e) => setCurrentEntry({ ...currentEntry, tomorrow: e.target.value })}
              placeholder="Establece una intención para mañana..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveEntry}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Save className="h-5 w-5" />
              {editingId ? "Actualizar entrada" : "Guardar entrada"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <X className="h-5 w-5" />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de entradas */}
      {entries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Entradas anteriores</h2>
            <button
              onClick={clearAllEntries}
              className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
            >
              Borrar todo
            </button>
          </div>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEntry(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {entry.mood && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Estado de ánimo:</span>{" "}
                    <span className="text-sm">{entry.mood}</span>
                  </div>
                )}
                {entry.gratitude && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Gratitud:</span>{" "}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.gratitude}</p>
                  </div>
                )}
                {entry.challenges && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Desafíos:</span>{" "}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.challenges}</p>
                  </div>
                )}
                {entry.achievements && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Logros:</span>{" "}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.achievements}</p>
                  </div>
                )}
                {entry.tomorrow && (
                  <div>
                    <span className="text-sm font-medium">Intención para mañana:</span>{" "}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.tomorrow}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
