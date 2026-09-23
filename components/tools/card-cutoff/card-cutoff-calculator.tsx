"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, Trash2, Info, CalendarCheck, CalendarClock } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("tarjeta-corte-vencimiento")

interface CardDraft {
  cutoffDay?: string
  dueDay?: string
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function clampDay(year: number, month: number, day: number): Date {
  return new Date(year, month, Math.min(day, daysInMonth(year, month)))
}

function toISODate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

function formatLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function diffDays(fromISO: string, to: Date): number {
  const [y, m, d] = fromISO.split("-").map(Number)
  const from = new Date(y, m - 1, d)
  return Math.round((to.getTime() - from.getTime()) / 86400000)
}

export function CardCutoffCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const todayISO = useMemo(() => toISODate(new Date()), [])
  const [cutoffDay, setCutoffDay] = useState<string>("")
  const [dueDay, setDueDay] = useState<string>("")
  const [purchaseISO, setPurchaseISO] = useState<string>(todayISO)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (Tipo D) solo en cliente
  useEffect(() => {
    const draft = storageGet<CardDraft>(DRAFT_KEY, {})
    if (draft.cutoffDay !== undefined) setCutoffDay(draft.cutoffDay)
    if (draft.dueDay !== undefined) setDueDay(draft.dueDay)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  const firstSave = useRef(true)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { cutoffDay, dueDay })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [cutoffDay, dueDay])

  const result = useMemo(() => {
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)
    if (isNaN(c) || c < 1 || c > 31 || isNaN(p) || p < 1 || p > 31) return null
    const parts = purchaseISO.split("-").map(Number)
    if (parts.length !== 3 || parts.some((n) => isNaN(n))) return null
    const [py, pm1, pd] = parts
    const pm = pm1 - 1

    // Corte al que pertenece la compra
    const thisMonthCutoff = clampDay(py, pm, c)
    const purchase = new Date(py, pm, pd)
    let cutoff = thisMonthCutoff
    if (purchase.getTime() > thisMonthCutoff.getTime()) {
      const next = new Date(py, pm + 1, 1) // rollover de año automático
      cutoff = clampDay(next.getFullYear(), next.getMonth(), c)
    }

    // Vencimiento: día P del mes siguiente al corte
    const due = clampDay(cutoff.getFullYear(), cutoff.getMonth() + 1, p)

    const daysToCutoff = diffDays(purchaseISO, cutoff)
    const graceDays = diffDays(purchaseISO, due)
    // Mejor compra: día siguiente al corte anterior (entra al mismo corte y vence igual)
    const prevCutoff = new Date(cutoff)
    prevCutoff.setMonth(prevCutoff.getMonth() - 1)
    const bestDay = new Date(prevCutoff)
    bestDay.setDate(bestDay.getDate() + 1)
    const bestGrace = Math.round((due.getTime() - bestDay.getTime()) / 86400000)

    return {
      cutoffISO: toISODate(cutoff),
      dueISO: toISODate(due),
      daysToCutoff,
      graceDays,
      bestDayISO: toISODate(bestDay),
      bestGrace,
      isIdeal: daysToCutoff > 0 && diffDays(toISODate(prevCutoff), purchase) <= 3,
    }
  }, [cutoffDay, dueDay, purchaseISO])

  const clearData = () => {
    setCutoffDay("")
    setDueDay("")
    setPurchaseISO(todayISO)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"

  return (
    <div className="space-y-6">
      {/* Entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#388e3c] dark:text-[#81c784] mb-2">Corte y pago de tu tarjeta</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Configura tu tarjeta una vez y consulta cualquier compra: sabrás a qué corte entra y cuándo la pagas.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Día de corte (1-31)</label>
            <input
              type="number"
              min={1}
              max={31}
              inputMode="numeric"
              value={cutoffDay}
              onChange={(e) => setCutoffDay(e.target.value)}
              placeholder="Ej: 15"
              className={inputClass}
              data-interactive="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Día de vencimiento (1-31)</label>
            <input
              type="number"
              min={1}
              max={31}
              inputMode="numeric"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="Ej: 5"
              className={inputClass}
              data-interactive="true"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Fecha de la compra</label>
          <input
            type="date"
            value={purchaseISO}
            onChange={(e) => setPurchaseISO(e.target.value)}
            className={inputClass}
            data-interactive="true"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Tu tarjeta se guarda solo en tu navegador"}
          </span>
          <button
            onClick={clearData}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
            data-interactive="true"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Borrar mis datos
          </button>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="h-12 w-12 text-[#388e3c] dark:text-[#81c784]" />
          </div>

          {result.isIdeal && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-200 text-center font-medium">
              Compra ideal: entras justo al inicio del ciclo y aprovechas el máximo de días gratis.
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarClock className="h-4 w-4 text-[#388e3c] dark:text-[#81c784]" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Corte que te toca {result.daysToCutoff === 0 ? "(hoy)" : `(en ${result.daysToCutoff} días)`}
                </span>
              </div>
              <div className="font-bold capitalize">{formatLong(result.cutoffISO)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck className="h-4 w-4 text-[#388e3c] dark:text-[#81c784]" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fecha límite de pago</span>
              </div>
              <div className="font-bold capitalize">{formatLong(result.dueISO)}</div>
            </div>
          </div>

          <div
            className="mt-4 rounded-xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
          >
            <div className="text-sm opacity-90 mb-1">Días de financiamiento gratis para esta compra</div>
            <div className="text-3xl font-bold">{result.graceDays} días</div>
            <div className="text-sm opacity-90 mt-2 capitalize">
              Comprando el {formatLong(result.bestDayISO)} tendrías hasta {result.bestGrace} días.
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-4">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
            <span>
              Cálculo estándar: el vencimiento es el día {dueDay || "P"} del mes siguiente al corte. Si tu banco usa
              días de gracia fijos en vez de día de pago, cuéntanos y lo ajustamos. Estimación educativa, verifica
              con tu estado de cuenta. Todo se guarda solo en tu navegador.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
