'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // تأكد من تنصيب هاد الكومبوننت

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT', // القيمة الافتراضية
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const error = await res.json();
        alert(error.message || "فشل التسجيل");
      }
    } catch (err) {
      console.error("خطأ:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-center">اختر نوع حسابك وانضم إلى أستادي</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* اختيار الدور - الجزء الجديد */}
            <div className="flex flex-col space-y-2 py-2">
              <Label className="text-right mb-2">أنا أريد التسجيل كـ:</Label>
              <RadioGroup 
                defaultValue="STUDENT" 
                onValueChange={(value) => setFormData({...formData, role: value})}
                className="flex justify-center gap-4"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="TEACHER" id="teacher" />
                  <Label htmlFor="teacher" className="cursor-pointer font-bold text-blue-700">أستاذ</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="STUDENT" id="student" />
                  <Label htmlFor="student" className="cursor-pointer font-bold text-green-700">تلميذ</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الشخصي</Label>
                <Input id="firstName" placeholder="محمد" required 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم العائلي</Label>
                <Input id="lastName" placeholder="العلمي" required 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="name@example.com" required 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة السر</Label>
              <Input id="password" type="password" required 
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">إنشاء الحساب</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}