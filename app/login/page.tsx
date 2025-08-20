"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  TreePine,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  ChevronRight,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate login process - for mockup purposes
    setTimeout(() => {
      if (username && password) {
        router.push("/");
      } else {
        setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      }
      setLoading(false);
    }, 1000);
  };

  const handleThaIDLogin = () => {
    setLoading(true);
    // Simulate ThaID login
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://www.salika.co/wp-content/uploads/2021/03/thailand-forest-situation-3.jpg')`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/85 to-green-700/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full">
          <div>
            {/* Logo */}
            <div className="mb-16">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/95 backdrop-blur-md rounded-full shadow-2xl mb-6">
                  <Image 
                    src="/logo.png" 
                    alt="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช"
                    width={100}
                    height={100}
                    priority
                  />
                </div>
                <h1 className="text-3xl font-bold drop-shadow-lg mb-2">กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช</h1>
                <p className="text-xl text-green-50 drop-shadow font-medium">Department of National Parks, Wildlife and Plant Conservation</p>
                <div className="w-32 h-1 bg-white/30 rounded-full mt-4"></div>
              </div>
            </div>

            {/* Main Title */}
            <div className="mb-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
                โครงการพัฒนาระบบแผนงาน
                <br />งบประมาณ และการรายงานผล
              </h2>
              <p className="text-xl lg:text-2xl text-green-50 drop-shadow font-light">
                Budget Planning and Reporting System Development
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-white/20 backdrop-blur-sm rounded">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold drop-shadow">วางแผนงบประมาณอย่างมีประสิทธิภาพ</h3>
                  <p className="text-green-50 text-sm">จัดการงบประมาณแบบบูรณาการ</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-white/20 backdrop-blur-sm rounded">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold drop-shadow">ติดตามผลการใช้จ่ายแบบ Real-time</h3>
                  <p className="text-green-50 text-sm">รายงานผลทันที ตัดสินใจได้รวดเร็ว</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-white/20 backdrop-blur-sm rounded">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold drop-shadow">รักษาความปลอดภัยระดับสูง</h3>
                  <p className="text-green-50 text-sm">มาตรฐาน ISO 27001 และ CSA STAR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-green-400/30">
            <p className="text-base text-green-50 font-medium">
              © 2568 กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช
            </p>
            <p className="text-sm text-green-100 mt-1">
              Department of National Parks, Wildlife and Plant Conservation
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-full mb-4 shadow-lg">
                <Image 
                  src="/logo.png" 
                  alt="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช"
                  width={70}
                  height={70}
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช</h1>
              <p className="text-lg text-gray-600 font-medium">Department of National Parks</p>
              <div className="w-24 h-0.5 bg-green-300 rounded-full mt-3 mx-auto"></div>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">ยินดีต้อนรับ</h2>
              <p className="text-gray-600 mt-2">เข้าสู่ระบบเพื่อจัดการงบประมาณ</p>
            </div>

            {/* Security Badge */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-900">ระบบรักษาความปลอดภัยระดับสูง</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้งาน</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="กรอกชื่อผู้ใช้งาน"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    จำฉันไว้
                  </Label>
                </div>
                <Link href="#" className="text-sm text-green-600 hover:text-green-700">
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">หรือเข้าสู่ระบบด้วย</span>
              </div>
            </div>

            {/* ThaID Login Option */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-blue-50 transition-colors"
                onClick={handleThaIDLogin}
                disabled={loading}
              >
                <div className="flex items-center justify-center">
                  {/* ThaID Logo */}
                  <div className="mr-3">
                    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      {/* Blue background */}
                      <rect x="0" y="0" width="100" height="100" rx="15" fill="#1E40AF"/>
                      
                      {/* White card icon */}
                      <rect x="20" y="30" width="60" height="40" rx="5" fill="white"/>
                      
                      {/* Blue lines on card */}
                      <rect x="25" y="35" width="20" height="3" fill="#1E40AF"/>
                      <rect x="25" y="42" width="30" height="2" fill="#60A5FA"/>
                      <rect x="25" y="47" width="25" height="2" fill="#60A5FA"/>
                      <rect x="25" y="52" width="28" height="2" fill="#60A5FA"/>
                      
                      {/* Photo placeholder */}
                      <rect x="60" y="38" width="15" height="18" rx="2" fill="#DBEAFE"/>
                      <circle cx="67.5" cy="44" r="3" fill="#60A5FA"/>
                      <ellipse cx="67.5" cy="52" rx="5" ry="3" fill="#60A5FA"/>
                      
                      {/* ThaID text */}
                      <text x="50" y="85" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">ThaID</text>
                    </svg>
                  </div>
                  <span className="text-base font-medium">เข้าสู่ระบบด้วย ThaID</span>
                </div>
              </Button>
              
              <div className="text-center text-xs text-gray-500">
                ใช้บัตรประชาชนในการยืนยันตัวตน ปลอดภัยตามมาตรฐาน ก.พ.
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-6 pt-6 border-t flex justify-center space-x-4 text-sm">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                คู่มือการใช้งาน
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                ติดต่อผู้ดูแลระบบ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
