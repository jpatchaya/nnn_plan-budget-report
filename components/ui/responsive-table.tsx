import * as React from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  mobileCardView?: boolean
}

const ResponsiveTable = React.forwardRef<HTMLTableElement, ResponsiveTableProps>(
  ({ className, children, mobileCardView = true, ...props }, ref) => {
    const isMobile = useMobile()

    if (isMobile && mobileCardView) {
      return (
        <div className={cn("space-y-4", className)} {...props}>
          {children}
        </div>
      )
    }

    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
)
ResponsiveTable.displayName = "ResponsiveTable"

interface ResponsiveTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  mobileCard?: boolean
}

const ResponsiveTableRow = React.forwardRef<HTMLTableRowElement, ResponsiveTableRowProps>(
  ({ className, children, mobileCard = true, ...props }, ref) => {
    const isMobile = useMobile()

    if (isMobile && mobileCard) {
      return (
        <div
          className={cn(
            "rounded-lg border bg-card p-4 shadow-sm space-y-2",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <tr
        ref={ref}
        className={cn(
          "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    )
  }
)
ResponsiveTableRow.displayName = "ResponsiveTableRow"

interface ResponsiveTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  mobileLabel?: string
  mobilePriority?: "high" | "medium" | "low"
  mobileHidden?: boolean
}

const ResponsiveTableCell = React.forwardRef<HTMLTableCellElement, ResponsiveTableCellProps>(
  ({ className, children, mobileLabel, mobilePriority = "medium", mobileHidden = false, ...props }, ref) => {
    const isMobile = useMobile()

    if (isMobile) {
      if (mobileHidden) return null

      if (mobileLabel) {
        return (
          <div
            className={cn(
              "flex justify-between items-center",
              mobilePriority === "high" && "font-medium",
              mobilePriority === "low" && "text-sm text-muted-foreground",
              className
            )}
          >
            <span className="font-medium text-muted-foreground">{mobileLabel}:</span>
            <span className="text-right">{children}</span>
          </div>
        )
      }

      return (
        <div
          className={cn(
            mobilePriority === "high" && "font-medium text-base",
            mobilePriority === "medium" && "text-sm",
            mobilePriority === "low" && "text-xs text-muted-foreground",
            className
          )}
        >
          {children}
        </div>
      )
    }

    return (
      <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
      >
        {children}
      </td>
    )
  }
)
ResponsiveTableCell.displayName = "ResponsiveTableCell"

interface ResponsiveTableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  mobileHidden?: boolean
}

const ResponsiveTableHeader = React.forwardRef<HTMLTableCellElement, ResponsiveTableHeaderProps>(
  ({ className, children, mobileHidden = false, ...props }, ref) => {
    const isMobile = useMobile()

    if (isMobile && mobileHidden) return null

    if (isMobile) {
      return null
    }

    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        {children}
      </th>
    )
  }
)
ResponsiveTableHeader.displayName = "ResponsiveTableHeader"

const ResponsiveTableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const isMobile = useMobile()

  if (isMobile) return null

  return (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
})
ResponsiveTableHead.displayName = "ResponsiveTableHead"

const ResponsiveTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const isMobile = useMobile()

  if (isMobile) {
    return <div className={cn("space-y-4", className)} {...props} />
  }

  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
})
ResponsiveTableBody.displayName = "ResponsiveTableBody"

export {
  ResponsiveTable,
  ResponsiveTableHead,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
  ResponsiveTableHeader
}