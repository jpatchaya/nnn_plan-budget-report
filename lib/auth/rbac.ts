// Role-Based Access Control (RBAC) Service
import { User, UserRole, Permission } from './types'

// Role hierarchy definition
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [
    UserRole.SUPER_ADMIN,
    UserRole.DEPT_ADMIN,
    UserRole.BUDGET_OFFICER,
    UserRole.VIEWER,
  ],
  [UserRole.DEPT_ADMIN]: [
    UserRole.DEPT_ADMIN,
    UserRole.BUDGET_OFFICER,
    UserRole.VIEWER,
  ],
  [UserRole.BUDGET_OFFICER]: [
    UserRole.BUDGET_OFFICER,
    UserRole.VIEWER,
  ],
  [UserRole.VIEWER]: [
    UserRole.VIEWER,
  ],
}

// Permission mapping by role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.CREATE_BUDGET,
    Permission.APPROVE_BUDGET,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_USERS,
    Permission.SYSTEM_CONFIG,
    Permission.VIEW_ALL_DEPARTMENTS,
    Permission.EDIT_MASTER_DATA,
  ],
  [UserRole.DEPT_ADMIN]: [
    Permission.CREATE_BUDGET,
    Permission.APPROVE_BUDGET,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_USERS,
    Permission.EDIT_MASTER_DATA,
  ],
  [UserRole.BUDGET_OFFICER]: [
    Permission.CREATE_BUDGET,
    Permission.VIEW_REPORTS,
    Permission.EDIT_MASTER_DATA,
  ],
  [UserRole.VIEWER]: [
    Permission.VIEW_REPORTS,
  ],
}

// Resource-based permissions
export interface ResourcePermission {
  resource: string
  actions: string[]
  conditions?: Record<string, any>
}

// Department access control
export interface DepartmentAccess {
  departmentCode: string
  accessLevel: 'own' | 'children' | 'all'
  canViewOtherDepartments: boolean
  canEditOtherDepartments: boolean
}

export class RBACService {
  // Check if user has specific role
  static hasRole(user: Partial<User>, requiredRole: UserRole): boolean {
    if (!user.roles) return false
    
    // Check if user has the exact role or a higher role
    return user.roles.some(userRole => {
      const hierarchy = ROLE_HIERARCHY[userRole]
      return hierarchy.includes(requiredRole)
    })
  }

  // Check if user has specific permission
  static hasPermission(user: Partial<User>, requiredPermission: Permission): boolean {
    if (!user.roles) return false

    // Super admin has all permissions
    if (user.roles.includes(UserRole.SUPER_ADMIN)) {
      return true
    }

    // Check role-based permissions
    for (const role of user.roles) {
      const permissions = ROLE_PERMISSIONS[role]
      if (permissions.includes(requiredPermission)) {
        return true
      }
    }

    // Check custom user permissions
    if (user.permissions && user.permissions.includes(requiredPermission)) {
      return true
    }

    return false
  }

