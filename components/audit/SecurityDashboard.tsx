"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SecurityMonitor,
  SecurityAlert,
  AlertSeverity,
  AlertStatus,
  SecurityAlertType,
} from '@/lib/audit/security-monitor'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  User,
  Activity,
  TrendingUp,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'

export function SecurityDashboard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [totalAlerts, setTotalAlerts] = useState(0)
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL')
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL')

  // Load security data
  const loadSecurityData = useCallback(async () => {
    setLoading(true)
    try {
      // Get alerts with filters
      const alertFilter: any = {}
      if (statusFilter !== 'ALL') {
        alertFilter.status = [statusFilter]
      }
      if (severityFilter !== 'ALL') {
        alertFilter.severity = [severityFilter]
      }

      const { alerts: alertData, total } = SecurityMonitor.getAlerts(alertFilter)
      setAlerts(alertData)
      setTotalAlerts(total)

      // Get security metrics
      const metricsData = SecurityMonitor.getSecurityMetrics()
      setMetrics(metricsData)
    } catch (error) {
      console.error('Failed to load security data:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, severityFilter])

  useEffect(() => {
    loadSecurityData()
  }, [loadSecurityData])

  // Handle alert status update
  const handleStatusUpdate = async (alertId: string, newStatus: AlertStatus) => {
    try {
      await SecurityMonitor.updateAlertStatus(alertId, newStatus, 'current-user')
      loadSecurityData() // Refresh data
    } catch (error) {
      console.error('Failed to update alert status:', error)
    }
  }

  // Get severity color
  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return 'bg-blue-100 text-blue-800'
      case AlertSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case AlertSeverity.HIGH:
        return 'bg-orange-100 text-orange-800'
      case AlertSeverity.CRITICAL:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status color
  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.OPEN:
        return 'bg-red-100 text-red-800'
      case AlertStatus.INVESTIGATING:
        return 'bg-yellow-100 text-yellow-800'
      case AlertStatus.RESOLVED:
        return 'bg-green-100 text-green-800'
      case AlertStatus.FALSE_POSITIVE:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get severity icon
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return <Activity className="h-4 w-4" />
      case AlertSeverity.MEDIUM:
        return <AlertTriangle className="h-4 w-4" />
      case AlertSeverity.HIGH:
        return <AlertCircle className="h-4 w-4" />
      case AlertSeverity.CRITICAL:
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  // Get status icon
  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.OPEN:
        return <XCircle className="h-4 w-4" />
      case AlertStatus.INVESTIGATING:
        return <Clock className="h-4 w-4" />
      case AlertStatus.RESOLVED:
        return <CheckCircle className="h-4 w-4" />
      case AlertStatus.FALSE_POSITIVE:
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Total Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Open Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metrics.openAlerts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {metrics.criticalAlerts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.totalAlerts > 0 
                  ? Math.round(((metrics.totalAlerts - metrics.openAlerts) / metrics.totalAlerts) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="rules">Security Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>
                    Monitor and manage security events and threats
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSecurityData}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    {Object.values(AlertStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Severity</SelectItem>
                    {Object.values(AlertSeverity).map(severity => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alerts Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{alert.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {alert.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {alert.type.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1">{alert.severity}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(alert.status)}>
                            {getStatusIcon(alert.status)}
                            <span className="ml-1">{alert.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(alert.timestamp).toLocaleDateString('th-TH')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {alert.status === AlertStatus.OPEN && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(alert.id, AlertStatus.INVESTIGATING)}
                              >
                                Investigate
                              </Button>
                            )}
                            {alert.status === AlertStatus.INVESTIGATING && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(alert.id, AlertStatus.RESOLVED)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No security alerts found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Rules</CardTitle>
              <CardDescription>
                Configure security monitoring rules and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SecurityMonitor.getRules().map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Threshold: {rule.threshold} events in {rule.timeWindow} minutes
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alerts by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts by Type</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-2">
                    {Object.entries(metrics.alertsByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{String(count)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alerts by Severity */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-2">
                    {Object.entries(metrics.alertsBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex justify-between items-center">
                        <span className="text-sm">{severity}</span>
                        <Badge className={getSeverityColor(severity as AlertSeverity)}>
                          {String(count)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedAlert.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity}
                    </Badge>
                    <Badge className={getStatusColor(selectedAlert.status)}>
                      {selectedAlert.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAlert(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedAlert.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Alert ID:</span> {selectedAlert.id}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedAlert.type}
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span>{' '}
                    {new Date(selectedAlert.timestamp).toLocaleString('th-TH')}
                  </div>
                  <div>
                    <span className="font-medium">Related Logs:</span> {selectedAlert.relatedLogs.length}
                  </div>
                  {selectedAlert.assignedTo && (
                    <div>
                      <span className="font-medium">Assigned To:</span> {selectedAlert.assignedTo}
                    </div>
                  )}
                  {selectedAlert.resolvedAt && (
                    <div>
                      <span className="font-medium">Resolved At:</span>{' '}
                      {new Date(selectedAlert.resolvedAt).toLocaleString('th-TH')}
                    </div>
                  )}
                </div>
              </div>

              {selectedAlert.resolution && (
                <div>
                  <h4 className="font-medium mb-2">Resolution</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.resolution}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedAlert.status === AlertStatus.OPEN && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedAlert.id, AlertStatus.INVESTIGATING)
                      setSelectedAlert(null)
                    }}
                  >
                    Start Investigation
                  </Button>
                )}
                {selectedAlert.status === AlertStatus.INVESTIGATING && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedAlert.id, AlertStatus.RESOLVED)
                      setSelectedAlert(null)
                    }}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}