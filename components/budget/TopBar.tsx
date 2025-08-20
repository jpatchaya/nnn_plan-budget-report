"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Shield
} from "lucide-react";
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
  const isMobile = useMobile();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };
  
  return (
    <>
      <SkipLinks />
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50" role="banner">
        <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 relative flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">ระบบแผนงาน งบประมาณ และการรายงานผล</h1>
              <p className="text-xs text-muted-foreground">กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-semibold text-sm">แผนงานและงบประมาณ</h1>
            </div>
          </div>
        </div>

        {/* Center Section - Show on larger screens */}
        <div className="hidden lg:flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            ปีงบประมาณ 2568
          </Badge>
          <Badge variant="secondary" className="text-xs">
            ไตรมาส 2
          </Badge>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Badge - Show year on small screens */}
          {isMobile && (
            <Badge variant="outline" className="text-xs hidden xs:inline-flex">
              2568
            </Badge>
          )}
          
          {/* Accessibility Panel */}
          <AccessibilityPanel />
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-destructive text-destructive-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                <span className="text-sm font-medium">คำของบประมาณใหม่</span>
                <span className="text-xs text-muted-foreground">มีคำขอใหม่ 2 รายการรออนุมัติ</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                <span className="text-sm font-medium">การโอนงบประมาณ</span>
                <span className="text-xs text-muted-foreground">มีคำขอโอน 1 รายการ</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center w-full">
                <span className="text-sm">ดูทั้งหมด</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="ผู้ใช้งาน" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">นางสาวสมใจ ใจดี</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ผู้ดูแลระบบ
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    สำนักแผนงานและสารสนเทศ
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>ตั้งค่า</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>เปลี่ยนรหัสผ่าน</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
}