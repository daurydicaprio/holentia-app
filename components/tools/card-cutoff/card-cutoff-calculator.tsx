"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, Trash2, Info, ShoppingBag, Scissors, Wallet, BellRing, Bell } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("tarjeta-corte-vencimiento")

interface CardDraft {
  cutoffDay?: string
  dueDay?: string
  purchases?: string[]
}

interface Cycle {
  purchase: Date
  cutoff: Date
  due: Date
  suggestedPay: Date
  daysToCutoff: number
  graceDays: number
}

/** Ciclo al que pertenece una compra: corte, vencimiento y pago sugerido. */
function computeCycle(purchaseISO: string, c: number, p: number): Cycle | null {
  const purchase = parseISO(purchaseISO)
  if (!purchase) return null

  const thisMonthCutoff = clampDay(purchase.getFullYear(), purchase.getMonth(), c)
  let cutoff = thisMonthCutoff
  if (purchase.getTime() > thisMonthCutoff.getTime()) {
    const next = new Date(purchase.getFullYear(), purchase.getMonth() + 1, 1)
    cutoff = clampDay(next.getFullYear(), next.getMonth(), c)
  }

  // Vencimiento: día P del mes siguiente al corte
  const due = clampDay(cutoff.getFullYear(), cutoff.getMonth() + 1, p)

  // Pago sugerido: 3 días antes del vencimiento
  const suggestedPay = new Date(due)
  suggestedPay.setDate(suggestedPay.getDate() - 3)

  return {
    purchase,
    cutoff,
    due,
    suggestedPay,
    daysToCutoff: diffDays(purchase, cutoff),
    graceDays: diffDays(purchase, due),
  }
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

function formatShort(d: Date): string {
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function diffDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86400000)
}

interface WhySectionData {
  cutoff: Date
  due: Date
  suggestedPay: Date
  bestDay: Date
  daysToCutoff: number
  graceDays: number
  bestGrace: number
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, d.getDate())
}

/** Fila del ciclo: periodo de compras + periodo de pago, con fechas reales. */
function CycleRow({
  tag,
  buyDays,
  payDays,
  cutDate,
  dueDate,
}: {
  tag: string
  buyDays: number
  payDays: number
  cutDate: Date
  dueDate: Date
}) {
  const total = Math.max(buyDays + payDays, 1)
  const pctBuy = (buyDays / total) * 100
  return (
    <div>
      <div className="flex justify-between items-end text-[11px] font-bold mb-1 gap-2">
        <span className="leading-tight">
          Fecha de corte
          <span className="block font-medium capitalize text-gray-500 dark:text-gray-400">
            {formatShort(cutDate)}
          </span>
          <span className="inline-block text-[#388e3c] text-sm leading-none">↓</span>
        </span>
        <span className="text-right leading-tight">
          Fecha límite de pago
          <span className="block font-medium capitalize text-gray-500 dark:text-gray-400">
            {formatShort(dueDate)}
          </span>
          <span className="inline-block text-[#388e3c] text-sm leading-none">↓</span>
        </span>
      </div>
      <div className="relative flex h-12 rounded-xl overflow-hidden text-center">
        <div
          className="h-full flex flex-col items-center justify-center bg-[#388e3c]/15 dark:bg-[#388e3c]/25 text-[#1b5e20] dark:text-[#a5d6a7]"
          style={{ width: `${pctBuy}%` }}
        >
          <span className="text-sm font-bold leading-none">{buyDays} DÍAS</span>
          <span className="text-[10px] leading-tight opacity-80">Periodo de compras</span>
        </div>
        <div className="w-0 border-l-2 border-dashed border-[#388e3c]" />
        <div
          className="h-full flex flex-col items-center justify-center bg-amber-200 dark:bg-amber-400/80 text-amber-900"
          style={{ width: `${100 - pctBuy}%` }}
        >
          <span className="text-sm font-bold leading-none">{payDays} DÍAS</span>
          <span className="text-[10px] leading-tight opacity-80">Periodo de pago</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tag}</div>
    </div>
  )
}

