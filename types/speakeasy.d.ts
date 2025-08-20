declare module 'speakeasy' {
  export interface GeneratedSecret {
    ascii: string
    hex: string
    base32: string
    qr_code_ascii?: string
    qr_code_hex?: string
    qr_code_base32?: string
    google_auth_qr?: string
    otpauth_url?: string
  }

  export interface GenerateSecretOptions {
    length?: number
    name?: string
    issuer?: string
    symbols?: boolean
    otpauth_url?: boolean
    google_auth_qr?: boolean
    qr_codes?: boolean
  }

  export interface OtpauthURLOptions {
    secret: string
    label: string
    issuer?: string
    type?: 'totp' | 'hotp'
    counter?: number
    algorithm?: string
    digits?: number
    period?: number
    encoding?: 'ascii' | 'hex' | 'base32'
  }

  export interface VerifyOptions {
    secret: string
    encoding: 'ascii' | 'hex' | 'base32'
    token: string
    window?: number
    time?: number
    counter?: number
    algorithm?: string
    digits?: number
    period?: number
  }

  export interface Totp {
    verify(options: VerifyOptions): boolean
    generate(options: Omit<VerifyOptions, 'token' | 'window'>): string
  }

  export interface Hotp {
    verify(options: VerifyOptions): boolean | { delta: number }
    generate(options: Omit<VerifyOptions, 'token' | 'window'>): string
  }

  export function generateSecret(options?: GenerateSecretOptions): GeneratedSecret
  export function otpauthURL(options: OtpauthURLOptions): string
  export const totp: Totp
  export const hotp: Hotp
}