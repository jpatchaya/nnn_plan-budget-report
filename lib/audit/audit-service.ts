// Audit Logging Service
import { 
  AuditLog, 
  LogCategory, 
  LogSeverity, 
  AuditAction,
  AuditFilter,
  AuditStatistics,
  AUDIT_TEMPLATES
} from './types'
import { v4 as uuidv4 } from 'uuid'

// Mock storage for audit logs (in production, use database)
let auditLogs: AuditLog[] = []

// Test helper to clear logs
export const clearAuditLogs = () => {
  auditLogs = []
}

export class AuditService {
  // Create audit log
  static async createLog(params: {
    userId: string
    username: string
    userFullName: string
    department: string
    departmentCode: string
    action: AuditAction | string
    resource?: string
    resourceId?: string
    details?: Record<string, any>
    changes?: { field: string; oldValue: any; newValue: any }[]
    ipAddress?: string
    userAgent?: string
    sessionId?: string
    success?: boolean
    errorMessage?: string
    duration?: number
  }): Promise<AuditLog> {
    // Get template if using predefined action
    const template = params.action in AuditAction 
      ? AUDIT_TEMPLATES[params.action as AuditAction]
      : null

    const log: AuditLog = {
      id: uuidv4(),
      timestamp: new Date(),
      userId: params.userId,
      username: params.username,
      userFullName: params.userFullName,
      department: params.department,
      departmentCode: params.departmentCode,
      category: template?.category || LogCategory.SYSTEM,
      action: params.action,
      resource: params.resource || '',
      resourceId: params.resourceId,
      description: template?.description || params.action,
      details: params.details,
      changes: params.changes,
      severity: template?.severity || LogSeverity.INFO,
      ipAddress: params.ipAddress || 'unknown',
      userAgent: params.userAgent || 'unknown',
      sessionId: params.sessionId,
      success: params.success !== undefined ? params.success : true,
      errorMessage: params.errorMessage,
      duration: params.duration,
    }

    // Adjust severity based on success
    if (!log.success && log.severity === LogSeverity.INFO) {
      log.severity = LogSeverity.WARNING
    }

    // Store log
    auditLogs.unshift(log)

    // Keep only last 10000 logs in memory (in production, use database)
    if (auditLogs.length > 10000) {
      auditLogs = auditLogs.slice(0, 10000)
    }

    // In production, would also:
    // - Store in database
    // - Send to monitoring service
    // - Trigger alerts for critical events
    
    return log
  }

  // Quick log methods for common actions
  static async logLogin(userId: string, username: string, userFullName: string, 
    department: string, departmentCode: string, ipAddress: string, 
    userAgent: string, success: boolean, errorMessage?: string) {
    return this.createLog({
      userId: success ? userId : 'unknown',
      username,
      userFullName: success ? userFullName : 'unknown',
      department: success ? department : 'unknown',
      departmentCode: success ? departmentCode : 'unknown',
      action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
      ipAddress,
      userAgent,
      success,
      errorMessage,
    })
  }

  static async logDataAccess(user: any, resource: string, resourceId: string, 
    action: 'view' | 'export' | 'update' | 'delete') {
    const actionMap = {
      view: AuditAction.DATA_VIEW,
      export: AuditAction.DATA_EXPORT,
      update: AuditAction.DATA_UPDATE,
      delete: AuditAction.DATA_DELETE,
    }

    return this.createLog({
      userId: user.id,
      username: user.username,
      userFullName: `${user.firstName} ${user.lastName}`,
      department: user.department,
      departmentCode: user.departmentCode,
      action: actionMap[action],
      resource,
      resourceId,
      details: { action },
    })
  }

  static async logSecurityEvent(userId: string, action: AuditAction, 
    details: Record<string, any>, ipAddress: string) {
    return this.createLog({
      userId,
      username: details.username || 'unknown',
      userFullName: 'unknown',
      department: 'unknown',
      departmentCode: 'unknown',
      action,
      details,
      ipAddress,
      userAgent: details.userAgent || 'unknown',
      success: false,
    })
  }

  // Get audit logs with filtering
  static async getLogs(filter?: AuditFilter): Promise<{
    logs: AuditLog[]
    total: number
  }> {
    let filteredLogs = [...auditLogs]

    if (filter) {
      // Date range filter
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter(log => 
          log.timestamp >= filter.startDate!
        )
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter(log => 
          log.timestamp <= filter.endDate!
        )
      }

      // User filter
      if (filter.userId) {
        filteredLogs = filteredLogs.filter(log => 
          log.userId === filter.userId
        )
      }
      if (filter.username) {
        filteredLogs = filteredLogs.filter(log => 
          log.username.toLowerCase().includes(filter.username!.toLowerCase())
        )
      }

      // Department filter
      if (filter.department) {
        filteredLogs = filteredLogs.filter(log => 
          log.department === filter.department
        )
      }

      // Category filter
      if (filter.category && filter.category.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filter.category!.includes(log.category)
        )
      }

