"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Car, CarFront, Truck, Fuel, Info, Trash2, MapPin } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("calculadora-gasto-combustible")

const DEFAULTS = {
  precio: "358",
  distancia: "12",
  viajes: "2",
  dias: "5",
  vehicle: "sedan",
  consumo: "13",
}

// Consumo de referencia en km/L (editable por el usuario)
const VEHICLES = [
  { id: "pequeno", label: "Pequeño", icon: Car, kmL: 16, desc: "Compacto o hatchback" },
  { id: "sedan", label: "Sedán", icon: CarFront, kmL: 13, desc: "El más común" },
  { id: "suv", label: "SUV / Jeepeta", icon: Truck, kmL: 9, desc: "Camioneta o 4x4" },
] as const

const PRESETS = [
  { id: "corto", label: "Corto", km: 5 },
  { id: "medio", label: "Medio", km: 12 },
  { id: "largo", label: "Largo", km: 25 },
] as const

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
  "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-finanzas focus:border-transparent"

export function FuelExpenseCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [precioInput, setPrecioInput] = useState<string>(DEFAULTS.precio)
  const [distanciaInput, setDistanciaInput] = useState<string>(DEFAULTS.distancia)
  const [viajesInput, setViajesInput] = useState<string>(DEFAULTS.viajes)
  const [diasInput, setDiasInput] = useState<string>(DEFAULTS.dias)
  const [vehicle, setVehicle] = useState<string>(DEFAULTS.vehicle)
  const [consumoInput, setConsumoInput] = useState<string>(DEFAULTS.consumo)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cargar borrador local (Tipo D, silencioso)
  useEffect(() => {
    const parsed = storageGet<Partial<typeof DEFAULTS>>(DRAFT_KEY, {})
    if (typeof parsed.precio === "string") setPrecioInput(parsed.precio)
    if (typeof parsed.distancia === "string") setDistanciaInput(parsed.distancia)
    if (typeof parsed.viajes === "string") setViajesInput(parsed.viajes)
    if (typeof parsed.dias === "string") setDiasInput(parsed.dias)
    if (typeof parsed.vehicle === "string") setVehicle(parsed.vehicle)
    if (typeof parsed.consumo === "string") setConsumoInput(parsed.consumo)
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
      if (storageSet(DRAFT_KEY, { precio: precioInput, distancia: distanciaInput, viajes: viajesInput, dias: diasInput, vehicle, consumo: consumoInput })) {
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
    const kmAno = kmSemana * 52
    const costoKm = precio / consumo
    const gastoDia = kmDia * costoKm
    const gastoSemana = gastoDia * dias
    const gastoMes = (gastoSemana * 52) / 12
    const gastoAno = gastoSemana * 52
    const litrosMes = kmMes / consumo
    return { kmDia, kmSemana, kmMes, kmAno, costoKm, gastoDia, gastoSemana, gastoMes, gastoAno, litrosMes }
  }, [precio, distancia, viajes, dias, consumo])

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
        <h2 className="text-xl font-bold mb-1">Tu rutina</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Ajusta los datos y mira tu gasto al instante.
        </p>

        {/* Precio — campo destacado con burbuja */}
        <label htmlFor="precio-combustible" className="block text-sm font-medium mb-1.5">
          Precio del combustible <span className="text-gray-500">(por litro)</span>
        </label>
        <input
          id="precio-combustible"
          type="number"
          min={0}
          inputMode="decimal"
          value={precioInput}
          onChange={(e) => setPrecioInput(e.target.value)}
          placeholder="Ej: 358"
          className={inputClass}
          data-interactive="true"
        />
        <div className="relative mt-2">
          <div className="relative rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
            <span
              aria-hidden="true"
              className="absolute -top-[5px] left-6 h-2.5 w-2.5 rotate-45 border-l border-t border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/20"
            />
            <strong>Verifícalo:</strong> el precio de referencia (RD$ 358) cambia seguido. Usa el de tu
            estación de siempre.
          </div>
        </div>

        {/* Distancia por viaje + presets */}
        <label htmlFor="distancia-viaje" className="block text-sm font-medium mt-5 mb-1.5">
          Distancia por viaje <span className="text-gray-500">(km)</span>
        </label>
        <input
          id="distancia-viaje"
          type="number"
          min={0}
          inputMode="decimal"
          value={distanciaInput}
          onChange={(e) => setDistanciaInput(e.target.value)}
          placeholder="Ej: 12"
          className={inputClass}
          data-interactive="true"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mr-1">
            <MapPin className="h-3.5 w-3.5" />
            Sin pensarlo:
          </span>
          {PRESETS.map((p) => {
            const selected = distanciaInput === String(p.km)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.km)}
                data-interactive="true"
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  selected
                    ? "border border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light"
                    : "border border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                }`}
              >
                {p.label} ({p.km} km)
              </button>
            )
          })}
        </div>

        {/* Viajes por día */}
        <label htmlFor="viajes-dia" className="block text-sm font-medium mt-5 mb-1.5">
          Viajes por día <span className="text-gray-500">(ida y vuelta cuenta como 2)</span>
        </label>
        <input
          id="viajes-dia"
          type="number"
          min={1}
          inputMode="numeric"
          value={viajesInput}
          onChange={(e) => setViajesInput(e.target.value)}
          placeholder="Ej: 2"
          className={inputClass}
          data-interactive="true"
        />

        {/* Días por semana */}
        <label htmlFor="dias-semana" className="block text-sm font-medium mt-5 mb-1.5">
          Días por semana
        </label>
        <input
          id="dias-semana"
          type="number"
          min={1}
          max={7}
          inputMode="numeric"
          value={diasInput}
          onChange={(e) => setDiasInput(e.target.value)}
          placeholder="Ej: 5"
          className={inputClass}
          data-interactive="true"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {[5, 6, 7].map((n) => {
            const selected = diasInput === String(n)
            return (
              <button
                key={n}
                type="button"
                onClick={() => setDias(n)}
                data-interactive="true"
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  selected
                    ? "border border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light"
                    : "border border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                }`}
              >
                {n} {n === 5 ? "días (laborable)" : n === 6 ? "días" : "días (todos)"}
              </button>
            )
          })}
        </div>

        {/* Vehículo */}
        <h3 className="text-sm font-medium mt-6 mb-2">Tipo de vehículo</h3>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tipo de vehículo">
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
                className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-colors ${
                  selected
                    ? "border-2 border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light"
                    : "border border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-semibold leading-tight">{v.label}</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">≈{v.kmL} km/L</span>
              </button>
            )
          })}
        </div>

        {/* Consumo */}
        <label htmlFor="consumo-kml" className="block text-sm font-medium mt-5 mb-1.5">
          Consumo <span className="text-gray-500">(km/L)</span>
        </label>
        <input
          id="consumo-kml"
          type="number"
          min={1}
          inputMode="decimal"
          value={consumoInput}
          onChange={(e) => setConsumoInput(e.target.value)}
          placeholder="Ej: 13"
          className={inputClass}
          data-interactive="true"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          Se ajusta según el vehículo; edítalo con el consumo real de tu carro.
        </p>

        <div className="flex items-center justify-between mt-6">
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
      <div className="lg:col-span-3">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
            <Fuel className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Completa los datos</p>
            <p className="text-sm mt-1">y aquí aparece tu gasto estimado de combustible.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-finanzas/40 dark:border-finanzas-light/30 h-full flex flex-col">
            <div className="bg-finanzas px-5 py-3.5 sm:px-6 sm:py-4 text-white text-center font-bold tracking-wide text-base sm:text-lg">
              TU GASTO DE COMBUSTIBLE
            </div>
            <div className="p-5 sm:p-6 flex-1">
              <div className="text-center mb-5">
                <span className="block text-4xl sm:text-5xl font-bold text-finanzas dark:text-finanzas-light tabular-nums">
                  {formatRD(result.gastoMes)}
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
                  <span>Litros al mes (≈)</span>
                  <span>{result.litrosMes.toLocaleString("es-DO", { maximumFractionDigits: 1 })} L</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-100 px-5 sm:px-6 py-4 flex justify-between items-center gap-3 font-bold text-white dark:text-gray-900 tabular-nums">
              <span className="text-sm leading-tight">
                GASTO ANUAL
                <br />
                ESTIMADO
              </span>
              <span className="text-2xl sm:text-3xl whitespace-nowrap">{formatRD(result.gastoAno)}</span>
            </div>

            <div className="px-5 py-3 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-finanzas" />
              <span>
                Estimación con <strong>52 semanas al año</strong> y tu consumo en km/L. El gasto real
                varía con el tráfico, el clima y el precio del día. Todo queda en tu navegador.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
