// Security Monitoring and Alert System
import { AuditLog, AuditAction, LogSeverity, LogCategory } from './types'
import { AuditService } from './audit-service'

export interface SecurityAlert {
  id: string
  type: SecurityAlertType
  severity: AlertSeverity
  title: string
  description: string
  timestamp: Date
  relatedLogs: string[] // Log IDs
  status: AlertStatus
  assignedTo?: string
  resolvedAt?: Date
  resolvedBy?: string
  resolution?: string
  metadata: Record<string, any>
}

export enum SecurityAlertType {
  MULTIPLE_FAILED_LOGINS = 'MULTIPLE_FAILED_LOGINS',
  SUSPICIOUS_LOGIN_PATTERN = 'SUSPICIOUS_LOGIN_PATTERN',
  UNAUTHORIZED_ACCESS_ATTEMPT = 'UNAUTHORIZED_ACCESS_ATTEMPT',
  DATA_BREACH_ATTEMPT = 'DATA_BREACH_ATTEMPT',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  UNUSUAL_DATA_ACCESS = 'UNUSUAL_DATA_ACCESS',
  SYSTEM_CONFIGURATION_CHANGE = 'SYSTEM_CONFIGURATION_CHANGE',
  BULK_DATA_EXPORT = 'BULK_DATA_EXPORT',
  OFF_HOURS_ACCESS = 'OFF_HOURS_ACCESS',
  GEOGRAPHIC_ANOMALY = 'GEOGRAPHIC_ANOMALY',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export interface SecurityRule {
  id: string
  name: string
  description: string
  type: SecurityAlertType
  enabled: boolean
  conditions: SecurityCondition[]
  actions: SecurityAction[]
  threshold?: number
  timeWindow?: number // minutes
  severity: AlertSeverity
}

export interface SecurityCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

export interface SecurityAction {
  type: 'alert' | 'email' | 'block_user' | 'log'
  config: Record<string, any>
}

export class SecurityMonitor {
  private static alerts: SecurityAlert[] = []
  private static rules: SecurityRule[] = []
  private static isMonitoring = false

  // Initialize security monitoring
  static initialize() {
    if (this.isMonitoring) return

    this.setupDefaultRules()
    this.startMonitoring()
    this.isMonitoring = true
  }

  // Setup default security rules
  private static setupDefaultRules() {
    this.rules = [
      {
        id: 'failed-login-attempts',
        name: 'Multiple Failed Login Attempts',
        description: 'Detect multiple failed login attempts from same user/IP',
        type: SecurityAlertType.MULTIPLE_FAILED_LOGINS,
        enabled: true,
        conditions: [
          { field: 'action', operator: 'equals', value: AuditAction.LOGIN_FAILED },
          { field: 'success', operator: 'equals', value: false },
        ],
        actions: [
          { type: 'alert', config: { notify: true } },
          { type: 'email', config: { recipients: ['security@dnp.go.th'] } },
        ],
        threshold: 5,
        timeWindow: 15, // 15 minutes
        severity: AlertSeverity.HIGH,
      },
      {
        id: 'unauthorized-access',
        name: 'Unauthorized Access Attempts',
        description: 'Detect attempts to access restricted resources',
        type: SecurityAlertType.UNAUTHORIZED_ACCESS_ATTEMPT,
        enabled: true,
        conditions: [
          { field: 'action', operator: 'equals', value: AuditAction.PERMISSION_DENIED },
          { field: 'severity', operator: 'in', value: [LogSeverity.WARNING, LogSeverity.ERROR] },
        ],
        actions: [
          { type: 'alert', config: { notify: true } },
        ],
        threshold: 3,
        timeWindow: 10,
        severity: AlertSeverity.MEDIUM,
      },
      {
        id: 'bulk-data-export',
        name: 'Bulk Data Export',
        description: 'Detect large data exports that may indicate data theft',
        type: SecurityAlertType.BULK_DATA_EXPORT,
        enabled: true,
        conditions: [
          { field: 'action', operator: 'equals', value: AuditAction.DATA_EXPORT },
          { field: 'details.recordCount', operator: 'greater_than', value: 1000 },
        ],
        actions: [
          { type: 'alert', config: { notify: true } },
          { type: 'email', config: { recipients: ['security@dnp.go.th'] } },
        ],
        threshold: 1,
        timeWindow: 60,
        severity: AlertSeverity.HIGH,
      },
      {
        id: 'off-hours-access',
        name: 'Off-Hours System Access',
        description: 'Detect system access outside normal business hours',
        type: SecurityAlertType.OFF_HOURS_ACCESS,
        enabled: true,
        conditions: [
          { field: 'action', operator: 'equals', value: AuditAction.LOGIN },
          { field: 'success', operator: 'equals', value: true },
        ],
        actions: [
          { type: 'alert', config: { notify: true } },
        ],
        threshold: 1,
        timeWindow: 60,
        severity: AlertSeverity.LOW,
      },
      {
        id: 'system-config-change',
        name: 'System Configuration Changes',
        description: 'Monitor critical system configuration changes',
        type: SecurityAlertType.SYSTEM_CONFIGURATION_CHANGE,
        enabled: true,
        conditions: [
          { field: 'action', operator: 'equals', value: AuditAction.SYSTEM_CONFIG },
          { field: 'category', operator: 'equals', value: LogCategory.SYSTEM },
        ],
        actions: [
          { type: 'alert', config: { notify: true } },
          { type: 'email', config: { recipients: ['admin@dnp.go.th'] } },
        ],
        threshold: 1,
        timeWindow: 5,
        severity: AlertSeverity.CRITICAL,
      },
    ]
  }

