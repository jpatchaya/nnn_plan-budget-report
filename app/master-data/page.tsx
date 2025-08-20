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
import { ResponsiveFormGroup } from "@/components/ui/responsive-form";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Users,
  FileText,
  Settings,
  Upload,
  Download
} from "lucide-react";

export default function MasterDataPage() {
  const [selectedTab, setSelectedTab] = useState("departments");

  const departments = [
    { id: "1", code: "DNP-01", name: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1", type: "สำนักบริหาร", status: "active" },
    { id: "2", code: "DNP-02", name: "สำนักอุทยานแห่งชาติ", type: "สำนัก", status: "active" },
    { id: "3", code: "DNP-03", name: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์", type: "สำนัก", status: "active" },
    { id: "4", code: "DNP-04", name: "สำนักป้องกันและปราบปราม", type: "สำนัก", status: "active" },
    { id: "5", code: "DNP-05", name: "สำนักจัดการต้นน้ำ", type: "สำนัก", status: "active" }
  ];

  const budgetTypes = [
    { id: "1", code: "B001", name: "งบบุคลากร", description: "เงินเดือน ค่าจ้าง และประโยชน์ตอบแทนอื่น", status: "active" },
    { id: "2", code: "B002", name: "งบดำเนินงาน", description: "ค่าตอบแทน ใช้สอย วัสดุ และสาธารณูปโภค", status: "active" },
    { id: "3", code: "B003", name: "งบลงทุน", description: "ครุภัณฑ์ ที่ดิน และสิ่งก่อสร้าง", status: "active" },
    { id: "4", code: "B004", name: "งบเงินอุดหนุน", description: "เงินอุดหนุนทั่วไปและเฉพาะกิจ", status: "active" },
    { id: "5", code: "B005", name: "งบรายจ่ายอื่น", description: "รายจ่ายที่ไม่เข้าลักษณะรายจ่ายอื่น", status: "active" }
  ];

  const activities = [
    { id: "1", code: "ACT001", name: "พัฒนาระบบฐานข้อมูลความหลากหลายทางชีวภาพ", department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1", status: "active" },
    { id: "2", code: "ACT002", name: "ปรับปรุงสิ่งอำนวยความสะดวกในอุทยานแห่งชาติ", department: "สำนักอุทยานแห่งชาติ", status: "active" },
    { id: "3", code: "ACT003", name: "โครงการปลูกป่าเฉลิมพระเกียรติ", department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์", status: "active" },
    { id: "4", code: "ACT004", name: "จัดหาอุปกรณ์ตรวจการณ์และป้องกันไฟป่า", department: "สำนักป้องกันและปราบปราม", status: "active" }
  ];

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default">ใช้งาน</Badge>
    ) : (
      <Badge variant="secondary">ไม่ใช้งาน</Badge>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">ข้อมูลหลัก</h1>
              <p className="text-muted-foreground">
                จัดการข้อมูลหลักของระบบงบประมาณ
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    หน่วยงาน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">หน่วยงานทั้งหมด</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ประเภทงบประมาณ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">ประเภท</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    ผู้ใช้งาน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    กิจกรรม
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">กิจกรรมทั้งหมด</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="departments">หน่วยงาน</TabsTrigger>
                <TabsTrigger value="budgetTypes">ประเภทงบประมาณ</TabsTrigger>
                <TabsTrigger value="activities">กิจกรรม</TabsTrigger>
                <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
                <TabsTrigger value="settings">ตั้งค่าระบบ</TabsTrigger>
              </TabsList>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>หน่วยงาน</CardTitle>
                        <CardDescription>จัดการข้อมูลหน่วยงานในระบบ</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          นำเข้า
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          ส่งออก
                        </Button>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          เพิ่มหน่วยงาน
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ค้นหาหน่วยงาน..." className="pl-10" />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัส</TableHead>
                          <TableHead>ชื่อหน่วยงาน</TableHead>
                          <TableHead>ประเภท</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((dept) => (
                          <TableRow key={dept.id}>
                            <TableCell className="font-medium">{dept.code}</TableCell>
                            <TableCell>{dept.name}</TableCell>
                            <TableCell>{dept.type}</TableCell>
                            <TableCell>{getStatusBadge(dept.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Budget Types Tab */}
              <TabsContent value="budgetTypes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>ประเภทงบประมาณ</CardTitle>
                        <CardDescription>จัดการประเภทและหมวดหมู่งบประมาณ</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มประเภท
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัส</TableHead>
                          <TableHead>ชื่อประเภท</TableHead>
                          <TableHead>คำอธิบาย</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetTypes.map((type) => (
                          <TableRow key={type.id}>
                            <TableCell className="font-medium">{type.code}</TableCell>
                            <TableCell>{type.name}</TableCell>
                            <TableCell>{type.description}</TableCell>
                            <TableCell>{getStatusBadge(type.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>กิจกรรม</CardTitle>
                        <CardDescription>จัดการกิจกรรมและโครงการ</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มกิจกรรม
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ค้นหากิจกรรม..." className="pl-10" />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกหน่วยงาน</SelectItem>
                          <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                          <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัส</TableHead>
                          <TableHead>ชื่อกิจกรรม</TableHead>
                          <TableHead>หน่วยงาน</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.code}</TableCell>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell>{activity.department}</TableCell>
                            <TableCell>{getStatusBadge(activity.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ผู้ใช้งาน</CardTitle>
                    <CardDescription>จัดการผู้ใช้งานและสิทธิ์การเข้าถึง</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      ส่วนจัดการผู้ใช้งานอยู่ระหว่างการพัฒนา
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ตั้งค่าระบบ</CardTitle>
                    <CardDescription>กำหนดค่าพารามิเตอร์ของระบบ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ปีงบประมาณปัจจุบัน</Label>
                        <Select defaultValue="2569">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2568">2568</SelectItem>
                            <SelectItem value="2569">2569</SelectItem>
                            <SelectItem value="2570">2570</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>รอบการจัดทำงบประมาณ</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">ปกติ</SelectItem>
                            <SelectItem value="mid-year">กลางปี</SelectItem>
                            <SelectItem value="additional">เพิ่มเติม</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>อัตราเงินเฟ้อที่คาดการณ์ (%)</Label>
                      <Input type="number" defaultValue="2.5" />
                    </div>
                    <div className="space-y-2">
                      <Label>เป้าหมายการเบิกจ่าย (%)</Label>
                      <Input type="number" defaultValue="96" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกการตั้งค่า</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
