"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowRightLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Search
} from "lucide-react";

export default function TransferPage() {

  const transfers = [
    {
      id: "TR-2569-001",
      from: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      to: "สำนักอุทยานแห่งชาติ",
      amount: 2500000,
      reason: "สนับสนุนโครงการพัฒนาพื้นที่",
      requestDate: "2569-01-15",
      status: "approved",
      approvedBy: "ผอ.กรมอุทยานแห่งชาติ"
    },
    {
      id: "TR-2569-002",
      from: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      to: "สำนักป้องกันและปราบปราม",
      amount: 1800000,
      reason: "โอนงบสำหรับจัดซื้ออุปกรณ์ดับไฟป่า",
      requestDate: "2569-01-20",
      status: "pending",
      approvedBy: "-"
    },
    {
      id: "TR-2569-003",
      from: "สำนักอุทยานแห่งชาติ",
      to: "สำนักจัดการต้นน้ำ",
      amount: 3200000,
      reason: "สนับสนุนโครงการฟื้นฟูต้นน้ำ",
      requestDate: "2569-01-10",
      status: "approved",
      approvedBy: "รอง ผอ.ฝ่ายบริหาร"
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
              <h1 className="text-3xl font-bold text-foreground mb-2">โอนงบประมาณ</h1>
              <p className="text-muted-foreground">
                โอนย้ายงบประมาณระหว่างหน่วยงานและโครงการ
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">รายการโอนทั้งหมด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">ปีงบประมาณ 2569</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">มูลค่าโอนรวม</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 18.5M</div>
                  <p className="text-xs text-muted-foreground">โอนสะสม</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">รออนุมัติ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <p className="text-xs text-muted-foreground">รายการ</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">อนุมัติแล้ว</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">19</div>
                  <p className="text-xs text-muted-foreground">รายการ</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="transfers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="transfers">รายการโอน</TabsTrigger>
                <TabsTrigger value="new">โอนงบประมาณ</TabsTrigger>
                <TabsTrigger value="approval">รออนุมัติ</TabsTrigger>
              </TabsList>

              {/* Transfers Tab */}
              <TabsContent value="transfers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>รายการโอนงบประมาณ</CardTitle>
                        <CardDescription>ประวัติการโอนงบประมาณระหว่างหน่วยงาน</CardDescription>
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
                          <TableHead>จากหน่วยงาน</TableHead>
                          <TableHead>ไปหน่วยงาน</TableHead>
                          <TableHead className="text-right">จำนวนเงิน</TableHead>
                          <TableHead>เหตุผล</TableHead>
                          <TableHead>วันที่ขอ</TableHead>
                          <TableHead>สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transfers.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.from}</TableCell>
                            <TableCell>{item.to}</TableCell>
                            <TableCell className="text-right">
                              {item.amount.toLocaleString('th-TH')}
                            </TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell>{item.requestDate}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* New Transfer Tab */}
              <TabsContent value="new" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>โอนงบประมาณ</CardTitle>
                    <CardDescription>บันทึกการโอนงบประมาณระหว่างหน่วยงาน</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>หน่วยงานต้นทาง</Label>
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
                        <Label>หน่วยงานปลายทาง</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหน่วยงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">สำนักป้องกันและปราบปราม</SelectItem>
                            <SelectItem value="2">สำนักจัดการต้นน้ำ</SelectItem>
                            <SelectItem value="3">สำนักวิจัยการอนุรักษ์ป่าไม้</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>จำนวนเงินที่โอน</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>ประเภทงบประมาณ</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">งบดำเนินงาน</SelectItem>
                            <SelectItem value="2">งบลงทุน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>เหตุผลในการโอน</Label>
                      <Input placeholder="ระบุเหตุผล" />
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <ArrowRightLeft className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">ข้อมูลการโอน</p>
                          <p className="text-xs text-muted-foreground">กรุณาตรวจสอบข้อมูลก่อนส่งอนุมัติ</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกร่าง</Button>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        ส่งอนุมัติ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>รออนุมัติ</CardTitle>
                    <CardDescription>รายการโอนงบประมาณที่รอการอนุมัติ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transfers.filter(t => t.status === 'pending').map((item) => (
                        <Card key={item.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{item.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.from} → {item.to}
                                </p>
                                <p className="text-sm mt-1">{item.reason}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">฿ {item.amount.toLocaleString('th-TH')}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline">ไม่อนุมัติ</Button>
                                  <Button size="sm">อนุมัติ</Button>
                                </div>
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
