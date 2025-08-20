"use client"

import { useEffect, useCallback, useState } from 'react'

// Keyboard navigation hook
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip navigation with Tab + /
      if (e.key === '/' && e.shiftKey) {
        e.preventDefault()
        const mainContent = document.querySelector('main')
        if (mainContent) {
          (mainContent as HTMLElement).focus()
        }
      }

      // Toggle high contrast mode with Alt + H
      if (e.key === 'h' && e.altKey) {
        e.preventDefault()
        document.body.classList.toggle('high-contrast')
      }

      // Increase font size with Ctrl + Plus
      if (e.key === '+' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        adjustFontSize(1)
      }

      // Decrease font size with Ctrl + Minus
      if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        adjustFontSize(-1)
      }

      // Reset font size with Ctrl + 0
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        resetFontSize()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}

// Font size adjustment
function adjustFontSize(delta: number) {
  const html = document.documentElement
  const currentSize = parseFloat(
    window.getComputedStyle(html).fontSize
  )
  const newSize = Math.max(12, Math.min(24, currentSize + delta))
  html.style.fontSize = `${newSize}px`
  localStorage.setItem('fontSize', String(newSize))
}

function resetFontSize() {
  document.documentElement.style.fontSize = ''
  localStorage.removeItem('fontSize')
}

// Focus trap hook for modals and dialogs
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      
      const focusableArray = Array.from(focusableElements)
      const firstElement = focusableArray[0] as HTMLElement
      const lastElement = focusableArray[focusableArray.length - 1] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive])
}

// Announce changes to screen readers
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return announce
}

// Reduced motion preference
export function useReducedMotion() {
  const QUERY = '(prefers-reduced-motion: reduce)'
  
  const getInitialState = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  }

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState)

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

