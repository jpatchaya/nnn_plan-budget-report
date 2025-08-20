"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Shield,
  Database,
  Bell,
  Mail,
  Calendar,
  Download,
  Upload
} from "lucide-react";

export default function SettingsPage() {

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">ตั้งค่าระบบ</h1>
              <p className="text-muted-foreground">
                จัดการการตั้งค่าระบบ ความปลอดภัย และการกำหนดค่าต่างๆ
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">ทั่วไป</TabsTrigger>
                <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
                <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
                <TabsTrigger value="backup">สำรองข้อมูล</TabsTrigger>
                <TabsTrigger value="audit">ตรวจสอบ</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      การตั้งค่าทั่วไป
                    </CardTitle>
                    <CardDescription>
                      กำหนดค่าพื้นฐานของระบบงบประมาณ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ชื่อระบบ</Label>
                        <Input defaultValue="ระบบแผนงาน งบประมาณ และการรายงานผล" />
                      </div>
                      <div className="space-y-2">
                        <Label>ชื่อหน่วยงาน</Label>
                        <Input defaultValue="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช" />
                      </div>
                    </div>

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
                        <Label>สกุลเงิน</Label>
                        <Select defaultValue="thb">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thb">บาท (THB)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>รูปแบบวันที่</Label>
                        <Select defaultValue="thai">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thai">พ.ศ. ไทย</SelectItem>
                            <SelectItem value="gregorian">ค.ศ. สากล</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>เขตเวลา</Label>
                        <Select defaultValue="asia_bangkok">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asia_bangkok">เอเชีย/กรุงเทพฯ (UTC+7)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>การตั้งค่าเพิ่มเติม</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">เปิดใช้งานโหมดบำรุงรักษา</p>
                            <p className="text-sm text-muted-foreground">ปิดการเข้าถึงระบบชั่วคราว</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">อนุญาตการลงทะเบียนผู้ใช้ใหม่</p>
                            <p className="text-sm text-muted-foreground">ให้ผู้ใช้สร้างบัญชีใหม่ได้</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">บันทึกกิจกรรมผู้ใช้</p>
                            <p className="text-sm text-muted-foreground">เก็บประวัติการใช้งานของผู้ใช้</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกการตั้งค่า</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      ความปลอดภัย
                    </CardTitle>
                    <CardDescription>
                      กำหนดนโยบายความปลอดภัยและการเข้าถึงระบบ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>นโยบายรหัสผ่าน</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ความยาวขั้นต่ำ</Label>
                          <Input type="number" defaultValue="8" />
                        </div>
                        <div className="space-y-2">
                          <Label>อายุรหัสผ่าน (วัน)</Label>
                          <Input type="number" defaultValue="90" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">ต้องมีตัวอักษรพิมพ์ใหญ่</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">ต้องมีตัวเลข</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">ต้องมีอักขระพิเศษ</p>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>การเข้าสู่ระบบ</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>จำนวนครั้งที่ล็อกอินผิดได้</Label>
                          <Input type="number" defaultValue="5" />
                        </div>
                        <div className="space-y-2">
                          <Label>ระยะเวลาล็อกบัญชี (นาที)</Label>
                          <Input type="number" defaultValue="30" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">บังคับใช้ Two-Factor Authentication</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">จำกัดการเข้าถึงตาม IP</p>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Session และ Timeout</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Session Timeout (นาที)</Label>
                          <Input type="number" defaultValue="60" />
                        </div>
                        <div className="space-y-2">
                          <Label>Remember Me Duration (วัน)</Label>
                          <Input type="number" defaultValue="30" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกการตั้งค่า</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      การแจ้งเตือน
                    </CardTitle>
                    <CardDescription>
                      กำหนดการส่งการแจ้งเตือนและอีเมล
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>การตั้งค่าอีเมล</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SMTP Server</Label>
                          <Input defaultValue="smtp.dnp.go.th" />
                        </div>
                        <div className="space-y-2">
                          <Label>Port</Label>
                          <Input defaultValue="587" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input defaultValue="system@dnp.go.th" />
                        </div>
                        <div className="space-y-2">
                          <Label>อีเมลผู้ส่ง</Label>
                          <Input defaultValue="noreply@dnp.go.th" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>ประเภทการแจ้งเตือน</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">การส่งคำของบประมาณ</p>
                            <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อมีการส่งคำของบประมาณใหม่</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">การอนุมัติงบประมาณ</p>
                            <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อมีการอนุมัติหรือปฏิเสธ</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">การโอนงบประมาณ</p>
                            <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อมีการขอโอนงบประมาณ</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">รายงานประจำเดือน</p>
                            <p className="text-sm text-muted-foreground">ส่งรายงานสรุปประจำเดือนอัตโนมัติ</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ทดสอบการส่งอีเมล</Button>
                      <Button>บันทึกการตั้งค่า</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      สำรองข้อมูล
                    </CardTitle>
                    <CardDescription>
                      จัดการการสำรองข้อมูลและการกู้คืนระบบ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>การตั้งค่าการสำรองข้อมูลอัตโนมัติ</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ความถี่ในการสำรองข้อมูล</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">ทุกชั่วโมง</SelectItem>
                              <SelectItem value="daily">ทุกวัน</SelectItem>
                              <SelectItem value="weekly">ทุกสัปดาห์</SelectItem>
                              <SelectItem value="monthly">ทุกเดือน</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>เวลาที่สำรองข้อมูล</Label>
                          <Input type="time" defaultValue="02:00" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>จำนวนไฟล์สำรองที่เก็บไว้</Label>
                        <Input type="number" defaultValue="30" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>การสำรองข้อมูลด้วยตนเอง</Label>
                      <div className="flex gap-2">
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          สำรองข้อมูลทันที
                        </Button>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          กู้คืนข้อมูล
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>ประวัติการสำรองข้อมูล</Label>
                      <div className="space-y-2">
                        {[
                          { date: "2569-01-20 02:00", size: "125 MB", status: "สำเร็จ" },
                          { date: "2569-01-19 02:00", size: "123 MB", status: "สำเร็จ" },
                          { date: "2569-01-18 02:00", size: "121 MB", status: "สำเร็จ" }
                        ].map((backup, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">{backup.date}</p>
                              <p className="text-sm text-muted-foreground">ขนาด: {backup.size}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">{backup.status}</Badge>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกการตั้งค่า</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>การตรวจสอบและบันทึกกิจกรรม</CardTitle>
                    <CardDescription>
                      กำหนดการบันทึกและตรวจสอบกิจกรรมในระบบ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>การบันทึกกิจกรรม</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">บันทึกการเข้าสู่ระบบ</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">บันทึกการเปลี่ยนแปลงข้อมูล</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">บันทึกการส่งออกข้อมูล</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">บันทึกการเข้าถึงรายงาน</p>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>การเก็บรักษาข้อมูล</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ระยะเวลาเก็บ Log (วัน)</Label>
                          <Input type="number" defaultValue="365" />
                        </div>
                        <div className="space-y-2">
                          <Label>ขนาดไฟล์ Log สูงสุด (MB)</Label>
                          <Input type="number" defaultValue="100" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>การแจ้งเตือนความผิดปกติ</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">การเข้าถึงที่ผิดปกติ</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">การล็อกอินล้มเหลวหลายครั้ง</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">การเปลี่ยนแปลงข้อมูลสำคัญ</p>
                          <Switch defaultChecked />
                        </div>
                      </div>
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
