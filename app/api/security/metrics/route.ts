import { NextRequest, NextResponse } from 'next/server'
import { SecurityMonitor } from '@/lib/audit/security-monitor'

export async function GET(request: NextRequest) {
  try {
    // Get security metrics
    const metrics = SecurityMonitor.getSecurityMetrics()
    
    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error('Error fetching security metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch security metrics',
      },
      { status: 500 }
    )
  }
}