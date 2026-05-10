'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // استعمال المتغير البيئي اللي قاديتي في .env.local
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // تخزين الـ Token باش نعرفو اليوزر راه مكونيكطي
        localStorage.setItem('accessToken', data.access_token);
        alert("مرحباً بك! تم تسجيل الدخول بنجاح.");
        
        // من بعد غنصاوبو هاد الصفحة
        router.push('/dashboard'); 
      } else {
        const errorData = await res.json();
        alert("خطأ: " + (errorData.message || "الإيميل أو كلمة المرور غير صحيحة"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("مشكل في الاتصال بالباكاند! تأكد أن السيرفر شغال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل معلوماتك للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                onChange={handleChange} 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}