import { AuditService, clearAuditLogs } from '@/lib/audit/audit-service'
import { AuditAction, LogCategory, LogSeverity } from '@/lib/audit/types'

// Mock UUID generation for consistent testing
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}))

describe('AuditService', () => {
  beforeEach(() => {
    // Clear any existing logs before each test
    jest.clearAllMocks()
    clearAuditLogs()
  })

  describe('createLog', () => {
    it('should create a basic audit log', async () => {
      const logParams = {
        userId: 'user-123',
        username: 'testuser',
        userFullName: 'Test User',
        department: 'Test Department',
        departmentCode: 'TEST',
        action: AuditAction.LOGIN,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      }

      const log = await AuditService.createLog(logParams)

      expect(log).toMatchObject({
        id: 'test-uuid-123',
        userId: 'user-123',
        username: 'testuser',
        userFullName: 'Test User',
        department: 'Test Department',
        departmentCode: 'TEST',
        action: AuditAction.LOGIN,
        category: LogCategory.AUTH,
        severity: LogSeverity.INFO,
        success: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      })
      expect(log.timestamp).toBeInstanceOf(Date)
    })

    it('should create a log with custom details and changes', async () => {
      const logParams = {
        userId: 'user-123',
        username: 'testuser',
        userFullName: 'Test User',
        department: 'Test Department',
        departmentCode: 'TEST',
        action: AuditAction.USER_UPDATE,
        resource: 'User',
        resourceId: 'target-user-456',
        details: { operation: 'profile_update' },
        changes: [
          { field: 'email', oldValue: 'old@test.com', newValue: 'new@test.com' },
          { field: 'department', oldValue: 'Old Dept', newValue: 'New Dept' },
        ],
      }

      const log = await AuditService.createLog(logParams)

      expect(log.details).toEqual({ operation: 'profile_update' })
      expect(log.changes).toHaveLength(2)
      expect(log.changes![0]).toEqual({
        field: 'email',
        oldValue: 'old@test.com',
        newValue: 'new@test.com',
      })
    })

    it('should handle failed operations correctly', async () => {
      const logParams = {
        userId: 'user-123',
        username: 'testuser',
        userFullName: 'Test User',
        department: 'Test Department',
        departmentCode: 'TEST',
        action: AuditAction.LOGIN_FAILED,
        success: false,
        errorMessage: 'Invalid credentials',
      }

      const log = await AuditService.createLog(logParams)

      expect(log.success).toBe(false)
      expect(log.errorMessage).toBe('Invalid credentials')
      expect(log.severity).toBe(LogSeverity.WARNING)
    })
  })

  describe('logLogin', () => {
    it('should log successful login', async () => {
      const log = await AuditService.logLogin(
        'user-123',
        'testuser',
        'Test User',
        'Test Department',
        'TEST',
        '192.168.1.1',
        'Mozilla/5.0',
        true
      )

      expect(log.action).toBe(AuditAction.LOGIN)
      expect(log.success).toBe(true)
      expect(log.userId).toBe('user-123')
    })

    it('should log failed login', async () => {
      const log = await AuditService.logLogin(
        'unknown',
        'testuser',
        'unknown',
        'unknown',
        'unknown',
        '192.168.1.1',
        'Mozilla/5.0',
        false,
        'Invalid password'
      )

      expect(log.action).toBe(AuditAction.LOGIN_FAILED)
      expect(log.success).toBe(false)
      expect(log.errorMessage).toBe('Invalid password')
    })
  })

  describe('logDataAccess', () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      department: 'Test Department',
      departmentCode: 'TEST',
    }

    it('should log data view access', async () => {
      const log = await AuditService.logDataAccess(
        mockUser,
        'Budget',
        'budget-456',
        'view'
      )

      expect(log.action).toBe(AuditAction.DATA_VIEW)
      expect(log.resource).toBe('Budget')
      expect(log.resourceId).toBe('budget-456')
      expect(log.details).toEqual({ action: 'view' })
    })

    it('should log data export', async () => {
      const log = await AuditService.logDataAccess(
        mockUser,
        'Report',
        'report-789',
        'export'
      )

      expect(log.action).toBe(AuditAction.DATA_EXPORT)
      expect(log.resource).toBe('Report')
      expect(log.resourceId).toBe('report-789')
    })
  })

  describe('getLogs', () => {
    beforeEach(async () => {
      // Create some test logs
      await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.LOGIN,
      })

      await AuditService.createLog({
        userId: 'user-2',
        username: 'user2',
        userFullName: 'User Two',
        department: 'Dept B',
        departmentCode: 'DEPT-B',
        action: AuditAction.BUDGET_CREATE,
      })
    })

    it('should return all logs without filter', async () => {
      const result = await AuditService.getLogs()

      expect(result.logs).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it('should filter logs by user ID', async () => {
      const result = await AuditService.getLogs({
        userId: 'user-1',
      })

      expect(result.logs).toHaveLength(1)
      expect(result.logs[0].userId).toBe('user-1')
    })

    it('should filter logs by category', async () => {
      const result = await AuditService.getLogs({
        category: [LogCategory.AUTH],
      })

      expect(result.logs).toHaveLength(1)
      expect(result.logs[0].category).toBe(LogCategory.AUTH)
    })

    it('should filter logs by date range', async () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      const result = await AuditService.getLogs({
        startDate: oneHourAgo,
        endDate: now,
      })

      expect(result.logs.length).toBeGreaterThan(0)
      result.logs.forEach(log => {
        expect(log.timestamp.getTime()).toBeGreaterThanOrEqual(oneHourAgo.getTime())
        expect(log.timestamp.getTime()).toBeLessThanOrEqual(now.getTime())
      })
    })

    it('should search logs by term', async () => {
      const result = await AuditService.getLogs({
        searchTerm: 'login',
      })

      expect(result.logs).toHaveLength(1)
      expect(result.logs[0].action).toBe(AuditAction.LOGIN)
    })

    it('should paginate results', async () => {
      const result = await AuditService.getLogs({
        limit: 1,
        offset: 0,
      })

      expect(result.logs).toHaveLength(1)
      expect(result.total).toBe(2)
    })

    it('should sort logs by timestamp descending by default', async () => {
      const result = await AuditService.getLogs()

      expect(result.logs).toHaveLength(2)
      expect(result.logs[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        result.logs[1].timestamp.getTime()
      )
    })
  })

  describe('getStatistics', () => {
    beforeEach(async () => {
      // Create test logs with different categories and severities
      await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.LOGIN,
      })

      await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.LOGIN_FAILED,
        success: false,
      })

      await AuditService.createLog({
        userId: 'user-2',
        username: 'user2',
        userFullName: 'User Two',
        department: 'Dept B',
        departmentCode: 'DEPT-B',
        action: AuditAction.BUDGET_CREATE,
      })
    })

    it('should return comprehensive statistics', async () => {
      const stats = await AuditService.getStatistics()

      expect(stats.totalLogs).toBe(3)
      expect(stats.byCategory[LogCategory.AUTH]).toBe(2)
      expect(stats.byCategory[LogCategory.BUDGET]).toBe(1)
      expect(stats.bySeverity[LogSeverity.INFO]).toBe(2)
      expect(stats.bySeverity[LogSeverity.WARNING]).toBe(1)
      expect(stats.failedLogins).toBe(1)
      expect(stats.byUser).toHaveLength(2)
      expect(stats.byDepartment).toHaveLength(2)
    })
  })

  describe('exportLogs', () => {
    beforeEach(async () => {
      await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.LOGIN,
      })
    })

    it('should export logs as JSON', async () => {
      const exported = await AuditService.exportLogs(undefined, 'json')
      const logs = JSON.parse(exported)

      expect(Array.isArray(logs)).toBe(true)
      expect(logs).toHaveLength(1)
      expect(logs[0].username).toBe('user1')
    })

    it('should export logs as CSV', async () => {
      const exported = await AuditService.exportLogs(undefined, 'csv')

      expect(exported).toContain('Timestamp,User,Department')
      expect(exported).toContain('user1')
      expect(exported).toContain('Dept A')
    })
  })

  describe('logBudgetOperation', () => {
    const mockUser = {
      id: 'user-123',
      username: 'budget_officer',
      firstName: 'Budget',
      lastName: 'Officer',
      department: 'Finance Department',
      departmentCode: 'FIN',
    }

    it('should log budget creation', async () => {
      const log = await AuditService.logBudgetOperation(
        mockUser,
        'create',
        'budget-456',
        {
          amount: 1000000,
          fiscalYear: 2025,
          ipAddress: '192.168.1.1',
        }
      )

      expect(log.action).toBe(AuditAction.BUDGET_CREATE)
      expect(log.resource).toBe('Budget')
      expect(log.resourceId).toBe('budget-456')
      expect(log.details.amount).toBe(1000000)
    })

    it('should log budget approval with changes', async () => {
      const changes = [
        { field: 'status', oldValue: 'pending', newValue: 'approved' },
        { field: 'approvedAmount', oldValue: 0, newValue: 950000 },
      ]

      const log = await AuditService.logBudgetOperation(
        mockUser,
        'approve',
        'budget-456',
        { approvalNotes: 'Approved with minor adjustments' },
        changes
      )

      expect(log.action).toBe(AuditAction.BUDGET_APPROVE)
      expect(log.changes).toHaveLength(2)
      expect(log.changes![0].field).toBe('status')
    })
  })

  describe('getUserActivitySummary', () => {
    beforeEach(async () => {
      // Create multiple logs for the same user
      for (let i = 0; i < 5; i++) {
        await AuditService.createLog({
          userId: 'user-123',
          username: 'testuser',
          userFullName: 'Test User',
          department: 'Test Department',
          departmentCode: 'TEST',
          action: i % 2 === 0 ? AuditAction.LOGIN : AuditAction.DATA_VIEW,
          success: i !== 2, // Make one failed action
        })
      }
    })

    it('should return user activity summary', async () => {
      const summary = await AuditService.getUserActivitySummary('user-123')

      expect(summary.totalActions).toBe(5)
      expect(summary.failedActions).toBe(1)
      expect(summary.recentActions).toHaveLength(5)
      expect(summary.actionsByCategory[LogCategory.AUTH]).toBeGreaterThan(0)
      expect(summary.actionsByCategory[LogCategory.DATA_ACCESS]).toBeGreaterThan(0)
    })
  })

  describe('getResourceAuditTrail', () => {
    beforeEach(async () => {
      // Create logs for specific resource
      await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.BUDGET_CREATE,
        resource: 'Budget',
        resourceId: 'budget-123',
      })

      await AuditService.createLog({
        userId: 'user-2',
        username: 'user2',
        userFullName: 'User Two',
        department: 'Dept B',
        departmentCode: 'DEPT-B',
        action: AuditAction.BUDGET_UPDATE,
        resource: 'Budget',
        resourceId: 'budget-123',
      })

      await AuditService.createLog({
        userId: 'user-3',
        username: 'user3',
        userFullName: 'User Three',
        department: 'Dept C',
        departmentCode: 'DEPT-C',
        action: AuditAction.BUDGET_CREATE,
        resource: 'Budget',
        resourceId: 'budget-456', // Different resource
      })
    })

    it('should return audit trail for specific resource', async () => {
      const trail = await AuditService.getResourceAuditTrail('Budget', 'budget-123')

      expect(trail).toHaveLength(2)
      trail.forEach(log => {
        expect(log.resource).toBe('Budget')
        expect(log.resourceId).toBe('budget-123')
      })
    })
  })

  describe('cleanOldLogs', () => {
    beforeEach(async () => {
      // Create an old log
      const oldLog = await AuditService.createLog({
        userId: 'user-1',
        username: 'user1',
        userFullName: 'User One',
        department: 'Dept A',
        departmentCode: 'DEPT-A',
        action: AuditAction.LOGIN,
      })

      // Manually set timestamp to be old
      oldLog.timestamp = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) // 100 days ago

      // Create a recent log
      await AuditService.createLog({
        userId: 'user-2',
        username: 'user2',
        userFullName: 'User Two',
        department: 'Dept B',
        departmentCode: 'DEPT-B',
        action: AuditAction.LOGIN,
      })
    })

    it('should clean old logs based on retention policy', async () => {
      const deletedCount = await AuditService.cleanOldLogs(90) // Keep logs for 90 days

      expect(deletedCount).toBe(1)

      const { logs } = await AuditService.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].username).toBe('user2')
    })
  })
})