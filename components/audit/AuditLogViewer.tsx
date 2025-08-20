"use client"

import React, { useEffect, useState } from 'react'
import { useAudit } from '@/hooks/useAudit'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  getSeverityColor,
  getCategoryIcon,
  LogCategory,
  LogSeverity,
  AuditLog,
} from '@/lib/audit/types'
import {
  Search,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react'

export function AuditLogViewer() {
  const {
    logs,
    totalLogs,
    statistics,
    loading,
    error,
    filter,
    fetchLogs,
    fetchStatistics,
    searchLogs,
    filterByCategory,
    filterBySeverity,
    filterByDateRange,
    currentPage,
    totalPages,
    goToPage,
    exportLogs,
    autoRefresh,
    setAutoRefresh,
  } = useAudit()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<LogCategory[]>([])
  const [selectedSeverities, setSelectedSeverities] = useState<LogSeverity[]>([])
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Initial load
  useEffect(() => {
    fetchLogs()
    fetchStatistics()
  }, [fetchLogs, fetchStatistics])

  const handleSearch = () => {
    searchLogs(searchTerm)
  }

  const handleCategoryFilter = (category: LogCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    filterByCategory(newCategories)
  }

  const handleSeverityFilter = (severity: LogSeverity) => {
    const newSeverities = selectedSeverities.includes(severity)
      ? selectedSeverities.filter(s => s !== severity)
      : [...selectedSeverities, severity]
    setSelectedSeverities(newSeverities)
    filterBySeverity(newSeverities)
  }

  const getSeverityIcon = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.DEBUG:
      case LogSeverity.INFO:
        return <Info className="h-4 w-4" />
      case LogSeverity.WARNING:
        return <AlertTriangle className="h-4 w-4" />
      case LogSeverity.ERROR:
        return <XCircle className="h-4 w-4" />
      case LogSeverity.CRITICAL:
        return <Shield className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSuccessIcon = (success: boolean) => {
    return success
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalLogs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.failedLogins}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statistics.criticalEvents}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {statistics.suspiciousActivities}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                System activity and security event monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh" className="text-sm">
                  Auto-refresh
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs()}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportLogs('csv')}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Advanced Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs by action, user, resource, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategories([])
                  setSelectedSeverities([])
                  fetchLogs()
                }}
              >
                Clear
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategories.includes(LogCategory.SECURITY) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(LogCategory.SECURITY)}
              >
                <Shield className="h-3 w-3 mr-1" />
                Security Events
              </Button>
              <Button
                variant={selectedSeverities.includes(LogSeverity.ERROR) || selectedSeverities.includes(LogSeverity.CRITICAL) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const errorSeverities = [LogSeverity.ERROR, LogSeverity.CRITICAL]
                  const hasErrorSeverities = errorSeverities.some(s => selectedSeverities.includes(s))
                  if (hasErrorSeverities) {
                    setSelectedSeverities(prev => prev.filter(s => !errorSeverities.includes(s)))
                    filterBySeverity(selectedSeverities.filter(s => !errorSeverities.includes(s)))
                  } else {
                    const newSeverities = [...new Set([...selectedSeverities, ...errorSeverities])]
                    setSelectedSeverities(newSeverities)
                    filterBySeverity(newSeverities)
                  }
                }}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Errors Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => filterByDateRange(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date())}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Last 24h
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Filter failed actions')}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Failed Actions
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Category:</span>
                {Object.values(LogCategory).map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {getCategoryIcon(category)} {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Severity Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Severity:</span>
                {Object.values(LogSeverity).map(severity => (
                  <Badge
                    key={severity}
                    variant={selectedSeverities.includes(severity) ? "default" : "outline"}
                    className={`cursor-pointer hover:opacity-80 ${getSeverityColor(severity)}`}
                    onClick={() => handleSeverityFilter(severity)}
                  >
                    {getSeverityIcon(severity)} {severity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedCategories.length > 0 || selectedSeverities.length > 0 || searchTerm) && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary">
                    {getCategoryIcon(category)} {category}
                  </Badge>
                ))}
                {selectedSeverities.map(severity => (
                  <Badge key={severity} variant="secondary" className={getSeverityColor(severity)}>
                    {getSeverityIcon(severity)} {severity}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div>{new Date(log.timestamp).toLocaleDateString('th-TH')}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString('th-TH')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{log.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.department}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{log.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.resource && (
                          <div className="text-sm">
                            {log.resource}
                            {log.resourceId && (
                              <div className="text-xs text-muted-foreground">
                                ID: {log.resourceId}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryIcon(log.category)} {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {getSeverityIcon(log.severity)} {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getSuccessIcon(log.success)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {showDetails === log.id && (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">IP Address:</span> {log.ipAddress}
                              </div>
                              <div>
                                <span className="font-medium">Session ID:</span> {log.sessionId || 'N/A'}
                              </div>
                              {log.errorMessage && (
                                <div className="col-span-2">
                                  <span className="font-medium">Error:</span>
                                  <span className="text-red-600 ml-2">{log.errorMessage}</span>
                                </div>
                              )}
                              {log.details && (
                                <div className="col-span-2">
                                  <span className="font-medium">Details:</span>
                                  <pre className="mt-1 text-xs bg-background p-2 rounded">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {logs.length} of {totalLogs} logs
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}