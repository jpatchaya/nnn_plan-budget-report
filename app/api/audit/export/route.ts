import { NextRequest, NextResponse } from 'next/server'
import { AuditService } from '@/lib/audit/audit-service'
import { AuditFilter, LogCategory, LogSeverity } from '@/lib/audit/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format = 'json', filter = {} } = body
    
    // Validate format
    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid format. Supported formats: json, csv',
        },
        { status: 400 }
      )
    }
    
    // Parse filter
    const auditFilter: AuditFilter = {}
    
    if (filter.startDate) auditFilter.startDate = new Date(filter.startDate)
    if (filter.endDate) auditFilter.endDate = new Date(filter.endDate)
    if (filter.userId) auditFilter.userId = filter.userId
    if (filter.username) auditFilter.username = filter.username
    if (filter.department) auditFilter.department = filter.department
    if (filter.category) auditFilter.category = filter.category
    if (filter.action) auditFilter.action = filter.action
    if (filter.severity) auditFilter.severity = filter.severity
    if (filter.success !== undefined) auditFilter.success = filter.success
    if (filter.searchTerm) auditFilter.searchTerm = filter.searchTerm
    
    // Export logs
    const exportData = await AuditService.exportLogs(auditFilter, format)
    
    // Log the export action
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    await AuditService.createLog({
      userId: body.userId || 'unknown',
      username: body.username || 'unknown',
      userFullName: body.userFullName || 'unknown',
      department: body.department || 'unknown',
      departmentCode: body.departmentCode || 'unknown',
      action: 'DATA_EXPORT',
      resource: 'AuditLogs',
      details: {
        format,
        filter: auditFilter,
        exportSize: exportData.length,
      },
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: true,
    })
    
    // Set appropriate headers
    const contentType = format === 'json' ? 'application/json' : 'text/csv'
    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`
    
    return new NextResponse(exportData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export audit logs',
      },
      { status: 500 }
    )
  }
}