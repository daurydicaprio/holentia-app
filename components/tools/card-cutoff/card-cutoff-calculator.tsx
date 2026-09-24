"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, Trash2, Info, ShoppingBag, Scissors, Wallet, BellRing, Lightbulb } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("tarjeta-corte-vencimiento")

interface CardDraft {
  cardName?: string
  cardLast4?: string
  cutoffDay?: string
  dueDay?: string
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
  purchase: Date
  cutoff: Date
  due: Date
  suggestedPay: Date
  daysToCutoff: number
  graceDays: number
}

/** Tarjeta aparte: un solo ciclo elegante y fluido. */
function WhySection({
  result,
  cutoffDay,
  dueDay,
  cycleBadge,
  isPast,
}: {
  result: WhySectionData
  cutoffDay: string
  dueDay: string
  cycleBadge: { extra: number } | null
  isPast: boolean
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const domStart = result.purchase < today ? result.purchase : today
  const domEnd = result.due > today ? result.due : today
  const span = Math.max(domEnd.getTime() - domStart.getTime(), 1)
  const pos = (d: Date) => Math.min(100, Math.max(0, ((d.getTime() - domStart.getTime()) / span) * 100))
  const pctBuy = pos(result.purchase)
  const pctCut = pos(result.cutoff)
  const pctSug = pos(result.suggestedPay)
  const pctDue = pos(result.due)
  const pctToday = pos(today)
  const sameDay = result.daysToCutoff === 0
  const sugRight = pctSug > 72
  const daysToDue = Math.round((result.due.getTime() - today.getTime()) / 86400000)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
      <h2 className="text-xl font-bold mb-1">El ciclo de tu tarjeta</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Cada mes se repite lo mismo: un periodo para comprar y un periodo para pagar.
      </p>

      {/* Recuadro educativo: cómo funciona el corte */}
      <div className="mb-6 rounded-xl bg-sky-50 dark:bg-sky-900/15 border border-sky-200 dark:border-sky-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
          <h3 className="font-bold text-sm text-sky-900 dark:text-sky-200">¿Cómo funciona el corte?</h3>
        </div>
        <p className="text-sm text-sky-900/90 dark:text-sky-100/90 leading-relaxed">
          Todo lo que consumes entre un corte y el siguiente — supermercado, gasolina, internet, lo que sea — entra
          al mismo grupo y <strong>salta junto al próximo mes</strong>: se suma en el nuevo corte y se paga en su
          fecha límite. Por eso comprar justo después del corte te da más días gratis.
        </p>
      </div>

      {/* Contexto: ciclo anterior */}
      {isPast && (
        <div className="mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
          <Info className="h-4 w-4 mt-0 flex-shrink-0" />
          <span>
            Viendo el ciclo de tu compra del <strong className="capitalize">{formatShort(result.purchase)}</strong>:
            cortó el <strong className="capitalize">{formatShort(result.cutoff)}</strong> y vence el{" "}
            <strong className="capitalize">{formatShort(result.due)}</strong>.
          </span>
        </div>
      )}

      {/* Alerta: fecha sugerida */}
      <div className="flex items-center gap-3 p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 leading-relaxed mb-8">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-bold text-lg flex-shrink-0">
          !
        </span>
        <p className="text-sm">
          Paga el <strong>{formatLong(result.suggestedPay)}</strong>: 2 o 3 días antes del vencimiento para evitar
          moras por feriados o atrasos del banco.
        </p>
      </div>

      {/* Badge de salto de ciclo */}
      {cycleBadge && (
        <div className="flex justify-center mb-8">
          <span className="px-5 py-2 rounded-full bg-[#22c55e] text-white font-bold text-sm sm:text-base whitespace-nowrap shadow-md">
            ¡Ciclo del mes siguiente! Ganaste {cycleBadge.extra} días gratis
          </span>
        </div>
      )}

      {/* Hitos sobre la línea */}
      <div className="relative h-12">
        <div
          className={`absolute top-0 whitespace-nowrap text-[11px] leading-tight ${
            pctBuy <= 12 ? "left-0 text-left" : pctBuy >= 88 ? "right-0 text-right" : "-translate-x-1/2 text-center"
          }`}
          style={pctBuy > 12 && pctBuy < 88 ? { left: `${pctBuy}%` } : undefined}
        >
          <div className="inline-block px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 font-bold">
            Tu compra: <span className="capitalize">{formatShort(result.purchase)}</span>
          </div>
        </div>
        {!sameDay && (
          <div
            className="absolute top-0 -translate-x-1/2 text-center whitespace-nowrap text-[11px] leading-tight"
            style={{ left: `${pctCut}%` }}
          >
            <div className="font-bold">Corte</div>
            <div className="capitalize text-gray-500 dark:text-gray-400">{formatShort(result.cutoff)}</div>
          </div>
        )}
        <div
          className={`absolute top-0 whitespace-nowrap text-[11px] leading-tight ${
            pctDue >= 88 ? "right-0 text-right" : "-translate-x-1/2 text-center"
          }`}
          style={pctDue < 88 ? { left: `${pctDue}%` } : undefined}
        >
          <div className="font-bold">Vence</div>
          <div className="capitalize text-gray-500 dark:text-gray-400">{formatShort(result.due)}</div>
        </div>
      </div>

      {/* Barra delgada en 2 fases, dominio incluye el hoy */}
      <div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-600">
        <div
          className="absolute h-full bg-[#388e3c]"
          style={{ left: `${pctBuy}%`, width: `${Math.max(pctCut - pctBuy, 0)}%` }}
        />
        <div
          className="absolute h-full bg-slate-500 dark:bg-slate-400"
          style={{ left: `${pctCut}%`, width: `${Math.max(pctDue - pctCut, 0)}%` }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-[3px] border-amber-700" style={{ left: `${pctBuy}%` }} />
        {!sameDay && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-[3px] border-[#388e3c]"
            style={{ left: `${pctCut}%` }}
          />
        )}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-[3px] border-slate-500" style={{ left: `${pctDue}%` }} />
        {/* Nodo físico del pago sugerido sobre la barra */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1b5e20] border-[3px] border-white dark:border-gray-800 shadow"
          style={{ left: `${pctSug}%` }}
          title={`Pago sugerido: ${formatShort(result.suggestedPay)}`}
        />
        {/* Hoy en tiempo real, parpadeante */}
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-4 w-4" style={{ left: `${pctToday}%` }}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-[3px] border-white dark:border-gray-800" />
        </span>
      </div>

      {/* Pago sugerido: stem y badge centrados exacto sobre el nodo */}
      <div className="relative h-16">
        <div className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${pctSug}%` }}>
          <div className="w-1 h-6 bg-[#1b5e20] dark:bg-[#81c784]" />
          <span className="px-3 py-1 rounded-full bg-[#1b5e20] text-white text-[11px] font-bold whitespace-nowrap shadow">
            Sugerido: <span className="capitalize">{formatShort(result.suggestedPay)}</span>
          </span>
        </div>
      </div>

      {/* Hoy en tiempo real */}
      <p className="text-xs text-gray-600 dark:text-gray-300 mt-5 text-center">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500 mr-1 align-middle" />
        Hoy {formatShort(today)}:{" "}
        {daysToDue > 0 ? (
          <>faltan <strong>{daysToDue} días</strong> para el vencimiento.</>
        ) : daysToDue === 0 ? (
          <>el vencimiento es <strong>hoy</strong>.</>
        ) : (
          <>ese ciclo venció hace <strong>{Math.abs(daysToDue)} días</strong>.</>
        )}
      </p>

      {/* Tramos */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl bg-[#388e3c]/10 dark:bg-[#388e3c]/20 px-4 py-3 text-center">
          <div className="text-xl font-bold text-[#1b5e20] dark:text-[#a5d6a7] tabular-nums">
            {result.daysToCutoff} días
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">para comprar</div>
        </div>
        <div className="rounded-xl bg-slate-500/15 dark:bg-slate-400/10 px-4 py-3 text-center">
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tabular-nums">
            {result.graceDays - result.daysToCutoff} días
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">para pagar</div>
        </div>
      </div>

      {/* Pie útil */}
      <div className="flex items-start justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-6 leading-relaxed text-center">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
        <span className="max-w-md">
          Esto es una estimación con tu día de corte ({cutoffDay || "—"}) y de pago ({dueDay || "—"}). Cada banco
          tiene sus reglas y feriados: confirma las fechas exactas en tu estado de cuenta o la app de tu banco antes
          de pagar. Tus datos no salen de este navegador.
        </span>
      </div>
    </div>
  )
}

export function CardCutoffCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const todayISO = useMemo(() => toISODate(new Date()), [])
  const [cardName, setCardName] = useState<string>("Mi tarjeta")
  const [cardLast4, setCardLast4] = useState<string>("0007")
  const [cutoffDay, setCutoffDay] = useState<string>("")
  const [dueDay, setDueDay] = useState<string>("")
  const [purchaseISO, setPurchaseISO] = useState<string>(todayISO)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (Tipo D) solo en cliente
  useEffect(() => {
    const draft = storageGet<CardDraft>(DRAFT_KEY, {})
    if (draft.cardName !== undefined) setCardName(draft.cardName)
    if (draft.cardLast4 !== undefined) setCardLast4(draft.cardLast4)
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
      if (storageSet(DRAFT_KEY, { cardName, cardLast4, cutoffDay, dueDay })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [cardName, cardLast4, cutoffDay, dueDay])

  const configured = useMemo(() => {
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)
    return !isNaN(c) && c >= 1 && c <= 31 && !isNaN(p) && p >= 1 && p <= 31
  }, [cutoffDay, dueDay])

  const result = useMemo(() => {
    if (!configured) return null
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)

    // El ciclo siempre se calcula desde la fecha ingresada,
    // aunque ya haya pasado: son sus días gratis reales.
    const isPast = purchaseISO < todayISO
    const cycle = computeCycle(purchaseISO, c, p)
    if (!cycle) return null
    const today = parseISO(todayISO) ?? new Date()

    return {
      ...cycle,
      isPast,
      // Posición del corte y del vencimiento respecto a hoy
      cutoffFromToday: diffDays(today, cycle.cutoff),
      dueFromToday: diffDays(today, cycle.due),
    }
  }, [configured, cutoffDay, dueDay, purchaseISO, todayISO])

  // Badge de salto de ciclo: si la compra cae en un corte posterior al vigente hoy.
  const cycleBadge = useMemo(() => {
    if (!configured || !result) return null
    const c = Number.parseInt(cutoffDay, 10)
    const p = Number.parseInt(dueDay, 10)
    const todayC = computeCycle(todayISO, c, p)
    if (!todayC) return null
    if (result.cutoff.getTime() > todayC.cutoff.getTime()) {
      const extra = result.graceDays - todayC.graceDays
      if (extra > 0) return { extra }
    }
    return null
  }, [configured, cutoffDay, dueDay, todayISO, result])

  const setQuickDate = (offsetDays: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    setPurchaseISO(toISODate(d))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setCardName("Mi tarjeta")
    setCardLast4("0007")
    setCutoffDay("")
    setDueDay("")
    setPurchaseISO(todayISO)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const cardLabel = `${cardName || "Mi tarjeta"} •• ${cardLast4 || "••••"}`

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
            result.cutoffFromToday === 0
              ? "¡hoy mismo!"
              : result.cutoffFromToday < 0
                ? `hace ${Math.abs(result.cutoffFromToday)} días (ya pasó)`
                : result.cutoffFromToday <= 7
                  ? `en ${result.cutoffFromToday} días (este mes)`
                  : `en ${result.cutoffFromToday} días (próximo)`,
        },
        { icon: BellRing, label: "Paga (sugerido)", date: result.suggestedPay, note: "3 días antes" },
        {
          icon: Wallet,
          label: "Vence",
          date: result.due,
          note:
            result.dueFromToday < 0
              ? `venció hace ${Math.abs(result.dueFromToday)} días`
              : result.dueFromToday === 0
                ? "¡vence hoy!"
                : `${result.graceDays} días gratis`,
        },
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Configúrala una vez, consúltala siempre.</p>
        <p className="text-xs font-semibold text-[#388e3c] dark:text-[#81c784] mb-6">{cardLabel}</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Mi tarjeta"
                maxLength={24}
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-2">Terminación (opcional)</label>
              <input
                type="text"
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0007"
                inputMode="numeric"
                className={inputClass}
                data-interactive="true"
              />
            </div>
          </div>
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
            <div className="flex gap-2 flex-wrap mt-3">
              {[
                { label: "En 5 días", offset: 5 },
                { label: "En 10 días", offset: 10 },
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
            {/* Héroe: días gratis reales de esta compra */}
            <div
              className="rounded-xl p-8 text-white mb-8 text-center"
              style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-3">{cardLabel}</div>
              <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Financiamiento gratis</div>
              <div className="text-6xl font-bold tabular-nums">{result.graceDays} días</div>
            </div>
            <div className="mb-8 text-gray-700 dark:text-gray-200 space-y-3">
              <p className="text-base leading-relaxed">
                Tu tarjeta corta el <strong>{formatLong(result.cutoff)}</strong>
                {result.cutoffFromToday === 0 ? (
                  <> — <strong>¡justo hoy!</strong> Esta compra entra al corte de hoy.</>
                ) : result.cutoffFromToday < 0 ? (
                  <> — hace <strong>{Math.abs(result.cutoffFromToday)} días (ya pasó)</strong>. Esta compra ya entró
                  a ese corte.</>
                ) : result.cutoffFromToday <= 7 ? (
                  <> — en <strong>{result.cutoffFromToday} días</strong>. Esta compra todavía lo alcanza.</>
                ) : (
                  <> — en <strong>{result.cutoffFromToday} días (el próximo corte)</strong>. Por eso tienes más días
                  gratis.</>
                )}
              </p>
              <p className="text-base leading-relaxed">
                {result.dueFromToday < 0 ? (
                  <>Ese ciclo <strong>venció el {formatLong(result.due)}</strong>.</>
                ) : (
                  <>
                    Tienes hasta el <strong>{formatLong(result.due)}</strong> para pagar. Te sugerimos pagar 2 o 3
                    días antes, o sea el{" "}
                    <strong className="text-[#388e3c] dark:text-[#81c784]">
                      {formatLong(result.suggestedPay)}
                    </strong>
                    .
                  </>
                )}
              </p>
            </div>

            {/* Timeline: línea continua, iconos opacos centrados, hover animado */}
            <div className="mb-10 mt-2">
              {steps.map((step, i) => (
                <div key={step.label} className={`flex gap-4 relative group ${i < steps.length - 1 ? "pb-5" : ""}`}>
                  {i > 0 && (
                    <div
                      className="absolute left-[22px] top-0 w-1 rounded bg-[#388e3c]/40 dark:bg-[#388e3c]/60"
                      style={{ height: "calc(50% - 24px)" }}
                    />
                  )}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-[22px] w-1 rounded bg-[#388e3c]/40 dark:bg-[#388e3c]/60"
                      style={{ top: "calc(50% + 24px)", bottom: 0 }}
                    />
                  )}
                  <div className="w-12 flex-shrink-0 self-stretch flex items-center justify-center">
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                        i === steps.length - 1
                          ? "text-white"
                          : "bg-white dark:bg-slate-900 text-[#388e3c] dark:text-[#81c784] ring-2 ring-[#388e3c]/20"
                      }`}
                      style={i === steps.length - 1 ? { background: "linear-gradient(135deg, #2e7d32, #1b5e20)" } : undefined}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700/40 rounded-xl px-5 py-4 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {step.label}
                    </div>
                    <div className="font-bold text-lg leading-snug">{formatLong(step.date)}</div>
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
        <WhySection result={result} cutoffDay={cutoffDay} dueDay={dueDay} cycleBadge={cycleBadge} isPast={result.isPast} />
      </div>
    )}
    </>
  )
}
