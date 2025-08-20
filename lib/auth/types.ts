// Authentication Types for DNP Budget System

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  position: string
  department: string
  departmentCode: string
  roles: UserRole[]
  permissions: Permission[]
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  mfaEnabled: boolean
  mfaMethods: MFAMethod[]
  thaIdLinked: boolean
  thaIdNumber?: string
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEPT_ADMIN = 'DEPT_ADMIN',
  BUDGET_OFFICER = 'BUDGET_OFFICER',
  VIEWER = 'VIEWER',
}

export enum Permission {
  CREATE_BUDGET = 'CREATE_BUDGET',
  APPROVE_BUDGET = 'APPROVE_BUDGET',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_USERS = 'MANAGE_USERS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  VIEW_ALL_DEPARTMENTS = 'VIEW_ALL_DEPARTMENTS',
  EDIT_MASTER_DATA = 'EDIT_MASTER_DATA',
}

export interface MFAMethod {
  id: string
  type: MFAType
  isEnabled: boolean
  isVerified: boolean
  createdAt: Date
  lastUsed?: Date
  metadata?: Record<string, any>
}

export enum MFAType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  AUTHENTICATOR = 'AUTHENTICATOR',
  THAI_ID = 'THAI_ID',
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  createdAt: Date
  ipAddress: string
  userAgent: string
  mfaVerified: boolean
  mfaVerifiedAt?: Date
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  message: string
  requireMFA?: boolean
  mfaMethods?: MFAType[]
  sessionId?: string
  token?: string
  refreshToken?: string
  user?: Partial<User>
}

export interface MFAChallenge {
  sessionId: string
  userId: string
  method: MFAType
  createdAt: Date
  expiresAt: Date
  attempts: number
  maxAttempts: number
}

export interface MFAVerifyRequest {
  sessionId: string
  method: MFAType
  code: string
}

export interface MFAVerifyResponse {
  success: boolean
  message: string
  token?: string
  refreshToken?: string
  user?: Partial<User>
}

export interface ThaIDAuthRequest {
  returnUrl: string
  state: string
}

export interface ThaIDAuthResponse {
  success: boolean
  idNumber: string
  firstName: string
  lastName: string
  birthDate: string
  issueDate: string
  expiryDate: string
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventReuse: number
  expiryDays: number
}

export interface LoginAttempt {
  userId?: string
  username: string
  ipAddress: string
  userAgent: string
  success: boolean
  reason?: string
  attemptedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: Date
}

// Mock data for development
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@dnp.go.th',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    position: 'ผู้อำนวยการกองแผนงานและสารสนเทศ',
    department: 'กองแผนงานและสารสนเทศ',
    departmentCode: 'DNP-PL',
    roles: [UserRole.SUPER_ADMIN],
    permissions: Object.values(Permission),
    isActive: true,
    lastLogin: new Date('2024-12-19T10:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-19'),
    mfaEnabled: true,
    mfaMethods: [
      {
        id: '1',
        type: MFAType.EMAIL,
        isEnabled: true,
        isVerified: true,
        createdAt: new Date('2024-01-01'),
        lastUsed: new Date('2024-12-19T10:30:00'),
      },
      {
        id: '2',
        type: MFAType.AUTHENTICATOR,
        isEnabled: true,
        isVerified: true,
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date('2024-12-18T14:20:00'),
      },
    ],
    thaIdLinked: true,
    thaIdNumber: '1234567890123',
  },
  {
    id: '2',
    username: 'budget_officer',
    email: 'budget@dnp.go.th',
    firstName: 'สมหญิง',
    lastName: 'รักงาน',
    position: 'นักวิเคราะห์นโยบายและแผน',
    department: 'กองแผนงานและสารสนเทศ',
    departmentCode: 'DNP-PL',
    roles: [UserRole.BUDGET_OFFICER],
    permissions: [
      Permission.CREATE_BUDGET,
      Permission.VIEW_REPORTS,
      Permission.EDIT_MASTER_DATA,
    ],
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-19'),
    mfaEnabled: true,
    mfaMethods: [
      {
        id: '3',
        type: MFAType.SMS,
        isEnabled: true,
        isVerified: true,
        createdAt: new Date('2024-03-01'),
        metadata: { phoneNumber: '08X-XXX-1234' },
      },
    ],
    thaIdLinked: false,
  },
]

// Mock password for development (ใน production จะใช้ hashed password)
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin': 'Admin@123',
  'budget_officer': 'Budget@456',
}

// Default password policy
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,
  expiryDays: 90,
}