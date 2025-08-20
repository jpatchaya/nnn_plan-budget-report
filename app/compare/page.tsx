"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Eye
} from "lucide-react";

export default function ComparePage() {

  const comparisonData = [
    {
      category: "งบบุคลากร",
      year2568: 45000000,
      year2569: 48500000,
      difference: 3500000,
      percentage: 7.78
    },
    {
      category: "งบดำเนินงาน",
      year2568: 32000000,
      year2569: 29800000,
      difference: -2200000,
      percentage: -6.88
    },
    {
      category: "งบลงทุน",
      year2568: 28000000,
      year2569: 35200000,
      difference: 7200000,
      percentage: 25.71
    },
    {
      category: "งบอุดหนุน",
      year2568: 15000000,
      year2569: 16500000,
      difference: 1500000,
      percentage: 10.00
    }
  ];

  const departmentComparison = [
    {
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      year2568: 25000000,
      year2569: 27500000,
      difference: 2500000,
      percentage: 10.00
    },
    {
      department: "สำนักอุทยานแห่งชาติ",
      year2568: 35000000,
      year2569: 32000000,
      difference: -3000000,
      percentage: -8.57
    },
    {
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      year2568: 20000000,
      year2569: 23000000,
      difference: 3000000,
      percentage: 15.00
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">เปรียบเทียบงบประมาณ</h1>
              <p className="text-muted-foreground">
                เปรียบเทียบงบประมาณระหว่างปี หน่วยงาน และหมวดหมู่
              </p>
            </div>

            {/* Comparison Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>เลือกข้อมูลเปรียบเทียบ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ปีงบประมาณที่ 1</label>
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
                    <label className="text-sm font-medium">ปีงบประมาณที่ 2</label>
                    <Select defaultValue="2569">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2568">2568</SelectItem>
                        <SelectItem value="2569">2569</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ประเภทการเปรียบเทียบ</label>
                    <Select defaultValue="category">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">ตามหมวดหมู่</SelectItem>
                        <SelectItem value="department">ตามหน่วยงาน</SelectItem>
                        <SelectItem value="project">ตามโครงการ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">การดำเนินการ</label>
                    <Button className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      เปรียบเทียบ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">งบประมาณรวม 2568</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 120.0M</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">งบประมาณรวม 2569</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿ 130.0M</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">ผลต่าง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+฿ 10.0M</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">% เปลี่ยนแปลง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+8.33%</div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>กราฟเปรียบเทียบ</CardTitle>
                    <CardDescription>เปรียบเทียบงบประมาณปี 2568 กับ 2569</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออกกราฟ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">กราฟเปรียบเทียบงบประมาณ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ตารางเปรียบเทียบตามหมวดหมู่</CardTitle>
                    <CardDescription>รายละเอียดการเปรียบเทียบงบประมาณ</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออก Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>หมวดหมู่</TableHead>
                      <TableHead className="text-right">ปี 2568</TableHead>
                      <TableHead className="text-right">ปี 2569</TableHead>
                      <TableHead className="text-right">ผลต่าง</TableHead>
                      <TableHead className="text-right">% เปลี่ยนแปลง</TableHead>
                      <TableHead className="text-center">แนวโน้ม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">
                          ฿ {(item.year2568 / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-right">
                          ฿ {(item.year2569 / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className={`text-right ${
                          item.difference >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.difference >= 0 ? '+' : ''}฿ {(item.difference / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className={`text-right ${
                          item.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.percentage >= 0 ? '+' : ''}{item.percentage.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-center">
                          {item.percentage >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Department Comparison */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>เปรียบเทียบตามหน่วยงาน</CardTitle>
                <CardDescription>งบประมาณของหน่วยงานต่างๆ</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>หน่วยงาน</TableHead>
                      <TableHead className="text-right">ปี 2568</TableHead>
                      <TableHead className="text-right">ปี 2569</TableHead>
                      <TableHead className="text-right">ผลต่าง</TableHead>
                      <TableHead className="text-right">% เปลี่ยนแปลง</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentComparison.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.department}</TableCell>
                        <TableCell className="text-right">
                          ฿ {(item.year2568 / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-right">
                          ฿ {(item.year2569 / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className={`text-right ${
                          item.difference >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.difference >= 0 ? '+' : ''}฿ {(item.difference / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className={`text-right ${
                          item.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.percentage >= 0 ? '+' : ''}{item.percentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
    </DashboardLayout>
  );
}
