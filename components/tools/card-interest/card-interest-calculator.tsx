"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, Trash2, Info, Lightbulb, AlertTriangle } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("calculadora-interes-tarjeta")

const DEFAULT_RATE = 60

interface CardDraft {
  balance?: string
  rate?: string
  payment?: string
  cardName?: string
  cardLast4?: string
}

/** Formato numérico sin símbolo de moneda. */
function formatAmount(value: number): string {
  return new Intl.NumberFormat("es-DO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PayoffResult {
  months: number
  totalPaid: number
  totalInterest: number
  monthlyInterest: number
  neverPaysOff: boolean
  minPayment: number
}

/** Simula liquidación del saldo con pago fijo mensual. */
function simulatePayoff(balance: number, annualRate: number, payment: number): PayoffResult | null {
  if (!isFinite(balance) || balance <= 0 || !isFinite(annualRate) || annualRate < 0 || !isFinite(payment) || payment <= 0) {
    return null
  }

  const monthlyRate = annualRate / 100 / 12
  const monthlyInterest = balance * monthlyRate
  const minPayment = Math.max(monthlyInterest + 1, balance * 0.02)

  // Pago no cubre ni el interés: el saldo nunca baja (trampa de deuda).
  if (payment <= monthlyInterest) {
    return { months: 0, totalPaid: 0, totalInterest: 0, monthlyInterest, neverPaysOff: true, minPayment }
  }

  let remaining = balance
  let totalPaid = 0
  let totalInterest = 0
  let months = 0
  const maxMonths = 600

  while (remaining > 0.01 && months < maxMonths) {
    const interest = remaining * monthlyRate
    const principal = payment - interest
    if (principal <= 0) {
      return { months: 0, totalPaid: 0, totalInterest: 0, monthlyInterest, neverPaysOff: true, minPayment }
    }
    const actualPayment = Math.min(payment, remaining + interest)
    totalInterest += interest
    totalPaid += actualPayment
    remaining = remaining + interest - actualPayment
    months += 1
  }

  return { months, totalPaid, totalInterest, monthlyInterest, neverPaysOff: false, minPayment }
}

export function CardInterestCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [balanceInput, setBalanceInput] = useState<string>("")
  const [rateInput, setRateInput] = useState<string>(String(DEFAULT_RATE))
  const [paymentInput, setPaymentInput] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [cardLast4, setCardLast4] = useState<string>("")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cargar borrador local (Tipo D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<CardDraft>(DRAFT_KEY, {})
    if (typeof parsed.balance === "string") setBalanceInput(parsed.balance)
    if (typeof parsed.rate === "string") setRateInput(parsed.rate)
    if (typeof parsed.payment === "string") setPaymentInput(parsed.payment)
    if (typeof parsed.cardName === "string") setCardName(parsed.cardName)
    if (typeof parsed.cardLast4 === "string") setCardLast4(parsed.cardLast4)
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
      if (
        storageSet(DRAFT_KEY, {
          balance: balanceInput,
          rate: rateInput,
          payment: paymentInput,
          cardName,
          cardLast4,
        })
      ) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [balanceInput, rateInput, paymentInput, cardName, cardLast4])

  const balance = useMemo(() => {
    const n = Number.parseFloat(balanceInput)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [balanceInput])

  const annualRate = useMemo(() => {
    const n = Number.parseFloat(rateInput)
    return isNaN(n) || n < 0 ? 0 : n
  }, [rateInput])

  const payment = useMemo(() => {
    const n = Number.parseFloat(paymentInput)
    return isNaN(n) || n <= 0 ? 0 : n
  }, [paymentInput])

  const result = useMemo(() => {
    if (!balanceInput.trim() || !paymentInput.trim() || balance <= 0 || payment <= 0) return null
    return simulatePayoff(balance, annualRate, payment)
  }, [balanceInput, paymentInput, balance, annualRate, payment])

  const cardTitle = useMemo(() => {
    const name = cardName.trim() || "Tu tarjeta"
    const last4 = cardLast4.replace(/\D/g, "").slice(-4)
    if (!last4) return name
    return `${name} ····${last4}`
  }, [cardName, cardLast4])

  const clearData = () => {
    setBalanceInput("")
    setRateInput(String(DEFAULT_RATE))
    setPaymentInput("")
    setCardName("")
    setCardLast4("")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"

  const monthlyRatePct = annualRate / 12

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Controles */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#388e3c]/10 dark:bg-[#388e3c]/20">
            <CreditCard className="h-6 w-6 text-[#388e3c] dark:text-[#81c784]" />
          </div>
          <h2 className="text-xl font-bold">Tu tarjeta</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          ¿Cuánto te cuesta financiar el saldo y en cuánto tiempo liquidas?
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Nombre de la tarjeta</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Ej: Visa-BHD"
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Terminación</label>
              <input
                type="text"
                inputMode="numeric"
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                maxLength={4}
                className={inputClass}
                data-interactive="true"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Saldo de la tarjeta</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Ej: 25000"
              className={inputClass}
              data-interactive="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tasa de interés anual (%)</label>
            <input
              type="number"
              min={0}
              max={200}
              step={0.1}
              inputMode="decimal"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              placeholder="Ej: 60"
              className={inputClass}
              data-interactive="true"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Por defecto 60%, típico en tarjetas.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pago mensual que piensas dar</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={paymentInput}
              onChange={(e) => setPaymentInput(e.target.value)}
              placeholder="Ej: 3000"
              className={inputClass}
              data-interactive="true"
            />
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

      {/* Resultado */}
      <div className="lg:col-span-3">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Escribe tu saldo y un pago mensual</p>
            <p className="text-sm mt-1">y te digo cuánto cuesta financiar y en cuántos meses liquidas.</p>
          </div>
        ) : (
          <div className="space-y-6 h-full">
            {/* Héroe */}
            <div
              className="rounded-xl p-8 text-white text-center shadow-lg"
              style={{
                background: result.neverPaysOff
                  ? "linear-gradient(135deg, #c62828 0%, #8e0000 100%)"
                  : "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
              }}
            >
              {result.neverPaysOff ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5" />
                    <div className="text-sm uppercase tracking-widest opacity-90">Con ese pago no bajas el saldo</div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold tabular-nums mb-3">{formatAmount(result.monthlyInterest)}</div>
                  <p className="text-sm opacity-90 max-w-md mx-auto leading-relaxed">
                    Este mes se genera solo en intereses {formatAmount(result.monthlyInterest)}. Con tu pago de{" "}
                    {formatAmount(payment)} no abonas capital: la deuda no baja.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Liquidas en</div>
                  <div className="text-6xl font-bold tabular-nums">{result.months}</div>
                  <div className="text-lg opacity-90 mt-1">{result.months === 1 ? "mes" : "meses"}</div>
                  <div className="text-sm opacity-80 mt-1">{cardTitle}</div>

                  <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg mx-auto">
                    <div className="rounded-lg bg-white/15 px-2 py-3">
                      <div className="text-lg sm:text-xl font-bold tabular-nums">{formatAmount(result.totalInterest)}</div>
                      <div className="text-[11px] opacity-90 mt-1 leading-tight">Interés total</div>
                    </div>
                    <div className="rounded-lg bg-white/15 px-2 py-3">
                      <div className="text-lg sm:text-xl font-bold tabular-nums">{formatAmount(result.totalPaid)}</div>
                      <div className="text-[11px] opacity-90 mt-1 leading-tight">Total pagado</div>
                    </div>
                    <div className="rounded-lg bg-white/15 px-2 py-3">
                      <div className="text-lg sm:text-xl font-bold tabular-nums text-[#ffee58]">
                        {balance > 0 ? `+${Math.round((result.totalInterest / balance) * 100)}%` : "—"}
                      </div>
                      <div className="text-[11px] opacity-90 mt-1 leading-tight text-[#ffee58]">Costo extra</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desglose */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">El costo de financiar</h3>
              <div className="space-y-3 font-mono text-sm tabular-nums">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Tasa anual</span>
                  <span>{annualRate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Tasa mensual (anual ÷ 12)</span>
                  <span>{monthlyRatePct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Interés del primer mes</span>
                  <span className="text-red-600 dark:text-red-400">{formatAmount(result.monthlyInterest)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-2" />
                <div className="flex justify-between py-1 font-sans font-semibold">
                  <span>Pago mensual</span>
                  <span>{formatAmount(payment)}</span>
                </div>
                <div className="flex justify-between py-1 font-sans text-xs text-gray-500 dark:text-gray-400">
                  <span>Abono al capital (1er mes)</span>
                  <span>
                    {result.neverPaysOff ? formatAmount(0) : formatAmount(Math.max(payment - result.monthlyInterest, 0))}
                  </span>
                </div>
              </div>

              {!result.neverPaysOff && balance > 0 && payment > 0 && (
                <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    Pagar solo el mínimo (≈2% del saldo, {formatAmount(result.minPayment)}) tarda años y multiplica el
                    interés. Un pago mayor liquida antes y ahorra dinero.
                  </p>
                </div>
              )}
            </div>

            {/* Aviso */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-1">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
              <span>
                Estimación educativa: asume tasa fija, sin moras, seguros ni impuestos. La tasa real de tu tarjeta
                está en tu estado de cuenta o app del banco. No es asesoría financiera. Tus datos no salen de este
                navegador.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
