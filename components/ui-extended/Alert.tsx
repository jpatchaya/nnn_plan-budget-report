"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type AlertType = "info" | "success" | "warning" | "error"

interface AlertProps {
  type?: AlertType
  title?: string
  message: string
  icon?: ReactNode
  closable?: boolean
  onClose?: () => void
  actions?: ReactNode
  className?: string
}

export function Alert({
  type = "info",
  title,
  message,
  icon,
  closable = false,
  onClose,
  actions,
  className,
}: AlertProps) {
  const typeStyles = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    error: "bg-red-50 text-red-900 border-red-200",
  }

  const defaultIcons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
  }

  const displayIcon = icon || defaultIcons[type]

  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-lg border p-4",
        typeStyles[type],
        className
      )}
    >
      {displayIcon && (
        <div className="flex-shrink-0">{displayIcon}</div>
      )}

      <div className="flex-1 space-y-2">
        {title && (
          <h3 className="font-semibold">{title}</h3>
        )}
        <p className="text-sm">{message}</p>
        {actions && (
          <div className="mt-3">{actions}</div>
        )}
      </div>

      {closable && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}