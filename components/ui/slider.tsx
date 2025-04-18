"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, defaultValue, value, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(value || defaultValue || [min])

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(e.target.value)]
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    const percentage = ((internalValue[0] - min) / (max - min)) * 100

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="absolute h-full bg-[#2e7d32] dark:bg-[#4caf50]" style={{ width: `${percentage}%` }} />
        </div>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={internalValue[0]}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-[#2e7d32] dark:border-[#4caf50] bg-white dark:bg-gray-900 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7d32] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    )
  },
)
Slider.displayName = "Slider"

export { Slider }
