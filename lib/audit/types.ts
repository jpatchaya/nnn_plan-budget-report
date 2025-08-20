// Audit Logging Types and Interfaces

export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  username: string
  userFullName: string
  department: string
  departmentCode: string
  category: LogCategory
  action: string
  resource: string
  resourceId?: string
  description: string
  details?: Record<string, any>
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  severity: LogSeverity
  ipAddress: string
  userAgent: string
  sessionId?: string
  success: boolean
  errorMessage?: string
  duration?: number // milliseconds
}

export enum LogCategory {
  AUTH = 'AUTH',
  USER = 'USER',
  BUDGET = 'BUDGET',
  MASTER_DATA = 'MASTER_DATA',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  DATA_ACCESS = 'DATA_ACCESS',
  INTEGRATION = 'INTEGRATION',
}

export enum LogSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  MFA_VERIFY = 'MFA_VERIFY',
  MFA_FAILED = 'MFA_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ACTIVATE = 'USER_ACTIVATE',
  USER_DEACTIVATE = 'USER_DEACTIVATE',
  ROLE_ASSIGN = 'ROLE_ASSIGN',
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
  
  // Budget Operations
  BUDGET_CREATE = 'BUDGET_CREATE',
  BUDGET_UPDATE = 'BUDGET_UPDATE',
  BUDGET_DELETE = 'BUDGET_DELETE',
  BUDGET_SUBMIT = 'BUDGET_SUBMIT',
  BUDGET_APPROVE = 'BUDGET_APPROVE',
  BUDGET_REJECT = 'BUDGET_REJECT',
  BUDGET_TRANSFER = 'BUDGET_TRANSFER',
  
  // Data Operations
  DATA_VIEW = 'DATA_VIEW',
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_IMPORT = 'DATA_IMPORT',
  DATA_UPDATE = 'DATA_UPDATE',
  DATA_DELETE = 'DATA_DELETE',
  
  // Report Operations
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_GENERATE = 'REPORT_GENERATE',
  REPORT_EXPORT = 'REPORT_EXPORT',
  REPORT_SCHEDULE = 'REPORT_SCHEDULE',
  
  // System Operations
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  BACKUP_CREATE = 'BACKUP_CREATE',
  BACKUP_RESTORE = 'BACKUP_RESTORE',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
  
  // Security Events
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DATA_BREACH_ATTEMPT = 'DATA_BREACH_ATTEMPT',
}

export interface AuditFilter {
  startDate?: Date
  endDate?: Date
  userId?: string
  username?: string
  department?: string
  category?: LogCategory[]
  action?: string[]
  severity?: LogSeverity[]
  success?: boolean
  searchTerm?: string
  limit?: number
  offset?: number
  sortBy?: 'timestamp' | 'user' | 'action' | 'severity'
  sortOrder?: 'asc' | 'desc'
}

export interface AuditStatistics {
  totalLogs: number
  byCategory: Record<LogCategory, number>
  bySeverity: Record<LogSeverity, number>
  byUser: { userId: string; username: string; count: number }[]
  byDepartment: { department: string; count: number }[]
  recentActivities: AuditLog[]
  failedLogins: number
  suspiciousActivities: number
  criticalEvents: number
}

export interface AuditExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf'
  filter: AuditFilter
  columns?: string[]
  includeDetails?: boolean
  dateFormat?: string
}

