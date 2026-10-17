"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Info, Pause, Play, RotateCcw, Square, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Respiración guiada: un círculo en tiempo real marca las fases (inhala /
// retén / exhala / sostén) con cuentas. La escala del círculo se interpola
// por frame con requestAnimationFrame; pausar la congela y reanudar continúa
// donde iba (el progreso vive en un ref, no en el estado de React).
const DRAFT_KEY = draftKey("tecnicas-respiracion")

type Phase = { name: string; seconds: number; from: number; to: number }

interface Pattern {
  id: string
  name: string
  tag: string
  detail: string
  phases: Phase[]
}

const PATTERNS: Pattern[] = [
  {
    id: "478",
    name: "4-7-8",
    tag: "Para dormir",
    detail: "Inhala 4 s · retén 7 s · exhala 8 s",
    phases: [
      { name: "Inhala", seconds: 4, from: 0.45, to: 1 },
      { name: "Retén", seconds: 7, from: 1, to: 1 },
      { name: "Exhala", seconds: 8, from: 1, to: 0.45 },
    ],
  },
  {
    id: "caja",
    name: "Caja 4-4-4-4",
    tag: "Concentración",
    detail: "Inhala, retén, exhala y sostén: 4 s cada uno",
    phases: [
      { name: "Inhala", seconds: 4, from: 0.45, to: 1 },
      { name: "Retén", seconds: 4, from: 1, to: 1 },
      { name: "Exhala", seconds: 4, from: 1, to: 0.45 },
      { name: "Sostén", seconds: 4, from: 0.45, to: 0.45 },
    ],
  },
  {
    id: "calma",
    name: "Calma 4-6",
    tag: "Relajación",
    detail: "Inhala 4 s · exhala 6 s (sin retenciones)",
    phases: [
      { name: "Inhala", seconds: 4, from: 0.45, to: 1 },
      { name: "Exhala", seconds: 6, from: 1, to: 0.45 },
    ],
  },
]

const RONDAS = [3, 5, 10]
const RONDAS_DEFAULT = 5

const PASOS = [
  "Siéntate con la espalda recta y los pies apoyados; puedes cerrar los ojos.",
  "Inhala por la nariz y suelta el aire por la boca, siguiendo el círculo y las cuentas.",
  "Si te marea, acorta las retenciones o cambia a la técnica de calma (sin retener).",
]

type Status = "idle" | "running" | "paused" | "done"

