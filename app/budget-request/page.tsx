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
  ResponsiveTable, 
  ResponsiveTableBody, 
  ResponsiveTableCell, 
  ResponsiveTableHead, 
  ResponsiveTableHeader, 
  ResponsiveTableRow 
} from "@/components/ui/responsive-table";
import { 
  ResponsiveFormGroup, 
  ResponsiveButtonGroup 
} from "@/components/ui/responsive-form";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Eye,
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function BudgetRequestPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2569");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const budgetRequests = [
    {
      id: "BR-2569-001",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      fiscalYear: "2569",
      totalAmount: 15750000,
      status: "approved",
      submittedDate: "2568-12-15",
      activities: 12,
      lastModified: "2568-12-18"
    },
    {
      id: "BR-2569-002",
      department: "สำนักอุทยานแห่งชาติ",
      fiscalYear: "2569",
      totalAmount: 23500000,
      status: "reviewing",
      submittedDate: "2568-12-10",
      activities: 18,
      lastModified: "2568-12-16"
    },
    {
      id: "BR-2569-003",
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      fiscalYear: "2569",
      totalAmount: 12300000,
      status: "draft",
      submittedDate: "2568-12-05",
      activities: 8,
      lastModified: "2568-12-14"
    },
    {
      id: "BR-2569-004",
      department: "สำนักป้องกัน ปราบปราม และควบคุมไฟป่า",
      fiscalYear: "2569",
      totalAmount: 18900000,
      status: "submitted",
      submittedDate: "2568-12-12",
      activities: 15,
      lastModified: "2568-12-12"
    },
    {
      id: "BR-2569-005",
      department: "สำนักแผนงานและสารสนเทศ",
      fiscalYear: "2569",
      totalAmount: 8900000,
      status: "returned",
      submittedDate: "2568-12-08",
      activities: 6,
      lastModified: "2568-12-14"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "แบบร่าง", variant: "secondary" as const, icon: FileText },
      submitted: { label: "ส่งแล้ว", variant: "default" as const, icon: Send },
      reviewing: { label: "กำลังตรวจสอบ", variant: "outline" as const, icon: Clock },
      approved: { label: "อนุมัติ", variant: "default" as const, icon: CheckCircle },
      returned: { label: "ส่งคืนแก้ไข", variant: "destructive" as const, icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredRequests = budgetRequests.filter(request => {
    const matchesSearch = request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || request.fiscalYear === selectedYear;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">คำของบประมาณ</h1>
        <p className="text-muted-foreground">
          จัดการคำของบประมาณรายจ่ายประจำปีของหน่วยงาน
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">รายการคำขอ</TabsTrigger>
          <TabsTrigger value="create">สร้างคำขอใหม่</TabsTrigger>
          <TabsTrigger value="compare">เปรียบเทียบปีงบประมาณ</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>รายการคำของบประมาณ</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    นำเข้าข้อมูล
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออก
                  </Button>
                  <Button size="sm" className="bg-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    สร้างคำขอใหม่
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหาด้วยชื่อหน่วยงานหรือรหัสคำขอ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="ปีงบประมาณ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกปี</SelectItem>
                    <SelectItem value="2569">2569</SelectItem>
                    <SelectItem value="2568">2568</SelectItem>
                    <SelectItem value="2567">2567</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="draft">แบบร่าง</SelectItem>
                    <SelectItem value="submitted">ส่งแล้ว</SelectItem>
                    <SelectItem value="reviewing">กำลังตรวจสอบ</SelectItem>
                    <SelectItem value="approved">อนุมัติ</SelectItem>
                    <SelectItem value="returned">ส่งคืนแก้ไข</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสคำขอ</TableHead>
                      <TableHead>หน่วยงาน</TableHead>
                      <TableHead>ปีงบประมาณ</TableHead>
                      <TableHead className="text-right">จำนวนเงิน</TableHead>
                      <TableHead>กิจกรรม</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.fiscalYear}</TableCell>
                        <TableCell className="text-right">
                          {request.totalAmount.toLocaleString('th-TH')} บาท
                        </TableCell>
                        <TableCell>{request.activities} กิจกรรม</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{request.submittedDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>สร้างคำของบประมาณใหม่</CardTitle>
              <CardDescription>
                กรอกข้อมูลเพื่อสร้างคำของบประมาณประจำปี
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">หน่วยงาน</Label>
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
                    <Label htmlFor="fiscalYear">ปีงบประมาณ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกปีงบประมาณ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2569">2569</SelectItem>
                        <SelectItem value="2568">2568</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">ชื่อโครงการ</Label>
                  <Input id="projectName" placeholder="กรอกชื่อโครงการ" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">งบประมาณที่ขอ</Label>
                    <Input id="budget" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activities">จำนวนกิจกรรม</Label>
                    <Input id="activities" type="number" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">วัตถุประสงค์</Label>
                  <textarea
                    id="objective"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="กรอกวัตถุประสงค์ของโครงการ"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">ยกเลิก</Button>
                  <Button variant="secondary">บันทึกร่าง</Button>
                  <Button>ส่งคำขอ</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เปรียบเทียบงบประมาณ</CardTitle>
              <CardDescription>
                เปรียบเทียบงบประมาณระหว่างปีงบประมาณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">กำลังพัฒนาฟีเจอร์นี้...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
