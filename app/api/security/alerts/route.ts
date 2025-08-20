import { NextRequest, NextResponse } from 'next/server'
import { SecurityMonitor, AlertStatus, AlertSeverity, SecurityAlertType } from '@/lib/audit/security-monitor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filter: any = {}
    
    // Status filter
    const statuses = searchParams.get('statuses')
    if (statuses) {
      filter.status = statuses.split(',') as AlertStatus[]
    }
    
    // Severity filter
    const severities = searchParams.get('severities')
    if (severities) {
      filter.severity = severities.split(',') as AlertSeverity[]
    }
    
    // Type filter
    const types = searchParams.get('types')
    if (types) {
      filter.type = types.split(',') as SecurityAlertType[]
    }
    
    // Date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate) filter.startDate = new Date(startDate)
    if (endDate) filter.endDate = new Date(endDate)
    
    // Pagination
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    if (limit) filter.limit = parseInt(limit)
    if (offset) filter.offset = parseInt(offset)
    
    // Get alerts
    const result = SecurityMonitor.getAlerts(filter)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching security alerts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch security alerts',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, status, assignedTo, resolution } = body
    
    if (!alertId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: alertId, status',
        },
        { status: 400 }
      )
    }
    
    // Validate status
    if (!Object.values(AlertStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status value',
        },
        { status: 400 }
      )
    }
    
    // Update alert
    const updatedAlert = await SecurityMonitor.updateAlertStatus(
      alertId,
      status,
      assignedTo,
      resolution
    )
    
    if (!updatedAlert) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alert not found',
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedAlert,
    })
  } catch (error) {
    console.error('Error updating security alert:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update security alert',
      },
      { status: 500 }
    )
  }
}