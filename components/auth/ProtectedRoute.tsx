"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { usePermission } from '@/hooks/usePermission'
import { useRole } from '@/hooks/useRole'
import { Permission, UserRole } from '@/lib/auth/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Shield, AlertCircle } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  requiredRoles?: UserRole[]
  requireAll?: boolean // If true, requires ALL permissions/roles. If false, requires ANY
  fallback?: React.ReactNode
  redirectTo?: string
  showError?: boolean
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback,
  redirectTo,
  showError = true,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermission()
  const { hasRole } = useRole()

  const checkAccess = (): boolean => {
    // Check authentication
    if (!isAuthenticated || !user) {
      return false
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions)
      
      if (!hasRequiredPermissions) {
        return false
      }
    }

    // Check roles
    if (requiredRoles.length > 0) {
      const hasRequiredRoles = requireAll
        ? requiredRoles.every(role => hasRole(role))
        : requiredRoles.some(role => hasRole(role))
      
      if (!hasRequiredRoles) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    if (!loading && !isAuthenticated && redirectTo) {
      router.push(redirectTo)
    }
  }, [loading, isAuthenticated, redirectTo, router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check access
  const hasAccess = checkAccess()

  // User doesn't have access
  if (!hasAccess) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>
    }

    // Redirect if specified
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }

    // Show error message
    if (showError) {
      return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      )
    }

    // Return nothing
    return null
  }

  // User has access, render children
  return <>{children}</>
}

// Convenience component for permission-based rendering
interface PermissionGateProps {
  children: React.ReactNode
  permission: Permission | Permission[]
  fallback?: React.ReactNode
  requireAll?: boolean
}

export function PermissionGate({
  children,
  permission,
  fallback = null,
  requireAll = false,
}: PermissionGateProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermission()

  const permissions = Array.isArray(permission) ? permission : [permission]
  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Convenience component for role-based rendering
interface RoleGateProps {
  children: React.ReactNode
  role: UserRole | UserRole[]
  fallback?: React.ReactNode
  requireAll?: boolean
}

export function RoleGate({
  children,
  role,
  fallback = null,
  requireAll = false,
}: RoleGateProps) {
  const { hasRole } = useRole()

  const roles = Array.isArray(role) ? role : [role]
  const hasAccess = requireAll
    ? roles.every(r => hasRole(r))
    : roles.some(r => hasRole(r))

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Department access gate
interface DepartmentGateProps {
  children: React.ReactNode
  departmentCode: string
  requireEdit?: boolean
  fallback?: React.ReactNode
}

export function DepartmentGate({
  children,
  departmentCode,
  requireEdit = false,
  fallback = null,
}: DepartmentGateProps) {
  const { canAccessDepartment, canEditDepartment } = usePermission()

  const hasAccess = requireEdit
    ? canEditDepartment(departmentCode)
    : canAccessDepartment(departmentCode)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}