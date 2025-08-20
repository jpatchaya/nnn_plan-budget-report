"use client";

import { useState } from "react";
import { Sidebar } from "@/components/budget/Sidebar";
import { TopBar } from "@/components/budget/TopBar";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2569");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const budgetRequests = [
    {
      id: "BR-2569-001",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      fiscalYear: "2569",
      totalAmount: 15750000,
      status: "draft",
      submittedDate: null,
      activities: 12,
      lastModified: "2568-12-15"
    },
    {
      id: "BR-2569-002",
      department: "สำนักอุทยานแห่งชาติ",
      fiscalYear: "2569",
      totalAmount: 28900000,
      status: "submitted",
      submittedDate: "2568-12-10",
      activities: 18,
      lastModified: "2568-12-10"
    },
    {
      id: "BR-2569-003",
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      fiscalYear: "2569",
      totalAmount: 12300000,
      status: "approved",
      submittedDate: "2568-12-05",
      activities: 8,
      lastModified: "2568-12-08"
    },
    {
      id: "BR-2569-004",
      department: "สำนักป้องกันและปราบปราม",
      fiscalYear: "2569",
      totalAmount: 45600000,
      status: "reviewing",
      submittedDate: "2568-12-12",
      activities: 25,
      lastModified: "2568-12-13"
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
    <div className="min-h-screen bg-background">
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 pt-20 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="max-w-7xl mx-auto">
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
                          ส่งออก Excel
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
                            placeholder="ค้นหาตามหน่วยงาน หรือรหัสคำขอ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="ปีงบประมาณ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกปีงบประมาณ</SelectItem>
                          <SelectItem value="2569">ปีงบประมาณ 2569</SelectItem>
                          <SelectItem value="2568">ปีงบประมาณ 2568</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-48">
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

                    {/* Responsive Table */}
                    <div className="rounded-md border">
                      <ResponsiveTable>
                        <ResponsiveTableHead>
                          <ResponsiveTableRow mobileCard={false}>
                            <ResponsiveTableHeader>รหัสคำขอ</ResponsiveTableHeader>
                            <ResponsiveTableHeader>หน่วยงาน</ResponsiveTableHeader>
                            <ResponsiveTableHeader mobileHidden>ปีงบประมาณ</ResponsiveTableHeader>
                            <ResponsiveTableHeader className="text-right">วงเงินรวม (บาท)</ResponsiveTableHeader>
                            <ResponsiveTableHeader className="text-center" mobileHidden>กิจกรรม</ResponsiveTableHeader>
                            <ResponsiveTableHeader>สถานะ</ResponsiveTableHeader>
                            <ResponsiveTableHeader mobileHidden>วันที่แก้ไข</ResponsiveTableHeader>
                            <ResponsiveTableHeader className="text-right">การดำเนินการ</ResponsiveTableHeader>
                          </ResponsiveTableRow>
                        </ResponsiveTableHead>
                        <ResponsiveTableBody>
                          {filteredRequests.map((request) => (
                            <ResponsiveTableRow key={request.id}>
                              <ResponsiveTableCell 
                                className="font-medium" 
                                mobileLabel="รหัสคำขอ"
                                mobilePriority="high"
                              >
                                {request.id}
                              </ResponsiveTableCell>
                              <ResponsiveTableCell 
                                mobileLabel="หน่วยงาน"
                                mobilePriority="high"
                              >
                                {request.department}
                              </ResponsiveTableCell>
                              <ResponsiveTableCell 
                                mobileLabel="ปีงบประมาณ"
                                mobilePriority="low"
                              >
                                {request.fiscalYear}
                              </ResponsiveTableCell>
                              <ResponsiveTableCell 
                                className="text-right"
                                mobileLabel="วงเงินรวม"
                                mobilePriority="medium"
                              >
                                {request.totalAmount.toLocaleString('th-TH')} บาท
                              </ResponsiveTableCell>
                              <ResponsiveTableCell 
                                className="text-center"
                                mobileLabel="กิจกรรม"
                                mobilePriority="low"
                              >
                                {request.activities} รายการ
                              </ResponsiveTableCell>
                              <ResponsiveTableCell
                                mobileLabel="สถานะ"
                                mobilePriority="high"
                              >
                                {getStatusBadge(request.status)}
                              </ResponsiveTableCell>
                              <ResponsiveTableCell
                                mobileLabel="แก้ไขล่าสุด"
                                mobilePriority="low"
                              >
                                {new Date(request.lastModified).toLocaleDateString('th-TH')}
                              </ResponsiveTableCell>
                              <ResponsiveTableCell>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                    <span className="ml-2 md:hidden">ดู</span>
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                    <span className="ml-2 md:hidden">แก้ไข</span>
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="ml-2 md:hidden">ลบ</span>
                                  </Button>
                                </div>
                              </ResponsiveTableCell>
                            </ResponsiveTableRow>
                          ))}
                        </ResponsiveTableBody>
                      </ResponsiveTable>
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
                      กรอกข้อมูลเพื่อสร้างคำของบประมาณรายจ่ายประจำปี
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ResponsiveFormGroup columns={2}>
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
                    </ResponsiveFormGroup>

                    <div className="space-y-2">
                      <Label>ยุทธศาสตร์การจัดสรร</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกยุทธศาสตร์" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">ยุทธศาสตร์ด้านการสร้างความสามารถในการแข่งขัน</SelectItem>
                          <SelectItem value="2">ยุทธศาสตร์ด้านการพัฒนาและเสริมสร้างศักยภาพทรัพยากรมนุษย์</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>แผนงาน</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกแผนงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">แผนงานบริหารจัดการทรัพยากรธรรมชาติและสิ่งแวดล้อม</SelectItem>
                          <SelectItem value="2">แผนงานอนุรักษ์และฟื้นฟูทรัพยากรธรรมชาติ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>ผลผลิต/โครงการ</Label>
                      <Input placeholder="ระบุผลผลิตหรือโครงการ" />
                    </div>

                    <div className="space-y-2">
                      <Label>กิจกรรมหลัก</Label>
                      <Input placeholder="ระบุกิจกรรมหลัก" />
                    </div>

                    <ResponsiveButtonGroup align="right" mobileStack>
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกแบบร่าง</Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        สร้างและดำเนินการต่อ
                      </Button>
                    </ResponsiveButtonGroup>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compare Tab */}
              <TabsContent value="compare" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>เปรียบเทียบงบประมาณระหว่างปี</CardTitle>
                    <CardDescription>
                      วิเคราะห์และเปรียบเทียบงบประมาณระหว่างปีงบประมาณ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label>ปีงบประมาณที่ 1</Label>
                        <Select defaultValue="2568">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2567">2567</SelectItem>
                            <SelectItem value="2568">2568</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ปีงบประมาณที่ 2</Label>
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

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>รายการ</TableHead>
                            <TableHead className="text-right">ปี 2568</TableHead>
                            <TableHead className="text-right">ปี 2569</TableHead>
                            <TableHead className="text-right">ผลต่าง</TableHead>
                            <TableHead className="text-right">% เปลี่ยนแปลง</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>งบบุคลากร</TableCell>
                            <TableCell className="text-right">25,000,000</TableCell>
                            <TableCell className="text-right">27,500,000</TableCell>
                            <TableCell className="text-right text-green-600">+2,500,000</TableCell>
                            <TableCell className="text-right text-green-600">+10%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>งบดำเนินงาน</TableCell>
                            <TableCell className="text-right">45,000,000</TableCell>
                            <TableCell className="text-right">42,000,000</TableCell>
                            <TableCell className="text-right text-red-600">-3,000,000</TableCell>
                            <TableCell className="text-right text-red-600">-6.67%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>งบลงทุน</TableCell>
                            <TableCell className="text-right">30,000,000</TableCell>
                            <TableCell className="text-right">35,000,000</TableCell>
                            <TableCell className="text-right text-green-600">+5,000,000</TableCell>
                            <TableCell className="text-right text-green-600">+16.67%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>งบอุดหนุน</TableCell>
                            <TableCell className="text-right">15,000,000</TableCell>
                            <TableCell className="text-right">15,000,000</TableCell>
                            <TableCell className="text-right">0</TableCell>
                            <TableCell className="text-right">0%</TableCell>
                          </TableRow>
                          <TableRow className="font-semibold">
                            <TableCell>รวมทั้งสิ้น</TableCell>
                            <TableCell className="text-right">115,000,000</TableCell>
                            <TableCell className="text-right">119,500,000</TableCell>
                            <TableCell className="text-right text-green-600">+4,500,000</TableCell>
                            <TableCell className="text-right text-green-600">+3.91%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}