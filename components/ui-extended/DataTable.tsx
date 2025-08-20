"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
  align?: "left" | "center" | "right"
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  keyExtractor: (item: T) => string
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  sortBy?: string
  sortOrder?: "asc" | "desc"
  onSort?: (key: string) => void
  onRowClick?: (item: T) => void
  actions?: (item: T) => React.ReactNode
  className?: string
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  selectable = false,
  onSelectionChange,
  sortBy,
  sortOrder = "asc",
  onSort,
  onRowClick,
  actions,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(keyExtractor))
      setSelectedIds(allIds)
      onSelectionChange?.(Array.from(allIds))
    } else {
      setSelectedIds(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds)
    if (checked) {
      newSelection.add(id)
    } else {
      newSelection.delete(id)
    }
    setSelectedIds(newSelection)
    onSelectionChange?.(Array.from(newSelection))
  }

  const renderSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable || !onSort) return null

    if (sortBy !== column.key) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 ml-1"
          onClick={() => onSort(column.key)}
        >
          <ChevronsUpDown className="h-3 w-3" />
        </Button>
      )
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 ml-1"
        onClick={() => onSort(column.key)}
      >
        {sortOrder === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  column.className,
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
              >
                <div className="flex items-center">
                  {column.label}
                  {renderSortIcon(column)}
                </div>
              </TableHead>
            ))}
            {actions && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const id = keyExtractor(item)
            return (
              <TableRow
                key={id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.className,
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] || "")}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}