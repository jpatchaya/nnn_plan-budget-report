"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OTPInput } from './OTPInput'
import { 
  Smartphone, 
  Mail, 
  Shield, 
  CreditCard,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock
} from 'lucide-react'
import { MFAType } from '@/lib/auth/types'

interface MFAVerificationProps {
  availableMethods: MFAType[]
  sessionId: string
  onVerify: (method: MFAType, code: string) => Promise<void>
  onCancel: () => void
  onResend?: (method: MFAType) => Promise<void>
}

export function MFAVerification({
  availableMethods,
  sessionId,
  onVerify,
  onCancel,
  onResend,
}: MFAVerificationProps) {
  const [selectedMethod, setSelectedMethod] = useState<MFAType>(availableMethods[0])
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [resendCooldown])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a complete 6-digit code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onVerify(selectedMethod, otp)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!onResend || resendCooldown > 0) return

    setLoading(true)
    setError(null)

    try {
      await onResend(selectedMethod)
      setResendCooldown(60) // 60 seconds cooldown
      setOtp('')
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  const getMethodIcon = (method: MFAType) => {
    switch (method) {
      case MFAType.SMS:
        return <Smartphone className="h-5 w-5" />
      case MFAType.EMAIL:
        return <Mail className="h-5 w-5" />
      case MFAType.AUTHENTICATOR:
        return <Shield className="h-5 w-5" />
      case MFAType.THAI_ID:
        return <CreditCard className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getMethodLabel = (method: MFAType) => {
    switch (method) {
      case MFAType.SMS:
        return 'SMS'
      case MFAType.EMAIL:
        return 'Email'
      case MFAType.AUTHENTICATOR:
        return 'Authenticator App'
      case MFAType.THAI_ID:
        return 'Thai ID'
      default:
        return method
    }
  }

  const getMethodDescription = (method: MFAType) => {
    switch (method) {
      case MFAType.SMS:
        return 'A 6-digit code has been sent to your registered mobile number'
      case MFAType.EMAIL:
        return 'A 6-digit code has been sent to your registered email address'
      case MFAType.AUTHENTICATOR:
        return 'Enter the code from your authenticator app'
      case MFAType.THAI_ID:
        return 'Verify using your Thai National ID card'
      default:
        return 'Enter your verification code'
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h3 className="text-lg font-semibold">Verification Successful</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your identity has been verified. Redirecting...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Verify your identity to complete login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMethods.length > 1 ? (
          <Tabs value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as MFAType)}>
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableMethods.length}, 1fr)` }}>
              {availableMethods.map((method) => (
                <TabsTrigger key={method} value={method} className="flex items-center gap-2">
                  {getMethodIcon(method)}
                  <span className="hidden sm:inline">{getMethodLabel(method)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {availableMethods.map((method) => (
              <TabsContent key={method} value={method} className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getMethodDescription(method)}
                  </AlertDescription>
                </Alert>

                {method !== MFAType.THAI_ID && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Enter verification code</label>
                      <OTPInput
                        value={otp}
                        onChange={setOtp}
                        onComplete={handleVerify}
                        disabled={loading}
                      />
                    </div>

                    {onResend && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResend}
                          disabled={loading || resendCooldown > 0}
                          className="text-sm"
                        >
                          {resendCooldown > 0 ? (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Resend in {resendCooldown}s
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend Code
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {method === MFAType.THAI_ID && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Please insert your Thai National ID card into the reader and click verify.
                    </p>
                    <div className="p-4 border-2 border-dashed rounded-lg text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Card reader ready</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getMethodDescription(selectedMethod)}
              </AlertDescription>
            </Alert>

            {selectedMethod !== MFAType.THAI_ID && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerify}
                    disabled={loading}
                  />
                </div>

                {onResend && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResend}
                      disabled={loading || resendCooldown > 0}
                      className="text-sm"
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Resend in {resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend Code
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={loading || (selectedMethod !== MFAType.THAI_ID && otp.length !== 6)}
            className="flex-1"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          For demo: use code <strong>123456</strong>
        </p>
      </CardContent>
    </Card>
  )
}