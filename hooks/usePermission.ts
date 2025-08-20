"use client"

import { useAuth } from '@/contexts/auth-context'
import { RBACService } from '@/lib/auth/rbac'
import { Permission } from '@/lib/auth/types'

export function usePermission() {
  const { user } = useAuth()

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return RBACService.hasPermission(user, permission)
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false
    return RBACService.hasAllPermissions(user, permissions)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false
    return RBACService.hasAnyPermission(user, permissions)
  }

  const canAccessDepartment = (departmentCode: string): boolean => {
    if (!user) return false
    return RBACService.canAccessDepartment(user, departmentCode)
  }

  const canEditDepartment = (departmentCode: string): boolean => {
    if (!user) return false
    return RBACService.canEditDepartment(user, departmentCode)
  }

  const canAccessResource = (
    resource: string,
    action: string,
    resourceData?: Record<string, any>
  ): boolean => {
    if (!user) return false
    return RBACService.canAccessResource(user, resource, action, resourceData)
  }

  const canPerformAction = (action: string, context?: Record<string, any>): boolean => {
    if (!user) return false
    return RBACService.canPerformAction(user, action, context)
  }

  const getAccessibleDepartments = (): string[] => {
    if (!user) return []
    return RBACService.getAccessibleDepartments(user)
  }

  const filterByDepartmentAccess = <T extends { departmentCode?: string }>(
    data: T[]
  ): T[] => {
    if (!user) return []
    return RBACService.filterByDepartmentAccess(user, data)
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccessDepartment,
    canEditDepartment,
    canAccessResource,
    canPerformAction,
    getAccessibleDepartments,
    filterByDepartmentAccess,
  }
}