// Audit log templates for common actions
export const AUDIT_TEMPLATES = {
  [AuditAction.LOGIN]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'User logged in successfully',
  },
  [AuditAction.LOGIN_FAILED]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.WARNING,
    description: 'Login attempt failed',
  },
  [AuditAction.LOGOUT]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'User logged out',
  },
  [AuditAction.MFA_VERIFY]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'MFA verification successful',
  },
  [AuditAction.MFA_FAILED]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.WARNING,
    description: 'MFA verification failed',
  },
  [AuditAction.PASSWORD_CHANGE]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'Password changed successfully',
  },
  [AuditAction.PASSWORD_RESET]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'Password reset requested',
  },
  [AuditAction.SESSION_EXPIRED]: {
    category: LogCategory.AUTH,
    severity: LogSeverity.INFO,
    description: 'User session expired',
  },
  [AuditAction.USER_CREATE]: {
    category: LogCategory.USER,
    severity: LogSeverity.INFO,
    description: 'New user created',
  },
  [AuditAction.USER_UPDATE]: {
    category: LogCategory.USER,
    severity: LogSeverity.INFO,
    description: 'User information updated',
  },
  [AuditAction.USER_DELETE]: {
    category: LogCategory.USER,
    severity: LogSeverity.WARNING,
    description: 'User deleted from system',
  },
  [AuditAction.USER_ACTIVATE]: {
    category: LogCategory.USER,
    severity: LogSeverity.INFO,
    description: 'User account activated',
  },
  [AuditAction.USER_DEACTIVATE]: {
    category: LogCategory.USER,
    severity: LogSeverity.WARNING,
    description: 'User account deactivated',
  },
  [AuditAction.ROLE_ASSIGN]: {
    category: LogCategory.USER,
    severity: LogSeverity.INFO,
    description: 'Role assigned to user',
  },
  [AuditAction.PERMISSION_GRANT]: {
    category: LogCategory.USER,
    severity: LogSeverity.INFO,
    description: 'Permission granted to user',
  },
  [AuditAction.PERMISSION_REVOKE]: {
    category: LogCategory.USER,
    severity: LogSeverity.WARNING,
    description: 'Permission revoked from user',
  },
  [AuditAction.BUDGET_CREATE]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.INFO,
    description: 'Budget request created',
  },
  [AuditAction.BUDGET_UPDATE]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.INFO,
    description: 'Budget updated',
  },
  [AuditAction.BUDGET_DELETE]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.WARNING,
    description: 'Budget deleted',
  },
  [AuditAction.BUDGET_SUBMIT]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.INFO,
    description: 'Budget submitted for approval',
  },
  [AuditAction.BUDGET_APPROVE]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.INFO,
    description: 'Budget request approved',
  },
  [AuditAction.BUDGET_REJECT]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.WARNING,
    description: 'Budget request rejected',
  },
  [AuditAction.BUDGET_TRANSFER]: {
    category: LogCategory.BUDGET,
    severity: LogSeverity.INFO,
    description: 'Budget transferred',
  },
  [AuditAction.DATA_VIEW]: {
    category: LogCategory.DATA_ACCESS,
    severity: LogSeverity.INFO,
    description: 'Data viewed',
  },
  [AuditAction.DATA_EXPORT]: {
    category: LogCategory.DATA_ACCESS,
    severity: LogSeverity.INFO,
    description: 'Data exported from system',
  },
  [AuditAction.DATA_IMPORT]: {
    category: LogCategory.DATA_ACCESS,
    severity: LogSeverity.INFO,
    description: 'Data imported to system',
  },
  [AuditAction.DATA_UPDATE]: {
    category: LogCategory.DATA_ACCESS,
    severity: LogSeverity.INFO,
    description: 'Data updated',
  },
  [AuditAction.DATA_DELETE]: {
    category: LogCategory.DATA_ACCESS,
    severity: LogSeverity.WARNING,
    description: 'Data deleted',
  },
  [AuditAction.REPORT_VIEW]: {
    category: LogCategory.REPORT,
    severity: LogSeverity.INFO,
    description: 'Report viewed',
  },
  [AuditAction.REPORT_GENERATE]: {
    category: LogCategory.REPORT,
    severity: LogSeverity.INFO,
    description: 'Report generated',
  },
  [AuditAction.REPORT_EXPORT]: {
    category: LogCategory.REPORT,
    severity: LogSeverity.INFO,
    description: 'Report exported',
  },
  [AuditAction.REPORT_SCHEDULE]: {
    category: LogCategory.REPORT,
    severity: LogSeverity.INFO,
    description: 'Report scheduled',
  },
  [AuditAction.SYSTEM_CONFIG]: {
    category: LogCategory.SYSTEM,
    severity: LogSeverity.WARNING,
    description: 'System configuration changed',
  },
  [AuditAction.BACKUP_CREATE]: {
    category: LogCategory.SYSTEM,
    severity: LogSeverity.INFO,
    description: 'System backup created',
  },
  [AuditAction.BACKUP_RESTORE]: {
    category: LogCategory.SYSTEM,
    severity: LogSeverity.WARNING,
    description: 'System restored from backup',
  },
  [AuditAction.MAINTENANCE_MODE]: {
    category: LogCategory.SYSTEM,
    severity: LogSeverity.WARNING,
    description: 'System maintenance mode changed',
  },
  [AuditAction.UNAUTHORIZED_ACCESS]: {
    category: LogCategory.SECURITY,
    severity: LogSeverity.CRITICAL,
    description: 'Unauthorized access attempt detected',
  },
  [AuditAction.SUSPICIOUS_ACTIVITY]: {
    category: LogCategory.SECURITY,
    severity: LogSeverity.WARNING,
    description: 'Suspicious activity detected',
  },
  [AuditAction.PERMISSION_DENIED]: {
    category: LogCategory.SECURITY,
    severity: LogSeverity.WARNING,
    description: 'Permission denied for requested action',
  },
  [AuditAction.DATA_BREACH_ATTEMPT]: {
    category: LogCategory.SECURITY,
    severity: LogSeverity.CRITICAL,
    description: 'Data breach attempt detected',
  },
}

// Helper to get severity color
export function getSeverityColor(severity: LogSeverity): string {
  const colors: Record<LogSeverity, string> = {
    [LogSeverity.DEBUG]: 'text-gray-500',
    [LogSeverity.INFO]: 'text-blue-600',
    [LogSeverity.WARNING]: 'text-yellow-600',
    [LogSeverity.ERROR]: 'text-red-600',
    [LogSeverity.CRITICAL]: 'text-red-800 font-bold',
  }
  return colors[severity] || 'text-gray-600'
}

// Helper to get category icon
export function getCategoryIcon(category: LogCategory): string {
  const icons: Record<LogCategory, string> = {
    [LogCategory.AUTH]: '🔐',
    [LogCategory.USER]: '👤',
    [LogCategory.BUDGET]: '💰',
    [LogCategory.MASTER_DATA]: '📊',
    [LogCategory.REPORT]: '📈',
    [LogCategory.SYSTEM]: '⚙️',
    [LogCategory.SECURITY]: '🛡️',
    [LogCategory.DATA_ACCESS]: '📁',
    [LogCategory.INTEGRATION]: '🔗',
  }
  return icons[category] || '📝'
}