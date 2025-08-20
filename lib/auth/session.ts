// Session Management
import { AuthSession, User } from './types'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

// Mock secret keys (ใน production จะใช้ environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'dnp-budget-secret-key-2025'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dnp-budget-refresh-secret-2025'

// Mock session storage (ใน production จะใช้ Redis/Database)
const sessions = new Map<string, AuthSession>()

export class SessionService {
  // Create new session
  static createSession(
    user: User,
    ipAddress: string,
    userAgent: string,
    rememberMe: boolean = false
  ): AuthSession {
    const sessionId = uuidv4()
    const expiresIn = rememberMe ? '30d' : '1h' // 30 days if remember me, else 1 hour
    const refreshExpiresIn = rememberMe ? '30d' : '7d'

    // Generate tokens
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        sessionId,
      },
      JWT_SECRET,
      { expiresIn }
    )

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        sessionId,
        type: 'refresh',
      },
      REFRESH_SECRET,
      { expiresIn: refreshExpiresIn }
    )

    // Calculate expiry date
    const expiresAt = new Date()
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30)
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1)
    }

    const session: AuthSession = {
      id: sessionId,
      userId: user.id,
      token,
      refreshToken,
      expiresAt,
      createdAt: new Date(),
      ipAddress,
      userAgent,
      mfaVerified: false,
    }

    sessions.set(sessionId, session)
    return session
  }

  // Verify MFA for session
  static verifyMFAForSession(sessionId: string): AuthSession | null {
    const session = sessions.get(sessionId)
    if (!session) return null

    session.mfaVerified = true
    session.mfaVerifiedAt = new Date()

    // Generate new tokens with MFA verified flag
    const token = jwt.sign(
      {
        userId: session.userId,
        sessionId: session.id,
        mfaVerified: true,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    session.token = token
    return session
  }

  // Get session
  static getSession(sessionId: string): AuthSession | null {
    const session = sessions.get(sessionId)
    if (!session) return null

    // Check if expired
    if (new Date() > session.expiresAt) {
      sessions.delete(sessionId)
      return null
    }

    return session
  }

  // Verify token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  // Verify refresh token
  static verifyRefreshToken(refreshToken: string): any {
    try {
      return jwt.verify(refreshToken, REFRESH_SECRET)
    } catch (error) {
      return null
    }
  }

  // Refresh session
  static refreshSession(refreshToken: string): AuthSession | null {
    const decoded = this.verifyRefreshToken(refreshToken)
    if (!decoded || decoded.type !== 'refresh') return null

    const session = sessions.get(decoded.sessionId)
    if (!session) return null

    // Generate new access token
    const token = jwt.sign(
      {
        userId: session.userId,
        sessionId: session.id,
        mfaVerified: session.mfaVerified,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    session.token = token
    return session
  }

  // Invalidate session
  static invalidateSession(sessionId: string): boolean {
    return sessions.delete(sessionId)
  }

  // Invalidate all user sessions
  static invalidateUserSessions(userId: string): number {
    let count = 0
    for (const [sessionId, session] of sessions.entries()) {
      if (session.userId === userId) {
        sessions.delete(sessionId)
        count++
      }
    }
    return count
  }

  // Get active sessions for user
  static getUserSessions(userId: string): AuthSession[] {
    const userSessions: AuthSession[] = []
    const now = new Date()

    for (const session of sessions.values()) {
      if (session.userId === userId && session.expiresAt > now) {
        userSessions.push(session)
      }
    }

    return userSessions
  }

  // Cleanup expired sessions
  static cleanupExpiredSessions(): number {
    const now = new Date()
    let cleaned = 0

    for (const [sessionId, session] of sessions.entries()) {
      if (session.expiresAt <= now) {
        sessions.delete(sessionId)
        cleaned++
      }
    }

    return cleaned
  }

  // Session activity tracking
  static updateSessionActivity(sessionId: string): void {
    const session = sessions.get(sessionId)
    if (session) {
      // Extend session if it's active
      const newExpiry = new Date()
      newExpiry.setHours(newExpiry.getHours() + 1)
      
      // Don't extend beyond original remember me duration
      if (session.expiresAt > newExpiry) {
        return
      }
      
      session.expiresAt = newExpiry
    }
  }

  // Check if session needs refresh
  static shouldRefreshToken(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any
      if (!decoded || !decoded.exp) return true

      const expiryTime = decoded.exp * 1000
      const now = Date.now()
      const timeUntilExpiry = expiryTime - now

      // Refresh if less than 5 minutes remaining
      return timeUntilExpiry < 5 * 60 * 1000
    } catch {
      return true
    }
  }
}

// Cleanup expired sessions periodically
if (typeof window === 'undefined') {
  setInterval(() => {
    const cleaned = SessionService.cleanupExpiredSessions()
    if (cleaned > 0) {
      console.log(`[Session Cleanup] Removed ${cleaned} expired sessions`)
    }
  }, 5 * 60 * 1000) // Every 5 minutes
}