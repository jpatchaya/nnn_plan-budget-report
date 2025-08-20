"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { AuditService } from '@/lib/audit/audit-service'
import { 
  AuditLog, 
  AuditFilter, 
  AuditStatistics,
  AuditAction,
  LogCategory,
  LogSeverity
} from '@/lib/audit/types'

export function useAudit() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<AuditFilter>({
    limit: 100,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  })

  // Fetch logs
  const fetchLogs = useCallback(async (customFilter?: AuditFilter) => {
    setLoading(true)
    setError(null)
    
    try {
      const appliedFilter = customFilter || filter
      const result = await AuditService.getLogs(appliedFilter)
      setLogs(result.logs)
      setTotalLogs(result.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }, [filter])

  // Fetch statistics
  const fetchStatistics = useCallback(async (customFilter?: AuditFilter) => {
    try {
      const stats = await AuditService.getStatistics(customFilter || filter)
      setStatistics(stats)
    } catch (err: any) {
      console.error('Failed to fetch audit statistics:', err)
    }
  }, [filter])

  // Log an action
  const logAction = useCallback(async (
    action: AuditAction | string,
    resource?: string,
    resourceId?: string,
    details?: Record<string, any>,
    success: boolean = true
  ) => {
    if (!user) return

    try {
      await AuditService.createLog({
        userId: user.id || 'unknown',
        username: user.username || 'unknown',
        userFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'unknown',
        department: user.department || 'unknown',
        departmentCode: user.departmentCode || 'unknown',
        action,
        resource,
        resourceId,
        details,
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent,
        success,
      })
      
      // Refresh logs if viewing
      if (logs.length > 0) {
        await fetchLogs()
      }
    } catch (err: any) {
      console.error('Failed to log action:', err)
    }
  }, [user, logs.length, fetchLogs])

  // Log data access
  const logDataAccess = useCallback(async (
    resource: string,
    resourceId: string,
    action: 'view' | 'export' | 'update' | 'delete'
  ) => {
    if (!user) return

    try {
      await AuditService.logDataAccess(user, resource, resourceId, action)
      
      // Refresh logs if viewing
      if (logs.length > 0) {
        await fetchLogs()
      }
    } catch (err: any) {
      console.error('Failed to log data access:', err)
    }
  }, [user, logs.length, fetchLogs])

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<AuditFilter>) => {
    const updatedFilter = { ...filter, ...newFilter }
    setFilter(updatedFilter)
    fetchLogs(updatedFilter)
  }, [filter, fetchLogs])

  // Search logs
  const searchLogs = useCallback((searchTerm: string) => {
    updateFilter({ searchTerm, offset: 0 })
  }, [updateFilter])

  // Filter by category
  const filterByCategory = useCallback((categories: LogCategory[]) => {
    updateFilter({ category: categories, offset: 0 })
  }, [updateFilter])

  // Filter by severity
  const filterBySeverity = useCallback((severities: LogSeverity[]) => {
    updateFilter({ severity: severities, offset: 0 })
  }, [updateFilter])

  // Filter by date range
  const filterByDateRange = useCallback((startDate?: Date, endDate?: Date) => {
    updateFilter({ startDate, endDate, offset: 0 })
  }, [updateFilter])

  // Filter by user
  const filterByUser = useCallback((userId?: string, username?: string) => {
    updateFilter({ userId, username, offset: 0 })
  }, [updateFilter])

  // Pagination
  const goToPage = useCallback((page: number) => {
    const limit = filter.limit || 100
    updateFilter({ offset: (page - 1) * limit })
  }, [filter.limit, updateFilter])

  // Export logs
  const exportLogs = useCallback(async (format: 'csv' | 'json' = 'json') => {
    try {
      const data = await AuditService.exportLogs(filter, format)
      
      // Create download link
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-logs-${new Date().toISOString()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // Log the export action
      await logAction(AuditAction.DATA_EXPORT, 'AuditLogs', undefined, {
        format,
        recordCount: totalLogs,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to export audit logs')
    }
  }, [filter, totalLogs, logAction])

  // Real-time updates (polling)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  useEffect(() => {
    if (autoRefresh && logs.length > 0) {
      const interval = setInterval(() => {
        fetchLogs()
        fetchStatistics()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
    return undefined
  }, [autoRefresh, refreshInterval, logs.length, fetchLogs, fetchStatistics])

  // Get log details
  const getLogDetails = useCallback((logId: string): AuditLog | undefined => {
    return logs.find(log => log.id === logId)
  }, [logs])

  // Calculate pagination info
  const currentPage = Math.floor((filter.offset || 0) / (filter.limit || 100)) + 1
  const totalPages = Math.ceil(totalLogs / (filter.limit || 100))

  return {
    // Data
    logs,
    totalLogs,
    statistics,
    loading,
    error,
    filter,
    
    // Actions
    fetchLogs,
    fetchStatistics,
    logAction,
    logDataAccess,
    
    // Filtering
    updateFilter,
    searchLogs,
    filterByCategory,
    filterBySeverity,
    filterByDateRange,
    filterByUser,
    
    // Pagination
    currentPage,
    totalPages,
    goToPage,
    
    // Export
    exportLogs,
    
    // Real-time
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    
    // Details
    getLogDetails,
  }
}