      // Action filter
      if (filter.action && filter.action.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filter.action!.includes(log.action)
        )
      }

      // Severity filter
      if (filter.severity && filter.severity.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filter.severity!.includes(log.severity)
        )
      }

      // Success filter
      if (filter.success !== undefined) {
        filteredLogs = filteredLogs.filter(log => 
          log.success === filter.success
        )
      }

      // Search term
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase()
        filteredLogs = filteredLogs.filter(log => 
          log.description.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term) ||
          log.username.toLowerCase().includes(term) ||
          log.resource.toLowerCase().includes(term) ||
          (log.details ? JSON.stringify(log.details).toLowerCase().includes(term) : false)
        )
      }

      // Sorting
      const sortBy = filter.sortBy || 'timestamp'
      const sortOrder = filter.sortOrder || 'desc'
      
      filteredLogs.sort((a, b) => {
        let compareValue = 0
        
        switch (sortBy) {
          case 'timestamp':
            compareValue = a.timestamp.getTime() - b.timestamp.getTime()
            break
          case 'user':
            compareValue = a.username.localeCompare(b.username)
            break
          case 'action':
            compareValue = a.action.localeCompare(b.action)
            break
          case 'severity': {
            const severityOrder = {
              [LogSeverity.DEBUG]: 0,
              [LogSeverity.INFO]: 1,
              [LogSeverity.WARNING]: 2,
              [LogSeverity.ERROR]: 3,
              [LogSeverity.CRITICAL]: 4,
            }
            compareValue = severityOrder[a.severity] - severityOrder[b.severity]
            break
          }
        }
        
        return sortOrder === 'asc' ? compareValue : -compareValue
      })
    }

    // Pagination
    const offset = filter?.offset || 0
    const limit = filter?.limit || 100
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
    }
  }

  // Get audit statistics
  static async getStatistics(filter?: AuditFilter): Promise<AuditStatistics> {
    const { logs } = await this.getLogs(filter)

    // Count by category
    const byCategory = Object.values(LogCategory).reduce((acc, cat) => {
      acc[cat] = logs.filter(log => log.category === cat).length
      return acc
    }, {} as Record<LogCategory, number>)

    // Count by severity
    const bySeverity = Object.values(LogSeverity).reduce((acc, sev) => {
      acc[sev] = logs.filter(log => log.severity === sev).length
      return acc
    }, {} as Record<LogSeverity, number>)

    // Count by user (top 10)
    const userCounts = new Map<string, { username: string; count: number }>()
    logs.forEach(log => {
      const key = log.userId
      const current = userCounts.get(key) || { username: log.username, count: 0 }
      current.count++
      userCounts.set(key, current)
    })
    const byUser = Array.from(userCounts.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Count by department (top 10)
    const deptCounts = new Map<string, number>()
    logs.forEach(log => {
      const count = deptCounts.get(log.department) || 0
      deptCounts.set(log.department, count + 1)
    })
    const byDepartment = Array.from(deptCounts.entries())
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Recent activities (last 10)
    const recentActivities = logs.slice(0, 10)

    // Security metrics
    const failedLogins = logs.filter(log => 
      log.action === AuditAction.LOGIN_FAILED
    ).length

    const suspiciousActivities = logs.filter(log => 
      log.action === AuditAction.SUSPICIOUS_ACTIVITY ||
      log.action === AuditAction.DATA_BREACH_ATTEMPT
    ).length

    const criticalEvents = logs.filter(log => 
      log.severity === LogSeverity.CRITICAL
    ).length

    return {
      totalLogs: logs.length,
      byCategory,
      bySeverity,
      byUser,
      byDepartment,
      recentActivities,
      failedLogins,
      suspiciousActivities,
      criticalEvents,
    }
  }

  // Export audit logs
  static async exportLogs(filter?: AuditFilter, format: 'csv' | 'json' = 'json'): Promise<string> {
    const { logs } = await this.getLogs(filter)

    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }

    // CSV format
    const headers = [
      'Timestamp',
      'User',
      'Department',
      'Category',
      'Action',
      'Resource',
      'Description',
      'Severity',
      'Success',
      'IP Address',
    ]

    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.username,
      log.department,
      log.category,
      log.action,
      log.resource,
      log.description,
      log.severity,
      log.success ? 'Yes' : 'No',
      log.ipAddress,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csv
  }

  // Clean old logs (retention policy)
  static async cleanOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const beforeCount = auditLogs.length
    auditLogs = auditLogs.filter(log => log.timestamp > cutoffDate)
    const afterCount = auditLogs.length

    return beforeCount - afterCount
  }

  // Log user session events
  static async logSessionEvent(
    userId: string,
    username: string,
    userFullName: string,
    department: string,
    departmentCode: string,
    action: 'session_start' | 'session_end' | 'session_timeout',
    sessionId: string,
    ipAddress: string,
    userAgent: string
  ) {
    const actionMap = {
      session_start: AuditAction.LOGIN,
      session_end: AuditAction.LOGOUT,
      session_timeout: AuditAction.SESSION_EXPIRED,
    }

    return this.createLog({
      userId,
      username,
      userFullName,
      department,
      departmentCode,
      action: actionMap[action],
      sessionId,
      ipAddress,
      userAgent,
      success: true,
    })
  }

  // Log system configuration changes
  static async logSystemChange(
    user: any,
    configType: string,
    changes: { field: string; oldValue: any; newValue: any }[],
    ipAddress: string
  ) {
    return this.createLog({
      userId: user.id,
      username: user.username,
      userFullName: `${user.firstName} ${user.lastName}`,
      department: user.department,
      departmentCode: user.departmentCode,
      action: AuditAction.SYSTEM_CONFIG,
      resource: 'SystemConfiguration',
      resourceId: configType,
      changes,
      ipAddress,
      userAgent: 'System',
      success: true,
    })
  }

  // Log budget operations with detailed tracking
  static async logBudgetOperation(
    user: any,
    operation: 'create' | 'update' | 'delete' | 'submit' | 'approve' | 'reject' | 'transfer',
    budgetId: string,
    details: Record<string, any>,
    changes?: { field: string; oldValue: any; newValue: any }[]
  ) {
    const actionMap = {
      create: AuditAction.BUDGET_CREATE,
      update: AuditAction.BUDGET_UPDATE,
      delete: AuditAction.BUDGET_DELETE,
      submit: AuditAction.BUDGET_SUBMIT,
      approve: AuditAction.BUDGET_APPROVE,
      reject: AuditAction.BUDGET_REJECT,
      transfer: AuditAction.BUDGET_TRANSFER,
    }

    return this.createLog({
      userId: user.id,
      username: user.username,
      userFullName: `${user.firstName} ${user.lastName}`,
      department: user.department,
      departmentCode: user.departmentCode,
      action: actionMap[operation],
      resource: 'Budget',
      resourceId: budgetId,
      details,
      changes,
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      success: true,
    })
  }

  // Log report generation and access
  static async logReportAccess(
    user: any,
    reportType: string,
    reportId: string,
    action: 'view' | 'generate' | 'export' | 'schedule',
    details: Record<string, any>
  ) {
    const actionMap = {
      view: AuditAction.REPORT_VIEW,
      generate: AuditAction.REPORT_GENERATE,
      export: AuditAction.REPORT_EXPORT,
      schedule: AuditAction.REPORT_SCHEDULE,
    }

    return this.createLog({
      userId: user.id,
      username: user.username,
      userFullName: `${user.firstName} ${user.lastName}`,
      department: user.department,
      departmentCode: user.departmentCode,
      action: actionMap[action],
      resource: 'Report',
      resourceId: reportId,
      details: {
        reportType,
        ...details,
      },
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      success: true,
    })
  }

  // Log user management operations
  static async logUserManagement(
    adminUser: any,
    targetUserId: string,
    targetUsername: string,
    operation: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'role_assign' | 'permission_grant' | 'permission_revoke',
    details: Record<string, any>,
    changes?: { field: string; oldValue: any; newValue: any }[]
  ) {
    const actionMap = {
      create: AuditAction.USER_CREATE,
      update: AuditAction.USER_UPDATE,
      delete: AuditAction.USER_DELETE,
      activate: AuditAction.USER_ACTIVATE,
      deactivate: AuditAction.USER_DEACTIVATE,
      role_assign: AuditAction.ROLE_ASSIGN,
      permission_grant: AuditAction.PERMISSION_GRANT,
      permission_revoke: AuditAction.PERMISSION_REVOKE,
    }

    return this.createLog({
      userId: adminUser.id,
      username: adminUser.username,
      userFullName: `${adminUser.firstName} ${adminUser.lastName}`,
      department: adminUser.department,
      departmentCode: adminUser.departmentCode,
      action: actionMap[operation],
      resource: 'User',
      resourceId: targetUserId,
      details: {
        targetUsername,
        ...details,
      },
      changes,
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      success: true,
    })
  }

  // Log integration events (DPIS, ThaID, etc.)
  static async logIntegrationEvent(
    system: string,
    operation: string,
    success: boolean,
    details: Record<string, any>,
    errorMessage?: string
  ) {
    return this.createLog({
      userId: 'system',
      username: 'IntegrationService',
      userFullName: 'Integration Service',
      department: 'System',
      departmentCode: 'SYS',
      action: `INTEGRATION_${operation.toUpperCase()}`,
      resource: system,
      details,
      success,
      errorMessage,
      ipAddress: 'system',
      userAgent: 'IntegrationService',
    })
  }

  // Batch log creation for bulk operations
  static async createBatchLogs(logs: Array<Parameters<typeof AuditService.createLog>[0]>): Promise<AuditLog[]> {
    const createdLogs: AuditLog[] = []
    
    for (const logParams of logs) {
      try {
        const log = await this.createLog(logParams)
        createdLogs.push(log)
      } catch (error) {
        console.error('Failed to create audit log:', error)
      }
    }
    
    return createdLogs
  }

  // Get audit trail for specific resource
  static async getResourceAuditTrail(
    resource: string,
    resourceId: string,
    limit: number = 100
  ): Promise<AuditLog[]> {
    const { logs } = await this.getLogs({
      limit,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    })

    return logs.filter(log => 
      log.resource === resource && log.resourceId === resourceId
    )
  }

  // Get user activity summary
  static async getUserActivitySummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalActions: number
    actionsByCategory: Record<LogCategory, number>
    recentActions: AuditLog[]
    failedActions: number
  }> {
    const { logs } = await this.getLogs({
      userId,
      startDate,
      endDate,
      limit: 1000,
    })

    const actionsByCategory = Object.values(LogCategory).reduce((acc, cat) => {
      acc[cat] = logs.filter(log => log.category === cat).length
      return acc
    }, {} as Record<LogCategory, number>)

    const recentActions = logs.slice(0, 10)
    const failedActions = logs.filter(log => !log.success).length

    return {
      totalActions: logs.length,
      actionsByCategory,
      recentActions,
      failedActions,
    }
  }

  // Generate sample audit logs for testing
  static generateSampleLogs(): void {
    const sampleActions = [
      { action: AuditAction.LOGIN, success: true },
      { action: AuditAction.LOGIN_FAILED, success: false },
      { action: AuditAction.USER_CREATE, success: true },
      { action: AuditAction.BUDGET_CREATE, success: true },
      { action: AuditAction.BUDGET_APPROVE, success: true },
      { action: AuditAction.DATA_EXPORT, success: true },
      { action: AuditAction.REPORT_VIEW, success: true },
      { action: AuditAction.PERMISSION_DENIED, success: false },
      { action: AuditAction.SYSTEM_CONFIG, success: true },
      { action: AuditAction.DATA_IMPORT, success: true },
      { action: AuditAction.BUDGET_TRANSFER, success: true },
      { action: AuditAction.UNAUTHORIZED_ACCESS, success: false },
    ]

    const users = [
      { id: '1', username: 'admin', name: 'Admin User', dept: 'กองแผนงาน', code: 'DNP-PL' },
      { id: '2', username: 'budget_officer', name: 'Budget Officer', dept: 'กองการเงิน', code: 'DNP-FIN' },
      { id: '3', username: 'viewer', name: 'Viewer User', dept: 'กองบุคคล', code: 'DNP-HR' },
      { id: '4', username: 'security_admin', name: 'Security Admin', dept: 'กองเทคโนโลยี', code: 'DNP-IT' },
    ]

    const resources = ['Budget', 'User', 'Report', 'System', 'MasterData']

    // Generate 100 sample logs with more variety
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const actionInfo = sampleActions[Math.floor(Math.random() * sampleActions.length)]
      const resource = resources[Math.floor(Math.random() * resources.length)]
      
      const timestamp = new Date()
      timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 168)) // Random time in last week

      this.createLog({
        userId: user.id,
        username: user.username,
        userFullName: user.name,
        department: user.dept,
        departmentCode: user.code,
        action: actionInfo.action,
        resource,
        resourceId: `${resource.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        details: {
          sampleData: true,
          randomValue: Math.floor(Math.random() * 100),
        },
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Sample Browser)',
        success: actionInfo.success,
        errorMessage: actionInfo.success ? undefined : 'Sample error message',
        duration: Math.floor(Math.random() * 5000), // Random duration up to 5 seconds
      })
    }
  }
}

// Generate sample logs on initialization (for demo)
if (typeof window === 'undefined') {
  AuditService.generateSampleLogs()
}