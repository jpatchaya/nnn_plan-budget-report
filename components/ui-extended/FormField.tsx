"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Info } from "lucide-react"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea"
  value?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  icon?: ReactNode
  className?: string
  rows?: number
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  icon,
  className,
  rows = 3
}: FormFieldProps) {
  const inputClassName = cn(
    error && "border-destructive focus:ring-destructive",
    icon && "pl-10",
    className
  )

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClassName}
          rows={rows}
        />
      )
    }

    return (
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClassName}
      />
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        {renderInput()}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  )
}