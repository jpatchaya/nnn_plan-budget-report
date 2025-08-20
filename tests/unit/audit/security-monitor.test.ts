import { SecurityMonitor, AlertSeverity, AlertStatus, SecurityAlertType } from '@/lib/audit/security-monitor'
import { AuditService, clearAuditLogs } from '@/lib/audit/audit-service'
import { AuditAction, LogSeverity } from '@/lib/audit/types'

// Mock AuditService
jest.mock('@/lib/audit/audit-service')
const mockAuditService = AuditService as jest.Mocked<typeof AuditService>

describe('SecurityMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearAuditLogs()
    // Reset SecurityMonitor state
    SecurityMonitor['alerts'] = []
    SecurityMonitor['rules'] = []
    SecurityMonitor['isMonitoring'] = false
  })

  describe('initialize', () => {
    it('should initialize security monitoring with default rules', () => {
      SecurityMonitor.initialize()

      const rules = SecurityMonitor.getRules()
      expect(rules.length).toBeGreaterThan(0)
      expect(rules.some(rule => rule.type === SecurityAlertType.MULTIPLE_FAILED_LOGINS)).toBe(true)
      expect(rules.some(rule => rule.type === SecurityAlertType.UNAUTHORIZED_ACCESS_ATTEMPT)).toBe(true)
    })

    it('should not reinitialize if already monitoring', () => {
      SecurityMonitor.initialize()
      const initialRulesCount = SecurityMonitor.getRules().length

      SecurityMonitor.initialize()
      const finalRulesCount = SecurityMonitor.getRules().length

      expect(finalRulesCount).toBe(initialRulesCount)
    })
  })

  describe('getAlerts', () => {
    beforeEach(() => {
      SecurityMonitor.initialize()
      SecurityMonitor.generateSampleAlerts()
    })

    it('should return all alerts without filter', () => {
      const { alerts, total } = SecurityMonitor.getAlerts()

      expect(alerts.length).toBeGreaterThan(0)
      expect(total).toBe(alerts.length)
    })

    it('should filter alerts by status', () => {
      const { alerts } = SecurityMonitor.getAlerts({
        status: [AlertStatus.OPEN],
      })

      alerts.forEach(alert => {
        expect(alert.status).toBe(AlertStatus.OPEN)
      })
    })

    it('should filter alerts by severity', () => {
      const { alerts } = SecurityMonitor.getAlerts({
        severity: [AlertSeverity.HIGH, AlertSeverity.CRITICAL],
      })

      alerts.forEach(alert => {
        expect([AlertSeverity.HIGH, AlertSeverity.CRITICAL]).toContain(alert.severity)
      })
    })

    it('should filter alerts by type', () => {
      const { alerts } = SecurityMonitor.getAlerts({
        type: [SecurityAlertType.MULTIPLE_FAILED_LOGINS],
      })

      alerts.forEach(alert => {
        expect(alert.type).toBe(SecurityAlertType.MULTIPLE_FAILED_LOGINS)
      })
    })

    it('should filter alerts by date range', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      const { alerts } = SecurityMonitor.getAlerts({
        startDate: oneHourAgo,
        endDate: now,
      })

      alerts.forEach(alert => {
        expect(alert.timestamp.getTime()).toBeGreaterThanOrEqual(oneHourAgo.getTime())
        expect(alert.timestamp.getTime()).toBeLessThanOrEqual(now.getTime())
      })
    })

    it('should paginate results', () => {
      const { alerts: page1 } = SecurityMonitor.getAlerts({
        limit: 1,
        offset: 0,
      })

      const { alerts: page2 } = SecurityMonitor.getAlerts({
        limit: 1,
        offset: 1,
      })

      expect(page1).toHaveLength(1)
      expect(page2).toHaveLength(1)
      expect(page1[0].id).not.toBe(page2[0].id)
    })
  })

  describe('updateAlertStatus', () => {
    beforeEach(() => {
      SecurityMonitor.initialize()
      SecurityMonitor.generateSampleAlerts()
    })

    it('should update alert status successfully', async () => {
      const { alerts } = SecurityMonitor.getAlerts()
      const alertToUpdate = alerts[0]

      mockAuditService.createLog.mockResolvedValue({} as any)

      const updatedAlert = await SecurityMonitor.updateAlertStatus(
        alertToUpdate.id,
        AlertStatus.INVESTIGATING,
        'security-admin',
        'Under investigation'
      )

      expect(updatedAlert).not.toBeNull()
      expect(updatedAlert!.status).toBe(AlertStatus.INVESTIGATING)
      expect(updatedAlert!.assignedTo).toBe('security-admin')
      expect(updatedAlert!.resolution).toBe('Under investigation')
    })

    it('should mark alert as resolved with timestamp', async () => {
      const { alerts } = SecurityMonitor.getAlerts()
      const alertToUpdate = alerts[0]

      mockAuditService.createLog.mockResolvedValue({} as any)

      const updatedAlert = await SecurityMonitor.updateAlertStatus(
        alertToUpdate.id,
        AlertStatus.RESOLVED,
        'security-admin',
        'False positive - user was testing system'
      )

      expect(updatedAlert!.status).toBe(AlertStatus.RESOLVED)
      expect(updatedAlert!.resolvedAt).toBeInstanceOf(Date)
      expect(updatedAlert!.resolvedBy).toBe('security-admin')
    })

    it('should return null for non-existent alert', async () => {
      const result = await SecurityMonitor.updateAlertStatus(
        'non-existent-id',
        AlertStatus.RESOLVED
      )

      expect(result).toBeNull()
    })

    it('should log the status change', async () => {
      const { alerts } = SecurityMonitor.getAlerts()
      const alertToUpdate = alerts[0]

      mockAuditService.createLog.mockResolvedValue({} as any)

      await SecurityMonitor.updateAlertStatus(
        alertToUpdate.id,
        AlertStatus.RESOLVED,
        'security-admin'
      )

      expect(mockAuditService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'SECURITY_ALERT_UPDATED',
          resource: 'SecurityAlert',
          resourceId: alertToUpdate.id,
          details: expect.objectContaining({
            newStatus: AlertStatus.RESOLVED,
          }),
        })
      )
    })
  })

  describe('getRules', () => {
    beforeEach(() => {
      SecurityMonitor.initialize()
    })

    it('should return all security rules', () => {
      const rules = SecurityMonitor.getRules()

      expect(rules.length).toBeGreaterThan(0)
      expect(rules[0]).toHaveProperty('id')
      expect(rules[0]).toHaveProperty('name')
      expect(rules[0]).toHaveProperty('enabled')
      expect(rules[0]).toHaveProperty('conditions')
      expect(rules[0]).toHaveProperty('actions')
    })

    it('should include default rules', () => {
      const rules = SecurityMonitor.getRules()
      const ruleTypes = rules.map(rule => rule.type)

      expect(ruleTypes).toContain(SecurityAlertType.MULTIPLE_FAILED_LOGINS)
      expect(ruleTypes).toContain(SecurityAlertType.UNAUTHORIZED_ACCESS_ATTEMPT)
      expect(ruleTypes).toContain(SecurityAlertType.BULK_DATA_EXPORT)
      expect(ruleTypes).toContain(SecurityAlertType.OFF_HOURS_ACCESS)
      expect(ruleTypes).toContain(SecurityAlertType.SYSTEM_CONFIGURATION_CHANGE)
    })
  })

  describe('updateRule', () => {
    beforeEach(() => {
      SecurityMonitor.initialize()
    })

    it('should update existing rule', () => {
      const rules = SecurityMonitor.getRules()
      const ruleToUpdate = rules[0]

      const updatedRule = SecurityMonitor.updateRule(ruleToUpdate.id, {
        enabled: false,
        threshold: 10,
      })

      expect(updatedRule).not.toBeNull()
      expect(updatedRule!.enabled).toBe(false)
      expect(updatedRule!.threshold).toBe(10)
    })

    it('should return null for non-existent rule', () => {
      const result = SecurityMonitor.updateRule('non-existent-id', {
        enabled: false,
      })

      expect(result).toBeNull()
    })
  })

  describe('getSecurityMetrics', () => {
    beforeEach(() => {
      SecurityMonitor.initialize()
      SecurityMonitor.generateSampleAlerts()
    })

    it('should return comprehensive security metrics', () => {
      const metrics = SecurityMonitor.getSecurityMetrics()

      expect(metrics).toHaveProperty('totalAlerts')
      expect(metrics).toHaveProperty('openAlerts')
      expect(metrics).toHaveProperty('criticalAlerts')
      expect(metrics).toHaveProperty('alertsByType')
      expect(metrics).toHaveProperty('alertsBySeverity')
      expect(metrics).toHaveProperty('recentAlerts')

      expect(typeof metrics.totalAlerts).toBe('number')
      expect(typeof metrics.openAlerts).toBe('number')
      expect(typeof metrics.criticalAlerts).toBe('number')
      expect(Array.isArray(metrics.recentAlerts)).toBe(true)
    })

    it('should calculate metrics correctly', () => {
      const { alerts } = SecurityMonitor.getAlerts()
      const metrics = SecurityMonitor.getSecurityMetrics()

      const expectedOpenAlerts = alerts.filter(a => a.status === AlertStatus.OPEN).length
      const expectedCriticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length

      expect(metrics.totalAlerts).toBe(alerts.length)
      expect(metrics.openAlerts).toBe(expectedOpenAlerts)
      expect(metrics.criticalAlerts).toBe(expectedCriticalAlerts)
    })
  })

  describe('evaluateCondition', () => {
    it('should evaluate equals condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition']('test', 'equals', 'test')
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition']('test', 'equals', 'other')
      expect(result2).toBe(false)
    })

    it('should evaluate contains condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition']('hello world', 'contains', 'world')
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition']('hello world', 'contains', 'xyz')
      expect(result2).toBe(false)
    })

    it('should evaluate greater_than condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition'](10, 'greater_than', 5)
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition'](3, 'greater_than', 5)
      expect(result2).toBe(false)
    })

    it('should evaluate less_than condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition'](3, 'less_than', 5)
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition'](10, 'less_than', 5)
      expect(result2).toBe(false)
    })

    it('should evaluate in condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition']('apple', 'in', ['apple', 'banana', 'orange'])
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition']('grape', 'in', ['apple', 'banana', 'orange'])
      expect(result2).toBe(false)
    })

    it('should evaluate not_in condition correctly', () => {
      const result = SecurityMonitor['evaluateCondition']('grape', 'not_in', ['apple', 'banana', 'orange'])
      expect(result).toBe(true)

      const result2 = SecurityMonitor['evaluateCondition']('apple', 'not_in', ['apple', 'banana', 'orange'])
      expect(result2).toBe(false)
    })
  })

  describe('getLogFieldValue', () => {
    const mockLog = {
      id: 'log-123',
      action: AuditAction.LOGIN,
      details: {
        recordCount: 1000,
        nested: {
          value: 'test',
        },
      },
      severity: LogSeverity.INFO,
    } as any

    it('should get top-level field value', () => {
      const value = SecurityMonitor['getLogFieldValue'](mockLog, 'action')
      expect(value).toBe(AuditAction.LOGIN)
    })

    it('should get nested field value', () => {
      const value = SecurityMonitor['getLogFieldValue'](mockLog, 'details.recordCount')
      expect(value).toBe(1000)
    })

    it('should get deeply nested field value', () => {
      const value = SecurityMonitor['getLogFieldValue'](mockLog, 'details.nested.value')
      expect(value).toBe('test')
    })

    it('should return undefined for non-existent field', () => {
      const value = SecurityMonitor['getLogFieldValue'](mockLog, 'nonexistent.field')
      expect(value).toBeUndefined()
    })
  })

  describe('generateAlertDescription', () => {
    const mockRule = {
      id: 'test-rule',
      name: 'Test Rule',
      description: 'Test rule description',
      timeWindow: 15,
    } as any

    const mockLogs = [
      {
        id: 'log-1',
        username: 'user1',
        ipAddress: '192.168.1.1',
      },
      {
        id: 'log-2',
        username: 'user2',
        ipAddress: '192.168.1.2',
      },
      {
        id: 'log-3',
        username: 'user1',
        ipAddress: '192.168.1.1',
      },
    ] as any[]

    it('should generate comprehensive alert description', () => {
      const description = SecurityMonitor['generateAlertDescription'](mockRule, mockLogs)

      expect(description).toContain('Test rule description')
      expect(description).toContain('3 matching events')
      expect(description).toContain('15 minutes')
      expect(description).toContain('user1, user2')
      expect(description).toContain('192.168.1.1, 192.168.1.2')
    })
  })
})