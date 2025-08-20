// Multi-Factor Authentication Logic
import { MFAType, MFAChallenge, User } from './types'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

// Mock OTP storage (ใน production จะใช้ database/cache)
const otpStorage = new Map<string, { code: string; expiresAt: Date; attempts: number }>()

// Mock MFA challenges storage
const mfaChallenges = new Map<string, MFAChallenge>()

export class MFAService {
  // Generate OTP for SMS or Email
  static generateOTP(length: number = 6): string {
    // For demo: use fixed OTP
    if (process.env.NODE_ENV === 'development') {
      return '123456'
    }
    
    const digits = '0123456789'
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp
  }

  // Send OTP via SMS (Mock)
  static async sendSMSOTP(phoneNumber: string, userId: string): Promise<{ success: boolean; message: string }> {
    const otp = this.generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store OTP
    otpStorage.set(`sms:${userId}`, {
      code: otp,
      expiresAt,
      attempts: 0,
    })

    // Mock SMS sending
    console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`)

    return {
      success: true,
      message: `OTP has been sent to ${phoneNumber.replace(/\d(?=\d{4})/g, 'X')}`,
    }
  }

  // Send OTP via Email (Mock)
  static async sendEmailOTP(email: string, userId: string): Promise<{ success: boolean; message: string }> {
    const otp = this.generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP
    otpStorage.set(`email:${userId}`, {
      code: otp,
      expiresAt,
      attempts: 0,
    })

    // Mock email sending
    console.log(`[MOCK EMAIL] Sending OTP ${otp} to ${email}`)

    return {
      success: true,
      message: `OTP has been sent to ${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`,
    }
  }

  // Verify OTP
  static verifyOTP(method: MFAType, userId: string, code: string): { success: boolean; message: string } {
    const key = `${method.toLowerCase()}:${userId}`
    const stored = otpStorage.get(key)

    if (!stored) {
      return {
        success: false,
        message: 'OTP not found or expired',
      }
    }

    // Check expiry
    if (new Date() > stored.expiresAt) {
      otpStorage.delete(key)
      return {
        success: false,
        message: 'OTP has expired',
      }
    }

    // Check attempts
    if (stored.attempts >= 3) {
      otpStorage.delete(key)
      return {
        success: false,
        message: 'Too many failed attempts',
      }
    }

    // Verify code
    if (stored.code !== code) {
      stored.attempts++
      return {
        success: false,
        message: `Invalid OTP. ${3 - stored.attempts} attempts remaining`,
      }
    }

    // Success
    otpStorage.delete(key)
    return {
      success: true,
      message: 'OTP verified successfully',
    }
  }

  // Generate Authenticator Secret
  static generateAuthenticatorSecret(): speakeasy.GeneratedSecret {
    return speakeasy.generateSecret({
      name: 'DNP Budget System',
      issuer: 'Department of National Parks',
      length: 32,
    })
  }

  // Generate QR Code for Authenticator
  static async generateQRCode(secret: string): Promise<string> {
    const otpauth = speakeasy.otpauthURL({
      secret,
      label: 'DNP Budget',
      issuer: 'DNP',
      encoding: 'base32',
    })

    return await QRCode.toDataURL(otpauth)
  }

  // Verify Authenticator Token
  static verifyAuthenticatorToken(secret: string, token: string): boolean {
    // For demo: accept fixed token
    if (process.env.NODE_ENV === 'development' && token === '123456') {
      return true
    }

    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 * 30 seconds time window
    })
  }

  // Create MFA Challenge
  static createChallenge(userId: string, method: MFAType): MFAChallenge {
    const challenge: MFAChallenge = {
      sessionId: `mfa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      method,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
      maxAttempts: 3,
    }

    mfaChallenges.set(challenge.sessionId, challenge)
    return challenge
  }

  // Get Challenge
  static getChallenge(sessionId: string): MFAChallenge | undefined {
    return mfaChallenges.get(sessionId)
  }

  // Update Challenge Attempts
  static updateChallengeAttempts(sessionId: string): boolean {
    const challenge = mfaChallenges.get(sessionId)
    if (!challenge) return false

    challenge.attempts++
    if (challenge.attempts >= challenge.maxAttempts) {
      mfaChallenges.delete(sessionId)
      return false
    }

    return true
  }

  // Complete Challenge
  static completeChallenge(sessionId: string): void {
    mfaChallenges.delete(sessionId)
  }

  // Cleanup expired challenges
  static cleanupExpiredChallenges(): void {
    const now = new Date()
    for (const [sessionId, challenge] of mfaChallenges.entries()) {
      if (now > challenge.expiresAt) {
        mfaChallenges.delete(sessionId)
      }
    }
  }
}

// Mock ThaID Service
export class ThaIDService {
  // Generate ThaID Auth URL
  static generateAuthURL(returnUrl: string): string {
    const state = Math.random().toString(36).substring(7)
    // Mock ThaID URL (ใน production จะใช้ real ThaID endpoint)
    return `/api/auth/thaid/mock?state=${state}&returnUrl=${encodeURIComponent(returnUrl)}`
  }

  // Verify ThaID Callback
  static async verifyCallback(code: string, state: string): Promise<{
    success: boolean
    data?: {
      idNumber: string
      firstName: string
      lastName: string
      birthDate: string
    }
    error?: string
  }> {
    // Mock verification
    if (code === 'mock_code' && state) {
      return {
        success: true,
        data: {
          idNumber: '1234567890123',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          birthDate: '1980-01-01',
        },
      }
    }

    return {
      success: false,
      error: 'Invalid ThaID verification',
    }
  }

  // Link ThaID to User
  static async linkThaIDToUser(userId: string, idNumber: string): Promise<boolean> {
    // Mock linking (ใน production จะ update database)
    console.log(`[MOCK] Linking ThaID ${idNumber} to user ${userId}`)
    return true
  }
}

// Cleanup expired data periodically
if (typeof window === 'undefined') {
  setInterval(() => {
    MFAService.cleanupExpiredChallenges()
    
    // Cleanup expired OTPs
    const now = new Date()
    for (const [key, data] of otpStorage.entries()) {
      if (now > data.expiresAt) {
        otpStorage.delete(key)
      }
    }
  }, 60 * 1000) // Every minute
}