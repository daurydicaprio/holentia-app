"use client"

import * as React from "react"
import type * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="relative flex w-full touch-none select-none items-center">
    <div className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="slider-track absolute h-full bg-primary transition-all"
        style={{
          width: `${((props.value?.[0] || props.defaultValue?.[0] || 0) / (props.max || 100)) * 100}%`,
        }}
      />
    </div>
    <input
      type="range"
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value?.[0]}
      onChange={(e) => {
        const value = Number.parseFloat(e.target.value)
        if (props.onValueChange) {
          props.onValueChange([value])
        }
      }}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    />
    <div
      className="slider-thumb absolute h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-all"
      style={{
        left: `calc(${((props.value?.[0] || props.defaultValue?.[0] || 0) / (props.max || 100)) * 100}% - 0.5rem)`,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    />
  </div>
))
Slider.displayName = "Slider"

export { Slider }
