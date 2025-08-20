import { NextRequest, NextResponse } from 'next/server'
import { AuditService } from '@/lib/audit/audit-service'
import { AuditFilter, LogCategory, LogSeverity } from '@/lib/audit/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filter: AuditFilter = {}
    
    // Date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate) filter.startDate = new Date(startDate)
    if (endDate) filter.endDate = new Date(endDate)
    
    // User filters
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const department = searchParams.get('department')
    if (userId) filter.userId = userId
    if (username) filter.username = username
    if (department) filter.department = department
    
    // Category filter
    const categories = searchParams.get('categories')
    if (categories) {
      filter.category = categories.split(',') as LogCategory[]
    }
    
    // Action filter
    const actions = searchParams.get('actions')
    if (actions) {
      filter.action = actions.split(',')
    }
    
    // Severity filter
    const severities = searchParams.get('severities')
    if (severities) {
      filter.severity = severities.split(',') as LogSeverity[]
    }
    
    // Success filter
    const success = searchParams.get('success')
    if (success !== null) {
      filter.success = success === 'true'
    }
    
    // Search term
    const searchTerm = searchParams.get('searchTerm')
    if (searchTerm) filter.searchTerm = searchTerm
    
    // Pagination
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    if (limit) filter.limit = parseInt(limit)
    if (offset) filter.offset = parseInt(offset)
    
    // Sorting
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy) filter.sortBy = sortBy as any
    if (sortOrder) filter.sortOrder = sortOrder as 'asc' | 'desc'
    
    // Get logs
    const result = await AuditService.getLogs(filter)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit logs',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['userId', 'username', 'userFullName', 'department', 'departmentCode', 'action']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        )
      }
    }
    
    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Create audit log
    const log = await AuditService.createLog({
      ...body,
      ipAddress,
      userAgent,
    })
    
    return NextResponse.json({
      success: true,
      data: log,
    })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create audit log',
      },
      { status: 500 }
    )
  }
}