"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  DollarSign,
  Building2,
  TrendingUp,
  Search
} from "lucide-react";

export default function AllocationPage() {

  const allocations = [
    {
      id: "AL-2569-001",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      requestAmount: 45000000,
      allocatedAmount: 42000000,
      percentage: 93.3,
      status: "approved",
      approvedDate: "2568-09-15",
      effectiveDate: "2568-10-01"
    },
    {
      id: "AL-2569-002",
      department: "สำนักอุทยานแห่งชาติ",
      requestAmount: 38000000,
      allocatedAmount: 35000000,
      percentage: 92.1,
      status: "approved",
      approvedDate: "2568-09-15",
      effectiveDate: "2568-10-01"
    },
    {
      id: "AL-2569-003",
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      requestAmount: 25000000,
      allocatedAmount: 0,
      percentage: 0,
      status: "pending",
      approvedDate: "-",
      effectiveDate: "-"
    },
    {
      id: "AL-2569-004",
      department: "สำนักป้องกันและปราบปราม",
      requestAmount: 32000000,
      allocatedAmount: 30000000,
      percentage: 93.8,
      status: "approved",
      approvedDate: "2568-09-18",
      effectiveDate: "2568-10-01"
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      approved: { label: "อนุมัติแล้ว", variant: "default" as const, icon: CheckCircle },
      pending: { label: "รออนุมัติ", variant: "secondary" as const, icon: Clock },
      rejected: { label: "ไม่อนุมัติ", variant: "destructive" as const, icon: AlertCircle }
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

  return (
    <DashboardLayout>
      {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">การจัดสรรงบประมาณ</h1>
              <p className="text-muted-foreground">
                จัดสรรและอนุมัติงบประมาณให้หน่วยงานต่างๆ
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">งบประมาณทั้งหมด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 125,430,000</div>
                  <p className="text-xs text-muted-foreground">ปีงบประมาณ 2569</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">จัดสรรแล้ว</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 107,000,000</div>
                  <Progress value={85.3} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">85.3% ของงบประมาณ</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">รอจัดสรร</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 18,430,000</div>
                  <p className="text-xs text-muted-foreground">14.7% ของงบประมาณ</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">หน่วยงาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span className="text-xl font-bold">12/15</span>
                  </div>
                  <p className="text-xs text-muted-foreground">ได้รับจัดสรรแล้ว</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="allocations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="allocations">รายการจัดสรร</TabsTrigger>
                <TabsTrigger value="new">จัดสรรใหม่</TabsTrigger>
                <TabsTrigger value="history">ประวัติการจัดสรร</TabsTrigger>
              </TabsList>

              {/* Allocations Tab */}
              <TabsContent value="allocations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>รายการจัดสรรงบประมาณ</CardTitle>
                        <CardDescription>รายการจัดสรรงบประมาณประจำปี 2569</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="ค้นหา..." className="pl-10 w-64" />
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          ส่งออก
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัส</TableHead>
                          <TableHead>หน่วยงาน</TableHead>
                          <TableHead className="text-right">ขอจัดสรร</TableHead>
                          <TableHead className="text-right">ได้รับจัดสรร</TableHead>
                          <TableHead className="text-center">สัดส่วน</TableHead>
                          <TableHead>วันที่อนุมัติ</TableHead>
                          <TableHead>สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allocations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell className="text-right">
                              {item.requestAmount.toLocaleString('th-TH')}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.allocatedAmount > 0 ? item.allocatedAmount.toLocaleString('th-TH') : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={item.percentage} className="w-20" />
                                <span className="text-xs">{item.percentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.approvedDate}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* New Allocation Tab */}
              <TabsContent value="new" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>จัดสรรงบประมาณใหม่</CardTitle>
                    <CardDescription>บันทึกการจัดสรรงบประมาณให้หน่วยงาน</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>หน่วยงาน</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหน่วยงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                            <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                            <SelectItem value="3">สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ปีงบประมาณ</Label>
                        <Select defaultValue="2569">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2569">2569</SelectItem>
                            <SelectItem value="2570">2570</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>งบประมาณที่ขอ</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>งบประมาณที่จัดสรร</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>หมายเหตุ</Label>
                      <Input placeholder="ระบุหมายเหตุ (ถ้ามี)" />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึก</Button>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        บันทึกและส่งอนุมัติ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ประวัติการจัดสรร</CardTitle>
                    <CardDescription>ข้อมูลการจัดสรรงบประมาณย้อนหลัง</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      กำลังพัฒนาส่วนประวัติการจัดสรร
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
