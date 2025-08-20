"use client"

import { ReactNode, useState } from "react"
import { Sidebar } from "@/components/budget/Sidebar"
import { TopBar } from "@/components/budget/TopBar"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Auto-collapse sidebar on mobile
  if (isMobile && sidebarOpen) {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar with mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content Area */}
        <main 
          id="main-content"
          role="main"
          tabIndex={-1}
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            sidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-16",
            className
          )}
        >
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}