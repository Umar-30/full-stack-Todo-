"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
    }

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 shrink-0 rounded-md border-2 border-gray-500 transition-all duration-200",
            "peer-checked:bg-blue-600 peer-checked:border-blue-600",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900",
            "hover:border-blue-400",
            "flex items-center justify-center",
            className
          )}
        >
          {checked && (
            <Check className="h-3 w-3 text-white animate-in fade-in-0 zoom-in-50 duration-200" />
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
