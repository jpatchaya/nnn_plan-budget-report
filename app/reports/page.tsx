"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText,
  Download,
  Eye,
  Printer,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function ReportsPage() {

  const reports = [
    {
      id: "RPT-001",
      name: "รายงานสรุปงบประมาณประจำปี",
      type: "yearly",
      description: "สรุปภาพรวมการใช้จ่ายงบประมาณทั้งปี",
      lastGenerated: "2569-01-20",
      format: ["PDF", "Excel"],
      icon: BarChart3
    },
    {
      id: "RPT-002",
      name: "รายงานเปรียบเทียบแผน-ผล",
      type: "comparison",
      description: "เปรียบเทียบแผนการใช้จ่ายกับผลการเบิกจ่ายจริง",
      lastGenerated: "2569-01-19",
      format: ["PDF", "Excel"],
      icon: TrendingUp
    },
    {
      id: "RPT-003",
      name: "รายงานงบประมาณตามหน่วยงาน",
      type: "department",
      description: "สรุปงบประมาณแยกตามหน่วยงาน",
      lastGenerated: "2569-01-18",
      format: ["PDF"],
      icon: PieChart
    },
    {
      id: "RPT-004",
      name: "รายงานติดตามการเบิกจ่าย",
      type: "tracking",
      description: "ติดตามสถานะการเบิกจ่ายงบประมาณ",
      lastGenerated: "2569-01-20",
      format: ["Excel"],
      icon: FileText
    }
  ];

  const executiveReports = [
    {
      title: "สรุปผู้บริหาร",
      subtitle: "ภาพรวมงบประมาณ Q1/2569",
      metrics: [
        { label: "งบประมาณทั้งหมด", value: "125.43M", change: "+5.2%" },
        { label: "เบิกจ่ายแล้ว", value: "45.78M", change: "+12.3%" },
        { label: "คงเหลือ", value: "79.65M", change: "-" },
        { label: "ประสิทธิภาพ", value: "92%", change: "+3%" }
      ]
    }
  ];

  return (
    <DashboardLayout>
      {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">รายงาน</h1>
              <p className="text-muted-foreground">
                ดูและส่งออกรายงานงบประมาณในรูปแบบต่างๆ
              </p>
            </div>

            {/* Executive Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>สรุปผู้บริหาร</CardTitle>
                <CardDescription>ภาพรวมงบประมาณ Q1/2569</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {executiveReports[0].metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold mt-1">{metric.value}</p>
                      {metric.change !== "-" && (
                        <Badge variant={metric.change.startsWith("+") ? "default" : "destructive"} className="mt-1">
                          {metric.change}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="standard" className="space-y-4">
              <TabsList>
                <TabsTrigger value="standard">รายงานมาตรฐาน</TabsTrigger>
                <TabsTrigger value="custom">รายงานกำหนดเอง</TabsTrigger>
                <TabsTrigger value="scheduled">รายงานตามกำหนด</TabsTrigger>
              </TabsList>

              {/* Standard Reports Tab */}
              <TabsContent value="standard" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>รายงานมาตรฐาน</CardTitle>
                        <CardDescription>รายงานที่ใช้งานบ่อย</CardDescription>
                      </div>
                      <Select defaultValue="2569">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2569">2569</SelectItem>
                          <SelectItem value="2568">2568</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reports.map((report) => {
                        const Icon = report.icon;
                        return (
                          <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="h-8 w-8 text-blue-600" />
                                  <div>
                                    <CardTitle className="text-base">{report.name}</CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      {report.description}
                                    </CardDescription>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                  อัปเดต: {report.lastGenerated}
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custom Reports Tab */}
              <TabsContent value="custom" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>สร้างรายงานกำหนดเอง</CardTitle>
                    <CardDescription>เลือกข้อมูลและรูปแบบรายงานตามต้องการ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ประเภทรายงาน</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="budget">งบประมาณ</SelectItem>
                            <SelectItem value="expense">การเบิกจ่าย</SelectItem>
                            <SelectItem value="project">โครงการ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ช่วงเวลา</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกช่วงเวลา" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">รายเดือน</SelectItem>
                            <SelectItem value="quarter">รายไตรมาส</SelectItem>
                            <SelectItem value="year">รายปี</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">หน่วยงาน</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="ทั้งหมด" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทั้งหมด</SelectItem>
                            <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                            <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">รูปแบบไฟล์</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="PDF" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">รีเซ็ต</Button>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        สร้างรายงาน
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scheduled Reports Tab */}
              <TabsContent value="scheduled" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>รายงานตามกำหนด</CardTitle>
                    <CardDescription>ตั้งค่าการสร้างรายงานอัตโนมัติ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "รายงานประจำเดือน",
                          schedule: "ทุกวันที่ 1 ของเดือน",
                          recipients: "ผู้บริหาร, หัวหน้าฝ่าย",
                          status: "active",
                          nextRun: "1 ก.พ. 2569"
                        },
                        {
                          name: "รายงานประจำไตรมาส",
                          schedule: "ทุก 3 เดือน",
                          recipients: "คณะกรรมการ",
                          status: "active",
                          nextRun: "1 เม.ย. 2569"
                        }
                      ].map((schedule, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium">{schedule.name}</p>
                                  <p className="text-sm text-muted-foreground">{schedule.schedule}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ส่งถึง: {schedule.recipients}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={schedule.status === "active" ? "default" : "secondary"}>
                                  {schedule.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  รอบถัดไป: {schedule.nextRun}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
