"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from "lucide-react";

export default function ImportBudgetPage() {

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">นำเข้างบประมาณ</h1>
              <p className="text-muted-foreground">
                นำเข้าข้อมูลงบประมาณจากไฟล์ Excel หรือ CSV
              </p>
            </div>

            <Tabs defaultValue="upload" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upload">อัปโหลดไฟล์</TabsTrigger>
                <TabsTrigger value="history">ประวัติการนำเข้า</TabsTrigger>
                <TabsTrigger value="template">แม่แบบไฟล์</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>อัปโหลดไฟล์งบประมาณ</CardTitle>
                    <CardDescription>
                      เลือกไฟล์ Excel หรือ CSV เพื่อนำเข้าข้อมูลงบประมาณ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">ลากไฟล์มาวางที่นี่</p>
                      <p className="text-muted-foreground mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
                      <Button>เลือกไฟล์</Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        รองรับไฟล์ .xlsx, .xls, .csv (ขนาดไม่เกิน 10MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ประวัติการนำเข้า</CardTitle>
                    <CardDescription>รายการไฟล์ที่เคยนำเข้าในระบบ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          filename: "budget_2569_Q1.xlsx",
                          uploadDate: "2569-01-15 14:30",
                          status: "success",
                          records: 1250,
                          errors: 0
                        },
                        {
                          filename: "budget_departments.csv",
                          uploadDate: "2569-01-10 09:15",
                          status: "warning",
                          records: 890,
                          errors: 5
                        },
                        {
                          filename: "budget_allocation.xlsx",
                          uploadDate: "2569-01-08 16:45",
                          status: "error",
                          records: 0,
                          errors: 15
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{item.filename}</p>
                              <p className="text-sm text-muted-foreground">{item.uploadDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm">
                                {item.records > 0 ? `${item.records} รายการ` : 'ไม่สำเร็จ'}
                              </p>
                              {item.errors > 0 && (
                                <p className="text-xs text-red-600">{item.errors} ข้อผิดพลาด</p>
                              )}
                            </div>
                            <Badge variant={
                              item.status === 'success' ? 'default' :
                              item.status === 'warning' ? 'secondary' : 'destructive'
                            }>
                              {item.status === 'success' ? 'สำเร็จ' :
                               item.status === 'warning' ? 'มีคำเตือน' : 'ผิดพลาด'}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="template" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>แม่แบบไฟล์</CardTitle>
                    <CardDescription>ดาวน์โหลดแม่แบบไฟล์สำหรับการนำเข้าข้อมูล</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "แม่แบบงบประมาณรายจ่าย",
                          description: "สำหรับนำเข้าข้อมูลงบประมาณรายจ่ายประจำปี",
                          format: "Excel (.xlsx)"
                        },
                        {
                          name: "แม่แบบข้อมูลหน่วยงาน",
                          description: "สำหรับนำเข้าข้อมูลหน่วยงานและโครงสร้าง",
                          format: "CSV (.csv)"
                        },
                        {
                          name: "แม่แบบกิจกรรมและโครงการ",
                          description: "สำหรับนำเข้าข้อมูลกิจกรรมและโครงการ",
                          format: "Excel (.xlsx)"
                        },
                        {
                          name: "แม่แบบการจัดสรรงบประมาณ",
                          description: "สำหรับนำเข้าข้อมูลการจัดสรรงบประมาณ",
                          format: "Excel (.xlsx)"
                        }
                      ].map((template, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description}
                                </p>
                                <Badge variant="outline" className="mt-2">
                                  {template.format}
                                </Badge>
                              </div>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                ดาวน์โหลด
                              </Button>
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
