"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Info,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  SkipForward,
  Sparkles,
  Sprout,
  Square,
  Target,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"
import {
  DEFAULT_HIIT_CONFIG,
  HIIT_DURATIONS,
  HIIT_EXERCISES,
  HIIT_FOCUSES,
  HIIT_LEVELS,
  formatHiitClock,
  formatHiitDuration,
  generateHiitSegments,
  getHiitFocus,
  getHiitLevel,
  getHiitRounds,
  getHiitSegmentStarts,
  getHiitTotalSeconds,
  hiitPhaseLabel,
  locateHiitSegment,
  normalizeHiitConfig,
  resolveHiitExercise,
  type HiitConfig,
  type HiitDuration,
  type HiitFocus,
  type HiitLevel,
} from "./hiit-data"

const DRAFT_KEY = draftKey("rutinas-hiit")

type Status = "idle" | "running" | "paused" | "done"

const LEVEL_ICONS: Record<HiitLevel, LucideIcon> = {
  principiante: Sprout,
  intermedio: Flame,
  avanzado: Zap,
}

const FOCUS_ICONS: Record<HiitFocus, LucideIcon> = {
  "cuerpo-completo": Dumbbell,
  piernas: Footprints,
  core: Target,
  cardio: HeartPulse,
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cuerpo focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cuerpo-light dark:focus-visible:ring-offset-gray-800"

const primaryButton =
  "h-11 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-[colors,transform] duration-150 hover:bg-gray-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"

const secondaryButton =
  "h-11 rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"

export function HiitRoutines() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const hapticRef = useRef(triggerHapticFeedback)
  hapticRef.current = triggerHapticFeedback

  const [config, setConfig] = useState<HiitConfig>(DEFAULT_HIIT_CONFIG)
  const [mounted, setMounted] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const skipNextSave = useRef(false)

  const segments = useMemo(() => generateHiitSegments(config), [config])
  const totalSeconds = useMemo(() => getHiitTotalSeconds(segments), [segments])
  const segmentStarts = useMemo(() => getHiitSegmentStarts(segments), [segments])
  const rounds = getHiitRounds(config.duration)
  const level = getHiitLevel(config.level)
  const focus = getHiitFocus(config.focus)
  const exercises = useMemo(
    () => HIIT_EXERCISES[config.focus].map((exercise) => resolveHiitExercise(exercise, config.lowImpact)),
    [config.focus, config.lowImpact],
  )
  const workSeconds = rounds * exercises.length * level.work
  const restSeconds = rounds * exercises.length * level.rest
  const workIntervalCount = rounds * exercises.length

  const [status, setStatus] = useState<Status>("idle")
  const [elapsed, setElapsed] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [remaining, setRemaining] = useState(segments[0]?.seconds ?? 0)

  const elapsedRef = useRef(0)
  const startedAtRef = useRef(0)
  const indexRef = useRef(0)
  const finishedRef = useRef(false)

  const timerRef = useRef<HTMLElement | null>(null)
  const startButtonRef = useRef<HTMLButtonElement | null>(null)
  const pauseButtonRef = useRef<HTMLButtonElement | null>(null)
  const repeatButtonRef = useRef<HTMLButtonElement | null>(null)
  const focusTimerOnStart = useRef(false)
  const focusTimerOnDone = useRef(false)

  const safeIndex = Math.min(currentIndex, Math.max(0, segments.length - 1))
  const currentSegment = segments[safeIndex] ?? segments[0]
  const nextSegment = segments[safeIndex + 1]
  const isActive = status === "running" || status === "paused"
  const isDone = status === "done"
  const progressPct = totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0
  const displaySeconds = status === "idle" ? totalSeconds : isDone ? 0 : remaining
  const displayLabel =
    status === "idle"
      ? "Duración total"
      : status === "paused"
        ? "En pausa"
        : isDone
          ? "Completada"
          : hiitPhaseLabel(currentSegment)

  // Carga de preferencias. La primera visita no crea una clave vacía.
  useEffect(() => {
    const normalized = normalizeHiitConfig(storageGet<unknown>(DRAFT_KEY, null))
    skipNextSave.current = true
    if (normalized) setConfig(normalized)
    setMounted(true)
  }, [])

  // Guarda solo preferencias (nivel, enfoque, duración y bajo impacto).
  useEffect(() => {
    if (!mounted) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setSaveError(!storageSet(DRAFT_KEY, config))
  }, [config, mounted])

  // Al cambiar la configuración, el temporizador vuelve a la vista previa.
  useEffect(() => {
    elapsedRef.current = 0
    startedAtRef.current = 0
    indexRef.current = 0
    finishedRef.current = false
    setStatus("idle")
    setElapsed(0)
    setCurrentIndex(0)
    setRemaining(segments[0]?.seconds ?? 0)
  }, [segments])

  // Motor del temporizador: calcula todo desde Date.now() para sobrevivir
  // pestañas en segundo plano y no acumular deriva entre intervalos.
  useEffect(() => {
    if (status !== "running") return

    const tick = () => {
      const nextElapsed = (Date.now() - startedAtRef.current) / 1000
      if (nextElapsed >= totalSeconds) {
        if (finishedRef.current) return
        finishedRef.current = true
        elapsedRef.current = totalSeconds
        indexRef.current = segments.length - 1
        setElapsed(totalSeconds)
        setCurrentIndex(Math.max(0, segments.length - 1))
        setRemaining(0)
        setStatus("done")
        focusTimerOnDone.current = true
        hapticRef.current("medium")
        return
      }

      const located = locateHiitSegment(nextElapsed, segments, segmentStarts)
      setElapsed(nextElapsed)
      setRemaining(located.remaining)
      if (located.index !== indexRef.current) {
        indexRef.current = located.index
        setCurrentIndex(located.index)
        hapticRef.current("light")
      }
    }

    tick()
    const interval = window.setInterval(tick, 250)
    return () => window.clearInterval(interval)
  }, [segments, segmentStarts, status, totalSeconds])

  // Al empezar, el botón de pausa recibe el foco; al terminar, «Repetir».
  useEffect(() => {
    if (status === "running" && focusTimerOnStart.current) {
      focusTimerOnStart.current = false
      pauseButtonRef.current?.focus({ preventScroll: true })
    }
    if (status === "done" && focusTimerOnDone.current) {
      focusTimerOnDone.current = false
      repeatButtonRef.current?.focus({ preventScroll: true })
    }
  }, [status])

  const startWorkout = () => {
    finishedRef.current = false
    elapsedRef.current = 0
    startedAtRef.current = Date.now()
    indexRef.current = 0
    setElapsed(0)
    setCurrentIndex(0)
    setRemaining(segments[0]?.seconds ?? 0)
    setStatus("running")
    focusTimerOnStart.current = true
    hapticRef.current("medium")

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      window.setTimeout(() => {
        timerRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
      }, 60)
    }
  }

  const pauseWorkout = () => {
    if (status !== "running") return
    const nextElapsed = Math.min(totalSeconds, (Date.now() - startedAtRef.current) / 1000)
    const located = locateHiitSegment(nextElapsed, segments, segmentStarts)
    elapsedRef.current = nextElapsed
    indexRef.current = located.index
    setElapsed(nextElapsed)
    setCurrentIndex(located.index)
    setRemaining(located.remaining)
    setStatus("paused")
    hapticRef.current("light")
  }

  const resumeWorkout = () => {
    if (status !== "paused") return
    startedAtRef.current = Date.now() - elapsedRef.current * 1000
    setStatus("running")
    hapticRef.current("light")
  }

  const completeWorkout = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    elapsedRef.current = totalSeconds
    indexRef.current = Math.max(0, segments.length - 1)
    setElapsed(totalSeconds)
    setCurrentIndex(Math.max(0, segments.length - 1))
    setRemaining(0)
    setStatus("done")
    focusTimerOnDone.current = true
    hapticRef.current("medium")
  }

  const skipSegment = () => {
    if (!isActive || !currentSegment) return
    const segmentEnd = segmentStarts[safeIndex] + currentSegment.seconds
    if (segmentEnd >= totalSeconds - 0.001) {
      completeWorkout()
      return
    }

    const nextIndex = Math.min(safeIndex + 1, segments.length - 1)
    elapsedRef.current = segmentEnd
    if (status === "running") startedAtRef.current = Date.now() - segmentEnd * 1000
    indexRef.current = nextIndex
    setElapsed(segmentEnd)
    setCurrentIndex(nextIndex)
    setRemaining(segments[nextIndex]?.seconds ?? 0)
    hapticRef.current("light")
  }

  const resetWorkout = () => {
    elapsedRef.current = 0
    startedAtRef.current = 0
    indexRef.current = 0
    finishedRef.current = false
    setElapsed(0)
    setCurrentIndex(0)
    setRemaining(segments[0]?.seconds ?? 0)
    setStatus("idle")
    hapticRef.current("light")
    window.setTimeout(() => startButtonRef.current?.focus({ preventScroll: true }), 0)
  }

  const updateConfig = (patch: Partial<HiitConfig>) => {
    if (isActive) return
    setConfig((previous) => ({ ...previous, ...patch }))
    hapticRef.current("light")
  }

  const resetPreferences = () => {
    if (isActive) return
    storageRemove(DRAFT_KEY)
    setConfig(DEFAULT_HIIT_CONFIG)
    setSaveError(false)
    resetWorkout()
    hapticRef.current("medium")
  }

  const statusLabel =
    status === "idle"
      ? "Vista previa"
      : status === "paused"
        ? "Pausado"
        : isDone
          ? "Completada"
          : hiitPhaseLabel(currentSegment)

  const heroTitle =
    status === "idle"
      ? "Tu rutina está lista"
      : isDone
        ? "Rutina completada"
        : currentSegment.type === "rest"
          ? "Recupera"
          : (currentSegment.exercise?.name ?? "En movimiento")

  const heroCue =
    status === "idle"
      ? `Calentamiento de 3 min, ${rounds} ${rounds === 1 ? "ronda" : "rondas"} de 5 ejercicios y vuelta a la calma de 2 min.`
      : isDone
        ? `Hiciste ${workIntervalCount} intervalos de trabajo. Hidrátate y descansa antes de la próxima sesión.`
        : currentSegment.type === "rest"
          ? `Respira y prepárate para ${currentSegment.nextExercise?.name ?? "la vuelta a la calma"}.`
          : (currentSegment.exercise?.cue ?? "")

  const heroBadge =
    status === "idle"
      ? "Vista previa"
      : isDone
        ? "Completada"
        : currentSegment.round
          ? `${hiitPhaseLabel(currentSegment)} · Ronda ${currentSegment.round}/${rounds}`
          : hiitPhaseLabel(currentSegment)

  const nextText =
    status === "idle"
      ? `Empieza con ${segments[0]?.exercise?.name ?? "el calentamiento"}.`
      : isDone
        ? `Duración total: ${formatHiitClock(totalSeconds)} · ${rounds} ${rounds === 1 ? "ronda" : "rondas"}.`
        : nextSegment
          ? nextSegment.type === "rest"
            ? `Descanso ${nextSegment.seconds} s · luego ${nextSegment.nextExercise?.name ?? "vuelta a la calma"}`
            : nextSegment.type === "work"
              ? `Siguiente: ${nextSegment.exercise?.name} · ${nextSegment.seconds} s`
              : nextSegment.type === "cooldown"
                ? "Siguiente: vuelta a la calma"
                : `Siguiente: ${nextSegment.exercise?.name}`
          : "Último intervalo"

  const liveMessage =
    status === "paused"
      ? "Entrenamiento pausado."
      : isDone
        ? `Rutina completada. ${rounds} ${rounds === 1 ? "ronda" : "rondas"} y ${formatHiitDuration(workSeconds)} de trabajo.`
        : currentSegment.type === "rest"
          ? `Descanso. ${currentSegment.seconds} segundos. Siguiente: ${currentSegment.nextExercise?.name ?? "vuelta a la calma"}.`
          : `${hiitPhaseLabel(currentSegment)}. ${currentSegment.exercise?.name ?? ""}. ${currentSegment.seconds} segundos.${
              currentSegment.type === "work" ? ` Ronda ${currentSegment.round} de ${rounds}.` : ""
            }`

  const currentCircuitExercise =
    currentSegment.type === "work"
      ? currentSegment.exercise?.id
      : currentSegment.type === "rest"
        ? currentSegment.nextExercise?.id
        : undefined
  const currentCircuitBadge = currentSegment.type === "rest" ? "Siguiente" : "Ahora"

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section
        aria-labelledby="hiit-setup-title"
        className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2"
      >
        <h2 id="hiit-setup-title" className="text-xl font-bold">
          Arma tu rutina
        </h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Elige nivel, enfoque y tiempo. El calentamiento y la vuelta a la calma ya están incluidos.
        </p>

        <p id="hiit-level-label" className="mb-2 block text-sm font-medium">
          Nivel
        </p>
        <div role="group" aria-labelledby="hiit-level-label" className="grid gap-2 sm:grid-cols-3">
          {HIIT_LEVELS.map((option) => {
            const Icon = LEVEL_ICONS[option.id]
            const selected = config.level === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateConfig({ level: option.id })}
                aria-pressed={selected}
                disabled={isActive}
                data-interactive="true"
                className={cn(
                  "rounded-lg border p-3 text-left transition-[colors,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
                  selected
                    ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-cuerpo-dark hover:bg-black/5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-cuerpo-light dark:hover:bg-white/10",
                  focusRing,
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      selected
                        ? "text-cuerpo-darkest dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{option.label}</span>
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    selected ? "text-gray-800 dark:text-gray-900" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {option.work} s · {option.rest} s
                </span>
              </button>
            )
          })}
        </div>

        <p id="hiit-focus-label" className="mb-2 mt-5 block text-sm font-medium">
          Enfoque
        </p>
        <div role="group" aria-labelledby="hiit-focus-label" className="grid grid-cols-2 gap-2">
          {HIIT_FOCUSES.map((option) => {
            const Icon = FOCUS_ICONS[option.id]
            const selected = config.focus === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateConfig({ focus: option.id })}
                aria-pressed={selected}
                disabled={isActive}
                data-interactive="true"
                className={cn(
                  "rounded-lg border p-3 text-left transition-[colors,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
                  selected
                    ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-cuerpo-dark hover:bg-black/5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-cuerpo-light dark:hover:bg-white/10",
                  focusRing,
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      selected
                        ? "text-cuerpo-darkest dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{option.label}</span>
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs leading-snug",
                    selected ? "text-gray-800 dark:text-gray-900" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>

        <p id="hiit-duration-label" className="mb-2 mt-5 block text-sm font-medium">
          Duración
        </p>
        <div role="group" aria-labelledby="hiit-duration-label" className="grid grid-cols-4 gap-2">
          {HIIT_DURATIONS.map((duration) => {
            const selected = config.duration === duration
            return (
              <button
                key={duration}
                type="button"
                onClick={() => updateConfig({ duration: duration as HiitDuration })}
                aria-pressed={selected}
                aria-label={`${duration} minutos`}
                disabled={isActive}
                data-interactive="true"
                className={cn(
                  "rounded-md px-1 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
                  selected
                    ? "bg-cuerpo text-gray-900 dark:bg-cuerpo-light dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                  focusRing,
                )}
              >
                {duration} min
              </button>
            )
          })}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={config.lowImpact}
          onClick={() => updateConfig({ lowImpact: !config.lowImpact })}
          disabled={isActive}
          data-interactive="true"
          className={cn(
            "mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:border-cuerpo-dark hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-cuerpo-light dark:hover:bg-white/10",
            focusRing,
          )}
        >
          <span>
            <span className="block text-sm font-medium">Modo bajo impacto</span>
            <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
              Cambia saltos por versiones laterales, en silla o con rodillas apoyadas.
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors",
              config.lowImpact ? "bg-cuerpo-dark" : "bg-gray-500 dark:bg-gray-500",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                config.lowImpact ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </span>
        </button>

        <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Tu plan
              </p>
              <p className="mt-0.5 text-lg font-bold">{focus.label}</p>
            </div>
            <span className="rounded-full bg-cuerpo-lighter px-2.5 py-1 text-xs font-medium text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
              {rounds} {rounds === 1 ? "ronda" : "rondas"}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="text-gray-500 dark:text-gray-300">Duración</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">{config.duration} min</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-300">Trabajo / descanso</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                {level.work} s / {level.rest} s
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-300">Circuito</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">5 ejercicios</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-300">Incluye</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">Calentamiento y cierre</dd>
            </div>
          </dl>
          <button
            ref={startButtonRef}
            type="button"
            onClick={startWorkout}
            disabled={isActive}
            data-interactive="true"
            className={cn("mt-4 flex w-full items-center justify-center gap-2", primaryButton, focusRing)}
          >
            {isActive ? <Clock className="h-4 w-4" aria-hidden="true" /> : isDone ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {isActive ? "Rutina en curso" : isDone ? "Repetir rutina" : "Iniciar rutina"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span
            role="status"
            className={cn(
              "text-xs",
              saveError ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400",
            )}
          >
            {saveError ? "No pudimos guardar tus preferencias" : "Se guardan tus preferencias en este navegador"}
          </span>
          <button
            type="button"
            onClick={resetPreferences}
            disabled={isActive}
            data-interactive="true"
            className={cn(
              "inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400",
              focusRing,
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restablecer
          </button>
        </div>
      </section>

      <div className="space-y-4 lg:col-span-3">
        <section
          ref={timerRef}
          aria-labelledby="hiit-timer-title"
          className="scroll-mt-24 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cuerpo-darkest dark:text-cuerpo-light">
                Temporizador
              </p>
              <h2 id="hiit-timer-title" className="text-xl font-bold">
                Tu sesión
              </h2>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                status === "running" || status === "paused"
                  ? "bg-cuerpo-lighter text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900"
                  : isDone
                    ? "bg-green-100 text-green-900 dark:bg-green-900/60 dark:text-green-100"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
              )}
            >
              {statusLabel}
            </span>
          </div>

          {status !== "idle" && (
            <p role="status" aria-live="polite" className="sr-only">
              {liveMessage}
            </p>
          )}

          <div className="mt-4 rounded-2xl border border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark p-5 text-black shadow-sm dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-black dark:bg-white/15 dark:text-white">
                {heroBadge}
              </span>
              <span className="text-xs font-medium text-black dark:text-gray-100">
                {safeIndex + 1} / {segments.length}
              </span>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm font-medium text-black dark:text-gray-100">{displayLabel}</p>
              {isDone ? (
                <div className="mt-1 flex items-center justify-center gap-2">
                  <Check className="h-10 w-10 text-cuerpo-darkest dark:text-white" aria-hidden="true" />
                  <p className="text-5xl font-bold">¡Listo!</p>
                </div>
              ) : (
                <p role="timer" className="text-6xl font-bold tabular-nums sm:text-7xl">
                  <span className="sr-only">
                    {status === "idle" ? "Duración total" : "Tiempo restante"}: {formatHiitClock(displaySeconds)}
                  </span>
                  <span aria-hidden="true">{formatHiitClock(displaySeconds)}</span>
                </p>
              )}
              <h3 className="mt-2 text-2xl font-bold">{heroTitle}</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black dark:text-gray-100">
                {heroCue}
              </p>
              <p className="mt-3 text-xs font-medium text-black dark:text-white">{nextText}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {formatHiitClock(elapsed)} de {formatHiitClock(totalSeconds)}
              </span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Progreso de la rutina"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPct)}
              aria-valuetext={`${formatHiitClock(elapsed)} de ${formatHiitClock(totalSeconds)}`}
              className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <div
                className="h-full rounded-full bg-cuerpo transition-[width] duration-300 dark:bg-cuerpo-light"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {isActive && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                ref={pauseButtonRef}
                type="button"
                onClick={status === "running" ? pauseWorkout : resumeWorkout}
                data-interactive="true"
                className={cn("flex min-w-[8.5rem] flex-1 items-center justify-center gap-2", primaryButton, focusRing)}
              >
                {status === "running" ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
                {status === "running" ? "Pausar" : "Reanudar"}
              </button>
              <button
                type="button"
                onClick={skipSegment}
                data-interactive="true"
                className={cn("flex items-center justify-center gap-2", secondaryButton, focusRing)}
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
                Saltar
              </button>
              <button
                type="button"
                onClick={resetWorkout}
                data-interactive="true"
                className={cn("flex items-center justify-center gap-2", secondaryButton, focusRing)}
              >
                <Square className="h-4 w-4" aria-hidden="true" />
                Detener
              </button>
            </div>
          )}

          {isDone && (
            <>
              <dl className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-cuerpo-lighter p-3 text-center sm:grid-cols-4 dark:bg-cuerpo-dark">
                <div>
                  <dt className="text-[11px] text-gray-700 dark:text-gray-900">Trabajo</dt>
                  <dd className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-900">
                    {formatHiitClock(workSeconds)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-gray-700 dark:text-gray-900">Descanso</dt>
                  <dd className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-900">
                    {formatHiitClock(restSeconds)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-gray-700 dark:text-gray-900">Rondas</dt>
                  <dd className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-900">{rounds}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-gray-700 dark:text-gray-900">Duración</dt>
                  <dd className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-900">
                    {formatHiitClock(totalSeconds)}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  ref={repeatButtonRef}
                  type="button"
                  onClick={startWorkout}
                  data-interactive="true"
                  className={cn("flex min-w-[8.5rem] flex-1 items-center justify-center gap-2", primaryButton, focusRing)}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Repetir rutina
                </button>
                <button
                  type="button"
                  onClick={resetWorkout}
                  data-interactive="true"
                  className={cn("flex items-center justify-center gap-2", secondaryButton, focusRing)}
                >
                  <Timer className="h-4 w-4" aria-hidden="true" />
                  Ver vista previa
                </button>
              </div>
            </>
          )}

          {status === "idle" && (
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Pulsa «Iniciar rutina» en el panel de configuración. El temporizador te guiará intervalo a intervalo.
            </p>
          )}
        </section>

        <section
          aria-labelledby="hiit-circuit-title"
          className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 id="hiit-circuit-title" className="text-xl font-bold">
                Circuito de hoy
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {focus.label} · 5 ejercicios · {rounds} {rounds === 1 ? "ronda" : "rondas"}
              </p>
            </div>
            {config.lowImpact && (
              <span className="rounded-full bg-cuerpo-lighter px-3 py-1 text-xs font-medium text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
                Bajo impacto
              </span>
            )}
          </div>

          <ol className="mt-4 space-y-2">
            {exercises.map((exercise, index) => {
              const isCurrent = currentCircuitExercise === exercise.id
              return (
                <li
                  key={exercise.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    isCurrent
                      ? "border-cuerpo-dark bg-black/5 dark:border-cuerpo-light dark:bg-white/10"
                      : "border-gray-200 dark:border-gray-700",
                  )}
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cuerpo-lighter text-[11px] font-bold text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {exercise.name}
                      {isCurrent && (
                        <span className="rounded-full bg-cuerpo-lighter px-2 py-0.5 text-[10px] font-medium text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
                          {currentCircuitBadge}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-gray-600 dark:text-gray-400">{exercise.cue}</p>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      {level.work} s trabajo · {level.rest} s descanso
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            Repite el circuito {rounds} {rounds === 1 ? "vez" : "veces"}. El temporizador marca trabajo, descanso y
            cambios de ronda.
          </p>
        </section>

        <section aria-labelledby="hiit-guide-title" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 id="hiit-guide-title" className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
            Cómo aprovechar la sesión
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">Calienta y ajusta.</strong> Usa el calentamiento para
              despertar articulaciones; si un ejercicio no te sale, cambia al modo bajo impacto antes de empezar.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Intensidad honesta.</strong> Durante el trabajo
              deberías poder decir una frase corta. Si no puedes, baja el ritmo: la técnica manda más que la prisa.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Descansa entre sesiones.</strong> Deja 48 horas antes
              de repetir los mismos grupos musculares. Dos o tres sesiones por semana son un buen punto de partida.
            </li>
          </ul>
          <p className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            Hidrátate antes, durante y después:{" "}
            <Link
              href="/calculadora-hidratacion"
              data-interactive="true"
              className="font-semibold text-cuerpo-darkest underline underline-offset-2 dark:text-cuerpo-light"
            >
              calcula cuánta agua necesitas
            </Link>
            . Y si quieres completar el día,{" "}
            <Link
              href="/calculadora-proteina-diaria"
              data-interactive="true"
              className="font-semibold text-cuerpo-darkest underline underline-offset-2 dark:text-cuerpo-light"
            >
              ajusta tu proteína
            </Link>
            .
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-cuerpo-lighter p-3 text-xs text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
            <ShieldAlert
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-cuerpo-darkest dark:text-white"
              aria-hidden="true"
            />
            <span>
              Esta rutina es una guía educativa, no una prescripción médica. Para si sientes dolor, mareo, opresión en
              el pecho o falta de aire anormal. Si tienes lesiones, embarazo, hipertensión o una condición
              cardiovascular, consulta antes de empezar.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
