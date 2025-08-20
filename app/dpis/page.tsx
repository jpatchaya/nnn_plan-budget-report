"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Building2,
  Settings,
  Download,
  Eye
} from "lucide-react";

export default function DPISPage() {

  const syncStatus = {
    lastSync: "2569-01-20 08:30:00",
    totalRecords: 1250,
    successRecords: 1180,
    errorRecords: 70,
    status: "completed"
  };

  const syncHistory = [
    {
      date: "2569-01-20 08:30",
      type: "ข้อมูลบุคลากร",
      records: 1250,
      success: 1180,
      errors: 70,
      status: "completed"
    },
    {
      date: "2569-01-19 08:30",
      type: "โครงสร้างองค์กร",
      records: 85,
      success: 85,
      errors: 0,
      status: "completed"
    },
    {
      date: "2569-01-18 08:30",
      type: "ข้อมูลตำแหน่ง",
      records: 320,
      success: 315,
      errors: 5,
      status: "completed"
    }
  ];

  const errorLogs = [
    {
      employeeId: "DNP001234",
      name: "นายสมชาย ใจดี",
      error: "ข้อมูลตำแหน่งไม่ตรงกับระบบ DPIS",
      severity: "warning",
      date: "2569-01-20 08:35"
    },
    {
      employeeId: "DNP001235",
      name: "นางสาวสมใส รักดี",
      error: "รหัสหน่วยงานไม่พบในระบบ",
      severity: "error",
      date: "2569-01-20 08:32"
    },
    {
      employeeId: "DNP001236",
      name: "นายสมศักดิ์ มีสุข",
      error: "วันที่เริ่มงานไม่ถูกต้อง",
      severity: "warning",
      date: "2569-01-20 08:30"
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { label: "เสร็จสิ้น", variant: "default" as const, icon: CheckCircle },
      running: { label: "กำลังดำเนินการ", variant: "secondary" as const, icon: Clock },
      error: { label: "ผิดพลาด", variant: "destructive" as const, icon: AlertCircle }
    };

    const statusConfig = config[status as keyof typeof config];
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    return severity === "error" ? (
      <Badge variant="destructive">ข้อผิดพลาด</Badge>
    ) : (
      <Badge variant="secondary">คำเตือน</Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">เชื่อมต่อ DPIS</h1>
              <p className="text-muted-foreground">
                ระบบเชื่อมต่อข้อมูลบุคลากรจากระบบ DPIS (ระบบสารสนเทศเพื่อการบริหารงานบุคคลภาครัฐ)
              </p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    ข้อมูลบุคลากร
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,180</div>
                  <p className="text-xs text-muted-foreground">รายการซิงค์สำเร็จ</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    หน่วยงาน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85</div>
                  <p className="text-xs text-muted-foreground">หน่วยงานทั้งหมด</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    อัตราความสำเร็จ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94.4%</div>
                  <Progress value={94.4} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    ข้อผิดพลาด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">70</div>
                  <p className="text-xs text-muted-foreground">รายการที่ต้องแก้ไข</p>
                </CardContent>
              </Card>
            </div>

            {/* Sync Status Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>สถานะการซิงค์ข้อมูล</CardTitle>
                    <CardDescription>
                      ซิงค์ล่าสุด: {syncStatus.lastSync}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      ตั้งค่า
                    </Button>
                    <Button size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      ซิงค์ทันที
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{syncStatus.successRecords}</p>
                    <p className="text-sm text-green-700">สำเร็จ</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{syncStatus.errorRecords}</p>
                    <p className="text-sm text-orange-700">ข้อผิดพลาด</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{syncStatus.totalRecords}</p>
                    <p className="text-sm text-blue-700">รวมทั้งหมด</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="history" className="space-y-4">
              <TabsList>
                <TabsTrigger value="history">ประวัติการซิงค์</TabsTrigger>
                <TabsTrigger value="errors">ข้อผิดพลาด</TabsTrigger>
                <TabsTrigger value="mapping">การแมปข้อมูล</TabsTrigger>
                <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>ประวัติการซิงค์ข้อมูล</CardTitle>
                        <CardDescription>รายการการซิงค์ข้อมูลจาก DPIS</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        ส่งออกรายงาน
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>วันที่/เวลา</TableHead>
                          <TableHead>ประเภทข้อมูล</TableHead>
                          <TableHead className="text-right">รายการทั้งหมด</TableHead>
                          <TableHead className="text-right">สำเร็จ</TableHead>
                          <TableHead className="text-right">ข้อผิดพลาด</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {syncHistory.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="text-right">{item.records}</TableCell>
                            <TableCell className="text-right text-green-600">{item.success}</TableCell>
                            <TableCell className="text-right text-red-600">{item.errors}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="errors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>รายการข้อผิดพลาด</CardTitle>
                    <CardDescription>ข้อมูลที่ไม่สามารถซิงค์ได้และต้องแก้ไข</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัสพนักงาน</TableHead>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead>ข้อผิดพลาด</TableHead>
                          <TableHead>ระดับ</TableHead>
                          <TableHead>วันที่</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errorLogs.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{error.employeeId}</TableCell>
                            <TableCell>{error.name}</TableCell>
                            <TableCell>{error.error}</TableCell>
                            <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                            <TableCell>{error.date}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">แก้ไข</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mapping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>การแมปข้อมูล</CardTitle>
                    <CardDescription>กำหนดการแมปฟิลด์ข้อมูลระหว่างระบบ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      ส่วนการแมปข้อมูลอยู่ระหว่างการพัฒนา
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ตั้งค่าการเชื่อมต่อ DPIS</CardTitle>
                    <CardDescription>กำหนดค่าการเชื่อมต่อและการซิงค์ข้อมูล</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">URL ของ DPIS</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            defaultValue="https://dpis.example.gov.th/api"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ความถี่ในการซิงค์</label>
                          <select className="w-full p-2 border rounded">
                            <option>ทุกวันเวลา 08:00</option>
                            <option>ทุก 6 ชั่วโมง</option>
                            <option>ทุก 12 ชั่วโมง</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ประเภทข้อมูลที่ซิงค์</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            "ข้อมูลบุคลากร",
                            "โครงสร้างองค์กร", 
                            "ข้อมูลตำแหน่ง",
                            "ข้อมูลเงินเดือน",
                            "ประวัติการทำงาน",
                            "ข้อมูลการลา"
                          ].map((type, index) => (
                            <label key={index} className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked={index < 3} />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">ทดสอบการเชื่อมต่อ</Button>
                        <Button>บันทึกการตั้งค่า</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
