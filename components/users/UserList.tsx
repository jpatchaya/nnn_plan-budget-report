"use client"

import React, { useState } from 'react'
import { User, UserRole, MOCK_USERS } from '@/lib/auth/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRole } from '@/hooks/useRole'
import { usePermission } from '@/hooks/usePermission'
import { PermissionGate } from '@/components/auth/ProtectedRoute'
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Key,
  Mail,
  Phone,
  Building,
} from 'lucide-react'
import { Permission } from '@/lib/auth/types'

interface UserListProps {
  onEditUser?: (user: User) => void
  onDeleteUser?: (user: User) => void
  onResetPassword?: (user: User) => void
}

export function UserList({
  onEditUser,
  onDeleteUser,
  onResetPassword,
}: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { getRoleLabel, getRoleBadgeColor } = useRole()
  const { filterByDepartmentAccess, canEditDepartment } = usePermission()

  // Mock data - in production, would fetch from API
  const [users, setUsers] = useState<User[]>(MOCK_USERS)

  // Filter users based on department access
  const accessibleUsers = filterByDepartmentAccess(users)

  // Apply search and filters
  const filteredUsers = accessibleUsers.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = !selectedDepartment || user.departmentCode === selectedDepartment
    const matchesRole = !selectedRole || user.roles.includes(selectedRole as UserRole)

    return matchesSearch && matchesDepartment && matchesRole
  })

  const handleToggleStatus = (user: User) => {
    // Mock status toggle
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    ))
  }

  // Get unique departments
  const departments = Array.from(new Set(accessibleUsers.map(u => u.department)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage system users, roles, and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <select
            className="px-3 py-2 border rounded-md"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-md"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            <option value={UserRole.DEPT_ADMIN}>Dept Admin</option>
            <option value={UserRole.BUDGET_OFFICER}>Budget Officer</option>
            <option value={UserRole.VIEWER}>Viewer</option>
          </select>
        </div>

        {/* User Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.department}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.departmentCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className={getRoleBadgeColor(role)}
                        >
                          {getRoleLabel(role)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <UserX className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.mfaEnabled ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        <Shield className="mr-1 h-3 w-3" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString('th-TH')}
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleTimeString('th-TH')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <PermissionGate permission={Permission.MANAGE_USERS}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onEditUser?.(user)}
                            disabled={!canEditDepartment(user.departmentCode)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            disabled={!canEditDepartment(user.departmentCode)}
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onResetPassword?.(user)}
                            disabled={!canEditDepartment(user.departmentCode)}
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteUser?.(user)}
                            className="text-red-600"
                            disabled={!canEditDepartment(user.departmentCode)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </PermissionGate>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            Showing {filteredUsers.length} of {accessibleUsers.length} users
          </div>
          <div className="flex gap-4">
            <span>Active: {filteredUsers.filter(u => u.isActive).length}</span>
            <span>MFA Enabled: {filteredUsers.filter(u => u.mfaEnabled).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}