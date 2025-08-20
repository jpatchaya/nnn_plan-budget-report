import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
  as?: "div" | "section" | "article" | "main"
}

export function Container({ 
  children, 
  size = "xl", 
  padding = "md",
  className,
  as: Component = "div"
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  }

  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-6",
    xl: "px-10 py-8"
  }

  return (
    <Component 
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Component>
  )
}