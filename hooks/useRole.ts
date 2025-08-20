"use client"

import { useAuth } from '@/contexts/auth-context'
import { RBACService } from '@/lib/auth/rbac'
import { UserRole } from '@/lib/auth/types'

export function useRole() {
  const { user } = useAuth()

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return RBACService.hasRole(user, role)
  }

  const isAdmin = (): boolean => {
    return hasRole(UserRole.SUPER_ADMIN) || hasRole(UserRole.DEPT_ADMIN)
  }

  const isSuperAdmin = (): boolean => {
    return hasRole(UserRole.SUPER_ADMIN)
  }

  const isDeptAdmin = (): boolean => {
    return hasRole(UserRole.DEPT_ADMIN)
  }

  const isBudgetOfficer = (): boolean => {
    return hasRole(UserRole.BUDGET_OFFICER)
  }

  const isViewer = (): boolean => {
    return hasRole(UserRole.VIEWER)
  }

  const getUserRoles = (): UserRole[] => {
    if (!user || !user.roles) return []
    return user.roles
  }

  const getHighestRole = (): UserRole | null => {
    const roles = getUserRoles()
    if (roles.length === 0) return null

    // Priority order
    const rolePriority = [
      UserRole.SUPER_ADMIN,
      UserRole.DEPT_ADMIN,
      UserRole.BUDGET_OFFICER,
      UserRole.VIEWER,
    ]

    for (const role of rolePriority) {
      if (roles.includes(role)) {
        return role
      }
    }

    return roles[0]
  }

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'ผู้ดูแลระบบ',
      [UserRole.DEPT_ADMIN]: 'ผู้ดูแลหน่วยงาน',
      [UserRole.BUDGET_OFFICER]: 'เจ้าหน้าที่งบประมาณ',
      [UserRole.VIEWER]: 'ผู้ใช้ทั่วไป',
    }
    return labels[role] || role
  }

  const getRoleBadgeColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.DEPT_ADMIN]: 'bg-orange-100 text-orange-800',
      [UserRole.BUDGET_OFFICER]: 'bg-blue-100 text-blue-800',
      [UserRole.VIEWER]: 'bg-gray-100 text-gray-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  return {
    hasRole,
    isAdmin,
    isSuperAdmin,
    isDeptAdmin,
    isBudgetOfficer,
    isViewer,
    getUserRoles,
    getHighestRole,
    getRoleLabel,
    getRoleBadgeColor,
  }
}