/** Tarjeta aparte: explicación, ciclo y pago. */
function WhySection({ result, dueDay }: { result: WhySectionData; dueDay: string }) {
  const nextCutoff = addMonths(result.cutoff, 1)
  const nextDue = addMonths(result.due, 1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
      <h2 className="text-xl font-bold mb-1">El ciclo de tu tarjeta</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        Cada mes se repite lo mismo: un periodo para comprar y un periodo para pagar.
      </p>

      {/* No esperes al último día */}
      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-8">
        <strong>Puedes pagar el último día sin problema</strong>, pero te sugerimos pagar{" "}
        <strong>2 o 3 días antes</strong>: un fin de semana, un feriado o un atraso del banco te puede generar mora.
        Marca el <strong className="capitalize">{formatLong(result.suggestedPay)}</strong> en tu calendario.
      </div>

      {/* Este ciclo */}
      <CycleRow
        tag="Este ciclo"
        buyDays={result.daysToCutoff}
        payDays={result.graceDays - result.daysToCutoff}
        cutDate={result.cutoff}
        dueDate={result.due}
      />

      {/* Próximo ciclo */}
      <div className="mt-6">
        <CycleRow
          tag="Próximo ciclo · se repite todos los meses"
          buyDays={diffDays(result.cutoff, nextCutoff)}
          payDays={diffDays(nextCutoff, nextDue)}
          cutDate={nextCutoff}
          dueDate={nextDue}
        />
      </div>

      {/* La regla, sencilla */}
      <p className="mt-8 leading-relaxed text-center">
        Todo lo que compres entre el <strong className="capitalize">{formatLong(result.bestDay)}</strong> y el{" "}
        <strong className="capitalize">{formatLong(result.cutoff)}</strong> lo pagas en la misma fecha límite.
      </p>

      {/* Tu pago, en grande y aparte */}
      <div className="mt-4 rounded-xl p-7 sm:p-8 text-white text-center bg-[#1b5e20] dark:bg-[#144a19] shadow-lg">
        <div className="text-xs uppercase tracking-widest opacity-80">
          Rango de corte: <span className="capitalize">{formatShort(result.bestDay)}</span> →{" "}
          <span className="capitalize">{formatShort(result.cutoff)}</span>
        </div>
        <div className="text-sm opacity-90 mt-4 mb-1">Te toca pagar el</div>
        <div className="text-3xl sm:text-4xl font-bold capitalize leading-tight">{formatLong(result.due)}</div>
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-6">
        <Bell className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
        <span>
          Para no olvidarlo: pon un recordatorio en tu teléfono o calendario, o apunta la fecha en un lugar visible
          de la casa.
        </span>
      </div>

      <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400 mt-5 leading-relaxed">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
        <span>
          Vence el día {dueDay} del mes siguiente al corte. Estimación educativa, todo queda en tu navegador.
        </span>
      </div>
    </div>
  )
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

    // Si la fecha ingresada ya pasó, el ciclo vigente es el de hoy,
    // no el de esa fecha vieja.
    const isPast = purchaseISO < todayISO
    const cycle = computeCycle(isPast ? todayISO : purchaseISO, c, p)
    if (!cycle) return null
    const pastCycle = isPast ? computeCycle(purchaseISO, c, p) : null

    // Mejor compra: día siguiente al corte anterior
    const prevCutoff = new Date(cycle.cutoff)
    prevCutoff.setMonth(prevCutoff.getMonth() - 1)
    const bestDay = new Date(prevCutoff)
    bestDay.setDate(bestDay.getDate() + 1)

    return {
      ...cycle,
      isPast,
      pastCycle,
      bestDay,
      bestGrace: Math.round((cycle.due.getTime() - bestDay.getTime()) / 86400000),
      bankDays: diffDays(cycle.cutoff, cycle.due),
    }
  }, [configured, cutoffDay, dueDay, purchaseISO, todayISO])

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
        {
          icon: Scissors,
          label: "Corte",
          date: result.cutoff,
          note:
            result.daysToCutoff === 0
              ? "¡hoy mismo!"
              : result.daysToCutoff <= 7
                ? `en ${result.daysToCutoff} días (este mes)`
                : `en ${result.daysToCutoff} días (próximo)`,
        },
        { icon: BellRing, label: "Paga (sugerido)", date: result.suggestedPay, note: "3 días antes" },
        { icon: Wallet, label: "Vence", date: result.due, note: `${result.graceDays} días gratis` },
      ]
    : []

  return (
    <>
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
            {/* Héroe primero: días gratis */}
            <div
              className="rounded-xl p-8 text-white mb-8"
              style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
            >
              <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Financiamiento gratis</div>
              <div className="text-6xl font-bold tabular-nums">{result.graceDays} días</div>
            </div>

            {result.isPast && result.pastCycle && (
              <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Esa compra del <strong className="capitalize">{formatLong(result.pastCycle.purchase)}</strong> ya entró
                al corte del <strong className="capitalize">{formatLong(result.pastCycle.cutoff)}</strong> y se paga
                el <strong className="capitalize">{formatLong(result.pastCycle.due)}</strong>. Abajo ves tu ciclo
                vigente a hoy:
              </div>
            )}
            <p className="text-base leading-relaxed mb-8 text-gray-700 dark:text-gray-200">
              Tu tarjeta corta el <strong className="capitalize">{formatLong(result.cutoff)}</strong>
              {result.daysToCutoff === 0 ? (
                <>, <strong>¡justo hoy!</strong> Esta compra entra al corte de hoy</>
              ) : result.daysToCutoff <= 7 ? (
                <>, que es <strong>en {result.daysToCutoff} días (este mes)</strong>. Esta compra todavía lo alcanza</>
              ) : (
                <>, que es <strong>en {result.daysToCutoff} días (el próximo corte)</strong>. Por eso tienes tantos
                días gratis</>
              )}{" "}
              y tienes hasta el <strong className="capitalize">{formatLong(result.due)}</strong> para pagar, pero te
              sugerimos encarecidamente pagar <strong>2 o 3 días antes</strong>, o sea el{" "}
              <strong className="text-[#388e3c] dark:text-[#81c784] capitalize">
                {formatLong(result.suggestedPay)}
              </strong>
              .
            </p>

            {/* Timeline: conectores solo entre iconos */}
            <div className="mb-10 mt-2 space-y-5">
              {steps.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center w-12 flex-shrink-0">
                    {i === 0 ? (
                      <div className="h-2" />
                    ) : (
                      <div className="flex-1 min-h-[22px] w-0.5 bg-[#388e3c]/25 dark:bg-[#388e3c]/40" />
                    )}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
                        i === steps.length - 1
                          ? "text-white"
                          : "bg-[#388e3c]/10 dark:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784]"
                      }`}
                      style={i === steps.length - 1 ? { background: "linear-gradient(135deg, #2e7d32, #1b5e20)" } : undefined}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    {i === steps.length - 1 ? (
                      <div className="h-2" />
                    ) : (
                      <div className="flex-1 min-h-[22px] w-0.5 bg-[#388e3c]/25 dark:bg-[#388e3c]/40" />
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700/40 rounded-xl px-5 py-4 my-2 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {step.label}
                    </div>
                    <div className="font-bold text-lg capitalize leading-snug">{formatLong(step.date)}</div>
                    <div className="text-sm text-[#388e3c] dark:text-[#81c784] font-medium mt-2">{step.note}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>

    {result && (
      <div className="mt-6">
        <WhySection result={result} dueDay={dueDay} />
      </div>
    )}
    </>
  )
}
