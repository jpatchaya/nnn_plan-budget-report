import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  responsive?: boolean
}

export function Grid({ 
  children, 
  cols = 1, 
  gap = "md", 
  className,
  responsive = true 
}: GridProps) {
  const gapClasses = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8"
  }

  const colClasses = {
    1: "grid-cols-1",
    2: responsive ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2",
    3: responsive ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-3",
    4: responsive ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-4",
    5: responsive ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-5",
    6: responsive ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6" : "grid-cols-6",
    12: responsive ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12" : "grid-cols-12"
  }

  return (
    <div 
      className={cn(
        "grid",
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

interface GridItemProps {
  children: ReactNode
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "auto" | "full"
  className?: string
  responsive?: boolean
}

export function GridItem({ 
  children, 
  span = 1, 
  className,
  responsive = true 
}: GridItemProps) {
  const spanClasses = {
    1: "col-span-1",
    2: responsive ? "col-span-1 md:col-span-2" : "col-span-2",
    3: responsive ? "col-span-1 md:col-span-3" : "col-span-3",
    4: responsive ? "col-span-1 md:col-span-4" : "col-span-4",
    5: responsive ? "col-span-1 md:col-span-5" : "col-span-5",
    6: responsive ? "col-span-1 md:col-span-6" : "col-span-6",
    7: responsive ? "col-span-1 md:col-span-7" : "col-span-7",
    8: responsive ? "col-span-1 md:col-span-8" : "col-span-8",
    9: responsive ? "col-span-1 md:col-span-9" : "col-span-9",
    10: responsive ? "col-span-1 md:col-span-10" : "col-span-10",
    11: responsive ? "col-span-1 md:col-span-11" : "col-span-11",
    12: responsive ? "col-span-1 md:col-span-12" : "col-span-12",
    auto: "col-auto",
    full: "col-span-full"
  }

  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  )
}