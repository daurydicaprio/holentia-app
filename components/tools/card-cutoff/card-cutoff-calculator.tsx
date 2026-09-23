"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, Trash2, Info, ShoppingBag, Scissors, Wallet, BellRing, Bell } from "lucide-react"
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

function parseISO(iso: string): Date | null {
  const parts = iso.split("-").map(Number)
  if (parts.length !== 3 || parts.some((n) => isNaN(n))) return null
  return new Date(parts[0], parts[1] - 1, parts[2])
}

function formatLong(d: Date): string {
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
}

function diffDays(from: Date, to: Date): number {
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

  const configured = useMemo(() => {
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)
    return !isNaN(c) && c >= 1 && c <= 31 && !isNaN(p) && p >= 1 && p <= 31
  }, [cutoffDay, dueDay])

  const result = useMemo(() => {
    if (!configured) return null
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)
    const purchase = parseISO(purchaseISO)
    if (!purchase) return null

    // Corte al que pertenece la compra
    const thisMonthCutoff = clampDay(purchase.getFullYear(), purchase.getMonth(), c)
    let cutoff = thisMonthCutoff
    if (purchase.getTime() > thisMonthCutoff.getTime()) {
      const next = new Date(purchase.getFullYear(), purchase.getMonth() + 1, 1)
      cutoff = clampDay(next.getFullYear(), next.getMonth(), c)
    }

    // Vencimiento: día P del mes siguiente al corte
    const due = clampDay(cutoff.getFullYear(), cutoff.getMonth() + 1, p)

    // Mejor compra: día siguiente al corte anterior
    const prevCutoff = new Date(cutoff)
    prevCutoff.setMonth(prevCutoff.getMonth() - 1)
    const bestDay = new Date(prevCutoff)
    bestDay.setDate(bestDay.getDate() + 1)

    // Pago sugerido: 3 días antes del vencimiento
    const suggestedPay = new Date(due)
    suggestedPay.setDate(suggestedPay.getDate() - 3)

    return {
      purchase,
      cutoff,
      due,
      bestDay,
      suggestedPay,
      daysToCutoff: diffDays(purchase, cutoff),
      graceDays: diffDays(purchase, due),
      bestGrace: Math.round((due.getTime() - bestDay.getTime()) / 86400000),
      isIdeal: diffDays(purchase, cutoff) > 0 && diffDays(prevCutoff, purchase) <= 3,
    }
  }, [configured, cutoffDay, dueDay, purchaseISO])

  const setQuickDate = (offsetDays: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    setPurchaseISO(toISODate(d))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setCutoffDay("")
    setDueDay("")
    setPurchaseISO(todayISO)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"

  const steps = result
    ? [
        { icon: ShoppingBag, label: "Compras", date: result.purchase, note: "tu compra" },
        { icon: Scissors, label: "Corte", date: result.cutoff, note: result.daysToCutoff === 0 ? "hoy" : `en ${result.daysToCutoff} días` },
        { icon: BellRing, label: "Paga (sugerido)", date: result.suggestedPay, note: "3 días antes" },
        { icon: Wallet, label: "Vence", date: result.due, note: `${result.graceDays} días gratis` },
      ]
    : []

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Columna izquierda: tu tarjeta + fecha */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-fit">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#388e3c]/10 dark:bg-[#388e3c]/20">
            <CreditCard className="h-6 w-6 text-[#388e3c] dark:text-[#81c784]" />
          </div>
          <h2 className="text-xl font-bold">Tu tarjeta</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Configúrala una vez, consúltala siempre.</p>

        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium mb-2">¿Cuándo compras?</label>
            <input
              type="date"
              value={purchaseISO}
              onChange={(e) => setPurchaseISO(e.target.value)}
              className={inputClass}
              data-interactive="true"
            />
            <div className="mt-3">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Atajos de fecha</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Hoy", offset: 0 },
                  { label: "Mañana", offset: 1 },
                  { label: "En 15 días", offset: 15 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setQuickDate(chip.offset)}
                    className="px-3 py-1.5 text-sm rounded-md bg-[#388e3c]/10 hover:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784] font-medium transition-colors"
                    data-interactive="true"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Se guarda en tu navegador"}
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

      {/* Columna derecha: la historia de tu compra */}
      <div className="lg:col-span-3">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Escribe tu día de corte y vencimiento</p>
            <p className="text-sm mt-1">y te cuento cuándo pagarías cada compra.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
            <p className="text-base leading-relaxed mb-8 text-gray-700 dark:text-gray-200">
              Si compras el <strong className="capitalize">{formatLong(result.purchase)}</strong>, entras al corte
              del <strong className="capitalize">{formatLong(result.cutoff)}</strong> y pagas el{" "}
              <strong className="text-[#388e3c] dark:text-[#81c784] capitalize">{formatLong(result.due)}</strong>.
            </p>

            {/* Timeline */}
            <div className="relative pl-16 space-y-10 mb-10 mt-2">
              <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-[#388e3c]/25 dark:bg-[#388e3c]/40" />
              {steps.map((step, i) => (
                <div key={step.label} className="relative">
                  <div
                    className={`absolute -left-16 w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      i === steps.length - 1
                        ? "text-white"
                        : "bg-[#388e3c]/10 dark:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784]"
                    }`}
                    style={i === steps.length - 1 ? { background: "linear-gradient(135deg, #2e7d32, #1b5e20)" } : undefined}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl px-5 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {step.label}
                    </div>
                    <div className="font-bold text-lg capitalize leading-snug">{formatLong(step.date)}</div>
                    <div className="text-sm text-[#388e3c] dark:text-[#81c784] font-medium mt-2">{step.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Héroe: días gratis */}
            <div
              className="rounded-xl p-6 sm:p-7 text-white flex items-center justify-between gap-6 flex-wrap"
              style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
            >
              <div>
                <div className="text-sm opacity-90">Financiamiento gratis</div>
                <div className="text-4xl font-bold">{result.graceDays} días</div>
              </div>
              <div className="text-sm opacity-90 max-w-[220px]">
                Comprando el <span className="capitalize font-semibold">{formatLong(result.bestDay)}</span> tendrías
                hasta {result.bestGrace} días.
              </div>
            </div>

            {/* No esperes al último día */}
            <div className="mt-5 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>Puedes pagar el último día sin problema</strong>, pero te sugerimos pagar{" "}
              <strong>2 o 3 días antes</strong>: un fin de semana, un feriado o un atraso del banco te puede generar
              mora. Marca el <strong className="capitalize">{formatLong(result.suggestedPay)}</strong> en tu
              calendario.
            </div>

            {/* Gráfico: de dónde salen tus días */}
            <div className="mt-6">
              <h3 className="font-bold mb-1">¿Por qué tienes hasta {result.bestGrace} días?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tus días gratis son la suma de dos tramos: de la compra al corte, más del corte al vencimiento.
              </p>
              {(() => {
                const total = Math.max(result.graceDays, 1)
                const pctA = Math.min(100, Math.max(0, (result.daysToCutoff / total) * 100))
                const pctSug = Math.min(100, Math.max(0, ((result.graceDays - 3) / total) * 100))
                return (
                  <div>
                    <div className="relative h-3 rounded-full overflow-visible flex">
                      <div className="h-full rounded-l-full bg-[#81c784]" style={{ width: `${pctA}%` }} />
                      <div className="h-full rounded-r-full bg-[#1b5e20]" style={{ width: `${100 - pctA}%` }} />
                      {[
                        { left: 0, label: "Compra" },
                        { left: pctA, label: "Corte" },
                        { left: pctSug, label: "Sugerido" },
                        { left: 100, label: "Vence" },
                      ].map((dot) => (
                        <div
                          key={dot.label}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-[3px] border-[#388e3c]"
                          style={{ left: `${dot.left}%` }}
                          title={dot.label}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>
                        Compra → corte: <strong>{result.daysToCutoff} días</strong>
                      </span>
                      <span>
                        Corte → pago: <strong>{result.graceDays - result.daysToCutoff} días</strong>
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{formatLong(result.purchase)}</span>
                      <span className="capitalize">{formatLong(result.due)}</span>
                    </div>
                  </div>
                )
              })()}
              <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-4">
                <Bell className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
                <span>
                  Comprando justo después de un corte puedes llegar hasta {result.bestGrace} días. Para no olvidarlo:
                  pon un recordatorio en tu teléfono o calendario, o apunta la fecha en un lugar visible de la casa.
                </span>
              </div>
            </div>

            {result.isIdeal && (
              <div className="mt-5 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-200 text-center font-medium">
                Compra ideal: entras justo al inicio del ciclo.
              </div>
            )}

            <div className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
              <span>
                Vence el día {dueDay} del mes siguiente al corte. Si tu banco usa días de gracia fijos, verifícalo en
                tu estado de cuenta. Estimación educativa, todo queda en tu navegador.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
