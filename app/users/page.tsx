"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users as UsersIcon,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";

export default function UsersPage() {

  const users = [
    {
      id: "1",
      username: "admin001",
      name: "นายสมชาย ผู้ดูแลระบบ",
      email: "admin@dnp.go.th",
      department: "สำนักแผนงานและสารสนเทศ",
      role: "ผู้ดูแลระบบ",
      status: "active",
      lastLogin: "2569-01-20 14:30"
    },
    {
      id: "2",
      username: "budget001",
      name: "นางสาวสมใส งบประมาณ",
      email: "budget@dnp.go.th",
      department: "กองการเงินและบัญชี",
      role: "เจ้าหน้าที่งบประมาณ",
      status: "active",
      lastLogin: "2569-01-20 09:15"
    },
    {
      id: "3",
      username: "dept001",
      name: "นายสมศักดิ์ หัวหน้าฝ่าย",
      email: "dept001@dnp.go.th",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      role: "หัวหน้าหน่วยงาน",
      status: "active",
      lastLogin: "2569-01-19 16:45"
    },
    {
      id: "4",
      username: "user001",
      name: "นางสมหวัง ผู้ใช้งาน",
      email: "user001@dnp.go.th",
      department: "สำนักอุทยานแห่งชาติ",
      role: "ผู้ใช้งานทั่วไป",
      status: "inactive",
      lastLogin: "2569-01-15 11:20"
    }
  ];

  const roles = [
    {
      id: "1",
      name: "ผู้ดูแลระบบ",
      description: "สิทธิ์เต็มในการจัดการระบบ",
      permissions: ["จัดการผู้ใช้", "ตั้งค่าระบบ", "ดูรายงานทั้งหมด", "จัดการข้อมูลหลัก"],
      userCount: 2
    },
    {
      id: "2",
      name: "เจ้าหน้าที่งบประมาณ",
      description: "จัดการงบประมาณและการจัดสรร",
      permissions: ["จัดการงบประมาณ", "อนุมัติการจัดสรร", "ดูรายงานงบประมาณ"],
      userCount: 5
    },
    {
      id: "3",
      name: "หัวหน้าหน่วยงาน",
      description: "จัดการงบประมาณของหน่วยงาน",
      permissions: ["ส่งคำของบประมาณ", "ดูรายงานหน่วยงาน", "อนุมัติในหน่วยงาน"],
      userCount: 15
    },
    {
      id: "4",
      name: "ผู้ใช้งานทั่วไป",
      description: "ดูข้อมูลและรายงานพื้นฐาน",
      permissions: ["ดูข้อมูลงบประมาณ", "ดูรายงานพื้นฐาน"],
      userCount: 25
    }
  ];

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="gap-1">
        <UserCheck className="h-3 w-3" />
        ใช้งาน
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <UserX className="h-3 w-3" />
        ไม่ใช้งาน
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">จัดการผู้ใช้งาน</h1>
              <p className="text-muted-foreground">
                จัดการบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และบทบาทในระบบ
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    ผู้ใช้งานทั้งหมด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">บัญชีผู้ใช้</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    ใช้งานอยู่
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <p className="text-xs text-muted-foreground">บัญชีที่ใช้งาน</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserX className="h-4 w-4 text-red-600" />
                    ไม่ใช้งาน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <p className="text-xs text-muted-foreground">บัญชีที่ปิดใช้งาน</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    บทบาท
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">บทบาทในระบบ</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
                <TabsTrigger value="roles">บทบาทและสิทธิ์</TabsTrigger>
                <TabsTrigger value="activity">กิจกรรมผู้ใช้</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>รายการผู้ใช้งาน</CardTitle>
                        <CardDescription>จัดการบัญชีผู้ใช้งานในระบบ</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มผู้ใช้งาน
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ค้นหาผู้ใช้งาน..." className="pl-10" />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกบทบาท</SelectItem>
                          <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                          <SelectItem value="budget">เจ้าหน้าที่งบประมาณ</SelectItem>
                          <SelectItem value="dept">หัวหน้าหน่วยงาน</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกสถานะ</SelectItem>
                          <SelectItem value="active">ใช้งาน</SelectItem>
                          <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ชื่อผู้ใช้</TableHead>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead>หน่วยงาน</TableHead>
                          <TableHead>บทบาท</TableHead>
                          <TableHead>เข้าใช้ล่าสุด</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead className="text-right">การดำเนินการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>บทบาทและสิทธิ์</CardTitle>
                        <CardDescription>จัดการบทบาทและสิทธิ์การเข้าถึงในระบบ</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มบทบาท
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.map((role) => (
                        <Card key={role.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{role.name}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {role.description}
                                </CardDescription>
                              </div>
                              <Badge variant="secondary">{role.userCount} คน</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">สิทธิ์การเข้าถึง:</p>
                              <div className="space-y-1">
                                {role.permissions.map((permission, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">{permission}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                แก้ไข
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                ดูรายละเอียด
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>กิจกรรมผู้ใช้งาน</CardTitle>
                    <CardDescription>ติดตามกิจกรรมและการใช้งานของผู้ใช้</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          user: "นายสมชาย ผู้ดูแลระบบ",
                          action: "เข้าสู่ระบบ",
                          time: "2569-01-20 14:30:15",
                          ip: "192.168.1.100"
                        },
                        {
                          user: "นางสาวสมใส งบประมาณ",
                          action: "อนุมัติคำของบประมาณ BR-2569-001",
                          time: "2569-01-20 14:25:30",
                          ip: "192.168.1.105"
                        },
                        {
                          user: "นายสมศักดิ์ หัวหน้าฝ่าย",
                          action: "ส่งคำของบประมาณ BR-2569-005",
                          time: "2569-01-20 14:20:45",
                          ip: "192.168.1.110"
                        },
                        {
                          user: "นางสาวสมใส งบประมาณ",
                          action: "ส่งออกรายงานงบประมาณ",
                          time: "2569-01-20 14:15:20",
                          ip: "192.168.1.105"
                        }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{activity.user}</p>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{activity.time}</p>
                            <p>IP: {activity.ip}</p>
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
