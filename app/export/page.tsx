"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download,
  FileText,
  Calendar,
  Settings,
  Clock,
  CheckCircle
} from "lucide-react";

export default function ExportPage() {

  const exportHistory = [
    {
      filename: "budget_report_2569_Q1.xlsx",
      type: "รายงานงบประมาณ",
      exportDate: "2569-01-20 15:30",
      size: "2.5 MB",
      status: "completed"
    },
    {
      filename: "department_allocation_2569.pdf",
      type: "การจัดสรรตามหน่วยงาน",
      exportDate: "2569-01-18 10:15",
      size: "1.8 MB",
      status: "completed"
    },
    {
      filename: "budget_comparison_2568_2569.csv",
      type: "เปรียบเทียบงบประมาณ",
      exportDate: "2569-01-15 14:45",
      size: "850 KB",
      status: "completed"
    }
  ];

  const scheduledExports = [
    {
      name: "รายงานประจำเดือน",
      schedule: "วันที่ 1 ของทุกเดือน",
      format: "Excel",
      nextRun: "1 ก.พ. 2569 09:00",
      status: "active"
    },
    {
      name: "สรุปงบประมาณรายไตรมาส",
      schedule: "สิ้นไตรมาส",
      format: "PDF",
      nextRun: "31 มี.ค. 2569 17:00",
      status: "active"
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">ส่งออกข้อมูล</h1>
              <p className="text-muted-foreground">
                ส่งออกข้อมูลงบประมาณในรูปแบบต่างๆ
              </p>
            </div>

            <Tabs defaultValue="export" className="space-y-4">
              <TabsList>
                <TabsTrigger value="export">ส่งออกข้อมูล</TabsTrigger>
                <TabsTrigger value="scheduled">ส่งออกตามกำหนด</TabsTrigger>
                <TabsTrigger value="history">ประวัติการส่งออก</TabsTrigger>
              </TabsList>

              <TabsContent value="export" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ส่งออกข้อมูลงบประมาณ</CardTitle>
                    <CardDescription>
                      เลือกข้อมูลและรูปแบบไฟล์ที่ต้องการส่งออก
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Export Type Selection */}
                    <div className="space-y-4">
                      <h4 className="font-medium">ประเภทข้อมูล</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "budget", label: "ข้อมูลงบประมาณ", description: "งบประมาณทั้งหมดในระบบ" },
                          { id: "allocation", label: "การจัดสรรงบประมาณ", description: "ข้อมูลการจัดสรรให้หน่วยงาน" },
                          { id: "expense", label: "การเบิกจ่าย", description: "ประวัติการเบิกจ่ายงบประมาณ" },
                          { id: "reports", label: "รายงานสรุป", description: "รายงานสรุปผลการดำเนินงาน" }
                        ].map((type) => (
                          <div key={type.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox id={type.id} />
                            <div className="space-y-1">
                              <label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                                {type.label}
                              </label>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filter Options */}
                    <div className="space-y-4">
                      <h4 className="font-medium">ตัวกรองข้อมูล</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ปีงบประมาณ</label>
                          <Select defaultValue="2569">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">ทุกปี</SelectItem>
                              <SelectItem value="2569">2569</SelectItem>
                              <SelectItem value="2568">2568</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">หน่วยงาน</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">ทุกหน่วยงาน</SelectItem>
                              <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                              <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">สถานะ</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">ทุกสถานะ</SelectItem>
                              <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                              <SelectItem value="pending">รออนุมัติ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Format Selection */}
                    <div className="space-y-4">
                      <h4 className="font-medium">รูปแบบไฟล์</h4>
                      <div className="flex gap-4">
                        {[
                          { id: "excel", label: "Excel (.xlsx)", icon: FileText },
                          { id: "csv", label: "CSV (.csv)", icon: FileText },
                          { id: "pdf", label: "PDF (.pdf)", icon: FileText }
                        ].map((format) => {
                          const Icon = format.icon;
                          return (
                            <div key={format.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <Checkbox id={format.id} />
                              <Icon className="h-4 w-4" />
                              <label htmlFor={format.id} className="text-sm cursor-pointer">
                                {format.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">รีเซ็ต</Button>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        ส่งออกข้อมูล
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>การส่งออกตามกำหนด</CardTitle>
                        <CardDescription>ตั้งค่าการส่งออกข้อมูลอัตโนมัติ</CardDescription>
                      </div>
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        สร้างกำหนดการใหม่
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledExports.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{schedule.name}</p>
                              <p className="text-sm text-muted-foreground">{schedule.schedule}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{schedule.format}</Badge>
                                <Badge variant={schedule.status === "active" ? "default" : "secondary"}>
                                  {schedule.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>รอบถัดไป: {schedule.nextRun}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="ghost">แก้ไข</Button>
                              <Button size="sm" variant="ghost">ลบ</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ประวัติการส่งออก</CardTitle>
                    <CardDescription>รายการไฟล์ที่เคยส่งออกจากระบบ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {exportHistory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{item.filename}</p>
                              <p className="text-sm text-muted-foreground">{item.type}</p>
                              <p className="text-xs text-muted-foreground">{item.exportDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm">{item.size}</p>
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                เสร็จสิ้น
                              </Badge>
                            </div>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
