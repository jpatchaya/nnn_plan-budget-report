"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, LoginRequest, MFAVerifyRequest, MFAType } from '@/lib/auth/types'
import { AuthService } from '@/lib/auth/auth-service'
import { SessionService } from '@/lib/auth/session'
import { MFAService } from '@/lib/auth/mfa'

interface AuthContextType {
  user: Partial<User> | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  requireMFA: boolean
  mfaSessionId: string | null
  mfaMethods: MFAType[]
  
  // Auth methods
  login: (request: LoginRequest) => Promise<void>
  loginWithThaID: () => Promise<void>
  verifyMFA: (method: MFAType, code: string) => Promise<void>
  resendOTP: (method: MFAType) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requireMFA, setRequireMFA] = useState(false)
  const [mfaSessionId, setMfaSessionId] = useState<string | null>(null)
  const [mfaMethods, setMfaMethods] = useState<MFAType[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    
    if (storedToken) {
      const decoded = SessionService.verifyToken(storedToken)
      if (decoded) {
        // Mock user data retrieval
        const mockUser = {
          id: decoded.userId,
          username: decoded.username,
          roles: decoded.roles,
        }
        setUser(mockUser)
        setToken(storedToken)
        setRefreshToken(storedRefreshToken)
      } else {
        // Token expired, try refresh
        if (storedRefreshToken) {
          handleRefreshToken(storedRefreshToken)
        }
      }
    }
    
    setLoading(false)
  }, [])

  // Auto refresh token
  useEffect(() => {
    if (!token) return

    const checkTokenExpiry = setInterval(() => {
      if (SessionService.shouldRefreshToken(token)) {
        handleRefreshToken(refreshToken!)
      }
    }, 60 * 1000) // Check every minute

    return () => clearInterval(checkTokenExpiry)
  }, [token, refreshToken])

  const handleRefreshToken = async (refreshTkn: string) => {
    try {
      const session = SessionService.refreshSession(refreshTkn)
      if (session) {
        setToken(session.token)
        localStorage.setItem('auth_token', session.token)
      } else {
        // Refresh failed, logout
        await logout()
      }
    } catch (err) {
      await logout()
    }
  }

  const login = async (request: LoginRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login(
        request,
        window.location.hostname,
        navigator.userAgent
      )

      if (!response.success) {
        setError(response.message)
        return
      }

      if (response.requireMFA) {
        setRequireMFA(true)
        setMfaSessionId(response.sessionId!)
        setMfaMethods(response.mfaMethods || [])
      } else {
        // Login successful without MFA
        setUser(response.user!)
        setToken(response.token!)
        setRefreshToken(response.refreshToken!)
        
        // Store tokens
        localStorage.setItem('auth_token', response.token!)
        localStorage.setItem('refresh_token', response.refreshToken!)
        
        // Redirect to dashboard
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const loginWithThaID = async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock ThaID login flow
      // In production, this would redirect to ThaID authentication page
      const mockIdNumber = '1234567890123'
      
      const response = await AuthService.loginWithThaID(
        mockIdNumber,
        window.location.hostname,
        navigator.userAgent
      )

      if (!response.success) {
        setError(response.message)
        return
      }

      setUser(response.user!)
      setToken(response.token!)
      setRefreshToken(response.refreshToken!)
      
      // Store tokens
      localStorage.setItem('auth_token', response.token!)
      localStorage.setItem('refresh_token', response.refreshToken!)
      
      // Redirect to dashboard
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'ThaID login failed')
    } finally {
      setLoading(false)
    }
  }

  const verifyMFA = async (method: MFAType, code: string) => {
    if (!mfaSessionId) {
      setError('MFA session not found')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const request: MFAVerifyRequest = {
        sessionId: mfaSessionId,
        method,
        code,
      }

      const response = await AuthService.verifyMFA(
        request,
        window.location.hostname,
        navigator.userAgent
      )

      if (!response.success) {
        setError(response.message)
        return
      }

      // MFA successful
      setUser(response.user!)
      setToken(response.token!)
      setRefreshToken(response.refreshToken!)
      setRequireMFA(false)
      setMfaSessionId(null)
      setMfaMethods([])
      
      // Store tokens
      localStorage.setItem('auth_token', response.token!)
      localStorage.setItem('refresh_token', response.refreshToken!)
      
      // Redirect to dashboard
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'MFA verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async (method: MFAType) => {
    if (!mfaSessionId) {
      throw new Error('MFA session not found')
    }

    const challenge = MFAService.getChallenge(mfaSessionId)
    if (!challenge) {
      throw new Error('MFA session expired')
    }

    if (method === MFAType.SMS) {
      const result = await MFAService.sendSMSOTP('08X-XXX-1234', challenge.userId)
      if (!result.success) {
        throw new Error(result.message)
      }
    } else if (method === MFAType.EMAIL) {
      const result = await MFAService.sendEmailOTP('user@dnp.go.th', challenge.userId)
      if (!result.success) {
        throw new Error(result.message)
      }
    } else {
      throw new Error('Cannot resend code for this method')
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      if (token) {
        AuthService.logout(token, window.location.hostname, navigator.userAgent)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state
      setUser(null)
      setToken(null)
      setRefreshToken(null)
      setRequireMFA(false)
      setMfaSessionId(null)
      setMfaMethods([])
      
      // Clear storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      setLoading(false)
      
      // Redirect to login
      router.push('/login')
    }
  }

  const refreshTokenMethod = async () => {
    if (refreshToken) {
      await handleRefreshToken(refreshToken)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    requireMFA,
    mfaSessionId,
    mfaMethods,
    login,
    loginWithThaID,
    verifyMFA,
    resendOTP,
    logout,
    refreshToken: refreshTokenMethod,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}