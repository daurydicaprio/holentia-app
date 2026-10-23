"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  Car,
  CarFront,
  Truck,
  Fuel,
  Info,
  Trash2,
  DollarSign,
  MapPin,
  Calendar,
  Gauge,
  HelpCircle,
  Lightbulb,
  TrendingDown,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { RATES } from "@/lib/rates"

const DRAFT_KEY = draftKey("calculadora-gasto-combustible")

const DEFAULTS = {
  precio: String(RATES.fuel.defaultGallonPrice),
  distancia: "12",
  viajes: "2",
  dias: "5",
  vehicle: "sedan",
  consumo: "13",
}

const LITROS_POR_GALON = RATES.fuel.litersPerGallon

const VEHICLES = [
  { id: "pequeno", label: "Pequeño", icon: Car, kmL: 16, desc: "Compacto" },
  { id: "sedan", label: "Sedán", icon: CarFront, kmL: 13, desc: "El más común" },
  { id: "suv", label: "SUV / Jeepeta", icon: Truck, kmL: 9, desc: "Camioneta" },
] as const

const PRESETS = [
  { id: "corto", label: "Corto", km: 5 },
  { id: "medio", label: "Medio", km: 12 },
  { id: "largo", label: "Largo", km: 25 },
] as const

const TOOLTIPS: Record<string, string> = {
  precio:
    `Precio por galón en tu estación. El de referencia (RD$ ${RATES.fuel.defaultGallonPrice}) cambia seguido: siempre usa el precio del día.`,
  distancia: "Kilómetros de tu casa hasta el destino de cada viaje.",
  viajes: "Cuántas veces sales en un día. Una ida y vuelta completa cuenta como 2 viajes.",
  dias: "Cuántos días a la semana conduces. Lo habitual son 5 días laborables.",
  consumo:
    "Kilómetros que recorre tu carro por litro. Referencia: pequeño ≈16, sedán ≈13, SUV ≈9. Ajustalo con lo que marca tu tablero.",
}

const SAVE_TIPS: string[] = [
  "Mantén velocidad constante y evita frenar y acelerar fuerte: el tráfico de alto y bajo consume de más.",
  "Conduce a velocidad moderada y respeta los límites: por encima de ~90 km/h el consumo se dispara.",
  "Carga en horas frescas (mañana temprano o de noche): la gasolina se expande con el calor y recibes menos por el mismo precio.",
  "Evita dejar el carro bajo el sol: el calor evapora combustible del tanque y te obliga a más aire acondicionado.",
  "Revisa la presión de los neumáticos: con baja presión el consumo sube varios puntos porcentuales.",
  "Quita el peso muerto del baúl y el rack del techo: cada kilo extra se paga en gasolina.",
]

