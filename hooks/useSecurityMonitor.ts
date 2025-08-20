"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { 
  SecurityMonitor, 
  SecurityAlert, 
  AlertStatus, 
  AlertSeverity, 
  SecurityAlertType,
  SecurityRule 
} from '@/lib/audit/security-monitor'

export function useSecurityMonitor() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [totalAlerts, setTotalAlerts] = useState(0)
  const [metrics, setMetrics] = useState<any>(null)
  const [rules, setRules] = useState<SecurityRule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch security alerts
  const fetchAlerts = useCallback(async (filter?: {
    status?: AlertStatus[]
    severity?: AlertSeverity[]
    type?: SecurityAlertType[]
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = SecurityMonitor.getAlerts(filter)
      setAlerts(result.alerts)
      setTotalAlerts(result.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security alerts')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch security metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const metricsData = SecurityMonitor.getSecurityMetrics()
      setMetrics(metricsData)
    } catch (err: any) {
      console.error('Failed to fetch security metrics:', err)
    }
  }, [])

  // Fetch security rules
  const fetchRules = useCallback(async () => {
    try {
      const rulesData = SecurityMonitor.getRules()
      setRules(rulesData)
    } catch (err: any) {
      console.error('Failed to fetch security rules:', err)
    }
  }, [])

  // Update alert status
  const updateAlertStatus = useCallback(async (
    alertId: string, 
    status: AlertStatus, 
    resolution?: string
  ) => {
    try {
      const updatedAlert = await SecurityMonitor.updateAlertStatus(
        alertId, 
        status, 
        user?.username || 'unknown',
        resolution
      )
      
      if (updatedAlert) {
        // Update local state
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? updatedAlert : alert
        ))
        
        // Refresh metrics
        await fetchMetrics()
      }
      
      return updatedAlert
    } catch (err: any) {
      setError(err.message || 'Failed to update alert status')
      return null
    }
  }, [user, fetchMetrics])

  // Update security rule
  const updateRule = useCallback(async (ruleId: string, updates: Partial<SecurityRule>) => {
    try {
      const updatedRule = SecurityMonitor.updateRule(ruleId, updates)
      
      if (updatedRule) {
        setRules(prev => prev.map(rule => 
          rule.id === ruleId ? updatedRule : rule
        ))
      }
      
      return updatedRule
    } catch (err: any) {
      setError(err.message || 'Failed to update security rule')
      return null
    }
  }, [])

  // Filter alerts by status
  const filterByStatus = useCallback((statuses: AlertStatus[]) => {
    fetchAlerts({ status: statuses })
  }, [fetchAlerts])

  // Filter alerts by severity
  const filterBySeverity = useCallback((severities: AlertSeverity[]) => {
    fetchAlerts({ severity: severities })
  }, [fetchAlerts])

  // Filter alerts by type
  const filterByType = useCallback((types: SecurityAlertType[]) => {
    fetchAlerts({ type: types })
  }, [fetchAlerts])

  // Filter alerts by date range
  const filterByDateRange = useCallback((startDate?: Date, endDate?: Date) => {
    fetchAlerts({ startDate, endDate })
  }, [fetchAlerts])

  // Get alert by ID
  const getAlert = useCallback((alertId: string): SecurityAlert | undefined => {
    return alerts.find(alert => alert.id === alertId)
  }, [alerts])

  // Get open alerts count
  const getOpenAlertsCount = useCallback((): number => {
    return alerts.filter(alert => alert.status === AlertStatus.OPEN).length
  }, [alerts])

  // Get critical alerts count
  const getCriticalAlertsCount = useCallback((): number => {
    return alerts.filter(alert => alert.severity === AlertSeverity.CRITICAL).length
  }, [alerts])

  // Get recent alerts
  const getRecentAlerts = useCallback((limit: number = 5): SecurityAlert[] => {
    return alerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }, [alerts])

  // Auto-refresh functionality
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAlerts()
        fetchMetrics()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
    return undefined
  }, [autoRefresh, refreshInterval, fetchAlerts, fetchMetrics])

  // Initial load
  useEffect(() => {
    fetchAlerts()
    fetchMetrics()
    fetchRules()
  }, [fetchAlerts, fetchMetrics, fetchRules])

  // Real-time notifications for critical alerts
  const [notifications, setNotifications] = useState<SecurityAlert[]>([])

  useEffect(() => {
    const criticalAlerts = alerts.filter(alert => 
      alert.severity === AlertSeverity.CRITICAL && 
      alert.status === AlertStatus.OPEN
    )
    
    // Show notifications for new critical alerts
    const newCriticalAlerts = criticalAlerts.filter(alert => 
      !notifications.some(notif => notif.id === alert.id)
    )
    
    if (newCriticalAlerts.length > 0) {
      setNotifications(prev => [...prev, ...newCriticalAlerts])
      
      // Auto-remove notifications after 10 seconds
      setTimeout(() => {
        setNotifications(prev => 
          prev.filter(notif => !newCriticalAlerts.some(alert => alert.id === notif.id))
        )
      }, 10000)
    }
  }, [alerts, notifications])

  // Dismiss notification
  const dismissNotification = useCallback((alertId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== alertId))
  }, [])

  // Security dashboard summary
  const getDashboardSummary = useCallback(() => {
    const openAlerts = getOpenAlertsCount()
    const criticalAlerts = getCriticalAlertsCount()
    const recentAlerts = getRecentAlerts(5)
    
    const alertsByStatus = {
      [AlertStatus.OPEN]: alerts.filter(a => a.status === AlertStatus.OPEN).length,
      [AlertStatus.INVESTIGATING]: alerts.filter(a => a.status === AlertStatus.INVESTIGATING).length,
      [AlertStatus.RESOLVED]: alerts.filter(a => a.status === AlertStatus.RESOLVED).length,
      [AlertStatus.FALSE_POSITIVE]: alerts.filter(a => a.status === AlertStatus.FALSE_POSITIVE).length,
    }
    
    const alertsBySeverity = {
      [AlertSeverity.LOW]: alerts.filter(a => a.severity === AlertSeverity.LOW).length,
      [AlertSeverity.MEDIUM]: alerts.filter(a => a.severity === AlertSeverity.MEDIUM).length,
      [AlertSeverity.HIGH]: alerts.filter(a => a.severity === AlertSeverity.HIGH).length,
      [AlertSeverity.CRITICAL]: alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
    }
    
    return {
      totalAlerts: totalAlerts,
      openAlerts,
      criticalAlerts,
      recentAlerts,
      alertsByStatus,
      alertsBySeverity,
      resolutionRate: totalAlerts > 0 ? Math.round(((totalAlerts - openAlerts) / totalAlerts) * 100) : 0,
    }
  }, [alerts, totalAlerts, getOpenAlertsCount, getCriticalAlertsCount, getRecentAlerts])

  return {
    // Data
    alerts,
    totalAlerts,
    metrics,
    rules,
    loading,
    error,
    notifications,
    
    // Actions
    fetchAlerts,
    fetchMetrics,
    fetchRules,
    updateAlertStatus,
    updateRule,
    
    // Filtering
    filterByStatus,
    filterBySeverity,
    filterByType,
    filterByDateRange,
    
    // Utilities
    getAlert,
    getOpenAlertsCount,
    getCriticalAlertsCount,
    getRecentAlerts,
    getDashboardSummary,
    dismissNotification,
    
    // Auto-refresh
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
  }
}