  // Start monitoring audit logs
  private static startMonitoring() {
    // In a real implementation, this would be triggered by new audit log entries
    // For now, we'll check periodically
    setInterval(() => {
      this.checkSecurityRules()
    }, 60000) // Check every minute
  }

  // Check security rules against recent logs
  private static async checkSecurityRules() {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 60 * 60 * 1000) // Last hour

    const { logs } = await AuditService.getLogs({
      startDate: startTime,
      endDate: endTime,
      limit: 1000,
    })

    for (const rule of this.rules) {
      if (!rule.enabled) continue

      await this.evaluateRule(rule, logs)
    }
  }

  // Evaluate a security rule against logs
  private static async evaluateRule(rule: SecurityRule, logs: AuditLog[]) {
    const timeWindow = rule.timeWindow || 60
    const threshold = rule.threshold || 1
    const windowStart = new Date(Date.now() - timeWindow * 60 * 1000)

    // Filter logs that match rule conditions
    const matchingLogs = logs.filter(log => {
      if (log.timestamp < windowStart) return false

      return rule.conditions.every(condition => {
        const value = this.getLogFieldValue(log, condition.field)
        return this.evaluateCondition(value, condition.operator, condition.value)
      })
    })

    // Check if threshold is exceeded
    if (matchingLogs.length >= threshold) {
      // Check if we already have an open alert for this rule
      const existingAlert = this.alerts.find(alert => 
        alert.type === rule.type && 
        alert.status === AlertStatus.OPEN &&
        alert.timestamp > windowStart
      )

      if (!existingAlert) {
        await this.createAlert(rule, matchingLogs)
      }
    }
  }

