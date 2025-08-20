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
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
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
  TrendingUp,
  Users,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function WorkPlanPage() {
  const [selectedYear, setSelectedYear] = useState("2569");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [calendarView, setCalendarView] = useState("monthly");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1)); // February 2025

  // Mock data for work plans
  const workPlans = [
    {
      id: "WP-2569-001",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      fiscalYear: "2569",
      totalBudget: 15750000,
      status: "approved",
      activities: 12,
      completedActivities: 8,
      progress: 67,
      startDate: "2568-10-01",
      endDate: "2569-09-30",
      lastUpdated: "2568-12-15"
    },
    {
      id: "WP-2569-002", 
      department: "สำนักอุทยานแห่งชาติ",
      fiscalYear: "2569",
      totalBudget: 28900000,
      status: "in_progress",
      activities: 18,
      completedActivities: 12,
      progress: 67,
      startDate: "2568-10-01",
      endDate: "2569-09-30",
      lastUpdated: "2568-12-10"
    },
    {
      id: "WP-2569-003",
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      fiscalYear: "2569", 
      totalBudget: 12300000,
      status: "pending_approval",
      activities: 8,
      completedActivities: 3,
      progress: 38,
      startDate: "2568-10-01",
      endDate: "2569-09-30",
      lastUpdated: "2568-12-05"
    }
  ];

  // Mock data for calendar activities
  const calendarActivities = [
    {
      id: 1,
      title: "การสำรวจพื้นที่อนุรักษ์",
      department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
      date: "2025-02-15",
      budget: 500000,
      status: "scheduled",
      type: "survey"
    },
    {
      id: 2,
      title: "โครงการฟื้นฟูป่าไผ่",
      department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
      date: "2025-02-20",
      budget: 1200000,
      status: "in_progress",
      type: "restoration"
    },
    {
      id: 3,
      title: "การตรวจสอบคุณภาพน้ำ",
      department: "สำนักอุทยานแห่งชาติ",
      date: "2025-02-25",
      budget: 300000,
      status: "completed",
      type: "monitoring"
    }
  ];

  // Mock data for budget distribution
  const budgetDistribution = [
    { month: "ต.ค.", planned: 8500000, actual: 8200000 },
    { month: "พ.ย.", planned: 9200000, actual: 9100000 },
    { month: "ธ.ค.", planned: 7800000, actual: 7600000 },
    { month: "ม.ค.", planned: 10500000, actual: 10200000 },
    { month: "ก.พ.", planned: 9800000, actual: 0 },
    { month: "มี.ค.", planned: 11200000, actual: 0 }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: "อนุมัติแล้ว", variant: "default" as const, icon: CheckCircle },
      in_progress: { label: "ดำเนินการ", variant: "outline" as const, icon: Clock },
      pending_approval: { label: "รออนุมัติ", variant: "secondary" as const, icon: AlertCircle },
      completed: { label: "เสร็จสิ้น", variant: "default" as const, icon: CheckCircle },
      scheduled: { label: "กำหนดการ", variant: "outline" as const, icon: Calendar }
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

  const renderCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayActivities = calendarActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === current.toDateString();
      });
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        activities: dayActivities
      });
      
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-muted-foreground bg-muted">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] p-1 border border-border ${
              day.isCurrentMonth ? 'bg-background' : 'bg-muted/50'
            }`}
          >
            <div className={`text-sm ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
              {day.date.getDate()}
            </div>
            <div className="space-y-1 mt-1">
              {day.activities.map(activity => (
                <div
                  key={activity.id}
                  className={`text-xs p-1 rounded text-white truncate ${
                    activity.type === 'survey' ? 'bg-blue-500' :
                    activity.type === 'restoration' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}
                  title={activity.title}
                >
                  {activity.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <DashboardLayout>
      {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">แผนปฏิบัติงาน</h1>
              <p className="text-muted-foreground">
                จัดการแผนปฏิบัติงานและติดตามความคืบหน้าการดำเนินงาน
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="calendar">ปฏิทินกิจกรรม</TabsTrigger>
                <TabsTrigger value="budget">การกระจายงบประมาณ</TabsTrigger>
                <TabsTrigger value="timeline">ไทม์ไลน์โครงการ</TabsTrigger>
                <TabsTrigger value="approval">อนุมัติแผน</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">แผนงานทั้งหมด</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15</div>
                      <p className="text-xs text-muted-foreground">แผนงานในปี 2569</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">กิจกรรมรวม</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127</div>
                      <p className="text-xs text-muted-foreground">กิจกรรมทั้งหมด</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">ความคืบหน้า</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">67%</div>
                      <Progress value={67} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">หน่วยงานที่เข้าร่วม</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">หน่วยงาน</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Work Plans Table */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>รายการแผนปฏิบัติงาน</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          สร้างแผนใหม่
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          ส่งออก
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="ปีงบประมาณ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2569">ปีงบประมาณ 2569</SelectItem>
                          <SelectItem value="2568">ปีงบประมาณ 2568</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="หน่วยงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกหน่วยงาน</SelectItem>
                          <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                          <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                          <SelectItem value="3">สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>รหัสแผน</TableHead>
                            <TableHead>หน่วยงาน</TableHead>
                            <TableHead className="text-right">งบประมาณ (บาท)</TableHead>
                            <TableHead className="text-center">กิจกรรม</TableHead>
                            <TableHead className="text-center">ความคืบหน้า</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workPlans.map((plan) => (
                            <TableRow key={plan.id}>
                              <TableCell className="font-medium">{plan.id}</TableCell>
                              <TableCell>{plan.department}</TableCell>
                              <TableCell className="text-right">
                                {plan.totalBudget.toLocaleString('th-TH')}
                              </TableCell>
                              <TableCell className="text-center">
                                {plan.completedActivities}/{plan.activities}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center gap-2">
                                  <Progress value={plan.progress} className="flex-1" />
                                  <span className="text-sm">{plan.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(plan.status)}</TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
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

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>ปฏิทินกิจกรรม</CardTitle>
                      <div className="flex items-center gap-2">
                        <Select value={calendarView} onValueChange={setCalendarView}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">รายเดือน</SelectItem>
                            <SelectItem value="quarterly">รายไตรมาส</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          เพิ่มกิจกรรม
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-lg font-semibold">
                        {currentMonth.toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Calendar Grid */}
                    {renderCalendarGrid()}

                    {/* Legend */}
                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>การสำรวจ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>การฟื้นฟู</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>การตรวจสอบ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> 
             {/* Budget Distribution Tab */}
              <TabsContent value="budget" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>การกระจายงบประมาณรายเดือน</CardTitle>
                    <CardDescription>
                      เปรียบเทียบแผนการใช้จ่ายกับผลการเบิกจ่ายจริง
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Budget Chart Placeholder */}
                    <div className="h-64 mb-6 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">กราฟการกระจายงบประมาณ</p>
                      </div>
                    </div>

                    {/* Budget Distribution Table */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>เดือน</TableHead>
                            <TableHead className="text-right">แผนการใช้จ่าย (บาท)</TableHead>
                            <TableHead className="text-right">ผลการเบิกจ่าย (บาท)</TableHead>
                            <TableHead className="text-right">ผลต่าง (บาท)</TableHead>
                            <TableHead className="text-right">% การเบิกจ่าย</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetDistribution.map((item, index) => {
                            const difference = item.actual - item.planned;
                            const percentage = item.actual > 0 ? (item.actual / item.planned * 100) : 0;
                            
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.month}</TableCell>
                                <TableCell className="text-right">
                                  {item.planned.toLocaleString('th-TH')}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.actual > 0 ? item.actual.toLocaleString('th-TH') : '-'}
                                </TableCell>
                                <TableCell className={`text-right ${
                                  difference > 0 ? 'text-green-600' : 
                                  difference < 0 ? 'text-red-600' : ''
                                }`}>
                                  {item.actual > 0 ? 
                                    (difference >= 0 ? '+' : '') + difference.toLocaleString('th-TH') : 
                                    '-'
                                  }
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.actual > 0 ? `${percentage.toFixed(1)}%` : '-'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ไทม์ไลน์โครงการและกิจกรรม</CardTitle>
                    <CardDescription>
                      ติดตามความคืบหน้าและเหตุการณ์สำคัญของโครงการ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Timeline Filters */}
                    <div className="flex gap-4 mb-6">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="หน่วยงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกหน่วยงาน</SelectItem>
                          <SelectItem value="1">สำนักบริหารพื้นที่อนุรักษ์ที่ 1</SelectItem>
                          <SelectItem value="2">สำนักอุทยานแห่งชาติ</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="สถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกสถานะ</SelectItem>
                          <SelectItem value="scheduled">กำหนดการ</SelectItem>
                          <SelectItem value="in_progress">ดำเนินการ</SelectItem>
                          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-4">
                      {[
                        {
                          date: "2568-10-15",
                          title: "เริ่มโครงการสำรวจพื้นที่อนุรักษ์",
                          department: "สำนักบริหารพื้นที่อนุรักษ์ที่ 1",
                          status: "completed",
                          description: "เริ่มดำเนินการสำรวจพื้นที่อนุรักษ์ในเขตภาคเหนือ",
                          budget: 2500000
                        },
                        {
                          date: "2568-11-20",
                          title: "ประชุมคณะกรรมการติดตาม",
                          department: "สำนักแผนงานและสารสนเทศ",
                          status: "completed",
                          description: "ประชุมติดตามความคืบหน้าโครงการไตรมาสที่ 1",
                          budget: 0
                        },
                        {
                          date: "2568-12-10",
                          title: "โครงการฟื้นฟูป่าไผ่ ระยะที่ 1",
                          department: "สำนักฟื้นฟูและพัฒนาพื้นที่อนุรักษ์",
                          status: "in_progress",
                          description: "ดำเนินการปลูกป่าไผ่และฟื้นฟูระบบนิเวศ",
                          budget: 3200000
                        },
                        {
                          date: "2569-01-15",
                          title: "การตรวจสอบคุณภาพน้ำ",
                          department: "สำนักอุทยานแห่งชาติ",
                          status: "scheduled",
                          description: "ตรวจสอบคุณภาพน้ำในพื้นที่อุทยานแห่งชาติ",
                          budget: 800000
                        },
                        {
                          date: "2569-02-20",
                          title: "รายงานผลการดำเนินงานไตรมาสที่ 2",
                          department: "สำนักแผนงานและสารสนเทศ",
                          status: "scheduled",
                          description: "จัดทำและส่งรายงานผลการดำเนินงาน",
                          budget: 0
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 border rounded-lg">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}></div>
                            {index < 4 && <div className="w-px h-16 bg-border mt-2"></div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.department}</p>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString('th-TH')}
                                </div>
                                {item.budget > 0 && (
                                  <div className="text-sm font-medium">
                                    ₿ {item.budget.toLocaleString('th-TH')}
                                  </div>
                                )}
                                <div className="mt-1">
                                  {getStatusBadge(item.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>อนุมัติแผนปฏิบัติงาน</CardTitle>
                    <CardDescription>
                      จัดการการอนุมัติแผนปฏิบัติงานและติดตามสถานะการอนุมัติ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Approval Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">รออนุมัติ</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">5</div>
                          <p className="text-xs text-muted-foreground">แผนงาน</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">อนุมัติแล้ว</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">8</div>
                          <p className="text-xs text-muted-foreground">แผนงาน</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">ส่งคืนแก้ไข</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">2</div>
                          <p className="text-xs text-muted-foreground">แผนงาน</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Approval Workflow */}
                    <div className="space-y-4">
                      <h4 className="font-medium">ขั้นตอนการอนุมัติ</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { step: 1, title: "ส่งแผน", status: "completed", user: "หน่วยงาน" },
                          { step: 2, title: "ตรวจสอบ", status: "in_progress", user: "ผู้จัดการแผน" },
                          { step: 3, title: "อนุมัติ", status: "pending", user: "ผู้อำนวยการ" },
                          { step: 4, title: "เผยแพร่", status: "pending", user: "ระบบ" }
                        ].map((step, index) => (
                          <div key={index} className="text-center">
                            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}>
                              {step.step}
                            </div>
                            <h5 className="font-medium">{step.title}</h5>
                            <p className="text-sm text-muted-foreground">{step.user}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Approvals Table */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-4">รายการรออนุมัติ</h4>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>รหัสแผน</TableHead>
                              <TableHead>หน่วยงาน</TableHead>
                              <TableHead>วันที่ส่ง</TableHead>
                              <TableHead className="text-right">งบประมาณ (บาท)</TableHead>
                              <TableHead>ผู้อนุมัติ</TableHead>
                              <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              {
                                id: "WP-2569-004",
                                department: "สำนักป้องกันและปราบปราม",
                                submitDate: "2568-12-18",
                                budget: 18500000,
                                approver: "นายสมชาย ใจดี"
                              },
                              {
                                id: "WP-2569-005",
                                department: "สำนักวิจัยและพัฒนา",
                                submitDate: "2568-12-20",
                                budget: 12300000,
                                approver: "นางสาวมาลี รักษ์ป่า"
                              }
                            ].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.department}</TableCell>
                                <TableCell>{new Date(item.submitDate).toLocaleDateString('th-TH')}</TableCell>
                                <TableCell className="text-right">
                                  {item.budget.toLocaleString('th-TH')}
                                </TableCell>
                                <TableCell>{item.approver}</TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4 mr-1" />
                                      ดู
                                    </Button>
                                    <Button size="sm">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      อนุมัติ
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      ส่งคืน
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
    </DashboardLayout>
  );
}
