// Main Authentication Service
import bcrypt from 'bcryptjs'
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  MFAVerifyRequest,
  MFAVerifyResponse,
  MOCK_USERS,
  MOCK_PASSWORDS,
  MFAType,
  LoginAttempt,
  AuditLog
} from './types'
import { SessionService } from './session'
import { MFAService, ThaIDService } from './mfa'

// Mock login attempts storage
const loginAttempts = new Map<string, LoginAttempt[]>()

// Mock audit logs
const auditLogs: AuditLog[] = []

export class AuthService {
  // Login with username and password
  static async login(
    request: LoginRequest,
    ipAddress: string,
    userAgent: string
  ): Promise<LoginResponse> {
    const { username, password, rememberMe } = request

    // Check login attempts
    const attempts = this.getRecentLoginAttempts(username, ipAddress)
    if (attempts >= 5) {
      this.recordLoginAttempt(username, ipAddress, userAgent, false, 'Account locked')
      return {
        success: false,
        message: 'Account is locked due to too many failed attempts. Please try again in 30 minutes.',
      }
    }

    // Find user (Mock)
    const user = MOCK_USERS.find(u => u.username === username)
    if (!user) {
      this.recordLoginAttempt(username, ipAddress, userAgent, false, 'User not found')
      return {
        success: false,
        message: 'Invalid username or password',
      }
    }

    // Check if user is active
    if (!user.isActive) {
      this.recordLoginAttempt(username, ipAddress, userAgent, false, 'User inactive')
      return {
        success: false,
        message: 'Your account has been disabled. Please contact administrator.',
      }
    }

    // Verify password (Mock)
    const validPassword = MOCK_PASSWORDS[username] === password
    if (!validPassword) {
      this.recordLoginAttempt(username, ipAddress, userAgent, false, 'Invalid password')
      return {
        success: false,
        message: 'Invalid username or password',
      }
    }

    // Record successful login attempt
    this.recordLoginAttempt(username, ipAddress, userAgent, true)

    // Create session
    const session = SessionService.createSession(user, ipAddress, userAgent, rememberMe)

    // Check if MFA is required
    if (user.mfaEnabled && user.mfaMethods.length > 0) {
      // Create MFA challenge
      const challenge = MFAService.createChallenge(user.id, user.mfaMethods[0].type)
      
      // Send OTP if using SMS or Email
      if (user.mfaMethods[0].type === MFAType.SMS) {
        const phoneNumber = user.mfaMethods[0].metadata?.phoneNumber || '08X-XXX-1234'
        await MFAService.sendSMSOTP(phoneNumber, user.id)
      } else if (user.mfaMethods[0].type === MFAType.EMAIL) {
        await MFAService.sendEmailOTP(user.email, user.id)
      }

      return {
        success: true,
        message: 'Login successful. Please complete MFA verification.',
        requireMFA: true,
        mfaMethods: user.mfaMethods.map(m => m.type),
        sessionId: challenge.sessionId,
      }
    }

    // Update last login
    user.lastLogin = new Date()

    // Log successful login
    this.createAuditLog(user.id, 'LOGIN', 'AUTH', undefined, { method: 'password' }, ipAddress, userAgent)

    return {
      success: true,
      message: 'Login successful',
      token: session.token,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        department: user.department,
        roles: user.roles,
      },
    }
  }

  // Verify MFA
  static async verifyMFA(
    request: MFAVerifyRequest,
    ipAddress: string,
    userAgent: string
  ): Promise<MFAVerifyResponse> {
    const { sessionId, method, code } = request

    // Get challenge
    const challenge = MFAService.getChallenge(sessionId)
    if (!challenge) {
      return {
        success: false,
        message: 'MFA session expired or invalid',
      }
    }

    // Find user
    const user = MOCK_USERS.find(u => u.id === challenge.userId)
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // Verify based on method
    let verificationResult: { success: boolean; message: string }

    switch (method) {
      case MFAType.SMS:
      case MFAType.EMAIL:
        verificationResult = MFAService.verifyOTP(method, challenge.userId, code)
        break

      case MFAType.AUTHENTICATOR: {
        // Mock authenticator secret (ใน production จะดึงจาก database)
        const secret = 'MOCK_SECRET_KEY'
        const isValid = MFAService.verifyAuthenticatorToken(secret, code)
        verificationResult = {
          success: isValid,
          message: isValid ? 'Authenticator code verified' : 'Invalid authenticator code',
        }
        break
      }

      default:
        verificationResult = {
          success: false,
          message: 'Unsupported MFA method',
        }
    }

    if (!verificationResult.success) {
      // Update attempts
      const canRetry = MFAService.updateChallengeAttempts(sessionId)
      if (!canRetry) {
        return {
          success: false,
          message: 'Too many failed attempts. Please login again.',
        }
      }
      return verificationResult as MFAVerifyResponse
    }

    // MFA successful - complete challenge
    MFAService.completeChallenge(sessionId)

    // Create verified session
    const session = SessionService.createSession(user, ipAddress, userAgent, false)
    const verifiedSession = SessionService.verifyMFAForSession(session.id)

    if (!verifiedSession) {
      return {
        success: false,
        message: 'Failed to create session',
      }
    }

    // Update last login
    user.lastLogin = new Date()

    // Log successful MFA
    this.createAuditLog(user.id, 'MFA_VERIFY', 'AUTH', undefined, { method }, ipAddress, userAgent)

    return {
      success: true,
      message: 'MFA verification successful',
      token: verifiedSession.token,
      refreshToken: verifiedSession.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        department: user.department,
        roles: user.roles,
      },
    }
  }

  // Login with ThaID
  static async loginWithThaID(
    idNumber: string,
    ipAddress: string,
    userAgent: string
  ): Promise<LoginResponse> {
    // Find user by ThaID
    const user = MOCK_USERS.find(u => u.thaIdNumber === idNumber)
    if (!user) {
      return {
        success: false,
        message: 'No account linked with this Thai ID',
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Your account has been disabled. Please contact administrator.',
      }
    }

    // Create session
    const session = SessionService.createSession(user, ipAddress, userAgent, false)
    const verifiedSession = SessionService.verifyMFAForSession(session.id)

    if (!verifiedSession) {
      return {
        success: false,
        message: 'Failed to create session',
      }
    }

    // Update last login
    user.lastLogin = new Date()

    // Log successful ThaID login
    this.createAuditLog(user.id, 'LOGIN', 'AUTH', undefined, { method: 'thaid' }, ipAddress, userAgent)

    return {
      success: true,
      message: 'Login successful with Thai ID',
      token: verifiedSession.token,
      refreshToken: verifiedSession.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        department: user.department,
        roles: user.roles,
      },
    }
  }

  // Logout
  static logout(token: string, ipAddress: string, userAgent: string): boolean {
    const decoded = SessionService.verifyToken(token)
    if (!decoded) return false

    const success = SessionService.invalidateSession(decoded.sessionId)
    
    if (success) {
      this.createAuditLog(decoded.userId, 'LOGOUT', 'AUTH', undefined, {}, ipAddress, userAgent)
    }

    return success
  }

  // Get recent login attempts
  private static getRecentLoginAttempts(username: string, ipAddress: string): number {
    const key = `${username}:${ipAddress}`
    const attempts = loginAttempts.get(key) || []
    
    // Filter attempts in last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const recentAttempts = attempts.filter(a => a.attemptedAt > thirtyMinutesAgo && !a.success)
    
    // Update storage
    if (recentAttempts.length !== attempts.length) {
      loginAttempts.set(key, recentAttempts)
    }
    
    return recentAttempts.length
  }

  // Record login attempt
  private static recordLoginAttempt(
    username: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    reason?: string
  ): void {
    const key = `${username}:${ipAddress}`
    const attempts = loginAttempts.get(key) || []
    
    attempts.push({
      username,
      ipAddress,
      userAgent,
      success,
      reason,
      attemptedAt: new Date(),
    })
    
    // Keep only last 100 attempts
    if (attempts.length > 100) {
      attempts.splice(0, attempts.length - 100)
    }
    
    loginAttempts.set(key, attempts)
  }

  // Create audit log
  private static createAuditLog(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): void {
    auditLogs.push({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      createdAt: new Date(),
    })
    
    // Keep only last 10000 logs in memory (ใน production จะใช้ database)
    if (auditLogs.length > 10000) {
      auditLogs.splice(0, auditLogs.length - 10000)
    }
  }

  // Get audit logs
  static getAuditLogs(userId?: string, limit: number = 100): AuditLog[] {
    let logs = [...auditLogs]
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId)
    }
    
    // Sort by newest first
    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    return logs.slice(0, limit)
  }
}