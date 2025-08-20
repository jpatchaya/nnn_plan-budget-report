"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  type: "select" | "multiselect" | "text" | "number" | "date" | "daterange"
  options?: FilterOption[]
  placeholder?: string
}

interface FiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  onReset?: () => void
  className?: string
  showAsSheet?: boolean
}

export function Filters({
  filters,
  values,
  onChange,
  onReset,
  className,
  showAsSheet = false,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value })
  }

  const handleRemoveFilter = (key: string) => {
    const newValues = { ...values }
    delete newValues[key]
    onChange(newValues)
  }

  const activeFiltersCount = Object.keys(values).filter(
    (key) => values[key] !== undefined && values[key] !== ""
  ).length

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key]

    switch (filter.type) {
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleFilterChange(filter.key, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "text":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}
          />
        )

      default:
        return null
    }
  }

  const filterContent = (
    <div className="space-y-4">
      {filters.map((filter) => (
        <div key={filter.key} className="space-y-2">
          <Label>{filter.label}</Label>
          {renderFilter(filter)}
        </div>
      ))}

      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(values).map(([key, value]) => {
              if (!value) return null
              const filter = filters.find((f) => f.key === key)
              if (!filter) return null

              let displayValue = value
              if (filter.type === "select" && filter.options) {
                const option = filter.options.find((o) => o.value === value)
                displayValue = option?.label || value
              }

              return (
                <Badge key={key} variant="secondary" className="gap-1">
                  <span className="text-xs">{filter.label}:</span>
                  <span>{displayValue}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1"
                    onClick={() => handleRemoveFilter(key)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            onReset?.()
            setIsOpen(false)
          }}
          disabled={activeFiltersCount === 0}
        >
          Reset Filters
        </Button>
        <Button
          className="flex-1"
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )

  if (showAsSheet) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className={className}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2" variant="secondary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Apply filters to refine your results
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">{filterContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return <div className={cn("space-y-4", className)}>{filterContent}</div>
}