export function BreathingExercises() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [patternId, setPatternId] = useState(PATTERNS[0].id)
  const [rondas, setRondas] = useState(RONDAS_DEFAULT)
  const [status, setStatus] = useState<Status>("idle")
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const circleRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef({ phaseIdx: 0, round: 1, phaseStart: 0, pausedRemaining: 0 })
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  const pattern = useMemo(() => PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0], [patternId])
  const totalSeconds = useMemo(
    () => pattern.phases.reduce((sum, phase) => sum + phase.seconds, 0) * rondas,
    [pattern, rondas],
  )
  const totalPhases = pattern.phases.length * rondas

  // Cargar preferencias locales (técnica y rondas)
  useEffect(() => {
    const parsed = storageGet<{ patternId?: string; rondas?: number }>(DRAFT_KEY, {})
    if (parsed.patternId && PATTERNS.some((p) => p.id === parsed.patternId)) setPatternId(parsed.patternId)
    if (typeof parsed.rondas === "number" && RONDAS.includes(parsed.rondas)) setRondas(parsed.rondas)
  }, [])

  // Autoguardado del borrador con debounce 500 ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { patternId, rondas })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [patternId, rondas])

  // Motor de la práctica: interpola la escala del círculo y avanza de fase
  useEffect(() => {
    if (status !== "running") return
    const phases = pattern.phases
    let raf = 0

    const tick = () => {
      const prog = progressRef.current
      const now = Date.now()
      let phase = phases[prog.phaseIdx]

      while (now - prog.phaseStart >= phase.seconds * 1000) {
        prog.phaseStart += phase.seconds * 1000
        prog.phaseIdx += 1
        if (prog.phaseIdx >= phases.length) {
          prog.phaseIdx = 0
          prog.round += 1
          if (prog.round > rondas) {
            if (circleRef.current) circleRef.current.style.transform = "scale(0.45)"
            setPhaseIndex(0)
            setTimeLeft(null)
            setStatus("done")
            triggerHapticFeedback("medium")
            return
          }
        }
        triggerHapticFeedback("light")
        setPhaseIndex(prog.phaseIdx)
        setRound(prog.round)
        phase = phases[prog.phaseIdx]
      }

      const elapsed = now - prog.phaseStart
      const progress = Math.min(1, elapsed / (phase.seconds * 1000))
      if (circleRef.current) {
        const scale = phase.from + (phase.to - phase.from) * progress
        circleRef.current.style.transform = `scale(${scale})`
      }
      setTimeLeft(Math.max(1, Math.ceil((phase.seconds * 1000 - elapsed) / 1000)))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status, pattern, rondas, triggerHapticFeedback])

  const start = () => {
    progressRef.current = { phaseIdx: 0, round: 1, phaseStart: Date.now(), pausedRemaining: 0 }
    setPhaseIndex(0)
    setRound(1)
    setTimeLeft(pattern.phases[0].seconds)
    setStatus("running")
    triggerHapticFeedback("light")
  }

  const pause = () => {
    const prog = progressRef.current
    const phase = pattern.phases[prog.phaseIdx]
    prog.pausedRemaining = Math.max(0, prog.phaseStart + phase.seconds * 1000 - Date.now())
    setTimeLeft(Math.max(1, Math.ceil(prog.pausedRemaining / 1000)))
    setStatus("paused")
    triggerHapticFeedback("light")
  }

  const resume = () => {
    const prog = progressRef.current
    const phase = pattern.phases[prog.phaseIdx]
    prog.phaseStart = Date.now() - (phase.seconds * 1000 - prog.pausedRemaining)
    setStatus("running")
    triggerHapticFeedback("light")
  }

  const stop = () => {
    setStatus("idle")
    setPhaseIndex(0)
    setRound(1)
    setTimeLeft(null)
    if (circleRef.current) circleRef.current.style.transform = "scale(0.45)"
    triggerHapticFeedback("light")
  }

  const selectPattern = (id: string) => {
    if (status !== "idle") stop()
    setPatternId(id)
    triggerHapticFeedback("light")
  }

  const selectRondas = (value: number) => {
    if (status !== "idle") stop()
    setRondas(value)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    stop()
    setPatternId(PATTERNS[0].id)
    setRondas(RONDAS_DEFAULT)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const phase = pattern.phases[phaseIndex]
  const running = status === "running" || status === "paused"
  const minutes = Math.max(1, Math.round(totalSeconds / 60))
  const donePhases = (round - 1) * pattern.phases.length + phaseIndex
  const progressPct = status === "done" ? 100 : status === "idle" ? 0 : (donePhases / totalPhases) * 100

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu práctica</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Elige la técnica y las rondas: el círculo te guía segundo a segundo.
        </p>

        {/* Técnica */}
        <span className="mb-2 block text-sm font-medium">Técnica</span>
        <div className="space-y-2">
          {PATTERNS.map((p) => {
            const selected = p.id === patternId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPattern(p.id)}
                aria-pressed={selected}
                data-interactive="true"
                className={`w-full rounded-lg border p-3 text-left transition-[colors,transform] duration-150 active:scale-[0.97] ${
                  selected
                    ? "border-mente bg-mente-lighter dark:border-mente-light dark:bg-mente-dark"
                    : "border-gray-200 hover:border-mente-light dark:border-gray-700 dark:hover:border-mente-light"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      selected
                        ? "bg-mente text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {p.tag}
                  </span>
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    selected ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {p.detail}
                </span>
              </button>
            )
          })}
        </div>

        {/* Rondas */}
        <span className="mb-2 mt-5 block text-sm font-medium">Rondas</span>
        <div className="grid grid-cols-3 gap-2">
          {RONDAS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => selectRondas(r)}
              aria-pressed={rondas === r}
              data-interactive="true"
              className={`rounded-md px-2 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
                rondas === r
                  ? "bg-mente text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {r} rondas
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Duración total: ≈ {minutes} {minutes === 1 ? "minuto" : "minutos"}.
        </p>

        {/* Botones */}
        <div className="mt-6 flex gap-3">
          {running ? (
            <>
              <button
                type="button"
                onClick={status === "running" ? pause : resume}
                data-interactive="true"
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-mente px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-mente-dark active:scale-[0.97]"
              >
                {status === "running" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {status === "running" ? "Pausar" : "Reanudar"}
              </button>
              <button
                type="button"
                onClick={stop}
                data-interactive="true"
                className="flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Square className="h-4 w-4" />
                Detener
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={start}
              data-interactive="true"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-mente px-6 py-3 font-medium text-white transition-[colors,transform] duration-150 hover:bg-mente-dark active:scale-[0.97]"
            >
              {status === "done" ? <RotateCcw className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {status === "done" ? "Repetir" : "Iniciar práctica"}
            </button>
          )}
        </div>

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
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{pattern.name}</h2>
            <span className="rounded-full bg-mente-lighter px-3 py-1 text-xs font-medium text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
              {status === "done" ? "Completado" : `Ronda ${round} de ${rondas}`}
            </span>
          </div>

          {/* Círculo guía */}
          <div className="relative mx-auto mb-2 mt-8 flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
            <div
              className="absolute inset-0 rounded-full border-4 border-mente-lighter dark:border-mente-dark"
              aria-hidden="true"
            />
            <div
              ref={circleRef}
              className="absolute inset-0 rounded-full bg-mente-lighter dark:bg-mente-dark"
              style={{ transform: "scale(0.45)" }}
              aria-hidden="true"
            />
            <div className="relative z-10 text-center">
              {status === "done" ? (
                <>
                  <Check className="mx-auto h-12 w-12 text-mente dark:text-mente-light" />
                  <p className="mt-2 text-lg font-semibold">¡Listo!</p>
                </>
              ) : status === "idle" ? (
                <>
                  <p className="text-4xl font-bold text-mente-dark dark:text-mente-light">{pattern.name}</p>
                  <p className="mx-auto mt-2 max-w-[11rem] text-xs text-gray-500 dark:text-gray-400">
                    Sigue el círculo: crece al inhalar y se encoge al exhalar.
                  </p>
                </>
              ) : (
                <>
                  <p
                    aria-live="polite"
                    className="text-sm font-semibold uppercase tracking-wide text-mente-dark dark:text-mente-light"
                  >
                    {phase.name}
                  </p>
                  <div aria-hidden="true">
                    <p className="mt-1 text-6xl font-bold tabular-nums text-mente-dark dark:text-mente-light">
                      {timeLeft}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">segundos</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progreso */}
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-mente transition-[width] duration-300 dark:bg-mente-light"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {status === "done"
                ? `Completaste ${rondas} rondas. Nota cómo te sientes ahora: ¿más calmado/a?`
                : `Técnica ${pattern.name} · ${pattern.detail}`}
            </p>
          </div>
        </div>

        {/* Cómo hacerlo bien */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold">Cómo hacerlo bien</h2>
          <ol className="mt-3 space-y-2">
            {PASOS.map((paso, i) => (
              <li key={paso} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mente-lighter text-[11px] font-bold text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        {/* Aviso */}
        <div className="flex items-start gap-2 rounded-lg bg-mente-lighter p-3 text-xs text-gray-800 dark:bg-mente-dark dark:text-gray-200">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-mente-dark dark:text-mente-light" />
          <span>
            La respiración guiada acompaña, no sustituye tratamiento médico o psicológico. Evita las retenciones de aire
            en el agua o conduciendo; si te marea, detente y vuelve a tu respiración normal.
          </span>
        </div>
      </div>
    </div>
  )
}