function formatRD(value: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseNum(input: string): number {
  const n = Number.parseFloat(input)
  return isNaN(n) || n < 0 ? 0 : n
}

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"

const chipClass = (selected: boolean) =>
  `px-2.5 py-2.5 text-xs rounded-md font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    selected
      ? "border border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter"
      : "border border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
  }`

interface FieldProps {
  id: string
  label: string
  tooltipKey: string
  icon: ReactNode
  activeTooltip: string | null
  setActiveTooltip: (key: string | null) => void
  children: React.ReactNode
}

function Field({ id, label, tooltipKey, icon, activeTooltip, setActiveTooltip, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            data-interactive="true"
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onMouseEnter={() => setActiveTooltip(tooltipKey)}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label={`Información sobre ${label.toLowerCase()}`}
          >
            <HelpCircle size={16} />
          </button>
          {activeTooltip === tooltipKey && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-20 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {TOOLTIPS[tooltipKey]}
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

export function FuelExpenseCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [precioInput, setPrecioInput] = useState<string>(DEFAULTS.precio)
  const [distanciaInput, setDistanciaInput] = useState<string>(DEFAULTS.distancia)
  const [viajesInput, setViajesInput] = useState<string>(DEFAULTS.viajes)
  const [diasInput, setDiasInput] = useState<string>(DEFAULTS.dias)
  const [vehicle, setVehicle] = useState<string>(DEFAULTS.vehicle)
  const [consumoInput, setConsumoInput] = useState<string>(DEFAULTS.consumo)
  const [savedFlash, setSavedFlash] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const parsed = storageGet<Partial<typeof DEFAULTS>>(DRAFT_KEY, {})
    if (typeof parsed.precio === "string") setPrecioInput(parsed.precio)
    if (typeof parsed.distancia === "string") setDistanciaInput(parsed.distancia)
    if (typeof parsed.viajes === "string") setViajesInput(parsed.viajes)
    if (typeof parsed.dias === "string") setDiasInput(parsed.dias)
    if (typeof parsed.vehicle === "string") setVehicle(parsed.vehicle)
    if (typeof parsed.consumo === "string") setConsumoInput(parsed.consumo)
  }, [])

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
          precio: precioInput,
          distancia: distanciaInput,
          viajes: viajesInput,
          dias: diasInput,
          vehicle,
          consumo: consumoInput,
        })
      ) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [precioInput, distanciaInput, viajesInput, diasInput, vehicle, consumoInput])

  const precio = parseNum(precioInput)
  const distancia = parseNum(distanciaInput)
  const viajes = parseNum(viajesInput)
  const dias = parseNum(diasInput)
  const consumo = parseNum(consumoInput)

  const result = useMemo(() => {
    if (precio <= 0 || distancia <= 0 || viajes <= 0 || dias <= 0 || consumo <= 0) return null
    const kmDia = distancia * viajes
    const kmSemana = kmDia * dias
    const kmMes = (kmSemana * 52) / 12
    const kmGalones = consumo * LITROS_POR_GALON
    const costoKm = precio / kmGalones
    const gastoDia = kmDia * costoKm
    const gastoSemana = gastoDia * dias
    const gastoMes = (gastoSemana * 52) / 12
    const gastoAno = gastoSemana * 52
    const galonesMes = kmMes / kmGalones
    return { kmMes, costoKm, gastoDia, gastoSemana, gastoMes, gastoAno, galonesMes }
  }, [precio, distancia, viajes, dias, consumo])

  const animatedGastoMes = useCountUp(result?.gastoMes ?? 0)
  const animatedGastoAno = useCountUp(result?.gastoAno ?? 0)
  const costoViaje = result && viajes > 0 ? result.gastoDia / viajes : 0
  const costoKmMejor = result ? precio / ((consumo + 1) * LITROS_POR_GALON) : 0
  const ahorroConsumo = result ? result.kmMes * 12 * (result.costoKm - costoKmMejor) : 0

  const selectVehicle = (id: string) => {
    const v = VEHICLES.find((item) => item.id === id)
    if (!v) return
    setVehicle(id)
    setConsumoInput(String(v.kmL))
    triggerHapticFeedback("light")
  }

  const setPreset = (km: number) => {
    setDistanciaInput(String(km))
    triggerHapticFeedback("light")
  }

  const setDias = (n: number) => {
    setDiasInput(String(n))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setPrecioInput(DEFAULTS.precio)
    setDistanciaInput(DEFAULTS.distancia)
    setViajesInput(DEFAULTS.viajes)
    setDiasInput(DEFAULTS.dias)
    setVehicle(DEFAULTS.vehicle)
    setConsumoInput(DEFAULTS.consumo)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Controles */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          {/* Precio por galón */}
          <Field
            id="precio-combustible"
            label="Precio del combustible"
            tooltipKey="precio"
            icon={<DollarSign size={16} className="text-gray-500 dark:text-gray-400" />}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          >
            <input
              id="precio-combustible"
              type="text"
              inputMode="decimal"
              value={precioInput}
              onChange={(e) => setPrecioInput(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder={`Ej: ${RATES.fuel.defaultGallonPrice}`}
              className={inputClass}
              data-interactive="true"
            />
          </Field>
          <div className="relative -mt-2">
            <div className="relative rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs leading-relaxed text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
              <span
                aria-hidden="true"
                className="absolute -top-[5px] left-6 h-2.5 w-2.5 rotate-45 border-l border-t border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/20"
              />
              <strong>Verifícalo:</strong> el de referencia (RD$ {RATES.fuel.defaultGallonPrice}) cambia seguido. Usa el de tu estación.
            </div>
          </div>

          {/* Distancia + presets */}
          <Field
            id="distancia-viaje"
            label="Distancia por viaje"
            tooltipKey="distancia"
            icon={<MapPin size={16} className="text-gray-500 dark:text-gray-400" />}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          >
            <input
              id="distancia-viaje"
              type="text"
              inputMode="decimal"
              value={distanciaInput}
              onChange={(e) => setDistanciaInput(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder="Ej: 12"
              className={inputClass}
              data-interactive="true"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.km)}
                data-interactive="true"
                className={chipClass(distanciaInput === String(p.km))}
              >
                {p.label} ({p.km} km)
              </button>
            ))}
          </div>

          {/* Viajes por día + Días por semana, misma línea */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="viajes-dia"
              label="Viajes por día"
              tooltipKey="viajes"
              icon={<Car size={16} className="text-gray-500 dark:text-gray-400" />}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            >
              <input
                id="viajes-dia"
                type="text"
                inputMode="numeric"
                value={viajesInput}
                onChange={(e) => setViajesInput(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="2"
                className={inputClass}
                data-interactive="true"
              />
            </Field>
            <Field
              id="dias-semana"
              label="Días por semana"
              tooltipKey="dias"
              icon={<Calendar size={16} className="text-gray-500 dark:text-gray-400" />}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            >
              <input
                id="dias-semana"
                type="text"
                inputMode="numeric"
                value={diasInput}
                onChange={(e) => setDiasInput(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="5"
                className={inputClass}
                data-interactive="true"
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2 -mt-2">
            {[5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDias(n)}
                data-interactive="true"
                className={chipClass(diasInput === String(n))}
              >
                {n} {n === 7 ? "días (todos)" : "días"}
              </button>
            ))}
          </div>

          {/* Vehículo */}
          <div>
            <p id="vehicle-type-label" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de vehículo
            </p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="vehicle-type-label">
              {VEHICLES.map((v) => {
                const selected = vehicle === v.id
                const Icon = v.icon
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectVehicle(v.id)}
                    data-interactive="true"
                    className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-center transition-[colors,transform] duration-150 active:scale-[0.97] ${
                      selected
                        ? "border-2 border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter"
                        : "border border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-semibold leading-tight">{v.label}</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">≈{v.kmL} km/L</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Consumo */}
          <Field
            id="consumo-kml"
            label="Consumo"
            tooltipKey="consumo"
            icon={<Gauge size={16} className="text-gray-500 dark:text-gray-400" />}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          >
            <input
              id="consumo-kml"
              type="text"
              inputMode="decimal"
              value={consumoInput}
              onChange={(e) => setConsumoInput(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder="Ej: 13"
              className={inputClass}
              data-interactive="true"
            />
          </Field>
        </div>

        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Se guarda en tu navegador"}
          </span>
          <button
            type="button"
            onClick={clearData}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
            data-interactive="true"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Borrar mis datos
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 flex flex-1 flex-col items-center justify-center">
            <Fuel className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Completa los datos</p>
            <p className="text-sm mt-1">y aquí aparece tu gasto estimado de combustible.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-finanzas-border flex flex-col">
            <div className="bg-finanzas-dark px-5 py-3 sm:px-6 sm:py-3.5 text-white text-center font-bold tracking-wide text-base">
              TU GASTO DE COMBUSTIBLE
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <span className="block text-4xl sm:text-5xl font-bold text-finanzas dark:text-finanzas-light tabular-nums">
                  {formatRD(animatedGastoMes)}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">gasto mensual estimado</span>
              </div>

              <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />

              <div className="font-mono text-sm tabular-nums space-y-1">
                <div className="flex justify-between py-1">
                  <span>Por día</span>
                  <span>{formatRD(result.gastoDia)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Por semana ({dias} días)</span>
                  <span>{formatRD(result.gastoSemana)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Costo por kilómetro</span>
                  <span>{formatRD(result.costoKm)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-2" />
                <div className="flex justify-between py-1 text-gray-500 dark:text-gray-400 text-xs">
                  <span>Kilómetros al mes</span>
                  <span>{result.kmMes.toLocaleString("es-DO", { maximumFractionDigits: 0 })} km</span>
                </div>
                <div className="flex justify-between py-1 text-gray-500 dark:text-gray-400 text-xs">
                  <span>Galones al mes (≈)</span>
                  <span>{result.galonesMes.toLocaleString("es-DO", { maximumFractionDigits: 1 })} gal</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-100 px-5 sm:px-6 py-3.5 flex justify-between items-center gap-3 font-bold text-white dark:text-gray-900 tabular-nums">
              <span className="text-sm leading-tight">
                GASTO ANUAL
                <br />
                ESTIMADO
              </span>
              <span className="text-2xl sm:text-3xl whitespace-nowrap">{formatRD(animatedGastoAno)}</span>
            </div>

            <div className="px-5 py-2.5 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-finanzas dark:text-finanzas-light" />
              <span>
                Estimación con <strong>52 semanas al año</strong>; el precio es <strong>por galón</strong> y el
                consumo en km/L. El gasto real varía con tráfico, clima y precio del día. Todo queda en tu
                navegador.
              </span>
            </div>
          </div>
        )}

        {/* Gasto en perspectiva: cierra la altura del formulario */}
        {result && (
          <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TrendingDown className="h-4 w-4 text-finanzas dark:text-finanzas-light" aria-hidden="true" />
              Tu gasto en perspectiva
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-600 dark:text-gray-400">Costo por viaje</dt>
                <dd className="font-semibold tabular-nums">{formatRD(costoViaje)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-600 dark:text-gray-400">Costo por día de trabajo</dt>
                <dd className="font-semibold tabular-nums">{formatRD(result.gastoDia)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-gray-600 dark:text-gray-400">Si reduces 10% los km</dt>
                <dd className="font-semibold tabular-nums">{formatRD(result.gastoAno * 0.1)}/año</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-600 dark:text-gray-400">Si mejoras 1 km/L</dt>
                <dd className="font-semibold tabular-nums">{formatRD(ahorroConsumo)}/año</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Cómo ahorrar combustible */}
      <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-finanzas dark:text-finanzas-light flex-shrink-0" />
          <h2 className="text-xl font-bold">Cómo ahorrar combustible</h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {SAVE_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 rounded-full bg-finanzas dark:bg-finanzas-light flex-shrink-0"
              />
              {tip}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          ¿También quieres recortar la factura de la luz?{" "}
          <Link
            href="/calculadora-consumo-electrico"
            data-interactive="true"
            className="font-semibold text-finanzas-dark underline underline-offset-2 dark:text-finanzas-lighter"
          >
            Calcula tu consumo eléctrico
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
