"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogViewer } from '@/components/audit/AuditLogViewer'
import { SecurityDashboard } from '@/components/audit/SecurityDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, FileText, Activity, AlertTriangle } from 'lucide-react'

export default function AuditPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit & Security</h1>
          <p className="text-muted-foreground">
            Monitor system activities, security events, and compliance
          </p>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Dashboard
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time Monitoring
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Compliance Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Real-time system performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">12%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">34%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm text-muted-foreground">47</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database Connections</span>
                    <span className="text-sm text-muted-foreground">12/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>
                  Current security posture and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Threat Level</span>
                    <span className="text-sm text-green-600 font-medium">LOW</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Failed Login Attempts (24h)</span>
                    <span className="text-sm text-muted-foreground">3</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Blocked IPs</span>
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Security Scan</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Firewall Status</span>
                    <span className="text-sm text-green-600 font-medium">ACTIVE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Protection</CardTitle>
                <CardDescription>
                  PDPA compliance and data handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Encryption</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Access Controls</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Audit Trails</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Retention</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Government Standards</CardTitle>
                <CardDescription>
                  Thai government IT security standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Authentication</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Management</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Logging Standards</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup Procedures</span>
                    <span className="text-sm text-green-600">✓ Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Frameworks</CardTitle>
                <CardDescription>
                  International security standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISO 27001</span>
                    <span className="text-sm text-green-600">✓ Aligned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NIST Framework</span>
                    <span className="text-sm text-green-600">✓ Aligned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">OWASP Top 10</span>
                    <span className="text-sm text-green-600">✓ Protected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CIS Controls</span>
                    <span className="text-sm text-yellow-600">⚠ Partial</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate compliance reports for auditors and regulators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monthly Security Report</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive security posture assessment
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Generate Report →
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">PDPA Compliance Report</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Data protection compliance status
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Generate Report →
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Audit Trail Summary</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    User activity and system changes
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Generate Report →
                  </button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Incident Response Report</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Security incidents and responses
                  </p>
                  <button className="text-sm text-primary hover:underline">
                    Generate Report →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
