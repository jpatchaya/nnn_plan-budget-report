"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface Column<T> {
  key: string
  label: string
  render: (item: T) => ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  className?: string
  emptyMessage?: string
}

export function ResponsiveTable<T>({ 
  data, 
  columns, 
  keyExtractor,
  className,
  emptyMessage = "No data available"
}: ResponsiveTableProps<T>) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Filter columns for mobile view
  const visibleColumns = isMobile 
    ? columns.filter(col => !col.hideOnMobile)
    : columns

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        {data.map((item) => (
          <div 
            key={keyExtractor(item)}
            className="border rounded-lg p-4 space-y-2"
          >
            {visibleColumns.map((column) => (
              <div key={column.key} className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {column.label}:
                </span>
                <span className="text-sm">
                  {column.render(item)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {visibleColumns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}