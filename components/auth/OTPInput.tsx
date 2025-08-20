"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Update internal state when value prop changes
    if (value) {
      const otpArray = value.split('').slice(0, length)
      const newOtp = [...otpArray, ...new Array(length - otpArray.length).fill('')]
      setOtp(newOtp)
    }
  }, [value, length])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChange(otpString)

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').slice(0, length)
    const filledOtp = [...newOtp, ...new Array(length - newOtp.length).fill('')]
    setOtp(filledOtp)

    const otpString = filledOtp.join('')
    onChange(otpString)

    // Focus last filled input or last input
    const lastFilledIndex = newOtp.length - 1
    const focusIndex = Math.min(lastFilledIndex, length - 1)
    inputRefs.current[focusIndex]?.focus()

    // Check if complete
    if (newOtp.length === length) {
      onComplete?.(otpString)
    }
  }

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold',
            'focus:ring-2 focus:ring-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}