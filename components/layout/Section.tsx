import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
  bordered?: boolean
  collapsible?: boolean
}

export function Section({ 
  title, 
  description,
  children,
  actions,
  className,
  bordered = false,
  collapsible = false
}: SectionProps) {
  return (
    <section 
      className={cn(
        "mb-6 md:mb-8",
        bordered && "border border-border rounded-lg p-4 md:p-6",
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            {title && (
              <h2 className="text-lg md:text-xl font-semibold">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </section>
  )
}