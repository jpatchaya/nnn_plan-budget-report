import { NextRequest, NextResponse } from 'next/server'
import { AuditService } from '@/lib/audit/audit-service'
import { AuditFilter, LogCategory, LogSeverity } from '@/lib/audit/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filter parameters (same as logs endpoint)
    const filter: AuditFilter = {}
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate) filter.startDate = new Date(startDate)
    if (endDate) filter.endDate = new Date(endDate)
    
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const department = searchParams.get('department')
    if (userId) filter.userId = userId
    if (username) filter.username = username
    if (department) filter.department = department
    
    const categories = searchParams.get('categories')
    if (categories) {
      filter.category = categories.split(',') as LogCategory[]
    }
    
    const actions = searchParams.get('actions')
    if (actions) {
      filter.action = actions.split(',')
    }
    
    const severities = searchParams.get('severities')
    if (severities) {
      filter.severity = severities.split(',') as LogSeverity[]
    }
    
    const success = searchParams.get('success')
    if (success !== null) {
      filter.success = success === 'true'
    }
    
    const searchTerm = searchParams.get('searchTerm')
    if (searchTerm) filter.searchTerm = searchTerm
    
    // Get statistics
    const statistics = await AuditService.getStatistics(filter)
    
    return NextResponse.json({
      success: true,
      data: statistics,
    })
  } catch (error) {
    console.error('Error fetching audit statistics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit statistics',
      },
      { status: 500 }
    )
  }
}