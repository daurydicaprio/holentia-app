"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AlarmClock, ArrowRight, Info, Moon, Sunrise, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Calculadora del sueño: hora ideal para acostarse o despertarse según los
// ciclos de sueño (~90 min) + 15 min de margen para quedarse dormido/a.
const DRAFT_KEY = draftKey("calculadora-sueno")
const CYCLE_MINUTES = 90
const FALL_ASLEEP_MINUTES = 15
const CYCLES = [6, 5, 4]
const RECOMMENDED_CYCLES = 5
const WAKE_DEFAULT = "06:30"
const BED_DEFAULT = "23:00"

const TIPS = [
  "Pantallas fuera 30–60 minutos antes: la luz frena la melatonina.",
  "Cuarto oscuro, fresco (≈18–22 °C) y silencioso.",
  "Levántate a la misma hora todos los días, incluso el fin de semana.",
]

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

/** "06:30" → "6:30 a.m." (formato local RD, 12 horas). */
function formatTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const hours24 = Math.floor(normalized / 60)
  const minutes = normalized % 60
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const suffix = hours24 < 12 ? "a.m." : "p.m."
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`
}

export function SleepCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mode, setMode] = useState<"wake" | "bed">("wake")
  const [wakeTime, setWakeTime] = useState(WAKE_DEFAULT)
  const [bedTime, setBedTime] = useState(BED_DEFAULT)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D)
  useEffect(() => {
    const parsed = storageGet<{ mode?: string; wakeTime?: string; bedTime?: string }>(DRAFT_KEY, {})
    if (parsed.mode === "wake" || parsed.mode === "bed") setMode(parsed.mode)
    if (typeof parsed.wakeTime === "string" && toMinutes(parsed.wakeTime) !== null) setWakeTime(parsed.wakeTime)
    if (typeof parsed.bedTime === "string" && toMinutes(parsed.bedTime) !== null) setBedTime(parsed.bedTime)
  }, [])

  // Autoguardado con debounce 500 ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { mode, wakeTime, bedTime })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [mode, wakeTime, bedTime])

  const baseTime = mode === "wake" ? wakeTime : bedTime
  const baseMinutes = useMemo(() => toMinutes(baseTime), [baseTime])

  const rows = useMemo(() => {
    if (baseMinutes === null) return []
    return CYCLES.map((cycles) => {
      const sleepMinutes = cycles * CYCLE_MINUTES
      const clockMinutes =
        mode === "wake"
          ? baseMinutes - FALL_ASLEEP_MINUTES - sleepMinutes
          : baseMinutes + FALL_ASLEEP_MINUTES + sleepMinutes
      return { cycles, sleepMinutes, clockMinutes }
    })
  }, [baseMinutes, mode])

  const selectMode = (next: "wake" | "bed") => {
    setMode(next)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setMode("wake")
    setWakeTime(WAKE_DEFAULT)
    setBedTime(BED_DEFAULT)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu horario</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Dime una hora y te doy la otra, alineada con tus ciclos de sueño.
        </p>

        <span className="mb-2 block text-sm font-medium">¿Qué quieres calcular?</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectMode("wake")}
            aria-pressed={mode === "wake"}
            data-interactive="true"
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
              mode === "wake"
                ? "bg-mente text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Sunrise className="h-4 w-4" />
            Me levanto
          </button>
          <button
            type="button"
            onClick={() => selectMode("bed")}
            aria-pressed={mode === "bed"}
            data-interactive="true"
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
              mode === "bed"
                ? "bg-mente text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Moon className="h-4 w-4" />
            Me acuesto
          </button>
        </div>

        <label htmlFor="hora-sueno" className="mb-2 mt-5 block text-sm font-medium">
          {mode === "wake" ? "Hora a la que te levantas" : "Hora a la que te acuestas"}
        </label>
        <input
          id="hora-sueno"
          type="time"
          value={baseTime}
          onChange={(e) => (mode === "wake" ? setWakeTime(e.target.value) : setBedTime(e.target.value))}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-lg font-semibold text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-mente-light"
          data-interactive="true"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          El cálculo asume ciclos de sueño de 90 minutos + 15 minutos para quedarte dormido/a.
        </p>

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

      {/* Resultado */}
      <div className="space-y-4 lg:col-span-3">
        {baseMinutes === null || rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
            <AlarmClock className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">Elige una hora válida</p>
            <p className="mt-1 text-sm">y verás las opciones de 4, 5 y 6 ciclos de sueño.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-2">
                {mode === "wake" ? (
                  <Moon className="h-5 w-5 text-mente dark:text-mente-light" />
                ) : (
                  <Sunrise className="h-5 w-5 text-mente dark:text-mente-light" />
                )}
                <h2 className="text-xl font-bold">
                  {mode === "wake" ? "Tus horas para dormir" : "Tus horas para despertar"}
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {mode === "wake"
                  ? `Si te levantas a las ${formatTime(baseMinutes)}`
                  : `Si te acuestas a las ${formatTime(baseMinutes)}`}
              </p>

              <div className="mt-4 space-y-3">
                {rows.map((row) => {
                  const recommended = row.cycles === RECOMMENDED_CYCLES
                  return (
                    <div
                      key={row.cycles}
                      className={`flex items-center justify-between gap-3 rounded-lg border p-4 ${
                        recommended
                          ? "border-mente bg-mente-lighter dark:border-mente-light dark:bg-mente-dark"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div>
                        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          {recommended && (
                            <span className="rounded-full bg-mente px-2 py-0.5 text-[11px] font-semibold text-white">
                              Recomendado
                            </span>
                          )}
                          {mode === "wake" ? "Acuéstate a las" : "Despiértate a las"}
                        </p>
                        <p
                          className={`mt-0.5 text-xs ${
                            recommended ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {row.cycles} ciclos · {formatDuration(row.sleepMinutes)} de sueño
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-2xl font-bold tabular-nums text-mente-dark dark:text-mente-light">
                        {formatTime(row.clockMinutes)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-mente-lighter p-3 text-xs text-gray-800 dark:bg-mente-dark dark:text-gray-200">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-mente-dark dark:text-mente-light" />
                <span>
                  Para adultos se recomiendan 7–9 horas de sueño: los 5 ciclos (7 h 30 min) son un buen punto de
                  partida. Despertar al final de un ciclo —y no a mitad— hace la diferencia.
                </span>
              </div>
            </div>

            {/* Cómo dormir mejor */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="text-xl font-bold">Cómo dormir mejor</h2>
              <ol className="mt-3 space-y-2">
                {TIPS.map((tip, i) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mente-lighter text-[11px] font-bold text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ol>
            </div>

            {/* Enlace al test de calidad */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="text-xl font-bold">¿Y la calidad de tu sueño?</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                El horario es la mitad del plan: con el test de 11 preguntas verás cómo está tu descanso y recibirás
                consejos según lo que te despierta.
              </p>
              <Link
                href="/test-calidad-sueno"
                data-interactive="true"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mente-dark underline underline-offset-2 dark:text-mente-light"
              >
                Hacer el test de calidad del sueño
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
