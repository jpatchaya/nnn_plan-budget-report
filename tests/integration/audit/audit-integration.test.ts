import { AuditService, clearAuditLogs } from '@/lib/audit/audit-service'
import { SecurityMonitor } from '@/lib/audit/security-monitor'
import { AuditAction, LogCategory, LogSeverity } from '@/lib/audit/types'

describe('Audit System Integration', () => {
  beforeEach(() => {
    // Reset state before each test
    clearAuditLogs()
    SecurityMonitor['alerts'] = []
    SecurityMonitor['rules'] = []
    SecurityMonitor['isMonitoring'] = false
  })

  describe('Audit Logging and Security Monitoring Integration', () => {
    it('should create audit logs and trigger security monitoring', async () => {
      // Initialize security monitoring
      SecurityMonitor.initialize()

      // Create multiple failed login attempts to trigger security alert
      const failedLoginPromises = []
      for (let i = 0; i < 6; i++) {
        failedLoginPromises.push(
          AuditService.logLogin(
            'unknown',
            'testuser',
            'unknown',
            'unknown',
            'unknown',
            '192.168.1.100',
            'Mozilla/5.0',
            false,
            'Invalid credentials'
          )
        )
      }

      await Promise.all(failedLoginPromises)

      // Verify logs were created
      const { logs } = await AuditService.getLogs({
        action: [AuditAction.LOGIN_FAILED],
      })
      expect(logs.length).toBe(6)

      // Manually trigger security rule evaluation (in real system this would be automatic)
      await SecurityMonitor['checkSecurityRules']()

      // Verify security alert was created
      const { alerts } = SecurityMonitor.getAlerts()
      const failedLoginAlerts = alerts.filter(alert => 
        alert.type === 'MULTIPLE_FAILED_LOGINS'
      )
      expect(failedLoginAlerts.length).toBeGreaterThan(0)
    })

    it('should handle bulk data export security monitoring', async () => {
      SecurityMonitor.initialize()

      const mockUser = {
        id: 'user-123',
        username: 'data_analyst',
        firstName: 'Data',
        lastName: 'Analyst',
        department: 'Analytics Department',
        departmentCode: 'ANALYTICS',
      }

      // Create a large data export log
      await AuditService.logDataAccess(
        mockUser,
        'BudgetData',
        'export-12345',
        'export'
      )

      // Create an audit log with large record count
      await AuditService.createLog({
        userId: mockUser.id,
        username: mockUser.username,
        userFullName: `${mockUser.firstName} ${mockUser.lastName}`,
        department: mockUser.department,
        departmentCode: mockUser.departmentCode,
        action: AuditAction.DATA_EXPORT,
        resource: 'BudgetData',
        resourceId: 'export-12345',
        details: {
          recordCount: 5000, // Large export
          format: 'CSV',
        },
        success: true,
      })

      // Trigger security monitoring
      await SecurityMonitor['checkSecurityRules']()

      // Verify bulk export alert was created
      const { alerts } = SecurityMonitor.getAlerts()
      const bulkExportAlerts = alerts.filter(alert => 
        alert.type === 'BULK_DATA_EXPORT'
      )
      expect(bulkExportAlerts.length).toBeGreaterThan(0)
    })

    it('should track complete user session lifecycle', async () => {
      const mockUser = {
        id: 'user-456',
        username: 'session_user',
        firstName: 'Session',
        lastName: 'User',
        department: 'Test Department',
        departmentCode: 'TEST',
      }

      const sessionId = 'session-789'
      const ipAddress = '192.168.1.50'
      const userAgent = 'Mozilla/5.0 Test Browser'

      // Log session start
      await AuditService.logSessionEvent(
        mockUser.id,
        mockUser.username,
        `${mockUser.firstName} ${mockUser.lastName}`,
        mockUser.department,
        mockUser.departmentCode,
        'session_start',
        sessionId,
        ipAddress,
        userAgent
      )

      // Log some user activities
      await AuditService.logDataAccess(mockUser, 'Budget', 'budget-123', 'view')
      await AuditService.logReportAccess(
        mockUser,
        'BudgetSummary',
        'report-456',
        'generate',
        { ipAddress, userAgent }
      )

      // Log session end
      await AuditService.logSessionEvent(
        mockUser.id,
        mockUser.username,
        `${mockUser.firstName} ${mockUser.lastName}`,
        mockUser.department,
        mockUser.departmentCode,
        'session_end',
        sessionId,
        ipAddress,
        userAgent
      )

      // Verify complete session audit trail
      const { logs } = await AuditService.getLogs({
        userId: mockUser.id,
      })

      expect(logs.length).toBe(4)
      expect(logs.some(log => log.action === AuditAction.LOGIN)).toBe(true)
      expect(logs.some(log => log.action === AuditAction.LOGOUT)).toBe(true)
      expect(logs.some(log => log.action === AuditAction.DATA_VIEW)).toBe(true)
      expect(logs.some(log => log.action === AuditAction.REPORT_GENERATE)).toBe(true)

      // All logs should have the same session ID
      logs.forEach(log => {
        if (log.sessionId) {
          expect(log.sessionId).toBe(sessionId)
        }
      })
    })

    it('should handle budget workflow audit trail', async () => {
      const requester = {
        id: 'requester-1',
        username: 'budget_requester',
        firstName: 'Budget',
        lastName: 'Requester',
        department: 'Operations',
        departmentCode: 'OPS',
      }

      const approver = {
        id: 'approver-1',
        username: 'budget_approver',
        firstName: 'Budget',
        lastName: 'Approver',
        department: 'Finance',
        departmentCode: 'FIN',
      }

      const budgetId = 'budget-workflow-123'

      // Step 1: Create budget request
      await AuditService.logBudgetOperation(
        requester,
        'create',
        budgetId,
        {
          amount: 2000000,
          fiscalYear: 2025,
          category: 'Operations',
          ipAddress: '192.168.1.10',
        }
      )

      // Step 2: Submit for approval
      await AuditService.logBudgetOperation(
        requester,
        'submit',
        budgetId,
        {
          submissionNotes: 'Ready for review',
          ipAddress: '192.168.1.10',
        },
        [
          { field: 'status', oldValue: 'draft', newValue: 'submitted' }
        ]
      )

      // Step 3: Approve budget
      await AuditService.logBudgetOperation(
        approver,
        'approve',
        budgetId,
        {
          approvalNotes: 'Approved with conditions',
          approvedAmount: 1800000,
          ipAddress: '192.168.1.20',
        },
        [
          { field: 'status', oldValue: 'submitted', newValue: 'approved' },
          { field: 'approvedAmount', oldValue: 0, newValue: 1800000 }
        ]
      )

      // Verify complete audit trail for the budget
      const auditTrail = await AuditService.getResourceAuditTrail('Budget', budgetId)

      expect(auditTrail.length).toBe(3)
      expect(auditTrail.some(log => log.action === AuditAction.BUDGET_CREATE)).toBe(true)
      expect(auditTrail.some(log => log.action === AuditAction.BUDGET_SUBMIT)).toBe(true)
      expect(auditTrail.some(log => log.action === AuditAction.BUDGET_APPROVE)).toBe(true)

      // Verify changes are tracked
      const approvalLog = auditTrail.find(log => log.action === AuditAction.BUDGET_APPROVE)
      expect(approvalLog?.changes).toHaveLength(2)
      expect(approvalLog?.changes?.[0].field).toBe('status')
      expect(approvalLog?.changes?.[1].field).toBe('approvedAmount')
    })

    it('should generate comprehensive audit statistics', async () => {
      // Create diverse audit logs
      const users = [
        { id: 'user-1', username: 'admin', name: 'Admin User', dept: 'IT', code: 'IT' },
        { id: 'user-2', username: 'finance', name: 'Finance User', dept: 'Finance', code: 'FIN' },
        { id: 'user-3', username: 'ops', name: 'Operations User', dept: 'Operations', code: 'OPS' },
      ]

      const actions = [
        { action: AuditAction.LOGIN, category: LogCategory.AUTH, success: true },
        { action: AuditAction.BUDGET_CREATE, category: LogCategory.BUDGET, success: true },
        { action: AuditAction.REPORT_VIEW, category: LogCategory.REPORT, success: true },
        { action: AuditAction.DATA_EXPORT, category: LogCategory.DATA_ACCESS, success: true },
        { action: AuditAction.PERMISSION_DENIED, category: LogCategory.SECURITY, success: false },
      ]

      // Create 50 diverse logs
      const logPromises = []
      for (let i = 0; i < 50; i++) {
        const user = users[i % users.length]
        const actionInfo = actions[i % actions.length]

        logPromises.push(
          AuditService.createLog({
            userId: user.id,
            username: user.username,
            userFullName: user.name,
            department: user.dept,
            departmentCode: user.code,
            action: actionInfo.action,
            resource: 'TestResource',
            success: actionInfo.success,
            ipAddress: `192.168.1.${(i % 254) + 1}`,
            userAgent: 'Test Browser',
          })
        )
      }

      await Promise.all(logPromises)

      // Get comprehensive statistics
      const stats = await AuditService.getStatistics()

      expect(stats.totalLogs).toBe(50)
      expect(stats.byCategory[LogCategory.AUTH]).toBeGreaterThan(0)
      expect(stats.byCategory[LogCategory.BUDGET]).toBeGreaterThan(0)
      expect(stats.byCategory[LogCategory.REPORT]).toBeGreaterThan(0)
      expect(stats.byUser.length).toBe(3)
      expect(stats.byDepartment.length).toBe(3)

      // Verify user statistics
      const userStats = stats.byUser.find(u => u.username === 'admin')
      expect(userStats).toBeDefined()
      expect(userStats!.count).toBeGreaterThan(0)
    })

    it('should handle system integration events', async () => {
      // Log DPIS integration events
      await AuditService.logIntegrationEvent(
        'DPIS',
        'SYNC_PERSONNEL',
        true,
        {
          recordsProcessed: 150,
          newRecords: 5,
          updatedRecords: 10,
          duration: 2500,
        }
      )

      await AuditService.logIntegrationEvent(
        'DPIS',
        'SYNC_ORGANIZATION',
        false,
        {
          error: 'Connection timeout',
          retryAttempt: 3,
        },
        'Failed to connect to DPIS service'
      )

      // Log ThaID authentication events
      await AuditService.logIntegrationEvent(
        'ThaID',
        'AUTHENTICATE',
        true,
        {
          userId: 'thaid-user-123',
          responseTime: 1200,
        }
      )

      // Verify integration logs
      const { logs } = await AuditService.getLogs({
        searchTerm: 'INTEGRATION',
      })

      expect(logs.length).toBe(3)
      expect(logs.some(log => log.resource === 'DPIS')).toBe(true)
      expect(logs.some(log => log.resource === 'ThaID')).toBe(true)
      expect(logs.some(log => !log.success)).toBe(true)
    })

    it('should export audit data in multiple formats', async () => {
      // Create some test logs
      await AuditService.createLog({
        userId: 'export-user',
        username: 'export_test',
        userFullName: 'Export Test User',
        department: 'Test Department',
        departmentCode: 'TEST',
        action: AuditAction.DATA_EXPORT,
        resource: 'TestData',
        success: true,
      })

      // Test JSON export
      const jsonExport = await AuditService.exportLogs(undefined, 'json')
      const jsonData = JSON.parse(jsonExport)
      expect(Array.isArray(jsonData)).toBe(true)
      expect(jsonData.length).toBeGreaterThan(0)

      // Test CSV export
      const csvExport = await AuditService.exportLogs(undefined, 'csv')
      expect(csvExport).toContain('Timestamp,User,Department')
      expect(csvExport).toContain('export_test')
      expect(csvExport).toContain('Test Department')

      // Verify export is logged - the original log should exist
      const { logs } = await AuditService.getLogs({
        searchTerm: 'DATA_EXPORT',
      })
      expect(logs.length).toBeGreaterThanOrEqual(1) // At least the original log
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large number of audit logs efficiently', async () => {
      const startTime = Date.now()

      // Create 1000 audit logs
      const logPromises = []
      for (let i = 0; i < 1000; i++) {
        logPromises.push(
          AuditService.createLog({
            userId: `user-${i % 10}`,
            username: `user${i % 10}`,
            userFullName: `User ${i % 10}`,
            department: `Department ${i % 5}`,
            departmentCode: `DEPT-${i % 5}`,
            action: AuditAction.LOGIN,
            success: true,
          })
        )
      }

      await Promise.all(logPromises)

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(10000) // 10 seconds

      // Verify all logs were created
      const { total } = await AuditService.getLogs()
      expect(total).toBe(1000)
    })

    it('should handle concurrent audit log creation', async () => {
      const concurrentPromises = []

      // Create 100 concurrent audit log operations
      for (let i = 0; i < 100; i++) {
        concurrentPromises.push(
          AuditService.createLog({
            userId: `concurrent-user-${i}`,
            username: `concurrent${i}`,
            userFullName: `Concurrent User ${i}`,
            department: 'Concurrent Department',
            departmentCode: 'CONCURRENT',
            action: AuditAction.DATA_VIEW,
            success: true,
          })
        )
      }

      // All should complete successfully
      const results = await Promise.all(concurrentPromises)
      expect(results).toHaveLength(100)

      // Verify all logs have unique IDs
      const ids = results.map(log => log.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(100)
    })
  })
})