  // Get field value from log
  private static getLogFieldValue(log: AuditLog, field: string): any {
    const parts = field.split('.')
    let value: any = log

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part]
      } else {
        return undefined
      }
    }

    return value
  }

  // Evaluate condition
  private static evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expected
      case 'contains':
        return typeof value === 'string' && value.includes(expected)
      case 'greater_than':
        return typeof value === 'number' && value > expected
      case 'less_than':
        return typeof value === 'number' && value < expected
      case 'in':
        return Array.isArray(expected) && expected.includes(value)
      case 'not_in':
        return Array.isArray(expected) && !expected.includes(value)
      default:
        return false
    }
  }

  // Create security alert
  private static async createAlert(rule: SecurityRule, matchingLogs: AuditLog[]) {
    const alert: SecurityAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: rule.type,
      severity: rule.severity,
      title: rule.name,
      description: this.generateAlertDescription(rule, matchingLogs),
      timestamp: new Date(),
      relatedLogs: matchingLogs.map(log => log.id),
      status: AlertStatus.OPEN,
      metadata: {
        ruleId: rule.id,
        logCount: matchingLogs.length,
        timeWindow: rule.timeWindow,
        threshold: rule.threshold,
      },
    }

    this.alerts.unshift(alert)

    // Execute rule actions
    for (const action of rule.actions) {
      await this.executeAction(action, alert)
    }

    // Log the alert creation
    await AuditService.createLog({
      userId: 'system',
      username: 'SecurityMonitor',
      userFullName: 'Security Monitor System',
      department: 'System',
      departmentCode: 'SYS',
      action: 'SECURITY_ALERT_CREATED',
      resource: 'SecurityAlert',
      resourceId: alert.id,
      details: {
        alertType: alert.type,
        severity: alert.severity,
        relatedLogCount: matchingLogs.length,
      },
      success: true,
    })
  }

  // Generate alert description
  private static generateAlertDescription(rule: SecurityRule, logs: AuditLog[]): string {
    const logCount = logs.length
    const timeWindow = rule.timeWindow || 60
    const users = [...new Set(logs.map(log => log.username))]
    const ips = [...new Set(logs.map(log => log.ipAddress))]

    let description = `${rule.description}\n\n`
    description += `Detected ${logCount} matching events in the last ${timeWindow} minutes.\n`
    
    if (users.length > 0) {
      description += `Affected users: ${users.join(', ')}\n`
    }
    
    if (ips.length > 0) {
      description += `Source IPs: ${ips.join(', ')}\n`
    }

    return description
  }

  // Execute security action
  private static async executeAction(action: SecurityAction, alert: SecurityAlert) {
    switch (action.type) {
      case 'alert':
        // In a real implementation, this would trigger UI notifications
        console.warn(`Security Alert: ${alert.title}`, alert)
        break
      
      case 'email':
        // In a real implementation, this would send emails
        console.log(`Email alert sent to: ${action.config.recipients?.join(', ')}`)
        break
      
      case 'block_user':
        // In a real implementation, this would block the user
        console.log(`User blocking action triggered for alert: ${alert.id}`)
        break
      
      case 'log':
        await AuditService.createLog({
          userId: 'system',
          username: 'SecurityMonitor',
          userFullName: 'Security Monitor System',
          department: 'System',
          departmentCode: 'SYS',
          action: 'SECURITY_ACTION_EXECUTED',
          resource: 'SecurityAction',
          details: {
            actionType: action.type,
            alertId: alert.id,
            config: action.config,
          },
          success: true,
        })
        break
    }
  }

  // Get security alerts
  static getAlerts(filter?: {
    status?: AlertStatus[]
    severity?: AlertSeverity[]
    type?: SecurityAlertType[]
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): { alerts: SecurityAlert[], total: number } {
    let filteredAlerts = [...this.alerts]

    if (filter) {
      if (filter.status) {
        filteredAlerts = filteredAlerts.filter(alert => 
          filter.status!.includes(alert.status)
        )
      }

      if (filter.severity) {
        filteredAlerts = filteredAlerts.filter(alert => 
          filter.severity!.includes(alert.severity)
        )
      }

      if (filter.type) {
        filteredAlerts = filteredAlerts.filter(alert => 
          filter.type!.includes(alert.type)
        )
      }

      if (filter.startDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.timestamp >= filter.startDate!
        )
      }

      if (filter.endDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.timestamp <= filter.endDate!
        )
      }
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Pagination
    const offset = filter?.offset || 0
    const limit = filter?.limit || 50
    const paginatedAlerts = filteredAlerts.slice(offset, offset + limit)

    return {
      alerts: paginatedAlerts,
      total: filteredAlerts.length,
    }
  }

  // Update alert status
  static async updateAlertStatus(
    alertId: string, 
    status: AlertStatus, 
    assignedTo?: string,
    resolution?: string
  ): Promise<SecurityAlert | null> {
    const alert = this.alerts.find(a => a.id === alertId)
    if (!alert) return null

    alert.status = status
    if (assignedTo) alert.assignedTo = assignedTo
    if (resolution) alert.resolution = resolution
    if (status === AlertStatus.RESOLVED) {
      alert.resolvedAt = new Date()
      alert.resolvedBy = assignedTo
    }

    // Log the status change
    await AuditService.createLog({
      userId: assignedTo || 'system',
      username: assignedTo || 'SecurityMonitor',
      userFullName: assignedTo || 'Security Monitor System',
      department: 'System',
      departmentCode: 'SYS',
      action: 'SECURITY_ALERT_UPDATED',
      resource: 'SecurityAlert',
      resourceId: alertId,
      details: {
        newStatus: status,
        resolution,
      },
      success: true,
    })

    return alert
  }

  // Get security rules
  static getRules(): SecurityRule[] {
    return [...this.rules]
  }

  // Update security rule
  static updateRule(ruleId: string, updates: Partial<SecurityRule>): SecurityRule | null {
    const rule = this.rules.find(r => r.id === ruleId)
    if (!rule) return null

    Object.assign(rule, updates)
    return rule
  }

  // Get security metrics
  static getSecurityMetrics(): {
    totalAlerts: number
    openAlerts: number
    criticalAlerts: number
    alertsByType: Record<SecurityAlertType, number>
    alertsBySeverity: Record<AlertSeverity, number>
    recentAlerts: SecurityAlert[]
  } {
    const totalAlerts = this.alerts.length
    const openAlerts = this.alerts.filter(a => a.status === AlertStatus.OPEN).length
    const criticalAlerts = this.alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length

    const alertsByType = Object.values(SecurityAlertType).reduce((acc, type) => {
      acc[type] = this.alerts.filter(a => a.type === type).length
      return acc
    }, {} as Record<SecurityAlertType, number>)

    const alertsBySeverity = Object.values(AlertSeverity).reduce((acc, severity) => {
      acc[severity] = this.alerts.filter(a => a.severity === severity).length
      return acc
    }, {} as Record<AlertSeverity, number>)

    const recentAlerts = this.alerts.slice(0, 10)

    return {
      totalAlerts,
      openAlerts,
      criticalAlerts,
      alertsByType,
      alertsBySeverity,
      recentAlerts,
    }
  }

  // Generate sample alerts for testing
  static generateSampleAlerts() {
    const sampleAlerts: Partial<SecurityAlert>[] = [
      {
        type: SecurityAlertType.MULTIPLE_FAILED_LOGINS,
        severity: AlertSeverity.HIGH,
        title: 'Multiple Failed Login Attempts',
        description: 'User "budget_officer" has 7 failed login attempts from IP 192.168.1.100',
        status: AlertStatus.OPEN,
      },
      {
        type: SecurityAlertType.BULK_DATA_EXPORT,
        severity: AlertSeverity.HIGH,
        title: 'Large Data Export Detected',
        description: 'User "admin" exported 5,000 budget records',
        status: AlertStatus.INVESTIGATING,
      },
      {
        type: SecurityAlertType.OFF_HOURS_ACCESS,
        severity: AlertSeverity.LOW,
        title: 'Off-Hours System Access',
        description: 'User "viewer" accessed system at 2:30 AM',
        status: AlertStatus.RESOLVED,
      },
    ]

    sampleAlerts.forEach(alertData => {
      const alert: SecurityAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        relatedLogs: [],
        metadata: {},
        ...alertData as SecurityAlert,
      }
      this.alerts.push(alert)
    })
  }
}

// Initialize security monitoring
if (typeof window === 'undefined') {
  SecurityMonitor.initialize()
  SecurityMonitor.generateSampleAlerts()
}