"use client";

import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Database,
  ArrowLeftRight,
  Download,
  Link as LinkIcon,
  Shield,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    category: "หลัก",
    items: [
      { icon: BarChart3, label: "Dashboard", path: "/" },
      { icon: Settings, label: "ตั้งค่าข้อมูลหลัก", path: "/master-data" },
      { icon: PieChart, label: "เปรียบเทียบงบประมาณ", path: "/compare" },
    ]
  },
  {
    category: "งบประมาณ",
    items: [
      { icon: FileText, label: "คำของบประมาณ", path: "/budget-request" },
      { icon: Calendar, label: "แผนปฏิบัติงาน", path: "/work-plan" },
      { icon: DollarSign, label: "จัดสรรกรอบวงเงิน", path: "/allocation" },
      { icon: ArrowLeftRight, label: "โอน/เปลี่ยนแปลงงบ", path: "/transfer" },
      { icon: Download, label: "นำเข้าข้อมูล พ.ร.บ.", path: "/import-budget" },
    ]
  },
  {
    category: "รายงาน",
    items: [
      { icon: TrendingUp, label: "รายงานผลการดำเนินงาน", path: "/reports" },
      { icon: Database, label: "ส่งออกข้อมูล", path: "/export" },
    ]
  },
  {
    category: "ระบบ",
    items: [
      { icon: LinkIcon, label: "เชื่อมโยง DPIS", path: "/dpis" },
      { icon: Users, label: "ผู้ใช้งานระบบ", path: "/users" },
      { icon: Shield, label: "ตั้งค่าระบบ", path: "/settings" },
    ]
  }
];

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <aside 
      id="main-navigation"
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-green-800 via-green-700 to-green-600 border-r border-green-900 transition-all duration-300 z-40 shadow-xl",
        isOpen ? "w-64" : "w-16"
      )}>
      <div className="p-4 h-full overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {isOpen && (
              <h3 className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3 opacity-80">
                {section.category}
              </h3>
            )}
            <nav className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={itemIndex}
                    href={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      isActive 
                        ? "bg-white/20 text-white shadow-md backdrop-blur-sm" 
                        : "text-green-100 hover:text-white hover:bg-white/10",
                      !isOpen && "justify-center"
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isActive ? "text-white" : "text-green-200"
                    )} />
                    {isOpen && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
        
        {/* Footer Logo */}
        {isOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">DNP</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช</p>
                  <p className="text-xs text-green-200">Department of National Parks</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}