  // Check multiple permissions (AND logic)
  static hasAllPermissions(user: Partial<User>, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission))
  }

  // Check multiple permissions (OR logic)
  static hasAnyPermission(user: Partial<User>, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission))
  }

  // Get user's effective permissions
  static getUserPermissions(user: Partial<User>): Permission[] {
    const permissions = new Set<Permission>()

    // Add role-based permissions
    if (user.roles) {
      for (const role of user.roles) {
        const rolePerms = ROLE_PERMISSIONS[role]
        rolePerms.forEach(perm => permissions.add(perm))
      }
    }

    // Add custom user permissions
    if (user.permissions) {
      user.permissions.forEach(perm => permissions.add(perm))
    }

    return Array.from(permissions)
  }

  // Check department access
  static canAccessDepartment(
    user: Partial<User>,
    targetDepartmentCode: string
  ): boolean {
    // Super admin can access all departments
    if (this.hasPermission(user, Permission.VIEW_ALL_DEPARTMENTS)) {
      return true
    }

    // Check if user's department matches
    if (user.departmentCode === targetDepartmentCode) {
      return true
    }

    // Department admin can access child departments
    if (user.roles?.includes(UserRole.DEPT_ADMIN)) {
      // Mock department hierarchy check
      // In production, this would check actual department hierarchy
      return this.isChildDepartment(user.departmentCode!, targetDepartmentCode)
    }

    return false
  }

  // Check if user can edit department data
  static canEditDepartment(
    user: Partial<User>,
    targetDepartmentCode: string
  ): boolean {
    // Super admin can edit all departments
    if (this.hasPermission(user, Permission.VIEW_ALL_DEPARTMENTS)) {
      return true
    }

    // Must have edit permission
    if (!this.hasPermission(user, Permission.EDIT_MASTER_DATA)) {
      return false
    }

    // Check department access
    return this.canAccessDepartment(user, targetDepartmentCode)
  }

  // Check resource-based permission
  static canAccessResource(
    user: Partial<User>,
    resource: string,
    action: string,
    resourceData?: Record<string, any>
  ): boolean {
    // Define resource permissions
    const resourcePermissions: Record<string, Record<string, Permission[]>> = {
      budget: {
        create: [Permission.CREATE_BUDGET],
        read: [Permission.VIEW_REPORTS],
        update: [Permission.CREATE_BUDGET],
        delete: [Permission.APPROVE_BUDGET],
        approve: [Permission.APPROVE_BUDGET],
      },
      user: {
        create: [Permission.MANAGE_USERS],
        read: [Permission.MANAGE_USERS, Permission.VIEW_REPORTS],
        update: [Permission.MANAGE_USERS],
        delete: [Permission.MANAGE_USERS],
      },
      masterData: {
        create: [Permission.EDIT_MASTER_DATA],
        read: [Permission.VIEW_REPORTS],
        update: [Permission.EDIT_MASTER_DATA],
        delete: [Permission.EDIT_MASTER_DATA],
      },
      report: {
        create: [Permission.VIEW_REPORTS],
        read: [Permission.VIEW_REPORTS],
        export: [Permission.VIEW_REPORTS],
      },
      system: {
        configure: [Permission.SYSTEM_CONFIG],
        backup: [Permission.SYSTEM_CONFIG],
        restore: [Permission.SYSTEM_CONFIG],
      },
    }

    // Check if resource and action are defined
    const permissions = resourcePermissions[resource]?.[action]
    if (!permissions) {
      return false
    }

    // Check if user has any of the required permissions
    if (!this.hasAnyPermission(user, permissions)) {
      return false
    }

    // Additional check for department-specific resources
    if (resourceData?.departmentCode) {
      return this.canAccessDepartment(user, resourceData.departmentCode)
    }

    return true
  }

  // Filter data by department access
  static filterByDepartmentAccess<T extends { departmentCode?: string }>(
    user: Partial<User>,
    data: T[]
  ): T[] {
    // Super admin sees all data
    if (this.hasPermission(user, Permission.VIEW_ALL_DEPARTMENTS)) {
      return data
    }

    // Filter by accessible departments
    return data.filter(item => {
      if (!item.departmentCode) return true
      return this.canAccessDepartment(user, item.departmentCode)
    })
  }

  // Get accessible departments for user
  static getAccessibleDepartments(user: Partial<User>): string[] {
    // Super admin can access all
    if (this.hasPermission(user, Permission.VIEW_ALL_DEPARTMENTS)) {
      return ['*'] // Special marker for all departments
    }

    const departments: string[] = []

    // Add user's own department
    if (user.departmentCode) {
      departments.push(user.departmentCode)
    }

    // Add child departments for dept admin
    if (user.roles?.includes(UserRole.DEPT_ADMIN) && user.departmentCode) {
      // Mock: In production, would fetch actual child departments
      const childDepts = this.getChildDepartments(user.departmentCode)
      departments.push(...childDepts)
    }

    return departments
  }

  // Helper: Check if department is child of another
  private static isChildDepartment(
    parentCode: string,
    childCode: string
  ): boolean {
    // Mock implementation
    // In production, would check actual department hierarchy
    const hierarchy: Record<string, string[]> = {
      'DNP': ['DNP-PL', 'DNP-FIN', 'DNP-HR', 'DNP-IT'],
      'DNP-PL': ['DNP-PL-01', 'DNP-PL-02'],
      'DNP-FIN': ['DNP-FIN-01', 'DNP-FIN-02'],
    }

    const children = hierarchy[parentCode] || []
    return children.includes(childCode)
  }

  // Helper: Get child departments
  private static getChildDepartments(departmentCode: string): string[] {
    // Mock implementation
    const hierarchy: Record<string, string[]> = {
      'DNP': ['DNP-PL', 'DNP-FIN', 'DNP-HR', 'DNP-IT'],
      'DNP-PL': ['DNP-PL-01', 'DNP-PL-02'],
      'DNP-FIN': ['DNP-FIN-01', 'DNP-FIN-02'],
    }

    return hierarchy[departmentCode] || []
  }

  // Check if user can perform action in UI
  static canPerformAction(
    user: Partial<User>,
    action: string,
    context?: Record<string, any>
  ): boolean {
    // Define UI action permissions
    const actionPermissions: Record<string, () => boolean> = {
      'create-budget': () => this.hasPermission(user, Permission.CREATE_BUDGET),
      'approve-budget': () => this.hasPermission(user, Permission.APPROVE_BUDGET),
      'view-all-departments': () => this.hasPermission(user, Permission.VIEW_ALL_DEPARTMENTS),
      'manage-users': () => this.hasPermission(user, Permission.MANAGE_USERS),
      'edit-master-data': () => this.hasPermission(user, Permission.EDIT_MASTER_DATA),
      'system-settings': () => this.hasPermission(user, Permission.SYSTEM_CONFIG),
      'export-report': () => this.hasPermission(user, Permission.VIEW_REPORTS),
      'view-budget': () => {
        if (!this.hasPermission(user, Permission.VIEW_REPORTS)) return false
        if (context?.departmentCode) {
          return this.canAccessDepartment(user, context.departmentCode)
        }
        return true
      },
      'edit-budget': () => {
        if (!this.hasPermission(user, Permission.CREATE_BUDGET)) return false
        if (context?.departmentCode) {
          return this.canEditDepartment(user, context.departmentCode)
        }
        return true
      },
    }

    const checkPermission = actionPermissions[action]
    return checkPermission ? checkPermission() : false
  }
}