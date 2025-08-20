import * as React from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
}

export const ResponsiveFormGroup = React.forwardRef<HTMLDivElement, ResponsiveFormGroupProps>(
  ({ className, children, columns = 2, ...props }, ref) => {
    const gridClass = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    }

    return (
      <div
        ref={ref}
        className={cn(`grid ${gridClass[columns]} gap-4`, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ResponsiveFormGroup.displayName = "ResponsiveFormGroup"

interface ResponsiveFormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  mobileStack?: boolean
}

export const ResponsiveFormRow = React.forwardRef<HTMLDivElement, ResponsiveFormRowProps>(
  ({ className, children, mobileStack = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          mobileStack ? "flex flex-col sm:flex-row gap-4" : "flex gap-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ResponsiveFormRow.displayName = "ResponsiveFormRow"

interface ResponsiveButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  align?: "left" | "center" | "right" | "between"
  mobileStack?: boolean
}

export const ResponsiveButtonGroup = React.forwardRef<HTMLDivElement, ResponsiveButtonGroupProps>(
  ({ className, children, align = "right", mobileStack = false, ...props }, ref) => {
    const isMobile = useMobile()
    
    const alignClass = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
      between: "justify-between"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          isMobile && mobileStack ? "flex-col" : "flex-row flex-wrap",
          alignClass[align],
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (isMobile && mobileStack && React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn((child as React.ReactElement<any>).props.className, "w-full")
            })
          }
          return child
        })}
      </div>
    )
  }
)
ResponsiveButtonGroup.displayName = "ResponsiveButtonGroup"

interface ResponsiveFieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  label?: string
  description?: string
  error?: string
}

export const ResponsiveFieldGroup = React.forwardRef<HTMLDivElement, ResponsiveFieldGroupProps>(
  ({ className, children, label, description, error, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        {children}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
ResponsiveFieldGroup.displayName = "ResponsiveFieldGroup"