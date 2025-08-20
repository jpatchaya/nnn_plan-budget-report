"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Bell,
  TreePine,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight
} from "lucide-react";
import { 
  DashboardLayout,
  PageHeader,
  CardGrid,
  StatCard,
  Grid,
  GridItem,
  Section
} from "@/components/layout";

export default function HomePage() {
  return (
    <DashboardLayout>
      {/* Quick Stats Bar */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <Badge variant="outline" className="text-sm">
            <TreePine className="h-3 w-3 mr-1" />
            ปีงบประมาณ 2568
          </Badge>
          <div className="h-4 w-px bg-gray-300" />
          <Badge variant="secondary" className="text-sm">
            ไตรมาส 2
          </Badge>
          <div className="h-4 w-px bg-gray-300" />
          <Badge className="bg-green-600 text-sm">
            สถานะ: ดำเนินการตามแผน
          </Badge>
        </div>
      </div>

      {/* Status Cards */}
      <Section>
        <CardGrid columns={4}>
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">วงเงินงบประมาณรวม</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">฿ 125,430,000</div>
              <p className="text-xs text-muted-foreground">
                ปีงบประมาณ 2568
              </p>
              <div className="flex items-center mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500 ml-1">จากปีที่แล้ว</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผลการเบิกจ่าย</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">฿ 67,890,000</div>
              <p className="text-xs text-muted-foreground">
                54.1% ของงบประมาณ
              </p>
              <Progress value={54.1} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">คำของบประมาณ</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">24 รายการ</div>
              <p className="text-xs text-muted-foreground">
                รออนุมัติ 3 รายการ
              </p>
              <div className="flex items-center mt-2 text-xs">
                <Bell className="h-3 w-3 text-orange-600 mr-1" />
                <span className="text-orange-600">ต้องดำเนินการภายใน 7 วัน</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">โครงการที่ดำเนินการ</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">48 โครงการ</div>
              <p className="text-xs text-muted-foreground">
                เสร็จสิ้น 12 โครงการ
              </p>
              <div className="flex items-center mt-2 text-xs">
                <span className="text-green-600">● กำลังดำเนินการ 36</span>
              </div>
            </CardContent>
          </Card>
        </CardGrid>
      </Section>

      {/* Main Content Grid */}
      <Grid columns={2} className="mt-6">
        <GridItem>
          <Card>
            <CardHeader>
              <CardTitle>สถานะงบประมาณตามหน่วยงาน</CardTitle>
              <CardDescription>
                การเบิกจ่ายงบประมาณแยกตามสำนัก/กอง
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</span>
                  <span className="text-sm text-muted-foreground">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">สำนักอุทยานแห่งชาติ</span>
                  <span className="text-sm text-muted-foreground">58%</span>
                </div>
                <Progress value={58} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">สำนักป้องกัน ปราบปราม และควบคุมไฟป่า</span>
                  <span className="text-sm text-muted-foreground">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">สำนักจัดการต้นน้ำ</span>
                  <span className="text-sm text-muted-foreground">53%</span>
                </div>
                <Progress value={53} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardHeader>
              <CardTitle>กิจกรรมล่าสุด</CardTitle>
              <CardDescription>
                การดำเนินการในระบบ 24 ชั่วโมงที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">อนุมัติงบประมาณ</p>
                    <p className="text-xs text-muted-foreground">
                      โครงการฟื้นฟูป่าต้นน้ำ จำนวน 2.5 ล้านบาท
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">ส่งคำขอใหม่</p>
                    <p className="text-xs text-muted-foreground">
                      คำของบจัดซื้ออุปกรณ์ดับไฟป่า
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">5 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <ArrowLeftRight className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">โอนงบประมาณ</p>
                    <p className="text-xs text-muted-foreground">
                      จากสำนักอุทยานฯ ไปสำนักจัดการต้นน้ำ
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">เมื่อวานนี้</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">รายงานใหม่</p>
                    <p className="text-xs text-muted-foreground">
                      สรุปผลการเบิกจ่ายประจำเดือน
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 วันที่แล้ว</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>

      {/* Summary Section */}
      <Section className="mt-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle>สรุปภาพรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">อัตราการเบิกจ่าย</p>
                <p className="text-2xl font-bold text-green-700">54.1%</p>
                <p className="text-xs text-green-600">ตามเป้าหมาย</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">งบคงเหลือ</p>
                <p className="text-2xl font-bold text-blue-700">฿ 57.54M</p>
                <p className="text-xs text-gray-500">45.9% ของงบทั้งหมด</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รอการอนุมัติ</p>
                <p className="text-2xl font-bold text-orange-700">฿ 8.2M</p>
                <p className="text-xs text-orange-600">3 รายการ</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เวลาที่เหลือ</p>
                <p className="text-2xl font-bold text-purple-700">215 วัน</p>
                <p className="text-xs text-gray-500">สิ้นปีงบประมาณ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </DashboardLayout>
  );
}