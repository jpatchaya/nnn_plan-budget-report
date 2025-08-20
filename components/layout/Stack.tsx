import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StackProps {
  children: ReactNode
  direction?: "row" | "column" | "row-reverse" | "column-reverse"
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  className?: string
  responsive?: boolean
}

export function Stack({ 
  children, 
  direction = "column",
  spacing = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  responsive = true
}: StackProps) {
  const directionClasses = {
    row: responsive ? "flex-col sm:flex-row" : "flex-row",
    column: "flex-col",
    "row-reverse": responsive ? "flex-col-reverse sm:flex-row-reverse" : "flex-row-reverse",
    "column-reverse": "flex-col-reverse"
  }

  const spacingClasses = {
    none: "",
    xs: direction.includes("row") ? "gap-x-2" : "gap-y-2",
    sm: direction.includes("row") ? "gap-x-3" : "gap-y-3",
    md: direction.includes("row") ? "gap-x-4" : "gap-y-4",
    lg: direction.includes("row") ? "gap-x-6" : "gap-y-6",
    xl: direction.includes("row") ? "gap-x-8" : "gap-y-8"
  }

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline"
  }

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  }

  return (
    <div 
      className={cn(
        "flex",
        directionClasses[direction],
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  )
}